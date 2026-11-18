/* sl-matlab · álgebra lineal. Los algoritmos y tolerancias de rref, rank y null son los de MATLAB. */
var EPS = Math.pow(2, -52);
// a − b·c con un solo redondeo (como el FMA de LAPACK): producto exacto de Dekker
function split(x) { var t = 134217729 * x, h = t - (t - x); return [h, x - h]; }
function fms(a, b, c) { var p = b * c; if (!isFinite(p)) return a - p; var B = split(b), C = split(c), e = ((B[0] * C[0] - p) + B[0] * C[1] + B[1] * C[0]) + B[1] * C[1]; return (a - p) - e; }
function epsOf(x) { x = Math.abs(x); if (!isFinite(x)) return NaN; if (x === 0) return Math.pow(2, -1074); var e = Math.floor(Math.log2(x)); if (Math.pow(2, e) > x) e--; return Math.pow(2, e - 52); }
function needSq(A, f) { if (A.r !== A.c) throw new MErr('La matriz tiene que ser cuadrada para ' + f + ' (esta es ' + sizeStr(A) + ').', 0, 'square'); }
function realOnly(A, f) { if (A.im) throw new MErr(f + ' con números complejos no está disponible en este entorno.', 0, 'cx'); }
function normInf(A) { var m = 0; for (var i = 0; i < A.r; i++) { var s = 0; for (var j = 0; j < A.c; j++) s += cabs(A.re[j * A.r + i], A.im ? A.im[j * A.r + i] : 0); if (s > m) m = s; } return m; }
function norm1(A) { var m = 0; for (var j = 0; j < A.c; j++) { var s = 0; for (var i = 0; i < A.r; i++) s += cabs(A.re[j * A.r + i], A.im ? A.im[j * A.r + i] : 0); if (s > m) m = s; } return m; }

// LU con pivote parcial (también rectangular). Devuelve L (m×k), U (k×n), piv (permutación de filas)
function luDec(A) {
  var m = A.r, n = A.c, a = toC(A), re = a.re, im = a.im, piv = [], k = Math.min(m, n), sing = false;
  for (var i = 0; i < m; i++) piv.push(i);
  for (var j = 0; j < k; j++) {
    var p = j, mx = -1;
    for (i = j; i < m; i++) { var v = cabs(re[j * m + i], im[j * m + i]); if (v > mx) { mx = v; p = i; } }
    if (p !== j) { for (var c = 0; c < n; c++) { var t = re[c * m + p]; re[c * m + p] = re[c * m + j]; re[c * m + j] = t; t = im[c * m + p]; im[c * m + p] = im[c * m + j]; im[c * m + j] = t; } t = piv[p]; piv[p] = piv[j]; piv[j] = t; }
    var dr = re[j * m + j], di = im[j * m + j];
    if (dr === 0 && di === 0) { sing = true; continue; }
    for (i = j + 1; i < m; i++) {
      var f = cdiv(re[j * m + i], im[j * m + i], dr, di); re[j * m + i] = f[0]; im[j * m + i] = f[1];
      for (c = j + 1; c < n; c++) { var pr = cmul(f[0], f[1], re[c * m + j], im[c * m + j]); re[c * m + i] -= pr[0]; im[c * m + i] -= pr[1]; }
    }
  }
  var L = M(m, k), U = M(k, n); L.im = new Float64Array(m * k); U.im = new Float64Array(k * n);
  for (i = 0; i < m; i++) for (j = 0; j < k; j++) { if (i === j) L.re[j * m + i] = 1; else if (i > j) { L.re[j * m + i] = re[j * m + i]; L.im[j * m + i] = im[j * m + i]; } }
  for (i = 0; i < k; i++) for (j = i; j < n; j++) { U.re[j * k + i] = re[j * m + i]; U.im[j * k + i] = im[j * m + i]; }
  return { L: cleanIm(L), U: cleanIm(U), piv: piv, sing: sing };
}
function det(A) {
  needSq(A, 'calcular el determinante (det)');
  if (A.r === 0) return sc(1);
  var d = luDec(A), sr = 1, si = 0, sign = 1, seen = d.piv.slice();
  // signo de la permutación
  var vis = [], n = A.r;
  for (var i = 0; i < n; i++) if (!vis[i]) { var j = i, len = 0; while (!vis[j]) { vis[j] = 1; j = d.piv[j]; len++; } if (len % 2 === 0) sign = -sign; }
  for (i = 0; i < n; i++) { var p = cmul(sr, si, d.U.re[i * n + i], d.U.im ? d.U.im[i * n + i] : 0); sr = p[0]; si = p[1]; }
  return sc(sign * sr, sign * si || 0);
}
function warnSing(ctx, rc) {
  if (rc === 0) ctx.warn('La matriz es singular para la precisión de trabajo (su determinante es 0): no tiene inversa.', 'Matrix is singular to working precision.');
  else ctx.warn('La matriz está cerca de ser singular o mal escalada: el resultado puede no ser exacto. RCOND = ' + rc.toExponential(6) + '.', 'Matrix is close to singular or badly scaled. Results may be inaccurate. RCOND =  ' + rc.toExponential(6) + '.');
}
function solveLU(A, B, ctx) { // A cuadrada
  var n = A.r, d = luDec(A), X = toC(B), m = B.c;
  // permutar filas de B
  var Y = M(n, m); Y.im = new Float64Array(n * m);
  for (var i = 0; i < n; i++) for (var c = 0; c < m; c++) { Y.re[c * n + i] = X.re[c * n + d.piv[i]]; Y.im[c * n + i] = X.im[c * n + d.piv[i]]; }
  var L = toC(d.L), U = toC(d.U), sing = false;
  for (c = 0; c < m; c++) {
    for (i = 0; i < n; i++) { for (var k = 0; k < i; k++) { var pr = cmul(L.re[k * n + i], L.im[k * n + i], Y.re[c * n + k], Y.im[c * n + k]); Y.re[c * n + i] -= pr[0]; Y.im[c * n + i] -= pr[1]; } }
    for (i = n - 1; i >= 0; i--) {
      for (k = i + 1; k < n; k++) { pr = cmul(U.re[k * n + i], U.im[k * n + i], Y.re[c * n + k], Y.im[c * n + k]); Y.re[c * n + i] -= pr[0]; Y.im[c * n + i] -= pr[1]; }
      var ur = U.re[i * n + i], ui = U.im[i * n + i];
      if (ur === 0 && ui === 0) { sing = true; var a = Y.re[c * n + i]; Y.re[c * n + i] = a === 0 ? NaN : a > 0 ? Infinity : -Infinity; Y.im[c * n + i] = 0; }
      else { var q = cdiv(Y.re[c * n + i], Y.im[c * n + i], ur, ui); Y.re[c * n + i] = q[0]; Y.im[c * n + i] = q[1]; }
    }
  }
  if (ctx) { var rc = sing ? 0 : rcondOf(A, d); if (rc < EPS) warnSing(ctx, rc); }
  return cleanIm(Y);
}
function rcondOf(A, d) { // estimación: 1/(||A||1 ||A^-1||1) con la inversa explícita (matrices pequeñas)
  var n = A.r; if (!n) return Infinity;
  for (var i = 0; i < n; i++) if (d.U.re[i * n + i] === 0 && (!d.U.im || d.U.im[i * n + i] === 0)) return 0;
  var Ai = solveLU(A, eye(n, n), null); var v = 1 / (norm1(A) * norm1(Ai)); return isFinite(v) ? v : 0;
}
function inv(A, ctx) {
  needSq(A, 'calcular la inversa (inv)');
  var d = luDec(A), n = A.r;
  if (d.sing) { if (ctx) warnSing(ctx, 0); var R = M(n, n); for (var i = 0; i < n * n; i++) R.re[i] = Infinity; return R; }
  return solveLU(A, eye(n, n), ctx);
}
// QR de Householder como LAPACK (R(k,k) = -signo(a)·||x||)
function qrDec(A, econ) {
  realOnly(A, 'qr'); var m = A.r, n = A.c, R = copy(A), Q = eye(m, m), vs = [], k = Math.min(m - 1, n);
  for (var j = 0; j < Math.min(m, n); j++) {
    var s = 0; for (var i = j; i < m; i++) s += R.re[j * m + i] * R.re[j * m + i];
    var nx = Math.sqrt(s), a = R.re[j * m + j];
    if (nx === 0 || (j === m - 1)) { if (j === m - 1 && m <= n) { /* última fila: sin reflexión */ } continue; }
    var beta = a >= 0 ? -nx : nx, v = []; v[j] = a - beta; for (i = j + 1; i < m; i++) v[i] = R.re[j * m + i];
    var vn = 0; for (i = j; i < m; i++) vn += v[i] * v[i]; if (vn === 0) continue;
    for (var c = j; c < n; c++) { var d = 0; for (i = j; i < m; i++) d += v[i] * R.re[c * m + i]; d = 2 * d / vn; for (i = j; i < m; i++) R.re[c * m + i] -= d * v[i]; }
    for (var r = 0; r < m; r++) { d = 0; for (i = j; i < m; i++) d += Q.re[i * m + r] * v[i]; d = 2 * d / vn; for (i = j; i < m; i++) Q.re[i * m + r] -= d * v[i]; }
    for (i = j + 1; i < m; i++) R.re[j * m + i] = 0;
  }
  if (econ && m > n) { var Q2 = M(m, n), R2 = M(n, n); for (j = 0; j < n; j++) for (i = 0; i < m; i++) Q2.re[j * m + i] = Q.re[j * m + i]; for (j = 0; j < n; j++) for (i = 0; i < n; i++) R2.re[j * n + i] = R.re[j * m + i]; return { Q: Q2, R: R2 }; }
  return { Q: Q, R: R };
}
// mínimos cuadrados con QR y pivote de columnas (la solución «básica» de MATLAB si el rango no es completo)
function lsq(A, B, ctx) {
  realOnly(A, 'La división «\\» no cuadrada'); realOnly(B, 'La división «\\» no cuadrada');
  var m = A.r, n = A.c, a = toRows(A), b = toRows(B), perm = [], cn = [];
  for (var j = 0; j < n; j++) { perm.push(j); var s = 0; for (var i = 0; i < m; i++) s += a[i][j] * a[i][j]; cn.push(s); }
  var kmax = Math.min(m, n), rdiag = [];
  for (var k = 0; k < kmax; k++) {
    var p = k; for (j = k + 1; j < n; j++) if (cn[j] > cn[p] * (1 + 1e-12)) p = j;
    if (p !== k) { for (i = 0; i < m; i++) { var t = a[i][k]; a[i][k] = a[i][p]; a[i][p] = t; } t = cn[k]; cn[k] = cn[p]; cn[p] = t; t = perm[k]; perm[k] = perm[p]; perm[p] = t; }
    var nx = 0; for (i = k; i < m; i++) nx += a[i][k] * a[i][k]; nx = Math.sqrt(nx);
    if (nx === 0) { rdiag.push(0); continue; }
    var beta = a[k][k] >= 0 ? -nx : nx, v = []; v[k] = a[k][k] - beta; for (i = k + 1; i < m; i++) v[i] = a[i][k];
    var vn = 0; for (i = k; i < m; i++) vn += v[i] * v[i];
    for (j = k; j < n; j++) { var d = 0; for (i = k; i < m; i++) d += v[i] * a[i][j]; d = 2 * d / vn; for (i = k; i < m; i++) a[i][j] -= d * v[i]; }
    for (var c = 0; c < b[0].length; c++) { d = 0; for (i = k; i < m; i++) d += v[i] * b[i][c]; d = 2 * d / vn; for (i = k; i < m; i++) b[i][c] -= d * v[i]; }
    rdiag.push(a[k][k]);
    for (j = k + 1; j < n; j++) { s = 0; for (i = k + 1; i < m; i++) s += a[i][j] * a[i][j]; cn[j] = s; }
  }
  var tol = Math.max(m, n) * EPS * Math.abs(rdiag[0] || 0), r = 0;
  for (k = 0; k < kmax; k++) if (Math.abs(a[k][k]) > tol) r++; else break;
  if (r < Math.min(m, n) && ctx) ctx.warn('Rango deficiente: rank = ' + r + ', tol = ' + tol.toExponential(6) + '.', 'Rank deficient, rank = ' + r + ', tol =  ' + tol.toExponential(6) + '.');
  var X = M(n, B.c);
  for (c = 0; c < B.c; c++) {
    var x = new Array(n).fill(0);
    for (i = r - 1; i >= 0; i--) { s = b[i][c]; for (j = i + 1; j < r; j++) s -= a[i][j] * x[j]; x[i] = s / a[i][i]; }
    for (j = 0; j < n; j++) X.re[c * n + perm[j]] = x[j];
  }
  return X;
}
function mldivide(A, B, ctx) {
  if (isScalar(A)) return OPS['./'](B, A);
  if (A.r !== B.r) throw new MErr('En A\\b, A y b tienen que tener el mismo número de filas (aquí ' + A.r + ' y ' + B.r + ').', 0, 'mldivide');
  if (A.r === A.c) return solveLU(A, B, ctx);
  return lsq(A, B, ctx);
}
function mrdivide(B, A, ctx) {
  if (isScalar(A)) return OPS['./'](B, A);
  if (B.c !== A.c) throw new MErr('En b/A, b y A tienen que tener el mismo número de columnas (aquí ' + B.c + ' y ' + A.c + ').', 0, 'mrdivide');
  return transpose(mldivide(transpose(A, false), transpose(B, false), ctx), false);
}
function mpower(A, B, ctx) {
  if (isScalar(A) && isScalar(B)) return OPS['.^'](A, B);
  if (!isScalar(B)) throw new MErr('En A^p, p tiene que ser un número (para potencias elemento a elemento, usa «.^»).', 0, 'mpower');
  if (A.r !== A.c) throw new MErr('Solo se puede elevar a una potencia (^) una matriz cuadrada (esta es ' + sizeStr(A) + '). Para elevar cada elemento, usa «.^».', 0, 'mpower');
  var p = B.re[0];
  if (!Number.isInteger(p) || B.im) { // como MATLAB: con autovalores, A^p = V·D^p·V^-1
    var d = eigDec(A, true), n = A.r, V = fromCx([].concat.apply([], d.vecs), n, n), Dp = M(n, n); Dp.im = new Float64Array(n * n);
    for (var t = 0; t < n; t++) { var z = cpow(d.vals[t][0], d.vals[t][1], B.re[0], B.im ? B.im[0] : 0); Dp.re[t * n + t] = z[0]; Dp.im[t * n + t] = z[1]; }
    return cleanIm(mrdivide(mtimes(V, cleanIm(Dp)), V, null));
  }
  var base = p < 0 ? inv(A, ctx) : A, e = Math.abs(p), R = eye(A.r, A.r);
  while (e) { if (e & 1) R = mtimes(R, base); e >>= 1; if (e) base = mtimes(base, base); }
  return R;
}
function rref(A, tolIn) {
  realOnly(A, 'rref');
  var m = A.r, n = A.c, a = toRows(A), tol = tolIn != null ? tolIn : Math.max(m, n) * EPS * normInf(A), jb = [], i = 0, j = 0;
  while (i < m && j < n) {
    var p = -1, k = i; for (var q = i; q < m; q++) if (Math.abs(a[q][j]) > p) { p = Math.abs(a[q][j]); k = q; }
    if (p <= tol) { for (q = i; q < m; q++) a[q][j] = 0; j++; continue; }
    jb.push(j);
    var t = a[i]; a[i] = a[k]; a[k] = t;
    var piv = a[i][j]; for (var c = j; c < n; c++) a[i][c] /= piv;
    for (q = 0; q < m; q++) { if (q === i) continue; var f = a[q][j]; if (f !== 0) for (c = j; c < n; c++) a[q][c] -= f * a[i][c]; }
    i++; j++;
  }
  return { R: fromRows(a.length ? a : []).r ? fromRows(a) : M(m, n), jb: jb };
}
// SVD de Jacobi por un lado (matrices pequeñas): A = U S V'
function svdDec(A) {
  realOnly(A, 'svd');
  var m = A.r, n = A.c, U = toRows(A), V = toRows(eye(n, n)), it = 0, rot = true;
  while (rot && it < 80) {
    rot = false; it++;
    for (var p = 0; p < n - 1; p++) for (var q = p + 1; q < n; q++) {
      var al = 0, be = 0, ga = 0;
      for (var i = 0; i < m; i++) { al += U[i][p] * U[i][p]; be += U[i][q] * U[i][q]; ga += U[i][p] * U[i][q]; }
      if (Math.abs(ga) <= 1e-15 * Math.sqrt(al * be) || ga === 0) continue;
      rot = true;
      var ze = (be - al) / (2 * ga), t = (ze >= 0 ? 1 : -1) / (Math.abs(ze) + Math.sqrt(1 + ze * ze)), c = 1 / Math.sqrt(1 + t * t), s = c * t;
      for (i = 0; i < m; i++) { var x = U[i][p], y = U[i][q]; U[i][p] = c * x - s * y; U[i][q] = s * x + c * y; }
      for (i = 0; i < n; i++) { x = V[i][p]; y = V[i][q]; V[i][p] = c * x - s * y; V[i][q] = s * x + c * y; }
    }
  }
  var sv = []; for (var j = 0; j < n; j++) { var s2 = 0; for (i = 0; i < m; i++) s2 += U[i][j] * U[i][j]; sv.push({ s: Math.sqrt(s2), j: j }); }
  sv.sort(function (a, b) { return b.s - a.s; });
  return { s: sv.map(function (o) { return o.s; }), order: sv.map(function (o) { return o.j; }), U: U, V: V, m: m, n: n };
}
function singVals(A) { var d = A.r < A.c ? svdDec(transpose(A, false)) : svdDec(A); return d.s.slice(0, Math.min(A.r, A.c)); }
function rank(A, tolIn) {
  if (!numel(A)) return 0;
  var s = singVals(A), tol = tolIn != null ? tolIn : Math.max(A.r, A.c) * epsOf(s[0] || 0), r = 0;
  s.forEach(function (x) { if (x > tol) r++; }); return r;
}
function nullR(A) {
  var n = A.c, rr = rref(A), r = rr.jb.length, nopiv = [];
  for (var j = 0; j < n; j++) if (rr.jb.indexOf(j) < 0) nopiv.push(j);
  var Z = M(n, n - r);
  nopiv.forEach(function (c, k) { Z.re[k * n + c] = 1; rr.jb.forEach(function (pc, i) { Z.re[k * n + pc] = -rr.R.re[c * A.r + i]; }); });
  return Z;
}
function nullO(A) {
  var d = svdDec(A), n = A.c, s = d.s, tol = Math.max(A.r, n) * (s[0] || 0) * EPS, r = 0;
  s.forEach(function (x, i) { if (i < Math.min(A.r, n) && x > tol) r++; });
  var Z = M(n, n - r);
  for (var k = r; k < n; k++) { var j = d.order[k]; for (var i = 0; i < n; i++) Z.re[(k - r) * n + i] = d.V[i][j]; }
  fixSign(Z); return Z;
}
function fixSign(Z) { for (var k = 0; k < Z.c; k++) { var f = 0; for (var i = 0; i < Z.r; i++) if (Math.abs(Z.re[k * Z.r + i]) > 1e-12) { f = Z.re[k * Z.r + i]; break; } if (f > 0) for (i = 0; i < Z.r; i++) Z.re[k * Z.r + i] = -Z.re[k * Z.r + i]; } }
function orth(A) {
  var d = svdDec(A), s = d.s, tol = Math.max(A.r, A.c) * (s[0] || 0) * EPS, r = 0;
  s.forEach(function (x, i) { if (i < Math.min(A.r, A.c) && x > tol) r++; });
  var Q = M(A.r, r);
  for (var k = 0; k < r; k++) { var j = d.order[k]; for (var i = 0; i < A.r; i++) Q.re[k * A.r + i] = d.U[i][j] / s[k]; }
  fixSign(Q); return Q;
}
function svdFull(A) { // [U,S,V] = svd(A)
  var m = A.r, n = A.c, tr = m < n, B = tr ? transpose(A, false) : A, d = svdDec(B), mm = B.r, nn = B.c;
  var U = M(mm, mm), S = M(mm, nn), V = M(nn, nn), cols = [];
  for (var k = 0; k < nn; k++) { var j = d.order[k]; S.re[k * mm + k] = d.s[k]; for (var i = 0; i < nn; i++) V.re[k * nn + i] = d.V[i][j]; if (d.s[k] > 1e-300) { var c = []; for (i = 0; i < mm; i++) c.push(d.U[i][j] / d.s[k]); cols.push(c); } }
  // completar U con una base ortonormal
  for (var e = 0; cols.length < mm && e < mm; e++) {
    var v = []; for (i = 0; i < mm; i++) v.push(i === e ? 1 : 0);
    cols.forEach(function (c) { var dd = 0; for (var t = 0; t < mm; t++) dd += c[t] * v[t]; for (t = 0; t < mm; t++) v[t] -= dd * c[t]; });
    var nv = Math.sqrt(v.reduce(function (s2, x) { return s2 + x * x; }, 0)); if (nv > 1e-8) cols.push(v.map(function (x) { return x / nv; }));
  }
  cols.forEach(function (c, k2) { for (var t = 0; t < mm; t++) U.re[k2 * mm + t] = c[t]; });
  if (tr) return { U: V, S: transpose(S, false), V: U };
  return { U: U, S: S, V: V };
}
function pinv(A) {
  var d = svdFull(A), s = [], r = Math.min(A.r, A.c);
  for (var k = 0; k < r; k++) s.push(d.S.re[k * d.S.r + k]);
  var tol = Math.max(A.r, A.c) * (s[0] || 0) * EPS, P = M(A.c, A.r);
  for (k = 0; k < r; k++) if (s[k] > tol) for (var i = 0; i < A.c; i++) for (var j = 0; j < A.r; j++) P.re[j * A.c + i] += d.V.re[k * A.c + i] * d.U.re[k * A.r + j] / s[k];
  return P;
}
function norm(A, p) {
  var vec = A.r === 1 || A.c === 1, n = numel(A), i, s = 0;
  if (!n) return 0;
  var ab = []; for (i = 0; i < n; i++) ab.push(cabs(A.re[i], A.im ? A.im[i] : 0));
  if (p === 'fro') { ab.forEach(function (x) { s += x * x; }); return Math.sqrt(s); }
  if (vec) {
    if (p == null || p === 2) { var sc2 = Math.max.apply(null, ab); if (!sc2) return 0; ab.forEach(function (x) { s += (x / sc2) * (x / sc2); }); return sc2 * Math.sqrt(s); }
    if (p === Infinity || p === 'inf' || p === 'Inf') return Math.max.apply(null, ab);
    if (p === -Infinity) return Math.min.apply(null, ab);
    if (p === 1) return ab.reduce(function (a, b) { return a + b; }, 0);
    ab.forEach(function (x) { s += Math.pow(x, p); }); return Math.pow(s, 1 / p);
  }
  if (p == null || p === 2) {
    if (A.im) { var m2 = A.r, n2 = A.c, B = M(2 * m2, 2 * n2); for (var ii = 0; ii < m2; ii++) for (var jj = 0; jj < n2; jj++) { var x = A.re[jj * m2 + ii], y = A.im[jj * m2 + ii]; B.re[jj * 2 * m2 + ii] = x; B.re[(jj + n2) * 2 * m2 + ii] = -y; B.re[jj * 2 * m2 + ii + m2] = y; B.re[(jj + n2) * 2 * m2 + ii + m2] = x; } return singVals(B)[0]; }
    return singVals(A)[0];
  }
  if (p === 1) return norm1(A);
  if (p === Infinity || p === 'inf' || p === 'Inf') return normInf(A);
  throw new MErr('norm de una matriz admite 1, 2, Inf o \'fro\'.', 0, 'norm');
}
// ----- autovalores -----
function isSym(A) { if (A.r !== A.c || A.im) return false; var tol = 0; for (var i = 0; i < A.r; i++) for (var j = 0; j < i; j++) if (A.re[j * A.r + i] !== A.re[i * A.r + j]) return false; return true; }
function jacobiEig(A) {
  var n = A.r, a = toRows(A), V = toRows(eye(n, n));
  for (var sweep = 0; sweep < 100; sweep++) {
    var off = 0; for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) off += a[i][j] * a[i][j];
    if (off < 1e-30) break;
    for (var p = 0; p < n - 1; p++) for (var q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      var th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = (th >= 0 ? 1 : -1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (var k = 0; k < n; k++) { var akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
      for (k = 0; k < n; k++) { var apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
      for (k = 0; k < n; k++) { var vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  var idx = []; for (i = 0; i < n; i++) idx.push(i);
  idx.sort(function (x, y) { return a[x][x] - a[y][y]; });
  var vals = idx.map(function (i2) { return [a[i2][i2], 0]; }), vecs = idx.map(function (i2) {
    var v = []; for (var k2 = 0; k2 < n; k2++) v.push(V[k2][i2]);
    var last = -1; v.forEach(function (x, k3) { if (Math.abs(x) > 1e-12) last = k3; });
    if (last >= 0 && v[last] < 0) v = v.map(function (x) { return -x; });
    return v.map(function (x) { return [x, 0]; });
  });
  return { vals: vals, vecs: vecs };
}
function hqr(A) { // Hessenberg + QR de doble paso (Numerical Recipes), autovalores en su posición
  var n = A.r, a = toRows(A), i, j, k, m;
  // reducción a Hessenberg con reflexiones de Householder (como LAPACK)
  var x, y, t;
  for (m = 1; m < n - 1; m++) {
    var sg = 0; for (i = m; i < n; i++) sg += a[i][m - 1] * a[i][m - 1];
    var al = Math.sqrt(sg); if (al === 0) continue;
    var a0 = a[m][m - 1], be = a0 >= 0 ? -al : al, v = [];
    v[m] = a0 - be; for (i = m + 1; i < n; i++) v[i] = a[i][m - 1];
    var vn = 0; for (i = m; i < n; i++) vn += v[i] * v[i]; if (!vn) continue;
    for (j = 0; j < n; j++) { var d = 0; for (i = m; i < n; i++) d += v[i] * a[i][j]; d = 2 * d / vn; for (i = m; i < n; i++) a[i][j] -= d * v[i]; }
    for (i = 0; i < n; i++) { d = 0; for (j = m; j < n; j++) d += a[i][j] * v[j]; d = 2 * d / vn; for (j = m; j < n; j++) a[i][j] -= d * v[j]; }
  }
  for (i = 2; i < n; i++) for (j = 0; j < i - 1; j++) a[i][j] = 0;
  var wr = new Array(n).fill(0), wi = new Array(n).fill(0), nn = n - 1, anorm = 0, tt = 0, its, l, p = 0, q = 0, r = 0, s, w, z;
  for (i = 0; i < n; i++) for (j = Math.max(i - 1, 0); j < n; j++) anorm += Math.abs(a[i][j]);
  while (nn >= 0) {
    its = 0;
    do {
      for (l = nn; l >= 1; l--) { s = Math.abs(a[l - 1][l - 1]) + Math.abs(a[l][l]); if (s === 0) s = anorm; if (Math.abs(a[l][l - 1]) + s === s) { a[l][l - 1] = 0; break; } }
      x = a[nn][nn];
      if (l === nn) { wr[nn] = x + tt; wi[nn--] = 0; }
      else {
        y = a[nn - 1][nn - 1]; w = a[nn][nn - 1] * a[nn - 1][nn];
        if (l === nn - 1) {
          p = 0.5 * (y - x); q = p * p + w; z = Math.sqrt(Math.abs(q)); x += tt;
          if (q >= 0) { z = p + (p >= 0 ? Math.abs(z) : -Math.abs(z)); wr[nn - 1] = wr[nn] = x + z; if (z) wr[nn] = x - w / z; wi[nn - 1] = wi[nn] = 0; }
          else { wr[nn - 1] = wr[nn] = x + p; wi[nn - 1] = z; wi[nn] = -z; }
          nn -= 2;
        } else {
          if (its === 60) throw new MErr('No se han podido calcular los autovalores (no converge).', 0, 'eig');
          if (its === 10 || its === 20) { tt += x; for (i = 0; i <= nn; i++) a[i][i] -= x; s = Math.abs(a[nn][nn - 1]) + Math.abs(a[nn - 1][nn - 2]); y = x = 0.75 * s; w = -0.4375 * s * s; }
          ++its;
          for (m = nn - 2; m >= l; m--) {
            z = a[m][m]; r = x - z; s = y - z;
            p = (r * s - w) / a[m + 1][m] + a[m][m + 1]; q = a[m + 1][m + 1] - z - r - s; r = a[m + 2][m + 1];
            s = Math.abs(p) + Math.abs(q) + Math.abs(r); p /= s; q /= s; r /= s;
            if (m === l) break;
            var u = Math.abs(a[m][m - 1]) * (Math.abs(q) + Math.abs(r)), v = Math.abs(p) * (Math.abs(a[m - 1][m - 1]) + Math.abs(z) + Math.abs(a[m + 1][m + 1]));
            if (u + v === v) break;
          }
          for (i = m + 2; i <= nn; i++) { a[i][i - 2] = 0; if (i !== m + 2) a[i][i - 3] = 0; }
          for (k = m; k <= nn - 1; k++) {
            if (k !== m) { p = a[k][k - 1]; q = a[k + 1][k - 1]; r = 0; if (k !== nn - 1) r = a[k + 2][k - 1]; if ((x = Math.abs(p) + Math.abs(q) + Math.abs(r)) !== 0) { p /= x; q /= x; r /= x; } }
            s = Math.sqrt(p * p + q * q + r * r); if (p < 0) s = -s;
            if (s !== 0) {
              if (k === m) { if (l !== m) a[k][k - 1] = -a[k][k - 1]; } else a[k][k - 1] = -s * x;
              p += s; x = p / s; y = q / s; z = r / s; q /= p; r /= p;
              for (j = k; j <= nn; j++) { p = a[k][j] + q * a[k + 1][j]; if (k !== nn - 1) { p += r * a[k + 2][j]; a[k + 2][j] -= p * z; } a[k + 1][j] -= p * y; a[k][j] -= p * x; }
              var mmin = nn < k + 3 ? nn : k + 3;
              for (i = l; i <= mmin; i++) { p = x * a[i][k] + y * a[i][k + 1]; if (k !== nn - 1) { p += z * a[i][k + 2]; a[i][k + 2] -= p * r; } a[i][k + 1] -= p * q; a[i][k] -= p; }
            }
          }
        }
      }
    } while (l < nn - 1);
  }
  var out = []; for (i = 0; i < n; i++) out.push([wr[i], wi[i]]);
  return out;
}
function balanceP(A) { // la parte de permutaciones de dgebal: aísla autovalores (filas abajo, columnas arriba)
  var n = A.r, a = toRows(A), k = 0, l = n - 1, i, j, again;
  function swap(p, q) { if (p === q) return; var t = a[p]; a[p] = a[q]; a[q] = t; for (var r = 0; r < n; r++) { t = a[r][p]; a[r][p] = a[r][q]; a[r][q] = t; } }
  do { again = false;
    for (j = l; j >= 0; j--) { var z = true; for (i = 0; i <= l; i++) if (i !== j && a[j][i] !== 0) { z = false; break; } if (z) { swap(j, l); if (l === 0) return fromRows(a); l--; again = true; break; } }
  } while (again);
  do { again = false;
    for (j = k; j <= l; j++) { z = true; for (i = k; i <= l; i++) if (i !== j && a[i][j] !== 0) { z = false; break; } if (z) { swap(j, k); k++; again = true; break; } }
  } while (again);
  return fromRows(a);
}
function cnull(A, lr, li) { // núcleo de (A - λI) en complejos, con tolerancia
  var n = A.r, re = [], im = [], i, j;
  for (i = 0; i < n; i++) { re.push([]); im.push([]); for (j = 0; j < n; j++) { re[i].push(A.re[j * n + i] - (i === j ? lr : 0)); im[i].push(i === j ? -li : 0); } }
  var nrm = 0; for (i = 0; i < n; i++) for (j = 0; j < n; j++) nrm = Math.max(nrm, cabs(re[i][j], im[i][j]));
  var tol = Math.max(1e-9 * Math.max(nrm, Math.hypot(lr, li), 1), 1e-12), piv = [], row = 0;
  for (var c = 0; c < n && row < n; c++) {
    var p = -1, best = tol; for (i = row; i < n; i++) { var v = cabs(re[i][c], im[i][c]); if (v > best) { best = v; p = i; } }
    if (p < 0) continue;
    var t = re[p]; re[p] = re[row]; re[row] = t; t = im[p]; im[p] = im[row]; im[row] = t;
    var pr = re[row][c], pi = im[row][c];
    for (j = 0; j < n; j++) { var q = cdiv(re[row][j], im[row][j], pr, pi); re[row][j] = q[0]; im[row][j] = q[1]; }
    for (i = 0; i < n; i++) if (i !== row) { var fr = re[i][c], fi = im[i][c]; if (fr || fi) for (j = 0; j < n; j++) { var m2 = cmul(fr, fi, re[row][j], im[row][j]); re[i][j] -= m2[0]; im[i][j] -= m2[1]; } }
    piv.push(c); row++;
  }
  var free = []; for (c = 0; c < n; c++) if (piv.indexOf(c) < 0) free.push(c);
  var vecs = free.map(function (f) { var v = []; for (var k = 0; k < n; k++) v.push([k === f ? 1 : 0, 0]); piv.forEach(function (pc, r2) { v[pc] = [-re[r2][f], -im[r2][f]]; }); return v; });
  // Gram-Schmidt y norma 1
  var outv = [];
  vecs.forEach(function (v) {
    outv.forEach(function (u) { var dr = 0, di = 0; for (var k = 0; k < n; k++) { var m3 = cmul(u[k][0], -u[k][1], v[k][0], v[k][1]); dr += m3[0]; di += m3[1]; } for (k = 0; k < n; k++) { var m4 = cmul(dr, di, u[k][0], u[k][1]); v[k][0] -= m4[0]; v[k][1] -= m4[1]; } });
    var nv = 0; v.forEach(function (z) { nv += z[0] * z[0] + z[1] * z[1]; }); nv = Math.sqrt(nv);
    if (nv > 1e-12) outv.push(v.map(function (z) { return [z[0] / nv, z[1] / nv]; }));
  });
  return outv;
}
function eigDec(A, wantV) {
  if (A.r !== A.c) throw new MErr('La matriz tiene que ser cuadrada para calcular autovalores (eig) (esta es ' + sizeStr(A) + ').', 0, 'square', 'Input matrix must be square.'); realOnly(A, 'eig');
  var n = A.r; if (!n) return { vals: [], vecs: [] };
  if (isSym(A)) { var J = jacobiEig(A); J.vals.forEach(function (z) { var rr = Math.round(z[0]); if (Math.abs(z[0] - rr) <= 8 * EPS * Math.max(1, Math.abs(rr))) z[0] = rr; }); return J; }
  var ev = hqr(balanceP(A)); for (var i = 0; i < n; i++) { var rr0 = Math.round(ev[i][0]); if (Math.abs(ev[i][0] - rr0) <= 8 * EPS * Math.max(1, Math.abs(rr0))) ev[i][0] = rr0; if (Math.abs(ev[i][1]) < 1e-14 * Math.max(1, Math.abs(ev[i][0]))) ev[i][1] = 0; }
  if (!wantV) return { vals: ev };
  // vectores: agrupar autovalores repetidos y sacar el núcleo una vez
  var vecs = [], used = {};
  for (i = 0; i < n; i++) {
    var key = null; for (var k in used) { var u = used[k]; if (Math.hypot(u.l[0] - ev[i][0], u.l[1] - ev[i][1]) < 1e-7 * Math.max(1, Math.hypot(ev[i][0], ev[i][1]))) { key = k; break; } }
    if (key == null) { key = 'k' + i; var base = cnull(A, ev[i][0], ev[i][1]); if (!base.length) base = cnull2(A, ev[i]); used[key] = { l: ev[i], base: base, n: 0 }; }
    var U = used[key], v = U.base[Math.min(U.n, U.base.length - 1)]; U.n++;
    // signo como LAPACK: componente de mayor módulo con parte real positiva (para que se parezca)
    var big = -1; v.forEach(function (z, k2) { if (cabs(z[0], z[1]) > 1e-12) big = k2; });
    if (big >= 0 && ev[i][1] === 0 && v[big][0] < 0) v = v.map(function (z) { return [-z[0], -z[1]]; });
    vecs.push(v);
  }
  return { vals: ev, vecs: vecs };
}
function cnull2(A, l) { // tolerancia más ancha por si el autovalor no es exacto
  var n = A.r, v = []; for (var i = 0; i < n; i++) v.push([1, 0]);
  var B = M(n, n); B.im = new Float64Array(n * n);
  for (i = 0; i < n * n; i++) B.re[i] = A.re[i]; for (i = 0; i < n; i++) { B.re[i * n + i] -= l[0] + 1e-10; B.im[i * n + i] -= l[1]; }
  var x = M(n, 1); x.im = new Float64Array(n); for (i = 0; i < n; i++) x.re[i] = 1;
  for (var it = 0; it < 3; it++) { x = toC(solveLU(B, x, null)); var nr = 0; for (i = 0; i < n; i++) nr += x.re[i] * x.re[i] + x.im[i] * x.im[i]; nr = Math.sqrt(nr); for (i = 0; i < n; i++) { x.re[i] /= nr; x.im[i] /= nr; } }
  var out = []; for (i = 0; i < n; i++) out.push([x.re[i], x.im[i]]); return [out];
}
function charPoly(A) { // Faddeev–LeVerrier: coeficientes de det(λI − A)
  needSq(A, 'el polinomio característico'); var n = A.r, c = [1], Mk = M(n, n);
  for (var k = 1; k <= n; k++) {
    var AM = mtimes(A, Mk); var Mn = copy(AM); for (var i = 0; i < n; i++) Mn.re[i * n + i] += c[k - 1];
    Mk = Mn; var AM2 = mtimes(A, Mk), tr = 0; for (i = 0; i < n; i++) tr += AM2.re[i * n + i];
    c.push(-tr / k);
  }
  return c.map(function (x) { var r = Math.round(x); return Math.abs(x - r) < 1e-9 * Math.max(1, Math.abs(x)) ? r : x; });
}
