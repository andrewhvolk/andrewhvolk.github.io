# Math 130 — Unit 3D (Module 13: Vectors) — Slide Deck Handoff

**Target file:** `slides/Math130Unit3D.pptx` (and its `.pdf` / `.png` exports)
**Branch:** `claude/improve-math-slides-qswpV`
**Status:** diagrams regenerated and committed; pptx rebuild not yet applied to the source file.
**Next step:** wire the new diagrams into the pptx, reorder/rewrite slides per the spec below, re-export PDF and PNG thumbnail.

---

## 1. What's in this WIP folder

```
slides/_math130_unit3d_wip/
├── HANDOFF.md          (this file)
├── diagrams.py         (matplotlib generator for all vector/angle figures)
└── img/
    ├── s_component_form.png            (slide: Writing a Vector in Component Form)
    ├── s_magnitude_direction.png       (slide: Magnitude & Direction)
    ├── s_quadrant_arrows.png           (slide: Quadrant Adjustment overview)
    ├── s_components_from_mag_theta.png (slide: Components from |v| & θ)
    ├── s_vector_addition.png           (slide: Vector Addition & Scalar Mult)
    ├── s_scalar_multiplication.png     (slide: Scalar Multiplication Visual)
    └── s_you_try.png                   (slide: You Try practice)
```

Regenerate all seven PNGs with:
```bash
cd slides/_math130_unit3d_wip && python3 diagrams.py
```
Requires `matplotlib`. Images are transparent PNGs at 220 dpi, sized for the
slide layout (≈ 5.4 × 5.0 in).

---

## 2. Critical errors that must be fixed in the pptx

These four are *wrong*, not just ugly. Prioritize these.

| # | Slide (old) | Problem | Fix (new diagram to use) |
|---|---|---|---|
| 1 | **5 — Writing a Vector in Component Form** | Worked example solves `A(−2, 5) → B(3, −1) = ⟨5, −6⟩` but the embedded graph shows a *different* vector `P(1, 3) → Q(4, 7) = ⟨3, 4⟩`. The `P(1, 3)` label is also clipped by the arrow. | Replace embedded image with `img/s_component_form.png` — it draws A→B with the correct `⟨5, −6⟩` and legs `5` and `−6`. |
| 2 | **11 — Scalar Multiplication Visual** | The red arrow labeled `−v = ⟨−2, −1⟩` is drawn pointing **up-right** in the same direction as `v` and `2v`. This contradicts the "k < 0 reverses direction" rule on the same slide. Also, the "Rules" text appears twice (floating card + right panel). | Replace embedded image with `img/s_scalar_multiplication.png` (−v correctly points into Q III). Delete the duplicate floating "Rules" card; keep only the right-side panel. |
| 3 | **7 — Vector Addition** | The tip-to-tail illustration draws v starting at the origin instead of at the tip of u; labels `u = ⟨3,−2⟩` and `u+v = ⟨2,3⟩` are bisected by arrow shafts. | Replace embedded image with `img/s_vector_addition.png` (v starts at tip of u; labels offset clear of arrows). |
| 4 | **8 — Magnitude and Direction** | Vector is `⟨−3, 4⟩` (Q II, 126.9°) but the θ arc is drawn on the +x-axis side near 0°, suggesting a small acute angle. | Replace embedded image with `img/s_magnitude_direction.png` (arc sweeps CCW from +x past 90° to meet the vector). |

---

## 3. Structural / pedagogical changes

### 3.1 Collapse slides 1 + 2 → new slides 1 + 2

Old slides 1 and 2 are both "Module 13 / Section 8.4 / Vectors" title cards. Delete one or repurpose the second as a motivation slide.

**Proposed new slide 2 — "Why Vectors?"** (keep the dark-blue background of slide 1):

> **Why Vectors?**
> Many real-world quantities need both *size* and *direction*:
>
> - **Velocity** — wind blowing at 15 mph *to the north-east*
> - **Force** — 50 N pulling *down at 30°*
> - **Displacement** — walking 3 blocks *east, then 2 blocks north*
>
> Scalars (speed, mass, temperature) only need size.
> This module teaches the algebra and geometry for working with the "size + direction" kind.

### 3.2 Skills Overview (old slide 3)

Relabel skill 5 so it is clearly distinct from skill 1, and mark the supplementary skill:

1. Writing a vector in **component form** from initial/terminal points
2. Vector **addition and scalar multiplication** (component form)
3. Finding **magnitude and direction** of a vector from its graph
4. Finding the **direction angle** of a vector in `ai + bj` form
5. *(Supplementary)* Finding the **components** of a vector **given magnitude and angle**

### 3.3 Add a "Unit Vectors & Zero Vector" definitions slide (new slide 4 insert, or merge into existing "Vectors and Scalars")

The current deck uses `ai + bj` notation without defining `i` and `j`. Add:

> **Standard unit vectors**
> - `i = ⟨1, 0⟩` — one unit in the +x direction
> - `j = ⟨0, 1⟩` — one unit in the +y direction
>
> Any vector can be written: `v = ⟨a, b⟩ = ai + bj`
>
> **Zero vector**
> - `0 = ⟨0, 0⟩` — no magnitude, no direction
> - `v + 0 = v`

### 3.4 Reorder slides 6 and 8

Current order introduces `v = ⟨|v|cos θ, |v|sin θ⟩` (old slide 6, Method 2) *before* teaching how to find `|v|` and `θ` from components (old slide 8). Swap them:

| New order | Content | Uses |
|---|---|---|
| after operations | **Magnitude & Direction** (components → |v|, θ) | `img/s_magnitude_direction.png` |
| then | **Quadrant Adjustment** (guide + examples) | `img/s_quadrant_arrows.png` + existing examples |
| then | **Direction Angle of `ai + bj`** | existing slide 10 content |
| then | **Components from `|v|` and `θ`** (|v|, θ → components) | `img/s_components_from_mag_theta.png` |

### 3.5 Fix old slide 6 "Finding Components from a Graph"

- Title promises a graph — none is shown. Either add `img/s_component_form.png` or delete this slide (its Method 1 duplicates slide 5).
- Remove redundant `• 1.`, `• 2.`, `• 3.` (bullets AND numbers).
- **Remove the direction-angle computation** (`θ ≈ 143.1°`) — that belongs on the Magnitude & Direction slide.
- Fix awkward mid-subscript line wrap in `x_tip − y_tip − y_tail`.

### 3.6 Add a "You Try" practice slide before Test Prep

> **You Try**
> Vector `v` goes from `P(−4, −2)` to `Q(2, 1)`. Find:
> (a) component form, (b) magnitude, (c) direction angle (0°–360°).
>
> *Answer (click to reveal):* `v = ⟨6, 3⟩`,  `|v| = √45 = 3√5 ≈ 6.71`,  `θ = tan⁻¹(3/6) ≈ 26.57°` (Q I, no adjustment).

Use `img/s_you_try.png` for the graph.

### 3.7 Fix slide 13 ("Module 13 Summary")

The footer line `Next: Unit 3 Review → Test 3` is dim italic and clipped off the bottom edge. Raise it by ~0.3 in and increase contrast (e.g. teal `#0891B2`).

### 3.8 Improve the quadrant adjustment rules (slides 8–10)

Replace the four-case breakdown with a single compact rule plus the mnemonic:

> **One rule for the direction angle:**
> Compute `α = tan⁻¹(b/a)`, then:
> - if `a < 0`  →  `θ = α + 180°`   *(Q II or Q III)*
> - else if `b < 0`  →  `θ = α + 360°`   *(Q IV)*
> - otherwise  →  `θ = α`   *(Q I)*

Reinforce with `img/s_quadrant_arrows.png` showing a sample vector in each quadrant with its `θ` value.

### 3.9 Color system — pick semantic colors and apply consistently

The existing deck already uses these swatches; just stop rotating them arbitrarily per slide. Lock them in:

| Token | Hex | Meaning |
|---|---|---|
| TEAL | `#0891B2` | **Definitions / formulas** |
| ORANGE | `#F97316` | **Examples / worked problems** |
| PURPLE | `#7C3AED` | **Concepts / cautions / final results** |
| RED | `#DC2626` | Negative components / warnings only |
| NAVY | `#1E3A5F` | Section headings (body-slide titles) |
| DARK | `#0F2B46` | Title-slide background only |
| MUTED | `#64748B` | Metadata, footers |
| BG | `#F8FAFC` | Body-slide background |

Fonts (already in use): **Georgia** for titles, **Calibri** for body.

---

## 4. Proposed final slide order (14 slides)

```
 1  Title               — "Module 13 / Section 8.4 / Vectors" (keep dark bg)
 2  Why Vectors?        — NEW motivation slide (replaces redundant slide 2)
 3  Skills Overview     — relabel skill 5 + mark supplementary
 4  Definitions         — Scalar vs Vector + unit vectors i,j + zero vector
 5  Component Form      — use s_component_form.png (matching example)
 6  Addition & Scalar × — use s_vector_addition.png (correct tip-to-tail)
 7  Scalar × Visual     — use s_scalar_multiplication.png (correct -v)
 8  Magnitude & Direction — use s_magnitude_direction.png (correct arc)
 9  Quadrant Adjustment — use s_quadrant_arrows.png + single-rule summary
10  Direction of ai+bj  — polish existing slide
11  Components from |v|,θ — use s_components_from_mag_theta.png (was slide 6 Method 2)
12  You Try             — NEW practice, use s_you_try.png (answer on click)
13  Test Prep           — keep (existing slide 12 content is correct)
14  Summary             — fix clipped footer; visible "Next: Unit 3 Review → Test 3"
```

---

## 5. How to build the pptx

### Approach A — python-pptx rebuild (recommended)

A build script is the cleanest way to lock in the layout and re-run if any
slide content changes. Skeleton (not yet implemented):

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Slide size from original: 10" × 5.625" (16:9)
prs = Presentation()
prs.slide_width  = Emu(9144000)
prs.slide_height = Emu(5143500)

NAVY   = RGBColor(0x1E, 0x3A, 0x5F)
TEAL   = RGBColor(0x08, 0x91, 0xB2)
ORANGE = RGBColor(0xF9, 0x73, 0x16)
PURPLE = RGBColor(0x7C, 0x3A, 0xED)
RED    = RGBColor(0xDC, 0x26, 0x26)
MUTED  = RGBColor(0x64, 0x74, 0x8B)
BG     = RGBColor(0xF8, 0xFA, 0xFC)
DARK   = RGBColor(0x0F, 0x2B, 0x46)

blank = prs.slide_layouts[6]  # if using default template
# ...build each slide by adding text boxes, shapes, and add_picture() calls
prs.save("slides/Math130Unit3D.pptx")
```

Write one helper per slide layout pattern (title slide, two-column card layout,
image-plus-text layout) and reuse them. See `diagrams.py` for the color tokens
and the list of diagram filenames to embed.

### Approach B — hand-edit in PowerPoint

If you prefer WYSIWYG: open `slides/Math130Unit3D.pptx` in PowerPoint, then
apply each change in section 2 and section 3 manually. For the four embedded
graphs, **right-click → Change Picture** and point at the corresponding file
in `_math130_unit3d_wip/img/`.

### Re-exporting PDF and PNG

The repo currently holds matching `.pdf` and `.png` siblings. After editing
the `.pptx`, regenerate them:

```bash
# PDF
libreoffice --headless --convert-to pdf \
  --outdir slides slides/Math130Unit3D.pptx

# First-slide PNG thumbnail (requires ImageMagick + poppler)
pdftoppm -png -r 120 -f 1 -l 1 slides/Math130Unit3D.pdf /tmp/thumb
mv /tmp/thumb-1.png slides/Math130Unit3D.png
```

Double-check math symbols render correctly after LibreOffice conversion —
the original was authored in PowerPoint, and LibreOffice occasionally re-wraps
text boxes. If you see clipping, widen the containing text box by ~10%.

---

## 6. Spot-check checklist before merging

- [ ] Slide 5 graph shows the *same* points as the algebraic example.
- [ ] Slide 7 `−v` arrow points into Q III (down-left).
- [ ] Slide 6 `v` arrow starts at tip of `u`, not at origin.
- [ ] Slide 8 θ arc sweeps past 90° (obtuse angle visible).
- [ ] Slide 3 skill 5 reads "…given magnitude and angle" (not duplicating skill 1).
- [ ] Slide 14 "Next: Unit 3 Review → Test 3" is fully visible at the bottom.
- [ ] Teal / orange / purple used with consistent meaning across every slide.
- [ ] `slides/Math130Unit3D.pdf` regenerated and page count matches slide count.
- [ ] `slides/Math130Unit3D.png` shows the new title slide.

---

## 7. Files changed on this branch

- `slides/_math130_unit3d_wip/HANDOFF.md` — this document
- `slides/_math130_unit3d_wip/diagrams.py` — matplotlib diagram generator
- `slides/_math130_unit3d_wip/img/*.png` — seven corrected diagrams

`slides/Math130Unit3D.pptx` / `.pdf` / `.png` are **untouched** — next dev
applies the changes above, then those three exported files should be updated
together.
