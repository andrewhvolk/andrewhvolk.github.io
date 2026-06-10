#!/usr/bin/env python3
"""Validate canonical lecture manifests without generating output."""

from __future__ import annotations

import sys

from compile_lectures import load_manifests, validate_manifest


def main() -> int:
    failures = 0
    for path, manifest in load_manifests():
        errors = validate_manifest(path, manifest)
        if errors:
            failures += 1
            print(f"FAIL {path.name}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {path.name}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
