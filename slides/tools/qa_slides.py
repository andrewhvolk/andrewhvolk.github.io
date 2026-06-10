#!/usr/bin/env python3
"""Structural, traceability, review-state, and offline QA for generated decks."""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

from compile_lectures import load_manifests, validate_manifest

ROOT = Path(__file__).resolve().parents[1]
MIGRATION = ROOT / "migration"
MOJIBAKE = ("\u00c3", "\u00c2", "\u00e2", "\ufffd")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.refs: list[tuple[str, str]] = []
        self.sections: list[dict[str, str]] = []
        self.answer_targets: list[str] = []
        self.answers: dict[str, bool] = {}
        self.images_without_alt: list[str] = []
        self.classes: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        self.classes.extend((values.get("class") or "").split())
        if values.get("id"):
            self.ids.append(values["id"] or "")
        for attr in ("src", "href"):
            if values.get(attr):
                self.refs.append((attr, values[attr] or ""))
        if tag == "section":
            self.sections.append({key: value or "" for key, value in values.items()})
        if "data-answer-toggle" in values:
            self.answer_targets.append(values.get("data-answer-toggle") or "")
        if "data-answer" in values and values.get("id"):
            self.answers[values["id"] or ""] = "hidden" in values
        if tag == "img" and not (values.get("alt") or "").strip():
            self.images_without_alt.append(values.get("src") or "(unknown image)")


def parse_page(path: Path) -> tuple[str, PageParser, list[str]]:
    errors: list[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        return "", PageParser(), [f"cannot read UTF-8 page: {exc}"]
    parser = PageParser()
    parser.feed(text)
    duplicates = sorted(value for value, count in Counter(parser.ids).items() if count > 1)
    if duplicates:
        errors.append(f"duplicate ids: {', '.join(duplicates)}")
    for token in MOJIBAKE:
        if token in text:
            errors.append(f"mojibake token {token!r}")
    for attr, ref in parser.refs:
        if re.match(r"^(?:https?:)?//", ref):
            errors.append(f"external {attr}: {ref}")
            continue
        if ref.startswith(("#", "data:", "mailto:", "tel:", "javascript:")):
            continue
        local = (path.parent / ref.split("?", 1)[0].split("#", 1)[0]).resolve()
        if not local.exists():
            errors.append(f"missing local asset: {ref}")
    if parser.images_without_alt:
        errors.append(f"images missing alt text: {', '.join(parser.images_without_alt)}")
    return text, parser, errors


def check_session(path: Path, session: dict) -> list[str]:
    text, parser, errors = parse_page(path)
    expected = session["blocks"]
    if "reveal" not in parser.classes:
        errors.append("session page is missing the Reveal root")
    if len(parser.sections) != len(expected):
        errors.append(f"expected {len(expected)} slides, found {len(parser.sections)}")
    actual_ids = [section.get("data-block-id", "") for section in parser.sections]
    expected_ids = [block["id"] for block in expected]
    if actual_ids != expected_ids:
        errors.append("generated block order does not match the manifest")
    actual_components = [section.get("data-component", "") for section in parser.sections]
    expected_components = [block["component"] for block in expected]
    if actual_components != expected_components:
        errors.append("generated component sequence does not match the manifest")
    missing_titles = [str(index + 1) for index, section in enumerate(parser.sections)
                      if not section.get("data-title")]
    if missing_titles:
        errors.append(f"slides lack data-title: {', '.join(missing_titles)}")
    if re.search(r"\bcontinued\b", text, flags=re.IGNORECASE):
        errors.append("generated page contains a forbidden continued title")
    for target in parser.answer_targets:
        if target not in parser.answers:
            errors.append(f"answer target not found: {target}")
        elif not parser.answers[target]:
            errors.append(f"answer is exposed initially: {target}")
    expected_answers = sum(1 for block in expected if block.get("answer"))
    if len(parser.answer_targets) != expected_answers:
        errors.append(
            f"expected {expected_answers} answer reveals, found {len(parser.answer_targets)}"
        )
    stem = path.stem
    for generated in (
        MIGRATION / "blueprints" / f"{stem}.md",
        MIGRATION / "review-packets" / f"{stem}.md",
        MIGRATION / "rehearsals" / f"{stem}.md",
    ):
        if not generated.exists():
            errors.append(f"missing generated review artifact: {generated.relative_to(ROOT)}")
    if session["pilot"]["candidate"]:
        pilot = MIGRATION / "pilots" / f"{stem}.md"
        if not pilot.exists():
            errors.append(f"missing classroom pilot packet: {pilot.relative_to(ROOT)}")
    return errors


def check_chooser(path: Path, manifest: dict) -> list[str]:
    text, parser, errors = parse_page(path)
    if "session-chooser" not in parser.classes:
        errors.append("chooser page is missing the session-chooser root")
    if parser.sections:
        errors.append("chooser page unexpectedly contains lecture slides")
    hrefs = {ref for attr, ref in parser.refs if attr == "href"}
    for session in manifest["sessions"]:
        if session["output"] not in hrefs:
            errors.append(f"chooser does not link to {session['output']}")
    if "Legacy PDF" not in text:
        errors.append("chooser does not preserve the legacy PDF link")
    return errors


def check_coverage(manifest: dict) -> list[str]:
    deck_id = manifest["deck"]["id"]
    errors: list[str] = []
    inventory_path = MIGRATION / "inventory" / f"{deck_id}.json"
    coverage_path = MIGRATION / "coverage" / f"{deck_id}.csv"
    if not inventory_path.exists() or not coverage_path.exists():
        return ["missing inventory or coverage record"]
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    expected = [int(slide["number"]) for slide in inventory["slides"]]
    with coverage_path.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    covered = [int(row["source_slide"]) for row in rows]
    if Counter(covered) != Counter(expected):
        errors.append("coverage matrix does not account for every source slide exactly once")
    invalid = [row["source_slide"] for row in rows
               if row["disposition"] not in {"mapped", "omitted"}]
    if invalid:
        errors.append(f"invalid coverage dispositions: {', '.join(invalid)}")
    omitted_without_reason = [row["source_slide"] for row in rows
                              if row["disposition"] == "omitted" and not row["rationale"].strip()]
    if omitted_without_reason:
        errors.append(f"omissions lack rationale: {', '.join(omitted_without_reason)}")
    return errors


def check_review_status(expected_outputs: set[str]) -> list[str]:
    target = MIGRATION / "review-status.csv"
    if not target.exists():
        return ["missing review-status.csv"]
    with target.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    by_output = {row["output"]: row for row in rows}
    errors = []
    if set(by_output) != expected_outputs:
        errors.append("review-status.csv does not contain exactly one row per session output")
    for output, row in by_output.items():
        if row.get("computational_math_audit", "").strip().lower() != "yes":
            errors.append(f"{output}: computational math audit is not recorded as complete")
        for field in ("math_verified", "classroom_rehearsal", "approved"):
            if row.get(field, "").strip().lower() in {"yes", "true", "complete", "approved"}:
                errors.append(f"{output}: automated workflow must leave {field} pending")
    return errors


def main() -> int:
    failures = 0
    expected_outputs: set[str] = set()
    expected_pages: set[str] = set()
    loaded = load_manifests()
    audit_path = MIGRATION / "math-audit" / "results.json"
    if not audit_path.exists() or json.loads(audit_path.read_text(encoding="utf-8")).get("status") != "pass":
        failures += 1
        print("FAIL independent mathematical audit")
    else:
        print("PASS independent mathematical audit")
    pilot_candidates = []
    for manifest_path, manifest in loaded:
        manifest_errors = validate_manifest(manifest_path, manifest)
        if manifest_errors:
            failures += 1
            print(f"FAIL {manifest_path.name}")
            for error in manifest_errors:
                print(f"  - {error}")
            continue
        coverage_errors = check_coverage(manifest)
        if coverage_errors:
            failures += 1
            print(f"FAIL {manifest['deck']['id']} coverage")
            for error in coverage_errors:
                print(f"  - {error}")
        else:
            print(f"PASS {manifest['deck']['id']} coverage")
        for session in manifest["sessions"]:
            if session["pilot"]["candidate"]:
                pilot_candidates.append((manifest["deck"]["id"], session["output"]))
            expected_outputs.add(session["output"])
            expected_pages.add(session["output"])
            path = ROOT / session["output"]
            errors = ["generated session page is missing"] if not path.exists() else check_session(path, session)
            if errors:
                failures += 1
                print(f"FAIL {session['output']}")
                for error in errors:
                    print(f"  - {error}")
            else:
                print(f"PASS {session['output']}")
        chooser = manifest["deck"].get("chooser_output")
        if chooser:
            expected_pages.add(chooser)
            path = ROOT / chooser
            errors = ["generated chooser page is missing"] if not path.exists() else check_chooser(path, manifest)
            if errors:
                failures += 1
                print(f"FAIL {chooser}")
                for error in errors:
                    print(f"  - {error}")
            else:
                print(f"PASS {chooser}")

    actual_pages = {path.name for path in ROOT.glob("Math130Unit*.html")}
    if actual_pages != expected_pages:
        failures += 1
        print("FAIL generated page set")
        print(f"  - missing: {', '.join(sorted(expected_pages - actual_pages)) or 'none'}")
        print(f"  - unexpected: {', '.join(sorted(actual_pages - expected_pages)) or 'none'}")
    pilot_decks = [deck for deck, _ in pilot_candidates]
    if (
        sum(deck.startswith("Math130Unit2") for deck in pilot_decks) != 1
        or sum(deck.startswith("Math130Unit3") for deck in pilot_decks) != 1
    ):
        failures += 1
        print("FAIL pilot candidates must include exactly one Unit 2 and one Unit 3/Module 10 session")
    else:
        print("PASS classroom pilot candidates selected")

    review_errors = check_review_status(expected_outputs)
    if review_errors:
        failures += 1
        print("FAIL review status")
        for error in review_errors:
            print(f"  - {error}")
    else:
        print("PASS review status remains pending")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
