/* sl-matlab · valores y aritmética. Matrices en orden de columnas, reales o complejas. */
function M(r, c, re, im) { return { k: 'm', r: r, c: c, re: re || new Float64Array(r * c), im: im || null }; }
function sc(x, y) { var m = M(1, 1); m.re[0] = x; if (y) { m.im = new Float64Array(1); m.im[0] = y; } return m; }
function lg(m) { m.lg = true; return m; }
function chr(s) { var m = M(s.length ? 1 : 0, s.length); for (var i = 0; i < s.length; i++) m.re[i] = s.charCodeAt(i); m.ch = true; return m; }
function str(m) { var s = ''; for (var i = 0; i < m.re.length; i++) s += String.fromCharCode(m.re[i]); return s; }
function isM(v) { return v && v.k === 'm'; }
function numel(v) { return v.r * v.c; }
function isScalar(v) { return v.r === 1 && v.c === 1; }
function cleanIm(m) { if (m.im) { for (var i = 0; i < m.im.length; i++) if (m.im[i] !== 0) return m; m.im = null; } return m; }
function copy(m) { var o = M(m.r, m.c, new Float64Array(m.re), m.im ? new Float64Array(m.im) : null); o.lg = m.lg; o.ch = m.ch; return o; }
function zeros(r, c) { return M(r, c); }
function eye(r, c) { var m = M(r, c); for (var i = 0; i < Math.min(r, c); i++) m.re[i * r + i] = 1; return m; }
function get(m, i, j) { return m.re[j * m.r + i]; }
function set(m, i, j, v) { m.re[j * m.r + i] = v; }
function fromRows(a) { var r = a.length, c = r ? a[0].length : 0, m = M(r, c); for (var i = 0; i < r; i++) for (var j = 0; j < c; j++) m.re[j * r + i] = a[i][j]; return m; }
function toRows(m) { var a = []; for (var i = 0; i < m.r; i++) { var row = []; for (var j = 0; j < m.c; j++) row.push(m.re[j * m.r + i]); a.push(row); } return a; }
function sizeStr(v) { return v.r + '×' + v.c; }

// ---------- complejos ----------
function cmul(a, b, c, d) { return [a * c - b * d, a * d + b * c]; }
function cdiv(a, b, c, d) {
  if (d === 0) return [a / c, b / c];
  if (Math.abs(c) >= Math.abs(d)) { var r = d / c, den = c + d * r; return [(a + b * r) / den, (b - a * r) / den]; }
  var r2 = c / d, den2 = c * r2 + d; return [(a * r2 + b) / den2, (b * r2 - a) / den2];
}
function cabs(a, b) { return Math.hypot(a, b); }
function cpow(a, b, c, d) {
  if (a === 0 && b === 0) { if (c === 0 && d === 0) return [1, 0]; return c > 0 ? [0, 0] : [Infinity, 0]; }
  if (b === 0 && d === 0 && (a > 0 || Number.isInteger(c))) return [Math.pow(a, c), 0];
  if (d === 0 && Number.isInteger(c) && Math.abs(c) <= 1024) {   // 18 nov 2026: z^n con n entero, multiplicando (como MATLAB): 1i^2 = -1 exacto
    var n = Math.abs(c), r = [1, 0], q = [a, b];
    while (n) { if (n & 1) r = cmul(r[0], r[1], q[0], q[1]); n = Math.floor(n / 2); if (n) q = cmul(q[0], q[1], q[0], q[1]); }
    return c < 0 ? cdiv(1, 0, r[0], r[1]) : r;
  }
  var lr = Math.log(cabs(a, b)), th = Math.atan2(b, a);
  var er = Math.exp(c * lr - d * th), ang = d * lr + c * th;
  return [er * Math.cos(ang), er * Math.sin(ang)];
}
function csqrt(a, b) {
  if (b === 0) return a >= 0 ? [Math.sqrt(a), 0] : [0, Math.sqrt(-a)];
  var m = cabs(a, b), re = Math.sqrt((m + a) / 2), im = Math.sqrt((m - a) / 2); return [re, b < 0 ? -im : im];
}

// ---------- expansión implícita ----------
function bcast(A, B, opName) {
  var r, c;
  if (A.r === B.r || A.r === 1 || B.r === 1) r = A.r === 1 ? B.r : A.r; else r = -1;
  if (A.c === B.c || A.c === 1 || B.c === 1) c = A.c === 1 ? B.c : A.c; else c = -1;
  if (r < 0 || c < 0) throw new MErr('Los tamaños no son compatibles para esta operación (' + sizeStr(A) + ' y ' + sizeStr(B) + ').' + (opName === '+' || opName === '-' ? '' : ''), 0, 'dims');
  if (A.r === 0 || B.r === 0) r = 0; if (A.c === 0 || B.c === 0) c = 0;
  return [r, c];
}
function ew(A, B, fr, fc, opName, logical) {
  var sz = bcast(A, B, opName), r = sz[0], c = sz[1], R = M(r, c), cx = !!(A.im || B.im) && fc;
  if (cx) R.im = new Float64Array(r * c);
  for (var j = 0; j < c; j++) for (var i = 0; i < r; i++) {
    var ia = (A.c === 1 ? 0 : j) * A.r + (A.r === 1 ? 0 : i), ib = (B.c === 1 ? 0 : j) * B.r + (B.r === 1 ? 0 : i), k = j * r + i;
    if (cx) { var z = fc(A.re[ia], A.im ? A.im[ia] : 0, B.re[ib], B.im ? B.im[ib] : 0); R.re[k] = z[0]; R.im[k] = z[1]; }
    else R.re[k] = fr(A.re[ia], B.re[ib], A.im ? A.im[ia] : 0, B.im ? B.im[ib] : 0);
  }
  if (logical) R.lg = true;
  return cleanIm(R);
}
function needCx(A, B, f) { // ¿la potencia elemento a elemento da complejos?
  if (A.im || B.im) return true;
  var sz = bcast(A, B), r = sz[0], c = sz[1];
  for (var j = 0; j < c; j++) for (var i = 0; i < r; i++) {
    var a = A.re[(A.c === 1 ? 0 : j) * A.r + (A.r === 1 ? 0 : i)], b = B.re[(B.c === 1 ? 0 : j) * B.r + (B.r === 1 ? 0 : i)];
    if (f(a, b)) return true;
  }
  return false;
}
var OPS = {
  '+': function (A, B) { return ew(A, B, function (a, b) { return a + b; }, function (a, b, c, d) { return [a + c, b + d]; }, '+'); },
  '-': function (A, B) { return ew(A, B, function (a, b) { return a - b; }, function (a, b, c, d) { return [a - c, b - d]; }, '-'); },
  '.*': function (A, B) { return ew(A, B, function (a, b) { return a * b; }, cmul, '.*'); },
  './': function (A, B) { return ew(A, B, function (a, b) { return a / b; }, cdiv, './'); },
  '.\\': function (A, B) { return OPS['./'](B, A); },
  '.^': function (A, B) {
    if (needCx(A, B, function (a, b) { return a < 0 && !Number.isInteger(b); })) {
      var A2 = A.im ? A : copy(A); if (!A2.im) A2.im = new Float64Array(A2.re.length);
      return ew(A2, B, null, cpow, '.^');
    }
    return ew(A, B, function (a, b) { return Math.pow(a, b); }, cpow, '.^');
  },
  '==': function (A, B) { return ew(A, B, function (a, b, ai, bi) { return a === b && ai === bi ? 1 : 0; }, null, '==', true); },
  '~=': function (A, B) { return ew(A, B, function (a, b, ai, bi) { return a === b && ai === bi ? 0 : 1; }, null, '~=', true); },
  '<': function (A, B) { return ew(A, B, function (a, b) { return a < b ? 1 : 0; }, null, '<', true); },
  '<=': function (A, B) { return ew(A, B, function (a, b) { return a <= b ? 1 : 0; }, null, '<=', true); },
  '>': function (A, B) { return ew(A, B, function (a, b) { return a > b ? 1 : 0; }, null, '>', true); },
  '>=': function (A, B) { return ew(A, B, function (a, b) { return a >= b ? 1 : 0; }, null, '>=', true); },
  '&': function (A, B) { return ew(A, B, function (a, b, ai, bi) { return (a || ai) && (b || bi) ? 1 : 0; }, null, '&', true); },
  '|': function (A, B) { return ew(A, B, function (a, b, ai, bi) { return (a || ai) || (b || bi) ? 1 : 0; }, null, '|', true); }
};
function neg(A) { var R = copy(A); R.lg = R.ch = false; for (var i = 0; i < R.re.length; i++) R.re[i] = -R.re[i]; if (R.im) for (i = 0; i < R.im.length; i++) R.im[i] = -R.im[i]; return R; }
function not(A) { var R = M(A.r, A.c); for (var i = 0; i < R.re.length; i++) R.re[i] = (A.re[i] || (A.im && A.im[i])) ? 0 : 1; R.lg = true; return R; }
function transpose(A, conj) {
  var R = M(A.c, A.r); if (A.im) R.im = new Float64Array(A.re.length);
  for (var i = 0; i < A.r; i++) for (var j = 0; j < A.c; j++) { R.re[i * A.c + j] = A.re[j * A.r + i]; if (A.im) R.im[i * A.c + j] = conj ? -A.im[j * A.r + i] : A.im[j * A.r + i]; }
  R.ch = A.ch; R.lg = A.lg; return R;
}
function mtimes(A, B) {
  if (isScalar(A) || isScalar(B)) return OPS['.*'](A, B);
  if (A.c !== B.r) throw new MErr('Las dimensiones no casan para multiplicar matrices: ' + sizeStr(A) + ' por ' + sizeStr(B) + ' (las columnas de la primera tienen que ser las filas de la segunda). Para multiplicar elemento a elemento, usa «.*».', 0, 'mtimes');
  var R = M(A.r, B.c), cx = A.im || B.im; if (cx) R.im = new Float64Array(A.r * B.c);
  for (var i = 0; i < A.r; i++) for (var j = 0; j < B.c; j++) {
    var sr = 0, si = 0;
    for (var k = 0; k < A.c; k++) {
      var ar = A.re[k * A.r + i], ai = A.im ? A.im[k * A.r + i] : 0, br = B.re[j * B.r + k], bi = B.im ? B.im[j * B.r + k] : 0;
      sr += ar * br - ai * bi; si += ar * bi + ai * br;
    }
    R.re[j * A.r + i] = sr; if (cx) R.im[j * A.r + i] = si;
  }
  return cleanIm(R);
}
function toC(A) { var R = copy(A); if (!R.im) R.im = new Float64Array(R.re.length); return R; }
