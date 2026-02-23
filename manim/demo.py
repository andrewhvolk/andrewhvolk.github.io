from manim import *

class PhysicsDemo(Scene):
    def construct(self):
        # A simple LaTeX formula for your physics classes
        tex = MathTex(r"E = mc^2").scale(2)
        circle = Circle(color=RED).surround(tex, buffer_factor=1.5)

        self.play(Write(tex))
        self.play(Create(circle))
        self.play(tex.animate.set_color(YELLOW), circle.animate.set_stroke(width=8))
        self.wait(2)