# Math 130 Canonical Lecture Workflow

The authored JSON files in `lectures/` are the only canonical content source.
Generated HTML, blueprints, coverage matrices, review packets, and status rows
must be refreshed from those manifests. PPTX and PDF files remain archival
evidence until the corresponding HTML session receives instructor approval.

## Commands

From `slides/`:

```powershell
npm run validate
npm run audit:math
npm run build
npm run qa
npm run qa:browser
```

`npm run verify` runs the complete sequence. The math audit independently
recomputes numeric results, checks symbolic conclusions, and records diagram
evidence before the compiler can build. Browser QA requires the pinned
development dependencies from `npm install --ignore-scripts`.

PPTX extraction is inventory-only and never writes a lecture manifest:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/run_python.ps1 `
  tools/extract_pptx_inventory.py Math130Unit2A.pptx
```

## Authoring

1. Edit the appropriate `lectures/Math130Unit*.json` file.
2. Validate against `lectures/lecture-manifest.schema.json` and the compiler's
   cross-field rules.
3. Map every source slide exactly once as retained or explicitly omitted.
4. Give every major objective the full instructional cycle:
   `activate`, `explain`, `model`, `practice`, `feedback`, `synthesize`.
5. Build the HTML and generated review artifacts.
6. Run static and browser QA before instructor review.

The seed utility is a one-time authoring aid. It refuses to overwrite manifests
unless `--force` is supplied and is not part of the normal build.

## Review Gate

Each session has:

- `migration/blueprints/<session>.md`
- `migration/review-packets/<session>.md`
- `migration/rehearsals/<session>.md`
- a row in `migration/review-status.csv`

The computational audit is recorded separately from instructor mathematical
verification. Every rehearsal packet reserves at least five minutes of class
buffer and identifies explicit pacing checkpoints. Live rehearsal and final
approval remain pending until the instructor records actual classroom evidence.

Unit 2A and Unit 3A are the initial classroom pilot decks. Their observation
and student-feedback instruments are generated under `migration/pilots/`.
Pilot acceptance must include actual projector and student-device use plus any
systemic corrections and retesting.

Unit 2C and Unit 2D publish two session decks and a stable chooser page. Their
legacy PDF links remain on the chooser until instructor approval is recorded.

## Browser Evidence

Browser QA opens every generated page offline at projector, laptop, tablet, and
phone dimensions. It checks overflow, console and request failures, answer
reveals, reset behavior, keyboard and touch navigation, session chooser links,
and representative screenshots for every component type. Evidence is written
to `migration/browser-qa/`.
