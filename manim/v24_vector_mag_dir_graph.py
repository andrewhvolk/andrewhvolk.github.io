from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V24VectorMagnitudeDirectionFromGraph(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V24",
            topic="Vector Magnitude + Direction from Graph",
            objective="Read vector from graph and compute magnitude/direction.",
            formula=r"\Delta x,\Delta y \to |v|,\theta",
            examples=[
                r"Graph shows move (5,2) -> |v|=√29, θ≈21.8°",
                r"Graph move (-4,3) -> |v|=5, θ≈143.1°",
                r"Graph move (-2,-6) -> |v|=√40, θ≈251.6°",
            ],
            mistake="Reading tail as origin when it is shifted.",
            correction="Compute displacement from tail to head first.",
            quick_checks=[
                "If move (0,-7), magnitude and direction?",
                "If move (9,0), direction?",
                "Why same magnitude for opposite vectors?",
            ],
            recap=r"\text{Read }\Delta x,\Delta y\text{ first}",
            narration=[
                "Goal graph to numbers.",
                "Setup displacement.",
                "Check angle quadrant.",
            ],
        )
        build_standard_scene(self, spec)
