# Standalone Page Shell Review

This review classifies pages that previously had no shared stylesheet link, top navigation, or breadcrumb.

## Integrated into the site shell

- `Unit3Practice.html` — integrated as a user-facing MATH 130 practice resource with shared stylesheet, top nav, and breadcrumb.
- `courses/114-module1-summary.html` — integrated as a user-facing MATH 114 module summary while preserving print-friendly formatting.
- `courses/final-exam-review-guide.html` — integrated as a user-facing MATH 114 exam-prep page while retaining its Tailwind-based content styling.
- `courses/knowledgegrowth.html` — integrated as a user-facing MATH 114 growth-model review page while retaining interactive reveal behavior.
- `courses/math114Spring26Links.html` — integrated as a user-facing MATH 114 assignment-links hub while retaining its table-first layout.

## Kept intentionally standalone

- `projects/NormalDistributionGame.html` — kept standalone because it is a self-contained interactive classroom activity.
- `projects/PHYS103LUO/KinematicsShortAnswer.html` — kept standalone because it is a long-form tutorial/handout with its own internal navigation.
- `projects/PrayerAppV1/index.html` — kept standalone because it functions as a focused single-page app.
- `projects/QuestionSpinner/questionspinner.html` — kept standalone because it is a demo-style game that should open directly into gameplay.

## Documentation approach

For each intentionally standalone project page, a maintainer comment was added near the top of the file documenting that the page should remain independent unless it is fully redesigned into the shared site shell.
