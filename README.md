# Andrew H. Volk Teaching Site

This repository contains the source for a static academic website with course materials, projects, and professional information.

## Repository Structure

- `index.html`, `CV.html`, `club/index.html`, `projects.html`: core public pages.
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

## Home, About, and Course Pages (Jekyll)

GitHub Pages builds these pages with Jekyll from short data files, so routine
updates do not require editing HTML:

- `_data/courses.yml`: the courses listed on the home page each semester. Courses under `past`
  appear in a collapsed "Past courses" list below the current ones.
- `_data/profile.yml`: name, title, email, office, and shared links.
- `_data/math114.yml`: MATH 114 modules, due dates, slides, handouts, videos, and practice links.
- `_data/math130.yml`: MATH 130 units and quiz cycles in the same format. Its main unit slides go under
  `handouts` and dated class-session decks under `sessions`; the group names come from
  `handouts_label` and `sessions_label`. A date may add `time`
  (shown after the date) and a row may add `lesson_label` to rename its main button.
- `_data/physlab1.yml` and `_data/physlab2.yml`: one row per lab with its prelab quiz and report
  dates. A course may add `checklist` (shown as "Before lab"), and a row with no links shows as a
  plain row instead of one that opens.
- `_data/club.yml`: the Math Club page (`club/index.html`): introduction, upcoming events, teams,
  and honor societies. Each event needs a `name` and `date` and may add `time` and `text`. Once
  its date passes, an event moves into a collapsed "Past events" list on its own
  (`setupClubEvents()` in `theme.js`). Rooms are announced by email, so events list no room.
- `_layouts/hub.html` and `_layouts/course.html`: page templates. `_includes/` holds the footer and icons.
- `assets/css/pages-hub.css`: styles for these pages (scoped to `body.hub`), built into `styles.css` as usual.

To add another course page, copy `_data/math114.yml` to a new file such as
`_data/math130.yml`, then create the page with front matter only:

```yaml
---
layout: course
course: math130
title: "MATH 130: Advanced Technical Mathematics | Prof. Volk's Office"
description: "..."
---
```

The current module opens automatically based on today's date, and "Coming up"
lists the next six dated items (handled by `setupCourseHub()` in `theme.js`).
On the About page (`CV.html`), the CV download button appears once a PDF exists
at the `cv_pdf` path in its front matter.

All other HTML files have no front matter, so Jekyll copies them unchanged.

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
python scripts/check_course_dates.py
```

`check_course_dates.py` fails when the MATH 130 due dates in `_data/math130.yml` and the
`math130CanvasDueDates` list in `theme.js` disagree. Each new semester, update both.

## Site Navigation

Lesson, review, and lab manual pages use a compact bar at the top: a back link to
the course page (to the matching row, for example `/courses/math114.html#module-9`), a home
link, and the theme toggle. Copy that `<nav class="course-bar">` block from a neighboring page
when adding a new page. `learn.html` redirects to the home page. `contact.html` is the one place for email, office, and the booking link (from `_data/profile.yml`); other pages link to it.

The Math Club is one page, `club/index.html`, built from `_data/club.yml`. The older club pages
(`club/events.html`, `club/leadership.html`, `club/research.html`, `club/competition.html`,
`club/interdisciplinary.html`, `club/honor-societies.html`, and the five capitalized pages such as
`club/CompetitionTeam.html`) redirect to the matching section, for example `/club/#competition`.

## Notes

- Prefer canonical PDFs for finalized handouts.
- If a resource is not yet available, avoid placeholder links and show clear "coming soon" text.
