"""Independently check the geometry and answer visibility of Unit 2C SVGs."""
from __future__ import annotations

import json
import math
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets/math130unit2c/visuals"
NS = {"s": "http://www.w3.org/2000/svg"}


def near(actual: float, expected: float, label: str) -> None:
    if not math.isclose(actual, expected, rel_tol=1e-6, abs_tol=1e-5):
        raise AssertionError(f"{label}: expected {expected}, got {actual}")


def vertices(root: ET.Element, element_id: str) -> list[tuple[float, float]]:
    element = root.find(f".//*[@id='{element_id}']")
    assert element is not None, f"Missing figure {element_id}"
    return [tuple(map(float, p.split(","))) for p in element.attrib["points"].split()]


def length(a: tuple, b: tuple) -> float:
    return math.hypot(b[0] - a[0], b[1] - a[1])


def area(ps: list[tuple]) -> float:
    return abs(sum(a[0]*b[1]-b[0]*a[1] for a, b in zip(ps, ps[1:]+ps[:1]))) / 2


def verify() -> dict[str, str]:
    manifest = json.loads((ROOT / "lectures/Math130Unit2C.json").read_text(encoding="utf-8"))
    session = next(s for s in manifest["sessions"] if s["id"] == "unit2c-part2")
    assets = [a for b in session["blocks"] for a in b.get("assets", []) if "/visuals/" in a["src"]]
    assert len(assets) == 22, "Session 2 should retain all 22 mathematical figures"
    assert len({a["src"] for a in assets}) == 22, "Use a distinct figure for each teaching block"
    roots = {}
    for asset in assets:
        target = ROOT / asset["src"]
        root = ET.parse(target).getroot()  # Also rejects malformed XML and duplicate attributes.
        title, desc = root.find("s:title", NS), root.find("s:desc", NS)
        assert title is not None and title.text and desc is not None and desc.text
        assert asset["alt"] == desc.text, f"Accessibility text drift: {target.name}"
        ids = [e.attrib["id"] for e in root.iter() if "id" in e.attrib]
        assert len(ids) == len(set(ids)), f"Duplicate SVG ids: {target.name}"
        x, y, w, h = map(float, root.attrib["viewBox"].split())
        for label in root.findall(".//s:text", NS):
            assert x <= float(label.attrib["x"]) <= x+w
            assert y <= float(label.attrib["y"]) <= y+h
        roots[target.stem] = root

    ps = vertices(roots["exterior-turn"], "turn-polygon")
    turns = []
    for i, point in enumerate(ps):
        prev, nxt = ps[i-1], ps[(i+1) % len(ps)]
        u = (point[0]-prev[0], point[1]-prev[1])
        v = (nxt[0]-point[0], nxt[1]-point[1])
        turn = math.degrees(math.atan2(u[0]*v[1]-u[1]*v[0], u[0]*v[0]+u[1]*v[1]))
        assert 0 < turn < 180, "Exterior turns must all have the same orientation"
        turns.append(turn)
    near(sum(turns), 360, "Convex exterior-angle sum")

    octagon = roots["octagon-triangulation"]
    ps = vertices(octagon, "octagon")
    assert len(ps) == 8
    assert len([p for p in octagon.findall(".//s:polygon", NS) if p.attrib.get("stroke") == "none"]) == 6
    assert len(octagon.findall(".//s:line[@data-diagonal='true']", NS)) == 5
    for i in range(8):
        near(length(ps[i], ps[(i+1) % 8]), length(ps[0], ps[1]), "Regular octagon sides")

    model = roots["polygon-area-model"]
    trap = vertices(model, "model-trapezoid")
    scale = length(trap[0], trap[1]) / 20
    near(length(trap[2], trap[3]) / scale, 12, "Trapezoid upper base")
    near(abs(trap[0][1]-trap[2][1]) / scale, 7, "Trapezoid perpendicular height")
    near(area(trap) / scale**2, 112, "Trapezoid area")
    para = vertices(model, "model-parallelogram")
    scale = length(para[0], para[1]) / 9
    near(abs(para[0][1]-para[2][1]) / scale, 8, "Parallelogram height")
    near(area(para) / scale**2, 72, "Parallelogram area")

    corner = roots["regular-polygon-angle"]
    edge = corner.find(".//*[@id='outgoing-side']")
    assert edge is not None
    turn = -math.degrees(math.atan2(float(edge.attrib["y2"])-float(edge.attrib["y1"]), float(edge.attrib["x2"])-float(edge.attrib["x1"])))
    near(turn, 24, "Regular polygon exterior angle")

    equi = vertices(roots["equilateral-area"], "equilateral-triangle")
    side = length(equi[0], equi[1])
    near(length(equi[0], equi[2]), side, "Equilateral left side")
    near(length(equi[1], equi[2]), side, "Equilateral right side")
    near(area(equi) / (side/1600)**2, 640000*math.sqrt(3), "Equilateral area in square kilometers")

    practice = roots["triangle-practice"]
    ps = vertices(practice, "heron-triangle")
    scale = length(ps[0], ps[1])/9
    near(length(ps[0], ps[2])/scale, 7, "Heron side 7")
    near(length(ps[1], ps[2])/scale, 8, "Heron side 8")
    near(area(ps)/scale**2, 12*math.sqrt(5), "Heron geometric area")
    ps = vertices(practice, "practice-right-triangle")
    scale = length(ps[0], ps[1])/9
    near(length(ps[0], ps[2])/scale, 12, "Unknown right-triangle height")
    near(length(ps[1], ps[2])/scale, 15, "Right-triangle hypotenuse")
    near(area(ps)/scale**2, 54, "Right-triangle geometric area")

    for name in ("corresponding-triangles", "similarity-dms-model", "similarity-practice"):
        small = vertices(roots[name], "similar-small")
        large = vertices(roots[name], "similar-large")
        for a, b in ((0,1),(0,2),(1,2)):
            near(length(large[a],large[b])/length(small[a],small[b]), 1.5, f"{name} corresponding side ratio")
        # The second triangle is a uniform scale followed by a quarter turn.
        for i in (1,2):
            near(large[i][0]-large[0][0], 1.5*(small[i][1]-small[0][1]), f"{name} rotated x")
            near(large[i][1]-large[0][1], 1.5*(small[i][0]-small[0][0]) * -1, f"{name} rotated y")

    obtuse = vertices(roots["triangle-height"], "obtuse-triangle")
    assert obtuse[2][0] > obtuse[1][0], "External altitude should lie beyond the base"
    altitude = roots["triangle-height"].find(".//*[@id='external-altitude']")
    assert altitude is not None and altitude.attrib["x1"] == altitude.attrib["x2"]
    near(float(altitude.attrib["y2"]), obtuse[0][1], "External altitude meets the extended base")
    scale = length(obtuse[0], obtuse[1])/10
    near(abs(obtuse[2][1]-obtuse[0][1])/scale, 12, "Obtuse triangle perpendicular height")
    near(length(obtuse[1],obtuse[2])/scale, 13, "Obtuse triangle slanted side")
    near(area(obtuse)/scale**2, 60, "Corrected obtuse-triangle area")

    pairs = roots["quadrilateral-practice"]
    para = vertices(pairs,"area-practice-parallelogram")
    scale = length(para[0],para[1])/11
    near(abs(para[0][1]-para[2][1])/scale,4,"Independent parallelogram height")
    near(length(para[0],para[3])/scale,5,"Unused parallelogram slanted side")
    near(area(para)/scale**2,44,"Independent parallelogram area")
    trap = vertices(pairs,"area-practice-trapezoid")
    scale = length(trap[0],trap[1])/12
    near(length(trap[2],trap[3])/scale,6,"Independent trapezoid upper base")
    near(abs(trap[0][1]-trap[2][1])/scale,4,"Independent trapezoid height")
    near(area(trap)/scale**2,36,"Independent trapezoid area")

    for name, outline_id, hole_id, width, expected in (
        ("compound-area-model","compound-model-outline","compound-model-hole",12,82),
        ("compound-area","compound-outline","compound-hole",15,124),
    ):
        ps=vertices(roots[name],outline_id)
        scale=length(ps[0],ps[1])/width
        hole=roots[name].find(f".//*[@id='{hole_id}']")
        assert hole is not None
        hole_area=float(hole.attrib['width'])*float(hole.attrib['height'])
        near((area(ps)-hole_area)/scale**2,expected,f"{name} net area")
        assert ps[0][0] < float(hole.attrib['x']) < ps[3][0]
        assert ps[0][1] < float(hole.attrib['y'])
        assert float(hole.attrib['y'])+float(hole.attrib['height']) < ps[2][1]

    ps=vertices(roots["heron-model"],"heron-model-triangle")
    scale=length(ps[0],ps[1])/7
    near(length(ps[0],ps[2])/scale,5,"Heron model side 5")
    near(length(ps[1],ps[2])/scale,6,"Heron model side 6")
    near(area(ps)/scale**2,6*math.sqrt(6),"Heron model area")
    ps=vertices(roots["right-area-model"],"right-area-model-triangle")
    scale=length(ps[0],ps[1])/8
    near(length(ps[0],ps[2])/scale,15,"Right-area model height")
    near(length(ps[1],ps[2])/scale,17,"Right-area model hypotenuse")
    near(area(ps)/scale**2,60,"Right-area model area")

    mixed=roots["mixed-triangle-practice"]
    for figure,base,expected in (("mixed-base-height",14,35),("mixed-equilateral",6,9*math.sqrt(3)),("mixed-isosceles",6,12)):
        ps=vertices(mixed,figure)
        scale=length(ps[0],ps[1])/base
        near(area(ps)/scale**2,expected,f"{figure} area")
    for name,source_id,target_id,ratio,base,angle_a,angle_b in (
        ("similarity-shrinking-model","shrinking-source","shrinking-target",2/3,15,59.5,53.1),
        ("quiz-similarity-practice","quiz-similarity-source","quiz-similarity-target",7/4,12,90,22.6),
    ):
        source=vertices(roots[name],source_id)
        target=vertices(roots[name],target_id)
        for a,b in ((0,1),(0,2),(1,2)):
            near(length(target[a],target[b])/length(source[a],source[b]),ratio,f"{name} side ratio")
        def angle(p,q,r):
            u=(p[0]-q[0],p[1]-q[1]); v=(r[0]-q[0],r[1]-q[1])
            return math.degrees(math.acos(max(-1,min(1,(u[0]*v[0]+u[1]*v[1])/(math.hypot(*u)*math.hypot(*v))))))
        assert abs(angle(source[1],source[0],source[2])-angle_a) <= 0.05
        assert abs(angle(source[0],source[1],source[2])-angle_b) <= 0.05
        assert abs(180-angle_a-angle_b-angle(source[0],source[2],source[1])) <= 0.05
        scale=length(source[0],source[1])/base
        expected=(26/3,28/3) if ratio<1 else (8.75,22.75)
        near(length(target[0],target[2])/scale,expected[0],f"{name} DF")
        near(length(target[1],target[2])/scale,expected[1],f"{name} EF")

    for name, forbidden in {"regular-polygon-angle": ["156", "15 sides"], "triangle-practice": ["12", "54", "26.8"], "similarity-practice": ["21", "37′", "30″"],"quadrilateral-practice":["44","36"],"compound-area":["124"],"triangle-height":["60"],"mixed-triangle-practice":["35","9√3","A = 12"],"quiz-similarity-practice":["8.75","22.75","67.4"]}.items():
        labels = " ".join(e.text or "" for e in roots[name].findall(".//s:text", NS))
        for answer in forbidden:
            assert answer not in labels, f"{name} exposes a practice answer: {answer}"
    near(45+22/60+18/3600, 45.371667, "DMS model conversion")
    near(73+37/60+30/3600, 73.625, "DMS practice conversion")
    near(12+59/60+60/3600, 13, "DMS rounding carry")
    near(135+43/60+15.6/3600,135.721,"Successive-remainder DMS model")
    near(120+48/60+50/3600,120.813889,"Reverse DMS independent practice")
    return {a["src"]: f"Checked SVG structure, accessible labels, givens, and relevant geometric proportions: {roots[Path(a['src']).stem].find('s:title',NS).text}." for a in assets}


if __name__ == "__main__":
    evidence = verify()
    print(f"PASS {len(evidence)} Unit 2C figures: geometry, correspondence, DMS, and hidden practice answers")
