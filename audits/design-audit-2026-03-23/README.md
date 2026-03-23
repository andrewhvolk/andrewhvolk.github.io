# Repository Design Audit Plan and Triage
Review date: 2026-03-23
Reviewer: OpenAI GPT-5.2-Codex

## Audit setup and framework compliance
- This pass follows the large-site workflow from `DesignAudit.md`: inventory pass, fast triage pass, representative-page selection, and recommended full-audit sequence.
- The framework requires review of the same six states for each fully audited page: desktop light, desktop dark, mobile light, mobile dark, keyboard focus, and hover states.
- Fast triage was prioritized using the framework's page-type rules and non-negotiable caps: pages likely to fail hierarchy clarity, reading comfort, surface discipline, or accessibility were moved earlier in the audit queue.
- Because no browser/state-capture tool is available in this environment, this repository-level pass uses source evidence to identify where those state captures are required next. It does **not** pretend source inspection equals rendered scoring.

## 1. Audit inventory
- Total HTML pages inventoried: **59**.
- math130 family: **5** pages.
- shared-shell core: **7** pages.
- shared-shell tools: **5** pages.
- math114 family: **15** pages.
- physics/lab family: **17** pages.
- other courses: **5** pages.
- project/tool standalone: **5** pages.

## 2. Page-type classification
- Course / Lab Manual / Long-form Instruction: **42** pages.
- Marketing / Editorial: **7** pages.
- Profile / CV: **1** pages.
- Interactive Tool / Review / App-like Utility: **9** pages.

## 3. Template families
- **Shared-shell core**: homepage, learning hub, projects hub, CV, bookings, infographic, and 404 pages that use the main navigation shell, `styles.css`, and `theme.js`.
- **Shared-shell tools**: root-level interactive pages that still inherit the shared shell and shared theme behavior.
- **Math 114 family**: mostly standardized course and review pages inside the current course-shell pattern.
- **Math 130 family**: one course hub plus a distinct custom review-page subtemplate.
- **Physics/lab family**: a mix of standardized course hubs, reading-page lab manuals, and legacy outliers.
- **Other courses**: lower-volume course pages that appear to reuse the generic course/reading template.
- **Project/tool standalone**: pages that operate outside the shared shell or use separate Tailwind/inline styling systems.

## 4. Fast triage pass
- Green: **39** pages.
- Yellow: **16** pages.
- Red: **4** pages.

### Triage criteria used
- Shared-shell participation (`styles.css`, `theme.js`, top navigation, theme toggle).
- Presence of custom inline CSS/JS likely to drift from the system.
- Presence of legacy/Office-export markup.
- Presence of form controls or app-like interaction that will require keyboard/focus verification.
- Page-type mismatch risk, especially where course pages behave like apps or old documents.

### Immediate red pages
- **courses/electrical-circuits-lab-manual.html** — Inline CSS increases template drift risk; Legacy/Office-export markup likely bypasses current design system; Instruction page contains form/input controls needing interaction review.
- **courses/lab6-krules.html** — No shared stylesheet; Inline CSS increases template drift risk; Legacy/Office-export markup likely bypasses current design system; Missing shared navigation shell.
- **courses/test3-formulas.html** — No shared stylesheet; Inline CSS increases template drift risk; Missing shared navigation shell.
- **courses/test4-formulas.html** — Standalone Tailwind styling diverges from shared shell; Inline CSS increases template drift risk; Missing shared navigation shell.

### Notable yellow clusters
- **130Test1.html** — Inline CSS increases template drift risk; Custom review template outside standard course shell.
- **130Test2.html** — Inline CSS increases template drift risk; Instruction page contains form/input controls needing interaction review; Custom review template outside standard course shell.
- **130Test3.html** — Inline CSS increases template drift risk; Instruction page contains form/input controls needing interaction review; Custom review template outside standard course shell.
- **130Test4.html** — Inline CSS increases template drift risk; Custom review template outside standard course shell.
- **courses/electrical-circuits-lab-data-sheet.html** — Legacy/Office-export markup likely bypasses current design system; Instruction page contains form/input controls needing interaction review.
- **courses/hookes-law-lab-manual.html** — Missing shared navigation shell.
- **courses/latent-heat-of-fusion-lab-manual.html** — Missing shared navigation shell.
- **courses/measurement-lab-manual.html** — Missing shared navigation shell.
- **courses/reflection-and-refraction-lab-manual.html** — Missing shared navigation shell.
- **courses/simple-pendulum-lab-manual.html** — Missing shared navigation shell.
- **courses/sound-lab-manual.html** — Missing shared navigation shell.
- **courses/spectroscopy-lab-manual.html** — Missing shared navigation shell.

## 5. Representative pages selected for full audit
- **index.html** — shared-shell core / marketing-editorial baseline.
- **CV.html** — profile/CV baseline within shared shell.
- **courses/math114.html** — course-home baseline for the most standardized course family.
- **courses/math130.html** — course hub that should be compared against the custom Math 130 review subtemplate.
- **130Test2.html** — interaction-heavy Math 130 review instance with custom JS and controls.
- **courses/physics-labs.html** — physics/lab hub baseline within the shared shell.
- **courses/electrical-circuits-lab-manual.html** — highest-risk modern-shell lab page mixing long-form instructions with legacy content and inputs.
- **courses/lab6-krules.html** — legacy outlier that likely sets the lower bound for alignment.
- **Taskflow.html** — shared-shell interactive utility baseline.
- **projects/PrayerAppV1/index.html** — standalone app-like utility with independent dark-mode system.

## 6. Recommended audit sequence
1. **Shared system baseline**: `index.html`, `CV.html`, `courses/math114.html`, and `Taskflow.html` to confirm the dominant shell, profile pattern, course baseline, and shared interactive baseline.
2. **Highest-risk outliers**: `courses/lab6-krules.html` and `courses/electrical-circuits-lab-manual.html` because they are most likely to trigger non-negotiable caps for hierarchy, reading comfort, theme consistency, or accessibility.
3. **Math 130 branch**: `courses/math130.html` plus `130Test2.html` and `130Test4.html` to measure how far the custom review template diverges from the standardized course shell.
4. **Standalone utilities**: `projects/PrayerAppV1/index.html` and one simpler standalone tool such as `projects/QuestionSpinner/questionspinner.html` or `projects/NormalDistributionGame.html`.
5. **Family spot checks after fixes**: recheck one additional representative per affected family whenever shared CSS/JS changes land.

## 7. Likely shared-system risks
- **Shared theme and nav regressions can affect most standardized pages at once.** The main site shell centralizes theme selection and mobile-navigation behavior in `theme.js`, which means one regression can spread across home, course, profile, and tool pages.
- **Reading-page spacing and measure decisions are centralized.** `styles.css` defines the reading-page measure, spacing rhythm, and card surfaces used by many course and lab pages, so changes can improve or damage long-form comfort repo-wide.
- **Focus styling is uneven across standalone pages.** Shared-shell pages inherit centralized focus treatments, but custom standalone tools and custom review pages can override or omit them, creating inconsistent accessibility risk.
- **Template drift is concentrated in custom review/app pages.** Math 130 review pages and several standalone tools use inline CSS or separate utility frameworks, which increases the chance that page-specific fixes will not propagate.
- **Legacy content can bypass the design system entirely.** Office-export or legacy-image-heavy lab pages are likely to underperform on hierarchy, reading comfort, and mobile behavior even when wrapped in the modern shell.

## 8. Output structure for downstream reporting
- `page-summary.csv`: one row per page with page type, family, template family, shared-system participation, triage label, and state-review readiness.
- `issue-summary.csv`: one row per issue/risk with scope, family, category, severity, implementation layer, and recommendation.
- `family-summary.csv`: one row per template family with counts, representative samples, and dominant risks.
- This Markdown file acts as the family-level synthesis and audit-plan report.
- For future full audits, keep the canonical fields from `DesignAudit.md` and add `family`, `template_family`, `template_issue`, `page_instance_issue`, `representative_sample`, and `state_capture_complete` so Markdown page reports and CSV rows stay losslessly convertible.

## 9. Canonical schema additions for this repository
| Field | Purpose |
|---|---|
| family | Groups pages into remediation buckets. |
| template_family | Distinguishes shared shell, reading page, custom review page, and standalone app templates. |
| template_issue | Marks a repeated problem across a family/template. |
| page_instance_issue | Marks a page-specific deviation. |
| representative_sample | Flags pages chosen for full audit. |
| state_capture_complete | Tracks whether the required six states were actually captured. |
