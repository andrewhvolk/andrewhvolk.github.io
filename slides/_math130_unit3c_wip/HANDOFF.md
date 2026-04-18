# Math 130 — Unit 3C (Module 12: Right Triangle Applications) — Slide Deck Handoff

**Target file:** `slides/Math130Unit3C.pptx` (and its `.pdf` / `.png` exports)
**Branch:** `claude/improve-math-slides-HIqT6`
**Status:** diagrams generated and committed; pptx rebuild not yet applied.
**Next step:** run `build_pptx.py` from repo root, then re-export PDF and PNG.

---

## 1. What's in this WIP folder

```
slides/_math130_unit3c_wip/
├── HANDOFF.md          (this file)
├── diagrams.py         (matplotlib generator for new figures)
└── img/
    ├── s_skill2_ladder.png     (slide: Word Problem — One Right Triangle)
    └── s_you_try.png           (slide: You Try practice)
```

Regenerate all PNGs with:
```bash
cd slides/_math130_unit3c_wip && python3 diagrams.py
```
Requires `matplotlib`. Images are transparent PNGs at 220 dpi.

---

## 2. Issues found in the current deck

### 2.1 Missing Skill 2 example (pedagogical gap)

Skills 1 & 2 are listed on the overview (Slide 3) and flagged as "also in Module 10."
Skill 1 gets Slide 5 (a bare trig-ratio setup with labeled sides). Skill 2
("Word problem with one right triangle") is never demonstrated — there is no word
problem that mirrors a single-triangle real-world context before jumping to
Elevation/Depression (Skills 3 & 5).

**Fix:** Insert a new Slide 6 with a ladder word problem that explicitly applies
the 6-step strategy from Slide 4 and produces a labeled diagram.

### 2.2 Algebra jump on Slide 13 (Two Right Triangles)

The derivation jumps from:

    d(1.327) = d(0.601) + 50(0.601)

directly to:

    d(0.726) = 30.04

The missing line is:

    d(1.327 − 0.601) = 50 × 0.601   →   d(0.726) = 30.04

Students who haven't recently done algebra are lost at this step. The fix is
to insert that one intermediate line into the text block.

### 2.3 DEGREE mode warning too small (Slide 6 → new Slide 7)

"Make sure calculator is in DEGREE mode!" appears once, in 13pt red. This is the
single most common calculator error in this unit. Increase to 16pt and frame it
in a light-red box so it reads as a warning callout, not a footnote.

### 2.4 Color system not fully consistent

The deck has a good step-color pattern on most slides:
- TEAL → Step 1 / "Find X" header
- ORANGE → Step 2 / example label
- PURPLE → Step 3 / final result header
- GREEN (#059669) → "Check:" / verify step

But two slides break it:

| Slide | Shape | Current color | Should be |
|-------|-------|---------------|-----------|
| 8 (Depression example) | "Depression from top = …" transition line | MUTED gray | TEAL (it's a setup fact) |
| 15 (Test Prep Solve) | "Solution:" label | ORANGE | GREEN (it's a final verify, like Check) |
| 10 (d=rt example) | "East (horizontal):" header | TEAL | ORANGE (Step 2 of the solution) |
| 10 | "North (vertical):" header | PURPLE | PURPLE ✓ |

### 2.5 Slide 17 footer barely visible

"Next: Module 13 — Section 8.4 (Vectors in Component Form)" sits at the very
bottom in muted gray (#64748B) 13pt italic on a dark navy background. Matches
the problem fixed in 3D. Fix: move up slightly, change color to TEAL, bold.

### 2.6 No practice slide

The deck teaches 7 skills in 17 slides but gives students no chance to try a
problem themselves. Add a "You Try" slide before Test Prep with an elevation
problem (angle of elevation + distance → height).

---

## 3. Structural / content changes

### 3.1 Insert Skill 2 Word Problem (new Slide 6)

After current Slide 5 (Finding a Side Length), insert:

**Title:** Word Problem — One Right Triangle

**Problem statement:** A 20 ft ladder leans against a wall making a 65° angle
with the ground. How high up the wall does it reach?

**Solution (6-step):**
- Step 1: Identify — hyp = 20 ft, angle = 65°, find opposite (wall height)
- Step 2: Set up — sin 65° = h / 20
- Step 3: Solve — h = 20 sin 65° = 20 × 0.9063 ≈ 18.1 ft
- Check: 18.1 < 20 ✓ (opposite < hypotenuse)

Use `img/s_skill2_ladder.png` for the diagram.

### 3.2 Fix algebra step on Slide 13 (two-triangle)

In the text block on the two-triangle slide, add one line:

```
d(1.327) = d(0.601) + 50(0.601)
d(1.327 − 0.601) = 50 × 0.601        ← insert this line
d(0.726) = 30.04
d ≈ 41.4 ft
```

### 3.3 Upgrade DEGREE mode callout

On the inverse-trig slide (current Slide 6, new Slide 7 after insertion):
- Wrap the warning in a light-red filled text box with a red border
- Increase font to 16pt bold
- Reframe text: "⚠ Calculator must be in DEGREE mode when using inverse trig!"

### 3.4 Add "You Try" practice slide (new Slide 15, before Test Prep)

**Title:** You Try

**Problem:** A surveyor stands 80 ft from the base of a building. The angle of
elevation to the top is 42°. Find the building height.

**Answer (click to reveal):** tan 42° = h / 80  →  h = 80 tan 42° ≈ 72.1 ft

Use `img/s_you_try.png` for the diagram.

### 3.5 Fix footer on Slide 17 (Summary)

`shapes[13]` "Next: Module 13 — Section 8.4 (Vectors in Component Form)"
- Move top from 5.0 in to 4.85 in
- Color to TEAL (#0891B2)
- Bold, italic=False
- Font size to 16pt

---

## 4. Proposed final slide order (19 slides)

```
 1  Title               — Module 12 / Section 7.1 (keep)
 2  Section overview    — "7 ALEKS Skills" intro (keep)
 3  Skills Overview     — all 7 skills listed (keep)
 4  Problem-Solving Strategy (keep)
 5  Finding a Side Length    — Skill 1 (keep)
 6  Word Problem — One Triangle — Skill 2 (NEW, with ladder diagram)
 7  Finding an Angle (Inverse Trig) — Skill 4 (keep; upgrade DEGREE warning)
 8  Angles of Elevation & Depression — Skill 5 concept (keep)
 9  Example — Angle of Depression (keep; fix transition line color)
10  Trig Functions and d = rt — Skill 3 concept (keep; fix step colors)
11  Example — Trig and d = rt (keep)
12  Solving a Right Triangle — Skill 6 concept (keep)
13  Example — Solving a Right Triangle (keep)
14  Word Problem — Two Right Triangles — Skill 7 (keep; add algebra step)
15  You Try (NEW, with elevation diagram)
16  Test Prep — Exact Values / Special Triangles (keep)
17  Test Prep — Solve a Right Triangle (keep; fix Solution: color)
18  Test Prep — Elevation & Depression (keep)
19  Summary (keep; fix footer)
```

---

## 5. How to build the pptx

```bash
# From repo root:
python3 slides/_math130_unit3c_wip/build_pptx.py
```

Then re-export PDF and PNG **locally** (LibreOffice PPTX conversion is broken
in the CI environment — do this on a machine with a working LibreOffice install):

```bash
libreoffice --headless --convert-to pdf --outdir slides slides/Math130Unit3C.pptx
pdftoppm -png -r 120 -f 1 -l 1 slides/Math130Unit3C.pdf /tmp/thumb3c
mv /tmp/thumb3c-1.png slides/Math130Unit3C.png
```

> **Note:** The `.pdf` and `.png` in the repo are currently stale (17 pages / old
> thumbnail). The `.pptx` is the source of truth — re-export when merging.

---

## 6. Spot-check checklist before merging

- [ ] New Slide 6 matches the 6-step layout style of other example slides.
- [ ] Slide 7 (inverse trig): DEGREE mode callout is visible at a glance.
- [ ] Slide 14 algebra: intermediate step `d(1.327 − 0.601) = 50 × 0.601` is present.
- [ ] Slide 15 You Try diagram shows angle and distance correctly.
- [ ] Slide 17 "Solution:" label is GREEN (not ORANGE).
- [ ] Slide 9 transition line "Depression from top = …" is TEAL (not MUTED).
- [ ] Slide 19 footer is fully visible in TEAL bold.
- [ ] Color step pattern (TEAL/ORANGE/PURPLE/GREEN) consistent across all worked examples.
- [ ] `slides/Math130Unit3C.pdf` regenerated and page count = 19.
- [ ] `slides/Math130Unit3C.png` shows new title slide.

---

## 7. Files changed on this branch

- `slides/_math130_unit3c_wip/HANDOFF.md` — this document
- `slides/_math130_unit3c_wip/diagrams.py` — matplotlib diagram generator
- `slides/_math130_unit3c_wip/img/s_skill2_ladder.png` — new diagram
- `slides/_math130_unit3c_wip/img/s_you_try.png` — new diagram
- `slides/_math130_unit3c_wip/build_pptx.py` — build script (not yet applied to pptx)

`slides/Math130Unit3C.pptx` / `.pdf` / `.png` are **not yet modified** —
run `build_pptx.py` to apply all changes, then regenerate the exports.
