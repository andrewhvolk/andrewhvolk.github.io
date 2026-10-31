# Architecture and source record

Date: October 30, 2026 (America/New_York).

## Repository decision

The intended workspace is `C:/Users/andre/Repos/andrewhvolk.github.io`, an existing static academic site with independent projects. No applicable AGENTS.md was found at the repository or applicable ancestor/project paths. CLAUDE.md was inspected for architecture conventions. Palabra lives only in `projects/Palabra/app/`. Root CSS, shared scripts, hosting integrations, and unrelated pending changes are untouched.

Decision: retain native static HTML/CSS/ES modules to match this nonempty repository and the working buildless baseline, rather than introduce a framework/build dependency into the academic site. `src/types.d.ts` declares content/state types; executable runtime schemas and tests validate data. Pure learning code is independent of DOM, browser storage, and speech. Package scripts use only Node’s standard library. All runtime paths work beneath a subdirectory.

## Components

- `src/engine.mjs`: calendar scheduling, Unicode-aware grading, placement, evidence, seeded planning, immutable/idempotent commits and undo.
- `src/persistence.mjs`: IndexedDB repository with revision checks, memory fallback, whole-backup validation, v1 migration, v2 round trips and recovery copies.
- `content/core.mjs`, `catchup.mjs`, `middle.mjs`, `later.mjs`: stable objective/lesson/exercise IDs and individual authored prompt/answer rows. There is no unchecked Cartesian-product exercise generator.
- `content/verbs.mjs`: explicit irregular paradigms and a restricted reviewed whitelist of regular verbs; unsupported forms throw instead of guessing. The eight required affirmative tú exceptions are explicit.
- `content/communication.mjs`: original fictional 50–120-word readings, three questions each, separate spoken sentences/dictation, application prompts/models/rubrics.
- `content/culture.mjs`: original contextual notes with country/community and institutional references. They are cultural windows, not statements that all households follow a custom.
- `src/validation.mjs`: schema, graph, minimum-content and reference checks. `npm run check` writes an inspectable row for every objective.
- `src/app.mjs`: views and browser adapters. All imported strings are escaped before rendering. Speech is device TTS and optional; there are no private network learning APIs.

## Provenance and review

The unchanged vocabulary is the handoff snapshot from original deployed source commit `6107e2bd3b9e018c6cfa4317825c0acae9a94d03`. The exact JSON is compared in tests; all 940 stable IDs and 22 list associations remain, including 315 through-2B cards. Introductory list filters pe1–pe4 are not represented as four official teaching chapters.

The old Site at `https://realidades-word-garden.andrewhvolk.chatgpt.site` remains separate. Its historical Site identity is not bound in this build. The new `.openai/hosting.json` contains only the newly registered Palabra Site identity.

Vocabulary source links remain in each section. Curriculum scope came from the supplied handoff and its [IXL alignment](https://www.ixl.com/spanish/skill-plans/realidades-level-1.pdf), [course outline](https://passporttolanguages.net/realidades-1-outline), and [chapter index](https://www.spanishdict.com/textbooks/9). Exact edition/year/ISBN and teacher pacing remain unverified. There is no publisher endorsement claim.

All new explanations, sentences, questions, passages, prompts, and models were authored for Palabra. No textbook exercise, reading, illustration or answer page was copied. `reviewed` means a deliberate authoring-agent review of the fixed keys and rules, not an independent human review. Source-backed checks used [RAE conjugation models](https://www.rae.es/diccionario-estudiante/docs/conjugaciones-verbales.pdf), the RAE DPD entries for [tilde](https://www.rae.es/dpd/tilde), [ser](https://www.rae.es/dpd/ser), [estar](https://www.rae.es/dpd/estar), [plural](https://www.rae.es/dpd/plural), [concordancia](https://www.rae.es/dpd/concordancia), [gustar](https://www.rae.es/dpd/gustar), [fecha](https://www.rae.es/dpd/fecha), [abecedario](https://www.rae.es/dpd/abecedario), [ordinales](https://www.rae.es/dpd/ordinales), and [conocer](https://www.rae.es/dpd/conocer). Per-objective links are in the content and coverage.json.

Representative manual source checks included nosotros stem-change exclusions, present decir/pedir/saber/conocer, preterite hizo/di/dio/fui, the -car/-gar yo sound-preserving spellings, the eight affirmative tú exceptions, and ser/estar use by meaning rather than a blanket permanent/temporary rule. Automated tests compare independent explicit anchors and every authored key.

Culture anchors are the RAE regional-address descriptions; Instituto Cervantes’s María Zambrano library and Día de Muertos note; UNESCO’s tango, traditional Mexican cuisine and Machu Picchu descriptions. Notes are short original paraphrases, with original comparison questions. Cultural and regional diversity has no single-country default.

## Corpus audit

All 940 entries were checked for ID uniqueness/shape, known section references, nonempty labels, surrounding whitespace, markup and exact baseline preservation. A stratified sample across the book (every 47th card) was read during this build; it includes numbers, time, en, adjective labels, verb meanings, dishes, comparisons and later media/travel nouns. No semantic label or ID was changed. The sample revealed the inherited redundant gloss `en → in; in; on`; it is retained to preserve the exact snapshot and documented as a cosmetic cleanup opportunity. Verb tags remain heuristic vocabulary metadata and do not enable unsupported conjugation generation. A full independent translation audit of all 940 entries has not occurred.

## Reversible assumptions

Class position defaults through 2B; daily target 15 minutes; at most ten new vocabulary cards; plural address ustedes with vosotros opt-in. Vocabulary direction evidence shares the legacy schedule while new events record direction. No active learner data was provided, so migration uses synthetic fixtures only. Native speaking aloud is the required baseline; local recording is optional and not implemented. The deployment starts owner-private and does not invite or grant access to another account.
