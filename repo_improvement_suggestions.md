# Repository Improvement Suggestions (Quick Audit)

This document captures high-impact improvements identified from a quick repository scan of HTML content and static assets.

## How this audit was done

- Reviewed top-level structure and representative site files.
- Ran an automated local-link existence check across all `*.html` files.
- Prioritized improvements by user impact and ease of implementation.

## Priority 1 — Broken links and placeholder URLs

1. **Replace unresolved placeholder links in `courses/math114.html`.**
   - The page contains many unresolved href targets such as `lecture_videos_link`, `extra_videos_link`, `one_page_summaries_link`, and `slides_link`.
   - Recommendation:
     - Replace placeholders with real URLs where available.
     - If links are intentionally pending, render them as disabled UI elements with clear “coming soon” text rather than active anchors.

2. **Fix missing auxiliary files referenced by `courses/Data Sheet for Electric Circuits.html`.**
   - This file references local assets in a `Data Sheet for Electric Circuits_files/` directory that is not present.
   - Recommendation:
     - Either commit the missing companion directory,
     - or regenerate/export the page as a self-contained HTML/PDF,
     - or remove stale references if no longer needed.

3. **Avoid unresolved template-style href output in rendered HTML (`130Test2.html`).**
   - A literal `${item.videoUrl}` link appears in output, indicating an unrendered template binding.
   - Recommendation:
     - Ensure build/render steps run before committing generated HTML.
     - Add a pre-commit check to catch `${...}` tokens in static output.

## Priority 2 — Quality gates and maintainability

4. **Add a lightweight link checker script to CI.**
   - This repo is static-content heavy; link drift is likely over time.
   - Recommendation:
     - Add a script (Python or Node) that validates local `href` and `src` targets and fails CI on missing files.
     - Optionally include external URL checks in a non-blocking mode.

5. **Create a “content status” convention for course pages.**
   - Some pages appear complete while others still contain placeholders.
   - Recommendation:
     - Add a small metadata badge near each course title: `Draft`, `In Progress`, or `Published`.
     - This prevents users from treating placeholder-heavy pages as complete resources.

6. **Normalize exported office artifacts.**
   - Mixed formats (`.doc`, `.html`, PDFs, and Office-exported HTML dependencies) increase maintenance overhead.
   - Recommendation:
     - Prefer canonical PDFs for static handouts.
     - Keep source files in a dedicated `source/` folder and publish only stable artifacts to user-facing directories.

## Priority 3 — Documentation and onboarding

7. **Promote a repository-focused README.**
   - Current `README.md` is the default profile template and does not explain this site structure.
   - Recommendation:
     - Replace with project README containing:
       - purpose of the site,
       - directory map (`courses/`, `projects/`, `pdfs/`, `slides/`),
       - update workflow,
       - validation commands.

8. **Document the publishing/update process.**
   - Recommendation:
     - Add a short `CONTRIBUTING.md` with:
       - how to add a new course page,
       - file naming conventions,
       - asset placement rules,
       - pre-publish checks.

## Suggested next sprint (small, high ROI)

- [ ] Resolve placeholders in `courses/math114.html`.
- [ ] Fix or replace `courses/Data Sheet for Electric Circuits.html` dependencies.
- [ ] Add an automated local-link checker and run it in CI.
- [ ] Replace top-level `README.md` with site-specific docs.

