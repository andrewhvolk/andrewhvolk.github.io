#!/usr/bin/env node
'use strict';
// node tests/verify-math130-test3.cjs [--baseline]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const skills = require('../assets/js/math130-test3-skills.js');
// Optional full TeX rendering audit: --katex <path-to-official-katex.cjs>.
const katexArg = process.argv.indexOf('--katex');
const katex = katexArg < 0 ? null : require(path.resolve(process.argv[katexArg + 1]));
const renderedMath = new Set();
const baseline = process.argv.includes('--baseline');
const html = baseline ? cp.execFileSync('git', ['show', 'ac64a8c:130Test3.html'], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, '130Test3.html'), 'utf8');
const gcd = (a,b) => b ? gcd(b,a%b) : Math.abs(a);
const targets = {solve_trig_equation_special:36,quadrant_signs:24,trig_from_given_ratio:50,reference_angle_rad:60,angle_coterminal_rad:80,vector_from_mag_dir:100,trig_calculator_values:100,angle_coterminal:150,arc_length:150};
const seed = 1302026;
function legacyGenerators() {
    const context = {Math:Object.assign(Object.create(Math),{random:skills.mulberry32(seed)}),console};
    vm.createContext(context);
    vm.runInContext(html.slice(html.indexOf('    function normalizeDegrees'),html.indexOf('    let currentQuiz'))+';this.generators=generators;', context);
    return context.generators;
}
function defects(q) {
    const text=q.q+q.solution;
    return {
        unreduced:[...text.matchAll(/\\frac\{(-?\d*)\\pi\}\{(\d+)\}/g)].some(m=>gcd(Number(m[1]||1),Number(m[2]))>1),
        signs:/[+\-−]\s*[\-−]/.test(q.solution),
        zero:/(?:-|−)0(?![.\d])|(?:-|−)0\.0+(?!\d)/.test(text),
    };
}
if (baseline) {
    let found=0;
    for (const g of legacyGenerators()) {
        const counts={unreduced:0,signs:0,zero:0},prompts=new Set();
        for(let i=0;i<3000;i++){const q=g.generate();prompts.add(q.q);for(const [k,v] of Object.entries(defects(q)))counts[k]+=Number(v);}
        if(Object.values(counts).some(Boolean)||prompts.size<(targets[g.id]||(g.id==='trig_ratio_variables'?6:50))){found++;console.log(g.id,JSON.stringify({...counts,distinct:prompts.size}));}
    }
    assert.ok(found>=10,'Baseline must expose the original defects.');
    console.log('Baseline defects reproduced at ac64a8c, seed '+seed);process.exit(0);
}

// Independent numeric interpretation of the displayed TeX, with no shared parser.
function value(tex) {
    let s=tex.replace(/\^\\circ/g,'').replace(/\\(?:left|right)/g,'').replace(/\\pi/g,String(Math.PI));
    while(/\\sqrt\{([^{}]+)\}/.test(s))s=s.replace(/\\sqrt\{([^{}]+)\}/g,(_,x)=>String(Math.sqrt(value(x))));
    while(/\\frac\{([^{}]+)\}\{([^{}]+)\}/.test(s))s=s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,(_,n,d)=>String(value(n)/value(d)));
    s=s.replace(/(\d)(?=3\.141592653589793)/g,'$1*');
    // pi coefficients must be multiplied before replacing pi above.
    assert.match(s,/^[\d.\s()+*/-]+$/,'Unrecognized answer expression: '+tex);
    return Function('return ('+s+')')();
}
// Insert explicit multiplication before substituting the pi constant.
const texNumber = tex => value(tex.replace(/(\d)\\pi/g,'$1*\\pi'));
const deg = x => x*Math.PI/180;
const angle = (x,y) => (Math.atan2(y,x)*180/Math.PI+360)%360;
const close = (a,b,label) => assert.ok(Math.abs(a-b)<1e-8,`${label}: expected ${b}, got ${a}`);
const num = (q,re,index=1) => {const m=q.match(re);assert.ok(m,'Cannot read '+re+' in '+q);return Number(m[index]);};
const functions={sin:Math.sin,cos:Math.cos,tan:Math.tan,csc:a=>1/Math.sin(a),sec:a=>1/Math.cos(a),cot:a=>1/Math.tan(a)};
const sign = (fn,q) => /^(sin|csc)$/.test(fn)?(q<3?1:-1):/^(cos|sec)$/.test(fn)?([1,4].includes(q)?1:-1):([1,3].includes(q)?1:-1);
function recompute(g,p) {
    const q=p.q, maths=[...q.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);let answer;
    switch(g.id){
    case 'angle_coterminal': close(p.baseTheta,texNumber(maths[0]),g.id);return;
    case 'angle_coterminal_rad': close(p.baseThetaRad,texNumber(maths[0]),g.id);return;
    case 'arc_length': {
        const radius=texNumber(maths[0]),given=texNumber(maths[1]);
        answer=q.includes('arc length $')?(q.includes('in degrees')?given/radius*180/Math.PI:given/radius):radius*(maths[1].includes('circ')?deg(given):given);break;
    }
    case 'trig_ratio': {const o=num(q,/opposite side \$=(\d+)/),a=num(q,/adjacent side \$=(\d+)/);answer=q.includes('$sin')?o/Math.hypot(o,a):q.includes('$cos')?a/Math.hypot(o,a):o/a;break;}
    case 'trig_calculator_values': {const m=q.match(/\\(sin|cos|tan|csc|sec|cot)\(([^)]+)\)/);answer=functions[m[1]](m[2].includes('circ')?deg(texNumber(m[2])):texNumber(m[2]));break;}
    case 'angle_unit_conversion': answer=texNumber(maths[0])*(q.includes('to radians')?Math.PI/180:180/Math.PI);break;
    case 'right_triangle_word_problem': {
        const d=num(q,/horizontal distance is (\d+) m/);
        answer=q.includes('Find the acute angle')?Math.atan2(num(q,/vertical height is (\d+) m/),d)*180/Math.PI:d*Math.tan(deg(texNumber(maths[0])));break;
    }
    case 'solve_right_triangle_side': {
        const t=deg(texNumber(maths[0])),known=texNumber(maths[1]);
        const given=q.match(/and (hypotenuse|adjacent side|opposite side)/)[1],target=q.match(/Find the (opposite side|adjacent side|hypotenuse)/)[1];
        const hyp=given==='hypotenuse'?known:given==='opposite side'?known/Math.sin(t):known/Math.cos(t);
        answer=target==='hypotenuse'?hyp:target==='opposite side'?hyp*Math.sin(t):hyp*Math.cos(t);break;
    }
    case 'reference_angle_rad': case 'reference_angle_deg': {
        const radians=g.id.endsWith('rad'),period=radians?2*Math.PI:360;
        const t=((texNumber(maths[0])%period)+period)%period,folded=Math.min(t,period-t);answer=Math.min(folded,period/2-folded);break;
    }
    case 'quadrant_signs': {
        const conditions=[...q.matchAll(/\\(sin|cos|tan|csc|sec|cot)\\theta([<>])0/g)];
        const qs=[1,2,3,4].filter(q=>conditions.every(m=>sign(m[1],q)===(m[2]==='>'?1:-1)));
        assert.deepEqual(qs,[p.a]);return;
    }
    case 'trig_values_from_info': {
        const quadrant=num(q,/Quadrant (\d)/),target=maths.at(-1).match(/\\(sin|cos|tan)/)[1];let ref;
        const known=q.match(/\\(sin|cos|tan)\\theta=([^$]+)/);
        if(known){const v=Math.abs(texNumber(known[2]));ref=({sin:Math.asin,cos:Math.acos,tan:Math.atan})[known[1]](v);}
        else ref=deg(texNumber(maths[1]));
        answer=sign(target,quadrant)*functions[target](ref);break;
    }
    case 'solve_right_triangle': {
        const b=num(q,/Given \$b=(\d+)/),knownAngle=q.match(/\$A=(\d+)/),a=knownAngle?b*Math.tan(deg(Number(knownAngle[1]))):num(q,/\$a=(\d+)/);
        const A=Math.atan2(a,b)*180/Math.PI,expected={a,c:Math.hypot(a,b),A,B:90-A};
        assert.equal(p.fields.length,3);for(const f of p.fields)close(f.answer,expected[f.id],g.id+f.id);return;
    }
    case 'angle_of_elevation': {
        const h=q.match(/vertical height above eye level is (\d+)/),d=q.match(/horizontal distance is (\d+)/),t=q.match(/angle of (?:elevation|depression) is \$(\d+)/);
        answer=t?(q.includes('Find the vertical')?Number(d[1])*Math.tan(deg(Number(t[1]))):Number(h[1])/Math.tan(deg(Number(t[1])))):Math.atan2(Number(h[1]),Number(d[1]))*180/Math.PI;break;
    }
    case 'two_right_triangles': {
        const gap=num(q,/\$ (\d+) m/),angles=maths.filter(m=>m.includes('circ')).map(texNumber);answer=gap*Math.tan(deg(angles[1]))/(Math.tan(deg(angles[0]))-Math.tan(deg(angles[1])));break;
    }
    case 'distance_rate_time': answer=num(q,/travels (\d+) miles/)*num(q,/for (\d+) hours/)*Math.sin(deg(texNumber(maths[0])));break;
    case 'vector_components': {const m=q.match(/P\((-?\d+),(-?\d+)\)\$ and \$Q\((-?\d+),(-?\d+)\)/);answer={x:Number(m[3])-Number(m[1]),y:Number(m[4])-Number(m[2])};break;}
    case 'vector_operations': case 'graph_vector_addition': {
        const coords=[...q.matchAll(/\\langle\s*(-?\d+),\s*(-?\d+)\\rangle/g)].map(m=>[Number(m[1]),Number(m[2])]);
        const op=q.match(/Find \$\\vec u ([+-]) (\d)/),k=op?Number(op[2])*(op[1]==='-'?-1:1):1;answer={x:coords[0][0]+k*coords[1][0],y:coords[0][1]+k*coords[1][1]};break;
    }
    case 'vector_mag_direction': case 'vector_magnitude': case 'vector_direction': {
        const m=q.match(/\\langle\s*(-?\d+),\s*(-?\d+)\\rangle/),ij=q.match(/(-?\d+)i ([+-]) (\d+)j/);
        const x=m?Number(m[1]):Number(ij[1]),y=m?Number(m[2]):Number(ij[3])*(ij[2]==='-'?-1:1);
        answer=g.id==='vector_mag_direction'?{mag:Math.hypot(x,y),dir:angle(x,y)}:g.id==='vector_magnitude'?Math.hypot(x,y):angle(x,y);break;
    }
    case 'trig_from_given_ratio': {
        const m=q.match(/\\(sin|cos|tan|csc|sec|cot)\\theta=([^$]+)/),v=texNumber(m[2]),fn=m[1];let o,a,h;
        if(fn==='sin'||fn==='csc'){h=1;o=fn==='sin'?v:1/v;a=Math.sqrt(1-o*o);}
        else if(fn==='cos'||fn==='sec'){h=1;a=fn==='cos'?v:1/v;o=Math.sqrt(1-a*a);}
        else {a=1;o=fn==='tan'?v:1/v;h=Math.hypot(a,o);}
        const target=maths.at(-1).match(/\\(sin|cos|tan|csc|sec|cot)/)[1];answer={sin:o/h,cos:a/h,tan:o/a,csc:h/o,sec:h/a,cot:a/o}[target];break;
    }
    case 'solve_trig_equation_special': {
        const m=q.match(/\\(sin|cos|tan)\\theta=([^$]+)/),v=texNumber(m[2]);let angles;
        if(m[1]==='sin'){const a=Math.asin(v);angles=[a,Math.PI-a];}
        else if(m[1]==='cos'){const a=Math.acos(v);angles=[a,2*Math.PI-a];}
        else {const a=Math.atan(v);angles=[a,a+Math.PI];}
        angles=angles.map(a=>(a+2*Math.PI)%(2*Math.PI)).sort((a,b)=>a-b);
        if(p.units==='degrees')angles=angles.map(a=>a*180/Math.PI);answer={x:angles[0],y:angles[1]};break;
    }
    case 'bearing_navigation': {
        if(p.inputType==='bearing'){
            const north=num(q,/travels (\d+) km/),east=num(q,/and (\d+) km/);close(p.a.angle,Math.atan2(east,north)*180/Math.PI,g.id);
            assert.equal(p.a.ns,q.includes('km north')?'N':'S');assert.equal(p.a.ew,q.includes('km east')?'E':'W');return;
        }
        answer=num(q,/travels (\d+) km/)*Math.sin(deg(num(q,/bearing [NS] (\d+)°/)));break;
    }
    case 'oblique_triangle_area': answer=0.5*num(q,/b=(\d+)/)*num(q,/c=(\d+)/)*Math.sin(deg(num(q,/A=(\d+)/)));break;
    case 'vector_from_mag_dir': {const mag=texNumber(maths[0]),t=deg(texNumber(maths[1]));answer={x:mag*Math.cos(t),y:mag*Math.sin(t)};break;}
    case 'resultant_from_direction_vectors': {
        const vectors=[...q.matchAll(/\((\d+), (\d+)\^\\circ\)/g)];
        const x=vectors.reduce((s,m)=>s+Number(m[1])*Math.cos(deg(Number(m[2]))),0),y=vectors.reduce((s,m)=>s+Number(m[1])*Math.sin(deg(Number(m[2]))),0);
        assert.ok(Math.hypot(x,y)>1e-8,'Resultant must have a defined direction');answer={mag:Math.hypot(x,y),dir:angle(x,y)};break;
    }
    case 'trig_ratio_variables': {
        const m=p.svgAltText.match(/with (\w) opposite theta, (\w) adjacent to theta, and hypotenuse (\w)/),fn=maths[0].match(/\\(sin|cos|tan)/)[1];
        assert.equal(p.a,{sin:`${m[1]}/${m[3]}`,cos:`${m[2]}/${m[3]}`,tan:`${m[1]}/${m[2]}`}[fn]);
        assert.ok(p.options.includes(p.a));for(const letter of m.slice(1))assert.ok(p.svg.includes('>'+letter+'</text>'));return;
    }
    default: assert.fail('Missing independent recomputation: '+g.id);
    }
    if(typeof answer==='object')for(const k of Object.keys(answer))close(p.a[k],answer[k],g.id+'.'+k);else close(p.a,answer,g.id);
}
function entries(p) {
    if(p.fields)return p.fields.map(f=>String(f.answer));
    if(p.inputType==='bearing')return [`${p.a.ns} ${p.a.angle.toFixed(1)} ${p.a.ew}`];
    if(p.inputType==='coterminal_deg')return [String(p.baseTheta+360)];
    if(p.inputType==='coterminal_rad')return [String(p.baseThetaRad+2*Math.PI)];
    return typeof p.a==='object'?Object.values(p.a).map(String):[String(p.a)];
}
function roundedEntries(p) {
    const round=(v,t)=>t>0?v.toFixed(Math.round(-Math.log10(t))):String(v);
    if(p.fields)return p.fields.map(f=>round(f.answer,f.tolerance));
    if(p.inputType==='bearing'||p.inputType==='choice')return entries(p);
    if(p.inputType==='coterminal_rad')return [(p.baseThetaRad+2*Math.PI).toFixed(3)];
    if(p.inputType==='coterminal_deg')return entries(p);
    return typeof p.a==='object'?Object.keys(p.a).map(k=>round(p.a[k],p.tol[k])):[round(p.a,p.tol)];
}
function validate(g,p){
    assert.ok(p.q&&p.solution);
    for(const text of [p.q,p.solution,p.entryNote||'']){
        assert.equal((text.match(/\$/g)||[]).length%2,0,'Unbalanced math');
        const outside=text.split('$').filter((_,i)=>i%2===0).join('');
        assert.ok(!/\\[a-zA-Z]|\^/.test(outside),'TeX outside math: '+outside);
        assert.ok(!/NaN|undefined|Infinity|—|\b(?:generator|fallback|excludes)\b/i.test(text),text);
        for(const math of text.split('$').filter((_,i)=>i%2===1))if(katex&&!renderedMath.has(math)){
            katex.renderToString(math,{throwOnError:true,strict:'error'});renderedMath.add(math);
        }
    }
    assert.ok(!/\d+\.\d{4}(?!\d)/.test(p.q),'Decimal given value');
    assert.ok(!Object.values(defects(p)).some(Boolean),'Display defect: '+JSON.stringify(defects(p)));
    recompute(g,p);
    assert.ok(skills.grade(p,entries(p)).correct,'Own answer rejected');
    assert.ok(skills.grade(p,roundedEntries(p)).correct,'Rounded answer rejected');
    assert.ok(!skills.grade(p,entries(p).map(()=> 'junk')).correct,'Junk accepted');
    const wrong=p.inputType==='coterminal_deg'?[String(p.baseTheta+180)]
        :p.inputType==='coterminal_rad'?[String(p.baseThetaRad+Math.PI)]:entries(p).map(()=> '999999');
    assert.ok(!skills.grade(p,wrong).correct,'Wrong answer accepted');
    if(p.inputType.startsWith('coterminal_'))assert.ok(!skills.grade(p,[String(p.baseTheta??p.baseThetaRad)]).correct,'Original angle accepted');
    const tolerances=p.fields?p.fields.map(f=>f.tolerance):typeof p.tol==='object'?Object.values(p.tol):[p.tol||0];
    const places=[...p.q.matchAll(/(?:to|lengths to) (\d) decimal/g)].map(m=>Number(m[1]));
    if(places.length===1)assert.ok(tolerances.every(t=>t<=10**-places[0]+1e-12),'Loose tolerance');
    if(g.id==='solve_right_triangle'){
        const e=entries(p);e[0]='99999';assert.deepEqual(skills.grade(p,e).parts,[false,true,true]);
    }
}

const ids=new Set(skills.generators.map(g=>g.id));assert.equal(ids.size,29);
const checklist=new Function(html.match(/const DEFAULT_CHECKLIST = \[[\s\S]*?\n    \];/)[0]+';return DEFAULT_CHECKLIST')();
const quizConfig=new Function(html.match(/const QUIZ_CONFIG = \{[\s\S]*?\n    \};/)[0]+';return QUIZ_CONFIG')();
for(const row of checklist)assert.ok(ids.has(row.practiceId),'Missing checklist target '+row.id);
for(const config of Object.values(quizConfig))for(const id of [...config.requiredIds,...config.excludedIds||[]])assert.ok(ids.has(id),'Missing checkpoint target '+id);
assert.ok(!html.includes('solve_right_triangle_side_52'));
assert.match(html,/Fall 2026 · Prof\. Young &amp; Prof\. Volk|Fall 2026 · Prof\. Young & Prof\. Volk/);
for(const g of skills.generators){
    const random=skills.mulberry32(seed),prompts=new Set();
    for(let i=0;i<3000;i++){
        try{const p=g.generate(random);validate(g,p);prompts.add(p.q);}catch(e){throw new Error(`${g.id}, seed ${seed}, draw ${i}: ${e.message}`,{cause:e});}
    }
    assert.ok(prompts.size>=(targets[g.id]||(g.id==='trig_ratio_variables'?6:50)),g.id+' only '+prompts.size+' distinct prompts');
    console.log(`${g.id}: 3000 verified, ${prompts.size} distinct`);
}
for(const [entry,want] of [['5pi/12',5*Math.PI/12],['-sqrt(3)/2',-Math.sqrt(3)/2],['3/5',0.6],['(3/5)pi',3*Math.PI/5],['-1/2',-0.5]])close(skills.parseExact(entry),want,entry);
for(const [answer,forms] of [[Math.sqrt(3)/2,['sqrt(3)/2','0.8660']],[0.6,['3/5','0.6000']],[Math.PI/12,['pi/12','0.2618']]]){
    for(const form of forms)assert.ok(skills.grade({inputType:'exact',a:answer,tol:0.0001},[form]).correct,form);
}
for(const entry of ['','3junk','1/0','sqrt(-1)','pi/','2**3','Math.PI','1;alert(1)','sqrt(3)junk'])assert.equal(skills.parseExact(entry),null,entry);
console.log('All seeded generator, parser, and routing checks passed.');

// Exercise the actual page functions with a small DOM adapter. Browser rendering
// is checked separately; this verifies answer controls, saved state, and quizzes.
class Element {
    constructor(id){this.id=id;this.value='';this.style={};this.dataset={};this.disabled=false;this.className='';this.classList={add(){},remove(){},toggle(){}};this._html='';}
    set innerHTML(v){
        this._html=v;
        if(this.id==='dynamic-inputs')for(const id of [...elements.keys()])if(id.startsWith('inp-')||id==='answer-input')elements.delete(id);
        for(const m of v.matchAll(/(?:input|select)[^>]*id="([^"]+)"/g))elements.set(m[1],new Element(m[1]));
    }
    get innerHTML(){return this._html;}
    querySelectorAll(){return [];}
    querySelector(){return null;}
    addEventListener(){} focus(){} setAttribute(){} getAttribute(){return null;}
}
const elements=new Map(),document={
    getElementById(id){if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);},
    querySelectorAll(){return [];},addEventListener(){},documentElement:new Element('root'),body:new Element('body')
};
const saved={theme:'dark',checklist:checklist.map((c,i)=>({id:c.id,done:i%2===0})),history:[{topic:'Prior practice',tries:0}],videosWatched:['old-video']};
const source=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].at(-1)[1];
function page(shared){
    const ctx={document,window:{addEventListener(){},location:{hash:''},...(shared?{Math130Test3Skills:skills}:{})},localStorage:{getItem:()=>JSON.stringify(saved),setItem(){}},Math:Object.assign(Object.create(Math),{random:skills.mulberry32(seed)}),console,setTimeout(){},clearTimeout(){},confirm:()=>true};
    vm.createContext(ctx);vm.runInContext(source,ctx);
    vm.runInContext('renderMath=()=>{};refreshIcons=()=>{};updateStatsUI=()=>{};renderHistory=()=>{};',ctx);
    return ctx;
}
for(const shared of [true,false]){
    const ctx=page(shared);
    vm.runInContext('loadState();this.savedState=state;this.pageSkills=test3Skills;',ctx);
    assert.deepEqual(Array.from(ctx.savedState.checklist,c=>c.done),saved.checklist.map(c=>c.done));
    assert.equal(ctx.savedState.history[0].topic,'Prior practice');assert.equal(ctx.savedState.videosWatched[0],'old-video');
    // The embedded fallback must produce exactly the same seeded questions.
    for(let i=0;i<skills.generators.length;i++)assert.equal(JSON.stringify(ctx.pageSkills.generators[i].generate(skills.mulberry32(99))),JSON.stringify(skills.generators[i].generate(skills.mulberry32(99))));
    for(let run=0;run<100;run++)for(const checkpoint of [5,6,7,8,9,13]){
        vm.runInContext(checkpoint===13?'startMockExam()':`startMockQuiz(${checkpoint})`,ctx);
        const total=vm.runInContext('examState.total',ctx);assert.equal(total,checkpoint===13?20:5);
        for(let i=0;i<total;i++){
            const p=vm.runInContext('currentQuestion',ctx),e=entries(p);
            const controls=p.fields?p.fields.map((_,i)=>'inp-part-'+i):p.inputType==='vector_mag_dir'?['inp-vmag','inp-vdir']:['vector_xy','two_angle_solutions'].includes(p.inputType)?['inp-vx','inp-vy']:['answer-input'];
            controls.forEach((id,i)=>{assert.ok(elements.has(id),'Missing input '+id);document.getElementById(id).value=e[i];});
            vm.runInContext('checkAnswer()',ctx);assert.equal(vm.runInContext('examState.score',ctx),i+1,'Page checker failed '+p.q);
            if(i+1<total)vm.runInContext('loadQuestion()',ctx);
        }
    }
    console.log(`100 complete runs of all checkpoints passed (${shared?'shared file':'offline fallback'}).`);
}
