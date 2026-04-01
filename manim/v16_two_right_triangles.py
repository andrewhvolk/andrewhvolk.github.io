from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V16TwoRightTriangles(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V16",
            topic="Two Right Triangles",
            objective="Solve linked-triangle application problems.",
            formula=r"\text{Use shared side relations + trig ratios}",
            examples=[
                r"Two observation points share building height",
                r"Ladder + shadow creates pair of triangles",
                r"Split composite shape into two right triangles",
            ],
            mistake="Not defining shared variable clearly.",
            correction="Assign variable once, reuse in both equations.",
            quick_checks=[
                "Name a shared side in a two-triangle setup.",
                "Which equation should be solved first?",
                "How to verify both triangles fit final answer?",
            ],
            recap=r"\text{Define shared variable early}",
            narration=[
                "Goal connect triangles.",
                "Setup two equations.",
                "Check both contexts.",
            ],
        )
        build_standard_scene(self, spec)
