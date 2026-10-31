# Public Palabra audit

Historical pre-patch findings. See [REMEDIATION.md](REMEDIATION.md) for current results and external review/configuration gates.

Audited October 30, 2026, America/New_York.

Public app: https://andrewhvolk.github.io/palabra/

Assessment: a usable personal-study beta with a coherent visual design and substantial content. Fix the import trust boundary, backup growth and planner progression before recommending it broadly for sustained classroom use. Passing the current checks does not establish release readiness for those cases.

This audit did not change or redeploy application code. Only audit documentation and ignored screenshots were added. Synthetic probes ran on a separate localhost origin; the public origin's learner records were not modified.

## Method and evidence

- Loaded the public app in Chrome. Compared all 16 deployed runtime assets byte-for-byte with the local public bundle: all matched, all returned HTTP 200. The source findings therefore apply to the public release, rather than a different local build.
- Ran the existing Node suite: all 16 tests pass. These tests miss several scenarios below.
- Used pure-engine reproductions for planning, evidence, large backup round trips and queue selection.
- Used a separate local origin for onboarding, chapter selection, settings, mobile layout and a harmless legacy-import markup probe. No JavaScript payload, event handler or exfiltration was used.
- Inspected 360px mobile and 320px narrow-screen settings. The 320px settings page reflowed without overflowing form controls. This was not a full WCAG certification, screen-reader audit, ChromeOS hardware test or penetration test.

## Fix first

### P1 · A v1 import can put untrusted settings into HTML

**Confirmed:** `previewBackup` accepts an old-format backup with `settings.minutes` set to `<b id="audit-injected">AUDIT MARKUP</b>`. The v1 branch spreads arbitrary settings over current defaults; its settings validator checks sections/direction/limit but not the new learning preferences. Today then interpolates minutes into innerHTML without escaping. The harmless probe became a real bold DOM element in the local browser.

**Impact:** importing a crafted backup can inject HTML, creating a stored DOM-XSS risk through active HTML attributes. Script execution was not attempted. This requires an imported backup; it is not evidence of an unauthenticated URL-only attack. Invalid nonnumeric settings also survive migration and make the resulting v2 export fail its own validation.

**Fix:** allowlist only the actual v1 fields; initialize new fields from trusted defaults; run the complete shared settings schema after every migration; escape all imported text at every HTML/attribute sink. Reject invalid payloads before saving. Include a field-specific preview error.

**Locations:** `src/persistence.mjs:6`, `src/persistence.mjs:29`, `src/app.mjs:49`, `src/app.mjs:66`.

**Acceptance:** markup-bearing, wrong-type, out-of-range and unknown setting fields cannot become HTML or poison persisted state; every accepted v1 import exports a restorable v2 backup.

### P1 · The app can export backups it refuses to import

**Confirmed:** imported valid schedules for all 940 cards, then completed one valid 50-card scheduled session. Its v2 export was **12,421,909 bytes** (11.85 MiB); import rejected it against the 10 MiB limit.

**Cause:** each answer retains a complete copy of all vocabulary progress in its undo snapshot. These snapshots remain in every session, including completed sessions. The entire growing store is cloned and saved repeatedly; draft input writes it on every keystroke. Import recovery copies can add further duplication.

**Impact:** a learner with substantial history can lose the ability to transfer or restore progress. Long histories will also increase memory, serialization and write costs; performance degradation was inferred from the storage design, not benchmarked on a Chromebook.

**Fix:** store a small inverse event/delta instead of the entire progress dictionary; retain only undo records that can legally be used; compact completed-session UI state; keep immutable attempt evidence separately. Debounce drafts and flush before navigation/commit. Separate or deduplicate recovery archives. Merely raising the file cap postpones the underlying problem.

**Locations:** `src/engine.mjs:79`, `src/engine.mjs:92`, `src/app.mjs:24`, `src/app.mjs:170`, `src/persistence.mjs:2`.

**Acceptance:** realistic multi-year fixtures, full-course v1 imports and repeated v2 round trips remain restorable and have bounded growth. A storage warning remains visible on phones.

### P1 · Resolved diagnostic gaps can prevent course progression

**Confirmed:** created an initially poor diagnostic, then six independent correct attempts over two dates and three variants for every sampled objective. All sampled objectives were secure. With the class position at 9B, the next 15-minute plan still chose nine old diagnostic gaps and **zero 9B objective exercises**.

**Cause:** the diagnostic-gap flag has higher priority even when newer independent evidence says the objective is secure. It does not retire until the diagnostic is retaken.

**Fix:** let newer learning evidence supersede provisional placement. Retire resolved diagnostic gaps, use due/weak prerequisite review, and reserve a sensible share of the plan for ready current-chapter work.

**Locations:** `src/engine.mjs:50`, `src/engine.mjs:51`.

**Acceptance:** weak prerequisites are repaired, secure prerequisites stop dominating, and current-chapter work becomes available without requiring a diagnostic retake.

## Next correctness and teaching fixes

| Priority | Confirmed behavior | Recommended change |
|---|---|---|
| P2 | Onboarding at **9B** still selects only **315 through-2B vocabulary cards**. Class position and word filters are disconnected. | Derive default vocabulary scope from class position, with an explicit Custom deck override. Map introductory topics deliberately rather than treating the four pe lists as official chapters. Test every class position. (`src/app.mjs:158`, `src/engine.mjs:31`) |
| P2 | Choosing between supplied infinitives is marked `production: true`. Six correct answers on three recognition-only items across two dates yield **secure** despite the production requirement. | Distinguish recognition, controlled form production and sentence application. Correct item metadata; require appropriate person/tense/context breadth. Show partial person-level security rather than implying a whole paradigm is secure. (`content/core.mjs:15`, `src/engine.mjs:23`) |
| P2 | Across five otherwise equivalent daily plans, reading and listening repeatedly selected q1, despite previous correct responses. Dictation and speaking are not chosen by the daily application loop. | Rotate/review actual comprehension items and prompts, and alternate appropriate writing/speaking tasks. Make selection use evidence and recency, not `.find`. (`src/engine.mjs:65`) |
| P2 | All 63 reading questions and all listening items have empty objectiveIds. The coverage report counts chapter-level stimuli as reading/listening coverage for every chapter objective. | Add real comprehension objectives and question tags. Report tested objective links separately from mere stimulus presence. Keep receptive evidence separate from grammar production. (`content/communication.mjs:56`, `src/validation.mjs:38`) |
| P2 | Starting and early-finishing two default daily plans without answering anything reserves all ten new words; the next plan contains zero new vocabulary cards. | Count actual introductions, reserve only active pending plans, and release unreached cards on early finish. Same-day repeated exposure should not bypass the cap. (`src/engine.mjs:38`) |
| P2 | Manual skill queues slice to the first 12 entries. The 13th optional vosotros item is omitted. Ir reference practice selects present forms only even though command and preterite targets exist. | Offer verb/tense/person selection and choose balanced variants within that scope. Do not silently drop opt-in targets. (`src/app.mjs:69`, `src/app.mjs:121`) |
| P2 | Completing a lesson sets usedHint; the resulting callout may show the exact answer before the first attempt, e.g. “tú takes hablas here.” | Separate pattern hints, worked examples and full solutions. Use a different worked example, then a fresh assessment. Continue to mark supported attempts honestly. (`src/app.mjs:119`, `src/app.mjs:87`) |
| P2 | Accent buttons disappear on the retry form, precisely when a learner may need to correct an accent. | Reuse the Spanish input controls for original answers and retries; preserve cursor and focus. (`src/app.mjs:75`, `src/app.mjs:89`) |

Additional source-review concern: completed sessions remain active, and Today renders their summary on reload. The summary uses the current date and “today” wording rather than the completion date. A learner returning the following day can land on yesterday's completion as though it were today's session. Default to the new day's dashboard after a completed session; date old summaries accurately. A full overnight browser reproduction was not performed.

## Style, layout and ease of use

**Keep the visual foundation.** Cream, forest green, yellow accents, restrained illustrations, distinct Spanish examples and one dominant daily-practice button work well. Sampled theme contrast ratios were 11.01:1 for body text, 4.83:1 for muted text and 6.80:1 for hero paragraph text. These exceed the ordinary-text 4.5:1 contrast criterion, but they are not a complete contrast audit. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

1. **Make mobile navigation explicit.** At 360px the initial visible row shows Today, Course, Words and Verbs; Practice, Progress and Settings sit off to the right. Keep Settings reachable in the header, but replace the scrolling seven-tab row with Today/Course/Words/More or a clearly labeled menu. Preserve a visible active location.
2. **Keep save/failure status visible.** The save-state element is hidden below 760px. A quota failure or stale-tab conflict therefore depends on a short-lived toast during practice. Add a persistent compact status/banner with Reload or Download backup as appropriate.
3. **Reduce the space before the task.** Shorten the mobile welcome/hero stack and show a concrete plan, e.g. “5 word reviews · estar locations · 1 short reading.” A long greeting and generic hero consume useful space on short phones and Chromebook windows. Retain the calm palette and generous controls.
4. **Increase functional small text.** Tags/metadata can be 10–12px and box interval labels reach 8px on mobile. Use roughly 13–14px for information students must read. This is a usability recommendation, not a claim that WCAG specifies a minimum font size. Keep most touch targets near 44px; the WCAG 2.2 AA target criterion is 24px or the applicable spacing exception. [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
5. **Make the next step concrete.** Replace “Committed activities,” raw kind names such as “guided/cloze,” and lengthy mastery formulas in the main flow with learner-facing language. Explain evidence policy in an expandable help section. The old-origin migration note belongs under advanced backup help, rather than ordinary public onboarding.
6. **Reduce prerequisite walls.** A chosen advanced exercise can require a long sequence of lesson screens while the exercise progress indicator stays still. Show a short prerequisite check, allow lesson review on demand, and distinguish lesson progress from assessment progress without inventing mastery.
7. **Improve feedback precision.** For a wrong form, identify the actual person/tense/endings conflict. For comprehension, use constrained choices or curated aliases so English phrasing/number formatting do not overshadow Spanish understanding. Retain accent-sensitive grading.
8. **Fix the shared glossary.** Every passage currently receives the same broad glossary. Supply only relevant terms, identify intentionally introduced words, and put definitions beside the passage or behind accessible word controls.

The 320px settings controls reflowed successfully. Continue testing at the equivalent of 400% zoom and with screen readers; horizontal scrolling in navigation is a discoverability issue here, rather than a conclusively demonstrated reflow failure. [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

## Feature additions with the greatest practical value

1. **Google sign-in and secure cross-device resume**, if classroom use across changing Chromebooks is the goal. It needs a per-student progress store, authorization, offline conflict handling, sign-out and profile separation. Public hosting itself supplies no sync. Keep a guest/no-account path and portable backups.
2. **A shared-device mode.** Make it obvious that local profiles are labels, not private accounts. Add a temporary guest session and a clear end-of-session backup/sign-out flow. Default export should be profile-scoped; put whole-browser/all-profile backup in advanced settings.
3. **A teacher/class scope preset or shareable practice link.** Let a teacher specify a chapter, skill and time budget, with prerequisites respected. The learner should see exactly what the link will start before it changes their plan. A full teacher dashboard can follow demonstrated need.
4. **A clearer lesson-to-application loop.** Add more scene choices, sentence construction, short mixed response tasks and reviewed variants in context. Keep listening, reading and production evidence distinct; do not add automatic free-writing or pronunciation scores without a validated method.
5. **Reviewed audio and voice readiness.** Show whether a Spanish voice is loading/available, provide a voice test and visible speed setting, and keep the honest text fallback. Recorded audio is a useful later enhancement; a paid service is not required for the core loop.
6. **Offline/installable delivery after persistence fixes.** Cache versioned static assets with a tested update/migration strategy. Keep offline availability distinct from durable progress and cross-device sync.
7. **Independent Spanish educator review.** Prioritize accepted alternatives, exercise difficulty, vocabulary/grammar progression and regional phrasing. Structural item counts and author-reviewed labels should not imply an independent content audit.

## Suggested delivery order

1. **Reliability patch:** shared import validation/escaping; bounded undo/draft persistence; self-export round trips; diagnostic gap retirement; chapter-aligned vocabulary.
2. **Teaching patch:** truthful production metadata; receptive objective tags; comprehension/task rotation; explicit tense/person practice; tiered hints and retry accent controls.
3. **Public usability patch:** visible save state, compact mobile navigation, concrete plan preview, shorter prerequisite flow, profile-scoped backup/guest mode, language/font/keyboard review.
4. **Classroom expansion:** account-based sync and scoped teacher links; then reviewed audio and offline delivery.

Add regression cases for each confirmed defect above before changing behavior. Expand CI to run the learning tests, content validation and a small browser smoke suite on the actual Pages output; also check that generated `/palabra/` assets match their source. The current manual dual-source publish step can otherwise drift.

## Artifacts

- Reproducible, read-only synthetic engine checks: `audit/reproduce.mjs` (run `node docs/audit/reproduce.mjs` from the app directory).
- Recorded reproduction output: `audit/results.json`.
- Ignored screenshots: `qa/audit-mobile-today.jpg`, `qa/audit-import-markup.jpg`.
- No changes were made to runtime source, live deployment, account access, real learner records or unrelated repository work.
