export function validateContent(content,cards,sections){
 const errors=[];const check=(ok,msg)=>{if(!ok)errors.push(msg);};
 for(const [name,items]of Object.entries({chapters:content.chapters,objectives:content.objectives,lessons:content.lessons,exercises:content.exercises,stimuli:content.stimuli,verbs:content.verbs,cultures:content.cultures})){
  check(Array.isArray(items),`${name} must be an array`);check(new Set(items.map(i=>i.id)).size===items.length,`${name} duplicate IDs`);
 }
 const objectiveIds=new Set(content.objectives.map(o=>o.id)),chapterIds=new Set(content.chapters.map(c=>c.id)),stimulusIds=new Set(content.stimuli.map(s=>s.id));
 const visited=new Set(),visiting=new Set();
 function visit(id){if(visited.has(id))return;if(visiting.has(id)){errors.push(`Prerequisite cycle: ${id}`);return;}visiting.add(id);for(const p of content.objectives.find(o=>o.id===id)?.prerequisites||[])visit(p);visiting.delete(id);visited.add(id);}
 for(const o of content.objectives){
  check(chapterIds.has(o.chapterId),`Unknown chapter ${o.id}`);check(o.prerequisites.every(id=>objectiveIds.has(id)),`Unknown prerequisite ${o.id}`);
  check(o.prerequisites.every(id=>content.chapters.find(c=>c.id===content.objectives.find(o=>o.id===id)?.chapterId)?.order<=content.chapters.find(c=>c.id===o.chapterId).order),`Future prerequisite ${o.id}`);visit(o.id);
  const lessons=content.lessons.filter(l=>l.objectiveIds.includes(o.id)&&l.reviewStatus==='reviewed');check(lessons.length>0&&lessons.every(l=>l.examples.length>=2&&l.commonMistakes.length&&l.sourceRefs.length),`Incomplete lesson ${o.id}`);
  const items=content.exercises.filter(e=>e.objectiveIds.includes(o.id)&&e.assessmentMode==='auto'&&e.reviewStatus==='reviewed'&&!e.vosotros);
  check(items.length>=(o.receptive?3:12),`Too few variants: ${o.id}`);check(new Set(items.map(i=>i.context)).size>=(o.receptive?1:3),`Too few contexts: ${o.id}`);if(o.productionRequired)check(items.some(e=>e.production),`No production: ${o.id}`);
  check(new Set(items.map(e=>e.prompt)).size===items.length,`Repeated prompt in ${o.id}`);
 }
 for(const e of content.exercises){
  check(e.version===1&&typeof e.prompt==='string'&&e.prompt.length>5&&typeof e.feedback==='string'&&e.feedback.length>5,`Invalid exercise ${e.id}`);
  check(e.objectiveIds.every(id=>objectiveIds.has(id))&&chapterIds.has(e.chapterId),`Unknown target ${e.id}`);
  if(['reading','listening'].includes(e.kind))check(e.objectiveIds.length>0&&e.objectiveIds.every(id=>content.objectives.find(o=>o.id===id)?.skillType===e.kind),`Receptive evidence must have its own target ${e.id}`);
  check(['recognition','controlled-production','transcription','personal-response'].includes(e.productionType),`Missing assessment type ${e.id}`);
  if(e.options)check(e.options.includes(e.acceptedAnswers[0])&&new Set(e.options).size===e.options.length,`Invalid choices ${e.id}`);
  check(e.prerequisites.every(id=>objectiveIds.has(id)),`Unknown exercise prerequisite ${e.id}`);
  check(['draft','reviewed','needs-review'].includes(e.reviewStatus),`Invalid review status ${e.id}`);
  check(e.assessmentMode==='auto'?e.acceptedAnswers.length>0&&e.acceptedAnswers.every(a=>typeof a==='string'&&a.trim()):e.rubric?.length>=3,`Invalid answer key ${e.id}`);
  if(e.stimulusId)check(stimulusIds.has(e.stimulusId),`Missing stimulus ${e.id}`);
  if(e.verbEvidence){const v=content.verbs.find(v=>v.id===e.verbEvidence.verb);check(!!v,`Unknown verb ${e.id}`);check(v?.forms[e.verbEvidence.tense]?.includes(e.acceptedAnswers[0]),`Form key mismatch ${e.id}`);}
 }
 for(const c of content.chapters){
  const reads=content.stimuli.filter(s=>s.chapterId===c.id&&s.kind==='reading');check(reads.length>=1,`No reading ${c.id}`);
  for(const r of reads){const n=r.SpanishText.trim().split(/\s+/).length;check(n>=50&&n<=120,`Reading ${r.id} has ${n} words, expected 50–120`);check(content.exercises.filter(e=>e.stimulusId===r.id).length>=3,`Reading needs 3 questions ${c.id}`);}
  for(const kind of ['listening','writing','speaking'])check(content.exercises.some(e=>e.chapterId===c.id&&e.kind===kind&&e.reviewStatus==='reviewed'),`Missing ${kind} ${c.id}`);
  check(content.cultures.some(n=>n.chapterId===c.id&&n.sourceRefs.length),`No sourced culture ${c.id}`);
 }
 check(content.diagnostic.length>=15&&content.diagnostic.length<=20,'Diagnostic length outside 15–20');check(content.diagnostic.every(id=>content.exercises.some(e=>e.id===id)),'Unknown diagnostic item');
 for(const v of content.verbs){check(v.forms.present.length===6&&typeof v.example==='string'&&v.example.length>8,`Incomplete reference ${v.id}`);for(const [tense,forms]of Object.entries(v.forms))check(forms.length===(tense==='affirmative-tú'?1:6)&&forms.every(f=>f===f.normalize('NFC')),`Invalid paradigm ${v.id}`);}
 check(cards.length===940,'Expected 940 cards');check(new Set(cards.map(c=>c.id)).size===940,'Vocabulary IDs must be unique');check(cards.filter(c=>c.sections.some(s=>sections.find(x=>x.id===s)?.catchup)).length===315,'Expected 315 through 2B cards');
 check(cards.every(c=>/^[a-f0-9]{12}$/.test(c.id)&&c.sections.every(id=>sections.some(s=>s.id===id))),'Invalid vocabulary references');
 return errors;
}
export function coverage(content){return content.objectives.map(o=>{const exercises=content.exercises.filter(e=>e.objectiveIds.includes(o.id)&&!e.vosotros&&e.assessmentMode==='auto'&&e.reviewStatus==='reviewed');return {chapter:o.chapterId,objectiveId:o.id,title:o.title,lessonCount:content.lessons.filter(l=>l.objectiveIds.includes(o.id)).length,reviewedItemCount:exercises.length,contexts:[...new Set(exercises.map(e=>e.context))],production:exercises.some(e=>e.production),reading:exercises.filter(e=>e.kind==='reading').length,listening:exercises.filter(e=>e.kind==='listening').length,chapterReadingStimuli:content.stimuli.filter(s=>s.chapterId===o.chapterId&&s.kind==='reading').length,chapterListeningStimuli:content.stimuli.filter(s=>s.chapterId===o.chapterId&&s.kind==='listening').length,prerequisitesValid:o.prerequisites.every(id=>content.objectives.some(o=>o.id===id)),validationStatus:'author-reviewed; schema checked',implementationStatus:'implemented',sourceRefs:o.sourceRefs};});}
