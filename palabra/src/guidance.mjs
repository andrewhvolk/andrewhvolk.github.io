/** One saved next step, without a student having to construct a practice set.
 * Initial lesson progress is deliberately distinct from engine.evidenceState mastery.
 * This policy does not change vocabulary boxes or reinterpret old learning evidence.
 */
import {dayKey,boundary,evidenceState,plan,pendingSessions,seeded,startDiagnostic,vocabularyScope} from './engine.mjs?v=6031c9fb9a37f249';

const assessed=a=>!a.undone&&!a.retry&&!a.practiceOnly&&!a.diagnostic&&a.assessmentMode==='auto';
const independent=a=>assessed(a)&&!a.usedHint&&!a.revealed;
const primary=e=>!['reading','listening','writing','speaking'].includes(e.kind);
const attemptsFor=(profile,id)=>profile.attempts.filter(a=>a.objectiveIds?.includes(id)&&independent(a));
export const needsOnboarding=profile=>!profile.onboarded&&!profile.sessions.length&&!profile.attempts.length&&!Object.keys(profile.progress).length;
export function readyForNext(profile,objective){
 const recent=attemptsFor(profile,objective.id).slice(-5),correct=recent.filter(a=>a.outcome==='correct');
 return recent.length>=3&&correct.length>=3&&correct.length/recent.length>=.8&&new Set(correct.map(a=>a.exerciseId)).size>=3&&(!objective.productionRequired||correct.some(a=>a.production&&(!objective.productionExerciseIds||objective.productionExerciseIds.includes(a.exerciseId))));
}

function entryChapter(profile,content,allowed){
 const latest=profile.sessions.filter(s=>s.diagnostic&&s.completedAt&&!s.endedEarly&&s.cursor===s.queue.length).sort((a,b)=>b.createdAt-a.createdAt)[0];
 if(!latest)return allowed[0]?.chapterId;
 const samples=profile.attempts.filter(a=>a.sessionId===latest.id&&a.diagnostic&&!a.undone),index=id=>content.chapters.findIndex(c=>c.id===id);
 const tested=allowed.filter(o=>samples.some(a=>a.objectiveIds.includes(o.id))),missed=tested.filter(o=>samples.some(a=>a.objectiveIds.includes(o.id)&&a.outcome!=='correct'));
 return (missed.length?missed[0]:tested.sort((a,b)=>index(b.chapterId)-index(a.chapterId))[0])?.chapterId||allowed[0]?.chapterId;
}

export function learningFocus(profile,content,at){
 const cap=profile.settings.pathMode==='automatic'?content.chapters.length-1:content.chapters.findIndex(c=>c.id===profile.settings.position);
 const allowed=content.objectives.filter(o=>!o.receptive&&content.chapters.findIndex(c=>c.id===o.chapterId)<=cap);
 const entry=entryChapter(profile,content,allowed),entryIndex=content.chapters.findIndex(c=>c.id===entry);
 const afterEntry=allowed.filter(o=>content.chapters.findIndex(c=>c.id===o.chapterId)>=entryIndex);
 const recentMiss=allowed.map(o=>({o,last:profile.attempts.filter(a=>a.objectiveIds?.includes(o.id)&&assessed(a)).at(-1)})).filter(({o,last})=>last&&last.timestamp>=boundary(at,-7)&&['incorrect','accent-or-orthography'].includes(last.outcome)&&!readyForNext(profile,o)).sort((a,b)=>b.last.timestamp-a.last.timestamp)[0]?.o;
 const latestDiagnostic=profile.sessions.filter(s=>s.diagnostic&&s.completedAt&&!s.endedEarly&&s.cursor===s.queue.length).sort((a,b)=>b.createdAt-a.createdAt)[0]?.id;
 const gaps=allowed.filter(o=>!readyForNext(profile,o)&&profile.attempts.filter(a=>a.diagnostic&&a.sessionId===latestDiagnostic&&a.objectiveIds?.includes(o.id)).some(a=>['incorrect','accent-or-orthography'].includes(a.outcome)));
 const frontier=afterEntry.find(o=>!readyForNext(profile,o));
 const review=allowed.filter(o=>{const a=attemptsFor(profile,o.id).at(-1);return a&&(evidenceState(profile.attempts,o,at).state==='needs-review'||a.timestamp<=boundary(at,-3));}).sort((a,b)=>(attemptsFor(profile,a.id).at(-1)?.timestamp||0)-(attemptsFor(profile,b.id).at(-1)?.timestamp||0))[0];
 let focus=recentMiss||gaps[0]||frontier||review||allowed[0];
 // An explicitly missed prerequisite is addressed before its dependent. A diagnostic
 // placement is provisional; an unsampled earlier lesson is not invented mastery.
 const visited=new Set();while(focus&&!visited.has(focus.id)){
  visited.add(focus.id);const prerequisite=focus.prerequisites.map(id=>allowed.find(o=>o.id===id)).find(o=>o&&!readyForNext(profile,o)&&gaps.some(g=>g.id===o.id));
  if(!prerequisite)break;focus=prerequisite;
 }
 const reason=recentMiss?.id===focus?.id?'A recent answer needs another look':gaps.some(o=>o.id===focus?.id)?'Your warm-up showed a useful place to begin':focus===review?'Bring an earlier pattern back to mind':profile.lessons.includes(focus?.id)?'Build recall before moving on':'Your next short lesson';
 return {objective:focus,review:review?.id!==focus?.id?review:null,reason,entryChapter:entry};
}

export function learningVocabularySettings(profile,content,sections,at){
 const settings=structuredClone(profile.settings);
 if(settings.pathMode==='automatic'&&settings.deckMode==='class')settings.sections=vocabularyScope(learningFocus(profile,content,at).objective.chapterId,sections);
 return settings;
}

export function startWarmup(profile,content,at){
 const session=startDiagnostic(profile,content,at);
 const ids=['pe.greetings-2','pe.numbers-time-1','1b.articles-7','2a.present-ar-1','2b.estar-3'];
 session.queue=ids.map(exerciseId=>({kind:'exercise',exerciseId,reason:'A small sample, so we can choose your next lesson'}));
 session.warmup=true;return session;
}

function leastUsed(profile,items){
 const count=e=>profile.attempts.filter(a=>a.exerciseId===e.id&&!a.undone).length;
 return [...items].sort((a,b)=>count(a)-count(b));
}
export function guidedPlan(profile,content,cards,sections,at,seed=1,{id,extra=false}={}){
 const {objective,review,reason}=learningFocus(profile,content,at),random=seeded(seed);
 const settings=learningVocabularySettings(profile,content,sections,at),vocabScope=new Set(settings.sections);
 // Reuse reservation/once-per-day policy; only the size and relevant new-word pool change.
 const candidate=structuredClone(profile);candidate.settings={...settings,limit:50};
 const automatic=profile.settings.pathMode==='automatic'&&profile.settings.deckMode==='class';
 const due=cards.filter(c=>profile.progress[c.id]?.due<=at&&(automatic||c.sections.some(s=>vocabScope.has(s)))&&(!settings.verbsOnly||c.verbs.length)).sort((a,b)=>profile.progress[a.id].due-profile.progress[b.id].due);
 const base=plan(candidate,content,cards,at,seed,{id,wordsOnly:true,practiceOnly:extra});
 const reserved=new Set(profile.attempts.filter(a=>a.newCard&&!a.undone&&!a.practiceOnly&&!a.diagnostic&&dayKey(a.timestamp)===dayKey(at)).map(a=>a.cardId));
 for(const s of profile.sessions.filter(s=>!s.completedAt&&!s.practiceOnly&&!s.diagnostic&&dayKey(s.createdAt)===dayKey(at)))for(const item of s.queue.slice(s.cursor))if(item.newCard)reserved.add(item.cardId);
 const fresh=cards.filter(c=>!profile.progress[c.id]&&!reserved.has(c.id)&&c.sections.some(s=>vocabScope.has(s))&&(!settings.verbsOnly||c.verbs.length)).map(c=>({c,key:random()})).sort((a,b)=>Number(b.c.sections.includes(objective.chapterId))-Number(a.c.sections.includes(objective.chapterId))||a.key-b.key).map(x=>x.c);
 const capacity=Math.min(10,Math.max(5,Math.round(settings.minutes/2)));
 const words=extra?cards.filter(c=>c.sections.some(s=>vocabScope.has(s))&&(!settings.verbsOnly||c.verbs.length)).slice(0,capacity):[...due.slice(0,capacity),...fresh.slice(0,Math.min(Math.max(0,settings.newLimit-reserved.size),Math.max(0,capacity-due.length)))];
 const wordItems=words.map(c=>({kind:'vocabulary',cardId:c.id,newCard:!profile.progress[c.id],direction:settings.direction==='mixed'?(random()<.5?'es-en':'en-es'):settings.direction,reason:profile.progress[c.id]?'A word ready for review':'A word to support this lesson'}));
 const valid=e=>e.reviewStatus==='reviewed'&&(!e.vosotros||settings.vosotros);
 const patternItems=(o,count,why)=>leastUsed(profile,content.exercises.filter(e=>e.objectiveIds.includes(o.id)&&primary(e)&&e.assessmentMode==='auto'&&valid(e))).slice(0,count).map(e=>({kind:'exercise',exerciseId:e.id,reason:why}));
 const focusItems=patternItems(objective,4,reason),reviewItems=review?patternItems(review,2,'A short check of an earlier pattern'):[];
 const comm=leastUsed(profile,content.exercises.filter(e=>e.chapterId===objective.chapterId&&['reading','listening'].includes(e.kind)&&valid(e)))[0];
 const application=leastUsed(profile,content.exercises.filter(e=>e.chapterId===objective.chapterId&&['sentence','writing','speaking'].includes(e.kind)&&valid(e)))[0];
 const use=[comm,application].filter(Boolean).map(e=>({kind:'exercise',exerciseId:e.id,reason:'Use this lesson in a short message'}));
 // Keep related work together; start with the most relevant repair, otherwise due words.
 const wordFirst=!reason.includes('answer')&&due.length>0;
 const queue=wordFirst?[...wordItems.slice(0,4),...focusItems,...wordItems.slice(4),...reviewItems,...use]:[...focusItems.slice(0,2),...wordItems,...focusItems.slice(2),...reviewItems,...use];
 return {...base,settings,queue,guided:true,policyVersion:1,focusObjectiveId:objective.id,practiceOnly:extra};
}

export function nextLearningStep(profile,content,cards,sections,at){
 const pending=pendingSessions(profile)[0],focus=learningFocus(profile,content,at);
 if(pending)return {kind:'resume',session:pending,focus,title:pending.diagnostic?'Finish your starting-point check':'Pick up where you left off',reason:`${pending.queue.length-pending.cursor} activities left. Your answers and place are saved.`};
 const completed=profile.sessions.filter(s=>!s.diagnostic&&!s.practiceOnly&&!s.endedEarly&&s.completedAt&&s.cursor===s.queue.length&&dayKey(s.completedAt)===dayKey(at)&&(s.guided||s.queue.some(i=>i.kind==='vocabulary'))).at(-1);
 if(completed)return {kind:'done',session:completed,focus,title:'You’re done for today',reason:'Your daily practice is saved. Come back tomorrow for your next lesson and review.'};
 return {kind:'start',focus,title:focus.objective.title,reason:focus.reason,session:guidedPlan(profile,content,cards,sections,at,1)};
}
