/** Pure learning engine. All clocks and selection seeds are supplied by callers. */
export const INTERVALS=[0,1,2,4,7,14];
export const SCHEMA=2, CONTENT_VERSION='2026.10.30';
export const dayKey=(at)=>{const d=new Date(at);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function boundary(at,days){const d=new Date(at);d.setHours(0,0,0,0);d.setDate(d.getDate()+days);return +d;}
export function nextReview(previous,correct,at){const p=previous||{box:1,reviews:0,correct:0};const box=correct?Math.min(5,p.box+1):1;return {box,reviews:p.reviews+1,correct:p.correct+Number(correct),lastReview:at,due:boundary(at,INTERVALS[box])};}
export const normalize=s=>String(s).normalize('NFC').trim().toLocaleLowerCase('es').replace(/\s+/g,' ').replace(/^[¡¿]+|[.!?¡¿]+$/g,'').trim();
// Preserve ñ: ano and año are different words, not an accent slip.
const accentless=s=>s.normalize('NFD').replace(/[\u0300-\u0301\u0308]/g,'').normalize('NFC');
export function grade(answer,item){
  if(item.assessmentMode==='self')return {outcome:'self-assessed',message:'Use the checklist to compare your response. This is activity, not an automatic grammar or pronunciation score.'};
  const a=normalize(answer), answers=item.acceptedAnswers.map(normalize);
  if(answers.includes(a))return {outcome:'correct',message:item.feedback};
  if(a&&answers.some(x=>accentless(x)===accentless(a)))return {outcome:'accent-or-orthography',message:`Check the accent or spelling: ${item.acceptedAnswers[0]}. Accents can change the person, tense, or meaning. ${item.feedback}`};
  return {outcome:'incorrect',message:`Expected: ${item.acceptedAnswers.join(' / ')}. ${item.feedback}`};
}
export function evidenceState(attempts,objective,at){
  const all=attempts.filter(a=>a.objectiveIds?.includes(objective.id)&&!a.undone);
  if(!all.length)return {state:'unintroduced',n:0,accuracy:0,variants:0,dates:0};
  const diagnostic=all.filter(a=>a.diagnostic), independent=all.filter(a=>!a.diagnostic&&!a.practiceOnly&&!a.usedHint&&!a.revealed&&!a.retry&&a.assessmentMode==='auto'&&['correct','incorrect','accent-or-orthography'].includes(a.outcome));
  const recent=independent.slice(-10), accuracy=recent.length?recent.filter(a=>a.outcome==='correct').length/recent.length:0;
  const variants=new Set(recent.map(a=>a.exerciseId)).size, dates=new Set(recent.map(a=>dayKey(a.timestamp))).size;
  const production=!objective.productionRequired||recent.some(a=>a.production&&a.outcome==='correct');
  const secure=recent.length>=6&&accuracy>=.8&&dates>=2&&variants>=3&&production;
  const latest=recent.at(-1);const stale=latest&&boundary(latest.timestamp,14)<=at;
  return {state:secure?(stale?'needs-review':'secure'):recent.length>=3&&accuracy<.6?'needs-review':!independent.length&&diagnostic.length?'provisional':'learning',n:recent.length,accuracy,variants,dates};
}
export function diagnosticReport(attempts,objectives){const latest=attempts.filter(a=>a.diagnostic).at(-1)?.sessionId;return objectives.map(o=>{const a=attempts.filter(x=>x.diagnostic&&x.sessionId===latest&&x.objectiveIds.includes(o.id));const misses=a.filter(x=>x.outcome!=='correct'),targets=misses.filter(x=>x.verbEvidence).map(x=>`${x.verbEvidence.verb} · ${x.verbEvidence.person}${x.outcome==='accent-or-orthography'?' (written accent)':''}`);return {id:o.id,title:o.title,tested:a.length,correct:a.filter(x=>x.outcome==='correct').length,recommendation:!a.length?'Not sampled':!misses.length?'Promising sample; confirm in daily practice':`Review ${o.title.toLowerCase()}${targets.length?': '+targets.join('; '):''}`};});}
export function seeded(seed){let x=seed>>>0;return ()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296;};}
const shuffle=(items,random)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export const defaultSettings={position:'2b',minutes:15,newLimit:10,vosotros:false,direction:'es-en',limit:20,verbsOnly:false,sections:['pe1','pe2','pe3','pe4','1a','1b','2a','2b'],speed:.85};
export function newProfile(id,name='Learner'){return {id,displayName:name,settings:structuredClone(defaultSettings),progress:{},history:[],attempts:[],lessons:[],sessions:[],activeSession:null,onboarded:false};}
export function emptyStore(){return {version:SCHEMA,contentVersion:CONTENT_VERSION,revision:0,activeProfile:'default',profiles:[newProfile('default')],recovery:[]};}
export const eligibleCards=(cards,settings)=>cards.filter(c=>c.sections.some(s=>settings.sections.includes(s))&&(!settings.verbsOnly||c.verbs.length));
export function plan(profile,content,cards,at,seed=1,options={}){
  const random=seeded(seed),settings=structuredClone(profile.settings), selected=eligibleCards(cards,settings);
  const due=selected.filter(c=>profile.progress[c.id]?.due<=at).sort((a,b)=>profile.progress[a.id].due-profile.progress[b.id].due);
  const introduced=new Set(profile.attempts.filter(a=>a.newCard&&dayKey(a.timestamp)===dayKey(at)&&!a.undone).map(a=>a.cardId));
  // Exposures in existing plans reserve daily introductions, including abandoned plans.
  for(const s of profile.sessions.filter(s=>dayKey(s.createdAt)===dayKey(at)&&!s.practiceOnly))for(const i of s.queue)if(i.newCard)introduced.add(i.cardId);
  const remaining=Math.max(0,settings.newLimit-introduced.size);
  const fresh=shuffle(selected.filter(c=>!profile.progress[c.id]&&!introduced.has(c.id)),random).slice(0,remaining);
  const vocabN=options.wordsOnly?settings.limit:Math.max(3,Math.round(settings.minutes/3));
  const vocab=(options.practiceOnly?shuffle(selected,random):[...due,...fresh]).slice(0,vocabN).map(c=>({kind:'vocabulary',cardId:c.id,newCard:!profile.progress[c.id],direction:settings.direction==='mixed'?(random()<.5?'es-en':'en-es'):settings.direction,reason:profile.progress[c.id]?'Scheduled vocabulary review':'A limited new word'}));
  let queue=[...vocab];
  if(!options.wordsOnly){
    const max=content.chapters.findIndex(c=>c.id===settings.position);
    const allowed=content.objectives.filter(o=>content.chapters.findIndex(c=>c.id===o.chapterId)<=max);
    const state=o=>evidenceState(profile.attempts,o,at);
    const gaps=new Set(diagnosticReport(profile.attempts,allowed).filter(x=>x.tested&&x.correct<x.tested&&state(allowed.find(o=>o.id===x.id)).state!=='secure').map(x=>x.id));
    const priority=o=>gaps.has(o.id)?-2:state(o).state==='needs-review'?-1:state(o).state==='secure'?4:o.chapterId===settings.position?0:1;
    // Teach prerequisites before their dependents. A completed lesson suffices for introduction;
    // secure evidence remains a separate, stricter criterion.
    const ready=allowed.filter(o=>o.prerequisites.every(id=>profile.lessons.includes(id)||['learning','secure','provisional'].includes(evidenceState(profile.attempts,content.objectives.find(x=>x.id===id),at).state)));
    ready.sort((a,b)=>priority(a)-priority(b)||allowed.indexOf(a)-allowed.indexOf(b));
    const count=Math.round(settings.minutes*.8), chosen=[],slots=Math.max(2,count-3);
    // Reserve current work when its prerequisites are ready, alongside catch-up review.
    const current=ready.filter(o=>o.chapterId===settings.position&&state(o).state!=='secure').slice(0,Math.max(1,Math.ceil(slots*.4)));
    const ordered=[...current,...ready.filter(o=>!current.includes(o))];
    for(const o of ordered){
      const candidates=content.exercises.filter(e=>e.objectiveIds.includes(o.id)&&e.reviewStatus==='reviewed'&&e.assessmentMode==='auto'&&(!e.vosotros||settings.vosotros)&& !['reading','listening'].includes(e.kind));
      const attempts=profile.attempts.filter(a=>a.objectiveIds.includes(o.id));
      candidates.sort((a,b)=>attempts.filter(x=>x.exerciseId===a.id).length-attempts.filter(x=>x.exerciseId===b.id).length);
      const e=candidates[0];if(e)chosen.push({kind:'exercise',exerciseId:e.id,reason:gaps.has(o.id)?'Diagnostic gap':state(o).state==='needs-review'?'A skill needs another look':profile.lessons.includes(o.id)?'Build independent recall':'Learn a prerequisite'});
      if(chosen.length>=slots)break;
    }
    const activeChapter=chosen.length?content.exercises.find(e=>e.id===chosen.at(-1).exerciseId).chapterId:settings.position;
    for(const kind of ['reading','listening','writing']){
      const e=content.exercises.find(e=>e.chapterId===activeChapter&&e.kind===kind&&e.reviewStatus==='reviewed');
      if(e)chosen.push({kind:'exercise',exerciseId:e.id,reason:kind==='writing'?'Apply it in your own words':`Use Spanish in ${kind}`});
    }
    queue=[];while(vocab.length||chosen.length){if(vocab.length)queue.push(vocab.shift());if(chosen.length)queue.push(chosen.shift());}
  }
  return {id:options.id||`s-${at}-${seed}`,createdAt:at,profileId:profile.id,settings,queue,cursor:0,committed:[],practiceOnly:!!options.practiceOnly,diagnostic:false,drafts:{},results:{},undo:[],completedAt:null};
}
export function startDiagnostic(profile,content,at){return {id:`diagnostic-${at}`,profileId:profile.id,settings:structuredClone(profile.settings),createdAt:at,queue:content.diagnostic.map(id=>({kind:'exercise',exerciseId:id,reason:'Provisional catch-up assessment'})),cursor:0,committed:[],practiceOnly:false,diagnostic:true,drafts:{},results:{},undo:[],completedAt:null};}
export function commit(profile,sessionId,input,content,cards,at){
  const p=structuredClone(profile),s=p.sessions.find(x=>x.id===sessionId);if(!s)throw Error('Session no longer exists.');
  if(s.committed.includes(input.id))return p;
  if(s.completedAt||input.index!==s.cursor)throw Error('This answer is already saved, or another tab has moved the session. Reload to continue.');
  const item=s.queue[s.cursor];if(!item)throw Error('No pending item.');
  const before={cardId:item.cardId||null,previous:item.cardId?structuredClone(p.progress[item.cardId]||null):null,historyLength:p.history.length,attemptsLength:p.attempts.length,cursor:s.cursor};
  const e=item.kind==='exercise'?content.exercises.find(e=>e.id===item.exerciseId):null;
  const outcome=e?grade(input.answer,e).outcome:input.correct?'correct':'incorrect';
  const retry=!!input.retry||!!s.drafts[s.cursor]?.retry;
  const revealed=!!input.revealed||!!s.drafts[s.cursor]?.revealed;
  const usedHint=!!input.usedHint||!!s.drafts[s.cursor]?.usedHint;
  const a={id:input.id,sessionId:s.id,exerciseId:e?.id||`vocab-${item.cardId}`,cardId:item.cardId||null,objectiveIds:e?.objectiveIds||[],answer:String(input.answer||'').slice(0,4000),outcome,timestamp:at,direction:item.direction||null,usedHint,revealed,retry,practiceOnly:s.practiceOnly,diagnostic:s.diagnostic,assessmentMode:e?.assessmentMode||'self',production:e?.production||false,newCard:!!item.newCard,verbEvidence:e?.verbEvidence||null};
  if(e?.kind==='listening'&&input.audioFallback){a.practiceOnly=true;a.audioFallback=true;}
  if(!e&&!s.practiceOnly&&!s.diagnostic){
    const already=p.attempts.some(x=>x.cardId===item.cardId&&!x.practiceOnly&&!x.undone&&dayKey(x.timestamp)===dayKey(at));
    if(!already)p.progress[item.cardId]=nextReview(p.progress[item.cardId],input.correct,at);else a.practiceOnly=true;
    if(!a.practiceOnly)p.history.push({id:item.cardId,correct:!!input.correct,at,direction:item.direction});
  }
  // Only the latest session can legally undo. Keep its most recent 20 inverse events.
  for(const other of p.sessions)if(other.id!==s.id)other.undo=[];
  p.attempts.push(a);s.undo.push({attemptId:a.id,before});s.undo=s.undo.slice(-20);s.committed.push(a.id);s.results[s.cursor]=a.id;s.cursor++;
  if(s.cursor>=s.queue.length)s.completedAt=at;
  return p;
}
export function undo(profile,sessionId){
  const p=structuredClone(profile),s=p.sessions.find(x=>x.id===sessionId),u=s?.undo.at(-1);
  if(!u){if(s?.committed.length&&p.attempts.at(-1)?.sessionId!==sessionId)throw Error('Only the most recent learning event can be undone.');return p;}
  const tail=p.attempts.slice(u.before.attemptsLength);
  if(tail[0]?.id!==u.attemptId||tail.some(a=>a.sessionId!==sessionId||a.id!==u.attemptId&&!a.retry))throw Error('Only the most recent learning event can be undone. Later sessions already contain saved answers.');
  s.undo.pop();
  if(u.before.progress)p.progress=u.before.progress; // Existing v2 snapshots remain undoable.
  else if(u.before.cardId){if(u.before.previous)p.progress[u.before.cardId]=u.before.previous;else delete p.progress[u.before.cardId];}
  p.history.length=u.before.historyLength;p.attempts.length=u.before.attemptsLength;s.cursor=u.before.cursor;s.committed=s.committed.filter(id=>id!==u.attemptId);delete s.results[s.cursor];delete s.drafts[s.cursor];
  // The answer has already been shown: undo restores state, not an unseen assessment.
  if(s.queue[s.cursor].kind==='exercise')s.drafts[s.cursor]={retry:true,usedHint:true};
  s.completedAt=null;return p;
}
