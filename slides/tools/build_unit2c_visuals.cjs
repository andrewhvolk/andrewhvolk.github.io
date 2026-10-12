/* Editable, offline SVG diagrams for Unit 2C, session 2.
 * Coordinates use uniform scales. Practice diagrams contain givens only.
 * Run: node tools/build_unit2c_visuals.cjs (from slides/ or any directory).
 */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const out = path.resolve(__dirname, "../assets/math130unit2c/visuals");
const C = { ink: "#163a5f", blue: "#075ea8", teal: "#087f8c", orange: "#c45a0a", purple: "#6d3bb5", muted: "#526579", line: "#cbd5e1", bg: "#f8fafc", softBlue: "#eaf3fb", softTeal: "#e4f4f5", softOrange: "#fff3e8" };
const esc = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const f = n => Number(n.toFixed(4));
const pt = p => `${f(p[0])},${f(p[1])}`;
const points = ps => ps.map(pt).join(" ");
const line = (a, b, color = C.ink, extra = "") => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${color}" ${extra.includes("stroke-width=") ? "" : 'stroke-width="4"'} ${extra}/>`;
const poly = (ps, fill = C.softBlue, extra = "") => `<polygon points="${points(ps)}" fill="${fill}" ${extra.includes("stroke=") ? "" : `stroke="${C.ink}"`} stroke-width="4" stroke-linejoin="round" ${extra}/>`;
const text = (x, y, s, color = C.ink, size = 30, extra = "") => `<text x="${f(x)}" y="${f(y)}" fill="${color}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const centered = (x, y, s, color = C.ink, size = 30) => text(x, y, s, color, size, 'text-anchor="middle"');
const right = (x, y, size = 18, color = C.teal) => `<path d="M ${x} ${y-size} h ${size} v ${size}" fill="none" stroke="${color}" stroke-width="3"/>`;
const dash = 'stroke-dasharray="9 7"';
const dot = (p, r = 5, color = C.ink) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${color}"/>`;
function svg(w, h, title, desc, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">${esc(desc)}</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="${C.ink}" stroke-width="1.5"/></marker></defs>
<g font-family="Arial, Helvetica, sans-serif" stroke-linecap="round">${body}</g>
</svg>\n`;
}
function regular(n, cx, cy, radius, angle = -90) {
  return Array.from({ length: n }, (_, i) => [cx + radius * Math.cos((angle + 360*i/n)*Math.PI/180), cy + radius * Math.sin((angle + 360*i/n)*Math.PI/180)]);
}
function fan(ps, extra = "") {
  let s = "";
  for (let i = 1; i < ps.length-1; i++) s += poly([ps[0], ps[i], ps[i+1]], i%2 ? C.softBlue : C.softTeal, 'stroke="none"');
  s += `<polygon points="${points(ps)}" fill="none" stroke="${C.ink}" stroke-width="4" ${extra}/>`;
  for (let i = 2; i < ps.length-1; i++) s += line(ps[0], ps[i], C.teal, `${dash} data-diagonal="true"`);
  return s;
}
function arc(center, radius, start, end, color = C.orange, extra = "") {
  const p = angle => [center[0]+radius*Math.cos(angle),center[1]+radius*Math.sin(angle)];
  let delta = (end-start+2*Math.PI)%(2*Math.PI);
  return `<path d="M ${pt(p(start)).replace(","," ")} A ${radius} ${radius} 0 ${delta>Math.PI?1:0} 1 ${pt(p(end)).replace(","," ")}" fill="none" stroke="${color}" ${extra.includes("stroke-width=") ? "" : 'stroke-width="3"'} ${extra}/>`;
}

const diagrams = {};
{
  const ps = regular(5, 355, 300, 170);
  let body = poly(ps, C.softBlue, 'id="turn-polygon"');
  ps.forEach((p, i) => {
    const prev = ps[(i+4)%5], next = ps[(i+1)%5];
    const incoming = Math.atan2(p[1]-prev[1],p[0]-prev[0]);
    const outgoing = Math.atan2(next[1]-p[1],next[0]-p[0]);
    const extension = [p[0]+72*Math.cos(incoming),p[1]+72*Math.sin(incoming)];
    body += line(p, extension, C.muted, dash) + arc(p, 42, incoming, outgoing);
    const a = [p[0]+0.34*(next[0]-p[0]),p[1]+0.34*(next[1]-p[1])];
    const b = [p[0]+0.58*(next[0]-p[0]),p[1]+0.58*(next[1]-p[1])];
    body += line(a,b,C.ink,'marker-end="url(#arrow)"');
    const mid = incoming + Math.PI/5;
    body += centered(p[0]+78*Math.cos(mid), p[1]+78*Math.sin(mid)+8, ["e₁","e₂","e₃","e₄","e₅"][i],C.orange,28);
  });
  body += centered(355,290,"Follow the boundary",C.ink,29)+centered(355,330,"in one direction",C.ink,29);
  body += centered(355,575,"Each orange arc measures an exterior turn.",C.muted,27);
  diagrams["exterior-turn"] = svg(710,620,"Exterior angles of a convex pentagon","Five exterior turns, measured between an extended incoming side and the outgoing side, accompany one clockwise circuit of a convex pentagon.",body);
}
{
  const ps = regular(8,335,285,205,-112.5);
  let body = fan(ps,'id="octagon"');
  ps.forEach((p,i)=>body+=centered(335+(p[0]-335)*1.18,285+(p[1]-285)*1.18+10,"ABCDEFGH"[i],i?C.ink:C.blue,30));
  body += dot(ps[0],7,C.blue)+centered(335,570,"8 sides   ·   6 triangles",C.ink,34);
  diagrams["octagon-triangulation"] = svg(670,620,"An octagon divided into six triangles","Five diagonals from vertex A partition a convex octagon into six nonoverlapping triangles. The eight vertices are A through H.",body);
}
{
  const oct = regular(8,145,110,70,-112.5);
  const trap = [[110,370],[510,370],[430,230],[190,230]];
  const para = [[160,635],[340,635],[440,475],[260,475]];
  let body = fan(oct,'id="model-octagon"')+text(265,105,"Octagon",C.ink,32)+text(265,146,"n = 8",C.blue,30);
  body += poly(trap,C.softBlue,'id="model-trapezoid"')+line([190,230],[190,370],C.teal,dash)+right(190,370);
  body += centered(310,213,"b₁ = 12",C.blue,29)+centered(310,412,"b₂ = 20",C.blue,29)+text(205,307,"h = 7",C.teal,29);
  body += poly(para,C.softTeal,'id="model-parallelogram"')+line([260,475],[260,635],C.teal,dash)+right(260,635);
  body += centered(250,675,"b = 9",C.blue,29)+text(275,559,"h = 8",C.teal,29);
  diagrams["polygon-area-model"] = svg(630,710,"Octagon and two area models","An octagon has eight sides. A trapezoid has parallel bases 12 and 20 and perpendicular height 7. A parallelogram has base 9 and perpendicular height 8. Heights have right-angle marks.",body);
}
{
  const vertex=[380,300], start=[60,300], end=[650,300];
  const next=[380+265*Math.cos(Math.PI*24/180),300-265*Math.sin(Math.PI*24/180)];
  let body = `<path d="M 380 300 L 130 300 L ${pt(next).replace(","," ")} Z" fill="${C.softBlue}"/>`;
  body += line(start,vertex,C.ink,'id="incoming-side"')+line(vertex,next,C.ink,'id="outgoing-side"')+line(vertex,end,C.muted,`${dash} id="side-extension"`);
  body += arc(vertex,108,-Math.PI*24/180,0,C.orange)+arc(vertex,65,Math.PI,2*Math.PI-Math.PI*24/180,C.blue);
  body += text(500,280,"24°",C.orange,34)+text(298,251,"i = ?",C.blue,34)+dot(vertex,6);
  body += centered(360,415,"The interior and exterior angles",C.ink,29)+centered(360,456,"share a straight line.",C.ink,29);
  diagrams["regular-polygon-angle"] = svg(720,530,"A local view of the regular polygon's vertex","The incoming side extends horizontally through the vertex. The outgoing side turns 24 degrees. The adjacent interior angle is labeled i equals question mark. The complete polygon and its number of sides are intentionally not shown.",body);
}
{
  const outer=[[100,160],[520,160],[520,328],[380,328],[380,440],[100,440]];
  let body = poly(outer,C.softBlue,'id="compound-outline"')+line([100,328],[380,328],C.teal,dash);
  body += `<rect id="compound-hole" x="180" y="216" width="84" height="56" fill="${C.bg}" stroke="${C.orange}" stroke-width="4" stroke-dasharray="8 5"/>`;
  body += centered(310,125,"15 m",C.blue,32)+text(30,313,"10 m",C.blue,30)+centered(450,308,"5 m",C.orange,30)+text(397,398,"4 m",C.orange,30);
  body += centered(222,200,"3 m",C.orange,27)+text(277,255,"2 m",C.orange,27)+centered(222,255,"hole",C.orange,23);
  body += centered(310,545,"Find the shaded area.",C.ink,32);
  diagrams["compound-area"] = svg(620,600,"Compound area practice with a rectangular hole","An L-shaped region fits inside a 15 by 10 meter rectangle. A bottom-right cutout is 5 by 4 meters and an interior rectangular hole is 3 by 2 meters. A dashed line shows one possible partition. The shaded area is not provided.",body);
}
function triangleData() {
  let body = centered(205,38,"Base and height",C.ink,28)+centered(570,38,"Right triangle",C.ink,28);
  body += poly([[65,225],[315,225],[160,75]],C.softBlue)+line([160,75],[160,225],C.teal,dash)+right(160,225,15);
  body += centered(190,260,"b",C.blue,29)+text(175,155,"h",C.teal,29);
  body += poly([[455,225],[680,225],[455,90]],C.softTeal)+right(455,225,16);
  body += centered(565,260,"a",C.blue,29)+text(425,163,"b",C.teal,29)+text(580,135,"c",C.orange,29);
  body += centered(205,355,"Three sides",C.ink,28)+centered(570,355,"Equilateral",C.ink,28);
  body += poly([[70,560],[310,560],[154,400]],C.softBlue)+centered(190,599,"c",C.blue,29)+text(72,472,"b",C.teal,29)+text(253,472,"a",C.orange,29);
  const equi=[[465,560],[665,560],[565,560-100*Math.sqrt(3)]];
  body += poly(equi,C.softTeal)+centered(565,599,"s",C.blue,29)+text(485,470,"s",C.blue,29)+text(632,470,"s",C.blue,29);
  body += line([508.5,469.6],[521.5,477.2],C.ink)+line([608.5,477.2],[621.5,469.6],C.ink)+line([565,551],[565,569],C.ink);
  return svg(750,650,"Information for four triangle methods","The first triangle labels a base b and a perpendicular height h. The second labels perpendicular legs a and b and hypotenuse c with a right-angle mark. The third labels three side lengths a, b, c. The fourth has three equal sides s with matching tick marks.",body);
}
diagrams["triangle-data"] = triangleData();
{
  const base=440,h=base*Math.sqrt(3)/2, ps=[[115,535],[555,535],[335,535-h]];
  let body = poly(ps,C.softBlue,'id="equilateral-triangle"')+line(ps[2],[335,535],C.teal,`${dash} id="equilateral-altitude"`)+right(335,535,21);
  body += centered(335,590,"1600 km",C.blue,33)+text(170,400,"1600 km",C.blue,30,'transform="rotate(-60 170 400)"')+text(435,252,"1600 km",C.blue,30,'transform="rotate(60 435 252)"');
  body += centered(225,518,"800",C.muted,28)+centered(445,518,"800",C.muted,28)+text(351,350,"h",C.teal,34);
  body += centered(335,660,"The altitude bisects the base.",C.ink,29);
  diagrams["equilateral-area"] = svg(670,710,"An equilateral triangle with side 1600 kilometers","A geometrically equilateral triangle has three sides of 1600 kilometers. A dashed perpendicular altitude bisects the base into two 800 kilometer segments. The altitude is labeled h, not precomputed.",body);
}
{
  // Base 9, AC=7, BC=8: x=(7²+9²−8²)/(2·9), y=sqrt(7²−x²).
  const x=(7*7+9*9-8*8)/(2*9), h=Math.sqrt(7*7-x*x), k=31;
  const heron=[[120,275],[120+9*k,275],[120+x*k,275-h*k]];
  const rightTriangle=[[190,650],[388,650],[190,386]]; // 9:12:15, at 22 px per unit.
  let body = text(60,35,"1. Three given sides",C.ink,29)+poly(heron,C.softBlue,'id="heron-triangle"');
  body += centered(260,316,"9",C.blue,31)+text(130,170,"7",C.teal,31)+text(335,160,"8",C.orange,31);
  body += text(60,362,"2. A right triangle",C.ink,29)+poly(rightTriangle,C.softTeal,'id="practice-right-triangle"')+right(190,650,19);
  body += centered(290,692,"9",C.blue,31)+text(100,535,"h = ?",C.teal,31)+text(310,505,"15",C.orange,31);
  diagrams["triangle-practice"] = svg(560,740,"Two triangle area practice figures","The first triangle has side lengths 7, 8, and 9 drawn proportionally, with no right-angle mark. The second is a right triangle with base 9, hypotenuse 15, and unknown perpendicular height h. Answers are absent.",body);
}
{
  const A=[100,500],B=[400,500],P=[550,140],H=[550,500];
  let body = poly([A,B,P],C.softBlue,'id="obtuse-triangle"')+line(B,H,C.muted,dash)+line(P,H,C.teal,`${dash} id="external-altitude"`)+right(550,500,20);
  body += centered(250,544,"b = 10",C.blue,32)+text(570,330,"h = 12",C.teal,31);
  body += text(428,295,"13",C.orange,32);
  body += centered(350,628,"The altitude is outside the triangle.",C.ink,29);
  diagrams["triangle-height"] = svg(730,690,"Height and slanted side in an obtuse triangle","An obtuse triangle has base 10 and perpendicular height 12. Its 13-unit slanted side joins the right end of the base to the opposite vertex. The altitude meets the extended base outside the triangle. No area answer is printed.",body);
}
function pair({ numbers=false, practice=false, y=300 }={}) {
  const small=[[75,y],[207,y],[75,y-176]], big=[[649,y],[649,y-198],[385,y]];
  const names = ["A","B","C","D","E","F"];
  let body=poly(small,C.softBlue,'id="similar-small"')+poly(big,C.softTeal,'id="similar-large"');
  [[small[0],small[1],C.blue],[small[0],small[2],C.teal],[small[1],small[2],C.orange],[big[0],big[1],C.blue],[big[0],big[2],C.teal],[big[1],big[2],C.orange]].forEach(([a,b,c])=>body+=line(a,b,c,'stroke-width="5"'));
  body += right(small[0][0],small[0][1],16)+`<path d="M 649 ${y-17} h -17 v 17" fill="none" stroke="${C.teal}" stroke-width="3"/>`;
  const labelPoints=[[50,y+32],[229,y+32],[50,y-185],[674,y+32],[674,y-210],[360,y+32]];
  labelPoints.forEach((p,i)=>body+=centered(p[0],p[1],names[i],C.ink,30));
  // Matching arcs mark B with E and C with F, even after rotation.
  body+=arc(small[1],32,Math.PI,Math.PI+Math.atan2(176,132),C.blue);
  body+=arc(big[1],32,Math.PI/2,Math.atan2(198,-264),C.blue);
  body+=arc(small[2],38,Math.atan2(176,132),Math.PI/2,C.purple)+arc(small[2],45,Math.atan2(176,132),Math.PI/2,C.purple);
  body+=arc(big[2],38,-Math.atan2(198,264),0,C.purple)+arc(big[2],45,-Math.atan2(198,264),0,C.purple);
  if (numbers) {
    body += centered(140,y+69,practice?"14":"6",C.blue,32)+text(669,y-78,practice?"?":"9",C.blue,32);
    if (!practice) body+=text(161,y-104,"10",C.orange,32)+text(500,y-116,"x",C.orange,32);
  }
  return body;
}
{
  let body=pair({y:350})+centered(365,471,"△ABC ∼ △DEF",C.ink,38);
  body+=centered(365,528,"A ↔ D     B ↔ E     C ↔ F",C.ink,29);
  body+=centered(365,590,"AB ↔ DE",C.blue,31)+centered(365,635,"AC ↔ DF",C.teal,31)+centered(365,680,"BC ↔ EF",C.orange,31);
  diagrams["corresponding-triangles"]=svg(730,730,"Corresponding sides in rotated similar triangles","A right triangle ABC and a larger rotated right triangle DEF are similar. A corresponds to D, B to E, C to F. Blue sides AB and DE correspond, teal sides AC and DF correspond, and orange sides BC and EF correspond. Angle marks confirm the mapping.",body);
}
{
  let body=centered(345,45,"Angular subdivisions",C.ink,32);
  body+=line([80,133],[610,133],C.blue)+line([80,115],[80,151],C.blue)+line([610,115],[610,151],C.blue);
  for(let i=1;i<60;i++)body+=line([80+i*530/60,128],[80+i*530/60,138],C.line,'stroke-width="1.5"');
  body+=centered(345,105,"1° = 60′",C.blue,36)+centered(345,202,"1′ = 60″",C.teal,36)+centered(345,260,"1″ = 1/3600°",C.purple,34);
  body+=line([65,303],[625,303],C.line,'stroke-width="2"');
  // A 30° slice of a meridian is schematic; a magnified minute is separate.
  const O=[225,490],r=135,a=-Math.PI/6,b=-Math.PI/3;
  const P=[O[0]+r*Math.cos(a),O[1]+r*Math.sin(a)],Q=[O[0]+r*Math.cos(b),O[1]+r*Math.sin(b)];
  body+=`<circle cx="225" cy="490" r="135" fill="${C.softBlue}" stroke="${C.ink}" stroke-width="4"/>`+line(O,P,C.muted)+line(O,Q,C.muted)+arc(O,r,b,a,C.teal,'stroke-width="6"');
  body+=dot(O,4)+centered(225,526,"Earth",C.ink,28)+line([330,380],[393,369],C.muted,dash);
  body+=text(405,392,"1′ latitude",C.teal,28)+text(405,440,"≈ 1 nmi",C.teal,30)+text(405,495,"1 nmi = 1852 m",C.ink,27);
  body+=centered(345,674,"Meridian arc detail is magnified.",C.muted,26);
  diagrams["dms-navigation"]=svg(690,715,"DMS subdivisions and nautical distance","One degree contains 60 angular minutes, one minute contains 60 angular seconds, and one second is 1/3600 degree. A schematic Earth meridian arc is magnified to illustrate that one minute of latitude is approximately one nautical mile. A nautical mile is exactly 1852 meters.",body);
}
{
  let body=pair({numbers:true,y:335})+centered(365,444,"AB/DE = BC/EF",C.ink,31);
  body+=line([50,482],[680,482],C.line,'stroke-width="2"')+centered(365,536,"45°22′18″",C.ink,38);
  body+=centered(120,604,"45°",C.blue,33)+centered(365,604,"22′",C.teal,33)+centered(600,604,"18″",C.orange,33);
  body+=centered(120,655,"degrees",C.blue,26)+centered(365,655,"÷ 60",C.teal,29)+centered(600,655,"÷ 3600",C.orange,29);
  diagrams["similarity-dms-model"]=svg(730,705,"Given similarity lengths and DMS place values","The similar triangles label AB as 6, DE as 9, BC as 10, and EF as x. The second visual separates 45 degrees, 22 minutes, and 18 seconds and shows divisors 60 for minutes and 3600 for seconds when converting to degrees. The answer for x is not printed.",body);
}
{
  let body=pair({numbers:true,practice:true,y:350})+centered(365,468,"larger length = smaller length × 3/2",C.ink,28);
  body+=line([50,503],[680,503],C.line,'stroke-width="2"')+centered(365,554,"73.625°",C.ink,38);
  body+=centered(175,620,"73 whole degrees",C.blue,28)+centered(540,620,"0.625 of a degree",C.teal,28);
  body+=centered(365,675,"Convert the fractional part to minutes.",C.muted,27);
  diagrams["similarity-practice"]=svg(730,720,"Scale factor and decimal degrees practice","The smaller similar triangle has blue side AB equal to 14 and the rotated larger triangle has corresponding blue side DE labeled question mark. The scale factor is 3/2. The angle 73.625 degrees is separated into 73 whole degrees and 0.625 of a degree. The answers are not displayed.",body);
}
{
  let body=centered(340,60,"A carry after rounding",C.ink,32);
  body+=centered(340,180,"12°59′60″",C.orange,43)+centered(340,250,"60″ = 1′",C.teal,32)+centered(340,326,"12°60′00″",C.orange,43);
  body+=centered(340,402,"60′ = 1°",C.teal,32)+centered(340,480,"13°00′00″",C.blue,43);
  body+=line([70,535],[610,535],C.line,'stroke-width="2"')+centered(340,595,"0 ≤ minutes < 60",C.ink,31)+centered(340,644,"0 ≤ seconds < 60",C.ink,31);
  diagrams["dms-regrouping"]=svg(680,700,"DMS carrying and valid ranges","If rounding produces 12 degrees 59 minutes 60 seconds, carry the 60 seconds into one minute. Then carry 60 minutes into one degree, obtaining 13 degrees 0 minutes 0 seconds. In normalized DMS, minutes and seconds each lie from zero inclusive to 60 exclusive.",body);
}

{
  const para=[[120,260],[450,260],[540,140],[210,140]];
  const trap=[[150,610],[450,610],[375,510],[225,510]];
  let body=text(65,50,"1. Parallelogram",C.ink,31)+poly(para,C.softBlue,'id="area-practice-parallelogram"')+line([210,140],[210,260],C.teal,dash)+right(210,260,16);
  body+=centered(285,302,"b = 11",C.blue,31)+text(226,209,"h = 4",C.teal,30)+text(145,196,"5",C.orange,29);
  body+=text(65,405,"2. Trapezoid",C.ink,31)+poly(trap,C.softTeal,'id="area-practice-trapezoid"')+line([225,510],[225,610],C.teal,dash)+right(225,610,16);
  body+=centered(300,490,"b₁ = 6",C.blue,30)+centered(300,658,"b₂ = 12",C.blue,30)+text(242,570,"h = 4",C.teal,29);
  diagrams["quadrilateral-practice"]=svg(660,710,"Independent parallelogram and trapezoid area problems","The first figure has base 11, perpendicular height 4, and slanted side 5. The second has parallel bases 6 and 12 with perpendicular height 4. All lengths are in meters. Neither area is displayed.",body);
}
{
  const ps=[[100,150],[460,150],[460,300],[340,300],[340,390],[100,390]];
  let body=poly(ps,C.softBlue,'id="compound-model-outline"')+line([100,300],[340,300],C.teal,dash);
  body+=`<rect id="compound-model-hole" x="175" y="195" width="60" height="30" fill="${C.bg}" stroke="${C.orange}" stroke-width="4"/>`;
  body+=centered(280,113,"12 m",C.blue,32)+text(25,280,"8 m",C.blue,30)+centered(400,282,"4 m",C.orange,29)+text(357,354,"3 m",C.orange,29);
  body+=centered(205,179,"2 m",C.orange,27)+text(248,222,"1 m",C.orange,27);
  body+=centered(295,490,"Outer rectangle − cutout − hole",C.ink,28);
  diagrams["compound-area-model"]=svg(600,550,"A numerical compound-area model","The outside bounding rectangle is 12 by 8 meters. A bottom-right cutout is 4 by 3 meters. An interior rectangular hole is 2 by 1 meter. The cutout and hole are separate regions, each subtracted once.",body);
}
{
  const x=19/7, h=12*Math.sqrt(6)/7, k=45;
  const ps=[[120,450],[435,450],[120+x*k,450-h*k]];
  let body=poly(ps,C.softBlue,'id="heron-model-triangle"');
  body+=centered(277,499,"c = 7",C.blue,34)+text(118,352,"a = 5",C.teal,32)+text(366,354,"b = 6",C.orange,32);
  body+=centered(285,115,"Three sides are known.",C.ink,31)+centered(285,170,"No height is given.",C.muted,29);
  diagrams["heron-model"]=svg(590,570,"A Heron model with side lengths five, six, and seven","A non-right triangle has side lengths a equals 5, b equals 6, and c equals 7, drawn with a common scale. No altitude or computed area is shown.",body);
}
{
  const ps=[[160,515],[400,515],[160,65]];
  let body=poly(ps,C.softTeal,'id="right-area-model-triangle"')+right(160,515,23);
  body+=centered(280,569,"base = 8",C.blue,33)+text(47,299,"h = ?",C.teal,33)+text(316,255,"17",C.orange,34);
  body+=centered(275,641,"The right-angle mark identifies the legs.",C.muted,25);
  diagrams["right-area-model"]=svg(550,695,"A right-triangle height and area model","A right triangle has base 8, hypotenuse 17, and unknown perpendicular height h. Its sides are drawn proportionally. No height or area answer is printed.",body);
}
{
  const small=[[70,335],[370,335],[202,111]];
  const large=[[650,335],[650,135],[650-224*2/3,335-132*2/3]];
  let body=poly(small,C.softBlue,'id="shrinking-source"')+poly(large,C.softTeal,'id="shrinking-target"');
  [[small[0],small[1],C.blue],[small[0],small[2],C.teal],[small[1],small[2],C.orange],[large[0],large[1],C.blue],[large[0],large[2],C.teal],[large[1],large[2],C.orange]].forEach(([a,b,c])=>body+=line(a,b,c));
  [[50,369,"A"],[389,369,"B"],[202,89,"C"],[672,370,"D"],[672,126,"E"],[479,247,"F"]].forEach(([x,y,s])=>body+=centered(x,y,s,C.ink,30));
  body+=centered(220,393,"15",C.blue,31)+text(109,207,"13",C.teal,31)+text(310,207,"14",C.orange,31)+text(675,248,"10",C.blue,31);
  body+=text(544,328,"?",C.teal,33)+text(560,186,"?",C.orange,33)+text(104,317,"≈ 59.5°",C.ink,23)+text(283,317,"≈ 53.1°",C.ink,23);
  body+=centered(365,475,"△ABC ∼ △DEF",C.ink,36)+centered(365,529,"Find ∠D, ∠F, DF, and EF.",C.ink,29);
  diagrams["similarity-shrinking-model"]=svg(740,580,"A multipart shrinking similarity model","Triangle ABC has exact sides AB equals 15, AC equals 13, and BC equals 14. Angle A is approximately 59.5 degrees and angle B approximately 53.1 degrees, rounded to a tenth. The rotated similar triangle DEF has DE equals 10, while DF and EF are unknown. The target is a uniform two-thirds scale of the source.",body);
}
{
  let body=centered(330,76,"135.721°",C.ink,43)+line([45,126],[615,126],C.line,'stroke-width="2"');
  body+=centered(170,197,"135 whole degrees",C.blue,29)+centered(499,197,"0.721° remainder",C.teal,29);
  body+=centered(330,286,"Fractional degrees × 60",C.teal,34)+centered(330,336,"Keep the whole minutes.",C.ink,28);
  body+=centered(330,436,"Fractional minutes × 60",C.orange,34)+centered(330,486,"The result is seconds.",C.ink,28);
  body+=centered(330,588,"Only the remainder passes to the next unit.",C.muted,26);
  diagrams["decimal-dms-model"]=svg(660,635,"Decimal degrees to DMS using successive remainders","The angle 135.721 degrees separates into 135 whole degrees and a 0.721 degree remainder. Multiply fractional degrees by 60 for minutes, retain the whole minutes, and multiply only the fractional minutes by 60 for seconds. Computed minutes and seconds are not printed.",body);
}
{
  let body=text(54,32,"1. Base and height",C.ink,28);
  body+=poly([[125,195],[433,195],[213,85]],C.softBlue,'id="mixed-base-height"')+line([213,85],[213,195],C.teal,dash)+right(213,195,15);
  body+=centered(279,231,"14",C.blue,30)+text(227,147,"5",C.teal,30);
  body+=text(54,278,"2. Equal sides",C.ink,28);
  body+=poly([[190,485],[406,485],[298,485-108*Math.sqrt(3)]],C.softTeal,'id="mixed-equilateral"');
  body+=text(196,394,"6",C.blue,29)+text(385,394,"6",C.blue,29)+centered(298,522,"6",C.blue,29);
  body+=text(54,575,"3. Three sides",C.ink,28)+poly([[190,760],[406,760],[298,616]],C.softBlue,'id="mixed-isosceles"');
  body+=text(196,694,"5",C.teal,29)+text(385,694,"5",C.orange,29)+centered(298,801,"6",C.blue,29);
  diagrams["mixed-triangle-practice"]=svg(590,840,"Three triangles for independent formula selection","Triangle 1 has base 14 and perpendicular height 5. Triangle 2 has all three sides equal to 6. Triangle 3 has sides 5, 5, and 6, and no height is given. Figures have uniform scales within each triangle and no computed areas.",body);
}
{
  const small=[[70,300],[262,300],[70,220]],large=[[590,390],[590,54],[450,390]];
  let body=poly(small,C.softBlue,'id="quiz-similarity-source"')+poly(large,C.softTeal,'id="quiz-similarity-target"');
  [[small[0],small[1],C.blue],[small[0],small[2],C.teal],[small[1],small[2],C.orange],[large[0],large[1],C.blue],[large[0],large[2],C.teal],[large[1],large[2],C.orange]].forEach(([a,b,c])=>body+=line(a,b,c));
  body+=right(70,300,14)+`<path d="M 590 374 h -16 v 16" fill="none" stroke="${C.teal}" stroke-width="3"/>`;
  [[48,331,"A"],[281,331,"B"],[48,214,"C"],[611,421,"D"],[611,48,"E"],[427,422,"F"]].forEach(([x,y,s])=>body+=centered(x,y,s,C.ink,28));
  body+=centered(166,344,"12",C.blue,31)+text(33,275,"5",C.teal,30)+text(164,247,"13",C.orange,30)+text(611,231,"21",C.blue,32);
  body+=text(160,283,"≈ 22.6°",C.ink,24)+text(477,215,"?",C.orange,34)+centered(520,430,"?",C.teal,34);
  body+=centered(350,489,"△ABC ∼ △DEF",C.ink,34);
  diagrams["quiz-similarity-practice"]=svg(700,540,"An independent multipart similarity problem","A right triangle ABC has AB equals 12, AC equals 5, BC equals 13, and angle B approximately 22.6 degrees. A rotated similar triangle DEF has DE equals 21. Students must find corresponding angles E and F and sides DF and EF. No requested values are displayed.",body);
}

function build() {
  fs.mkdirSync(out, {recursive:true});
  for(const [name,xml] of Object.entries(diagrams)) fs.writeFileSync(path.join(out,`${name}.svg`),xml,"utf8");
  console.log(`Built ${Object.keys(diagrams).length} Unit 2C mathematical diagrams.`);
}
if(require.main===module) build();
module.exports={diagrams,build};
