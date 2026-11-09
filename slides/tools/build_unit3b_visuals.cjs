/* Editable, offline SVG diagrams for Unit 3B (trigonometric functions of any angle).
 * Shares the drawing helpers of build_unit3a_visuals.cjs. Figures are to scale;
 * practice figures show givens only.
 * Run: node tools/build_unit3b_visuals.cjs
 */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { helpers: H } = require("./build_unit3a_visuals.cjs");
const { C, svg, line, arrowLine, poly, text, centered, italic, dash, at, arc, rightMark, rad, f } = H;
const out = path.resolve(__dirname, "../assets/math130unit3b/visuals");
const diagrams = {};

function miniAxes(c, R) {
  return line([c[0] - R, c[1]], [c[0] + R, c[1]], C.muted, 2.5) + line([c[0], c[1] - R], [c[0], c[1] + R], C.muted, 2.5);
}

/* Reference angles in all four quadrants. */
{
  const panels = [[1, 40, "θ′ = θ"], [2, 140, "θ′ = 180° − θ"], [3, 215, "θ′ = θ − 180°"], [4, 310, "θ′ = 360° − θ"]];
  let body = "";
  panels.forEach(([q, th, rule], i) => {
    const c = [190 + (i % 2) * 380, 140 + Math.floor(i / 2) * 270], R = 105;
    body += miniAxes(c, R) + line(c, at(c, R * 0.95, th), C.teal, 5);
    body += arc(c, 30, 0, th, C.muted, 3, true);
    const near = q === 1 || q === 4 ? (q === 1 ? 0 : 360) : 180;
    body += arc(c, 62, th, near, C.orange, 6, false);
    const mid = at(c, 86, (th + near) / 2);
    body += centered(mid[0], mid[1] + 9, "θ′", C.orange, 26, italic);
    body += centered(c[0], c[1] + R + 30, `Quadrant ${["I", "II", "III", "IV"][q - 1]}: ${rule}`, C.ink, 24);
  });
  diagrams["reference-angles"] = svg(760, 560, "Reference angles in the four quadrants", "Four small sets of axes, one per quadrant. In each, a teal terminal side makes an angle theta from the positive x-axis, and an orange arc marks the reference angle theta prime, measured to the nearest part of the x-axis. Quadrant I: theta prime equals theta. Quadrant II: 180 degrees minus theta. Quadrant III: theta minus 180 degrees. Quadrant IV: 360 degrees minus theta.", body);
}

/* ASTC: which functions are positive in each quadrant, from the signs of x and y. */
{
  const c = [380, 270], R = 230;
  let body = line([c[0] - R, c[1]], [c[0] + R, c[1]], C.muted, 3) + line([c[0], c[1] - R], [c[0], c[1] + R], C.muted, 3);
  const q = [[1, "All positive", "x > 0, y > 0", C.emerald || C.teal], [2, "sin and csc", "x < 0, y > 0", C.orange], [3, "tan and cot", "x < 0, y < 0", C.purple], [4, "cos and sec", "x > 0, y < 0", C.blue]];
  q.forEach(([n, fn, sg, col]) => {
    const sx = n === 1 || n === 4 ? 1 : -1, sy = n === 1 || n === 2 ? -1 : 1;
    const x = c[0] + sx * 120, y = c[1] + sy * 110;
    body += centered(x, y - 30, ["I", "II", "III", "IV"][n - 1], C.line, 40, 'font-weight="700"');
    body += centered(x, y + 10, fn, col, 30, 'font-weight="700"') + centered(x, y + 46, sg, C.muted, 24);
  });
  body += centered(c[0], 525, "sin = y/r, cos = x/r, tan = y/x, and r is always positive", C.ink, 24);
  diagrams["astc"] = svg(760, 545, "Signs of the trigonometric functions by quadrant", "Coordinate axes with the four quadrants. Quadrant I: all functions positive, x and y positive. Quadrant II: sine and cosecant positive, x negative and y positive. Quadrant III: tangent and cotangent positive, x and y negative. Quadrant IV: cosine and secant positive, x positive and y negative. A note says sine is y over r, cosine is x over r, tangent is y over x, and r is always positive.", body);
}

/* The point (−3, 4): x, y and r = 5, with the reference angle. */
{
  const k = 60, c = [450, 330], P = [c[0] - 3 * k, c[1] - 4 * k], foot = [P[0], c[1]];
  let body = arrowLine([c[0] - 330, c[1]], [c[0] + 260, c[1]], C.muted, 3) + arrowLine([c[0], c[1] + 120], [c[0], c[1] - 300], C.muted, 3);
  body += poly([c, foot, P], C.softBlue) + rightMark(foot, c, P, 18) + line(c, P, C.orange, 6);
  body += `<circle cx="${f(P[0])}" cy="${f(P[1])}" r="8" fill="${C.ink}"/>` + text(P[0] - 120, P[1] - 12, "P(−3, 4)", C.ink, 28);
  body += centered((c[0] + foot[0]) / 2, c[1] + 36, "x = −3", C.blue, 26) + text(foot[0] - 86, (foot[1] + P[1]) / 2 + 8, "y = 4", C.teal, 26);
  body += text((c[0] + P[0]) / 2 + 18, (c[1] + P[1]) / 2 - 6, "r = 5", C.orange, 28);
  const ang = 180 - Math.atan2(4, 3) * 180 / Math.PI;
  body += arc(c, 40, 0, ang, C.muted, 3, true) + arc(c, 70, ang, 180, C.purple, 5, false) + text(c[0] - 132, c[1] - 14, "θ′", C.purple, 26, italic);
  body += text(40, 400, "r = √(x² + y²) = √(9 + 16) = 5", C.ink, 24);
  diagrams["point-ratios"] = svg(760, 420, "A point on the terminal side", "Axes with the point P at negative 3, 4 in Quadrant II. A right triangle drops from P to the x-axis: horizontal leg x equals negative 3, vertical leg y equals 4, and the segment from the origin to P has length r equal to 5. The reference angle theta prime is between the terminal side and the negative x-axis.", body);
}

/* Model: sin θ = −√2/2 on [0°, 360°): reference angle 45°, solutions 225° and 315°. */
{
  const c = [380, 260], R = 190, yv = -Math.SQRT1_2;
  let body = line([c[0] - R - 40, c[1]], [c[0] + R + 40, c[1]], C.muted, 3) + line([c[0], c[1] - R - 30], [c[0], c[1] + R + 30], C.muted, 3);
  body += `<circle cx="${c[0]}" cy="${c[1]}" r="${R}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  body += line([c[0] - R - 30, c[1] - yv * R], [c[0] + R + 30, c[1] - yv * R], C.orange, 3, dash);
  body += text(c[0] - R - 36, c[1] - yv * R + 8, "y = −√2/2", C.orange, 22, 'text-anchor="end"');
  [225, 315].forEach(t => { const p = at(c, R, t); body += line(c, p, C.teal, 5) + `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="8" fill="${C.teal}"/>`; });
  body += text(at(c, R + 30, 225)[0] - 70, at(c, R + 30, 225)[1] + 16, "225°", C.teal, 28) + text(at(c, R + 30, 315)[0] + 4, at(c, R + 30, 315)[1] + 16, "315°", C.teal, 28);
  body += arc(c, 56, 180, 225, C.purple, 4, false) + text(c[0] - 120, c[1] + 46, "45°", C.purple, 22) + arc(c, 56, 315, 360, C.purple, 4, false) + text(c[0] + 66, c[1] + 46, "45°", C.purple, 22);
  diagrams["solve-sine"] = svg(760, 520, "Solving sine theta equals negative root 2 over 2", "A unit circle with a dashed horizontal line at y equals negative root 2 over 2. It crosses the circle at two points, on terminal sides at 225 degrees in Quadrant III and 315 degrees in Quadrant IV. Each makes a 45 degree reference angle with the x-axis.", body);
}

function build() {
  fs.mkdirSync(out, { recursive: true });
  for (const [name, xml] of Object.entries(diagrams)) fs.writeFileSync(path.join(out, `${name}.svg`), xml, "utf8");
  console.log(`Built ${Object.keys(diagrams).length} Unit 3B mathematical diagrams.`);
}
if (require.main === module) build();
module.exports = { diagrams, build };
