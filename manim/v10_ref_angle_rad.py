from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V10ReferenceAngleRadians(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V10",
            topic="Reference Angle (Radians)",
            objective="Find reference angle for radian measures.",
            formula=r"\alpha=\text{distance to nearest }x\text{-axis}",
            examples=[
                r"\theta=7\pi/6 -> \alpha=\pi/6",
                r"\theta=11\pi/6 -> \alpha=\pi/6",
                r"\theta=5\pi/4 -> \alpha=\pi/4",
            ],
            mistake="Leaving answer > π/2.",
            correction="Reference angle in radians must be between 0 and π/2.",
            quick_checks=[
                "Find α for 4π/3.",
                "Find α for -7π/4.",
                "Find α for 17π/6.",
            ],
            recap=r"\alpha\in(0,\pi/2)",
            narration=[
                "Goal radian reference.",
                "Setup quadrant mapping.",
                "Check acute radian value.",
            ],
        )
        build_standard_scene(self, spec)
