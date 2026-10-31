# Verification record

Tests and browser QA used synthetic local profiles only. No actual learner backup, microphone input, or personal recording was supplied or shipped.

## Automated

`npm test`: 16 passing Node test cases covering destination-box scheduling/promotion/reset/cap, local midnight, exact 37/35-hour DST transitions, time-zone changes, due priority, daily introduction limits/reservations, seeded plans, class scope/prerequisites, accents/NFC/ñ/alternatives, regular and explicit irregular anchors, all eight affirmative tú command exceptions, preterite sound-preserving spelling, resume/idempotency, atomic undo, cross-session undo guards, exposed-answer undo, practice/profile isolation, sparse/cross-day mastery evidence, diagnostic scoring, v1 recovery, v2 round trip, malformed/oversized/unsafe/version-mismatched imports, storage failures/interrupted migration/conflicts, content graph/minimums and every authored answer key.

`npm run check`: 48 objectives, 735 activities, 21 chapters, 940 cards validate. Minimums exclude opt-in vosotros variations. Reading lengths, question counts, answer keys, review labels, references, prerequisite cycles and vocabulary identity validate. The vocabulary file matches the original SHA-256 `aa03513f9d70a85cc964cf35a868bd0e57163da98d50bdcfbbb2f4189be3772f`.

`npm run build`: emits the independent static `dist/` package with the same relative module/content URLs used in local QA.

Original `current-app/test.mjs`: passed before and after implementation. No baseline runtime source was modified.

Repository checks passed: CSS links, local links, HTML structure, and course dates. `scripts/check_css_links.py` received a narrow application-local stylesheet exception for `projects/Palabra`; other canonical stylesheet rules remain. Root styles.css and theme.js were not edited.

## Browser journeys (Chrome on Windows)

| Journey | Observed result |
|---|---|
| Unchanged baseline | Correct title/dashboard; 315 selected cards; baseline five boxes |
| Fresh learner → diagnostic | Named local profile; 20 questions; 18 correct with deliberate wrong form/accent responses; specific gap summary; no vocabulary schedule invented |
| Reload after an answer | Saved feedback reappeared; cursor not regraded or reset |
| Diagnostic → Today → mixed learning | Vocabulary → short prerequisite/target lessons → typed grammar; planner identified diagnostic gaps |
| Full daily completion | Completed 17 activities across vocabulary, grammar, reading, listening fallback and writing; summary reported actual counts and gaps |
| Wrong conjugation → retry | hablo for tú hablar received hablas and ending explanation; retry was practice; undo restored the original pending exercise |
| Audio fallback | Transcript labeled as reading fallback; correct response labeled supported practice; listening credit excluded |
| Writing | Model appeared after response; checklist had explicit learner-assessment language and persisted its selection |
| 9B active practice | Reference displayed sé and other saber forms; prerequisite lessons led to a real contextual saber/conocer question; se received accent feedback and no full correct credit |
| Profiles | Created Second QA, started/left a session, switched to original profile; histories remained separate |
| V2 export and import | JSON downloaded (75,463 bytes for this fixture); browser importer previewed 2 profiles/5 matched cards; applied backup; Second QA still had its 0/12 unfinished queue |
| Invalid backup | Malformed JSON reported “Nothing was changed” before a valid file preview |
| V1 migration | Synthetic backup preview showed 1 matched, 1 unmatched, 1 migrated; original import/replaced state retained in recovery |
| Returning overdue review | Migrated Box 4 card led the plan, English→Spanish as imported; correct answer reached Box 5, due November 13, 2026 |
| Early finish | Partial session explicitly labeled; only one committed activity counted |
| Word library | Whole-book filters yielded 940 cards; search located igualmente with preserved identity and new due date |
| Conflicting tabs | Saving preferences in another tab caused a reload notice; stale checkbox write was rejected; reload showed the newer profile name and original filter |
| Phone layout | Settings/profile controls visibly inspected at 360×800; main content reflowed; backup/settings remained reachable through header link; viewport reset afterward |
| Keyboard basics | Typed vocabulary Enter revealed; native forms/buttons usable; visible focus and skip link; dialog Escape closed and focus returned to Read lesson |
| Production | New private URL loaded fresh onboarding through 9B; owner-only access confirmed; no console errors observed |

Screenshots: `qa/phone-settings.jpg`, `qa/accent-feedback.jpg`, and `qa/desktop-today.jpg` when recorded. The in-app browser initially could not access localhost; Chrome succeeded once the preview ran outside network isolation. The download observer timed out, but the exported JSON was found in Downloads and successfully restored through the actual file chooser. This is a tooling observation, not an export failure.

## Verification boundaries

Representative flows passed; all 735 activities were not individually traversed in a browser. No formal screen-reader/WCAG 2.2 AA certification or Safari/Firefox/iOS/Android matrix was performed. A Spanish voice was available in the primary test tab, and the unavailable/text path was exercised; pronunciation quality was not certified. Browser quota exhaustion was not forced; repository failure/conflict paths have automated coverage. Microphone denial is inapplicable because no recording is requested. Source-backed author review does not substitute for independent teacher review, edition verification or a full translation audit.
