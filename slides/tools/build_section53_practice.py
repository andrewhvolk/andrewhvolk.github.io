"""Build two core Section 5.3 pages, optional extensions, and a separate key."""
import math
from pathlib import Path
from practice_packet_layout import Packet

ROOT=Path(__file__).resolve().parents[2]

def build():
    p=Packet(ROOT/'pdfs/math130-reference-angles-practice-2026-11-13.pdf','MATH 130 | Section 5.3 | November 13, 2026')
    p.title('Reference angles and exact values','Core practice · Page 1 of 2 · Name: __________________________')
    p.p('Sketch each angle. Give exact values and show your reasoning. These are fresh practice examples; quiz dates and official coverage are in Canvas.','small')
    p.question(1,'For θ = 240°, sketch the terminal side and complete the chain.')
    p.sketch_and_fields(['Quadrant: ________','Reference angle α = __________','sin α = __________; sin θ = __________'])
    p.question(2,'For θ = −7π/4, sketch the terminal side and complete the chain in radians.')
    p.sketch_and_fields(['Quadrant: ________','Reference angle α = __________','cos α = __________; cos θ = __________'])
    p.question(3,'Identify the quadrant and explain how both sign conditions hold.')
    p.p('(a) sec θ &gt; 0 and tan θ &lt; 0: ____________________________________')
    p.p('(b) sin θ &lt; 0 and tan θ &gt; 0: ____________________________________')
    p.page()
    p.title('A signed point and exact equations','Core practice · Page 2 of 2 · Work first, then check the separate answer key.')
    p.question(4,'The terminal side of θ passes through (−4, −7). Find r and all six trigonometric functions. Keep radicals exact.')
    p.p('r = √(__________ + __________) = __________________')
    p.ratio_table()
    p.question(5,'Find all solutions with 0° ≤ θ &lt; 360°. Give exact angle measures.')
    p.p('(a) cos θ = −1/2','question')
    p.sketch_and_fields(['Reference angle: __________','Both solution angles: __________________'])
    p.p('(b) sin θ = √2/2','question')
    p.p('Reference angle: __________  Both solution angles: __________________')
    p.page()
    p.title('Optional calculator and domain checks','Extension practice · Complete after the two core pages or use for extra review.')
    p.question(6,'A second terminal point is (−8, −14). Would the six function values change? Explain without starting over.',35)
    p.question(7,'Find all solutions of sin θ = −0.620 with 0° ≤ θ &lt; 360°. Label the calculator’s principal output separately and round only the final answers to two decimals.',92)
    p.question(8,'Find all solutions of tan θ = −1.400 with 0° ≤ θ &lt; 360°. Round final answers to two decimals.',92)
    p.question(9,'Does sin θ = 1.120 have any real solution? Explain before using a calculator.',60)
    p.question(10,'Find sin 270°, cos 0°, tan 270°, and csc 180°. Identify any zero denominator.',60)
    p.page()
    p.title('Answer key','Core pages first; optional extension answers follow. Equivalent radical forms are valid.')
    alpha=math.degrees(math.asin(.620))
    tanalpha=math.degrees(math.atan(1.400))
    answers=[
        (1,'240° is in QIII. α = 60°; sin α = √3/2; sin θ = −√3/2.'),
        (2,'−7π/4 + 2π = π/4, in QI. α = π/4; cos α = √2/2; cos θ = √2/2.'),
        (3,'(a) QIV: secant and cosine are positive, while tangent is negative. (b) QIII: sine is negative and tangent is positive.'),
        (4,'r = √(16 + 49) = √65. sin θ = −7/√65; cos θ = −4/√65; tan θ = 7/4; csc θ = −√65/7; sec θ = −√65/4; cot θ = 4/7. Rationalized equivalents are acceptable.'),
        (5,'(a) Reference angle 60°; cosine is negative in QII and QIII: 120°, 240°. (b) Reference angle 45°; sine is positive in QI and QII: 45°, 135°.'),
        (6,'No. The new point is twice as far from the origin on the same ray. x, y, and r all double, so every ratio stays the same.'),
        (7,f'Principal output ≈ −{alpha:.2f}°, outside the interval. Sine is negative in QIII and QIV. The interval solutions are {180+alpha:.2f}° and {360-alpha:.2f}°.'),
        (8,f'The reference angle is arctan(1.400). Tangent is negative in QII and QIV. The interval solutions are {180-tanalpha:.2f}° and {360-tanalpha:.2f}°.'),
        (9,'No real solution. Every real sine value lies in [−1, 1].'),
        (10,'sin 270° = −1; cos 0° = 1. tan 270° is undefined because x = 0; csc 180° is undefined because y = 0.'),
    ]
    for n,answer in answers:p.p(f'<b>{n}.</b> {answer}')
    p.save()

if __name__=='__main__':build()
