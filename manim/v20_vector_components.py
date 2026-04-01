from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V20VectorComponentsFromPoints(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V20",
            topic="Vector Components from Points",
            objective="Find component form from endpoints.",
            formula=r"\langle x_2-x_1,\ y_2-y_1\rangle",
            examples=[
                r"A(2,-1), B(7,5) -> <5,6>",
                r"P(-3,4), Q(1,-2) -> <4,-6>",
                r"From tail/head graph read then subtract",
            ],
            mistake="Subtracting in opposite order.",
            correction="Use head minus tail consistently.",
            quick_checks=[
                "Find vector from (1,2) to (4,-3).",
                "Component sign if move left 6?",
                "Can zero component occur?",
            ],
            recap=r"\vec v=\langle\Delta x,\Delta y\rangle",
            narration=[
                "Goal components from points.",
                "Setup subtraction.",
                "Check direction.",
            ],
        )
        build_standard_scene(self, spec)
