/** Read-only audit of the learning policy, not a replacement policy or learner study.
 * Run from any directory: node projects/Palabra/app/docs/research/learning-probes.mjs
 * JSON goes to stdout; no learner data is read and no app state is written.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {course} from '../../content/course.mjs';
import {newProfile,plan,nextReview,boundary,dayKey,evidenceState,commit,eligibleCards} from '../../src/engine.mjs';

// Freeze the audited defaults: the live UI now uses guidance.mjs and a three-word ceiling.
const baselineProfile=id=>{const p=newProfile(id);p.settings.newLimit=10;p.settings.pathMode='class';return p;};
const data=JSON.parse(await readFile(new URL('../../content/vocabulary.json',import.meta.url),'utf8'));
const at=+new Date(2026,0,5,12), results={};
results.content={cards:data.cards.length,chapters:course.chapters.length,objectives:course.objectives.length,lessons:course.lessons.length,activities:course.exercises.length,stimuli:course.stimuli.length,diagnosticQuestions:course.diagnostic.length};
results.plans=[10,15,20].map(minutes=>{
 const p=baselineProfile('synthetic');p.settings.minutes=minutes;
 const a=plan(p,course,data.cards,at,1);
 const full=structuredClone(p);full.lessons=course.objectives.map(o=>o.id);
 const b=plan(full,course,data.cards,at,1);
 return {minutes,newWordCeiling:p.settings.newLimit,firstPlan:{total:a.queue.length,vocabulary:a.queue.filter(i=>i.kind==='vocabulary').length},afterPrerequisiteLessons:{total:b.queue.length,vocabulary:b.queue.filter(i=>i.kind==='vocabulary').length}};
});
assert.equal(results.plans[1].firstPlan.vocabulary,5);
assert.equal(results.plans[1].afterPrerequisiteLessons.total,17);

let previous=null,clock=at;
results.correctVocabularyTrace=[];
for(let i=0;i<6;i++){
 previous=nextReview(previous,true,clock);
 results.correctVocabularyTrace.push({reviewDay:dayKey(clock),box:previous.box,nextDue:dayKey(previous.due)});
 clock=previous.due+12*60*60*1000;
}
assert.equal(results.correctVocabularyTrace[0].box,2);
assert.equal(results.correctVocabularyTrace[0].nextDue,'2026-01-07');

const p=baselineProfile('synthetic'), s=plan(p,course,data.cards,at,1);p.sessions.push(s);
const first=s.queue[0];assert.equal(first.kind,'vocabulary');
const after=commit(p,s.id,{id:'audit-wrong',index:0,correct:false,answer:''},course,data.cards,at);
results.wrongVocabulary={box:after.progress[first.cardId].box,nextDue:dayKey(after.progress[first.cardId].due),laterOccurrencesInPlan:after.sessions[0].queue.slice(1).filter(i=>i.cardId===first.cardId).length};
assert.equal(results.wrongVocabulary.laterOccurrencesInPlan,0);

const objective=course.objectives.find(o=>o.id==='2a.present-ar');
const ids=['2a.present-ar-1','2a.present-ar-2','2a.present-ar-6'];
const midnight=+new Date(2026,0,5,23,59);
const independent=(id,timestamp)=>({exerciseId:id,objectiveIds:[objective.id],outcome:'correct',timestamp,assessmentMode:'auto',production:true});
const rapid=Array.from({length:6},(_,i)=>independent(ids[i%3],midnight+i*24000));
results.midnightSkill={elapsedSeconds:(rapid.at(-1).timestamp-rapid[0].timestamp)/1000,...evidenceState(rapid,objective,rapid.at(-1).timestamp)};
assert.equal(results.midnightSkill.state,'secure');

const reading=course.objectives.find(o=>o.receptive&&course.exercises.some(e=>e.kind==='reading'&&e.objectiveIds.includes(o.id)));
const questions=course.exercises.filter(e=>e.kind==='reading'&&e.objectiveIds.includes(reading.id));
const readingAttempts=Array.from({length:6},(_,i)=>({exerciseId:questions[i%3].id,objectiveIds:[reading.id],timestamp:boundary(at,Math.floor(i/3)),outcome:'correct',assessmentMode:'auto',production:false}));
results.readingSkill={objective:reading.id,distinctStimuli:new Set(questions.map(e=>e.stimulusId)).size,...evidenceState(readingAttempts,reading,boundary(at,1))};
assert.equal(results.readingSkill.state,'secure');
assert.equal(results.readingSkill.distinctStimuli,1);

results.matureDeckWorkload=['2b','9b'].map(position=>{
 const learner=baselineProfile('synthetic');learner.settings.position=position;
 learner.settings.sections=data.sections.filter(section=>section.id.startsWith('pe')||data.sections.indexOf(section)<=data.sections.findIndex(x=>x.id===position)).map(section=>section.id);
 const n=eligibleCards(data.cards,learner.settings).length;
 return {position,activeIntroducedCardsAssumed:n,nominalDailyDemand:n/14,nominalDemandPerSchoolday:n/10,defaultDailyVocabularyCapacity:5,minimumCycleDaysAtThatCapacity:Math.ceil(n/5)};
});
assert.equal(results.matureDeckWorkload[0].activeIntroducedCardsAssumed,315);
assert.equal(results.matureDeckWorkload[1].activeIntroducedCardsAssumed,940);

// All selected cards start in box 5, due dates spread evenly over the next 14 days.
// Perfect recall, no introductions, one default plan per calendar day, 56 days.
results.syntheticMaintenance=results.matureDeckWorkload.map(({position,activeIntroducedCardsAssumed:n})=>{
 const cards=data.cards.slice(0,n), memory=cards.map((card,i)=>({id:card.id,...nextReview({box:5,reviews:5,correct:5},true,boundary(at,Math.floor(i*14/n)-14))}));
 let reviews=0;
 for(let day=0;day<56;day++){
  const now=boundary(at,day)+12*60*60*1000;
  const due=memory.filter(x=>x.due<=now).sort((a,b)=>a.due-b.due).slice(0,5);
  for(const card of due){Object.assign(card,nextReview(card,true,now));reviews++;}
 }
 const end=boundary(at,55)+12*60*60*1000;
 const overdue=memory.filter(x=>x.due<=end);
 return {position,days:56,reviews,stillDue:overdue.length,oldestDueAgeCalendarDays:overdue.length?Math.round((boundary(end,0)-Math.min(...overdue.map(x=>x.due)))/86400000):0};
});
console.log(JSON.stringify(results,null,2));
