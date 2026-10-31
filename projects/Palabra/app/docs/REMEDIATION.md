# Public audit remediation

Work proceeds sequentially: implement, test, push, and verify Pages before the next patch.
The public target is https://andrewhvolk.github.io/palabra/; the separate private Site and original live app are unchanged.

| Order | Scope | Status |
|---|---|---|
| 1 | Legacy import trust boundary and display escaping | Live in 92f1ec6; 17 tests, both Actions checks and public file hashes verified. |
| 2 | Bounded undo, compact backups, draft persistence | Implemented: inverse events (20 latest), old snapshot conversion, compact exports, 64 MB byte cap, debounced drafts with small crash journal. 19 tests pass, including 21,950 attempts and repeated round trips. Live in 68dc509; both Actions checks and four public module hashes verified. |
| 3 | Retire resolved diagnostic gaps and balance progression | Implemented: independent secure evidence supersedes diagnostic misses; ready current objectives receive reserved slots while unresolved prerequisites return. Live in 1d3d65f; cache consistency follow-up a3c22f0. 20 tests, both Actions checks, public hashes and malformed-import browser check pass. |
| 4 | Chapter-aligned vocabulary and daily introduction budget | Implemented: class-following scope with explicit Custom deck, all-position tests, shared introductory pool; release unused early-finished reservations and exclude practice. Live in 651faee; 22 tests, both Actions checks and public module hashes pass. Browser settings confirmed Follow class position. |
| 5 | Truthful production evidence and receptive objectives/coverage | Implemented: recognition metadata, legacy evidence guard, person/tense/context breadth, 42 distinct receptive objectives and 21 sentence-identification questions. Coverage counts actual links. Live in bd3584c; 24 tests, both Actions checks and public module hashes pass. |
| 6 | Daily task rotation, tense/person selection, hints and retry accents | Implemented: least-used/oldest applications include dictation and speaking; balanced manual queues include opted-in vosotros; verb tense/person dialog; strategy-only hints; retry accent controls. 26 tests pass; deployment pending. |
| 7 | Return/resume behavior, mobile navigation, save status and plain language | Pending |
| 8 | Shared-device guest mode and profile-scoped backup | Pending |
| 9 | Teacher practice links and lesson/application flow | Pending |
| 10 | Voice readiness, relevant glossaries and feedback precision | Pending |
| 11 | Offline delivery and release CI/source-output parity | Pending |
| 12 | Google account cross-device progress | Requires an authorized Google OAuth client and cloud progress provider; no credentials are embedded in this project. |
| 13 | Independent educator review | External review required; prepare a concrete review packet. Do not label author checks independent. |

Regression fixtures contain synthetic data only. Vocabulary IDs and original schedules remain compatible.
