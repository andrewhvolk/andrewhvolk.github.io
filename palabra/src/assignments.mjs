import {practiceQueue,evidenceState} from './engine.mjs?v=b2d604b1faf547af';
const kinds=['all','grammar','reading','listening','writing','speaking'];
export function parseAssignment(hash,content){
 if(!hash.startsWith('#assignment?'))return null;
 const q=new URLSearchParams(hash.slice('#assignment?'.length)),chapter=q.get('chapter'),skill=q.get('skill')||'',kind=q.get('kind')||'all',minutes=Number(q.get('minutes'));
 if([...q.keys()].some(k=>!['chapter','skill','kind','minutes'].includes(k))||!content.chapters.some(c=>c.id===chapter)||![10,15,20].includes(minutes)||!kinds.includes(kind)||skill&&!content.objectives.some(o=>o.id===skill&&o.chapterId===chapter))throw Error('This practice link has an unknown chapter, skill or time. Your plan was not changed.');
 return {chapter,skill,kind,minutes};
}
export function assignmentLink(base,scope){const url=new URL(base);url.search='';url.hash='assignment?'+new URLSearchParams({chapter:scope.chapter,skill:scope.skill||'',kind:scope.kind||'all',minutes:String(scope.minutes)});return url.href;}
export function assignmentQueue(profile,content,scope,at){
 const ids=practiceQueue(profile,content,{objectiveId:scope.skill||undefined,chapterId:scope.chapter,kind:scope.kind,limit:Math.round(scope.minutes*.6)}),needed=[],seen=new Set();
 const ready=id=>profile.lessons.includes(id)||['learning','secure','provisional'].includes(evidenceState(profile.attempts,content.objectives.find(o=>o.id===id),at).state);
 const visit=id=>{if(seen.has(id)||ready(id))return;seen.add(id);const o=content.objectives.find(o=>o.id===id);for(const pre of o.prerequisites)visit(pre);const item=practiceQueue(profile,content,{objectiveId:id,limit:1})[0];if(item)needed.push(item);};
 for(const id of ids){const e=content.exercises.find(e=>e.id===id);for(const pre of e.prerequisites)visit(pre);}
 return {ids:[...new Set([...needed,...ids])],prerequisiteCount:needed.length};
}
