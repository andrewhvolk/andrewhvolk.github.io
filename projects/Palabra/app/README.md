# Palabra

Independent Spanish 1 daily learning companion through 9B. No API keys, account, or backend is needed to learn. This app is separate from the old live vocabulary app and does not alter the repository’s hosting workflow.

Public classroom URL: **https://andrewhvolk.github.io/palabra/**. No sign-in is required. Progress is saved in this browser; a Google/Chromebook login does not synchronize it. Export/import a backup to move between devices or from the private Sites origin.

The public runtime is generated into the repository’s `palabra/` directory with `npm run build:pages`. Commit that directory together with app source changes to publish through the existing main/root GitHub Pages configuration. Jekyll excludes `projects/Palabra/` so handoff documents, tests, QA screenshots and private Site deployment metadata are not served as public website pages. The private Sites deployment remains separate and unchanged.

## Run

Node 20+ (tested with Node 24). No package installation required.

```powershell
cd C:\Users\andre\Repos\andrewhvolk.github.io\projects\Palabra\app
npm start
# Open http://127.0.0.1:4174
npm test
npm run check
npm run build
```

If the port is occupied, set `$env:PORT='4175'` before `npm start`. Serve over HTTP rather than opening index.html directly. `dist/` is the static release output. The paths are relative, so a subdirectory deployment is supported. The old baseline is unchanged in `../Palabra-Build-Handoff/current-app/`; run `node test.mjs` there for its regression checks.

## What is included

- Today: a deterministic mixed plan with due vocabulary, prerequisite lessons, diagnostic gap recovery, current-chapter practice, reading, listening and personal application.
- Course: 21 teaching chapters (three introductory topics plus 1A–9B), 48 objective lessons and at least 12 authored assessed variants per objective in three contexts.
- Words: all 940 unchanged IDs, 315 through 2B, chapter/verb/box filters, bilingual accent-tolerant search, both directions, audio, five boxes, undo, and schedule-free extra practice.
- Verbs: a restricted validated form dataset, reference, contextual typed drills, meaning selection before conjugation, person/tense evidence, accent feedback, affirmative commands and optional vosotros.
- Practice: original reading passages, listening comprehension/dictation, sentence work, writing and guided speaking with disclosed learner checklists, and sourced cultural notes.
- Progress: provisional diagnostic findings, vocabulary counts, per-objective evidence, conjugation by verb/tense/person, and comprehension activity.
- Settings: isolated local profiles, class/time/variety controls, v1 import, full v2 backups with unfinished sessions, import preview/recovery and profile-scoped reset.

See [coverage report](docs/COVERAGE.md), [machine-readable coverage](docs/coverage.json), [milestone status](docs/IMPLEMENTATION-STATUS.md), [architecture and provenance](docs/ARCHITECTURE-AND-PROVENANCE.md), and [verification](docs/VERIFICATION.md).

## Progress and backup

Progress uses versioned IndexedDB, one logical transaction per save, and revision checks to reject conflicting tabs. The app preserves unfinished queues, settings snapshots, drafts, committed IDs and feedback. Another tab’s write triggers a reload notice; it is never silently overwritten. Storage failures show a warning; memory-only practice can still export.

On the same origin, `palabra-progress-v1` migrates automatically and remains untouched. At a new URL, export from the old app’s Settings, then import that JSON here. V1 card IDs, boxes, counts, history, valid filters and due timestamps are retained. Grammar evidence starts empty. The preview reports unmatched records and retains the original import in recovery. V2 imports validate completely before replacement and retain a recovery snapshot. Personal backups do not belong in Git.

Reviews created in v2 use local calendar midnight after destination-box intervals 1/2/4/7/14 days. Existing v1 due timestamps remain exact until the next real review. A card gets at most one scheduled assessment per local date. Retries and practice do not repeatedly promote it. Undo reverses the last event and its counters; an exposed grammar answer remains supported practice when reattempted.

## Assessment boundary

Secure requires at least six independent assessed attempts, 80% correct among the latest ten, at least two local dates, three variants, and a correct production item. Hints, exposed answers, retries, diagnostic samples, extra practice, writing and speaking checklists do not meet this automatic rule. Reading and listening questions are recorded separately from grammar mastery. A text audio fallback cannot award listening evidence.

Original content was reviewed by the authoring agent against the linked grammatical references and checked structurally. No independent Spanish teacher review or exact textbook edition audit has been performed. The vocabulary is an independent list, not an edition-verified publisher transcription. Browser audio quality varies. There is no automatic pronunciation or free-writing scoring, cloud sync, microphone recording, account system, or installable offline cache in this release.
