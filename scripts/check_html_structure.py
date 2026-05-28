"""Catch basic missing closing tags in HTML documents."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [
    path
    for path in ROOT.rglob("*.html")
    if ".git" not in path.parts and not any(part.startswith("_") for part in path.parts)
]


def main() -> int:
    failures: list[str] = []
    for page in HTML_FILES:
        text = page.read_text(encoding="utf-8", errors="ignore").lower()
        rel = page.relative_to(ROOT)
        if "<body" in text and "</body>" not in text:
            failures.append(f"{rel}: missing </body>")
        if "<html" in text and "</html>" not in text:
            failures.append(f"{rel}: missing </html>")
        if "<footer" in text and "</footer>" not in text:
            failures.append(f"{rel}: missing </footer>")

    print(f"Scanned {len(HTML_FILES)} HTML files")
    if failures:
        print("HTML structure issues:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("No missing document/footer closing tags found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
