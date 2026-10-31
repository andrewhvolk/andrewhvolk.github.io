import {add,verbUnit} from './core.mjs?v=4ebb911b0e7554fd';
add('pe.greetings','pe-school','Greetings, introductions & address',[],
 'Use tú with a friend and usted for respectful singular address. Fixed expressions let you introduce yourself before learning whole verb paradigms.',
 ['Hola, me llamo Ana.','Buenos días, profesora. ¿Cómo está usted?'], 'Do not use informal estás when this task asks for usted.',`
school|Fill the formal greeting: Buenos ___, profesora. (morning)|días
school|Complete with the formal subject: ¿Cómo está ___, profesora?|usted
school|Introduce yourself as Ana: Me ___ Ana.|llamo
school|A friend says Hola. Give the same greeting.|hola
home|At night, complete Buenas ___.|noches
home|Complete the afternoon greeting: Buenas ___.|tardes
home|Give the informal subject in ¿Cómo estás ___, Luis?|tú
home|Say please in Spanish.|por favor
community|Complete a polite goodbye: Hasta ___. (tomorrow)|mañana
community|Someone helps you. Say thank you.|gracias
community|Complete the courteous response: De ___.|nada
community|You meet Elena. Complete Mucho ___.|gusto
`);
add('pe.instructions','pe-school','Instructions & body words',['pe.greetings'],
 'Learn classroom instructions as useful fixed expressions. Identify the action and the body word; this is not a lesson in forming commands yet.',
 ['Levanta la mano. = Raise your hand.','Abre el libro. = Open the book.'], 'A mano is a hand, not an arm. La mano is feminine despite ending in -o.',`
school|Levanta la mano. Which body part? Answer in English.|hand / the hand
school|Abre el libro. Does this mean open or close? Answer in English.|open
school|Escucha, por favor. Which action: listen or write? Answer in English.|listen
school|Complete the body word: la ___ (head).|cabeza
home|Complete: los ___ (eyes).|ojos
home|Complete: la ___ (mouth).|boca
home|Complete: el ___ (arm).|brazo
home|Complete: la ___ (hand).|mano
community|Cierra la puerta. Which action: open or close? Answer in English.|close
community|Escribe tu nombre. What should you write? Answer in English.|your name / name
community|Complete: el ___ (foot).|pie
community|Complete: las ___ (legs).|piernas
`);
add('pe.numbers-time','pe-school','Numbers & clock time',[],
 'Use es la una for one o’clock and son las with other hours. Add y + minutes; y media means half past. Numbers below are spelled as a single word when appropriate.',
 ['Es la una y diez.','Son las dos y media.'], 'Use la una, not las uno. Keep the accent in dieciséis and veintidós.',`
school|Write 16 in Spanish.|dieciséis
school|Write 22 in Spanish.|veintidós
school|Clock 1:00. Complete: Es la ___.|una
school|Clock 2:30. Complete: Son las dos y ___.|media
home|Write 30 in Spanish.|treinta
home|Write 15 in Spanish.|quince
home|Clock 3:15. Complete: Son las tres y ___. (a quarter)|cuarto
home|Clock 4:10. Complete: Son las cuatro y ___.|diez
community|Write 12 in Spanish.|doce
community|Write 21 in Spanish as a standalone number.|veintiuno
community|Clock 8:00. Complete: Son las ___.|ocho
community|Clock 1:20. Complete: Es la una y ___.|veinte
`);
add('pe.objects','pe-class','School objects & clarification',['pe.greetings'],
 'Use ¿Qué significa…? to ask for a meaning and ¿Cómo se dice…? for how to say something. Learn object nouns together with an article.',
 ['¿Qué significa libro?','El lápiz está aquí. = The pencil is here.'], 'Lápiz is masculine; mochila is feminine. Their articles are part of the phrase.',`
school|Complete: el ___ (book).|libro
school|Complete: la ___ (backpack).|mochila
school|Complete: el ___ (pencil).|lápiz
school|Ask for a meaning: ¿Qué ___ libro?|significa
home|Complete: la ___ (table).|mesa
home|Complete: la ___ (chair).|silla
home|Complete: el ___ (notebook).|cuaderno
home|Ask how to say something: ¿Cómo se ___ book en español?|dice
community|Complete: la ___ (door).|puerta
community|Complete: la ___ (window).|ventana
community|Ask for repetition: Otra vez, por ___.|favor
community|Ask politely: Más ___, por favor. (slowly)|despacio
`);
add('pe.spelling','pe-class','Alphabet & spelling',['pe.objects'],
 'Spanish letter names help you spell aloud. Hache is silent in words; eñe is a separate letter. Modern names include be, uve and ye; regional names also occur.',
 ['Ana: a, ene, a.','año: a, eñe, o.'], 'The letter ñ is not n with an optional accent: año and ano are different words.',`
school|Spell Ana with Spanish letter names, separated by spaces.|a ene a
school|Name the letter ñ.|eñe
school|Name the letter h.|hache
school|Name the letter m.|eme
home|Spell Leo with Spanish letter names, separated by spaces.|ele e o
home|Name the letter l.|ele
home|Name the letter r.|erre
home|Name the letter s.|ese
community|Spell Eva with Spanish letter names, separated by spaces. Uve or ve is accepted.|e uve a / e ve a
community|Name the letter b. Be or be larga is accepted.|be / be larga
community|Name the letter y. Ye or i griega is accepted.|ye / i griega
community|Name the letter c.|ce
`);
add('pe.dates','pe-class','Dates & calendars',['pe.numbers-time'],
 'Dates usually put the day before the month: el dos de mayo. Days and months use lowercase. Primero is conventional for the first of a month; uno also occurs.',
 ['Hoy es lunes.','Es el primero de junio.'], 'Do not capitalize months as English normally does.',`
school|Monday in Spanish?|lunes
school|Wednesday in Spanish?|miércoles
school|Complete May 2: el dos ___ mayo.|de
school|Complete June 1: el ___ de junio. (ordinal or cardinal)|primero / uno
home|Friday in Spanish?|viernes
home|Sunday in Spanish?|domingo
home|January in Spanish?|enero
home|Complete July 4: el cuatro de ___.|julio
community|September in Spanish? Both standard spellings accepted.|septiembre / setiembre
community|December in Spanish?|diciembre
community|Saturday in Spanish?|sábado
community|Complete October 30: el ___ de octubre.|treinta
`);
add('pe.weather','pe-weather','Weather, seasons & hemispheres',[],
 'Use hace in hace frío/calor, and fixed forms llueve and nieva for rain and snow. Seasons differ by hemisphere; June is generally summer in Spain and winter in Argentina.',
 ['Hace frío en invierno.','En Buenos Aires, junio es un mes de invierno.'], 'Do not say es frío for the weather pattern taught here. Local weather varies; hemisphere alone does not predict a particular day.',`
school|Cold weather: Hace ___.|frío
school|Hot weather: Hace ___.|calor
school|It is raining. One Spanish word.|llueve
school|It is snowing. One Spanish word.|nieva
home|Summer in Spanish?|verano
home|Winter in Spanish?|invierno
home|Spring in Spanish?|primavera
home|Autumn in Spanish?|otoño
community|June in Spain is in which season? Answer in Spanish.|verano
community|June in Argentina is in which season? Answer in Spanish.|invierno
community|Sunny weather: Hace ___.|sol
community|Windy weather: Hace ___.|viento
`);
add('1a.infinitives','1a','Infinitives & preferences',[],
 'An infinitive names an action and ends in -ar, -er or -ir. After me gusta, keep the activity in its infinitive. Do not conjugate it for yo in this construction.',
 ['Me gusta dibujar.','No me gusta correr.'], 'Me gusta estudio is incorrect for I like to study; use estudiar.',`
school|Choose the infinitive: estudio or estudiar.|estudiar
school|Complete: Me gusta ___ (to draw).|dibujar
school|Complete: Me gusta ___ (to listen) música.|escuchar
school|Complete: No me gusta ___ (to study).|estudiar
home|Choose the infinitive: bailar or bailo.|bailar
home|Complete: Me gusta ___ (to sing).|cantar
home|Complete: Me gusta ___ (to read).|leer
home|Complete: Me gusta ___ (to write).|escribir
community|Choose the infinitive: corro or correr.|correr
community|Complete: Me gusta ___ (to swim).|nadar
community|Complete: Me gusta ___ (to skate).|patinar
community|Complete: No me gusta ___ (to work).|trabajar
`);
add('1a.responses','1a','Negatives, agreement & disagreement',['1a.infinitives'],
 'Place no before me gusta to negate. A mí también agrees with a positive statement; a mí tampoco agrees with a negative. Use a mí sí or a mí no to disagree.',
 ['Me gusta cantar. —A mí también.','No me gusta bailar. —A mí tampoco.'], 'Tampoco agrees with a negative; it is not interchangeable with también.',`
school|Me gusta estudiar. Agree: A mí ___.|también
school|No me gusta correr. Agree: A mí ___.|tampoco
school|Make it negative by filling the blank: ___ me gusta dibujar.|no
school|Me gusta cantar. Disagree: A mí ___.|no
home|No me gusta leer. Disagree: A mí ___.|sí
home|Me gusta bailar. Agree: A mí ___.|también
home|No me gusta trabajar. Agree: A mí ___.|tampoco
home|Make it negative: ___ me gusta nadar.|no
community|Me gusta patinar. Disagree: A mí ___.|no
community|No me gusta cantar. Disagree: A mí ___.|sí
community|Me gusta escuchar música. Agree: A mí ___.|también
community|No me gusta estudiar. Agree: A mí ___.|tampoco
`);
add('1b.articles','1b','Singular articles',['pe.objects'],
 'El/la are singular definite articles (the); un/una are singular indefinite articles (a). Match grammatical gender, which is not always predictable from the final letter.',
 ['El libro; un libro.','La mano; una mano.'], 'La mano is feminine and el día is masculine. Learn exceptions with their articles.',`
school|Definite article: ___ libro.|el
school|Indefinite article: ___ mochila.|una
school|Definite article: ___ profesora.|la
school|Indefinite article: ___ lápiz.|un
home|Definite article: ___ mesa.|la
home|Indefinite article: ___ silla.|una
home|Definite article: ___ mano.|la
home|Indefinite article: ___ libro.|un
community|Definite article: ___ día.|el
community|Indefinite article: ___ amigo.|un
community|Definite article: ___ amiga.|la
community|Indefinite article: ___ puerta.|una
`);
add('1b.adjectives','1b','Describing people & adjective placement',['1b.articles'],
 'Most descriptive adjectives follow their noun. Adjectives ending in -o change to -a for a feminine noun. Many adjectives ending in -e, such as inteligente, do not change for gender.',
 ['Una chica simpática.','Un chico inteligente.'], 'Match the person described, not the speaker. Not every adjective uses -o/-a.',`
school|La chica es ___ (simpático).|simpática
school|El chico es ___ (alto).|alto
school|La profesora es ___ (inteligente).|inteligente
school|Order exactly these words as a noun phrase: simpática / una / chica.|una chica simpática
home|Mi amiga es ___ (artístico).|artística
home|Mi amigo es ___ (trabajador).|trabajador
home|Mi hermana es ___ (trabajador).|trabajadora
home|Order as a noun phrase: alto / un / chico.|un chico alto
community|Ana es ___ (deportista).|deportista
community|Luis es ___ (paciente).|paciente
community|Elena es ___ (reservado).|reservada
community|Order as a noun phrase: inteligente / una / persona.|una persona inteligente
`);
add('2a.subjects','2a','Subjects & person',['1a.infinitives'],
 'Yo means I, tú informal you, él/ella he/she, and nosotros/nosotras we. Usted uses third-person singular forms; ustedes uses third-person plural forms. Names can be replaced by the matching subject.',
 ['Ana y yo → nosotras or nosotros, depending on the group.','Usted habla; ustedes hablan.'], 'Usted is the listener but takes the él/ella verb form. Yo plus someone else takes nosotros/nosotras.',`
school|Replace Ana (she) with a subject pronoun.|ella
school|Replace Luis (he) with a subject pronoun.|él
school|I in Spanish?|yo
school|You, one friend, in Spanish?|tú
home|Ana y yo, an all-female group: subject pronoun?|nosotras
home|Luis y yo, a mixed group: subject pronoun?|nosotros
home|Ana y Elena: subject pronoun?|ellas
home|Luis y Ana: subject pronoun?|ellos
community|Respectful singular you: subject pronoun?|usted
community|Plural you used throughout Latin America: subject pronoun?|ustedes
community|Which form group for usted: él or tú?|él
community|Which form group for ustedes: ellos or nosotros?|ellos
`);
verbUnit('2a.present-ar','2a','Present -ar in context',['2a.subjects'],
 'For these regular -ar verbs, keep the stem and add -o, -as, -a, -amos, -áis, -an. The ending identifies who acts. Learn yo → estudio and nosotros → estudiamos; estar is taught separately as irregular.',
 ['Yo estudio español.','Nosotros escuchamos música.'], 'Nosotros takes -amos, not -an. Hablo and habló belong to different tenses.',[
 ['school','estudiar','yo','Yo ___ español.'],['school','hablar','tú','Tú ___ con Ana.'],['school','escuchar','nosotros/nosotras','Nosotros ___ a la profesora.'],['school','enseñar','él/ella/usted','La profesora ___ español.'],
 ['home','dibujar','yo','Yo ___ una casa.'],['home','trabajar','ellos/ellas/ustedes','Mis padres ___ en casa.'],['home','usar','él/ella/usted','Ana ___ una computadora.'],['home','cantar','nosotros/nosotras','Nosotras ___ en casa.'],
 ['community','bailar','tú','Tú ___ en la fiesta.'],['community','practicar','ellos/ellas/ustedes','Ellos ___ deportes.'],['community','necesitar','yo','Yo ___ un lápiz.'],['community','hablar','nosotros/nosotras','Nosotros ___ con Luis.']]);
add('2a.schedules','2a','Schedules & ordinal numbers',['pe.numbers-time','2a.present-ar'],
 'An ordinal gives a position: primero, segundo, tercero. Before a masculine singular noun, primero and tercero shorten to primer and tercer. Use a la una but a las dos for at a time.',
 ['La primera clase es español.','El tercer libro está aquí.'], 'Primera agrees with clase. Primer is the shortened form before a masculine singular noun.',`
school|La ___ clase es español. (first)|primera
school|La ___ clase es arte. (second)|segunda
school|La ___ clase es historia. (third)|tercera
school|El ___ libro es rojo. (first)|primer
home|El ___ libro es azul. (third)|tercer
home|La ___ actividad es leer. (fourth)|cuarta
home|La ___ actividad es dibujar. (fifth)|quinta
home|El segundo programa es a las dos. At what hour? Answer with the Spanish number.|dos
community|La reunión es ___ la una. (at)|a
community|El concierto es a ___ tres. (the)|las
community|Schedule: arte 8:00, español 9:00. Which class is second? Spanish name only.|español
community|Schedule: música 10:00, historia 11:00. Which class is first? Spanish name only.|música
`);
verbUnit('2b.estar','2b','Estar forms',['2a.subjects'],
 'Use estoy, estás, está, estamos, estáis, están. Estar locates people and objects and describes states. Write the accents; esta without an accent is not the verb está.',
 ['El libro está aquí.','Nosotros estamos en clase.'], 'Estoy has no written accent; está and están do. Do not apply the regular -ar yo ending to estar.',[
 ['school','estar','yo','Yo ___ en clase.'],['school','estar','tú','Tú ___ en la biblioteca.'],['school','estar','él/ella/usted','El libro ___ en la mesa.'],['school','estar','ellos/ellas/ustedes','Los libros ___ aquí.'],
 ['home','estar','nosotros/nosotras','Nosotros ___ en casa.'],['home','estar','él/ella/usted','Ana ___ en la cocina.'],['home','estar','ellos/ellas/ustedes','Mis padres ___ en casa.'],['home','estar','yo','Yo ___ en mi cuarto.'],
 ['community','estar','tú','Tú ___ en el parque.'],['community','estar','nosotros/nosotras','Nosotras ___ en el café.'],['community','estar','él/ella/usted','Usted ___ en el museo.'],['community','estar','ellos/ellas/ustedes','Ustedes ___ en la tienda.']]);
add('2b.location','2b','Spatial expressions',['2b.estar','1b.articles'],
 'Use encima de, debajo de, delante de, detrás de and al lado de to locate things. De + el contracts to del, but de la stays separate. Location depends on the stated viewpoint.',
 ['El libro está debajo de la mesa.','La silla está al lado del escritorio.'], 'Do not omit de in debajo de la mesa. De el becomes del.',`
school|The book is under the table: debajo ___ la mesa.|de
school|The clock is above the door: ___ de la puerta.|encima
school|The chair is next to the desk: al lado ___ escritorio.|del
school|The board is in front of the class: ___ de la clase.|delante
home|The bag is behind the chair: ___ de la silla.|detrás
home|The lamp is on top of the table: ___ de la mesa.|encima
home|The shoes are under the bed: ___ de la cama.|debajo
home|Next to the window: al ___ de la ventana.|lado
community|In front of the park: delante ___ parque.|del
community|Behind the museum: detrás ___ museo.|del
community|Near the library: cerca ___ la biblioteca.|de
community|Far from the school: lejos ___ la escuela.|de
`);
add('2b.plurals','2b','Plural nouns & articles',['1b.articles','1b.adjectives'],
 'Usually add -s after a vowel and -es after a consonant. Change final z to c before -es: lápiz → lápices. Articles become los/las or unos/unas. Accents may change as syllables change.',
 ['La mesa → las mesas.','El lápiz → los lápices.'], 'Do not use el with a plural noun. Lápiz changes spelling and keeps its stressed syllable in lápices.',`
school|Make the entire phrase plural: el libro.|los libros
school|Make the entire phrase plural: la mochila.|las mochilas
school|Make the entire phrase plural: el lápiz.|los lápices
school|Make the entire phrase plural: un profesor.|unos profesores
home|Make the entire phrase plural: la mesa.|las mesas
home|Make the entire phrase plural: una silla.|unas sillas
home|Make the entire phrase plural: el reloj.|los relojes
home|Make the entire phrase plural: la luz.|las luces
community|Make the entire phrase plural: un papel.|unos papeles
community|Make the entire phrase plural: la ventana.|las ventanas
community|Make the entire phrase plural: un cartel.|unos carteles
community|Make the entire phrase plural: una puerta.|unas puertas
`);
