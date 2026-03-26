# Color Migration Phase 0 — Scope Guardrails (Docs Baseline)

## Intent
This document is intentionally limited to **verifiable process guardrails** for future color migration work. It does **not** classify files into migration buckets and does **not** assign speculative risk labels.

## Baseline Snapshot (2026-03-26)
- Files scanned in color inventory: **65**
- Unique literal colors: **332**
- Unique referenced color tokens (`var(--*)`): **160**
- Unique token definitions with color-like values: **142**

Source of truth: `colors.md` (generated 2026-03-26 17:20 UTC).

## Phase-0 Policy Locks (to be explicitly approved)

| Decision | Proposed default | Status | Owner |
|---|---|---|---|
| Dark selector standard | `:root[data-theme="dark"]` during migration; normalize later if needed | Proposed | Site maintainer |
| Compatibility alias lifecycle | Keep for one full release cycle after legacy aliases are fully redirected | Proposed | Site maintainer |
| Accessibility bar | WCAG AA minimum globally; AAA target for text-heavy educational content where practical | Proposed | Site maintainer |
| PR size cap | Max 8 files for global-shell PRs; max 3 files for standalone PRs | Proposed | Site maintainer |
| Visual QA sign-off | 1 implementation reviewer + 1 visual QA reviewer for each standalone page migration PR | Proposed | Site maintainer |
| Screenshot diff policy | Required for every standalone page migration PR | Proposed | Site maintainer |

## Phase Boundary
- **Phase 0 output**: approved policies, approved checks, and updated inventory snapshots.
- **Not included in Phase 0**: page bucket classifications, migration sequencing by page, or permanent exception lists without implementation evidence.

## Required Per-PR Checks
- Re-run inventory and attach before/after excerpt from `colors.md`.
- Confirm no new generic alias collisions (`--text`, `--bg`, `--surface`, `--border`, `--accent`) outside approved mapping.
- Confirm no unapproved new literal status colors.
- Confirm print and forced-colors support still present where applicable.
- For visible UI changes: include light/dark screenshots.

## Ready-to-Start Criteria for Phase 1
Phase 1 can start when all conditions below are true:
1. Policy lock table is approved.
2. Required checks are approved.
3. Current inventory snapshot is acknowledged as baseline.
