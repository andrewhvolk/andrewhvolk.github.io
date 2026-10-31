import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {course} from '../content/course.mjs';
import {newProfile,emptyStore,commit,evidenceState,boundary,nextReview,undo} from '../src/engine.mjs';
import {guidedPlan,startWarmup,nextLearningStep,learningFocus,readyForNext,learningVocabularySettings,needsOnboarding} from '../src/guidance.mjs';
import {previewBackup,exportBackup} from '../src/persistence.mjs';
const data=JSON.parse(await readFile(new URL('../content/vocabulary.json',import.meta.url),'utf8'));
const at=+new Date(2026,9,31,12),focus=(p,time=at)=>learningFocus(p,course,time),daily=(p,time=at,seed=1,options={})=>guidedPlan(p,course,data.cards,data.sections,time,seed,options),next=(p,time=at)=>nextLearningStep(p,course,data.cards,data.sections,time);
const decode=p=>previewBackup(exportBackup({...emptyStore(),profiles:[p],activeProfile:p.id}),data.cards,data.sections,course).state.profiles[0];
function answer(p,e,time=at,extra={}){p.attempts.push({id:`a-${p.attempts.length}`,sessionId:'synthetic',exerciseId:e.id,cardId:null,objectiveIds:e.objectiveIds,answer:e.acceptedAnswers[0],outcome:'correct',timestamp:time,direction:null,usedHint:false,revealed:false,retry:false,practiceOnly:false,diagnostic:false,production:e.production,assessmentMode:e.assessmentMode,...extra});}
function introduce(p,o,time=at){for(const e of course.exercises.filter(e=>e.objectiveIds.includes(o.id)&&e.assessmentMode==='auto'&&e.production&&!e.vosotros).slice(0,3))answer(p,e,time);}
function warmup(p,correct=()=>false,time=at){const s=startWarmup(p,course,time);p.sessions.push(s);p.activeSession=s.id;for(let i=0;i<s.queue.length;i++){const e=course.exercises.find(e=>e.id===s.queue[i].exerciseId);p=commit(p,s.id,{id:`${s.id}:${i}`,index:i,answer:correct(e)?e.acceptedAnswers[0]:''},course,data.cards,time+i);}return p;}

test('one-click warm-up uses five real items, stays provisional and survives a backup',()=>{
 let p=newProfile('p');p=warmup(p,e=>e.id==='pe.greetings-2'||e.id==='pe.numbers-time-1');
 assert.equal(p.sessions[0].queue.length,5);assert.deepEqual(p.progress,{});assert.equal(p.history.length,0);
 assert.equal(focus(p).objective.id,'1b.articles');assert.equal(evidenceState(p.attempts,course.objectives.find(o=>o.id==='1b.articles'),at).state,'provisional');
 const restored=decode(p);assert.equal(restored.sessions[0].warmup,true);assert.equal(focus(restored).objective.id,'1b.articles');
});
test('a new learner gets a coherent introductory lesson and manageable words without settings',()=>{
 const p=newProfile('p'),before=structuredClone(p),s=daily(p);
 assert.equal(s.guided,true);assert.equal(s.focusObjectiveId,'pe.greetings');assert.equal(s.queue[0].kind,'exercise');
 assert.equal(s.queue.filter(i=>i.newCard).length,3);assert.equal(s.queue.filter(i=>i.exerciseId&&course.exercises.find(e=>e.id===i.exerciseId).objectiveIds.includes(s.focusObjectiveId)).length,4);
 assert.deepEqual(daily(p),s);assert.deepEqual(p,before);
 assert(s.queue.filter(i=>i.cardId).every(i=>data.cards.find(c=>c.id===i.cardId).sections.some(id=>id.startsWith('pe'))));
});
test('independent initial progress advances the lesson without claiming secure mastery',()=>{
 const p=newProfile('p'),o=focus(p).objective;introduce(p,o);
 assert(readyForNext(p,o));assert.notEqual(focus(p).objective.id,o.id);assert.notEqual(evidenceState(p.attempts,o,at).state,'secure');
 const supported=newProfile('s');introduce(supported,o);supported.attempts.forEach(a=>a.usedHint=true);assert.equal(readyForNext(supported,o),false);
});
test('a recent difficulty is selected ahead of new work, while resolved diagnostic gaps retire',()=>{
 let p=warmup(newProfile('p'),()=>true);const e=course.exercises.find(e=>e.id==='1b.articles-1');answer(p,e,at+100,{outcome:'incorrect'});
 assert.equal(focus(p,at+200).objective.id,'1b.articles');assert.match(focus(p,at+200).reason,/recent answer/);
 p=warmup(newProfile('p'),()=>false);const o=course.objectives.find(o=>o.id==='pe.greetings');introduce(p,o,at+500);
 assert.notEqual(focus(p,at+1000).objective.id,o.id);
});
test('automatic path reaches later chapters; explicit class and custom vocabulary limits remain honored',()=>{
 const p=newProfile('p');for(const o of course.objectives.filter(o=>!o.receptive&&o.chapterId!=='9b'))introduce(p,o);
 assert.equal(focus(p).objective.chapterId,'9b');assert(learningVocabularySettings(p,course,data.sections,at).sections.includes('9b'));
 p.settings.pathMode='class';p.settings.position='2b';assert.notEqual(focus(p).objective.chapterId,'9b');
 p.settings.deckMode='custom';p.settings.sections=['1a'];const s=daily(p);
 assert(s.queue.filter(i=>i.cardId).every(i=>data.cards.find(c=>c.id===i.cardId).sections.includes('1a')));
});
test('due words take precedence, earlier introduced words remain reviewable after a new placement',()=>{
 const p=newProfile('p'),late=data.cards.find(c=>c.sections.includes('9b'));
 p.progress[late.id]=nextReview(null,false,boundary(at,-10));const s=daily(p);
 assert.equal(s.queue[0].cardId,late.id);assert.equal(s.queue[0].newCard,false);
 for(let i=0;i<12;i++){const c=data.cards[i];p.progress[c.id]=nextReview(null,false,boundary(at,-5));}
 const busy=daily(p);assert.equal(busy.queue.filter(i=>i.kind==='vocabulary').length,8);assert(!busy.queue.some(i=>i.newCard));
});
test('only one recommended continuation resumes its exact captured queue, settings and draft',()=>{
 let p=newProfile('p');const s=daily(p);p.sessions.push(s);p.activeSession=s.id;
 const e=course.exercises.find(e=>e.id===s.queue[0].exerciseId);p=commit(p,s.id,{id:'saved',index:0,answer:e.acceptedAnswers[0]},course,data.cards,at);
 p.sessions[0].drafts[1]={answer:'mañana'};p.settings.minutes=20;p.settings.position='9b';
 const restored=decode(p),step=next(restored);assert.equal(step.kind,'resume');assert.equal(step.session.cursor,1);assert.equal(step.session.settings.minutes,15);assert.equal(step.session.drafts[1].answer,'mañana');assert.deepEqual(step.session.queue,s.queue);
 const other=newProfile('other');assert.equal(next(other).kind,'start');
});
test('daily completion yields a stopping point; tomorrow offers a fresh plan and early stopping does not count as completion',()=>{
 let p=newProfile('p');const s=daily(p);p.sessions.push(s);p.activeSession=s.id;
 for(let i=0;i<s.queue.length;i++){const item=s.queue[i],e=course.exercises.find(e=>e.id===item.exerciseId);p=commit(p,s.id,{id:'full-'+i,index:i,answer:e?.acceptedAnswers?.[0]||'Mi respuesta.',correct:true},course,data.cards,at+i);}
 assert.equal(next(p,at+100).kind,'done');assert.equal(next(p,boundary(at,1)+43200000).kind,'start');
 const restored=decode(p);assert.equal(next(restored,at+100).kind,'done');const reversed=undo(p,s.id);assert.equal(next(reversed,at+100).kind,'resume');
 p.sessions[0].endedEarly=true;assert.equal(next(p,at+100).kind,'start');
});
test('pending new-word reservations and extra practice cannot inflate the daily introductions',()=>{
 const p=newProfile('p'),a=daily(p);p.sessions.push(a);
 assert.equal(daily(p,at+1).queue.filter(i=>i.newCard).length,0);
 p.sessions[0].completedAt=at+2;p.sessions[0].endedEarly=true;assert.equal(daily(p,at+3).queue.filter(i=>i.newCard).length,3);
 const extra=daily(p,at+4,1,{extra:true});assert.equal(extra.practiceOnly,true);assert.equal(extra.guided,true);
});
test('old v2 preferences and pending sessions keep class limits and exact due timestamps',()=>{
 let p=newProfile('p');const s=daily(p);p.sessions.push(s);p.activeSession=s.id;
 const card=data.cards[0];p.progress[card.id]=nextReview(null,true,at);delete p.settings.pathMode;delete p.sessions[0].settings.pathMode;
 const restored=decode(p);assert.equal(restored.settings.pathMode,'class');assert.equal(restored.sessions[0].settings.pathMode,'class');assert.equal(restored.progress[card.id].due,p.progress[card.id].due);assert.deepEqual(restored.sessions[0].queue,p.sessions[0].queue);
 for(const value of ['bad',false,{}]){restored.settings.pathMode=value;assert.throws(()=>decode(restored),/settings.pathMode/);}
});
test('returning/imported learning is not sent through setup and guided metadata is validated',()=>{
 const p=newProfile('p');assert(needsOnboarding(p));p.progress[data.cards[0].id]=nextReview(null,true,at);assert(!needsOnboarding(p));
 const session=daily(p);p.sessions.push(session);
 for(const [key,value]of [['guided','yes'],['warmup',1],['policyVersion',2],['focusObjectiveId','other']]){const bad=structuredClone(p);bad.sessions[0][key]=value;assert.throws(()=>decode(bad),/learning path/);}
});
