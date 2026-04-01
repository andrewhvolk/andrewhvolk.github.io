from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V09ReferenceAngleDegrees(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V09",
            topic="Reference Angle (Degrees)",
            objective="Find reference angle for any degree measure.",
            formula=r"\alpha=\text{distance to nearest }x\text{-axis}",
            examples=[
                r"θ=150° -> α=30°",
                r"θ=225° -> α=45°",
                r"θ=330° -> α=30°",
            ],
            mistake="Using quadrant angle instead of acute reference.",
            correction="Reference angle must be acute (0° to 90°).",
            quick_checks=[
                "Find α for 112°.",
                "Find α for 289°.",
                "Find α for -135° after normalization.",
            ],
            recap=r"\alpha\in(0^\circ,90^\circ)",
            narration=[
                "Goal identify reference angle.",
                "Setup via quadrant rules.",
                "Check acute result.",
            ],
        )
        build_standard_scene(self, spec)
