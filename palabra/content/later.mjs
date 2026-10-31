import {add,verbUnit} from './core.mjs?v=58415db71aab4d54';
verbUnit('7a.stem-ie','7a','Pensar, querer & preferir',['3a.present-er-ir'],
 'These verbs change a stem e to ie in stressed present forms; nosotros/vosotros keep e. Pensar + infinitive expresses an intention, querer + infinitive a desire, and preferir a preference.',
 ['Quiero comprar una camisa.','Preferimos los zapatos negros.'],'Nosotros pensamos, queremos and preferimos keep e. The last two letters alone cannot predict these forms.',[
 ['school','pensar','yo','Yo ___ estudiar hoy.'],['school','querer','tú','Tú ___ leer.'],['school','preferir','nosotros/nosotras','Nosotros ___ estudiar juntos.'],['school','pensar','ellos/ellas/ustedes','Ellas ___ practicar.'],
 ['home','querer','yo','Yo ___ descansar.'],['home','preferir','él/ella/usted','Ana ___ la camisa azul.'],['home','pensar','nosotros/nosotras','Nosotras ___ salir.'],['home','querer','nosotros/nosotras','Nosotros ___ cocinar.'],
 ['shop','preferir','yo','Yo ___ los zapatos negros.'],['shop','querer','ellos/ellas/ustedes','Ustedes ___ comprar ropa.'],['shop','pensar','tú','Tú ___ pagar ahora.'],['shop','preferir','ellos/ellas/ustedes','Ellos ___ la chaqueta verde.']]);
add('7a.demonstratives','7a','Demonstrative adjectives',['1b.adjectives','2b.plurals'],
 'Use este/esta/estos/estas near the speaker, ese/esa/esos/esas for the indicated middle distance, and aquel/aquella/aquellos/aquellas farther away. Agree with the noun. The context must establish distance.',
 ['Esta camisa aquí es azul.','Aquellos zapatos allá son negros.'],'Demonstrative adjectives have no written accents. Do not confuse esta camisa with está (the verb).',`
school|This book here: ___ libro.|este
school|This backpack here: ___ mochila.|esta
school|These books here: ___ libros.|estos
school|These chairs here: ___ sillas.|estas
home|That table by you: ___ mesa.|esa
home|That clock by you: ___ reloj.|ese
home|Those books by you: ___ libros.|esos
home|Those lamps by you: ___ lámparas.|esas
shop|That shirt far over there: ___ camisa.|aquella
shop|That coat far over there: ___ abrigo.|aquel
shop|Those shoes far over there: ___ zapatos.|aquellos
shop|Those skirts far over there: ___ faldas.|aquellas
`);
verbUnit('7b.preterite-ar','7b','Completed actions: -ar preterite',['2a.present-ar','pe.dates'],
 'Use the preterite for a bounded completed event. Regular -ar endings are -é, -aste, -ó, -amos, -asteis, -aron. Nosotros -amos looks like the present; a time expression such as ayer establishes the past.',
 ['Ayer compré una camisa.','El sábado visitamos a Ana.'],'Compré and compró distinguish yo and él/ella/usted. Neither is interchangeable with present compro.',[
 ['shop','comprar','yo','Ayer yo ___ una camisa.'],['shop','comprar','tú','Ayer tú ___ zapatos.'],['shop','comprar','él/ella/usted','Ayer Ana ___ una falda.'],['shop','comprar','nosotros/nosotras','Ayer nosotros ___ ropa.'],
 ['home','ayudar','yo','Ayer yo ___ a mi madre.'],['home','ayudar','ellos/ellas/ustedes','Ayer ellos ___ en casa.'],['home','visitar','nosotros/nosotras','Ayer nosotras ___ a la abuela.'],['home','visitar','él/ella/usted','Ayer Luis ___ a su primo.'],
 ['town','visitar','tú','Ayer tú ___ el museo.'],['town','comprar','ellos/ellas/ustedes','Ayer ustedes ___ entradas.'],['town','ayudar','nosotros/nosotras','Ayer nosotros ___ a Ana.'],['town','comprar','yo','El lunes yo ___ un libro.']], 'preterite');
verbUnit('7b.spelling','7b','Preterite -car/-gar spelling',['7b.preterite-ar'],
 'In the yo preterite, -car changes c to qu before é and -gar adds u before é: busqué, pagué, llegué. This preserves sound. Other persons keep the ordinary stem in these verbs.',
 ['Busqué una camiseta.','Ana pagó la cuenta.'],'Do not spread the yo spelling change to tú: buscaste, not busquaste.',[
 ['shop','buscar','yo','Ayer yo ___ una camisa.'],['shop','pagar','yo','Ayer yo ___ veinte euros.'],['shop','buscar','tú','Ayer tú ___ zapatos.'],['shop','pagar','él/ella/usted','Ayer Ana ___ la cuenta.'],
 ['school','llegar','yo','Ayer yo ___ a clase.'],['school','buscar','yo','Ayer yo ___ un libro.'],['school','llegar','nosotros/nosotras','Ayer nosotros ___ temprano.'],['school','buscar','ellos/ellas/ustedes','Ayer ellos ___ lápices.'],
 ['town','pagar','yo','Ayer yo ___ la entrada.'],['town','llegar','yo','Ayer yo ___ al museo.'],['town','pagar','nosotros/nosotras','Ayer nosotras ___ la comida.'],['town','llegar','ellos/ellas/ustedes','Ayer ustedes ___ a casa.']], 'preterite');
add('7b.direct-object','7b','Direct-object pronouns',['7b.preterite-ar','2b.plurals'],
 'Lo/la/los/las can replace an explicitly identified direct object. Agree with that object and place the pronoun before a conjugated verb. This lesson uses things to avoid regional variation in pronouns for people.',
 ['La camisa: la compré.','Los libros: los busqué.'],'Do not match the pronoun to the buyer. It replaces the item bought.',`
shop|La camisa: ___ compré ayer.|la
shop|El abrigo: ___ compré ayer.|lo
shop|Los zapatos: ___ compré ayer.|los
shop|Las faldas: ___ compré ayer.|las
school|El libro: ___ busqué ayer.|lo
school|Las mochilas: ___ busqué ayer.|las
school|La carpeta: ___ compré ayer.|la
school|Los lápices: ___ compré ayer.|los
home|La mesa: ___ compré ayer.|la
home|El reloj: ___ compré ayer.|lo
home|Las sillas: ___ compré ayer.|las
home|Los muebles: ___ compré ayer.|los
`);
verbUnit('8a.preterite-er-ir','8a','Completed actions: -er/-ir preterite',['3a.present-er-ir','7b.preterite-ar'],
 'Regular -er and -ir verbs share preterite endings: -í, -iste, -ió, -imos, -isteis, -ieron. Some verbs outside this whitelist have exceptions; do not extend the pattern blindly.',
 ['Ayer comí arroz.','Mis amigos escribieron una nota.'],'Él comió needs an accent. Nosotros escribimos can be present or past; use the context.',[
 ['restaurant','comer','yo','Ayer yo ___ arroz.'],['restaurant','beber','tú','Ayer tú ___ agua.'],['restaurant','comer','él/ella/usted','Ayer Ana ___ sopa.'],['restaurant','compartir','nosotros/nosotras','Ayer nosotros ___ el pan.'],
 ['school','escribir','yo','Ayer yo ___ una nota.'],['school','escribir','ellos/ellas/ustedes','Ayer ellos ___ cartas.'],['school','comer','nosotros/nosotras','Ayer nosotras ___ en la escuela.'],['school','beber','él/ella/usted','Ayer Luis ___ jugo.'],
 ['trip','vivir','tú','En 2020 tú ___ en Lima.'],['trip','compartir','ellos/ellas/ustedes','Ayer ustedes ___ la comida.'],['trip','beber','nosotros/nosotras','Ayer nosotros ___ agua.'],['trip','escribir','yo','Ayer yo ___ una postal.']], 'preterite');
verbUnit('8a.preterite-ir','8a','Ir in the preterite',['4a.ir','7b.preterite-ar'],
 'Ir has preterite forms fui, fuiste, fue, fuimos, fuisteis, fueron. They also belong to ser; a destination usually makes ir’s meaning clear. Fui and fue are unaccented monosyllables.',
 ['Fui al museo ayer.','Fuimos a la playa.'],'Do not write fuí or fué. Use the destination to distinguish went from was.',[
 ['school','ir','yo','Ayer yo ___ a la biblioteca.'],['school','ir','tú','Ayer tú ___ a clase.'],['school','ir','él/ella/usted','Ayer Ana ___ al gimnasio.'],['school','ir','nosotros/nosotras','Ayer nosotros ___ a la escuela.'],
 ['home','ir','ellos/ellas/ustedes','Ayer ellos ___ a casa.'],['home','ir','yo','Ayer yo ___ a la cocina.'],['home','ir','nosotros/nosotras','Ayer nosotras ___ al jardín.'],['home','ir','tú','Ayer tú ___ a casa de Ana.'],
 ['trip','ir','él/ella/usted','Ayer usted ___ al museo.'],['trip','ir','ellos/ellas/ustedes','Ayer ustedes ___ a la playa.'],['trip','ir','nosotros/nosotras','Ayer nosotros ___ al parque.'],['trip','ir','yo','El lunes yo ___ al café.']], 'preterite');
add('8a.personal-a','8a','Personal a',['8a.preterite-ir','7b.preterite-ar'],
 'Use personal a before a specific human direct object: visité a Ana. Do not use it for an ordinary thing such as a museum. A + el contracts to al. This course constrains cases instead of claiming a rule without exceptions.',
 ['Visité a mi abuela.','Visité el museo.'],'Do not add personal a before el museo. For el profesor, write al profesor.',`
school|Visité ___ Ana. Use a or — for none.|a
school|Busqué ___ mi profesora. Use a or —.|a
school|Visité ___ el museo. Use a or —.|—
school|Visité ___ profesor. Supply the contraction.|al
home|Visité ___ mi abuela. Use a or —.|a
home|Busqué ___ mi hermano. Use a or —.|a
home|Busqué ___ el libro. Use a or —.|—
home|Visité ___ mi primo. Use a or —.|a
town|Visité ___ la doctora. Use a or —.|a
town|Visité ___ la biblioteca. Use a or —.|—
town|Busqué ___ camarero. Supply the contraction.|al
town|Visité ___ mis amigos. Use a or —.|a
`);
verbUnit('8b.decir','8b','Decir in the present',['3a.present-er-ir'],
 'Decir has digo in yo and dices/dice/dicen with e→i. Nosotros decimos and vosotros decís keep e. This is the present, distinct from the preterite of dar (di).',
 ['Digo la verdad.','Decimos gracias.'],'Do not apply the stem change to decimos.',[
 ['school','decir','yo','Yo ___ la respuesta.'],['school','decir','tú','Tú ___ la verdad.'],['school','decir','él/ella/usted','La profesora ___ hola.'],['school','decir','nosotros/nosotras','Nosotros ___ gracias.'],
 ['home','decir','ellos/ellas/ustedes','Mis hermanos ___ buenas noches.'],['home','decir','yo','Yo ___ hasta mañana.'],['home','decir','nosotros/nosotras','Nosotras ___ la verdad.'],['home','decir','tú','Tú ___ gracias.'],
 ['community','decir','él/ella/usted','Usted ___ buenos días.'],['community','decir','ellos/ellas/ustedes','Ustedes ___ hola.'],['community','decir','nosotros/nosotras','Nosotros ___ adiós.'],['community','decir','yo','Yo ___ por favor.']]);
add('8b.indirect-object','8b','Indirect-object pronouns',['5a.possessives','7b.direct-object'],
 'Me/te/le/nos/os/les identify recipients. Le/les do not mark gender. Add a + person to clarify who receives something: le doy un libro a Ana. This lesson does not combine two object pronouns.',
 ['Le doy agua a Ana.','Nos dan libros a nosotros.'],'The book given is the direct object; the recipient is indirect. Le is singular; les is plural.',`
school|Yo ___ doy un libro a Ana.|le
school|Ana ___ da un lápiz a mí.|me
school|Yo ___ doy libros a mis amigos.|les
school|Ana ___ da papel a ti.|te
home|Mi madre ___ da regalos a nosotros.|nos
home|Yo ___ doy agua a mi padre.|le
home|Yo ___ doy comida a mis hermanas.|les
home|Mi hermano ___ da un regalo a mí.|me
community|Yo ___ doy libros a ustedes.|les
community|Ana ___ da comida a usted.|le
community|Ellos ___ dan ayuda a nosotros.|nos
community|Nosotros ___ damos una carta a ti.|te
`);
verbUnit('8b.preterite-hacer-dar','8b','Hacer & dar in the preterite',['8a.preterite-er-ir','8b.indirect-object'],
 'Hacer uses hice, hiciste, hizo, hicimos, hicisteis, hicieron; note hizo with z. Dar uses di, diste, dio, dimos, disteis, dieron. These forms have no written accents.',
 ['Hice la tarea.','Ana dio comida a su vecina.'],'Do not write hico or dió. Hizo preserves the sound; dio is a monosyllable without an accent.',[
 ['school','hacer','yo','Ayer yo ___ la tarea.'],['school','hacer','tú','Ayer tú ___ un cartel.'],['school','hacer','él/ella/usted','Ayer Ana ___ un dibujo.'],['school','dar','nosotros/nosotras','Ayer nosotros ___ libros.'],
 ['home','dar','yo','Ayer yo ___ un regalo.'],['home','dar','él/ella/usted','Ayer mi madre ___ comida.'],['home','hacer','nosotros/nosotras','Ayer nosotras ___ la cena.'],['home','dar','tú','Ayer tú ___ agua al perro.'],
 ['community','hacer','ellos/ellas/ustedes','Ayer ellos ___ carteles.'],['community','dar','ellos/ellas/ustedes','Ayer ustedes ___ ayuda.'],['community','dar','nosotros/nosotras','Ayer nosotros ___ ropa.'],['community','hacer','yo','El lunes yo ___ trabajo voluntario.']], 'preterite');
add('9a.acabar','9a','Acabar de: just completed',['2a.present-ar','1a.infinitives'],
 'Present acabar de + infinitive expresses something just completed. Conjugate acabar for the subject, keep de, and leave the action as an infinitive. This differs from acabar alone, to finish.',
 ['Acabo de ver una película.','Acabamos de comer.'],'Do not use a preterite after de: acabo de comprar, not acabo de compré.',`
school|Yo ___ de estudiar. (acabar)|acabo
school|Tú acabas ___ leer.|de
school|Ana acaba de ___ (to write).|escribir
school|Nosotros ___ de escuchar. (acabar)|acabamos
home|Ellos ___ de comer. (acabar)|acaban
home|Yo acabo de ___ (to buy).|comprar
home|Tú ___ de cantar. (acabar)|acabas
home|Ana acaba ___ bailar.|de
cinema|Usted ___ de ver la película. (acabar)|acaba
cinema|Nosotras acabamos de ___ (to arrive).|llegar
cinema|Ustedes ___ de salir. (acabar)|acaban
cinema|Order exactly these words: de / acabo / comer.|acabo de comer
`);
add('9a.reactions','9a','Gustar, encantar & interesar',['3a.likes-plural','8b.indirect-object'],
 'With gustar, encantar and interesar, match the verb to the thing that causes the reaction. Use me/te/le/nos/les for the person reacting. A mí or a Ana adds emphasis or clarifies the person; the pronoun remains.',
 ['A Ana le interesan los documentales.','Nos encanta bailar.'],'A Ana gustan is missing le. Match interesan to plural documentales, not to Ana.',`
school|A Ana ___ gusta leer.|le
school|A mí me ___ los libros. (gustar)|gustan
school|A nosotros ___ interesa la historia.|nos
school|A ti te ___ estudiar. (encantar)|encanta
home|A mis padres ___ gusta el cine.|les
home|A mí me ___ las películas. (interesar)|interesan
home|A Ana le ___ las comedias. (encantar)|encantan
home|A nosotros nos ___ leer. (gustar)|gusta
cinema|A ustedes ___ interesan los documentales.|les
cinema|A ti ___ gusta esta película.|te
cinema|A mí me ___ el programa. (interesar)|interesa
cinema|A ellas les ___ las películas. (gustar)|gustan
`);
verbUnit('9b.pedir-servir','9b','Pedir & servir',['3a.present-er-ir'],
 'Pedir and servir change e to i in stressed present forms; nosotros/vosotros keep e. Pedir means request or order an item; preguntar means ask a question.',
 ['Pido ayuda con la computadora.','Servimos la comida.'],'Nosotros pedimos and servimos retain e. Yo pido, not pedo.',[
 ['school','pedir','yo','Yo ___ ayuda.'],['school','pedir','tú','Tú ___ un lápiz.'],['school','pedir','nosotros/nosotras','Nosotros ___ información.'],['school','servir','él/ella/usted','La computadora ___ para estudiar.'],
 ['home','servir','yo','Yo ___ la comida.'],['home','servir','tú','Tú ___ agua.'],['home','servir','nosotros/nosotras','Nosotras ___ la cena.'],['home','pedir','él/ella/usted','Ana ___ ayuda.'],
 ['café','pedir','ellos/ellas/ustedes','Ustedes ___ la cuenta.'],['café','servir','ellos/ellas/ustedes','Ellos ___ el pan.'],['café','pedir','nosotros/nosotras','Nosotros ___ agua.'],['café','servir','él/ella/usted','Usted ___ la sopa.']]);
add('9b.saber-conocer','9b','Saber & conocer',['3a.present-er-ir','8a.personal-a'],
 'Use saber for information and knowing how to do something, conocer for familiarity with a person or place. Yo forms are sé and conozco. Use personal a with a specific human direct object of conocer.',
 ['Sé usar la computadora.','Conozco a Ana.'],'Saber + infinitive needs no preposition: sé escribir. Yo sé has an accent; conozco has zc.',`
school|Yo ___ usar la computadora. (saber/conocer, conjugated)|sé
school|Yo ___ a la profesora. (saber/conocer, conjugated)|conozco
school|Ana ___ la respuesta. (saber/conocer, conjugated)|sabe
school|Nosotros ___ escribir. (saber/conocer, conjugated)|sabemos
home|Tú ___ a mi hermano. (saber/conocer, conjugated)|conoces
home|Mis padres ___ cocinar. (saber/conocer, conjugated)|saben
home|Nosotras ___ esta ciudad. (saber/conocer, conjugated)|conocemos
home|Yo ___ la contraseña. (saber/conocer, conjugated)|sé
community|Ustedes ___ a Ana. (saber/conocer, conjugated)|conocen
community|Usted ___ dónde está el museo. (saber/conocer, conjugated)|sabe
community|Yo ___ Madrid. (saber/conocer, conjugated)|conozco
community|Tú ___ enviar mensajes. (saber/conocer, conjugated)|sabes
`);
