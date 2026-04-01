from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V02CoterminalAnglesRadians(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V02",
            topic="Coterminal Angles (Radians)",
            objective="Find coterminal angles with θ ± 2πk.",
            formula=r"\theta_{cot} = \theta + 2\pi k",
            examples=[
                r"5\pi/6 -> 17\pi/6, -7\pi/6",
                r"-7\pi/6 -> 5\pi/6, -19\pi/6",
                r"13\pi/6 -> \pi/6, 25\pi/6",
            ],
            mistake="Mixing degree and radian increments.",
            correction="In radians, adjust by 2π only.",
            quick_checks=[
                "Coterminal for 11π/4?",
                "Normalize -25π/6.",
                "Are π/3 and 7π/3 coterminal?",
            ],
            recap=r"\text{Coterminal by }\pm 2\pi k",
            narration=[
                "Goal in radians.",
                "Setup with 2πk.",
                "Check equivalent terminal side.",
            ],
        )
        build_standard_scene(self, spec)
