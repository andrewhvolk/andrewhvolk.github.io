'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const skills=require('../assets/js/math130-test3-skills.js');
const html=fs.readFileSync(require('node:path').join(__dirname,'../130quiz10.html'),'utf8');
const source=html.slice(html.indexOf('  let answered ='),html.indexOf('</script>',html.indexOf('  let answered =')));
const inputs=new Map();
function element(id){if(!inputs.has(id))inputs.set(id,{value:'',disabled:false,style:{},classList:{add(){},remove(){}}});return inputs.get(id);}
const context={Math130Test3Skills:skills,document:{getElementById:element,querySelector:()=>({value:'A'}),querySelectorAll:()=>[]},alert:message=>{throw Error(message)}};
vm.createContext(context);vm.runInContext(source,context);
const run=code=>vm.runInContext(code,context);
const fill=values=>Object.entries(values).forEach(([id,value])=>element(id).value=value);
fill({q8a:'240.0',q8b:'300.0'});run("checkDoubleAngle('q8','240','300','','')");assert.equal(run("correct.has('q8')"),true);
fill({q8a:'240',q8b:'240'});run("checkDoubleAngle('q8','240','300','','')");assert.equal(run("correct.has('q8')"),false);
fill({q8a:'300 degrees',q8b:'480/2'});run("checkDoubleAngle('q8','240','300','','')");assert.equal(run("correct.has('q8')"),true);assert.equal(element('q8a').disabled,false);
fill({q9r:'sqrt(25)',q9s:'6/10',q9c:'-0.8',q9t:'−0.75',q9csc:'1.6667',q9sec:'-1.25',q9cot:'-1.3333'});
run('checkSixTrig()');assert.equal(run("correct.has('q9')"),true);
fill({q9sec:'1.25'});run('checkSixTrig()');assert.equal(run("correct.has('q9')"),false);
fill({q9sec:'-5/4'});run('checkSixTrig()');assert.equal(run("correct.has('q9')"),true);
fill({q10b:'20.0',q10beta:'44.6',q10alpha:'46.4'});run('checkSolveTriangle()');assert.equal(run("correct.has('q10')"),false);
fill({q10beta:'43.6junk'});run('checkSolveTriangle()');assert.equal(run("correct.has('q10')"),false);
fill({q10beta:'43.6'});run('checkSolveTriangle()');assert.equal(run("correct.has('q10')"),true);
assert.equal(run('answered.size'),3,'Retries do not count as extra questions');
const bearing={inputType:'bearing',a:{ns:'S',ew:'E',angle:63.434948822922},tol:.05};
for(const value of ['S 63.4 E','E 26.6 S','116.6°'])assert.ok(skills.grade(bearing,[value]).correct,value);
for(const value of ['N 63.4 W','296.6','S 91 E','junk'])assert.ok(!skills.grade(bearing,[value]).correct,value);
// New signed-point problems must include radical radii and every quadrant.
const point=skills.generators.find(g=>g.id==='trig_values_from_point'),quadrants=new Set();let radical=false;
for(let i=0;i<400;i++){
 const p=point.generate(skills.mulberry32(i)),{x,y}=p.parameters;
 quadrants.add((x>0?'+':'-')+(y>0?'+':'-'));radical ||= !Number.isInteger(Math.hypot(x,y));
 const entries=p.fields.map(f=>String(f.answer));assert.ok(skills.grade(p,entries).correct);
 entries[4]='999';assert.deepEqual(skills.grade(p,entries).parts,[true,true,true,true,false,true,true]);
}
assert.equal(quadrants.size,4);assert.ok(radical);
console.log('PASS: equivalent answers, all six ratios, retries, strict angle rounding, score updates, and return-bearing equivalents.');
