#!/usr/bin/env python3
"""Final cleanup for surface transparencies, legacy tokens, and stray rgba values.

Uses OneDrive-safe r+ write mode to avoid intermittent file-handle issues.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re

# 1) Consolidate surface transparencies
SURFACE_MIX_PATTERN = re.compile(
    r"color-mix\(\s*(?:in\s*srgb|insrgb)\s*,\s*var\(--bg-surface\)\s*\d{1,3}\s*%\s*,\s*transparent\s*\)",
    re.IGNORECASE,
)

# 2) Standardize legacy tokens
TOKEN_PATTERNS = [
    (re.compile(re.escape("var(--secondary-color)"), re.IGNORECASE), "var(--secondary)"),
    (re.compile(re.escape("var(--surface-container-low)"), re.IGNORECASE), "var(--bg-base)"),
    (re.compile(re.escape("var(--surface-container-lowest)"), re.IGNORECASE), "var(--bg-base)"),
]

# 3) Purge specific rogue rgba values
RGBA_PATTERNS = [
    (re.compile(r"rgba\(\s*0\s*,\s*29\s*,\s*23\s*,\s*0\.05\s*\)", re.IGNORECASE), "var(--border-transparent)"),
    (re.compile(r"rgba\(\s*0\s*,\s*29\s*,\s*23\s*,\s*0\.06\s*\)", re.IGNORECASE), "var(--border-transparent)"),
]


@dataclass
class Stats:
    files_modified: int = 0
    replacements: int = 0


def migrate_content(content: str) -> tuple[str, int]:
    total = 0
    updated = content

    updated, count = SURFACE_MIX_PATTERN.subn("var(--surface-transparent)", updated)
    total += count

    for pattern, repl in TOKEN_PATTERNS:
        updated, count = pattern.subn(repl, updated)
        total += count

    for pattern, repl in RGBA_PATTERNS:
        updated, count = pattern.subn(repl, updated)
        total += count

    return updated, total


def process_file(path: Path, stats: Stats) -> None:
    with path.open("r+", encoding="utf-8") as fh:
        original = fh.read()
        updated, count = migrate_content(original)

        if count > 0 and updated != original:
            fh.seek(0)
            fh.write(updated)
            fh.truncate()
            stats.files_modified += 1
            stats.replacements += count
            print(f"Updated: {path} ({count} replacements)")


def main() -> None:
    stats = Stats()
    files = sorted(p for p in Path('.').rglob('*') if p.is_file() and p.suffix.lower() in {'.html', '.css'})

    for path in files:
        process_file(path, stats)

    print('-' * 40)
    print(f"Files modified: {stats.files_modified}")
    print(f"Total replacements: {stats.replacements}")


if __name__ == '__main__':
    main()
