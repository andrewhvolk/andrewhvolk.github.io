from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V28FullReviewMixedCapstone(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V28",
            topic="Full Review Mixed Capstone",
            objective="Integrate core topics across sections 5.1–8.4.",
            formula=r"\text{Angles, triangles, equations, vectors: integrated workflow}",
            examples=[
                r"Angle conversion + trig equation mini-set",
                r"Right-triangle application + bearing checkpoint",
                r"Vector resultant + direction final check",
            ],
            mistake="Jumping formulas without identifying topic.",
            correction="State topic family before selecting formula.",
            quick_checks=[
                "Which formula family fits this prompt?",
                "What unit/mode checks come first?",
                "How will you verify final answer?",
            ],
            recap=r"\text{Goal→Setup→Solve→Check across topics}",
            narration=[
                "Goal review and synthesis.",
                "Setup by classifying problem.",
                "Check with reasonableness and units.",
            ],
        )
        build_standard_scene(self, spec)
