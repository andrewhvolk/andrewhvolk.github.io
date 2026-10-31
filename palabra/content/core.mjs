import {conjugate,FORM_SOURCE,verbs} from './verbs.mjs?v=868b6f71c6145465';
export const chapters=[
 ['pe-school','En la escuela','Introductions, instructions, numbers & time'],['pe-class','En la clase','Objects, spelling & dates'],['pe-weather','El tiempo','Weather & seasons'],
 ['1a','Things you like to do','Infinitives & preferences'],['1b','People, in words','Articles & descriptions'],['2a','A day at school','Subjects, -ar verbs & schedules'],['2b','A place for everything','Estar, locations & plurals'],
 ['3a','At the table','Present -er/-ir & food preferences'],['3b','Feeling well','Ser & plural descriptions'],['4a','Places to go','Ir & questions'],['4b','Shall we?','Invitations, plans & jugar'],['5a','The people around you','Tener & possession'],['5b','A table for us','Venir & ser/estar'],['6a','Your own space','Comparisons & stem changes'],['6b','At home, in action','Commands & the progressive'],['7a','Choose your style','Preferences & demonstratives'],['7b','A purchase, completed','Preterite & direct objects'],['8a','Out and about','Past outings & personal a'],['8b','Helping out','Decir, recipients & completed actions'],['9a','On the screen','Recent actions & reactions'],['9b','Connected','Requests, knowledge & familiarity']
].map(([id,title,subtitle],order)=>({id,title,subtitle,order,objectiveIds:[]}));
export const objectives=[],lessons=[],exercises=[],stimuli=[];
export const sources={grammar:'https://www.rae.es/dpd/',forms:FORM_SOURCE,alignment:'https://www.ixl.com/spanish/skill-plans/realidades-level-1.pdf',sequence:'https://passporttolanguages.net/realidades-1-outline'};
export function add(id,chapterId,title,prerequisites,explanation,examples,mistake,rows,skillType='grammar'){
 const sourceRefs=[sources.grammar,sources.alignment,sources.sequence];
 const o={id,chapterId,title,skillType,prerequisites,productionRequired:true,sourceRefs};objectives.push(o);chapters.find(c=>c.id===chapterId).objectiveIds.push(id);
 lessons.push({id:`lesson-${id}`,version:1,objectiveIds:[id],explanation,examples,commonMistakes:[mistake],sourceRefs,reviewStatus:'reviewed',provenance:'Original Palabra lesson; grammatical rules checked against RAE references. Author review, 2026-10-30; no independent teacher audit.'});
 for(const [i,row]of rows.trim().split('\n').entries()){
   const [context,prompt,answer,feedback]=row.trim().split('|');
   exercises.push({id:`${id}-${i+1}`,version:1,chapterId,objectiveIds:[id],kind:i%4===0?'guided':'typed',prompt,acceptedAnswers:answer.split(' / '),feedback:feedback||explanation,context,production:true,assessmentMode:'auto',reviewStatus:'reviewed',sourceRefs,prerequisites,provenance:'Individually authored prompt and answer key; author checked for constrained meaning and agreement.'});
 }
 return o;
}
export function verbUnit(id,chapterId,title,prerequisites,explanation,examples,mistake,rows,tense='present'){
 const o=add(id,chapterId,title,prerequisites,explanation,examples,mistake,rows.map(([context,verb,person,sentence])=>`${context}|${sentence} (${verb}; ${person}; ${tense}). Type only the missing verb form.|${conjugate(verb,tense,person)}|${person} takes ${conjugate(verb,tense,person)} here. ${explanation}`).join('\n'),'conjugation');
 const added=exercises.filter(e=>e.objectiveIds.includes(id));
 added.forEach((e,i)=>{const v=verbs.find(v=>v.id===rows[i][1]);e.verbEvidence={verb:v.id,tense,person:rows[i][2],...(tense==='affirmative-tú'?{polarity:'affirmative'}:{})};e.kind=i%3===0?'form':i%3===1?'cloze':'select-conjugate';if(e.kind==='select-conjugate'){const other=v.id==='ser'?'estar':'ser';e.prompt=`Choose between ${v.id} and ${other} for the meaning “${v.meaning}”, then fill the blank with the correct form. ${rows[i][3]} Subject: ${rows[i][2]}; tense: ${tense}. Type only the verb form.`;}});
 return o;
}
