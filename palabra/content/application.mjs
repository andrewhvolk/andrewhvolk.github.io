import {objectives,exercises} from './core.mjs?v=2cad3fa77106a0a8';
// Original constrained sentence applications. The cues constrain wording for reliable grading.
const sentences=[
 ['pe-school','pe.greetings','Greet your female teacher in the morning. Use Buenos and profesora.','Buenos días, profesora'],
 ['pe-class','pe.objects','Say there are two notebooks. Use Hay and cuadernos.','Hay dos cuadernos'],
 ['pe-weather','pe.weather','Say it is cold today. Use Hoy and hacer.','Hoy hace frío'],
 ['1a','1a.infinitives','Say you like to draw. Use Me, gustar and dibujar.','Me gusta dibujar'],
 ['1b','1b.adjectives','Describe the girl as hardworking. Use La chica, ser and trabajadora.','La chica es trabajadora'],
 ['2a','2a.present-ar','Say we study Spanish. Include Nosotros, estudiar and español.','Nosotros estudiamos español'],
 ['2b','2b.estar','Locate the books on the table. Include Los libros, estar and en la mesa.','Los libros están en la mesa'],
 ['3a','3a.present-er-ir','Say we eat fruit. Include Nosotros, comer and fruta.','Nosotros comemos fruta'],
 ['3b','3b.ser','Describe your friends as patient. Include Mis amigos, ser and pacientes.','Mis amigos son pacientes'],
 ['4a','4a.ir','Say we go to the park. Include Nosotros, ir and el parque.','Nosotros vamos al parque'],
 ['4b','4b.future','Say we are going to read. Include Nosotros, ir and leer.','Nosotros vamos a leer'],
 ['5a','5a.tener','Say your sister is twelve. Include Mi hermana, tener and doce años.','Mi hermana tiene doce años'],
 ['5b','5b.venir','Say your friends come today. Include Mis amigos, venir and hoy.','Mis amigos vienen hoy'],
 ['6a','6a.stem-ue','Say you can study here. Include Yo, poder, estudiar and aquí.','Yo puedo estudiar aquí'],
 ['6b','6b.progressive','Say Ana is reading. Include Ana, estar and leer.','Ana está leyendo'],
 ['7a','7a.stem-ie','Say you prefer this shirt. Include Yo, preferir and esta camisa.','Yo prefiero esta camisa'],
 ['7b','7b.spelling','Say you paid twenty euros yesterday. Include Ayer yo, pagar and veinte euros.','Ayer yo pagué veinte euros'],
 ['8a','8a.preterite-ir','Say you went to the museum yesterday. Include Ayer yo, ir and el museo.','Ayer yo fui al museo'],
 ['8b','8b.preterite-hacer-dar','Say Ana made a poster yesterday. Include Ayer Ana, hacer and un cartel.','Ayer Ana hizo un cartel'],
 ['9a','9a.acabar','Say you have just read a book. Include Yo, acabar, leer and un libro.','Yo acabo de leer un libro'],
 ['9b','9b.saber-conocer','Say you know Ana personally. Include Yo, conocer and Ana.','Yo conozco a Ana']
];
for(const [chapterId,objectiveId,prompt,answer]of sentences){const o=objectives.find(o=>o.id===objectiveId);if(!o)throw Error(`Unknown application objective ${objectiveId}`);
 exercises.push({id:`apply-${chapterId}-sentence`,version:1,chapterId,objectiveIds:[objectiveId],kind:'sentence',prompt:`Write the complete Spanish sentence. ${prompt}`,acceptedAnswers:[answer],feedback:`One constrained sentence is: ${answer}. Keep the stated subject and cues; check verb agreement, contractions and written accents.`,context:'sentence-application',production:true,productionType:'controlled-production',assessmentMode:'auto',reviewStatus:'reviewed',prerequisites:o.prerequisites,sourceRefs:o.sourceRefs,provenance:'Original Palabra sentence task, author checked; independent teacher review pending.'});
}
for(const [chapterId,objectiveId,prompt,answer,options,scene]of [
 ['2b','2b.location','Use the scene. Which whole sentence describes the book?','El libro está debajo de la mesa.',['El libro está debajo de la mesa.','El libro está encima de la mesa.','Los libros están encima de la mesa.'],{object:'libro',support:'mesa',relation:'under'}],
 ['6a','6a.comparisons','Use the room sizes in the scene. Which comparison is correct?','El cuarto de Ana es más grande que el cuarto de Luis.',['El cuarto de Ana es más grande que el cuarto de Luis.','El cuarto de Ana es menos grande que el cuarto de Luis.','Los dos cuartos son iguales.'],{kind:'rooms'}],
 ['7a','7a.demonstratives','The blue shirt is here, beside the speaker. Which sentence uses that distance correctly?','Esta camisa es azul.',['Aquella camisa es azul.','Esta camisa es azul.','Estos zapatos son azules.'],{kind:'shirt'}]
]){const o=objectives.find(o=>o.id===objectiveId);exercises.push({id:`apply-${chapterId}-scene`,version:1,chapterId,objectiveIds:[objectiveId],kind:'scene-choice',prompt,acceptedAnswers:[answer],options,scene,feedback:`${answer} Compare the visible position, size or distance with the words in the sentence.`,context:'scene-application',production:false,productionType:'recognition',assessmentMode:'auto',reviewStatus:'reviewed',prerequisites:o.prerequisites,sourceRefs:o.sourceRefs,provenance:'Original Palabra scene and choices, author checked; independent teacher review pending.'});}
