/* SergioLearns — interfaz del probador de expresiones regulares (.sl-sim[data-sim="regex"]). Necesita kit.js y engine.js (SLRx). */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, R = window.SLRx;
  var MAXT = 4000;   // caracteres de texto como mucho
  var COLS = ['#5B4BDB', '#FF6B4A', '#16794B', '#D9651C', '#2F5FD0', '#C2362B', '#A99EF5', '#F5A524'];
  var PYF = [['I', 're.I', 'IGNORECASE'], ['M', 're.M', 'MULTILINE'], ['S', 're.S', 'DOTALL'], ['X', 're.X', 'VERBOSE'], ['A', 're.A', 'ASCII']];
  var JFL = [[2, 'CASE_INSENSITIVE'], [8, 'MULTILINE'], [32, 'DOTALL'], [4, 'COMMENTS'], [64, 'UNICODE_CASE'], [256, 'UNICODE_CHARACTER_CLASS']];
  // Ejemplos: se escriben en Python; a Java se pasan con toJava()
  var EX = {
    es: [
      { k: 'ip', n: 'Las IP de un log (el que TeaVM leía mal)', re: '\\d{1,3}(?:\\.\\d{1,3}){3}', f: [], rep: '<IP>', t: '09:00:01 INFO 10.0.0.7 arranque del servidor\n09:01:02 WARN 192.168.1.20 sesión a punto de caducar\n09:01:40 ERROR 172.16.0.3 acceso denegado a /actas' },
      { k: 'fecha', n: 'Fechas dd/mm/aaaa a ISO con grupos con nombre', re: '(?P<dia>\\d{1,2})/(?P<mes>\\d{1,2})/(?P<anio>\\d{4})', f: [], rep: '\\g<anio>-\\g<mes>-\\g<dia>', t: 'Entrega: 7/3/2027. Examen: 15/01/2027. Revisión: 22/01/2027.' },
      { k: 'matricula', n: 'Matrículas del parking (sin vocales)', re: '\\b\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}\\b', f: ['I'], rep: null, t: 'Entran 1234 BCD, 4521-LKP, 0000AEI y 7788 xyz por la barrera.' },
      { k: 'correo', n: 'Correos de la ULPGC', re: '[\\w.+-]+@(?:alu\\.)?ulpgc\\.es', f: [], rep: null, t: 'Escribid a laura.santana101@alu.ulpgc.es o a secretaria@ulpgc.es, no a laura@gmail.com.' },
      { k: 'notas', n: 'Nombre y nota, línea a línea (MULTILINE)', re: '^(\\w+):\\s*(\\d+(?:[.,]\\d+)?)$', f: ['M'], rep: '\\2 → \\1', t: 'Laura: 9,5\nPablo: 4\nAna: 7.25\nsin nota\nLuis: 10' },
      { k: 'voraz', n: 'Voraz frente a perezoso: <.+> y <.+?>', re: '<.+?>', f: [], rep: '', t: 'Hola <b>Laura</b>, tu nota es <i>9,5</i>.' },
      { k: 'csv', n: 'Partir una línea con ; y espacios (split)', re: '\\s*;\\s*', f: [], rep: null, t: 'FP1 ; 8,5;IC1 ;  7;FP2;9' }
    ],
    en: [
      { k: 'ip', n: 'IP addresses in a log (the one TeaVM got wrong)', re: '\\d{1,3}(?:\\.\\d{1,3}){3}', f: [], rep: '<IP>', t: '09:00:01 INFO 10.0.0.7 server starting\n09:01:02 WARN 192.168.1.20 session about to expire\n09:01:40 ERROR 172.16.0.3 access denied to /marks' },
      { k: 'fecha', n: 'dd/mm/yyyy dates to ISO with named groups', re: '(?P<day>\\d{1,2})/(?P<month>\\d{1,2})/(?P<year>\\d{4})', f: [], rep: '\\g<year>-\\g<month>-\\g<day>', t: 'Deadline: 7/3/2027. Exam: 15/01/2027. Review: 22/01/2027.' },
      { k: 'matricula', n: 'Car park number plates (no vowels)', re: '\\b\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}\\b', f: ['I'], rep: null, t: 'In come 1234 BCD, 4521-LKP, 0000AEI and 7788 xyz through the barrier.' },
      { k: 'correo', n: 'University email addresses', re: '[\\w.+-]+@(?:alu\\.)?ulpgc\\.es', f: [], rep: null, t: 'Write to laura.santana101@alu.ulpgc.es or secretaria@ulpgc.es, not laura@gmail.com.' },
      { k: 'notas', n: 'Name and mark, line by line (MULTILINE)', re: '^(\\w+):\\s*(\\d+(?:[.,]\\d+)?)$', f: ['M'], rep: '\\2 → \\1', t: 'Laura: 9.5\nPablo: 4\nAna: 7.25\nno mark\nLuis: 10' },
      { k: 'voraz', n: 'Greedy versus lazy: <.+> and <.+?>', re: '<.+?>', f: [], rep: '', t: 'Hi <b>Laura</b>, your mark is <i>9.5</i>.' },
      { k: 'csv', n: 'Split a line on ; and spaces (split)', re: '\\s*;\\s*', f: [], rep: null, t: 'FP1 ; 8.5;IC1 ;  7;FP2;9' }
    ]
  };
  var RETOS = {
    es: [
      { k: 'dni', n: 'Un DNI: 8 cifras y una letra mayúscula (la letra nunca es I, Ñ, O ni U).', si: ['12345678Z', '00000001R'], no: ['1234567Z', '12345678I', '12345678z', '123456789Z', '12345678 Z'], sol: '\\d{8}[A-HJ-NP-TV-Z]', pista: 'Las cifras, con \\d{8}; la letra, con una clase de rangos que se salte la I, la O y la U.' },
      { k: 'matricula', n: 'Una matrícula: 4 cifras, un espacio opcional y 3 consonantes mayúsculas (ni vocales, ni Ñ, ni Q).', si: ['1234BCD', '4521 LKP'], no: ['1234 AEI', '123 BCD', '1234BCDF', '1234 bcd', '1234 QWE'], sol: '\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}', pista: 'El espacio opcional es « ?». En la clase de letras, salta las vocales con rangos: B-D, F-H, J-N…, y la Q.' },
      { k: 'hora', n: 'Una hora de 24 h con dos cifras: de 00:00 a 23:59.', si: ['00:00', '09:45', '23:59'], no: ['24:00', '9:45', '12:60', '12-30'], sol: '([01]\\d|2[0-3]):[0-5]\\d', pista: 'Las horas tienen dos casos: 0 o 1 seguido de cualquier cifra, o 2 seguido de 0 a 3. Los minutos empiezan por 0-5.' },
      { k: 'nota', n: 'Una nota de 0 a 10, con hasta dos decimales y coma o punto (el 10 sin decimales).', si: ['7', '9,5', '10', '6.25', '0'], no: ['11', '10,5', '-3', '7,', '7,123'], sol: '10|\\d([.,]\\d{1,2})?', pista: 'Separa el caso del 10 con | y deja los decimales solo para la otra rama.' },
      { k: 'correo', n: 'Un correo de la ULPGC: algo antes de la @ (letras, cifras o puntos) y después ulpgc.es o alu.ulpgc.es.', si: ['laura.santana101@alu.ulpgc.es', 'ana@ulpgc.es'], no: ['laura@gmail.com', '@ulpgc.es', 'ana@ulpgc.es.com', 'ana@@ulpgc.es', 'ana@aluXulpgc.es'], sol: '[\\w.]+@(alu\\.)?ulpgc\\.es', pista: 'El punto suelto significa «cualquier carácter»: el de ulpgc.es se escapa (\\.).' },
      { k: 'cp', n: 'Un código postal de la provincia de Las Palmas: empieza por 35 y tiene 5 cifras.', si: ['35001', '35450'], no: ['38001', '3500', '350011', '35 001'], sol: '35\\d{3}', pista: 'Dos cifras fijas y tres cualesquiera.' }
    ],
    en: [
      { k: 'dni', n: 'A Spanish ID number (DNI): 8 digits and a capital letter (never I, Ñ, O or U).', si: ['12345678Z', '00000001R'], no: ['1234567Z', '12345678I', '12345678z', '123456789Z', '12345678 Z'], sol: '\\d{8}[A-HJ-NP-TV-Z]', pista: 'The digits with \\d{8}; the letter with a class of ranges that skips I, O and U.' },
      { k: 'matricula', n: 'A Spanish number plate: 4 digits, an optional space and 3 capital consonants (no vowels, no Ñ, no Q).', si: ['1234BCD', '4521 LKP'], no: ['1234 AEI', '123 BCD', '1234BCDF', '1234 bcd', '1234 QWE'], sol: '\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}', pista: 'The optional space is « ?». In the letter class, skip the vowels with ranges: B-D, F-H, J-N…, and the Q.' },
      { k: 'hora', n: 'A 24-hour time with two digits: from 00:00 to 23:59.', si: ['00:00', '09:45', '23:59'], no: ['24:00', '9:45', '12:60', '12-30'], sol: '([01]\\d|2[0-3]):[0-5]\\d', pista: 'Hours have two cases: 0 or 1 followed by any digit, or 2 followed by 0 to 3. Minutes start with 0-5.' },
      { k: 'nota', n: 'A mark from 0 to 10, with up to two decimals and a comma or a point (10 with no decimals).', si: ['7', '9,5', '10', '6.25', '0'], no: ['11', '10,5', '-3', '7,', '7,123'], sol: '10|\\d([.,]\\d{1,2})?', pista: 'Split off the 10 with | and keep the decimals for the other branch only.' },
      { k: 'correo', n: 'A ULPGC email: something before the @ (letters, digits or dots) and then ulpgc.es or alu.ulpgc.es.', si: ['laura.santana101@alu.ulpgc.es', 'ana@ulpgc.es'], no: ['laura@gmail.com', '@ulpgc.es', 'ana@ulpgc.es.com', 'ana@@ulpgc.es', 'ana@aluXulpgc.es'], sol: '[\\w.]+@(alu\\.)?ulpgc\\.es', pista: 'A bare dot means «any character»: the one in ulpgc.es is escaped (\\.).' },
      { k: 'cp', n: 'A postcode in the province of Las Palmas: it starts with 35 and has 5 digits.', si: ['35001', '35450'], no: ['38001', '3500', '350011', '35 001'], sol: '35\\d{3}', pista: 'Two fixed digits and any three.' }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'regex', file: 'texto.txt',
      langL: 'Lenguaje', ex: 'Ejemplo', share: 'Compartir', copy: 'Copiar', copied: 'Copiado',
      reL: 'expresión', flagsL: 'Opciones', repL: 'Reemplazo', repOn: 'Probar un reemplazo', textL: 'texto', textH: 'Hasta 4000 caracteres. Las coincidencias se marcan debajo.',
      hits: 'coincidencias', none: 'Ninguna coincidencia.', more: 'Hay más de 200: se enseñan las 200 primeras.', fnL: 'qué devuelve cada función', grL: 'grupos', codeL: 'tu código', steps: 'paso a paso',
      pyLoad: 'Cargando Python (Pyodide, CPython 3.14)… la primera vez tarda unos segundos.', pyRun: 'Python', jvLoad: 'Cargando javac y TeaVM… la primera vez tarda unos segundos.', jvRun: 'javac + TeaVM compilan tu prueba (unos 3 s)…', jvBtn: 'Probar en Java', jvStale: 'Has cambiado algo: el resultado de abajo es de la prueba anterior.', jvOk: 'Compilado y ejecutado con javac + TeaVM en {ms} s.',
      fail: 'No se pudo cargar el motor (¿sin conexión?). Prueba otra vez.', timeout: 'Tu expresión tarda demasiado (más de {s} s) y se ha parado: seguramente es un backtracking catastrófico, como (a+)+b con un texto largo que no casa.', crash: 'El motor ha fallado: {m}',
      errL: '{l} dice', errH: 'En español', fnPy: { match: 'solo mira el principio del texto', search: 'la primera coincidencia, esté donde esté', fullmatch: 'el texto entero tiene que encajar', findall: 'una lista con todas (si hay grupos, solo los grupos)', sub: 'el texto con los reemplazos', split: 'el texto partido por cada coincidencia' },
      fnJv: { matches: 'el texto entero tiene que encajar', lookingAt: 'solo mira el principio del texto', find: 'cada llamada busca la siguiente', replaceAll: 'el texto con los reemplazos', split: 'el texto partido por cada coincidencia (sin los vacíos del final)' },
      no: 'no casa', nMatches: '{n} coincidencias', nRep: '{n} reemplazos', th: { n: '#', pos: 'posición', txt: 'texto', g: 'grupo' }, noGroups: 'La expresión no tiene grupos. Los paréntesis ( ) crean uno; (?:…) agrupa sin guardar.',
      start: 'Pulsa Paso para ver cómo busca {f}, coincidencia a coincidencia.', step: 'Búsqueda {k}: empieza en la posición {from} y encuentra «{t}» de {s} a {e}.', stepEmpty: 'Búsqueda {k}: desde la posición {from} encuentra una coincidencia vacía en {s} (la expresión puede casar con nada). La siguiente búsqueda avanza un carácter.', stepEnd: 'Después ya no encuentra nada más: {n} en total.', stepG: 'grupo {g}{nm} = {v}',
      codeHpy: 'El r delante de la cadena (raw string) hace que Python no toque las barras: la expresión llega tal cual a re.', codeHjv: 'Fíjate: en Java cada \\ de la expresión se escribe \\\\ dentro de la cadena, porque la propia cadena usa la barra para \\n, \\t…',
      toJ: 'Pasada a Java: {c}.', toP: 'Pasada a Python: {c}.', cvNamed: '(?P<n>…) es (?<n>…)', cvNamedP: '(?<n>…) es (?P<n>…)', cvRep: 'en el reemplazo, \\g<n> y \\1 son ${n} y $1', cvRepP: 'en el reemplazo, ${n} y $1 son \\g<n> y \\1',
      rules: 'Motores de verdad, no el de JavaScript del navegador: Python con Pyodide (CPython 3.14, módulo re) y Java con javac + TeaVM y el java.util.regex de OpenJDK 21 (el de TeaVM da resultados falsos con algunas expresiones; comprobado en 1500 casos frente al JDK). Lo que ves es lo que haría tu programa. Las dos sintaxis se parecen pero no son iguales: grupos con nombre (?P<n>…) en Python y (?<n>…) en Java; en el reemplazo, \\g<n> y \\1 frente a ${n} y $1; match/search/fullmatch frente a lookingAt()/find()/matches().',
      reto: 'Reto: escribe la expresión', retoLead: 'Tiene que encajar entera (fullmatch en Python, matches() en Java) con las de la izquierda y con ninguna de las de la derecha. Se comprueba con el motor de verdad del lenguaje elegido.', retoIn: 'Tu expresión', yes: 'tiene que encajar', nope: 'no debe encajar', allOk: 'Bien: encaja con todas las que debe y con ninguna de las otras.', someBad: 'Aún no: mira las marcadas en rojo.', hint: 'Pista', solL: 'Probarla en el simulador', solShow: 'Una solución: {s}', running: 'Comprobando…'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'regex', file: 'text.txt',
      langL: 'Language', ex: 'Example', share: 'Share', copy: 'Copy', copied: 'Copied',
      reL: 'pattern', flagsL: 'Flags', repL: 'Replacement', repOn: 'Try a replacement', textL: 'text', textH: 'Up to 4000 characters. Matches are marked below.',
      hits: 'matches', none: 'No matches.', more: 'There are more than 200: only the first 200 are shown.', fnL: 'what each function returns', grL: 'groups', codeL: 'your code', steps: 'step by step',
      pyLoad: 'Loading Python (Pyodide, CPython 3.14)… the first time takes a few seconds.', pyRun: 'Python', jvLoad: 'Loading javac and TeaVM… the first time takes a few seconds.', jvRun: 'javac + TeaVM are compiling your test (about 3 s)…', jvBtn: 'Run in Java', jvStale: 'You changed something: the result below is from the previous run.', jvOk: 'Compiled and run with javac + TeaVM in {ms} s.',
      fail: 'The engine could not be loaded (offline?). Try again.', timeout: 'Your pattern takes too long (over {s} s) and was stopped: it is most likely catastrophic backtracking, like (a+)+b on a long text that does not match.', crash: 'The engine failed: {m}',
      errL: '{l} says', errH: 'In plain words', fnPy: { match: 'only looks at the start of the text', search: 'the first match, wherever it is', fullmatch: 'the whole text has to fit', findall: 'a list with all of them (with groups, only the groups)', sub: 'the text with the replacements', split: 'the text split at every match' },
      fnJv: { matches: 'the whole text has to fit', lookingAt: 'only looks at the start of the text', find: 'each call looks for the next one', replaceAll: 'the text with the replacements', split: 'the text split at every match (without the trailing empty ones)' },
      no: 'no match', nMatches: '{n} matches', nRep: '{n} replacements', th: { n: '#', pos: 'position', txt: 'text', g: 'group' }, noGroups: 'The pattern has no groups. Parentheses ( ) create one; (?:…) groups without saving.',
      start: 'Press Step to watch how {f} searches, match by match.', step: 'Search {k}: it starts at position {from} and finds «{t}» from {s} to {e}.', stepEmpty: 'Search {k}: from position {from} it finds an empty match at {s} (the pattern can match nothing). The next search moves on one character.', stepEnd: 'After that it finds nothing else: {n} in total.', stepG: 'group {g}{nm} = {v}',
      codeHpy: 'The r before the string (raw string) stops Python from touching the backslashes: the pattern reaches re exactly as written.', codeHjv: 'Note: in Java every \\ in the pattern is written \\\\ inside the string, because the string itself uses the backslash for \\n, \\t…',
      toJ: 'Converted to Java: {c}.', toP: 'Converted to Python: {c}.', cvNamed: '(?P<n>…) is (?<n>…)', cvNamedP: '(?<n>…) is (?P<n>…)', cvRep: 'in the replacement, \\g<n> and \\1 are ${n} and $1', cvRepP: 'in the replacement, ${n} and $1 are \\g<n> and \\1',
      rules: 'Real engines, not the browser’s JavaScript one: Python with Pyodide (CPython 3.14, the re module) and Java with javac + TeaVM and OpenJDK 21’s java.util.regex (TeaVM’s own gives wrong results with some patterns; checked on 1500 cases against the JDK). What you see is what your program would do. The two syntaxes look alike but are not the same: named groups are (?P<n>…) in Python and (?<n>…) in Java; in the replacement, \\g<n> and \\1 versus ${n} and $1; match/search/fullmatch versus lookingAt()/find()/matches().',
      reto: 'Challenge: write the pattern', retoLead: 'It has to fit whole (fullmatch in Python, matches() in Java) every string on the left and none on the right. It is checked with the real engine of the chosen language.', retoIn: 'Your pattern', yes: 'must fit', nope: 'must not fit', allOk: 'Right: it fits all the ones it should and none of the others.', someBad: 'Not yet: look at the ones in red.', hint: 'Hint', solL: 'Try it in the simulator', solShow: 'A solution: {s}', running: 'Checking…'
    }
  };
  // Mensajes de los motores, en español sencillo (el original se enseña siempre)
  var ERR = {
    es: [
      [/missing \), unterminated subpattern|Unclosed group/i, 'Falta un ): hay un grupo sin cerrar.'],
      [/unbalanced parenthesis|Unmatched closing '\)'/i, 'Sobra un ): cierra un grupo que no se abrió.'],
      [/unterminated character set|Unclosed character class/i, 'Falta el ] de una clase [ ].'],
      [/nothing to repeat|multiple repeat|Dangling meta character/i, 'Hay un *, + o ? sin nada delante que repetir (o dos seguidos). Si lo querías literal, escápalo: \\*, \\+, \\?'],
      [/Illegal repetition/i, 'Una { } que no es una repetición válida. Si querías una llave literal, escápala: \\{'],
      [/bad escape|Illegal\/unsupported escape|Illegal escape/i, 'Una secuencia con \\ que este lenguaje no conoce.'],
      [/look-behind requires fixed-width|Look-behind group does not have an obvious maximum length/i, 'El lookbehind (?<=…) o (?<!…) necesita saber cuánto mide lo que mira hacia atrás.'],
      [/bad character range|Illegal character range/i, 'Un rango de clase al revés, como [z-a]: el primero tiene que ir antes.'],
      [/unknown extension \?<[A-Za-z_]/i, 'Python escribe los grupos con nombre así: (?P<nombre>…). (?<nombre>…) es la forma de Java.'],
      [/unknown inline flag|Unknown inline modifier|unknown extension \?P/i, 'Una opción en línea (?…) que este lenguaje no conoce. Java escribe los grupos con nombre (?<nombre>…), sin la P.'],
      [/unknown group name|named capturing group .* does not exist|No group with name/i, 'Usas un grupo con nombre que no existe.'],
      [/invalid group reference|No group \d+|unknown group/i, 'Usas un número de grupo que no existe.'],
      [/SL_NO_DISPONIBLE|Unknown character (script|block|property)|Unknown character name/i, 'Esa propiedad Unicode no está disponible en el probador ni en el entorno (TeaVM no la trae). Las de siempre (\\p{L}, \\p{Lu}, \\p{Digit}…) sí funcionan.']
    ],
    en: [
      [/missing \), unterminated subpattern|Unclosed group/i, 'A ) is missing: a group is not closed.'],
      [/unbalanced parenthesis|Unmatched closing '\)'/i, 'There is a ) too many: it closes a group that was never opened.'],
      [/unterminated character set|Unclosed character class/i, 'The ] of a [ ] class is missing.'],
      [/nothing to repeat|multiple repeat|Dangling meta character/i, 'There is a *, + or ? with nothing before it to repeat (or two in a row). If you wanted it literally, escape it: \\*, \\+, \\?'],
      [/Illegal repetition/i, 'A { } that is not a valid repetition. If you wanted a literal brace, escape it: \\{'],
      [/bad escape|Illegal\/unsupported escape|Illegal escape/i, 'A \\ sequence this language does not know.'],
      [/look-behind requires fixed-width|Look-behind group does not have an obvious maximum length/i, 'A look-behind (?<=…) or (?<!…) needs to know how long the thing it looks back at is.'],
      [/bad character range|Illegal character range/i, 'A class range written backwards, like [z-a]: the first one has to come first.'],
      [/unknown extension \?<[A-Za-z_]/i, 'Python writes named groups like this: (?P<name>…). (?<name>…) is the Java form.'],
      [/unknown inline flag|Unknown inline modifier|unknown extension \?P/i, 'An inline flag (?…) this language does not know. Java writes named groups (?<name>…), without the P.'],
      [/unknown group name|named capturing group .* does not exist|No group with name/i, 'You use a named group that does not exist.'],
      [/invalid group reference|No group \d+|unknown group/i, 'You use a group number that does not exist.'],
      [/SL_NO_DISPONIBLE|Unknown character (script|block|property)|Unknown character name/i, 'That Unicode property is not available in the tester or the playground (TeaVM does not ship it). The usual ones (\\p{L}, \\p{Lu}, \\p{Digit}…) do work.']
    ]
  };
  function plainErr(L, s) { var a = ERR[L]; for (var i = 0; i < a.length; i++) if (a[i][0].test(s)) return a[i][1]; return ''; }
  // Python ↔ Java: lo que cambia de sintaxis (grupos con nombre y referencias del reemplazo)
  function toJava(x) {
    var c = [], re = x.re.replace(/\(\?P<([A-Za-z]\w*)>/g, function (m, n) { c.push('n'); return '(?<' + n + '>'; }).replace(/\(\?P=([A-Za-z]\w*)\)/g, function (m, n) { c.push('n'); return '\\k<' + n + '>'; });
    var rep = x.rep == null ? null : x.rep.replace(/\$/g, '\\$').replace(/\\g<([A-Za-z]\w*)>/g, function (m, n) { c.push('r'); return '${' + n + '}'; }).replace(/\\g<(\d+)>|\\(\d+)/g, function (m, a, b) { c.push('r'); return '$' + (a || b); });
    var fl = 0; (x.f || []).forEach(function (f) { fl |= { I: 2, M: 8, S: 32, X: 4 }[f] || 0; });
    return { re: re, rep: rep, f: fl, t: x.t, c: c };
  }
  function toPy(x) {
    var c = [], re = x.re.replace(/\(\?<([A-Za-z]\w*)>/g, function (m, n) { c.push('n'); return '(?P<' + n + '>'; }).replace(/\\k<([A-Za-z]\w*)>/g, function (m, n) { c.push('n'); return '(?P=' + n + ')'; });
    var rep = x.rep == null ? null : x.rep.replace(/\\\$/g, '\u0000').replace(/\$\{([A-Za-z]\w*)\}/g, function (m, n) { c.push('r'); return '\\g<' + n + '>'; }).replace(/\$(\d+)/g, function (m, d) { c.push('r'); return '\\' + d; }).replace(/\u0000/g, '$');
    var f = []; [[2, 'I'], [8, 'M'], [32, 'S'], [4, 'X']].forEach(function (p) { if ((x.f || 0) & p[0]) f.push(p[1]); });
    return { re: re, rep: rep, f: f, t: x.t, c: c };
  }

  function mount(el) {
    var K = K6.mount(el, ''), L = K.lang, t = TX[L], q = K.q, exs = EX[L];
    K.title = t.title;
    // Estado: lenguaje y, para cada uno, expresión, opciones, reemplazo y texto
    var S = { l: 'py', fn: 'search', ex: 'ip', py: null, java: null };
    var ex0 = exs[0]; S.py = { re: ex0.re, f: ex0.f.slice(), rep: ex0.rep, t: ex0.t }; S.java = toJava(S.py);
    (function () {
      var h = K6.hashState() || K6.store('sl_sim_regex_' + L);
      if (!h) return;
      try {
        var o = JSON.parse(h);
        if (o.l === 'java') { S.l = 'java'; S.java = { re: String(o.re || ''), f: (+o.f || 0) & 511, rep: o.rp == null ? null : String(o.rp), t: String(o.t || '').slice(0, MAXT) }; S.py = toPy(S.java); }
        else { S.l = 'py'; S.py = { re: String(o.re || ''), f: [].concat(o.f || []).filter(function (f) { return /^[IMSXA]$/.test(f); }), rep: o.rp == null ? null : String(o.rp), t: String(o.t || '').slice(0, MAXT) }; S.java = toJava(S.py); }
        S.ex = o.ex || ''; S.fn = o.fn || (S.l === 'py' ? 'search' : 'find');
      } catch (e) {}
    })();
    var cur = function () { return S[S.l]; };
    var state = function () { var c = cur(); return JSON.stringify({ l: S.l, re: c.re, f: c.f, rp: c.rep, t: c.t, ex: S.ex, fn: S.fn }); };

    var seg = '<div class="sl6-seg" role="group" aria-label="' + esc(t.langL) + '"><span class="sl6-seg__l">' + esc(t.langL) + '</span><button type="button" data-l="py">Python</button><button type="button" data-l="java">Java</button></div>';
    var ctl = '<div class="sl6-ctl">' + seg + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('') + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl
      + '<div class="sl6-rx-top"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.reL) + '</h3>'
      + '<div class="sl6-rx-re"><span class="sl6-rx-del" aria-hidden="true">/</span><input type="text" class="sl6-rx-in" id="' + K.id + '-re" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="' + esc(t.reL) + '"><span class="sl6-rx-del" aria-hidden="true">/</span></div>'
      + '<div class="sl6-rx-err" hidden></div>'
      + '<p class="sl6-lbl sl6-rx-fl">' + esc(t.flagsL) + '</p><div class="sl6-rx-flags"></div>'
      + '<label class="sl6-rx-ron"><input type="checkbox" class="sl6-rx-rc"> ' + esc(t.repOn) + '</label><input type="text" class="sl6-rx-rep" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="' + esc(t.repL) + '" hidden>'
      + '<p class="sl6-h sl6-h--2">── ' + esc(t.textL) + '</p><textarea class="sl6-rx-t" rows="5" spellcheck="false" aria-label="' + esc(t.textL) + '" maxlength="' + MAXT + '"></textarea><p class="sl6-help">' + esc(t.textH) + '</p>'
      + '<p class="sl6-rx-conv" hidden></p></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── <span class="sl6-rx-nh">' + esc(t.hits) + '</span></h3><div class="sl6-rx-st" aria-live="polite"></div><div class="sl6-rx-view"></div>'
      + '<p class="sl6-h sl6-h--2">── ' + esc(t.steps) + '</p>' + K6.toolsHTML(K) + '<div class="sl6-rx-card"></div></section></div>'
      + '<div class="sl6-rx-bot"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.fnL) + '</h3><div class="sl6-rx-fns"></div></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.grL) + '</h3><div class="sl6-rx-grp"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── <span class="sl6-rx-ch"></span><button type="button" class="sl6-btn sl6-btn--g sl6-rx-cp" data-a="copy">' + ico('file', 15) + '<span>' + esc(t.copy) + '</span></button></h3><pre class="sl6-rx-code"><code></code></pre><p class="sl6-help sl6-rx-codeh"></p></section>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K); K.onTheme = function () {};
    var reIn = q('.sl6-rx-in'), repIn = q('.sl6-rx-rep'), repC = q('.sl6-rx-rc'), tIn = q('.sl6-rx-t');

    var RES = null, RES_FOR = '', JV_T = 0, JV_BUSY = false, JV_AGAIN = false, PY_T = 0, ST = { msg: '', kind: '' };
    var PL = K6.player(K);
    K.N = function () { return RES && RES.ok ? Math.max(1, (S.l === 'py' ? RES.finditer : RES.find).length + 1) : 1; };
    K.draw = function (k) { drawView(k); drawCard(k); };

    function fill2() {
      var c = cur();
      [].forEach.call(K.qa('[data-l]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-l') === S.l ? 'true' : 'false'); });
      reIn.value = c.re; tIn.value = c.t; repC.checked = c.rep != null; repIn.hidden = c.rep == null; repIn.value = c.rep == null ? '' : c.rep;
      var fl = S.l === 'py' ? PYF.map(function (f) { return '<label class="sl6-rx-f" title="' + esc(f[1] + ' · ' + f[2]) + '"><input type="checkbox" data-f="' + f[0] + '"' + (c.f.indexOf(f[0]) >= 0 ? ' checked' : '') + '><span>' + f[2] + '</span></label>'; }).join('')
        : JFL.map(function (f) { return '<label class="sl6-rx-f" title="Pattern.' + f[1] + '"><input type="checkbox" data-f="' + f[0] + '"' + (c.f & f[0] ? ' checked' : '') + '><span>' + f[1] + '</span></label>'; }).join('');
      q('.sl6-rx-flags').innerHTML = fl;
      q('.sl6-sel').value = S.ex;
    }
    function readIn() {
      var c = cur(); c.re = reIn.value; c.t = tIn.value.slice(0, MAXT); c.rep = repC.checked ? repIn.value : null;
      if (S.l === 'py') { c.f = []; [].forEach.call(K.qa('[data-f]'), function (b) { if (b.checked) c.f.push(b.getAttribute('data-f')); }); }
      else { c.f = 0; [].forEach.call(K.qa('[data-f]'), function (b) { if (b.checked) c.f |= +b.getAttribute('data-f'); }); }
    }
    function cmdLine() {
      var c = cur(), o = S.l === 'py' ? '--python' : '--java', fl = S.l === 'py' ? c.f.map(function (f) { return '-' + f.toLowerCase(); }) : JFL.filter(function (f) { return c.f & f[0]; }).map(function (f) { return '-' + f[1].toLowerCase().replace(/_/g, '-'); });
      var shown = c.re.length > 40 ? c.re.slice(0, 39) + '…' : c.re;
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">' + o + (fl.length ? ' ' + fl.join(' ') : '') + '</span> <b>\'' + esc(shown) + '\'</b> ' + esc(t.file);
    }
    function setStatus(kind, msg) { ST = { kind: kind, msg: msg }; var s = q('.sl6-rx-st'); s.className = 'sl6-rx-st' + (kind ? ' is-' + kind : ''); s.innerHTML = msg ? (kind === 'run' || kind === 'load' ? '<i class="sl6-rx-spin" aria-hidden="true"></i>' : '') + '<span>' + msg + '</span>' + (S.l === 'java' && kind !== 'run' && kind !== 'load' ? '' : '') : ''; }

    function query() {
      var c = cur();
      return { re: c.re, flags: c.f, rep: c.rep, text: c.t, retos: [] };
    }
    function changed(now) {
      readIn(); cmdLine(); drawCode(); K6.store('sl_sim_regex_' + L, state()); K6.keepHash(state());
      var key = S.l + '\u0001' + JSON.stringify(query());
      if (key === RES_FOR) return;
      if (S.l === 'py') { clearTimeout(PY_T); PY_T = setTimeout(runPy, now ? 0 : 140); }
      else {
        el.classList.add('is-stale'); if (RES && RES.ok !== undefined) setStatus('stale', esc(t.jvStale) + ' <button type="button" class="sl6-btn sl6-btn--p sl6-rx-go" data-a="java">' + ico('play', 13) + esc(t.jvBtn) + '</button>');
        clearTimeout(JV_T); JV_T = setTimeout(runJava, now ? 0 : 900);
      }
    }
    function got(r, key, extra) {
      PL.reset();
      if (r.fail) { setStatus('bad', esc(t.fail)); return; }
      if (r.timeout) { RES = null; RES_FOR = key; setStatus('bad', esc(fill(t.timeout, { s: S.l === 'py' ? 6 : 25 }))); drawAll(); return; }
      if (r.crash) { setStatus('bad', esc(fill(t.crash, { m: String(r.crash).slice(0, 300) }))); return; }
      if (r.stopped) return;
      RES = r.r; RES_FOR = key; el.classList.remove('is-stale');
      setStatus(extra ? 'ok' : '', extra || '');
      drawAll();
    }
    function runPy() {
      var key = 'py\u0001' + JSON.stringify(query()), first = !el.classList.contains('is-pyok');
      if (first) setStatus('load', esc(t.pyLoad));
      R.runPy(query(), 6).then(function (r) { if (key !== 'py\u0001' + JSON.stringify(query()) || S.l !== 'py') return; el.classList.add('is-pyok'); got(r, key); });
    }
    function runJava() {
      if (S.l !== 'java') return;
      if (JV_BUSY) { JV_AGAIN = true; return; }
      var key = 'java\u0001' + JSON.stringify(query()), t0 = Date.now(), first = !el.classList.contains('is-jvok');
      if (key === RES_FOR) { el.classList.remove('is-stale'); return; }
      JV_BUSY = true; el.classList.add('is-jvbusy');
      setStatus(first ? 'load' : 'run', esc(first ? t.jvLoad : t.jvRun));
      R.runJava(query(), 25, function (p) { if (first && p && /compil|generat/i.test(p.stage || '')) setStatus('run', esc(t.jvRun)); }).then(function (r) {
        JV_BUSY = false; el.classList.remove('is-jvbusy'); el.classList.add('is-jvok');
        var again = JV_AGAIN; JV_AGAIN = false;
        if (S.l === 'java' && key === 'java\u0001' + JSON.stringify(query())) got(r, key, esc(fill(t.jvOk, { ms: K6.num((Date.now() - t0) / 1000, L, 1) })));
        else if (again || S.l === 'java') runJava();
      });
    }

    /* ---------- dibujo ---------- */
    function list() { return !RES || !RES.ok ? [] : (S.l === 'py' ? RES.finditer : RES.find); }
    function gname(i) { if (!RES || !RES.names) return ''; for (var k in RES.names) if (RES.names[k] === i) return k; return ''; }
    function drawAll() { drawErr(); drawView(-1); drawCard(-1); drawFns(); drawGroups(-1); PL.draw(); }
    function drawErr() {
      var box = q('.sl6-rx-err'), bad = RES && RES.ok === false;
      reIn.classList.toggle('is-bad', !!bad); box.hidden = !bad;
      if (!bad) return;
      var c = cur(), pos = RES.pos, where = '';
      if (pos != null && pos >= 0) where = '<pre class="sl6-rx-caret">' + esc(c.re) + '\n' + ' '.repeat(Math.min(pos, c.re.length)) + '^</pre>';
      var plain = plainErr(L, RES.full + ' ' + RES.msg);
      box.innerHTML = '<p class="sl6-rx-eh">' + esc(fill(t.errL, { l: S.l === 'py' ? 'Python' : 'Java' })) + '</p><pre class="sl6-rx-emsg">' + esc(String(RES.full).replace(/SL_NO_DISPONIBLE /, '').split('\n')[0]) + '</pre>' + where + (plain ? '<p class="sl6-rx-ep"><b>' + esc(t.errH) + ':</b> ' + esc(plain) + '</p>' : '');
    }
    function drawView(k) {
      var v = q('.sl6-rx-view'), c = cur(), M = list(), nh = q('.sl6-rx-nh');
      nh.textContent = RES && RES.ok ? fill(t.nMatches, { n: M.length + (RES.mas ? '+' : '') }) : t.hits;
      if (!RES || !RES.ok) { v.innerHTML = '<p class="sl6-rx-txt is-dim">' + esc(c.t) + '</p>'; return; }
      var txt = c.t, n = txt.length, own = new Array(n + 1), gown = new Array(n + 1), cut = {};
      M.forEach(function (m, i) {
        for (var j = m.s; j < m.e; j++) own[j] = i;
        if (m.s === m.e) cut[m.s] = (cut[m.s] || []).concat([i]);
      });
      if (k >= 0 && M[k]) {   // grupos de la coincidencia actual: gana el más interno (el más corto)
        var g = M[k].g, len = new Array(n + 1);
        g.forEach(function (x, gi) { if (!x) return; for (var j = x[0]; j < x[1]; j++) if (len[j] == null || x[1] - x[0] <= len[j]) { len[j] = x[1] - x[0]; gown[j] = gi; } });
      }
      var h = '', run = null, flush = function (j) {
        if (!run) return;
        var seg = esc(txt.slice(run.a, j)).replace(/\n/g, '<span class="sl6-rx-nl">↵</span>\n');
        if (run.m == null) h += seg;
        else {
          var cls = 'sl6-rx-m' + (run.m % 2 ? ' is-odd' : '') + (k >= 0 ? (run.m === k ? ' is-cur' : ' is-off') : '');
          var gs = run.g != null ? ' style="--g:' + COLS[run.g % COLS.length] + '" data-g="' + (run.g + 1) + '"' : '';
          h += '<mark class="' + cls + (run.g != null ? ' is-g' : '') + '"' + gs + ' data-m="' + run.m + '">' + seg + '</mark>';
        }
        run = null;
      };
      for (var j = 0; j <= n; j++) {
        if (cut[j]) { flush(j); cut[j].forEach(function (i) { h += '<i class="sl6-rx-e' + (k >= 0 ? (i === k ? ' is-cur' : ' is-off') : '') + '" title="' + esc(fill(t.th.pos + ' {p}', { p: j })) + '"></i>'; }); }
        if (j === n) break;
        var m = own[j], gg = m === k ? gown[j] : null;
        if (!run || run.m !== m || run.g !== gg) { flush(j); run = { a: j, m: m, g: gg == null ? null : gg }; }
      }
      flush(n);
      v.innerHTML = '<p class="sl6-rx-txt">' + (h || '&nbsp;') + '</p>' + (M.length ? '' : '<p class="sl6-help">' + esc(t.none) + '</p>') + (RES.mas ? '<p class="sl6-help">' + esc(t.more) + '</p>' : '');
      var curM = v.querySelector('.is-cur'); if (curM && k >= 0 && v.scrollHeight > v.clientHeight) v.scrollTop = Math.max(0, curM.offsetTop - v.clientHeight / 2);
    }
    function grpLine(m) {
      return m.g.map(function (x, gi) { var nm = gname(gi + 1); return '<span class="sl6-rx-gc" style="--g:' + COLS[gi % COLS.length] + '">' + esc(fill(t.stepG, { g: gi + 1, nm: nm ? ' (' + nm + ')' : '', v: x ? '«' + x[2] + '»' : 'None' }).replace('None', S.l === 'py' ? 'None' : 'null')) + '</span>'; }).join('');
    }
    function drawCard(k) {
      var c = q('.sl6-rx-card'), M = list(), f = S.l === 'py' ? 're.finditer()' : 'find()';
      if (!RES || !RES.ok) { c.innerHTML = ''; return; }
      if (k < 0) { c.innerHTML = '<p class="sl6-co-0">' + esc(fill(t.start, { f: f })) + '</p>'; drawGroups(-1); return; }
      if (k >= M.length) { c.innerHTML = '<p class="sl6-rx-sx">' + esc(fill(t.stepEnd, { n: M.length })) + '</p>'; drawGroups(-1); return; }
      var m = M[k], from = k ? M[k - 1].e + (M[k - 1].s === M[k - 1].e ? 0 : 0) : 0;
      c.innerHTML = '<p class="sl6-rx-sx">' + esc(fill(m.s === m.e ? t.stepEmpty : t.step, { k: k + 1, from: from, t: m.t, s: m.s, e: m.e })) + '</p>' + (m.g.length ? '<p class="sl6-rx-gl">' + grpLine(m) + '</p>' : '');
      drawGroups(k);
    }
    function mv(m) { return m ? '<code>«' + esc(m.t) + '»</code> <span class="sl6-rx-pos">' + m.s + '–' + m.e + '</span>' : '<span class="sl6-rx-no">' + esc(S.l === 'py' ? 'None' : t.no) + '</span>'; }
    function arr(a) { var py = S.l === 'py'; return '<code class="sl6-rx-arr">[' + a.map(function (s) { return py ? (s.indexOf("'") >= 0 && s.indexOf('"') < 0 ? '"' + esc(s) + '"' : "'" + esc(s.replace(/'/g, "\\'")) + "'") : esc(s); }).join(', ') + ']</code>'; }
    function drawFns() {
      var box = q('.sl6-rx-fns');
      if (!RES || !RES.ok) { box.innerHTML = ''; return; }
      var rows = [], c = cur();
      if (S.l === 'py') {
        rows.push(['match', 're.match()', t.fnPy.match, mv(RES.match)], ['search', 're.search()', t.fnPy.search, mv(RES.search)], ['fullmatch', 're.fullmatch()', t.fnPy.fullmatch, mv(RES.fullmatch)],
          ['findall', 're.findall()', t.fnPy.findall, RES.findall == null ? '…' : '<code class="sl6-rx-arr">' + esc(RES.findall) + '</code>']);
        if (c.rep != null) rows.push(['sub', 're.sub()', t.fnPy.sub, RES.sub && RES.sub.err ? '<span class="sl6-rx-no">' + esc(RES.sub.err) + '</span>' : '<code>«' + esc(RES.sub.t) + '»</code> <span class="sl6-rx-pos">' + esc(fill(t.nRep, { n: RES.sub.n })) + '</span>']);
        rows.push(['split', 're.split()', t.fnPy.split, arr(RES.split)]);
      } else {
        rows.push(['matches', 'matches()', t.fnJv.matches, mv(RES.matches)], ['lookingAt', 'lookingAt()', t.fnJv.lookingAt, mv(RES.lookingAt)], ['find', 'find()', t.fnJv.find, esc(fill(t.nMatches, { n: RES.find.length + (RES.mas ? '+' : '') })) + (RES.find[0] ? ' · ' + mv(RES.find[0]) + '…' : '')]);
        if (c.rep != null) rows.push(['replaceAll', 'replaceAll()', t.fnJv.replaceAll, RES.sub && RES.sub.err ? '<span class="sl6-rx-no">' + esc(RES.sub.err) + '</span>' : '<code>«' + esc(RES.sub.t) + '»</code> <span class="sl6-rx-pos">' + esc(fill(t.nRep, { n: RES.sub.n })) + '</span>']);
        rows.push(['split', 'split()', t.fnJv.split, arr(RES.split)]);
      }
      if (!rows.some(function (r) { return r[0] === S.fn; })) S.fn = S.l === 'py' ? 'search' : 'find';
      box.innerHTML = rows.map(function (r) { return '<button type="button" class="sl6-rx-fn' + (r[0] === S.fn ? ' is-on' : '') + '" data-fn="' + r[0] + '" aria-pressed="' + (r[0] === S.fn) + '"><b>' + esc(r[1]) + '</b><span class="sl6-rx-fd">' + esc(r[2]) + '</span><span class="sl6-rx-fr">' + r[3] + '</span></button>'; }).join('');
    }
    function drawGroups(k) {
      var box = q('.sl6-rx-grp'), M = list();
      if (!RES || !RES.ok) { box.innerHTML = ''; return; }
      if (!RES.ng) { box.innerHTML = '<p class="sl6-help">' + esc(t.noGroups) + '</p>'; return; }
      var h = '<div class="sl6-rx-gw"><table class="sl6-rx-gt"><thead><tr><th>' + esc(t.th.n) + '</th><th>' + esc(t.th.txt) + '</th>';
      for (var i = 1; i <= RES.ng; i++) { var nm = gname(i); h += '<th><span class="sl6-chip" style="--c:' + COLS[(i - 1) % COLS.length] + '"></span> ' + i + (nm ? ' <em>' + esc(nm) + '</em>' : '') + '</th>'; }
      h += '</tr></thead><tbody>' + M.slice(0, 60).map(function (m, j) {
        return '<tr' + (j === k ? ' class="is-cur"' : '') + '><th>' + (j + 1) + '</th><td><code>' + esc(m.t) + '</code></td>' + m.g.map(function (x) { return '<td>' + (x ? '<code>' + esc(x[2]) + '</code>' : '<span class="sl6-rx-no">' + (S.l === 'py' ? 'None' : 'null') + '</span>') + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
      box.innerHTML = h;
    }
    function drawCode() {
      var c = cur(), fn = S.fn, code;
      if (S.l === 'py') code = R.pyCode({ re: c.re, flags: c.f, rep: c.rep, text: c.t }, fn);
      else code = R.javaCode({ re: c.re, flags: c.f, rep: c.rep, text: c.t }, fn);
      q('.sl6-rx-ch').textContent = t.codeL + (S.l === 'py' ? ' · main.py' : ' · Main.java');
      q('.sl6-rx-code code').textContent = code;
      q('.sl6-rx-codeh').textContent = S.l === 'py' ? t.codeHpy : t.codeHjv;
    }

    /* ---------- eventos ---------- */
    function setLang(l) {
      if (l === S.l) return;
      readIn();
      var conv = l === 'java' ? toJava(S.py) : toPy(S.java), c = [];
      S[l] = { re: conv.re, f: conv.f, rep: conv.rep, t: conv.t };
      if (conv.c.indexOf('n') >= 0) c.push(l === 'java' ? t.cvNamed : t.cvNamedP);
      if (conv.c.indexOf('r') >= 0) c.push(l === 'java' ? t.cvRep : t.cvRepP);
      S.l = l; S.fn = l === 'py' ? 'search' : 'find'; RES = null; RES_FOR = '';
      var cv = q('.sl6-rx-conv'); cv.hidden = !c.length; cv.textContent = c.length ? fill(l === 'java' ? t.toJ : t.toP, { c: c.join('; ') }) : '';
      fill2(); drawAll(); setStatus('', ''); changed(true);
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-l],[data-a],[data-fn],[data-m]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-l')) setLang(b.getAttribute('data-l'));
      else if (b.hasAttribute('data-fn')) { S.fn = b.getAttribute('data-fn'); drawFns(); drawCode(); K6.keepHash(state()); K6.store('sl_sim_regex_' + L, state()); }
      else if (b.hasAttribute('data-m')) { var i = +b.getAttribute('data-m'); PL.stop(); el.classList.add('is-going'); PL.k = i; PL.going = true; PL.draw(); }
      else { var a = b.getAttribute('data-a');
        if (a === 'theme') K6.toggleTheme(K);
        else if (a === 'share') K6.share(K, b, state());
        else if (a === 'java') { clearTimeout(JV_T); runJava(); }
        else if (a === 'copy') { var sp = b.querySelector('span'), txt = q('.sl6-rx-code code').textContent; var say = function (m) { sp.textContent = m; setTimeout(function () { sp.textContent = t.copy; }, 1800); }; if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { say(t.copied); }, function () {}); }
      }
    });
    var onIn = function () { S.ex = ''; q('.sl6-sel').value = ''; q('.sl6-rx-conv').hidden = true; changed(); };
    reIn.addEventListener('input', onIn); tIn.addEventListener('input', onIn); repIn.addEventListener('input', onIn);
    repC.addEventListener('change', function () { repIn.hidden = !repC.checked; if (repC.checked) repIn.focus(); onIn(); });
    q('.sl6-rx-flags').addEventListener('change', onIn);
    reIn.addEventListener('keydown', function (e) { if (e.key === 'Enter' && S.l === 'java') { clearTimeout(JV_T); runJava(); } });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.py = { re: x.re, f: x.f.slice(), rep: x.rep, t: x.t }; S.java = toJava(S.py);
      S.fn = S.l === 'py' ? (x.k === 'csv' ? 'split' : x.rep != null ? 'sub' : 'search') : (x.k === 'csv' ? 'split' : x.rep != null ? 'replaceAll' : 'find');
      q('.sl6-rx-conv').hidden = true; fill2(); changed(true);
    });

    /* ---------- reto ---------- */
    var RT = { i: 0 };
    function retoDraw(res) {
      var r = RETOS[L][RT.i], box = q('.sl6-reto');
      var li = function (s, want, j) {
        var st = res ? (res[j] === want ? 'ok' : 'bad') : '';
        return '<li class="' + (st ? 'is-' + st : '') + '"><code>' + esc(s || ' ') + '</code>' + (st ? ico(st === 'ok' ? 'check' : 'wave', 15) : '') + '</li>';
      };
      box.innerHTML = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-rd-q">' + esc(r.n) + '</p>'
        + '<label class="sl6-lbl" for="' + K.id + '-rt">' + esc(t.retoIn) + ' · ' + (S.l === 'py' ? 'Python' : 'Java') + '</label><div class="sl6-rx-re"><span class="sl6-rx-del" aria-hidden="true">/</span><input type="text" id="' + K.id + '-rt" class="sl6-rx-in sl6-rx-rin" spellcheck="false" autocomplete="off" autocapitalize="off"><span class="sl6-rx-del" aria-hidden="true">/</span></div>'
        + '<div class="sl6-rx-rl"><div><p class="sl6-lbl">' + esc(t.yes) + '</p><ul class="sl6-rx-ul">' + r.si.map(function (s, j) { return li(s, true, j); }).join('') + '</ul></div><div><p class="sl6-lbl">' + esc(t.nope) + '</p><ul class="sl6-rx-ul">' + r.no.map(function (s, j) { return li(s, false, r.si.length + j); }).join('') + '</ul></div></div>'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-rr="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-rr="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-rr="hint">' + ico('book', 16) + esc(t.hint) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      var inp = q('.sl6-rx-rin'); inp.value = RT.v || ''; inp.addEventListener('input', function () { RT.v = inp.value; });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') retoCheck(); });
    }
    function retoCheck() {
      var r = RETOS[L][RT.i], v = (RT.v || '').trim(), msg = q('.sl6-reto__msg'); if (!v) return;
      msg.innerHTML = '<i class="sl6-rx-spin" aria-hidden="true"></i> ' + esc(t.running);
      var all = r.si.concat(r.no), qq = { re: S.l === 'py' ? v : toJava({ re: v, rep: null, f: [] }).re, flags: S.l === 'py' ? [] : 0, rep: null, text: '', retos: all };
      (S.l === 'py' ? R.runPy(qq, 6) : R.runJava(qq, 25)).then(function (x) {
        if (!x.r) { msg.textContent = x.timeout ? fill(t.timeout, { s: S.l === 'py' ? 6 : 25 }) : t.fail; return; }
        if (!x.r.ok) { retoDraw(null); q('.sl6-reto__msg').innerHTML = '<span class="is-bad">' + esc(x.r.full) + '</span>' + (plainErr(L, x.r.full) ? ' ' + esc(plainErr(L, x.r.full)) : ''); return; }
        var res = x.r.retos, good = all.every(function (s, j) { return res[j] === j < r.si.length; });
        retoDraw(res);
        var m = q('.sl6-reto__msg'); m.className = 'sl6-reto__msg ' + (good ? 'is-ok' : 'is-bad');
        m.innerHTML = esc(good ? t.allOk : t.someBad) + (good ? '' : '') + ' <button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 15) + esc(t.solL) + '</button>';
      });
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rr]'); if (!b) return;
      var a = b.getAttribute('data-rr'), r = RETOS[L][RT.i];
      if (a === 'check') retoCheck();
      else if (a === 'new') { RT.i = (RT.i + 1 + Math.floor(Math.random() * (RETOS[L].length - 1))) % RETOS[L].length; RT.v = ''; retoDraw(null); }
      else if (a === 'hint') { var m = q('.sl6-reto__msg'); m.className = 'sl6-reto__msg'; m.innerHTML = esc(r.pista) + '<br><span class="sl6-rx-sol">' + esc(fill(t.solShow, { s: r.sol })) + '</span>'; }
      else if (a === 'sol') {
        var v = (RT.v || r.sol), txt = r.si.concat(r.no).join('\n');
        S.ex = ''; S.py = { re: '^(?:' + v + ')$', f: ['M'], rep: null, t: txt }; S.java = toJava(S.py);
        S.fn = S.l === 'py' ? 'search' : 'find'; fill2(); changed(true);
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });

    fill2(); cmdLine(); drawCode(); retoDraw(null); drawAll(); setStatus('', '');
    if (S.l === 'py') changed(true);
    else { setStatus('load', esc(t.jvLoad)); changed(true); }
  }
  K6.boot('.sl-sim[data-sim="regex"]', mount);
})();
