# Current public release verification

All profiles and backups used for tests were synthetic. No actual learner backup, microphone input or private account credentials were supplied.

## Automated evidence

- 45 passing Node learning/regression tests: scheduling/DST, grading/NFC/accents/ñ, irregular anchors and command exceptions, diagnostic scoring, planner progression and class scope, evidence breadth, reservation release, resumed queues/drafts, safe v1/v2 migration, profile isolation and malformed inputs.
- Full-book schedules plus 21,950 attempts survive repeated compact export/import cycles. Undo stores only recent inverse events; the old 12 MB single-session explosion is eliminated.
- Content validation covers all 90 objectives, 780 activities, 21 chapters, answer keys, prerequisites, original reading lengths, assessment types, question links and unchanged vocabulary bytes.
- Nine browser flows are covered (Playwright Chromium in CI; installed Chrome in local verification) against actual generated /palabra output: 9B word scope + typed draft/committed-cursor resume; atomic unsafe-import rejection; previewed assignment + isolated guest; offline reload; consented release update + retained draft; 320px navigation/settings/save reflow.
- The browser server now uses production-like ten-minute cache headers. The update test covers stale HTTP-cached HTML; worker installation uses reload-mode requests and a release-versioned shell key.
- Deterministic rebuild parity checks all 26 committed runtime assets. The same bytes were fetched anonymously from the public Pages URL, including manifest, worker and PNG icons.
- Repository CSS links, local links, HTML structure and course dates pass. Original handoff app tests remain unchanged and pass.

## Guided student-flow verification

Generated-text parity normalizes Git CRLF checkouts to LF on Windows; vocabulary JSON and binaries remain exact-byte comparisons. A CRLF checkout probe passes and the deterministic build restores LF output.

Browser tests wait for saved corrective feedback and specific cursor changes before reload or continuing. A generic HTML-change wait was removed after CI exposed an earlier-screen transition race; both affected journeys pass five consecutive local repetitions.

The guided update passes 45 Node tests and nine local Chrome browser flows, including one-click entry, all five warm-up responses with reload, direct lesson handoff, an entire guided daily session, the completion/tomorrow state, automatic next-lesson preview, and switching between two saved learners. Existing offline/update/import/guest flows remain covered. Desktop and 320px screenshots are inspected. The vocabulary bytes and all 780 authored activities are unchanged. See GUIDED-LEARNING.md for policy, compatibility and remaining research gaps.

## Prior public deployment evidence

The latest verified runtime fix is commit 9b0d6d4600b911af107bf08160a88516041ed81c. Its Pages, CSS/repository and Palabra learning/browser workflows all succeeded. Palabra run: https://github.com/andrewhvolk/andrewhvolk.github.io/actions/runs/41162878503 . Pages run: https://github.com/andrewhvolk/andrewhvolk.github.io/actions/runs/41162877927 . Subsequent documentation changes also run these checks.

## Live browser observations during remediation

- Malformed legacy preferences display a field-specific “Nothing was changed” error without applying the import.
- An accented draft survives immediate reload; a scheduled commit resumes at the next activity.
- Follow class position at 9B exposes all 940 cards. Explicit custom filters remain available.
- Verb practice for ir exposes present, preterite and affirmative tú scope plus subject selection.
- Optional quick checks replace long prerequisite walls. Wrong-answer retries retain Spanish accent controls.
- At phone width, More reveals Verbs/Practice/Progress/Settings and save status remains visible; no page overflow was observed in the checked view.
- Temporary guest entry opens separate progress; ending it restores the exact saved learner activity.
- Teacher links show a read-only chapter/skill/time preview; choosing guest and Start launches prerequisite-first checks without changing the saved learner's usual settings.
- Voice settings show a truthful unavailable status and text fallback when Spanish speech is absent.
- The public footer reports Ready offline after installation. Save & update activated release 9c8e6b1621fb3d1c and preserved the saved learner; the Chromium suite separately verifies offline reload and update retention.

## Boundaries

This is representative browser QA, not individual human traversal of all 780 activities or accessibility certification. Actual Chromebook/account synchronization, audible classroom voice quality, recorded audio review, screen-reader use, real quota exhaustion and independent educator/edition review remain unverified. See EDUCATOR-REVIEW.md and CLOUD-SETUP.md. Historical initial-build journeys are preserved in VERIFICATION-INITIAL.md.
