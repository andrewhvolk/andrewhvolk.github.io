"""Check local href/src references in HTML files.

Absolute site paths such as /styles.css are resolved from the repository root.
Templated JavaScript strings and Office-export support bundle references are
skipped because they are not static page links.
"""

from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [
    path
    for path in ROOT.rglob("*.html")
    if ".git" not in path.parts
    and "node_modules" not in path.parts
    and not any(part.startswith("_") for part in path.parts)
]
ATTR_RE = re.compile(r"""(?:href|src)=["']([^"']+)["']""", re.IGNORECASE)
EXTERNAL_PREFIXES = (
    "http://",
    "https://",
    "mailto:",
    "tel:",
    "javascript:",
    "data:",
    "//",
)
SKIP_EXTENSIONS = {".xml", ".thmx", ".mso", ".vml"}


def should_skip(raw: str) -> bool:
    value = raw.strip()
    if not value or value.startswith("#"):
        return True
    if any(token in value for token in ("${", "{{", "}}")):
        return True
    if value.lower().startswith(EXTERNAL_PREFIXES):
        return True
    suffix = Path(value.split("#", 1)[0].split("?", 1)[0]).suffix.lower()
    if suffix in SKIP_EXTENSIONS:
        return True
    normalized = value.replace("\\", "/")
    if normalized.startswith("legacy/") or "/legacy/" in normalized:
        return True
    return False


def resolve(page: Path, raw: str) -> Path:
    clean = unquote(raw.split("#", 1)[0].split("?", 1)[0])
    if clean.startswith("/"):
        return ROOT / clean.lstrip("/")
    return (page.parent / clean).resolve()


def main() -> int:
    missing: list[tuple[Path, str, Path]] = []
    for page in HTML_FILES:
        text = page.read_text(encoding="utf-8", errors="ignore")
        for match in ATTR_RE.finditer(text):
            raw = match.group(1)
            if should_skip(raw):
                continue
            target = resolve(page, raw)
            if not target.exists():
                missing.append((page, raw, target))

    print(f"Scanned {len(HTML_FILES)} HTML files")
    if missing:
        print("Missing local href/src targets:")
        for page, raw, target in missing:
            rel_page = page.relative_to(ROOT)
            rel_target = target if not str(target).startswith(str(ROOT)) else target.relative_to(ROOT)
            print(f"- {rel_page}: {raw} -> {rel_target}")
        return 1

    print("No missing local href/src targets found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
