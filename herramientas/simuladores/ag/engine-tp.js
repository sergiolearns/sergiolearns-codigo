/* SergioLearns — motor del simulador de AG «Transformaciones en el plano» (18 nov 2026).
 * Cuentas de una matriz 2 × 2: determinante, autovalores y autovectores (reales, dobles o complejos), núcleo e imagen,
 * diagonalización (P, D, P⁻¹), potencias y la clasificación de la forma cuadrática xᵗAx si es simétrica.
 * Trabaja con decimales y escribe los resultados como fracciones cortas o raíces cuando puede. Sin dependencias. */
(function (G) {
  'use strict';
  var EPS = 1e-9;
  function z(x) { return Math.abs(x) < 1e-9; }
  function cl(x) { return z(x) ? 0 : x; }
  /* ---------- lectura y escritura de números */
  function parse(s) {
    s = String(s == null ? '' : s).trim().replace(/\s/g, '').replace(/−/g, '-').replace(',', '.');
    if (s === '') return null;
    var m = /^([+-]?\d*\.?\d+)(?:\/([+-]?\d*\.?\d+))?$/.exec(s);
    if (!m) return null;
    var a = parseFloat(m[1]), b = m[2] != null ? parseFloat(m[2]) : 1;
    if (!isFinite(a) || !isFinite(b) || b === 0) return null;
    return a / b;
  }
  function frac(x, maxd) {   // [p, q] si x es (casi) p/q con q ≤ maxd
    maxd = maxd || 24;
    for (var q = 1; q <= maxd; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-7) return [p, q]; }
    return null;
  }
  function num(x, ascii) {   // «−3/2», «0.73»
    x = cl(x);
    var f = frac(x), minus = ascii ? '-' : '−', s;
    if (f) s = Math.abs(f[0]) + (f[1] > 1 ? '/' + f[1] : '');
    else s = String(Math.round(Math.abs(x) * 100) / 100);
    return (x < 0 ? minus : '') + s;
  }
  function sqrtTxt(d) {   // √d simplificada si d es entero: √12 → 2√3
    var f = frac(d, 1);
    if (!f || f[0] < 0) return null;
    var n = f[0], out = 1, k = 2;
    while (k * k <= n) { if (n % (k * k) === 0) { n /= k * k; out *= k; } else k++; }
    if (n === 1) return null;
    return (out > 1 ? out : '') + '√' + n;
  }
  /* ---------- 2 × 2 */
  function M(a, b, c, d) { return [[a, b], [c, d]]; }
  var I = M(1, 0, 0, 1);
  function det(A) { return cl(A[0][0] * A[1][1] - A[0][1] * A[1][0]); }
  function tr(A) { return A[0][0] + A[1][1]; }
  function mul(A, B) { return [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]]; }
  function app(A, v) { return [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]; }
  function inv(A) { var d = det(A); if (z(d)) return null; return [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]]; }
  function pow(A, n) { var R = I; for (var i = 0; i < n; i++) R = mul(R, A); return R; }
  function lerp(A, B, t) { return [[A[0][0] + (B[0][0] - A[0][0]) * t, A[0][1] + (B[0][1] - A[0][1]) * t], [A[1][0] + (B[1][0] - A[1][0]) * t, A[1][1] + (B[1][1] - A[1][1]) * t]]; }
  function eq(A, B) { return z(A[0][0] - B[0][0]) && z(A[0][1] - B[0][1]) && z(A[1][0] - B[1][0]) && z(A[1][1] - B[1][1]); }
  function sym(A) { return z(A[0][1] - A[1][0]); }
  function rot(A) {   // ¿es un giro (ortogonal con det 1)? → ángulo
    var c = A[0][0], s = A[1][0];
    if (z(A[1][1] - c) && z(A[0][1] + s) && z(c * c + s * s - 1)) return Math.atan2(s, c);
    return null;
  }
  /* Entre B y A en el instante t: los giros giran (no encogen) y lo demás se interpola entrada a entrada */
  function between(B, A, t) {
    var ra = rot(A), rb = rot(B);
    if (ra != null && rb != null) { var d = ra - rb; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; var g = rb + d * t; return M(Math.cos(g), -Math.sin(g), Math.sin(g), Math.cos(g)); }
    return lerp(B, A, t);
  }
  /* Un vector «bonito» (enteros pequeños) en la dirección de v */
  function nice(v) {
    var x = v[0], y = v[1];
    if (z(x) && z(y)) return [0, 0];
    var m = Math.max(Math.abs(x), Math.abs(y)); x /= m; y /= m;
    for (var q = 1; q <= 12; q++) { var a = Math.round(x * q), b = Math.round(y * q); if (Math.abs(a - x * q) < 1e-6 && Math.abs(b - y * q) < 1e-6) { var g = gcd(Math.abs(a), Math.abs(b)) || 1; a /= g; b /= g; if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; } return [cl(a), cl(b)]; } }
    if (x < 0 || (z(x) && y < 0)) { x = -x; y = -y; }
    return [x, y];
  }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  /* Autovector de λ: el núcleo de A − λI */
  function kerv(B) {
    var a = B[0][0], b = B[0][1], c = B[1][0], d = B[1][1];
    if (!z(a) || !z(b)) return z(a) && z(b) ? null : nice([-b, a]);
    if (!z(c) || !z(d)) return nice([-d, c]);
    return null;   // B = 0: todo el plano
  }
  function eig(A) {
    var T = tr(A), D = det(A), disc = cl(T * T - 4 * D);
    if (disc < -EPS) return { kind: 'c', re: T / 2, im: Math.sqrt(-disc) / 2, disc: disc };
    if (z(disc)) {
      var l = T / 2, B = [[A[0][0] - l, A[0][1]], [A[1][0], A[1][1] - l]], all = z(B[0][0]) && z(B[0][1]) && z(B[1][0]) && z(B[1][1]);
      return { kind: 'd', l: [l, l], v: all ? [[1, 0], [0, 1]] : [kerv(B)], disc: 0, diag: all };
    }
    var r = Math.sqrt(disc), l1 = (T - r) / 2, l2 = (T + r) / 2;
    var v = [l1, l2].map(function (l) { return kerv([[A[0][0] - l, A[0][1]], [A[1][0], A[1][1] - l]]); });
    return { kind: 'r', l: [l1, l2], v: v, disc: disc, diag: true };
  }
  function eigTxt(A, ascii) {   // los autovalores como texto: «1 y 3», «(5 − √33)/2»…
    var E = eig(A), T = tr(A);
    if (E.kind === 'c') return null;
    return E.l.map(function (l, i) {
      if (frac(l)) return num(l, ascii);
      var s = sqrtTxt(E.disc);
      return s ? '(' + num(T, ascii) + ' ' + (i ? '+' : (ascii ? '-' : '−')) + ' ' + s + ')/2' : num(l, ascii);
    });
  }
  function diagP(A) {   // P (autovectores en columnas), D y P⁻¹, si es diagonalizable con autovalores reales
    var E = eig(A);
    if (E.kind === 'c' || !E.diag) return null;
    var v = E.v.length === 2 ? E.v : [[1, 0], [0, 1]];
    var P = [[v[0][0], v[1][0]], [v[0][1], v[1][1]]];
    return { P: P, D: M(E.l[0], 0, 0, E.l[1]), Pi: inv(P), l: E.l };
  }
  function rank(A) { if (!z(det(A))) return 2; return z(A[0][0]) && z(A[0][1]) && z(A[1][0]) && z(A[1][1]) ? 0 : 1; }
  function kerIm(A) {   // con det = 0: dirección del núcleo y de la imagen
    var r = rank(A);
    if (r !== 1) return { r: r };
    var k = kerv(A), im = !z(A[0][0]) || !z(A[1][0]) ? nice([A[0][0], A[1][0]]) : nice([A[0][1], A[1][1]]);
    return { r: 1, ker: k, im: im };
  }
  function cls(A) {   // forma cuadrática de una simétrica: dp, dn, sp, sn, in, nula
    var E = eig(A);
    if (E.kind === 'c') return null;
    var p = 0, n = 0;
    E.l.forEach(function (l) { if (l > 1e-9) p++; else if (l < -1e-9) n++; });
    var k = p === 2 ? 'dp' : n === 2 ? 'dn' : p && n ? 'in' : p ? 'sp' : n ? 'sn' : '0';
    return { k: k, p: p, n: n, l: E.l, v: E.v };
  }
  function vtxt(v, ascii) { return '(' + num(v[0], ascii) + ', ' + num(v[1], ascii) + ')'; }
  function ml(A) { return '[' + num(A[0][0], 1) + ' ' + num(A[0][1], 1) + '; ' + num(A[1][0], 1) + ' ' + num(A[1][1], 1) + ']'; }
  G.SLTP = { parse: parse, frac: frac, num: num, M: M, I: I, det: det, tr: tr, mul: mul, app: app, inv: inv, pow: pow, lerp: lerp, between: between, eq: eq, sym: sym, rot: rot,
    nice: nice, eig: eig, eigTxt: eigTxt, diagP: diagP, rank: rank, kerIm: kerIm, cls: cls, vtxt: vtxt, ml: ml, z: z };
})(typeof window !== 'undefined' ? window : globalThis);
