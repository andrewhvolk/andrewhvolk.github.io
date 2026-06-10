#!/usr/bin/env python3
"""One-time authoring seed for the canonical MATH 130 lecture manifests.

The resulting JSON files are canonical. This script refuses to overwrite them
unless --force is supplied and is not part of the normal build.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LECTURES = ROOT / "lectures"
INVENTORY = ROOT / "migration" / "inventory"

PHASE_COMPONENTS = {
    "activate": "poll",
    "explain": "concept",
    "model": "worked-example",
    "practice": "practice",
    "feedback": "misconception",
    "synthesize": "summary",
}

TARGET_MIN = {
    "Math130Unit2A.html": 25,
    "Math130Unit2B.html": 25,
    "Math130Unit2C-part1.html": 22,
    "Math130Unit2C-part2.html": 22,
    "Math130Unit2D-part1.html": 20,
    "Math130Unit2D-part2.html": 20,
    "Math130Unit2E.html": 16,
    "Math130Unit3A.html": 28,
    "Math130Unit3B.html": 22,
    "Math130Unit3C.html": 20,
    "Math130Unit3D.html": 18,
    "Math130Unit3E.html": 16,
}

MODEL_OVERRIDES = {
    r"u2a-graph": {
        r"prompt": [r"Build and graph a five-point table for $f(x)=2^x$."],
        r"steps": [
            r"For $x=-2,-1,0,1,2$, the values are $1/4,1/2,1,2,4$.",
            r"Plot the five points and draw a smooth increasing curve through $(0,1)$.",
            r"Domain: $(-\infty,\infty)$; range: $(0,\infty)$; horizontal asymptote: $y=0$.",
        ],
    },
    r"u2a-e": {
        r"prompt": [r"Evaluate $3.5^{1.6}$ and $(3/4)^{-0.95}$ and check each magnitude."],
        r"steps": [
            r"$3.5^{1.6}\approx7.422$; a base above 1 with a positive exponent should exceed 3.5.",
            r"$(3/4)^{-0.95}\approx1.314$; a negative exponent takes a reciprocal, so the result exceeds 1.",
            r"Both results are positive, as required for positive bases.",
        ],
    },
    r"u2a-interest": {
        r"prompt": [r"Find the balance for $P=44000$, $r=0.0325$, annual compounding, and $t=13$."],
        r"steps": [
            r"Annual compounding gives $n=1$ in $A=P(1+r/n)^{nt}$.",
            r"$A=44000(1.0325)^{13}\approx66684.28$.",
            r"The balance exceeds the principal and retains currency units.",
        ],
    },
    r"u2a-model": {
        r"prompt": [r"For $A(t)=3200(1/2)^{t/14}$, evaluate the model at $t=0$ and $t=40$ hours."],
        r"steps": [
            r"$A(0)=3200(1/2)^0=3200$ units.",
            r"$A(40)=3200(1/2)^{40/14}\approx441.64$ units.",
            r"The decrease is reasonable because 40 hours is almost three half-lives.",
        ],
    },
    r"u2b-forms": {
        r"prompt": [r"Convert $\log_4(64)=3$ and $4^{-3}=1/64$ between forms."],
        r"steps": [
            r"$\log_4(64)=3$ means $4^3=64$.",
            r"$4^{-3}=1/64$ means $\log_4(1/64)=-3$.",
            r"The base remains 4 and the logarithm records the exponent.",
        ],
    },
    r"u2b-evaluate": {
        r"prompt": [r"Evaluate $\log(250)$ and $\ln(40)$, then verify by exponentiating."],
        r"steps": [
            r"$\log(250)\approx2.398$, and $10^{2.398}\approx250$.",
            r"$\ln(40)\approx3.689$, and $e^{3.689}\approx40$.",
            r"The inverse checks confirm both calculator entries.",
        ],
    },
    r"u2b-graphs": {
        r"prompt": [r"Transform $y=\log_2(x)$ into $f(x)=\log_2(x+1)+2$."],
        r"steps": [
            r"Shift the parent graph left 1 and up 2.",
            r"Domain: $(-1,\infty)$; vertical asymptote: $x=-1$.",
            r"Intercepts: $(0,2)$ and $(-3/4,0)$.",
        ],
    },
    r"u2b-solve": {
        r"prompt": [r"Solve $\log_2(x-5)=4$ and evaluate $\log_4(25)$."],
        r"steps": [
            r"$x-5=2^4=16$, so $x=21$; the argument $16$ is positive.",
            r"$\log_4(25)=\ln(25)/\ln(4)\approx2.322$.",
            r"Substitution and exponentiation verify both results.",
        ],
    },
    r"u2c-language": {
        r"prompt": [r"Interpret $\overleftrightarrow{AB}$, $\overrightarrow{AB}$, $\overline{AB}$, and $\angle ABC$."],
        r"steps": [
            r"$\overleftrightarrow{AB}$ extends in both directions; $\overrightarrow{AB}$ starts at A.",
            r"$\overline{AB}$ has endpoints A and B.",
            r"In $\angle ABC$, B is the vertex.",
        ],
    },
    r"u2c-angle-types": {
        r"prompt": [r"Two lines intersect and one angle is $47^\circ$. Find and classify the other three."],
        r"steps": [
            r"The vertical angle is also $47^\circ$.",
            r"Each adjacent angle is $180^\circ-47^\circ=133^\circ$.",
            r"The pair is two acute vertical angles and two obtuse vertical angles.",
        ],
    },
    r"u2c-parallel": {
        r"prompt": [r"Corresponding angles measure $(3x+10)^\circ$ and $(5x-20)^\circ$. Solve."],
        r"steps": [
            r"Corresponding angles are congruent, so $3x+10=5x-20$.",
            r"$30=2x$, so $x=15$.",
            r"Both angles measure $55^\circ$.",
        ],
    },
    r"u2c-polygons": {
        r"prompt": [r"Find an octagon’s interior-angle sum and the area of a trapezoid with bases 12 and 20 and height 7."],
        r"steps": [
            r"$(8-2)180^\circ=1080^\circ$.",
            r"$A=\tfrac12(12+20)(7)=112$ square units.",
            r"Angle measure uses degrees; area uses square units.",
        ],
    },
    r"u2c-triangles": {
        r"prompt": [r"Find the area of an equilateral triangle with side 1600 km."],
        r"steps": [
            r"$A=s^2\sqrt3/4=1600^2\sqrt3/4$.",
            r"$A=640000\sqrt3\approx1108512.52$ square kilometers.",
            r"The exact radical form is preferred unless an approximation is requested.",
        ],
    },
    r"u2c-similarity": {
        r"prompt": [r"Solve $6/9=10/x$, then convert $45^\circ22'18''$ to decimal degrees."],
        r"steps": [
            r"$6x=90$, so $x=15$.",
            r"$45+22/60+18/3600=45.371667^\circ$.",
            r"Corresponding sides stay in the same order and DMS uses factors of 60.",
        ],
    },
    r"u2d-area": {
        r"prompt": [r"A 15-by-10 rectangle has a 5-by-4 corner removed. Find the remaining area two ways."],
        r"steps": [
            r"Subtraction: $15(10)-5(4)=150-20=130$ square units.",
            r"An additive decomposition of the same region also totals 130 square units.",
            r"The result is less than the 150-square-unit bounding rectangle.",
        ],
    },
    r"u2d-circle": {
        r"prompt": [r"Compare radii 3 and 6, then find the annulus area between them."],
        r"steps": [
            r"Circumference changes from $6\pi$ to $12\pi$, so it doubles.",
            r"Area changes from $9\pi$ to $36\pi$, so it quadruples.",
            r"The annulus area is $36\pi-9\pi=27\pi$ square units.",
        ],
    },
    r"u2d-theorems": {
        r"prompt": [r"Find an inscribed angle intercepting a $110^\circ$ arc and a chord angle intercepting arcs $80^\circ$ and $40^\circ$."],
        r"steps": [
            r"The inscribed angle is $110^\circ/2=55^\circ$.",
            r"The intersecting-chord angle is $(80^\circ+40^\circ)/2=60^\circ$.",
            r"The vertex location determines which half-arc rule applies.",
        ],
    },
    r"u2d-radians": {
        r"prompt": [r"For $r=12$ and $\theta=120^\circ$, find arc length and sector area."],
        r"steps": [
            r"$120^\circ=2\pi/3$ radians.",
            r"$s=r\theta=12(2\pi/3)=8\pi\approx25.133$ units.",
            r"$A=\tfrac12r^2\theta=48\pi\approx150.796$ square units.",
        ],
    },
    r"u2d-velocity": {
        r"prompt": [r"A paddle tip at radius 4 ft rotates at 3 rad/s. Find speed and distance in 10 s."],
        r"steps": [
            r"$v=r\omega=4(3)=12$ ft/s.",
            r"$d=vt=12(10)=120$ ft.",
            r"Radians are dimensionless in the linear-speed conversion.",
        ],
    },
    r"u2d-solids": {
        r"prompt": [r"A 10-unit pipe has outer radius 4 and inner radius 3. Find material volume."],
        r"steps": [
            r"$V=\pi(R^2-r^2)h$.",
            r"$V=\pi(4^2-3^2)(10)=70\pi$ cubic units.",
            r"Subtract the inner cylinder from the outer cylinder.",
        ],
    },
    r"u2e-algebra": {
        r"prompt": [r"Find the balance for $2500$ at 5.2% compounded quarterly for 6 years, then convert $\log_2(32)=5$."],
        r"steps": [
            r"$A=2500(1+0.052/4)^{24}\approx3408.53$.",
            r"$\log_2(32)=5$ is equivalent to $2^5=32$.",
            r"The interest result uses dollars; the logarithmic conversion is dimensionless.",
        ],
    },
    r"u2e-angle": {
        r"prompt": [r"Convert $5\pi/6$ to degrees and find arc length for $r=9$, $\theta=2\pi/3$."],
        r"steps": [
            r"$(5\pi/6)(180^\circ/\pi)=150^\circ$.",
            r"$s=r\theta=9(2\pi/3)=6\pi$ units.",
            r"Radians cancel in the arc-length calculation.",
        ],
    },
    r"u2e-geometry": {
        r"prompt": [r"Find a trapezoid area with bases 10 and 16 and height 7, then solve $6/9=x/15$."],
        r"steps": [
            r"$A=\tfrac12(10+16)(7)=91$ square units.",
            r"$9x=90$, so $x=10$.",
            r"Formula choice follows the given measurements and correspondence.",
        ],
    },
    r"u3a-standard": {
        r"prompt": [r"Sketch $225^\circ$ and $-120^\circ$ and identify their quadrants."],
        r"steps": [
            r"$225^\circ=180^\circ+45^\circ$, so it terminates in Quadrant III.",
            r"$-120^\circ+360^\circ=240^\circ$, also in Quadrant III.",
            r"Both begin on the positive x-axis; rotation direction distinguishes the sketches.",
        ],
    },
    r"u3a-coterminal": {
        r"prompt": [r"Find positive and negative coterminal angles for $-97^\circ$ and $9\pi/7$."],
        r"steps": [
            r"$-97^\circ+360^\circ=263^\circ$ and $-97^\circ-360^\circ=-457^\circ$.",
            r"$9\pi/7+2\pi=23\pi/7$ and $9\pi/7-2\pi=-5\pi/7$.",
            r"Coterminal angles differ by full rotations.",
        ],
    },
    r"u3a-arc": {
        r"prompt": [r"For $r=12$ and $\theta=2\pi/3$, compute arc length."],
        r"steps": [
            r"The angle is already in radians.",
            r"$s=r\theta=12(2\pi/3)=8\pi$ units.",
            r"$8\pi$ is about 25.133 units, less than the full circumference $24\pi$.",
        ],
    },
    r"u3a-ratios": {
        r"prompt": [r"A right triangle has opposite leg 40, adjacent leg 9, and hypotenuse 41. Find all six ratios."],
        r"steps": [
            r"$\sin\theta=40/41$, $\cos\theta=9/41$, and $\tan\theta=40/9$.",
            r"$\csc\theta=41/40$, $\sec\theta=41/9$, and $\cot\theta=9/40$.",
            r"$9^2+40^2=41^2$ verifies the side lengths.",
        ],
    },
    r"u3a-applications": {
        r"prompt": [r"A 25 ft ladder makes a $70^\circ$ angle with the ground. Find its vertical reach."],
        r"steps": [
            r"$\sin70^\circ=h/25$.",
            r"$h=25\sin70^\circ\approx23.49$ ft.",
            r"The height is less than the 25 ft hypotenuse.",
        ],
    },
    r"u3b-reference": {
        r"prompt": [r"Find reference angles for $150^\circ$, $310^\circ$, $-120^\circ$, and $7\pi/4$."],
        r"steps": [
            r"$150^\circ$ has reference angle $30^\circ$; $310^\circ$ has $50^\circ$.",
            r"$-120^\circ$ is coterminal with $240^\circ$, so its reference angle is $60^\circ$.",
            r"$7\pi/4$ has reference angle $\pi/4$.",
        ],
    },
    r"u3b-signs": {
        r"prompt": [r"Determine the quadrant if $\tan\theta>0$ and $\cos\theta<0$."],
        r"steps": [
            r"Tangent is positive in Quadrants I and III.",
            r"Cosine is negative in Quadrants II and III.",
            r"The intersection is Quadrant III.",
        ],
    },
    r"u3b-values": {
        r"prompt": [r"For $P=(-3,4)$, calculate r and all six trigonometric values."],
        r"steps": [
            r"$r=\sqrt{(-3)^2+4^2}=5$.",
            r"$\sin\theta=4/5$, $\cos\theta=-3/5$, $\tan\theta=-4/3$.",
            r"$\csc\theta=5/4$, $\sec\theta=-5/3$, $\cot\theta=-3/4$.",
        ],
    },
    r"u3b-area": {
        r"prompt": [r"Find the area when $A=76^\circ$, $b=34$, and $c=21$."],
        r"steps": [
            r"$A_{triangle}=\tfrac12bc\sin A$.",
            r"$A_{triangle}=\tfrac12(34)(21)\sin76^\circ\approx346.40$.",
            r"The result is in square units.",
        ],
    },
    r"u3c-model": {
        r"prompt": [r"A 20 ft ladder makes a $65^\circ$ angle with the ground. Find the height."],
        r"steps": [
            r"$\sin65^\circ=h/20$.",
            r"$h=20\sin65^\circ\approx18.13$ ft.",
            r"The result agrees with the corrected diagram and is less than 20 ft.",
        ],
    },
    r"u3c-motion": {
        r"prompt": [r"A vehicle travels 300 miles at $25^\circ$ north of east. Resolve its displacement."],
        r"steps": [
            r"East component: $300\cos25^\circ\approx271.89$ mi.",
            r"North component: $300\sin25^\circ\approx126.79$ mi.",
            r"$\sqrt{271.89^2+126.79^2}\approx300$ verifies the components.",
        ],
    },
    r"u3c-two": {
        r"prompt": [r"Two tower observations are 50 ft apart with elevation angles $53^\circ$ and $31^\circ$. Find the closer distance d and height h."],
        r"steps": [
            r"$h=d\tan53^\circ=(d+50)\tan31^\circ$.",
            r"$d\approx41.37$ ft and $h\approx54.90$ ft.",
            r"Using the farther distance $91.37$ ft reproduces the same height.",
        ],
    },
    r"u3d-components": {
        r"prompt": [r"Find the vector from $A=(-2,5)$ to $B=(3,-1)$."],
        r"steps": [
            r"Terminal minus initial gives $\langle3-(-2),-1-5\rangle$.",
            r"$\vec v=\langle5,-6\rangle$.",
            r"The corrected diagram moves 5 right and 6 down.",
        ],
    },
    r"u3d-operations": {
        r"prompt": [r"For $u=\langle3,-2\rangle$ and $v=\langle-1,5\rangle$, find $u+v$ and $3u-2v$."],
        r"steps": [
            r"$u+v=\langle2,3\rangle$.",
            r"$3u-2v=\langle9,-6\rangle-\langle-2,10\rangle=\langle11,-16\rangle$.",
            r"The diagram separately confirms stretching and reversal under scalar multiplication.",
        ],
    },
    r"u3d-direction": {
        r"prompt": [r"For $v=\langle-3,4\rangle$, find magnitude and direction."],
        r"steps": [
            r"$|v|=\sqrt{(-3)^2+4^2}=5$.",
            r"The reference angle is $\tan^{-1}(4/3)\approx53.13^\circ$.",
            r"Quadrant II gives $\theta=180^\circ-53.13^\circ\approx126.87^\circ$.",
        ],
    },
    r"u3e-angles": {
        r"prompt": [r"Find the remaining ratios when $\cos\theta=9/41$ in Quadrant I, then analyze $-97^\circ$."],
        r"steps": [
            r"The missing leg is 40, so $\sin\theta=40/41$ and $\tan\theta=40/9$.",
            r"$-97^\circ$ is coterminal with $263^\circ$ in Quadrant III.",
            r"Its reference angle is $263^\circ-180^\circ=83^\circ$.",
        ],
    },
    r"u3e-triangles": {
        r"prompt": [r"Solve a right triangle with leg $a=11$, hypotenuse $c=35$, then find area for $A=76^\circ$, $b=34$, $c=21$."],
        r"steps": [
            r"$b=\sqrt{35^2-11^2}=4\sqrt{69}\approx33.23$.",
            r"$A\approx18.32^\circ$ and $B\approx71.68^\circ$.",
            r"Included-angle area is $\tfrac12(34)(21)\sin76^\circ\approx346.40$ square units.",
        ],
    },
    r"u3e-vectors": {
        r"prompt": [r"Find the vector from $P=(3,-1)$ to $Q=(-2,4)$, then its magnitude and direction."],
        r"steps": [
            r"$\vec v=\langle-2-3,4-(-1)\rangle=\langle-5,5\rangle$.",
            r"$|v|=\sqrt{50}=5\sqrt2$.",
            r"The Quadrant II direction angle is $135^\circ$.",
        ],
    },
}

PRACTICE_OVERRIDES = {
    r"u2a-graph": {
        r"answer": [
            r"Points: $(-2,1/9),(-1,1/3),(0,1),(1,3),(2,9)$.",
            r"Intercept: $(0,1)$; domain: $(-\infty,\infty)$; range: $(0,\infty)$; asymptote: $y=0$.",
        ],
    },
    r"u2b-forms": {
        r"prompt": [r"Rewrite $5^3=125$, $3^{-2}=1/9$, and $\ln(7)=x$ in the opposite form."],
        r"answer": [r"$\log_5(125)=3$.", r"$\log_3(1/9)=-2$.", r"$e^x=7$."],
    },
    r"u2b-solve": {
        r"answer": [r"$x=\log(175)/\log(3)\approx4.701$.", r"$\log_3(50)\approx3.561$."],
    },
    r"u2c-language": {
        r"prompt": [r"Identify $\overleftrightarrow{AB}$, $\overrightarrow{AB}$, $\overline{AB}$, and $\angle ABC$, including endpoints or vertex."],
        r"answer": [
            r"$\overleftrightarrow{AB}$ is a line; $\overrightarrow{AB}$ is a ray with endpoint A.",
            r"$\overline{AB}$ is a segment with endpoints A and B; $\angle ABC$ has vertex B.",
        ],
    },
    r"u2c-similarity": {
        r"prompt": [r"Convert $73.625^\circ$ to DMS. A larger similar triangle has scale factor $3/2$ from a smaller triangle whose corresponding side is 14; find the larger side."],
        r"answer": [r"$73.625^\circ=73^\circ37'30''$.", r"The larger side is $14(3/2)=21$."],
    },
    r"u2e-geometry": {
        r"prompt": [r"Solve $6/9=x/15$. Then find the rim speed of a wheel with radius 0.4 m turning at 5 rad/s."],
        r"answer": [r"$9x=90$, so $x=10$.", r"$v=r\omega=0.4(5)=2$ m/s."],
    },
    r"u3a-standard": {
        r"answer": [r"The initial side is the positive x-axis; $310^\circ$ terminates in Quadrant IV, $50^\circ$ below the positive x-axis."],
    },
    r"u3b-values": {
        r"answer": [
            r"For $P=(-2,-5)$, $r=\sqrt{29}$; $\sin=-5/\sqrt{29}$, $\cos=-2/\sqrt{29}$, $\tan=5/2$.",
            r"$\csc=-\sqrt{29}/5$, $\sec=-\sqrt{29}/2$, $\cot=2/5$; $\sin240^\circ=-\sqrt3/2$.",
        ],
    },
    r"u3e-angles": {
        r"prompt": [r"Find $\sin225^\circ$. Then find a positive coterminal angle and reference angle for $-97^\circ$."],
        r"answer": [r"$\sin225^\circ=-\sqrt2/2$.", r"Positive coterminal angle: $263^\circ$; reference angle: $83^\circ$."],
    },
    r"u3e-triangles": {
        r"prompt": [r"Observation points 50 ft apart measure tower elevation angles $53^\circ$ and $31^\circ$. Find the tower height."],
        r"answer": [
            r"$d\tan53^\circ=(d+50)\tan31^\circ$, so $d\approx41.37$ ft.",
            r"$h=d\tan53^\circ\approx54.90$ ft.",
        ],
    },
}


def objective(
    oid: str,
    text: str,
    sources: list[int],
    activate: str,
    explain: list[str],
    model: list[str],
    practice: list[str],
    answer: list[str],
    feedback: list[str],
    synthesize: str,
    *,
    formula: bool = False,
    decision: bool = False,
    asset: tuple[str, str] | None = None,
    verification: list[str] | None = None,
) -> dict:
    return {
        "id": oid,
        "text": text,
        "sources": sources,
        "activate": activate,
        "explain": explain,
        "model": model,
        "practice": practice,
        "answer": answer,
        "feedback": feedback,
        "synthesize": synthesize,
        "formula": formula,
        "decision": decision,
        "asset": asset,
        "verification": verification or [],
    }


def partition(values: list[int], count: int = 5) -> list[list[int]]:
    groups = [[] for _ in range(count)]
    for index, value in enumerate(values):
        groups[min(index * count // max(len(values), 1), count - 1)].append(value)
    return groups


def cycle_blocks(deck_id: str, spec: dict) -> list[dict]:
    source_groups = partition(spec["sources"])
    model_override = MODEL_OVERRIDES[spec["id"]]
    practice_override = PRACTICE_OVERRIDES.get(spec["id"], {})
    phases = ["activate", "explain", "model", "practice", "feedback", "synthesize"]
    titles = {
        "activate": f"Predict: {spec['text']}",
        "explain": spec["text"],
        "model": f"Model the Skill: {spec['text']}",
        "practice": f"You Try: {spec['text']}",
        "feedback": f"Check and Diagnose: {spec['text']}",
        "synthesize": f"Make It Stick: {spec['text']}",
    }
    blocks: list[dict] = []
    for phase_index, phase in enumerate(phases):
        component = PHASE_COMPONENTS[phase]
        if phase == "explain" and spec.get("formula"):
            component = "formula"
        if phase == "explain" and spec.get("decision"):
            component = "decision"
        if phase == "model" and spec.get("asset"):
            component = "diagram"
        elif phase == "model" and spec.get("formula"):
            component = "derivation"
        if phase == "feedback" and spec.get("decision"):
            component = "comparison"
        content = {
            "activate": [spec["activate"]],
            "explain": spec["explain"],
            "model": model_override["prompt"],
            "practice": practice_override.get("prompt", spec["practice"]),
            "feedback": spec["feedback"],
            "synthesize": [spec["synthesize"]],
        }[phase]
        block = {
            "id": f"{deck_id.lower()}-{spec['id']}-{phase}",
            "title": titles[phase],
            "phase": phase,
            "component": component,
            "objectives": [spec["id"]],
            "minutes": {
                "activate": 1.0,
                "explain": 2.5,
                "model": 3.0,
                "practice": 3.0,
                "feedback": 2.0,
                "synthesize": 0.5,
            }[phase],
            "source_slides": [] if phase == "activate" else source_groups[phase_index - 1],
            "content": content,
            "instructor_notes": {
                "activate": ["Require an individual prediction before discussion."],
                "practice": ["Pause before revealing the solution."],
                "feedback": ["Ask students to explain why the incorrect path fails."],
            }.get(phase, []),
            "verification": spec["verification"] if phase in {"model", "feedback"} else [],
        }
        if phase == "practice":
            block["answer"] = practice_override.get("answer", spec["answer"])
        if phase == "model":
            block["steps"] = model_override["steps"]
            block["audit_checks"] = [spec["id"]]
            if component == "diagram":
                block["content"] = model_override["prompt"] + model_override["steps"]
            if spec.get("asset"):
                block["assets"] = [{"src": spec["asset"][0], "alt": spec["asset"][1]}]
        blocks.append(block)
    return blocks


def title_block(deck: dict, session: dict, source_slides: list[int]) -> dict:
    return {
        "id": f"{session['id']}-title",
        "title": session["title"],
        "phase": "activate",
        "component": "title",
        "objectives": [],
        "minutes": 0,
        "source_slides": source_slides,
        "content": [session["subtitle"], deck["section"]],
    }


def roadmap_block(session: dict, objectives: list[dict], source_slides: list[int]) -> dict:
    return {
        "id": f"{session['id']}-roadmap",
        "title": "Today’s Learning Roadmap",
        "phase": "activate",
        "component": "roadmap",
        "objectives": [item["id"] for item in objectives],
        "minutes": 0.5,
        "source_slides": source_slides,
        "content": [item["text"] for item in objectives],
    }


def chapter_block(session: dict) -> dict:
    return {
        "id": f"{session['id']}-chapter",
        "title": session["chapter"],
        "phase": "activate",
        "component": "chapter",
        "objectives": [],
        "minutes": 0,
        "source_slides": [],
        "content": [session["chapter_prompt"]],
    }


def closing_block(session: dict, objectives: list[dict]) -> dict:
    return {
        "id": f"{session['id']}-closing",
        "title": "Session Summary and Exit Ticket",
        "phase": "synthesize",
        "component": "summary",
        "objectives": [item["id"] for item in objectives],
        "minutes": 1.5,
        "source_slides": session.get("closing_sources", []),
        "content": [
            "State the most important idea from today without looking at your notes.",
            "Complete one representative setup and identify the step most likely to cause an error.",
            "Write one question that should be answered before the next assessment."
        ],
        "answer": ["Use the objective roadmap to identify any skill that still needs deliberate practice."],
    }


def build_manifest(spec: dict) -> dict:
    objectives = [
        {"id": item["id"], "text": item["text"]}
        for session in spec["sessions"]
        for item in session["objectives"]
    ]
    sessions = []
    mapped: dict[int, str] = {}
    for session in spec["sessions"]:
        blocks = [
            title_block(spec["deck"], session, session.get("title_sources", [])),
            roadmap_block(session, session["objectives"], session.get("roadmap_sources", [])),
        ]
        if session.get("chapter"):
            blocks.append(chapter_block(session))
        for item in session["objectives"]:
            blocks.extend(cycle_blocks(spec["deck"]["id"], item))
        blocks.append(closing_block(session, session["objectives"]))
        elapsed = 0.0
        stopping_points = []
        for block in blocks:
            if not block.get("optional"):
                elapsed += float(block["minutes"])
            if block["phase"] == "synthesize" and block["component"] == "summary" and block["id"] != f"{session['id']}-closing":
                block["pacing_checkpoint"] = "Check elapsed time before beginning the next objective."
                block.setdefault("instructor_notes", []).append(
                    "If more than 3 minutes behind, shorten discussion but preserve the next practice and feedback slides."
                )
                stopping_points.append({
                    "after_block": block["id"],
                    "planned_elapsed": elapsed,
                    "action": "Continue if on time; if more than 3 minutes behind, shorten discussion while preserving practice and feedback.",
                })
        planned_minutes = sum(float(block["minutes"]) for block in blocks if not block.get("optional"))
        buffer_minutes = float(session["duration_minutes"]) - planned_minutes
        if buffer_minutes < 5:
            raise ValueError(f"{session['id']}: fewer than 5 minutes remain for classroom buffer")
        for block in blocks:
            for slide in block["source_slides"]:
                if slide in mapped:
                    raise ValueError(f"{spec['deck']['id']}: source slide {slide} mapped twice")
                mapped[slide] = block["id"]
        sessions.append({
            "id": session["id"],
            "title": session["title"],
            "subtitle": session["subtitle"],
            "output": session["output"],
            "duration_minutes": session["duration_minutes"],
            "min_slides": TARGET_MIN[session["output"]],
            "max_slides": session["max_slides"],
            "rehearsal": {
                "status": "pending_live_rehearsal",
                "planned_instruction_minutes": planned_minutes,
                "reserved_buffer_minutes": 5,
                "available_flex_minutes": buffer_minutes,
                "stopping_points": stopping_points,
            },
            "pilot": {
                "candidate": spec["deck"]["id"] in {"Math130Unit2A", "Math130Unit3A"},
                "status": "pending_classroom_use",
            },
            "blocks": blocks,
        })

    source_count = spec["source_count"]
    omitted = spec.get("omitted", {})
    disposition = []
    for slide in range(1, source_count + 1):
        if slide in mapped:
            disposition.append({"slide": slide, "disposition": "mapped", "block": mapped[slide]})
        elif slide in omitted:
            disposition.append({"slide": slide, "disposition": "omitted", "rationale": omitted[slide]})
        else:
            raise ValueError(f"{spec['deck']['id']}: source slide {slide} is not mapped or omitted")
    return {
        "$schema": "lecture-manifest.schema.json",
        "version": 1,
        "deck": spec["deck"],
        "objectives": objectives,
        "sessions": sessions,
        "source_disposition": disposition,
    }


def specs() -> list[dict]:
    return [
        {
            "source_count": 31,
            "deck": {
                "id": "Math130Unit2A", "title": "Exponential Functions",
                "section": "Section 4.2", "source": "Math130Unit2A.pptx", "canonical": True
            },
            "sessions": [{
                "id": "unit2a", "title": "Exponential Functions",
                "subtitle": "Growth, decay, compound interest, and modeling",
                "output": "Math130Unit2A.html", "duration_minutes": 55, "max_slides": 30,
                "title_sources": [1], "roadmap_sources": [2], "closing_sources": [30, 31],
                "objectives": [
                    objective(
                        "u2a-graph", "recognize and graph exponential functions", [3, 4, 5, 6, 7, 8, 9, 10, 11],
                        "Which grows faster for large x: x² or 2ˣ? Explain before calculating.",
                        ["An exponential function has the variable in the exponent: $f(x)=b^x$, where $b>0$ and $b\\ne1$.",
                         "All parent exponential graphs pass through $(0,1)$, have domain $(-\\infty,\\infty)$, range $(0,\\infty)$, and asymptote $y=0$."],
                        ["Build a table for $f(x)=2^x$ at $x=-2,-1,0,1,2$.",
                         "Plot the points and use the base to identify growth."],
                        ["Graph $g(x)=3^x$ using five points. Label the intercept, domain, range, and asymptote."],
                        ["Points: $(-2,1/9),(-1,1/3),(0,1),(1,3),(2,9)$.", "Asymptote: $y=0$; the graph shows growth."],
                        ["Do not confuse $x^2$ with $2^x$.", "A larger growth base is steeper to the right; a base between 0 and 1 produces decay."],
                        "Explain how the base determines growth or decay and name the four invariant graph features.",
                        asset=("assets/math130unit2a/slide-05-1.png", "Graph of the exponential function two to the x"),
                        verification=["Verify all plotted exponential points and asymptotes."]
                    ),
                    objective(
                        "u2a-e", "evaluate exponential expressions and use the natural base e", [12, 13, 14, 15, 16],
                        "What value should $e^0$ have, and why must that be true?",
                        ["$e\\approx2.71828$ is the natural base.", "Calculator entry requires parentheses around negative or fractional exponents."],
                        ["Evaluate $3.5^{1.6}$ and $(3/4)^{-0.95}$, then check whether each magnitude is reasonable."],
                        ["Evaluate $e^{-0.15}$ and $175e^{0.5}$ to the nearest thousandth."],
                        ["$e^{-0.15}\\approx0.861$.", "$175e^{0.5}\\approx288.526$."],
                        ["A negative exponent does not make the result negative.", "Estimate first: $e^{0.5}$ lies between 1 and e."],
                        "Describe one calculator check that catches an exponent-entry error.",
                        formula=True, verification=["Recalculate all rounded exponential values."]
                    ),
                    objective(
                        "u2a-interest", "select and apply simple, periodic, and continuous interest formulas", [17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
                        "Which wording tells you whether an interest problem needs n or e?",
                        ["Simple: $I=Prt$.", "Periodic compound: $A=P(1+r/n)^{nt}$.", "Continuous compound: $A=Pe^{rt}$."],
                        ["For $P=44000$, $r=0.0325$, annual compounding, and $t=13$, identify every variable before substituting.",
                         "Compute $A=44000(1.0325)^{13}$."],
                        ["$2000 is invested at 3.1% compounded semiannually for 3 years. Find A."],
                        ["Use $P=2000$, $r=0.031$, $n=2$, $t=3$.", "$A\\approx2193.36$."],
                        ["Convert percentages to decimals.", "n is compounds per year, not the number of years.", "Continuous compounding has no n."],
                        "Give a decision rule that selects the correct interest formula from the wording.",
                        formula=True, decision=True,
                        verification=["Recalculate annual, semiannual, and continuous interest examples."]
                    ),
                    objective(
                        "u2a-model", "interpret exponential growth and decay models", [27, 28, 29],
                        "In $A(t)=3200(1/2)^{t/14}$, what does each number mean?",
                        ["A coefficient gives the initial amount.", "A factor above 1 models growth; a factor between 0 and 1 models decay.",
                         "The exponent $t/14$ counts the number of half-lives."],
                        ["For uranium-240, evaluate the model at $t=0$ and $t=40$ hours."],
                        ["A culture begins with 500 cells and doubles every 3 hours. Write a model and estimate the population after 10 hours."],
                        ["$B(t)=500\\cdot2^{t/3}$.", "$B(10)\\approx5039.7$ cells."],
                        ["The initial amount is found by setting time equal to zero.", "Keep units attached to time and rate quantities."],
                        "Explain how to read initial value, growth or decay factor, and time scale from an exponential model.",
                        verification=["Verify decay and bacteria model calculations and units."]
                    )
                ]
            }]
        },
        {
            "source_count": 31,
            "deck": {
                "id": "Math130Unit2B", "title": "Logarithmic Functions",
                "section": "Section 4.3", "source": "Math130Unit2B.pptx", "canonical": True
            },
            "sessions": [{
                "id": "unit2b", "title": "Logarithmic Functions",
                "subtitle": "Inverse relationships, graphs, equations, and applications",
                "output": "Math130Unit2B.html", "duration_minutes": 55, "max_slides": 30,
                "title_sources": [1], "roadmap_sources": [2], "closing_sources": [29, 30, 31],
                "objectives": [
                    objective(
                        "u2b-forms", "convert between logarithmic and exponential forms", [3, 4, 5, 6, 7, 8],
                        "If $2^5=32$, what question is $\\log_2(32)$ answering?",
                        ["$\\log_b(x)=y$ means exactly $b^y=x$.", "The logarithm is the exponent."],
                        ["Convert $\\log_4(64)=3$ and $4^{-3}=1/64$ between forms."],
                        ["Rewrite $5^3=125$, $3^{-2}=1/9$, and $\\ln(e^5)=5$ in the opposite form."],
                        ["$\\log_5(125)=3$.", "$\\log_3(1/9)=-2$.", "$e^5=e^5$ confirms $\\ln(e^5)=5$."],
                        ["Keep the base unchanged.", "The log argument becomes the exponential result."],
                        "Complete the sentence: a logarithm tells us ____.",
                        formula=True
                    ),
                    objective(
                        "u2b-evaluate", "evaluate and simplify logarithmic expressions", [9, 10, 11, 12, 13, 14, 15],
                        "Without a calculator, evaluate $\\log_2(32)$ and $\\ln(1)$.",
                        ["Common log has base 10; natural log has base e.", "$\\log_b(1)=0$, $\\log_b(b)=1$, and $\\log_b(b^x)=x$."],
                        ["Evaluate $\\log(250)$ and $\\ln(40)$, then verify by exponentiating."],
                        ["Simplify $\\log_7(1)$, $\\ln(e^{-5/2})$, and $e^{\\ln 7}$."],
                        ["$0$, $-5/2$, and $7$."],
                        ["A logarithm of a number between 0 and 1 is negative when the base exceeds 1.", "Logs undo exponents only when bases match."],
                        "Name two inverse identities involving logarithms and exponents.",
                        formula=True
                    ),
                    objective(
                        "u2b-graphs", "graph logarithmic functions and determine their domains", [16, 17, 18, 19, 20],
                        "What feature of an exponential graph becomes the vertical asymptote of its inverse?",
                        ["Logarithmic graphs reflect exponential graphs across $y=x$.", "For $f(x)=\\log_b(g(x))$, require $g(x)>0$."],
                        ["Transform $y=\\log_2(x)$ into $f(x)=\\log_2(x+1)+2$ and track the asymptote."],
                        ["Find the domain and vertical asymptote of $\\log(3x-6)$."],
                        ["Require $3x-6>0$, so $x>2$.", "Domain: $(2,\\infty)$; asymptote: $x=2$."],
                        ["The logarithm argument must be strictly positive, not merely nonnegative.", "Horizontal shifts move the vertical asymptote."],
                        "Explain how to find a logarithmic domain before graphing.",
                        asset=("assets/math130unit2b/corrected/log-transform.svg", "Graph of f of x equals log base 2 of x plus 1, plus 2, with vertical asymptote x equals negative 1 and labeled intercepts"),
                        verification=["Verify transformed graph features and domain inequalities."]
                    ),
                    objective(
                        "u2b-solve", "solve logarithmic and exponential equations using inverse properties", [21, 22, 23, 24, 25, 26, 27, 28],
                        "When should you convert to exponential form, and when should you take a logarithm?",
                        ["Use exponential form for a single logarithm.", "Use one-to-one properties when equal logs have the same base.",
                         "Use change of base: $\\log_a(x)=\\log(x)/\\log(a)$."],
                        ["Solve $\\log_2(x-5)=4$ and check the domain.", "Evaluate $\\log_4(25)$ using change of base."],
                        ["Solve $3^x=175$ and evaluate $\\log_3(50)$."],
                        ["$x=\\log(175)/\\log(3)\\approx4.700$.", "$\\log_3(50)\\approx3.561$."],
                        ["Reject solutions that make a log argument nonpositive.", "The log of a sum is not the sum of logs."],
                        "Write a two-step checklist for solving and checking a logarithmic equation.",
                        formula=True, verification=["Recalculate equation solutions and change-of-base values."]
                    )
                ]
            }]
        },
        geometry_2c_spec(),
        geometry_2d_spec(),
        review_2e_spec(),
        trig_3a_spec(),
        trig_3b_spec(),
        trig_3c_spec(),
        vectors_3d_spec(),
        review_3e_spec(),
    ]


def geometry_2c_spec() -> dict:
    return {
        "source_count": 57,
        "omitted": {2: "Blank source slide.", 18: "Blank transition duplicated by authored chapter structure.", 56: "Duplicate closing title slide."},
        "deck": {
            "id": "Math130Unit2C", "title": "Geometry: Angles and Polygons",
            "section": "Unit 2", "source": "Math130Unit2C.pptx", "canonical": True,
            "chooser_output": "Math130Unit2C.html"
        },
        "sessions": [
            {
                "id": "unit2c-part1", "title": "Geometry Foundations and Angle Relationships",
                "subtitle": "Lines, angles, parallel-line relationships, and equation solving",
                "chapter": "Session 1 · Foundations and Angles",
                "chapter_prompt": "Build a precise vocabulary, then use relationships to solve unknown angles.",
                "output": "Math130Unit2C-part1.html", "duration_minutes": 55, "max_slides": 28,
                "title_sources": [1, 4], "roadmap_sources": [3], "closing_sources": [],
                "objectives": [
                    objective(
                        "u2c-language", "use geometric notation and distinguish congruence from similarity", [5, 6, 7, 8],
                        "What information is lost if a ray’s endpoint is written second?",
                        ["Point, line, and plane are accepted undefined terms.", "Order matters in ray and angle notation.",
                         "Congruent figures have equal size and shape; similar figures have proportional corresponding sides."],
                        ["Interpret line AB, ray AB, segment AB, and angle ABC from their notation."],
                        ["Classify four diagrams as line, ray, segment, or angle and write correct notation."],
                        ["The endpoint of ray AB is A.", "In angle ABC, B is the vertex."],
                        ["Do not reverse ray endpoints.", "Similarity does not imply equal side lengths."],
                        "Explain the difference between congruence and similarity in one sentence."
                    ),
                    objective(
                        "u2c-angle-types", "measure, classify, and relate angles", [9, 10, 11, 12],
                        "Can two obtuse angles be complementary? Explain.",
                        ["Acute angles are below 90°, right angles equal 90°, obtuse angles lie between 90° and 180°, and straight angles equal 180°.",
                         "Vertical angles are congruent; a linear pair is supplementary."],
                        ["Use a relationship map to classify adjacent, vertical, complementary, supplementary, and linear-pair relationships."],
                        ["Two intersecting lines create an angle of 68°. Find the other three angles."],
                        ["The vertical angle is 68°; each adjacent angle is 112°."],
                        ["Adjacent does not automatically mean supplementary.", "Complementary means a sum of 90°, not equal measures."],
                        "Given one angle at an intersection, describe how to find the other three.",
                        verification=["Verify angle classifications and supplementary calculations."]
                    ),
                    objective(
                        "u2c-parallel", "use parallel-line relationships to solve angle equations", [13, 14, 15, 16, 17],
                        "When a transversal crosses parallel lines, which angle pairs must be equal?",
                        ["Corresponding, alternate interior, and alternate exterior angles are congruent.", "Same-side interior angles are supplementary."],
                        ["For corresponding angles $(3x+10)^\\circ$ and $(5x-20)^\\circ$, set them equal and solve."],
                        ["Write and solve an equation for a same-side interior pair $(4x+8)^\\circ$ and $(6x+12)^\\circ$."],
                        ["$4x+8+6x+12=180$, so $x=16$."],
                        ["Name the relationship before writing the equation.", "After solving x, substitute back to find the requested angle."],
                        "State the relationship-to-equation rule for equal and supplementary pairs.",
                        decision=True, verification=["Verify all parallel-line angle equations."]
                    )
                ]
            },
            {
                "id": "unit2c-part2", "title": "Polygon Area, Triangles, and Similarity",
                "subtitle": "Angle sums, area strategies, similarity, and navigation angles",
                "chapter": "Session 2 · Polygons, Triangles, and Applications",
                "chapter_prompt": "Choose formulas strategically and justify every geometric relationship.",
                "output": "Math130Unit2C-part2.html", "duration_minutes": 55, "max_slides": 28,
                "title_sources": [19, 30, 41, 48], "roadmap_sources": [], "closing_sources": [53, 54, 55, 57],
                "objectives": [
                    objective(
                        "u2c-polygons", "compute polygon angle sums and areas", [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
                        "Why is the exterior-angle sum always 360° for a convex polygon?",
                        ["Interior-angle sum: $(n-2)180^\\circ$.", "Exterior-angle sum: $360^\\circ$.",
                         "Compound-shape area comes from decomposing into familiar pieces."],
                        ["Find the interior sum of an octagon and solve a multi-step trapezoid area problem."],
                        ["A regular polygon has exterior angle 24°. Find the number of sides and each interior angle."],
                        ["$n=360/24=15$ sides.", "Each interior angle is $180-24=156^\\circ$."],
                        ["Use n for the number of sides, not the number of triangles drawn.", "Subtract holes only after computing the outer area."],
                        "Describe a decision process for selecting a polygon-area formula.",
                        formula=True, decision=True,
                        verification=["Verify polygon angle formulas and all area computations."]
                    ),
                    objective(
                        "u2c-triangles", "select and apply triangle area and Pythagorean formulas", [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
                        "What information determines whether to use $A=bh/2$, Heron’s formula, or the equilateral formula?",
                        ["Use $A=bh/2$ when a base and perpendicular height are known.", "Use Heron’s formula with three sides.",
                         "For an equilateral triangle, $A=s^2\\sqrt3/4$."],
                        ["Estimate the area of an equilateral triangle with side 1600 km and verify with the formula."],
                        ["Find the area of a triangle with sides 7, 8, and 9 using Heron’s formula."],
                        ["$s=12$ and $A=\\sqrt{12\\cdot5\\cdot4\\cdot3}=12\\sqrt5\\approx26.83$."],
                        ["Height must be perpendicular to the chosen base.", "The Pythagorean theorem applies only to right triangles."],
                        "Name the given information that triggers each triangle-area method.",
                        formula=True, decision=True,
                        verification=["Verify Heron, equilateral, and Pythagorean calculations."]
                    ),
                    objective(
                        "u2c-similarity", "solve similarity proportions and convert navigation angles", [42, 43, 44, 45, 46, 47, 49, 50, 51, 52],
                        "How does vertex order prevent a similarity proportion from using mismatched sides?",
                        ["Corresponding vertices must remain in the same order.", "DMS conversion uses 60 minutes per degree and 60 seconds per minute.",
                         "One nautical mile corresponds to one minute of latitude."],
                        ["Set up a proportion for two similar triangles, then convert $45^\\circ22'18''$ to decimal degrees."],
                        ["Convert 73.625° to DMS and solve a missing side in similar triangles with scale factor 3/2."],
                        ["$73.625^\\circ=73^\\circ37'30''$.", "Multiply the corresponding side by 3/2."],
                        ["Do not pair noncorresponding sides.", "Carry minutes before seconds when converting DMS."],
                        "Explain how proportional reasoning connects similar triangles and map/navigation scale.",
                        verification=["Verify similarity proportions and all DMS conversions."]
                    )
                ]
            }
        ]
    }


def geometry_2d_spec() -> dict:
    return {
        "source_count": 30,
        "deck": {
            "id": "Math130Unit2D", "title": "Circles, Radians, Velocity, and Solids",
            "section": "Unit 2", "source": "Math130Unit2D.pptx", "canonical": True,
            "chooser_output": "Math130Unit2D.html"
        },
        "sessions": [
            {
                "id": "unit2d-part1", "title": "Area and Circle Geometry",
                "subtitle": "Area decomposition, circle measures, arcs, sectors, and angle theorems",
                "chapter": "Session 1 · Area and Circle Geometry",
                "chapter_prompt": "Connect each diagram to the correct radius, arc, chord, or angle relationship.",
                "output": "Math130Unit2D-part1.html", "duration_minutes": 55, "max_slides": 26,
                "title_sources": [1], "roadmap_sources": [2], "closing_sources": [],
                "objectives": [
                    objective(
                        "u2d-area", "decompose figures and compute area accurately", [3, 4, 5],
                        "Why can the same compound figure be decomposed in more than one valid way?",
                        ["Area is additive for nonoverlapping pieces.", "Choose rectangles, triangles, and circles that minimize unknown dimensions."],
                        ["Decompose an L-shaped region into two rectangles and confirm using subtraction from a bounding rectangle."],
                        ["Find the area of a 12-by-9 rectangle with a 4-by-3 corner removed."],
                        ["$108-12=96$ square units."],
                        ["Label units as square units.", "Check that the result is smaller than the bounding rectangle."],
                        "Describe two valid decomposition strategies for a compound region.",
                        verification=["Verify all compound-area arithmetic and units."]
                    ),
                    objective(
                        "u2d-circle", "use circle terminology and circumference-area formulas", [6, 7, 8, 9],
                        "If a radius doubles, by what factor do circumference and area change?",
                        ["Circumference: $C=2\\pi r$.", "Area: $A=\\pi r^2$.", "A sector is bounded by two radii and an arc; a segment is bounded by a chord and arc."],
                        ["Compare circumference and area for radii 3 and 6, then find the area of a concentric annulus."],
                        ["A washer has outer radius 8 and inner radius 5. Find its exact area."],
                        ["$A=\\pi(8^2-5^2)=39\\pi$ square units."],
                        ["Use radius, not diameter, in formulas.", "Subtract circle areas, not radii, for an annulus."],
                        "Explain why circle area scales quadratically while circumference scales linearly.",
                        formula=True, verification=["Verify circle and annulus formulas and results."]
                    ),
                    objective(
                        "u2d-theorems", "apply inscribed-angle, chord, and arc theorems", [10, 11, 12],
                        "How does an inscribed angle compare with its intercepted arc?",
                        ["An inscribed angle measures half its intercepted arc.", "Equal chords intercept equal arcs.",
                         "Angles formed by intersecting chords use half the sum of intercepted arcs."],
                        ["Use an intercepted arc of 110° to find an inscribed angle, then solve a chord-angle example."],
                        ["An inscribed angle measures 37°. Find its intercepted arc."],
                        ["The intercepted arc measures 74°."],
                        ["Identify the vertex location before choosing a theorem.", "Do not confuse central and inscribed angles."],
                        "State the vertex-and-arc information needed before applying a circle-angle theorem.",
                        decision=True, verification=["Verify every circle theorem against its diagram."]
                    )
                ]
            },
            {
                "id": "unit2d-part2", "title": "Radians, Velocity, and Solid Geometry",
                "subtitle": "Angle conversion, arc length, sectors, motion, volume, and surface area",
                "chapter": "Session 2 · Radians, Motion, and Solids",
                "chapter_prompt": "Track units carefully as angles produce distances, speeds, areas, and volumes.",
                "output": "Math130Unit2D-part2.html", "duration_minutes": 55, "max_slides": 26,
                "title_sources": [13, 22, 26], "roadmap_sources": [], "closing_sources": [29, 30],
                "objectives": [
                    objective(
                        "u2d-radians", "convert angle measures and compute arc length and sector area", [14, 15, 16, 17, 18, 19, 20, 21],
                        "Why must the angle be in radians when using $s=r\\theta$?",
                        ["Radians measure arc length per radius.", "$s=r\\theta$ and $A=\\tfrac12r^2\\theta$ require radians.",
                         "Convert degrees using $\\theta_{rad}=\\theta_{deg}\\pi/180$."],
                        ["Convert 120° to radians, then find arc length and sector area for radius 12."],
                        ["Find the arc length for radius 9 and central angle 40°."],
                        ["$40^\\circ=2\\pi/9$ radians, so $s=9(2\\pi/9)=2\\pi$."],
                        ["Do not insert degrees directly into radian formulas.", "Sector area should be the same fraction of $\\pi r^2$ as the angle is of a full rotation."],
                        "Explain the unit check that confirms an arc-length calculation.",
                        formula=True, verification=["Verify all degree-radian, arc-length, and sector-area calculations."]
                    ),
                    objective(
                        "u2d-velocity", "relate angular velocity, linear velocity, and distance", [23, 24, 25],
                        "Why do points farther from the center move faster even when angular speed is the same?",
                        ["Angular speed: $\\omega=\\theta/t$.", "Linear speed: $v=r\\omega$.", "Distance: $d=vt=r\\theta$."],
                        ["For a paddle tip at radius 4 ft rotating at 3 rad/s, compute linear speed and distance in 10 s."],
                        ["A wheel of radius 0.35 m turns at 8 rad/s. Find rim speed."],
                        ["$v=r\\omega=0.35(8)=2.8$ m/s."],
                        ["Angular units must be radians for $v=r\\omega$.", "Distinguish revolutions per minute from radians per second."],
                        "Describe how radius affects linear speed at fixed angular speed.",
                        formula=True, verification=["Verify angular-linear velocity examples and units."]
                    ),
                    objective(
                        "u2d-solids", "select volume and surface-area formulas for solids", [27, 28],
                        "Which dimensions contribute to volume, and which surfaces contribute to surface area?",
                        ["Volume measures three-dimensional capacity; surface area measures exposed two-dimensional faces.",
                         "Cylinder: $V=\\pi r^2h$ and $SA=2\\pi r^2+2\\pi rh$."],
                        ["Model a drain pipe as a hollow cylinder and identify which radii belong in material volume."],
                        ["Find the volume of a cylinder with radius 3 and height 10, then its total surface area."],
                        ["$V=90\\pi$ cubic units.", "$SA=78\\pi$ square units."],
                        ["Use cubic units for volume and square units for area.", "A pipe requires outer volume minus inner volume."],
                        "Explain how a diagram determines whether to add, subtract, or omit circular bases.",
                        formula=True, decision=True, verification=["Verify all solid-geometry formulas, dimensions, and units."]
                    )
                ]
            }
        ]
    }


def review_2e_spec() -> dict:
    return review_spec(
        "Math130Unit2E", "Test 2 Review", "Test 2", "Math130Unit2E.pptx", 13, "Math130Unit2E.html",
        [
            objective("u2e-algebra", "apply exponential and logarithmic models", [2, 3, 4],
                      "Which formula or inverse relationship would you choose first?",
                      ["Match wording to compound-interest formulas.", "$\\log_b(x)=y\\iff b^y=x$."],
                      ["Set up one periodic-interest problem and one exponential-log conversion."],
                      ["Find the balance on $4000 at 6% monthly for 10 years and rewrite $\\log_3(81)=4$."],
                      ["$A\\approx7277.59$ and $3^4=81$."],
                      ["Convert rates to decimals and preserve the logarithm base."],
                      "Write the first decision you make in each problem type.",
                      verification=["Recalculate all Test 2 algebra review answers."]),
            objective("u2e-angle", "solve angle, arc, and sector problems", [5, 6, 10, 11],
                      "Which formulas require radians and which accept degrees after conversion?",
                      ["Convert angles before applying $s=r\\theta$ or $A=\\tfrac12r^2\\theta$.", "Use circle theorems only after identifying the intercepted arc."],
                      ["Convert $5\\pi/6$ to degrees and solve one arc-length example."],
                      ["Find arc length for $r=12$, $\\theta=40^\\circ$."],
                      ["$\\theta=2\\pi/9$, so $s=8\\pi/3\\approx8.38$."],
                      ["Do not mix degrees and radians.", "Central and inscribed angles obey different rules."],
                      "State the unit check for an arc or sector answer.",
                      verification=["Verify every angle and circle review result."]),
            objective("u2e-geometry", "choose area, similarity, and speed strategies", [7, 8, 9, 12],
                      "What information tells you to use Heron, trapezoid area, similarity, or $v=r\\omega$?",
                      ["Formula selection depends on the givens, not the picture’s appearance.", "Write corresponding sides in consistent order."],
                      ["Work one multi-step trapezoid and one proportional-segment example."],
                      ["Complete the mixed practice quiz without notes."],
                      ["Compare each setup with the formula sheet before checking arithmetic."],
                      ["Most lost points come from setup, units, or mismatched corresponding sides."],
                      "Name the evidence that selects each geometry strategy.",
                      decision=True, verification=["Verify Test 2 practice quiz answers."])
        ],
        closing_sources=[13]
    )


def trig_3a_spec() -> dict:
    return single_session_spec(
        "Math130Unit3A", "Angles and Right Triangle Trigonometry", "Module 10",
        "Math130Unit3A.pptx", 26, "Math130Unit3A.html", 75, 35,
        [
            objective("u3a-standard", "sketch angles in standard position", [2, 3, 4, 5],
                      "Where does a negative angle rotate, and what never changes about standard position?",
                      ["The initial side lies on the positive x-axis.", "Positive rotation is counterclockwise; negative rotation is clockwise."],
                      ["Sketch 225° and −120° and identify their quadrants."],
                      ["Sketch 310° and label initial and terminal sides."],
                      ["310° terminates in Quadrant IV."],
                      ["Do not measure from the y-axis.", "Quadrant boundaries are not inside a quadrant."],
                      "Describe standard position without drawing it."),
            objective("u3a-coterminal", "find coterminal and reference angles in degrees and radians", [6, 7, 8],
                      "How can infinitely many angles share one terminal side?",
                      ["Coterminal angles differ by $360^\\circ k$ or $2\\pi k$.", "Reduce large magnitudes before locating the terminal side."],
                      ["Find positive and negative coterminal angles for −97° and $9\\pi/7$."],
                      ["Find a coterminal angle between 0° and 360° for 765°."],
                      ["$765-720=45^\\circ$."],
                      ["Add or subtract full rotations only.", "Keep degree and radian units separate."],
                      "Give the general coterminal-angle formulas.",
                      formula=True),
            objective("u3a-arc", "use radians to compute arc length", [9, 10],
                      "What does one radian measure geometrically?",
                      ["Arc length is $s=r\\theta$ when $\\theta$ is in radians.", "Radians connect central angle directly to distance."],
                      ["For $r=12$ and $\\theta=2\\pi/3$, compute arc length."],
                      ["Find s for $r=8$ and $\\theta=135^\\circ$."],
                      ["$135^\\circ=3\\pi/4$, so $s=6\\pi$."],
                      ["Convert degrees before using $s=r\\theta$.", "Arc length has linear units."],
                      "Explain why radians make $s=r\\theta$ dimensionally natural.",
                      formula=True),
            objective("u3a-ratios", "use right-triangle trigonometric ratios", [11, 12, 13, 14, 15, 16, 17, 18],
                      "Which two sides define sine, cosine, and tangent relative to an angle?",
                      ["SOH-CAH-TOA selects the ratio.", "Reciprocal functions invert sine, cosine, and tangent."],
                      ["Given a right triangle with legs 9 and 40 and hypotenuse 41, find all six ratios."],
                      ["Given $\\cos\\theta=9/41$, find $\\sin\\theta$ and $\\tan\\theta$."],
                      ["Opposite side is 40, so $\\sin\\theta=40/41$ and $\\tan\\theta=40/9$."],
                      ["Opposite and adjacent depend on the chosen reference angle.", "Keep the calculator in the requested angle mode."],
                      "Write the ratio-selection rule you will use under time pressure.",
                      verification=["Verify all right-triangle ratios and calculator values."]),
            objective("u3a-applications", "solve special-triangle and right-triangle applications", [19, 20, 21, 22, 23, 24, 25],
                      "When is an exact radical answer better than a decimal approximation?",
                      ["Special triangles produce exact values.", "Word problems require a labeled diagram before choosing a ratio."],
                      ["Solve a 20 m hypotenuse problem and a ladder-height problem.", "Use identities to recover missing trig ratios."],
                      ["A 25 ft ladder makes a 70° angle with the ground. Find the height."],
                      ["$h=25\\sin70^\\circ\\approx23.5$ ft."],
                      ["Exact-value questions should retain radicals.", "Check that a leg is shorter than the hypotenuse."],
                      "List the diagram, ratio, solve, and reasonableness-check steps.",
                      verification=["Verify special-triangle and word-problem calculations."])
        ],
        roadmap_sources=[1], closing_sources=[26]
    )


def trig_3b_spec() -> dict:
    return single_session_spec(
        "Math130Unit3B", "Trigonometric Functions of Any Angle", "Module 11",
        "Math130Unit3B.pptx", 21, "Math130Unit3B.html", 55, 28,
        [
            objective("u3b-reference", "find reference angles in degrees and radians", [2, 3, 5, 6, 7, 8, 9],
                      "Why is a reference angle always acute?",
                      ["Reference angles are measured to the nearest x-axis.", "First find a coterminal angle when the original lies outside one rotation."],
                      ["Find reference angles for 150°, 310°, −120°, and $7\\pi/4$."],
                      ["Find the reference angle for 580°."],
                      ["$580-360=220^\\circ$, so the QIII reference angle is 40°."],
                      ["Do not measure to the y-axis.", "Use π, not 180°, when working in radians."],
                      "State the quadrant formulas for reference angles.",
                      formula=True),
            objective("u3b-signs", "determine trigonometric signs and quadrants", [10, 11],
                      "If tangent is positive and cosine is negative, which quadrant is possible?",
                      ["ASTC summarizes positive functions by quadrant.", "Signs follow from x, y, and positive r."],
                      ["Intersect the possible quadrants for $\\tan\\theta>0$ and $\\cos\\theta<0$."],
                      ["Determine the quadrant if $\\sin\\theta>0$ and $\\sec\\theta<0$."],
                      ["Quadrant II."],
                      ["Use the intersection of sign conditions.", "Reciprocal functions share the sign of their partner."],
                      "Explain ASTC using the signs of x and y rather than memorization.",
                      decision=True),
            objective("u3b-values", "find exact trigonometric values from points and reference angles", [4, 12, 13, 14, 15, 16, 17],
                      "What does r represent for a point $(x,y)$ on a terminal side?",
                      ["$r=\\sqrt{x^2+y^2}$.", "Use the reference angle for magnitude and the quadrant for sign."],
                      ["For $P=(-3,4)$, calculate r and all six trig values."],
                      ["Find exact trig values for $P=(-2,-5)$ and evaluate $\\sin240^\\circ$."],
                      ["$r=\\sqrt{29}$; signs follow Quadrant III.", "$\\sin240^\\circ=-\\sqrt3/2$."],
                      ["r is always positive.", "Rationalize denominators only when required by course convention."],
                      "Describe the point-to-ratios workflow in three steps.",
                      verification=["Verify exact values and quadrant signs."]),
            objective("u3b-area", "apply the trigonometric triangle-area formula", [18, 19, 20],
                      "Why must the known angle be included between the two known sides?",
                      ["$A=\\tfrac12bc\\sin A$ uses two sides and their included angle.", "The formula applies to nonright triangles."],
                      ["Use $A=76^\\circ$, $b=34$, and $c=21$."],
                      ["Find the area when sides 12 and 15 include a 40° angle."],
                      ["$A=\\tfrac12(12)(15)\\sin40^\\circ\\approx57.85$."],
                      ["Match each side pair with its included angle.", "Square units are required."],
                      "Explain how the diagram identifies the correct sine angle.",
                      verification=["Verify all triangle-area calculations."])
        ],
        roadmap_sources=[1], closing_sources=[21]
    )


def trig_3c_spec() -> dict:
    return single_session_spec(
        "Math130Unit3C", "Right Triangle Applications", "Module 12",
        "Math130Unit3C.pptx", 19, "Math130Unit3C.html", 55, 26,
        [
            objective("u3c-model", "model one-triangle applications with SOH-CAH-TOA", [2, 3, 4, 5, 6, 7],
                      "What must be labeled before selecting a trig ratio?",
                      ["Read, draw, label, choose a ratio, solve, and check.", "Inverse trig finds an angle from a ratio."],
                      ["Solve the 20 ft ladder problem using sine and the corrected diagram."],
                      ["A surveyor stands 80 ft from a building at 42° elevation. Find the height."],
                      ["$h=80\\tan42^\\circ\\approx72.0$ ft."],
                      ["Calculator mode must be degrees.", "A leg must be shorter than the hypotenuse."],
                      "State the six-step word-problem strategy.",
                      asset=("assets/math130unit3c/corrected/s_skill2_ladder.png", "Right triangle ladder diagram with a 20 foot ladder and 65 degree ground angle"),
                      verification=["Verify all one-triangle results and degree-mode instructions."]),
            objective("u3c-motion", "apply elevation, depression, and motion components", [8, 9, 10, 11],
                      "Why are an angle of depression and its matching angle of elevation equal?",
                      ["Both are measured from parallel horizontal lines.", "Resolve motion with $d_x=d\\cos\\theta$ and $d_y=d\\sin\\theta$."],
                      ["Solve the lighthouse distance and airplane-component examples."],
                      ["A vehicle travels 300 miles at 25° north of east. Find east and north components."],
                      ["East: $300\\cos25^\\circ\\approx271.9$ mi; north: $300\\sin25^\\circ\\approx126.8$ mi."],
                      ["Angles are measured from horizontal unless stated otherwise.", "Use total distance before resolving components."],
                      "Explain how a horizontal reference line organizes both elevation and component problems.",
                      formula=True, verification=["Verify elevation/depression and motion-component calculations."]),
            objective("u3c-two", "solve complete and two-triangle application problems", [12, 13, 14, 15, 16, 17, 18],
                      "What information is shared by two right triangles aimed at the same height?",
                      ["To solve a right triangle, find all missing sides and angles.", "Two-triangle problems share a height and use related horizontal distances."],
                      ["Solve the 31°/53° building problem, including the missing algebra step.", "Verify with a second relationship."],
                      ["Set up, but do not immediately solve, a two-observation tower problem with a 50 ft gap."],
                      ["Closer: $\\tan53^\\circ=h/d$; farther: $\\tan31^\\circ=h/(d+50)$."],
                      ["Keep d and d+50 attached to the correct observation points.", "Show the algebraic distribution step before dividing."],
                      "Write the shared-height equation that connects the two triangles.",
                      verification=["Verify complete-triangle and two-triangle algebra and units."])
        ],
        roadmap_sources=[1], closing_sources=[19]
    )


def vectors_3d_spec() -> dict:
    return single_session_spec(
        "Math130Unit3D", "Vectors", "Module 13",
        "Math130Unit3D.pptx", 14, "Math130Unit3D.html", 55, 24,
        [
            objective("u3d-components", "represent vectors in component form", [2, 3, 4, 5, 6],
                      "What information does speed omit that velocity includes?",
                      ["A vector has magnitude and direction.", "$\\vec v=\\langle x_2-x_1,y_2-y_1\\rangle$.",
                       "From magnitude and direction: $\\langle |v|\\cos\\theta,|v|\\sin\\theta\\rangle$."],
                      ["Find the vector from $A=(-2,5)$ to $B=(3,-1)$ using the corrected diagram."],
                      ["Find the component form from $P=(-4,-2)$ to $Q=(2,1)$."],
                      ["$\\langle6,3\\rangle$."],
                      ["Use terminal minus initial.", "Component form describes displacement, not location."],
                      "Explain both ways to obtain vector components.",
                      asset=("assets/math130unit3d/corrected/s_component_form.png", "Vector from A negative two comma five to B three comma negative one with components five and negative six"),
                      verification=["Verify all component diagrams and calculations."]),
            objective("u3d-operations", "perform vector operations and interpret scalar multiplication", [7, 11],
                      "What changes when a vector is multiplied by a negative scalar?",
                      ["Add and subtract component-wise.", "$k\\langle a,b\\rangle=\\langle ka,kb\\rangle$.",
                       "A negative scalar reverses direction."],
                      ["Use the diagram to compare $v$, $2v$, and $-v$.",
                       "Then compute $u+v$ and $3u-2v$ for $u=\\langle3,-2\\rangle$, $v=\\langle-1,5\\rangle$."],
                      ["Let $u=\\langle2,-3\\rangle$ and $v=\\langle-1,4\\rangle$. Find $2u-3v$."],
                      ["$2u-3v=\\langle7,-18\\rangle$."],
                      ["Distribute the scalar to both components.", "Check the direction of negative scalar multiples visually."],
                      "Describe how scalar sign and magnitude affect a vector.",
                      asset=("assets/math130unit3d/corrected/s_scalar_multiplication.png", "Vectors v, two v, and negative v showing stretch and reversal"),
                      verification=["Verify all vector operation results and arrow directions."]),
            objective("u3d-direction", "find vector magnitude and direction angle", [8, 9, 10, 12, 13, 14],
                      "Why can a calculator’s inverse tangent answer require a quadrant adjustment?",
                      ["Magnitude: $|v|=\\sqrt{a^2+b^2}$.", "Use atan2 behavior conceptually: choose the angle in the vector’s actual quadrant."],
                      ["For $v=\\langle-3,4\\rangle$, find magnitude and direction using the corrected angle diagram."],
                      ["For $v=\\langle6,3\\rangle$, find magnitude and direction."],
                      ["$|v|=3\\sqrt5\\approx6.71$ and $\\theta\\approx26.57^\\circ$."],
                      ["Check component signs before adjusting the angle.", "Direction is measured counterclockwise from the positive x-axis."],
                      "Write a quadrant-safe direction-angle procedure.",
                      asset=("assets/math130unit3d/corrected/s_magnitude_direction.png", "Quadrant two vector with direction angle measured counterclockwise from the positive x-axis"),
                      verification=["Verify magnitude, direction, and quadrant-adjustment calculations."])
        ],
        roadmap_sources=[1], closing_sources=[]
    )


def review_3e_spec() -> dict:
    return review_spec(
        "Math130Unit3E", "Test 3 Review", "Test 3", "Math130Unit3E.pptx", 13, "Math130Unit3E.html",
        [
            objective("u3e-angles", "solve angle, reference-angle, and exact-value problems", [2, 3, 4, 5, 6, 7, 8],
                      "Which problems need a sketch before any calculation?",
                      ["Use coterminal reduction, reference angles, ASTC, and special triangles as one connected workflow."],
                      ["Model the cos 9/41 problem and the −97° coterminal/reference-angle problem."],
                      ["Complete one exact-value problem without decimals."],
                      ["Use the special-triangle ratios and attach the correct quadrant sign."],
                      ["Check calculator mode and retain exact radicals when requested."],
                      "Write the order: sketch, reference angle, sign, exact value.",
                      verification=["Verify all Test 3 angle and exact-value answers."]),
            objective("u3e-triangles", "solve right-triangle, area, and two-triangle applications", [9, 10, 11],
                      "What distinguishes a one-triangle problem from a shared-height two-triangle problem?",
                      ["Use inverse trig to find angles, Pythagorean theorem for missing sides, and $A=\\tfrac12bc\\sin A$ for included-angle area."],
                      ["Solve the a=11, c=35 triangle and the 76° included-angle area problem."],
                      ["Set up a two-observation elevation problem with a known gap."],
                      ["Write two tangent equations sharing h and using d and d+gap."],
                      ["Draw and label before substituting.", "Use square units for area."],
                      "State the setup pattern for each triangle problem type.",
                      verification=["Verify Test 3 triangle and application results."]),
            objective("u3e-vectors", "perform vector operations and direction calculations", [12],
                      "Which vector tasks are component-wise and which require geometry?",
                      ["Operations are component-wise; magnitude and direction use the Pythagorean theorem and inverse tangent."],
                      ["Review the vector from P(3,−1) to Q(−2,4), then compute a scalar combination."],
                      ["Find magnitude and direction of $\\langle-5,5\\rangle$."],
                      ["Magnitude $5\\sqrt2$; direction 135°."],
                      ["Use terminal minus initial.", "Check quadrant before accepting inverse tangent."],
                      "Write a vector problem checklist from components through direction.",
                      verification=["Verify Test 3 vector answers."])
        ],
        closing_sources=[13]
    )


def single_session_spec(
    deck_id: str, title: str, section: str, source: str, source_count: int,
    output: str, duration: int, max_slides: int, objectives: list[dict],
    *, roadmap_sources: list[int], closing_sources: list[int]
) -> dict:
    return {
        "source_count": source_count,
        "deck": {"id": deck_id, "title": title, "section": section, "source": source, "canonical": True},
        "sessions": [{
            "id": deck_id.lower(), "title": title,
            "subtitle": "Concepts, worked examples, student practice, and synthesis",
            "output": output, "duration_minutes": duration, "max_slides": max_slides,
            "title_sources": [], "roadmap_sources": roadmap_sources, "closing_sources": closing_sources,
            "objectives": objectives
        }]
    }


def review_spec(
    deck_id: str, title: str, section: str, source: str, source_count: int,
    output: str, objectives: list[dict], *, closing_sources: list[int]
) -> dict:
    return single_session_spec(
        deck_id, title, section, source, source_count, output, 55, 22, objectives,
        roadmap_sources=[1], closing_sources=closing_sources
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    LECTURES.mkdir(parents=True, exist_ok=True)
    for spec in specs():
        manifest = build_manifest(spec)
        target = LECTURES / f"{manifest['deck']['id']}.json"
        if target.exists() and not args.force:
            raise SystemExit(f"{target} exists; use --force only for the initial authored seed")
        inventory_path = INVENTORY / f"{manifest['deck']['id']}.json"
        if not inventory_path.exists():
            raise SystemExit(f"Missing source inventory: {inventory_path}")
        target.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"authored {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
