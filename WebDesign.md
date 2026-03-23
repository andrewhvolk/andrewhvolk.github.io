# Design System Strategy: High-End Editorial

## 1. Overview & Creative North Star: "The Digital Curator"

This design system is built upon the concept of **The Digital Curator**. It moves away from the sterile, modular appearance of standard SaaS platforms and toward the prestigious, tactile feel of a high-end private library. It balances the weight of history—represented by deep emeralds and scholarly serifs—with the "energetic professionalism" of vibrant blues and modern sans-serif layouts.

To achieve an editorial feel, we reject the rigid 12-column "box" mentality. Instead, we embrace **intentional asymmetry** and **breathable whitespace**. Content should feel "placed" rather than "pushed." By using significant vertical offsets and overlapping elements, we create a sense of depth that feels custom-built and authoritative.

**Clarification:** asymmetry is a tool for emphasis, not a requirement on every page or in every section. Use it to create hierarchy, spotlight a key idea, or give a hero area an authored feel. For long-form reading, straightforward single-column layouts are often the better editorial choice.

---

## 2. Colors & Tonal Depth

Our palette is rooted in nature and academia, utilizing deep scholarly tones contrasted against airy, sun-drenched neutrals.

### The "No-Line" Rule

**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for defining sections or containers.

- Boundaries must be achieved through **Background Shifts**. For example, a `surface-container-low` (#f2f4f1) section should sit directly against a `surface` (#f8faf7) background.
- High-contrast transitions (e.g., `primary-container` #00342b next to `surface-bright`) provide the "energetic" edge requested without the clutter of lines.

### Surface Hierarchy & Nesting

Treat the interface as a physical stack of fine parchment. Use the surface tiers to create depth:

- **Base Layer:** `surface` (#f8faf7) for the primary canvas.
- **Mid Layer:** `surface-container-low` (#f2f4f1) for secondary content zones.
- **Top Layer:** `surface-container-lowest` (#ffffff) for the most prominent interactive cards, creating a subtle "lift" against the off-white background.

### Signature Textures & Gradients

Flat color is the enemy of prestige.

- **The Library Glow:** Use subtle radial gradients on hero backgrounds, transitioning from `primary` (#001d17) to `primary-container` (#00342b) to mimic the way light hits a leather-bound book.
- **Vibrant Accents:** Use the `secondary` blue (#0d50d5) sparingly for high-action CTAs or data highlights to inject "energetic professionalism" into the scholarly emerald base.

---

## 3. Typography: The Editorial Voice

The tension between the serif and sans-serif defines our brand's personality.

- **Display & Headlines (Newsreader):** This is our "Academic Authority." Use `display-lg` (3.5rem) with tighter letter-spacing for a high-fashion editorial look. Newsreader should always feel "roomy"—give it ample margin-bottom (`spacing-8` or `spacing-10`) to let the letterforms breathe.
- **Titles & Body (Inter):** This is our "Modern Precision." Inter provides the functional clarity required for high-density information.
- **The Hierarchy Rule:** Never use Newsreader for body text; its elegance is lost at small scales. Never use Inter for main Page Titles; it lacks the required prestige.

---

## 4. Reading Experience

Long-form educational pages must read as comfortably as a printed essay or carefully typeset manual, not as compressed marketing copy.

### Measure & Line Length

- Default body-copy measure should land around **60–72 characters per line**.
- In implementation terms, aim for a text column of roughly **42rem to 48rem max width** for paragraph-heavy sections.
- Wider page shells are acceptable, but the reading column itself should remain controlled even when media, side notes, or tools sit beside it.

### Paragraph Spacing

- Use a default paragraph rhythm of **0.9rem to 1.25rem** between paragraphs, with enough separation to scan without creating a disconnected, "bullet-point" feel.
- Paragraph spacing should usually be **smaller than heading-to-paragraph spacing**, so the reader can distinguish a new thought from a new section.

### Heading Spacing Rhythm

- Headings should create a predictable vertical rhythm:
  - **H1 / page title:** generous separation from following copy (`spacing-8` to `spacing-10`).
  - **H2:** typically `spacing-10` or `spacing-12` above, `spacing-4` to `spacing-5` below.
  - **H3:** typically `spacing-8` above, `spacing-3` to `spacing-4` below.
- Avoid stranded headings. A heading should visually attach to the content that follows more strongly than to the block above it.

### Body-Copy Links

- Links inside running text must remain clearly identifiable **without relying on color alone**.
- Default treatment for body-copy links should be a tasteful underline or underline-like affordance, using the accent blue (`secondary`) as the primary signal.
- Hover states may shift toward `tertiary` or deepen the underline treatment, but links should still look like links at rest.
- On dense course pages, avoid making inline links look like buttons; they should remain typographic.

### Lists for Instructional Content

- Instructional lists should prioritize **scanability, nesting clarity, and step order**.
- Ordered lists should be preferred for procedures, labs, and assignments with sequence.
- Unordered lists are acceptable for concept summaries, reading goals, or resource groupings, but they should still show visible structure rather than collapsing into plain paragraphs.
- Use comfortable item spacing (`spacing-2` to `spacing-4`) and allow nested lists to indent cleanly.
- If global styles suppress bullets, instructional contexts should restore meaningful markers or numbers so the structure remains obvious.

### Theme Modes & Long-Form Reading

- The light/dark toggle should change **tone**, not the core readability contract. Measure, spacing, hierarchy, and link affordances should remain consistent across modes.
- **Light mode** remains the default expression of the "sun-drenched parchment" brand and should be preferred for marketing/editorial storytelling.
- **Dark mode** should reduce glare for prolonged reading or tool use, especially on course pages and interactive review pages, without becoming pure-black or neon-heavy.
- In dark mode, body copy should stay high-contrast against deep, softened surfaces; long paragraphs should not sit on harsh black backgrounds or inside overly glossy cards.
- Accent usage should usually become slightly more restrained in dark mode: preserve the blue for links, focus, and key actions, but avoid saturating entire long-form sections with bright chroma.
- If a page uses tonal layers, ensure the dark-mode version preserves the same hierarchy with adjusted surface tokens rather than inventing an unrelated visual system.

---

## 5. Accessibility Guardrails

Prestige is only successful if the interface remains legible, navigable, and low-friction over long sessions.

### Minimum Contrast

- Body text and essential UI text should meet at least **WCAG AA contrast expectations**.
- This applies in both light mode and dark mode; the theme toggle must not create a lower-readability variant of the same page.
- Large display text may use more expressive tonal shifts, but only if readability remains strong against its background.
- Decorative emerald-on-emerald or muted-on-parchment combinations are acceptable only for non-essential ornament, never for critical instructions or metadata needed to complete a task.

### Keyboard Focus Principles

- Every interactive element must have a **clearly visible focus state** that is at least as obvious as hover.
- Focus styling should respect the system aesthetic by using accent color, tonal shift, glow, or ghost-outline logic—but it must remain unmistakable.
- Do not hide focus rings on links, buttons, form controls, or custom widgets simply for visual neatness.

### Motion & Animation Restraint

- Long educational pages should feel calm. Motion should support orientation, not spectacle.
- Prefer subtle fades, color transitions, or small positional shifts over large parallax, scroll-driven theatrics, or persistent animated backgrounds.
- Animation should be brief, infrequent, and easy to ignore; avoid repeating motion near body copy.
- For long pages, honor reduced-motion preferences and treat them as a first-class requirement.

### When a Subtle Boundary Is Allowed

- A subtle boundary is allowed when it materially improves usability: for example, clarifying form fields, separating sticky navigation from content, defining draggable or interactive regions, or preserving table/list comprehension.
- When needed, the boundary should use the existing **ghost-border** logic (`outline-variant` at low opacity) or a tonal surface change before resorting to a conventional rule.
- The goal is not border purity for its own sake; the goal is calm, usable separation.

---

## 6. Elevation & Depth: Tonal Layering

We do not use shadows to create hierarchy; we use light and opacity.

### The Layering Principle

Stacking tiers is the primary method of elevation. To highlight a specific piece of content, do not add a shadow. Instead, shift the background color of that container to `surface-container-highest` (#e1e3e0) while the surrounding content remains on `surface`.

### Glassmorphism & Ambient Light

For floating menus or sticky headers:

- Use `surface-container-lowest` (#ffffff) at **85% opacity** with a **20px backdrop-blur**.
- This creates a "frosted glass" effect that allows the rich `primary-container` emeralds to bleed through, softening the interface.

### The "Ghost Border" Fallback

If a border is legally or functionally required for accessibility, use the `outline-variant` token (#c0c8c4) at **15% opacity**. It should be felt, not seen.

---

## 7. Components & Primitive Styling

### Buttons: The Signature Action

- **Primary:** `primary-container` (#00342b) background with `on-primary` (#ffffff) text. Use `rounding-md` (0.75rem). Add a subtle inner-glow gradient (top-to-bottom) for a "pressed silk" feel.
- **Secondary:** Use the vibrant `secondary` blue (#0d50d5) for conversion-focused actions.
- **Tertiary:** No background. `primary` text with an underline that only appears on hover.

### Cards & Lists

- **Cards Are Selective, Not Default:** Cards are an emphasis tool, not the baseline layout primitive. Use them for featured content, interaction affordances, compact previews, or places where a distinct surface materially helps comprehension.
- **No Dividers:** Forbid the use of 1px lines between list items in editorial and marketing layouts. Use `spacing-4` (1.4rem) gaps or alternating subtle background shifts (`surface-container-low` vs `surface-container`).
- **Instructional Exception:** In course and manual contexts, prioritize comprehension over purity; visible markers, numbering, or very subtle separators may be used when they improve step tracking.
- **Hierarchy Before Uniformity:** When content has a clear primary/secondary relationship, express it through composition, scale, spacing, and placement before reaching for equal card grids.
- **Equal Cards Only for True Peers:** Use a uniform card grid only when items are genuinely parallel, equally important, and benefit from side-by-side comparison.
- **Asymmetric Cards:** When cards are appropriate, experiment with image placement that breaks the card boundary, using the `rounding-lg` (1rem) on the container but keeping the image sharp-edged or differently rounded.

### Input Fields

- **Styling:** Use a `surface-container-highest` (#e1e3e0) background. No bottom border.
- **Focus State:** Transition the background color to `surface-container-lowest` and add a 2px "Ghost Border" using the `secondary` blue at 40% opacity.

---

## 8. Page Type Adaptation

The system should flex by page purpose. Not every page needs the same density, asymmetry, or dramatic treatment.

### Marketing / Editorial Pages (e.g. `index.html`)

- Lean hardest into the cinematic editorial voice: dramatic hero treatments, strong tonal layering, selective asymmetry, and larger vertical whitespace.
- Use display typography and gradients to establish prestige and memorability.
- Keep supporting copy readable, but allow more visual staging and surprise than on academic utility pages.
- Prefer a **staged-discovery** structure: one primary hero, one dominant next-step section, and one quieter supporting section.
- Do not give every homepage destination equal visual weight if user intent has a likely priority order. A homepage should visibly lead visitors toward the most useful first action.
- Supporting destinations should usually appear as companion blocks, link columns, or quieter secondary modules rather than as peers to the main path.
- Avoid stacking multiple promo bands that repeat the same message in slightly different wording. Each homepage section should have a distinct communication job.
- Preferred homepage patterns include: hero + featured path, hero + split narrative/utility rail, and hero + editorial link columns.
- Avoid defaulting to repeated three-up card rows on editorial landing pages unless the items are truly parallel.

### Profile / CV Pages

- Preserve polish and authority, but reduce flourish in favor of trust, clarity, and quick scanning.
- Asymmetry can help spotlight credentials or featured sections, yet the core résumé/CV structure should remain orderly.
- Metadata, dates, institutional affiliations, and contact information should feel precise and easy to scan.
- Prefer chronological or category-based document flow over dashboard-style panel collections.
- Use cards sparingly on profile/CV pages; most sections should read as structured text, grouped lists, timeline rows, or metadata rails.
- Align dates, titles, and institutions into a predictable scanning pattern across sections so the page behaves like a professional record rather than a marketing surface.
- Reserve stronger visual treatment for the identity header, summary/facts rail, and a small number of featured distinctions.
- Preferred CV patterns include: identity header + summary + metadata rail, single-column chronology with occasional side notes, and grouped list/timeline hybrids.
- Avoid nested card groups, over-panelization, or application-like navigation unless the content volume genuinely demands it.

### Content-Dense Course and Lab-Manual Pages under `courses/`

- These pages should optimize for **reading endurance and instructional clarity** first.
- Favor restrained asymmetry or even symmetric single-column layouts for dense prose.
- Increase structural cues: clearer section headings, stronger list treatment, dependable link styling, and predictable spacing between instructions, examples, and notes.
- Decorative gradients and deep emerald blocks should be used more sparingly so they do not exhaust the reader over long sessions.

### Interactive Tool / Review Pages

- Balance editorial style with operational clarity.
- Tool chrome, controls, output panels, and feedback states should prioritize usability and focus handling over atmospheric composition.
- Use surface layering and restrained accent color to separate controls from results, and allow subtle boundaries when interaction would otherwise become ambiguous.

### Layout Anti-Patterns to Avoid

- Avoid pages composed primarily of repeated, equal-weight cards when the content has a clear hierarchy.
- Avoid stacking multiple promo bands or intro blocks that restate the same value proposition in slightly different wording.
- Avoid turning profile or CV pages into dashboard-style panel collections; credentials should scan as structured information, not as feature marketing.
- Avoid giving every destination the same visual weight. Editorial pages should establish a primary path, then secondary and tertiary paths.
- Avoid using card grids as a default layout primitive. Use them only when the items are truly parallel and benefit from equal treatment.
- Avoid "boxiness by accumulation": even tasteful containers can recreate a modular SaaS feel when too many appear adjacent to one another.

### Content Hierarchy Before Components

Before choosing cards, panels, rails, or grids, determine:

1. What is the single primary action or takeaway on this page?
2. What content is secondary support rather than the main destination?
3. What can be demoted to text links, compact lists, or side notes?
4. Which content is sequential, and which is genuinely parallel?

Layout should reflect those answers. Components exist to reinforce hierarchy, not replace it. When refactoring an existing page, prefer removing or collapsing containers before inventing new ones. A successful editorial refactor often has fewer boxes, fewer repeated intros, and stronger visual priority.

---

## 9. Mapping Design Language to Existing CSS Primitives

To keep implementation aligned with the current codebase, prefer the tokens and primitives already established in `styles.css`.

- **Scholarly emerald base / authority text:** `--primary`, `--primary-container`, `--on-surface`.
- **Energetic professional accent:** `--secondary` for actions, links, focus, and highlights.
- **Sun-drenched parchment surfaces / dark reading surfaces:** `--surface`, `--surface-container-low`, `--surface-container-lowest`, `--surface-container-highest`, with dark-mode overrides under `:root[data-theme="dark"]`.
- **Editorial typography split:** `--font-display` / `--type-display-family` for titles; `--font-body` / `--type-body-family` for reading text.
- **Readable rhythm:** `--line-height-body`, `--spacing-3`, `--spacing-4`, `--spacing-5`, `--spacing-8`, `--spacing-10`, `--spacing-12`, and `--section-space`.
- **Soft prestige effects:** `--gradient-library-glow`, `--glass-surface`, `--ghost-outline`, `--ambient-outline`, and the shared `--transition` timing.
- **Rounded editorial surfaces:** `--radius-md`, `--radius-lg`, and `--radius-pill`.

When translating this document into CSS, prefer composing with those variables before inventing new tokens. If a page type needs different spacing or measure, derive it from the existing scale so the site still feels like one system. The nav-bar theme toggle should primarily swap token values and gradients, not introduce a separate readability model for dark mode.

---

## 10. Do’s and Don’ts

### Do:

- **Do** use asymmetrical layouts when they create a clearer focal point, stronger hierarchy, or more memorable editorial composition.
- **Do** use straightforward, highly readable single-column structures when the content is long, technical, or instructional.
- **Do** use large amounts of "Sun-Drenched" whitespace (`spacing-20` or `spacing-24`) between major sections on marketing/editorial pages, then scale that rhythm down appropriately for denser academic pages.
- **Do** use `tertiary` (Burnt Earth #3e271f) for small, scholarly details like captions, "Published on" dates, or metadata labels.
- **Do** establish hierarchy before choosing components: decide what is primary, secondary, and optional before reaching for cards or grids.
- **Do** let fewer, larger compositional moves carry the page before introducing additional containers.

### Don’t:

- **Don’t** use pure black (#000000). Use `on-surface` (#191c1b) for readability.
- **Don’t** use standard "Drop Shadows." If you must lift an object, use an ambient blur tinted with `surface-tint` (#3a665c) at 5% opacity.
- **Don’t** crowd the "Scholarly Emerald." It is a heavy color; balance it with at least 60% neutral `surface` colors to maintain the "sun-drenched" feel.
- **Don’t** force asymmetry into every page or every section; unnecessary tension harms readability.
- **Don’t** default to visible borders when spacing, surface shifts, or a ghost-outline will solve the problem more elegantly.
- **Don’t** build editorial pages as a sequence of interchangeable, equal-weight cards.
- **Don’t** default to repeated three-column promo bands on homepages when one path is clearly primary.
- **Don’t** make every major destination look equally important if users should be guided toward a likely next step.
- **Don’t** wrap every CV subsection in its own panel if spacing, typography, or timeline structure would communicate the content more clearly.
- **Don’t** confuse modularity with hierarchy; reusable components should support the information architecture rather than flatten it.
