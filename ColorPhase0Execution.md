# Color Migration Phase 0 — Repository-Specific Preflight

## Purpose
This document operationalizes Phase 0 from `ColorImplementationPlan.md` for this repository so implementation can start with clear scope boundaries, migration policy, and PR controls.

## Baseline Snapshot (2026-03-26)
- **Policy approval stamp:** **Approved on 2026-03-27 (UTC)** for Section 1 Phase-0 policy locks.
- Files scanned in color inventory: **65**
- Unique literal colors: **332**
- Unique referenced color tokens (`var(--*)`): **160**
- Unique token definitions with color-like values: **142**

Source of truth: `colors.md` (generated 2026-03-26 17:20 UTC).

---

## 1) Phase-0 Policy Locks (Required Before Phase 1)

These are the required decision gates from the implementation plan, pre-filled with recommended defaults.

| Decision | Final policy value | Status | Owner |
|---|---|---|---|
| Dark selector standard | `:root[data-theme="dark"]` is the migration standard; normalize later only by explicit follow-up decision | Approved | Andrew Volk |
| Compatibility alias lifecycle | Compatibility aliases remain for one full release cycle after Bucket C migration completes | Approved | Andrew Volk |
| Accessibility bar | WCAG AA is the minimum target globally; AAA is required where practical for text-heavy educational content | Approved | Andrew Volk |
| PR size cap | Max 8 files for global-shell PRs; max 3 files for standalone page PRs | Approved | Andrew Volk |
| Mandatory reviewer model | Every Bucket C PR requires 1 implementation reviewer + 1 visual QA reviewer before merge | Approved | Andrew Volk |
| Screenshot policy | Screenshot diffs are mandatory for every Bucket C page migration (light/dark and relevant states) | Approved | Andrew Volk |

---

## 2) Repository Scope Classification (A/B/C)

### Bucket A — Global system files
- `styles.css`
- `theme.js`

### Bucket B — Shared shells and low-risk inheritors

#### B1: Low-literal pages (likely global-token inheritors)
- `Taskflow.html`
- `Unit3Practice.html`
- `courses/electrical-circuits-lab-data-sheet.html`
- `courses/electrical-circuits-lab-manual.html`
- `courses/engi220.html`
- `courses/final-exam-review-guide.html`
- `courses/lab6-krules.html`
- `courses/math100.html`
- `courses/math105.html`
- `courses/math110.html`
- `courses/math114-foundations.html`
- `courses/math114.html`
- `courses/math121.html`
- `courses/phys103.html`
- `courses/physics-labs.html`
- `courses/physlab1.html`
- `courses/physlab2.html`

#### B2: No-local-literal pages (likely strong global-style dependence)
- `404.html`
- `CV.html`
- `bookings.html`
- `index.html`
- `infographic.html`
- `learn.html`
- `projects.html`
- `courses/constant-acceleration-lab-manual.html`
- `courses/data-sheet-for-electric-circuits.html`
- `courses/density-lab-manual.html`
- `courses/hookes-law-lab-manual.html`
- `courses/latent-heat-of-fusion-lab-manual.html`
- `courses/math114-final-review.html`
- `courses/math114-financial-math.html`
- `courses/math114-statistics.html`
- `courses/math114-test1.html`
- `courses/math114-test2.html`
- `courses/math114-test3.html`
- `courses/math130.html`
- `courses/measurement-lab-manual.html`
- `courses/reflection-and-refraction-lab-manual.html`
- `courses/simple-pendulum-lab-manual.html`
- `courses/sound-lab-manual.html`
- `courses/spectroscopy-lab-manual.html`

### Bucket C — Standalone themed/high-variance pages

#### C1: High-risk standalone pages (migrate one-at-a-time)
- `courses/103LUOAssignmentGuide.html`
- `courses/basic-statistical-measures.html`
- `projects/PHYS103LUO/KinematicsShortAnswer.html`
- `projects/QuestionSpinner/questionspinner.html`
- `projects/NormalDistributionGame.html`
- `130Test3.html`
- `130Test2.html`
- `chessboard.html`
- `courses/test4-formulas.html`
- `130Test1.html`
- `projects/PrayerAppV1/index.html`
- `courses/knowledgegrowth.html`
- `growth.html`

#### C2: Moderate standalone pages (after C1)
- `courses/math114Spring26Links.html`
- `courses/114-module1-summary.html`
- `courses/test3-formulas.html`
- `projects/ResearchMentorship/MathJournals.html`
- `130Test4.html`
- `employeepay.html`

---

## 3) Token Contract Table (Phase-0 Starter)

This registry is intentionally small for PR 1 and will expand as files are migrated.

| Source (token/literal pattern) | Target semantic token | Scope | Rationale |
|---|---|---|---|
| body/base text channels (`--text-color`, local text vars) | `--text-body` | Global + B + C | Consolidate body copy semantics |
| heading/strong emphasis channels | `--text-heading` | Global + B + C | Preserve hierarchy and contrast |
| muted/supporting copy channels | `--text-muted` | Global + B + C | Distinguish secondary text |
| primary action/link color channels | `--primary-base` | Global + B + C | Action/brand consistency |
| primary hover/focus action channels | `--primary-hover` | Global + B + C | Interaction-state consistency |
| card/main surfaces | `--bg-surface` | Global + B + C | Surface normalization |
| subtle strips/sections | `--bg-subtle` | Global + B + C | Secondary surface normalization |
| dividers/default borders | `--border-subtle` | Global + B + C | Border consistency |
| status success colors | `--status-success`, `--status-success-bg`, `--status-success-border` | Review/alert UIs | Keep status semantics explicit |
| status warning colors | `--status-warning`, `--status-warning-bg`, `--status-warning-border` | Review/alert UIs | Keep status semantics explicit |
| status error colors | `--status-error`, `--status-error-bg`, `--status-error-border` | Review/alert UIs | Keep status semantics explicit |
| status info colors | `--status-info`, `--status-info-bg`, `--status-info-border` | Review/alert UIs | Keep status semantics explicit |
| overlay/backdrop alpha layers | `--overlay-light`, `--overlay-medium`, `--overlay-dark` | Global + standalone modals/overlays | Preserve intentional translucency via semantic channels |

### Alias lifecycle guardrails (compatibility window)

- Compatibility aliases are **temporary** and remain available for **one full release cycle after Bucket C migration sign-off**.
- During that window, aliases must map to Tier 2 semantic channels (for example `--text-body`, `--bg-surface`, `--primary-base`) rather than directly to literals.
- No blind generic alias replacements are allowed. New or changed generic aliases (`--text`, `--bg`, `--surface`, `--border`, `--accent`) are only allowed in approved scoped bridge patterns (for example the Math 130 review layer bridge block).

---

## 4) Exception Registry Seed (Intentional Literals)

These color literals are expected to remain page-local unless later explicitly approved for semantic mapping.

| File | Expected intentional literal usage | Rationale |
|---|---|---|
| `projects/NormalDistributionGame.html` | gameplay/feedback highlights | instructional/game semantics |
| `projects/QuestionSpinner/questionspinner.html` | category wheel and playful gradients | product-specific branding and affordance |
| `projects/PHYS103LUO/KinematicsShortAnswer.html` | educational status/diagram accents | instructional meaning and cognitive grouping |
| `employeepay.html` | chart datasets (`rgb/rgba`) | data visualization clarity |
| `growth.html`, `courses/knowledgegrowth.html` | infographic palette colors | data/infographic category encoding |

---

## 5) PR Sequence and Change Budget

1. **PR 1 (Foundation-only, Bucket A):**
   - Add Tier 1 + Tier 2 + Tier 2b token architecture in `styles.css`.
   - Add compatibility aliases and bridge aliases.
   - No standalone page edits.
2. **PR 2 (Global shell migration, Bucket A + selected B):**
   - Migrate shared selectors in `styles.css`.
   - Limit to obvious shared component color substitutions.
3. **PR 3 (Legacy alias redirection):**
   - Redirect legacy aliases to semantic tokens.
   - Keep temporary compatibility window.
4. **PR 4+ (Bucket C):**
   - One high-risk standalone page per PR.
   - Required screenshot diff and light/dark/print checks per page.
5. **Final cleanup PR:**
   - Remove dead aliases when reference count is zero and all Bucket C pages are signed off.

---

## 6) Required Per-PR Checks

- Re-run inventory and attach before/after excerpt from `colors.md`.
- Confirm no new generic alias collisions (`--text`, `--bg`, `--surface`, `--border`, `--accent`) outside approved mapping.
- Confirm no unapproved new literal status colors.
- Confirm print and forced-colors support still present where applicable.
- For Bucket C PRs: include side-by-side screenshot diffs.

---

## 7) Review Intake Log (Phase 0)

- Latest commit reviewed before edits: `a50037f` (merge of PR #183) via `git log -1 --oneline` on 2026-03-27.
- PR discussion and inline comment review attempted via `gh pr status`; GitHub CLI is not available in this environment (`gh: command not found`).
- Because PR discussion tooling is unavailable here, outstanding inline comments cannot be verified in this environment; scope remained locked to documentation updates only.
- Current scope lock for this turn: **Phase 0 docs only**.

---

## 8) Ready-to-Start Criteria for Phase 1

Phase 1 can start when all conditions below are true:
1. Policy lock table in Section 1 is approved.
2. Bucket table in Section 2 is approved.
3. Token contract starter in Section 3 is approved.
4. Exception seed list in Section 4 is approved.

### Checkpoint (2026-03-27, UTC)
> **Owner:** Andrew Volk  
> **Ready-to-Start Criteria for Phase 1:** **Satisfied** (Sections 1–4 approved).  
> **Execution active:** **PR 2/3 lane** (global shell migration + legacy alias redirection sequence).
