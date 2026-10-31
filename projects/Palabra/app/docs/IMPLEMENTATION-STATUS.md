# Milestone implementation status

Updated after the public audit remediation, October 31, 2026 UTC (October 30 in the classroom timezone). The public app is https://andrewhvolk.github.io/palabra/. The private Sites build and original vocabulary Site were not rebound or overwritten.

| Milestone | Current result | Verification | Remaining boundary |
|---|---|---|---|
| 0 · Repository/baseline | Correct static repository conventions; isolated source and generated /palabra runtime; unchanged 940 IDs and original handoff | Baseline checks before/after; exact vocabulary SHA-256 preserved | Real learner backup was not supplied |
| 1 · Learning engine/persistence | Pure scheduler/grader/planner; strict v1/v2 settings; small inverse undo; compact backups; debounced crash-journal drafts; captured sessions and revision conflicts | 34 Node tests include DST, malformed imports, 21,950-attempt round trips, undo/resume and isolation | Real device quota/performance exhaustion not forced; cloud is not enabled |
| 2 · Through-2B slice | Diagnostic; daily path; 17 pattern objectives plus 14 receptive objectives; lessons, contextual -ar/estar, articles/agreement/plurals/location, reading/listening and personal responses | Diagnostic/plan/answer keys/irregulars/evidence tests; representative browser diagnostic and daily flows | Independent educator and exact class/edition review pending |
| 3 · Through-9B expansion | All 21 teaching chapters; 48 pattern + 42 receptive objectives; 780 real activities, including 21 new full-sentence tasks and 3 scene choices | Full content/answer-key/prerequisite checks; generated coverage and educator packet | Every activity was not individually traversed by a human in a browser |
| 4 · Teaching/usability | Resolved diagnostic gaps retire; current work shares plans; class-aligned words; truthful recognition/production evidence; question/dictation/speaking rotation; tense/person selection; strategy hints; retry accents; short optional lessons; visible save recovery and mobile More | Engine regressions; live phone/desktop browser checks; 320px Chromium reflow | Audible classroom TTS and screen-reader/hardware trials remain external |
| 5 · Public release | Versioned asset URLs and atomic offline cache; consented app updates; learner-scoped backups/additive imports; guest isolation/end flow; previewed teacher links; install manifest/icons | 6 Chromium flows in CI; deterministic 25-asset source/output parity; repository checks; anonymous public byte comparison | Installation UI varies by browser; voices can depend on internet |
| 6 · Google account resume | Deliberately disabled; honest Chromebook-transfer explanation and concrete setup/release gate | Current local/guest flows verified; CLOUD-SETUP.md records account isolation/conflict/privacy tests required before enabling | BLOCKED: project-owned Google Cloud/Firebase configuration and real accounts/devices |
| 7 · Independent educator review | Exact-revision chapter packets, all answer keys/explanations/assessment types, 50 verb references and separate findings template prepared | Packet contains all 780 activities and 90 objectives | PENDING EXTERNAL: a real educator must record actual findings; no independent approval is claimed |

## Content coverage

- 21 teaching chapters: three introductory topics and 1A–9B.
- 48 pattern objectives with at least 12 authored variants each across three contexts; 42 additional receptive objectives have their own questions and strategy lessons.
- 780 activities: 576 original pattern variants, 12 opt-in vosotros variants, 63 reading questions, 63 listening questions/dictations, 21 writing prompts, 21 speaking prompts, 21 complete-sentence applications and 3 scene choices.
- 21 original 50–120-word readings; 21 separate audio stimuli; 21 sourced cultural notes; 50 verb references.
- 940 independent vocabulary cards, including 315 through 2B. SHA-256: aa03513f9d70a85cc964cf35a868bd0e57163da98d50bdcfbbb2f4189be3772f.

Coverage counts actual questions linked to each objective. Chapter stimulus presence is reported separately in coverage.json. Receptive evidence does not establish grammar production; self-assessed writing/speaking is activity, not an automatic language score. Secure verb skills report sampled target breadth rather than certifying a complete paradigm.

## Genuine remaining limitations

Google sync requires operator-owned configuration and real authorization/cross-device checks. Independent Spanish educator review, exact textbook/class pacing alignment, reviewed recordings, audible TTS quality on actual Chromebooks, screen-reader use and a broader browser/device matrix remain unverified. The current session's in-app browser has no Spanish TTS voice; its honest fallback was checked. Synthetic fixtures validate migration, not a user's actual personal backup.

AI conversation, paid APIs, account infrastructure beyond the requested setup gate, a full teacher dashboard, microphone recording and automatic free-writing/pronunciation scores remain outside the shipped scope. See REMEDIATION.md for ordered patch receipts, VERIFICATION.md for evidence, and EDUCATOR-REVIEW.md/CLOUD-SETUP.md for external gates.
