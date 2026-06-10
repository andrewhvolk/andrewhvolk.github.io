#!/usr/bin/env python3
"""Compatibility entry point for the canonical manifest compiler."""

from compile_lectures import compile_all


if __name__ == "__main__":
    raise SystemExit(compile_all())
