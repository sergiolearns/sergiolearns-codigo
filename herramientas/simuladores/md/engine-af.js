/* SergioLearns — motor del simulador «Autómatas» de MD (19 nov 2026, tema 6a).
 * Autómatas finitos deterministas y no deterministas (con transiciones λ): leer una tabla escrita a mano, seguir una cadena
 * con el conjunto de estados activos, λ-cierres, construcción por subconjuntos (AFND → AFD), accesibles y de absorción,
 * de una expresión regular sencilla a un AFND (piezas de Kleene/Thompson) y la colocación de los estados para dibujarlos.
 * También funciona como módulo de Node (pruebas: test-af.js). */
(function (G) {
  'use strict';
  var LAM = 'λ';
  var LAMS = { 'λ': 1, 'L': 1, 'l': 1, 'e': 1, 'eps': 1, 'lambda': 1, 'ε': 1 };
  function uniq(a) { var o = []; a.forEach(function (x) { if (o.indexOf(x) < 0) o.push(x); }); return o; }
  function key(q, a) { return q + '|' + a; }
  /* ------------------------------------------------ construir */
  function make(o) {   // o: {Q, S, q0, F, t: [[origen, símbolo, destino], ...]}
    var M = { Q: o.Q.slice(), S: o.S.slice(), q0: o.q0, F: o.F.slice(), f: {} };
    o.t.forEach(function (x) { var k = key(x[0], x[1]); (M.f[k] = M.f[k] || []); if (M.f[k].indexOf(x[2]) < 0) M.f[k].push(x[2]); });
    return M;
  }
  function parse(txt) {   // devuelve {M} o {err, line}
    var Q = [], S = [], F = [], t = [], q0 = null, lines = String(txt).split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var s = lines[i].replace(/#.*$/, '').trim(); if (!s) continue;
      var w = s.split(/[\s]+/), h = w[0].toLowerCase();
      if (/^(inicio|inicial|start|initial)$/.test(h)) { if (w.length !== 2) return { err: 'start', line: i + 1 }; q0 = w[1]; continue; }
      if (/^(finales|final|finals|accept)$/.test(h)) { w.slice(1).join(' ').split(/[\s,]+/).filter(Boolean).forEach(function (q) { if (F.indexOf(q) < 0) F.push(q); }); continue; }
      if (w.length !== 3) return { err: 'line', line: i + 1 };
      var a = LAMS[w[1]] ? LAM : w[1];
      if (a !== LAM && a.length !== 1) return { err: 'sym', line: i + 1 };
      if (Q.indexOf(w[0]) < 0) Q.push(w[0]);
      if (a !== LAM && S.indexOf(a) < 0) S.push(a);
      var ds = w[2].split(',').filter(Boolean);
      for (var j = 0; j < ds.length; j++) {
        if (ds[j] === '-' || ds[j] === '∅') continue;
        if (Q.indexOf(ds[j]) < 0) Q.push(ds[j]);
        t.push([w[0], a, ds[j]]);
      }
    }
    if (!q0) return { err: 'nostart', line: 0 };
    Q = uniq([q0].concat(Q, F));   // el inicial primero, después en el orden en que aparecen en la tabla
    if (Q.length > 12) return { err: 'big', line: 0 };
    if (!S.length) return { err: 'nosym', line: 0 };
    S.sort();
    return { M: make({ Q: Q, S: S, q0: q0, F: F, t: t }) };
  }
  function toText(M, lang) {
    var en = lang === 'en', out = [(en ? 'start ' : 'inicio ') + M.q0, (en ? 'finals ' : 'finales ') + M.F.join(' ')];
    M.Q.forEach(function (q) { M.S.concat([LAM]).forEach(function (a) { var d = M.f[key(q, a)]; if (d && d.length) out.push(q + ' ' + a + ' ' + d.join(',')); }); });
    return out.join('\n');
  }
  function trans(M) { var o = []; Object.keys(M.f).forEach(function (k) { var p = k.split('|'); M.f[k].forEach(function (d) { o.push([p[0], p[1], d]); }); }); return o; }
  /* ------------------------------------------------ clasificar */
  function hasLam(M) { return M.Q.some(function (q) { return (M.f[key(q, LAM)] || []).length > 0; }); }
  function isDFA(M) {
    if (hasLam(M)) return false;
    return M.Q.every(function (q) { return M.S.every(function (a) { return (M.f[key(q, a)] || []).length === 1; }); });
  }
  function isDet(M) {   // determinista aunque le falten flechas (lo que falta va a una trampa que no se dibuja)
    if (hasLam(M)) return false;
    return M.Q.every(function (q) { return M.S.every(function (a) { return (M.f[key(q, a)] || []).length <= 1; }); });
  }
  function whyNot(M) {   // primera razón por la que no es un AFD: {q, a, n} (n = número de destinos; -1 = λ)
    for (var i = 0; i < M.Q.length; i++) {
      var q = M.Q[i];
      if ((M.f[key(q, LAM)] || []).length) return { q: q, a: LAM, n: -1 };
      for (var j = 0; j < M.S.length; j++) { var n = (M.f[key(q, M.S[j])] || []).length; if (n !== 1) return { q: q, a: M.S[j], n: n }; }
    }
    return null;
  }
  /* ------------------------------------------------ cadenas */
  function closure(M, S) {
    var out = uniq(S), st = out.slice();
    while (st.length) { var q = st.pop(); (M.f[key(q, LAM)] || []).forEach(function (r) { if (out.indexOf(r) < 0) { out.push(r); st.push(r); } }); }
    return sortQ(M, out);
  }
  function sortQ(M, S) { return S.slice().sort(function (a, b) { return M.Q.indexOf(a) - M.Q.indexOf(b); }); }
  function move(M, S, a) { var o = []; S.forEach(function (q) { (M.f[key(q, a)] || []).forEach(function (r) { if (o.indexOf(r) < 0) o.push(r); }); }); return sortQ(M, o); }
  function step(M, S, a) { return closure(M, move(M, S, a)); }
  function run(M, w) {   // [{S, a, moved}] con el conjunto activo tras cada símbolo; el 0 es el λ-cierre del inicial
    var S0 = [M.q0], C0 = closure(M, S0), out = [{ S: C0, a: null, moved: S0 }];
    for (var i = 0; i < w.length; i++) {
      var mv = move(M, out[i].S, w[i]); out.push({ S: closure(M, mv), a: w[i], moved: mv });
    }
    return out;
  }
  function acc(M, S) { return S.some(function (q) { return M.F.indexOf(q) >= 0; }); }
  function accepts(M, w) { var r = run(M, w); return acc(M, r[r.length - 1].S); }
  /* ------------------------------------------------ propiedades */
  function reach(M) {
    var out = [M.q0], st = [M.q0];
    while (st.length) { var q = st.pop(); M.S.concat([LAM]).forEach(function (a) { (M.f[key(q, a)] || []).forEach(function (r) { if (out.indexOf(r) < 0) { out.push(r); st.push(r); } }); }); }
    return sortQ(M, out);
  }
  function absorbing(M) {   // estados de los que no se sale (todas sus transiciones, al menos una, vuelven a él)
    return M.Q.filter(function (q) {
      var any = false, ok = true;
      M.S.concat([LAM]).forEach(function (a) { (M.f[key(q, a)] || []).forEach(function (r) { any = true; if (r !== q) ok = false; }); });
      return any && ok && (isDFA(M) ? true : M.S.every(function (a) { return (M.f[key(q, a)] || []).indexOf(q) >= 0; }));
    });
  }
  /* ------------------------------------------------ subconjuntos */
  function setName(S) { return S.length ? '{' + S.join(', ') + '}' : '∅'; }
  function subsets(M) {   // {sets: [[...]], rows: [{i, to: {a: j}}], fin: [bool]} en el orden de la tabla
    var sets = [closure(M, [M.q0])], rows = [], id = function (S) { var k = S.join(','); for (var i = 0; i < sets.length; i++) if (sets[i].join(',') === k) return i; return -1; };
    for (var i = 0; i < sets.length; i++) {
      var row = { i: i, to: {}, mv: {} };
      M.S.forEach(function (a) {
        var mv = move(M, sets[i], a), T = closure(M, mv), j = id(T);
        if (j < 0) { sets.push(T); j = sets.length - 1; }
        row.to[a] = j; row.mv[a] = mv;
      });
      rows.push(row);
      if (sets.length > 16) break;
    }
    return { sets: sets, rows: rows, fin: sets.map(function (S) { return acc(M, S); }) };
  }
  function letters(n) { var L = []; for (var i = 0; i < n; i++) L.push(String.fromCharCode(65 + i)); return L; }
  function subsetDFA(M) {   // el AFD como objeto M, con estados A, B, C… (∅ se llama ∅)
    var R = subsets(M), N = letters(R.sets.length).map(function (x, i) { return R.sets[i].length ? x : '∅'; }), t = [];
    R.rows.forEach(function (r) { M.S.forEach(function (a) { t.push([N[r.i], a, N[r.to[a]]]); }); });
    return { M: make({ Q: N, S: M.S, q0: N[0], F: N.filter(function (x, i) { return R.fin[i]; }), t: t }), R: R, names: N };
  }
  /* ------------------------------------------------ expresión regular → AFND (Thompson) */
  function reParse(src) {   // gramática: E = T ('+' T)*; T = F F*; F = A '*'*; A = símbolo | λ | '(' E ')'
    var s = String(src).replace(/\s+/g, '').replace(/\|/g, '+').replace(/[εL]/g, LAM), i = 0;
    if (!s.length || s.length > 40) throw new Error('len');
    function E() { var n = T(); while (s[i] === '+') { i++; n = { k: 'u', a: n, b: T() }; } return n; }
    function T() { var n = F(); while (i < s.length && s[i] !== '+' && s[i] !== ')') n = { k: 'c', a: n, b: F() }; return n; }
    function F() { var n = A(); while (s[i] === '*') { i++; n = { k: 's', a: n }; } return n; }
    function A() {
      var c = s[i];
      if (c === '(') { i++; var n = E(); if (s[i] !== ')') throw new Error('paren'); i++; return n; }
      if (c === LAM) { i++; return { k: 'l' }; }
      if (c && /[0-9a-z]/i.test(c)) { i++; return { k: 'a', c: c }; }
      throw new Error('sym');
    }
    var n = E(); if (i !== s.length) throw new Error('sym');
    return n;
  }
  function reNFA(src) {   // AFND con λ por las piezas de Kleene; estados s0, s1, … en orden de creación
    var tree = reParse(src), n = 0, t = [], S = [];
    function ns() { return 's' + (n++); }
    function go(x) {
      var a, b, i, f;
      if (x.k === 'a') { a = ns(); b = ns(); t.push([a, x.c, b]); if (S.indexOf(x.c) < 0) S.push(x.c); return [a, b]; }
      if (x.k === 'l') { a = ns(); b = ns(); t.push([a, LAM, b]); return [a, b]; }
      if (x.k === 'c') { var p = go(x.a), q = go(x.b); t.push([p[1], LAM, q[0]]); return [p[0], q[1]]; }
      if (x.k === 'u') { i = ns(); var u = go(x.a), v = go(x.b); f = ns(); t.push([i, LAM, u[0]], [i, LAM, v[0]], [u[1], LAM, f], [v[1], LAM, f]); return [i, f]; }
      if (x.k === 's') { i = ns(); var r = go(x.a); f = ns(); t.push([i, LAM, r[0]], [r[1], LAM, r[0]], [r[1], LAM, f], [i, LAM, f]); return [i, f]; }
    }
    var e = go(tree), Q = []; for (var k = 0; k < n; k++) Q.push('s' + k);
    S.sort();
    if (!S.length) S = ['0'];
    return make({ Q: Q, S: S, q0: e[0], F: [e[1]], t: t });
  }
  function reTest(src, w) {   // ¿la cadena está en el lenguaje? (vía el AFND)
    return accepts(reNFA(src), w);
  }
  /* ------------------------------------------------ dibujo: colocación y aristas */
  function layout(M, W, H) {   // posiciones en un lienzo W × H: orden BFS desde el inicial; una fila hasta 5, dos filas hasta 12
    var order = reach(M).concat(M.Q.filter(function (q) { return reach(M).indexOf(q) < 0; }));
    var n = order.length, P = {}, rows = n <= 5 ? 1 : 2, per = Math.ceil(n / rows);
    order.forEach(function (q, i) {
      var r = rows === 1 ? 0 : Math.floor(i / per), c = rows === 1 ? i : (r === 0 ? i : i - per);
      var cnt = rows === 1 ? n : (r === 0 ? per : n - per);
      var x = W * (c + 0.5) / Math.max(cnt, 1), y = rows === 1 ? H * 0.55 : (r === 0 ? H * 0.3 : H * 0.76);
      if (rows === 2 && r === 1) x = W * (cnt - c - 0.5) / Math.max(cnt, 1);   // la segunda fila vuelve hacia la izquierda (en U)
      P[q] = { x: Math.round(x), y: Math.round(y), row: r };
    });
    return P;
  }
  function edges(M, P) {   // agrupa las transiciones por pareja (origen, destino) y decide la curva de cada una
    var g = {}, out = [], nLong = 0;
    trans(M).forEach(function (x) { var k = x[0] + '>' + x[2]; (g[k] = g[k] || { o: x[0], d: x[2], s: [] }).s.push(x[1]); });
    Object.keys(g).sort(function (a, b) {   // las largas, de la más corta a la más larga, para alternar arriba y abajo
      var A = g[a], B = g[b]; return Math.hypot(P[A.o].x - P[A.d].x, P[A.o].y - P[A.d].y) - Math.hypot(P[B.o].x - P[B.d].x, P[B.o].y - P[B.d].y);
    }).forEach(function (k) {
      var e = g[k], rev = g[e.d + '>' + e.o] && e.o !== e.d, bend = 0;
      if (e.o === e.d) { e.loop = P[e.o].row === 1 ? 'down' : 'up'; }
      else {
        var a = P[e.o], b = P[e.d], dist = Math.hypot(a.x - b.x, a.y - b.y), same = a.y === b.y, fwd = a.x < b.x;
        if (rev) bend = 18;
        var between = same && Object.keys(P).some(function (q) { var c = P[q]; return q !== e.o && q !== e.d && Math.abs(c.y - a.y) < 1 && c.x > Math.min(a.x, b.x) + 1 && c.x < Math.max(a.x, b.x) - 1; });
        if (between) {
          var below = a.row === 1 ? (nLong % 2 === 1) : (nLong % 2 === 0), mag = Math.min(96, 30 + dist / 6) + (rev ? 10 : 0);
          bend = (below ? 1 : -1) * (fwd ? 1 : -1) * mag; nLong++;
        }
      }
      e.bend = bend; e.lab = e.s.sort(function (x, y) { return x === LAM ? 1 : y === LAM ? -1 : x < y ? -1 : 1; }).join(',');
      out.push(e);
    });
    return out;
  }
  var api = { LAM: LAM, make: make, parse: parse, toText: toText, trans: trans, key: key, hasLam: hasLam, isDFA: isDFA, isDet: isDet, whyNot: whyNot, closure: closure, move: move, step: step,
    run: run, acc: acc, accepts: accepts, reach: reach, absorbing: absorbing, subsets: subsets, subsetDFA: subsetDFA, setName: setName,
    reParse: reParse, reNFA: reNFA, reTest: reTest, layout: layout, edges: edges, sortQ: sortQ };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else G.SLAF = api;
})(typeof window !== 'undefined' ? window : this);
