// Read-only synthetic audit probes, not application changes or tests that endorse the bugs.
// Run from the app directory: node docs/audit/reproduce.mjs
import {readFile} from 'node:fs/promises';
import {course} from '../../content/course.mjs';
import {newProfile,emptyStore,plan,commit,evidenceState,startDiagnostic} from '../../src/engine.mjs';
import {exportBackup,previewBackup} from '../../src/persistence.mjs';
const data=JSON.parse(await readFile(new URL('../../content/vocabulary.json',import.meta.url),'utf8'));
const at=new Date(2026,9,30,12).getTime(),out={};
const restore=raw=>previewBackup(raw,data.cards,data.sections,course);

// Harmless HTML only: never executes a script, event handler or network request.
const legacy={format:'palabra-backup',version:1,progress:{},history:[],settings:{sections:['1a'],direction:'es-en',limit:10,minutes:'<b id="audit-injected">AUDIT MARKUP</b>',newLimit:'NOT A NUMBER'}};
const migrated=restore(JSON.stringify(legacy));
out.unsafeLegacySettings={minutes:migrated.state.profiles[0].settings.minutes,newLimit:migrated.state.profiles[0].settings.newLimit};
try{restore(exportBackup(migrated.state));out.legacyRoundTrip='accepted';}catch(error){out.legacyRoundTrip=error.message;}

const p=newProfile('audit');p.settings.position='9b';p.settings.newLimit=0;p.lessons=course.objectives.map(o=>o.id);
const diagnostic=startDiagnostic(p,course,at-4*86400000);
for(const [i,item]of diagnostic.queue.entries()){
 const e=course.exercises.find(e=>e.id===item.exerciseId);
 p.attempts.push({id:'d'+i,sessionId:diagnostic.id,exerciseId:e.id,objectiveIds:e.objectiveIds,outcome:'incorrect',diagnostic:true,timestamp:at-4*86400000,assessmentMode:'auto',production:e.production});
}
const sampledIds=[...new Set(p.attempts.flatMap(a=>a.objectiveIds))];
for(const id of sampledIds){
 const variants=course.exercises.filter(e=>e.objectiveIds.includes(id));
 for(let i=0;i<6;i++)p.attempts.push({id:id+i,sessionId:'secure-'+i,exerciseId:variants[i%3].id,objectiveIds:[id],outcome:'correct',diagnostic:false,timestamp:at-2*86400000+Math.floor(i/3)*86400000,assessmentMode:'auto',production:true});
}
const daily=plan(p,course,data.cards,at,1);
out.resolvedDiagnosticGaps={allSampledObjectivesSecure:sampledIds.every(id=>evidenceState(p.attempts,course.objectives.find(o=>o.id===id),at).state==='secure'),currentChapterObjectiveItems:daily.queue.filter(i=>i.exerciseId?.startsWith('9b.')).length,selected:daily.queue.filter(i=>i.kind==='exercise').map(i=>({id:i.exerciseId,reason:i.reason}))};

let full=newProfile('audit-large');full.settings.sections=data.sections.map(s=>s.id);full.settings.limit=50;full.settings.newLimit=0;
for(const [i,card]of data.cards.entries())full.progress[card.id]={box:1,reviews:1,correct:0,lastReview:at-2*86400000,due:at-1000-i};
const initial=emptyStore();initial.profiles=[full];initial.activeProfile=full.id;
// Prove that the starting progress collection is valid and restorable first.
full=restore(exportBackup(initial)).state.profiles[0];
const session=plan(full,course,data.cards,at,5,{wordsOnly:true});full.sessions.push(session);full.activeSession=session.id;
for(let i=0;i<session.queue.length;i++)full=commit(full,session.id,{id:'large'+i,index:i,correct:true},course,data.cards,at+i);
const state=emptyStore();state.profiles=[full];state.activeProfile=full.id;
const backup=exportBackup(state);out.backupGrowth={validStartingCards:data.cards.length,reviews:session.queue.length,exportCharacters:backup.length,exportBytes:Buffer.byteLength(backup)};
try{restore(backup);out.backupGrowth.restore='accepted';}catch(error){out.backupGrowth.restore=error.message;}

const objective=course.objectives.find(o=>o.id==='1a.infinitives');
const choices=['1a.infinitives-1','1a.infinitives-5','1a.infinitives-9'].map(id=>course.exercises.find(e=>e.id===id));
const attempts=Array.from({length:6},(_,i)=>({objectiveIds:[objective.id],exerciseId:choices[i%3].id,outcome:'correct',assessmentMode:'auto',production:choices[i%3].production,timestamp:at-86400000+Math.floor(i/3)*86400000}));
out.recognitionAsProduction={items:choices.map(e=>({prompt:e.prompt,production:e.production})),evidence:evidenceState(attempts,objective,at)};

const early=newProfile('early');
for(let i=0;i<2;i++){const s=plan(early,course,data.cards,at+i,10+i);s.completedAt=at+i;s.endedEarly=true;early.sessions.push(s);}
out.earlyFinishBudget={answers:early.attempts.length,reservedWords:early.sessions.flatMap(s=>s.queue).filter(i=>i.newCard).length,nextPlanNewWords:plan(early,course,data.cards,at+10,99).queue.filter(i=>i.newCard).length};

const allAr=course.exercises.filter(e=>e.objectiveIds.includes('2a.present-ar'));
const ir=course.exercises.filter(e=>e.verbEvidence?.verb==='ir'&&!e.vosotros);
out.queueTruncation={arVariantsWithVosotros:allAr.length,vosotrosInFirst12:allAr.slice(0,12).filter(e=>e.vosotros).length,irAvailableTenses:[...new Set(ir.map(e=>e.verbEvidence.tense))],irFirst12Tenses:[...new Set(ir.slice(0,12).map(e=>e.verbEvidence.tense))]};
const later=newProfile('later');later.settings.position='9b';
out.vocabularyScope={position:later.settings.position,selectedCards:data.cards.filter(c=>c.sections.some(s=>later.settings.sections.includes(s))).length};
out.comprehensionTags={readingQuestions:course.exercises.filter(e=>e.kind==='reading').length,readingWithObjectiveIds:course.exercises.filter(e=>e.kind==='reading'&&e.objectiveIds.length).length,listeningWithObjectiveIds:course.exercises.filter(e=>e.kind==='listening'&&e.objectiveIds.length).length};
const repeated=newProfile('repeated');repeated.settings.newLimit=0;repeated.lessons=course.objectives.map(o=>o.id);
out.comprehensionSelection=[];
for(let i=0;i<5;i++){
 const s=plan(repeated,course,[],at+i*86400000,i);repeated.sessions.push(s);
 const selected=s.queue.filter(q=>['reading','listening'].includes(course.exercises.find(e=>e.id===q.exerciseId)?.kind));
 out.comprehensionSelection.push(selected.map(q=>q.exerciseId));
 for(const item of selected){const e=course.exercises.find(e=>e.id===item.exerciseId);repeated.attempts.push({exerciseId:e.id,objectiveIds:e.objectiveIds,outcome:'correct',assessmentMode:'auto',timestamp:at+i*86400000});}
}
console.log(JSON.stringify(out,null,2));
