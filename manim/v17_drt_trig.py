from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V17DistanceRateTimeWithTrig(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V17",
            topic="Distance-Rate-Time with Trig",
            objective="Combine D=rt with trig geometry.",
            formula=r"D=rt\quad\text{and}\quad\tan\theta=\frac{h}{d}",
            examples=[
                r"Plane climb angle with horizontal speed",
                r"Boat crossing with bearing + current",
                r"Radar line-of-sight with time delay",
            ],
            mistake="Mixing horizontal distance and path distance.",
            correction="State what each distance represents before formulas.",
            quick_checks=[
                "If speed=80 and t=0.5h, find distance.",
                "At 12° climb with 40 km path, find rise.",
                "When to use cosine in DRT trig?",
            ],
            recap=r"\text{Label D, r, t, and geometry}",
            narration=[
                "Goal connect motion + trig.",
                "Setup variables.",
                "Check dimensional consistency.",
            ],
        )
        build_standard_scene(self, spec)
