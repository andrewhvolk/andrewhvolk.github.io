from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V25VectorFromMagnitudeDirectionToComponents(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V25",
            topic="Vector from Magnitude/Direction to Components",
            objective="Convert polar-like data to components.",
            formula=r"\langle |v|\cos\theta,\ |v|\sin\theta\rangle",
            examples=[
                r"|v|=10, θ=30° -> <8.66,5>",
                r"|v|=12, θ=150° -> <-10.39,6>",
                r"|v|=7, θ=260° -> <-1.22,-6.89>",
            ],
            mistake="Swapping sine and cosine.",
            correction="x uses cosine, y uses sine for standard angle.",
            quick_checks=[
                "Find components for |v|=5, θ=60°.",
                "Sign of y at θ=210°?",
                "Round components to nearest hundredth.",
            ],
            recap=r"\langle r\cos\theta,r\sin\theta\rangle",
            narration=[
                "Goal convert mag+dir.",
                "Setup component formulas.",
                "Check signs.",
            ],
        )
        build_standard_scene(self, spec)
