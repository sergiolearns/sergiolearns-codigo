/* SergioLearns — motor del simulador de planificación de CPU (FCFS, SJF, SRTF y RR).
 * Tiempo discreto (enteros), un núcleo, cambio de contexto = 0.
 * Criterios (los mismos de la teoría de IC2 en la web):
 *  - Empates: primero el que llegó antes y, si llegan a la vez, el que va antes en la tabla.
 *  - SJF (no expulsivo): cuando la CPU queda libre entra la ráfaga más corta de la cola.
 *  - SRTF: al llegar un proceso solo expulsa si su ráfaga es ESTRICTAMENTE menor que lo que le queda al de la CPU.
 *  - RR: cola FIFO; si en el mismo instante llega un proceso y otro agota su cuanto, el recién llegado va antes.
 *    Si el cuanto se agota y la cola está vacía, el mismo proceso sigue con un cuanto nuevo (otro bloque en el Gantt).
 * planifica(procs, alg, q) → { slices:[{p,s,e}], steps:[…], res:[…], T, avg }
 *   procs: [{n:'gcc', a:1, b:4}]   alg: 'fcfs'|'sjf'|'srtf'|'rr'   q: cuanto (RR)
 */
(function (root) {
  function planifica(procs, alg, q) {
    q = Math.max(1, q | 0);
    var N = procs.length, P = procs.map(function (p, i) { return { i: i, n: p.n, a: p.a | 0, b: p.b | 0, r: p.b | 0, st: -1, fin: -1 }; });
    var order = P.slice().sort(function (x, y) { return x.a - y.a || x.i - y.i; });
    var ready = [], run = null, used = 0, t = 0, done = 0, slices = [], steps = [], cur = null, idleFrom = -1;
    var better = function (x, y) {   // ¿x va antes que y? (SJF por ráfaga, SRTF por lo que le queda)
      var kx = alg === 'sjf' ? x.b : x.r, ky = alg === 'sjf' ? y.b : y.r;
      return kx !== ky ? kx < ky : (x.a !== y.a ? x.a < y.a : x.i < y.i);
    };
    var pickBest = function () { var k = 0; for (var j = 1; j < ready.length; j++) if (better(ready[j], ready[k])) k = j; return ready.splice(k, 1)[0]; };
    var guard = 0;
    while (done < N && guard++ < 100000) {
      var ev = [], arr = [];
      order.forEach(function (p) { if (p.a === t) arr.push(p); });
      // 1. ¿termina o agota el cuanto el que estaba en la CPU?
      var expired = null;
      if (run && run.r === 0) {
        run.fin = t; done++;
        ev.push({ k: 'fin', p: run.i, fin: t, ret: t - run.a, esp: t - run.a - run.b });
        run = null;
      } else if (run && alg === 'rr' && used === q) {
        expired = run;
      }
      // 2. llegadas (en RR, antes que el que vuelve de agotar su cuanto)
      arr.forEach(function (p) { ready.push(p); ev.push({ k: 'arr', p: p.i, b: p.b }); });
      if (expired) {
        if (ready.length) {
          ready.push(expired); run = null;
          ev.push({ k: 'quantum', p: expired.i, r: expired.r, tie: arr.length > 0, arrived: arr.map(function (p) { return p.i; }) });
        } else {
          used = 0; ev.push({ k: 'again', p: expired.i, r: expired.r });
          slices.push(cur = { p: expired.i, s: t, e: t });
        }
      }
      // 3. SRTF: ¿algún recién llegado expulsa al de la CPU?
      if (run && alg === 'srtf' && arr.length) {
        var best = null;
        arr.forEach(function (p) { if (!best || better(p, best)) best = p; });
        if (best.r < run.r) {
          ev.push({ k: 'preempt', p: best.i, q: run.i, b: best.r, r: run.r });
          ready.push(run); run = null;
        } else {
          arr.forEach(function (p) { ev.push({ k: 'nopreempt', p: p.i, q: run.i, b: p.r, r: run.r }); });
        }
      }
      // 4. si la CPU está libre, entra alguien
      if (!run && ready.length) {
        var nx = (alg === 'fcfs' || alg === 'rr') ? ready.shift() : pickBest();
        if (idleFrom >= 0) { ev.unshift({ k: 'idleEnd', from: idleFrom }); idleFrom = -1; }
        run = nx; used = 0;
        var first = nx.st < 0;
        if (first) nx.st = t;
        ev.push({ k: 'disp', p: nx.i, r: nx.r, b: nx.b, first: first, q: q });
        if (cur && cur.p === nx.i && cur.e === t && alg !== 'rr') { /* sigue el mismo bloque */ } else { slices.push(cur = { p: nx.i, s: t, e: t }); }
      } else if (!run && done < N && idleFrom < 0) {
        idleFrom = t;
        var nextA = Infinity; order.forEach(function (p) { if (p.a > t && p.a < nextA) nextA = p.a; });
        ev.push({ k: 'idle', until: nextA });
      }
      if (ev.length) steps.push({ t: t, ev: ev, run: run ? run.i : -1, ready: ready.map(function (p) { return p.i; }), rem: P.map(function (p) { return p.r; }) });
      if (done === N) break;
      // 5. avanza una unidad
      if (run) { run.r--; used++; cur.e = t + 1; }
      t++;
    }
    var res = P.map(function (p) { return { n: p.n, a: p.a, b: p.b, fin: p.fin, ret: p.fin - p.a, esp: p.fin - p.a - p.b, resp: p.st - p.a }; });
    var m = function (k) { return res.reduce(function (s, r) { return s + r[k]; }, 0) / N; };
    var idle = [];   // huecos sin nadie en la CPU
    var last = 0; slices.forEach(function (s) { if (s.s > last) idle.push({ s: last, e: s.s }); last = Math.max(last, s.e); });
    return { slices: slices, idle: idle, steps: steps, res: res, T: t, avg: { esp: m('esp'), ret: m('ret'), resp: m('resp') } };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = planifica; else root.SLPlanifica = planifica;
})(this);
