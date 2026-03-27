#!/usr/bin/env python3
"""Final pass for stray color literals and legacy color tokens.

Uses OneDrive-safe r+ write mode pattern to avoid transient file-handle issues:
read -> seek(0) -> write -> truncate.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re

HEX_REPLACEMENTS: dict[str, str] = {
    "#2c3e50": "var(--text-main)",
    "#94a3b8": "var(--text-muted)",
    "#38bdf8": "var(--primary-hover)",
    "#9b59b6": "var(--primary-main)",
    "#334155": "var(--text-main)",
    "#f9f9f9": "var(--bg-base)",
}

TOKEN_REPLACEMENTS: dict[str, str] = {
    "var(--ghost-outline)": "var(--border-subtle)",
    "var(--secondary)": "var(--bg-surface)",
    "var(--green-bg)": "color-mix(in srgb, var(--emerald-main) 10%, transparent)",
    "var(--red-bg)": "color-mix(in srgb, var(--danger-main) 10%, transparent)",
}

HEX_PATTERNS = [
    (
        re.compile(rf"(?<![0-9a-fA-F]){re.escape(source)}(?![0-9a-fA-F])", re.IGNORECASE),
        target,
    )
    for source, target in HEX_REPLACEMENTS.items()
]

TOKEN_PATTERNS = [
    (re.compile(re.escape(source), re.IGNORECASE), target)
    for source, target in TOKEN_REPLACEMENTS.items()
]


@dataclass
class Stats:
    files_modified: int = 0
    replacements_made: int = 0


def apply_replacements(content: str) -> tuple[str, int]:
    total = 0
    updated = content

    for pattern, replacement in HEX_PATTERNS:
        updated, count = pattern.subn(replacement, updated)
        total += count

    for pattern, replacement in TOKEN_PATTERNS:
        updated, count = pattern.subn(replacement, updated)
        total += count

    return updated, total


def process_file(path: Path, stats: Stats) -> None:
    with path.open("r+", encoding="utf-8") as file_obj:
        original = file_obj.read()
        updated, count = apply_replacements(original)

        if count > 0 and updated != original:
            file_obj.seek(0)
            file_obj.write(updated)
            file_obj.truncate()
            stats.files_modified += 1
            stats.replacements_made += count
            print(f"Updated: {path} ({count} replacements)")


def main() -> None:
    stats = Stats()
    files = sorted(
        path
        for path in Path(".").rglob("*")
        if path.is_file() and path.suffix.lower() in {".html", ".css"}
    )

    for file_path in files:
        process_file(file_path, stats)

    print("-" * 40)
    print(f"Files modified: {stats.files_modified}")
    print(f"Total replacements: {stats.replacements_made}")


if __name__ == "__main__":
    main()
