/* SergioLearns — interfaz del visualizador de algoritmos (.sl-sim[data-sim="algoritmos"]). Necesita kit.js y engine.js (SLAlg).
 * Todo lo que enseña sale de la ejecución de verdad del programa (CPython en Pyodide): barras, punteros, pila, árbol y salida. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, A = window.SLAlg;
  var MAXP = 4000;
  var IDX = /^(i|j|k|p|q|m|inf|sup|medio|low|high|mid|lo|hi|izq|der|left|right|ini|fin|start|end|pos|idx|i_min|imin|iMin|indice|index|min_i|i_max)$/;
  var PAIRS = [['inf', 'sup'], ['low', 'high'], ['lo', 'hi'], ['ini', 'fin'], ['start', 'end'], ['izq', 'der'], ['left', 'right']];
  var CATS = { bus: ['Búsqueda', 'Searching'], rec: ['Recursión', 'Recursion'], ord: ['Ordenación básica', 'Basic sorting'], ava: ['Ordenación avanzada', 'Advanced sorting'] };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'algoritmo',
      ex: 'Ejemplo', data: 'Datos', dice: 'Al azar', edit: 'Editar el código', view: 'Ver la ejecución', runPy: 'Ejecutar con Python', share: 'Compartir',
      code: 'programa.py', javaT: 'Main.java', javaN: 'La misma idea en Java. El visualizador ejecuta la versión de Python (la de FP1); esta es para comparar.', javaNo: 'La versión en Java solo está para los ejemplos sin cambios.',
      mem: 'memoria', stack: 'pila de llamadas', tree: 'árbol de llamadas', out: 'salida', vars: 'variables',
      load: 'Cargando Python (Pyodide, CPython 3.14)… la primera vez tarda unos segundos.', running: 'Python ejecuta tu programa…', fail: 'No se pudo cargar Python (¿sin conexión?). Prueba otra vez.',
      timeout: 'Tu programa tarda demasiado (más de 8 s) y se ha parado. ¿Un bucle que no termina?', crash: 'Python ha fallado: {m}', cut: 'Se ha parado en el paso {n}: los programas del visualizador deben ser cortos (¿un bucle infinito?). Abajo tienes los {n} primeros pasos.',
      steps: 'pasos', cmpL: 'comparaciones', wrL: 'escrituras', callsL: 'llamadas', depthL: 'profundidad',
      start: 'Antes de empezar. Pulsa Paso o Ejecutar.', first: 'Python empieza por la línea {l}.', line: 'Siguiente: línea {l}.',
      call: 'Llamada a {c}.', callD: ' Se apila: profundidad {d}.', ret: '{c} devuelve {r}.', end: 'Fin del programa.',
      cmp: 'Compara {a} {s} {b}: {r}.', wr: '{a} ← {v}.', sw: 'Intercambia {a} y {b}.', more: 'y {n} más', ap: 'Añade {v} al final de {a}.',
      main: 'programa principal', global: 'global', same: 'es la misma lista que {n}', empty: '(vacía)', none: 'Sin listas todavía.',
      errL: '{t} en la línea {l}', errHelp: {
        IndexError: 'Has pedido una posición que la lista no tiene: con n elementos, las posiciones van de 0 a n − 1.',
        RecursionError: 'La recursión no termina: falta el caso base o la llamada no se acerca a él (aquí el límite es de 150 llamadas anidadas).',
        NameError: 'Usas un nombre que Python no conoce: ¿una errata o una variable que aún no tiene valor?',
        ZeroDivisionError: 'Una división entre cero.', TypeError: 'Una operación con un tipo que no le vale (por ejemplo, sumar un número y un texto).',
        SinEntrada: 'El visualizador no puede pedirte datos con input(): escribe los datos en el programa.', SyntaxError: 'Python no entiende esta línea: revisa los dos puntos, los paréntesis y la sangría.'
      },
      notSorted: 'La búsqueda binaria necesita la lista ordenada: con esta lista puede no encontrar lo que sí está.', badData: 'Escribe números separados por comas (como mucho 24).',
      legend: ['compara', 'escribe', 'fuera del tramo'], pending: 'Has cambiado el código: pulsa «Ejecutar con Python».',
      reto: 'Reto: adelántate a Python', retoLead: 'Piensa la respuesta con lápiz y papel; luego compruébala. La respuesta la da Python ejecutando el programa.',
      retoIn: 'Tu respuesta', hint: 'Pista', allOk: '¡Exacto!', bad: 'No es eso. Mira la pista o la solución paso a paso.', solL: 'Ver la solución en el simulador', retoLoad: 'Python prepara el reto…', ansIs: 'La respuesta es {a}.',
      rq: {
        cmp: 'Con {d}, ¿cuántas comparaciones con elementos de la lista hace {f}?',
        calls: 'Con {d}, ¿cuántas llamadas a {f} se hacen en total (contando la primera)?',
        pass: 'Con {d}, ¿cómo queda la lista al terminar la primera vuelta de {f}? Escribe los números separados por comas.'
      },
      rh: {
        cmp: 'Cada if que mira un elemento de la lista cuenta como una comparación, también el == y el < de la misma vuelta.',
        calls: 'Dibuja el árbol: cada caja es una llamada. Cuenta también las que llegan al caso base.',
        pass: 'En la primera vuelta el mayor va «subiendo» hasta el final, intercambiándose con cada vecino menor.'
      }
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'algorithm',
      ex: 'Example', data: 'Data', dice: 'Random', edit: 'Edit the code', view: 'See the run', runPy: 'Run with Python', share: 'Share',
      code: 'program.py', javaT: 'Main.java', javaN: 'The same idea in Java. The visualizer runs the Python version; this one is for comparison.', javaNo: 'The Java version is only there for the unchanged examples.',
      mem: 'memory', stack: 'call stack', tree: 'call tree', out: 'output', vars: 'variables',
      load: 'Loading Python (Pyodide, CPython 3.14)… the first time takes a few seconds.', running: 'Python is running your program…', fail: 'Python could not be loaded (offline?). Try again.',
      timeout: 'Your program takes too long (over 8 s) and has been stopped. A loop that never ends?', crash: 'Python failed: {m}', cut: 'Stopped at step {n}: the visualizer is for short programs (an infinite loop?). Below are the first {n} steps.',
      steps: 'steps', cmpL: 'comparisons', wrL: 'writes', callsL: 'calls', depthL: 'depth',
      start: 'Before starting. Press Step or Run.', first: 'Python starts at line {l}.', line: 'Next: line {l}.',
      call: 'Call to {c}.', callD: ' Pushed: depth {d}.', ret: '{c} returns {r}.', end: 'End of the program.',
      cmp: 'Compares {a} {s} {b}: {r}.', wr: '{a} ← {v}.', sw: 'Swaps {a} and {b}.', more: 'and {n} more', ap: 'Appends {v} to {a}.',
      main: 'main program', global: 'global', same: 'is the same list as {n}', empty: '(empty)', none: 'No lists yet.',
      errL: '{t} on line {l}', errHelp: {
        IndexError: 'You asked for a position the list does not have: with n items, positions go from 0 to n − 1.',
        RecursionError: 'The recursion never ends: the base case is missing or the call does not get closer to it (the limit here is 150 nested calls).',
        NameError: 'You use a name Python does not know: a typo, or a variable with no value yet?',
        ZeroDivisionError: 'A division by zero.', TypeError: 'An operation with a type it does not accept (for example, adding a number and a string).',
        SinEntrada: 'The visualizer cannot ask you for data with input(): write the data in the program.', SyntaxError: 'Python does not understand this line: check the colons, the brackets and the indentation.'
      },
      notSorted: 'Binary search needs a sorted list: with this one it may miss items that are there.', badData: 'Type numbers separated by commas (24 at most).',
      legend: ['compares', 'writes', 'out of range'], pending: 'You changed the code: press «Run with Python».',
      reto: 'Challenge: beat Python to it', retoLead: 'Work the answer out with pen and paper, then check it. Python gives the answer by running the program.',
      retoIn: 'Your answer', hint: 'Hint', allOk: 'Exactly!', bad: 'Not quite. Read the hint or see the solution step by step.', solL: 'See the solution in the simulator', retoLoad: 'Python is preparing the challenge…', ansIs: 'The answer is {a}.',
      rq: {
        cmp: 'With {d}, how many comparisons with list items does {f} make?',
        calls: 'With {d}, how many calls to {f} are made in total (counting the first one)?',
        pass: 'With {d}, what does the list look like after the first lap of {f}? Type the numbers separated by commas.'
      },
      rh: {
        cmp: 'Every if that looks at a list item counts as a comparison, including the == and the < in the same loop.',
        calls: 'Draw the tree: every box is a call. Count the ones that reach the base case too.',
        pass: 'In the first lap the largest value «bubbles up» to the end, swapping with every smaller neighbour.'
      }
    }
  };
  var RETOS = [
    { k: 'busqueda-binaria', kind: 'cmp', f: ['busqueda_binaria', 'binary_search'] },
    { k: 'busqueda-lineal', kind: 'cmp', f: ['buscar', 'find'] },
    { k: 'insercion', kind: 'cmp', f: ['insercion', 'insertion_sort'] },
    { k: 'seleccion', kind: 'cmp', f: ['seleccion', 'selection_sort'] },
    { k: 'burbuja', kind: 'pass', f: ['burbuja', 'bubble_sort'], v: ['vuelta', 'lap'] },
    { k: 'fibonacci', kind: 'calls', f: ['fibonacci', 'fibonacci'] },
    { k: 'potencia-doble', kind: 'calls', f: ['potencia', 'power'] },
    { k: 'hanoi', kind: 'calls', f: ['hanoi', 'hanoi'] }
  ];

  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function distinct(n, a, b) { var s = [], x; while (s.length < n) { x = rnd(a, b); if (s.indexOf(x) < 0) s.push(x); } return s; }
  var NRANGE = { factorial: [1, 7], fibonacci: [2, 7], hanoi: [1, 4], 'potencia-doble': [1, 16], 'potencia-rapida': [1, 16] };
  function randomParams(ex) {
    var o = {}, lst = null;
    ex.p.forEach(function (p, i) {
      if (p[2] === 'list') { lst = ex.s ? distinct(12, 1, 99).sort(function (a, b) { return a - b; }) : distinct(8, 1, 20); o[i] = lst.join(', '); }
    });
    ex.p.forEach(function (p, i) {
      if (p[2] !== 'int') return;
      var n = p[0];
      if (n === 'buscado') o[i] = String(lst ? (Math.random() < .8 ? lst[rnd(0, lst.length - 1)] : rnd(1, 99)) : rnd(1, 20));
      else if (n === 'base') o[i] = String(rnd(2, 3));
      else if (n === 'exp' || n === 'n') { var r = NRANGE[ex.k] || [1, 8]; o[i] = String(rnd(r[0], r[1])); }
    });
    return o;
  }
  function lineRe(name) { return new RegExp('^' + name + '\\s*=.*$', 'm'); }
  function getParam(code, name, type) {
    var m = code.match(lineRe(name)); if (!m) return null;
    var v = m[0].replace(/^[^=]*=\s*/, '').trim();
    return type === 'list' ? v.replace(/^\[|\]$/g, '') : v;
  }
  function setParam(code, name, type, v) { return code.replace(lineRe(name), name + ' = ' + (type === 'list' ? '[' + v + ']' : v)); }
  function parseList(s) {
    var p = s.split(/[\s,;]+/).filter(Boolean);
    if (!p.length || p.length > 24) return null;
    for (var i = 0; i < p.length; i++) if (!/^-?\d+(\.\d+)?$/.test(p[i])) return null;
    return p.map(Number);
  }

  /* ---------- modelo: lo que se ve en cada paso, sacado de la traza ---------- */
  function model(r) {
    var S = r.steps, L = [], cur = {}, cc = 0, wc = 0, md = 0, M = { steps: S, calls: r.calls, out: r.out, err: r.err, cut: r.cut };
    M.lists = L; M.ccum = []; M.wcum = []; M.wr = []; M.md = [];
    var vmin = 0, vmax = 1;
    S.forEach(function (s, k) {
      var prev = cur, w = [];
      if (s.c) {
        cur = Object.assign({}, cur);
        Object.keys(s.c).forEach(function (id) {
          var a = s.c[id], b = prev[id];
          a.forEach(function (e) { var v = parseFloat(e[1]); if (!isNaN(v)) { if (v > vmax) vmax = v; if (v < vmin) vmin = v; } });
          if (b) for (var i = 0; i < a.length; i++) if (!b[i] || b[i][0] !== a[i][0]) w.push({ l: +id, i: i, add: !b[i] });
          cur[id] = a;
        });
      }
      L.push(cur); M.wr.push(w);
      cc += (s.k || []).length; wc += w.length; M.ccum.push(cc); M.wcum.push(wc);
      var d = s.s.filter(function (f) { return f.f; }).length; if (d > md) md = d; M.md.push(md);
    });
    M.vmin = vmin; M.vmax = vmax;
    // árbol: posiciones
    var ch = {}, roots = [];
    r.calls.forEach(function (n, i) { n.i = i; n.lab = n.f + '(' + n.a.map(function (a) { return a[1]; }).join(', ') + ')'; if (n.lab.length > 26) n.lab = n.lab.slice(0, 25) + '…'; if (n.p == null) roots.push(i); else (ch[n.p] = ch[n.p] || []).push(i); });
    var x = 0, GAP = 12, depthMax = 0;
    function wid(n) { var rr = n.r == null ? '' : '→ ' + n.r; if (rr.length > 16) rr = rr.slice(0, 15) + '…'; n.rr = rr; return Math.max(n.lab.length, rr.length) * 7.3 + 20; }
    function place(i, d) {
      var n = r.calls[i]; n.w = wid(n); n.d = d; if (d > depthMax) depthMax = d;
      var c = ch[i] || [];
      if (!c.length) { n.x = x + n.w / 2; x += n.w + GAP; }
      else { c.forEach(function (j) { place(j, d + 1); }); n.x = (r.calls[c[0]].x + r.calls[c[c.length - 1]].x) / 2; if (n.x + n.w / 2 + GAP > x) x = n.x + n.w / 2 + GAP; }
    }
    roots.forEach(function (i) { place(i, 0); });
    M.tw = x; M.th = (depthMax + 1) * 62; M.ch = ch;
    M.recur = r.calls.some(function (n) { return n.p != null; });
    return M;
  }

  function mount(el) {
    var K = K6.mount(el, ''), L = K.lang, t = TX[L], q = K.q, li = L === 'en' ? 1 : 0;
    K.title = t.title;
    var EXS = A.ej, byK = {}; EXS.forEach(function (e) { byK[e.k] = e; });
    var store = 'sl_sim_algoritmos_' + L;
    var S = { sub: {}, k: 'busqueda-binaria', code: null, edited: false, tab: 'py', M: null, mode: 'view', dirty: false };
    S.code = byK[S.k].py[li];
    try { var sv = JSON.parse(K6.store(store) || 'null'); if (sv && byK[sv.k]) { S.k = sv.k; S.code = sv.c || byK[sv.k].py[li]; S.edited = S.code !== byK[sv.k].py[li]; } } catch (e) {}
    var hs = K6.hashState();
    if (hs) { try { var o = JSON.parse(decodeURIComponent(escape(atob(hs)))); if (o && byK[o.k] && typeof o.c === 'string' && o.c.length < 8000) { S.k = o.k; S.code = o.c; S.edited = o.c !== byK[o.k].py[li]; } } catch (e) {} }

    var opts = Object.keys(CATS).map(function (c) {
      return '<optgroup label="' + esc(CATS[c][li]) + '">' + EXS.filter(function (e) { return e.c === c; }).map(function (e) { return '<option value="' + e.k + '">' + esc(e.n[li]) + '</option>'; }).join('') + '</optgroup>';
    }).join('');
    var body = '<div class="sl6-ctl sl6-av-ctl"><label class="sl6-lbl sl6-av-exl" for="' + K.id + '-ex">' + esc(t.ex) + '</label><span class="sl6-selw sl6-av-selw">' + ico('book', 16) + '<select id="' + K.id + '-ex" class="sl6-sel sl6-av-sel">' + opts + '</select></span>'
      + '<div class="sl6-ctl__r"><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>'
      + '<div class="sl6-av-params"></div>'
      + '<div class="sl6-av-grid"><div class="sl6-av-left">'
      + '<div class="sl6-pan sl6-av-codep"><div class="sl6-av-tabs" role="tablist"><button type="button" data-tab="py" aria-pressed="true">' + esc(t.code) + '</button><button type="button" data-tab="java" aria-pressed="false">' + esc(t.javaT) + '</button><button type="button" class="sl6-btn sl6-btn--g sl6-av-ed" data-a="edit">' + ico('pen', 15) + '<span>' + esc(t.edit) + '</span></button></div>'
      + '<div class="sl6-av-code" aria-live="off"></div><textarea class="sl6-av-ta" spellcheck="false" autocomplete="off" autocapitalize="off" hidden></textarea><p class="sl6-av-jn" hidden></p></div>'
      + '<div class="sl6-av-st" role="status"></div>'
      + '</div><div class="sl6-av-right">'
      + K6.toolsHTML(K)
      + '<p class="sl6-av-msg" aria-live="polite"></p>'
      + '<div class="sl6-av-chips"></div>'
      + '<div class="sl6-pan sl6-av-memp"><p class="sl6-av-h">' + esc(t.mem) + '<span class="sl6-av-leg"><i class="is-c"></i>' + esc(t.legend[0]) + '<i class="is-w"></i>' + esc(t.legend[1]) + '<i class="is-o"></i>' + esc(t.legend[2]) + '</span></p><div class="sl6-av-mem"></div></div>'
      + '</div></div>'
      + '<div class="sl6-av-grid2"><div class="sl6-pan"><p class="sl6-av-h">' + esc(t.stack) + '</p><div class="sl6-av-stack"></div></div>'
      + '<div class="sl6-pan sl6-av-outp"><p class="sl6-av-h">' + esc(t.out) + '</p><pre class="sl6-av-out"></pre><div class="sl6-av-err" hidden></div></div></div>'
      + '<div class="sl6-pan sl6-av-treep" hidden><p class="sl6-av-h">' + esc(t.tree) + '<span class="sl6-av-tc"></span></p><div class="sl6-av-tree"></div></div>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var P = K6.player(K);
    var sel = q('.sl6-av-sel'), codeEl = q('.sl6-av-code'), ta = q('.sl6-av-ta'), stEl = q('.sl6-av-st');

    function ex() { return byK[S.k]; }
    function cmdLine() { q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">--' + (L === 'en' ? 'example' : 'ejemplo') + '</span> <b>' + esc(S.k) + '</b>' + (S.edited ? ' <span class="o">--' + (L === 'en' ? 'edited' : 'editado') + '</span>' : ''); }
    function save() { K6.store(store, JSON.stringify({ k: S.k, c: S.edited ? S.code : null })); }
    function setStatus(kind, html) { stEl.className = 'sl6-av-st' + (kind ? ' is-' + kind : ''); stEl.innerHTML = html || ''; }

    /* ---------- datos ---------- */
    function drawParams() {
      var e = ex(), box = q('.sl6-av-params');
      var ps = e.p.map(function (p, i) { var n = p[li], v = getParam(S.code, n, p[2]); return v == null ? '' : '<label class="sl6-av-pi' + (p[2] === 'list' ? ' is-list' : '') + '"><span>' + esc(n) + ' =</span>' + (p[2] === 'list' ? '<b aria-hidden="true">[</b>' : '') + '<input type="text" data-pi="' + i + '" value="' + esc(v) + '" spellcheck="false" autocomplete="off" inputmode="' + (p[2] === 'list' ? 'text' : 'numeric') + '">' + (p[2] === 'list' ? '<b aria-hidden="true">]</b>' : '') + '</label>'; }).join('');
      box.innerHTML = ps ? '<span class="sl6-lbl">' + esc(t.data) + '</span>' + ps + '<button type="button" class="sl6-btn" data-a="dice">' + ico('dice', 16) + '<span>' + esc(t.dice) + '</span></button><p class="sl6-av-warn" aria-live="polite"></p>' : '';
    }
    function sortedWarn() {
      var e = ex(), w = q('.sl6-av-warn'); if (!w) return;
      var msg = '';
      e.p.forEach(function (p) {
        var v = getParam(S.code, p[li], p[2]);
        if (p[2] === 'list' && v != null) { var a = parseList(v); if (!a) msg = t.badData; else if (e.s && a.some(function (x, i) { return i && a[i - 1] > x; })) msg = t.notSorted; }
      });
      w.textContent = msg;
    }
    var PT = null;
    q('.sl6-av-params').addEventListener('input', function (ev) {
      var inp = ev.target.closest('[data-pi]'); if (!inp) return;
      var p = ex().p[+inp.getAttribute('data-pi')], v = inp.value.trim();
      if (p[2] === 'list') { var a = parseList(v); if (!a) { q('.sl6-av-warn').textContent = t.badData; return; } v = a.join(', '); }
      else if (!/^-?\d+$/.test(v)) return;
      S.code = setParam(S.code, p[li], p[2], v); S.edited = S.code !== ex().py[li];
      sortedWarn(); clearTimeout(PT); PT = setTimeout(function () { exec(); }, 450);
    });

    /* ---------- código ---------- */
    function hl(line) {
      // resaltado mínimo de Python/Java: palabras clave, números, textos y comentarios
      var KW = /\b(def|return|if|elif|else|while|for|in|range|len|and|or|not|True|False|None|break|print|static|int|long|void|boolean|public|class|String|new|import|true|false)\b/g;
      var out = '', re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|#.*$|\/\/.*$|\b\d+(?:\.\d+)?\b)/g, last = 0, m;
      while ((m = re.exec(line))) {
        out += esc(line.slice(last, m.index)).replace(KW, '<i class="k">$1</i>');
        var c = m[0][0] === '#' || m[0][0] === '/' ? 'c' : /\d/.test(m[0][0]) ? 'n' : 's';
        out += '<i class="' + c + '">' + esc(m[0]) + '</i>'; last = re.lastIndex;
      }
      return out + esc(line.slice(last)).replace(KW, '<i class="k">$1</i>');
    }
    function drawCode() {
      var src = S.tab === 'java' ? ex().java[li] : S.code, lines = src.replace(/\s+$/, '').split('\n');
      codeEl.innerHTML = '<ol class="sl6-av-ol">' + lines.map(function (l, i) { return '<li data-ln="' + (i + 1) + '"><span class="sl6-av-n">' + (i + 1) + '</span><code>' + (hl(l) || ' ') + '</code></li>'; }).join('') + '</ol>';
      var jn = q('.sl6-av-jn');
      jn.hidden = S.tab !== 'java'; jn.textContent = S.edited ? t.javaNo : t.javaN;
      if (S.tab === 'java' && S.edited) codeEl.innerHTML = '';
      el.classList.toggle('is-java', S.tab === 'java');
    }
    function markLines(k) {
      [].forEach.call(codeEl.querySelectorAll('li.is-next,li.is-prev,li.is-err'), function (x) { x.classList.remove('is-next', 'is-prev', 'is-err'); });
      if (S.tab !== 'py' || !S.M || k < 0) return;
      var s = S.M.steps[k], p = k > 0 ? S.M.steps[k - 1] : null;
      var mk = function (l, c) { var x = codeEl.querySelector('li[data-ln="' + l + '"]'); if (x) { x.classList.add(c); return x; } };
      if (p && p.l && p.e !== 'end') mk(p.l, 'is-prev');
      var cur = s.e === 'err' ? mk(s.l, 'is-err') : s.e !== 'end' ? mk(s.l, 'is-next') : null;
      if (cur) { var box = codeEl, top = cur.offsetTop - box.offsetTop; if (top < box.scrollTop + 8 || top > box.scrollTop + box.clientHeight - 40) box.scrollTop = Math.max(0, top - box.clientHeight / 2); }
    }
    q('.sl6-av-tabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]'); if (!b) return;
      S.tab = b.getAttribute('data-tab'); [].forEach.call(q('.sl6-av-tabs').querySelectorAll('[data-tab]'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (S.mode === 'edit') setMode('view'); drawCode(); markLines(P.going ? P.k : -1);
    });
    function setMode(m) {
      S.mode = m; var ed = m === 'edit';
      ta.hidden = !ed; codeEl.hidden = ed; el.classList.toggle('is-editing', ed);
      var b = q('[data-a="edit"]'); b.innerHTML = ico(ed ? 'play' : 'pen', 15) + '<span>' + esc(ed ? t.runPy : t.edit) + '</span>';
      b.classList.toggle('sl6-btn--p', ed); b.classList.toggle('sl6-btn--g', !ed);
      if (ed) { if (S.tab !== 'py') { S.tab = 'py'; [].forEach.call(q('.sl6-av-tabs').querySelectorAll('[data-tab]'), function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-tab') === 'py')); }); } ta.value = S.code; ta.style.height = Math.max(220, codeEl.scrollHeight || 0) + 'px'; ta.focus(); }
    }
    ta.addEventListener('input', function () { S.dirty = true; setStatus('stale', esc(t.pending)); });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); var a = ta.selectionStart, b = ta.selectionEnd; ta.value = ta.value.slice(0, a) + '    ' + ta.value.slice(b); ta.selectionStart = ta.selectionEnd = a + 4; S.dirty = true; }
      else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); applyEdit(); }
    });
    function applyEdit() { S.code = ta.value; S.edited = S.code !== ex().py[li]; S.dirty = false; setMode('view'); drawParams(); sortedWarn(); exec(); }

    /* ---------- ejecutar ---------- */
    var RUN = 0;
    function exec() {
      var my = ++RUN; P.stop && P.stop();
      cmdLine(); save(); K6.keepHash(stateStr()); drawCode();
      el.classList.add('is-stale');
      setStatus('load', '<i class="sl6-rx-spin" aria-hidden="true"></i> ' + esc(A._ready ? t.running : t.load));
      A.run(S.code, MAXP, 8).then(function (x) {
        if (my !== RUN) return;
        A._ready = true; el.classList.remove('is-stale');
        if (x.stopped) return;
        if (!x.r) { setStatus('bad', esc(x.timeout ? t.timeout : x.fail ? t.fail : fill(t.crash, { m: x.crash || '' }))); return; }
        S.M = model(x.r);
        // qué variable indexa qué lista en el código (lista[i], izq[i + 1]…)
        S.sub = {}; var re = /([A-Za-z_]\w*)\s*\[\s*([A-Za-z_]\w*)/g, mm; while ((mm = re.exec(S.code))) { (S.sub[mm[2]] = S.sub[mm[2]] || {})[mm[1]] = 1; }
        setStatus(x.r.cut ? 'stale' : '', x.r.cut ? esc(fill(t.cut, { n: MAXP })) : '');
        S.M.hasL = S.M.lists.some(function (x) { return Object.keys(x).length; });
        q('.sl6-av-memp').hidden = !S.M.hasL;
        drawTreeBase(); P.reset();
      });
    }

    /* ---------- dibujar un paso ---------- */
    function frameVars(fr) { var o = {}; fr.v.forEach(function (v) { o[v[0]] = v[1]; }); return o; }
    function listName(k, lid) {
      // nombre de la lista lid en el paso k: primero en la llamada de arriba, luego en el programa principal
      var st = S.M.steps[k].s;
      for (var i = st.length - 1; i >= 0; i--) for (var j = 0; j < st[i].v.length; j++) { var v = st[i].v[j]; if (v[1] && v[1].L === lid) return v[0]; }
      return '#' + lid;
    }
    function where(k, eid, val) {
      // «lista[3] (9)» si el elemento está en alguna lista visible; si no, su valor
      if (eid != null && k >= 0) {
        var Ls = S.M.lists[k], st = S.M.steps[k].s, order = [];
        for (var i = st.length - 1; i >= 0; i--) st[i].v.forEach(function (v) { if (v[1] && v[1].L && order.indexOf(v[1].L) < 0) order.push(v[1].L); });
        for (var a = 0; a < order.length; a++) { var c = Ls[order[a]] || []; for (var b = 0; b < c.length; b++) if (c[b][0] === eid) return listName(k, order[a]) + '[' + b + '] = ' + val; }
      }
      return val;
    }
    function callLabel(n) { return n.f + '(' + n.a.map(function (a) { return a[0] + '=' + a[1]; }).join(', ') + ')'; }
    function message(k) {
      if (k < 0) return esc(t.start);
      var M = S.M, s = M.steps[k];
      if (s.e === 'call') { var n = M.calls[s.n]; return fill(esc(t.call), { c: '<code>' + esc(callLabel(n)) + '</code>' }) + esc(fill(t.callD, { d: s.s.filter(function (f) { return f.f; }).length })); }
      var parts = [];
      (s.k || []).forEach(function (c) { parts.push(fill(esc(t.cmp), { a: '<code>' + esc(where(k - 1, c[0], c[3])) + '</code>', s: '<b>' + esc(c[2]) + '</b>', b: '<code>' + esc(where(k - 1, c[1], c[4])) + '</code>', r: '<b class="' + (c[5] ? 'is-t' : 'is-f') + '">' + (c[5] ? 'True' : 'False') + '</b>' })); });
      var w = M.wr[k], Ls = M.lists[k], P0 = k > 0 ? M.lists[k - 1] : {};
      if (w.length === 2 && w[0].l === w[1].l && !w[0].add && !w[1].add && P0[w[0].l] && P0[w[0].l][w[0].i][0] === Ls[w[1].l][w[1].i][0] && P0[w[1].l][w[1].i][0] === Ls[w[0].l][w[0].i][0]) {
        var nm = listName(k, w[0].l); parts.push(fill(esc(t.sw), { a: '<code>' + esc(nm + '[' + w[0].i + ']') + '</code>', b: '<code>' + esc(nm + '[' + w[1].i + ']') + '</code>' }));
      } else w.forEach(function (x) {
        var nm = listName(k, x.l), v = Ls[x.l][x.i][1];
        parts.push(x.add && x.i === Ls[x.l].length - 1 ? fill(esc(t.ap), { v: '<code>' + esc(v) + '</code>', a: '<code>' + esc(nm) + '</code>' }) : fill(esc(t.wr), { a: '<code>' + esc(nm + '[' + x.i + ']') + '</code>', v: '<code>' + esc(v) + '</code>' }));
      });
      if (k > 0 && (s.e === 'line' || s.e === 'ret' || s.e === 'end')) {
        // variables que acaban de cambiar en la misma llamada
        var pt = M.steps[k - 1].s, ct = s.s, a0 = pt[pt.length - 1], a1 = ct[ct.length - 1];
        if (s.e === 'end') { a0 = pt[0]; a1 = ct[0]; }
        if (a0 && a1 && a0.n === a1.n && a0.f === a1.f) {
          var old = frameVars(a0);
          a1.v.forEach(function (v) { if (typeof v[1] === 'string' && old[v[0]] !== v[1]) parts.push('<code>' + esc(v[0] + ' = ' + v[1]) + '</code>'); });
        }
      }
      if (parts.length > 4) { var extra = parts.length - 4; parts = parts.slice(0, 4); parts.push(esc(fill(t.more, { n: extra }))); }
      if (s.e === 'ret') { var nr = M.calls[s.n]; parts.push(fill(esc(t.ret), { c: '<code>' + esc(callLabel(nr)) + '</code>', r: '<code>' + esc(s.r) + '</code>' })); }
      else if (s.e === 'end') parts.push(esc(t.end));
      else if (s.e === 'err') parts.push('<span class="is-bad">' + esc(fill(t.errL, { t: M.err.t, l: M.err.l })) + '</span>');
      else parts.push(esc(fill(k === 0 ? t.first : t.line, { l: s.l })));
      return parts.join(' ');
    }
    function chips(k) {
      var M = S.M, n = M.steps.length, kk = Math.max(k, 0), calls = M.calls.filter(function (c) { return c.s <= kk; }).length;
      var d = k < 0 ? 0 : M.steps[k].s.filter(function (f) { return f.f; }).length;
      var c = function (lab, v, cls) { return '<span class="sl6-av-chip' + (cls ? ' ' + cls : '') + '"><b>' + v + '</b>' + esc(lab) + '</span>'; };
      q('.sl6-av-chips').innerHTML = c(t.cmpL, k < 0 ? 0 : M.ccum[k], 'is-c') + c(t.wrL, k < 0 ? 0 : M.wcum[k], 'is-w') + (M.calls.length ? c(t.callsL, k < 0 ? 0 : calls) + c(t.depthL, d + ' / ' + M.md[n - 1]) : '');
    }
    function bars(k, lid, title, fr) {
      var M = S.M, c = M.lists[k][lid] || [], cmpE = {}, wr = {}, s = M.steps[k];
      (s.k || []).forEach(function (x) { if (x[0] != null) cmpE[x[0]] = 1; if (x[1] != null) cmpE[x[1]] = 1; });
      M.wr[k].forEach(function (x) { if (x.l === lid) wr[x.i] = 1; });
      // punteros: variables enteras con nombre de índice de la misma llamada
      var ptr = {}, vars = fr ? frameVars(fr) : {}, lo = null, hi = null;
      var lname = null; Object.keys(vars).forEach(function (n) { if (vars[n] && vars[n].L === lid) lname = n; });
      Object.keys(vars).forEach(function (n) {
        var v = vars[n]; if (!(typeof v === 'string' && IDX.test(n) && /^-?\d+$/.test(v))) return;
        var on = S.sub[n]; if (on && lname && !on[lname]) return;   // i indexa izq y j indexa der: cada uno bajo la suya
        var i = +v; if (i >= 0 && i <= c.length) (ptr[i] = ptr[i] || []).push(n);
      });
      PAIRS.forEach(function (p) { if (typeof vars[p[0]] === 'string' && typeof vars[p[1]] === 'string' && /^-?\d+$/.test(vars[p[0]]) && /^-?\d+$/.test(vars[p[1]])) { lo = +vars[p[0]]; hi = +vars[p[1]]; } });
      var span = M.vmax - Math.min(0, M.vmin) || 1;
      var cols = c.map(function (e, i) {
        var v = parseFloat(e[1]), h = isNaN(v) ? 40 : Math.max(4, 100 * (v - Math.min(0, M.vmin)) / span);
        var cl = 'sl6-av-col' + (e[0] != null && cmpE[e[0]] ? ' is-c' : '') + (wr[i] ? ' is-w' : '') + (lo != null && (i < lo || i > hi) ? ' is-o' : '') + (isNaN(v) ? ' is-txt' : '');
        return '<div class="' + cl + '"><span class="sl6-av-v">' + esc(e[1].length > 6 ? e[1].slice(0, 5) + '…' : e[1]) + '</span><span class="sl6-av-bar"><i style="height:' + h.toFixed(1) + '%"></i></span><span class="sl6-av-i">' + (e[1] === '…' ? '' : i) + '</span><span class="sl6-av-p">' + (ptr[i] || []).map(function (n) { return '<em>' + esc(n) + '</em>'; }).join('') + '</span></div>';
      }).join('');
      var after = ptr[c.length] ? '<div class="sl6-av-col is-ghost"><span class="sl6-av-v"></span><span class="sl6-av-bar"></span><span class="sl6-av-i">' + c.length + '</span><span class="sl6-av-p">' + ptr[c.length].map(function (n) { return '<em>' + esc(n) + '</em>'; }).join('') + '</span></div>' : '';
      return '<div class="sl6-av-row"><p class="sl6-av-rn">' + title + ' <span class="sl6-av-len">len = ' + c.length + '</span></p>' + (c.length || after ? '<div class="sl6-av-cols" style="--n:' + Math.max(c.length + (after ? 1 : 0), 4) + '">' + cols + after + '</div>' : '<p class="sl6-av-empty">' + esc(t.empty) + '</p>') + '</div>';
    }
    function drawMem(k) {
      var box = q('.sl6-av-mem'), M = S.M;
      if (k < 0) k = 0;
      var st = M.steps[k].s, top = st[st.length - 1], glob = st[0], rows = [], seen = {};
      var add = function (fr, isG) {
        fr.v.forEach(function (v) {
          if (!v[1] || !v[1].L) return;
          var lid = v[1].L;
          if (seen[lid]) { if (seen[lid] !== v[0]) rows.forEach(function (r) { if (r.lid === lid && r.alias.indexOf(v[0]) < 0) r.alias.push(v[0]); }); return; }
          seen[lid] = v[0]; rows.push({ lid: lid, n: v[0], g: isG && fr !== top, fr: fr, alias: [] });
        });
      };
      if (top) add(top, top === glob); if (glob && glob !== top) add(glob, true);
      if (!rows.length) { box.innerHTML = '<p class="sl6-av-empty">' + esc(t.none) + '</p>'; return; }
      box.classList.toggle('is-many', rows.length > 2);
      box.innerHTML = rows.slice(0, 5).map(function (r) {
        var title = '<code>' + esc(r.n) + '</code>' + (r.g ? ' <span class="sl6-av-g">' + esc(t.global) + '</span>' : '') + (r.alias.length ? ' <span class="sl6-av-g">' + esc(fill(t.same, { n: r.alias.join(', ') })) + '</span>' : '');
        return bars(k, r.lid, title, r.fr);
      }).join('');
    }
    function vstr(k, v) { if (v && v.L) { var c = S.M.lists[k][v.L] || []; var s = '[' + c.slice(0, 8).map(function (e) { return e[1]; }).join(', ') + (c.length > 8 ? ', …' : '') + ']'; return s; } return v; }
    function drawStack(k) {
      var box = q('.sl6-av-stack'), M = S.M; if (k < 0) k = 0;
      var st = M.steps[k].s.slice().reverse();
      if (st.length > 12) st = st.slice(0, 10).concat([{ dots: st.length - 12 }]).concat(st.slice(-2));
      box.innerHTML = st.map(function (fr, i) {
        if (fr.dots) return '<div class="sl6-av-fr is-dots">… ' + fr.dots + ' …</div>';
        var hd = fr.f ? esc(fr.f) + '(' + (fr.n != null ? esc(M.calls[fr.n].a.map(function (a) { return a[0]; }).join(', ')) : '') + ')' : esc(t.main);
        var vs = fr.v.map(function (v) { return '<li><code>' + esc(v[0]) + '</code> = <span>' + esc(vstr(k, v[1])) + '</span></li>'; }).join('');
        return '<div class="sl6-av-fr' + (i === 0 ? ' is-top' : '') + '"><p class="sl6-av-frh">' + hd + '</p>' + (vs ? '<ul>' + vs + '</ul>' : '') + '</div>';
      }).join('');
    }
    function drawOut(k) {
      var M = S.M, s = k < 0 ? null : M.steps[k], o = s ? M.out.slice(0, s.o) : '';
      q('.sl6-av-out').textContent = o || ' ';
      var eb = q('.sl6-av-err');
      if (s && s.e === 'err') {
        eb.hidden = false; var e = M.err, h = t.errHelp[e.t] || '';
        eb.innerHTML = '<p class="sl6-rx-eh">' + esc(fill(t.errL, { t: e.t === 'SinEntrada' ? 'input()' : e.t, l: e.l })) + '</p><pre class="sl6-rx-emsg">' + esc(e.t === 'SinEntrada' ? '' : e.t + ': ' + e.m) + '</pre>' + (h ? '<p class="sl6-rx-ep">' + esc(h) + '</p>' : '');
      } else eb.hidden = true;
    }
    /* árbol de llamadas (SVG); las posiciones se calculan una vez, con todas las llamadas */
    function drawTreeBase() {
      var M = S.M, box = q('.sl6-av-tree'), pan = q('.sl6-av-treep');
      pan.hidden = !M.recur; if (!M.recur) { box.innerHTML = ''; return; }
      var e = '', n = '';
      M.calls.forEach(function (c) {
        var y = c.d * 62 + 6;
        if (c.p != null) { var p = M.calls[c.p]; e += '<path data-e="' + c.i + '" d="M' + p.x.toFixed(1) + ' ' + (p.d * 62 + 46) + ' C' + p.x.toFixed(1) + ' ' + (y - 8) + ' ' + c.x.toFixed(1) + ' ' + (p.d * 62 + 54) + ' ' + c.x.toFixed(1) + ' ' + y + '"/>'; }
        n += '<g data-n="' + c.i + '" transform="translate(' + (c.x - c.w / 2).toFixed(1) + ' ' + y + ')"><rect width="' + c.w.toFixed(1) + '" height="40" rx="9"/><text x="' + (c.w / 2).toFixed(1) + '" y="16">' + esc(c.lab) + '</text><text class="r" x="' + (c.w / 2).toFixed(1) + '" y="32">' + esc(c.rr) + '</text></g>';
      });
      box.innerHTML = '<svg class="sl6-av-svg" width="' + Math.ceil(M.tw) + '" height="' + M.th + '" viewBox="0 0 ' + Math.ceil(M.tw) + ' ' + M.th + '" role="img" aria-label="' + esc(t.tree) + '"><g class="e">' + e + '</g>' + n + '</svg>';
    }
    function drawTree(k) {
      var M = S.M; if (!M.recur) return;
      var box = q('.sl6-av-tree'), kk = Math.max(k, 0), s = M.steps[kk], act = {}, curN = null, seen = 0, done = 0;
      s.s.forEach(function (f) { if (f.n != null) { act[f.n] = 1; curN = f.n; } });
      if (s.e === 'ret') curN = s.n;
      M.calls.forEach(function (c) {
        var g = box.querySelector('[data-n="' + c.i + '"]'), ed = box.querySelector('[data-e="' + c.i + '"]');
        var vis = k >= 0 && c.s <= kk, fin = vis && c.e != null && c.e <= kk;
        if (vis) seen++; if (fin) done++;
        g.setAttribute('class', !vis ? 'is-h' : c.i === curN ? 'is-cur' : act[c.i] ? 'is-act' : fin ? 'is-done' : 'is-act');
        g.querySelector('.r').style.visibility = fin || (s.e === 'ret' && s.n === c.i) ? 'visible' : 'hidden';
        if (ed) ed.setAttribute('class', vis ? '' : 'is-h');
      });
      q('.sl6-av-tc').textContent = ' · ' + seen + ' / ' + M.calls.length;
      if (curN != null) { var cn = M.calls[curN], want = cn.x - box.clientWidth / 2; if (Math.abs(box.scrollLeft - want) > box.clientWidth / 3) box.scrollLeft = Math.max(0, want); }
    }
    K.N = function () { return S.M ? S.M.steps.length : 0; };
    K.draw = function (k) {
      if (!S.M) return;
      q('.sl6-av-msg').innerHTML = message(k);
      chips(k); drawMem(k); drawStack(k); drawOut(k); drawTree(k); markLines(k);
    };
    K.onTheme = function () {};

    /* ---------- eventos ---------- */
    sel.value = S.k;
    sel.addEventListener('change', function () { S.k = sel.value; S.code = ex().py[li]; S.edited = false; if (S.mode === 'edit') setMode('view'); drawParams(); sortedWarn(); exec(); });
    function stateStr() { return btoa(unescape(encodeURIComponent(JSON.stringify({ k: S.k, c: S.code })))); }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b || !el.contains(b)) return;
      var a = b.getAttribute('data-a');
      if (a === 'theme') K6.toggleTheme(K);
      else if (a === 'share') K6.share(K, b, stateStr());
      else if (a === 'edit') { if (S.mode === 'edit') applyEdit(); else setMode('edit'); }
      else if (a === 'dice') {
        var o = randomParams(ex()); ex().p.forEach(function (p, i) { if (o[i] != null && getParam(S.code, p[li], p[2]) != null) S.code = setParam(S.code, p[li], p[2], o[i]); });
        S.edited = S.code !== ex().py[li]; drawParams(); sortedWarn(); exec();
      }
    });

    /* ---------- reto ---------- */
    var RT = { r: null, v: '', busy: false };
    function retoNew() {
      var r = RETOS[rnd(0, RETOS.length - 1)];
      if (RT.r && RETOS.length > 1) while (r.k === RT.r.k) r = RETOS[rnd(0, RETOS.length - 1)];
      var e = byK[r.k], code = e.py[li], o = randomParams(e), d = [];
      e.p.forEach(function (p, i) { if (o[i] != null) { code = setParam(code, p[li], p[2], o[i]); d.push(p[li] + ' = ' + (p[2] === 'list' ? '[' + o[i] + ']' : o[i])); } });
      RT.r = { def: r, code: code, d: d.join(L === 'en' ? ' and ' : ' y '), ans: null }; RT.v = '';
      retoDraw(); var my = RT.r;
      RT.busy = true;
      A.run(code, MAXP, 8).then(function (x) {
        if (RT.r !== my) return; RT.busy = false;
        if (!x.r || x.r.err) { retoDraw(); return; }
        var rr = x.r, f = r.f[li], ans;
        if (r.kind === 'cmp') ans = String(rr.steps.reduce(function (s, st) { return s + (st.k || []).length; }, 0));
        else if (r.kind === 'calls') ans = String(rr.calls.filter(function (c) { return c.f === f; }).length);
        else {
          var M = model(rr), vn = r.v[li];
          for (var k = 0; k < M.steps.length; k++) {
            var top = M.steps[k].s[M.steps[k].s.length - 1], v = top && frameVars(top);
            if (v && v[vn] === '1') { var lid = v[li ? 'items' : 'lista'] && v[li ? 'items' : 'lista'].L; ans = (M.lists[k][lid] || []).map(function (e) { return e[1]; }).join(', '); break; }
          }
          if (ans == null) { var last = M.steps[M.steps.length - 1], gl = frameVars(last.s[0]), lid2 = gl[byK[r.k].p[0][li]].L; ans = (M.lists[M.steps.length - 1][lid2] || []).map(function (e) { return e[1]; }).join(', '); }
        }
        my.ans = ans; retoDraw();
      });
    }
    function retoDraw() {
      var box = q('.sl6-reto'), r = RT.r; if (!r) return;
      var qtxt = fill(t.rq[r.def.kind], { d: r.d, f: r.def.f[li] });
      box.innerHTML = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-rd-q">' + esc(qtxt) + '</p>'
        + '<pre class="sl6-av-rcode">' + esc(r.code.replace(/\s+$/, '')) + '</pre>'
        + '<label class="sl6-lbl" for="' + K.id + '-rt">' + esc(t.retoIn) + '</label><input type="text" id="' + K.id + '-rt" class="sl6-av-rin" spellcheck="false" autocomplete="off" inputmode="' + (r.def.kind === 'pass' ? 'text' : 'numeric') + '">'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-rr="check"' + (r.ans == null ? ' disabled' : '') + '>' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-rr="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-rr="hint">' + ico('book', 16) + esc(t.hint) + '</button></div><p class="sl6-reto__msg" aria-live="polite">' + (r.ans == null ? '<i class="sl6-rx-spin" aria-hidden="true"></i> ' + esc(t.retoLoad) : '') + '</p>';
      var inp = q('.sl6-av-rin'); inp.value = RT.v; inp.addEventListener('input', function () { RT.v = inp.value; });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') retoCheck(); });
    }
    function norm(s) { return s.replace(/[\[\]\s]/g, '').replace(/;/g, ','); }
    function retoCheck() {
      var r = RT.r, msg = q('.sl6-reto__msg'); if (!r || r.ans == null || !RT.v.trim()) return;
      var good = norm(RT.v) === norm(r.ans);
      msg.className = 'sl6-reto__msg ' + (good ? 'is-ok' : 'is-bad');
      msg.innerHTML = esc(good ? t.allOk : t.bad) + ' <button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 15) + esc(t.solL) + '</button>';
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rr]'); if (!b) return;
      var a = b.getAttribute('data-rr'), r = RT.r;
      if (a === 'check') retoCheck();
      else if (a === 'new') retoNew();
      else if (a === 'hint') { var m = q('.sl6-reto__msg'); m.className = 'sl6-reto__msg'; m.innerHTML = esc(t.rh[r.def.kind]) + (r.ans != null ? ' <button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 15) + esc(t.solL) + '</button>' : ''); }
      else if (a === 'sol') {
        var m2 = q('.sl6-reto__msg'); if (r.ans != null && m2.textContent.indexOf(r.ans) < 0) m2.insertAdjacentHTML('beforeend', ' <span class="sl6-rx-sol">' + esc(fill(t.ansIs, { a: r.ans })) + '</span>');
        S.k = r.def.k; S.code = r.code; S.edited = S.code !== ex().py[li]; sel.value = S.k; if (S.mode === 'edit') setMode('view');
        drawParams(); sortedWarn(); exec();
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });

    drawParams(); sortedWarn(); cmdLine(); drawCode(); exec(); retoNew();
  }
  K6.boot('.sl-sim[data-sim="algoritmos"]', mount);
})();
