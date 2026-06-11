#!/usr/bin/env python3
"""Lightweight lint for stylesheet href conventions.

Checks:
1) non-canonical local stylesheet hrefs on site pages
2) duplicate CDN variants for the same library

Slide decks are standalone documents and may load stylesheets from within the
``slides`` directory.
"""
from __future__ import annotations

import re
from collections import defaultdict
from html import unescape
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED_DIRS = {".git", "node_modules"}
STYLESHEET_LINK_RE = re.compile(r"<link\b[^>]*\brel\s*=\s*['\"]stylesheet['\"][^>]*>", re.IGNORECASE)
HREF_RE = re.compile(r"\bhref\s*=\s*['\"]([^'\"]+)['\"]", re.IGNORECASE)


def iter_stylesheet_hrefs() -> list[tuple[Path, str]]:
    results: list[tuple[Path, str]] = []
    html_files = sorted(
        path
        for path in ROOT.rglob("*.html")
        if not EXCLUDED_DIRS.intersection(path.relative_to(ROOT).parts)
    )
    for file_path in html_files:
        text = file_path.read_text(encoding="utf-8", errors="ignore")
        for tag in STYLESHEET_LINK_RE.findall(text):
            href_match = HREF_RE.search(tag)
            if href_match:
                results.append((file_path.relative_to(ROOT), unescape(href_match.group(1).strip())))
    return results


def is_local_href(href: str) -> bool:
    return not re.match(r"^(https?:|//|mailto:|tel:|data:|javascript:|#)", href, flags=re.IGNORECASE)


def is_canonical_local_stylesheet(file_path: Path, href: str) -> bool:
    if href == "/styles.css":
        return True

    if not file_path.parts or file_path.parts[0] != "slides":
        return False

    resolved = (ROOT / file_path.parent / href).resolve()
    slides_root = (ROOT / "slides").resolve()
    return resolved.is_relative_to(slides_root) and resolved.is_file()


def normalize_jsdelivr(path: str) -> tuple[str | None, str | None]:
    # /npm/katex@0.16.9/dist/katex.min.css
    m = re.match(r"^/npm/([^@/]+)(?:@([^/]+))?", path)
    if not m:
        return None, None
    return m.group(1), m.group(2) or "unversioned"


def normalize_cdnjs(path: str) -> tuple[str | None, str | None]:
    # /ajax/libs/font-awesome/6.4.0/css/all.min.css
    m = re.match(r"^/ajax/libs/([^/]+)/([^/]+)", path)
    if not m:
        return None, None
    return m.group(1), m.group(2)


def classify_external_variant(href: str) -> tuple[str | None, str | None]:
    parsed = urlparse(href)
    host = parsed.netloc.lower()
    path = parsed.path

    if host == "cdn.jsdelivr.net":
        lib, version = normalize_jsdelivr(path)
        if lib:
            return lib, f"{host}:{version}"
    elif host == "cdnjs.cloudflare.com":
        lib, version = normalize_cdnjs(path)
        if lib:
            return lib, f"{host}:{version}"
    return None, None


def main() -> int:
    local_non_canonical: list[tuple[Path, str]] = []
    variants: dict[str, set[str]] = defaultdict(set)

    for file_path, href in iter_stylesheet_hrefs():
        href_no_hash = href.split("#", 1)[0].split("?", 1)[0]

        if is_local_href(href):
            if not is_canonical_local_stylesheet(file_path, href_no_hash):
                local_non_canonical.append((file_path, href))
            continue

        lib, variant = classify_external_variant(href)
        if lib and variant:
            variants[lib].add(variant)

    failed = False

    if local_non_canonical:
        failed = True
        print("Non-canonical local stylesheet hrefs found:")
        for file_path, href in local_non_canonical:
            print(f"- {file_path}: {href}")
    else:
        print("No non-canonical local stylesheet hrefs found.")

    duplicate_variants = {lib: values for lib, values in variants.items() if len(values) > 1}
    if duplicate_variants:
        failed = True
        print("\nDuplicate CDN variants detected for the same library:")
        for lib, values in sorted(duplicate_variants.items()):
            print(f"- {lib}: {', '.join(sorted(values))}")
    else:
        print("No duplicate CDN variants detected for tracked stylesheet libraries.")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
