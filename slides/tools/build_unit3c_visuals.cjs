/* Editable, offline SVG diagrams for Unit 3C (right triangle applications).
 * Shares the drawing helpers of build_unit3a_visuals.cjs. Figures are to scale;
 * practice figures show givens only.
 * Run: node tools/build_unit3c_visuals.cjs
 */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { helpers: H } = require("./build_unit3a_visuals.cjs");
const { C, svg, line, arrowLine, poly, text, centered, italic, dash, at, rightMark, thetaMark, twoTriangles, rad, f } = H;
const out = path.resolve(__dirname, "../assets/math130unit3c/visuals");
const diagrams = {};

/* Practice: 80 ft from a building, 42 degrees of elevation; height unknown. */
{
  const base = 80, ang = 42, h = base * Math.tan(rad(ang)), k = Math.min(520 / base, 330 / h);
  const eye = [90, 400], foot = [90 + base * k, 400], top = [foot[0], 400 - h * k];
  let body = `<rect x="${f(foot[0])}" y="${f(top[1])}" width="90" height="${f(h * k)}" fill="#e2e8f0" stroke="${C.muted}" stroke-width="3"/>`;
  body += poly([eye, foot, top], C.softTeal) + rightMark(foot, eye, top, 22) + line(eye, top, C.orange, 4, dash);
  body += thetaMark(eye, 0, ang, 80, "42°", C.ink, 28);
  body += centered((eye[0] + foot[0]) / 2, 444, "80 ft", C.ink, 30) + text(foot[0] - 44, (foot[1] + top[1]) / 2 + 10, "h", C.teal, 36, italic);
  body += text(eye[0] - 40, eye[1] + 44, "surveyor", C.muted, 22);
  diagrams["surveyor"] = svg(760, 470, "Angle of elevation to a building", "A surveyor stands 80 feet from a building and sights the top at a 42 degree angle of elevation. The building height h is unknown. Drawn to scale.", body);
}

/* Model: 300 miles at 25 degrees north of east, with its east and north components. */
{
  const d = 300, ang = 25, k = 1.6, o = [90, 400];
  const tip = [o[0] + d * Math.cos(rad(ang)) * k, o[1] - d * Math.sin(rad(ang)) * k], corner = [tip[0], o[1]];
  let body = line([40, o[1]], [740, o[1]], C.line, 3) + line([o[0], 470], [o[0], 60], C.line, 3);
  body += text(720, o[1] - 12, "E", C.muted, 24) + text(o[0] + 10, 76, "N", C.muted, 24);
  body += arrowLine(o, corner, C.blue, 6) + arrowLine(corner, tip, C.teal, 6) + arrowLine(o, tip, C.orange, 8) + rightMark(corner, o, tip, 20);
  body += thetaMark(o, 0, ang, 110, "25°", C.ink, 26);
  body += centered((o[0] + corner[0]) / 2, o[1] + 40, "east: 300 cos 25° ≈ 271.89 mi", C.blue, 24);
  body += text(tip[0] + 14, (tip[1] + corner[1]) / 2 + 8, "north ≈ 126.79 mi", C.teal, 24);
  body += text((o[0] + tip[0]) / 2 - 150, (o[1] + tip[1]) / 2 - 22, "300 mi", C.orange, 28);
  diagrams["vector-components"] = svg(760, 470, "A displacement and its components", "An orange arrow 300 miles long points 25 degrees north of east. A blue arrow along the east axis, about 271.89 miles, and a teal arrow north, about 126.79 miles, complete a right triangle. Drawn to scale.", body);
}

/* Model: two observations 50 ft apart at 31 and 53 degrees. */
{
  const t = twoTriangles(31, 53, 50, { showH: "h", showD: "d" });
  diagrams["two-towers"] = svg(760, 470, "Two observations of one tower", "A tower of height h seen from two points 50 feet apart. From the far point the angle of elevation is 31 degrees; from the near point, d feet from the base, it is 53 degrees. Drawn to scale.", t.body);
}

/* Practice: 27 and 48 degrees from points 60 ft apart (givens only). */
{
  const t = twoTriangles(27, 48, 60, { fill: C.softTeal, showH: "h", showD: "d" });
  diagrams["two-towers-practice"] = svg(760, 470, "Two observations 60 feet apart", "A building of unknown height h seen from two points 60 feet apart. From the far point the angle of elevation is 27 degrees; from the near point, d feet from the base, it is 48 degrees. Drawn to scale.", t.body);
}

function build() {
  fs.mkdirSync(out, { recursive: true });
  for (const [name, xml] of Object.entries(diagrams)) fs.writeFileSync(path.join(out, `${name}.svg`), xml, "utf8");
  console.log(`Built ${Object.keys(diagrams).length} Unit 3C mathematical diagrams.`);
}
if (require.main === module) build();
module.exports = { diagrams, build };
