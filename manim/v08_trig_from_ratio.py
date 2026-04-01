from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V08ExactTrigFromGivenRatio(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V08",
            topic="Exact Trig from Given Ratio",
            objective="Find all trig values from one ratio.",
            formula=r"\sin\theta=\frac{o}{h},\ \cos\theta=\frac{a}{h},\ \tan\theta=\frac{o}{a}",
            examples=[
                r"Given sinθ=3/5, QII -> cosθ=-4/5",
                r"Given cosθ=-5/13, QIII -> sinθ=-12/13",
                r"Given tanθ=8/15, QI -> secθ=17/15",
            ],
            mistake="Ignoring quadrant signs.",
            correction="Use ASTC signs after building reference triangle.",
            quick_checks=[
                "If sinθ=-5/13 in QIV, find cosθ.",
                "If tanθ=-3/4 in QII, sign of cosθ?",
                "Find cscθ from cosθ=12/13 in QI.",
            ],
            recap=r"\text{Triangle + quadrant signs}",
            narration=[
                "Goal complete trig set.",
                "Setup triangle from ratio.",
                "Check signs.",
            ],
        )
        build_standard_scene(self, spec)
