/* Editable, offline SVG diagrams for Unit 3A (angles and right triangle trigonometry).
 * Every triangle, sector and angle is drawn to scale from its given values.
 * Practice diagrams show givens only; no requested value appears in a figure.
 * Run: node tools/build_unit3a_visuals.cjs (from slides/ or any directory).
 */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const out = path.resolve(__dirname, "../assets/math130unit3a/visuals");
const C = { ink: "#163a5f", blue: "#075ea8", teal: "#087f8c", orange: "#c45a0a", purple: "#6d3bb5", muted: "#526579", line: "#cbd5e1", softBlue: "#eaf3fb", softTeal: "#e4f4f5", softOrange: "#fff3e8" };
const MARKERS = { ink: C.ink, blue: C.blue, teal: C.teal, orange: C.orange, purple: C.purple, muted: C.muted };
const esc = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const f = n => Number(n.toFixed(3));
const rad = d => d * Math.PI / 180;
const marker = color => `url(#arrow-${Object.keys(MARKERS).find(k => MARKERS[k] === color) || "ink"})`;

const line = (a, b, color = C.ink, width = 4, extra = "") => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const arrowLine = (a, b, color = C.ink, width = 4) => line(a, b, color, width, `marker-end="${marker(color)}"`);
const poly = (ps, fill = C.softBlue, stroke = C.ink) => `<polygon points="${ps.map(p => `${f(p[0])},${f(p[1])}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`;
const text = (x, y, s, color = C.ink, size = 30, extra = "") => `<text x="${f(x)}" y="${f(y)}" fill="${color}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const centered = (x, y, s, color = C.ink, size = 30, extra = "") => text(x, y, s, color, size, `text-anchor="middle" ${extra}`);
const italic = 'font-family="Georgia, \'Times New Roman\', serif" font-style="italic"';
const dash = 'stroke-dasharray="10 8"';

/* A point at angle d degrees (counterclockwise from +x) and radius r about center c (SVG y points down). */
const at = (c, r, d) => [c[0] + r * Math.cos(rad(d)), c[1] - r * Math.sin(rad(d))];

/* An arc from angle a to angle b (degrees, either direction, any size), drawn as a smooth polyline. */
function arc(c, r, a, b, color = C.orange, width = 4, arrow = true, grow = 0) {
  const n = Math.max(12, Math.ceil(Math.abs(b - a) / 3));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push(at(c, r + grow * t, a + (b - a) * t));
  }
  return `<polyline points="${pts.map(p => `${f(p[0])},${f(p[1])}`).join(" ")}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" ${arrow ? `marker-end="${marker(color)}"` : ""}/>`;
}

/* The right-angle mark at corner p, with legs running toward u and v. */
function rightMark(p, u, v, size = 20, color = C.ink) {
  const unit = q => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); return [dx / L, dy / L]; };
  const a = unit(u), b = unit(v);
  const p1 = [p[0] + a[0] * size, p[1] + a[1] * size];
  const p2 = [p1[0] + b[0] * size, p1[1] + b[1] * size];
  const p3 = [p[0] + b[0] * size, p[1] + b[1] * size];
  return `<polyline points="${[p1, p2, p3].map(q => `${f(q[0])},${f(q[1])}`).join(" ")}" fill="none" stroke="${color}" stroke-width="3"/>`;
}

/* Axes through c with half-length R, quadrant numerals, and an optional heavy initial side. */
function axes(c, R, { quadrants = true, initial = true, ticks = false } = {}) {
  let s = arrowLine([c[0] - R, c[1]], [c[0] + R, c[1]], C.muted, 3) + arrowLine([c[0], c[1] + R], [c[0], c[1] - R], C.muted, 3);
  s += line([c[0] + R, c[1]], [c[0] - R, c[1]], C.muted, 3, `marker-end="${marker(C.muted)}"`);
  s += line([c[0], c[1] - R], [c[0], c[1] + R], C.muted, 3, `marker-end="${marker(C.muted)}"`);
  s += text(c[0] + R - 8, c[1] + 34, "x", C.muted, 28, italic) + text(c[0] + 14, c[1] - R + 22, "y", C.muted, 28, italic);
  if (quadrants) {
    const q = R * 0.62;
    [["I", 45], ["II", 135], ["III", 225], ["IV", 315]].forEach(([n, d]) => { const p = at(c, q, d); s += centered(p[0], p[1] + 10, n, C.line, 34, 'font-weight="700"'); });
  }
  if (ticks) [90, 180, 270, 360].forEach(d => { const p = at(c, R * 0.86, d === 360 ? 0 : d); const lab = `${d}°`; s += text(p[0] + (d === 180 ? -8 : 16), p[1] + (d === 90 || d === 270 ? 8 : -14), lab, C.muted, 22, d === 180 ? 'text-anchor="end"' : ""); });
  if (initial) s += line(c, [c[0] + R * 0.8, c[1]], C.blue, 6);
  return s;
}
const terminal = (c, r, d, color = C.teal) => line(c, at(c, r, d), color, 6);

function svg(w, h, title, desc, body) {
  const defs = Object.entries(MARKERS).map(([k, col]) => `<marker id="arrow-${k}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${col}"/></marker>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">${esc(desc)}</desc>
<defs>${defs}</defs>
<g font-family="Arial, Helvetica, sans-serif" stroke-linecap="round">${body}</g>
</svg>\n`;
}

/* A right triangle with legs a (horizontal) and b (vertical), right angle at the lower right,
 * scaled so its longer leg spans `span` units. Returns its vertices: A (angle θ), C (right angle), B. */
function rightTriangle(a, b, origin, span) {
  const k = span / Math.max(a, b);
  const A = origin, Cc = [origin[0] + a * k, origin[1]], B = [origin[0] + a * k, origin[1] - b * k];
  return { A, C: Cc, B, k, angle: Math.atan2(b, a) * 180 / Math.PI };
}
function triangleBody(t, fill = C.softBlue) {
  return poly([t.A, t.C, t.B], fill) + rightMark(t.C, t.A, t.B);
}
const thetaMark = (vertex, from, to, r = 52, label = "θ", color = C.orange, size = 32) => {
  const mid = (from + to) / 2, p = at(vertex, r + 26, mid);
  return arc(vertex, r, from, to, color, 4, false) + centered(p[0], p[1] + 11, label, color, size, italic);
};

const diagrams = {};

/* 1. Standard position: positive and negative rotation. */
{
  const c = [330, 300];
  let body = axes(c, 250);
  body += terminal(c, 205, 120, C.orange) + terminal(c, 205, -50, C.purple);
  body += arc(c, 70, 0, 120, C.orange) + arc(c, 95, 0, -50, C.purple);
  body += text(at(c, 210, 120)[0] - 150, at(c, 210, 120)[1] - 10, "positive: counterclockwise", C.orange, 24);
  body += text(at(c, 220, -50)[0] - 40, at(c, 220, -50)[1] + 40, "negative: clockwise", C.purple, 24);
  body += text(c[0] + 120, c[1] - 14, "initial side", C.blue, 24);
  body += `<circle cx="${c[0]}" cy="${c[1]}" r="7" fill="${C.ink}"/>` + text(c[0] - 92, c[1] + 34, "vertex", C.ink, 22);
  diagrams["standard-position"] = svg(660, 600, "Angles in standard position", "Coordinate axes with Quadrants I through IV. The vertex is at the origin and the initial side lies on the positive x-axis. An orange arc rotates counterclockwise to a terminal side in Quadrant II, labeled positive. A purple arc rotates clockwise to a terminal side in Quadrant IV, labeled negative.", body);
}

/* 2. Model: 225° and −120° both terminate in Quadrant III. */
{
  const c1 = [190, 230], c2 = [560, 230], R = 165;
  let body = axes(c1, R) + axes(c2, R);
  body += terminal(c1, 140, 225) + arc(c1, 48, 0, 225, C.orange) + centered(c1[0], 470, "225° = 180° + 45°", C.orange, 28);
  body += arc(c1, 82, 180, 225, C.purple, 3, false) + text(at(c1, 100, 205)[0] - 40, at(c1, 100, 205)[1] + 6, "45°", C.purple, 22);
  body += terminal(c2, 140, -120) + arc(c2, 48, 0, -120, C.purple) + centered(c2[0], 470, "−120°  (same side as 240°)", C.purple, 28);
  diagrams["standard-model"] = svg(750, 500, "Sketches of 225 degrees and negative 120 degrees", "Two sets of axes. On the left, an orange counterclockwise arc of 225 degrees ends in Quadrant III, 45 degrees past the negative x-axis. On the right, a purple clockwise arc of negative 120 degrees also ends in Quadrant III. Both begin on the positive x-axis.", body);
}

/* 3. Practice: blank axes to sketch on (givens only). */
{
  const c = [300, 290];
  let body = axes(c, 240, { ticks: true });
  body += text(c[0] + 96, c[1] - 14, "initial side", C.blue, 24);
  body += centered(300, 575, "Sketch 310° here.", C.ink, 28);
  diagrams["standard-practice"] = svg(600, 600, "Axes for sketching 310 degrees", "Empty coordinate axes with Quadrants I through IV and the quarter-turn marks 90, 180, 270 and 360 degrees. The initial side is drawn on the positive x-axis. No terminal side is drawn.", body);
}

/* 4. Coterminal angles share one terminal side. */
{
  const c = [320, 300];
  let body = axes(c, 250);
  body += terminal(c, 215, 45);
  body += arc(c, 44, 0, 45, C.orange) + arc(c, 72, 0, 405, C.blue, 4, true, 52) + arc(c, 150, 0, -315, C.purple);
  body += text(at(c, 150, 20)[0] + 14, at(c, 150, 20)[1] + 4, "45°", C.orange, 26);
  body += text(c[0] - 236, c[1] - 196, "405° = 45° + 360°", C.blue, 26) + text(c[0] - 236, c[1] + 232, "−315° = 45° − 360°", C.purple, 26);
  diagrams["coterminal"] = svg(640, 600, "Three coterminal angles", "One terminal side in Quadrant I at 45 degrees. A short orange arc shows 45 degrees. A blue spiral shows 405 degrees, one full turn more. A purple clockwise arc shows negative 315 degrees, one full turn less. All three end on the same terminal side.", body);
}

/* 5. Model: −97° and 263° share a terminal side. */
{
  const c = [320, 290];
  let body = axes(c, 240);
  body += terminal(c, 205, -97);
  body += arc(c, 58, 0, -97, C.purple) + arc(c, 104, 0, 263, C.orange);
  body += text(c[0] + 52, c[1] + 82, "−97°", C.purple, 28) + text(c[0] - 300, c[1] - 200, "263° = −97° + 360°", C.orange, 26);
  diagrams["coterminal-model"] = svg(640, 580, "Negative 97 degrees and 263 degrees", "A terminal side in Quadrant III just past the negative y-axis. A purple clockwise arc measures negative 97 degrees and a larger orange counterclockwise arc measures 263 degrees. Both end on the same terminal side.", body);
}

/* 6. Arc length: s = rθ, with one radian shown. */
{
  const c = [250, 330], r = 220, th = 70;
  let body = `<path d="M ${c[0]} ${c[1]} L ${f(at(c, r, 0)[0])} ${f(at(c, r, 0)[1])} A ${r} ${r} 0 0 0 ${f(at(c, r, th)[0])} ${f(at(c, r, th)[1])} Z" fill="${C.softBlue}" stroke="none"/>`;
  body += `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  body += line(c, at(c, r, 0), C.ink, 4) + line(c, at(c, r, th), C.ink, 4);
  body += arc(c, r, 0, th, C.orange, 9, false);
  body += thetaMark(c, 0, th, 48);
  body += centered(at(c, r / 2, 0)[0], c[1] + 36, "r", C.ink, 32, italic) + text(at(c, r / 2, th)[0] - 34, at(c, r / 2, th)[1] + 4, "r", C.ink, 32, italic);
  body += text(at(c, r + 20, th / 2)[0], at(c, r + 20, th / 2)[1], "s", C.orange, 36, italic);
  body += centered(330, 605, "s = rθ   (θ in radians)", C.ink, 32);
  diagrams["arc-length"] = svg(620, 640, "Arc length on a circle", "A circle of radius r with a shaded sector. The central angle theta is between two radii, and the orange arc s lies opposite it. The caption reads s equals r theta, theta in radians.", body);
}

/* 7. Model: r = 12, θ = 2π/3. */
{
  const c = [300, 300], R = 230, th = 120;
  let body = `<path d="M ${c[0]} ${c[1]} L ${f(at(c, R, 0)[0])} ${f(at(c, R, 0)[1])} A ${R} ${R} 0 0 0 ${f(at(c, R, th)[0])} ${f(at(c, R, th)[1])} Z" fill="${C.softBlue}" stroke="none"/>`;
  body += `<circle cx="${c[0]}" cy="${c[1]}" r="${R}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  body += line(c, at(c, R, 0)) + line(c, at(c, R, th)) + arc(c, R, 0, th, C.orange, 9, false);
  body += thetaMark(c, 0, th, 50, "2π/3", C.orange, 28);
  body += centered(at(c, R / 2, 0)[0], c[1] + 36, "r = 12", C.ink, 28);
  body += text(at(c, R + 18, 60)[0], at(c, R + 18, 60)[1], "s", C.orange, 36, italic);
  diagrams["arc-model"] = svg(600, 560, "Sector with radius 12 and angle two pi over three", "A circle with radius 12 and a shaded sector with central angle two pi over three radians, one third of the circle. The orange arc s lies opposite the angle.", body);
}

/* 8. Practice: r = 8, θ = 135° (givens only). */
{
  const c = [300, 300], R = 220, th = 135;
  let body = `<path d="M ${c[0]} ${c[1]} L ${f(at(c, R, 0)[0])} ${f(at(c, R, 0)[1])} A ${R} ${R} 0 0 0 ${f(at(c, R, th)[0])} ${f(at(c, R, th)[1])} Z" fill="${C.softTeal}" stroke="none"/>`;
  body += `<circle cx="${c[0]}" cy="${c[1]}" r="${R}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  body += line(c, at(c, R, 0)) + line(c, at(c, R, th)) + arc(c, R, 0, th, C.orange, 9, false);
  body += thetaMark(c, 0, th, 50, "135°", C.orange, 28);
  body += centered(at(c, R / 2, 0)[0], c[1] + 36, "r = 8", C.ink, 28);
  body += text(at(c, R + 18, 67)[0], at(c, R + 18, 67)[1], "s = ?", C.orange, 32, italic);
  diagrams["arc-practice"] = svg(600, 560, "Sector with radius 8 and angle 135 degrees", "A circle with radius 8 and a shaded sector with central angle 135 degrees. The arc opposite the angle is labeled s equals question mark.", body);
}

/* 9. Naming the sides from θ. */
{
  const t = rightTriangle(4, 3, [70, 420], 440);
  let body = triangleBody(t) + thetaMark(t.A, 0, t.angle, 70);
  body += line(t.A, t.C, C.blue, 8) + line(t.C, t.B, C.teal, 8) + line(t.A, t.B, C.orange, 8) + rightMark(t.C, t.A, t.B, 24);
  body += centered((t.A[0] + t.C[0]) / 2, t.A[1] + 44, "adjacent to θ", C.blue, 30);
  body += text(t.C[0] + 18, (t.C[1] + t.B[1]) / 2 + 10, "opposite θ", C.teal, 30);
  body += text((t.A[0] + t.B[0]) / 2 - 150, (t.A[1] + t.B[1]) / 2 - 22, "hypotenuse", C.orange, 30);
  diagrams["ratio-sides"] = svg(700, 480, "The three sides named from angle theta", "A right triangle with angle theta at the lower left. The blue bottom leg touching theta is the adjacent side. The teal vertical leg across from theta is the opposite side. The orange side across from the right angle is the hypotenuse.", body);
}

/* 10. SOH-CAH-TOA and the reciprocals. */
{
  const t = rightTriangle(4, 3, [40, 300], 260);
  let body = triangleBody(t) + thetaMark(t.A, 0, t.angle, 48);
  body += line(t.A, t.C, C.blue, 7) + line(t.C, t.B, C.teal, 7) + line(t.A, t.B, C.orange, 7) + rightMark(t.C, t.A, t.B);
  body += centered((t.A[0] + t.C[0]) / 2, t.A[1] + 38, "adj", C.blue, 28) + text(t.C[0] + 14, (t.C[1] + t.B[1]) / 2 + 10, "opp", C.teal, 28) + text((t.A[0] + t.B[0]) / 2 - 80, (t.A[1] + t.B[1]) / 2 - 14, "hyp", C.orange, 28);
  const rows = [["sin θ", "opp", "hyp", "csc θ"], ["cos θ", "adj", "hyp", "sec θ"], ["tan θ", "opp", "adj", "cot θ"]];
  const col = { opp: C.teal, adj: C.blue, hyp: C.orange };
  rows.forEach((r, i) => {
    const y = 420 + i * 62;
    const frac = (x, num, den) => text(x - 8, y, num, col[num], 30, 'text-anchor="end"') + centered(x, y, "/", C.ink, 30) + text(x + 8, y, den, col[den], 30);
    body += text(40, y, `${r[0]} =`, C.ink, 30, italic) + frac(212, r[1], r[2]);
    body += text(350, y, `${r[3]} =`, C.ink, 30, italic) + frac(522, r[2], r[1]);
  });
  body += centered(150, 370, "SOH · CAH · TOA", C.ink, 26, 'font-weight="700"') + centered(470, 370, "reciprocals: flip", C.muted, 26);
  diagrams["ratio-definitions"] = svg(640, 570, "The six trigonometric ratios", "A right triangle with angle theta, colored sides adjacent in blue, opposite in teal and hypotenuse in orange. Below it, sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent. The reciprocals cosecant, secant and cotangent flip each fraction.", body);
}

/* 11. Model: legs 9 (adjacent) and 40 (opposite), hypotenuse 41, to scale. */
{
  const t = rightTriangle(9, 40, [130, 520], 480);
  let body = triangleBody(t) + thetaMark(t.A, 0, t.angle, 46);
  body += centered((t.A[0] + t.C[0]) / 2, t.A[1] + 40, "9", C.blue, 32) + text(t.C[0] + 16, (t.C[1] + t.B[1]) / 2, "40", C.teal, 32) + text((t.A[0] + t.B[0]) / 2 - 62, (t.A[1] + t.B[1]) / 2, "41", C.orange, 32);
  body += text(260, 160, "9² + 40² = 41²", C.ink, 28) + text(260, 202, "81 + 1600 = 1681", C.muted, 24);
  diagrams["ratio-model"] = svg(500, 580, "Right triangle with sides 9, 40 and 41", "A tall right triangle drawn to scale. Angle theta is at the lower left. The adjacent leg is 9, the opposite leg is 40, and the hypotenuse is 41. A note checks that 9 squared plus 40 squared equals 41 squared.", body);
}

/* 12. Practice: cos θ = 9/41, so adjacent 9 and hypotenuse 41 (givens only). */
{
  const t = rightTriangle(9, 40, [130, 520], 480);
  let body = triangleBody(t, C.softTeal) + thetaMark(t.A, 0, t.angle, 46);
  body += centered((t.A[0] + t.C[0]) / 2, t.A[1] + 40, "9", C.blue, 32) + text(t.C[0] + 16, (t.C[1] + t.B[1]) / 2, "?", C.teal, 36) + text((t.A[0] + t.B[0]) / 2 - 62, (t.A[1] + t.B[1]) / 2, "41", C.orange, 32);
  body += text(260, 170, "cos θ = 9/41", C.ink, 30, italic);
  diagrams["ratio-practice"] = svg(500, 580, "Right triangle with adjacent side 9 and hypotenuse 41", "A tall right triangle with angle theta at the lower left, adjacent leg 9, hypotenuse 41, and the opposite leg marked with a question mark. A note reads cosine theta equals 9 over 41.", body);
}

/* 13. Feedback: opposite and adjacent swap with the reference angle. */
{
  const t1 = rightTriangle(4, 3, [40, 330], 260), t2 = rightTriangle(4, 3, [410, 330], 260);
  let body = triangleBody(t1) + triangleBody(t2, C.softOrange);
  body += thetaMark(t1.A, 0, t1.angle, 46, "A") ;
  const bAngle = 90 + (90 - t2.angle);
  body += thetaMark(t2.B, 270, 270 - (90 - t2.angle), 46, "B", C.purple);
  body += centered((t1.A[0] + t1.C[0]) / 2, t1.A[1] + 38, "adjacent", C.blue, 26) + text(t1.C[0] + 12, (t1.C[1] + t1.B[1]) / 2 + 8, "opposite", C.teal, 26);
  body += centered((t2.A[0] + t2.C[0]) / 2, t2.A[1] + 38, "opposite", C.teal, 26) + text(t2.C[0] + 12, (t2.C[1] + t2.B[1]) / 2 + 8, "adjacent", C.blue, 26);
  body += centered(170, 410, "from angle A", C.orange, 28) + centered(540, 410, "from angle B", C.purple, 28);
  void bAngle;
  diagrams["ratio-swap"] = svg(860, 440, "Opposite and adjacent depend on the angle", "The same right triangle drawn twice. Measured from angle A at the lower left, the bottom leg is adjacent and the vertical leg is opposite. Measured from angle B at the top, the bottom leg is opposite and the vertical leg is adjacent. The hypotenuse does not change.", body);
}

/* 14. Graph: sin θ and cos θ for acute angles stay between 0 and 1. */
{
  const X0 = 90, Y0 = 400, W = 540, H = 320;
  const px = d => X0 + d / 90 * W, py = v => Y0 - v * H;
  let body = "";
  [0.25, 0.5, 0.75, 1].forEach(v => body += line([X0, py(v)], [X0 + W, py(v)], C.line, 2) + text(X0 - 14, py(v) + 9, String(v), C.muted, 22, 'text-anchor="end"'));
  [15, 30, 45, 60, 75, 90].forEach(d => body += line([px(d), Y0], [px(d), Y0 + 8], C.muted, 2) + centered(px(d), Y0 + 34, `${d}°`, C.muted, 22));
  body += line([X0, Y0], [X0 + W + 20, Y0], C.muted, 3) + line([X0, Y0], [X0, py(1) - 20], C.muted, 3) + text(X0 - 14, Y0 + 9, "0", C.muted, 22, 'text-anchor="end"');
  const curve = (fn, color) => `<polyline points="${Array.from({ length: 91 }, (_, d) => `${f(px(d))},${f(py(fn(rad(d))))}`).join(" ")}" fill="none" stroke="${color}" stroke-width="6" stroke-linejoin="round"/>`;
  body += curve(Math.sin, C.teal) + curve(Math.cos, C.blue);
  body += text(px(72), py(Math.sin(rad(72))) + 44, "sin θ", C.teal, 30, italic) + text(px(64), py(Math.cos(rad(64))) - 18, "cos θ", C.blue, 30, italic);
  body += line([px(45), py(Math.SQRT1_2)], [px(45), Y0], C.orange, 3, dash) + `<circle cx="${f(px(45))}" cy="${f(py(Math.SQRT1_2))}" r="8" fill="${C.orange}"/>`;
  body += text(px(45) - 12, py(0.06), "at 45°, both ≈ 0.7071", C.orange, 24, 'text-anchor="end"');
  body += centered(X0 + W / 2, Y0 + 72, "angle θ (degrees)", C.ink, 24);
  diagrams["sin-cos-graph"] = svg(680, 490, "Sine and cosine of acute angles", "A graph from 0 to 90 degrees. Sine rises from 0 to 1 and cosine falls from 1 to 0. They cross at 45 degrees, where both are about 0.7071. Both stay between 0 and 1 for acute angles.", body);
}

/* 15. Special right triangles. */
{
  const s = 230;
  const t1 = rightTriangle(1, 1, [50, 330], s);
  const t2 = rightTriangle(Math.sqrt(3), 1, [380, 330], 330);
  let body = triangleBody(t1) + triangleBody(t2, C.softTeal);
  body += thetaMark(t1.A, 0, 45, 50, "45°", C.orange, 24) + thetaMark(t1.B, 270, 225, 42, "45°", C.orange, 24);
  body += thetaMark(t2.A, 0, 30, 70, "30°", C.purple, 24) + thetaMark(t2.B, 270, 210, 40, "60°", C.purple, 24);
  body += centered((t1.A[0] + t1.C[0]) / 2, t1.A[1] + 38, "1", C.ink, 30) + text(t1.C[0] + 14, (t1.C[1] + t1.B[1]) / 2 + 10, "1", C.ink, 30) + text((t1.A[0] + t1.B[0]) / 2 - 64, (t1.A[1] + t1.B[1]) / 2 - 6, "√2", C.ink, 30);
  body += centered((t2.A[0] + t2.C[0]) / 2, t2.A[1] + 38, "√3", C.ink, 30) + text(t2.C[0] + 14, (t2.C[1] + t2.B[1]) / 2 + 10, "1", C.ink, 30) + text((t2.A[0] + t2.B[0]) / 2 - 30, (t2.A[1] + t2.B[1]) / 2 - 16, "2", C.ink, 30);
  body += centered(165, 420, "45°–45°–90°", C.orange, 28) + centered(545, 420, "30°–60°–90°", C.purple, 28);
  diagrams["special-triangles"] = svg(760, 450, "The two special right triangles", "A 45-45-90 triangle with legs 1 and 1 and hypotenuse root 2. A 30-60-90 triangle with the short leg 1 opposite 30 degrees, the long leg root 3 opposite 60 degrees, and hypotenuse 2. Both are drawn to scale.", body);
}

/* 16. Ladder: 25 ft at 70° with the ground (givens only; h is unknown). */
{
  const L = 25, ang = 70, k = 19;
  const foot = [150, 520], top = [foot[0] + L * k * Math.cos(rad(ang)), foot[1] - L * k * Math.sin(rad(ang))];
  const base = [top[0], foot[1]];
  let body = `<rect x="${f(top[0])}" y="40" width="70" height="${f(foot[1] - 40)}" fill="#e2e8f0" stroke="${C.muted}" stroke-width="3"/>`;
  body += line([40, foot[1]], [top[0] + 110, foot[1]], C.ink, 4);
  body += line(top, base, C.teal, 4, dash) + rightMark(base, foot, top, 22);
  body += line(foot, top, C.orange, 12);
  body += thetaMark(foot, 0, ang, 60, "70°", C.ink, 28);
  body += text((foot[0] + top[0]) / 2 - 116, (foot[1] + top[1]) / 2, "25 ft", C.orange, 32);
  body += text(top[0] - 50, (top[1] + base[1]) / 2 + 10, "h", C.teal, 36, italic);
  body += centered(top[0] + 35, 30, "wall", C.muted, 22) + text(46, foot[1] + 36, "ground", C.muted, 22);
  diagrams["ladder"] = svg(420, 580, "A 25 foot ladder at 70 degrees", "A ladder 25 feet long leans against a wall. It makes a 70 degree angle with the ground. A dashed vertical segment h runs from the top of the ladder down to the ground and meets it at a right angle. The figure is drawn to scale.", body);
}

/* Two right triangles sharing one height h: angles aFar and aNear seen from points `gap` apart.
 * Drawn to scale; `known` lists which values to print (the rest show as letters). */
function twoTriangles(aFar, aNear, gap, { W = 760, H = 470, fill = C.softBlue, showH = "h", showD = "d" } = {}) {
  const tf = Math.tan(rad(aFar)), tn = Math.tan(rad(aNear));
  const d = gap * tf / (tn - tf), h = d * tn;
  const k = Math.min((W - 170) / (gap + d), (H - 120) / h);
  const base = [W - 90, H - 70], near = [base[0] - d * k, base[1]], far = [near[0] - gap * k, base[1]], top = [base[0], base[1] - h * k];
  let b = poly([far, base, top], fill) + line(near, top, C.ink, 4) + rightMark(base, far, top, 22);
  b += thetaMark(far, 0, aFar, 70, `${aFar}°`, C.orange, 26) + thetaMark(near, 0, aNear, 54, `${aNear}°`, C.purple, 26);
  b += `<circle cx="${f(far[0])}" cy="${f(far[1])}" r="7" fill="${C.ink}"/><circle cx="${f(near[0])}" cy="${f(near[1])}" r="7" fill="${C.ink}"/>`;
  b += centered((far[0] + near[0]) / 2, base[1] + 42, `${gap} ft`, C.ink, 28) + centered((near[0] + base[0]) / 2, base[1] + 42, showD, C.teal, 30, showD.length === 1 ? italic : "");
  b += text(base[0] + 14, (base[1] + top[1]) / 2 + 10, showH, C.teal, 32, showH.length === 1 ? italic : "");
  return { body: b, d, h };
}

/* Unit 3A, Nov 6: choosing the ratio from what you know and what you want. */
{
  const t = rightTriangle(4, 3, [50, 330], 300);
  let body = triangleBody(t) + thetaMark(t.A, 0, t.angle, 50);
  body += line(t.A, t.C, C.blue, 7) + line(t.C, t.B, C.teal, 7) + line(t.A, t.B, C.orange, 7) + rightMark(t.C, t.A, t.B);
  body += centered((t.A[0] + t.C[0]) / 2, t.A[1] + 38, "adj", C.blue, 28) + text(t.C[0] + 14, (t.C[1] + t.B[1]) / 2 + 10, "opp", C.teal, 28) + text((t.A[0] + t.B[0]) / 2 - 80, (t.A[1] + t.B[1]) / 2 - 14, "hyp", C.orange, 28);
  const rows = [["hyp", "opp", "sin"], ["hyp", "adj", "cos"], ["adj", "opp", "tan"]];
  const col = { opp: C.teal, adj: C.blue, hyp: C.orange };
  body += text(420, 78, "know and want", C.muted, 24) + text(640, 78, "use", C.muted, 24);
  rows.forEach((r, i) => { const y = 132 + i * 66; body += text(420, y, r[0], col[r[0]], 30) + text(490, y, "&", C.ink, 30) + text(526, y, r[1], col[r[1]], 30) + text(640, y, r[2], C.ink, 30, 'font-weight="700"'); });
  body += text(420, 360, "Unknown on top: multiply.", C.ink, 26) + text(420, 400, "Unknown on the bottom: divide.", C.ink, 26);
  diagrams["choose-ratio"] = svg(820, 430, "Choosing the ratio", "A right triangle with angle theta and its sides colored: adjacent blue, opposite teal, hypotenuse orange. A table pairs the two sides in a problem with a ratio: hypotenuse and opposite use sine, hypotenuse and adjacent use cosine, adjacent and opposite use tangent. Below: if the unknown is in the numerator, multiply; if it is in the denominator, divide.", body);
}

/* Unit 3A practice: a ramp rises 2 ft at 10 degrees; the ramp length is unknown (givens only). */
{
  const rise = 2, ang = 10, L = rise / Math.sin(rad(ang)), run = L * Math.cos(rad(ang)), k = 600 / run;
  const A = [70, 300], Cc = [70 + run * k, 300], B = [70 + run * k, 300 - rise * k];
  let body = poly([A, Cc, B], C.softTeal) + rightMark(Cc, A, B, 18) + line(A, B, C.orange, 9);
  body += thetaMark(A, 0, ang, 120, "10°", C.ink, 28);
  body += text(Cc[0] + 14, (Cc[1] + B[1]) / 2 + 10, "2 ft", C.teal, 28) + text((A[0] + B[0]) / 2 - 40, (A[1] + B[1]) / 2 - 26, "ramp = ?", C.orange, 30, italic);
  body += text(70, 360, "Drawn to scale: a 10° ramp is long and low.", C.muted, 24);
  diagrams["ramp"] = svg(760, 390, "A ramp rising 2 feet at 10 degrees", "A long, low right triangle drawn to scale. The ramp is the hypotenuse, marked with a question mark. It makes a 10 degree angle with the ground and rises 2 feet.", body);
}

/* Unit 3A model: the handout's tower, 40 and 55 degrees from points 50 ft apart. */
{
  const t = twoTriangles(40, 55, 50, { showH: "h", showD: "d" });
  diagrams["two-triangles"] = svg(760, 470, "Two right triangles that share a height", "A tower of height h. From a far point the angle of elevation is 40 degrees; from a point 50 feet closer it is 55 degrees. The near point is d feet from the base. Both triangles share the height h. Drawn to scale.", t.body);
}

function build() {
  fs.mkdirSync(out, { recursive: true });
  for (const [name, xml] of Object.entries(diagrams)) fs.writeFileSync(path.join(out, `${name}.svg`), xml, "utf8");
  console.log(`Built ${Object.keys(diagrams).length} Unit 3A mathematical diagrams.`);
}
if (require.main === module) build();
module.exports = { diagrams, build, helpers: { C, svg, line, arrowLine, poly, text, centered, italic, dash, at, arc, rightMark, rightTriangle, triangleBody, thetaMark, twoTriangles, rad, f } };
