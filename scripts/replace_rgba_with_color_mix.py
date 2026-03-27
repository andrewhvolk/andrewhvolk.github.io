#!/usr/bin/env python3
"""Replace selected rgba() opacity colors with semantic color-mix() tokens.

OneDrive-safe write approach:
- open each file with r+ mode
- read whole contents
- seek(0), write updated text, truncate()
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re

RGBA_RULES: list[tuple[re.Pattern[str], str]] = [
    (
        re.compile(
            r"rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*(?P<a>(?:0|1|0?\.\d+))\s*\)",
            re.IGNORECASE,
        ),
        "--text-main",
    ),
    (
        re.compile(
            r"rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*(?P<a>(?:0|1|0?\.\d+))\s*\)",
            re.IGNORECASE,
        ),
        "--bg-surface",
    ),
    (
        re.compile(
            r"rgba\(\s*13\s*,\s*80\s*,\s*213\s*,\s*(?P<a>(?:0|1|0?\.\d+))\s*\)",
            re.IGNORECASE,
        ),
        "--primary-main",
    ),
    (
        re.compile(
            r"rgba\(\s*26\s*,\s*86\s*,\s*219\s*,\s*(?P<a>(?:0|1|0?\.\d+))\s*\)",
            re.IGNORECASE,
        ),
        "--primary-main",
    ),
    (
        re.compile(
            r"rgba\(\s*5\s*,\s*150\s*,\s*105\s*,\s*(?P<a>(?:0|1|0?\.\d+))\s*\)",
            re.IGNORECASE,
        ),
        "--emerald-main",
    ),
    (
        re.compile(
            r"rgba\(\s*58\s*,\s*102\s*,\s*92\s*,\s*(?P<a>(?:0|1|0?\.\d+))\s*\)",
            re.IGNORECASE,
        ),
        "--emerald-main",
    ),
]


@dataclass
class MigrationStats:
    files_modified: int = 0
    replacements_made: int = 0


def alpha_to_percent(alpha_text: str) -> int:
    alpha = float(alpha_text)
    alpha = max(0.0, min(1.0, alpha))
    return int(round(alpha * 100))


def replace_rgba_occurrences(content: str) -> tuple[str, int]:
    total_replacements = 0

    for pattern, token in RGBA_RULES:
        def repl(match: re.Match[str]) -> str:
            nonlocal total_replacements
            percent = alpha_to_percent(match.group("a"))
            total_replacements += 1
            return f"color-mix(in srgb, var({token}) {percent}%, transparent)"

        content = pattern.sub(repl, content)

    return content, total_replacements


def process_file(path: Path, stats: MigrationStats) -> None:
    with path.open("r+", encoding="utf-8") as file_obj:
        original_content = file_obj.read()
        updated_content, replacements = replace_rgba_occurrences(original_content)

        if replacements > 0 and updated_content != original_content:
            file_obj.seek(0)
            file_obj.write(updated_content)
            file_obj.truncate()
            stats.files_modified += 1
            stats.replacements_made += replacements
            print(f"Updated: {path} ({replacements} replacements)")


def main() -> None:
    repo_root = Path(".")
    stats = MigrationStats()

    files = sorted(
        p for p in repo_root.rglob("*") if p.is_file() and p.suffix.lower() in {".html", ".css"}
    )

    for file_path in files:
        process_file(file_path, stats)

    print("-" * 40)
    print(f"Files modified: {stats.files_modified}")
    print(f"Total replacements: {stats.replacements_made}")


if __name__ == "__main__":
    main()
