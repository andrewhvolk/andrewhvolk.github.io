import {add,verbUnit} from './core.mjs?v=9c8e6b1621fb3d1c';
verbUnit('3a.present-er-ir','3a','Present -er and -ir',['2a.present-ar'],
 'Regular -er verbs use -o, -es, -e, -emos, -éis, -en. Regular -ir verbs use -o, -es, -e, -imos, -ís, -en. The nosotros and vosotros endings distinguish the two classes.',
 ['Yo como pan.','Nosotros compartimos la fruta.'],'Do not use -amos for comer or escribir. Nosotros comemos but escribimos.',[
 ['school','comer','yo','Yo ___ una manzana.'],['school','beber','tú','Tú ___ agua.'],['school','compartir','nosotros/nosotras','Nosotros ___ el pan.'],['school','escribir','él/ella/usted','Ana ___ una nota.'],
 ['home','vivir','yo','Yo ___ con mi familia.'],['home','comer','ellos/ellas/ustedes','Ellos ___ arroz.'],['home','beber','nosotros/nosotras','Nosotros ___ agua.'],['home','escribir','tú','Tú ___ una carta.'],
 ['café','comprender','él/ella/usted','Usted ___ el menú.'],['café','compartir','ellos/ellas/ustedes','Ellas ___ la ensalada.'],['café','comer','nosotros/nosotras','Nosotras ___ sopa.'],['café','beber','yo','Yo ___ jugo.']]);
add('3a.likes-plural','3a','Gusta, gustan & encanta',['1a.infinitives','2b.plurals'],
 'With gustar/encantar, the thing enjoyed is the grammatical subject. Use gusta/encanta with a singular noun or infinitive, gustan/encantan with plural nouns. Me identifies the person who enjoys it.',
 ['Me gusta el pan.','Me encantan las fresas.'],'Do not match gustar to yo. Match it to what is pleasing.',`
school|Me ___ las manzanas. (gustar)|gustan
school|Me ___ el pan. (gustar)|gusta
school|Me ___ las fresas. (encantar)|encantan
school|Me ___ comer fruta. (gustar)|gusta
home|Me ___ la sopa. (encantar)|encanta
home|Me ___ los huevos. (gustar)|gustan
home|Me ___ las verduras. (encantar)|encantan
home|Me ___ el arroz. (gustar)|gusta
café|Me ___ las ensaladas. (gustar)|gustan
café|Me ___ beber agua. (encantar)|encanta
café|Me ___ el jugo. (gustar)|gusta
café|Me ___ los tomates. (encantar)|encantan
`);
add('3b.plural-description','3b','Plural adjective agreement',['2b.plurals','1b.adjectives'],
 'A descriptive adjective agrees with its noun in number and gender. Adjectives ending in a consonant generally add -es in the plural; those ending in a vowel add -s.',
 ['Las manzanas son rojas.','Los tomates son saludables.'],'Pluralizing the noun alone is not enough: make the adjective plural too.',`
school|Las manzanas son ___ (rojo).|rojas
school|Los tomates son ___ (rojo).|rojos
school|Las ensaladas son ___ (bueno).|buenas
school|Los sándwiches son ___ (grande).|grandes
home|Las sopas son ___ (sabroso).|sabrosas
home|Los huevos son ___ (pequeño).|pequeños
home|Las zanahorias son ___ (anaranjado).|anaranjadas
home|Los platos son ___ (azul).|azules
café|Las mesas son ___ (grande).|grandes
café|Los camareros son ___ (amable).|amables
café|Las frutas son ___ (fresco).|frescas
café|Los alimentos son ___ (saludable).|saludables
`);
verbUnit('3b.ser','3b','Ser: identity & description',['2a.subjects','3b.plural-description'],
 'Ser identifies people and things, describes characteristics and gives origin. Its present forms are soy, eres, es, somos, sois, son. Description is a use, not a promise of permanence.',
 ['Soy estudiante.','Las verduras son saludables.'],'Use son for a plural subject. Somos means we are, not they are.',[
 ['school','ser','yo','Yo ___ estudiante.'],['school','ser','tú','Tú ___ una persona amable.'],['school','ser','él/ella/usted','La ensalada ___ verde.'],['school','ser','ellos/ellas/ustedes','Las manzanas ___ rojas.'],
 ['home','ser','nosotros/nosotras','Nosotros ___ hermanos.'],['home','ser','yo','Yo ___ de México.'],['home','ser','él/ella/usted','Mi hermana ___ paciente.'],['home','ser','ellos/ellas/ustedes','Mis padres ___ profesores.'],
 ['café','ser','tú','Tú ___ el camarero.'],['café','ser','nosotros/nosotras','Nosotras ___ estudiantes.'],['café','ser','él/ella/usted','Usted ___ de Perú.'],['café','ser','ellos/ellas/ustedes','Ustedes ___ amables.']]);
verbUnit('4a.ir','4a','Ir: destinations',['2a.subjects','2b.location'],
 'Present ir is voy, vas, va, vamos, vais, van. Put a before a destination; a + el contracts to al. Ir means going somewhere, not being there.',
 ['Voy a la biblioteca.','Vamos al parque.'],'Use voy, not vo or iro. A la stays two words; a el becomes al.',[
 ['school','ir','yo','Yo ___ a la biblioteca.'],['school','ir','tú','Tú ___ a clase.'],['school','ir','él/ella/usted','Ana ___ a la escuela.'],['school','ir','nosotros/nosotras','Nosotros ___ al gimnasio.'],
 ['home','ir','ellos/ellas/ustedes','Mis padres ___ a casa.'],['home','ir','yo','Yo ___ a la cocina.'],['home','ir','tú','Tú ___ al comedor.'],['home','ir','él/ella/usted','Luis ___ a su cuarto.'],
 ['town','ir','nosotros/nosotras','Nosotras ___ al museo.'],['town','ir','ellos/ellas/ustedes','Ustedes ___ al parque.'],['town','ir','él/ella/usted','Usted ___ al café.'],['town','ir','yo','Yo ___ a la tienda.']]);
add('4a.questions','4a','Questions & destinations',['4a.ir','pe.numbers-time'],
 'Question words carry accents: qué, quién, cuándo, dónde, adónde, cómo, por qué. Adónde asks toward where; dónde asks location. A yes/no question can use statement order with question intonation.',
 ['¿Adónde vas? —Al parque.','¿Cuándo vas? —A las tres.'],'Por qué asks why; porque introduces an answer. Do not omit the accents in direct questions.',`
school|Ask where someone is: ¿___ estás?|dónde
school|Ask where someone is going: ¿___ vas? Use one word.|adónde
school|Ask when: ¿___ vas a clase?|cuándo
school|Ask who: ¿___ es la profesora?|quién
home|Ask how: ¿___ estás?|cómo
home|Ask what: ¿___ estudias?|qué
home|Ask why: ¿___ ___ estudias? Type both words.|por qué
home|Complete the answer: ___ me gusta. (because)|porque
town|Voy ___ parque. Supply the contraction.|al
town|Voy a ___ biblioteca.|la
town|Question answered by A las dos: ¿___ vas? (when)|cuándo
town|Question answered by Al museo: ¿___ vas? One word.|adónde
`);
add('4b.future','4b','Plans & invitations',['4a.ir','1a.infinitives'],
 'Ir a + infinitive expresses a plan: conjugate ir, keep a, and leave the next verb in the infinitive. Accept with sí, me gustaría or decline politely with a reason.',
 ['Voy a estudiar.','¿Quieres bailar? —Lo siento, no puedo.'],'Do not conjugate both verbs: vamos a jugar, not vamos a jugamos.',`
school|Yo ___ a estudiar. (ir)|voy
school|Nosotros vamos ___ practicar.|a
school|Ana va a ___ (to read).|leer
school|Tú ___ a escuchar música. (ir)|vas
home|Ellos ___ a cocinar. (ir)|van
home|Complete: Voy a ___ (to write).|escribir
home|Decline politely: Lo ___, no puedo.|siento
home|Accept: Sí, me ___. (I would like to; fixed expression)|gustaría
town|Usted ___ a bailar. (ir)|va
town|Order exactly these words: vamos / estudiar / a.|vamos a estudiar
town|Invitación: ¿Quieres jugar? Accept with Sí, quiero ___.|jugar
town|Decline with the supplied reason: No puedo ___ tengo que estudiar.|porque
`);
verbUnit('4b.jugar','4b','Jugar in context',['2a.present-ar'],
 'Jugar changes u to ue in stressed present forms. Nosotros jugamos and vosotros jugáis keep u. Name a sport with jugar a; a + el becomes al.',
 ['Juego al tenis.','Jugamos al fútbol.'],'Do not change the stem in jugamos.',[
 ['school','jugar','yo','Yo ___ al fútbol.'],['school','jugar','tú','Tú ___ al tenis.'],['school','jugar','él/ella/usted','Ana ___ al voleibol.'],['school','jugar','nosotros/nosotras','Nosotros ___ al béisbol.'],
 ['home','jugar','ellos/ellas/ustedes','Ellos ___ a las cartas.'],['home','jugar','yo','Yo ___ con mi hermano.'],['home','jugar','nosotros/nosotras','Nosotras ___ en casa.'],['home','jugar','tú','Tú ___ con Ana.'],
 ['park','jugar','él/ella/usted','Usted ___ al tenis.'],['park','jugar','ellos/ellas/ustedes','Ustedes ___ al fútbol.'],['park','jugar','nosotros/nosotras','Nosotros ___ en el parque.'],['park','jugar','yo','Yo ___ al baloncesto.']]);
verbUnit('5a.tener','5a','Tener: family, ages & needs',['2a.subjects'],
 'Tener means have and expresses age: tengo quince años. Yo tengo is irregular; tienes/tiene/tienen change e to ie. Nosotros tenemos and vosotros tenéis keep e.',
 ['Tengo catorce años.','Mi hermana tiene un perro.'],'Spanish uses tener, not ser, for age. Tengo is not tiengo.',[
 ['school','tener','yo','Yo ___ quince años.'],['school','tener','tú','Tú ___ un lápiz.'],['school','tener','él/ella/usted','Ana ___ catorce años.'],['school','tener','nosotros/nosotras','Nosotros ___ clase.'],
 ['home','tener','ellos/ellas/ustedes','Mis hermanos ___ un perro.'],['home','tener','yo','Yo ___ dos hermanas.'],['home','tener','nosotros/nosotras','Nosotras ___ una familia grande.'],['home','tener','tú','Tú ___ un gato.'],
 ['party','tener','él/ella/usted','Usted ___ una cámara.'],['party','tener','ellos/ellas/ustedes','Ustedes ___ regalos.'],['party','tener','nosotros/nosotras','Nosotros ___ hambre.'],['party','tener','yo','Yo ___ sed.']]);
add('5a.possessives','5a','Possessive adjectives',['2b.plurals'],
 'Mi/tu/su become mis/tus/sus before plural possessions. Nuestro/nuestra/nuestros/nuestras agree with the thing possessed in gender and number. Su can mean his, her, your or their; use context to clarify.',
 ['Mi hermano; mis hermanos.','Nuestra casa; nuestros libros.'],'Possessives agree with the possession, not with the owner. Tu has no accent here; tú is a subject pronoun.',`
school|___ libro (my).|mi
school|___ libros (my).|mis
school|___ mochila (your, tú).|tu
school|___ mochilas (your, tú).|tus
home|___ casa (our).|nuestra
home|___ hermanos (our).|nuestros
home|___ hermanas (our).|nuestras
home|___ padre (our).|nuestro
party|Ana has a gift: ___ regalo (her).|su
party|Ana has gifts: ___ regalos (her).|sus
party|Luis has sisters: ___ hermanas (his).|sus
party|You have a family: ___ familia (your, usted).|su
`);
verbUnit('5b.venir','5b','Venir: coming to meet',['5a.tener'],
 'Venir is vengo, vienes, viene, venimos, venís, vienen. It describes coming toward a reference point. Ir describes going. Notice venimos uses -imos, not tenemos’s -emos.',
 ['Vengo al restaurante.','Mis amigos vienen a casa.'],'Nosotros venimos keeps e; do not write vienimos.',[
 ['school','venir','yo','Yo ___ a clase.'],['school','venir','tú','Tú ___ a la reunión.'],['school','venir','él/ella/usted','La profesora ___ hoy.'],['school','venir','nosotros/nosotras','Nosotros ___ a la escuela.'],
 ['home','venir','ellos/ellas/ustedes','Mis primos ___ a casa.'],['home','venir','yo','Yo ___ con mi hermana.'],['home','venir','nosotros/nosotras','Nosotras ___ a la fiesta.'],['home','venir','tú','Tú ___ a cenar.'],
 ['restaurant','venir','él/ella/usted','Usted ___ al restaurante.'],['restaurant','venir','ellos/ellas/ustedes','Ustedes ___ a las seis.'],['restaurant','venir','nosotros/nosotras','Nosotros ___ con Ana.'],['restaurant','venir','yo','Yo ___ a comer.']]);
add('5b.ser-estar','5b','Ser & estar: meaning in context',['3b.ser','2b.estar'],
 'Use ser for identity, origin and characteristic descriptions; estar for locations of people/objects and states. Event locations use ser. Some adjectives change meaning: es listo means clever; está listo means ready.',
 ['La cena es en mi casa.','La sopa está fría ahora.'],'Permanent/temporary is unreliable: Madrid está en España, and an event location uses ser.',`
school|Ana ___ estudiante. (ser or estar, conjugated)|es
school|Los libros ___ en la mesa. (ser or estar, conjugated)|están
school|La reunión ___ en la biblioteca. (event location)|es
school|Yo ___ listo para salir. (ready)|estoy
home|Mi hermano ___ listo. (clever, characteristic)|es
home|Nosotros ___ en casa. (location)|estamos
home|La fiesta ___ en casa. (event location)|es
home|Mi madre ___ de Perú. (origin)|es
restaurant|La sopa ___ fría ahora. (state)|está
restaurant|El camarero ___ amable. (characteristic)|es
restaurant|Las mesas ___ cerca de la ventana. (location)|están
restaurant|Ustedes ___ los clientes. (identity)|son
`);
add('6a.comparisons','6a','Comparisons & superlatives',['3b.ser','3b.plural-description'],
 'Use más/menos + adjective + que to compare; tan + adjective + como for equality. A relative superlative uses el/la/los/las más + adjective. Mejor and peor already mean better and worse.',
 ['Mi cuarto es más grande que tu cuarto.','Esta es la casa más pequeña.'],'Do not say más mejor. Match the article and adjective to the noun.',`
school|Ana es más alta ___ Luis.|que
school|Este libro es tan grande ___ ese.|como
school|El examen es ___ fácil que ayer. (more)|más
school|Better in Spanish (single adjective).|mejor
home|Mi cuarto es ___ grande que el tuyo. (less)|menos
home|La casa ___ pequeña de la calle. (most)|más
home|Las camas más ___ (cómodo).|cómodas
home|Worse in Spanish (single adjective).|peor
shop|Este escritorio es más caro ___ ese.|que
shop|La silla es tan cómoda ___ la cama.|como
shop|___ mesa más grande. (the, feminine singular)|la
shop|___ muebles más caros. (the, masculine plural)|los
`);
verbUnit('6a.stem-ue','6a','Poder & dormir',['3a.present-er-ir'],
 'Poder and dormir change o to ue in stressed present forms, but nosotros/vosotros keep o. Poder + infinitive describes ability; do not conjugate the following infinitive.',
 ['Puedo estudiar aquí.','Dormimos en casa.'],'Nosotros podemos and dormimos keep o. Puedo hablo is incorrect; use puedo hablar.',[
 ['school','poder','yo','Yo ___ estudiar aquí.'],['school','poder','tú','Tú ___ leer el libro.'],['school','poder','nosotros/nosotras','Nosotros ___ trabajar juntos.'],['school','poder','ellos/ellas/ustedes','Ellas ___ hablar español.'],
 ['home','dormir','yo','Yo ___ ocho horas.'],['home','dormir','tú','Tú ___ en tu cuarto.'],['home','dormir','nosotros/nosotras','Nosotras ___ en casa.'],['home','dormir','él/ella/usted','El gato ___ aquí.'],
 ['trip','poder','él/ella/usted','Usted ___ venir.'],['trip','poder','nosotros/nosotras','Nosotros ___ visitar el museo.'],['trip','dormir','ellos/ellas/ustedes','Mis primos ___ en el hotel.'],['trip','dormir','nosotros/nosotras','Nosotros ___ en el hotel.']]);
verbUnit('6b.commands','6b','Affirmative tú commands',['2a.present-ar','3a.present-er-ir'],
 'Regular affirmative tú commands match the él/ella present form. Learn the exceptions di, haz, ve, pon, sal, sé, ten, ven. These are affirmative only; negative commands require a different pattern.',
 ['Limpia tu cuarto.','Pon el libro en la mesa.'],'Sé needs a written accent. Do not use these affirmative forms after no.',[
 ['home','limpiar','tú','___ tu cuarto, por favor.'],['home','lavar','tú','___ los platos, por favor.'],['home','poner','tú','___ la mesa, por favor.'],['home','hacer','tú','___ la cama, por favor.'],
 ['school','abrir','tú','___ el libro, por favor.'],['school','decir','tú','___ la respuesta, por favor.'],['school','ser','tú','___ amable con los compañeros.'],['school','tener','tú','___ paciencia, por favor.'],
 ['town','ir','tú','___ al parque.'],['town','salir','tú','___ de la tienda.'],['town','venir','tú','___ aquí, por favor.'],['town','hablar','tú','___ con Ana.']], 'affirmative-tú');
add('6b.progressive','6b','Actions in progress',['2b.estar','3a.present-er-ir'],
 'Use a present form of estar + gerund for an action in progress: -ar → -ando, -er/-ir → -iendo. Some gerunds are irregular: leer → leyendo, dormir → durmiendo, pedir → pidiendo. Do not use a gerund after ir a.',
 ['Estoy limpiando la cocina.','Estamos leyendo.'],'Conjugate estar, not the gerund: estamos escribiendo, not estamos escribimos.',`
home|Yo estoy ___ los platos. (lavar)|lavando
home|Ana está ___ su cuarto. (limpiar)|limpiando
home|Ellos ___ comiendo ahora. (estar)|están
home|Nosotros estamos ___. (dormir)|durmiendo
school|Yo ___ escribiendo una nota. (estar)|estoy
school|Ana está ___ un libro. (leer)|leyendo
school|Nosotros estamos ___ español. (estudiar)|estudiando
school|Tú ___ hablando. (estar)|estás
restaurant|Estamos ___ agua. (beber)|bebiendo
restaurant|Ella está ___ pan. (pedir)|pidiendo
restaurant|Usted está ___. (comer)|comiendo
restaurant|Nosotros ___ esperando. (estar)|estamos
`);
