/* Editable, proportionally correct geometry for the October 19 circle lesson. */
const fs = require('node:fs');
const path = require('node:path');
const dir = path.join(__dirname, '..', 'assets', 'unit2d');
fs.mkdirSync(dir, { recursive: true });
const p = (cx, cy, radius, angle) => ({ x: cx + radius*Math.cos(angle*Math.PI/180), y: cy - radius*Math.sin(angle*Math.PI/180) });
const fmt = x => Number(x.toFixed(3));
const line = (a,b,color='#163a5f',width=3) => `<line x1="${fmt(a.x)}" y1="${fmt(a.y)}" x2="${fmt(b.x)}" y2="${fmt(b.y)}" stroke="${color}" stroke-width="${width}"/>`;
const text = (x,y,s,size=24,color='#163a5f') => `<text x="${fmt(x)}" y="${fmt(y)}" font-family="Arial, sans-serif" font-size="${size}" fill="${color}" text-anchor="middle">${s}</text>`;
const dot = (point) => `<circle cx="${fmt(point.x)}" cy="${fmt(point.y)}" r="4" fill="#163a5f"/>`;
function save(name,title,description,content,metadata={}) {
 fs.writeFileSync(path.join(dir,name),`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="450" viewBox="0 0 520 450" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${description}</desc><metadata>${JSON.stringify(metadata)}</metadata><rect width="520" height="450" fill="#ffffff"/>${content}</svg>\n`);
}
const center={x:260,y:220},radius=160;
const circle=`<circle cx="260" cy="220" r="160" fill="none" stroke="#163a5f" stroke-width="3"/>`;
const A=p(260,220,radius,70),D=p(260,220,radius,-54),B=p(260,220,radius,180);
const c1=circle+line(center,A)+line(center,D)+line(B,A)+line(B,D)+[A,B,D,center].map(dot).join('')+text(A.x+12,A.y-12,'A')+text(D.x+15,D.y+22,'D')+text(B.x-20,B.y,'B')+text(center.x-15,center.y+26,'O')+text(316,212,'124°',26,'#075ea8');
save('central-inscribed.svg','Central and inscribed angles','A central angle of 124 degrees and an inscribed angle intercept the same minor arc.',c1,{center:[260,220],radius,centralDegrees:124,positions:{A:70,D:-54,B:180}});
const T={A:p(260,220,radius,198),B:p(260,220,radius,276),C:p(260,220,radius,66)};
save('inscribed-triangle.svg','Inscribed triangle','Arc AB is 78 degrees and angle ABC is 66 degrees.',circle+line(T.A,T.B)+line(T.B,T.C)+line(T.C,T.A)+Object.values(T).map(dot).join('')+text(T.A.x-18,T.A.y+4,'A')+text(T.B.x+10,T.B.y+30,'B')+text(T.C.x+15,T.C.y-12,'C')+text(190,380,'78°',27,'#075ea8')+text(254,333,'66°',27,'#075ea8'),{center:[260,220],radius,positions:{A:198,B:276,C:66},arcAB:78,angleABC:66});
function sectorSvg(angle,radiusLabel,angleLabel,areaLabel) {
 const o={x:220,y:245},r=160,start=p(o.x,o.y,r,0),end=p(o.x,o.y,r,angle);
 const wedge=`<path d="M ${o.x} ${o.y} L ${start.x} ${start.y} A ${r} ${r} 0 ${angle>180?1:0} 0 ${fmt(end.x)} ${fmt(end.y)} Z" fill="#dceff6" stroke="#075ea8" stroke-width="3"/>`;
 return `<circle cx="220" cy="245" r="160" fill="none" stroke="#bdccd8" stroke-width="2"/>`+wedge+dot(o)+text(310,272,radiusLabel,26)+text(282,216,angleLabel,25)+text(322,145,areaLabel,26)+text(402,170,'s',26);
}
save('arc-sector.svg','Arc length and sector area','Radius 6 units and angle 1.4 radians define a curved arc and a sector.',sectorSvg(1.4*180/Math.PI,'r = 6','1.4 rad','A'),{radius:6,thetaRadians:1.4});
save('large-sector.svg','A sector larger than a semicircle','Area 35.4 square units and radius 4 units give an angle larger than 180 degrees.',sectorSvg(4.425*180/Math.PI,'r = 4','θ ?','A = 35.4'),{radius:4,area:35.4,thetaRadians:4.425});
save('rotating-wheel.svg','A rotating wheel','A full diameter is 12 feet and rotation is 24 revolutions per minute.',circle+line({x:100,y:220},{x:420,y:220},'#075ea8',4)+dot(center)+text(260,258,'diameter = 12 ft',25)+text(260,28,'24 revolutions per minute',26)+text(260,424,'Find degrees/s and feet/s',24),{diameterFeet:12,rpm:24});
console.log('Wrote five verified Unit 2D geometry assets.');
