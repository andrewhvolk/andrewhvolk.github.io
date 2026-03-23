# Design Audit Framework

This document translates `WebDesign.md` into a highly repeatable evaluation system with the explicit goal of **extremely high interrater reliability**. It is designed so that multiple reviewers can score the same page and arrive at similar conclusions because the rubric:

- defines exactly **what is being measured**,
- separates **observable evidence** from interpretation,
- uses **behavioral anchors** for each score,
- requires reviewers to evaluate the same page states,
- uses a fixed scoring workflow, and
- standardizes how findings are recorded.

Use this framework to audit any webpage for alignment with the design philosophy in `WebDesign.md`.

---

## 1. Audit Goal

The goal of this audit is to measure how well a webpage aligns with the design philosophy described in `WebDesign.md`, especially its emphasis on:

- editorial composition over generic SaaS modularity,
- hierarchy before components,
- readability and long-form comfort,
- tonal layering over borders and shadows,
- page-type adaptation,
- accessibility and calm usability.

This framework is not a general usability test, brand study, or code review. It is specifically a **design-alignment audit**.

---

## 2. Reliability Rules

To maximize interrater reliability, all reviewers must follow these rules.

### 2.1 Evaluate the Same States

Every reviewer must inspect the same page states when available:

1. **Desktop light mode**
2. **Desktop dark mode**
3. **Mobile light mode**
4. **Mobile dark mode**
5. **Keyboard focus states**
6. **Hover states** for major links/buttons/cards

If a state does not exist, mark it **Not Present** rather than inferring.

### 2.2 Use Only Observable Evidence

Reviewers must score based on visible evidence. Do not infer intent from code, brand strategy, or assumptions about future design plans.

- Allowed: “The page uses visible 1px dividers between section blocks.”
- Not allowed: “The designer probably intended those dividers only temporarily.”

### 2.3 Score the Page as Rendered

Score the actual page appearance and behavior, not the design system tokens or implementation approach behind it.

- If a page visually aligns with the philosophy, score the visible result positively.
- If a page uses the right tokens but produces a poor visual result, score the visible result negatively.

### 2.4 Do Not Average Different Impressions Into One Score

For each rubric category, reviewers must first answer the required checklist items, then assign a score using the category anchors. Do not start with a gut feeling and backfill the checklist.

### 2.5 Record Evidence Before Finalizing the Score

Each category requires written evidence. A score without evidence is incomplete and should not be used.

### 2.6 Separate “Not Present” From “Poor”

If a criterion is not applicable to the page type, do not treat absence as failure. Use the page-type rules in this document.

Example:
- A CV page should not be penalized for lacking a dramatic cinematic hero.
- A marketing homepage may be penalized for lacking a clear primary visual path.

### 2.7 Use the Defined Severity Thresholds

All recommendations must be tagged using the same severity definitions:

- **Critical:** blocks comprehension, accessibility, or primary user task
- **High:** meaningfully harms alignment or hierarchy
- **Medium:** noticeable but not structurally damaging
- **Low:** polish-level improvement

---

## 3. Required Audit Setup

Before scoring, capture the following:

- **Page URL or file path**
- **Page type**
- **Viewport sizes reviewed**
- **Theme modes reviewed**
- **Date of review**
- **Reviewer name**

### 3.1 Page-Type Classification

Choose exactly one primary page type:

1. **Marketing / Editorial**
2. **Profile / CV**
3. **Course / Lab Manual / Long-form Instruction**
4. **Interactive Tool / Review / App-like Utility**

If a page is hybrid, pick the dominant type and note the secondary type in the comments.

### 3.2 Standard Viewports

Unless there is a project-specific requirement, reviewers should use:

- **Desktop:** 1440px wide
- **Mobile:** 390px wide

### 3.3 Audit Sequence

Always evaluate in this order:

1. First impression
2. Information hierarchy
3. Reading experience
4. Surface and boundary treatment
5. Component usage
6. Accessibility and interaction states
7. Theme consistency
8. Page-type fit

Using the same sequence reduces anchoring bias and improves consistency.

---

## 4. Scoring Model

The audit uses a **100-point weighted rubric**. Each category is scored on a **1–5 scale** using behavioral anchors. Then multiply by the category weight.

### 4.1 Score Meanings

- **5 — Strongly aligned:** almost all relevant indicators are present; any issues are minor
- **4 — Mostly aligned:** clear alignment with a few moderate issues
- **3 — Partially aligned:** mixed execution; meaningful strengths and weaknesses coexist
- **2 — Weakly aligned:** more indicators fail than pass; philosophy is present only faintly or inconsistently
- **1 — Misaligned:** page visibly contradicts the design philosophy in major ways

### 4.2 Weighted Categories

| Category | Weight |
|---|---:|
| A. Editorial Identity & Brand Tone | 15 |
| B. Information Hierarchy & Compositional Clarity | 20 |
| C. Reading Experience & Typographic Rhythm | 20 |
| D. Surface, Depth & Boundary Discipline | 15 |
| E. Component Restraint & Layout Discipline | 10 |
| F. Accessibility & Usability Guardrails | 10 |
| G. Theme Consistency Across Light/Dark Modes | 5 |
| H. Page-Type Fit | 5 |

---

## 5. Non-Negotiable Failure Conditions

These conditions automatically cap certain category scores to reduce reviewer drift.

### 5.1 Accessibility Cap

If any of the following are true, **Accessibility & Usability Guardrails** cannot score above **2**:

- keyboard focus is absent or effectively invisible on major interactive elements,
- body text is difficult to read because of low contrast,
- motion substantially distracts from reading and reduced-motion support is absent,
- interactive controls are visually ambiguous in a way that blocks task completion.

### 5.2 Reading Experience Cap

If long-form body text exceeds comfortable reading measure across most of the page, or headings and body spacing are so inconsistent that structure becomes difficult to scan, **Reading Experience & Typographic Rhythm** cannot score above **2**.

### 5.3 Surface Discipline Cap

If the page relies heavily on visible borders/dividers or conventional drop shadows for primary structure, **Surface, Depth & Boundary Discipline** cannot score above **2**.

### 5.4 Hierarchy Cap

If a reviewer cannot confidently identify the page’s primary action or primary takeaway within the first screenful, **Information Hierarchy & Compositional Clarity** cannot score above **2**.

These caps should be applied consistently by all reviewers.

---

## 6. Category Rubric With Behavioral Anchors

Each category below includes:

- what the reviewer is measuring,
- required checklist items,
- scoring anchors,
- page-type interpretation notes.

---

## A. Editorial Identity & Brand Tone — 15 points

### What is being measured
Whether the page expresses the “Digital Curator” philosophy: editorial, prestigious, composed, scholarly, and intentional rather than generic or modular.

### Required checklist
Mark each as **Yes**, **No**, or **Not Applicable**.

1. The page avoids a generic SaaS or dashboard feel.
2. The page feels intentionally composed rather than assembled from interchangeable modules.
3. Typography supports a high-end editorial tone.
4. Color and tonal choices support the scholarly/parchment/emergent-accent brand.
5. The page has at least one memorable editorial move appropriate to its page type.

### Scoring anchors

**5**
- Strong editorial character is immediately apparent.
- The page feels authored and distinctive.
- Typography, color, spacing, and composition reinforce the same tone.
- No generic template feel is present.

**4**
- Editorial tone is clear and mostly consistent.
- Some areas feel more generic than others, but the page still reads as aligned.

**3**
- The page contains some on-brand cues, but they compete with generic patterns.
- A reviewer can see the intended philosophy, but it is not fully realized.

**2**
- The page feels mostly generic, modular, or product-template-like.
- Editorial cues are weak, isolated, or token-level only.

**1**
- The page clearly contradicts the intended brand tone.
- It reads as conventional app UI, commodity marketing, or visually incoherent styling.

### Page-type notes
- Marketing/editorial pages are expected to score highest here.
- Tool pages may be calmer, but they should still avoid generic SaaS styling.
- Course/manual pages should feel restrained, not theatrical, but still intentional.

---

## B. Information Hierarchy & Compositional Clarity — 20 points

### What is being measured
Whether the page clearly communicates what matters most and uses composition to establish priority before components do.

### Required checklist
1. The primary action or takeaway is identifiable within the first screenful.
2. Secondary content is visibly demoted relative to the primary content.
3. Items that are not true peers are not given equal visual weight.
4. Asymmetry, if used, improves hierarchy rather than adding noise.
5. The page avoids repeated equal-weight blocks that flatten importance.
6. The order of sections supports the likely user journey.

### Scoring anchors

**5**
- The page has a crystal-clear focal point.
- Primary, secondary, and tertiary content are unmistakably differentiated.
- The composition directs attention naturally.
- No flattening patterns undermine the information architecture.

**4**
- Hierarchy is clear overall.
- Some secondary areas may be slightly too prominent, but user priority is still obvious.

**3**
- The reviewer can determine the likely hierarchy, but several sections compete too strongly.
- Some flattening or repeated-card patterns weaken clarity.

**2**
- Hierarchy is weak or inconsistent.
- A reviewer hesitates when identifying the primary path.
- Too many sections appear equally important.

**1**
- The page lacks a clear primary focus.
- Composition actively obscures priority.
- The user is left to infer importance without visual guidance.

### Page-type notes
- Homepages should strongly guide users toward a likely next step.
- CV pages should create scan hierarchy through chronology, metadata structure, and selective emphasis.
- Course pages should privilege instructional sequence over visual drama.

---

## C. Reading Experience & Typographic Rhythm — 20 points

### What is being measured
Whether the page supports comfortable sustained reading with controlled measure, stable spacing, legible type choices, and clear inline semantics.

### Required checklist
1. Paragraph-heavy content uses a controlled reading measure.
2. Paragraph spacing is consistent and supports scanning.
3. Heading-to-body spacing is larger than paragraph-to-paragraph spacing.
4. Display typography is used for headlines, not body copy.
5. Body typography is legible and stable over long sections.
6. Inline links are recognizable without color alone.
7. Lists are visibly structured and easy to scan.

### Scoring anchors

**5**
- Reading is comfortable and durable across long sections.
- Spacing rhythm is consistent and easy to parse.
- Links and lists are clearly structured.
- Typographic hierarchy is clean and appropriate.

**4**
- Reading experience is strong overall with minor spacing or measure inconsistencies.

**3**
- Reading is workable, but multiple issues reduce comfort: wide measure, uneven spacing, weak link styling, or muddled list treatment.

**2**
- Reading comfort is noticeably poor across substantial portions of the page.
- Structure is hard to scan or sustain.

**1**
- The page significantly undermines reading comprehension through typography or spacing.

### Page-type notes
- This category carries extra importance for course, manual, and essay-like pages.
- Marketing pages still need readable support copy, even if the hero is more expressive.

---

## D. Surface, Depth & Boundary Discipline — 15 points

### What is being measured
Whether the page uses tonal layering, whitespace, and calm depth rather than obvious lines, divider-heavy structure, or conventional shadow-based hierarchy.

### Required checklist
1. Major sections are separated primarily by spacing or background shifts rather than visible lines.
2. The page does not rely on 1px borders to define most containers.
3. Drop shadows are absent or minimal and non-structural.
4. Tonal layers create clear but calm depth.
5. If boundaries are used, they are subtle and functionally justified.

### Scoring anchors

**5**
- Surface hierarchy feels calm, intentional, and highly aligned.
- Tonal layering does the work of separation and elevation.
- Borders and shadows are rare and justified.

**4**
- The page mostly follows the no-line / low-shadow philosophy.
- A few visible boundaries exist, but they do not dominate the experience.

**3**
- The page shows mixed behavior: some tonal layering, some conventional lines/shadows.
- Reviewers can see the intended direction, but execution is inconsistent.

**2**
- Visible borders or shadows do most of the structural work.
- Tonal hierarchy is weak or secondary.

**1**
- The page is heavily boxed, divider-driven, or shadow-dependent.
- It clearly rejects the tonal-layering philosophy.

### Page-type notes
- Tool pages may use subtle boundaries when usability requires them.
- Dense instructional pages may use restrained separators if they materially improve comprehension.

---

## E. Component Restraint & Layout Discipline — 10 points

### What is being measured
Whether components are used selectively and in service of hierarchy rather than as the default layout primitive.

### Required checklist
1. Cards are used selectively rather than everywhere.
2. The layout does not default to repeated equal card grids unless items are true peers.
3. Text lists, rails, chronology, or simpler structures are used where they fit better than cards.
4. The page avoids “boxiness by accumulation.”
5. Removing some containers would not obviously improve the page.

### Scoring anchors

**5**
- Components are highly disciplined.
- Every container appears justified.
- The page uses simpler structures wherever possible.

**4**
- Layout discipline is strong with a small number of unnecessary containers.

**3**
- Component use is mixed.
- Some card/grid patterns feel habitual rather than necessary.

**2**
- The page relies too heavily on panels, cards, or repeated boxes.
- Layout feels modular before it feels editorial.

**1**
- Components dominate the page to the point that hierarchy and tone are flattened.

### Page-type notes
- This is especially important for homepages and CV/profile pages, where repeated cards often contradict the philosophy.

---

## F. Accessibility & Usability Guardrails — 10 points

### What is being measured
Whether the page remains legible, navigable, and calm, with strong focus visibility, usable contrast, restrained motion, and clear interactive affordances.

### Required checklist
1. Body text appears sufficiently high-contrast for sustained reading.
2. Major interactive elements have clearly visible keyboard focus states.
3. Hover is not the only state making interactivity legible.
4. Motion is subtle and does not distract from reading or task completion.
5. Interactive controls are visually understandable.
6. Ornament never impairs comprehension of essential content.

### Scoring anchors

**5**
- Accessibility and usability are visibly strong.
- Focus, contrast, calm motion, and affordance clarity are all present.

**4**
- Minor issues exist, but usability remains clearly reliable.

**3**
- Some interaction or readability concerns are noticeable, though not severely blocking.

**2**
- One or more major usability issues are present.
- Focus, contrast, or affordances are unreliable.

**1**
- Accessibility or usability is seriously compromised.

### Page-type notes
- Tool/review pages should be scored especially strictly here because operational clarity is central to their purpose.

---

## G. Theme Consistency Across Light/Dark Modes — 5 points

### What is being measured
Whether light and dark themes preserve the same hierarchy, reading comfort, and brand logic instead of becoming visually unrelated systems.

### Required checklist
1. Light and dark modes preserve the same information hierarchy.
2. Long-form readability remains strong in both modes.
3. Dark mode avoids harsh black backgrounds and excessive chroma.
4. Surface layering remains coherent across modes.

### Scoring anchors

**5**
- Dark mode is a clear tonal translation of the same system.
- Readability and hierarchy remain stable.

**4**
- Theme consistency is good with minor tonal inconsistencies.

**3**
- The same system is recognizable, but some readability or hierarchy drift appears.

**2**
- Dark mode materially weakens the experience or feels disconnected.

**1**
- Light and dark modes behave like different products or one mode is substantially unreadable.

### Not applicable rule
If only one theme exists, mark this category **Not Present** and redistribute its 5 points proportionally across the other categories, or report the final score as **out of 95**. Review teams should choose one method and use it consistently.

---

## H. Page-Type Fit — 5 points

### What is being measured
Whether the page applies the design philosophy in a way appropriate to its actual purpose.

### Required checklist
1. The page’s visual intensity suits its function.
2. The page type’s priorities are correctly emphasized.
3. The page avoids the anti-patterns listed for its page type.

### Scoring anchors

**5**
- The page is very well adapted to its purpose.
- The design system is applied with restraint and judgment.

**4**
- The page type is handled well with minor mismatches.

**3**
- The page is only partially adapted; some patterns feel imported from the wrong context.

**2**
- The page uses a mismatched design approach for its purpose.

**1**
- The page strongly contradicts the page-type guidance.

---

## 7. Page-Type-Specific Interpretation Rules

These rules reduce disagreement by clarifying what should and should not be expected for each page type.

### 7.1 Marketing / Editorial Pages

Reviewers should expect:
- a clear focal point,
- stronger editorial composition,
- generous whitespace,
- selective asymmetry,
- staged discovery rather than equal-weight destination grids.

Reviewers should penalize:
- repeated promo bands saying similar things,
- multiple equal-priority destination blocks,
- generic three-up card rows for non-parallel content.

### 7.2 Profile / CV Pages

Reviewers should expect:
- trust, order, and scanability,
- strong metadata structure,
- disciplined chronology or grouped records,
- sparse use of cards.

Reviewers should penalize:
- dashboard-like panelization,
- over-stylized flourishes that reduce document credibility,
- excessive wrapping of every subsection in its own box.

### 7.3 Course / Lab Manual / Long-form Instruction Pages

Reviewers should expect:
- endurance-oriented reading design,
- strong heading/list structure,
- predictable link treatment,
- restrained asymmetry,
- sparse ornamental effects.

Reviewers should penalize:
- decorative hero logic repeated deep into long reading sections,
- weak instructional structure,
- overuse of saturated blocks that exhaust the reader.

### 7.4 Interactive Tool / Review Pages

Reviewers should expect:
- operational clarity,
- strong focus handling,
- clear separation of controls and results,
- restrained visual atmosphere.

Reviewers should penalize:
- style choices that obscure controls,
- ambiguous states,
- decorative composition that slows task performance.

---

## 8. Standard Audit Procedure

All reviewers should use the following process.

### Step 1: Classify the page
Record:
- page type,
- primary user task,
- primary takeaway or action,
- any secondary task.

### Step 2: Do a 10-second first-impression pass
Without scrolling, answer:
- What appears most important?
- What is the likely next action?
- Does the page feel editorial, generic, calm, dense, theatrical, or operational?

Record the answer before moving on.

### Step 3: Do a full-scroll reading pass
Scroll through the page at a normal reading pace.
Record:
- whether section order feels coherent,
- whether reading rhythm stays comfortable,
- whether repeated patterns flatten hierarchy.

### Step 4: Inspect interaction states
Using keyboard and pointer:
- tab through major interactive elements,
- inspect focus states,
- inspect hover states,
- inspect inputs if present,
- inspect motion behavior if present.

### Step 5: Compare themes and breakpoints
Compare desktop/mobile and light/dark when available.
Record whether hierarchy, readability, and surface logic remain consistent.

### Step 6: Complete the required checklist for each category
Do not assign scores until every checklist item has been marked Yes / No / Not Applicable.

### Step 7: Assign category scores using anchors
Use the anchor definitions, apply caps if triggered, and compute the weighted total.

### Step 8: Write findings in standardized order
Always write findings in this order:
1. strengths,
2. misalignments,
3. highest-priority fixes,
4. final verdict.

This ordering improves consistency across reviewers.

### Step 9: Use iterative passes for large page sets
When auditing many pages, reviewers should not try to do a full deep audit on every page in one pass. Instead, use an iterative workflow so the framework scales while preserving consistency.

#### Iteration 1: Inventory pass
Create a page inventory and record for each page:
- page URL or file path,
- page type,
- primary user task,
- whether light/dark and desktop/mobile states exist,
- whether the page appears to be a template instance or a unique layout.

The goal of this pass is coverage, not deep scoring.

#### Iteration 2: Fast triage pass
Do a short audit of every page using only:
- first impression,
- hierarchy,
- reading comfort,
- obvious accessibility failures,
- obvious anti-patterns.

At the end of this pass, label pages as:
- **Green:** likely aligned; full audit optional
- **Yellow:** mixed; full audit recommended
- **Red:** clearly misaligned; full audit required

#### Iteration 3: Full audit pass
Run the complete rubric on:
- all Red pages,
- all Yellow pages,
- one or more representative Green pages per template family.

If many pages share one template, reviewers may audit the template deeply and then spot-check instances, but they must record any page-level deviations separately.

#### Iteration 4: Remediation pass
After fixes are made, re-audit only:
- categories previously scored 3 or below,
- any category affected by the fix,
- one adjacent category if the fix could shift hierarchy, readability, or page-type fit.

This keeps repeated audits efficient while still catching regressions.

#### Iteration 5: Trend tracking pass
For large sites, maintain a running log of:
- average score by template,
- average score by page type,
- number of Red/Yellow/Green pages,
- most common failed checklist items,
- most common high-severity findings.

This converts one-off audits into a continuous improvement process.

### Sampling rules for large sites
To preserve reliability at scale, use these rules:

1. Audit every unique page template at least once.
2. If a template has many instances, fully audit at least 3 examples or 10 percent of instances, whichever is greater, unless the population is extremely large.
3. Always include pages with the highest traffic, highest business importance, or highest content density.
4. If a template appears in multiple states driven by data, audit examples representing the smallest, median, and largest content loads.
5. If a fix changes shared CSS or JS behavior, recheck all page types that depend on that shared behavior.

These iterative rules should be used whenever the site is too large for a full deep audit of every page in a single cycle.

---

## 9. Evidence Recording Rules

To reduce ambiguous scoring, each category must include at least one evidence statement using this structure:

> **Observation:** what is visible.
>
> **Why it matters:** which design principle it supports or violates.
>
> **Impact:** how it affects alignment, hierarchy, readability, or usability.

### Example

> **Observation:** The homepage presents three equally sized destination cards directly beneath the hero, each with similar visual weight.
>
> **Why it matters:** `WebDesign.md` says editorial pages should establish a primary path and avoid equal treatment for non-parallel destinations.
>
> **Impact:** The page’s hierarchy is flattened and the likely next step is less clear.

Avoid vague evidence like:
- “Feels kind of off.”
- “Looks too busy.”
- “Could be more editorial.”

Instead, always describe the exact visible pattern.

---

## 10. Tie-Break Rules for Reviewers

If a reviewer is unsure between two adjacent scores, use these tie-break rules.

### 10.1 Choose the Lower Score If
- the page violates a stated anti-pattern,
- the problem appears in a primary region of the page,
- the problem affects comprehension or navigation,
- multiple checklist items are marked No.

### 10.2 Choose the Higher Score If
- the issue is localized and not structural,
- the page’s primary task remains very clear,
- the visible result strongly matches the philosophy despite minor implementation flaws.

### 10.3 Never Skip From 5 to 2 Based on Taste
Large score jumps require observable failures, not preference differences.

---

## 11. Mapping Audit Findings to HTML, CSS, and JavaScript

The audit scores the rendered page, but remediation usually requires teams to trace issues back to HTML, CSS, and JavaScript. To keep implementation reviews consistent, use the following mapping rules.

### 11.1 HTML evaluation
HTML should be evaluated for whether the document structure supports the design philosophy semantically and structurally. Reviewers should check whether HTML:

- establishes a clear content hierarchy through heading levels and document order,
- preserves meaningful reading order independent of styling,
- uses appropriate semantic elements for navigation, main content, lists, forms, and supporting regions,
- exposes lists, procedures, metadata, and chronology in a way that matches the page type,
- supports accessible naming and focus behavior for interactive elements.

HTML is the main source of truth for:
- hierarchy clarity,
- reading structure,
- list and instructional semantics,
- page-type fit for CV, course, and tool pages,
- accessibility of links, buttons, inputs, and landmarks.

### 11.2 CSS evaluation
CSS should be evaluated for whether visual presentation matches the philosophy. Reviewers should check whether CSS:

- creates hierarchy through spacing, typography, placement, and tonal layering,
- keeps long-form text within a comfortable measure,
- uses surfaces rather than visible borders for most structural separation,
- keeps cards, shadows, outlines, and hover treatments restrained,
- preserves readability and hierarchy across light and dark modes,
- makes focus states visible and consistent with the design system.

CSS is the main source of truth for:
- editorial tone,
- whitespace rhythm,
- surface and boundary discipline,
- component restraint,
- dark-mode consistency,
- visible accessibility affordances such as contrast and focus.

### 11.3 JavaScript evaluation
JavaScript should be evaluated for whether behavior supports rather than undermines the philosophy. Reviewers should check whether JavaScript:

- preserves stable hierarchy and reading flow during dynamic updates,
- keeps navigation, tabs, disclosure panels, and filters understandable,
- avoids motion, animation, or state changes that distract from reading,
- preserves keyboard usability and focus management,
- applies theme toggles without breaking readability or surface hierarchy,
- does not inject repetitive UI chrome that turns editorial pages into app-like dashboards.

JavaScript is the main source of truth for:
- dynamic focus handling,
- motion and transition behavior,
- theme switching logic,
- stateful tool interfaces,
- progressive disclosure patterns,
- runtime content insertion that may flatten hierarchy or overload the page.

### 11.4 How to assign responsibility when a score is low
When a category scores poorly, reviewers should identify the most likely implementation layer responsible:

- **Primarily HTML:** structural or semantic problems such as wrong heading hierarchy, missing list semantics, poor document order, or unclear landmark structure.
- **Primarily CSS:** visual hierarchy failures, poor spacing, weak tonal layering, border-heavy design, unreadable measure, or weak focus styling.
- **Primarily JavaScript:** unstable interactions, broken focus management, disruptive motion, unreadable theme switching, or dynamic UI that obscures the primary path.
- **Shared responsibility:** issues that span markup, styling, and behavior, such as a tool interface whose HTML lacks structure, whose CSS hides emphasis, and whose JS scrambles focus.

Review reports should identify both the failing rubric category and the likely implementation layer so engineering teams can route fixes efficiently.

---

## 12. Scoring Worksheet

Use this worksheet during audits.

### A. Editorial Identity & Brand Tone
- Avoids generic SaaS feel: Yes / No / N/A
- Feels composed rather than modular: Yes / No / N/A
- Typography supports editorial tone: Yes / No / N/A
- Color supports intended brand: Yes / No / N/A
- Memorable editorial move appropriate to page type: Yes / No / N/A
- **Score (1–5):**
- **Evidence:**

### B. Information Hierarchy & Compositional Clarity
- Primary action/takeaway clear in first screenful: Yes / No / N/A
- Secondary content visibly demoted: Yes / No / N/A
- Non-peers are not equalized: Yes / No / N/A
- Asymmetry improves hierarchy if used: Yes / No / N/A
- No flattening repeated equal-weight blocks: Yes / No / N/A
- Section order supports user journey: Yes / No / N/A
- **Score (1–5):**
- **Evidence:**

### C. Reading Experience & Typographic Rhythm
- Comfortable measure: Yes / No / N/A
- Consistent paragraph spacing: Yes / No / N/A
- Heading spacing stronger than paragraph spacing: Yes / No / N/A
- Display type reserved for headlines: Yes / No / N/A
- Body type supports long reading: Yes / No / N/A
- Links recognizable without color alone: Yes / No / N/A
- Lists clearly structured: Yes / No / N/A
- **Score (1–5):**
- **Evidence:**

### D. Surface, Depth & Boundary Discipline
- Sections separated by tone/space instead of lines: Yes / No / N/A
- No reliance on visible 1px borders: Yes / No / N/A
- Drop shadows are minimal/non-structural: Yes / No / N/A
- Tonal layers create calm depth: Yes / No / N/A
- Any boundaries are subtle and justified: Yes / No / N/A
- **Score (1–5):**
- **Evidence:**

### E. Component Restraint & Layout Discipline
- Cards used selectively: Yes / No / N/A
- No default equal-weight card grid unless justified: Yes / No / N/A
- Simpler structures used where appropriate: Yes / No / N/A
- Avoids boxiness by accumulation: Yes / No / N/A
- Removing containers would not clearly improve page: Yes / No / N/A
- **Score (1–5):**
- **Evidence:**

### F. Accessibility & Usability Guardrails
- Body text contrast appears sufficient: Yes / No / N/A
- Focus states clearly visible: Yes / No / N/A
- Hover is not sole interaction cue: Yes / No / N/A
- Motion remains subtle: Yes / No / N/A
- Controls are visually understandable: Yes / No / N/A
- Ornament does not impair comprehension: Yes / No / N/A
- **Score (1–5):**
- **Evidence:**

### G. Theme Consistency Across Light/Dark Modes
- Same hierarchy in both themes: Yes / No / N/A
- Long-form readability preserved: Yes / No / N/A
- Dark mode avoids harsh black / excess chroma: Yes / No / N/A
- Surface layering remains coherent: Yes / No / N/A
- **Score (1–5):**
- **Evidence:**

### H. Page-Type Fit
- Visual intensity suits page function: Yes / No / N/A
- Page-type priorities correctly emphasized: Yes / No / N/A
- Avoids page-type anti-patterns: Yes / No / N/A
- **Score (1–5):**
- **Evidence:**

---

## 13. Final Score Calculation

Calculate each weighted score as:

`category score / 5 × category weight`

### Example
If Category B receives a 4:

`4 / 5 × 20 = 16`

Then sum all weighted category scores.

### Score Bands

- **90–100:** Exemplary alignment
- **75–89:** Strong alignment
- **60–74:** Partial alignment
- **40–59:** Weak alignment
- **Below 40:** Fundamental misalignment

---

## 14. Standardized Audit Report Template

Use this exact template for final reporting.

# Design Audit Report

## Metadata
- **Page:**
- **Page type:**
- **Reviewer:**
- **Date:**
- **Desktop viewport:**
- **Mobile viewport:**
- **Themes reviewed:**

## Primary User Goal
-

## Primary Takeaway or Action
-

## Category Scores
- **A. Editorial Identity & Brand Tone:** _/15
- **B. Information Hierarchy & Compositional Clarity:** _/20
- **C. Reading Experience & Typographic Rhythm:** _/20
- **D. Surface, Depth & Boundary Discipline:** _/15
- **E. Component Restraint & Layout Discipline:** _/10
- **F. Accessibility & Usability Guardrails:** _/10
- **G. Theme Consistency Across Light/Dark Modes:** _/5
- **H. Page-Type Fit:** _/5
- **Total:** _/100

## Strengths
1.
2.
3.

## Misalignments
1.
2.
3.

## Priority Fixes
1. **Critical / High / Medium / Low:**
2. **Critical / High / Medium / Low:**
3. **Critical / High / Medium / Low:**

## Evidence by Category
### A. Editorial Identity & Brand Tone
- Observation:
- Why it matters:
- Impact:

### B. Information Hierarchy & Compositional Clarity
- Observation:
- Why it matters:
- Impact:

### C. Reading Experience & Typographic Rhythm
- Observation:
- Why it matters:
- Impact:

### D. Surface, Depth & Boundary Discipline
- Observation:
- Why it matters:
- Impact:

### E. Component Restraint & Layout Discipline
- Observation:
- Why it matters:
- Impact:

### F. Accessibility & Usability Guardrails
- Observation:
- Why it matters:
- Impact:

### G. Theme Consistency Across Light/Dark Modes
- Observation:
- Why it matters:
- Impact:

### H. Page-Type Fit
- Observation:
- Why it matters:
- Impact:

## Final Verdict
-

---

## 15. Reporting Formats for CSV, Markdown, and HTML

To make audit results easy to digest across design, engineering, and leadership audiences, every audit should be exportable to CSV, Markdown, or HTML. The underlying data should stay the same; only the presentation format should change.

### 15.1 Canonical row structure
Each audited page should produce one canonical record with these fields:

- page
- page_type
- reviewer
- review_date
- desktop_reviewed
- mobile_reviewed
- light_mode_reviewed
- dark_mode_reviewed
- primary_user_goal
- primary_takeaway
- score_editorial_identity
- score_hierarchy
- score_reading
- score_surface
- score_components
- score_accessibility
- score_theme
- score_page_type_fit
- total_score
- severity_top_issue
- top_issue_summary
- status_red_yellow_green
- notes

This row structure makes it possible to summarize the same audit in multiple output formats without rewriting the evaluation itself.

### 15.2 CSV reporting
Use CSV when teams need sorting, filtering, trend analysis, or spreadsheet workflows. CSV is best for:

- large multi-page audits,
- tracking changes across audit cycles,
- identifying common failing categories,
- grouping by template or page type,
- calculating averages and distributions.

#### Recommended CSV outputs
1. **Page summary CSV:** one row per page with category scores and top issues.
2. **Issue CSV:** one row per finding with page, category, severity, implementation layer, and recommendation.
3. **Trend CSV:** one row per audit cycle with averages, counts, and progress over time.

### 15.3 Markdown reporting
Use Markdown when teams need a human-readable narrative report that works well in pull requests, repositories, and documentation systems. Markdown is best for:

- single-page audits,
- template-level reviews,
- PR discussions,
- design critique archives,
- handoff to content and design teams.

A Markdown report should include:
- metadata,
- category scores,
- strengths,
- misalignments,
- priority fixes,
- evidence by category,
- final verdict.

The standardized report template in this document is the recommended Markdown structure.

### 15.4 HTML reporting
Use HTML when teams need a browsable dashboard or stakeholder-friendly report. HTML is best for:

- leadership summaries,
- filterable audit dashboards,
- cross-linking pages to screenshots or live URLs,
- visual trend displays by template or page type.

A good HTML report should provide:
- sortable tables of page scores,
- color-coded Red/Yellow/Green status,
- drill-down views for each page,
- links to screenshots and evidence,
- charts for score distribution and recurring failures.

### 15.5 Output consistency rule
Regardless of output format, the same audit should preserve:

- the same category names,
- the same numeric scores,
- the same severity labels,
- the same evidence summaries,
- the same page-type classification.

Do not let the output format change the evaluation itself. CSV, Markdown, and HTML are presentation layers over the same canonical audit data.

---

## 16. Foreseeable Sources of Confusion and How to Resolve Them

Even with a detailed rubric, teams may still encounter recurring ambiguities. To preserve interrater reliability, reviewers should use the following resolution rules.

### 16.1 Confusing originality with alignment
A page can feel distinctive but still violate the framework. Reviewers should not reward novelty by itself. The question is not whether the page is visually interesting; the question is whether it expresses the documented philosophy through readable hierarchy, tonal restraint, and purpose-fit composition.

**Resolution rule:** If a page is memorable but weak in hierarchy, readability, or accessibility, score the weak category directly rather than inflating its brand-tone score.

### 16.2 Over-penalizing restrained pages
Some reviewers may equate “editorial” with “dramatic.” That can create unfair penalties for course pages, CVs, or tools that are intentionally calm.

**Resolution rule:** Score visual restraint positively when it matches page purpose. Page-Type Fit should control the interpretation of Editorial Identity, not the other way around.

### 16.3 Confusion between page-level and template-level findings
A large site may contain many pages generated from the same template with small local variations. Reviewers may disagree on whether a problem belongs to one page or the template.

**Resolution rule:** Record both fields when relevant: `template_issue` and `page_instance_issue`. If the problem appears in repeated pages, classify it as a template issue first and then note any page-specific amplifiers.

### 16.4 Inconsistent treatment of “Not Present”
Some reviewers may treat a missing feature, such as dark mode, as a failure, while others may exclude it.

**Resolution rule:** If a capability does not exist, mark it **Not Present** and follow the framework’s scoring rule for that category. Do not convert absence into a negative score unless the page type or explicit requirements demand the missing feature.

### 16.5 Scoring from implementation knowledge instead of the rendered result
Developers or designers familiar with the codebase may be tempted to score based on intended architecture instead of what users actually see.

**Resolution rule:** The rendered page always wins. Implementation notes may be recorded for remediation routing, but the score must be based on visible output and interaction behavior.

### 16.6 Disagreement about whether an issue is structural or cosmetic
Spacing, card usage, and asymmetry can look minor to one reviewer and structural to another.

**Resolution rule:** Treat an issue as structural if it changes primary-path clarity, reading comfort, page-type fit, or accessibility. Treat it as cosmetic only if the page’s comprehension and task flow remain intact.

### 16.7 Ambiguity in mixed-purpose pages
Some pages blend editorial content, utility controls, and profile information. Reviewers may disagree on the correct benchmark.

**Resolution rule:** Declare one primary page type before scoring. If a page is hybrid, record the secondary type in notes, but score it against the dominant user task.

### 16.8 Confusion caused by missing screenshots or state capture
If reviewers do not compare the same states, disagreements will rise quickly.

**Resolution rule:** For team audits, store screenshots or equivalent state captures for every audited viewport/theme combination. If a state was not captured, reviewers should not speculate about it.

### 16.9 Drift over time as the team gets faster
Teams often become less strict after several audit cycles and start using shorthand instead of the full rubric.

**Resolution rule:** Re-run calibration periodically and require at least one fully documented audit per cycle to verify that the checklist, evidence model, and severity labels are still being applied consistently.

### 16.10 Recommended operating rule
If a reviewer says “this just feels wrong,” they must translate that statement into one of the following before scoring:
- a failed checklist item,
- a violated anti-pattern,
- a triggered score cap,
- a page-type mismatch, or
- an accessibility/usability failure.

If they cannot translate the reaction into one of those forms, it should not affect the score.

---

## 17. Calibration Recommendation for Teams

If multiple reviewers will use this framework regularly, run a calibration exercise.

### Recommended calibration process
1. Have 3 reviewers score the same page independently.
2. Compare category scores, not just the final total.
3. Discuss any category where scores differ by more than 1 point.
4. Identify whether disagreement came from:
   - page-type interpretation,
   - missing evidence,
   - inconsistent use of score anchors,
   - inconsistent handling of Not Applicable items.
5. Update team norms, then rescore a second page.

The framework is working well when category-level disagreement is usually within 1 point.

---

## 18. Quick Reviewer Summary

When in doubt, remember the core test:

> Does this page feel like a calm, prestigious, readable, hierarchy-first editorial experience adapted to its purpose?

If reviewers use the standardized setup, checklist, anchors, evidence format, and tie-break rules in this document, they should produce highly consistent design-alignment audits.
