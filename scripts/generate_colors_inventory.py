#!/usr/bin/env python3
"""Generate a color usage inventory for HTML/CSS sources.

Scans:
- *.css files
- <style> blocks in HTML
- inline style="..." attributes in HTML
- SVG presentation attributes (fill/stroke/stop-color/etc.) in HTML

Only counts values attached to color-bearing properties/attributes.
"""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import re

COLOR_PROPERTIES = {
    "color",
    "background",
    "background-color",
    "border",
    "border-top",
    "border-right",
    "border-bottom",
    "border-left",
    "border-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "outline",
    "outline-color",
    "box-shadow",
    "text-shadow",
    "fill",
    "stroke",
    "stop-color",
    "flood-color",
    "lighting-color",
    "column-rule",
    "column-rule-color",
    "caret-color",
    "accent-color",
    "text-decoration-color",
    "text-emphasis-color",
    "-webkit-text-fill-color",
    "-webkit-text-stroke-color",
}

SVG_COLOR_ATTRS = {
    "fill",
    "stroke",
    "stop-color",
    "flood-color",
    "lighting-color",
    "color",
    "bgcolor",
}

IGNORE_VAR_KEYWORDS = (
    "spacing",
    "radius",
    "type",
    "font",
    "width",
    "height",
    "measure",
    "line-height",
    "tracking",
    "weight",
    "duration",
    "timing",
    "z-index",
)

CSS_COLOR_KEYWORDS = {
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black",
    "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse",
    "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
    "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray",
    "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey",
    "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold",
    "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo",
    "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon",
    "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime",
    "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid",
    "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
    "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace",
    "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise",
    "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple",
    "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen",
    "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen",
    "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke",
    "yellow", "yellowgreen", "transparent", "currentcolor", "canvas", "canvastext", "highlight", "highlighttext",
    "linktext", "visitedtext", "activetext", "buttonface", "buttontext", "field", "fieldtext", "mark", "marktext",
    "graytext",
}

PAT_VAR = re.compile(r"var\(--([a-zA-Z0-9_-]+)\)", re.IGNORECASE)
PAT_HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b")
PAT_WORD = re.compile(r"\b[a-zA-Z]+\b")
PAT_DECL = re.compile(r"([a-zA-Z-]+)\s*:\s*([^;}{]+)")
PAT_STYLE_BLOCK = re.compile(r"<style\b[^>]*>(.*?)</style>", re.IGNORECASE | re.DOTALL)
PAT_INLINE_STYLE = re.compile(r"\bstyle\s*=\s*([\"\'])(.*?)\1", re.IGNORECASE | re.DOTALL)
PAT_SVG_ATTR = re.compile(
    r"\b(fill|stroke|stop-color|flood-color|lighting-color|color|bgcolor)\s*=\s*([\"\'])(.*?)\2",
    re.IGNORECASE | re.DOTALL,
)


COLOR_FUNCTIONS = (
    "rgb",
    "rgba",
    "hsl",
    "hsla",
    "hwb",
    "lab",
    "lch",
    "oklab",
    "oklch",
    "color",
    "device-cmyk",
    "color-mix",
)


def extract_color_functions(value: str) -> list[str]:
    """Extract full color function calls with balanced parentheses."""
    results: list[str] = []
    lower_value = value.lower()

    for fn_name in COLOR_FUNCTIONS:
        start = 0
        needle = f"{fn_name}("
        while True:
            idx = lower_value.find(needle, start)
            if idx == -1:
                break

            depth = 0
            end = idx
            while end < len(value):
                char = value[end]
                if char == "(":
                    depth += 1
                elif char == ")":
                    depth -= 1
                    if depth == 0:
                        end += 1
                        break
                end += 1

            if depth == 0 and end <= len(value):
                results.append(value[idx:end])
            start = idx + len(needle)

    return results


@dataclass(frozen=True)
class ColorEntry:
    value: str
    type_name: str


def is_color_property(prop_name: str) -> bool:
    prop = prop_name.lower().strip()
    if prop in COLOR_PROPERTIES:
        return True
    if prop.startswith("background-"):
        return True
    if prop.startswith("border-") and prop.endswith("color"):
        return True
    return False


def is_ignored_var(var_name: str) -> bool:
    lowered = var_name.lower()
    return any(keyword in lowered for keyword in IGNORE_VAR_KEYWORDS)


def extract_colors_from_value(value: str) -> list[ColorEntry]:
    results: list[ColorEntry] = []

    for match in PAT_VAR.finditer(value):
        var_name = match.group(1)
        if not is_ignored_var(var_name):
            results.append(ColorEntry(f"var(--{var_name.lower()})", "tokenized"))

    for match in PAT_HEX.finditer(value):
        results.append(ColorEntry(match.group(0).lower(), "literal"))

    for function_call in extract_color_functions(value):
        normalized = re.sub(r"\s+", "", function_call.lower())
        results.append(ColorEntry(normalized, "literal"))

    for match in PAT_WORD.finditer(value):
        keyword = match.group(0).lower()
        if keyword in CSS_COLOR_KEYWORDS:
            results.append(ColorEntry(keyword, "basic"))

    return results


def scan_css_declarations(css_text: str, counts: Counter[str], types: dict[str, str]) -> None:
    for prop, value in PAT_DECL.findall(css_text):
        if not is_color_property(prop):
            continue
        for entry in extract_colors_from_value(value):
            counts[entry.value] += 1
            types.setdefault(entry.value, entry.type_name)


def render_markdown(file_count: int, counts: Counter[str], types: dict[str, str]) -> str:
    rows = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    lines = [
        "# Color Usage Inventory (HTML + CSS)",
        f"_Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}_",
        "",
        "## Scope",
        f"- Files scanned (`*.html`, `*.css`): **{file_count}**",
        "- Scan sources: stylesheet files, HTML `<style>` blocks, inline `style=\"...\"` declarations, and SVG color attributes (`fill`, `stroke`, `stop-color`, etc.).",
        "- Filter: only color-bearing properties/attributes are analyzed.",
        f"- Unique color entries: **{len(rows)}**",
        "",
        "## Classification legend",
        "- **literal**: direct color values (`#hex`, `rgb()/rgba()`, `hsl()/hsla()`, `color-mix()`, etc.).",
        "- **basic**: CSS/system color keywords (`white`, `black`, `transparent`, `canvas`, etc.).",
        "- **tokenized**: CSS custom property references (`var(--token-name)`), excluding known non-color token families.",
        "",
        "## Color counts",
        "",
        "| Color | Type | Uses |",
        "|---|---|---:|",
    ]

    for value, use_count in rows:
        lines.append(f"| `{value}` | {types[value]} | {use_count} |")

    return "\n".join(lines) + "\n"


def main() -> None:
    repo_root = Path(".")
    files = [p for p in repo_root.rglob("*") if p.is_file() and p.suffix.lower() in {".css", ".html"}]

    counts: Counter[str] = Counter()
    types: dict[str, str] = {}

    for path in files:
        text = path.read_text(encoding="utf-8", errors="ignore")

        if path.suffix.lower() == ".css":
            scan_css_declarations(text, counts, types)
            continue

        for block in PAT_STYLE_BLOCK.findall(text):
            scan_css_declarations(block, counts, types)

        for _, inline_style in PAT_INLINE_STYLE.findall(text):
            scan_css_declarations(inline_style, counts, types)

        for attr_name, _, attr_value in PAT_SVG_ATTR.findall(text):
            if attr_name.lower() in SVG_COLOR_ATTRS:
                for entry in extract_colors_from_value(attr_value):
                    counts[entry.value] += 1
                    types.setdefault(entry.value, entry.type_name)

    Path("colors.md").write_text(render_markdown(len(files), counts, types), encoding="utf-8")
    print(f"Wrote colors.md with {len(counts)} unique entries across {len(files)} files")


if __name__ == "__main__":
    main()
