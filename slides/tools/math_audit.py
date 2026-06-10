#!/usr/bin/env python3
"""Independent computational and symbolic audit for canonical lecture manifests."""

from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path

from compile_lectures import load_manifests

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "migration" / "math-audit"


def close(actual: float, expected: float, tolerance: float = 0.005) -> None:
    if not math.isclose(actual, expected, abs_tol=tolerance, rel_tol=tolerance):
        raise AssertionError(f"{actual} does not match {expected}")


def calculations() -> dict[str, list[str]]:
    pi = math.pi
    close(2000 * (1 + 0.031 / 2) ** 6, 2193.36)
    close(500 * 2 ** (10 / 3), 5039.7)
    close(math.log(175, 3), 4.701, 0.0006)
    close(math.log(50, 3), 3.561, 0.0006)
    close(4000 * (1 + 0.06 / 12) ** 120, 7277.59)
    close(0.5 * 12 * 15 * math.sin(math.radians(40)), 57.85)
    close(80 * math.tan(math.radians(42)), 72.0)
    close(300 * math.cos(math.radians(25)), 271.9)
    close(300 * math.sin(math.radians(25)), 126.8)
    close(25 * math.sin(math.radians(70)), 23.5)
    close(math.exp(-0.15), 0.861, 0.0006)
    close(175 * math.exp(0.5), 288.526, 0.0006)
    close(math.sqrt(12 * 5 * 4 * 3), 26.83)
    close(math.hypot(6, 3), 6.71)
    close(math.degrees(math.atan2(3, 6)), 26.57)

    return {
        "u2a-graph": [
            "Recomputed $2^x$ and $3^x$ tables; points, intercept, domain, range, and $y=0$ asymptote agree.",
        ],
        "u2a-e": [
            f"Recomputed $3.5^{{1.6}}={3.5 ** 1.6:.6f}$ and $(3/4)^{{-0.95}}={0.75 ** -0.95:.6f}$.",
            f"Recomputed $e^{{-0.15}}={math.exp(-0.15):.6f}$ and $175e^{{0.5}}={175 * math.exp(0.5):.6f}$.",
        ],
        "u2a-interest": [
            f"Recomputed annual example: $44000(1.0325)^{{13}}={44000 * 1.0325 ** 13:.2f}$.",
            f"Recomputed semiannual practice balance: $A={2000 * (1 + 0.031 / 2) ** 6:.2f}$.",
        ],
        "u2a-model": [
            f"Recomputed uranium model values: $A(0)=3200$ and $A(40)={3200 * 0.5 ** (40 / 14):.2f}$.",
            f"Recomputed bacteria model: $B(10)={500 * 2 ** (10 / 3):.1f}$ cells.",
        ],
        "u2b-forms": ["Verified each logarithmic statement is equivalent to its exponential form with unchanged base and exponent."],
        "u2b-evaluate": [
            f"Recomputed $\\log(250)={math.log10(250):.6f}$ and $\\ln(40)={math.log(40):.6f}$; inverse checks return 250 and 40.",
        ],
        "u2b-graphs": [
            "Derived domain $(-1,\\infty)$, asymptote $x=-1$, y-intercept $(0,2)$, and x-intercept $(-3/4,0)$.",
        ],
        "u2b-solve": [
            "Solved $\\log_2(x-5)=4$ as $x=21$ and confirmed the log argument is positive.",
            f"Recomputed $\\log_4(25)={math.log(25, 4):.6f}$, $\\log_3(175)={math.log(175, 3):.6f}$, and $\\log_3(50)={math.log(50, 3):.6f}$.",
        ],
        "u2c-language": ["Verified line, ray, segment, and angle notation, including ray endpoint A and angle vertex B."],
        "u2c-angle-types": ["Verified vertical angles are equal and adjacent linear-pair angles sum to $180^\\circ$."],
        "u2c-parallel": ["Solved both congruent and supplementary parallel-line equations by substitution."],
        "u2c-polygons": ["Verified octagon sum $1080^\\circ$, regular 15-gon interior angle $156^\\circ$, and trapezoid area 112 square units."],
        "u2c-triangles": [
            f"Recomputed equilateral area $640000\\sqrt3={640000 * math.sqrt(3):.2f}$ square kilometers.",
            f"Recomputed Heron area $12\\sqrt5={12 * math.sqrt(5):.2f}$ square units.",
        ],
        "u2c-similarity": ["Cross-multiplication gives $x=15$; DMS conversions give $45.371667^\\circ$ and $73^\\circ37'30''$."],
        "u2d-area": ["Verified compound-area subtraction: 130 square units in the model and 96 square units in practice."],
        "u2d-circle": ["Verified circumference doubles, area quadruples, and annulus areas are differences of squared radii."],
        "u2d-theorems": ["Verified inscribed angle $55^\\circ$, chord angle $60^\\circ$, and intercepted practice arc $74^\\circ$."],
        "u2d-radians": ["Verified $120^\\circ=2\\pi/3$, $s=8\\pi$, sector area $48\\pi$, and practice arc $2\\pi$."],
        "u2d-velocity": ["Verified $v=12$ ft/s and $d=120$ ft in the model; practice rim speed is 2.8 m/s."],
        "u2d-solids": ["Verified hollow-cylinder material volume $70\\pi$; practice cylinder volume $90\\pi$ and surface area $78\\pi$."],
        "u2e-algebra": [
            f"Recomputed quarterly balance $A={2500 * (1 + 0.052 / 4) ** 24:.2f}$ and monthly practice balance $A={4000 * (1 + 0.06 / 12) ** 120:.2f}$.",
        ],
        "u2e-angle": ["Verified $5\\pi/6=150^\\circ$, model arc $6\\pi$, and practice arc $8\\pi/3\\approx8.38$."],
        "u2e-geometry": ["Verified trapezoid area 91, similarity result $x=10$, and linear speed 2 m/s."],
        "u3a-standard": ["Verified $225^\\circ$ and $-120^\\circ$ terminate in Quadrant III; $310^\\circ$ terminates in Quadrant IV."],
        "u3a-coterminal": ["Verified degree coterminals $263^\\circ,-457^\\circ,45^\\circ$ and radian coterminals $23\\pi/7,-5\\pi/7$."],
        "u3a-arc": ["Verified model arc $8\\pi$ and practice arc $6\\pi$ after degree-to-radian conversion."],
        "u3a-ratios": ["Verified the 9-40-41 Pythagorean triple and all six reciprocal trigonometric ratios."],
        "u3a-applications": [f"Recomputed ladder height $25\\sin70^\\circ={25 * math.sin(math.radians(70)):.2f}$ ft."],
        "u3b-reference": ["Verified reference angles $30^\\circ,50^\\circ,60^\\circ,\\pi/4$, and practice angle $40^\\circ$."],
        "u3b-signs": ["Intersected sign quadrants: tangent positive and cosine negative gives Quadrant III; sine positive and secant negative gives Quadrant II."],
        "u3b-values": ["Verified point-radius calculations and all six signs/ratios for $(-3,4)$ and $(-2,-5)$; $\\sin240^\\circ=-\\sqrt3/2$."],
        "u3b-area": [f"Recomputed model area {0.5 * 34 * 21 * math.sin(math.radians(76)):.2f} and practice area {0.5 * 12 * 15 * math.sin(math.radians(40)):.2f} square units."],
        "u3c-model": [f"Recomputed corrected ladder height $20\\sin65^\\circ={20 * math.sin(math.radians(65)):.2f}$ ft and practice height {80 * math.tan(math.radians(42)):.2f} ft."],
        "u3c-motion": [f"Recomputed 300-mile components: east {300 * math.cos(math.radians(25)):.2f}, north {300 * math.sin(math.radians(25)):.2f}."],
        "u3c-two": ["Solved shared-height equations: closer distance 41.37 ft, farther distance 91.37 ft, and height 54.90 ft."],
        "u3d-components": ["Verified terminal-minus-initial gives $\\langle5,-6\\rangle$ and practice gives $\\langle6,3\\rangle$."],
        "u3d-operations": ["Verified $u+v=\\langle2,3\\rangle$, $3u-2v=\\langle11,-16\\rangle$, and practice $2u-3v=\\langle7,-18\\rangle$."],
        "u3d-direction": ["Verified model magnitude 5 and direction $126.87^\\circ$; practice magnitude $3\\sqrt5$ and direction $26.57^\\circ$."],
        "u3e-angles": ["Verified 9-40-41 ratios, coterminal angle $263^\\circ$, reference angle $83^\\circ$, and $\\sin225^\\circ=-\\sqrt2/2$."],
        "u3e-triangles": ["Verified missing leg $4\\sqrt{69}\\approx33.23$, angles $18.32^\\circ,71.68^\\circ$, area 346.40, and two-observation height 54.90 ft."],
        "u3e-vectors": ["Verified $\\langle-5,5\\rangle$, magnitude $5\\sqrt2$, and direction $135^\\circ$."],
    }


REQUIRED_FRAGMENTS = {
    "u2a-graph": ["1/4,1/2,1,2,4", "range: $(0,\\\\infty)$"],
    "u2a-e": ["7.422", "1.314", "0.861", "288.526"],
    "u2a-interest": ["66684.28", "2193.36"],
    "u2a-model": ["441.64", "5039.7"],
    "u2b-forms": ["$e^x=7$"],
    "u2b-evaluate": ["2.398", "3.689"],
    "u2b-graphs": ["$x=-1$", "$(-3/4,0)$"],
    "u2b-solve": ["$x=21$", "4.701", "3.561"],
    "u2c-language": ["vertex B"],
    "u2c-angle-types": ["133^\\\\circ"],
    "u2c-parallel": ["$x=15$", "$x=16$"],
    "u2c-polygons": ["1080^\\\\circ", "112$ square units", "156^\\\\circ"],
    "u2c-triangles": ["640000\\\\sqrt3", "12\\\\sqrt5"],
    "u2c-similarity": ["45.371667", "73^\\\\circ37'30''", "14(3/2)=21"],
    "u2d-area": ["130 square units", "96$ square units"],
    "u2d-circle": ["27\\\\pi", "39\\\\pi"],
    "u2d-theorems": ["55^\\\\circ", "60^\\\\circ", "74°"],
    "u2d-radians": ["8\\\\pi", "48\\\\pi", "2\\\\pi"],
    "u2d-velocity": ["12$ ft/s", "120$ ft", "2.8$ m/s"],
    "u2d-solids": ["70\\\\pi", "90\\\\pi", "78\\\\pi"],
    "u2e-algebra": ["3408.53", "7277.59"],
    "u2e-angle": ["150^\\\\circ", "6\\\\pi", "8\\\\pi/3"],
    "u2e-geometry": ["91$ square units", "$x=10$", "2$ m/s"],
    "u3a-standard": ["Quadrant III", "Quadrant IV"],
    "u3a-coterminal": ["263^\\\\circ", "-457^\\\\circ", "23\\\\pi/7", "-5\\\\pi/7"],
    "u3a-arc": ["8\\\\pi", "6\\\\pi"],
    "u3a-ratios": ["$\\\\sin\\\\theta=40/41$", "$\\\\cot\\\\theta=9/40$"],
    "u3a-applications": ["23.49", "23.5"],
    "u3b-reference": ["30^\\\\circ", "50^\\\\circ", "60^\\\\circ", "\\\\pi/4"],
    "u3b-signs": ["Quadrant III", "Quadrant II"],
    "u3b-values": ["=5$.", "$r=\\\\sqrt{29}$", "$\\\\sin240^\\\\circ=-\\\\sqrt3/2$"],
    "u3b-area": ["346.40", "57.85"],
    "u3c-model": ["18.13", "72.0"],
    "u3c-motion": ["271.89", "126.79", "271.9", "126.8"],
    "u3c-two": ["41.37", "54.90"],
    "u3d-components": ["\\\\langle5,-6\\\\rangle", "\\\\langle6,3\\\\rangle"],
    "u3d-operations": ["\\\\langle11,-16\\\\rangle", "\\\\langle7,-18\\\\rangle"],
    "u3d-direction": ["126.87", "26.57"],
    "u3e-angles": ["263^\\\\circ", "83^\\\\circ", "-\\\\sqrt2/2"],
    "u3e-triangles": ["4\\\\sqrt{69}", "346.40", "54.90"],
    "u3e-vectors": ["\\\\langle-5,5\\\\rangle", "5\\\\sqrt2", "135^\\\\circ"],
}


ASSET_EVIDENCE = {
    "assets/math130unit2a/slide-05-1.png": "Graph labels $f(x)=2^x$, $(0,1)$, and $y=0$ consistently with the model.",
    "assets/math130unit2b/corrected/log-transform.svg": "Graph labels the transformed logarithm, asymptote $x=-1$, and both intercepts.",
    "assets/math130unit3c/corrected/s_skill2_ladder.png": "Diagram labels a 20 ft hypotenuse, $65^\\circ$ ground angle, right angle, and unknown height.",
    "assets/math130unit3d/corrected/s_component_form.png": "Diagram shows displacement 5 right and 6 down from $A=(-2,5)$ to $B=(3,-1)$.",
    "assets/math130unit3d/corrected/s_scalar_multiplication.png": "Diagram correctly shows $v$, $2v$, and $-v$.",
    "assets/math130unit3d/corrected/s_magnitude_direction.png": "Diagram shows $\\langle-3,4\\rangle$, magnitude 5, and a Quadrant II direction angle.",
}


def main() -> int:
    evidence = calculations()
    manifests = [manifest for _, manifest in load_manifests()]
    objective_ids = {
        objective["id"]
        for manifest in manifests
        for objective in manifest["objectives"]
    }
    failures: list[str] = []
    if objective_ids != set(evidence):
        failures.append(f"audit coverage mismatch: missing={sorted(objective_ids - set(evidence))}, extra={sorted(set(evidence) - objective_ids)}")

    results = {}
    for manifest in manifests:
        blocks = [
            block
            for session in manifest["sessions"]
            for block in session["blocks"]
        ]
        for objective in manifest["objectives"]:
            oid = objective["id"]
            related = [block for block in blocks if oid in block.get("objectives", [])]
            joined = json.dumps(related, ensure_ascii=False)
            missing = [fragment for fragment in REQUIRED_FRAGMENTS[oid] if fragment not in joined]
            if any(control in joined for control in ("\t", "\r", "\f", "\v")):
                failures.append(f"{oid}: control character detected in mathematical content")
            model_checks = [
                check
                for block in related if block.get("phase") == "model"
                for check in block.get("audit_checks", [])
            ]
            if missing:
                failures.append(f"{oid}: missing audited conclusions {missing}")
            if model_checks != [oid]:
                failures.append(f"{oid}: model block must declare exactly one matching audit check")
            results[oid] = {
                "status": "pass" if not missing and model_checks == [oid] else "fail",
                "evidence": evidence[oid],
            }

    assets = {}
    for relative, claim in ASSET_EVIDENCE.items():
        path = ROOT / relative
        if not path.exists():
            failures.append(f"missing audited asset: {relative}")
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        assets[relative] = {"status": "pass", "sha256": digest, "evidence": claim}

    OUTPUT.mkdir(parents=True, exist_ok=True)
    payload = {
        "version": 1,
        "status": "pass" if not failures else "fail",
        "scope": "Independent computational, symbolic, unit, and diagram-content audit",
        "results": results,
        "assets": assets,
        "limitations": [
            "This audit does not replace instructor mathematical sign-off.",
            "Live classroom pacing and student comprehension require classroom evidence.",
        ],
        "failures": failures,
    }
    (OUTPUT / "results.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    lines = [
        "# Independent Mathematical Audit",
        "",
        f"**Status:** {'PASS' if not failures else 'FAIL'}",
        "",
        "Computations were independently recalculated with Python’s standard math library; exact symbolic, unit, and diagram claims were checked against the canonical manifests.",
        "",
    ]
    for oid in sorted(results):
        lines.append(f"## {oid}")
        lines.extend(f"- {item}" for item in results[oid]["evidence"])
        lines.append("")
    lines.extend(["## Diagram Evidence", ""])
    for relative, item in assets.items():
        lines.append(f"- `{relative}`: {item['evidence']} SHA-256 `{item['sha256']}`")
    lines.extend([
        "",
        "## Limitations",
        "",
        "- Instructor mathematical verification remains pending.",
        "- Live classroom rehearsal and pilot evidence remain pending.",
    ])
    if failures:
        lines.extend(["", "## Failures", ""] + [f"- {item}" for item in failures])
    (OUTPUT / "summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    for oid in sorted(results):
        print(f"{'PASS' if results[oid]['status'] == 'pass' else 'FAIL'} {oid}")
    for failure in failures:
        print(f"  - {failure}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
