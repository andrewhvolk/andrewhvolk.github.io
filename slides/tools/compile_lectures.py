#!/usr/bin/env python3
"""Validate canonical lecture manifests and compile offline HTML decks."""

from __future__ import annotations

import csv
import html
import json
import math
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LECTURES = ROOT / "lectures"
MIGRATION = ROOT / "migration"
INVENTORY = MIGRATION / "inventory"

PHASES = {"activate", "explain", "model", "practice", "feedback", "synthesize"}
COMPONENTS = {
    "title", "chapter", "roadmap", "concept", "formula", "derivation",
    "diagram", "comparison", "decision", "worked-example", "practice",
    "misconception", "poll", "summary",
}
MOJIBAKE = ("\u00c3", "\u00c2", "\u00e2", "\ufffd")


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def load_manifests() -> list[tuple[Path, dict]]:
    manifests = []
    for path in sorted(LECTURES.glob("Math130Unit*.json")):
        manifests.append((path, json.loads(path.read_text(encoding="utf-8"))))
    if len(manifests) != 10:
        raise ValueError(f"Expected 10 canonical manifests, found {len(manifests)}")
    return manifests


def validate_manifest(path: Path, manifest: dict) -> list[str]:
    errors: list[str] = []
    deck = manifest.get("deck", {})
    deck_id = deck.get("id", path.stem)
    if manifest.get("version") != 1:
        errors.append("version must be 1")
    if not deck.get("canonical"):
        errors.append("deck.canonical must be true")
    if deck.get("id") != path.stem:
        errors.append("manifest filename must match deck.id")
    if not str(deck.get("source", "")).endswith(".pptx"):
        errors.append("deck.source must be a PPTX filename")

    objective_items = manifest.get("objectives", [])
    objective_ids = [item.get("id") for item in objective_items]
    if len(objective_ids) != len(set(objective_ids)):
        errors.append("objective IDs must be unique")
    objective_set = set(objective_ids)

    inventory_path = INVENTORY / f"{deck_id}.json"
    if not inventory_path.exists():
        errors.append("source inventory is missing")
        source_slides: set[int] = set()
    else:
        inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
        source_slides = {int(item["number"]) for item in inventory["slides"]}

    all_blocks: list[dict] = []
    block_ids: list[str] = []
    source_to_blocks: defaultdict[int, list[str]] = defaultdict(list)
    phase_coverage: defaultdict[str, set[str]] = defaultdict(set)
    audit_coverage: defaultdict[str, int] = defaultdict(int)
    outputs: set[str] = set()
    session_ids: set[str] = set()

    for session in manifest.get("sessions", []):
        sid = session.get("id")
        output = session.get("output")
        if not sid or sid in session_ids:
            errors.append(f"duplicate or missing session id: {sid}")
        session_ids.add(sid)
        if not output or output in outputs or not str(output).endswith(".html"):
            errors.append(f"duplicate or invalid session output: {output}")
        outputs.add(output)
        blocks = session.get("blocks", [])
        min_slides = int(session.get("min_slides", 0))
        max_slides = int(session.get("max_slides", 0))
        if not min_slides <= len(blocks) <= max_slides <= 35:
            errors.append(
                f"{sid}: {len(blocks)} slides must be within {min_slides}-{max_slides}, max 35"
            )
        required_minutes = sum(
            float(block.get("minutes", 0))
            for block in blocks if not block.get("optional", False)
        )
        if required_minutes > float(session.get("duration_minutes", 0)):
            errors.append(
                f"{sid}: required timing {required_minutes:g} exceeds "
                f"{session.get('duration_minutes')} minutes"
            )
        rehearsal = session.get("rehearsal", {})
        reserved_buffer = float(rehearsal.get("reserved_buffer_minutes", 0))
        if reserved_buffer < 5:
            errors.append(f"{sid}: rehearsal must reserve at least 5 minutes")
        if required_minutes > float(session.get("duration_minutes", 0)) - reserved_buffer:
            errors.append(f"{sid}: required timing must preserve the rehearsal buffer")
        if not math.isclose(float(rehearsal.get("planned_instruction_minutes", -1)), required_minutes):
            errors.append(f"{sid}: rehearsal planned time does not match required block timing")
        components = [block.get("component") for block in blocks]
        for index in range(len(components) - 3):
            if len(set(components[index:index + 4])) == 1:
                errors.append(f"{sid}: more than three consecutive {components[index]} layouts")
                break

        for block in blocks:
            all_blocks.append(block)
            block_id = block.get("id")
            block_ids.append(block_id)
            title = str(block.get("title", ""))
            if not block_id or not re.fullmatch(r"[a-z0-9-]+", str(block_id)):
                errors.append(f"{sid}: invalid block id {block_id!r}")
            if "continued" in title.lower():
                errors.append(f"{block_id}: generated continuation titles are forbidden")
            if block.get("phase") not in PHASES:
                errors.append(f"{block_id}: unknown phase {block.get('phase')}")
            if block.get("component") not in COMPONENTS:
                errors.append(f"{block_id}: unknown component {block.get('component')}")
            if not isinstance(block.get("content"), list) or not block.get("content"):
                errors.append(f"{block_id}: content must be a nonempty array")
            for token in MOJIBAKE:
                if token in json.dumps(block, ensure_ascii=False):
                    errors.append(f"{block_id}: mojibake token {token!r}")
            objectives = block.get("objectives", [])
            unknown = set(objectives) - objective_set
            if unknown:
                errors.append(f"{block_id}: unknown objectives {sorted(unknown)}")
            for oid in objectives:
                phase_coverage[oid].add(block.get("phase"))
            for oid in block.get("audit_checks", []):
                if oid not in objectives:
                    errors.append(f"{block_id}: audit check must reference a block objective")
                audit_coverage[oid] += 1
            if block.get("component") == "practice" and not block.get("answer"):
                errors.append(f"{block_id}: practice requires a hidden answer")
            if block.get("component") == "derivation" and len(block.get("steps", [])) < 2:
                errors.append(f"{block_id}: derivation requires at least two staged steps")
            if block.get("component") == "worked-example" and len(block.get("steps", [])) < 2:
                errors.append(f"{block_id}: worked example requires at least two staged steps")
            for asset in block.get("assets", []):
                if not asset.get("alt"):
                    errors.append(f"{block_id}: every asset requires alt text")
                target = ROOT / str(asset.get("src", ""))
                if not target.exists():
                    errors.append(f"{block_id}: missing asset {asset.get('src')}")
            for slide in block.get("source_slides", []):
                if int(slide) not in source_slides:
                    errors.append(f"{block_id}: invalid source slide {slide}")
                source_to_blocks[int(slide)].append(str(block_id))
        session_block_ids = {str(block.get("id")) for block in blocks}
        stopping_points = rehearsal.get("stopping_points", [])
        expected_checkpoints = {
            str(block.get("id"))
            for block in blocks
            if block.get("pacing_checkpoint")
        }
        actual_checkpoints = {str(item.get("after_block")) for item in stopping_points}
        if actual_checkpoints != expected_checkpoints:
            errors.append(f"{sid}: rehearsal stopping points must match pacing checkpoint blocks")
        for item in stopping_points:
            if str(item.get("after_block")) not in session_block_ids:
                errors.append(f"{sid}: stopping point references an unknown block")
            if float(item.get("planned_elapsed", -1)) < 0 or not item.get("action"):
                errors.append(f"{sid}: stopping points require elapsed time and an action")

    duplicates = [item for item, count in Counter(block_ids).items() if count > 1]
    if duplicates:
        errors.append(f"duplicate block IDs: {duplicates}")
    for oid in objective_ids:
        missing = PHASES - phase_coverage[oid]
        if missing:
            errors.append(f"{oid}: incomplete instructional cycle; missing {sorted(missing)}")
        if audit_coverage[oid] != 1:
            errors.append(f"{oid}: requires exactly one independent audit check")

    dispositions = manifest.get("source_disposition", [])
    disposition_slides = [int(item.get("slide", -1)) for item in dispositions]
    if sorted(disposition_slides) != sorted(source_slides):
        errors.append("source_disposition must account for every inventory slide exactly once")
    if len(disposition_slides) != len(set(disposition_slides)):
        errors.append("source_disposition contains duplicate slides")
    for item in dispositions:
        slide = int(item.get("slide", -1))
        if item.get("disposition") == "mapped":
            if len(source_to_blocks.get(slide, [])) != 1:
                errors.append(f"source slide {slide} must map to exactly one block")
            elif item.get("block") != source_to_blocks[slide][0]:
                errors.append(f"source slide {slide} disposition block does not match block mapping")
        elif item.get("disposition") == "omitted":
            if source_to_blocks.get(slide):
                errors.append(f"omitted source slide {slide} is also mapped")
            if not item.get("rationale"):
                errors.append(f"omitted source slide {slide} requires a rationale")
        else:
            errors.append(f"source slide {slide} has invalid disposition")
    return errors


def render_items(items: list[str], ordered: bool = False, item_class: str = "") -> str:
    if len(items) == 1:
        return f'<p class="{item_class}">{esc(items[0])}</p>'
    tag = "ol" if ordered else "ul"
    cls = f' class="{item_class}"' if item_class else ""
    return f"<{tag}{cls}>" + "".join(f"<li>{esc(item)}</li>" for item in items) + f"</{tag}>"


def render_assets(block: dict) -> str:
    assets = block.get("assets", [])
    if not assets:
        return ""
    figures = []
    for asset in assets:
        figures.append(
            f'<figure><img class="deck-image" src="{esc(asset["src"])}" '
            f'alt="{esc(asset["alt"])}"><figcaption>{esc(asset["alt"])}</figcaption></figure>'
        )
    return f'<div class="asset-grid asset-count-{len(assets)}">{"".join(figures)}</div>'


def render_table(block: dict) -> str:
    table = block.get("table")
    if not table:
        return ""
    headers = "".join(f"<th scope=\"col\">{esc(value)}</th>" for value in table["headers"])
    rows = "".join(
        "<tr>" + "".join(f"<td>{esc(value)}</td>" for value in row) + "</tr>"
        for row in table["rows"]
    )
    return f"<table><thead><tr>{headers}</tr></thead><tbody>{rows}</tbody></table>"


def answer_panel(block: dict, label: str = "Reveal solution") -> str:
    answer = block.get("answer", [])
    if not answer:
        return ""
    answer_id = f"{block['id']}-answer"
    return (
        f'<button class="answer-toggle" type="button" data-answer-toggle="{answer_id}">'
        f'{esc(label)}</button>'
        f'<div id="{answer_id}" class="solution-panel" data-answer hidden>'
        f'<span class="card-label">Feedback and solution</span>{render_items(answer)}</div>'
    )


def render_block(block: dict, session: dict, deck: dict) -> str:
    component = block["component"]
    content = block["content"]
    title = block["title"]
    source_text = ", ".join(str(item) for item in block.get("source_slides", [])) or "Authored"
    attrs = (
        f'data-title="{esc(title)}" data-block-id="{esc(block["id"])}" '
        f'data-phase="{esc(block["phase"])}" data-component="{esc(component)}" '
        f'data-objectives="{esc(" ".join(block["objectives"]))}" '
        f'data-minutes="{esc(block["minutes"])}"'
    )
    optional = '<span class="optional-badge">Optional</span>' if block.get("optional") else ""
    checkpoint = (
        '<span class="pacing-badge">Pacing checkpoint</span>'
        if block.get("pacing_checkpoint") else ""
    )
    footer = (
        f'<p class="slide-meta"><span>{esc(block["phase"].title())} · '
        f'{esc(block["minutes"])} min</span><span>Source: {esc(source_text)}</span></p>'
    )
    notes = "".join(f"<li>{esc(item)}</li>" for item in block.get("instructor_notes", []))
    notes_html = f'<aside class="notes"><ul>{notes}</ul></aside>' if notes else ""

    if component == "title":
        body = (
            f'<p class="eyebrow">MATH 130 · {esc(deck["section"])}</p>'
            f'<h1>{esc(title)}</h1><p class="subtitle">{esc(content[0])}</p>'
            f'<p class="lecture-meta">{esc(session["duration_minutes"])} minutes · Offline capable</p>'
        )
        return f'<section class="title-slide" {attrs}>{body}{notes_html}</section>'
    if component == "chapter":
        return (
            f'<section class="chapter-slide" {attrs}><p class="eyebrow">Chapter transition</p>'
            f'<h2>{esc(title)}</h2>{render_items(content)}{footer}{notes_html}</section>'
        )
    if component == "roadmap":
        cards = "".join(
            f'<li><span>{index}</span><p>{esc(item)}</p></li>'
            for index, item in enumerate(content, 1)
        )
        return (
            f'<section class="roadmap-slide" {attrs}><h2>{esc(title)}</h2>'
            f'<ol class="objective-roadmap">{cards}</ol>{footer}{notes_html}</section>'
        )

    component_label = {
        "concept": "Concept",
        "formula": "Formula focus",
        "derivation": "Derivation",
        "diagram": "Annotated diagram",
        "comparison": "Compare",
        "decision": "Decision guide",
        "worked-example": "Worked example",
        "practice": "Student practice",
        "misconception": "Error analysis",
        "poll": "Predict first",
        "summary": "Synthesis",
    }[component]
    classes = f"component-slide component-{component}"
    if block.get("optional"):
        classes += " optional-slide"

    if component == "diagram":
        body = (
            f'<div class="diagram-layout"><div class="component-card">'
            f'<span class="card-label">{component_label}</span>{render_items(content)}</div>'
            f'{render_assets(block)}</div>'
        )
    elif component == "derivation":
        steps = block.get("steps", content)
        body = (
            f'<div class="derivation-flow">'
            + "".join(
                f'<div class="derivation-step fragment"><span>{index}</span><p>{esc(step)}</p></div>'
                for index, step in enumerate(steps, 1)
            ) + "</div>"
        )
    elif component == "comparison":
        split = max(1, (len(content) + 1) // 2)
        body = (
            '<div class="comparison-grid"><div class="component-card">'
            f'{render_items(content[:split])}</div><div class="component-card">'
            f'{render_items(content[split:])}</div></div>{render_table(block)}'
        )
    elif component == "decision":
        body = (
            '<div class="decision-guide">'
            + "".join(
                f'<div><span>{index}</span><p>{esc(item)}</p></div>'
                for index, item in enumerate(content, 1)
            ) + "</div>"
        )
    elif component == "worked-example":
        steps = block.get("steps", content)
        body = (
            '<div class="worked-example"><div class="example-prompt">'
            f'{render_items(content[:1])}</div><ol class="worked-steps">'
            + "".join(f'<li class="fragment">{esc(step)}</li>' for step in steps)
            + f'</ol>{render_assets(block)}</div>'
        )
    elif component == "practice":
        body = (
            f'<div class="practice-panel"><span class="card-label">{component_label}</span>'
            f'{render_items(content, ordered=True)}{answer_panel(block)}</div>'
        )
    elif component == "misconception":
        body = (
            f'<div class="misconception-grid"><div class="warning-panel">'
            f'<span class="card-label">{component_label}</span>{render_items(content)}</div>'
            f'<div class="check-panel"><strong>Self-check</strong>'
            f'<p>What evidence confirms the setup, sign, unit, or magnitude?</p></div></div>'
        )
    elif component == "poll":
        body = (
            f'<div class="poll-panel"><span class="card-label">{component_label}</span>'
            f'{render_items(content)}<p class="poll-instruction">Commit to a response before discussion.</p>'
            f'{answer_panel(block, "Reveal discussion note")}</div>'
        )
    elif component == "formula":
        body = (
            f'<div class="formula-focus"><span class="card-label">{component_label}</span>'
            f'{render_items(content)}{render_table(block)}</div>'
        )
    elif component == "summary":
        body = (
            f'<div class="summary-grid"><div class="component-card">{render_items(content, ordered=True)}</div>'
            f'<div class="exit-card"><strong>Exit response</strong>'
            f'<p>Answer in complete mathematical sentences and identify one remaining question.</p>'
            f'{answer_panel(block, "Reveal review guidance")}</div></div>'
        )
    else:
        body = (
            f'<div class="component-card"><span class="card-label">{component_label}</span>'
            f'{render_items(content)}{render_table(block)}{render_assets(block)}</div>'
        )
    return (
        f'<section class="{classes}" {attrs}>{optional}{checkpoint}<h2>{esc(title)}</h2>'
        f'{body}{footer}{notes_html}</section>'
    )


def deck_html(manifest: dict, session: dict) -> str:
    deck = manifest["deck"]
    blocks = "\n".join(render_block(block, session, deck) for block in session["blocks"])
    metadata = {
        "id": deck["id"], "title": deck["title"], "section": deck["section"],
        "session": session["id"], "duration": session["duration_minutes"],
    }
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="MATH 130 lecture deck: {esc(session["title"])}">
  <title>MATH 130 - {esc(session["title"])}</title>
  <link rel="stylesheet" href="vendor/reveal/reset.css">
  <link rel="stylesheet" href="vendor/reveal/reveal.css">
  <link rel="stylesheet" href="framework/math130-slides.css">
  <script>window.MathJax={{tex:{{inlineMath:[['$','$'],['\\\\(','\\\\)']],displayMath:[['$$','$$'],['\\\\[','\\\\]']]}}}};</script>
  <script defer src="vendor/mathjax/tex-chtml.js"></script>
</head>
<body>
  <a class="skip-link" href="#lecture-slides">Skip to lecture slides</a>
  <div class="reveal" id="lecture-slides"><div class="slides">
{blocks}
  </div></div>
  <script src="vendor/reveal/reveal.js"></script>
  <script>window.MATH130_DECK={json.dumps(metadata, ensure_ascii=False)};</script>
  <script src="framework/math130-slides.js"></script>
</body>
</html>
"""


def chooser_html(manifest: dict) -> str:
    deck = manifest["deck"]
    cards = []
    for index, session in enumerate(manifest["sessions"], 1):
        objectives = [
            item["text"] for item in manifest["objectives"]
            if item["id"] in {
                oid for block in session["blocks"] for oid in block.get("objectives", [])
            }
        ]
        cards.append(
            f'<article class="session-card"><p class="session-number">Session {index}</p>'
            f'<h2>{esc(session["title"])}</h2><p>{esc(session["subtitle"])}</p>'
            f'<p><strong>{esc(session["duration_minutes"])} minutes · '
            f'{len(session["blocks"])} slides</strong></p>'
            f'<ul>{"".join(f"<li>{esc(item)}</li>" for item in objectives)}</ul>'
            f'<a class="session-link" href="{esc(session["output"])}">Open session {index}</a></article>'
        )
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MATH 130 - {esc(deck["title"])}</title>
  <link rel="stylesheet" href="framework/session-chooser.css">
</head>
<body>
  <main class="session-chooser">
    <p class="eyebrow">MATH 130 · {esc(deck["section"])}</p>
    <h1>{esc(deck["title"])}</h1>
    <p class="lede">This lecture is organized as two complete class meetings. Choose the session you are teaching or reviewing.</p>
    <div class="session-grid">{"".join(cards)}</div>
    <p class="legacy-note"><a href="{esc(deck["id"])}.pdf">Legacy PDF</a> remains available until instructor approval is complete.</p>
  </main>
</body>
</html>
"""


def write_coverage(manifest: dict) -> None:
    deck_id = manifest["deck"]["id"]
    block_lookup = {}
    for session in manifest["sessions"]:
        for block in session["blocks"]:
            block_lookup[block["id"]] = (session["id"], session["output"], block["title"])
    target = MIGRATION / "coverage" / f"{deck_id}.csv"
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=[
            "source_slide", "disposition", "session", "output", "block", "block_title", "rationale"
        ])
        writer.writeheader()
        for item in manifest["source_disposition"]:
            session = output = title = ""
            if item["disposition"] == "mapped":
                session, output, title = block_lookup[item["block"]]
            writer.writerow({
                "source_slide": item["slide"],
                "disposition": item["disposition"],
                "session": session,
                "output": output,
                "block": item.get("block", ""),
                "block_title": title,
                "rationale": item.get("rationale", ""),
            })


def formulas_from(block: dict) -> list[str]:
    values = block.get("content", []) + block.get("answer", []) + block.get("steps", [])
    formulas = []
    for value in values:
        formulas.extend(re.findall(r"\$([^$]+)\$", value))
    return formulas


def load_math_audit() -> dict:
    target = MIGRATION / "math-audit" / "results.json"
    if not target.exists():
        return {}
    return json.loads(target.read_text(encoding="utf-8"))


def write_review_packet(manifest: dict, session: dict, math_audit: dict) -> None:
    deck = manifest["deck"]
    objective_lookup = {item["id"]: item["text"] for item in manifest["objectives"]}
    phases: defaultdict[str, set[str]] = defaultdict(set)
    sources = []
    verification = []
    formulas = []
    assets = []
    for block in session["blocks"]:
        for oid in block["objectives"]:
            phases[oid].add(block["phase"])
        sources.extend(block["source_slides"])
        verification.extend(block.get("verification", []))
        formulas.extend(formulas_from(block))
        assets.extend(block.get("assets", []))
    total = sum(block["minutes"] for block in session["blocks"] if not block.get("optional"))
    lines = [
        f"# Review Packet: {session['title']}",
        "",
        f"- **Output:** `{session['output']}`",
        f"- **Required timing:** {total:g} of {session['duration_minutes']} minutes",
        f"- **Reserved classroom buffer:** {session['rehearsal']['reserved_buffer_minutes']:g} minutes",
        f"- **Required slides:** {len(session['blocks'])}",
        "- **Status:** Pending instructor review",
        f"- **Computational math audit:** {math_audit.get('status', 'missing').upper()}",
        "",
        "## Objective and Cycle Coverage",
        "",
        "| Objective | Activate | Explain | Model | Practice | Feedback | Synthesize |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for oid, phase_set in phases.items():
        marks = ["yes" if phase in phase_set else "NO" for phase in [
            "activate", "explain", "model", "practice", "feedback", "synthesize"
        ]]
        lines.append(f"| {objective_lookup[oid]} | " + " | ".join(marks) + " |")
    lines.extend([
        "",
        "## Source Coverage",
        "",
        f"Mapped source slides in this session: {', '.join(map(str, sorted(sources))) or 'None'}",
        "",
        "## Mathematical and Diagram Verification",
        "",
    ])
    checks = list(dict.fromkeys(verification))
    checks.extend(f"Verify formula: `${formula}`" for formula in dict.fromkeys(formulas))
    checks.extend(f"Verify diagram and alt text: {asset['alt']}" for asset in assets)
    audited_objectives = {
        oid
        for block in session["blocks"]
        for oid in block.get("audit_checks", [])
    }
    audit_results = math_audit.get("results", {})
    lines.extend(
        f"- [x] Computational audit evidence: {evidence}"
        for oid in sorted(audited_objectives)
        for evidence in audit_results.get(oid, {}).get("evidence", [])
    )
    lines.extend(f"- [ ] {item}" for item in checks or ["Review all mathematical content against the source and course conventions."])
    lines.extend([
        "",
        "## Rehearsal Plan",
        "",
        f"Planned instruction: {session['rehearsal']['planned_instruction_minutes']:g} minutes; "
        f"available flex: {session['rehearsal']['available_flex_minutes']:g} minutes.",
    ])
    for item in session["rehearsal"]["stopping_points"]:
        lines.append(
            f"- At {item['planned_elapsed']:g} minutes after `{item['after_block']}`: {item['action']}"
        )
    lines.extend([
        "",
        "## Quality Gates",
        "",
        "- [ ] Content is complete and correctly sequenced.",
        "- [ ] All mathematics, units, signs, rounding, and diagrams are independently verified.",
        "- [ ] Practice answers remain hidden until requested.",
        "- [ ] Visual hierarchy and projection readability are acceptable.",
        "- [ ] Keyboard, touch, reset, navigation, and offline behavior are verified.",
        "- [ ] Full classroom rehearsal fits the stated duration.",
        "",
        "## Review Record",
        "",
        "- **Reviewer:**",
        "- **Review date:**",
        "- **Evidence / calculations checked:**",
        "- **Defects found:**",
        "- **Corrections completed:**",
        "- **Approval:** Pending",
        "",
        "> Automated checks must not change mathematical verification, classroom rehearsal, or approval to complete.",
    ])
    target = MIGRATION / "review-packets" / f"{Path(session['output']).stem}.md"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_blueprint(manifest: dict, session: dict) -> None:
    lines = [
        f"# {session['title']} Blueprint", "",
        f"- **Output:** `{session['output']}`",
        f"- **Duration:** {session['duration_minutes']} minutes",
        f"- **Slide count:** {len(session['blocks'])}", "",
        "| # | Block | Phase | Component | Minutes | Source |",
        "|---:|---|---|---|---:|---|",
    ]
    for index, block in enumerate(session["blocks"], 1):
        source = ", ".join(map(str, block["source_slides"])) or "Authored"
        lines.append(
            f"| {index} | {block['title'].replace('|', '/')} | {block['phase']} | "
            f"{block['component']} | {block['minutes']} | {source} |"
        )
    target = MIGRATION / "blueprints" / f"{Path(session['output']).stem}.md"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_rehearsal_packet(manifest: dict, session: dict) -> None:
    rehearsal = session["rehearsal"]
    lines = [
        f"# Timed Rehearsal: {session['title']}",
        "",
        f"- **Output:** `{session['output']}`",
        f"- **Class period:** {session['duration_minutes']} minutes",
        f"- **Planned instruction:** {rehearsal['planned_instruction_minutes']:g} minutes",
        f"- **Reserved buffer:** {rehearsal['reserved_buffer_minutes']:g} minutes",
        f"- **Additional flex:** {rehearsal['available_flex_minutes'] - rehearsal['reserved_buffer_minutes']:g} minutes",
        "- **Live rehearsal status:** Pending",
        "",
        "## Run Of Show",
        "",
        "| Slide | Teaching block | Planned min | Cumulative min | Actual min | Notes |",
        "|---:|---|---:|---:|---:|---|",
    ]
    elapsed = 0.0
    for index, block in enumerate(session["blocks"], 1):
        elapsed += float(block["minutes"])
        lines.append(
            f"| {index} | {block['title'].replace('|', '/')} | {block['minutes']:g} | "
            f"{elapsed:g} |  |  |"
        )
    lines.extend(["", "## Explicit Stopping Points", ""])
    for item in rehearsal["stopping_points"]:
        lines.append(
            f"- **{item['planned_elapsed']:g} minutes, after `{item['after_block']}`:** {item['action']}"
        )
    lines.extend([
        "",
        "## Live Rehearsal Record",
        "",
        "- **Instructor:**",
        "- **Date:**",
        "- **Actual finish time:**",
        "- **Practice pauses honored:**",
        "- **Discussion overruns:**",
        "- **Slides skipped or shortened:**",
        "- **Revision needed:**",
        "- **Live rehearsal complete:** No",
    ])
    target = MIGRATION / "rehearsals" / f"{Path(session['output']).stem}.md"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_pilot_packet(manifest: dict, session: dict) -> None:
    if not session["pilot"]["candidate"]:
        return
    lines = [
        f"# Classroom Pilot: {session['title']}",
        "",
        f"- **Output:** `{session['output']}`",
        "- **Pilot status:** Pending actual classroom use",
        "- **Do not mark approved from automated evidence alone.**",
        "",
        "## Environment",
        "",
        "- [ ] Actual classroom projector and instructor computer",
        "- [ ] Network disabled or disconnected",
        "- [ ] At least one student laptop",
        "- [ ] At least one student phone or tablet",
        "- [ ] Keyboard, touch, and answer-reset behavior tested",
        "",
        "## Observation Log",
        "",
        "| Time | Slide/block | Observation | Severity | Proposed systemic fix |",
        "|---|---|---|---|---|",
        "|  |  |  |  |  |",
        "",
        "## Student Quick Feedback",
        "",
        "Ask students to rate each item from 1 (poor) to 5 (excellent):",
        "",
        "- Text and mathematics were readable.",
        "- The pace allowed time to think and practice.",
        "- Navigation and answer reveals were understandable.",
        "- Worked examples made the next practice problem possible.",
        "- The deck was useful for review after class.",
        "",
        "Open responses:",
        "",
        "- One slide or interaction that helped:",
        "- One slide or interaction that caused confusion:",
        "- One change that would improve the deck:",
        "",
        "## Pilot Decision",
        "",
        "- **Instructor:**",
        "- **Date / section:**",
        "- **Student devices represented:**",
        "- **Median readability rating:**",
        "- **Median pacing rating:**",
        "- **Defects requiring systemic changes:**",
        "- **Systemic fixes applied and retested:**",
        "- **Pilot accepted:** No",
    ]
    target = MIGRATION / "pilots" / f"{Path(session['output']).stem}.md"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")


def sync_review_status(manifests: list[dict], math_audit: dict) -> None:
    target = MIGRATION / "review-status.csv"
    previous = {}
    if target.exists():
        with target.open(encoding="utf-8", newline="") as handle:
            for row in csv.DictReader(handle):
                previous[row.get("output") or row.get("deck", "")] = row
    fields = [
        "deck", "session", "output", "content_complete", "computational_math_audit", "math_verified",
        "visual_qa", "offline_qa", "classroom_rehearsal", "approved", "notes"
    ]
    rows = []
    for manifest in manifests:
        for session in manifest["sessions"]:
            old = previous.get(session["output"], {})
            rows.append({
                "deck": manifest["deck"]["id"],
                "session": session["id"],
                "output": session["output"],
                "content_complete": old.get("content_complete", "no"),
                "computational_math_audit": "yes" if math_audit.get("status") == "pass" else "no",
                "math_verified": old.get("math_verified", "no"),
                "visual_qa": old.get("visual_qa", "no"),
                "offline_qa": old.get("offline_qa", "no"),
                "classroom_rehearsal": old.get("classroom_rehearsal", "no"),
                "approved": old.get("approved", "no"),
                "notes": old.get("notes", "Pending instructor sign-off"),
            })
    with target.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def compile_all() -> int:
    loaded = load_manifests()
    math_audit = load_math_audit()
    if math_audit.get("status") != "pass":
        print("FAIL independent mathematical audit is missing or not passing")
        return 1
    failures = 0
    manifests = []
    for path, manifest in loaded:
        errors = validate_manifest(path, manifest)
        if errors:
            failures += 1
            print(f"FAIL {path.name}")
            for error in errors:
                print(f"  - {error}")
            continue
        print(f"PASS {path.name}")
        manifests.append(manifest)
    if failures:
        return 1
    for generated_dir in (
        MIGRATION / "blueprints", MIGRATION / "review-packets",
        MIGRATION / "rehearsals", MIGRATION / "pilots"
    ):
        generated_dir.mkdir(parents=True, exist_ok=True)
        for old_file in generated_dir.glob("Math130Unit*.md"):
            old_file.unlink()
    for manifest in manifests:
        for session in manifest["sessions"]:
            (ROOT / session["output"]).write_text(deck_html(manifest, session), encoding="utf-8")
            write_review_packet(manifest, session, math_audit)
            write_blueprint(manifest, session)
            write_rehearsal_packet(manifest, session)
            write_pilot_packet(manifest, session)
            print(f"built {session['output']} ({len(session['blocks'])} slides)")
        chooser = manifest["deck"].get("chooser_output")
        if chooser:
            (ROOT / chooser).write_text(chooser_html(manifest), encoding="utf-8")
            print(f"built {chooser} (session chooser)")
        write_coverage(manifest)
    sync_review_status(manifests, math_audit)
    return 0


if __name__ == "__main__":
    sys.exit(compile_all())
