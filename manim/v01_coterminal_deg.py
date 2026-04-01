from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V01CoterminalAnglesDegrees(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V01",
            topic="Coterminal Angles (Degrees)",
            objective="Find coterminal angles with θ ± 360k.",
            formula=r"\theta_{cot} = \theta + 360k",
            examples=[
                r"75° -> 435°, -285°, 795°",
                r"-210° -> 150°, -570°, 510°",
                r"765° -> 45°, 1125°, -315°",
            ],
            mistake="Forgetting k must be an integer.",
            correction="Use k ∈ ℤ and verify by 360° differences.",
            quick_checks=[
                "Give one coterminal for 32°.",
                "Normalize -725° to [0,360).",
                "Are 140° and -220° coterminal?",
            ],
            recap=r"\text{Coterminal by }\pm 360k",
            narration=[
                "State the goal.",
                "Setup with θ ± 360k.",
                "Check by subtracting angles.",
            ],
        )
        build_standard_scene(self, spec)
