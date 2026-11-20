'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const skills=require('../assets/js/math130-test3-skills.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const inputs=q=>q.exactInputs||q.fields.map(f=>f.answerText);
const signs={sin:[1,1,-1,-1],csc:[1,1,-1,-1],cos:[1,-1,-1,1],sec:[1,-1,-1,1],tan:[1,-1,1,-1],cot:[1,-1,1,-1]};
const trig={sin:Math.sin,cos:Math.cos};
const variants=[new Set(),new Set(),new Set(),new Set(),new Set(),new Set()];
for(let seed=0;seed<1000;seed++){
    const quiz=skills.buildSection53Rehearsal(skills.mulberry32(seed));
    assert.deepEqual(quiz.map(q=>q.points),[20,20,10,15,15,25]);
    assert.deepEqual(quiz.map(q=>q.number),[1,2,3,4,5,6]);
    assert.equal(quiz.reduce((sum,q)=>sum+q.points,0),105);
    quiz.forEach((q,i)=>{
        variants[i].add(q.q);
        for(const text of [q.q,q.solution]){
            assert.equal((text.match(/\$/g)||[]).length%2,0,'Unbalanced math delimiters');
        }
        assert.equal(skills.grade(q,inputs(q)).correct,true,JSON.stringify(q));
        assert.equal(skills.grade(q,inputs(q).map(()=> 'junk')).correct,false);
        if(q.exactOnly)assert.equal(skills.grade(q,inputs(q).map(s=>String(skills.parseExact(s).toFixed(10)))).correct,false,'Decimal answers must not satisfy exact-only rehearsal');
    });
    for(const [i,fn] of [[0,'sin'],[1,'cos']]){
        const q=quiz[i],p=q.parameters;
        assert.equal(q.fields.length,3);
        assert.equal(p.fn,fn);assert.equal(p.radians,i===1);
        assert.ok(p.degrees>0&&p.degrees<360);
        assert.ok(!q.svg.includes('diagram-ray'),'The initial axes must not reveal the terminal side');
        assert.ok(q.solutionSvg.includes('diagram-ray'));
        close(q.fields[0].answer,i===1?p.ref*Math.PI/180:p.ref);
        close(q.fields[1].answer,trig[fn](p.ref*Math.PI/180));
        close(q.fields[2].answer,trig[fn](p.degrees*Math.PI/180));
    }
    assert.equal(quiz[2].fields.length,2);
    assert.notEqual(quiz[2].parameters.signs[0].quadrant,quiz[2].parameters.signs[1].quadrant);
    for(const pair of quiz[2].parameters.signs){
        const matches=[1,2,3,4].filter(q=>signs[pair.first][q-1]===signs[pair.first][pair.quadrant-1]&&signs[pair.second][q-1]===signs[pair.second][pair.quadrant-1]);
        assert.deepEqual(matches,[pair.quadrant]);
    }
    assert.ok(['csc','sec','cot'].includes(quiz[2].parameters.signs[0].first));
    for(const [i,radians] of [[3,true],[4,false]]){
        const q=quiz[i],p=q.parameters;
        assert.equal(q.units,radians?'radians':'degrees');
        assert.ok(skills.grade(q,inputs(q).slice().reverse()).correct);
        assert.ok(!skills.grade(q,[inputs(q)[0],inputs(q)[0]]).correct);
        assert.ok(!skills.grade(q,inputs(q).map(s=>String(skills.parseExact(s)+(radians?2*Math.PI:360)))).correct);
        for(const value of Object.values(q.a)){
            assert.ok(value>=0&&value<(radians?2*Math.PI:360));
            close(trig[p.fn](radians?value:value*Math.PI/180),p.sign*p.magnitude);
        }
    }
    const point=quiz[5],{x,y,hyp}=point.parameters,r=Math.hypot(x,y);
    assert.equal(point.fields.length,6);assert.equal(r,hyp);assert.ok(Number.isInteger(r));
    const ratios=[y/r,x/r,y/x,r/y,r/x,x/y];
    point.fields.forEach((f,i)=>close(f.answer,ratios[i]));
    for(let i=0;i<6;i++){
        const partial=inputs(point).slice();partial[i]='999';
        assert.equal(skills.grade(point,partial).parts.filter(Boolean).length,5);
    }
}
assert.ok(variants.every(v=>v.size>1),'Each question must vary between rehearsals');
// Numerically equivalent fractions and rationalized radicals stay valid.
assert.ok(skills.grade({inputType:'parts',exactOnly:true,fields:[{answer:Math.SQRT1_2,tolerance:0}]},['1/sqrt(2)']).correct);
assert.ok(skills.grade({inputType:'parts',exactOnly:true,fields:[{answer:Math.SQRT1_2,tolerance:0}]},['sqrt(2)/2']).correct);
assert.ok(!skills.grade({inputType:'parts',exactOnly:true,fields:[{answer:Math.SQRT1_2,tolerance:0}]},['0.7071067811865476']).correct);
const root=path.join(__dirname,'..');
const hub=fs.readFileSync(path.join(root,'_data/math130.yml'),'utf8');
assert.match(hub,/practice=quiz11/);
assert.ok(!hub.includes('Aviation practice: Quiz 11 format'));
assert.ok(!hub.includes('Nov 16: Quiz 11 practice with worked answers'));
const page=fs.readFileSync(path.join(root,'130Test3.html'),'utf8');
assert.match(page,/params.get\('practice'\) === 'quiz11'/);
assert.match(page,/math130-test3-skills\.js\?v=20261120-sh011/,'Refresh cached shared code when publishing the new blueprint');
assert.ok(!page.includes('Aviation practice — Spring Quiz 11 format'));
console.log('PASS: 1,000 complete paper blueprints; exact forms, both equation units, sign pairs, integer radii, six ratios, and intentional 105/100 scoring.');
