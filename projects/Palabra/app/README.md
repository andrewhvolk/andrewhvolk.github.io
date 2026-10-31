# Palabra

Independent Spanish 1 daily learning companion through 9B. No API keys, account, or backend is needed to learn. This app is separate from the old live vocabulary app and publishes at a separate /palabra/ path.

Public classroom URL: **https://andrewhvolk.github.io/palabra/**. No sign-in is required. Progress is saved in this browser; a Google/Chromebook login does not synchronize it. Export/import a backup to move between devices or from the private Sites origin.

The public runtime is generated into the repository’s `palabra/` directory with `npm run build:pages`. Commit that directory together with app source changes to publish through the existing main/root GitHub Pages configuration. Jekyll excludes `projects/Palabra/` so handoff documents, tests, QA screenshots and private Site deployment metadata are not served as public website pages. The private Sites deployment remains separate and unchanged.

## Run

Node 24 is used in CI. No package installation is required to run the app or its pure learning tests. Browser tests use the locked Playwright development dependency.

```powershell
cd projects/Palabra/app
npm start
# Open http://127.0.0.1:4174
npm test
npm run check
npm run build
# Optional repeatable Chromium checks:
npm ci
npx playwright install chromium
npm run build:pages
npm run check:pages
npm run test:browser
```

If the port is occupied, set `$env:PORT='4175'` before `npm start`. Serve over HTTP rather than opening index.html directly. `dist/` is the static release output. The paths are relative, so a subdirectory deployment is supported. The old baseline is unchanged in `../Palabra-Build-Handoff/current-app/`; run `node test.mjs` there for its regression checks.

## What is included

- Today: a deterministic mixed plan with due vocabulary, prerequisite lessons, diagnostic gap recovery, current-chapter practice, reading, listening and personal application.
- Course: 21 teaching chapters (three introductory topics plus 1A–9B), 48 language-pattern objectives (at least 12 authored variants in three contexts each), plus 42 distinct reading/listening objectives. There are 90 objective lessons and 780 activities.
- Words: all 940 unchanged IDs, 315 through 2B, chapter/verb/box filters, bilingual accent-tolerant search, both directions, audio, five boxes, undo, and schedule-free extra practice.
- Verbs: a restricted validated form dataset, reference, contextual typed drills, meaning selection before conjugation, person/tense evidence, accent feedback, affirmative commands and optional vosotros.
- Practice: original reading passages, listening comprehension/dictation, sentence work, writing and guided speaking with disclosed learner checklists, and sourced cultural notes.
- Progress: provisional diagnostic findings, vocabulary counts, per-objective evidence, conjugation by verb/tense/person, and comprehension activity.
- Settings: isolated local profiles, class/time/variety controls, v1 import, learner-scoped v2 backups and additive learner imports, advanced whole-browser/recovery backup, temporary guests, and profile-scoped reset.

See [coverage report](docs/COVERAGE.md), [machine-readable coverage](docs/coverage.json), [milestone status](docs/IMPLEMENTATION-STATUS.md), [architecture and provenance](docs/ARCHITECTURE-AND-PROVENANCE.md), and [verification](docs/VERIFICATION.md).

## Progress and backup

Progress uses versioned IndexedDB, one logical transaction per save, and revision checks to reject conflicting tabs. The app preserves unfinished queues, settings snapshots, drafts, committed IDs and feedback. Another tab’s write triggers a reload notice; it is never silently overwritten. Storage failures show a warning; memory-only practice can still export.

On the same origin, `palabra-progress-v1` migrates automatically and remains untouched. At a new URL, export from the old app’s Settings, then import that JSON here. V1 card IDs, boxes, counts, history, valid filters and due timestamps are retained. Grammar evidence starts empty. The preview reports unmatched records and retains the original import in recovery. V2 imports validate completely. Learner backups add a profile without replacing existing learners; advanced whole-browser backups replace the collection after preview and retain a recovery snapshot. Personal backups do not belong in Git.

Reviews created in v2 use local calendar midnight after destination-box intervals 1/2/4/7/14 days. Existing v1 due timestamps remain exact until the next real review. A card gets at most one scheduled assessment per local date. Retries and practice do not repeatedly promote it. The latest session retains 20 small inverse undo events. Undo reverses an event and its counters; an exposed grammar answer remains supported practice when reattempted.

## Assessment boundary

Secure requires at least six independent assessed attempts, 80% correct among the latest ten, at least two local dates, three variants, and, for language-pattern skills, a genuine production item. Conjugation also requires person/tense/context breadth; progress shows sampled form targets. Hints, exposed answers, retries, diagnostic samples, extra practice, writing and speaking checklists do not meet this automatic rule. Reading and listening questions are recorded separately from grammar mastery. A text audio fallback cannot award listening evidence.

Original content was reviewed by the authoring agent against the linked grammatical references and checked structurally. No independent Spanish teacher review or exact textbook edition audit has been performed. The vocabulary is an independent list, not an edition-verified publisher transcription. Browser audio quality varies. There is no automatic pronunciation or free-writing scoring, cloud sync, microphone recording, account system, or teacher dashboard. Versioned offline caching, an install manifest, explicit update controls and shareable chapter/skill/time practice links are included.

## Public audit follow-through

See [sequential patch status](docs/REMEDIATION.md), [independent educator packet](docs/EDUCATOR-REVIEW.md), and [Google sync setup/release gate](docs/CLOUD-SETUP.md). `npm run review:packet` regenerates the exact source snapshots; independent findings must be recorded separately. The public runtime and maintainable source are checked for deterministic parity in CI, alongside 34 learning tests and six Chromium flows.

Offline study requires one completed online cache preparation. Wait for “Ready offline”; device voices can still depend on internet. Updates wait for Save & update, preserving local progress. Cache Storage contains static curriculum only. Temporary guest work stays in memory: download before ending or closing. Local profiles are labels and remain readable to others using the same browser. Google/Chromebook account resume remains disabled pending project-owned configuration and account-isolation/device tests.
