from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V13SolveTrigEquationOn0360(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V13",
            topic="Solve Trig Equation on [0°,360°)",
            objective="Solve special-angle trig equations on interval.",
            formula=r"\sin\theta=a,\ \cos\theta=a,\ \tan\theta=a\ \text{on }[0^\circ,360^\circ)",
            examples=[
                r"sinθ=√3/2 -> θ=60°,120°",
                r"cosθ=-1/2 -> θ=120°,240°",
                r"tanθ=1 -> θ=45°,225°",
            ],
            mistake="Missing second quadrant/solution.",
            correction="Use reference angle + all valid quadrants.",
            quick_checks=[
                "Solve sinθ=1/2.",
                "Solve cosθ=0.",
                "Solve tanθ=-√3.",
            ],
            recap=r"\text{Reference angle + quadrant set}",
            narration=[
                "Goal solve in interval.",
                "Setup reference angle.",
                "Check all solutions.",
            ],
        )
        build_standard_scene(self, spec)
