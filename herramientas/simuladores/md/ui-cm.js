/* SergioLearns — simulador de MD: Caminos mínimos y árbol generador (19 nov 2026, v97).
 * Dijkstra paso a paso con la tabla del examen de problemas de aula («coste,vértice», «-», «*»), «Tu tabla» para rellenarla
 * y compararla casilla a casilla, Kruskal y Prim paso a paso (árbol generador mínimo, tema 5). Lecciones con los grafos de
 * los temas 4 y 5 de MD (las guaguas de Gran Canaria y el grafo tipo examen), modo libre con tu propio grafo (aristas por
 * texto y vértices que se arrastran) y «Ponte a prueba» por niveles. Necesita SLK (kit v2), SLMD (comun-md.js) y SLCM. */
(function () {
  'use strict';
  var K = window.SLK, M = window.SLMD, X = window.SLCM;
  if (!K || !M || !X) return;
  var esc = K.esc, fill = K.fill, ico = K.ico;
  var W = 640, H = 380;
  var TX = {
    es: { title: 'sergio@learns: ~/laboratorio/simuladores/caminos-minimos', alg: 'Algoritmo', algs: { dij: 'Dijkstra', kru: 'Kruskal', pri: 'Prim' }, graph: 'Grafo',
      graphs: { gua: 'Guaguas', exa: 'Tipo examen', e4: 'Ejercicio 4', rnd: 'Al azar' }, edges: 'Aristas (una por línea: a-b 7)', from: 'Origen', to: 'Destino',
      showC: 'Tu grafo', hideC: 'Ocultar', go: 'Dibujar', mine: 'Rellenar mi tabla', mineOff: 'Ocultar mi tabla', check: 'Comprobar mi tabla', fillRight: 'Ver la buena', clear: 'Vaciar',
      hint: 'Escribe las aristas con su peso (a-b 7, una por línea) o elige un grafo. Puedes arrastrar los vértices para colocarlos a tu gusto.',
      bad: { syntax: 'No entiendo «{l}»: escribe cada arista como a-b 7.', loop: '«{l}» es un bucle: no hace falta para estos algoritmos.', dup: '«{l}» repite una arista.', empty: 'Escribe al menos una arista.', big: 'Como mucho 10 vértices.', conn: 'El grafo no es conexo: Kruskal y Prim necesitan que lo sea.' },
      yoursN: 'Tu grafo', yoursD: 'El que has escrito o elegido, paso a paso.', step: 'Paso', proc: 'se procesa', total: 'Peso total', tree: 'Árbol', cands: 'Candidatas',
      sorted: 'Aristas ordenadas por peso', acc: 'entra', rej: 'ciclo', wait: 'pendiente', skip: 'sobra', path: 'Camino', cost: 'coste',
      mineLead: 'Rellena cada casilla como en el examen: coste,vértice (sin espacios), - para infinito y * para los cerrados. Las dos últimas columnas sobran: déjalas en blanco.',
      okN: '{a} de {n} casillas bien.', allOk: 'Tabla perfecta: {n} de {n}.', blank: '(en blanco)',
      lv: [['El camino mínimo', 'Un grafo al azar: el coste del camino mínimo entre dos vértices con Dijkstra.'], ['Una casilla de la tabla', 'Lo que se escribe en una casilla de la tabla de Dijkstra, con el formato del examen.'], ['El árbol generador mínimo', 'El peso total del árbol generador mínimo (Kruskal o Prim, tema 5).']],
      lq1: '¿Cuánto cuesta el camino mínimo de {s} a {d}? Escribe solo el número.', lq2: 'En la tabla de Dijkstra desde {s}, ¿qué se escribe en la fila de {v} en el paso {k}? Usa el formato del examen (coste,vértice, - o *). Si dos vértices empatan, se procesa el primero en orden alfabético.', lq3: '¿Cuánto pesa el árbol generador mínimo de este grafo? Escribe solo el número.',
      h1: 'Procesa en cada paso el vértice no cerrado con menor coste de toda la tabla y actualiza solo si el coste mejora.', h2: 'Antes de tu paso, los procesados ya son *; los no alcanzados, -; los demás, coste,vértice del mejor camino conocido.', h3: 'Kruskal: ordena las aristas por peso y quédate con las que no cierran ciclo, hasta tener n − 1.' },
    en: { title: 'sergio@learns: ~/lab/simulators/shortest-paths', alg: 'Algorithm', algs: { dij: 'Dijkstra', kru: 'Kruskal', pri: 'Prim' }, graph: 'Graph',
      graphs: { gua: 'Buses', exa: 'Exam style', e4: 'Exercise 4', rnd: 'Random' }, edges: 'Edges (one per line: a-b 7)', from: 'Start', to: 'End',
      showC: 'Your graph', hideC: 'Hide', go: 'Draw', mine: 'Fill in my table', mineOff: 'Hide my table', check: 'Check my table', fillRight: 'Show the right one', clear: 'Clear',
      hint: 'Type the edges with their weight (a-b 7, one per line) or pick a graph. You can drag the vertices to place them as you like.',
      bad: { syntax: 'I cannot read «{l}»: write each edge as a-b 7.', loop: '«{l}» is a loop: these algorithms do not need it.', dup: '«{l}» repeats an edge.', empty: 'Type at least one edge.', big: '10 vertices at most.', conn: 'The graph is not connected: Kruskal and Prim need it to be.' },
      yoursN: 'Your graph', yoursD: 'The one you typed or picked, step by step.', step: 'Step', proc: 'processed', total: 'Total weight', tree: 'Tree', cands: 'Candidates',
      sorted: 'Edges sorted by weight', acc: 'in', rej: 'cycle', wait: 'pending', skip: 'not needed', path: 'Path', cost: 'cost',
      mineLead: 'Fill in each cell as in the exam: cost,vertex (no spaces), - for infinity and * for closed ones. The last two columns are extra: leave them blank.',
      okN: '{a} of {n} cells right.', allOk: 'Perfect table: {n} of {n}.', blank: '(blank)',
      lv: [['The shortest path', 'A random graph: the cost of the shortest path between two vertices with Dijkstra.'], ['One cell of the table', 'What goes in one cell of the Dijkstra table, in the exam format.'], ['The minimum spanning tree', 'The total weight of the minimum spanning tree (Kruskal or Prim, topic 5).']],
      lq1: 'What does the shortest path from {s} to {d} cost? Write just the number.', lq2: 'In the Dijkstra table from {s}, what is written in {v}’s row at step {k}? Use the exam format (cost,vertex, - or *). If two vertices tie, the first in alphabetical order is processed.', lq3: 'What does the minimum spanning tree of this graph weigh? Write just the number.',
      h1: 'At each step process the non-closed vertex with the lowest cost in the whole table and only update if the cost improves.', h2: 'Before your step, processed vertices are already *; unreached ones, -; the rest, cost,vertex of the best known path.', h3: 'Kruskal: sort the edges by weight and keep those that do not close a cycle, until you have n − 1.' }
  };
  /* ------------------------------------------------ grafos de los artículos */
  var GR = {
    gua: { E: [['a', 'b', 7], ['a', 'd', 12], ['a', 'e', 6], ['b', 'c', 5], ['b', 'd', 8], ['b', 'e', 10], ['c', 'd', 9], ['d', 'g', 18], ['e', 'f', 5], ['e', 'g', 22], ['f', 'g', 14]],
      P: { a: [292, 196], b: [222, 82], c: [70, 112], d: [128, 296], e: [424, 120], f: [560, 88], g: [514, 300] }, src: 'a', dst: 'g' },
    exa: { E: [['a', 'b', 2], ['b', 'c', 6], ['c', 'd', 2], ['e', 'f', 4], ['f', 'g', 2], ['g', 'h', 2], ['a', 'e', 4], ['b', 'f', 3], ['c', 'g', 1], ['d', 'h', 7], ['a', 'f', 9], ['f', 'c', 4]],
      P: { a: [80, 90], b: [240, 90], c: [400, 90], d: [560, 90], e: [80, 290], f: [240, 290], g: [400, 290], h: [560, 290] }, src: 'a', dst: 'h' },
    e4: { E: [['a', 'b', 3], ['a', 'c', 7], ['b', 'c', 2], ['b', 'd', 6], ['c', 'd', 3], ['c', 'e', 8], ['d', 'e', 2], ['d', 'f', 5], ['e', 'f', 1], ['e', 'g', 6], ['f', 'g', 4]],
      P: { a: [64, 190], b: [190, 86], c: [190, 294], d: [334, 190], e: [460, 294], f: [480, 86], g: [584, 196] }, src: 'a', dst: 'g' }
  };
  var NAMES = { a: 'Escaleritas', b: 'Mesa y López', c: 'Santa Catalina', d: 'San Telmo', e: 'Siete Palmas', f: 'Tamaraceite', g: ['Campus de Tafira', 'Tafira campus'] };
  function S(o) { return o; }
  /* ------------------------------------------------ pasos automáticos (lecciones y modo libre) */
  function nf(x, en) { return String(x).replace('.', en ? '.' : ','); }
  function autoSteps(g, alg, src, dst) {
    var E = g.E, steps = [], tx = function (es, en) { return [es, en]; };
    if (alg === 'dij') {
      var D = X.dijkstra(E, src);
      steps.push(S({ k: -1, s: tx('Dijkstra desde ' + src + (dst ? ' hasta ' + dst : '') + '. Al principio solo se sabe llegar al origen, con coste 0; los demás valen infinito (un guion en la tabla).', 'Dijkstra from ' + src + (dst ? ' to ' + dst : '') + '. At the start you only know how to reach the start, with cost 0; the rest are infinity (a dash in the table).'),
        code: 'coste = {v: None for v in V}; coste["' + src + '"] = 0' }));
      D.cols.forEach(function (c, j) {
        var es = 'Paso ' + (j + 1) + ': se procesa ' + c.u + ' (coste ' + c.cu + ').', en = 'Step ' + (j + 1) + ': ' + c.u + ' is processed (cost ' + c.cu + ').';
        if (c.tie.length) { es += ' Empata con ' + c.tie.join(', ') + ': se coge el primero en orden alfabético.'; en += ' It ties with ' + c.tie.join(', ') + ': the first in alphabetical order is taken.'; }
        var up = c.tries.filter(function (t) { return t.better; }), no = c.tries.filter(function (t) { return !t.better; });
        if (up.length) { es += ' Desde ' + c.u + ': ' + up.map(function (t) { return t.v + ' pasa a ' + t.c + ',' + c.u + (t.old != null ? ' (antes ' + t.old + ')' : ''); }).join('; ') + '.'; en += ' From ' + c.u + ': ' + up.map(function (t) { return t.v + ' becomes ' + t.c + ',' + c.u + (t.old != null ? ' (was ' + t.old + ')' : ''); }).join('; ') + '.'; }
        if (no.length) { es += ' ' + no.map(function (t) { return t.v + ' por ' + c.u + ' costaría ' + t.c + ', ' + (t.c === t.old ? 'igual: no cambia' : 'peor que ' + t.old); }).join('; ') + '.'; en += ' ' + no.map(function (t) { return t.v + ' through ' + c.u + ' would cost ' + t.c + ', ' + (t.c === t.old ? 'the same: no change' : 'worse than ' + t.old); }).join('; ') + '.'; }
        if (!c.tries.length) { es += ' No le quedan vecinos sin cerrar.'; en += ' It has no non-closed neighbours left.'; }
        es += ' Desde el paso siguiente, su fila es *.'; en += ' From the next step on, its row is *.';
        steps.push(S({ k: j, s: tx(es, en), code: 'u = min(abiertos, key=lambda v: (coste[v], v))', res: '"' + c.u + '"' }));
      });
      if (dst && D.cost[dst] != null) {
        var p = X.path(D, src, dst), rd = p.slice().reverse().map(function (v) { return D.cols[D.cols.length - 1].cells[v] === '*' ? v : v; });
        steps.push(S({ k: D.cols.length - 1, path: p, s: tx('El camino se lee desde la fila de ' + dst + ', saltando al vértice de cada casilla: ' + rd.join(' ← ') + '. Al derecho, ' + p.join(' – ') + ', con coste ' + D.cost[dst] + '.', 'The path is read from ' + dst + '’s row, jumping to the vertex in each cell: ' + rd.join(' ← ') + '. Forwards, ' + p.join(' – ') + ', with cost ' + D.cost[dst] + '.'),
          code: 'camino = [' + p.map(function (v) { return '"' + v + '"'; }).join(', ') + ']', res: String(D.cost[dst]) }));
      }
    } else if (alg === 'kru') {
      var R = X.kruskal(E), n = R.V.length;
      steps.push(S({ k: -1, s: tx('Kruskal: se ordenan las ' + E.length + ' aristas de menor a mayor peso y se van cogiendo las que no cierran un ciclo, hasta tener ' + (n - 1) + ' (los vértices menos uno).', 'Kruskal: the ' + E.length + ' edges are sorted from lightest to heaviest and the ones that do not close a cycle are taken, until there are ' + (n - 1) + ' (the vertices minus one).'),
        code: 'aristas.sort(key=lambda e: e[2])' }));
      R.steps.forEach(function (st, j) {
        var e = st.e, nm = e[0] + '–' + e[1] + ' (' + e[2] + ')', es, en;
        if (st.why === 'add') { es = nm + ' une dos trozos distintos: entra. Peso acumulado ' + st.total + '.'; en = nm + ' joins two different pieces: it goes in. Weight so far ' + st.total + '.'; }
        else if (st.why === 'cycle') { es = nm + ' tiene sus dos extremos ya conectados: cerraría un ciclo y se descarta.'; en = nm + ' has both ends already connected: it would close a cycle and is discarded.'; }
        else { es = 'Ya hay ' + (n - 1) + ' aristas: ' + nm + ' y las que quedan sobran.'; en = 'There are already ' + (n - 1) + ' edges: ' + nm + ' and the rest are not needed.'; }
        if (st.why === 'done' && j > 0 && R.steps[j - 1].why === 'done') return;
        steps.push(S({ k: j, s: tx(es, en), code: 'find(' + '"' + e[0] + '") != find("' + e[1] + '")', res: st.why === 'add' ? 'True' : 'False' }));
      });
      steps.push(S({ k: R.steps.length - 1, end: 1, s: tx('Árbol generador mínimo: ' + R.tree.map(function (e) { return e[0] + '–' + e[1]; }).join(', ') + '. Pesa ' + R.total + ' y tiene ' + (n - 1) + ' aristas, una menos que vértices.', 'Minimum spanning tree: ' + R.tree.map(function (e) { return e[0] + '–' + e[1]; }).join(', ') + '. It weighs ' + R.total + ' and has ' + (n - 1) + ' edges, one fewer than the vertices.'),
        code: 'sum(w for u, v, w in arbol)', res: String(R.total) }));
    } else {
      var Q = X.prim(E, src);
      steps.push(S({ k: -1, s: tx('Prim desde ' + src + ': el árbol empieza con ese vértice. En cada paso se añade la arista más barata que sale del árbol hacia un vértice nuevo.', 'Prim from ' + src + ': the tree starts with that vertex. At each step the cheapest edge leaving the tree towards a new vertex is added.'),
        code: 'arbol = {"' + src + '"}' }));
      Q.steps.forEach(function (st, j) {
        var e = st.e, c = st.cand.length;
        steps.push(S({ k: j, s: tx('Salen del árbol ' + c + ' aristas; la más barata es ' + e[0] + '–' + e[1] + ' (' + e[2] + '), y ' + e[1] + ' entra en el árbol. Peso acumulado ' + st.total + '.', c + ' edges leave the tree; the cheapest is ' + e[0] + '–' + e[1] + ' (' + e[2] + '), and ' + e[1] + ' joins the tree. Weight so far ' + st.total + '.'),
          code: 'min(salen, key=lambda e: e[2])', res: '("' + e[0] + '", "' + e[1] + '", ' + e[2] + ')' }));
      });
      steps.push(S({ k: Q.steps.length - 1, end: 1, s: tx('Árbol generador mínimo con Prim: pesa ' + Q.total + ', lo mismo que con Kruskal. Las aristas pueden salir en otro orden, pero el peso mínimo es único.', 'Minimum spanning tree with Prim: it weighs ' + Q.total + ', the same as with Kruskal. The edges may come in a different order, but the minimum weight is unique.'),
        code: 'sum(w for u, v, w in arbol)', res: String(Q.total) }));
    }
    steps.forEach(function (s) { s.alg = alg; s.g = g; s.src = src; s.dst = dst; });
    return steps;
  }
  /* ------------------------------------------------ lecciones (temas 4 y 5 de MD) */
  function lesson(k, g, alg, src, dst, n, d, ico0, patch) {
    var st = autoSteps(GR[g], alg, src, dst); if (patch) patch(st);
    return { k: k, g: ico0, n: n, d: d, steps: st };
  }
  var LES = [
    lesson('guaguas', 'gua', 'dij', 'a', 'g', ['De casa al campus', 'From home to campus'], ['Dijkstra en la red de guaguas del tema 4: tres tramos que cuestan menos que dos.', 'Dijkstra on the topic 4 bus network: three legs that cost less than two.'], 'target', function (st) {
      st[0].s = ['Siete paradas y los minutos de cada tramo. Quiero ir de casa (a, Escaleritas) al campus (g). La línea directa a – e – g tiene dos tramos y 28 minutos. ¿Hay algo mejor? Dijkstra empieza con coste 0 en a y un guion (infinito) en todas las demás.', 'Seven stops and the minutes of each leg. I want to go from home (a, Escaleritas) to campus (g). The direct line a – e – g has two legs and 28 minutes. Is there anything better? Dijkstra starts with cost 0 at a and a dash (infinity) everywhere else.'];
      st[4].ask = { q: ['En el paso 4 se procesa f (11). ¿Qué pasa con g, que tenía 28,e?', 'In step 4 f is processed (11). What happens to g, which had 28,e?'], o: [['Nada: g ya tenía camino', 'Nothing: g already had a path'], ['Pasa a 25,f: por f cuesta 11 + 14 = 25', 'It becomes 25,f: through f it costs 11 + 14 = 25', 1], ['Se cierra con *', 'It is closed with *']] };
      st[5].ask = { q: ['c y d empatan a 12. ¿Cuál se procesa en el paso 5?', 'c and d tie at 12. Which one is processed in step 5?'], o: [['c, el primero alfabéticamente', 'c, the first alphabetically', 1], ['d, porque se alcanzó antes', 'd, because it was reached earlier'], ['Los dos a la vez', 'Both at once']] };
    }),
    lesson('examen', 'exa', 'dij', 'a', 'h', ['La tabla del examen', 'The exam table'], ['El problema 6 de la práctica: la tabla columna a columna, con «-», «*» y «coste,vértice».', 'Practice problem 6: the table column by column, with «-», «*» and «cost,vertex».'], 'exam', function (st) {
      st[0].s = ['Así sale en el examen de problemas de aula: ocho vértices, origen a y destino h. En cada paso se procesa un vértice y se escribe una columna. Fíjate en los símbolos: - es infinito y * es cerrado.', 'This is how it comes up in the classroom-problems exam: eight vertices, start a and end h. At each step one vertex is processed and one column is written. Watch the symbols: - is infinity and * is closed.'];
      st[2].ask = { q: ['En el paso 2 se procesa b (2). ¿Qué pasa con f, que tenía 9,a?', 'In step 2 b is processed (2). What happens to f, which had 9,a?'], o: [['Pasa a 5,b: 2 + 3 = 5 mejora 9', 'It becomes 5,b: 2 + 3 = 5 improves on 9', 1], ['Se queda 9,a: ya tenía coste', 'It stays 9,a: it already had a cost'], ['Pasa a *', 'It becomes *']] };
      st[5].ask = { q: ['En el paso 5 se procesa g (7). c tiene 8,b y por g también costaría 8. ¿Qué se escribe en c?', 'In step 5 g is processed (7). c has 8,b and through g it would also cost 8. What goes in c?'], o: [['8,g', '8,g'], ['8,b: solo se cambia si mejora', '8,b: it only changes if it improves', 1], ['*', '*']] };
    }),
    lesson('kruskal', 'gua', 'kru', 'a', null, ['Kruskal: lo imprescindible', 'Kruskal: just what is needed'], ['Las paradas conectadas con el menor total: aristas de menor a mayor, sin cerrar ciclos (tema 5).', 'The stops connected with the smallest total: edges from light to heavy, without closing cycles (topic 5).'], 'grid', function (st) {
      st[0].s = ['Si la compañía solo pudiera mantener los tramos imprescindibles para que las siete paradas sigan conectadas, gastando el mínimo total, buscaría un árbol generador mínimo (tema 5). Kruskal ordena los 11 tramos por peso y coge los que no cierran ciclo, hasta tener 6.', 'If the company could only keep the legs needed for the seven stops to stay connected, with the smallest total, it would look for a minimum spanning tree (topic 5). Kruskal sorts the 11 legs by weight and takes those that do not close a cycle, until it has 6.'];
      for (var i = 0; i < st.length; i++) if (st[i].k >= 0 && !st[i].end && st[i].res === 'False' && !st[i].ask) { st[i].ask = { q: ['¿Entra la arista ' + KR(i, st) + '?', 'Does the edge ' + KR(i, st) + ' go in?'], o: [['Sí, es la siguiente más barata', 'Yes, it is the next cheapest'], ['No: sus extremos ya están conectados', 'No: its ends are already connected', 1]] }; break; }
    }),
    lesson('prim', 'gua', 'pri', 'a', null, ['Prim: crecer desde casa', 'Prim: growing from home'], ['El mismo árbol mínimo, creciendo desde a con la arista más barata que sale del árbol.', 'The same minimum tree, growing from a with the cheapest edge leaving the tree.'], '<path d="M12 21V11"/><path d="M12 11L6 5M12 11l6-6"/><circle cx="12" cy="11" r="2"/>')
  ];
  function KR(i, st) { var e = X.kruskal(GR.gua.E).steps[st[i].k].e; return e[0] + '–' + e[1] + ' (' + e[2] + ')'; }
  /* ------------------------------------------------ montaje */
  function mount(el) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], li = lang === 'en' ? 1 : 0, en = li === 1;
    var UI = K.mount(el, { sim: 'cm', title: t.title, d: true }), q = UI.q;
    var ED = { alg: 'dij', g: 'gua', txt: X.text(GR.gua.E), P: null, src: 'a', dst: 'g' };
    var main = '<div class="gj-edw cm-edw" hidden><div class="gj-edl">'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.alg) + '</p><div class="m1-seg cm-alg" role="group">' + ['dij', 'kru', 'pri'].map(function (a) { return '<button type="button" data-ca="' + a + '">' + esc(t.algs[a]) + '</button>'; }).join('') + '</div></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.graph) + '</p><div class="m1-seg cm-gs" role="group">' + ['gua', 'exa', 'e4', 'rnd'].map(function (a) { return '<button type="button" data-cg="' + a + '">' + esc(t.graphs[a]) + '</button>'; }).join('') + '</div></div>'
      + '<p class="gj-edh">' + esc(t.hint) + '</p></div><div class="gj-edr">'
      + '<label class="cm-lab"><span class="m1-h">' + esc(t.edges) + '</span><textarea class="cm-ta" rows="6" spellcheck="false"></textarea></label>'
      + '<div class="cm-ft"><label class="cm-sel"><span>' + esc(t.from) + '</span><select data-cs="src"></select></label><label class="cm-sel cm-dst"><span>' + esc(t.to) + '</span><select data-cs="dst"></select></label></div>'
      + '<div class="m1-btns"><button type="button" class="slk-btn slk-btn--p" data-cb="go">' + ico('play', 14) + '<span>' + esc(t.go) + '</span></button><button type="button" class="slk-btn" data-cb="rnd">' + ico('dice', 14) + '<span>' + esc(t.graphs.rnd) + '</span></button></div></div></div>'
      + '<div class="cm-board"><div class="gj-op cm-op" aria-live="polite"></div><div class="m1-plotw cm-plotw"><svg class="cm-plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(en ? 'Weighted graph' : 'Grafo ponderado') + '"></svg></div>'
      + '<div class="cm-side"></div><div class="cm-minew" hidden></div></div>';
    var CUR = null, CURST = null, POS = null;
    var C = M.card(UI, { lessons: LES, main: main,
      onLoad: function (les) { CUR = les; POS = null; if (les.k !== 'tuya') edFrom(les.steps[0]); },
      onStep: function (les, k, ox) { render(les.steps[k], ox.anim); },
      xp: function () { return xp(CUR.steps[C.D.pos()]); },
      state: function () { return CUR && CUR.k === 'tuya' ? { ED: { alg: ED.alg, g: ED.g, txt: ED.txt, src: ED.src, dst: ED.dst } } : null; },
      restore: function (x) { if (x && x.ED) { ED.alg = x.ED.alg; ED.g = x.ED.g; ED.txt = x.ED.txt; ED.src = x.ED.src; ED.dst = x.ED.dst; edDraw(); go(true); } }
    });
    var TOG = document.createElement('button'); TOG.type = 'button'; TOG.className = 'slk-btn pm3-codeb gj-tog'; TOG.setAttribute('data-cb', 'tog'); TOG.setAttribute('aria-expanded', 'false');
    q('.m1-head__r').insertBefore(TOG, q('.m1-head__r').firstChild);
    function tog(open) { var w = q('.cm-edw'); w.hidden = !open; TOG.setAttribute('aria-expanded', open ? 'true' : 'false'); TOG.innerHTML = ico('pen', 16) + '<span>' + esc(open ? t.hideC : t.showC) + '</span>'; if (open) K.anim(w, [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260 }); }
    tog(false);
    /* ---------- el dibujo del grafo */
    function posOf(g) { if (POS && POS._g === g) return POS; var P = g.P ? JSON.parse(JSON.stringify(g.P)) : X.circle(X.verts(g.E), W, H); var V = X.verts(g.E); V.forEach(function (v) { if (!P[v]) P[v] = X.circle(V, W, H)[v]; }); P._g = g; POS = P; return P; }
    function look(st) {   // estado visual de vértices y aristas en el paso
      var E = st.g.E, V = X.verts(E), vs = {}, es = {}, side = '', op = '', k = st.k, lab = {};
      V.forEach(function (v) { vs[v] = 'is-off'; });
      if (st.alg === 'dij') {
        var D = X.dijkstra(E, st.src), col = k >= 0 ? D.cols[k] : null;
        V.forEach(function (v) {
          var c = col ? col.cells[v] : (v === st.src ? '0,' + st.src : '-');
          lab[v] = c === '*' ? D.cost[v] : c === '-' ? '∞' : c.split(',')[0];
          vs[v] = col && (col.closedBefore.indexOf(v) >= 0) ? 'is-done' : col && v === col.u ? 'is-cur' : c !== '-' ? 'is-seen' : 'is-off';
          if (c !== '-' && v !== st.src) { var pv = c === '*' ? D.prev[v] : c.split(',')[1]; es[X.key(v, pv)] = vs[v] === 'is-done' || vs[v] === 'is-cur' ? 'is-tree' : 'is-tent'; }
        });
        if (col) col.tries.forEach(function (tr) { var kk = X.key(col.u, tr.v); es[kk] = (es[kk] || '') + ' is-try' + (tr.better ? ' is-up' : ''); });
        if (st.path) for (var i = 0; i < st.path.length - 1; i++) es[X.key(st.path[i], st.path[i + 1])] = 'is-path';
        if (st.path) V.forEach(function (v) { lab[v] = D.cost[v]; });
        side = table(D, k, st);
        op = '<span class="gj-op__k' + (st.path ? ' is-end' : '') + '">Dijkstra</span><b>' + esc(st.path ? (t.path + ' ' + st.path.join(' – ') + ' · ' + t.cost + ' ' + D.cost[st.dst]) : col ? (t.step + ' ' + (k + 1) + ' / ' + D.cols.length + ' · ' + t.proc + ' ' + col.u + ' (' + col.cu + ')') : (st.src + ' = 0')) + '</b>';
      } else if (st.alg === 'kru') {
        var R = X.kruskal(E), sk = k >= 0 ? R.steps[k] : null, tree = sk ? sk.tree : [];
        tree.forEach(function (e) { es[X.key(e[0], e[1])] = 'is-tree'; vs[e[0]] = vs[e[1]] = 'is-done'; });
        R.steps.forEach(function (s2, j) { if (j <= k && s2.why === 'cycle') es[X.key(s2.e[0], s2.e[1])] = 'is-rej'; });
        if (sk && sk.why !== 'done') es[X.key(sk.e[0], sk.e[1])] += ' is-cur' + (sk.ok ? ' is-up' : '');
        side = sortedList(R, k, st.end);
        op = '<span class="gj-op__k' + (st.end ? ' is-end' : '') + '">Kruskal</span><b>' + esc(t.total + ' ' + (sk ? sk.total : 0) + ' · ' + tree.length + ' / ' + (R.V.length - 1)) + '</b>';
      } else {
        var Q = X.prim(E, st.src), sp = k >= 0 ? Q.steps[k] : null, inT = sp ? sp.inT : [st.src], tr2 = sp ? sp.tree : [];
        inT.forEach(function (v) { vs[v] = 'is-done'; });
        tr2.forEach(function (e) { es[X.key(e[0], e[1])] = 'is-tree'; });
        if (sp && !st.end) { sp.cand.forEach(function (e) { var kk = X.key(e[0], e[1]); if (!es[kk]) es[kk] = 'is-tent'; }); es[X.key(sp.e[0], sp.e[1])] = 'is-tree is-cur is-up'; vs[sp.e[1]] = 'is-cur'; }
        side = primList(Q, k, st);
        op = '<span class="gj-op__k' + (st.end ? ' is-end' : '') + '">Prim</span><b>' + esc(t.total + ' ' + (sp ? sp.total : 0) + ' · ' + tr2.length + ' / ' + (Q.V.length - 1)) + '</b>';
      }
      return { vs: vs, es: es, side: side, op: op, lab: lab };
    }
    function svg(st, L) {
      var P = posOf(st.g), s = '', E = st.g.E, gua = st.g === GR.gua, WP = wpos(E, P);
      E.forEach(function (e) {
        var a = P[e[0]], b = P[e[1]], c = L.es[X.key(e[0], e[1])] || '';
        s += '<line class="cm-e ' + c + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
      });
      E.forEach(function (e) {
        var c = L.es[X.key(e[0], e[1])] || '', m = WP[X.key(e[0], e[1])], mx = m[0], my = m[1], w = 12 + 8 * String(e[2]).length;
        s += '<g class="cm-w ' + c + '"><rect x="' + (mx - w / 2) + '" y="' + (my - 11) + '" width="' + w + '" height="22" rx="7"/><text x="' + mx + '" y="' + (my + 5) + '">' + esc(nf(e[2], en)) + '</text></g>';
      });
      Object.keys(P).forEach(function (v) {
        if (v === '_g') return; var p = P[v], c = L.vs[v] || 'is-off', lb = L.lab[v];
        s += '<g class="cm-v ' + c + '" data-v="' + v + '" tabindex="0" role="button" aria-label="' + esc((en ? 'vertex ' : 'vértice ') + v) + '" transform="translate(' + p[0] + ' ' + p[1] + ')"><circle class="cm-halo" r="26"/><circle r="19"/><text y="6">' + esc(v) + '</text>'
          + (lb != null ? '<text class="cm-lab2" y="-28">' + esc(lb === '∞' ? '∞' : nf(lb, en)) + '</text>' : '')
          + (gua && NAMES[v] ? '<text class="cm-nm" y="36">' + esc(typeof NAMES[v] === 'string' ? NAMES[v] : NAMES[v][li]) + '</text>' : '') + '</g>';
      });
      return s;
    }
    function table(D, k, st) {
      var n = D.cols.length, h = '<div class="cm-tw"><table class="cm-t"><thead><tr><th></th>';
      for (var j = 0; j < n; j++) h += '<th class="' + (j === k ? 'is-cur' : j > k ? 'is-fut' : '') + '">' + esc(t.step) + ' ' + (j + 1) + '</th>';
      h += '</tr></thead><tbody>';
      D.V.forEach(function (v) {
        h += '<tr' + (st.path && st.path.indexOf(v) >= 0 ? ' class="is-path"' : '') + '><th>' + esc(v) + '</th>';
        for (var j2 = 0; j2 < n; j2++) {
          var c = j2 <= k ? D.cols[j2].cells[v] : '', cls = j2 === k ? 'is-cur' : j2 > k ? 'is-fut' : '';
          if (j2 <= k && D.cols[j2].u === v) cls += ' is-proc';
          if (j2 <= k && c === '*') cls += ' is-star'; if (j2 <= k && c === '-') cls += ' is-inf';
          h += '<td class="' + cls + '">' + esc(c) + '</td>';
        }
        h += '</tr>';
      });
      return h + '</tbody></table></div>';
    }
    function sortedList(R, k, end) {
      return '<p class="m1-h cm-sh">' + esc(t.sorted) + '</p><ol class="cm-list">' + R.steps.map(function (s2, j) {
        var st2 = j > k ? 'wait' : s2.why === 'add' ? 'acc' : s2.why === 'cycle' ? 'rej' : 'skip';
        return '<li class="is-' + st2 + (j === k && !end ? ' is-cur' : '') + '"><b>' + esc(s2.e[0] + '–' + s2.e[1]) + '</b><span>' + esc(nf(s2.e[2], en)) + '</span><em>' + (st2 === 'acc' ? ico('check', 13) : st2 === 'rej' ? ico('x', 13) : '') + esc(t[st2]) + '</em></li>';
      }).join('') + '</ol>';
    }
    function primList(Q, k, st) {
      var sp = k >= 0 ? Q.steps[k] : null;
      var h = '<p class="m1-h cm-sh">' + esc(t.tree) + '</p><ol class="cm-list">' + (sp ? sp.tree : []).map(function (e, j) { return '<li class="is-acc' + (j === k && !st.end ? ' is-cur' : '') + '"><b>' + esc(e[0] + '–' + e[1]) + '</b><span>' + esc(nf(e[2], en)) + '</span><em>' + ico('check', 13) + esc(t.acc) + '</em></li>'; }).join('') + '</ol>';
      if (sp && !st.end) h += '<p class="m1-h cm-sh">' + esc(t.cands) + '</p><ol class="cm-list is-c">' + sp.cand.map(function (e, j) { return '<li class="' + (j === 0 ? 'is-acc is-cur' : 'is-wait') + '"><b>' + esc(e[0] + '–' + e[1]) + '</b><span>' + esc(nf(e[2], en)) + '</span></li>'; }).join('') + '</ol>';
      return h;
    }
    function render(st, anim) {
      CURST = st;
      var L = look(st);
      q('.cm-plot').innerHTML = svg(st, L);
      q('.cm-side').innerHTML = L.side;
      q('.cm-op').innerHTML = L.op;
      if (anim && !K.reduced()) { q('.cm-plot').classList.remove('is-anim'); void q('.cm-plot').offsetWidth; q('.cm-plot').classList.add('is-anim'); }
      C.setStrip(st.code || '', st.res != null ? st.res : null);
      var cur = q('.cm-t .is-cur'); if (cur && cur.scrollIntoView) { var tw = q('.cm-tw'); if (tw) tw.scrollLeft = Math.max(0, cur.offsetLeft - tw.clientWidth / 2); }
      mineSync();
    }
    function xp(st) {
      if (!st) return null;
      var parts = [], tip;
      if (st.alg === 'dij') {
        parts.push({ c: 'u = min(abiertos, key=lambda v: (coste[v], v))', d: esc(en ? 'The vertex processed is the non-closed one with the lowest cost in the WHOLE table; on a tie, alphabetical order.' : 'Se procesa el no cerrado con menor coste de TODA la tabla; si empatan, el primero en orden alfabético.') });
        parts.push({ c: 'if coste[u] + w < coste[v]', d: esc(en ? 'A neighbour is only updated if the new cost is strictly lower: with the same cost, the jump vertex stays.' : 'Un vecino solo se actualiza si el coste nuevo es estrictamente menor: con el mismo coste, el vértice de salto se queda.') });
        parts.push({ c: '"*"  "-"  "7,a"', d: esc(en ? 'In the table: * from the step after a vertex is processed, - while it cannot be reached, and cost,vertex otherwise.' : 'En la tabla: * desde el paso siguiente al que se procesa, - mientras no se llega, y coste,vértice en los demás.') });
        tip = esc(en ? 'In the exam, extra steps are left blank and the path is read from the destination\'s row.' : 'En el examen, los pasos de más se dejan en blanco y el camino se lee desde la fila del destino.');
      } else if (st.alg === 'kru') {
        parts.push({ c: 'aristas.sort(key=lambda e: e[2])', d: esc(en ? 'All the edges, from lightest to heaviest.' : 'Todas las aristas, de menor a mayor peso.') });
        parts.push({ c: 'find(u) != find(v)', d: esc(en ? 'An edge goes in if its ends are in different pieces; if they are already connected, it would close a cycle.' : 'Una arista entra si sus extremos están en trozos distintos; si ya están conectados, cerraría un ciclo.') });
        tip = esc(en ? 'A spanning tree with n vertices has n − 1 edges: stop when you have them.' : 'Un árbol generador con n vértices tiene n − 1 aristas: para cuando las tengas.');
      } else {
        parts.push({ c: 'salen = [(u, v, w) for u in arbol for v in vecinos[u] if v not in arbol]', d: esc(en ? 'The candidates are the edges with one end in the tree and the other outside.' : 'Las candidatas son las aristas con un extremo en el árbol y el otro fuera.') });
        parts.push({ c: 'min(salen, key=lambda e: e[2])', d: esc(en ? 'The cheapest one goes in, together with its new vertex.' : 'Entra la más barata, con su vértice nuevo.') });
        tip = esc(en ? 'Prim and Kruskal give the same total weight; the tree can only change if there are ties.' : 'Prim y Kruskal dan el mismo peso total; el árbol solo puede cambiar si hay empates.');
      }
      return { code: st.code || '', lead: esc(st.s ? st.s[li] : ''), parts: parts, tip: tip };
    }
    /* ---------- «Tu tabla»: rellenarla y compararla casilla a casilla */
    var MINE = { on: false, v: {}, chk: null };
    function mineSync() {
      var w = q('.cm-minew'), st = CURST, can = st && st.alg === 'dij';
      if (!can) { w.hidden = true; return; }
      w.hidden = false;
      if (!MINE.on) { w.innerHTML = '<button type="button" class="slk-btn" data-cb="mine">' + ico('pen', 14) + '<span>' + esc(t.mine) + '</span></button>'; return; }
      var D = X.dijkstra(st.g.E, st.src), n = D.cols.length + 2, key = JSON.stringify([st.g.E, st.src]);
      if (MINE.key !== key) { MINE.key = key; MINE.v = {}; MINE.chk = null; }
      var h = '<div class="cm-mine"><div class="cm-mine__top"><p class="cm-mine__l">' + esc(t.mineLead) + '</p><button type="button" class="slk-btn" data-cb="mine">' + ico('x', 14) + '<span>' + esc(t.mineOff) + '</span></button></div><div class="cm-tw"><table class="cm-t is-mine"><thead><tr><th></th>';
      for (var j = 0; j < n; j++) h += '<th>' + esc(t.step) + ' ' + (j + 1) + '</th>';
      h += '</tr></thead><tbody>';
      D.V.forEach(function (v) {
        h += '<tr><th>' + esc(v) + '</th>';
        for (var j2 = 0; j2 < n; j2++) {
          var val = (MINE.v[v] || [])[j2] || '', r = MINE.chk ? MINE.chk.res[v][j2] : null, want = j2 < D.cols.length ? D.cols[j2].cells[v] : '';
          h += '<td class="' + (r === true ? 'is-ok' : r === false ? 'is-ko' : '') + '"><input type="text" data-mv="' + v + '" data-mj="' + j2 + '" value="' + esc(val) + '" spellcheck="false" autocomplete="off" aria-label="' + esc(v + ', ' + t.step + ' ' + (j2 + 1)) + '"' + (r === false ? ' title="' + esc(want || t.blank) + '"' : '') + '></td>';
        }
        h += '</tr>';
      });
      h += '</tbody></table></div><div class="m1-btns"><button type="button" class="slk-btn slk-btn--p" data-cb="chk">' + ico('check', 14) + '<span>' + esc(t.check) + '</span></button><button type="button" class="slk-btn" data-cb="right">' + ico('bulb', 14) + '<span>' + esc(t.fillRight) + '</span></button><button type="button" class="slk-btn slk-btn--g" data-cb="clr">' + ico('reset', 14) + '<span>' + esc(t.clear) + '</span></button></div>'
        + '<p class="cm-mine__msg" aria-live="polite">' + (MINE.chk ? esc(MINE.chk.ok === MINE.chk.n ? fill(t.allOk, { n: MINE.chk.n }) : fill(t.okN, { a: MINE.chk.ok, n: MINE.chk.n })) : '') + '</p></div>';
      w.innerHTML = h;
    }
    el.addEventListener('input', function (e) {
      var x = e.target; if (!x.hasAttribute || !x.hasAttribute('data-mv') || !el.contains(x)) return;
      var v = x.getAttribute('data-mv'), j = +x.getAttribute('data-mj'); (MINE.v[v] = MINE.v[v] || [])[j] = x.value;
      if (MINE.chk) { MINE.chk = null; var td = x.parentNode; td.className = ''; var m = q('.cm-mine__msg'); if (m) m.textContent = ''; }
    });
    /* ---------- el modo libre */
    function edFrom(st) { if (!st) return; ED.alg = st.alg; ED.src = st.src; ED.dst = st.dst || ED.dst; var k2 = Object.keys(GR).filter(function (k) { return GR[k] === st.g; })[0]; ED.g = k2 || 'tuya'; ED.txt = X.text(st.g.E); edDraw(); }
    function edDraw() {
      [].forEach.call(UI.qa('[data-ca]'), function (b) { var on = b.getAttribute('data-ca') === ED.alg; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      [].forEach.call(UI.qa('[data-cg]'), function (b) { var on = b.getAttribute('data-cg') === ED.g; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      q('.cm-ta').value = ED.txt;
      var p = X.parse(ED.txt), V = p.E ? X.verts(p.E) : [];
      if (V.indexOf(ED.src) < 0) ED.src = V[0]; if (V.indexOf(ED.dst) < 0) ED.dst = V[V.length - 1];
      q('[data-cs="src"]').innerHTML = V.map(function (v) { return '<option' + (v === ED.src ? ' selected' : '') + '>' + v + '</option>'; }).join('');
      q('[data-cs="dst"]').innerHTML = V.map(function (v) { return '<option' + (v === ED.dst ? ' selected' : '') + '>' + v + '</option>'; }).join('');
      q('.cm-dst').hidden = ED.alg !== 'dij';
    }
    var FREEG = null;
    function go(keepPos) {
      ED.txt = q('.cm-ta').value; ED.src = q('[data-cs="src"]').value || ED.src; ED.dst = q('[data-cs="dst"]').value || ED.dst;
      var p = X.parse(ED.txt);
      if (p.err) { UI.toast(fill(t.bad[p.err], { l: p.line || '' })); q('.cm-ta').focus(); return false; }
      if (ED.alg !== 'dij' && !X.connected(p.E)) { UI.toast(t.bad.conn); return false; }
      var base = GR[ED.g] && X.text(GR[ED.g].E) === X.text(p.E) ? GR[ED.g] : null;
      var oldP = FREEG && FREEG.P;
      FREEG = { E: p.E, P: base ? base.P : null };
      if (!base) { ED.g = 'tuya'; var V = X.verts(p.E), cp = X.circle(V, W, H), P = {}; V.forEach(function (v) { P[v] = keepPos && oldP && oldP[v] ? oldP[v] : (oldP && oldP[v]) || cp[v]; }); FREEG.P = P; }
      edDraw(); POS = null;
      var steps = autoSteps(FREEG, ED.alg, ED.src, ED.alg === 'dij' ? ED.dst : null);
      var les = { k: 'tuya', g: 'pen', n: [TX.es.yoursN, TX.en.yoursN], d: [TX.es.yoursD, TX.en.yoursD], steps: steps };
      var i = LES.findIndex(function (l) { return l.k === 'tuya'; }); if (i >= 0) LES[i] = les; else LES.push(les);
      C.load('tuya'); return true;
    }
    function rndGraph() {
      var R = X.random(5 + Math.floor(Math.random() * 3)); ED.g = 'rnd'; ED.txt = X.text(R); ED.src = 'a'; ED.dst = X.verts(R).slice(-1)[0]; edDraw(); go();
    }
    /* arrastrar los vértices (en cualquier lección: el dibujo pasa a ser tuyo solo en la posición) */
    var DRAG = null;
    function toSvg(e) { var sv = q('.cm-plot'), pt = sv.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; var p = pt.matrixTransform(sv.getScreenCTM().inverse()); return [Math.max(24, Math.min(W - 24, Math.round(p.x))), Math.max(30, Math.min(H - 30, Math.round(p.y)))]; }
    el.addEventListener('pointerdown', function (e) {
      var v = e.target.closest && e.target.closest('.cm-v'); if (!v || !el.contains(v)) return;
      e.preventDefault(); C.D.stop(); DRAG = { v: v.getAttribute('data-v'), id: e.pointerId };
      try { q('.cm-plot').setPointerCapture(e.pointerId); } catch (x) {}
    });
    el.addEventListener('pointermove', function (e) {
      if (!DRAG || e.pointerId !== DRAG.id) return;
      var P = posOf(CURST.g); P[DRAG.v] = toSvg(e); if (CUR && CUR.k === 'tuya' && FREEG) FREEG.P = P;
      q('.cm-plot').innerHTML = svg(CURST, look(CURST));
    });
    function endDrag() { DRAG = null; }
    el.addEventListener('pointerup', endDrag); el.addEventListener('pointercancel', endDrag);
    el.addEventListener('change', function (e) { var s = e.target; if (s.hasAttribute && s.hasAttribute('data-cs') && el.contains(s)) { ED[s.getAttribute('data-cs')] = s.value; } });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ca],[data-cg],[data-cb]'); if (!b || !el.contains(b)) return;
      if (b.hasAttribute('data-ca')) { ED.alg = b.getAttribute('data-ca'); edDraw(); go(true); return; }
      if (b.hasAttribute('data-cg')) { var g = b.getAttribute('data-cg'); if (g === 'rnd') { rndGraph(); return; } ED.g = g; ED.txt = X.text(GR[g].E); ED.src = GR[g].src; ED.dst = GR[g].dst; edDraw(); go(); return; }
      var a = b.getAttribute('data-cb');
      if (a === 'tog') { tog(q('.cm-edw').hidden); return; }
      if (a === 'go') { if (go(true)) tog(false); }
      else if (a === 'rnd') { rndGraph(); tog(false); }
      else if (a === 'mine') { MINE.on = !MINE.on; mineSync(); if (MINE.on) { var f = q('.cm-mine input'); if (f) f.focus({ preventScroll: true }); } }
      else if (a === 'chk') { var D = X.dijkstra(CURST.g.E, CURST.src); MINE.chk = X.compare(D, MINE.v, 2); mineSync(); }
      else if (a === 'right') { var D2 = X.dijkstra(CURST.g.E, CURST.src); MINE.v = {}; D2.V.forEach(function (v) { MINE.v[v] = D2.cols.map(function (c) { return c.cells[v]; }); }); MINE.chk = null; mineSync(); }
      else if (a === 'clr') { MINE.v = {}; MINE.chk = null; mineSync(); }
    });
    el.addEventListener('keydown', function (e) { var x = e.target; if (e.key === 'Enter' && x.hasAttribute && x.hasAttribute('data-mv') && el.contains(x)) { e.preventDefault(); var D = X.dijkstra(CURST.g.E, CURST.src); MINE.chk = X.compare(D, MINE.v, 2); mineSync(); } });
    /* ---------- «Ponte a prueba» (temas 4 y 5) */
    var FIG = {}, FN = 0;
    // Dónde va el peso de cada arista: en el centro si cabe; si no, se corre por la arista hasta que no pisa otro peso ni un vértice
    // (en los grafos al azar dibujados en círculo, las aristas entre vértices opuestos se cruzan todas en el centro).
    function wpos(E, P) {
      var out = {}, put = [], T = [0.5, 0.36, 0.64, 0.27, 0.73, 0.42, 0.58];
      var far = function (x, y) { for (var i = 0; i < put.length; i++) if (Math.abs(put[i][0] - x) < 30 && Math.abs(put[i][1] - y) < 24) return false;
        for (var v in P) if (v !== '_g' && P[v] && Math.hypot(P[v][0] - x, P[v][1] - y) < 26) return false; return true; };
      E.forEach(function (e) { var a = P[e[0]], b = P[e[1]], best = null;
        for (var i = 0; i < T.length && !best; i++) { var x = a[0] + (b[0] - a[0]) * T[i], y = a[1] + (b[1] - a[1]) * T[i]; if (far(x, y)) best = [x, y]; }
        if (!best) best = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        best = [Math.round(best[0] * 10) / 10, Math.round(best[1] * 10) / 10]; put.push(best); out[X.key(e[0], e[1])] = best; });
      return out;
    }
    function figure(E) {
      var id = '@@G' + (++FN), P = X.circle(X.verts(E), 460, 300), s = '';
      E.forEach(function (e) { var a = P[e[0]], b = P[e[1]]; s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; });
      var WP = wpos(E, P);
      E.forEach(function (e) { var m = WP[X.key(e[0], e[1])], mx = m[0], my = m[1]; s += '<g class="cm-qw"><rect x="' + (mx - 11) + '" y="' + (my - 10) + '" width="22" height="20" rx="6"/><text x="' + mx + '" y="' + (my + 5) + '">' + e[2] + '</text></g>'; });
      Object.keys(P).forEach(function (v) { s += '<g class="cm-qv"><circle cx="' + P[v][0] + '" cy="' + P[v][1] + '" r="15"/><text x="' + P[v][0] + '" y="' + (P[v][1] + 5) + '">' + v + '</text></g>'; });
      FIG[id] = '<svg class="cm-qfig" viewBox="0 0 460 300" role="img" aria-label="' + esc(E.map(function (e) { return e[0] + '-' + e[1] + ' ' + e[2]; }).join(', ')) + '">' + s + '</svg><span class="cm-qtxt">' + esc(E.map(function (e) { return e[0] + '-' + e[1] + ' ' + e[2]; }).join('  ·  ')) + '</span>';
      return id;
    }
    function rgraph(n) { var R; do { R = X.random(n); } while (!X.connected(R)); return R; }
    var LV = [
      { gen: function () { var E = rgraph(6), V = X.verts(E), s = V[0], d = V[V.length - 1], D = X.dijkstra(E, s); return { q: fill(t.lq1, { s: s, d: d }), code: figure(E), ans: String(D.cost[d]), hint: t.h1, mode: 'numeric', E: E }; } },
      { gen: function () {
        var E = rgraph(6), V = X.verts(E), s = V[Math.floor(Math.random() * V.length)], D = X.dijkstra(E, s), k = 1 + Math.floor(Math.random() * (D.cols.length - 1)), v = V[Math.floor(Math.random() * V.length)];
        return { q: fill(t.lq2, { s: s, v: v, k: k + 1 }), code: figure(E), ans: D.cols[k].cells[v], hint: t.h2, mode: 'text', norm: function (x) { return X.cell(x); } };
      } },
      { gen: function () { var E = rgraph(6 + Math.floor(Math.random() * 2)); return { q: t.lq3, code: figure(E), ans: String(X.kruskal(E).total), hint: t.h3, mode: 'numeric' }; } }
    ];
    LV.forEach(function (l, i) { l.n = [TX.es.lv[i][0], TX.en.lv[i][0]]; l.d = [TX.es.lv[i][1], TX.en.lv[i][1]]; });
    K.levels(UI, { key: 'sl_sim_cm_niveles', need: 3, levels: LV, hl: function (s) { return FIG[s] || esc(s); } });
    edDraw();
    C.start();
  }
  window.SLCMUI = { mount: mount, LES: LES, autoSteps: autoSteps, GR: GR };
  K.boot('.sl-sim[data-sim="cm"]', mount);
})();
