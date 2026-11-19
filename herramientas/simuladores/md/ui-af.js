/* SergioLearns — simulador de MD: Autómatas (19 nov 2026, tema 6a).
 * Un autómata finito dibujado como grafo de estados: se lee una cadena símbolo a símbolo y se ven los estados activos
 * (uno en un AFD, un conjunto en un AFND, con su λ-cierre), el veredicto, los estados de absorción e inaccesibles y la
 * construcción por subconjuntos fila a fila. «Tu autómata»: una tabla escrita a mano o una expresión regular sencilla
 * (piezas de Kleene). «Ponte a prueba» con tres niveles. Lecciones con la cerradura de la taquilla del tema 6a.
 * Necesita SLK (kit v2), SLMD (comun-md.js) y SLAF (engine-af.js). Sin emoticonos. */
(function () {
  'use strict';
  var K = window.SLK, CA = window.SLMD, E = window.SLAF;
  if (!K || !CA || !E) return;
  var esc = K.esc, fill = K.fill, ico = K.ico, LAM = E.LAM;
  var GL = {
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    trap: '<circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/>',
    fork: '<path d="M6 4v6a6 6 0 0 0 6 6h6M6 10a6 6 0 0 1 6 6"/><path d="M15 13l3 3-3 3"/>',
    lam: '<path d="M7 4c3 0 4 3 5 7l3 9M12 11l-5 9"/>',
    table: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M10 5v14"/>',
    rx: '<path d="M5 7h6M8 4v6M14 14l5 5M19 14l-5 5"/>'
  };
  var TX = {
    es: { title: 'sergio@learns: ~/laboratorio/simuladores/automatas', showM: 'Tu autómata', hideM: 'Ocultar', tab: 'La tabla', tabHint: 'Una línea por transición: origen, símbolo y destino (varios destinos separados por comas; λ para las transiciones vacías). Antes, «inicio q0» y «finales q3». Hasta 12 estados.',
      str: 'Cadena', strHint: 'Solo símbolos del alfabeto. Vacía = λ.', go: 'Probar la cadena', toDFA: 'Pasar a AFD', re: 'Expresión regular', reHint: 'Símbolos, + (o |) para la unión, * y paréntesis. Ejemplo: (0+1)*11', reGo: 'Construir el AFND', presets: 'Para probar',
      pre: [['AFD: termina en 101', 'd101'], ['AFND: termina en 101', 'n101'], ['Con λ', 'lam'], ['Código exacto con trampa', 'trap']],
      err: { start: 'Línea {l}: «inicio» va con un solo estado.', line: 'Línea {l}: tiene que tener origen, símbolo y destino.', sym: 'Línea {l}: el símbolo debe ser un único carácter (o λ).', nostart: 'Falta la línea «inicio q0».', big: 'Como mucho 12 estados.', nosym: 'No hay ninguna transición con un símbolo.', badstr: 'La cadena tiene símbolos que no están en el alfabeto ({s}).', re: 'La expresión no se entiende: usa símbolos, +, *, paréntesis y λ.', rebig: 'Ese AFND tendría más de 12 estados: prueba una expresión más corta.' },
      yoursN: 'Tu autómata', yoursD: 'El que has escrito, leyendo tu cadena.', subN: 'Tu AFND, a AFD', subD: 'La construcción por subconjuntos, fila a fila.', reN: 'Tu expresión', reD: 'El AFND de las piezas de Kleene, leyendo tu cadena.',
      tape: 'Cadena', act: 'Activos', actD: 'Estado actual', table: 'Tabla de transiciones', subT: 'Subconjuntos', set: 'Conjunto', yes: 'ACEPTADA', no: 'RECHAZADA', empty: 'cadena vacía (λ)',
      kind: { dfa: 'AFD', nfa: 'AFND', nfal: 'AFND con λ' }, abs: 'absorción', unr: 'inaccesible', fin: 'final', ini: 'inicial', none: '∅ (ninguno)',
      lv: [['¿La acepta?', 'Sigue la cadena por el AFD de la tabla y di si termina en un estado final. Responde sí o no.'], ['Los estados activos', 'Sigue la cadena por el AFND y escribe el conjunto de estados activos al final (por ejemplo: p0 p2). Si no queda ninguno, escribe ∅.'], ['Subconjuntos', 'Pasa el AFND a AFD por subconjuntos y escribe cuántos estados tiene el AFD (el conjunto vacío cuenta si aparece).']],
      lq1: '¿El AFD acepta la cadena {w}?', lq2: '¿Qué estados están activos al terminar de leer {w}?', lq3: '¿Cuántos estados tiene el AFD equivalente?', h1: 'Un estado por símbolo: escribe la traza y mira si el último está en «finales».', h2: 'Lleva un conjunto: en cada símbolo, adónde puede ir cada estado del conjunto (y si hay λ, ciérralo).', h3: 'Empieza por el λ-cierre del inicial y añade una fila por cada conjunto nuevo, el vacío incluido.',
      plane: 'Diagrama de estados del autómata' },
    en: { title: 'sergio@learns: ~/lab/simulators/automata', showM: 'Your automaton', hideM: 'Hide', tab: 'The table', tabHint: 'One line per transition: source, symbol and target (several targets separated by commas; λ for empty transitions). Before them, «start q0» and «finals q3». Up to 12 states.',
      str: 'String', strHint: 'Only symbols from the alphabet. Empty = λ.', go: 'Test the string', toDFA: 'Convert to DFA', re: 'Regular expression', reHint: 'Symbols, + (or |) for union, * and brackets. Example: (0+1)*11', reGo: 'Build the NFA', presets: 'To try',
      pre: [['DFA: ends in 101', 'd101'], ['NFA: ends in 101', 'n101'], ['With λ', 'lam'], ['Exact code with a trap', 'trap']],
      err: { start: 'Line {l}: «start» takes a single state.', line: 'Line {l}: it must have a source, a symbol and a target.', sym: 'Line {l}: the symbol must be a single character (or λ).', nostart: 'The «start q0» line is missing.', big: 'At most 12 states.', nosym: 'There is no transition with a symbol.', badstr: 'The string has symbols that are not in the alphabet ({s}).', re: 'The expression cannot be read: use symbols, +, *, brackets and λ.', rebig: 'That NFA would have more than 12 states: try a shorter expression.' },
      yoursN: 'Your automaton', yoursD: 'The one you typed, reading your string.', subN: 'Your NFA, to DFA', subD: 'The subset construction, row by row.', reN: 'Your expression', reD: 'The NFA from Kleene\'s pieces, reading your string.',
      tape: 'String', act: 'Active', actD: 'Current state', table: 'Transition table', subT: 'Subsets', set: 'Set', yes: 'ACCEPTED', no: 'REJECTED', empty: 'empty string (λ)',
      kind: { dfa: 'DFA', nfa: 'NFA', nfal: 'NFA with λ' }, abs: 'absorbing', unr: 'unreachable', fin: 'final', ini: 'initial', none: '∅ (none)',
      lv: [['Does it accept it?', 'Follow the string through the DFA in the table and say whether it ends in a final state. Answer yes or no.'], ['The active states', 'Follow the string through the NFA and type the set of active states at the end (for example: p0 p2). If none is left, type ∅.'], ['Subsets', 'Convert the NFA to a DFA by subsets and type how many states the DFA has (the empty set counts if it appears).']],
      lq1: 'Does the DFA accept the string {w}?', lq2: 'Which states are active after reading {w}?', lq3: 'How many states does the equivalent DFA have?', h1: 'One state per symbol: write the trace and check whether the last one is in «finals».', h2: 'Carry a set: at each symbol, where each state in the set can go (and if there are λs, close it).', h3: 'Start with the λ-closure of the initial state and add a row for each new set, the empty one included.',
      plane: 'State diagram of the automaton' }
  };
  /* ------------------------------------------------ autómatas de las lecciones (los del tema 6a) */
  var A = {
    d101: 'inicio q0\nfinales q3\nq0 0 q0\nq0 1 q1\nq1 0 q2\nq1 1 q1\nq2 0 q0\nq2 1 q3\nq3 0 q2\nq3 1 q1',
    n101: 'inicio p0\nfinales p3\np0 0 p0\np0 1 p0,p1\np1 0 p2\np2 1 p3',
    lam: 'inicio r0\nfinales a3 b2\nr0 λ a1,b1\na1 1 a2\na2 0 a3\na3 1 a3\nb1 1 b2\nb2 1 b2',
    trap: 'inicio s0\nfinales s2\ns0 1 s1\ns0 0 B\ns1 0 s2\ns1 1 B\ns2 0 B\ns2 1 B\nB 0 B\nB 1 B\nX 0 s2\nX 1 s2',
    pen: 'inicio e0\nfinales e2\ne0 0 e0\ne0 1 e0,e1\ne1 0 e2\ne1 1 e2',
    er: 'inicio A\nfinales B C\nA 1 B\nB 0 B\nB 1 C\nC 1 C'
  };
  function M_(k) { return E.parse(A[k]).M; }
  var POS = {   // posiciones a mano de los autómatas de las lecciones (lienzo 600 × 300), como en los diagramas del tema
    lam: { r0: [70, 150], a1: [210, 80], a2: [360, 80], a3: [510, 80], b1: [210, 230], b2: [360, 230] },
    trap: { s0: [70, 110], s1: [230, 110], s2: [390, 110], B: [310, 240], X: [530, 210] }
  };
  function posOf(k) { var o = {}; if (!POS[k]) return null; Object.keys(POS[k]).forEach(function (q) { o[q] = { x: POS[k][q][0], y: POS[k][q][1], row: 0 }; }); return o; }
  var LES = [
    { k: 'cerradura', g: GL.lock, kind: 'run', a: 'd101', w: '1101',
      n: ['La cerradura de la taquilla', 'The locker lock'], d: ['Un AFD que abre con 1 0 1: un estado por tecla y un único camino.', 'A DFA that opens with 1 0 1: one state per key and a single path.'],
      say: { 0: ['La cerradura de la taquilla del gimnasio: abre cuando las tres últimas teclas son 1 0 1. Cada estado recuerda cuánto del código llevas: q0 nada, q1 «1», q2 «10» y q3 «101», el final (doble círculo).', 'The gym locker lock: it opens when the last three keys are 1 0 1. Each state remembers how much of the code you have: q0 nothing, q1 «1», q2 «10» and q3 «101», the final one (double circle).'] },
      ask: { 3: { q: ['Estás en q1 («llevo 1») y pulsas 0. ¿Adónde va el AFD?', 'You are in q1 («I have 1») and press 0. Where does the DFA go?'], o: [['q2', 'q2', 1], ['q0', 'q0'], ['q1', 'q1']] } } },
    { k: 'reinicio', g: GL.lock, kind: 'run', a: 'd101', w: '1010',
      n: ['Abrir y volver a cerrar', 'Open and close again'], d: ['1010 pasa por q3, pero la última tecla la saca: lo que cuenta es dónde termina.', '1010 goes through q3, but the last key takes it out: what counts is where it ends.'],
      say: { 0: ['La misma cerradura con 1010. Fíjate en el tercer paso: llega a q3, el final… y todavía queda una tecla.', 'The same lock with 1010. Look at the third step: it reaches q3, the final state… and there is still one key left.'] },
      ask: { 4: { q: ['Con la última tecla, 0, desde q3: ¿se queda abierta la taquilla?', 'With the last key, 0, from q3: does the locker stay open?'], o: [['No: vuelve a q2', 'No: it goes back to q2', 1], ['Sí: ya pasó por q3', 'Yes: it already went through q3'], ['No: vuelve a q0', 'No: it goes back to q0']] } } },
    { k: 'trampa', g: GL.trap, kind: 'run', a: 'trap', w: '110', props: 1,
      n: ['La trampa y el inaccesible', 'The trap and the unreachable state'], d: ['El código exacto 10: una tecla fuera de sitio y a B, de donde no se sale. Y X, al que no se llega.', 'The exact code 10: one key out of place and into B, which you cannot leave. And X, which you cannot reach.'],
      say: { 0: ['La taquilla de primero solo abre con el código exacto 10. Cualquier tecla fuera de lugar lleva a B. Y X tiene flechas que salen, pero ninguna que entre.', 'The first-years\' locker only opens with the exact code 10. Any key out of place leads to B. And X has arrows going out, but none coming in.'] },
      ask: { 2: { q: ['Has pulsado 1 y 1. ¿Puede abrirse todavía con más teclas?', 'You have pressed 1 and 1. Can it still open with more keys?'], o: [['No: B es de absorción', 'No: B is absorbing', 1], ['Sí, con un 0', 'Yes, with a 0'], ['Sí, empezando de nuevo', 'Yes, starting again']] } } },
    { k: 'afnd', g: GL.fork, kind: 'run', a: 'n101', w: '1101',
      n: ['Adivinar dónde empieza', 'Guessing where it starts'], d: ['El AFND de 101: con cada 1, quedarse o empezar el código. Se sigue un conjunto de estados.', 'The 101 NFA: with each 1, stay or start the code. You follow a set of states.'],
      say: { 0: ['El mismo lenguaje con un AFND: p0 tiene un bucle con 0 y 1 y, con un 1, también puede apostar a que empieza el código (p1). Ahora no hay un estado activo, sino un conjunto.', 'The same language with an NFA: p0 has a loop with 0 and 1 and, with a 1, it can also bet that the code starts (p1). Now there is not one active state, but a set.'] },
      ask: { 1: { q: ['Con el primer 1, ¿en qué estados puede estar el AFND?', 'With the first 1, which states can the NFA be in?'], o: [['{p0, p1}', '{p0, p1}', 1], ['{p1}', '{p1}'], ['{p0}', '{p0}']] } } },
    { k: 'lambda', g: GL.lam, kind: 'run', a: 'lam', w: '11',
      n: ['La llave maestra (λ)', 'The master key (λ)'], d: ['Dos caminos unidos con λ: el λ-cierre activa estados sin pulsar nada.', 'Two paths joined with λ: the λ-closure activates states without pressing anything.'],
      say: { 0: ['Código del usuario (arriba: 10 y unos) o llave maestra del conserje (abajo: uno o más unos), unidos con dos transiciones λ desde r0. Antes de pulsar nada ya están activos r0, a1 y b1: el λ-cierre de r0.', 'The user\'s code (top: 10 and ones) or the caretaker\'s master key (bottom: one or more ones), joined by two λ-transitions from r0. Before pressing anything, r0, a1 and b1 are already active: the λ-closure of r0.'] },
      ask: { 2: { q: ['Tras 1 y 1, ¿qué queda activo?', 'After 1 and 1, what is left active?'], o: [['{b2}', '{b2}', 1], ['{a2, b2}', '{a2, b2}'], ['∅', '∅']] } } },
    { k: 'subconj', g: GL.table, kind: 'sub', a: 'n101',
      n: ['De AFND a AFD', 'From NFA to DFA'], d: ['La construcción por subconjuntos: cada estado del AFD es un conjunto del AFND.', 'The subset construction: each DFA state is a set of NFA states.'],
      say: { 0: ['Vamos a convertir el AFND de 101 en un AFD. Cada estado del AFD será un conjunto de estados del AFND. Se empieza por el λ-cierre del inicial: {p0}.', 'We are going to turn the 101 NFA into a DFA. Each DFA state will be a set of NFA states. You start with the λ-closure of the initial state: {p0}.'] },
      ask: { 3: { q: ['Desde C = {p0, p2} con un 1, ¿qué conjunto sale?', 'From C = {p0, p2} with a 1, which set comes out?'], o: [['{p0, p1, p3}', '{p0, p1, p3}', 1], ['{p3}', '{p3}'], ['{p0, p1}', '{p0, p1}']] } } },
    { k: 'penultima', g: GL.table, kind: 'sub', a: 'pen',
      n: ['La penúltima es 1', 'The second-to-last is 1'], d: ['Otro AFND de tres estados que se convierte en un AFD de cuatro que recuerda las dos últimas teclas.', 'Another three-state NFA that becomes a four-state DFA remembering the last two keys.'],
      say: { 0: ['El AFND de «la penúltima tecla es 1»: e0 apuesta, con cada 1, a que es la penúltima. Lo pasamos a AFD.', 'The NFA for «the second-to-last key is 1»: e0 bets, with each 1, that it is the second-to-last. We convert it to a DFA.'] } },
    { k: 'expresion', g: GL.rx, kind: 'run', a: 'er', w: '1001', re: '10*1*',
      n: ['La expresión 10*1*', 'The expression 10*1*'], d: ['Un AFD pequeño y su expresión regular: los bucles son estrellas.', 'A small DFA and its regular expression: loops are stars.'],
      say: { 0: ['Este AFD acepta un 1, después ceros y después unos: 10*1*. A le falta la flecha con 0 y C la de 0: van a una trampa que no se dibuja.', 'This DFA accepts a 1, then zeros and then ones: 10*1*. A is missing its arrow with 0 and C its arrow with 0: they go to a trap that is not drawn.'] } }
  ];
  function kindOf(M) { return E.isDet(M) ? 'dfa' : (E.hasLam(M) ? 'nfal' : 'nfa'); }
  function pyset(S) { return S.length ? '{' + S.map(function (q) { return "'" + q + "'"; }).join(', ') + '}' : 'set()'; }
  /* ------------------------------------------------ pasos de cada lección */
  function stepsOf(les, lang) {
    var en = lang === 'en', li = en ? 1 : 0, M = les.M || M_(les.a), out = [], t = TX[lang];
    var say = function (k) { return les.say && les.say[k] ? les.say[k][li] : null; };
    var ask = function (k) { return les.ask && les.ask[k] ? les.ask[k] : null; };
    var det = E.isDet(M), F = M.F;
    if (les.kind === 'run') {
      var w = les.w || '', R = E.run(M, w);
      R.forEach(function (r, i) {
        var st = { kind: 'run', M: M, act: r.S, i: i, w: w, ask: ask(i), hot: [], pos: les.a ? posOf(les.a) : null }, s;
        if (i === 0) {
          var cl = r.S.length > 1;
          s = say(0) || (en ? 'The automaton is ready. ' : 'El autómata está listo. ');
          if (cl && !say(0)) s += en ? 'The λ-closure of ' + M.q0 + ' is ' + E.setName(r.S) + '.' : 'El λ-cierre de ' + M.q0 + ' es ' + E.setName(r.S) + '.';
          st.code = det ? 'q = "' + M.q0 + '"' : 'activos = cierre({"' + M.q0 + '"})'; st.res = det ? null : pyset(r.S);
          if (!w.length) st.v = E.acc(M, r.S);
        } else {
          var prev = R[i - 1].S, a = r.a;
          prev.forEach(function (q) { (M.f[E.key(q, a)] || []).forEach(function (d) { st.hot.push([q, d]); }); });
          if (det && !r.S.length) {
            s = !prev.length ? (en ? 'I read «' + a + '». Still in the trap.' : 'Leo «' + a + '». Sigue en la trampa.')
              : (en ? 'I read «' + a + '». ' + prev[0] + ' has no arrow with ' + a + ': the string falls into the trap (not drawn) and can no longer be accepted.' : 'Leo «' + a + '». ' + prev[0] + ' no tiene flecha con ' + a + ': la cadena cae en la trampa (que no se dibuja) y ya no puede aceptarse.');
            st.code = 'q = f.get(("' + (prev[0] || '') + '", "' + a + '"))'; st.res = 'None';
          } else if (det) {
            s = en ? 'I read «' + a + '». From ' + prev[0] + ' with ' + a + ' I go to ' + r.S[0] + '.' : 'Leo «' + a + '». Desde ' + prev[0] + ' con ' + a + ' voy a ' + r.S[0] + '.';
            if (E.absorbing(M).indexOf(r.S[0]) >= 0) s += en ? ' ' + r.S[0] + ' is absorbing: every key brings it back to itself, so this string can no longer be accepted.' : ' ' + r.S[0] + ' es de absorción: cualquier tecla lo devuelve a sí mismo, así que esta cadena ya no puede aceptarse.';
            st.code = 'q = f[("' + prev[0] + '", "' + a + '")]'; st.res = "'" + r.S[0] + "'";
          } else {
            var parts = prev.map(function (q) { var d = M.f[E.key(q, a)] || []; return q + ' → ' + (d.length ? d.join(', ') : '∅'); });
            s = (en ? 'I read «' + a + '». ' : 'Leo «' + a + '». ') + parts.join('; ') + '. ';
            if (r.S.length !== r.moved.length) s += en ? 'Closing with λ: ' + E.setName(r.S) + '.' : 'Cerrando con λ: ' + E.setName(r.S) + '.';
            else s += r.S.length ? (en ? 'Active: ' : 'Activos: ') + E.setName(r.S) + '.' : (en ? 'No state is left: every path has died.' : 'No queda ningún estado: todos los caminos han muerto.');
            st.code = 'activos = cierre(mueve(activos, "' + a + '"))'; st.res = pyset(r.S);
          }
          if (i === w.length) st.v = E.acc(M, r.S);
        }
        if (st.v !== undefined) {
          var good = st.v;
          s += ' ' + (det ? (good ? (en ? r.S[0] + ' is final: the string is accepted.' : r.S[0] + ' es final: la cadena se acepta.') : (en ? (r.S[0] || '∅') + ' is not final: the string is rejected.' : (r.S[0] || '∅') + ' no es final: la cadena se rechaza.'))
            : (good ? (en ? 'The set contains a final state: accepted.' : 'El conjunto contiene un estado final: se acepta.') : (en ? 'No final state in the set: rejected.' : 'Ningún estado final en el conjunto: se rechaza.')));
          st.code2 = les.re ? 're.fullmatch(r"' + les.re + '", "' + w + '")' : 'acepta("' + w + '")';
        }
        st.s = [s, s];
        out.push(st);
      });
      if (les.props) {
        var un = M.Q.filter(function (q) { return E.reach(M).indexOf(q) < 0; }), ab = E.absorbing(M);
        var s2 = en ? 'Two kinds of special state. ' + ab.join(', ') + ' is absorbing: you reach it and never leave. ' + (un.length ? un.join(', ') + ' is unreachable: no string reaches it, so the DFA is not connected; deleting it changes nothing.' : '')
          : 'Dos estados especiales. ' + ab.join(', ') + ' es de absorción: se llega y no se sale. ' + (un.length ? un.join(', ') + ' es inaccesible: ninguna cadena llega a él, así que el AFD no es conexo; borrarlo no cambia nada.' : '');
        out.push({ kind: 'props', M: M, act: ab.concat(un), i: w.length, w: w, hot: [], pos: les.a ? posOf(les.a) : null, s: [s2, s2], code: 'accesibles(M)', res: pyset(E.reach(M)), ask: null, props: 1 });
      }
    } else if (les.kind === 'sub') {
      var D = E.subsetDFA(M), Rr = D.R, N = D.names;
      out.push({ kind: 'sub', M: M, D: D, upto: 0, act: Rr.sets[0], s: [say(0) || (en ? 'Start: the λ-closure of the initial state, ' + E.setName(Rr.sets[0]) + ' = A.' : 'Empieza: el λ-cierre del inicial, ' + E.setName(Rr.sets[0]) + ' = A.'), ''], code: 'A = cierre({"' + M.q0 + '"})', res: pyset(Rr.sets[0]), ask: ask(0) });
      out[0].s[1] = out[0].s[0];
      Rr.rows.forEach(function (row, i) {
        var Sx = Rr.sets[row.i], parts = M.S.map(function (a) { var j = row.to[a]; return (en ? 'with ' : 'con ') + a + ' → ' + E.setName(Rr.sets[j]) + ' = ' + N[j]; });
        var news = [];
        M.S.forEach(function (a) { var j = row.to[a]; if (j > i && j <= Rr.rows.length && news.indexOf(N[j]) < 0 && Rr.rows.slice(0, i).every(function (r2) { return M.S.every(function (b) { return r2.to[b] !== j; }); }) && j !== 0) news.push(N[j]); });
        var s = (en ? 'Row of ' : 'Fila de ') + N[row.i] + ' = ' + E.setName(Sx) + ': ' + parts.join('; ') + '.' + (news.length ? (en ? ' New: ' : ' Nuevo: ') + news.join(', ') + '.' : (en ? ' No new sets.' : ' Ningún conjunto nuevo.'));
        if (!Sx.length) s += en ? ' The empty set is absorbing and non-final.' : ' El vacío es de absorción y no final.';
        out.push({ kind: 'sub', M: M, D: D, upto: i + 1, act: Sx, s: [s, s], code: 'tabla["' + N[row.i] + '"]', res: '{' + M.S.map(function (a) { return "'" + a + "': '" + N[row.to[a]] + "'"; }).join(', ') + '}', ask: ask(i + 1) });
      });
      var fins = N.filter(function (x, i) { return Rr.fin[i]; });
      var sEnd = en ? 'Done: ' + N.length + ' states. The final ones are those that contain a final NFA state: ' + fins.join(', ') + '. Of the ' + Math.pow(2, M.Q.length) + ' possible subsets, only ' + N.length + ' are reachable.'
        : 'Terminado: ' + N.length + ' estados. Son finales los que contienen un final del AFND: ' + fins.join(', ') + '. De los ' + Math.pow(2, M.Q.length) + ' subconjuntos posibles, solo ' + N.length + ' son accesibles.';
      out.push({ kind: 'subend', M: D.M, D: D, upto: Rr.rows.length, act: [], s: [sEnd, sEnd], code: 'finales', res: pyset(fins), ask: null });
    }
    return out;
  }
  /* ------------------------------------------------ montar */
  function mount(el) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], li = lang === 'en' ? 1 : 0, en = li === 1;
    var UI = K.mount(el, { sim: 'af', title: t.title, d: true }), q = UI.q, uid = UI.id;
    LES.forEach(function (l) { l.steps = stepsOf(l, lang); });
    var ED = { txt: A.n101, w: '1101', re: '(0+1)*11' };
    var main = '<div class="af-edw" hidden><div class="m1-grp"><p class="m1-h">' + esc(t.tab) + '</p><textarea class="af-ta" rows="9" spellcheck="false" aria-label="' + esc(t.tab) + '"></textarea><p class="af-h">' + esc(t.tabHint) + '</p>'
      + '<div class="m1-pills af-pre">' + t.pre.map(function (p) { return '<button type="button" class="m1-pill" data-afp="' + p[1] + '">' + esc(p[0]) + '</button>'; }).join('') + '</div></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.str) + '</p><input type="text" class="af-in af-w" spellcheck="false" autocomplete="off" aria-label="' + esc(t.str) + '"><p class="af-h">' + esc(t.strHint) + '</p>'
      + '<div class="m1-btns"><button type="button" class="slk-btn slk-btn--p" data-aa="go">' + ico('play', 14) + '<span>' + esc(t.go) + '</span></button><button type="button" class="slk-btn" data-aa="sub">' + ico(GL.table, 14) + '<span>' + esc(t.toDFA) + '</span></button></div>'
      + '<p class="m1-h af-reh">' + esc(t.re) + '</p><input type="text" class="af-in af-re" spellcheck="false" autocomplete="off" aria-label="' + esc(t.re) + '"><p class="af-h">' + esc(t.reHint) + '</p>'
      + '<div class="m1-btns"><button type="button" class="slk-btn" data-aa="re">' + ico(GL.rx, 14) + '<span>' + esc(t.reGo) + '</span></button></div><p class="af-err" aria-live="polite"></p></div></div>'
      + '<div class="af-board"><div class="af-plw"><svg class="af-pl" viewBox="0 0 600 320" role="img" aria-label="' + esc(t.plane) + '"><defs>'
      + '<marker id="' + uid + '-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="af-mk"/></marker>'
      + '<marker id="' + uid + '-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="af-mkh"/></marker></defs><g class="af-g"></g></svg></div>'
      + '<div class="af-side"><div class="af-kind"></div><div class="af-tape"></div><div class="af-actw"></div><div class="af-tabw"></div><p class="af-ver" aria-live="polite"></p></div></div>';
    var CUR = null;
    var C = CA.card(UI, { lessons: LES, main: main,
      onLoad: function (les) { CUR = les; },
      onStep: function (les, k, ox) { render(les.steps[k], ox.anim); },
      xp: function () { return xp(CUR.steps[C.D.pos()]); },
      state: function () { return CUR && /^tuy/.test(CUR.k) ? { ED: ED, k: CUR.k } : null; },
      restore: function (x) { if (x && x.ED) { ED = x.ED; edDraw(); } }
    });
    var TOG = document.createElement('button'); TOG.type = 'button'; TOG.className = 'slk-btn pm3-codeb af-tog'; TOG.setAttribute('data-aa', 'tog'); TOG.setAttribute('aria-expanded', 'false');
    q('.m1-head__r').insertBefore(TOG, q('.m1-head__r').firstChild);
    function tog(open) { var w = q('.af-edw'); w.hidden = !open; TOG.setAttribute('aria-expanded', open ? 'true' : 'false'); TOG.innerHTML = ico(GL.table, 16) + '<span>' + esc(open ? t.hideM : t.showM) + '</span>'; if (open) K.anim(w, [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260 }); }
    tog(false);
    /* ---------- el diagrama */
    var LAYC = {};
    function lay(M) { var k = E.toText(M) ; if (!LAYC[k]) LAYC[k] = E.layout(M, 600, 300); return LAYC[k]; }
    function f1(x) { return Math.round(x * 10) / 10; }
    function arcP(a, b, bend, r) {
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
      var mx = (a.x + b.x) / 2 + nx * bend, my = (a.y + b.y) / 2 + ny * bend;
      var e = function (p, cx, cy) { var ux = cx - p.x, uy = cy - p.y, u = Math.hypot(ux, uy) || 1; return [p.x + ux / u * r, p.y + uy / u * r]; };
      var s = e(a, mx, my), t2 = e(b, mx, my);
      var lx = (s[0] + 2 * mx + t2[0]) / 4 + nx * (bend >= 0 ? 12 : -12), ly = (s[1] + 2 * my + t2[1]) / 4 + ny * (bend >= 0 ? 12 : -12);
      if (!bend) { lx = (s[0] + t2[0]) / 2 + nx * 11; ly = (s[1] + t2[1]) / 2 + ny * 11; }
      return { d: 'M' + f1(s[0]) + ' ' + f1(s[1]) + 'Q' + f1(mx) + ' ' + f1(my) + ' ' + f1(t2[0]) + ' ' + f1(t2[1]), lx: lx, ly: ly };
    }
    function loopP(a, side, r) {
      var ang = side === 'down' ? 90 : -90, R1 = function (g) { return g * Math.PI / 180; };
      var s1 = [a.x + r * Math.cos(R1(ang - 32)), a.y + r * Math.sin(R1(ang - 32))], s2 = [a.x + r * Math.cos(R1(ang + 32)), a.y + r * Math.sin(R1(ang + 32))], c = r * 2.9;
      var c1 = [a.x + c * Math.cos(R1(ang - 28)), a.y + c * Math.sin(R1(ang - 28))], c2 = [a.x + c * Math.cos(R1(ang + 28)), a.y + c * Math.sin(R1(ang + 28))];
      return { d: 'M' + f1(s1[0]) + ' ' + f1(s1[1]) + 'C' + f1(c1[0]) + ' ' + f1(c1[1]) + ' ' + f1(c2[0]) + ' ' + f1(c2[1]) + ' ' + f1(s2[0]) + ' ' + f1(s2[1]), lx: a.x, ly: a.y + (side === 'down' ? r * 2.7 + 8 : -r * 2.6 - 2) };
    }
    function draw(st) {
      var M = st.M, P = st.pos || lay(M), r = M.Q.length > 8 ? 19 : 22, s = '', hot = st.hot || [], act = st.act || [], ab = E.absorbing(M), re = E.reach(M);
      var isHot = function (o, d) { return hot.some(function (h) { return h[0] === o && h[1] === d; }); };
      E.edges(M, P).forEach(function (e) {
        var h = isHot(e.o, e.d), g = e.loop ? loopP(P[e.o], e.loop, r) : arcP(P[e.o], P[e.d], e.bend, r);
        s += '<path class="af-e' + (h ? ' is-hot' : '') + (e.lab.indexOf(LAM) >= 0 ? ' is-lam' : '') + '" d="' + g.d + '" marker-end="url(#' + uid + (h ? '-h' : '-m') + ')"/>';
        s += '<text class="af-el' + (h ? ' is-hot' : '') + '" x="' + f1(g.lx) + '" y="' + f1(g.ly + 4.5) + '" text-anchor="middle">' + esc(e.lab) + '</text>';
      });
      var p0 = P[M.q0];
      s += '<path class="af-e af-start" d="M' + (p0.x - r - 44) + ' ' + p0.y + 'L' + (p0.x - r - 2) + ' ' + p0.y + '" marker-end="url(#' + uid + '-m)"/>';
      M.Q.forEach(function (qq) {
        var p = P[qq], on = act.indexOf(qq) >= 0, fin = M.F.indexOf(qq) >= 0, cls = 'af-n' + (on ? ' is-on' : '') + (fin ? ' is-fin' : '') + (ab.indexOf(qq) >= 0 ? ' is-abs' : '') + (re.indexOf(qq) < 0 ? ' is-unr' : '');
        s += '<g class="' + cls + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '"/>' + (fin ? '<circle class="af-n2" cx="' + p.x + '" cy="' + p.y + '" r="' + (r - 4.5) + '"/>' : '')
          + '<text x="' + p.x + '" y="' + (p.y + 5) + '" text-anchor="middle">' + esc(qq) + '</text></g>';
        if (st.props || st.kind === 'subend') {
          var tag = ab.indexOf(qq) >= 0 ? t.abs : (re.indexOf(qq) < 0 ? t.unr : '');
          if (tag) s += '<text class="af-tag" x="' + p.x + '" y="' + (p.y + (p.row === 1 ? -r - 10 : r + 18)) + '" text-anchor="middle">' + esc(tag) + '</text>';
        }
      });
      return s;
    }
    function side(st) {
      var M = st.M, det = E.isDet(M), k = kindOf(M);
      q('.af-kind').innerHTML = '<span class="af-pill">' + esc(t.kind[k]) + '</span><span class="af-sig">Σ = {' + esc(M.S.join(', ')) + '}</span>';
      if (st.kind === 'run' || st.kind === 'props') {
        var w = st.w;
        q('.af-tape').innerHTML = '<p class="af-lbl">' + esc(t.tape) + '</p><div class="af-cells">' + (w.length ? w.split('').map(function (c, i) { return '<span class="af-cell' + (i < st.i ? ' is-read' : '') + (i === st.i - 1 ? ' is-now' : '') + '">' + esc(c) + '</span>'; }).join('') : '<span class="af-emp">' + esc(t.empty) + '</span>') + '</div>';
        q('.af-actw').innerHTML = '<p class="af-lbl">' + esc(det ? t.actD : t.act) + '</p><div class="af-chips">' + (st.act.length ? st.act.map(function (x) { return '<span class="af-chip' + (M.F.indexOf(x) >= 0 ? ' is-fin' : '') + '">' + esc(x) + '</span>'; }).join('') : '<span class="af-chip is-none">' + esc(t.none) + '</span>') + '</div>';
        q('.af-tabw').innerHTML = tableHTML(M, st);
      } else {
        q('.af-tape').innerHTML = '';
        q('.af-actw').innerHTML = '';
        q('.af-tabw').innerHTML = subHTML(st);
      }
      var v = q('.af-ver');
      if (st.v !== undefined) { v.className = 'af-ver ' + (st.v ? 'is-yes' : 'is-no'); v.textContent = st.v ? t.yes : t.no; }
      else { v.className = 'af-ver'; v.textContent = ''; }
    }
    function tableHTML(M, st) {
      var last = st.i > 0 ? st.w[st.i - 1] : null, prev = st.prevAct || [];
      var syms = M.S.concat(E.hasLam(M) ? [LAM] : []);
      return '<p class="af-lbl">' + esc(t.table) + '</p><div class="af-tw"><table class="af-t"><thead><tr><th></th>' + syms.map(function (a) { return '<th>' + esc(a) + '</th>'; }).join('') + '</tr></thead><tbody>'
        + M.Q.map(function (qq) {
          var on = (st.act || []).indexOf(qq) >= 0;
          return '<tr' + (on ? ' class="is-on"' : '') + '><th>' + (qq === M.q0 ? '→ ' : '') + (M.F.indexOf(qq) >= 0 ? '* ' : '') + esc(qq) + '</th>' + syms.map(function (a) {
            var d = M.f[E.key(qq, a)] || [], dt = E.isDet(M), txt = d.length ? (dt ? d[0] : '{' + d.join(', ') + '}') : (dt ? '—' : '∅');
            var hot = (st.hot || []).some(function (h) { return h[0] === qq; }) && a === last;
            return '<td' + (hot ? ' class="is-hot"' : '') + '>' + esc(txt) + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
    }
    function subHTML(st) {
      var D = st.D, R = D.R, N = D.names, M0 = CUR && (CUR.M || M_(CUR.a)), S = (st.kind === 'subend' ? D.M.S : st.M.S);
      var rows = R.rows.slice(0, st.upto);
      return '<p class="af-lbl">' + esc(t.subT) + '</p><div class="af-tw"><table class="af-t af-ts"><thead><tr><th>' + esc(t.set) + '</th>' + S.map(function (a) { return '<th>' + esc(a) + '</th>'; }).join('') + '</tr></thead><tbody>'
        + rows.map(function (row, i) {
          var fin = R.fin[row.i];
          return '<tr' + (i === st.upto - 1 && st.kind === 'sub' ? ' class="is-on"' : '') + '><th>' + (fin ? '* ' : '') + N[row.i] + ' = ' + esc(E.setName(R.sets[row.i])) + '</th>' + S.map(function (a) { return '<td>' + N[row.to[a]] + '</td>'; }).join('') + '</tr>';
        }).join('') + (st.upto === 0 ? '<tr><th>A = ' + esc(E.setName(R.sets[0])) + '</th>' + S.map(function () { return '<td>…</td>'; }).join('') + '</tr>' : '') + '</tbody></table></div>';
    }
    function partialDFA(st) {   // el AFD hasta la fila upto: estados vistos y sus transiciones ya calculadas
      var D = st.D, R = D.R, N = D.names, seen = [0], t2 = [];
      R.rows.slice(0, st.upto).forEach(function (row) { D.M.S.forEach(function (a) { var j = row.to[a]; if (seen.indexOf(j) < 0) seen.push(j); t2.push([N[row.i], a, N[j]]); }); });
      var Q = D.names.filter(function (x, i) { return seen.indexOf(i) >= 0; });
      return E.make({ Q: Q, S: D.M.S, q0: N[0], F: Q.filter(function (x) { return R.fin[N.indexOf(x)]; }), t: t2 });
    }
    function render(st, anim) {
      var view = st;
      if (st.kind === 'sub') {
        var P = partialDFA(st), full = st.D.M, PL = lay(full);
        LAYC[E.toText(P)] = PL;   // el AFD a medias se dibuja con las posiciones del completo: los estados no saltan
        var cur = st.D.names[st.upto ? st.D.R.rows[st.upto - 1].i : 0];
        view = { M: P, act: [cur], hot: [], kind: 'sub' };
      }
      q('.af-g').innerHTML = draw(view);
      var PP = view.pos || lay(view.M), ys = Object.keys(PP).map(function (k) { return PP[k].y; });   // recorta el lienzo a lo dibujado
      var y0 = Math.max(0, Math.min.apply(null, ys) - 92), y1 = Math.min(320, Math.max.apply(null, ys) + 92);
      q('.af-pl').setAttribute('viewBox', '0 ' + y0 + ' 600 ' + (y1 - y0));
      side(st);
      C.setStrip(st.code2 || st.code, st.code2 ? (st.v ? 'True' : 'False') : st.res);
      if (anim) K.anim(q('.af-g'), [{ opacity: 0.55 }, { opacity: 1 }], { duration: 260 });
    }
    /* ---------- «Explícamelo con calma» */
    function xp(st) {
      var M = st.M, det = E.isDet(M), parts = [], lead, tip;
      if (st.kind === 'run') {
        if (st.i === 0) {
          lead = det ? (en ? 'A DFA starts in its initial state and, for each symbol, follows exactly one arrow.' : 'Un AFD empieza en su estado inicial y, por cada símbolo, sigue exactamente una flecha.')
            : (en ? 'An NFA starts in the λ-closure of its initial state: the initial state plus everything reachable with λ.' : 'Un AFND empieza en el λ-cierre de su estado inicial: el inicial y todo lo que se alcanza con λ.');
          parts.push({ c: E.toText(M, lang).split('\n')[0], d: en ? 'The arrow coming in from nowhere marks it.' : 'Lo marca la flecha que entra sin origen.' });
          parts.push({ c: E.toText(M, lang).split('\n')[1], d: en ? 'Double circle: if the string ends here, it is accepted.' : 'Doble círculo: si la cadena termina aquí, se acepta.' });
        } else {
          lead = det ? (en ? 'f(state, symbol) gives a single state: you look up the row of the current state and the column of the symbol.' : 'f(estado, símbolo) da un solo estado: se mira la fila del estado actual y la columna del símbolo.')
            : (en ? 'Each active state moves with the symbol (it may go to several states or to none); then the set is closed with λ.' : 'Cada estado activo se mueve con el símbolo (puede ir a varios o a ninguno); después se cierra el conjunto con λ.');
          parts.push({ c: st.code, d: en ? 'The step, written as in the «Check it with Python» blocks of the topic.' : 'El paso, escrito como en los bloques de «Compruébalo con Python» del tema.' });
        }
        tip = det ? (en ? 'a trace is one state per symbol; write it in a row and check the last one.' : 'una traza es un estado por símbolo; escríbela en fila y mira el último.') : (en ? 'an NFA accepts if ANY state of the final set is final, not all of them.' : 'un AFND acepta si ALGÚN estado del conjunto final es final, no todos.');
      } else if (st.kind === 'props') {
        lead = en ? 'Reachable: some string leads to it from the initial state. Absorbing: you get in and cannot get out.' : 'Accesible: alguna cadena lleva a él desde el inicial. Absorción: se entra y no se sale.';
        tip = en ? 'a DFA is connected if every state is reachable.' : 'un AFD es conexo si todos sus estados son accesibles.';
      } else {
        lead = en ? 'Each DFA state is a set of NFA states. A cell is «move with the symbol and close with λ»; each new set becomes a new row.' : 'Cada estado del AFD es un conjunto de estados del AFND. Una casilla es «mover con el símbolo y cerrar con λ»; cada conjunto nuevo es una fila nueva.';
        parts.push({ c: 'f\'(C, a) = cierre(⋃ f(q, a))', d: en ? 'Union of where each state of the set goes, then λ-closure.' : 'Unión de adónde va cada estado del conjunto y, después, λ-cierre.' });
        parts.push({ c: 'F\' = {C : C ∩ F ≠ ∅}', d: en ? 'Final: the sets that contain some final NFA state.' : 'Finales: los conjuntos que contienen algún final del AFND.' });
        tip = en ? 'do not forget the empty set: it is an absorbing, non-final state.' : 'no te olvides del vacío: es un estado de absorción, no final.';
      }
      return { code: st.code2 || st.code, lead: esc(lead), parts: parts.map(function (p) { return { c: p.c, d: esc(p.d) }; }), tip: esc(tip) };
    }
    /* ---------- «Tu autómata» */
    function edDraw() { q('.af-ta').value = ED.txt; q('.af-w').value = ED.w; q('.af-re').value = ED.re; }
    function err(m) { q('.af-err').textContent = m || ''; }
    function addLes(les) { les.steps = stepsOf(les, lang); var i = LES.findIndex(function (l) { return /^tuy/.test(l.k); }); if (i >= 0) LES[i] = les; else LES.push(les); C.load(les.k); }
    function readM() {
      ED.txt = q('.af-ta').value; ED.w = q('.af-w').value.replace(/\s+/g, ''); var r = E.parse(ED.txt);
      if (r.err) { err(fill(t.err[r.err], { l: r.line })); return null; }
      return r.M;
    }
    function goRun() {
      var M = readM(); if (!M) return;
      var bad = ED.w.split('').filter(function (c) { return M.S.indexOf(c) < 0; });
      if (bad.length) { err(fill(t.err.badstr, { s: M.S.join(', ') })); return; }
      err(''); addLes({ k: 'tuyo', g: 'pen', kind: 'run', M: M, w: ED.w, n: [TX.es.yoursN, TX.en.yoursN], d: [TX.es.yoursD, TX.en.yoursD], props: E.reach(M).length < M.Q.length || E.absorbing(M).length ? 1 : 0 }); tog(false);
    }
    function goSub() {
      var M = readM(); if (!M) return;
      err(''); addLes({ k: 'tuyo-sub', g: 'pen', kind: 'sub', M: M, n: [TX.es.subN, TX.en.subN], d: [TX.es.subD, TX.en.subD] }); tog(false);
    }
    function goRe() {
      ED.re = q('.af-re').value; ED.w = q('.af-w').value.replace(/\s+/g, '');
      var M; try { M = E.reNFA(ED.re); } catch (x) { err(t.err.re); return; }
      if (M.Q.length > 12) { err(t.err.rebig); return; }
      var bad = ED.w.split('').filter(function (c) { return M.S.indexOf(c) < 0; });
      if (bad.length) { err(fill(t.err.badstr, { s: M.S.join(', ') })); return; }
      err(''); ED.txt = E.toText(M, lang); q('.af-ta').value = ED.txt;
      addLes({ k: 'tuyo-re', g: GL.rx, kind: 'run', M: M, w: ED.w, re: ED.re.replace(/\+/g, '|'), n: [TX.es.reN, TX.en.reN], d: [TX.es.reD, TX.en.reD] }); tog(false);
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-afp],[data-aa]'); if (!b || !el.contains(b)) return;
      if (b.hasAttribute('data-afp')) { var k = b.getAttribute('data-afp'); ED.txt = en ? A[k].replace(/^inicio/m, 'start').replace(/^finales/m, 'finals') : A[k]; q('.af-ta').value = ED.txt; err(''); return; }
      var a = b.getAttribute('data-aa');
      if (a === 'tog') tog(q('.af-edw').hidden); else if (a === 'go') goRun(); else if (a === 'sub') goSub(); else if (a === 're') goRe();
    });
    el.addEventListener('keydown', function (e) { var x = e.target; if (e.key === 'Enter' && x.classList && x.classList.contains('af-in') && el.contains(x)) { e.preventDefault(); if (x.classList.contains('af-re')) goRe(); else goRun(); } });
    /* ---------- «Ponte a prueba» */
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function rw(n) { var s = ''; for (var i = 0; i < n; i++) s += ri(0, 1); return s; }
    function randDFA() {   // 3 o 4 estados, todos accesibles y al menos un final
      var n = ri(3, 4), Q = [], tr = [], M;
      for (var i = 0; i < n; i++) Q.push('q' + i);
      do {
        tr = []; Q.forEach(function (qq) { ['0', '1'].forEach(function (a) { tr.push([qq, a, Q[ri(0, n - 1)]]); }); });
        M = E.make({ Q: Q, S: ['0', '1'], q0: 'q0', F: [Q[ri(1, n - 1)]], t: tr });
      } while (E.reach(M).length < n);
      return M;
    }
    function randNFA() {   // 3 estados con alguna bifurcación y algún hueco; a veces una λ
      var Q = ['p0', 'p1', 'p2'], tr, M;
      do {
        tr = [];
        Q.forEach(function (qq) { ['0', '1'].forEach(function (a) { var k = ri(0, 2); var ds = Q.slice().sort(function () { return Math.random() - 0.5; }).slice(0, k); ds.forEach(function (d) { tr.push([qq, a, d]); }); }); });
        if (Math.random() < 0.35) tr.push([Q[ri(0, 1)], LAM, Q[ri(1, 2)]]);
        M = E.make({ Q: Q, S: ['0', '1'], q0: 'p0', F: ['p2'], t: tr });
      } while (E.isDFA(M) || E.reach(M).length < 3);
      return M;
    }
    function tableTxt(M) { return E.toText(M, lang); }
    var LV = [
      { gen: function () { var M = randDFA(), w = rw(ri(4, 6)), ok = E.accepts(M, w);
        return { q: fill(t.lq1, { w: w }), code: tableTxt(M), ans: ok ? (en ? 'yes' : 'sí') : 'no', norm: function (x) { var u = String(x).toLowerCase().normalize('NFD').replace(/[^a-z]/g, ''); return { si: 'y', s: 'y', yes: 'y', y: 'y', true: 'y', no: 'n', n: 'n', false: 'n' }[u] || u; }, hint: t.h1, mode: 'text' }; } },
      { gen: function () { var M = randNFA(), w = rw(ri(3, 4)), R = E.run(M, w), S = R[R.length - 1].S;
        return { q: fill(t.lq2, { w: w }), code: tableTxt(M), ans: S.length ? S.join(' ') : '∅', norm: function (x) { var u = String(x).replace(/[{}(),;]/g, ' ').trim().split(/\s+/).filter(Boolean).sort(); return u.length === 1 && /^(∅|ø|vacio|vacío|empty|none|ninguno)$/i.test(u[0]) || !u.length ? '∅' : u.join(' '); }, hint: t.h2, mode: 'text' }; } },
      { gen: function () { var M = randNFA(), n = E.subsets(M).sets.length;
        return { q: t.lq3, code: tableTxt(M), ans: String(n), hint: t.h3, mode: 'numeric' }; } }
    ];
    LV.forEach(function (l, i) { l.n = [TX.es.lv[i][0], TX.en.lv[i][0]]; l.d = [TX.es.lv[i][1], TX.en.lv[i][1]]; });
    K.levels(UI, { key: 'sl_sim_af_niveles', need: 3, levels: LV, hl: function (s) { return esc(s); } });
    edDraw();
    // si lo guardado o el enlace compartido es «tu autómata», se rehace antes de arrancar
    var hs = K.hashState(), sv = K.jget('sl_sim_af_' + lang, null), st0 = hs && hs.k ? hs : sv;
    if (st0 && st0.x && st0.x.ED && /^tuy/.test(st0.k)) {
      ED = st0.x.ED; edDraw();
      var r0 = E.parse(ED.txt);
      if (!r0.err) {
        var M0 = r0.M, les0 = st0.k === 'tuyo-sub' ? { k: 'tuyo-sub', g: 'pen', kind: 'sub', M: M0, n: [TX.es.subN, TX.en.subN], d: [TX.es.subD, TX.en.subD] }
          : { k: st0.k, g: 'pen', kind: 'run', M: M0, w: ED.w.split('').filter(function (c) { return M0.S.indexOf(c) >= 0; }).join(''), n: [TX.es.yoursN, TX.en.yoursN], d: [TX.es.yoursD, TX.en.yoursD] };
        les0.steps = stepsOf(les0, lang); LES.push(les0);
      }
    }
    C.start();
  }
  window.SLAFUI = { mount: mount, LES: LES, steps: stepsOf };
  K.boot('.sl-sim[data-sim="af"]', mount);
})();
