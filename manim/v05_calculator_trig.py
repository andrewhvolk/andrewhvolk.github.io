from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V05CalculatorTrigValues(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V05",
            topic="Calculator Trig Values",
            objective="Evaluate trig values with correct mode.",
            formula=r"\sin,\cos,\tan\ \text{mode: DEG or RAD}",
            examples=[
                r"sin(35°) ≈ 0.5736 (DEG)",
                r"cos(2.4) ≈ -0.7374 (RAD)",
                r"tan(120°) ≈ -1.7321 (DEG)",
            ],
            mistake="Wrong mode gives wrong answers.",
            correction="Always state and verify DEG/RAD before compute.",
            quick_checks=[
                "Evaluate sin(0.7) in RAD.",
                "Evaluate cos(75°) in DEG.",
                "Why is tan(90°) undefined?",
            ],
            recap=r"\text{Mode check first}",
            narration=[
                "Goal calculator evaluation.",
                "Setup mode then input.",
                "Check sign and magnitude.",
            ],
        )
        build_standard_scene(self, spec)
