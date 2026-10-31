import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {course} from '../content/course.mjs';
import {emptyStore,newProfile,plan,commit,undo,nextReview,evidenceState,vocabularyScope,eligibleCards,practiceQueue} from '../src/engine.mjs';
import {previewBackup,exportBackup,compactState} from '../src/persistence.mjs';
import {recoverDrafts} from '../src/drafts.mjs';
import {coverage} from '../src/validation.mjs';
const data=JSON.parse(await readFile(new URL('../content/vocabulary.json',import.meta.url),'utf8'));
const decode=raw=>previewBackup(raw,data.cards,data.sections,course);
test('legacy preference allowlist rejects markup, wrong types and unknown fields atomically',()=>{
 const base={format:'palabra-backup',version:1,progress:{},history:[],settings:{sections:['1a'],direction:'es-en',limit:10}};
 for(const bad of [{minutes:'<b id="injected">test</b>'},{newLimit:'NaN'},{limit:'20'},{limit:100},{verbsOnly:'false'},{sections:'1a'},{unexpected:true}]){
  const input={...base,settings:{...base.settings,...bad}},before=JSON.stringify(input);
  assert.throws(()=>decode(before),/Nothing was changed/);assert.equal(JSON.stringify(input),before);
 }
 const accepted=decode(JSON.stringify(base)).state;assert.deepEqual(decode(exportBackup(accepted)).state,accepted);
 for(const [key,value]of Object.entries({minutes:'15',newLimit:21,vosotros:1,speed:NaN,verbsOnly:'false',position:'other',unknown:1})){
  const state=emptyStore();state.profiles[0].settings[key]=value;assert.throws(()=>decode(exportBackup(state)),/settings/);
 }
});
test('full-book schedules, bounded inverse undo, legacy snapshot migration and multi-year backups',()=>{
 const at=Date.UTC(2026,9,30,12);let p=newProfile('long');p.settings.sections=data.sections.map(s=>s.id);p.settings.limit=50;
 for(const c of data.cards)p.progress[c.id]=nextReview(null,true,at-864000000);
 const session=plan(p,course,data.cards,at,9,{wordsOnly:true});p.sessions.push(session);p.activeSession=session.id;
 for(let i=0;i<50;i++)p=commit(p,session.id,{id:'answer-'+i,index:i,correct:true},course,data.cards,at+i);
 assert.equal(p.sessions[0].undo.length,20);assert(p.sessions[0].undo.every(u=>!u.before.progress));
 const undone=undo(p,session.id);assert.equal(undone.sessions[0].cursor,49);assert.equal(undone.progress[session.queue[49].cardId].reviews,1);
 let state={...emptyStore(),profiles:[p],activeProfile:p.id};let raw=exportBackup(state);assert(Buffer.byteLength(raw)<300000);assert.equal(decode(raw).state.profiles[0].attempts.length,50);
 // Three years, 20 activities/day: retain all evidence and session resume records.
 const sample=structuredClone(p.attempts[0]);for(let i=0;i<21900;i++)p.attempts.push({...sample,id:'year-'+i,timestamp:at+i*3600000,sessionId:session.id});
 raw=exportBackup(state);assert(Buffer.byteLength(raw)<16*1024*1024);assert.equal(decode(raw).state.profiles[0].attempts.length,21950);
 for(let i=0;i<3;i++){const restored=decode(raw).state;const again=exportBackup(restored);assert.equal(Buffer.byteLength(again),Buffer.byteLength(raw));raw=again;}
 const legacy=structuredClone(state);legacy.profiles[0].sessions[0].undo=[{attemptId:'answer-49',before:{progress:structuredClone(p.progress),historyLength:49,attemptsLength:49,cursor:49}}];
 const migrated=compactState(legacy);assert(!migrated.profiles[0].sessions[0].undo[0].before.progress);assert.equal(decode(exportBackup(migrated)).summary.matched,940);
});
test('draft journal resumes matching cursor/revision and ignores stale or malformed input',()=>{
 const state=emptyStore(),p=state.profiles[0],session=plan(p,course,data.cards,Date.now(),1);p.sessions.push(session);p.activeSession=session.id;
 const entry={profileId:p.id,sessionId:session.id,index:0,answer:'está'};
 const raw=JSON.stringify({revision:0,entries:[entry]});assert.equal(recoverDrafts(state,raw).profiles[0].sessions[0].drafts[0].answer,'está');assert.deepEqual(state.profiles[0].sessions[0].drafts,{});
 assert.equal(recoverDrafts({...state,revision:1},raw).profiles[0].sessions[0].drafts[0],undefined);
 assert.deepEqual(recoverDrafts(state,'{'),state);assert.deepEqual(recoverDrafts(state,JSON.stringify({revision:0,entries:[{...entry,answer:{bad:true}}]})),state);
});
test('new independent evidence retires diagnostic gaps and current work shares the plan',()=>{
 const at=Date.UTC(2026,9,30,12),p=newProfile('catchup');p.settings.position='9b';p.lessons=course.objectives.map(o=>o.id);
 const sampled=[...new Set(course.diagnostic.flatMap(id=>course.exercises.find(e=>e.id===id).objectiveIds))];
 for(const id of sampled){p.attempts.push({id:'d-'+id,sessionId:'d',diagnostic:true,objectiveIds:[id],outcome:'incorrect',timestamp:at-5*86400000});
  const objective=course.objectives.find(o=>o.id===id),items=course.exercises.filter(e=>e.objectiveIds.includes(id)&&(!objective.productionRequired||e.production));
  let variants=items.slice(0,3);if(objective.exerciseTargets){outer:for(const a of items)for(const b of items)for(const c of items){const trio=[a,b,c];if(new Set(trio.map(e=>e.verbEvidence.person)).size>=3&&new Set(trio.map(e=>e.context)).size>=2){variants=trio;break outer;}}}
  for(let i=0;i<6;i++)p.attempts.push({id:id+i,exerciseId:variants[i%3].id,objectiveIds:[id],timestamp:at-(i<3?2:1)*86400000,outcome:'correct',assessmentMode:'auto',production:true});
  assert.equal(evidenceState(p.attempts,course.objectives.find(o=>o.id===id),at).state,'secure');
 }
 let next=plan(p,course,data.cards,at,1);assert(next.queue.some(i=>i.exerciseId?.startsWith('9b.')));assert(!next.queue.some(i=>i.reason==='Diagnostic gap'));
 p.attempts=p.attempts.filter(a=>a.diagnostic);next=plan(p,course,data.cards,at,2);assert(next.queue.some(i=>i.reason==='Diagnostic gap'));assert(next.queue.some(i=>i.exerciseId?.startsWith('9b.')));
 p.lessons=[];p.attempts=[];next=plan(p,course,data.cards,at,3);for(const item of next.queue.filter(i=>i.kind==='exercise')){const e=course.exercises.find(e=>e.id===item.exerciseId);for(const id of e.objectiveIds)assert.equal(course.objectives.find(o=>o.id===id).prerequisites.length,0);}
});
test('every class position gets aligned vocabulary; imported custom filters remain custom',()=>{
 let previous=0;for(const c of course.chapters){const sections=vocabularyScope(c.id,data.sections);const n=eligibleCards(data.cards,{...newProfile('p').settings,sections}).length;assert(n>=previous);previous=n;
  if(c.id==='2b')assert.equal(n,315);if(c.id==='9b')assert.equal(n,940);
  if(c.id.startsWith('pe-'))assert.deepEqual(sections,['pe1','pe2','pe3','pe4']);else assert(sections.includes(c.id));
 }
 const state=emptyStore();delete state.profiles[0].settings.deckMode;state.profiles[0].settings.sections=['1a'];const p=decode(exportBackup(state)).state.profiles[0];assert.equal(p.settings.deckMode,'custom');assert.deepEqual(p.settings.sections,['1a']);
});
test('early finish releases unreached introductions and practice does not consume the daily budget',()=>{
 const at=Date.UTC(2026,9,30,12);let p=newProfile('p');p.settings.newLimit=4;
 for(let i=0;i<2;i++){const s=plan(p,course,data.cards,at+i,20+i,{wordsOnly:true});assert.equal(s.queue.length,4);s.completedAt=at+i;s.endedEarly=true;p.sessions.push(s);}
 const scheduled=plan(p,course,data.cards,at+2,22,{wordsOnly:true});assert.equal(scheduled.queue.length,4);p.sessions.push(scheduled);p=commit(p,scheduled.id,{id:'intro',index:0,correct:true},course,data.cards,at+3);p.sessions.at(-1).completedAt=at+4;
 const practice=plan(p,course,data.cards,at+5,50,{wordsOnly:true,practiceOnly:true});p.sessions.push(practice);p=commit(p,practice.id,{id:'extra',index:0,correct:true},course,data.cards,at+6);
 assert.equal(plan(p,course,data.cards,at+7,23,{wordsOnly:true}).queue.filter(i=>i.newCard).length,3);
});
test('recognition cannot impersonate production, including old incorrectly labelled attempts',()=>{
 const o=course.objectives.find(o=>o.id==='1a.infinitives'),at=Date.now();const ids=['1a.infinitives-1','1a.infinitives-5','1a.infinitives-9'];
 assert(ids.every(id=>!course.exercises.find(e=>e.id===id).production));
 const attempts=Array.from({length:6},(_,i)=>({exerciseId:ids[i%3],objectiveIds:[o.id],timestamp:at+Math.floor(i/3)*86400000,outcome:'correct',assessmentMode:'auto',production:true}));
 assert.notEqual(evidenceState(attempts,o,at+86400000).state,'secure');
 const form=course.objectives.find(o=>o.id==='2a.present-ar');const onePerson=['2a.present-ar-1','2a.present-ar-5','2a.present-ar-11'];
 assert.notEqual(evidenceState(attempts.map((a,i)=>({...a,objectiveIds:[form.id],exerciseId:onePerson[i%3]})),form,at+86400000).state,'secure');
});
test('receptive evidence and coverage link questions without claiming grammar production',()=>{
 const rows=coverage(course);assert.equal(course.objectives.filter(o=>o.receptive).length,42);
 for(const e of course.exercises.filter(e=>['reading','listening'].includes(e.kind))){assert(e.objectiveIds.length);assert(e.objectiveIds.every(id=>course.objectives.find(o=>o.id===id).skillType===e.kind));assert.equal(e.production,false);}
 assert.equal(rows.find(r=>r.objectiveId==='2b.estar').reading,0);assert.equal(rows.find(r=>r.objectiveId==='2b.reading').reading,3);assert.equal(rows.find(r=>r.objectiveId==='2b.listening').listening,3);
});
test('daily applications rotate questions, dictation and personal writing/speaking',()=>{
 const p=newProfile('rotate');p.lessons=course.objectives.map(o=>o.id);const seen={reading:new Set(),listening:new Set(),personal:new Set()};
 for(let i=0;i<5;i++){const next=plan(p,course,data.cards,Date.UTC(2026,9,30+i,12),7+i);
  for(const q of next.queue.filter(q=>q.kind==='exercise')){const e=course.exercises.find(e=>e.id===q.exerciseId);if(['reading','listening','writing','speaking'].includes(e.kind)){assert.equal(e.chapterId,'2b');seen[['writing','speaking'].includes(e.kind)?'personal':e.kind].add(e.id);p.attempts.push({exerciseId:e.id,objectiveIds:e.objectiveIds,outcome:'correct',timestamp:next.createdAt,assessmentMode:e.assessmentMode});}}
 }assert.equal(seen.reading.size,3);assert.equal(seen.listening.size,3);assert.equal(seen.personal.size,2);assert([...seen.listening].some(id=>id.endsWith('dictation')));
});
test('manual queues include opted-in vosotros and explicitly filter tense/person',()=>{
 const p=newProfile('verbs');p.settings.vosotros=true;assert(practiceQueue(p,course,{objectiveId:'2a.present-ar'}).includes('2a.present-ar-vosotros'));
 p.settings.vosotros=false;assert(!practiceQueue(p,course,{objectiveId:'2a.present-ar'}).some(id=>id.endsWith('vosotros')));
 for(const tense of ['present','preterite','affirmative-tú']){const ids=practiceQueue(p,course,{verb:'ir',tense});assert(ids.length);assert(ids.every(id=>course.exercises.find(e=>e.id===id).verbEvidence.tense===tense));}
 const yo=practiceQueue(p,course,{verb:'ir',tense:'preterite',person:'yo'});assert(yo.length);assert(yo.every(id=>course.exercises.find(e=>e.id===id).verbEvidence.person==='yo'));
});
