# Color Architecture Implementation Plan

This document defines a **safe, incremental strategy** for migrating Prof. Volk's Office from scattered literal colors/tokens to a unified semantic color system that supports light mode, dark mode, accessibility, and page-level exceptions.

> Baseline inventory (from `colors.md`): 65 files, 332 unique literal colors, 160 referenced color tokens.

---

## 1) Migration Goals and Guardrails

### Primary goals
- Establish a stable semantic token foundation for shared UI surfaces.
- Reduce hardcoded literals and duplicate tokens where safe.
- Preserve readability and interaction contrast in both light and dark modes.
- Avoid regressions in standalone pages, print styles, charts/graphics, and forced-colors mode.

### Guardrails (must-follow)
1. **No repo-wide blind find/replace.**
2. **Semantic-first mapping** for shared components; preserve local semantics where needed.
3. **Status colors are first-class** (success/warning/error/info), not forced into primary/neutral.
4. **Alpha flattening is selective**, not global.
5. **Every phase is reversible** (small commits, visual QA per phase).

---

## 2) Scope Model: Classify Files Before Editing

Before implementation, classify each file into one of these buckets:

### A) Global system files
- `styles.css`
- `theme.js` (only if theme hooks/selectors need updates)

### B) Shared page shells (inherit global design strongly)
- Landing/site pages and course shells that mostly depend on `styles.css` tokens.

### C) Standalone themed experiences (high local styling)
Examples from current inventory:
- `courses/103LUOAssignmentGuide.html`
- `projects/QuestionSpinner/questionspinner.html`
- `projects/PHYS103LUO/KinematicsShortAnswer.html`
- Math review pages with local aliases (`130Test1.html`, `130Test2.html`, `130Test3.html`, `130Test4.html`)
- Utility/game pages such as `chessboard.html`

**Policy:** Finish A + selected B first. Handle C with file-specific mappings and explicit visual approval.

---

## 3) Target Token Architecture

### Tier 1: Palette tokens (base values)
Use your proposed Parchment / Emerald / Ink primitives.

### Tier 2: Semantic UI tokens (required)
Keep your planned semantic tokens and add missing channels:

- Surfaces: `--bg-body`, `--bg-surface`, `--bg-subtle`, `--bg-inverse`
- Text: `--text-heading`, `--text-body`, `--text-muted`, `--text-on-primary`
- Brand/action: `--primary-base`, `--primary-hover`, `--primary-surface`, `--primary-text`
- Borders/overlays: `--border-subtle`, `--border-base`, `--overlay-light|medium|dark`

### Tier 2b: Status semantic tokens (new, required)
Add explicit status tokens before migration of review/alert components:

- Success: `--status-success`, `--status-success-bg`, `--status-success-border`
- Warning: `--status-warning`, `--status-warning-bg`, `--status-warning-border`
- Error: `--status-error`, `--status-error-bg`, `--status-error-border`
- Info: `--status-info`, `--status-info-bg`, `--status-info-border`

### Tier 3: Component aliases (optional but recommended)
For complex domains (e.g., Math review pages), keep local aliases that point to Tier 2/Tier 2b values.

---

## 4) Replacement Rules (Revised)

## 4.1 Literal mapping (safe defaults)
Use your mapping table as a baseline, but apply by **context**, not raw string replacement.

- Borders/dividers → `var(--border-subtle)`
- Body text → `var(--text-body)`
- Heading/strong text → `var(--text-heading)`
- Secondary backgrounds → `var(--bg-subtle)`
- Main/card surfaces → `var(--bg-surface)`
- Text on primary buttons → `var(--text-on-primary)`
- Brand actions/links → `var(--primary-base)`

## 4.2 Opacity/rgba migration (selective)
Do **not** remove all `rgba()` usage. Categorize first:

1. **Backdrop and dim layers**: normalize to overlay tokens.
2. **Shadows/elevation**: normalize repeated values to a small elevation token set.
3. **Decorative gradients / atmospheric layers**: preserve or refactor carefully; do not flatten by default.
4. **State badges and subtle status backgrounds**: migrate to status semantic bg/border tokens.

## 4.3 Token consolidation (context-aware)
Legacy tokens can be redirected, but avoid blind replacement for generic names:

- `--text`, `--bg`, `--surface`, `--border`, `--accent`

These names are heavily reused in local scopes and can collide. Replace only with selector-aware edits.

---

## 5) Step-by-Step Execution Plan

### Phase 0 — Preflight (required)
1. Re-run inventory script and snapshot counts (`colors.md` update).
2. Build file classification table (A/B/C buckets).
3. Define acceptance criteria (contrast checks, dark-mode pass, no print regressions).
4. Add a **token contract table** (old token/literal → new semantic token + scope + owner).
5. Freeze migration conventions before coding:
   - selector standard (`:root[data-theme="dark"]` vs `[data-theme="dark"]`)
   - status token names and required channels
   - what counts as “intentional literal” (charts/brand/teaching highlights)
6. Set PR sizing limits and QA sign-off roles up front (global vs standalone owners).

### Phase 1 — Foundation in `styles.css`
1. Introduce new Tier 1 + Tier 2 + Tier 2b tokens.
2. Keep existing legacy tokens temporarily as compatibility aliases.
3. Add dark theme semantic swaps for all required channels.
4. Preserve `@media (forced-colors: active)` support.
5. Add **dual-alias bridge tokens** for existing local ecosystems (review/math shells) so old aliases resolve through new semantics.
6. Keep selector compatibility during rollout (support existing selector style until explicit cutover phase).

### Phase 2 — Global shell migration
1. Migrate shared global selectors in `styles.css` (body, headings, buttons, cards, nav, form controls).
2. Replace obvious literals in shared components only.
3. Validate dark mode + focus states + hover states.
4. Treat overlay/gradient/shadow values as a separate migration lane; do not batch with base color swaps.

### Phase 3 — Legacy token redirection
1. Redirect legacy aliases in `styles.css` to new semantics.
2. Keep local page aliases where they serve component boundaries.
3. Remove dead/unreferenced tokens only after usage verification.
4. Add temporary lint/check rule: fail CI if direct replacements target generic aliases (`--text`, `--bg`, `--surface`, `--border`, `--accent`) outside an approved mapping file.
5. Introduce deprecation windows:
   - Window A: aliases exist + warnings
   - Window B: aliases exist only for standalone buckets not yet migrated
   - Window C: aliases removed when reference count is zero

### Phase 4 — Standalone page migrations (bucket C)
Per file:
1. Identify local semantic model (if any).
2. Map local semantics to global Tier 2/Tier 2b where possible.
3. Keep intentional, domain-specific colors (charts, pedagogical highlights, branded graphics) when necessary.
4. Run file-level visual QA in light/dark/print.
5. Require side-by-side screenshot diffs for each migrated standalone file before merge.
6. Migrate highest-risk pages one-at-a-time (not in multi-page bundles).

### Phase 5 — Final cleanup
1. Remove deprecated token definitions once references are zero.
2. Re-run inventory and compare before/after counts.
3. Document remaining intentional literals (exceptions list).

---

## 6) QA Checklist (Run After Each Phase)

- Light mode readability and hierarchy are preserved.
- Dark mode token swaps produce adequate contrast.
- Focus rings remain visible.
- Status UI (success/warning/error/info) remains semantically distinct.
- Charts/SVG/Canvas visuals remain interpretable.
- `forced-colors` mode still works.
- Print styles remain legible and intentional.
- Dark selector behavior verified on both theme load paths:
  - initial load from saved theme
  - initial load from system preference
- Compatibility alias map still resolves correctly for review/page-local scopes.
- Screenshot diff reviewed for every changed standalone page.

### Required automated checks per PR
- Token inventory delta script run and attached (`colors.md` before/after excerpt).
- Search check confirms no net increase in generic alias collisions.
- Search check confirms no unapproved new literal status colors.
- Search check confirms forced-colors and print blocks are still present in migrated files.

---

## 7) Risks and Mitigations

1. **Risk:** Semantic drift from blind replacement.  
   **Mitigation:** selector-aware and file-class-aware migrations only.

2. **Risk:** Flat UI due to alpha removal.  
   **Mitigation:** preserve decorative/elevation alpha where purposeful.

3. **Risk:** Status colors collapse into primary/neutral.  
   **Mitigation:** introduce Tier 2b status tokens before component migration.

4. **Risk:** Standalone page regressions.  
   **Mitigation:** bucket C handled independently with visual checkpoints.

5. **Risk:** Accessibility/print regressions.  
   **Mitigation:** explicit forced-colors and print QA gates in every phase.

---

## 8) Questions That Must Be Answered Before Implementation

### Design and product questions
1. Which pages are considered part of the shared site system vs intentionally standalone experiences?
2. Are there any brand-locked colors that must remain literal (logos, partner pages, course-specific themes)?
3. Is the goal strict visual parity, or is minor visual evolution acceptable if accessibility improves?

### Technical questions
4. Do we want to preserve current local alias layers (`--accent`, `--text`, etc.) for standalone pages, or fully standardize them?
5. Should we maintain compatibility aliases indefinitely or remove in a follow-up deprecation release?
6. Are we standardizing on `:root[data-theme="dark"]` (current style) or `[data-theme="dark"]` consistently across all files?

### Accessibility and compliance questions
7. What contrast threshold is required (minimum WCAG AA everywhere, or AAA for specific surfaces)?
8. Which print pages are mission-critical and must preserve exact output?
9. Are forced-colors users part of supported audience requirements (must-pass vs best-effort)?

### Process and rollout questions
10. What is the maximum acceptable PR size (files changed per PR)?
11. Who signs off visual QA for bucket C pages?
12. Do we require screenshot diffs for each migrated file/section before merge?

### Must-decide policy answers (recommended defaults)
13. **Selector standard:** keep `:root[data-theme="dark"]` as canonical during migration; only consider `[data-theme="dark"]` in a dedicated post-migration normalization pass.
14. **Compatibility aliases:** keep for at least one release cycle after bucket C completion, then remove via explicit deprecation PR.
15. **Contrast requirement:** WCAG AA minimum for all UI surfaces; AAA target for body text-heavy educational content where practical.
16. **PR size cap:** max 8 files for global-shell PRs and max 3 files for standalone PRs.
17. **Sign-off model:** one implementation reviewer + one visual QA reviewer for every bucket C PR.

---

## 9) Suggested PR Sequence

1. PR 1: Add new token architecture + compatibility aliases + no visual changes intended.
2. PR 2: Migrate shared global shell in `styles.css`.
3. PR 3: Migrate review-shell bridge tokens and verify local alias compatibility (`--text`, `--bg`, etc.) without visual regressions.
4. PR 4+: Migrate standalone pages one-by-one (highest-risk first) with screenshot diffs.
5. Final PR: remove dead aliases/tokens, close deprecation window, and update implementation docs.

This sequencing reduces blast radius and makes regressions easier to identify and revert.

---

## 10) Execution Controls to Prevent Regressions (New)

1. **Change budget per PR**
   - Do not combine global token architecture changes with standalone page migrations in the same PR.
   - Keep each PR to a single migration concern (foundation, shell, aliasing, or one standalone page).

2. **Mapping registry**
   - Maintain a living mapping table in the PR description or companion doc:
     - source token/literal
     - target semantic token
     - affected selectors/files
     - rationale (surface/text/status/overlay)

3. **Exception registry**
   - Maintain a tracked list of intentional literals (charts, brand marks, instructional highlights).
   - Every intentional literal must include a brief reason and owning page/component.

4. **Rollback strategy**
   - Every PR must include explicit rollback notes (which token redirects or selectors can be reverted independently).
   - Avoid “all-or-nothing” edits across unrelated files.

5. **Completion gates**
   - No cleanup/deletion PR is allowed until:
     - alias reference count is zero
     - bucket C pages have visual sign-off
     - forced-colors + print checks are explicitly passed
