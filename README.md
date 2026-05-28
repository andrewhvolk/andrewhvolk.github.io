# Andrew H. Volk Teaching Site

This repository contains the source for a static academic website with course materials, projects, and professional information.

## Repository Structure

- `index.html`, `CV.html`, `learn.html`, `projects.html`: core public pages.
- `courses/`: course-specific pages, handouts, and lab resources.
- `pdfs/`: downloadable PDFs used by course and project pages.
- `slides/`: slide exports (`.pdf`, `.pptx`, image previews).
- `projects/`: project-specific assets and interactive pages.
- `styles.css`: generated canonical stylesheet loaded by the site.
- `assets/css/`: source CSS modules used to rebuild `styles.css`.
- `theme.js`: shared theme and navigation behavior.

## Updating Content

1. Edit the relevant HTML page (for example, `courses/math114.html`).
2. Add/update referenced assets in the matching directory (`pdfs/`, `slides/`, `projects/`, etc.).
3. Edit CSS in `assets/css/`, then run `python scripts/build_css.py` to regenerate `styles.css`.
4. Verify that all local links still resolve.
5. Commit and publish.

## Repository Conventions

- Use lowercase kebab-case for new HTML filenames (example: `simple-pendulum-lab-manual.html`).
- Use the `.html` extension (avoid `.htm`) for page files.
- Keep Office/Word export support bundles (for example, `*_files` directories) under `courses/legacy/` unless those assets are actively used by current pages.
- When renaming files or moving legacy assets, update all `href`/`src` references in related pages and metadata files.
- Keep shared JavaScript utilities at the repository root (for example, `theme.js`) and reference them from subdirectories with relative paths like `../theme.js` instead of duplicating script files.

## CSS Loading and CDN Policy

- Global stylesheet: use `/styles.css` as the canonical local stylesheet include.
- Third-party CSS: load only on pages that require the dependency (for example, KaTeX rendering or icon fonts).
- Approved CDN domains: `fonts.googleapis.com`, `cdn.jsdelivr.net`, and `cdnjs.cloudflare.com`.
- Version pinning: pin third-party library versions in CDN URLs (for example, `katex@0.16.9`, `font-awesome/6.4.0`) and avoid unversioned CDN package URLs.

### CSS Include Lint Check

Run this lightweight lint to catch stylesheet include issues:

```bash
python scripts/check_css_links.py
```

This check reports:
- non-canonical local stylesheet `href` values
- duplicate CDN variants for the same library

### CSS Build

`/styles.css` is generated for GitHub Pages compatibility. Do not edit it directly unless you are intentionally regenerating from the source modules.

```bash
python scripts/build_css.py
```

## Recommended Validation

Run these local checks before pushing:

```bash
python scripts/check_css_links.py
python scripts/check_links.py
python scripts/check_html_structure.py
```

## Notes

- Prefer canonical PDFs for finalized handouts.
- If a resource is not yet available, avoid placeholder links and show clear "coming soon" text.
