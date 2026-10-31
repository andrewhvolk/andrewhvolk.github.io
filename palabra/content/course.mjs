import {chapters,objectives,lessons,exercises,stimuli} from './core.mjs?v=f92baa39750e1611';
import './catchup.mjs?v=f92baa39750e1611';
import './middle.mjs?v=f92baa39750e1611';
import './later.mjs?v=f92baa39750e1611';
import {communication} from './communication.mjs?v=f92baa39750e1611';
import './application.mjs?v=f92baa39750e1611';
import {cultures} from './culture.mjs?v=f92baa39750e1611';
import {verbs,PERSONS} from './verbs.mjs?v=f92baa39750e1611';
const grammarRefs={
 'pe.spelling':['abecedario'],'pe.dates':['fecha'],'pe.numbers-time':['hora','cardinales'],
 '1a.infinitives':['gustar'],'1a.responses':['tampoco','también'],'1b.articles':['el','una'],'1b.adjectives':['concordancia'],'2a.subjects':['pronombres-personales-tónicos'],'2a.schedules':['ordinales','hora'],
 '2b.estar':['estar','tilde'],'2b.plurals':['plural'],'2b.location':['de'],'3a.likes-plural':['gustar'],'3b.plural-description':['concordancia'],'3b.ser':['ser'],
 '4a.ir':['ir'],'4a.questions':['qué','dónde'],'4b.future':['ir'],'5a.possessives':['su'],'5b.ser-estar':['ser','estar'],'6a.comparisons':['mejor','peor'],'6b.progressive':['estar'],
 '7a.demonstratives':['este','ese','aquel'],'7b.direct-object':['pronombres-personales-átonos'],'8a.personal-a':['a'],'8b.indirect-object':['pronombres-personales-átonos'],'9a.reactions':['gustar'],'9b.saber-conocer':['saber','conocer']
};
for(const o of objectives){
 const refs=(grammarRefs[o.id]||[]).map(p=>'https://www.rae.es/dpd/'+p);
 if(o.skillType==='conjugation')refs.push('https://www.rae.es/diccionario-estudiante/docs/conjugaciones-verbales.pdf');
 if(refs.length){o.sourceRefs=[...refs,...o.sourceRefs.filter(u=>u!=='https://www.rae.es/dpd/')];for(const l of lessons.filter(l=>l.objectiveIds.includes(o.id)))l.sourceRefs=o.sourceRefs;for(const e of exercises.filter(e=>e.objectiveIds.includes(o.id)))e.sourceRefs=o.sourceRefs;}
}
// Construction drills also contribute to the actual inflected-form target.
const formObjectives={'3a.likes-plural':['gustar','encantar'],'9a.reactions':['gustar','encantar','interesar'],'9a.acabar':['acabar'],'9b.saber-conocer':['saber','conocer']};
for(const e of exercises){const allowed=formObjectives[e.objectiveIds[0]];if(!allowed)continue;const v=verbs.find(v=>allowed.includes(v.id)&&v.forms.present.includes(e.acceptedAnswers[0]));if(v)e.verbEvidence={verb:v.id,tense:'present',person:PERSONS[v.forms.present.indexOf(e.acceptedAnswers[0])]};}
// Three deliberately authored location scenes, with text equivalents for every position.
for(const [id,object,support,relation,answer]of [
 ['2b.location-1','libro','mesa','under','debajo'],['2b.location-6','lámpara','mesa','above','encima'],['2b.location-7','zapatos','cama','under','debajo']
]){const e=exercises.find(e=>e.id===id);e.scene={object,support,relation};const subject={libro:'El libro está','lámpara':'La lámpara está',zapatos:'Los zapatos están'}[object];e.prompt=`Use the scene: ${subject} ___ de la ${support}. Type the location word.`;e.acceptedAnswers=[answer];e.feedback=`${answer} de means ${relation==='under'?'under':'on top of / above'}. Keep de before the noun phrase.`;}
// Optional vosotros bank is opt-in; it supplements, never replaces, the 12 authored variants.
for(const o of objectives.filter(o=>o.skillType==='conjugation')){
 const sample=exercises.find(e=>e.objectiveIds.includes(o.id)&&e.verbEvidence?.tense==='present');if(!sample)continue;
 const v=verbs.find(v=>v.id===sample.verbEvidence.verb);
 exercises.push({...sample,id:`${o.id}-vosotros`,prompt:`In a group-address drill, ${v.infinitive} + vosotros/vosotras (present). Type the bare form.`,acceptedAnswers:[v.forms.present[4]],feedback:`Vosotros/vosotras takes ${v.forms.present[4]}. Ustedes takes the third-person plural form instead.`,kind:'form',vosotros:true,verbEvidence:{verb:v.id,tense:'present',person:PERSONS[4]},context:'group-address'});
}
// Typed choices are recognition, even when the learner types the supplied answer.
const recognition=new Set(['1a.infinitives-1','1a.infinitives-5','1a.infinitives-9','2a.subjects-11','2a.subjects-12']);
for(const e of exercises){
 if(recognition.has(e.id)||/Answer in English/.test(e.prompt)&&!e.verbEvidence)e.production=false;
 e.productionType??=e.assessmentMode==='self'?'personal-response':e.production?'controlled-production':'recognition';
 if(e.verbEvidence){const v=verbs.find(v=>v.id===e.verbEvidence.verb);e.formContrasts=Object.entries(v.forms).flatMap(([tense,forms])=>forms.map((form,i)=>({form,tense,person:tense==='affirmative-tú'?'tú':PERSONS[i]})));}
}
for(const o of objectives){const items=exercises.filter(e=>e.objectiveIds.includes(o.id));o.productionExerciseIds=items.filter(e=>e.production&&e.assessmentMode==='auto').map(e=>e.id);
 if(o.skillType==='conjugation')o.exerciseTargets=Object.fromEntries(items.filter(e=>e.verbEvidence).map(e=>[e.id,{...e.verbEvidence,context:e.context}]));
}
// A diagnostic samples all catch-up domains without creating scheduled vocabulary history.
const diagnostic=['pe.greetings-2','pe.instructions-1','pe.numbers-time-1','pe.numbers-time-4','pe.objects-2','pe.spelling-1','pe.dates-10','pe.weather-1','1a.infinitives-1','1a.responses-2','1b.articles-7','1b.adjectives-1','2a.subjects-5','2a.present-ar-1','2a.present-ar-3','2a.schedules-11','2b.estar-3','2b.location-3','2b.plurals-3','read-2b-q2'];
exercises.find(e=>e.id==='1b.adjectives-1').prompt='Correct only the adjective in La chica es simpático. Type the corrected word.';
const translation=exercises.find(e=>e.id==='1a.responses-3');translation.prompt='Translate the whole sentence: I do not like to draw. You may include A mí for emphasis.';translation.acceptedAnswers=['No me gusta dibujar','A mí no me gusta dibujar'];
exercises.find(e=>e.id==='pe.spelling-4').prompt='Ask how Ana is spelled: ¿Cómo se ___ Ana?';exercises.find(e=>e.id==='pe.spelling-4').acceptedAnswers=['escribe'];
for(const e of exercises.filter(e=>e.objectiveIds.includes('8a.personal-a')&&e.acceptedAnswers[0]==='—')){e.acceptedAnswers=['—','-','none'];e.prompt+=' You may type - or none for no preposition.';}
export const course={version:'2026.10.30',chapters,objectives,lessons,exercises,stimuli,verbs,cultures,communication,diagnostic};
