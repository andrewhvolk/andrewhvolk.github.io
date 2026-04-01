from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V22VectorMagnitude(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V22",
            topic="Vector Magnitude",
            objective="Compute |v| using Pythagorean formula.",
            formula=r"|\vec v|=\sqrt{x^2+y^2}",
            examples=[
                r"v=<3,4> -> |v|=5",
                r"v=<-5,12> -> |v|=13",
                r"v=<6,-8> -> |v|=10",
            ],
            mistake="Forgetting square root at end.",
            correction="Magnitude is nonnegative square-root value.",
            quick_checks=[
                "Find |<8,15>|.",
                "Can magnitude be negative?",
                "Find |<-7,0>|.",
            ],
            recap=r"|\vec v|=\sqrt{x^2+y^2}",
            narration=[
                "Goal magnitude.",
                "Setup formula.",
                "Check nonnegative result.",
            ],
        )
        build_standard_scene(self, spec)
