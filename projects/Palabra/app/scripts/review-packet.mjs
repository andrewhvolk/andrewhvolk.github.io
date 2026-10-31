import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {course} from '../content/course.mjs';
const revision=createHash('sha256').update(JSON.stringify({objectives:course.objectives,lessons:course.lessons,exercises:course.exercises,stimuli:course.stimuli,verbs:course.verbs})).digest('hex');
const dir=new URL('../docs/review/',import.meta.url);await mkdir(dir,{recursive:true});
const summary=[];
for(const chapter of course.chapters){const objectiveIds=course.objectives.filter(o=>o.chapterId===chapter.id).map(o=>o.id),items=course.exercises.filter(e=>e.chapterId===chapter.id);
 const packet={contentRevision:revision,chapter,reviewBoundary:'Author-reviewed source snapshot. Independent educator review remains pending; record findings separately against this revision.',objectives:course.objectives.filter(o=>objectiveIds.includes(o.id)),lessons:course.lessons.filter(l=>l.objectiveIds.some(id=>objectiveIds.includes(id))),stimuli:course.stimuli.filter(s=>s.chapterId===chapter.id),exercises:items.map(e=>({id:e.id,objectiveIds:e.objectiveIds,kind:e.kind,prompt:e.prompt,acceptedAnswers:e.acceptedAnswers,feedback:e.feedback,context:e.context,assessmentMode:e.assessmentMode,production:e.production,productionType:e.productionType,verbEvidence:e.verbEvidence,options:e.options,scene:e.scene,rubric:e.rubric,model:e.model,sourceRefs:e.sourceRefs})),culture:course.cultures.filter(c=>c.chapterId===chapter.id)};
 await writeFile(new URL(`${chapter.id}.json`,dir),JSON.stringify(packet,null,2)+'\n');summary.push({chapter:chapter.id,objectives:objectiveIds.length,activities:items.length,independentReview:'pending'});
}
await writeFile(new URL('verbs.json',dir),JSON.stringify({contentRevision:revision,independentReview:'pending',verbs:course.verbs},null,2)+'\n');
await writeFile(new URL('index.json',dir),JSON.stringify({contentRevision:revision,objectives:course.objectives.length,activities:course.exercises.length,chapters:summary},null,2)+'\n');
await writeFile(new URL('review-records.example.json',dir),JSON.stringify({instructions:'Copy to a separate review record. Do not edit generated source packets. A named independent educator must record actual findings; this template is not evidence of review.',contentRevision:revision,reviewer:null,reviewedAt:null,findings:[{exerciseId:null,decision:'pending',issue:null,proposedAcceptedAnswers:[],regionalNotes:null,explanationCorrection:null}]},null,2)+'\n');
console.log(`Educator packet prepared: ${course.chapters.length} chapters, ${course.exercises.length} activities, ${course.verbs.length} verb references. Independent review pending.`);
