export const PERSONS=['yo','tú','él/ella/usted','nosotros/nosotras','vosotros/vosotras','ellos/ellas/ustedes'];
export const FORM_SOURCE='https://www.rae.es/diccionario-estudiante/docs/conjugaciones-verbales.pdf';
// Restricted, explicit paradigms: never conjugate an arbitrary vocabulary infinitive.
// Regulars below are a reviewed whitelist, not a general suffix heuristic.
const regular=[
 ['hablar','to speak','2a'],['estudiar','to study','2a'],['escuchar','to listen','2a'],['trabajar','to work','2a'],['practicar','to practice','2a'],['dibujar','to draw','2a'],['usar','to use','2a'],['bailar','to dance','2a'],['cantar','to sing','2a'],['necesitar','to need','2a'],['enseñar','to teach','2a'],
 ['comer','to eat','3a'],['beber','to drink','3a'],['comprender','to understand','3a'],['compartir','to share','3a'],['escribir','to write','3a'],['vivir','to live','3a'],
 ['limpiar','to clean','6b'],['lavar','to wash','6b'],['abrir','to open','6b'],
 ['comprar','to buy','7b'],['buscar','to look for','7b'],['pagar','to pay','7b'],['llegar','to arrive','7b'],['visitar','to visit','7b'],['ayudar','to help','7b'],
 ['acabar','to finish / have just','9a'],['gustar','to be pleasing','9a'],['encantar','to delight','9a'],['interesar','to interest','9a']
];
export const verbs=regular.map(([infinitive,meaning,firstChapter])=>{
 const stem=infinitive.slice(0,-2),ending=infinitive.slice(-2),endings={ar:['o','as','a','amos','áis','an'],er:['o','es','e','emos','éis','en'],ir:['o','es','e','imos','ís','en']}[ending];
 const v={id:infinitive,infinitive,meaning,firstChapter,class:ending,forms:{present:endings.map(e=>stem+e)},notes:`Regular -${ending} present endings. The ending identifies the subject.`,sourceRefs:[FORM_SOURCE],reviewStatus:'reviewed'};
 if(['comprar','buscar','pagar','llegar','visitar','ayudar'].includes(infinitive)){
   v.forms.preterite=['é','aste','ó','amos','asteis','aron'].map(e=>stem+e);
   if(infinitive==='buscar')v.forms.preterite[0]='busqué';if(infinitive==='pagar')v.forms.preterite[0]='pagué';if(infinitive==='llegar')v.forms.preterite[0]='llegué';
   v.notes+=' In the preterite, -car becomes -qué and -gar becomes -gué in yo to preserve the sound.';
 }
 if(['comer','beber','vivir','escribir','compartir'].includes(infinitive))v.forms.preterite=['í','iste','ió','imos','isteis','ieron'].map(e=>stem+e);
 if(['limpiar','lavar','abrir','hablar','comer','escribir'].includes(infinitive))v.forms['affirmative-tú']=[stem+(ending==='ar'?'a':'e')];
 return v;
});
const irregulars=[
 ['estar','to be (state/location)','2b','estoy estás está estamos estáis están',null,null,'Yo ends in -oy; estás, está, estáis, están need written accents. Use estar for locations of people and objects.'],
 ['ser','to be (identity/description)','3b','soy eres es somos sois son',null,'sé','Ser identifies and describes; event locations also use ser. Do not reduce ser/estar to permanent/temporary.'],
 ['ir','to go','4a','voy vas va vamos vais van','fui fuiste fue fuimos fuisteis fueron','ve','Ir is irregular. Its preterite shares forms with ser; the context establishes meaning. Fui and fue have no written accent.'],
 ['jugar','to play','4b','juego juegas juega jugamos jugáis juegan',null,null,'U changes to ue in stressed present forms, but not nosotros or vosotros. Use jugar al fútbol.'],
 ['tener','to have','5a','tengo tienes tiene tenemos tenéis tienen',null,'ten','Yo has -go; e changes to ie except in nosotros/vosotros. Use tener for ages.'],
 ['venir','to come','5b','vengo vienes viene venimos venís vienen',null,'ven','Yo is vengo; nosotros is venimos, not vienimos.'],
 ['poder','to be able to','6a','puedo puedes puede podemos podéis pueden',null,null,'O changes to ue in stressed present forms. Follow poder with an infinitive.'],
 ['dormir','to sleep','6a','duermo duermes duerme dormimos dormís duermen',null,null,'O changes to ue except in nosotros and vosotros in the present.'],
 ['pensar','to think / plan','7a','pienso piensas piensa pensamos pensáis piensan',null,null,'E changes to ie in stressed present forms. Pensar + infinitive expresses a plan.'],
 ['querer','to want','7a','quiero quieres quiere queremos queréis quieren',null,null,'E changes to ie except nosotros/vosotros. Use querer + infinitive for what someone wants to do.'],
 ['preferir','to prefer','7a','prefiero prefieres prefiere preferimos preferís prefieren',null,null,'The final stem e changes to ie in stressed present forms. Nosotros remains preferimos.'],
 ['decir','to say / tell','8b','digo dices dice decimos decís dicen',null,'di','Yo is digo; stressed e changes to i. Decimos retains e.'],
 ['hacer','to do / make','8b','hago haces hace hacemos hacéis hacen','hice hiciste hizo hicimos hicisteis hicieron','haz','The preterite stem is hic-, but él/ella/usted is hizo to preserve the sound. These preterite forms have no written accent.'],
 ['dar','to give','8b','doy das da damos dais dan','di diste dio dimos disteis dieron',null,'Preterite di and dio have no written accent. Dar often has a recipient.'],
 ['pedir','to ask for / order','9b','pido pides pide pedimos pedís piden',null,null,'E changes to i in stressed present forms; pedimos/pedís retain e. Pedir requests something, preguntar asks a question.'],
 ['servir','to serve','9b','sirvo sirves sirve servimos servís sirven',null,null,'E changes to i except nosotros/vosotros in the present.'],
 ['saber','to know facts / know how','9b','sé sabes sabe sabemos sabéis saben',null,null,'Yo sé needs an accent. Saber + infinitive means know how; saber + a clause concerns information.'],
 ['conocer','to know / be familiar with','9b','conozco conoces conoce conocemos conocéis conocen',null,null,'Only yo has -zco here. Use personal a with a specific person.'],
 ['poner','to put','6b','pongo pones pone ponemos ponéis ponen',null,'pon','Affirmative tú is pon. Negative commands use a different mood and are outside this lesson.'],
 ['salir','to leave','6b','salgo sales sale salimos salís salen',null,'sal','Affirmative tú is sal; do not form it from salgo.']
];
for(const [infinitive,meaning,firstChapter,present,preterite,command,notes]of irregulars){
 const forms={present:present.split(' ')};if(preterite)forms.preterite=preterite.split(' ');if(command)forms['affirmative-tú']=[command];
 verbs.push({id:infinitive,infinitive,meaning,firstChapter,class:infinitive.slice(-2),forms,notes,sourceRefs:[FORM_SOURCE,`https://www.rae.es/dpd/${infinitive}`],reviewStatus:'reviewed'});
}
export function conjugate(id,tense,person){const v=verbs.find(v=>v.id===id);if(!v?.forms[tense])throw Error('This form has not been validated for this course.');const i=tense==='affirmative-tú'?0:PERSONS.indexOf(person);if(i<0)throw Error('Unknown subject.');return v.forms[tense][i];}
const examples={hablar:'Hablo español con Ana.',estudiar:'Estudiamos en la biblioteca.',escuchar:'Escuchas a la profesora.',trabajar:'Mis padres trabajan en casa.',practicar:'Practico deportes después de clase.',dibujar:'Ana dibuja una casa.',usar:'Usamos la computadora en clase.',bailar:'Mis amigos bailan en la fiesta.',cantar:'Canto con mi hermana.',necesitar:'Necesito un lápiz.',enseñar:'La profesora enseña español.',comer:'Comemos pan con la sopa.',beber:'Bebes agua con la comida.',comprender:'Comprendo la pregunta.',compartir:'Compartimos las fresas.',escribir:'Escribo una nota a Ana.',vivir:'Mi familia vive en Lima.',limpiar:'Limpio mi cuarto.',lavar:'Lavamos los platos.',abrir:'Abres la ventana.',comprar:'Compro una camisa azul.',buscar:'Busco un regalo para Ana.',pagar:'Pago la cuenta.',llegar:'Llegamos a la escuela a las ocho.',visitar:'Visito a mi abuela.',ayudar:'Ayudamos a nuestros vecinos.',acabar:'Acabo de escribir un mensaje.',gustar:'Me gustan las películas.',encantar:'Nos encanta escuchar música.',interesar:'A Ana le interesan los documentales.',estar:'El libro está en la mesa.',ser:'Mi hermana es paciente.',ir:'Vamos al parque.',jugar:'Juego al fútbol con mis amigos.',tener:'Tengo quince años.',venir:'Venimos al restaurante.',poder:'Puedo estudiar aquí.',dormir:'Dormimos en casa.',pensar:'Pienso comprar un libro.',querer:'Quiero leer esta novela.',preferir:'Preferimos las camisas azules.',decir:'Digo la verdad.',hacer:'Hago la tarea por la tarde.',dar:'Le doy un libro a Ana.',pedir:'Pido ayuda con la computadora.',servir:'Servimos la cena.',saber:'Sé enviar mensajes.',conocer:'Conozco a la profesora.',poner:'Pongo el libro en la mesa.',salir:'Salgo de casa a las ocho.'};
for(const v of verbs)v.example=examples[v.id];
