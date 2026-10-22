"""Check that course due dates kept in two places still agree.

MATH 130 dates live in _data/math130.yml (the course page) and in the
math130CanvasDueDates list in theme.js (the "Next deadline" banner on the unit
review pages). Every date in one must appear in the other. When this check
fails, update both files so they list the same due dates.
"""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

# (data file, script file, name of the JavaScript array of [isoDate, label, text] rows)
PAIRS = [
    ("_data/math130.yml", "theme.js", "math130CanvasDueDates"),
]

DATA_DATE_RE = re.compile(r"\bdate:\s*['\"]?(\d{4}-\d{2}-\d{2})")
JS_DATE_RE = re.compile(r"\[\s*['\"](\d{4}-\d{2}-\d{2})T")


def data_dates(path: Path) -> set[str]:
    return set(DATA_DATE_RE.findall(path.read_text(encoding="utf-8")))


def script_dates(path: Path, array_name: str) -> set[str]:
    text = path.read_text(encoding="utf-8")
    start = text.find(f"const {array_name} = [")
    if start < 0:
        raise SystemExit(f"{path.name}: could not find {array_name}")
    end = text.find("\n];", start)
    return set(JS_DATE_RE.findall(text[start:end]))


def main() -> int:
    failed = False
    for data_rel, script_rel, array_name in PAIRS:
        in_data = data_dates(ROOT / data_rel)
        in_script = script_dates(ROOT / script_rel, array_name)
        only_data = sorted(in_data - in_script)
        only_script = sorted(in_script - in_data)
        if only_data or only_script:
            failed = True
            print(f"{data_rel} and {script_rel} ({array_name}) disagree:")
            for day in only_data:
                print(f"- {day} is in {data_rel} but not in {array_name}")
            for day in only_script:
                print(f"- {day} is in {array_name} but not in {data_rel}")
        else:
            print(f"{data_rel} and {array_name}: {len(in_data)} due dates match.")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
