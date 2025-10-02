# Website Improvement Proposal

Based on a review of the website files (`index.html`, `CV.html`, `projects.html`, `learn.html`, `mathclub.html`, `styles.css`), here are some potential areas for improvement:

## 1. Content & Structure

*   **Projects Page (`projects.html`):**
    *   The page now highlights real initiatives including an Undergraduate Math Journals guide, TaskAppV3, and PrayerAppV1, each linked to live resources.
    *   **Suggestion:** Continue updating the project cards as new work is published and consider adding brief metrics or outcomes (e.g., user adoption, publication venues) to showcase impact.
*   **Learning Resources (`learn.html`):**
    *   The ENGI 220 card now links to `courses/engi220.html`, providing a high-level course overview and curated external references.
    *   **Suggestion:** Add downloadable course documents (syllabus, assignment templates) directly to the new page and continue enriching other course pages with concrete study aids.
*   **CV Page (`CV.html`):**
    *   The page is very comprehensive but long. The sticky navigation helps, but users might still find it dense.
    *   **Suggestion:** Consider minor restructuring or visual breaks. Perhaps use accordions for lengthy sections like "Professional Experience" or "Conference Presentations" to make the initial view less overwhelming.
*   **Consistency:**
    *   The `shortcut-bar` is present on most pages but styled slightly differently than the main navigation on `CV.html`. While functional, this creates a slight visual inconsistency.
    *   **Suggestion:** Decide on a primary navigation pattern. Either integrate the shortcut bar icons into the main navbar design (especially on `CV.html`) or ensure the shortcut bar is consistently placed and styled across *all* pages, perhaps replacing the dropdown nav on `CV.html` for simplicity if desired. The current `CV.html` has *both* the shortcut bar *and* a separate sticky dropdown nav.

## 2. Design & User Experience (UX)

*   **Navigation:**
    *   On `CV.html`, the combination of the top `shortcut-bar` and the sticky `navbar` with dropdowns might be redundant or confusing.
    *   **Suggestion:** Consolidate navigation. Either remove the `shortcut-bar` from `CV.html` (relying solely on the dropdown nav) or replace the dropdown nav with the `shortcut-bar` for consistency with other pages.
    *   On mobile, the dropdown menus in `CV.html` require a click to open, which is good, but ensure the interaction is smooth and intuitive.
*   **Visual Hierarchy:**
    *   While the use of cards is effective, ensure consistent spacing and alignment, especially on pages with fewer cards.
    *   **Suggestion:** Review padding and margins across different screen sizes to maintain visual balance.
*   **Icons:**
    *   The emoji icons used in cards and shortcut bars are functional but might lack professional polish compared to a dedicated icon font (like Font Awesome, which is already used on `CV.html`).
    *   **Suggestion:** Replace emoji icons with Font Awesome icons for a more consistent and potentially sharper look. Ensure proper `aria-label` attributes are maintained for accessibility.

## 3. Technical & Performance

*   **CSS Structure (`styles.css`):**
    *   The CSS is well-organized with variables and comments.
    *   The use of `@keyframes fadeIn` adds a nice touch, but ensure it doesn't negatively impact perceived performance, especially on complex pages.
    *   The mobile navigation JavaScript in `CV.html` (lines 497-541) could potentially be moved to a separate `.js` file for better organization, though it's simple enough to remain inline.
*   **Image Optimization:**
    *   The `headshot150.jpg` is explicitly sized to 150px via CSS (`.profile-image`).
    *   **Suggestion:** Ensure the actual image file (`headshot150.jpg`) is optimized for the web (correct dimensions, compression) to avoid unnecessary loading time. Check other images if they are added later (e.g., for projects).
*   **Accessibility:**
    *   Good use of `aria-label` attributes on icon links.
    *   Semantic HTML (like `<nav>`, `<header>`, `<main>`, `<footer>`, `<section>`) is used well.
    *   Color contrast seems generally good, but double-check contrasts, especially with the primary/accent colors against backgrounds, using accessibility tools.
    *   The `:focus` style provides a basic outline.
    *   **Suggestion:** Enhance the `:focus` style for better visibility (e.g., thicker outline, different color). Test navigation using only the keyboard. Ensure dropdowns are fully keyboard-navigable.
*   **SEO:**
    *   `CV.html` has good meta description and keywords.
    *   **Suggestion:** Add relevant meta descriptions and keywords to other pages (`index.html`, `learn.html`, `projects.html`, `mathclub.html`) to improve search engine visibility.

## 4. Code Maintainability

*   **CSS Variables:** Excellent use of CSS variables for theming.
*   **File Structure:** The separation into HTML files and a single CSS file is clear. The `courses` directory structure is logical.
*   **Suggestion:** As the site grows, consider splitting `styles.css` into smaller, more focused files (e.g., `base.css`, `layout.css`, `components.css`) and using a build tool or `@import` if complexity increases significantly. For now, the single file is manageable.