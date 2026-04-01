from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V23DirectionAngleOfVector(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V23",
            topic="Direction Angle of Vector",
            objective="Find direction angle from components.",
            formula=r"\theta=\tan^{-1}(y/x)\ \text{with quadrant adjustment}",
            examples=[
                r"v=<4,4> -> θ=45°",
                r"v=<-3,3> -> θ=135°",
                r"v=<2,-5> -> θ\approx291.8°",
            ],
            mistake="Using raw arctan without quadrant fix.",
            correction="Adjust angle to [0°,360°) by component signs.",
            quick_checks=[
                "Direction of <-6,-6>?",
                "Direction of <0,5>?",
                "Why use atan2 logic?",
            ],
            recap=r"\theta\text{ needs quadrant check}",
            narration=[
                "Goal direction angle.",
                "Setup inverse tangent.",
                "Check quadrant.",
            ],
        )
        build_standard_scene(self, spec)
