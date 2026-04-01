from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V14SolveRightTriangleAngle(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V14",
            topic="Solve Right Triangle (Angle)",
            objective="Find unknown angle using inverse trig.",
            formula=r"\theta=\sin^{-1}(o/h),\ \cos^{-1}(a/h),\ \tan^{-1}(o/a)",
            examples=[
                r"o=7, a=24 -> θ=tan⁻¹(7/24)",
                r"o=9, h=15 -> θ=sin⁻¹(3/5)",
                r"a=12, h=13 -> θ=cos⁻¹(12/13)",
            ],
            mistake="Using inverse on reciprocal by accident.",
            correction="Choose inverse matching given ratio exactly.",
            quick_checks=[
                "Find θ if o=5, h=13.",
                "Find θ if a=8, o=6.",
                "Why is second angle 90°-θ?",
            ],
            recap=r"\theta\text{ via inverse trig}",
            narration=[
                "Goal solve angle.",
                "Setup ratio.",
                "Check with complementary angle.",
            ],
        )
        build_standard_scene(self, spec)
