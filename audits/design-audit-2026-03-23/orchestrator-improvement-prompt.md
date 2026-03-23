# Orchestrator Prompt: Plan the Next Design-Audit Improvements

Use the repository audit artifacts from `audits/design-audit-2026-03-23/` to produce a concrete improvement plan for the **next audit cycle**.

## Context
You are not starting from scratch. A first-pass repo-wide design audit has already been created with these files:

- `audits/design-audit-2026-03-23/README.md`
- `audits/design-audit-2026-03-23/page-summary.csv`
- `audits/design-audit-2026-03-23/family-summary.csv`
- `audits/design-audit-2026-03-23/issue-summary.csv`
- `DesignAudit.md`
- Shared-system source files that influence many pages:
  - `styles.css`
  - `theme.js`

## Your assignment
Create a **planning document only** for how to improve and deepen the audit. Do **not** redesign pages yet. Do **not** rewrite the existing audit from scratch. Build on it.

## What to evaluate
1. **Audit completeness gaps**
   - Identify what the previous pass did well.
   - Identify what it did not yet do because it was a fast triage/inventory pass.
   - Call out any fields missing from the CSV outputs that would be needed for full rubric scoring.

2. **Framework compliance gaps**
   - Compare the current artifacts to `DesignAudit.md`.
   - Explicitly check whether the current outputs fully satisfy:
     - required page states,
     - required setup metadata,
     - page-type handling,
     - non-negotiable score caps,
     - evidence recording structure,
     - reporting-format consistency.
   - Distinguish between:
     - acceptable fast-pass omissions,
     - issues that should be fixed in the audit artifacts themselves,
     - issues that require rendered browser review rather than source inspection.

3. **Improvement opportunities in the audit outputs**
   - Recommend how to evolve the current files so they can better support:
     - page-level Markdown audit reports,
     - canonical CSV rows for full scoring,
     - family-level synthesis,
     - remediation tracking over multiple audit cycles.
   - Be specific about columns, sections, and data structures to add or revise.

4. **Representative-page strategy**
   - Reassess whether the selected representative pages are sufficient.
   - If not, propose a revised sample set by family.
   - Explain why each added or removed page changes coverage quality.

5. **Execution roadmap for the next pass**
   - Produce a sequenced plan for the next audit cycle.
   - Separate work into:
     - source-analysis tasks,
     - rendered-review tasks,
     - shared-system checks,
     - page-family deep dives,
     - remediation follow-up.
   - Identify dependencies and which tasks should happen first.

## Constraints
- Use **evidence-first reasoning**.
- Reference the existing files directly.
- Preserve the distinction between:
  - page-specific issues,
  - template-family issues,
  - shared-system issues.
- Respect the `DesignAudit.md` rules for page types and score caps.
- Assume the prior pass was intentionally limited by lack of browser/state-capture tooling.
- If you recommend new output formats or schema changes, keep them convertible across Markdown and CSV.

## Required output format
Return the result as a Markdown planning memo with these sections:

1. `## What the current audit already provides`
2. `## Gaps against DesignAudit.md`
3. `## Recommended changes to audit artifacts`
4. `## Revised representative sample set`
5. `## Next audit-cycle execution plan`
6. `## Risks if the current audit is left as-is`
7. `## Suggested deliverables for the next PR`

## Strong preference
When making recommendations, refer to exact filenames and be explicit about whether the recommendation should modify:
- `README.md`
- `page-summary.csv`
- `family-summary.csv`
- `issue-summary.csv`
- or create new files such as per-page Markdown reports or full-score CSVs.
