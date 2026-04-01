from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V06AngleUnitConversion(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V06",
            topic="Angle Unit Conversion",
            objective="Convert degrees and radians accurately.",
            formula=r"\text{deg to rad: }\theta\cdot\frac{\pi}{180},\quad \text{rad to deg: }\theta\cdot\frac{180}{\pi}",
            examples=[
                r"210° -> 7π/6",
                r"-45° -> -π/4",
                r"5π/3 -> 300°",
            ],
            mistake="Cancelling π incorrectly.",
            correction="Treat π as symbolic constant and simplify fractions.",
            quick_checks=[
                "Convert 135° to rad.",
                "Convert -11π/6 to deg.",
                "Convert 1.2 rad to deg (nearest tenth).",
            ],
            recap=r"\deg\leftrightarrow\text{rad conversion}",
            narration=[
                "Goal convert units.",
                "Setup conversion factor.",
                "Check quadrant sense.",
            ],
        )
        build_standard_scene(self, spec)
