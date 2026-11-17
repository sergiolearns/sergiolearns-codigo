/* SergioLearns — motor del simulador «Gauss-Jordan paso a paso» de AG (17 nov 2026).
 * Fracciones exactas con BigInt, escalonado por Gauss y reducción de Gauss-Jordan con cada operación elemental
 * apuntada (intercambio, multiplicar una fila, sumar a una fila un múltiplo de otra), rango, Rouché-Frobenius,
 * solución paramétrica, inversa por (A | I) y determinante siguiendo lo que hace cada operación.
 * Sin dependencias: window.SLGJ (y module.exports para las pruebas en Node). */
(function (G) {
  'use strict';
  /* ------------------------------------------------ fracciones */
  function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { var t = a % b; a = b; b = t; } return a; }
  function F(n, d) {
    n = BigInt(n); d = d == null ? 1n : BigInt(d);
    if (d === 0n) throw new Error('div0');
    if (d < 0n) { n = -n; d = -d; }
    var g = gcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  }
  var ZERO = F(0), ONE = F(1);
  function add(a, b) { return F(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b) { return F(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b) { return F(a.n * b.n, a.d * b.d); }
  function div(a, b) { return F(a.n * b.d, a.d * b.n); }
  function neg(a) { return { n: -a.n, d: a.d }; }
  function isZ(a) { return a.n === 0n; }
  function eq(a, b) { return a.n === b.n && a.d === b.d; }
  function isInt(a) { return a.d === 1n; }
  function abs(a) { return a.n < 0n ? neg(a) : a; }
  function str(a) { return isInt(a) ? String(a.n) : String(a.n) + '/' + String(a.d); }
  function num(a) { return Number(a.n) / Number(a.d); }
  /** «3», «-2/5», «1,5», «.25», «−4» → fracción; null si no se entiende. */
  function parse(s) {
    s = String(s == null ? '' : s).trim().replace(/−/g, '-').replace(',', '.').replace(/\s+/g, '');
    if (!s) return ZERO;
    var m = /^([+-]?)(\d+)\/(\d+)$/.exec(s);
    if (m) { if (m[3] === '0' || /^0+$/.test(m[3])) return null; return F((m[1] === '-' ? -1n : 1n) * BigInt(m[2]), BigInt(m[3])); }
    m = /^([+-]?)(\d*)(?:\.(\d+))?$/.exec(s);
    if (!m || (!m[2] && !m[3])) return null;
    var dec = m[3] || '', n = BigInt((m[2] || '0') + dec), d = 10n ** BigInt(dec.length);
    return F(m[1] === '-' ? -n : n, d);
  }
  /* ------------------------------------------------ matrices */
  function clone(M) { return M.map(function (r) { return r.slice(); }); }
  function fromNums(A) { return A.map(function (r) { return r.map(function (x) { return typeof x === 'object' ? x : parse(x); }); }); }
  function toStr(M) { return M.map(function (r) { return r.map(str); }); }
  /* Operaciones elementales: devuelven una matriz nueva.
   * swap i j: f_i ↔ f_j · scale i c: f_i → c·f_i · add i j c: f_i → f_i + c·f_j */
  function apply(M, op) {
    var R = clone(M), i = op.i, j = op.j;
    if (op.t === 'swap') { var t = R[i]; R[i] = R[j]; R[j] = t; }
    else if (op.t === 'scale') R[i] = R[i].map(function (x) { return mul(x, op.c); });
    else if (op.t === 'add') R[i] = R[i].map(function (x, k) { return add(x, mul(op.c, M[j][k])); });
    return R;
  }
  /* El paso a paso. M: matriz (filas de fracciones); o.sep: nº de columnas de la parte izquierda (las incógnitas;
   * por defecto todas); o.jordan: también ceros encima y pivotes a 1 (Gauss-Jordan); o.unit: en Gauss, dividir la
   * fila del pivote para que valga 1 (como hace rref); o.det: ir apuntando lo que cada operación hace al determinante.
   * Devuelve { steps:[{op, M, piv:[r,c], phase, f}], piv:[[r,c]…], M (final), f (factor acumulado del det) }. */
  function solve(M0, o) {
    o = o || {};
    var M = clone(M0), m = M.length, n = m ? M[0].length : 0, sep = o.sep == null ? n : o.sep;
    var steps = [], piv = [], f = ONE, r = 0;
    function push(op, ph, p) {
      M = apply(M, op);
      if (op.t === 'swap') f = neg(f); else if (op.t === 'scale') f = mul(f, op.c);
      steps.push({ op: op, M: M, piv: p, phase: ph, f: f });
    }
    // Fase de Gauss: escalonar (pivotes en la parte izquierda; la columna de la derecha no lleva pivote)
    for (var c = 0; c < sep && r < m; c++) {
      var best = -1;
      for (var i = r; i < m; i++) {
        if (isZ(M[i][c])) continue;
        if (best < 0) best = i;
        if (eq(abs(M[i][c]), ONE) && !eq(abs(M[best][c]), ONE)) best = i;   // como a mano: mejor un 1 de pivote
      }
      if (best < 0) continue;
      // Solo se cambia de fila si el pivote de arriba es 0 o si abajo hay un 1 y arriba no (evita fracciones)
      if (best !== r && (isZ(M[r][c]) || (o.prefer1 !== false && eq(abs(M[best][c]), ONE) && !eq(abs(M[r][c]), ONE)))) push({ t: 'swap', i: r, j: best }, 'gauss', [r, c]);
      if (o.unit && !eq(M[r][c], ONE)) push({ t: 'scale', i: r, c: div(ONE, M[r][c]) }, 'gauss', [r, c]);
      for (var k = r + 1; k < m; k++) {
        if (isZ(M[k][c])) continue;
        push({ t: 'add', i: k, j: r, c: neg(div(M[k][c], M[r][c])) }, 'gauss', [r, c]);
      }
      piv.push([r, c]); r++;
    }
    // Fase de Jordan: de abajo arriba, pivote a 1 y ceros encima
    if (o.jordan) {
      for (var q = piv.length - 1; q >= 0; q--) {
        var pr = piv[q][0], pc = piv[q][1];
        if (!eq(M[pr][pc], ONE)) push({ t: 'scale', i: pr, c: div(ONE, M[pr][pc]) }, 'jordan', [pr, pc]);
        for (var u = pr - 1; u >= 0; u--) {
          if (isZ(M[u][pc])) continue;
          push({ t: 'add', i: u, j: pr, c: neg(M[u][pc]) }, 'jordan', [pr, pc]);
        }
      }
    }
    return { steps: steps, piv: piv, M: M, f: f, m: m, n: n, sep: sep };
  }
  function rowZero(row, a, b) { for (var k = a; k < b; k++) if (!isZ(row[k])) return false; return true; }
  /** Rangos de A y de (A | B) mirando una escalonada. */
  function ranks(E, sep) {
    var p = 0, q = 0, n = E.length ? E[0].length : 0;
    E.forEach(function (row) { if (!rowZero(row, 0, sep)) p++; if (!rowZero(row, 0, n)) q++; });
    return { p: p, q: q };
  }
  /** Rouché-Frobenius: 'I' (incompatible), 'CD' o 'CI' (con n − p parámetros). */
  function rouche(E, sep) {
    var R = ranks(E, sep), n = sep;
    return { p: R.p, q: R.q, n: n, kind: R.p < R.q ? 'I' : (R.p === n ? 'CD' : 'CI'), free: n - R.p };
  }
  /** Solución desde la escalonada reducida (una sola columna de términos independientes).
   * Devuelve { kind, vals:[{c: constante, t:[coef de cada parámetro]}], params:[índices de las libres] } o null si es I. */
  function param(R, sep) {
    var info = rouche(R, sep); if (info.kind === 'I') return { kind: 'I', info: info };
    var pivCols = [], rowOf = {};
    R.forEach(function (row, i) { for (var c = 0; c < sep; c++) if (!isZ(row[c])) { pivCols.push(c); rowOf[c] = i; break; } });
    var free = []; for (var c = 0; c < sep; c++) if (pivCols.indexOf(c) < 0) free.push(c);
    var vals = [];
    for (var x = 0; x < sep; x++) {
      if (free.indexOf(x) >= 0) { vals.push({ c: ZERO, t: free.map(function (fc) { return fc === x ? ONE : ZERO; }) }); continue; }
      var row = R[rowOf[x]], lead = row[x];
      vals.push({ c: div(row[sep] || ZERO, lead), t: free.map(function (fc) { return neg(div(row[fc], lead)); }) });
    }
    return { kind: info.kind, vals: vals, params: free, info: info };
  }
  /** Determinante «de clase»: escalonar sin dividir filas y multiplicar la diagonal, corrigiendo con lo que hizo cada operación. */
  function det(A) {
    if (!A.length || A.length !== A[0].length) return null;
    var S = solve(A, {}), d = ONE;
    for (var i = 0; i < A.length; i++) d = mul(d, S.M[i][i]);
    return div(d, S.f);
  }
  /** (A | I) → (I | A⁻¹) por Gauss-Jordan; null si A no es invertible. */
  function inverse(A) {
    var n = A.length, M = A.map(function (r, i) { return r.concat(A.map(function (x, j) { return i === j ? ONE : ZERO; })); });
    var S = solve(M, { sep: n, jordan: true });
    if (S.piv.length < n) return { ok: false, S: S };
    return { ok: true, S: S, inv: S.M.map(function (r) { return r.slice(n); }) };
  }
  var API = { F: F, ZERO: ZERO, ONE: ONE, add: add, sub: sub, mul: mul, div: div, neg: neg, isZ: isZ, eq: eq, isInt: isInt, abs: abs, str: str, num: num, parse: parse,
    clone: clone, fromNums: fromNums, toStr: toStr, apply: apply, solve: solve, ranks: ranks, rouche: rouche, param: param, det: det, inverse: inverse };
  G.SLGJ = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
