from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V18BearingNavigationDistance(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V18",
            topic="Bearing / Navigation Distance",
            objective="Use bearings and trig to find distances.",
            formula=r"\text{Bearing measured clockwise from North}",
            examples=[
                r"Bearing N35°E for 20 km -> components",
                r"Two-leg trip bearings -> resultant displacement",
                r"Find distance between ships by law of cosines setup",
            ],
            mistake="Using East as zero direction.",
            correction="Start from North, rotate clockwise for bearing.",
            quick_checks=[
                "Convert S20°W to standard direction info.",
                "Component signs for N10°W?",
                "What axis aligns with North?",
            ],
            recap=r"\text{North-clockwise bearing convention}",
            narration=[
                "Goal decode bearing.",
                "Setup components.",
                "Check signs and direction words.",
            ],
        )
        build_standard_scene(self, spec)
