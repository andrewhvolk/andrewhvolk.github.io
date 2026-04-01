from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V26ResultantFromDirectionFormVectors(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V26",
            topic="Resultant from Direction-Form Vectors",
            objective="Sum direction-form vectors via components.",
            formula=r"\vec R=\sum\langle r\cos\theta,r\sin\theta\rangle",
            examples=[
                r"20@40° + 12@120° -> resultant components",
                r"15@210° + 8@330° -> resultant direction",
                r"Three-vector sum then magnitude",
            ],
            mistake="Adding magnitudes directly.",
            correction="Convert each vector to components before summing.",
            quick_checks=[
                "First step for resultant from bearings?",
                "After components, how find direction?",
                "Why can resultant be shorter than inputs?",
            ],
            recap=r"\text{Convert then sum components}",
            narration=[
                "Goal resultant vector.",
                "Setup component table.",
                "Check final magnitude and angle.",
            ],
        )
        build_standard_scene(self, spec)
