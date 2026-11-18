/* sl-matlab · funciones. Las que no devuelven nada (disp, fprintf, format…) están en NOANS. */
var NOANS = { assert: 1, eval: 1, disp: 1, fprintf: 1, format: 1, clc: 1, clear: 1, syms: 1, help: 1, who: 1, whos: 1, close: 1, figure: 1, hold: 1, grid: 1, warning: 1, display: 1, error: 1, clearvars: 1 };
function argN(args, i, name) { if (args.length <= i) throw new MErr('Faltan argumentos en ' + name + '.', 0, 'nargs'); return args[i]; }
function numArg(args, i, name, def) { if (args.length <= i) { if (def !== undefined) return def; throw new MErr('Faltan argumentos en ' + name + '.', 0, 'nargs'); } return num(args[i], 'El argumento ' + (i + 1) + ' de ' + name); }
function mArg(args, i, name) { var v = argN(args, i, name); if (v.k === 'y') return v; if (v.k !== 'm') throw new MErr(name + ' necesita una matriz.', 0, 'arg'); return v; }
function realM(v, name) { if (v.k === 'y') v = symToNum(v); if (v.k !== 'm') throw new MErr(name + ' necesita números.', 0, 'arg'); return unlg(v); }
function multi(a) { return { multi: a }; }
function mapEl(fn, cxfn) { return function (args, ctx, nout, name) {
  var v = realM(argN(args, 0, name), name);
  if (v.im || (cxfn && cxfn.need && Array.prototype.some.call(v.re, cxfn.need))) {
    if (!cxfn) throw new MErr(name + ' con números complejos no está disponible.', 0, 'cx');
    var R = M(v.r, v.c); R.im = new Float64Array(v.re.length);
    for (var i = 0; i < v.re.length; i++) { var z = cxfn.f(v.re[i], v.im ? v.im[i] : 0); R.re[i] = z[0]; R.im[i] = z[1]; }
    return cleanIm(R);
  }
  var R2 = M(v.r, v.c); for (var j = 0; j < v.re.length; j++) R2.re[j] = fn(v.re[j]); return R2;
}; }
function realPart(fn) { return function (args, ctx, nout, name) { var v = realM(argN(args, 0, name), name), R = M(v.r, v.c); for (var i = 0; i < v.re.length; i++) R.re[i] = fn(v.re[i], v.im ? v.im[i] : 0); return R; }; }
function dimOf(v, args, i) { if (args.length > i) return numArg(args, i, 'la dimensión'); return v.r !== 1 ? 1 : 2; }
function reduce(v, dim, f, init) { // f(acc, x) sobre filas o columnas
  var R; if (dim === 1) { R = M(v.r ? 1 : 1, v.c); for (var j = 0; j < v.c; j++) { var a = init; for (var i = 0; i < v.r; i++) a = f(a, v.re[j * v.r + i]); R.re[j] = a; } }
  else { R = M(v.r, 1); for (i = 0; i < v.r; i++) { a = init; for (j = 0; j < v.c; j++) a = f(a, v.re[j * v.r + i]); R.re[i] = a; } }
  return R;
}
function cxColsReduce(v, dim, re0, im0, f) {
  var R = dim === 1 ? M(1, v.c) : M(v.r, 1); R.im = new Float64Array(R.re.length);
  var outer = dim === 1 ? v.c : v.r, inner = dim === 1 ? v.r : v.c;
  for (var o = 0; o < outer; o++) { var a = [re0, im0]; for (var t = 0; t < inner; t++) { var k = dim === 1 ? o * v.r + t : t * v.r + o; a = f(a, [v.re[k], v.im[k]]); } R.re[o] = a[0]; R.im[o] = a[1]; }
  return cleanIm(R);
}
function sizeArgs(args, name) {
  if (!args.length) return [1, 1];
  if (args.length === 1) { var v = realM(args[0], name); if (numel(v) === 1) return [v.re[0], v.re[0]]; return [v.re[0], v.re[1]]; }
  return [numArg(args, 0, name), numArg(args, 1, name)];
}
function colVec(list) { var m = M(list.length, 1); list.forEach(function (x, i) { m.re[i] = x; }); return m; }
function fromCx(list, r, c) { var m = M(r, c), cx = list.some(function (z) { return z[1] !== 0; }); if (cx) m.im = new Float64Array(r * c); list.forEach(function (z, i) { m.re[i] = z[0]; if (cx) m.im[i] = z[1]; }); return m; }
function symNumOnly(v, name) { if (v.k === 'y') { if (!yIsNum(v)) throw new MErr(name + ' de una matriz con variables simbólicas no está disponible en este entorno.', 0, 'sym'); } return v; }

var BUILTIN = {
  pi: function () { return sc(Math.PI); }, eps: function (a) { return sc(a.length ? epsOf(num(a[0])) : EPS); },
  Inf: function () { return sc(Infinity); }, inf: function () { return sc(Infinity); }, NaN: function () { return sc(NaN); }, nan: function () { return sc(NaN); },
  i: function () { return sc(0, 1); }, j: function () { return sc(0, 1); }, true: function (a) { if (!a.length) return lg(sc(1)); var s = sizeArgs(a, 'true'), m = M(s[0], s[1]); m.re.fill(1); return lg(m); }, false: function (a) { if (!a.length) return lg(sc(0)); var s = sizeArgs(a, 'false'); return lg(M(s[0], s[1])); },
  zeros: function (a) { var s = sizeArgs(a, 'zeros'); return M(s[0], s[1]); },
  ones: function (a) { var s = sizeArgs(a, 'ones'), m = M(s[0], s[1]); m.re.fill(1); return m; },
  eye: function (a) { var s = sizeArgs(a, 'eye'); return eye(s[0], s[1]); },
  rand: function (a) { var s = sizeArgs(a, 'rand'), m = M(s[0], s[1]); for (var i = 0; i < m.re.length; i++) m.re[i] = Math.random(); return m; },
  randi: function (a) { var mx = realM(argN(a, 0, 'randi'), 'randi'), lo = numel(mx) > 1 ? mx.re[0] : 1, hi = numel(mx) > 1 ? mx.re[1] : mx.re[0], s = sizeArgs(a.slice(1), 'randi'), m = M(s[0], s[1]); for (var i = 0; i < m.re.length; i++) m.re[i] = lo + Math.floor(Math.random() * (hi - lo + 1)); return m; },
  magic: function (a) { var n = numArg(a, 0, 'magic'); if (n === 3) return fromRows([[8, 1, 6], [3, 5, 7], [4, 9, 2]]); if (n === 4) return fromRows([[16, 2, 3, 13], [5, 11, 10, 8], [9, 7, 6, 12], [4, 14, 15, 1]]); if (n % 2) { var m = M(n, n), i = 0, j = (n - 1) / 2; for (var k = 1; k <= n * n; k++) { m.re[j * n + i] = k; var i2 = (i - 1 + n) % n, j2 = (j + 1) % n; if (m.re[j2 * n + i2]) { i2 = (i + 1) % n; j2 = j; } i = i2; j = j2; } return m; } throw new MErr('magic(n) aquí solo para n impar, 3 o 4.', 0, 'magic'); },
  size: function (a, ctx, nout) {
    var v = argN(a, 0, 'size'), sh = v.k === 'm' || v.k === 'y' || v.k === 'c' ? [v.r, v.c] : [1, 1];
    if (a.length > 1) { var d = numArg(a, 1, 'size'); return sc(d === 1 ? sh[0] : d === 2 ? sh[1] : 1); }
    if (nout > 1) { var o = [sc(sh[0]), sc(sh[1])]; while (o.length < nout) o.push(sc(1)); return multi(o); }
    var m = M(1, 2); m.re[0] = sh[0]; m.re[1] = sh[1]; return m;
  },
  length: function (a) { var v = argN(a, 0, 'length'); return sc(v.r * v.c === 0 ? 0 : Math.max(v.r, v.c)); },
  numel: function (a) { var v = argN(a, 0, 'numel'); return sc(v.r * v.c); },
  ndims: function () { return sc(2); },
  isempty: function (a) { var v = argN(a, 0, 'isempty'); return lg(sc(v.r * v.c === 0 ? 1 : 0)); },
  isequal: function (a) { var x = argN(a, 0, 'isequal'); for (var k = 1; k < a.length; k++) { var y = a[k]; if (x.k === 'y' || y.k === 'y') { var X = toSym(x), Yy = toSym(y); if (X.r !== Yy.r || X.c !== Yy.c) return lg(sc(0)); for (var i = 0; i < X.d.length; i++) if (psub(X.d[i], Yy.d[i]).t.size) return lg(sc(0)); continue; } if (x.r !== y.r || x.c !== y.c) return lg(sc(0)); for (i = 0; i < x.re.length; i++) if (x.re[i] !== y.re[i] || ((x.im ? x.im[i] : 0) !== (y.im ? y.im[i] : 0))) return lg(sc(0)); } return lg(sc(1)); },
  det: function (a) { var A = mArg(a, 0, 'det'); if (A.k === 'y') return Y(1, 1, [ydet(A)]); return det(A); },
  inv: function (a, ctx) {
    var A = mArg(a, 0, 'inv');
    if (A.k === 'y') { symNumOnly(A, 'inv'); if (A.r !== A.c) throw new MErr('La matriz tiene que ser cuadrada para calcular la inversa (inv).', 0, 'square'); var n = A.r, q = yqrows(A); for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) q[i].push(i === j ? Q1 : Q0); var jb = qrref(q, n, 2 * n); if (jb.length < n || jb[n - 1] !== n - 1) { ctx.warn('La matriz es singular: no tiene inversa.', 'Matrix is singular to working precision.'); var R = Y(n, n); return R; } var Rr = []; for (i = 0; i < n; i++) Rr.push(q[i].slice(n)); return yfromq(Rr, n, n); }
    return inv(A, ctx);
  },
  rank: function (a) { var A = mArg(a, 0, 'rank'); if (A.k === 'y') { symNumOnly(A, 'rank'); var q = yqrows(A); return sc(qrref(q, A.r, A.c).length); } return sc(rank(A, a.length > 1 ? numArg(a, 1, 'rank') : null)); },
  rref: function (a, ctx, nout) {
    var A = mArg(a, 0, 'rref');
    if (A.k === 'y') { symNumOnly(A, 'rref'); var q = yqrows(A), jb = qrref(q, A.r, A.c), R = yfromq(q, A.r, A.c); return nout > 1 ? multi([R, rowOf(jb)]) : R; }
    var o = rref(A, a.length > 1 ? numArg(a, 1, 'rref') : null);
    return nout > 1 ? multi([o.R, rowOf(o.jb)]) : o.R;
  },
  null: function (a) { var A = realM(mArg(a, 0, 'null'), 'null'); var opt = a.length > 1 && a[1].ch ? str(a[1]) : ''; if (opt === 'r' || opt === 'rational') return nullR(A); return nullO(A); },
  orth: function (a) { return orth(realM(mArg(a, 0, 'orth'), 'orth')); },
  trace: function (a) { var A = mArg(a, 0, 'trace'); if (A.r !== A.c) throw new MErr('trace necesita una matriz cuadrada.', 0, 'square'); if (A.k === 'y') { var s = P(); for (var i = 0; i < A.r; i++) s = padd(s, A.d[i * A.r + i]); return Y(1, 1, [s]); } var t = 0, ti = 0; for (i = 0; i < A.r; i++) { t += A.re[i * A.r + i]; if (A.im) ti += A.im[i * A.r + i]; } return sc(t, ti); },
  transpose: function (a) { var v = argN(a, 0, 'transpose'); return v.k === 'y' ? ytr(v) : transpose(v, false); },
  ctranspose: function (a) { var v = argN(a, 0, 'ctranspose'); return v.k === 'y' ? ytr(v) : transpose(v, true); },
  diag: function (a) {
    var v = argN(a, 0, 'diag'), k = a.length > 1 ? numArg(a, 1, 'diag') : 0, isY = v.k === 'y';
    if (v.r === 1 || v.c === 1) { var n = v.r * v.c + Math.abs(k), R = isY ? Y(n, n) : M(n, n); if (!isY && v.im) R.im = new Float64Array(n * n); for (var t = 0; t < v.r * v.c; t++) { var i = k >= 0 ? t : t - k, j = k >= 0 ? t + k : t; if (isY) R.d[j * n + i] = v.d[t]; else { R.re[j * n + i] = v.re[t]; if (v.im) R.im[j * n + i] = v.im[t]; } } return R; }
    var out = []; for (t = 0; ; t++) { i = k >= 0 ? t : t - k; j = k >= 0 ? t + k : t; if (i >= v.r || j >= v.c) break; out.push(j * v.r + i); }
    if (isY) return Y(out.length, 1, out.map(function (x) { return v.d[x]; }));
    var D = M(out.length, 1); if (v.im) D.im = new Float64Array(out.length); out.forEach(function (x, q) { D.re[q] = v.re[x]; if (v.im) D.im[q] = v.im[x]; }); return D;
  },
  triu: function (a) { var v = copy(realM(argN(a, 0, 'triu'), 'triu')), k = a.length > 1 ? numArg(a, 1, 'triu') : 0; for (var i = 0; i < v.r; i++) for (var j = 0; j < v.c; j++) if (j - i < k) v.re[j * v.r + i] = 0; return v; },
  tril: function (a) { var v = copy(realM(argN(a, 0, 'tril'), 'tril')), k = a.length > 1 ? numArg(a, 1, 'tril') : 0; for (var i = 0; i < v.r; i++) for (var j = 0; j < v.c; j++) if (j - i > k) v.re[j * v.r + i] = 0; return v; },
  abs: function (a) { var v = argN(a, 0, 'abs'); if (v.k === 'y') v = symToNum(v); var R = M(v.r, v.c); for (var i = 0; i < v.re.length; i++) R.re[i] = cabs(v.re[i], v.im ? v.im[i] : 0); return R; },
  sqrt: mapEl(Math.sqrt, { need: function (x) { return x < 0; }, f: csqrt }),
  exp: mapEl(Math.exp, { f: function (a, b) { var e = Math.exp(a); return [e * Math.cos(b), e * Math.sin(b)]; } }),
  log: mapEl(Math.log, { need: function (x) { return x < 0; }, f: function (a, b) { return [Math.log(cabs(a, b)), Math.atan2(b, a)]; } }),
  log10: mapEl(Math.log10, { need: function (x) { return x < 0; }, f: function (a, b) { return [Math.log(cabs(a, b)) / Math.LN10, Math.atan2(b, a) / Math.LN10]; } }), log2: mapEl(Math.log2, { need: function (x) { return x < 0; }, f: function (a, b) { return [Math.log(cabs(a, b)) / Math.LN2, Math.atan2(b, a) / Math.LN2]; } }),
  sin: mapEl(Math.sin, { f: csin }), cos: mapEl(Math.cos, { f: ccos }), tan: mapEl(Math.tan, { f: function (a, b) { var s = csin(a, b), c = ccos(a, b); return cdiv(s[0], s[1], c[0], c[1]); } }),
  asin: mapEl(Math.asin, { need: function (x) { return Math.abs(x) > 1; }, f: casin }), acos: mapEl(Math.acos, { need: function (x) { return Math.abs(x) > 1; }, f: cacos }),
  atan: mapEl(Math.atan, { f: catan }),
  asind: mapEl(function (x) { return Math.asin(x) * 180 / Math.PI; }, { need: function (x) { return Math.abs(x) > 1; }, f: function (a, b) { var z = casin(a, b); return [z[0] * 180 / Math.PI, z[1] * 180 / Math.PI]; } }),
  acosd: mapEl(function (x) { return x === 0 ? 90 : Math.acos(x) * 180 / Math.PI; }, { need: function (x) { return Math.abs(x) > 1; }, f: function (a, b) { var z = cacos(a, b); return [z[0] * 180 / Math.PI, z[1] * 180 / Math.PI]; } }),
  atan2d: function (a) { return OPSf(a, function (y, x) { return Math.atan2(y, x) * 180 / Math.PI; }, 'atan2d'); },
  rad2deg: mapEl(function (x) { return x * 180 / Math.PI; }, { f: function (a, b) { return [a * 180 / Math.PI, b * 180 / Math.PI]; } }),
  deg2rad: mapEl(function (x) { return x * Math.PI / 180; }, { f: function (a, b) { return [a * Math.PI / 180, b * Math.PI / 180]; } }),
  nthroot: function (a) {
    var x = realM(argN(a, 0, 'nthroot'), 'nthroot'), nn = realM(argN(a, 1, 'nthroot'), 'nthroot');
    if (x.im || nn.im) throw new MErr('nthroot solo admite números reales: para raíces complejas usa la forma polar (abs, angle) o z^(1/n).', 0, 'cx');
    return ew(x, nn, function (v, k) { if (v < 0 && !(Number.isInteger(k) && k % 2)) throw new MErr('Si X es negativo, N tiene que ser un entero impar.', 0, 'arg'); var r = v < 0 ? -Math.pow(-v, 1 / k) : Math.pow(v, 1 / k), rr = Math.round(r); return Math.abs(rr - r) < 1e-12 * Math.max(1, Math.abs(r)) && Math.pow(rr, k) === v ? rr : r; }, null, 'nthroot');
  },
  cart2pol: function (a, ctx, nout) {
    var x = realM(argN(a, 0, 'cart2pol'), 'cart2pol'), y = realM(argN(a, 1, 'cart2pol'), 'cart2pol');
    var th = ew(y, x, Math.atan2, null, 'cart2pol'), rho = ew(x, y, Math.hypot, null, 'cart2pol');
    return nout > 1 ? multi(a.length > 2 ? [th, rho, a[2]] : [th, rho]) : th;
  },
  pol2cart: function (a, ctx, nout) {
    var th = realM(argN(a, 0, 'pol2cart'), 'pol2cart'), rho = realM(argN(a, 1, 'pol2cart'), 'pol2cart');
    var X = ew(th, rho, function (t, r) { return r * Math.cos(t); }, null, 'pol2cart'), Yv = ew(th, rho, function (t, r) { return r * Math.sin(t); }, null, 'pol2cart');
    return nout > 1 ? multi(a.length > 2 ? [X, Yv, a[2]] : [X, Yv]) : X;
  },
  conv: function (a) {
    var u = cxList(realM(argN(a, 0, 'conv'), 'conv')), v = cxList(realM(argN(a, 1, 'conv'), 'conv'));
    if (!u.length || !v.length) return M(1, 0);
    var w = []; for (var k = 0; k < u.length + v.length - 1; k++) w.push([0, 0]);
    for (var i = 0; i < u.length; i++) for (var j = 0; j < v.length; j++) { var t = cmul(u[i][0], u[i][1], v[j][0], v[j][1]); w[i + j][0] += t[0]; w[i + j][1] += t[1]; }
    var col = a[0].c === 1 && a[0].r > 1 && !(a[1].r === 1 && a[1].c > 1);
    return fromCx(w, col ? w.length : 1, col ? 1 : w.length);
  },
  deconv: function (a, ctx, nout) {
    var u = cxList(realM(argN(a, 0, 'deconv'), 'deconv')), v = cxList(realM(argN(a, 1, 'deconv'), 'deconv'));
    while (v.length && v[0][0] === 0 && v[0][1] === 0) v.shift();
    if (!v.length) throw new MErr('El primer coeficiente del divisor no puede ser 0.', 0, 'arg');
    var r = u.map(function (z) { return z.slice(); }), nq = u.length - v.length + 1, q = [];
    if (nq < 1) { q = [[0, 0]]; } else for (var i = 0; i < nq; i++) {
      var c = cdiv(r[i][0], r[i][1], v[0][0], v[0][1]); q.push(c);
      for (var j = 0; j < v.length; j++) { var t = cmul(c[0], c[1], v[j][0], v[j][1]); r[i + j][0] -= t[0]; r[i + j][1] -= t[1]; }
    }
    r.forEach(function (z, k) { var sc0 = 1e-12 * Math.max(1, Math.abs(u[k][0]) + Math.abs(u[k][1])); if (Math.abs(z[0]) < sc0) z[0] = 0; if (Math.abs(z[1]) < sc0) z[1] = 0; });
    var Q = fromCx(q, 1, q.length), Rm = fromCx(r, 1, r.length);
    return nout > 1 ? multi([Q, Rm]) : Q;
  },
  sind: mapEl(function (x) { return x % 180 === 0 ? 0 : Math.sin(x * Math.PI / 180); }), cosd: mapEl(function (x) { return (x - 90) % 180 === 0 ? 0 : Math.cos(x * Math.PI / 180); }),
  tand: mapEl(function (x) { return Math.tan(x * Math.PI / 180); }), atand: mapEl(function (x) { return Math.atan(x) * 180 / Math.PI; }),
  atan2: function (a) { return OPSf(a, Math.atan2, 'atan2'); },
  round: mapEl(rnd0, { f: function (a, b) { return [rnd0(a), rnd0(b)]; } }), floor: mapEl(Math.floor, { f: function (a, b) { return [Math.floor(a), Math.floor(b)]; } }), ceil: mapEl(Math.ceil, { f: function (a, b) { return [Math.ceil(a), Math.ceil(b)]; } }), fix: mapEl(Math.trunc, { f: function (a, b) { return [Math.trunc(a), Math.trunc(b)]; } }),
  sign: mapEl(Math.sign, { f: function (a, b) { var m = cabs(a, b); return m ? [a / m, b / m] : [0, 0]; } }),
  mod: function (a) { return OPSf(a, function (x, y) { if (y === 0) return x; var r = x - Math.floor(x / y) * y; return Math.abs(r - y) < 1e-12 * Math.abs(y) ? 0 : r; }, 'mod'); },
  rem: function (a) { return OPSf(a, function (x, y) { return y === 0 ? NaN : x - Math.trunc(x / y) * y; }, 'rem'); },
  real: realPart(function (r) { return r; }), imag: realPart(function (r, i) { return i; }),
  angle: realPart(function (r, i) { return Math.atan2(i, r); }),
  conj: function (a) { var v = argN(a, 0, 'conj'); if (v.k === 'y') return v; var R = copy(v); if (R.im) for (var i = 0; i < R.im.length; i++) R.im[i] = -R.im[i]; return R; },
  complex: function (a) { var re = realM(argN(a, 0, 'complex'), 'complex'), im = a.length > 1 ? realM(a[1], 'complex') : sc(0); var R = OPS['+'](re, M(re.r, re.c)); var I = OPS['+'](im, M(re.r, re.c)); R.im = new Float64Array(I.re); return R; },
  isreal: function (a) { var v = argN(a, 0, 'isreal'); return lg(sc(v.k === 'm' && !v.im ? 1 : 0)); },
  sum: function (a) { var v = mArg(a, 0, 'sum'); if (v.k === 'y') { var d0 = dimOf(v, a, 1); var Ry = d0 === 1 ? Y(1, v.c) : Y(v.r, 1); for (var i = 0; i < v.r; i++) for (var j = 0; j < v.c; j++) { var k = d0 === 1 ? j : i; Ry.d[k] = padd(Ry.d[k], v.d[j * v.r + i]); } return Ry; } v = unlg(v); var d = dimOf(v, a, 1); if (v.im) return cxColsReduce(v, d, 0, 0, function (s, z) { return [s[0] + z[0], s[1] + z[1]]; }); if (!numel(v)) return sc(0); return reduce(v, d, function (s, x) { return s + x; }, 0); },
  prod: function (a) { var v = unlg(realM(mArg(a, 0, 'prod'), 'prod')), d = dimOf(v, a, 1); if (v.im) return cxColsReduce(v, d, 1, 0, function (s, z) { return cmul(s[0], s[1], z[0], z[1]); }); return reduce(v, d, function (s, x) { return s * x; }, 1); },
  cumsum: function (a) { var v = realM(mArg(a, 0, 'cumsum'), 'cumsum'), d = dimOf(v, a, 1), R = copy(v); R.lg = false; if (d === 1) { for (var j = 0; j < v.c; j++) for (var i = 1; i < v.r; i++) R.re[j * v.r + i] += R.re[j * v.r + i - 1]; } else for (i = 0; i < v.r; i++) for (j = 1; j < v.c; j++) R.re[j * v.r + i] += R.re[(j - 1) * v.r + i]; return R; },
  mean: function (a, ctx) { var v = realM(mArg(a, 0, 'mean'), 'mean'), d = dimOf(v, a, 1), s = BUILTIN.sum([v, sc(d)], ctx), n = d === 1 ? v.r : v.c; return OPS['./'](s, sc(n)); },
  max: function (a, ctx, nout) { return minmax(a, nout, function (x, y) { return x > y; }, 'max'); },
  min: function (a, ctx, nout) { return minmax(a, nout, function (x, y) { return x < y; }, 'min'); },
  sort: function (a, ctx, nout) {
    var v = realM(mArg(a, 0, 'sort'), 'sort'), desc = a.length > 1 && a[a.length - 1].ch && /^desc/i.test(str(a[a.length - 1])), d = v.r === 1 ? 2 : 1, R = copy(v), I = M(v.r, v.c);
    var outer = d === 1 ? v.c : v.r, inner = d === 1 ? v.r : v.c;
    for (var o = 0; o < outer; o++) { var items = []; for (var t = 0; t < inner; t++) { var k = d === 1 ? o * v.r + t : t * v.r + o; items.push([v.re[k], t]); } items.sort(function (x, y) { return desc ? y[0] - x[0] || x[1] - y[1] : x[0] - y[0] || x[1] - y[1]; }); items.forEach(function (it, t2) { var k2 = d === 1 ? o * v.r + t2 : t2 * v.r + o; R.re[k2] = it[0]; I.re[k2] = it[1] + 1; }); }
    return nout > 1 ? multi([R, I]) : R;
  },
  any: function (a) { var v = realM(mArg(a, 0, 'any'), 'any'); if (v.r === 1 || v.c === 1) { for (var i = 0; i < v.re.length; i++) if (v.re[i]) return lg(sc(1)); return lg(sc(0)); } return lg(reduce(v, 1, function (s, x) { return s || x ? 1 : 0; }, 0)); },
  all: function (a) { var v = realM(mArg(a, 0, 'all'), 'all'); if (v.r === 1 || v.c === 1) { for (var i = 0; i < v.re.length; i++) if (!v.re[i]) return lg(sc(0)); return lg(sc(1)); } return lg(reduce(v, 1, function (s, x) { return s && x ? 1 : 0; }, 1)); },
  find: function (a) { var v = realM(mArg(a, 0, 'find'), 'find'), out = []; for (var i = 0; i < v.re.length; i++) if (v.re[i] || (v.im && v.im[i])) out.push(i + 1); var m = v.r === 1 ? M(1, out.length) : M(out.length, 1); out.forEach(function (x, k) { m.re[k] = x; }); return m; },
  linspace: function (a) { var x0 = numArg(a, 0, 'linspace'), x1 = numArg(a, 1, 'linspace'), n = a.length > 2 ? numArg(a, 2, 'linspace') : 100, m = M(1, n); for (var i = 0; i < n; i++) m.re[i] = n === 1 ? x1 : x0 + (x1 - x0) * i / (n - 1); return m; },
  reshape: function (a) { var v = argN(a, 0, 'reshape'), s = sizeArgs(a.slice(1), 'reshape'); if (s[0] * s[1] !== v.r * v.c) throw new MErr('reshape: el número de elementos tiene que ser el mismo (' + v.r * v.c + ').', 0, 'reshape'); if (v.k === 'y') return Y(s[0], s[1], v.d.slice()); var R = copy(v); R.r = s[0]; R.c = s[1]; return R; },
  repmat: function (a) { var v = argN(a, 0, 'repmat'), s = sizeArgs(a.slice(1), 'repmat'), row = []; for (var j = 0; j < s[1]; j++) row.push(v); var r1 = hcat(row), col = []; for (var i = 0; i < s[0]; i++) col.push(r1); return vcat(col); },
  fliplr: function (a, ctx) { var v = argN(a, 0, 'fliplr'), J = []; for (var j = v.c; j >= 1; j--) J.push(j - 1); return indexGet(v, [{ k: 'colon' }, fromList(J, true)], ctx); },
  flipud: function (a, ctx) { var v = argN(a, 0, 'flipud'), I = []; for (var i = v.r; i >= 1; i--) I.push(i - 1); return indexGet(v, [fromList(I, true), { k: 'colon' }], ctx); },
  horzcat: function (a) { return hcat(a); }, vertcat: function (a) { return vcat(a); }, cat: function (a) { var d = numArg(a, 0, 'cat'); return d === 1 ? vcat(a.slice(1)) : hcat(a.slice(1)); },
  norm: function (a) { var v = realOrCx(mArg(a, 0, 'norm')), p = null; if (a.length > 1) p = a[1].ch ? str(a[1]) : num(a[1]); return sc(norm(v, p)); },
  dot: function (a) { var x = realOrCx(mArg(a, 0, 'dot')), y = realOrCx(mArg(a, 1, 'dot')); if (numel(x) !== numel(y)) throw new MErr('dot: los dos vectores tienen que tener la misma longitud (' + numel(x) + ' y ' + numel(y) + ').', 0, 'dot'); var sr = 0, si = 0; for (var i = 0; i < numel(x); i++) { var z = cmul(x.re[i], x.im ? -x.im[i] : 0, y.re[i], y.im ? y.im[i] : 0); sr += z[0]; si += z[1]; } return sc(sr, si); },
  cross: function (a) { var x = argN(a, 0, 'cross'), y = argN(a, 1, 'cross'); if (numel(x) !== 3 || numel(y) !== 3) throw new MErr('cross: los dos vectores tienen que tener 3 componentes.', 0, 'cross'); if (x.k === 'y' || y.k === 'y') { var X = toSym(x), Yy = toSym(y), d = X.d, e = Yy.d; return Y(x.r, x.c, [psub(pmul(d[1], e[2]), pmul(d[2], e[1])), psub(pmul(d[2], e[0]), pmul(d[0], e[2])), psub(pmul(d[0], e[1]), pmul(d[1], e[0]))]); } x = realM(x, 'cross'); y = realM(y, 'cross'); var R = M(x.r, x.c); R.re[0] = x.re[1] * y.re[2] - x.re[2] * y.re[1]; R.re[1] = x.re[2] * y.re[0] - x.re[0] * y.re[2]; R.re[2] = x.re[0] * y.re[1] - x.re[1] * y.re[0]; return R; },
  kron: function (a) { var A = realM(argN(a, 0, 'kron'), 'kron'), B = realM(argN(a, 1, 'kron'), 'kron'), R = M(A.r * B.r, A.c * B.c); for (var i = 0; i < A.r; i++) for (var j = 0; j < A.c; j++) for (var k = 0; k < B.r; k++) for (var l = 0; l < B.c; l++) R.re[(j * B.c + l) * R.r + i * B.r + k] = A.re[j * A.r + i] * B.re[l * B.r + k]; return R; },
  lu: function (a, ctx, nout) {
    var A = realOrCx(mArg(a, 0, 'lu')), d = luDec(A), m = A.r, k = Math.min(A.r, A.c);
    var Pm = M(m, m); d.piv.forEach(function (p, i) { Pm.re[p * m + i] = 1; });
    if (nout >= 3) return multi([d.L, d.U, Pm]);
    var PL = mtimes(transpose(Pm, false), d.L);
    if (nout === 2) return multi([PL, d.U]);
    // una salida: L y U juntas (Y = L + U − I), como MATLAB
    var Yy = copy(d.U.r === m ? d.U : grow(d.U, m, A.c)); for (var i = 0; i < m; i++) for (var j = 0; j < Math.min(i, k); j++) Yy.re[j * m + i] = d.L.re[j * m + i]; return Yy;
  },
  qr: function (a, ctx, nout) { var A = realM(mArg(a, 0, 'qr'), 'qr'), econ = a.length > 1; var d = qrDec(A, econ); return nout > 1 ? multi([d.Q, d.R]) : d.R; },
  svd: function (a, ctx, nout) { var A = realM(mArg(a, 0, 'svd'), 'svd'); if (nout > 1) { var d = svdFull(A); return multi([d.U, d.S, d.V]); } return colVec(singVals(A)); },
  pinv: function (a) { return pinv(realM(mArg(a, 0, 'pinv'), 'pinv')); },
  cond: function (a) { var s = singVals(realM(mArg(a, 0, 'cond'), 'cond')); return sc(s[0] / s[s.length - 1]); },
  eig: function (a, ctx, nout) {
    var A = mArg(a, 0, 'eig');
    if (A.k === 'y') return symEig(A, nout);
    var d = eigDec(A, nout > 1), n = A.r;
    var vals = fromCx(d.vals, n, 1);
    if (nout < 2) return vals;
    var V = fromCx([].concat.apply([], d.vecs), n, n), D = M(n, n); if (vals.im) D.im = new Float64Array(n * n);
    for (var i = 0; i < n; i++) { D.re[i * n + i] = vals.re[i]; if (vals.im) D.im[i * n + i] = vals.im[i]; }
    return multi([V, cleanIm(D)]);
  },
  poly: function (a) { var A = realM(mArg(a, 0, 'poly'), 'poly'); var c, ev = null; if (A.r === A.c && A.r > 1) { ev = eigDec(A, false).vals; c = [[1, 0]]; ev.forEach(function (z) { var nc = c.concat([[0, 0]]); for (var k = nc.length - 1; k >= 1; k--) { var pz = cmul(z[0], z[1], c[k - 1][0], c[k - 1][1]); nc[k] = [nc[k][0] - pz[0], nc[k][1] - pz[1]]; } c = nc; }); c = c.map(function (z) { return z[0]; }); } else { c = [1]; for (var i = 0; i < numel(A); i++) { var nc = c.concat([0]); for (var k = 1; k < nc.length; k++) nc[k] -= A.re[i] * c[k - 1]; c = nc; } } var m = M(1, c.length); c.forEach(function (x, k2) { m.re[k2] = x; }); return m; },
  charpoly: function (a) { var A = mArg(a, 0, 'charpoly'); var c = A.k === 'y' ? qCharPoly(A) : null; if (a.length > 1) { var v = a[1]; if (v.k !== 'y') throw new MErr('charpoly(A, x): x tiene que ser una variable simbólica (syms x).', 0, 'charpoly'); var x = v.d[0], cq = c || charPoly(A).map(qFromNum), p = P(); cq.forEach(function (q, k) { p = padd(p, pscale(ppow(x, cq.length - 1 - k), q)); }); return Y(1, 1, [p]); } if (c) return Y(1, c.length, c.map(pconst)); var cc = charPoly(A), m = M(1, cc.length); cc.forEach(function (x2, k) { m.re[k] = x2; }); return m; },
  roots: function (a) { var p = realM(mArg(a, 0, 'roots'), 'roots'), c = Array.from(p.re); while (c.length && c[0] === 0) c.shift(); var z = 0; while (c.length && c[c.length - 1] === 0) { c.pop(); z++; } var n = c.length - 1, out = []; if (n >= 1) { var C = M(n, n); for (var j = 0; j < n; j++) C.re[j * n] = -c[j + 1] / c[0]; for (var i = 1; i < n; i++) C.re[(i - 1) * n + i] = 1; out = eigDec(C, false).vals; } for (var k = 0; k < z; k++) out.push([0, 0]); return fromCx(out, out.length, 1); },
  polyval: function (a) {   // 18 nov 2026: también con complejos (Horner en complejo)
    var p = realM(argN(a, 0, 'polyval'), 'polyval'), x = realM(argN(a, 1, 'polyval'), 'polyval'), R = M(x.r, x.c);
    if (!p.im && !x.im) { for (var i = 0; i < x.re.length; i++) { var s = 0; for (var k = 0; k < p.re.length; k++) s = s * x.re[i] + p.re[k]; R.re[i] = s; } return R; }
    R.im = new Float64Array(x.re.length);
    for (i = 0; i < x.re.length; i++) { var z = [0, 0], xr = x.re[i], xi = x.im ? x.im[i] : 0; for (k = 0; k < p.re.length; k++) { z = cmul(z[0], z[1], xr, xi); z[0] += p.re[k]; z[1] += p.im ? p.im[k] : 0; } R.re[i] = z[0]; R.im[i] = z[1]; }
    return cleanIm(R);
  },
  double: function (a) { var v = argN(a, 0, 'double'); if (v.k === 'y') return symToNum(v); if (v.k === 'yr') return v.num; var R = copy(v); R.ch = R.lg = false; return R; },
  logical: function (a) { var v = realM(argN(a, 0, 'logical'), 'logical'), R = M(v.r, v.c); for (var i = 0; i < v.re.length; i++) R.re[i] = v.re[i] ? 1 : 0; return lg(R); },
  rat: function (a) { var v = realM(argN(a, 0, 'rat'), 'rat'); return chr(ratStr(v.re[0])); },
  rats: function (a) { var v = realM(argN(a, 0, 'rats'), 'rats'); var s = []; for (var i = 0; i < v.re.length; i++) s.push(pad(ratStr(v.re[i]), 14)); return chr(s.join('')); },
  num2str: function (a) { var v = argN(a, 0, 'num2str'); if (v.k === 'y') return chr(fmtSym(v).join(' ')); v = realM(v, 'num2str'); if (a.length > 1) { if (a[1].ch) return chr(sprintfC(str(a[1]), [v])); var dg = numArg(a, 1, 'num2str'); return chr(Array.from(v.re).map(function (x) { return gfmt(x, dg); }).join('  ')); } var parts = Array.from(v.re).map(function (x, i) { if (v.im) return gfmt(x, 5) + (v.im[i] < 0 ? '-' : '+') + gfmt(Math.abs(v.im[i]), 5) + 'i'; if (Number.isInteger(x)) return String(x); var dg2 = Math.max(Math.floor(Math.log10(Math.abs(x) || 1)), 0) + 5; return gfmt(x, dg2); }); return chr(parts.join('  ')); },
  int2str: function (a) { var v = realM(argN(a, 0, 'int2str'), 'int2str'); return chr(Array.from(v.re).map(function (x) { return String(Math.round(x)); }).join('  ')); },
  mat2str: function (a) { var v = argN(a, 0, 'mat2str'); if (v.k === 'y') return chr('[' + fmtSym(v).join(';') + ']'); v = realM(v, 'mat2str'); var rows = []; for (var i = 0; i < v.r; i++) { var r = []; for (var j = 0; j < v.c; j++) r.push(gfmt(v.re[j * v.r + i], 15)); rows.push(r.join(' ')); } var s = rows.join(';'); return chr(numel(v) === 1 ? s : '[' + s + ']'); },
  sprintf: function (a) { var f = argN(a, 0, 'sprintf'); return chr(sprintfC(str(f), a.slice(1))); },
  fprintf: function (a, ctx) { var f = argN(a, 0, 'fprintf'); if (f.k === 'm' && !f.ch && a.length > 1 && f.r * f.c === 1 && f.re[0] === 1) { a = a.slice(1); f = a[0]; } if (!(f.k === 'm' && f.ch)) { ctx.print(dispStr(f, ctx.F)); return; } ctx.print(sprintfC(str(f), a.slice(1))); },
  disp: function (a, ctx) { var v = argN(a, 0, 'disp'); ctx.print(dispStr(v, ctx.F)); },
  display: function (a, ctx) { ctx.print(display('ans', argN(a, 0, 'display'), ctx.F) + '\n'); },
  error: function (a) { var f = argN(a, 0, 'error');
    if (a.length > 1 && f.ch && /^[A-Za-z]\w*(:[A-Za-z]\w*)+$/.test(str(f))) { var e = new MErr(sprintfC(str(a[1]), a.slice(2)), 0, 'user'); e.ident = str(f); throw e; }   // 18 nov 2026: error('id:sub', 'formato', ...)
    throw new MErr(a.length > 1 ? sprintfC(str(f), a.slice(1)) : str(f), 0, 'user'); },
  assert: function (a) { var c = argN(a, 0, 'assert'), ok = c.k === 'm' && numel(c) > 0; if (ok) for (var i = 0; i < c.re.length; i++) if (!c.re[i] && !(c.im && c.im[i])) { ok = false; break; }
    if (!ok) { if (a.length > 1) { var msg = a.length > 2 && /^[A-Za-z]\w*(:[A-Za-z]\w*)+$/.test(str(a[1])) ? sprintfC(str(a[2]), a.slice(3)) : sprintfC(str(a[1]), a.slice(2)); throw new MErr(msg, 0, 'user'); } throw new MErr('La comprobación (assert) ha fallado.', 0, 'assert', 'Assertion failed.'); } },
  isrow: function (a) { var v = argN(a, 0, 'isrow'); return lg(sc(v.r === 1 ? 1 : 0)); },
  iscolumn: function (a) { var v = argN(a, 0, 'iscolumn'); return lg(sc(v.c === 1 ? 1 : 0)); },
  isvector: function (a) { var v = argN(a, 0, 'isvector'); return lg(sc((v.r === 1 || v.c === 1) && v.r * v.c >= 1 ? 1 : 0)); },
  isscalar: function (a) { var v = argN(a, 0, 'isscalar'); return lg(sc(v.r === 1 && v.c === 1 ? 1 : 0)); },
  ismatrix: function (a) { argN(a, 0, 'ismatrix'); return lg(sc(1)); },
  issymmetric: function (a) { var v = argN(a, 0, 'issymmetric'); if (v.r !== v.c) return lg(sc(0)); for (var i = 0; i < v.r; i++) for (var j = 0; j < v.c; j++) if (v.re[i + j * v.r] !== v.re[j + i * v.r]) return lg(sc(0)); return lg(sc(1)); },
  isdiag: function (a) { var v = argN(a, 0, 'isdiag'); for (var i = 0; i < v.r; i++) for (var j = 0; j < v.c; j++) if (i !== j && (v.re[i + j * v.r] || (v.im && v.im[i + j * v.r]))) return lg(sc(0)); return lg(sc(1)); },
  istriu: function (a) { var v = argN(a, 0, 'istriu'); for (var i = 0; i < v.r; i++) for (var j = 0; j < Math.min(i, v.c); j++) if (v.re[i + j * v.r] || (v.im && v.im[i + j * v.r])) return lg(sc(0)); return lg(sc(1)); },
  istril: function (a) { var v = argN(a, 0, 'istril'); for (var i = 0; i < v.r; i++) for (var j = i + 1; j < v.c; j++) if (v.re[i + j * v.r] || (v.im && v.im[i + j * v.r])) return lg(sc(0)); return lg(sc(1)); },
  isnumeric: function (a) { var v = argN(a, 0, 'isnumeric'); return lg(sc(v.k === 'm' && !v.ch && !v.lg ? 1 : 0)); },
  ischar: function (a) { var v = argN(a, 0, 'ischar'); return lg(sc(v.k === 'm' && v.ch ? 1 : 0)); },
  strcat: function (a) { return chr(a.map(function (v) { return v.ch ? str(v).replace(/\s+$/, '') : str(v); }).join('')); },
  upper: function (a) { return chr(str(argN(a, 0, 'upper')).toUpperCase()); }, lower: function (a) { return chr(str(argN(a, 0, 'lower')).toLowerCase()); },
  strcmp: function (a) { var x = argN(a, 0, 'strcmp'), y = argN(a, 1, 'strcmp'); return lg(sc(x.ch && y.ch && str(x) === str(y) ? 1 : 0)); },
  factorial: mapEl(function (n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }),
  nchoosek: function (a) { var n = numArg(a, 0, 'nchoosek'), k = numArg(a, 1, 'nchoosek'), r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return sc(Math.round(r)); },
  isprime: mapEl(function (n) { if (n < 2 || !Number.isInteger(n)) return 0; for (var i = 2; i * i <= n; i++) if (n % i === 0) return 0; return 1; }),
  gcd: function (a) { return OPSf(a, function (x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = x % y; x = y; y = t; } return x; }, 'gcd'); },
  lcm: function (a) { return OPSf(a, function (x, y) { var g = x, h = y; while (h) { var t = g % h; g = h; h = t; } return Math.abs(x * y) / g; }, 'lcm'); },
  format: function (a, ctx) {
    var m = a.length ? str(a[0]).toLowerCase() : 'short';
    if (m === 'rat' || m === 'rational') ctx.F.mode = 'rat';
    else if (m === 'long' || m === 'longg' || m === 'longe') ctx.F.mode = 'long';
    else if (m === 'short' || m === 'shortg' || m === 'shorte' || m === 'default') ctx.F.mode = 'short';
    else if (m === 'compact' || m === 'loose') { }
    else throw new MErr('format admite short, long y rat (también rational).', 0, 'format');
  },
  clc: function (a, ctx) { if (ctx.onClc) ctx.onClc(); else ctx.outBuf = ''; },
  clear: function (a, ctx) { if (!a.length || /^(all|-all|variables)$/.test(str(a[0]))) ctx.vars.clear(); else a.forEach(function (n) { ctx.vars.delete(str(n)); }); },
  who: function (a, ctx) { var ks = Array.from(ctx.vars.keys()).sort(); ctx.print(ks.length ? 'Your variables are:\n\n' + ks.join('  ') + '\n\n' : ''); },
  help: function (a, ctx) { var n = a.length ? str(a[0]) : ''; ctx.print(HELP[n] ? n + ' — ' + HELP[n] + '\n\n' : 'Escribe help seguido del nombre de una función, por ejemplo: help rref\n\n'); },
  numel2: null,
  // ----- simbólico -----
  syms: function (a, ctx) {
    var names = a.map(str).filter(function (n) { return !/^(real|positive|integer|rational|clear)$/.test(n); });
    if (!names.length) { var ks = Array.from(ctx.vars.keys()).filter(function (k) { var v = ctx.vars.get(k); return v.k === 'y' && v.r * v.c === 1 && v.d[0].t.size === 1 && v.d[0].t.has(k); }); ctx.print(ks.length ? 'Your symbolic variables are:\n\n' + ks.join('  ') + '\n\n' : ''); return; }
    names.forEach(function (n) { if (!/^[A-Za-z]\w*$/.test(n)) throw new MErr('«' + n + '» no vale como nombre de variable simbólica.', 0, 'syms'); ctx.vars.set(n, Y(1, 1, [pvar(n)])); });
  },
  sym: function (a, ctx) {
    var v = argN(a, 0, 'sym');
    if (v.k === 'm' && v.ch) { var s = str(v); if (/^[A-Za-z]\w*$/.test(s)) return Y(1, 1, [pvar(s)]); var nn = Number(s); if (isFinite(nn)) return toSym(sc(nn)); throw new MErr('sym(\'' + s + '\'): en este entorno solo nombres de variables o números.', 0, 'sym'); }
    return toSym(realOrCx(v));
  },
  symvar: function (a) { var v = toSym(argN(a, 0, 'symvar')), s = {}; v.d.forEach(function (p) { pvars(p).forEach(function (x) { s[x] = 1; }); }); var ks = Object.keys(s).sort(); return Y(1, ks.length, ks.map(pvar)); },
  simplify: function (a) { return argN(a, 0, 'simplify'); }, expand: function (a) { return argN(a, 0, 'expand'); }, collect: function (a) { return argN(a, 0, 'collect'); },
  vpa: function (a, ctx) { var v = argN(a, 0, 'vpa'); return v.k === 'y' && yIsNum(v) ? symToNum(v) : v; },
  subs: function (a, ctx) { return symSubs(a, ctx); },
  solve: function (a, ctx, nout) { return symSolve(a, ctx, nout); },
  linsolve: function (a, ctx) { return mldivide(realM(argN(a, 0, 'linsolve'), 'linsolve'), realM(argN(a, 1, 'linsolve'), 'linsolve'), ctx); },
  struct: function (a) { var s = { k: 's', f: new Map() }; for (var i = 0; i + 1 < a.length; i += 2) s.f.set(str(a[i]), a[i + 1]); return s; },
  fieldnames: function (a) { var s = argN(a, 0, 'fieldnames'); var ks = Array.from(s.f.keys()); return { k: 'c', r: ks.length, c: 1, d: ks.map(chr) }; },
  plot: recPlot, compass: noPlot, polarplot: noPlot, fplot: noPlot, ezplot: noPlot, quiver: recPlot, surf: noPlot, mesh: noPlot, plot3: recPlot, scatter: recPlot, fimplicit: noPlot, line: recPlot, fill: recPlot,
  xlabel: recPlot, ylabel: recPlot, zlabel: recPlot, title: recPlot, legend: recPlot, text: recPlot, axis: function (a, ctx) { plotCmd(ctx, 'axis', a.map(function (x) { return x.ch ? str(x) : Array.from(x.re); })); }, grid: function (a, ctx) { plotCmd(ctx, 'grid', a.map(str)); }, hold: function (a, ctx) { plotCmd(ctx, 'hold', a.map(str)); }, figure: function (a, ctx) { plotCmd(ctx, 'figure', []); }, close: function () {}, view: recPlot,
  input: function () { throw new MErr('input() no está disponible en este entorno: escribe los datos en el código.', 0, 'input'); },
  eval: function (a, ctx) { var src = str(argN(a, 0, 'eval')); try { run(src, ctx); } catch (e) { if (e.isM && e.id === 'parse' || e.id === 'incomplete' || e.id === 'noend' || e.id === 'eqop' || e.id === 'str') e.en = 'Error: ' + e.en; throw e; } },
  tic: function (a, ctx) { ctx._tic = Date.now(); }, toc: function (a, ctx) { return sc((Date.now() - (ctx._tic || Date.now())) / 1000); }
};
BUILTIN.numel2 = undefined; delete BUILTIN.numel2;
['xlabel', 'ylabel', 'title', 'legend', 'axis', 'tic'].forEach(function (k) { NOANS[k] = 1; });
// 18 nov 2026: complejos en trigonometría (como MATLAB: asin(2) = 1.5708 - 1.3170i)
function rnd0(x) { return x < 0 ? -Math.round(-x) : Math.round(x); }
function csin(a, b) { return [Math.sin(a) * Math.cosh(b), Math.cos(a) * Math.sinh(b)]; }
function ccos(a, b) { return [Math.cos(a) * Math.cosh(b), -Math.sin(a) * Math.sinh(b)]; }
function clog(a, b) { return [Math.log(cabs(a, b)), Math.atan2(b, a)]; }
function casin(a, b) { var s = csqrt(1 - (a * a - b * b), -2 * a * b), l = clog(-b + s[0], a + s[1]); return [l[1], -l[0]]; }
function cacos(a, b) { var z = casin(a, b); return [Math.PI / 2 - z[0], -z[1]]; }
function catan(a, b) { var l1 = clog(1 + b, -a), l2 = clog(1 - b, a), x = l1[0] - l2[0], y = l1[1] - l2[1]; return [-y / 2, x / 2]; }
function cxList(v) { var o = []; for (var i = 0; i < v.re.length; i++) o.push([v.re[i], v.im ? v.im[i] : 0]); return o; }
// 18 nov 2026 (intensivo de MATLAB): los gráficos se registran en ctx.figs (no imprimen nada, como MATLAB). El entorno de la web los puede dibujar;
// los artículos los pasan a SVG con los datos reales.
function figNow(ctx) { if (!ctx.figs) ctx.figs = []; if (!ctx.figs.length) ctx.figs.push({ items: [], hold: false }); return ctx.figs[ctx.figs.length - 1]; }
function plotArg(v) { if (v && v.k === 'm') { if (v.ch) return str(v); return { r: v.r, c: v.c, re: Array.from(v.re), im: v.im ? Array.from(v.im) : null }; } if (v && v.k === 'c') return v.d.map(plotArg); return null; }
function recPlot(a, ctx, nout, name) {
  if (!ctx.recPlots && /^(plot|plot3|quiver|fill|scatter|line)$/.test(name)) noPlot();
  if (!ctx.recPlots) return;
  var F = figNow(ctx), drawing = /^(plot|plot3|quiver|fill|scatter|line)$/.test(name);
  if (drawing && !F.hold && F.items.some(function (it) { return /^(plot|plot3|quiver|fill|scatter|line)$/.test(it.fn); })) F.items = F.items.filter(function (it) { return !/^(plot|plot3|quiver|fill|scatter|line|text)$/.test(it.fn); });
  F.items.push({ fn: name, args: a.map(plotArg) });
}
function plotCmd(ctx, name, args) {
  if (!ctx.recPlots) return;
  if (!ctx.figs) ctx.figs = [];
  if (name === 'figure') { ctx.figs.push({ items: [], hold: false }); return; }
  if (name === 'close' || name === 'clf') { if (name === 'clf' && ctx.figs.length) ctx.figs[ctx.figs.length - 1].items = []; return; }
  var F = figNow(ctx);
  if (name === 'hold') { var w = (args[0] === undefined ? (F.hold ? 'off' : 'on') : String(args[0])); F.hold = w === 'on'; return; }
  F.items.push({ fn: name, args: args });
}
function noPlot() { throw new MErr('Los gráficos (plot, fplot…) todavía no están en este entorno de la web; pruébalos en tu MATLAB.', 0, 'plot'); }
function realOrCx(v) { if (v.k === 'y') return symToNum(v); if (v.k !== 'm') throw new MErr('Se necesita una matriz de números.', 0, 'arg'); return unlg(v); }
function rowOf(jb) { var m = M(1, jb.length); jb.forEach(function (j, i) { m.re[i] = j + 1; }); return m; }
function OPSf(a, f, name) { var x = realM(argN(a, 0, name), name), y = realM(argN(a, 1, name), name); return ew(x, y, f, null, name); }
function minmax(a, nout, better, name) {
  var v = realM(mArg(a, 0, name), name);
  if (a.length > 1 && numel(a[1])) { var w = realM(a[1], name); return ew(v, w, function (x, y) { return better(x, y) || isNaN(y) ? x : y; }, null, name); }
  var d = a.length > 2 ? numArg(a, 2, name) : (v.r !== 1 ? 1 : 2);
  if (!numel(v)) return nout > 1 ? multi([M(0, 0), M(0, 0)]) : M(0, 0);
  var outer = d === 1 ? v.c : v.r, inner = d === 1 ? v.r : v.c, R = d === 1 ? M(1, v.c) : M(v.r, 1), I = d === 1 ? M(1, v.c) : M(v.r, 1);
  var key = v.im ? function (k) { return cabs(v.re[k], v.im[k]); } : function (k) { return v.re[k]; };
  if (v.im) R.im = new Float64Array(R.re.length);
  for (var o = 0; o < outer; o++) { var best = -1; for (var t = 0; t < inner; t++) { var k = d === 1 ? o * v.r + t : t * v.r + o; if (isNaN(v.re[k])) continue; if (best < 0 || better(key(k), key(best))) best = k; } if (best < 0) best = d === 1 ? o * v.r : o; R.re[o] = v.re[best]; if (v.im) R.im[o] = v.im[best]; I.re[o] = (d === 1 ? best - o * v.r : Math.floor(best / v.r)) + 1; }
  return nout > 1 ? multi([cleanIm(R), I]) : cleanIm(R);
}
function gfmt(x, dg) { if (!isFinite(x)) return specStr(x); if (x === 0) return '0'; var s = x.toPrecision(dg); if (s.indexOf('e') >= 0) { var m = /^(-?[\d.]+?)\.?0*e([+-])(\d+)$/.exec(s); if (m) s = m[1] + 'e' + m[2] + (m[3].length < 2 ? '0' : '') + m[3]; } else if (s.indexOf('.') >= 0) s = s.replace(/\.?0+$/, ''); return s; }
function sprintfC(f, args) {
  var vals = []; args.forEach(function (v) { if (v.k === 'y') v = symToNum(v); if (v.k !== 'm') throw new MErr('fprintf/sprintf: argumento no válido.', 0, 'printf'); if (v.ch) vals.push(str(v)); else for (var i = 0; i < v.re.length; i++) vals.push(v.re[i]); });
  f = f.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
  var re = /%([-+ 0#]*)(\d+)?(?:\.(\d+))?([dicfeEgGsu%])/g, out = '', vi = 0, first = true;
  var nspec = (f.match(/%[-+ 0#]*\d*(?:\.\d+)?[dicfeEgGsu]/g) || []).length;
  do {
    out += f.replace(re, function (m, fl, w, pr, ty) {
      if (ty === '%') return '%';
      if (vi >= vals.length && !(first && !vals.length)) return '';
      var v = vals[vi++], s;
      if (v === undefined) s = '';
      else if (ty === 's') s = typeof v === 'string' ? v : gfmt(v, 5);
      else if (typeof v === 'string') s = v;
      else if (ty === 'd' || ty === 'i' || ty === 'u') s = Number.isInteger(v) ? String(v) : expo(v, 6);
      else if (ty === 'f') s = isFinite(v) ? v.toFixed(pr === undefined ? 6 : +pr) : specStr(v);
      else if (ty === 'e' || ty === 'E') { s = expo(v, pr === undefined ? 6 : +pr); if (ty === 'E') s = s.toUpperCase(); }
      else if (ty === 'c') s = typeof v === 'string' ? v : String.fromCharCode(v);
      else s = gfmt(v, pr === undefined ? 6 : Math.max(+pr, 1));
      if (fl && fl.indexOf('+') >= 0 && typeof v === 'number' && v >= 0) s = '+' + s;
      if (w) { var W = +w; if (fl && fl.indexOf('-') >= 0) while (s.length < W) s += ' '; else { var pc = fl && fl.indexOf('0') >= 0 ? '0' : ' '; while (s.length < W) s = pc + s; } }
      return s;
    });
    first = false;
  } while (nspec && vi < vals.length && vi > 0);
  return out;
}
var HELP = {
  rref: 'forma escalonada reducida por filas (Gauss-Jordan). [R, p] = rref(A) da también las columnas pivote.',
  rank: 'rango de una matriz.', det: 'determinante de una matriz cuadrada.', inv: 'inversa de una matriz cuadrada.',
  null: 'base del núcleo (espacio nulo). null(A, \'r\') la da «racional», como en clase.', eig: 'autovalores; [V, D] = eig(A) da también los autovectores.',
  lu: '[L, U, P] = lu(A): factorización LU con pivote parcial.', format: 'format short, format long o format rat: cómo se enseñan los números.',
  syms: 'syms x y z real: crea variables simbólicas.', solve: 'sol = solve(ecuaciones, [x y z]) resuelve un sistema; cada incógnita en sol.x, sol.y…',
  subs: 'subs(expr, x, valor) sustituye una variable por un valor.', norm: 'norma de un vector o de una matriz.', dot: 'producto escalar.', cross: 'producto vectorial (3 componentes).'
};
// ----- simbólico: solve, subs, eig exacto -----
function eqsFrom(args) {
  var eqs = [], vars = null;
  args.forEach(function (v, i) {
    if (v.k === 'e') { var L = v.l, R = v.r, n = Math.max(L.d.length, R.d.length); for (var k = 0; k < n; k++) eqs.push(psub(L.d[L.d.length === 1 ? 0 : k], R.d[R.d.length === 1 ? 0 : k])); }
    else if (v.k === 'y') { if (i === args.length - 1 && i > 0 && v.d.every(function (p) { return p.t.size === 1 && pvars(p).length === 1 && p.t.get(pvars(p)[0]); })) vars = v.d.map(function (p) { return pvars(p)[0]; }); else v.d.forEach(function (p) { eqs.push(p); }); }
    else if (v.k === 'c') { v.d.forEach(function (x) { if (x.k === 'y') { vars = vars || []; vars.push(pvars(x.d[0])[0]); } }); }
    else if (v.k === 'm' && v.ch) { /* opciones como 'Real', true: se ignoran */ }
    else if (v.k === 'm') { var y = toSym(v); y.d.forEach(function (p) { eqs.push(p); }); }
  });
  if (!vars) { var s = {}; eqs.forEach(function (p) { pvars(p).forEach(function (x) { s[x] = 1; }); }); vars = Object.keys(s).sort(); }
  return { eqs: eqs, vars: vars };
}
function symSolve(args, ctx, nout) {
  var o = eqsFrom(args), eqs = o.eqs, vars = o.vars;
  if (!eqs.length) throw new MErr('solve necesita al menos una ecuación (con ==).', 0, 'solve');
  var lin = eqs.map(function (p) { return linCoeffs(p, vars); });
  var res;
  if (lin.every(function (x) { return x && Array.from(Object.values(x.co)).every(pisConst); })) res = solveLinear(lin, vars, ctx);
  else if (vars.length === 1 && eqs.length === 1) res = solvePoly(eqs[0], vars[0]);
  else throw new MErr('Este entorno resuelve con solve sistemas lineales o una ecuación polinómica en una incógnita.', 0, 'solve');
  if (vars.length === 1) return res[vars[0]];
  if (nout > 1) return multi(vars.map(function (v) { return res[v]; }));
  var s = { k: 's', f: new Map() }; vars.forEach(function (v) { s.f.set(v, res[v]); }); return s;
}
function solveLinear(lin, vars, ctx) {
  var m = lin.length, n = vars.length, rows = lin.map(function (x) { return vars.map(function (v) { return pconstVal(x.co[v]); }).concat([null]); });
  var rhs = lin.map(function (x) { return x.b; });
  // Gauss-Jordan exacto; la columna de la derecha son polinomios
  var r = 0, piv = [];
  for (var c = 0; c < n && r < m; c++) {
    var p = -1; for (var i = r; i < m; i++) if (!qz(rows[i][c])) { p = i; break; }
    if (p < 0) continue;
    var t = rows[p]; rows[p] = rows[r]; rows[r] = t; t = rhs[p]; rhs[p] = rhs[r]; rhs[r] = t;
    var pv = rows[r][c]; for (var k = 0; k < n; k++) rows[r][k] = qdiv(rows[r][k], pv); rhs[r] = pscale(rhs[r], qdiv(Q1, pv));
    for (i = 0; i < m; i++) if (i !== r && !qz(rows[i][c])) { var f = rows[i][c]; for (k = 0; k < n; k++) rows[i][k] = qsub(rows[i][k], qmul(f, rows[r][k])); rhs[i] = psub(rhs[i], pscale(rhs[r], f)); }
    piv.push(c); r++;
  }
  for (i = r; i < m; i++) if (rhs[i].t.size) { var out = {}; vars.forEach(function (v) { out[v] = Y(0, 1, []); }); return out; }
  var res = {}, free = vars.filter(function (v, j) { return piv.indexOf(j) < 0; });
  // como MATLAB: con infinitas soluciones, solve da una particular con las variables libres a 0 (y sin aviso)
  vars.forEach(function (v, j) { var pi = piv.indexOf(j); if (pi < 0) { res[v] = Y(1, 1, [P()]); return; } res[v] = Y(1, 1, [rhs[pi]]); });
  return res;
}
function polyCoeffs(p, x) { // coeficientes racionales de un polinomio en x (de mayor a menor grado)
  var dmax = 0, map = {};
  p.t.forEach(function (q, k) { var o = mono(k); var others = Object.keys(o).filter(function (v) { return v !== x; }); if (others.length) throw new MErr('La ecuación tiene más variables que la incógnita (' + others.join(', ') + ').', 0, 'solve'); var e = o[x] || 0; map[e] = q; dmax = Math.max(dmax, e); });
  var c = []; for (var e = dmax; e >= 0; e--) c.push(map[e] || Q0); return c;
}
function qRoots(c) { // raíces de un polinomio con coeficientes racionales: exactas si son racionales; si no, con raíces cuadradas o numéricas
  var out = [];
  while (c.length > 1 && qz(c[c.length - 1])) { out.push({ q: Q0 }); c = c.slice(0, -1); }
  // escalar a enteros
  function intC(cc) { var L = cc.reduce(function (l, q) { return l * q.d / bgcd(l, q.d); }, 1n); return cc.map(function (q) { return q.n * (L / q.d); }); }
  function divisors(n) { n = n < 0n ? -n : n; var ds = []; for (var d = 1n; d * d <= n && d < 100000n; d++) if (n % d === 0n) { ds.push(d); if (d * d !== n) ds.push(n / d); } return ds; }
  var found = true;
  while (c.length > 2 && found) {
    found = false; var ic = intC(c), a0 = ic[ic.length - 1], an = ic[0];
    if (a0 === 0n) { out.push({ q: Q0 }); c = c.slice(0, -1); found = true; continue; }
    var P1 = divisors(a0), Qd = divisors(an);
    outer: for (var i = 0; i < P1.length; i++) for (var j = 0; j < Qd.length; j++) for (var sg = -1; sg <= 1; sg += 2) {
      var cand = Q(BigInt(sg) * P1[i], Qd[j]), v = Q0; c.forEach(function (q) { v = qadd(qmul(v, cand), q); });
      if (qz(v)) { out.push({ q: cand }); var nc = [], acc = Q0; for (var k = 0; k < c.length - 1; k++) { acc = qadd(qmul(acc, cand), c[k]); nc.push(acc); } c = nc; found = true; break outer; }
    }
  }
  if (c.length === 2) out.push({ q: qneg(qdiv(c[1], c[0])) });
  else if (c.length === 3) {
    var a = c[0], b = c[1], cc = c[2], D = qsub(qmul(b, b), qmul(Q(4), qmul(a, cc)));
    var sq = qSqrt(D), den = qmul(Q(2), a);
    if (sq.exact) { out.push({ q: qdiv(qsub(qneg(b), sq.q), den) }); out.push({ q: qdiv(qadd(qneg(b), sq.q), den) }); }
    else { var mid = qdiv(qneg(b), den), coef = qdiv(Q1, den); coef = coef.n < 0n ? qneg(coef) : coef;
      var rad = qmul(sq.k, coef), neg = D.n < 0n;
      (neg ? [-1, 1] : [1, -1]).forEach(function (s) { out.push({ s: radStr(mid, rad, sq.m, s, neg), v: qnum(mid) + s * qnum(rad) * Math.sqrt(Number(sq.m)) * (neg ? 0 : 1), vi: neg ? s * qnum(rad) * Math.sqrt(Number(sq.m)) : 0 }); });
    }
  } else if (c.length > 3) {
    var C = M(c.length - 1, c.length - 1), n = c.length - 1; for (j = 0; j < n; j++) C.re[j * n] = -qnum(c[j + 1]) / qnum(c[0]); for (i = 1; i < n; i++) C.re[(i - 1) * n + i] = 1;
    eigDec(C, false).vals.forEach(function (z) { out.push({ s: gfmt(z[0], 16) + (z[1] ? (z[1] < 0 ? ' - ' : ' + ') + gfmt(Math.abs(z[1]), 16) + 'i' : ''), v: z[0], vi: z[1] }); });
  }
  return out;
}
function qSqrt(D) { // √(n/d) = k·√m con m libre de cuadrados
  var neg = D.n < 0n, n = neg ? -D.n : D.n, d = D.d;
  function isq(x) { if (x < 0n) return null; var r = BigInt(Math.floor(Math.sqrt(Number(x)))); while (r * r > x) r--; while ((r + 1n) * (r + 1n) <= x) r++; return r * r === x ? r : null; }
  var rn = isq(n), rd = isq(d);
  if (!neg && rn !== null && rd !== null) return { exact: true, q: Q(rn, rd) };
  var N = n * d, k = 1n, m = N, f = 2n; // √(n/d) = √(n·d)/d
  while (f * f <= m) { if (m % (f * f) === 0n) { m /= f * f; k *= f; } else f++; }
  return { exact: false, k: Q(k, d), m: m };
}
function radStr(mid, rad, m, s, neg) {
  if (m === 1n) { var cf = qstr(rad); var im2 = (cf === '1' ? '1' : cf) + 'i'; if (rad.d !== 1n) im2 = (rad.n === 1n ? '1i' : rad.n.toString() + 'i') + '/' + rad.d.toString(); if (qz(mid)) return (s < 0 ? '-' : '') + im2; return qstr(mid) + (s < 0 ? ' - ' : ' + ') + im2; }
  var r = (rad.n === 1n && rad.d === 1n ? '' : rad.d === 1n ? rad.n.toString() + '*' : '') + m.toString() + '^(1/2)' + (rad.d !== 1n ? (rad.n === 1n ? '' : '*' + rad.n.toString()) + '/' + rad.d.toString() : '');
  if (rad.d !== 1n && rad.n !== 1n) r = '(' + rad.n.toString() + '*' + m.toString() + '^(1/2))/' + rad.d.toString();
  if (neg) r = r.replace('^(1/2)', '^(1/2)*1i');
  if (qz(mid)) return (s < 0 ? '-' : '') + r;
  return qstr(mid) + (s < 0 ? ' - ' : ' + ') + r;
}
function rootsToSym(list) { // si todas son racionales, matriz simbólica; si no, una columna «yr»
  if (list.every(function (o) { return o.q; })) return Y(list.length, 1, list.map(function (o) { return pconst(o.q); }));
  var num = M(list.length, 1), cx = list.some(function (o) { return o.vi; }); if (cx) num.im = new Float64Array(list.length);
  list.forEach(function (o, i) { num.re[i] = o.q ? qnum(o.q) : o.v; if (cx) num.im[i] = o.q ? 0 : o.vi; });
  return { k: 'yr', r: list.length, c: 1, s: list.map(function (o) { return o.q ? qstr(o.q) : o.s; }), num: num };
}
function solvePoly(p, x) { var c = polyCoeffs(p, x); var r = {}; r[x] = rootsToSym(qRoots(c)); return r; }
function qCharPoly(A) { if (!yIsNum(A)) throw new MErr('charpoly simbólico necesita una matriz de números.', 0, 'sym'); var n = A.r, a = yqrows(A), c = [Q1], Mk = []; for (var i = 0; i < n; i++) { Mk.push([]); for (var j = 0; j < n; j++) Mk[i].push(Q0); }
  function mm(X, Yq) { var R = []; for (var i2 = 0; i2 < n; i2++) { R.push([]); for (var j2 = 0; j2 < n; j2++) { var s = Q0; for (var k = 0; k < n; k++) s = qadd(s, qmul(X[i2][k], Yq[k][j2])); R[i2].push(s); } } return R; }
  for (var k = 1; k <= n; k++) { var AM = mm(a, Mk); for (i = 0; i < n; i++) AM[i][i] = qadd(AM[i][i], c[k - 1]); Mk = AM; var AM2 = mm(a, Mk), tr = Q0; for (i = 0; i < n; i++) tr = qadd(tr, AM2[i][i]); c.push(qneg(qdiv(tr, Q(k)))); }
  return c;
}
function symEig(A, nout) {
  if (nout > 1) { var d = eigDec(symToNum(A), true); return BUILTIN.eig([symToNum(A)], null, nout); }
  return rootsToSym(qRoots(qCharPoly(A)).sort(function (x, y) { return (x.q ? qnum(x.q) : x.v) - (y.q ? qnum(y.q) : y.v); }));
}
function symSubs(a, ctx) {
  var e = argN(a, 0, 'subs');
  if (e.k === 'm') return e;
  if (e.k !== 'y') throw new MErr('subs necesita una expresión simbólica.', 0, 'subs');
  var pairs = [];
  if (a.length === 1) { // subs(e): con los valores del espacio de trabajo
    var s = {}; e.d.forEach(function (p) { pvars(p).forEach(function (v) { s[v] = 1; }); });
    Object.keys(s).forEach(function (v) { var w = ctx.vars.get(v); if (w && !(w.k === 'y' && w.r * w.c === 1 && w.d[0].t.has(v) && w.d[0].t.size === 1)) pairs.push([v, w]); });
  } else if (a.length === 2) { var nv = pvars(e.d.reduce(function (acc, p) { return padd(acc, pmul(p, p)); }, P())); pairs.push([nv[0], a[1]]); }
  else {
    var olds = a[1], news = a[2];
    if (olds.k === 'c') olds.d.forEach(function (o2, i) { pairs.push([pvars(o2.d[0])[0], news.k === 'c' ? news.d[i] : indexGet(news, [sc(i + 1)])]); });
    else if (olds.k === 'y' && olds.d.length > 1) olds.d.forEach(function (p, i) { pairs.push([pvars(p)[0], news.k === 'c' ? news.d[i] : indexGet(news, [sc(i + 1)])]); });
    else pairs.push([olds.k === 'y' ? pvars(olds.d[0])[0] : str(olds), news]);
  }
  var R = Y(e.r, e.c, e.d.slice());
  pairs.forEach(function (pr) {
    var name = pr[0], val = toSym(pr[1]);
    if (val.d.length !== 1) { // sustituir por una matriz: el resultado crece (solo si la expresión es escalar)
      if (R.d.length !== 1) throw new MErr('subs: para sustituir por un vector, la expresión tiene que ser un escalar.', 0, 'subs');
      R = Y(val.r, val.c, val.d.map(function (q) { return psubs(R.d[0], name, q); })); return;
    }
    R = Y(R.r, R.c, R.d.map(function (p) { return psubs(p, name, val.d[0]); }));
  });
  return R;
}
