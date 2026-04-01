from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V12TrigValuesFromQuadrantReferenceInfo(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V12",
            topic="Trig Values from Quadrant/Reference Info",
            objective="Compute trig values from α and quadrant.",
            formula=r"\sin\theta=\pm\sin\alpha,\ \cos\theta=\pm\cos\alpha,\ \tan\theta=\pm\tan\alpha",
            examples=[
                r"α=35°, QII -> sin+, cos-, tan-",
                r"α=0.4, QIV -> cos+, sin-",
                r"α=π/6, QIII -> tan+",
            ],
            mistake="Using reference-angle signs directly.",
            correction="Apply quadrant sign after reference value.",
            quick_checks=[
                "If α=20° in QIII, sign of cosθ?",
                "Given α=π/3 in QIV, tanθ sign?",
                "Compute sinθ from α=45° in QII.",
            ],
            recap=r"\text{Reference value then sign}",
            narration=[
                "Goal derive trig values.",
                "Setup with α values.",
                "Check sign by quadrant.",
            ],
        )
        build_standard_scene(self, spec)
