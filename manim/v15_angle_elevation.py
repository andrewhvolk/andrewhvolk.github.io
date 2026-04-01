from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V15AngleOfElevationDepression(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V15",
            topic="Angle of Elevation/Depression",
            objective="Model and solve elevation/depression problems.",
            formula=r"\tan\theta=\frac{\text{opposite}}{\text{adjacent}}",
            examples=[
                r"From 40 m away, θ=32° find height",
                r"From roof, depression 18° to point 55 m away",
                r"Find distance when height and angle known",
            ],
            mistake="Using wrong reference line.",
            correction="Angle is measured from horizontal line.",
            quick_checks=[
                "A kite is 60 m high at 25°; find horizontal distance.",
                "Depression 12° from 30 m tower; find distance.",
                "Which angle equals alternate interior angle?",
            ],
            recap=r"\text{Draw horizontal first}",
            narration=[
                "Goal translate geometry.",
                "Setup right triangle.",
                "Check units.",
            ],
        )
        build_standard_scene(self, spec)
