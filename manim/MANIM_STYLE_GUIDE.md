# MANIM_STYLE_GUIDE.md
## Math 130 Test 3 Video Series (28-video standard)

## 1) Core Principles
1. Clarity first
2. Consistency over novelty
3. Pedagogical pacing
4. Accessible contrast
5. Reusable components

## 2) Color Tokens
```python
BG_TOP = "#0B1026"
BG_BOTTOM = "#1A1F4B"
TEXT_PRIMARY = "#F5F7FF"
TEXT_SECONDARY = "#C8D2FF"
PRIMARY = "#34D1FF"
SECONDARY = "#9B6BFF"
SUCCESS = "#26D07C"
WARNING = "#FF9F43"
ERROR = "#FF5A6E"
GRID = "#607399"
MUTED = "#8CA0D7"
```

## 3) Typography
- Title: 56
- Section header: 42
- Body text: 30
- Equation lines: 42
- Labels minimum: 22

## 4) Motion Presets
- Fast: 0.5s
- Standard: 0.9s
- Slow: 1.4s

Approved transitions:
- FadeIn, Write
- TransformMatchingTex
- Create, GrowArrow
- Indicate, Circumscribe
- Flash + success color on answer reveal

## 5) Scene Blueprint (required)
1. Intro objective
2. Concept/formula
3. Example A
4. Example B
5. Example C
6. Common mistake
7. Quick check (3 prompts)
8. Recap

## 6) Shared Components Contract
Create reusable helpers in `style/components.py`:
- make_title(text)
- make_formula_box(tex)
- make_step_label(text)
- make_answer_badge(tex)
- make_warning_badge(text)
- make_grid_axes(...)
- make_unit_circle()
- make_right_triangle(...)
- make_vector_arrow(...)

## 7) QA Checklist
- Uses shared palette constants only
- Mathematical correctness verified
- Units/mode explicitly shown
- Rounding/tolerance consistent
- No layout clipping at 1080p
- Captions aligned with formulas

## 8) Export Standard
- 1920x1080, 30fps
- Filename pattern: `V##_topic_1080p.mp4`
- Keep project-wide naming consistency
