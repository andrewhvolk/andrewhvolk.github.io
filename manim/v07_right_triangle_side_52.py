from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V07SolveRightTriangleSideSec52(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V07",
            topic="Solve Right Triangle Side (Sec 5.2)",
            objective="Find missing side using trig ratios.",
            formula=r"\sin\theta=\frac{o}{h},\ \cos\theta=\frac{a}{h},\ \tan\theta=\frac{o}{a}",
            examples=[
                r"θ=32°, h=14 -> o=14sin32°",
                r"θ=41°, a=9 -> h=9/cos41°",
                r"θ=58°, a=11 -> o=11tan58°",
            ],
            mistake="Choosing inverse trig when side is requested.",
            correction="Use direct ratio for sides; inverse only for angles.",
            quick_checks=[
                "Find o if θ=25°, h=20.",
                "Find h if θ=60°, a=7.",
                "Find a if θ=38°, o=9.",
            ],
            recap=r"\text{Select ratio by known/unknown}",
            narration=[
                "Goal missing side.",
                "Setup equation.",
                "Check with triangle scale.",
            ],
        )
        build_standard_scene(self, spec)
