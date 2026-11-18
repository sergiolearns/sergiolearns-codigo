/* sl-matlab · cómo enseña MATLAB los valores en la ventana de comandos (format short, long y rat). */
function ratStr(x) { // como rat()/rats(): fracción continua con tolerancia 1e-6·|x|
  if (x === 0) return '0';
  if (!isFinite(x)) return isNaN(x) ? 'NaN' : x > 0 ? 'Inf' : '-Inf';
  if (Number.isInteger(x)) return String(x);
  var tol = 1e-6 * Math.abs(x), y = x, h0 = 1, h1 = 0, k0 = 0, k1 = 1, n = 0, d = 1;
  for (var it = 0; it < 20; it++) {
    var a = Math.round(y); if (Math.abs(y - a) === 0.5) a = Math.floor(y + 0.5);
    var h = a * h0 + h1, k = a * k0 + k1; h1 = h0; h0 = h; k1 = k0; k0 = k; n = h; d = k;
    if (Math.abs(x - n / d) < tol) break;
    var f = y - a; if (f === 0) break; y = 1 / f;
  }
  if (d < 0) { n = -n; d = -d; }
  var s = d === 1 ? String(n) : n + '/' + d;
  if (s.length > 13) s = '*';   // como MATLAB cuando la fracción no cabe
  return s;
}
function isIntMat(m) { for (var i = 0; i < m.re.length; i++) if (!Number.isInteger(m.re[i]) && isFinite(m.re[i])) return false; if (m.im) for (i = 0; i < m.im.length; i++) if (!Number.isInteger(m.im[i]) && isFinite(m.im[i])) return false; return true; }
function specStr(x) { return isNaN(x) ? 'NaN' : x > 0 ? 'Inf' : '-Inf'; }
function pad(s, w) { while (s.length < w) s = ' ' + s; return s; }
function fixed(x, dp) { if (!isFinite(x)) return specStr(x); var s = x.toFixed(dp); if (/^-0\.0*$/.test(s)) s = s.slice(1); return s; }
function expo(x, dp) { if (!isFinite(x)) return specStr(x); var s = x.toExponential(dp), m = /e([+-])(\d+)$/.exec(s); return s.replace(/e([+-])(\d+)$/, 'e' + m[1] + (m[2].length < 2 ? '0' + m[2] : m[2])); }

// devuelve las líneas del valor (sin el «x =»)
function fmtMatrix(m, F) {
  var r = m.r, c = m.c, n = r * c, lines = [];
  if (m.ch) { var rows = []; for (var i = 0; i < r; i++) { var s = ''; for (var j = 0; j < c; j++) s += String.fromCharCode(m.re[j * r + i]); rows.push(s); } return { inline: r === 1, lines: rows.map(function (x) { return '    \'' + x + '\''; }) }; }
  if (!n) return { empty: true, lines: [r === 0 && c === 0 ? '     []' : '  ' + r + '×' + c + ' empty ' + (m.lg ? 'logical array' : 'double ' + (r === 1 ? 'row vector' : c === 1 ? 'column vector' : 'matrix'))] };
  if (m.lg) { if (n > 1) lines.push('  ' + r + '×' + c + ' logical array', ''); else lines.push('  logical', ''); for (i = 0; i < r; i++) { s = ''; for (j = 0; j < c; j++) s += pad(String(m.re[j * r + i] ? 1 : 0), 4); lines.push(s); } return { lines: lines, lg: true }; }
  var cx = !!m.im, re = m.re, im = m.im;
  var fmtMode = F.mode;
  if (fmtMode === 'rat') {
    if (cx) {   // 18 nov 2026: complejos en format rat, cada parte con su fracción (antes se cortaba en la segunda barra)
      var rs = [], is = [], rw = 0, iw = 0;
      for (i = 0; i < n; i++) { rs.push(ratStr(re[i])); is.push(ratStr(Math.abs(im[i]))); rw = Math.max(rw, rs[i].length); iw = Math.max(iw, is[i].length); }
      for (i = 0; i < r; i++) { s = ''; for (j = 0; j < c; j++) { var kk = j * r + i, ti = is[kk] + 'i'; while (ti.length < iw + 1) ti += ' '; s += pad(rs[kk], Math.max(10, rw + 4)) + (im[kk] < 0 || Object.is(im[kk], -0) ? ' - ' : ' + ') + ti + '  '; } lines.push(s.replace(/\s+$/, '')); }
      return { lines: lines };
    }
    var strs = []; for (i = 0; i < n; i++) strs.push(ratStr(re[i]));
    // como MATLAB: el numerador termina en la columna 8 del campo y el denominador va detrás de la barra (campos de 15)
    var nw = 8, dw = 7;
    strs.forEach(function (x) { var p = x.split('/'); nw = Math.max(nw, p[0].length + 2); if (p[1]) dw = Math.max(dw, p[1].length + 2); });
    for (i = 0; i < r; i++) { s = ''; for (j = 0; j < c; j++) { var p0 = strs[j * r + i].split('/'), cell = pad(p0[0], nw) + (p0[1] ? '/' + p0[1] : ''); while (cell.length < nw + dw) cell += ' '; s += cell; } lines.push(s); }
    return { lines: lines };
  }
  var dp = fmtMode === 'long' ? 15 : 4;
  // números enteros
  var mx = 0; for (i = 0; i < n; i++) { if (isFinite(re[i])) mx = Math.max(mx, Math.abs(re[i])); if (cx && isFinite(im[i])) mx = Math.max(mx, Math.abs(im[i])); }
  if (!cx && isIntMat(m) && mx < 1e9) {
    var digits = String(mx).length, neg = false; for (i = 0; i < n; i++) if (re[i] < 0 || (cx && im[i] < 0)) neg = true;
    if (!cx) {
      var wi = digits <= 3 ? 6 : digits + (neg ? 1 : 0) + 7; if (digits <= 3) wi = 6;
      if (digits > 3) wi = Math.max(12, digits + 3);
      for (i = 0; i < r; i++) { s = ''; for (j = 0; j < c; j++) { var x = re[j * r + i]; s += pad(isFinite(x) ? String(x) : specStr(x), wi); } lines.push(s); }
      return { lines: lines };
    }
    for (i = 0; i < r; i++) { s = ''; for (j = 0; j < c; j++) { var k = j * r + i; s += pad(String(re[k]), digits + 3) + (im[k] < 0 ? ' - ' : ' + ') + String(Math.abs(im[k])) + 'i'; } lines.push(s); }
    return { lines: lines };
  }
  // escala común
  var scale = 0;
  if (n === 1 && cx && fmtMode !== 'long' && mx < 1e5 && mx >= 1e-3) return { lines: [pad(fixed(re[0], 4), 9) + (im[0] < 0 || Object.is(im[0], -0) ? ' - ' : ' + ') + fixed(Math.abs(im[0]), 4) + 'i'] };
  if (n === 1 && cx && isFinite(mx)) {   // 18 nov 2026: complejo suelto muy grande o muy pequeño, en notación científica (antes salía «1.0e+05 *» y nada)
    var dq = fmtMode === 'long' ? 15 : 4, sg = im[0] < 0 || Object.is(im[0], -0) ? ' - ' : ' + ';
    if (mx === 0) return { lines: [pad(fixed(0, dq), 9) + ' + ' + fixed(0, dq) + 'i'] };
    if (fmtMode !== 'long' || mx >= 1e5 || mx < 1e-3) return { lines: ['   ' + expo(re[0], dq) + sg + expo(Math.abs(im[0]), dq) + 'i'] };
  }
  if (n === 1 && !cx) {
    var v = re[0], av = Math.abs(v);
    if (fmtMode === 'long') return { lines: [av !== 0 && (av >= 1e5 || av <= 1e-3) ? '   ' + expo(v, 15) : pad(fixed(v, av >= 10 ? Math.max(0, 15 - Math.floor(Math.log10(av))) : 15), 20)] };
    return { lines: [av !== 0 && (av >= 1e5 || av <= 1e-3) ? '   ' + expo(v, 4) : pad(fixed(v, 4), 10)] };
  }
  if (mx >= 1e3 && isFinite(mx)) scale = Math.floor(Math.log10(mx));
  else if (mx > 0 && mx < 1e-3) scale = Math.floor(Math.log10(mx));
  var f = Math.pow(10, scale);
  if (scale) lines.push('   1.0e' + (scale < 0 ? '-' : '+') + (Math.abs(scale) < 10 ? '0' : '') + Math.abs(scale) + ' *', '');
  var colW = fmtMode === 'long' ? 20 : 10;
  for (i = 0; i < r; i++) {
    s = '';
    for (j = 0; j < c; j++) {
      k = j * r + i;
      var a = re[k] / f, t = (a === 0 && !cx) ? '0' : fixed(a, dp);
      if (cx) { var b = im[k] / f; t = fixed(a, dp) + (b < 0 || Object.is(b, -0) ? ' - ' : ' + ') + fixed(Math.abs(b), dp) + 'i'; s += pad(t, (fmtMode === 'long' ? 20 : 10) + dp + 5); }
      else s += pad(t, colW);
    }
    lines.push(s);
  }
  return { lines: lines };
}
function fmtSym(y) {
  if (!y.d.length) return ['[ empty sym ]'];
  var strs = y.d.map(pstr);
  if (y.r === 1 && y.c === 1) return [strs[0]];
  var w = []; for (var j = 0; j < y.c; j++) { var mx = 0; for (var i = 0; i < y.r; i++) mx = Math.max(mx, strs[j * y.r + i].length); w.push(mx); }
  var out = [];
  if (y.c === 1) { for (i = 0; i < y.r; i++) out.push(pad(strs[i], w[0])); return out; }
  for (i = 0; i < y.r; i++) { var row = []; for (j = 0; j < y.c; j++) row.push(pad(strs[j * y.r + i], w[j])); out.push('[' + row.join(', ') + ']'); }
  return out;
}
function display(name, v, F) {
  var L = [];
  if (v.k === 'm') {
    var o = fmtMatrix(v, F);
    if (v.ch && v.r === 1) return name + ' =\n\n' + o.lines[0] + '\n';
    if (v.r === 0 && v.c === 0 && !v.ch) return name + ' =\n\n     []\n';
    if (o.empty) return name + ' =\n\n' + o.lines[0] + '\n';
    if (v.lg) return name + ' =\n\n' + o.lines.join('\n') + '\n';
    if (isScalar(v) && !v.lg && !v.ch) return name + ' =\n\n' + o.lines[0] + '\n';
    return name + ' =\n\n' + o.lines.join('\n') + '\n';
  }
  if (v.k === 'y') {
    var ls = fmtSym(v);
    if (v.r * v.c === 1) return name + ' =\n \n' + ls[0] + '\n ';
    return name + ' =\n \n' + ls.join('\n') + '\n ';
  }
  if (v.k === 's') {
    var keys = Array.from(v.f.keys()), w = Math.max.apply(null, keys.map(function (k) { return k.length; }).concat([0]));
    L.push(name + ' = ', '', '  struct with fields:', '');
    keys.forEach(function (k) { L.push(pad(k, w + 4) + ': ' + inlineVal(v.f.get(k), F)); });
    return L.join('\n') + '\n';
  }
  if (v.k === 'f') return name + ' =\n\n  function_handle with value:\n\n    ' + v.src + '\n';
  if (v.k === 'c') {
    L.push(name + ' =', '', '  ' + v.r + '×' + v.c + ' cell array', '');
    for (var i = 0; i < v.r; i++) { var row = []; for (var j = 0; j < v.c; j++) { var cv = v.d[j * v.r + i], iv = inlineVal(cv, F); row.push('{' + (cv.k === 'm' && !cv.ch && iv[0] !== '[' ? '[' + iv + ']' : iv) + '}'); } L.push('    ' + row.join('    ')); }
    return L.join('\n') + '\n';
  }
  if (v.k === 'e') return name + ' =\n \n' + pstrMatEq(v) + '\n ';
  if (v.k === 'yr') { var w2 = Math.max.apply(null, v.s.map(function (x) { return x.length; })); return name + ' =\n \n' + (v.s.length === 1 ? v.s[0] : v.s.map(function (x) { return pad(x, w2); }).join('\n')) + '\n ';}
  return name + ' = ?\n';
}
function pstrMatEq(e) { return e.l.d.map(function (p, i) { return pstr(p) + ' == ' + pstr(e.r.d[e.r.d.length === 1 ? 0 : i]); }).join('\n'); }
function inlineVal(v, F) {
  if (v.k === 'yr') return v.s.length === 1 ? v.s[0] : '[' + v.r + '×1 sym]';
  if (v.k === 'y') { if (v.r * v.c === 1) return pstr(v.d[0]); if (!v.d.length) return '[0×1 sym]'; return '[' + v.r + '×' + v.c + ' sym]'; }
  if (v.k === 'm') {
    if (v.ch) return '\'' + str(v) + '\'';
    if (v.r * v.c === 1) { var o = fmtMatrix(v, F); return o.lines[0].trim(); }
    if (v.r === 1 && v.c <= 10) { var o2 = fmtMatrix(v, F); return '[' + o2.lines[o2.lines.length - 1].trim().replace(/\s+/g, ' ') + ']'; }
    return '[' + v.r + '×' + v.c + ' double]';
  }
  if (v.k === 's') return '[1×1 struct]';
  if (v.k === 'f') return v.src;
  return '[…]';
}
function dispStr(v, F) { // disp(x)
  if (v.k === 'm') {
    if (v.ch) { var rows = []; for (var i = 0; i < v.r; i++) { var s = ''; for (var j = 0; j < v.c; j++) s += String.fromCharCode(v.re[j * v.r + i]); rows.push(s); } return rows.join('\n') + '\n'; }
    if (!numel(v)) return '';
    var o = fmtMatrix(v, F); return o.lines.join('\n') + '\n\n';
  }
  if (v.k === 'y') return fmtSym(v).join('\n') + '\n';
  return display('', v, F).replace(/^ = \n?\n?/, '');
}
