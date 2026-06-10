# Lecture Manifest Contract

Each `Math130Unit*.json` file is an authored lecture definition validated by
`lecture-manifest.schema.json` and `tools/validate_lectures.py`.

## Required Structure

- `deck`: stable identity, archival PPTX source, and optional chooser output.
- `objectives`: stable IDs and student-facing objective text.
- `sessions`: output filename, time and slide limits, and ordered teaching blocks.
- `source_disposition`: one entry for every original PPTX slide.

Every teaching block records a stable ID, objective IDs, instructional phase,
component, minutes, source slide numbers, visible content, and optional hidden
answers, assets, verification items, independent audit identifiers, pacing
checkpoints, and instructor notes. Every session also records its reserved
buffer, stopping points, live-rehearsal state, and pilot candidacy.

Supported phases are `activate`, `explain`, `model`, `practice`, `feedback`,
and `synthesize`. Supported components are title, chapter, roadmap, concept,
formula, derivation, diagram, comparison, decision, worked example, practice,
misconception, poll, and summary.

The compiler rejects incomplete objective cycles, missing practice feedback,
unknown components, duplicate IDs, inaccessible assets, exposed solutions,
invalid source mappings, repeated layouts, forbidden “continued” titles, and
sessions outside their configured slide or time budgets.
Builds also reject sessions that fail to preserve a five-minute classroom
buffer or objectives without exactly one independent audit check.
