#!/usr/bin/env python3
"""Consolidate near-duplicate soft color-mix expressions into semantic tokens.

OneDrive-safe write strategy: r+ read/write with seek(0) + truncate().
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re

IN_SRGB_PATTERN = r"(?:in\s*srgb|insrgb)"

PATTERNS = [
    (
        re.compile(
            rf"color-mix\(\s*{IN_SRGB_PATTERN}\s*,\s*var\(--emerald-main\)\s*(?P<pct>\d{{1,3}})\s*%\s*,\s*transparent\s*\)",
            re.IGNORECASE,
        ),
        4,
        22,
        "var(--emerald-soft)",
    ),
    (
        re.compile(
            rf"color-mix\(\s*{IN_SRGB_PATTERN}\s*,\s*var\(--danger-main\)\s*(?P<pct>\d{{1,3}})\s*%\s*,\s*transparent\s*\)",
            re.IGNORECASE,
        ),
        10,
        22,
        "var(--danger-soft)",
    ),
    (
        re.compile(
            rf"color-mix\(\s*{IN_SRGB_PATTERN}\s*,\s*var\(--primary-main\)\s*(?P<pct>\d{{1,3}})\s*%\s*,\s*transparent\s*\)",
            re.IGNORECASE,
        ),
        2,
        30,
        "var(--primary-soft)",
    ),
    (
        re.compile(
            rf"color-mix\(\s*{IN_SRGB_PATTERN}\s*,\s*var\(--border-subtle\)\s*(?P<pct>\d{{1,3}})\s*%\s*,\s*transparent\s*\)",
            re.IGNORECASE,
        ),
        60,
        85,
        "var(--border-transparent)",
    ),
]

PROTECTED_DECL_PATTERN = re.compile(
    r"--(?:emerald-soft|danger-soft|primary-soft|border-transparent)\s*:\s*[^;]+;",
    re.IGNORECASE,
)


@dataclass
class Stats:
    files_modified: int = 0
    replacements: int = 0


def consolidate_content(content: str) -> tuple[str, int]:
    total = 0
    protected_blocks: list[str] = []

    def _protect(match: re.Match[str]) -> str:
        protected_blocks.append(match.group(0))
        return f"__SOFT_TOKEN_PROTECTED_{len(protected_blocks)-1}__"

    updated = PROTECTED_DECL_PATTERN.sub(_protect, content)

    for pattern, low, high, replacement in PATTERNS:
        def _sub(match: re.Match[str]) -> str:
            nonlocal total
            pct = int(match.group("pct"))
            if low <= pct <= high:
                total += 1
                return replacement
            return match.group(0)

        updated = pattern.sub(_sub, updated)

    for idx, block in enumerate(protected_blocks):
        updated = updated.replace(f"__SOFT_TOKEN_PROTECTED_{idx}__", block)

    return updated, total


def process_file(path: Path, stats: Stats) -> None:
    with path.open("r+", encoding="utf-8") as file_obj:
        original = file_obj.read()
        updated, count = consolidate_content(original)

        if count > 0 and updated != original:
            file_obj.seek(0)
            file_obj.write(updated)
            file_obj.truncate()
            stats.files_modified += 1
            stats.replacements += count
            print(f"Updated: {path} ({count} replacements)")


def main() -> None:
    stats = Stats()
    files = sorted(
        p for p in Path('.').rglob('*') if p.is_file() and p.suffix.lower() in {'.html', '.css'}
    )
    for path in files:
        process_file(path, stats)

    print('-' * 40)
    print(f"Files modified: {stats.files_modified}")
    print(f"Total replacements: {stats.replacements}")


if __name__ == '__main__':
    main()
