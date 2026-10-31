/* SergioLearns — simulador de planificación de CPU (interfaz). Necesita SLPlanifica (engine.js). Sin dependencias. */
(function () {
  'use strict';
  var COL = ['#5B4BDB', '#2F5FD0', '#FF6B4A', '#16794B', '#F5A524', '#D9651C', '#C2362B', '#A99EF5'];
  var INK = { '#F5A524': 1, '#A99EF5': 1 };   // sobre estos colores el texto va en tinta
  var ALGS = ['fcfs', 'sjf', 'srtf', 'rr'];
  var NOCHE = [['onedrive', 0, 8], ['gcc', 1, 4], ['campus', 2, 9], ['spotify', 3, 2]];
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$',
      cmd: 'planifica', alg: '--algoritmo', qf: '--quantum', file: 'procesos.txt', fileReto: 'reto.txt',
      light: 'Claro', dark: 'Oscuro', themeL: 'Cambiar a aspecto claro', themeD: 'Cambiar a aspecto oscuro',
      algL: 'Algoritmo', qL: 'Cuanto', ex: 'Ejemplo', rnd: 'Aleatorio', share: 'Compartir', copied: 'Enlace copiado', nocopy: 'Copia la dirección de la barra',
      algT: { fcfs: 'Primero en llegar, primero en ser servido (no expulsivo)', sjf: 'Primero el más corto (no expulsivo)', srtf: 'Primero el que menos tiempo le queda (expulsivo)', rr: 'Round Robin: turnos con un cuanto de tiempo (expulsivo)' },
      procs: 'procesos.txt', name: 'proceso', arr: 'llegada', burst: 'ráfaga', add: 'Añadir proceso', del: 'Quitar', max: 'Como mucho 8 procesos',
      gantt: 'diagrama de Gantt', cpu: 'CPU', idle: 'ociosa', legRun: 'en la CPU', legWait: 'esperando en la cola', legArr: 'llega',
      steps: 'paso a paso', reset: 'Reiniciar', back: 'Paso atrás', step: 'Paso', run: 'Ejecutar', pause: 'Pausa', speed: 'Velocidad',
      queue: 'cola de listos', empty: 'vacía', now: 'en t = ', start: 'Pulsa Paso para avanzar decisión a decisión, o Ejecutar para verlo entero.',
      results: 'resultados', fin: 'fin', ret: 'retorno', wait: 'espera', resp: 'respuesta', avg: 'media',
      formula: 'retorno = fin − llegada · espera = retorno − ráfaga · respuesta = primera vez en la CPU − llegada',
      compare: 'compara (los mismos procesos)', cmpWait: 'espera media', cmpRet: 'retorno medio',
      rules: 'Criterios: los empates se resuelven por orden de llegada (y, si llegan a la vez, por el orden de la tabla); SRTF solo expulsa si el que llega es estrictamente más corto; en Round Robin, si alguien llega justo cuando otro agota su cuanto, el recién llegado va antes en la cola. Tiempos en milisegundos y cambio de contexto despreciable.',
      gDesc: 'Diagrama de Gantt: ', gDescIdle: 'CPU ociosa de %s a %s',
      e: {
        arr: 'llega {p} (ráfaga {b})', fin: 'termina {p}: retorno {fin} − {a} = {ret}, espera {ret} − {b} = {esp}',
        quantum: '{p} agota su cuanto (le quedan {r}) y vuelve al final de la cola', tie: 'ha llegado {x} en el mismo instante: el recién llegado va antes',
        again: '{p} agota su cuanto, pero la cola está vacía: sigue con un cuanto nuevo',
        preempt: '{p} ({b}) < le quedan {r} a {q} → lo expulsa', nopre: '{p} ({b}) {cmp} le quedan {r} a {q} → no lo expulsa',
        fcfs: 'entra {p}: es el primero de la cola', sjf: 'entra {p}: la ráfaga más corta de la cola ({b})', srtf: 'entra {p}: el que menos tiempo le queda ({r})',
        rr: 'entra {p} con un cuanto de {q}', only: 'entra {p}: es el único en la cola', tieSel: 'empate con {x}: va antes el que llegó antes',
        idle: 'no hay nadie en la cola: la CPU queda ociosa hasta t = {u}', end: 'todos han terminado en t = {T}: espera media {e}, retorno medio {r}'
      },
      reto: 'Reto: calcula tú el Gantt', retoLead: 'Te doy unos procesos y un algoritmo. Dibuja el Gantt en papel, rellena las casillas y corrígelo. Acepta la coma decimal.',
      retoNew: 'Otro reto', check: 'Comprobar', sol: 'Ver la solución en el simulador', ok: 'bien', of: 'de', allOk: 'Todo bien. Así se hace en el examen.',
      someBad: 'Revisa las casillas en rojo: el error más común es olvidar restar la llegada.', mean: 'espera media', tryL: 'Ponte a prueba',
      gLabel: 'Gantt del simulador', tUnit: 'ms', proc: 'Proceso'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$',
      cmd: 'schedule', alg: '--algorithm', qf: '--quantum', file: 'processes.txt', fileReto: 'challenge.txt',
      light: 'Light', dark: 'Dark', themeL: 'Switch to light theme', themeD: 'Switch to dark theme',
      algL: 'Algorithm', qL: 'Quantum', ex: 'Example', rnd: 'Random', share: 'Share', copied: 'Link copied', nocopy: 'Copy the address bar',
      algT: { fcfs: 'First come, first served (non-preemptive)', sjf: 'Shortest job first (non-preemptive)', srtf: 'Shortest remaining time first (preemptive)', rr: 'Round Robin: turns with a time quantum (preemptive)' },
      procs: 'processes.txt', name: 'process', arr: 'arrival', burst: 'burst', add: 'Add process', del: 'Remove', max: '8 processes at most',
      gantt: 'Gantt chart', cpu: 'CPU', idle: 'idle', legRun: 'on the CPU', legWait: 'waiting in the queue', legArr: 'arrives',
      steps: 'step by step', reset: 'Reset', back: 'Step back', step: 'Step', run: 'Run', pause: 'Pause', speed: 'Speed',
      queue: 'ready queue', empty: 'empty', now: 'at t = ', start: 'Press Step to move decision by decision, or Run to watch it all.',
      results: 'results', fin: 'finish', ret: 'turnaround', wait: 'waiting', resp: 'response', avg: 'average',
      formula: 'turnaround = finish − arrival · waiting = turnaround − burst · response = first time on the CPU − arrival',
      compare: 'compare (same processes)', cmpWait: 'average waiting', cmpRet: 'average turnaround',
      rules: 'Rules: ties go to whoever arrived first (and, if they arrive together, to the one higher in the table); SRTF only preempts if the newcomer is strictly shorter; in Round Robin, if a process arrives just as another one uses up its quantum, the newcomer goes first in the queue. Times in milliseconds and context switches are negligible.',
      gDesc: 'Gantt chart: ', gDescIdle: 'CPU idle from %s to %s',
      e: {
        arr: '{p} arrives (burst {b})', fin: '{p} finishes: turnaround {fin} − {a} = {ret}, waiting {ret} − {b} = {esp}',
        quantum: '{p} uses up its quantum ({r} left) and goes back to the end of the queue', tie: '{x} arrived at the same instant: the newcomer goes first',
        again: '{p} uses up its quantum, but the queue is empty: it carries on with a new quantum',
        preempt: '{p} ({b}) < {q} has {r} left → it preempts', nopre: '{p} ({b}) {cmp} {q} has {r} left → no preemption',
        fcfs: '{p} gets the CPU: it is first in the queue', sjf: '{p} gets the CPU: shortest burst in the queue ({b})', srtf: '{p} gets the CPU: least time left ({r})',
        rr: '{p} gets the CPU with a quantum of {q}', only: '{p} gets the CPU: it is the only one in the queue', tieSel: 'tie with {x}: whoever arrived first goes first',
        idle: 'nobody in the queue: the CPU sits idle until t = {u}', end: 'everyone has finished at t = {T}: average waiting {e}, average turnaround {r}'
      },
      reto: 'Challenge: work out the Gantt yourself', retoLead: 'Here are some processes and an algorithm. Draw the Gantt chart on paper, fill in the boxes and check it.',
      retoNew: 'New challenge', check: 'Check', sol: 'See the solution in the simulator', ok: 'right', of: 'of', allOk: 'All correct. That is exactly how the exam goes.',
      someBad: 'Look at the boxes in red: the most common mistake is forgetting to subtract the arrival time.', mean: 'average waiting', tryL: 'Test yourself',
      gLabel: 'Simulator Gantt chart', tUnit: 'ms', proc: 'Process'
    }
  };
  var ICO = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
    reset: '<path d="M4 4v6h6"/><path d="M4.5 15a8 8 0 1 0 1.8-8.3L4 10"/>', back: '<path d="M15 6l-6 6 6 6"/>', step: '<path d="M9 6l6 6-6 6"/>',
    play: '<path d="M7 4.5l12 7.5-12 7.5z"/>', pause: '<path d="M8 5v14M16 5v14"/>', dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h.01M15 15h.01M15 9h.01M9 15h.01M12 12h.01"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>', file: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/>',
    exam: '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 8.5h6M9 12.5h6M9 16.5h3.5"/>', pen: '<path d="M5 19l1-4L15.5 5.5a2 2 0 0 1 3 3L9 18z"/><path d="M13.5 7.5l3 3"/>'
  };
  function ico(n, s) { return '<svg class="sl6-i" width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICO[n] || '') + '</svg>'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var uid = 0;

  function Sim(root) {
    var L = root.getAttribute('data-lang') === 'en' ? 'en' : 'es', T = TX[L], me = 'sl6g' + (++uid);
    var num = function (x) { var r = Math.round(x * 100) / 100, s = String(r); return L === 'es' ? s.replace('.', ',') : s; };
    var links = []; try { links = JSON.parse(root.getAttribute('data-links') || '[]'); } catch (e) {}
    var S = { alg: 'rr', q: 3, p: NOCHE.map(function (x) { return { n: x[0], a: x[1], b: x[2] }; }) };
    var R = null, t = 0, timer = null, speed = 2;

    // --- estado inicial: enlace compartido > lo último que usaste > ejemplo
    (function () {
      var h = location.hash.match(/^#sim=(.+)$/), src = h ? decodeURIComponent(h[1]) : store('sl_sim_planifica');
      if (!src) return;
      try {
        var o = {}; src.split(';').forEach(function (kv) { var i = kv.indexOf('='); o[kv.slice(0, i)] = kv.slice(i + 1); });
        var ps = (o.p || '').split(',').map(function (x) { var y = x.split('.'); return { n: clean(y[0]), a: clamp(+y[1], 0, 99), b: clamp(+y[2], 1, 99) }; }).filter(function (x) { return x.n; }).slice(0, 8);
        if (ps.length && ALGS.indexOf(o.a) >= 0) { S.alg = o.a; S.q = clamp(+o.q || 3, 1, 20); S.p = uniq(ps); }
      } catch (e) {}
    })();
    function clamp(v, a, b) { v = Math.round(+v); return isNaN(v) ? a : Math.max(a, Math.min(b, v)); }
    function clean(s) { return String(s || '').replace(/[^A-Za-z0-9_\-]/g, '').slice(0, 10); }
    function uniq(ps) { var seen = {}; return ps.map(function (p, i) { var n = p.n || ('P' + (i + 1)); while (seen[n]) n = n.slice(0, 8) + (i + 1); seen[n] = 1; p.n = n; return p; }); }
    function enc() { return 'a=' + S.alg + ';q=' + S.q + ';p=' + S.p.map(function (p) { return p.n + '.' + p.a + '.' + p.b; }).join(','); }

    // --- esqueleto
    var light = store('sl_entorno_tema') === 'claro';
    root.classList.add('sl6'); if (light) root.classList.add('is-light');
    root.innerHTML =
      '<div class="sl6-win">' +
      '<div class="sl6-bar"><span class="sl6-dot" aria-hidden="true"></span><span class="sl6-bar__t">' + esc(T.title) + '</span>' +
      '<button type="button" class="sl6-theme" data-a="theme"></button></div>' +
      '<div class="sl6-body">' +
      '<p class="sl6-cmd"><span class="sl6-ps">' + esc(T.ps) + '</span> <code class="sl6-cmdl"></code><i class="sl6-cur" aria-hidden="true">_</i></p>' +
      '<div class="sl6-ctl">' +
      '<div class="sl6-seg" role="group" aria-label="' + esc(T.algL) + '">' + ALGS.map(function (a) { return '<button type="button" data-alg="' + a + '" title="' + esc(T.algT[a]) + '">' + (a === 'rr' ? 'RR' : a.toUpperCase()) + '</button>'; }).join('') + '</div>' +
      '<div class="sl6-q"><span>' + esc(T.qL) + '</span><button type="button" data-a="q-" aria-label="−1">−</button><input type="number" min="1" max="20" inputmode="numeric" aria-label="' + esc(T.qL) + '"><button type="button" data-a="q+" aria-label="+1">+</button></div>' +
      '<div class="sl6-ctl__r"><button type="button" class="sl6-btn sl6-btn--g" data-a="ex">' + ico('file', 16) + esc(T.ex) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="rnd">' + ico('dice', 16) + esc(T.rnd) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(T.share) + '</span></button></div>' +
      '</div>' +
      '<p class="sl6-desc"></p>' +
      '<div class="sl6-top">' +
      '<section class="sl6-pan sl6-pan--procs"><h3 class="sl6-h">── ' + esc(T.procs) + '</h3><div class="sl6-tbl" role="table"></div><button type="button" class="sl6-add" data-a="add">' + ico('plus', 16) + esc(T.add) + '</button></section>' +
      '<section class="sl6-pan sl6-pan--step"><h3 class="sl6-h">── ' + esc(T.steps) + '</h3>' +
      '<div class="sl6-tools"><button type="button" class="sl6-ib" data-a="reset" aria-label="' + esc(T.reset) + '" title="' + esc(T.reset) + '">' + ico('reset', 17) + '</button><button type="button" class="sl6-ib" data-a="back" aria-label="' + esc(T.back) + '" title="' + esc(T.back) + '">' + ico('back', 17) + '</button>' +
      '<button type="button" class="sl6-btn" data-a="step">' + esc(T.step) + ico('step', 16) + '</button><button type="button" class="sl6-btn sl6-btn--p" data-a="run">' + ico('play', 14) + '<span>' + esc(T.run) + '</span></button>' +
      '<label class="sl6-speed"><span>' + esc(T.speed) + '</span><input type="range" min="1" max="4" step="1" value="2" aria-label="' + esc(T.speed) + '"></label><span class="sl6-clock"></span></div>' +
      '<div class="sl6-state"><p class="sl6-row"><span class="sl6-k">' + esc(T.cpu) + '</span><span class="sl6-cpu"></span></p><p class="sl6-row"><span class="sl6-k">' + esc(T.queue) + ' →</span><span class="sl6-queue"></span></p></div>' +
      '<ol class="sl6-log" aria-live="polite"></ol></section>' +
      '</div>' +
      '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(T.gantt) + '</h3><div class="sl6-gw"></div><p class="sl6-leg"><span><i class="sl6-sw sl6-sw--run"></i>' + esc(T.legRun) + '</span><span><i class="sl6-sw sl6-sw--wait"></i>' + esc(T.legWait) + '</span><span><i class="sl6-sw sl6-sw--arr"></i>' + esc(T.legArr) + '</span><span><i class="sl6-sw sl6-sw--idle"></i>' + esc(T.cpu + ' ' + T.idle) + '</span></p></section>' +
      '<div class="sl6-bot">' +
      '<section class="sl6-pan sl6-pan--res"><h3 class="sl6-h">── ' + esc(T.results) + '</h3><div class="sl6-res"></div><p class="sl6-note">' + esc(T.formula) + '</p></section>' +
      '<section class="sl6-pan sl6-pan--cmp"><h3 class="sl6-h">── ' + esc(T.compare) + '</h3><div class="sl6-cmp"></div></section>' +
      '</div>' +
      '<p class="sl6-rules">' + esc(T.rules) + '</p>' +
      '</div></div>' +
      '<div class="sl6-try"><h2 class="sl6-try__h" id="' + me + '-try">' + esc(T.tryL) + '</h2><div class="sl6-reto"></div>' +
      (links.length ? '<ul class="sl6-links">' + links.map(function (l) { return '<li><a href="' + esc(l.u) + '"><span class="sl6-links__i">' + ico(l.i || 'book', 20) + '</span><b>' + esc(l.t) + '</b><span>' + esc(l.d || '') + '</span><span class="sl6-links__go">' + ico('arrow', 16) + '</span></a></li>'; }).join('') + '</ul>' : '') +
      '</div>';
    var $ = function (s) { return root.querySelector(s); };
    var qIn = $('.sl6-q input'), tbl = $('.sl6-tbl'), gw = $('.sl6-gw'), logEl = $('.sl6-log');

    function themeBtn() {
      var b = $('.sl6-theme'), l = root.classList.contains('is-light');
      b.innerHTML = ico(l ? 'moon' : 'sun', 16) + '<span>' + esc(l ? T.dark : T.light) + '</span>';
      b.setAttribute('aria-label', l ? T.themeD : T.themeL);
    }
    themeBtn();

    // --- tabla de procesos
    function drawTable() {
      var h = '<div class="sl6-tr sl6-tr--h" role="row"><span role="columnheader"></span><span role="columnheader">' + esc(T.name) + '</span><span role="columnheader">' + esc(T.arr) + '</span><span role="columnheader">' + esc(T.burst) + '</span><span></span></div>';
      S.p.forEach(function (p, i) {
        h += '<div class="sl6-tr" role="row" data-i="' + i + '"><span class="sl6-chip" style="--c:' + COL[i] + '" aria-hidden="true"></span>' +
          '<input type="text" data-f="n" value="' + esc(p.n) + '" maxlength="10" spellcheck="false" aria-label="' + esc(T.name + ' ' + (i + 1)) + '">' +
          '<input type="number" data-f="a" value="' + p.a + '" min="0" max="99" inputmode="numeric" aria-label="' + esc(T.arr + ' ' + p.n) + '">' +
          '<input type="number" data-f="b" value="' + p.b + '" min="1" max="99" inputmode="numeric" aria-label="' + esc(T.burst + ' ' + p.n) + '">' +
          '<button type="button" class="sl6-ib sl6-del" data-a="del" aria-label="' + esc(T.del + ' ' + p.n) + '"' + (S.p.length < 2 ? ' disabled' : '') + '>' + ico('x', 15) + '</button></div>';
      });
      tbl.innerHTML = h;
      var add = $('.sl6-add'); add.disabled = S.p.length >= 8; add.title = S.p.length >= 8 ? T.max : '';
    }

    // --- cálculo y dibujo
    function compute(keepT) {
      R = SLPlanifica(S.p, S.alg, S.q);
      t = keepT ? Math.min(t, R.T) : 0;
      [].forEach.call(root.querySelectorAll('.sl6-seg button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-alg') === S.alg ? 'true' : 'false'); });
      $('.sl6-q').classList.toggle('is-off', S.alg !== 'rr'); qIn.value = S.q;
      $('.sl6-cmdl').innerHTML = esc(T.cmd) + ' <span class="o">' + T.alg + '</span> <b>' + S.alg + '</b>' + (S.alg === 'rr' ? ' <span class="o">' + T.qf + '</span> <b>' + S.q + '</b>' : '') + ' ' + esc(T.file);
      $('.sl6-desc').textContent = T.algT[S.alg] + '.';
      var st = enc(); store('sl_sim_planifica', st);
      try { if (location.hash.indexOf('#sim=') === 0) history.replaceState(null, '', '#sim=' + encodeURIComponent(st)); } catch (e) {}
      drawGantt(); drawCompare(); drawLog(true); update();
    }
    function X(v) { return G.left + v * G.u; }
    var G = {};
    function drawGantt() {
      var N = S.p.length, W = Math.max(280, gw.clientWidth || 600), mx = Math.max.apply(null, S.p.map(function (p) { return p.n.length; }).concat([5])), left = Math.min(W < 520 ? 92 : 112, Math.max(W < 520 ? 58 : 84, 24 + mx * 7.4));
      var u = Math.max(W < 520 ? 14 : 18, Math.floor((W - left - 18) / Math.max(1, R.T)));
      var w = left + u * R.T + 18, rowH = W < 520 ? 16 : 20, gap = 8, cpuY = 18, cpuH = 34, axY = cpuY + cpuH + 18, pY = axY + 22;
      var H = pY + N * (rowH + gap) + 6;
      G = { left: left, u: u, w: w, H: H };
      var s = '<svg class="sl6-g" width="' + w + '" height="' + H + '" viewBox="0 0 ' + w + ' ' + H + '" role="img" aria-labelledby="' + me + '-t ' + me + '-d"><title id="' + me + '-t">' + esc(T.gLabel) + '</title><desc id="' + me + '-d">' + esc(gdesc()) + '</desc><defs>';
      s += '<pattern id="' + me + '-idle" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" class="sl6-hat-bg"/><line x1="0" y1="0" x2="0" y2="7" class="sl6-hat-ln" stroke-width="2"/></pattern>';
      S.p.forEach(function (p, i) { s += '<pattern id="' + me + '-w' + i + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="' + COL[i] + '" fill-opacity=".14"/><line x1="0" y1="0" x2="0" y2="6" stroke="' + COL[i] + '" stroke-opacity=".55" stroke-width="1.6"/></pattern>'; });
      s += '<clipPath id="' + me + '-clip"><rect class="sl6-clip" x="0" y="0" width="' + X(0) + '" height="' + H + '"/></clipPath></defs>';
      // rejilla y eje
      var ticks = {}; ticks[0] = 1; R.slices.forEach(function (x) { ticks[x.s] = 1; ticks[x.e] = 1; }); R.idle.forEach(function (x) { ticks[x.s] = 1; ticks[x.e] = 1; });
      var tk = Object.keys(ticks).map(Number).sort(function (a, b) { return a - b; }), lastLab = -99;
      s += '<g class="sl6-grid">';
      tk.forEach(function (v) { s += '<line x1="' + X(v) + '" y1="' + cpuY + '" x2="' + X(v) + '" y2="' + (H - 4) + '"/>'; });
      s += '</g><text class="sl6-gl" x="' + (left - 12) + '" y="' + (cpuY + cpuH / 2 + 4.5) + '" text-anchor="end">' + esc(T.cpu) + '</text>';
      s += '<g class="sl6-ax">';
      tk.forEach(function (v) { if (X(v) - lastLab >= 15 || v === R.T) { s += '<text x="' + X(v) + '" y="' + (axY + 2) + '" text-anchor="middle">' + v + '</text>'; lastLab = X(v); } });
      s += '<text class="sl6-ax__u" x="' + (left - 12) + '" y="' + (axY + 2) + '" text-anchor="end">t (' + T.tUnit + ')</text></g>';
      // filas de procesos (etiquetas siempre visibles)
      S.p.forEach(function (p, i) { var y = pY + i * (rowH + gap); s += '<text class="sl6-gl sl6-gl--p" x="' + (left - 12) + '" y="' + (y + rowH / 2 + 4) + '" text-anchor="end">' + esc(p.n) + '</text><line class="sl6-base" x1="' + left + '" x2="' + (w - 18) + '" y1="' + (y + rowH / 2) + '" y2="' + (y + rowH / 2) + '"/>'; });
      s += '<g clip-path="url(#' + me + '-clip)">';
      R.idle.forEach(function (x) { s += '<rect x="' + X(x.s) + '" y="' + cpuY + '" width="' + (x.e - x.s) * u + '" height="' + cpuH + '" rx="3" fill="url(#' + me + '-idle)"/>' + ((x.e - x.s) * u > 44 ? '<text class="sl6-idlet" x="' + (X(x.s) + (x.e - x.s) * u / 2) + '" y="' + (cpuY + cpuH / 2 + 4) + '" text-anchor="middle">' + esc(T.idle) + '</text>' : ''); });
      R.slices.forEach(function (x) {
        var c = COL[x.p], bw = (x.e - x.s) * u, nm = S.p[x.p].n, lab = bw > nm.length * 7.6 + 10 ? nm : (bw > 13 ? nm.charAt(0) : '');
        s += '<rect class="sl6-bar" x="' + X(x.s) + '" y="' + cpuY + '" width="' + bw + '" height="' + cpuH + '" rx="3" fill="' + c + '"/>';
        if (lab) s += '<text class="sl6-bt' + (INK[c] ? ' is-ink' : '') + '" x="' + (X(x.s) + bw / 2) + '" y="' + (cpuY + cpuH / 2 + 4.5) + '" text-anchor="middle">' + esc(lab) + '</text>';
      });
      // por proceso: espera (rayado) y CPU (lleno)
      R.res.forEach(function (r, i) {
        var y = pY + i * (rowH + gap), mine = R.slices.filter(function (x) { return x.p === i; }), cur = r.a;
        mine.forEach(function (x) { if (x.s > cur) s += '<rect x="' + X(cur) + '" y="' + y + '" width="' + (x.s - cur) * u + '" height="' + rowH + '" rx="3" fill="url(#' + me + '-w' + i + ')"/>'; s += '<rect x="' + X(x.s) + '" y="' + y + '" width="' + (x.e - x.s) * u + '" height="' + rowH + '" rx="3" fill="' + COL[i] + '"/>'; cur = x.e; });
      });
      s += '</g>';
      // llegadas (siempre visibles: son datos)
      S.p.forEach(function (p, i) { var y = pY + i * (rowH + gap), x = X(p.a); s += '<path class="sl6-arr" d="M' + (x - 5) + ' ' + (y - 6) + 'h10l-5 6z" fill="' + COL[i] + '"/>'; });
      s += '<g class="sl6-now"><line x1="0" x2="0" y1="' + (cpuY - 10) + '" y2="' + (H - 2) + '"/><rect class="sl6-now__b" x="-17" y="0" width="34" height="15" rx="4"/><text x="0" y="11" text-anchor="middle"></text></g>';
      s += '</svg>';
      gw.innerHTML = s;
      gw.classList.toggle('is-wide', w > gw.clientWidth + 2);
    }
    function gdesc() {
      var parts = R.slices.map(function (x) { return S.p[x.p].n + ' ' + x.s + '-' + x.e; });
      R.idle.forEach(function (x) { parts.push(T.gDescIdle.replace('%s', x.s).replace('%s', x.e)); });
      return T.gDesc + parts.join(', ') + '. ' + T.cmpWait + ' ' + num(R.avg.esp) + ', ' + T.cmpRet + ' ' + num(R.avg.ret) + '.';
    }
    function drawCompare() {
      var rows = ALGS.map(function (a) { var o = SLPlanifica(S.p, a, S.q); return { a: a, e: o.avg.esp, r: o.avg.ret }; });
      var mx = Math.max.apply(null, rows.map(function (x) { return x.r; })) || 1, best = Math.min.apply(null, rows.map(function (x) { return x.e; }));
      var h = '<div class="sl6-cmp__h"><span></span><span>' + esc(T.cmpWait) + '</span><span>' + esc(T.cmpRet) + '</span></div>';
      rows.forEach(function (x) {
        h += '<button type="button" class="sl6-cmp__r' + (x.a === S.alg ? ' is-on' : '') + '" data-alg="' + x.a + '" aria-pressed="' + (x.a === S.alg) + '"><b>' + (x.a === 'rr' ? 'RR (' + S.q + ')' : x.a.toUpperCase()) + '</b>' +
          '<span class="sl6-cmp__b"><i style="width:' + Math.max(2, x.e / mx * 100) + '%"></i><em>' + num(x.e) + (Math.abs(x.e - best) < 1e-9 ? ' ' + ico('check', 13) : '') + '</em></span>' +
          '<span class="sl6-cmp__b sl6-cmp__b--r"><i style="width:' + Math.max(2, x.r / mx * 100) + '%"></i><em>' + num(x.r) + '</em></span></button>';
      });
      $('.sl6-cmp').innerHTML = h;
    }
    function evText(ev, st) {
      var E = T.e, n = function (i) { return '<b style="--c:' + COL[i] + '">' + esc(S.p[i].n) + '</b>'; }, out = [];
      ev.forEach(function (e) {
        var p = e.p != null ? S.p[e.p] : null;
        if (e.k === 'arr') out.push(fill(E.arr, { p: n(e.p), b: e.b }));
        else if (e.k === 'fin') out.push(fill(E.fin, { p: n(e.p), fin: e.fin, a: p.a, ret: e.ret, b: p.b, esp: e.esp }));
        else if (e.k === 'quantum') out.push(fill(E.quantum, { p: n(e.p), r: e.r }) + (e.tie ? '; ' + fill(E.tie, { x: e.arrived.map(n).join(', ') }) : ''));
        else if (e.k === 'again') out.push(fill(E.again, { p: n(e.p) }));
        else if (e.k === 'preempt') out.push(fill(E.preempt, { p: n(e.p), b: e.b, r: e.r, q: n(e.q) }));
        else if (e.k === 'nopreempt') out.push(fill(E.nopre, { p: n(e.p), b: e.b, r: e.r, q: n(e.q), cmp: e.b === e.r ? '=' : '>' }));
        else if (e.k === 'idle') out.push(fill(E.idle, { u: e.until }));
        else if (e.k === 'disp') {
          var others = st.ready, txt;
          if (!others.length && S.alg !== 'rr') txt = fill(E.only, { p: n(e.p) });
          else txt = fill(E[S.alg], { p: n(e.p), b: e.b, r: e.r, q: S.q });
          if (S.alg === 'sjf' || S.alg === 'srtf') {
            var key = function (i) { return S.alg === 'sjf' ? S.p[i].b : st.rem[i]; }, ties = others.filter(function (i) { return key(i) === key(e.p); });
            if (ties.length) txt += ' (' + fill(E.tieSel, { x: ties.map(n).join(', ') }) + ')';
          }
          out.push(txt);
        }
      });
      if (st.t === R.T) out.push(fill(E.end, { T: R.T, e: num(R.avg.esp), r: num(R.avg.ret) }));
      return out;
    }
    function drawLog() {
      var h = '';
      R.steps.forEach(function (st, k) { h += '<li data-k="' + k + '" hidden><span class="sl6-log__t">t = ' + st.t + '</span><span class="sl6-log__x">' + evText(st.ev, st).join('<br>') + '</span></li>'; });
      logEl.innerHTML = h + '<li class="sl6-log__0">' + esc(T.start) + '</li>';
    }
    function stepAt(tt) { var k = -1; R.steps.forEach(function (st, i) { if (st.t <= tt) k = i; }); return k; }
    function chip(i, r) { return '<span class="sl6-q__c" style="--c:' + COL[i] + '"><b>' + esc(S.p[i].n) + '</b>' + (r != null ? '<em>' + r + '</em>' : '') + '</span>'; }
    function update() {
      var k = stepAt(t), started = t > 0 || root.classList.contains('is-going');
      // Gantt hasta t
      var cx = X(t), clip = gw.querySelector('.sl6-clip'), now = gw.querySelector('.sl6-now');
      if (clip) clip.setAttribute('width', started ? cx : X(0));
      if (now) { now.setAttribute('transform', 'translate(' + cx + ',0)'); now.querySelector('text').textContent = 't=' + t; now.style.display = started ? '' : 'none'; }
      if (started && G.w > gw.clientWidth) { var sl = cx - gw.clientWidth / 2; if (Math.abs(gw.scrollLeft - sl) > 40) gw.scrollLeft = Math.max(0, sl); }
      // registro
      [].forEach.call(logEl.children, function (li) { var kk = li.getAttribute('data-k'); if (kk == null) { li.hidden = started; return; } kk = +kk; li.hidden = !started || kk > k; li.classList.toggle('is-cur', started && kk === k); });
      var cur = logEl.querySelector('.is-cur'); if (cur) logEl.scrollTop = cur.offsetTop - logEl.clientHeight + cur.offsetHeight + 8;
      // CPU y cola en la última decisión
      var st = started && k >= 0 ? R.steps[k] : null;
      $('.sl6-cpu').innerHTML = st ? (st.run >= 0 ? chip(st.run, st.rem[st.run]) : '<span class="sl6-q__e">' + esc(T.idle) + '</span>') : '<span class="sl6-q__e">—</span>';
      $('.sl6-queue').innerHTML = st ? (st.ready.length ? st.ready.map(function (i) { return chip(i, st.rem[i]); }).join('') : '<span class="sl6-q__e">' + esc(T.empty) + '</span>') : '<span class="sl6-q__e">—</span>';
      $('.sl6-clock').textContent = 't = ' + t + ' / ' + R.T;
      // resultados
      var h = '<table><thead><tr><th scope="col">' + esc(T.proc) + '</th><th scope="col">' + esc(T.arr) + '</th><th scope="col">' + esc(T.burst) + '</th><th scope="col">' + esc(T.fin) + '</th><th scope="col">' + esc(T.ret) + '</th><th scope="col">' + esc(T.wait) + '</th><th scope="col">' + esc(T.resp) + '</th></tr></thead><tbody>';
      var all = !started || t >= R.T;
      R.res.forEach(function (r, i) {
        var d = all || r.fin <= t;
        h += '<tr' + (d ? '' : ' class="is-pend"') + '><th scope="row"><span class="sl6-chip" style="--c:' + COL[i] + '"></span>' + esc(r.n) + '</th><td>' + r.a + '</td><td>' + r.b + '</td><td>' + (d ? r.fin : '·') + '</td><td>' + (d ? r.ret : '·') + '</td><td>' + (d ? r.esp : '·') + '</td><td>' + (d || (r.resp + r.a) <= t ? r.resp : '·') + '</td></tr>';
      });
      h += '</tbody><tfoot><tr><th scope="row">' + esc(T.avg) + '</th><td></td><td></td><td></td><td>' + (all ? num(R.avg.ret) : '·') + '</td><td>' + (all ? num(R.avg.esp) : '·') + '</td><td>' + (all ? num(R.avg.resp) : '·') + '</td></tr></tfoot></table>';
      $('.sl6-res').innerHTML = h;
      var bb = $('[data-a="back"]'), sb = $('[data-a="step"]'); bb.disabled = !started; sb.disabled = started && t >= R.T;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } var b = $('[data-a="run"]'); b.innerHTML = ico('play', 14) + '<span>' + esc(T.run) + '</span>'; root.classList.remove('is-running'); }
    function go(nt) { root.classList.add('is-going'); t = Math.max(0, Math.min(R.T, nt)); update(); }
    function next() { var nt = R.T; for (var i = 0; i < R.steps.length; i++) if (R.steps[i].t > t) { nt = R.steps[i].t; break; } if (!root.classList.contains('is-going')) nt = R.steps.length ? R.steps[0].t : 0; go(nt); }
    function prev() {
      var nt = -1; R.steps.forEach(function (st) { if (st.t < t) nt = st.t; });
      if (nt < 0) { reset(); return; }
      go(nt);
    }
    function run() {
      if (timer) { stop(); return; }
      if (t >= R.T) { t = 0; }
      root.classList.add('is-going', 'is-running');
      var b = $('[data-a="run"]'); b.innerHTML = ico('pause', 14) + '<span>' + esc(T.pause) + '</span>';
      update();
      timer = setInterval(function () { if (t >= R.T) { stop(); return; } go(t + 1); }, reduce ? 120 : [0, 900, 520, 280, 120][speed]);
    }
    function reset() { stop(); root.classList.remove('is-going'); t = 0; update(); }
    function changed(keep) { stop(); root.classList.remove('is-going'); compute(false); }

    // --- eventos
    root.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b || !root.contains(b)) return;
      var a = b.getAttribute('data-a'), alg = b.getAttribute('data-alg');
      if (alg && !b.closest('.sl6-reto')) { S.alg = alg; changed(); return; }
      if (a === 'theme') { root.classList.toggle('is-light'); store('sl_entorno_tema', root.classList.contains('is-light') ? 'claro' : 'oscuro'); themeBtn(); }
      else if (a === 'q-' || a === 'q+') { S.q = clamp(S.q + (a === 'q+' ? 1 : -1), 1, 20); changed(); }
      else if (a === 'ex') { S.p = NOCHE.map(function (x) { return { n: x[0], a: x[1], b: x[2] }; }); drawTable(); changed(); }
      else if (a === 'rnd') { S.p = rand(4 + Math.floor(Math.random() * 2)); drawTable(); changed(); }
      else if (a === 'share') {
        var u = location.href.split('#')[0] + '#sim=' + encodeURIComponent(enc()), sp = b.querySelector('span');
        try { history.replaceState(null, '', '#sim=' + encodeURIComponent(enc())); } catch (e) {}
        var done = function (m) { sp.textContent = m; setTimeout(function () { sp.textContent = T.share; }, 2200); };
        if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { done(T.copied); }, function () { done(T.nocopy); }); else done(T.nocopy);
      }
      else if (a === 'add') { if (S.p.length < 8) { var last = S.p[S.p.length - 1]; S.p.push({ n: 'P' + (S.p.length + 1), a: last ? last.a + 1 : 0, b: 3 }); S.p = uniq(S.p); drawTable(); changed(); var ins = tbl.querySelectorAll('input[data-f="n"]'); ins[ins.length - 1].focus(); } }
      else if (a === 'del') { if (S.p.length > 1) { S.p.splice(+b.closest('.sl6-tr').getAttribute('data-i'), 1); drawTable(); changed(); } }
      else if (a === 'step') { stop(); next(); }
      else if (a === 'back') { stop(); prev(); }
      else if (a === 'run') run();
      else if (a === 'reset') reset();
    });
    tbl.addEventListener('change', function (ev) {
      var i = ev.target.closest('.sl6-tr'); if (!i) return; i = +i.getAttribute('data-i'); var f = ev.target.getAttribute('data-f'), p = S.p[i];
      if (f === 'n') p.n = clean(ev.target.value) || ('P' + (i + 1)); else if (f === 'a') p.a = clamp(ev.target.value, 0, 99); else p.b = clamp(ev.target.value, 1, 99);
      S.p = uniq(S.p); drawTable(); changed();
    });
    qIn.addEventListener('change', function () { S.q = clamp(qIn.value, 1, 20); changed(); });
    $('.sl6-speed input').addEventListener('input', function (e) { speed = +e.target.value; if (timer) { clearInterval(timer); timer = null; run(); } });
    var rw; window.addEventListener('resize', function () { clearTimeout(rw); rw = setTimeout(function () { drawGantt(); update(); }, 150); });
    function rand(n) { var o = [], a = 0; for (var i = 0; i < n; i++) { o.push({ n: 'P' + (i + 1), a: a, b: 1 + Math.floor(Math.random() * 9) }); a += Math.floor(Math.random() * 4); } return o; }

    // --- reto
    var reto = $('.sl6-reto'), Z = null;
    function newReto() {
      var alg = ALGS[Math.floor(Math.random() * 4)], q = 2 + Math.floor(Math.random() * 3), ps = rand(4);
      Z = { alg: alg, q: q, p: ps, R: SLPlanifica(ps, alg, q) };
      var cmd = esc(T.cmd) + ' <span class="o">' + T.alg + '</span> <b>' + alg + '</b>' + (alg === 'rr' ? ' <span class="o">' + T.qf + '</span> <b>' + q + '</b>' : '') + ' ' + esc(T.fileReto);
      var h = '<h3 class="sl6-reto__h">' + esc(T.reto) + '</h3><p class="sl6-reto__lead">' + esc(T.retoLead) + '</p><p class="sl6-cmd sl6-cmd--s"><span class="sl6-ps">$</span> <code>' + cmd + '</code></p>';
      h += '<div class="sl6-reto__w"><table><thead><tr><th scope="col">' + esc(T.proc) + '</th><th scope="col">' + esc(T.arr) + '</th><th scope="col">' + esc(T.burst) + '</th><th scope="col">' + esc(T.fin) + '</th><th scope="col">' + esc(T.ret) + '</th><th scope="col">' + esc(T.wait) + '</th></tr></thead><tbody>';
      ps.forEach(function (p, i) { h += '<tr><th scope="row">' + p.n + '</th><td>' + p.a + '</td><td>' + p.b + '</td>' + ['fin', 'ret', 'esp'].map(function (k) { return '<td><input type="text" inputmode="decimal" data-i="' + i + '" data-k="' + k + '" aria-label="' + esc((k === 'fin' ? T.fin : k === 'ret' ? T.ret : T.wait) + ' ' + p.n) + '"></td>'; }).join('') + '</tr>'; });
      h += '</tbody><tfoot><tr><th scope="row" colspan="5">' + esc(T.mean) + '</th><td><input type="text" inputmode="decimal" data-k="avg" aria-label="' + esc(T.mean) + '"></td></tr></tfoot></table></div>';
      h += '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-r="check">' + ico('check', 16) + esc(T.check) + '</button><button type="button" class="sl6-btn" data-r="sol">' + esc(T.sol) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-r="new">' + ico('dice', 16) + esc(T.retoNew) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      reto.innerHTML = h;
    }
    reto.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return; var r = b.getAttribute('data-r');
      if (r === 'new') newReto();
      else if (r === 'check') {
        var ok = 0, tot = 0;
        [].forEach.call(reto.querySelectorAll('input'), function (inp) {
          var k = inp.getAttribute('data-k'), want = k === 'avg' ? Z.R.avg.esp : Z.R.res[+inp.getAttribute('data-i')][k];
          var v = parseFloat(String(inp.value).replace(',', '.')), good = inp.value.trim() !== '' && /^-?\d+([.,]\d+)?$/.test(inp.value.trim()) && Math.abs(v - want) < 0.01 + 1e-9;
          inp.classList.toggle('is-ok', good); inp.classList.toggle('is-bad', !good); tot++; if (good) ok++;
        });
        reto.querySelector('.sl6-reto__msg').innerHTML = '<b>' + ok + ' ' + esc(T.of) + ' ' + tot + ' ' + esc(T.ok) + '.</b> ' + esc(ok === tot ? T.allOk : T.someBad);
      } else if (r === 'sol') {
        S.alg = Z.alg; S.q = Z.q; S.p = Z.p.map(function (p) { return { n: p.n, a: p.a, b: p.b }; }); drawTable(); changed();
        root.querySelector('.sl6-win').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        setTimeout(run, reduce ? 0 : 500);
      }
    });

    drawTable(); compute(); newReto();
  }

  function boot() { [].forEach.call(document.querySelectorAll('.sl-sim[data-sim="planifica"]:not(.sl6)'), function (el) { try { Sim(el); } catch (e) { if (window.console) console.error('[sl6]', e); } }); }
  // el script va en el pie, después del simulador: se monta ya, antes de que «detalles visuales» busque lo que anima
  if (document.querySelector('.sl-sim[data-sim="planifica"]')) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
