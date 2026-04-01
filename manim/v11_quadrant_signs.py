from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V11QuadrantFromSigns(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V11",
            topic="Quadrant from Signs",
            objective="Determine quadrants from trig signs.",
            formula=r"\text{ASTC sign chart}",
            examples=[
                r"sin>0, cos<0 -> QII",
                r"tan>0, sin<0 -> QIII",
                r"sec<0, csc>0 -> QII",
            ],
            mistake="Confusing tan sign with sin sign.",
            correction="Use tan=sin/cos to validate consistency.",
            quick_checks=[
                "Quadrant if cos>0 and tan<0?",
                "Quadrants where sin<0?",
                "Can sec>0 and cos<0 occur?",
            ],
            recap=r"\text{Use ASTC + consistency check}",
            narration=[
                "Goal locate quadrant.",
                "Setup sign logic.",
                "Check trig identities.",
            ],
        )
        build_standard_scene(self, spec)
