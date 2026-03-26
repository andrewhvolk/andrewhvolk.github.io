#!/usr/bin/env python3
"""Lightweight lint for stylesheet href conventions.

Checks:
1) non-canonical local stylesheet hrefs (anything local that's not /styles.css)
2) duplicate CDN variants for the same library
"""
from __future__ import annotations

import glob
import re
from collections import defaultdict
from html import unescape
from urllib.parse import urlparse

STYLESHEET_LINK_RE = re.compile(r"<link\b[^>]*\brel\s*=\s*['\"]stylesheet['\"][^>]*>", re.IGNORECASE)
HREF_RE = re.compile(r"\bhref\s*=\s*['\"]([^'\"]+)['\"]", re.IGNORECASE)


def iter_stylesheet_hrefs() -> list[tuple[str, str]]:
    results: list[tuple[str, str]] = []
    for file_path in sorted(glob.glob("**/*.html", recursive=True)):
        with open(file_path, encoding="utf-8", errors="ignore") as fh:
            text = fh.read()
        for tag in STYLESHEET_LINK_RE.findall(text):
            href_match = HREF_RE.search(tag)
            if href_match:
                results.append((file_path, unescape(href_match.group(1).strip())))
    return results


def is_local_href(href: str) -> bool:
    return not re.match(r"^(https?:|//|mailto:|tel:|data:|javascript:|#)", href, flags=re.IGNORECASE)


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
    local_non_canonical: list[tuple[str, str]] = []
    variants: dict[str, set[str]] = defaultdict(set)

    for file_path, href in iter_stylesheet_hrefs():
        href_no_hash = href.split("#", 1)[0].split("?", 1)[0]

        if is_local_href(href):
            if href_no_hash != "/styles.css":
                local_non_canonical.append((file_path, href))
            continue

        lib, variant = classify_external_variant(href)
        if lib and variant:
            variants[lib].add(variant)

    failed = False

    if local_non_canonical:
        failed = True
        print("Non-canonical local stylesheet hrefs found (expected '/styles.css'):")
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
