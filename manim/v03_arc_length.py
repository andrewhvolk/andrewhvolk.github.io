from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V03ArcLength(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V03",
            topic="Arc Length",
            objective="Apply s = rθ with θ in radians.",
            formula=r"s = r\theta",
            examples=[
                r"r=5, θ=1.2 -> s=6",
                r"r=9, θ=2π/3 -> s=6π",
                r"s=15, r=6 -> θ=2.5",
            ],
            mistake="Using degrees directly in formula.",
            correction="Convert degrees to radians before s=rθ.",
            quick_checks=[
                "Find s for r=4, θ=3.",
                "Find θ if s=10, r=8.",
                "What units does s use?",
            ],
            recap=r"s=r\theta\ (\theta\text{ in rad})",
            narration=[
                "Goal -> arc length.",
                "Setup variables with units.",
                "Check reasonableness.",
            ],
        )
        build_standard_scene(self, spec)
