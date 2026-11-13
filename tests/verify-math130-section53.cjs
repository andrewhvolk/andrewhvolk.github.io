'use strict';
// node tests/verify-math130-section53.cjs
const assert=require('node:assert/strict');
const {geometry,radians}=require('../slides/framework/reference-angle-explorer.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
for(let angle=-720;angle<=720;angle++){
 const m=geometry(angle),a=angle*Math.PI/180;
 close(m.x,Math.cos(a));close(m.y,Math.sin(a));
 close(m.sin*m.sin+m.cos*m.cos,1);
 const onAxis=angle%90===0;
 assert.equal(m.reference===null,onAxis);
 if(!onAxis){
  close(m.reference,Math.acos(Math.abs(Math.cos(a)))*180/Math.PI);
  assert.ok(m.reference>0&&m.reference<90);
  const quadrant=m.x>0?(m.y>0?'I':'IV'):(m.y>0?'II':'III');
  assert.equal(m.quadrant,quadrant);
 }
 assert.equal(m.tan===null,Math.abs(Math.cos(a))<1e-12);
 assert.equal(m.cot===null,Math.abs(Math.sin(a))<1e-12);
 assert.equal(m.sec===null,m.tan===null);assert.equal(m.csc===null,m.cot===null);
 if(m.tan!==null)close(m.tan*m.cos,m.sin);
 if(m.cot!==null)close(m.cot*m.sin,m.cos);
 const coterminal=geometry(angle+360);
 for(const key of ['normalized','quadrant','reference','axis'])assert.equal(m[key],coterminal[key]);
}
for(const[a,s]of[[0,'0'],[90,'π/2'],[180,'π'],[-150,'−5π/6'],[225,'5π/4'],[420,'7π/3'],[720,'4π']])assert.equal(radians(a),s);
for(const[a,axis]of[[0,'positive x-axis'],[90,'positive y-axis'],[180,'negative x-axis'],[-90,'negative y-axis'],[720,'positive x-axis']])assert.equal(geometry(a).axis,axis);
console.log('PASS: 1,441 angle positions; reference angles, signs, reciprocal domains, coterminal invariance, and exact radian labels.');
