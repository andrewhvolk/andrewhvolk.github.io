# Codebase Audit Follow-up Tasks

## Typo Fix
- **Issue:** The reference entry for Lund et al. in the APA references page misspells the journal title as "Journal of Academics Ethics" (extra "s").
- **Impact:** Introduces an inaccurate citation on a published references list.
- **Proposed Task:** Correct the journal title to "Journal of Academic Ethics" in `projects/Bootcamp2025/References.html`.

## Bug Fix
- **Issue:** The "ENGI 220" card on the learning resources page links to `engi220.html`, but that file does not exist in the repository.
- **Impact:** Users encounter a broken link when trying to access the Engineering Economy resources.
- **Proposed Task:** Either add the missing `engi220.html` resource page or update the link in `learn.html` to point to an existing resource.

## Documentation Discrepancy
- **Issue:** `website_improvements.md` claims that `projects.html` still contains placeholder cards with `#` links, but the page now lists real projects with working URLs.
- **Impact:** Maintainers reviewing the improvement checklist receive outdated guidance.
- **Proposed Task:** Update the documentation to accurately describe the current contents of `projects.html` and adjust any related recommendations.

## Test Improvement
- **Issue:** The `sortByTimeEstimate` helper in the TaskApp V3 Alpine component handles minutes, hours, and a "Supertask" sentinel, yet no automated test exercises these branches.
- **Impact:** Regressions in the custom parsing/ordering logic could slip by unnoticed.
- **Proposed Task:** Extend the TaskApp V3 test suite (e.g., add a Jest case in `__tests__`) to verify `sortByTimeEstimate` ordering for minutes, hours, missing estimates, and the "Supertask" label.
