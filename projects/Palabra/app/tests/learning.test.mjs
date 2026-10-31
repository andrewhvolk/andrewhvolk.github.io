import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {course} from '../content/course.mjs';
import {conjugate,verbs,PERSONS} from '../content/verbs.mjs';
import {nextReview,boundary,dayKey,grade,evidenceState,diagnosticReport,emptyStore,newProfile,plan,commit,undo,startDiagnostic} from '../src/engine.mjs';
import {previewBackup,exportBackup,memoryRepository,openRepository} from '../src/persistence.mjs';
import {validateContent,coverage} from '../src/validation.mjs';
const data=JSON.parse(await readFile(new URL('../content/vocabulary.json',import.meta.url),'utf8'));
const at=new Date(2026,9,30,12).getTime(), card=data.cards[0];
const decode=raw=>previewBackup(raw,data.cards,data.sections,course);
const sessionProfile=()=>{const p=newProfile('p');const s=plan(p,course,data.cards,at,10,{wordsOnly:true});p.sessions.push(s);p.activeSession=s.id;return p;};
test('destination boxes, reset, cap, local midnight, and unchanged legacy time',()=>{
 const first=nextReview(null,true,at);assert.equal(first.box,2);assert.equal(first.due,boundary(at,2));
 assert.equal(nextReview({...first,box:5},true,at).box,5);assert.equal(nextReview(first,false,at).due,boundary(at,1));
 assert.equal(nextReview(first,false,at).box,1);assert.equal(first.reviews,1);assert.equal(first.correct,1);
 const legacy={format:'palabra-backup',version:1,progress:{[card.id]:{...first,due:at+1234567}},history:[],settings:{direction:'es-en',limit:20,sections:['1a']}};
 assert.equal(decode(JSON.stringify(legacy)).state.profiles[0].progress[card.id].due,at+1234567);
});
test('calendar scheduling across DST and time-zone changes',()=>{
 const original=process.env.TZ;try{
  process.env.TZ='America/New_York';const before=new Date(2026,9,31,12).getTime(),due=boundary(before,2);assert.equal(new Date(due).getDate(),2);assert.equal(new Date(due).getHours(),0);assert.equal(due-before,37*60*60*1000);
  const spring=new Date(2026,2,7,12).getTime();assert.equal(new Date(boundary(spring,2)).getDate(),9);assert.equal(boundary(spring,2)-spring,35*60*60*1000);
  process.env.TZ='America/Los_Angeles';assert.equal(new Date(due).getTime(),due);assert.equal(new Date(boundary(due,1)).getHours(),0);
 }finally{if(original===undefined)delete process.env.TZ;else process.env.TZ=original;}
});
test('due priority, deterministic plan, daily introductions and zero-new setting',()=>{
 const p=newProfile('p');p.settings.newLimit=2;const cards=data.cards.filter(c=>c.sections.some(s=>p.settings.sections.includes(s)));p.progress[cards[0].id]={box:2,reviews:1,correct:1,due:at-200,lastReview:at-500};p.progress[cards[1].id]={box:3,reviews:2,correct:2,due:at-100,lastReview:at-400};
 const a=plan(p,course,data.cards,at,9,{wordsOnly:true});assert.deepEqual(a,plan(p,course,data.cards,at,9,{wordsOnly:true}));assert.deepEqual(a.queue.slice(0,2).map(i=>i.cardId),cards.slice(0,2).map(c=>c.id));assert.equal(a.queue.filter(i=>i.newCard).length,2);
 p.sessions.push(a);const b=plan(p,course,data.cards,at+1000,42,{wordsOnly:true});assert.equal(b.queue.filter(i=>i.newCard).length,0);
 p.settings.newLimit=0;assert.equal(plan(p,course,data.cards,at,10).queue.filter(i=>i.newCard).length,0);
 assert.equal(plan(p,course,data.cards,at+86400000,9,{wordsOnly:true}).queue.filter(i=>i.newCard).length,0);
});
test('planner respects class scope, reviewed content and prerequisite readiness',()=>{
 const p=newProfile('p');const a=plan(p,course,data.cards,at,10);assert(a.queue.some(i=>i.kind==='exercise'));assert(a.queue.some(i=>i.kind==='vocabulary'));
 for(const i of a.queue.filter(i=>i.kind==='exercise')){const e=course.exercises.find(e=>e.id===i.exerciseId);assert.equal(e.reviewStatus,'reviewed');assert(course.chapters.find(c=>c.id===e.chapterId).order<=6);if(e.objectiveIds.length)for(const id of e.objectiveIds)assert.equal(course.objectives.find(o=>o.id===id).prerequisites.length,0);}
 const done=structuredClone(p);done.lessons=course.objectives.map(o=>o.id);done.settings.position='9b';assert(plan(done,course,data.cards,at,1).queue.some(i=>i.exerciseId?.startsWith('9b.')));
});
test('accent-aware NFC grading, punctuation, alternatives, and ñ',()=>{
 const item={acceptedAnswers:['está'],assessmentMode:'auto',feedback:'Location uses estar.'};
 assert.equal(grade(' ESTA\u0301! ',item).outcome,'correct');assert.equal(grade('esta',item).outcome,'accent-or-orthography');assert.equal(grade('están',item).outcome,'incorrect');
 assert.equal(grade('hablo',{...item,acceptedAnswers:['habló']}).outcome,'accent-or-orthography');assert.equal(grade('ano',{...item,acceptedAnswers:['año']}).outcome,'incorrect');
 assert.equal(grade('setiembre',{...item,acceptedAnswers:['septiembre','setiembre']}).outcome,'correct');assert.equal(grade('está usted',item).outcome,'incorrect');
 assert.equal(grade('anything',{assessmentMode:'self'}).outcome,'self-assessed');
});
test('reviewed irregular and exception families match independent anchors',()=>{
 const anchors={estar:['estoy','estás','está','estamos','estáis','están'],ser:['soy','eres','es','somos','sois','son'],ir:['voy','vas','va','vamos','vais','van'],tener:['tengo','tienes','tiene','tenemos','tenéis','tienen'],venir:['vengo','vienes','viene','venimos','venís','vienen'],jugar:['juego','juegas','juega','jugamos','jugáis','juegan'],poder:['puedo','puedes','puede','podemos','podéis','pueden'],dormir:['duermo','duermes','duerme','dormimos','dormís','duermen'],pensar:['pienso','piensas','piensa','pensamos','pensáis','piensan'],querer:['quiero','quieres','quiere','queremos','queréis','quieren'],preferir:['prefiero','prefieres','prefiere','preferimos','preferís','prefieren'],decir:['digo','dices','dice','decimos','decís','dicen'],pedir:['pido','pides','pide','pedimos','pedís','piden'],servir:['sirvo','sirves','sirve','servimos','servís','sirven'],saber:['sé','sabes','sabe','sabemos','sabéis','saben'],conocer:['conozco','conoces','conoce','conocemos','conocéis','conocen']};
 for(const [verb,forms]of Object.entries(anchors))for(const [i,form]of forms.entries())assert.equal(conjugate(verb,'present',PERSONS[i]),form,verb+' '+PERSONS[i]);
 for(const [v,form]of Object.entries({decir:'di',hacer:'haz',ir:'ve',poner:'pon',salir:'sal',ser:'sé',tener:'ten',venir:'ven'}))assert.equal(conjugate(v,'affirmative-tú','tú'),form);
 for(const [v,form]of Object.entries({buscar:'busqué',pagar:'pagué',llegar:'llegué',comprar:'compré',comer:'comí',escribir:'escribí',hacer:'hice',dar:'di',ir:'fui'}))assert.equal(conjugate(v,'preterite','yo'),form);
 assert.equal(conjugate('hacer','preterite','él/ella/usted'),'hizo');assert.equal(conjugate('dar','preterite','él/ella/usted'),'dio');assert.equal(conjugate('buscar','preterite','tú'),'buscaste');
 assert.throws(()=>conjugate('conducir','present','yo'));assert.throws(()=>conjugate('hablar','subjunctive','yo'));
});
test('resume, idempotent commits, undo and same-day rechecks',()=>{
 const p=sessionProfile(),s=p.sessions[0];const id=`${s.id}:0`,input={id,index:0,correct:true,answer:'test'};
 const a=commit(p,s.id,input,course,data.cards,at);assert.equal(a.sessions[0].cursor,1);const cardId=s.queue[0].cardId;assert.equal(a.progress[cardId].box,2);
 const reloaded=decode(exportBackup({...emptyStore(),profiles:[a],activeProfile:a.id})).state.profiles[0];assert.equal(reloaded.sessions[0].cursor,1);assert.deepEqual(commit(reloaded,s.id,input,course,data.cards,at+1000),reloaded);
 assert.throws(()=>commit(a,s.id,{...input,id:'other'},course,data.cards,at));
 assert.deepEqual(undo(a,s.id),p);
 const second=structuredClone(a);second.sessions[0].queue.push({...s.queue[0]});second.sessions[0].cursor=second.sessions[0].queue.length-1;
 const b=commit(second,s.id,{id:'retry-card',index:second.sessions[0].cursor,correct:true},course,data.cards,at+2000);assert.equal(b.progress[cardId].box,2);assert.equal(b.attempts.at(-1).practiceOnly,true);
});
test('practice-only isolation and profile isolation',()=>{
 const p=newProfile('p');const s=plan(p,course,data.cards,at,1,{wordsOnly:true,practiceOnly:true});p.sessions.push(s);p.activeSession=s.id;const updated=commit(p,s.id,{id:'x',index:0,correct:true},course,data.cards,at);assert.deepEqual(updated.progress,{});assert.deepEqual(updated.history,[]);assert(updated.attempts[0].practiceOnly);
 const other=newProfile('other');assert.equal(other.sessions.length,0);assert.equal(other.attempts.length,0);assert.equal(p.attempts.length,0);
});
test('undo cannot erase work committed in a later session',()=>{
 let p=sessionProfile();const first=p.sessions[0];p=commit(p,first.id,{id:'first',index:0,correct:true},course,data.cards,at);
 const second=plan(p,course,data.cards,at+1000,88,{wordsOnly:true,practiceOnly:true});p.sessions.push(second);p=commit(p,second.id,{id:'second',index:0,correct:false},course,data.cards,at+2000);
 assert.throws(()=>undo(p,first.id),/most recent/);assert.equal(p.attempts.length,2);
 const captured=structuredClone(second.settings);p.settings.direction='en-es';assert.deepEqual(second.settings,captured);
});
test('undo after a revealed exercise cannot turn a known answer into independent evidence',()=>{
 const p=newProfile('p'),s=startDiagnostic(p,course,at);s.diagnostic=false;p.sessions.push(s);p.activeSession=s.id;
 const e=course.exercises.find(e=>e.id===s.queue[0].exerciseId);const a=commit(p,s.id,{id:'seen',index:0,answer:e.acceptedAnswers[0]},course,data.cards,at);
 const restored=undo(a,s.id);assert.equal(restored.attempts.length,0);assert.equal(restored.sessions[0].drafts[0].retry,true);
 const b=commit(restored,s.id,{id:'seen',index:0,answer:e.acceptedAnswers[0]},course,data.cards,at+1000);assert(b.attempts[0].retry);assert.equal(evidenceState(b.attempts,course.objectives[0],at).n,0);
});
test('secure evidence requires independent cross-day and cross-variant production',()=>{
 const o=course.objectives.find(o=>o.id==='2a.present-ar');
 const attempts=Array.from({length:6},(_,i)=>({id:String(i),objectiveIds:[o.id],exerciseId:['2a.present-ar-1','2a.present-ar-2','2a.present-ar-6'][i%3],timestamp:at+Math.floor(i/3)*86400000,outcome:'correct',assessmentMode:'auto',production:true}));
 assert.equal(evidenceState(attempts.slice(0,1),o,at).state,'learning');assert.equal(evidenceState(attempts,o,at+86400000).state,'secure');
 for(const flag of ['usedHint','revealed','retry','practiceOnly','diagnostic'])assert.notEqual(evidenceState(attempts.map(a=>({...a,[flag]:true})),o,at).state,'secure');
 assert.notEqual(evidenceState(attempts.map(a=>({...a,timestamp:at})),o,at).state,'secure');assert.notEqual(evidenceState(attempts.map(a=>({...a,production:false})),o,at).state,'secure');
 assert.equal(evidenceState(attempts,o,boundary(at,20)).state,'needs-review');
});
test('20-question diagnostic spans catch-up and preserves vocabulary',()=>{
 const p=newProfile('p');p.sessions.push(startDiagnostic(p,course,at));const id=p.sessions[0].id;let current=p;
 for(let i=0;i<20;i++){const e=course.exercises.find(e=>e.id===course.diagnostic[i]);current=commit(current,id,{id:'d'+i,index:i,answer:i===14?'estudian':e.acceptedAnswers[0]},course,data.cards,at+i);}
 assert.deepEqual(current.progress,{});assert.equal(current.attempts.length,20);const report=diagnosticReport(current.attempts,course.objectives);assert(report.find(r=>r.id==='2a.present-ar').recommendation.includes('Review'));assert.equal(report.find(r=>r.id==='2a.present-ar').correct,1);assert(report.filter(r=>r.tested).length>=15);
});
test('v1 migration retains exact records, unknown recovery, no invented mastery',()=>{
 const progress={[card.id]:{box:4,reviews:9,correct:7,lastReview:at-1000,due:at+9999},unknown:{box:1,reviews:1,correct:0,lastReview:at,due:at}};
 const input={format:'palabra-backup',version:1,progress,history:[{id:card.id,correct:true,at}],settings:{sections:['1a'],direction:'en-es',limit:30,verbsOnly:true}};
 const {state,summary}=decode(JSON.stringify(input));assert.deepEqual(state.profiles[0].progress[card.id],progress[card.id]);assert.equal(summary.unmatched,1);assert.equal(summary.migrated,1);assert.equal(state.recovery[0].raw.progress.unknown.box,1);assert.equal(state.profiles[0].attempts.length,0);assert.equal(state.profiles[0].settings.direction,'en-es');assert.deepEqual(decode(exportBackup(state)).state,state);
 const broken=structuredClone(input);broken.progress[card.id].correct=99;assert.throws(()=>decode(JSON.stringify(broken)));assert.equal(progress[card.id].correct,7);
});
test('strict atomic malformed, oversized, version and unsafe-state rejection',()=>{
 assert.throws(()=>decode('{'));assert.throws(()=>decode('x'.repeat(64*1024*1024+1)));assert.throws(()=>decode(JSON.stringify({format:'palabra-backup',version:3})));
 const s=emptyStore();s.profiles[0].displayName='<img src=x onerror=alert(1)>';assert.equal(decode(exportBackup(s)).state.profiles[0].displayName,s.profiles[0].displayName);
 s.profiles[0].lessons=['missing'];assert.throws(()=>decode(exportBackup(s)));s.profiles[0].lessons=[];s.contentVersion='future';assert.throws(()=>decode(exportBackup(s)));
});
test('storage failure, interrupted migration and conflict detection',async()=>{
 const repo=memoryRepository();const first=await repo.write(emptyStore(),0);assert.equal(first.revision,1);await assert.rejects(repo.write(emptyStore(),0),/Another tab/);assert.equal((await repo.read()).revision,1);
 await assert.rejects(openRepository(null),/cannot open/);const faulty={async write(){throw Error('Quota exceeded');}};const migration=decode(JSON.stringify({format:'palabra-backup',version:1,progress:{},settings:{sections:['1a'],direction:'es-en',limit:10}})).state;
 await assert.rejects(faulty.write(migration,0),/Quota/);assert.equal(migration.recovery[0].raw.version,1);assert.equal((await repo.read()).revision,1);
});
test('full content integrity, every objective minimum, and unchanged vocabulary IDs',async()=>{
 assert.deepEqual(validateContent(course,data.cards,data.sections),[]);assert.equal(coverage(course).length,90);assert(coverage(course).filter(r=>!course.objectives.find(o=>o.id===r.objectiveId).receptive).every(r=>r.reviewedItemCount>=12&&r.contexts.length>=3&&r.production));assert(coverage(course).filter(r=>course.objectives.find(o=>o.id===r.objectiveId).receptive).every(r=>r.reviewedItemCount>=3&&!r.production));
 const vocabularyBytes=await readFile(new URL('../content/vocabulary.json',import.meta.url));assert.equal(createHash('sha256').update(vocabularyBytes).digest('hex'),'aa03513f9d70a85cc964cf35a868bd0e57163da98d50bdcfbbb2f4189be3772f');
 for(const e of course.exercises.filter(e=>e.assessmentMode==='auto'))for(const answer of e.acceptedAnswers)assert.equal(grade(answer,e).outcome,'correct',e.id);
 const c=structuredClone(course);c.objectives[0].prerequisites=[c.objectives[0].id];assert(validateContent(c,data.cards,data.sections).some(e=>e.includes('cycle')));
});
