/* SergioLearns — motor del simulador de MD «Caminos mínimos y árbol generador» (19 nov 2026, v97).
 * Grafos ponderados no dirigidos; Dijkstra con la tabla en el formato del examen de problemas de aula de MD
 * («coste,vértice», «-» para infinito, «*» para los cerrados; un vértice procesado por paso; empates por orden alfabético;
 * solo se actualiza si el coste MEJORA), Kruskal (aristas ordenadas por peso, se rechazan las que cierran ciclo) y Prim
 * (desde un vértice, la arista más barata que sale del árbol). Sin dependencias: window.SLCM. Pruebas: test-cm.js. */
(function (G) {
  'use strict';
  function key(u, v) { return u < v ? u + v : v + u; }
  function cmpE(a, b) { return a[2] - b[2] || (key(a[0], a[1]) < key(b[0], b[1]) ? -1 : key(a[0], a[1]) > key(b[0], b[1]) ? 1 : 0); }
  function norm(E) { return E.map(function (e) { return e[0] < e[1] ? [e[0], e[1], e[2]] : [e[1], e[0], e[2]]; }); }
  function verts(E) { var s = {}; E.forEach(function (e) { s[e[0]] = 1; s[e[1]] = 1; }); return Object.keys(s).sort(); }
  function adj(E) { var A = {}; E.forEach(function (e) { (A[e[0]] = A[e[0]] || {})[e[1]] = e[2]; (A[e[1]] = A[e[1]] || {})[e[0]] = e[2]; }); return A; }
  /* «a-b 7», «a b 7», «a–b: 7», separadas por líneas, comas o punto y coma. Devuelve {E} o {err, line} */
  function parse(txt) {
    var parts = String(txt || '').split(/[\n;,]+/).map(function (s) { return s.trim(); }).filter(Boolean), E = [], seen = {};
    for (var i = 0; i < parts.length; i++) {
      var m = parts[i].replace(/[–—−]/g, '-').match(/^([A-Za-z]\w{0,2})\s*[-\s]\s*([A-Za-z]\w{0,2})\s*[:=\s]\s*(\d{1,3}(?:[.,]\d+)?)$/);
      if (!m) return { err: 'syntax', line: parts[i] };
      var u = m[1].toLowerCase(), v = m[2].toLowerCase(), w = parseFloat(m[3].replace(',', '.'));
      if (u === v) return { err: 'loop', line: parts[i] };
      if (seen[key(u, v)]) return { err: 'dup', line: parts[i] };
      seen[key(u, v)] = 1; E.push([u, v, w]);
    }
    if (!E.length) return { err: 'empty' };
    if (verts(E).length > 10) return { err: 'big' };
    return { E: norm(E) };
  }
  function text(E) { return E.map(function (e) { return e[0] + '-' + e[1] + ' ' + e[2]; }).join('\n'); }
  function connected(E) { var V = verts(E), A = adj(E), seen = {}, st = [V[0]]; seen[V[0]] = 1; while (st.length) { var u = st.pop(); for (var v in A[u]) if (!seen[v]) { seen[v] = 1; st.push(v); } } return Object.keys(seen).length === V.length; }
  /* ---------------------------------------------------------------- Dijkstra con la tabla del examen */
  function dijkstra(E, s) {
    var V = verts(E), A = adj(E), cost = {}, prev = {}, closed = [], cols = [];
    V.forEach(function (v) { cost[v] = null; }); cost[s] = 0; prev[s] = s;
    while (closed.length < V.length) {
      var u = null;
      V.forEach(function (v) { if (closed.indexOf(v) < 0 && cost[v] != null && (u == null || cost[v] < cost[u] || (cost[v] === cost[u] && v < u))) u = v; });
      if (u == null) break;   // lo que queda no se alcanza
      var tries = [];
      Object.keys(A[u]).sort().forEach(function (v) {
        if (closed.indexOf(v) >= 0) return;
        var c = cost[u] + A[u][v], old = cost[v], better = old == null || c < old;
        tries.push({ v: v, w: A[u][v], c: c, old: old, oldp: prev[v], better: better });
        if (better) { cost[v] = c; prev[v] = u; }
      });
      var tie = V.filter(function (v) { return v !== u && closed.indexOf(v) < 0 && cost[v] != null && cost[v] === cost[u] && tries.every(function (t) { return t.v !== v || !t.better; }); });
      var cells = {};
      V.forEach(function (v) { cells[v] = closed.indexOf(v) >= 0 ? '*' : cost[v] == null ? '-' : cost[v] + ',' + prev[v]; });
      cols.push({ u: u, cu: cost[u], cells: cells, tries: tries, closedBefore: closed.slice(), tie: tie });
      closed.push(u);
    }
    return { V: V, cols: cols, cost: cost, prev: prev, order: closed };
  }
  function path(D, s, d) {
    if (D.cost[d] == null) return null;
    var p = [d]; while (p[p.length - 1] !== s) p.push(D.prev[p[p.length - 1]]);
    return p.reverse();
  }
  /* tabla del lector frente a la buena: «7,a» = «7, a» = «7 ,A»; los pasos que sobran tienen que quedar en blanco */
  function cell(s) { return String(s == null ? '' : s).replace(/\s+/g, '').toLowerCase(); }
  function compare(D, user, extra) {
    var res = {}, ok = 0, n = 0, steps = D.cols.length + (extra || 0);
    D.V.forEach(function (v) {
      res[v] = [];
      for (var j = 0; j < steps; j++) {
        var want = j < D.cols.length ? D.cols[j].cells[v] : '', got = cell(user[v] && user[v][j]);
        var good = got === cell(want); res[v].push(good); ok += good; n++;
      }
    });
    return { res: res, ok: ok, n: n };
  }
  /* ---------------------------------------------------------------- Kruskal */
  function kruskal(E) {
    var V = verts(E), comp = {}, steps = [], tree = [], total = 0;
    V.forEach(function (v) { comp[v] = v; });
    function find(x) { while (comp[x] !== x) x = comp[x]; return x; }
    E.slice().sort(cmpE).forEach(function (e) {
      if (tree.length === V.length - 1) { steps.push({ e: e, ok: false, why: 'done', tree: tree.slice(), total: total }); return; }
      var a = find(e[0]), b = find(e[1]), ok = a !== b;
      if (ok) { comp[a] = b; tree.push(e); total += e[2]; }
      var groups = {}; V.forEach(function (v) { var r = find(v); (groups[r] = groups[r] || []).push(v); });
      steps.push({ e: e, ok: ok, why: ok ? 'add' : 'cycle', tree: tree.slice(), total: total, groups: Object.keys(groups).map(function (k) { return groups[k]; }) });
    });
    return { V: V, sorted: E.slice().sort(cmpE), steps: steps, tree: tree, total: total };
  }
  /* ---------------------------------------------------------------- Prim */
  function prim(E, s) {
    var V = verts(E), A = adj(E), inT = [s], tree = [], total = 0, steps = [];
    while (inT.length < V.length) {
      var cand = [];
      inT.forEach(function (u) { Object.keys(A[u]).forEach(function (v) { if (inT.indexOf(v) < 0) cand.push([u, v, A[u][v]]); }); });
      if (!cand.length) break;
      cand.sort(function (a, b) { return a[2] - b[2] || (key(a[0], a[1]) < key(b[0], b[1]) ? -1 : 1); });
      var e = cand[0]; tree.push(e); total += e[2]; inT.push(e[1]);
      steps.push({ e: e, cand: cand, inT: inT.slice(), tree: tree.slice(), total: total });
    }
    return { V: V, steps: steps, tree: tree, total: total };
  }
  /* ---------------------------------------------------------------- posiciones */
  function circle(V, W, H) {
    var P = {}, n = V.length, cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 46;
    V.forEach(function (v, i) { var a = -Math.PI / 2 + 2 * Math.PI * i / n; P[v] = [Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a))]; });
    return P;
  }
  /* grafos al azar para «Ponte a prueba»: n vértices en dos filas, conexo, pesos de 1 a 9 */
  function random(n, rnd) {
    rnd = rnd || Math.random;
    var V = 'abcdefgh'.slice(0, n).split(''), E = [], has = {};
    function add(u, v) { var k = key(u, v); if (has[k] || u === v) return; has[k] = 1; E.push([u, v, 1 + Math.floor(rnd() * 9)]); }
    for (var i = 1; i < n; i++) add(V[i], V[Math.floor(rnd() * i)]);
    var extra = Math.max(2, Math.round(n * 0.7));
    for (var k = 0, guard = 0; k < extra && guard < 60; guard++) { var a = V[Math.floor(rnd() * n)], b = V[Math.floor(rnd() * n)]; if (a !== b && !has[key(a, b)]) { add(a, b); k++; } }
    return norm(E);
  }
  G.SLCM = { parse: parse, text: text, verts: verts, adj: adj, key: key, connected: connected, dijkstra: dijkstra, path: path, compare: compare, cell: cell,
    kruskal: kruskal, prim: prim, circle: circle, random: random, sortE: function (E) { return E.slice().sort(cmpE); } };
})(typeof window !== 'undefined' ? window : globalThis);
