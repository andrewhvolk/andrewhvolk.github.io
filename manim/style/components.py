from manim import *

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

TITLE_SIZE = 56
SECTION_SIZE = 42
BODY_SIZE = 30
EQUATION_SIZE = 42
LABEL_SIZE = 22


def set_gradient_background(scene: Scene) -> None:
    top = Rectangle(width=config.frame_width, height=config.frame_height / 2).set_fill(BG_TOP, 1).set_stroke(width=0)
    bottom = Rectangle(width=config.frame_width, height=config.frame_height / 2).set_fill(BG_BOTTOM, 1).set_stroke(width=0)
    top.to_edge(UP, buff=0)
    bottom.next_to(top, DOWN, buff=0)
    scene.add(bottom, top)


def make_title(text: str) -> Text:
    return Text(text, color=TEXT_PRIMARY, font_size=TITLE_SIZE, weight=BOLD)


def make_formula_box(tex: str) -> VGroup:
    formula = MathTex(tex, color=PRIMARY, font_size=EQUATION_SIZE)
    box = RoundedRectangle(corner_radius=0.2, width=formula.width + 0.8, height=formula.height + 0.6, color=SECONDARY)
    box.set_fill(BG_BOTTOM, opacity=0.35)
    formula.move_to(box.get_center())
    return VGroup(box, formula)


def make_step_label(text: str) -> Text:
    return Text(text, color=TEXT_SECONDARY, font_size=SECTION_SIZE)


def make_answer_badge(tex: str) -> VGroup:
    answer = MathTex(tex, color=SUCCESS, font_size=EQUATION_SIZE)
    badge = RoundedRectangle(corner_radius=0.25, width=answer.width + 0.7, height=answer.height + 0.55, color=SUCCESS)
    badge.set_fill(SUCCESS, opacity=0.12)
    answer.move_to(badge.get_center())
    return VGroup(badge, answer)


def make_warning_badge(text: str) -> VGroup:
    icon = Text("⚠", color=WARNING, font_size=BODY_SIZE + 6)
    label = Text(text, color=WARNING, font_size=BODY_SIZE)
    content = VGroup(icon, label).arrange(RIGHT, buff=0.25)
    badge = RoundedRectangle(corner_radius=0.2, width=content.width + 0.7, height=content.height + 0.45, color=WARNING)
    badge.set_fill(WARNING, opacity=0.12)
    content.move_to(badge.get_center())
    return VGroup(badge, content)


def make_grid_axes(x_range=(-6, 6, 1), y_range=(-4, 4, 1), x_length=10, y_length=6) -> Axes:
    return Axes(
        x_range=x_range,
        y_range=y_range,
        x_length=x_length,
        y_length=y_length,
        axis_config={"color": GRID, "include_numbers": False, "stroke_width": 2},
        tips=False,
    )


def make_unit_circle() -> Circle:
    return Circle(radius=2.1, color=PRIMARY, stroke_width=3)


def make_right_triangle(a: float = 3, b: float = 2, color=PRIMARY) -> Polygon:
    return Polygon(ORIGIN, RIGHT * a, RIGHT * a + UP * b, color=color, stroke_width=3)


def make_vector_arrow(start=ORIGIN, end=RIGHT * 3 + UP * 2, color=PRIMARY) -> Arrow:
    return Arrow(start=start, end=end, buff=0, color=color, stroke_width=5)
