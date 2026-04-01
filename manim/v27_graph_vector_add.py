from manim import Scene

from style.scene_factory import VideoSpec, build_standard_scene


class V27GraphStyleVectorAddition(Scene):
    def construct(self) -> None:
        spec = VideoSpec(
            code="V27",
            topic="Graph-Style Vector Addition",
            objective="Add vectors head-to-tail on graph.",
            formula=r"\vec u+\vec v=\langle u_x+v_x,u_y+v_y\rangle",
            examples=[
                r"Translate second vector to head of first",
                r"Read resultant from first tail to last head",
                r"Compare graphical and algebraic result",
            ],
            mistake="Connecting tails instead of head-to-tail.",
            correction="Keep direction/length fixed when translating vector.",
            quick_checks=[
                "Graphically add <2,1> and <-1,3>.",
                "Resultant of opposite vectors?",
                "Why translation preserves vector?",
            ],
            recap=r"\text{Head-to-tail then read resultant}",
            narration=[
                "Goal graphical addition.",
                "Setup translated vector.",
                "Check with components.",
            ],
        )
        build_standard_scene(self, spec)
