from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V21VectorOperations(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V21",
            topic="Vector Operations",
            objective="Add, subtract, and scale vectors.",
            formula=r"\langle a,b\rangle\pm\langle c,d\rangle=\langle a\pm c,b\pm d\rangle",
            examples=[
                r"<3,-2> + <5,4> = <8,2>",
                r"<7,1> - <2,6> = <5,-5>",
                r"-2<4,-3> = <-8,6>",
            ],
            mistake="Distributing negative signs incorrectly.",
            correction="Write component-wise operation on each coordinate.",
            quick_checks=[
                "Compute <1,5> + <-3,2>.",
                "Compute 3<2,-4>.",
                "Interpret <-2,0> direction.",
            ],
            recap=r"\text{Operate component-wise}",
            narration=[
                "Goal vector arithmetic.",
                "Setup components.",
                "Check direction/magnitude change.",
            ],
        )
        build_standard_scene(self, spec)
