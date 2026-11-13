/* Editable mathematical figures for Section 5.3. SVG y is inverted exactly once
 * in pt(); equal x/y scales keep every angle and unit circle geometrically true.
 * Run: node slides/tools/build_unit3b_visuals.cjs
 */
'use strict';
require('./build_unit3b_nov9_visuals.cjs');
const fs=require('node:fs'),path=require('node:path');
const out=path.resolve(__dirname,'../assets/math130unit3b/visuals');
fs.mkdirSync(out,{recursive:true});
const C={ink:'#163a5f',muted:'#526579',line:'#cbd5e1',blue:'#075ea8',teal:'#087f8c',orange:'#c45a0a',red:'#b42318'};
const f=n=>Number(n.toFixed(4)), rad=d=>d*Math.PI/180;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const pt=(c,r,a)=>[c[0]+r*Math.cos(rad(a)),c[1]-r*Math.sin(rad(a))];
const line=(a,b,color=C.ink,width=3,extra='')=>`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const text=(x,y,s,color=C.ink,size=24,extra='')=>`<text x="${f(x)}" y="${f(y)}" fill="${color}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const dot=(p,color=C.teal)=>`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="6" fill="${color}"/>`;
function arc(c,r,a,b,color=C.orange,id='',spiral=false){
 const n=Math.max(12,Math.ceil(Math.abs(b-a)/3));
 const points=Array.from({length:n+1},(_,i)=>pt(c,r+(spiral?18*i/n:0),a+(b-a)*i/n));
 return `<polyline ${id?`id="${id}"`:''} data-start="${a}" data-end="${b}" points="${points.map(p=>p.map(f).join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round" marker-end="url(#arrow-${color===C.blue?'blue':'orange'})"/>`;
}
function axes(c,R){
 return line([c[0]-R,c[1]],[c[0]+R,c[1]],C.line,2)+line([c[0],c[1]-R],[c[0],c[1]+R],C.line,2)
 +text(c[0]+R-10,c[1]-12,'x',C.muted,22)+text(c[0]+12,c[1]-R+12,'y',C.muted,22)
 +line(c,[c[0]+R*.92,c[1]],C.blue,4);
}
function angle(c,R,degrees,{reference=true,circle=false,label='θ',id='angle',showRefValue=false}={}){
 const t=((degrees%360)+360)%360,axis=t%90===0;
 const anchor=t<90?0:t<270?180:360;
 const alpha=Math.abs(t-anchor);
 const endpoint=pt(c,R*.86,t);
 let body=axes(c,R);
 if(circle)body+=`<circle cx="${c[0]}" cy="${c[1]}" r="${R*.86}" fill="none" stroke="${C.line}" stroke-width="2"/>`;
 body+=line(c,endpoint,C.teal,5,`id="${id}-ray" data-degrees="${degrees}"`)+dot(endpoint);
 body+=arc(c,R*.36,0,degrees,C.blue,`${id}-rotation`,Math.abs(degrees)>360);
 if(reference&&!axis){
  body+=arc(c,R*.64,anchor,t,C.orange,`${id}-reference`);
  const p=pt(c,R*.83,(anchor+t)/2);
  body+=text(p[0],p[1]+6,showRefValue?`${alpha}°`:'α',C.orange,24,'text-anchor="middle"');
 }
 body+=text(c[0]-R,c[1]-R-18,label,C.ink,26,'font-weight="700"');
 return body;
}
function svg(name,w,h,title,description,body){
 const defs=['blue','orange'].map(k=>`<marker id="arrow-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="${C[k]}"/></marker>`).join('');
 const content=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(description)}</desc><defs>${defs}</defs><g font-family="Arial,Helvetica,sans-serif" stroke-linecap="round">${body}</g></svg>\n`;
 fs.writeFileSync(path.join(out,name+'.svg'),content);
 return {src:`assets/math130unit3b/visuals/${name}.svg`,alt:description,caption:''};
}
const assets={};
assets.reference=svg('reference-150',580,500,'The reference angle for 150 degrees',
 'Equal-scale axes show a 150 degree counterclockwise angle in Quadrant II. The orange acute reference angle is measured from the negative x-axis to the terminal side, not from the y-axis.',
 angle([290,270],190,150,{label:'θ = 150°',id:'q2'})+text(38,476,'Blue: θ from +x     Orange: α to x-axis',C.muted,22));
let four='';
for(const [i,d]of[40,140,220,320].entries())four+=angle([155+(i%2)*290,155+Math.floor(i/2)*270],104,d,{label:['QI','QII','QIII','QIV'][i],id:'q'+(i+1)});
assets.quadrants=svg('four-reference-angles',600,570,'One acute reference angle in four quadrants',
 'Four coordinate planes use equal scales and terminal angles 40, 140, 220, and 320 degrees. Each orange arc meets the x-axis and measures 40 degrees. Blue arcs measure the original angle counterclockwise from positive x.',four);
assets.coterminal=svg('practice-580',580,500,'An angle greater than one rotation',
 'A blue directed spiral turns counterclockwise 580 degrees and a teal terminal ray lies in Quadrant III. Equal-scale axes are shown. The requested reference angle is not labeled.',
 angle([290,270],190,580,{reference:false,label:'θ = 580°',id:'turn'})+text(42,478,'One full turn does not change the terminal side.',C.muted,21));
let examples='';
for(const[i,d]of[150,230,285,420].entries())examples+=angle([160+(i%2)*310,155+Math.floor(i/2)*270],108,d,{label:`θ = ${d}°`,id:'example'+i});
assets.examples=svg('reference-examples',640,570,'Four degree-measure examples',
 'Four equal-scale coordinate planes show terminal sides for 150, 230, 285, and 420 degrees. Orange arcs mark the acute angle to the x-axis without giving its value. The 420 degree rotation includes a full turn.',examples);
let mainExamples='';
for(const[i,d]of[150,310,-120,315].entries())mainExamples+=angle([160+(i%2)*310,155+Math.floor(i/2)*270],108,d,{label:['θ = 150°','θ = 310°','θ = −120°','θ = 7π/4'][i],id:'unit-example'+i});
assets.mainExamples=svg('unit-reference-examples',640,570,'The four worked unit-lecture angles',
 'Equal-scale axes show 150 degrees in Quadrant II, 310 degrees in Quadrant IV, negative 120 degrees ending in Quadrant III, and seven pi over four ending in Quadrant IV. The reference arcs meet the x-axis and no reference values are printed.',mainExamples);
assets.radians=svg('radian-practice',610,360,'Two radian-measure practice angles',
 'Equal-scale axes show a clockwise rotation of negative five pi over six ending in Quadrant III and a counterclockwise rotation of seven pi over four ending in Quadrant IV. Orange reference arcs have no numeric labels.',
 angle([155,190],115,-150,{label:'θ = −5π/6',id:'negative-rad'})+angle([460,190],115,315,{label:'θ = 7π/4',id:'positive-rad'}));
let exact='';
for(const[i,d]of[150,225,-150].entries())exact+=angle([155+(i%2)*310,155+Math.floor(i/2)*270],108,d,{circle:true,label:['sin 150°','sin 225°','cos(−5π/6)'][i],id:'exact'+i});
exact+=text(345,412,'sin θ = y / r',C.teal,26)+text(345,453,'cos θ = x / r',C.blue,26)+text(345,500,'Use the coordinate sign.',C.muted,22);
assets.exact=svg('exact-values',640,570,'Signs and exact values',
 'Three equal-scale coordinate planes place 150 degrees in Quadrant II, 225 degrees in Quadrant III, and negative five pi over six in Quadrant III. Unit circles and unsigned reference arcs support exact-value reasoning without displaying answers.',exact);
let signbody=axes([290,260],195)+`<circle cx="290" cy="260" r="155" fill="none" stroke="${C.line}" stroke-width="2"/>`;
for(const[x,y,lab]of[[375,156,'x +, y +'],[120,156,'x −, y +'],[120,367,'x −, y −'],[375,367,'x +, y −']])signbody+=text(x,y,lab,C.ink,25);
signbody+=text(60,480,'r is a positive distance in every quadrant.',C.muted,23);
assets.signs=svg('coordinate-signs',580,510,'Coordinate signs determine function signs',
 'A unit circle on equal-scale axes shows positive x and y in Quadrant I, negative x and positive y in II, negative x and y in III, and positive x and negative y in IV. Radius r is positive everywhere.',signbody);
function pointFigure(name,x,y){
 const c=[285,245],scale=32,R=195,p=[c[0]+x*scale,c[1]-y*scale],foot=[p[0],c[1]],t=(Math.atan2(y,x)*180/Math.PI+360)%360;
 let body=axes(c,R)+`<polygon id="triangle" data-x="${x}" data-y="${y}" data-scale="${scale}" points="${c.join(',')} ${foot.join(',')} ${p.join(',')}" fill="#e4f4f5"/>`;
 body+=line(c,p,C.teal,5,'id="terminal"')+line(foot,p,C.orange,3,'stroke-dasharray="7 6"')+line(c,foot,C.blue,4);
 body+=dot(p)+text(p[0]+(x<0?-18:18),p[1]+(y>0?-15:30),`P = (${x}, ${y})`,C.teal,25,x<0?'text-anchor="end"':'');
 body+=text((c[0]+foot[0])/2,c[1]+(y>0?34:-18),`x = ${x}`,C.blue,25,'text-anchor="middle"');
 body+=text(foot[0]+(x>0?18:-18),(foot[1]+p[1])/2+6,`y = ${y}`,C.orange,25,x<0?'text-anchor="end"':'');
 body+=text((c[0]+p[0])/2+(x<0?25:-25),(c[1]+p[1])/2+(y>0?-15:25),'r',C.teal,28);
 body+=arc(c,58,0,t,C.blue,'theta');
 const pa=pt(c,80,t/2);body+=text(pa[0],pa[1],'θ',C.blue,25);
 return svg(name,620,510,'A terminal point and signed coordinates',
 `An equal-scale coordinate diagram plots P=(${x},${y}). The horizontal directed coordinate is ${x}, the vertical directed coordinate is ${y}, and the radial length is labeled r without revealing its value. The blue angle is measured counterclockwise from positive x.`,body);
}
assets.pointModel=pointFigure('point-negative3-positive4',-3,4);
assets.pointPractice=pointFigure('point-negative2-negative5',-2,-5);
assets.pointToday=pointFigure('point-positive4-negative3',4,-3);
let axesbody='';
for(const[i,d]of[90,180].entries()){
 const c=[155+i*310,195],R=110,p=pt(c,88,d);
 axesbody+=axes(c,R)+`<circle cx="${c[0]}" cy="${c[1]}" r="88" fill="none" stroke="${C.line}" stroke-width="2"/>`+line(c,p,C.teal,5)+dot(p);
 axesbody+=text(c[0]-105,42,`θ = ${d}°`,C.ink,26,'font-weight="700"')+text(c[0]-100,348,d===90?'(x, y) = (0, 1)':'(x, y) = (−1, 0)',C.ink,24);
}
assets.axes=svg('axis-values',620,385,'Zero denominators on the axes',
 'Two equal-scale unit circles show the point (0,1) at 90 degrees and the point (-1,0) at 180 degrees. At 90 degrees x is zero; at 180 degrees y is zero. No acute reference angle is drawn.',axesbody);
const center=[300,235],R=167,v=-.848,x0=Math.sqrt(1-v*v),a=[center[0]-R*x0,center[1]-R*v],b=[center[0]+R*x0,center[1]-R*v];
let sine=axes(center,205)+`<circle id="unit-circle" cx="300" cy="235" r="167" fill="none" stroke="${C.line}" stroke-width="2"/>`;
sine+=line([65,a[1]],[555,a[1]],C.red,3,'id="sine-line" data-value="-0.848" stroke-dasharray="7 6"');
sine+=line(center,a,C.teal,5,'id="root-left"')+line(center,b,C.teal,5,'id="root-right"')+dot(a)+dot(b);
sine+=arc(center,78,0,-Math.acos(x0)*180/Math.PI,C.blue,'principal');
sine+=text(45,a[1]-18,'y = −0.848',C.red,24)+text(76,445,'QIII solution',C.teal,24)+text(382,445,'QIV solution',C.teal,24);
sine+=text(58,505,'One horizontal line. Two terminal points.',C.ink,24);
assets.sine=svg('sine-two-solutions',620,540,'Two unit-circle intersections for a negative sine value',
 'A unit circle on equal-scale axes intersects the horizontal line y=-0.848 twice, in Quadrants III and IV. Teal rays reach both intersections. A blue clockwise arc marks the negative principal inverse-sine output at the Quadrant IV ray. No final solution angles are printed.',sine);
const A=[95,370],B=[95+21*12*Math.cos(rad(76)),370-21*12*Math.sin(rad(76))],D=[95+34*12,370];
let tri=`<polygon id="area-triangle" data-side-b="34" data-side-c="21" data-angle="76" points="${[A,B,D].map(p=>p.map(f).join(',')).join(' ')}" fill="#e4f4f5" stroke="${C.teal}" stroke-width="4"/>`;
tri+=line(B,[B[0],370],C.muted,2,'stroke-dasharray="7 6"')+arc(A,55,0,76,C.orange,'included');
tri+=text(65,405,'A',C.ink,25)+text(B[0]-14,B[1]-15,'B',C.ink,25)+text(D[0]+12,D[1]+12,'C',C.ink,25);
tri+=text(265,410,'b = 34',C.ink,26)+text(34,240,'c = 21',C.ink,26)+text(165,328,'76°',C.orange,25)+text(B[0]+14,270,'h',C.muted,25);
assets.area=svg('triangle-area-76',620,450,'Two sides and their included angle',
 'A triangle drawn to scale has AC=b=34, AB=c=21, and included angle A=76 degrees. The perpendicular height from B meets AC. The area is not displayed.',tri);
let wrong=angle([290,270],190,150,{reference:false,label:'Which axis defines α?',id:'diagnose'});
wrong+=arc([290,270],125,90,150,C.orange,'wrong-axis')+text(150,115,'60°?',C.orange,28)+text(45,475,'Explain the error before checking the rule.',C.muted,23);
assets.diagnose=svg('wrong-axis',580,500,'A reference-angle misconception',
 'Equal-scale axes show a 150 degree terminal side in Quadrant II. An orange 60 degree arc runs from the positive y-axis to the terminal side and is labeled with a question mark. Students must explain why measuring from the y-axis does not give the reference angle.',wrong);
fs.writeFileSync(path.join(out,'index.json'),JSON.stringify(assets,null,2)+'\n');
console.log(`Built ${Object.keys(assets).length} editable Section 5.3 figures.`);
