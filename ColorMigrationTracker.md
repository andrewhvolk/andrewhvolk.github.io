# Color Migration Tracker

Tracking document for Phase 1 execution based on Section 2 of `ColorPhase0Execution.md`.

## Global guidance
- Initial seeding rule: all entries start as `Not started`.
- First target for migration execution: **Bucket A**.
- **Reminder:** Bucket C high-risk files (C1) are **one-per-PR only**.
- **Per-PR evidence archive:** Record required migration QA artifacts in `ColorMigrationQALog.md` for every color migration PR.
- **Last reconciled:** `44b4ed0` on 2026-03-27 (UTC) to align tracker status with merged history through PR #182.

## Status key
- **Migration status:** `Not started` → `In progress` → `Complete`
- **PR number:** use `TBD` until a PR is opened (e.g., `#123`).
- **Visual QA status:** track each mode as `Not started`, `Pass`, or `N/A` in `light/dark/print/forced-colors` format.
- **Notes on intentional literals:** capture approved literal colors that remain by design.

## Bucket A — Global system files (First target)

| File | Bucket / sub-bucket | Migration status | PR number | Visual QA status (light/dark/print/forced-colors) | Notes on intentional literals |
|---|---|---|---|---|---|
| `styles.css` | A / Global system files | In progress | #173, #181 | Not started / Not started / Not started / Not started | Foundation token setup complete in #173; legacy alias routing and channel updates continued in #181. |
| `theme.js` | A / Global system files | Not started | TBD | Not started / Not started / Not started / Not started | Untouched as of reconciliation at `bb28136` (2026-03-27 UTC). |

## Bucket B1 — Low-literal pages

| File | Bucket / sub-bucket | Migration status | PR number | Visual QA status (light/dark/print/forced-colors) | Notes on intentional literals |
|---|---|---|---|---|---|
| `Taskflow.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `Unit3Practice.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/electrical-circuits-lab-data-sheet.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/electrical-circuits-lab-manual.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/engi220.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/final-exam-review-guide.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/lab6-krules.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math100.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math105.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math110.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math114-foundations.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math114.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math121.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/phys103.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/physics-labs.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/physlab1.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/physlab2.html` | B / B1 Low-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |

## Bucket B2 — No-local-literal pages

| File | Bucket / sub-bucket | Migration status | PR number | Visual QA status (light/dark/print/forced-colors) | Notes on intentional literals |
|---|---|---|---|---|---|
| `404.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `CV.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `bookings.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `index.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `infographic.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `learn.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `projects.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/constant-acceleration-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/data-sheet-for-electric-circuits.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/density-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/hookes-law-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/latent-heat-of-fusion-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math114-final-review.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math114-financial-math.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math114-statistics.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math114-test1.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math114-test2.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math114-test3.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/math130.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/measurement-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/reflection-and-refraction-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/simple-pendulum-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/sound-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/spectroscopy-lab-manual.html` | B / B2 No-local-literal pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |

## Bucket C1 — High-risk standalone pages (one-per-PR only)

| File | Bucket / sub-bucket | Migration status | PR number | Visual QA status (light/dark/print/forced-colors) | Notes on intentional literals |
|---|---|---|---|---|---|
| `courses/103LUOAssignmentGuide.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/basic-statistical-measures.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `projects/PHYS103LUO/KinematicsShortAnswer.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | Intentional instructional accents expected |
| `projects/QuestionSpinner/questionspinner.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | Intentional playful gradients expected |
| `projects/NormalDistributionGame.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | Intentional gameplay highlights expected |
| `130Test3.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `130Test2.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `chessboard.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/test4-formulas.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `130Test1.html` | C / C1 High-risk standalone pages | Complete | TBD | Pass / Pass / Pass / N/A | Intentional literals retained for YouTube brand red (`#ff0000`) and print-first high-contrast output (`#000/#fff`). |
| `projects/PrayerAppV1/index.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/knowledgegrowth.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | Intentional infographic palette expected |
| `growth.html` | C / C1 High-risk standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | Intentional infographic palette expected |

## Bucket C2 — Moderate standalone pages

| File | Bucket / sub-bucket | Migration status | PR number | Visual QA status (light/dark/print/forced-colors) | Notes on intentional literals |
|---|---|---|---|---|---|
| `courses/math114Spring26Links.html` | C / C2 Moderate standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/114-module1-summary.html` | C / C2 Moderate standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `courses/test3-formulas.html` | C / C2 Moderate standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `projects/ResearchMentorship/MathJournals.html` | C / C2 Moderate standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `130Test4.html` | C / C2 Moderate standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | None recorded |
| `employeepay.html` | C / C2 Moderate standalone pages | Not started | TBD | Not started / Not started / Not started / Not started | Intentional chart dataset literals expected |
