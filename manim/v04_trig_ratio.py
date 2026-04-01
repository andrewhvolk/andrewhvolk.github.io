from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V04BasicTrigRatio(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V04",
            topic="Basic Trig Ratio",
            objective="Use SOH-CAH-TOA and side identification.",
            formula=r"\sin\theta=\frac{o}{h},\ \cos\theta=\frac{a}{h},\ \tan\theta=\frac{o}{a}",
            examples=[
                r"Given opp=7, hyp=25 find sinθ",
                r"Given adj=12, hyp=13 find cosθ",
                r"Given opp=9, adj=40 find tanθ",
            ],
            mistake="Swapping opposite and adjacent sides.",
            correction="Mark reference angle first, then label sides.",
            quick_checks=[
                "Compute sinθ with o=5, h=13.",
                "Compute cosθ with a=8, h=17.",
                "Which ratio uses opp/adj?",
            ],
            recap=r"\text{Label sides before ratio}",
            narration=[
                "Goal identify ratio.",
                "Setup triangle labels.",
                "Check value range.",
            ],
        )
        build_standard_scene(self, spec)
