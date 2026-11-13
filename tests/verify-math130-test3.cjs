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
const cotermAnswer=(base,period,sign)=>{let v=base+(sign<0?-period:period);while(Math.sign(v)!==(sign||1)||Math.abs(v-base)<1e-9)v+=(sign<0?-period:period);return v;};
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
    const tokens=s.match(/\d+(?:\.\d*)?|\.\d+|[()+*/-]/g);let i=0;
    const atom=()=>{const t=tokens[i++];if(t==='-'||t==='+')return (t==='-'?-1:1)*atom();if(t==='('){const v=sum();assert.equal(tokens[i++],')');return v;}return Number(t);};
    const product=()=>{let v=atom();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],w=atom();v=op==='*'?v*w:v/w;}return v;};
    const sum=()=>{let v=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],w=product();v=op==='+'?v+w:v-w;}return v;};
    const answer=sum();assert.equal(i,tokens.length);return answer;
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
    if (p.parameters) {
        const d=p.parameters;
        if(g.id==='trig_values_from_point'){
            const radius=Math.hypot(d.x,d.y),v={r:radius,sin:d.y/radius,cos:d.x/radius,tan:d.y/d.x,csc:radius/d.y,sec:radius/d.x,cot:d.x/d.y};
            for(const f of p.fields)close(f.answer,v[f.id],g.id+'.'+f.id);return;
        }
        if(g.id==='aviation_climb_time')answer=Math.round(d.altitude/(d.speed*Math.sin(deg(d.angle)))*60);
        if(g.id==='aviation_descent_loss')answer=d.speed*(d.minutes/60)*Math.sin(deg(d.angle));
        if(g.id==='aviation_bearing_displacement'){
            close(p.fields[0].answer,Math.round(d.speed*d.hours*Math.cos(deg(d.angle))),g.id+'.vertical');
            close(p.fields[1].answer,Math.round(d.speed*d.hours*Math.sin(deg(d.angle))),g.id+'.horizontal');return;
        }
        if(g.id==='aviation_return_to_origin'){
            const north=(d.ns==='N'?1:-1)*d.speed*d.firstHours,east=(d.ew==='E'?1:-1)*d.speed*d.secondHours;
            close(p.fields[0].answer,Math.hypot(north,east),g.id+'.distance');
            const heading=(Math.atan2(-east,-north)*180/Math.PI+360)%360;
            const b=p.fields[1].answer,actual=b.ns==='N'?(b.ew==='E'?b.angle:360-b.angle):(b.ew==='E'?180-b.angle:180+b.angle);
            close(actual,heading,g.id+'.return heading');return;
        }
        if(g.id==='right_triangle_word_problem')answer=d.findAngle?Math.atan2(d.h,d.d)*180/Math.PI:d.d*Math.tan(deg(d.theta));
        if(g.id==='angle_of_elevation')answer=d.kind<2?Math.atan2(d.h,d.d)*180/Math.PI:d.kind===2?d.known*Math.tan(deg(d.theta)):d.known/Math.tan(deg(d.theta));
        if(g.id==='right_triangle_find_angle')answer=({sin:Math.asin,cos:Math.acos,tan:Math.atan})[d.fn](d.x/d.y)*180/Math.PI;
        if(g.id==='vector_direction')answer=angle(d.x,d.y);
        if(g.id==='bearing_navigation')answer=d.distance*(d.vertical?Math.cos(deg(d.angle)):Math.sin(deg(d.angle)));
        if(g.id==='vector_components')answer={x:d.coordinates[1][0]-d.coordinates[0][0],y:d.coordinates[1][1]-d.coordinates[0][1]};
        if(g.id==='vector_mag_direction')answer={mag:Math.hypot(...d.coordinates[0]),dir:angle(...d.coordinates[0])};
        if(g.id==='angle_terminal_quadrant'){
            const t=(d.degrees%360+360)%360;
            assert.equal(p.a,({0:'positive x-axis',90:'positive y-axis',180:'negative x-axis',270:'negative y-axis'})[t]||'Quadrant '+['I','II','III','IV'][Math.floor(t/90)]);return;
        }
        if(g.id==='trig_ratio_variables'){
            const [o,a,h]=d.letters;assert.equal(p.a,{sin:`${o}/${h}`,cos:`${a}/${h}`,tan:`${o}/${a}`,csc:`${h}/${o}`,sec:`${h}/${a}`,cot:`${a}/${o}`}[d.fn]);
            assert.ok(p.svgAltText.includes(`${o} opposite`)&&p.svgAltText.includes(`${a} adjacent`));
            for(const v of d.letters)assert.ok(p.svg.includes('>'+v+'</text>'));return;
        }
        if(g.id==='trig_ratios_several'){
            const missing=Math.sqrt(d.h*d.h-d.leg*d.leg),o=d.knownOpp?d.leg:missing,a=d.knownOpp?missing:d.leg;
            const values={sin:o/d.h,cos:a/d.h,tan:o/a,csc:d.h/o,sec:d.h/a,cot:a/o};
            for(const f of p.fields)close(f.answer,values[f.id],g.id+f.id);return;
        }
        if(g.id==='solve_right_triangle'){
            let {a,b,c,A}=d.known;
            if(d.mode===0){a=b*Math.tan(deg(A));c=Math.hypot(a,b);}
            if(d.mode===1){c=Math.hypot(a,b);A=Math.atan2(a,b)*180/Math.PI;}
            if(d.mode===2){a=c*Math.sin(deg(A));b=c*Math.cos(deg(A));}
            if(d.mode===3){b=Math.sqrt(c*c-a*a);A=Math.asin(a/c)*180/Math.PI;}
            const values={a,b,c,A,B:90-A};for(const f of p.fields)close(f.answer,values[f.id],g.id+f.id);return;
        }
        if(answer!==undefined){if(typeof answer==='object')for(const k of Object.keys(answer))close(p.a[k],answer[k],g.id+'.'+k);else close(p.a,answer,g.id);return;}
    }
    switch(g.id){
    case 'angle_coterminal': close(p.baseTheta,texNumber(maths[0]),g.id);return;
    case 'angle_coterminal_rad': close(p.baseThetaRad,texNumber(maths[0]),g.id);return;
    case 'arc_length': {
        const radius=texNumber(maths[0]),given=texNumber(maths[1]);
        answer=q.includes('arc length $')?(q.includes('in degrees')?given/radius*180/Math.PI:given/radius):radius*(maths[1].includes('circ')?deg(given):given);break;
    }
    case 'trig_ratio': {const o=num(q,/opposite side \$=(\d+)/),a=num(q,/adjacent side \$=(\d+)/);answer=q.includes('\\sin')?o/Math.hypot(o,a):q.includes('\\cos')?a/Math.hypot(o,a):o/a;break;}
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
        const target=maths.filter(x=>/\\(sin|cos|tan|csc|sec|cot)/.test(x)).at(-1).match(/\\(sin|cos|tan|csc|sec|cot)/)[1];answer={sin:o/h,cos:a/h,tan:o/a,csc:h/o,sec:h/a,cot:a/o}[target];break;
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
    if(p.fields)return p.fields.map(f=>f.inputType==='bearing'?`${f.answer.ns} ${f.answer.angle} ${f.answer.ew}`:String(f.answer));
    if(p.inputType==='bearing')return [`${p.a.ns} ${p.a.angle.toFixed(1)} ${p.a.ew}`];
    if(p.inputType==='coterminal_deg')return [String(cotermAnswer(p.baseTheta,360,p.sign))];
    if(p.inputType==='coterminal_rad')return [String(cotermAnswer(p.baseThetaRad,2*Math.PI,p.sign))];
    return typeof p.a==='object'?Object.values(p.a).map(String):[String(p.a)];
}
function roundedEntries(p) {
    const round=(v,t)=>t>0?v.toFixed(t===0.05?1:t===0.00005?4:Math.round(-Math.log10(t))):String(v);
    if(p.fields)return p.fields.map(f=>f.inputType==='bearing'?`${f.answer.ns} ${f.answer.angle.toFixed(1)} ${f.answer.ew}`:round(f.answer,f.tolerance));
    if(p.inputType==='bearing'||p.inputType==='choice')return entries(p);
    if(p.inputType==='coterminal_rad')return [cotermAnswer(p.baseThetaRad,2*Math.PI,p.sign).toFixed(3)];
    if(p.inputType==='coterminal_deg')return entries(p);
    return typeof p.a==='object'?Object.keys(p.a).map(k=>round(p.a[k],p.tol[k])):[round(p.a,p.tol)];
}
function validate(g,p){
    assert.ok(p.q&&p.solution);
    assert.ok(p.hint&&p.hint.trim(),g.id+' needs a hint');
    for(const text of [p.q,p.solution,p.hint,p.entryNote||'']){
        assert.equal((text.match(/\$/g)||[]).length%2,0,'Unbalanced math');
        const outside=text.split('$').filter((_,i)=>i%2===0).join('');
        assert.ok(!/\\[a-zA-Z]|\^/.test(outside),'TeX outside math: '+outside);
        assert.ok(!/NaN|undefined|Infinity|—|\b(?:generator|fallback|excludes)\b/i.test(text),text);
        assert.ok(!/the visual intentionally/i.test(text),text);
        for(const math of text.split('$').filter((_,i)=>i%2===1))assert.ok(!/(?<!\\)\b(sin|cos|tan|csc|sec|cot)\b/.test(math),'Unescaped trig function: '+math);
        for(const math of text.split('$').filter((_,i)=>i%2===1))if(katex&&!renderedMath.has(math)){
            katex.renderToString(math,{throwOnError:true,strict:'error'});renderedMath.add(math);
        }
    }
    assert.ok(!/\d+\.\d{4}(?!\d)/.test(p.q),'Decimal given value');
    assert.ok(!Object.values(defects(p)).some(Boolean),'Display defect: '+JSON.stringify(defects(p)));
    assert.ok(!/\$(-?\d+)\\approx \1\.0+\$/.test(p.solution));
    if(p.q.includes('looks down'))assert.ok(!p.q.includes('eye level'));
    if(p.svg)for(const m of p.svg.matchAll(/<text\b([^>]*)>/g)){
        const x=Number((m[1].match(/\bx="([\d.]+)"/)||[])[1]);if(x>245)assert.ok(/text-anchor="(?:end|middle)"/.test(m[1]),'Clipped text label');
    }
    const values=p.fields?p.fields.map(f=>f.answer).filter(v=>typeof v==='number'):typeof p.a==='number'?[p.a]:p.a&&typeof p.a==='object'?Object.values(p.a).filter(v=>typeof v==='number'):[];
    for(const value of values)for(const places of [1,2,3,4])assert.ok(!p.hint.includes(value.toFixed(places)),'Hint reveals the answer');
    if(typeof p.a==='string')assert.ok(!p.hint.includes(p.a),'Hint reveals the answer');
    recompute(g,p);
    assert.ok(skills.grade(p,entries(p)).correct,'Own answer rejected');
    assert.ok(skills.grade(p,roundedEntries(p)).correct,'Rounded answer rejected');
    if(p.inputType==='two_angle_solutions'){
        assert.ok(skills.grade(p,entries(p).reverse()).correct);assert.ok(!skills.grade(p,[String(p.a.x),String(p.a.x)]).correct);
        assert.deepEqual(skills.grade(p,[String(p.a.y),'999999']).parts,[true,false]);
    }
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

const ids=new Set(skills.generators.map(g=>g.id));assert.equal(ids.size,37);
const checklist=vm.runInNewContext(html.match(/const DEFAULT_CHECKLIST = \[[\s\S]*?\n    \];/)[0]+';DEFAULT_CHECKLIST');
const quizConfig=vm.runInNewContext(html.match(/const QUIZ_CONFIG = \{[\s\S]*?\n    \};/)[0]+';QUIZ_CONFIG');
for(const row of checklist)assert.ok(ids.has(row.practiceId),'Missing checklist target '+row.id);
for(const config of Object.values(quizConfig))for(const id of [...config.requiredIds,...config.excludedIds||[]])assert.ok(ids.has(id),'Missing checkpoint target '+id);
assert.ok(!html.includes('solve_right_triangle_side_52'));
assert.match(html,/Fall 2026 · Prof\. Young &amp; Prof\. Volk|Fall 2026 · Prof\. Young & Prof\. Volk/);
for(const g of skills.generators){
    const prompts=new Set(),samples=[];
    for(let i=0;i<3000;i++){
        try{const p=g.generate(skills.mulberry32(seed+i));validate(g,p);prompts.add(p.q);samples.push(p);}catch(e){throw new Error(`${g.id}, seed ${seed+i}: ${e.message}`,{cause:e});}
    }
    assert.ok(prompts.size>=(targets[g.id]||(g.id==='trig_ratio_variables'?60:g.id==='trig_ratios_several'?200:50)),g.id+' only '+prompts.size+' distinct prompts');
    const proportion=(predicate,lo,hi)=>{const p=samples.filter(predicate).length/samples.length;assert.ok(p>=lo&&p<=hi,`${g.id}: proportion ${p}, expected ${lo} to ${hi}`);};
    if(['angle_coterminal','reference_angle_deg','reference_angle_rad','angle_terminal_quadrant'].includes(g.id)){
        proportion(p=>{const raw=g.id==='angle_coterminal'?p.baseTheta:g.id==='angle_terminal_quadrant'?p.parameters.degrees:texNumber(p.q.match(/\$([^$]+)\$/)[1])*(g.id.endsWith('_rad')?180/Math.PI:1);return Math.abs(raw)<360;},0.4,0.6);
    }
    if(['reference_angle_deg','reference_angle_rad'].includes(g.id))for(const p of samples){
        const raw=texNumber(p.q.match(/\$([^$]+)\$/)[1]);if(raw<0)assert.match(p.svg,/data-angle-arc="main" d="M [^"]+ A 48 48 0 [01] 1 /);
        assert.ok(!p.svg.includes('grid:'));
    }
    if(['vector_components','vector_mag_direction'].includes(g.id)){
        proportion(p=>p.graphOnly,0.5,0.6);
        for(const p of samples.filter(p=>p.graphOnly)){assert.ok(!/\\langle|\(-?\d+,-?\d+\)/.test(p.q));assert.ok(!/>[PQ]?\(-?\d+,\s*-?\d+\)/.test(p.svg));assert.ok(p.svgAltText.match(/\(-?\d+,\s*-?\d+\)/));}
    }
    if(g.id==='trig_ratios_several')proportion(p=>p.parameters.chosen.some(fn=>['csc','sec','cot'].includes(fn)),0.3,1);
    if(g.id==='right_triangle_find_angle')for(const fn of ['sin','cos','tan'])proportion(p=>p.parameters.fn===fn,0.25,0.4);
    if(g.id==='solve_right_triangle')for(const mode of [0,1,2,3])proportion(p=>p.parameters.mode===mode,0.2,0.3);
    if(g.id==='vector_direction'){proportion(p=>p.parameters.ij,0.7,1);proportion(p=>!p.parameters.x||!p.parameters.y,0,0.1);for(const p of samples)assert.ok(!/(?:^|[^\d])1\\mathbf/.test(p.q));}
    if(g.id==='right_triangle_word_problem')for(const p of samples){const d=p.parameters,ranges={ramp:[3,12,2,15],ladder:[60,80,0.5,3],kite:[25,65,10,80],'guy wire':[40,70,2,20],shadow:[15,75,2,40]},[lo,hi,min,max]=ranges[d.context];assert.ok(d.theta>=lo&&d.theta<=hi&&d.d>=min&&d.d<=max);}
    console.log(`${g.id}: 3000 verified, ${prompts.size} distinct`);
}
const weights={'Section 5.1':5,'Section 5.2':8,'Section 5.3':8,'Section 7.1':7,'Section 8.4':5};
for(const snapshot of JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/math130-test3-arcs.json'),'utf8'))){
    const p=skills.generators.find(g=>g.id==='arc_length').generate(skills.mulberry32(snapshot.seed));
    assert.equal(p.q,snapshot.q);assert.equal(p.solution,snapshot.solution);
}
const library=fs.readFileSync(path.join(root,'assets/js/math130-test3-skills.js'),'utf8').replaceAll('\r\n','\n');
const sharedBody=library.slice(library.indexOf("    'use strict';"),library.indexOf('    if (typeof module'));
assert.ok(html.replaceAll('\r\n','\n').includes(sharedBody),'The built-in skills copy must stay byte-for-byte synchronized.');
for(const angle of [-30,-390,420]){
    const svg=skills.createBasicAngleSvg({thetaDeg:angle,labelText:angle+'°',fallbackText:angle+' degrees'});
    assert.ok(svg.includes('>'+angle+'°</text>'));
    assert.ok(svg.includes((Math.trunc(angle/360)>0?'+':'')+Math.trunc(angle/360)+' full turns'));
}
for(let i=0;i<1000;i++){
    const selected=skills.buildCheckpoint(skills.generators,{count:20,weights},skills.mulberry32(i));
    assert.equal(selected.length,20);assert.equal(new Set(selected.map(g=>g.id)).size,20);
    for(const [section,weight] of Object.entries(weights))assert.ok(Math.abs(selected.filter(g=>g.section===section).length-20*weight/33)<=1);
    for(const config of Object.values(quizConfig)){
        const pool=skills.generators.filter(g=>config.sections.includes(g.section)&&!(config.excludedIds||[]).includes(g.id)),questions=skills.buildCheckpoint(skills.generators,config,skills.mulberry32(i));
        assert.equal(questions.length,config.count);assert.equal(new Set(questions.map(g=>g.id)).size,Math.min(config.count,pool.length));
    }
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
    assert.deepEqual(Array.from(ctx.savedState.checklist,c=>c.done),Array.from(saved.checklist,c=>c.done));
    assert.equal(ctx.savedState.history[0].topic,'Prior practice');assert.equal(ctx.savedState.videosWatched[0],'old-video');
    // The embedded fallback must produce exactly the same seeded questions.
    for(let i=0;i<skills.generators.length;i++)assert.equal(JSON.stringify(ctx.pageSkills.generators[i].generate(skills.mulberry32(99))),JSON.stringify(skills.generators[i].generate(skills.mulberry32(99))));
    for(let run=0;run<100;run++)for(const checkpoint of [5,6,7,8,9,10,13]){
        vm.runInContext(checkpoint===13?'startMockExam()':`startMockQuiz(${checkpoint})`,ctx);
        const total=vm.runInContext('examState.total',ctx);assert.equal(total,checkpoint===13?20:quizConfig[checkpoint].count);
        for(let i=0;i<total;i++){
            const p=vm.runInContext('currentQuestion',ctx),e=entries(p);
            const controls=p.fields?p.fields.map((_,i)=>'inp-part-'+i):p.inputType==='vector_mag_dir'?['inp-vmag','inp-vdir']:['vector_xy','two_angle_solutions'].includes(p.inputType)?['inp-vx','inp-vy']:['answer-input'];
            controls.forEach((id,i)=>{assert.ok(elements.has(id),'Missing input '+id);document.getElementById(id).value=e[i];});
            vm.runInContext('checkAnswer()',ctx);assert.equal(vm.runInContext('examState.score',ctx),i+1,'Page checker failed '+p.q);
            if(i+1<total)vm.runInContext('loadQuestion()',ctx);
        }
    }
    console.log(`100 complete runs of all checkpoints passed (${shared?'shared file':'offline fallback'}).`);
    // Real page feedback progression: hint, opt-in reveal, no correct-history credit.
    for(const generator of skills.generators){
        ctx.generatorId=generator.id;
        vm.runInContext('examState.isActive=false;state.history=[];currentQuiz=generators.find(g=>g.id===generatorId);loadQuestion();',ctx);
        const p=vm.runInContext('currentQuestion',ctx);
        const controls=p.fields?p.fields.map((_,i)=>'inp-part-'+i):p.inputType==='vector_mag_dir'?['inp-vmag','inp-vdir']:['vector_xy','two_angle_solutions'].includes(p.inputType)?['inp-vx','inp-vy']:['answer-input'];
        controls.forEach(id=>document.getElementById(id).value='junk');
        vm.runInContext('checkAnswer()',ctx);
        assert.ok(document.getElementById('feedback-display').innerHTML.includes(p.hint));
        assert.ok(!document.getElementById('feedback-display').innerHTML.includes('Show solution'));
        assert.ok(!document.getElementById('feedback-display').innerHTML.includes(p.solution));
        vm.runInContext('checkAnswer()',ctx);assert.ok(document.getElementById('feedback-display').innerHTML.includes('Show solution'));
        vm.runInContext('revealCurrentSolution()',ctx);assert.ok(document.getElementById('revealed-solution').innerHTML.includes(p.solution));
        controls.forEach((id,i)=>document.getElementById(id).value=entries(p)[i]);
        vm.runInContext('checkAnswer()',ctx);assert.equal(vm.runInContext('state.history.length',ctx),0);
        vm.runInContext('loadQuestion()',ctx);assert.equal(vm.runInContext('solutionRevealed',ctx),false);
    }
}
