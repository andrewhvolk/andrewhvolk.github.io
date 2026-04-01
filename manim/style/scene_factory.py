from dataclasses import dataclass

from manim import *

from style.components import (
    ERROR,
    MUTED,
    PRIMARY,
    SUCCESS,
    TEXT_PRIMARY,
    WARNING,
    make_answer_badge,
    make_formula_box,
    make_step_label,
    make_title,
    make_warning_badge,
    set_gradient_background,
)


@dataclass
class VideoSpec:
    code: str
    topic: str
    objective: str
    formula: str
    examples: list[str]
    mistake: str
    correction: str
    quick_checks: list[str]
    recap: str
    narration: list[str]


FAST = 0.9
STANDARD = 1.2
SLOW = 1.6


def build_standard_scene(scene: Scene, spec: VideoSpec) -> None:
    set_gradient_background(scene)

    title = make_title(f"{spec.code}: {spec.topic}").to_edge(UP)
    objective = Text(f"Objective: {spec.objective}", color=TEXT_PRIMARY, font_size=30).next_to(title, DOWN, buff=0.35)
    scene.play(Write(title), FadeIn(objective, shift=0.2 * DOWN), run_time=SLOW)
    scene.wait(0.45)

    formula_label = make_step_label("Concept / Formula").to_edge(LEFT).shift(UP * 1.7)
    formula_box = make_formula_box(spec.formula).next_to(formula_label, DOWN, aligned_edge=LEFT, buff=0.35)
    scene.play(FadeIn(formula_label), Write(formula_box), run_time=SLOW)
    scene.wait(0.45)

    ex_label = make_step_label("Worked Examples A–C").to_edge(LEFT).shift(UP * 0.15)
    example_lines = VGroup(
        *[
            Text(f"Example {chr(65 + i)}: {line}", color=PRIMARY, font_size=28)
            for i, line in enumerate(spec.examples)
        ]
    ).arrange(DOWN, aligned_edge=LEFT, buff=0.26)
    example_lines.next_to(ex_label, DOWN, aligned_edge=LEFT, buff=0.28)

    scene.play(FadeIn(ex_label), run_time=STANDARD)
    for line in example_lines:
        scene.play(Write(line), run_time=STANDARD)

    mistake_header = make_step_label("Common Mistake").to_edge(RIGHT).shift(UP * 0.15)
    warning = make_warning_badge(spec.mistake).next_to(mistake_header, DOWN, buff=0.3)
    correction = Text(spec.correction, color=SUCCESS, font_size=26).next_to(warning, DOWN, buff=0.3)
    red_x = Text("✗", color=ERROR, font_size=72).move_to(warning.get_center() + UP * 0.08)

    scene.play(FadeIn(mistake_header), FadeIn(warning), run_time=SLOW)
    scene.play(FadeIn(red_x), run_time=FAST)
    scene.play(FadeOut(red_x), run_time=FAST)
    scene.play(Write(correction), run_time=STANDARD)

    checks_label = make_step_label("Quick Check (3 prompts)").to_edge(LEFT).shift(DOWN * 2.0)
    checks = VGroup(*[Text(f"• {q}", color=MUTED, font_size=24) for q in spec.quick_checks]).arrange(
        DOWN, aligned_edge=LEFT, buff=0.2
    )
    checks.next_to(checks_label, DOWN, aligned_edge=LEFT, buff=0.2)
    scene.play(FadeIn(checks_label), run_time=STANDARD)
    scene.play(LaggedStart(*[FadeIn(q, shift=0.1 * RIGHT) for q in checks], lag_ratio=0.2), run_time=SLOW)

    recap_badge = make_answer_badge(spec.recap).to_edge(DOWN)
    scene.play(Flash(recap_badge, color=SUCCESS), FadeIn(recap_badge, shift=0.2 * UP), run_time=SLOW)

    narration_label = Text("Narration cues:", color=TEXT_PRIMARY, font_size=22).to_corner(UR).shift(LEFT * 0.3)
    narration_lines = VGroup(*[Text(f"- {line}", color=MUTED, font_size=18) for line in spec.narration]).arrange(
        DOWN, aligned_edge=LEFT, buff=0.1
    )
    narration_lines.next_to(narration_label, DOWN, aligned_edge=LEFT, buff=0.08)
    scene.play(FadeIn(narration_label), FadeIn(narration_lines), run_time=STANDARD)
    scene.wait(1.2)
