#!/usr/bin/env python3
"""Replace specific legacy named colors with semantic CSS variables.

Strict safety design:
- Only scans CSS declarations in `.css` files.
- In `.html` files, only scans:
  - `<style>...</style>` blocks
  - inline `style="..."` attributes
  - SVG color attributes (`fill`, `stroke`, `stop-color`, `flood-color`, `lighting-color`, `color`, `bgcolor`)
- Only updates color-bearing properties/attributes.
- Never scans class names, IDs, text nodes, file paths, or arbitrary HTML attributes.
"""

from __future__ import annotations

from dataclasses import dataclass
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

REPLACEMENTS = {
    "green": "var(--emerald-main)",
    "red": "var(--danger-main)",
    "white": "var(--bg-surface)",
    "black": "var(--text-main)",
    "gray": "var(--text-muted)",
    "purple": "var(--primary-main)",
    "blue": "var(--primary-main)",
}

PAT_DECL = re.compile(r"([a-zA-Z-]+)(\s*:\s*)([^;}{]+)")
PAT_STYLE_BLOCK = re.compile(r"<style\b[^>]*>(.*?)</style>", re.IGNORECASE | re.DOTALL)
PAT_INLINE_STYLE = re.compile(r"(\bstyle\s*=\s*)([\"\'])(.*?)(\2)", re.IGNORECASE | re.DOTALL)
PAT_SVG_ATTR = re.compile(
    r"\b(fill|stroke|stop-color|flood-color|lighting-color|color|bgcolor)(\s*=\s*)([\"\'])(.*?)\3",
    re.IGNORECASE | re.DOTALL,
)

# Strict whole-word named-color matcher (won't match class names like green-card)
PAT_NAMED_COLORS = re.compile(r"(?<![-\w])(green|red|white|black|gray|purple|blue)(?![-\w])", re.IGNORECASE)


@dataclass
class Stats:
    files_modified: int = 0
    replacements: int = 0


def is_color_property(prop_name: str) -> bool:
    prop = prop_name.lower().strip()
    if prop in COLOR_PROPERTIES:
        return True
    if prop.startswith("background-"):
        return True
    if prop.startswith("border-") and prop.endswith("color"):
        return True
    return False


def replace_named_colors_in_value(value: str) -> tuple[str, int]:
    count = 0

    def sub_fn(match: re.Match[str]) -> str:
        nonlocal count
        key = match.group(1).lower()
        if key in REPLACEMENTS:
            count += 1
            return REPLACEMENTS[key]
        return match.group(0)

    updated = PAT_NAMED_COLORS.sub(sub_fn, value)
    return updated, count


def replace_in_css_declarations(css_text: str) -> tuple[str, int]:
    total = 0

    def sub_decl(match: re.Match[str]) -> str:
        nonlocal total
        prop, sep, value = match.group(1), match.group(2), match.group(3)
        if not is_color_property(prop):
            return match.group(0)

        new_value, replaced = replace_named_colors_in_value(value)
        total += replaced
        return f"{prop}{sep}{new_value}"

    updated = PAT_DECL.sub(sub_decl, css_text)
    return updated, total


def process_file(path: Path, stats: Stats) -> None:
    original = path.read_text(encoding="utf-8", errors="ignore")
    content = original
    replacements_in_file = 0

    if path.suffix.lower() == ".css":
        content, replacements_in_file = replace_in_css_declarations(content)
    else:
        def style_block_sub(match: re.Match[str]) -> str:
            nonlocal replacements_in_file
            block = match.group(1)
            replaced_block, count = replace_in_css_declarations(block)
            replacements_in_file += count
            return match.group(0).replace(block, replaced_block, 1)

        content = PAT_STYLE_BLOCK.sub(style_block_sub, content)

        def inline_style_sub(match: re.Match[str]) -> str:
            nonlocal replacements_in_file
            prefix, quote, style_value, _ = match.groups()
            replaced_style, count = replace_in_css_declarations(style_value)
            replacements_in_file += count
            return f"{prefix}{quote}{replaced_style}{quote}"

        content = PAT_INLINE_STYLE.sub(inline_style_sub, content)

        def svg_attr_sub(match: re.Match[str]) -> str:
            nonlocal replacements_in_file
            attr_name, sep, quote, value = match.groups()
            if attr_name.lower() not in SVG_COLOR_ATTRS:
                return match.group(0)

            replaced_value, count = replace_named_colors_in_value(value)
            if count == 0:
                return match.group(0)
            replacements_in_file += count
            return f"{attr_name}{sep}{quote}{replaced_value}{quote}"

        content = PAT_SVG_ATTR.sub(svg_attr_sub, content)

    if content != original and replacements_in_file > 0:
        path.write_text(content, encoding="utf-8")
        stats.files_modified += 1
        stats.replacements += replacements_in_file
        print(f"Updated: {path} ({replacements_in_file} replacements)")


def main() -> None:
    repo_root = Path(".")
    files = [p for p in repo_root.rglob("*") if p.is_file() and p.suffix.lower() in {".html", ".css"}]

    stats = Stats()
    for path in files:
        process_file(path, stats)

    print("-" * 40)
    print(f"Files modified: {stats.files_modified}")
    print(f"Named-color replacements: {stats.replacements}")


if __name__ == "__main__":
    main()
