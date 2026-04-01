from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V19AreaOfNonRightTriangle(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V19",
            topic="Area of Non-Right Triangle",
            objective="Compute area with A = 1/2 ab sin(C).",
            formula=r"A=\frac{1}{2}ab\sin(C)",
            examples=[
                r"a=12, b=9, C=40°",
                r"a=7, b=15, C=112°",
                r"Given area and sides, solve for C",
            ],
            mistake="Using cosine in area formula.",
            correction="Area for included angle uses sine only.",
            quick_checks=[
                "Find area for a=10,b=5,C=30°.",
                "Does C=150° give positive area?",
                "What if included angle missing?",
            ],
            recap=r"A=\frac12 ab\sin(C)",
            narration=[
                "Goal area of oblique triangle.",
                "Setup included angle.",
                "Check units squared.",
            ],
        )
        build_standard_scene(self, spec)
