/* sl-matlab · cálculo simbólico mínimo: racionales exactos y polinomios en varias variables (lo que pide AG). */
function bgcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { var t = a % b; a = b; b = t; } return a; }
function Q(n, d) { n = BigInt(n); d = d == null ? 1n : BigInt(d); if (d === 0n) throw new MErr('División entre cero en una expresión simbólica.', 0, 'sym0'); if (d < 0n) { n = -n; d = -d; } var g = bgcd(n, d) || 1n; return { n: n / g, d: d / g }; }
var Q0 = Q(0), Q1 = Q(1);
function qadd(a, b) { return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qsub(a, b) { return Q(a.n * b.d - b.n * a.d, a.d * b.d); }
function qmul(a, b) { return Q(a.n * b.n, a.d * b.d); }
function qdiv(a, b) { if (b.n === 0n) throw new MErr('División entre cero en una expresión simbólica.', 0, 'sym0'); return Q(a.n * b.d, a.d * b.n); }
function qneg(a) { return { n: -a.n, d: a.d }; }
function qz(a) { return a.n === 0n; }
function qnum(a) { return Number(a.n) / Number(a.d); }
function qstr(a) { return a.d === 1n ? a.n.toString() : a.n.toString() + '/' + a.d.toString(); }
function qFromNum(x) { // como sym(x): fracción exacta si es «bonita», si no la del doble
  if (!isFinite(x)) throw new MErr('No se puede convertir Inf o NaN en simbólico.', 0, 'symnum');
  if (Number.isInteger(x)) return Q(BigInt(x));
  // fracción continua con tolerancia de redondeo
  var h0 = 1n, h1 = 0n, k0 = 0n, k1 = 1n, y = x, s = x < 0 ? -1 : 1; y = Math.abs(x);
  for (var it = 0; it < 40; it++) {
    var a = Math.floor(y), A = BigInt(a), h = A * h0 + h1, k = A * k0 + k1; h1 = h0; h0 = h; k1 = k0; k0 = k;
    if (Math.abs(Number(h) / Number(k) - Math.abs(x)) <= Math.abs(x) * 1e-13) return Q(BigInt(s) * h, k);
    var f = y - a; if (f < 1e-15) break; y = 1 / f; if (y > 1e15) break;
  }
  // representación binaria exacta
  var e = 0, m = Math.abs(x); while (!Number.isInteger(m) && e < 1100) { m *= 2; e++; }
  return Q(BigInt(s) * BigInt(m), 1n << BigInt(e));
}
// monomio: clave «x^2*y» (variables en orden alfabético). Polinomio: Map clave → Q
function P(map) { return { k: 'p', t: map || new Map() }; }
function pconst(q) { var p = P(); if (!qz(q)) p.t.set('', q); return p; }
function pvar(name) { var p = P(); p.t.set(name, Q1); return p; }
function mono(key) { var o = {}; if (!key) return o; key.split('*').forEach(function (f) { var m = /^(\w+)(?:\^(\d+))?$/.exec(f); o[m[1]] = (o[m[1]] || 0) + (m[2] ? +m[2] : 1); }); return o; }
function monoKey(o) { return Object.keys(o).filter(function (v) { return o[v]; }).sort().map(function (v) { return o[v] === 1 ? v : v + '^' + o[v]; }).join('*'); }
function deg(key) { var o = mono(key), s = 0; for (var v in o) s += o[v]; return s; }
function padd(a, b) { var t = new Map(a.t); b.t.forEach(function (q, k) { var c = t.has(k) ? qadd(t.get(k), q) : q; if (qz(c)) t.delete(k); else t.set(k, c); }); return P(t); }
function pneg(a) { var t = new Map(); a.t.forEach(function (q, k) { t.set(k, qneg(q)); }); return P(t); }
function psub(a, b) { return padd(a, pneg(b)); }
function pmul(a, b) {
  var t = new Map();
  a.t.forEach(function (qa, ka) { b.t.forEach(function (qb, kb) {
    var o = mono(ka), o2 = mono(kb); for (var v in o2) o[v] = (o[v] || 0) + o2[v];
    var k = monoKey(o), c = qmul(qa, qb); c = t.has(k) ? qadd(t.get(k), c) : c; if (qz(c)) t.delete(k); else t.set(k, c);
  }); });
  return P(t);
}
function pscale(a, q) { if (qz(q)) return P(); var t = new Map(); a.t.forEach(function (c, k) { t.set(k, qmul(c, q)); }); return P(t); }
function pisConst(a) { return a.t.size === 0 || (a.t.size === 1 && a.t.has('')); }
function pconstVal(a) { return a.t.get('') || Q0; }
function ppow(a, e) { var r = pconst(Q1); for (var i = 0; i < e; i++) r = pmul(r, a); return r; }
function pvars(a) { var s = {}; a.t.forEach(function (q, k) { Object.keys(mono(k)).forEach(function (v) { s[v] = 1; }); }); return Object.keys(s).sort(); }
function psubs(a, name, val) { // val: polinomio
  var r = P();
  a.t.forEach(function (q, k) { var o = mono(k), e = o[name] || 0; delete o[name]; var term = pscale(P(new Map([[monoKey(o), Q1]])), q); if (e) term = pmul(term, ppow(val, e)); r = padd(r, term); });
  return r;
}
function peval(a, env) { var s = 0; a.t.forEach(function (q, k) { var o = mono(k), t = qnum(q); for (var v in o) { if (!(v in env)) return NaN; t *= Math.pow(env[v], o[v]); } s += t; }); return s; }
// orden de los términos como MATLAB: grado alto primero; dentro, por variables
function termOrder(vars) {
  return function (ka, kb) {
    var da = deg(ka), db = deg(kb); if (da !== db) return db - da;
    var oa = mono(ka), ob = mono(kb);
    for (var i = 0; i < vars.length; i++) { var v = vars[i], ea = oa[v] || 0, eb = ob[v] || 0; if (ea !== eb) return eb - ea; }
    return 0;
  };
}
function monoStr(k) { var o = mono(k); return Object.keys(o).sort().map(function (v) { return o[v] === 1 ? v : v + '^' + o[v]; }).join('*'); }
function pstr(a) {
  if (!a.t.size) return '0';
  var vars = pvars(a), keys = Array.from(a.t.keys()).sort(termOrder(vars));
  // si el primero es negativo y hay alguno positivo, MATLAB empieza por el positivo (2 - 3*z)
  if (keys.length > 1 && a.t.get(keys[0]).n < 0n) { var ip = keys.findIndex(function (k) { return a.t.get(k).n > 0n; }); if (ip > 0) { var kp = keys.splice(ip, 1)[0]; keys.unshift(kp); } }
  var out = '';
  keys.forEach(function (k, i) {
    var q = a.t.get(k), neg = q.n < 0n, aq = neg ? qneg(q) : q, ms = monoStr(k), body;
    if (!ms) body = qstr(aq);
    else if (aq.d === 1n) body = aq.n === 1n ? ms : aq.n.toString() + '*' + ms;
    else { var num = aq.n === 1n ? ms : (ms.indexOf('*') >= 0 || ms.indexOf('^') >= 0 || true ? '(' + aq.n.toString() + '*' + ms + ')' : ''); body = (aq.n === 1n ? ms : num) + '/' + aq.d.toString(); }
    if (i === 0) out = (neg ? '-' : '') + body; else out += (neg ? ' - ' : ' + ') + body;
  });
  return out;
}
// matrices simbólicas
function Y(r, c, d) { return { k: 'y', r: r, c: c, d: d || new Array(r * c).fill(null).map(function () { return P(); }) }; }
function toSym(v) {
  if (v.k === 'y') return v;
  if (v.k !== 'm') throw new MErr('No se puede convertir este valor en simbólico.', 0, 'sym');
  if (v.im) throw new MErr('Los complejos simbólicos no están disponibles en este entorno.', 0, 'symcx');
  return Y(v.r, v.c, Array.from(v.re).map(function (x) { return pconst(qFromNum(x)); }));
}
function symToNum(y) { // double(s)
  var m = M(y.r, y.c);
  for (var i = 0; i < y.d.length; i++) { if (!pisConst(y.d[i])) throw new MErr('No se puede convertir en número una expresión con variables (' + pstr(y.d[i]) + ').', 0, 'symdbl'); m.re[i] = qnum(pconstVal(y.d[i])); }
  return m;
}
function yew(A, B, f, name) {
  var sz = bcast(A, B, name), r = sz[0], c = sz[1], R = Y(r, c);
  for (var j = 0; j < c; j++) for (var i = 0; i < r; i++) R.d[j * r + i] = f(A.d[(A.c === 1 ? 0 : j) * A.r + (A.r === 1 ? 0 : i)], B.d[(B.c === 1 ? 0 : j) * B.r + (B.r === 1 ? 0 : i)]);
  return R;
}
function ymtimes(A, B) {
  if (A.r * A.c === 1 || B.r * B.c === 1) return yew(A, B, pmul, '*');
  if (A.c !== B.r) throw new MErr('Las dimensiones no casan para multiplicar matrices: ' + A.r + '×' + A.c + ' por ' + B.r + '×' + B.c + '.', 0, 'mtimes');
  var R = Y(A.r, B.c);
  for (var i = 0; i < A.r; i++) for (var j = 0; j < B.c; j++) { var s = P(); for (var k = 0; k < A.c; k++) s = padd(s, pmul(A.d[k * A.r + i], B.d[j * B.r + k])); R.d[j * A.r + i] = s; }
  return R;
}
function ydivConst(p, q) { if (!pisConst(q)) throw new MErr('Este entorno solo divide expresiones simbólicas entre números (aquí se divide entre ' + pstr(q) + ').', 0, 'symdiv'); return pscale(p, qdiv(Q1, pconstVal(q))); }
function ytr(A) { var R = Y(A.c, A.r); for (var i = 0; i < A.r; i++) for (var j = 0; j < A.c; j++) R.d[i * A.c + j] = A.d[j * A.r + i]; return R; }
function ydet(A) { // desarrollo por cofactores (matrices pequeñas) o Bareiss
  if (A.r !== A.c) throw new MErr('La matriz tiene que ser cuadrada para calcular el determinante (det).', 0, 'square');
  var n = A.r; if (!n) return pconst(Q1);
  function rec(rows, cols) {
    if (rows.length === 1) return A.d[cols[0] * n + rows[0]];
    var s = P(), r0 = rows[0], rest = rows.slice(1);
    cols.forEach(function (c, k) { var e = A.d[c * n + r0]; if (!e.t.size) return; var m = pmul(e, rec(rest, cols.filter(function (x) { return x !== c; }))); s = k % 2 ? psub(s, m) : padd(s, m); });
    return s;
  }
  if (n > 7) throw new MErr('det simbólico solo para matrices de hasta 7×7 en este entorno.', 0, 'symdet');
  var idx = []; for (var i = 0; i < n; i++) idx.push(i);
  return rec(idx, idx);
}
// matriz simbólica de números → fracciones exactas (rref, inv, rank exactos)
function yIsNum(A) { return A.d.every(pisConst); }
function yqrows(A) { var a = []; for (var i = 0; i < A.r; i++) { var row = []; for (var j = 0; j < A.c; j++) row.push(pconstVal(A.d[j * A.r + i])); a.push(row); } return a; }
function yfromq(a, r, c) { var R = Y(r, c); for (var i = 0; i < r; i++) for (var j = 0; j < c; j++) R.d[j * r + i] = pconst(a[i][j]); return R; }
function qrref(a, r, c) {
  var i = 0, j = 0, jb = [];
  while (i < r && j < c) {
    var k = -1; for (var q = i; q < r; q++) if (!qz(a[q][j])) { k = q; break; }
    if (k < 0) { j++; continue; }
    jb.push(j); var t = a[i]; a[i] = a[k]; a[k] = t;
    var pv = a[i][j]; for (var cc = j; cc < c; cc++) a[i][cc] = qdiv(a[i][cc], pv);
    for (q = 0; q < r; q++) { if (q === i || qz(a[q][j])) continue; var f = a[q][j]; for (cc = j; cc < c; cc++) a[q][cc] = qsub(a[q][cc], qmul(f, a[i][cc])); }
    i++; j++;
  }
  return jb;
}
// solve de sistemas lineales (y de un polinomio en una variable)
function linCoeffs(p, vars) { // p = Σ a_v·v + b ; null si no es lineal en vars
  var co = {}, rest = P();
  vars.forEach(function (v) { co[v] = P(); });
  var ok = true;
  p.t.forEach(function (q, k) {
    var o = mono(k), hit = vars.filter(function (v) { return o[v]; });
    if (!hit.length) { rest = padd(rest, P(new Map([[k, q]]))); return; }
    if (hit.length > 1 || o[hit[0]] !== 1) { ok = false; return; }
    delete o[hit[0]]; co[hit[0]] = padd(co[hit[0]], P(new Map([[monoKey(o), q]])));
  });
  if (!ok) return null;
  return { co: co, b: pneg(rest) };
}
