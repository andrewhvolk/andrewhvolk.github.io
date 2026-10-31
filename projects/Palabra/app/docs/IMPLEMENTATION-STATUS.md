# Milestone implementation status

October 30, 2026, America/New_York. This report distinguishes implemented coverage, automated verification and representative browser checks. Content review is an authoring-agent review against references, not an independent teacher audit.

| Milestone | Status | Implemented behavior / content | Verification | Remaining boundary |
|---|---|---|---|---|
| 0 · Repository and baseline | Verified | Correct existing static repository; isolated app directory; preserved handoff and unrelated changes; no old Site binding | Baseline checks before/after; unchanged baseline served and visibly opened in Chrome; corpus SHA-256 preserved | No real personal backup supplied |
| 1 · Engine, contracts and durable state | Verified | Pure seeded planner/grader/scheduler/evidence; versioned content; IndexedDB atomic saves/revision conflicts; isolated profiles; v1 migration and v2 backup; resumable queues/drafts/feedback; idempotent commits; guarded undo | Scheduling, DST/time zones, accents, unknown IDs, malformed/oversized/version-mismatched backups, failure/conflict, profile isolation, resume and idempotency tests; browser reload after answer | Real browser quota exhaustion not forced; engine failure path tested; no cross-device sync |
| 2 · Through-2B path | Verified representative flows | Three intro topics + 1A/1B/2A/2B; 17 objective lessons and 204 authored objective variants; 20-question diagnostic; mixed daily plan; -ar, estar, agreement, practical foundations and comprehension/application | Complete browser diagnostic and 17-item mixed plan; mistakes, retry, undo, text-audio fallback, writing checklist, 360px settings | No exact edition / teacher assignment verification |
| 3 · Through-9B expansion | Implemented; content and forms checked | All remaining mapped objectives: 3A–3B (4); 4A–5B (8); 6A–7A (6); 7B–8B (9); 9A–9B (4). Twelve authored objective variants per objective, three contexts, original lessons and communication material throughout | Data-derived report with all 48 objectives; RAE-backed irregular anchor tests, all authored keys, prerequisite graph; browser 9B saber task and reference | No exhaustive browser traversal of all 735 activities; no independent teacher audit |
| 4 · Teaching and daily experience | Implemented and checked | Plain-English explanations, prerequisite-first scaffolds, accent keys/feedback, context/meaning selection, hint/retry distinctions, progress thresholds, source links, exposed-answer safeguards, self-assessed application labels, culture notes, local profiles | Manual content pass and corpus sample; grammar/reference checks; browser profile isolation, full word filters/search, reverse review, late-course accent feedback | Browser TTS quality varies; writing/speaking use learner checklists; complete independent translation audit remains |
| 5 · Verification and release | Verified representative flows; deployed privately | Dependency-free static package; setup/migration/coverage/provenance/checklist documentation; isolated new private Site; original hosting untouched | 16 Node tests pass; content minimums/reference/schema checks pass; original baseline checks pass; repository CSS/link/HTML/date checks pass; desktop/phone browser QA; production onboarding visibly verified | Formal WCAG/screen-reader audit, browser/device matrix and actual quota exhaustion remain unverified; see RELEASE-RESULT.md for deployment receipt |

## Content totals

Generated from the model, not route counts:

- 21 teaching chapters, including the three introductory topics.
- 48 objective lessons; 576 original fixed objective exercises (12 per objective, each with at least 3 contexts).
- 12 additional opt-in vosotros variants.
- 21 original readings of 50–120 words, each with 3 reviewed questions.
- 21 separate original audio stimuli, each with comprehension and full-sentence dictation.
- 21 writing and 21 speaking prompts, each with a disclosed checklist and model.
- 21 sourced cultural notes identifying their community.
- 50 validated verb references with meanings, forms, exceptions, examples and first course placement.
- 735 total practice activities, excluding the unchanged 940-card vocabulary library. The diagnostic samples existing activities and is not double-counted.

`COVERAGE.md` and `coverage.json` give objective-level counts, contexts, production, reading/listening connections, prerequisites, status and source references. No required chapter is a vocabulary-only or empty shell. Reviewed means author-reviewed; it must not be presented as independent educator certification.

## Remaining limitations and optional backlog

Required core modules are implemented. Real-device linguistic/audio quality, formal accessibility compliance, full human translation review and exact class alignment remain verification boundaries. Personal v1 migration was proven with synthetic data; the learner must export the old-origin backup to transfer real history.

Optional and deliberately absent: cloud sync, account infrastructure, AI conversation, automatic free-writing/pronunciation scoring, microphone recording, paid audio/APIs, teacher assignments, reminders, public sharing, and an installable offline cache. No required learning flow depends on those services.
