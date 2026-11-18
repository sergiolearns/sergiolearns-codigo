/* sl-matlab · el intérprete: variables, índices, control de flujo y las funciones de AG. */
function Ctx(opts) {
  opts = opts || {};
  this.vars = new Map(); this.F = { mode: 'short' }; this.outBuf = '';
  this.out = opts.out || null; this.onWarn = opts.warn || null; this.onStep = opts.step || null;
  this.endStack = []; this.steps = 0; this.maxSteps = opts.maxSteps || 2e6; this.lastLine = 0;
}
Ctx.prototype.print = function (s) { if (this.out) this.out(s); else this.outBuf += s; };
Ctx.prototype.warn = function (m, en) { this.print('Warning: ' + (en || m) + '\n'); if (this.onWarn) this.onWarn(m, en); };

function truthy(v) {
  if (v.k === 'y') throw new MErr('Una condición no puede ser una expresión simbólica.', 0, 'cond');
  if (v.k !== 'm') throw new MErr('La condición tiene que ser un número o una matriz.', 0, 'cond');
  if (!numel(v)) return false;
  for (var i = 0; i < v.re.length; i++) { if (isNaN(v.re[i])) throw new MErr('NaN no se puede usar como verdadero o falso.', 0, 'nan'); if (!v.re[i] && !(v.im && v.im[i])) return false; }
  return true;
}
function num(v, what) {
  if (v.k === 'y') v = symToNum(v);
  if (v.k !== 'm' || !numel(v)) throw new MErr((what || 'El argumento') + ' tiene que ser un número.', 0, 'num');
  return v.re[0];
}
function isEmptyNum(v) { return v.k === 'm' && !v.ch && v.r === 0 && v.c === 0; }

// ---------- índices ----------
function idxList(v, n, ctx) {
  if (v.k === 'colon') { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  if (v.k === 'y') v = symToNum(v);
  if (v.k !== 'm') throw new MErr('Un índice tiene que ser un número.', 0, 'idx');
  var out = [];
  if (v.lg) { for (i = 0; i < v.re.length; i++) if (v.re[i]) out.push(i); return out; }
  for (i = 0; i < v.re.length; i++) {
    var x = v.re[i];
    if (!Number.isInteger(x) || x < 1) throw new MErr(x === 0 ? 'Los índices empiezan en 1 en MATLAB: A(0) no existe.' : 'Los índices tienen que ser enteros positivos (aquí hay un ' + fmtNum(x) + ').', 0, 'idxint');
    out.push(x - 1);
  }
  return out;
}
function fmtNum(x) { return Number.isInteger(x) ? String(x) : String(+x.toFixed(4)); }
function shapeOf(v) { return v.k === 'm' ? [v.r, v.c] : v.k === 'y' ? [v.r, v.c] : [1, 1]; }

function indexGet(A, args, ctx) {
  var isY = A.k === 'y', r = A.r, c = A.c, n = r * c;
  function el(k) { return isY ? A.d[k] : [A.re[k], A.im ? A.im[k] : 0]; }
  function build(rr, cc, ks) {
    if (isY) { var Ry = Y(rr, cc); ks.forEach(function (k, t) { Ry.d[t] = A.d[k]; }); return Ry; }
    var R = M(rr, cc); if (A.im) R.im = new Float64Array(rr * cc);
    ks.forEach(function (k, t) { R.re[t] = A.re[k]; if (A.im) R.im[t] = A.im[k]; }); R.lg = A.lg; R.ch = A.ch; return cleanIm(R);
  }
  if (args.length === 0) return A;
  if (args.length === 1) {
    var L = idxList(args[0], n, ctx);
    L.forEach(function (k) { if (k >= n) throw new MErr('El índice supera el número de elementos (' + n + ').', 0, 'idxbig', 'Index exceeds the number of array elements. Index must not exceed ' + n + '.'); });
    var iv = args[0], rr, cc;
    if (iv.k === 'colon') { rr = L.length; cc = 1; }
    else if (r === 1 && iv.k === 'm' && !(iv.r > 1 && iv.c > 1)) { rr = 1; cc = L.length; }
    else if (c === 1 && iv.k === 'm' && !(iv.r > 1 && iv.c > 1)) { rr = L.length; cc = 1; }
    else if (iv.k === 'm' && iv.lg) { rr = L.length; cc = 1; if (iv.r === 1) { rr = 1; cc = L.length; } }
    else { rr = iv.r; cc = iv.c; }
    return build(rr, cc, L);
  }
  if (args.length > 2) { for (var t = 2; t < args.length; t++) { var e = idxList(args[t], 1, ctx); if (e.some(function (x) { return x > 0; })) throw new MErr('Este entorno trabaja con matrices de dos dimensiones.', 0, 'nd'); } }
  var I = idxList(args[0], r, ctx), J = idxList(args[1], c, ctx);
  I.forEach(function (i) { if (i >= r) throw new MErr('El índice de fila ' + (i + 1) + ' supera el número de filas (' + r + ').', 0, 'idxbig', 'Index in position 1 exceeds array bounds. Index must not exceed ' + r + '.'); });
  J.forEach(function (j) { if (j >= c) throw new MErr('El índice de columna ' + (j + 1) + ' supera el número de columnas (' + c + ').', 0, 'idxbig', 'Index in position 2 exceeds array bounds. Index must not exceed ' + c + '.'); });
  var ks = []; J.forEach(function (j) { I.forEach(function (i) { ks.push(j * r + i); }); });
  return build(I.length, J.length, ks);
}
function grow(A, r, c) {
  if (r <= A.r && c <= A.c) return A;
  var R2 = Math.max(r, A.r), C2 = Math.max(c, A.c);
  if (A.k === 'y') { var Ry = Y(R2, C2); for (var j = 0; j < A.c; j++) for (var i = 0; i < A.r; i++) Ry.d[j * R2 + i] = A.d[j * A.r + i]; return Ry; }
  var R = M(R2, C2); if (A.im) R.im = new Float64Array(R2 * C2);
  for (j = 0; j < A.c; j++) for (i = 0; i < A.r; i++) { R.re[j * R2 + i] = A.re[j * A.r + i]; if (A.im) R.im[j * R2 + i] = A.im[j * A.r + i]; }
  R.ch = A.ch; return R;
}
function indexSet(A, args, B, ctx) {
  if (!A) A = M(0, 0);
  if (A.k !== 'm' && A.k !== 'y') throw new MErr('Solo se puede asignar con índices a una matriz.', 0, 'idxset');
  // borrar: A(i) = []
  if (isEmptyNum(B) && B.k === 'm') return deleteIdx(A, args, ctx);
  if (B.k === 'y' && A.k === 'm') A = toSym(A);
  if (A.k === 'y' && B.k === 'm') B = toSym(B);
  if (B.k !== 'm' && B.k !== 'y') throw new MErr('Solo se pueden guardar números o expresiones en una matriz.', 0, 'idxset');
  var isY = A.k === 'y', nb = B.r * B.c, I, J, R;
  function put(R0, k, t) {
    if (isY) { R0.d[k] = B.d[nb === 1 ? 0 : t]; return; }
    R0.re[k] = B.re[nb === 1 ? 0 : t];
    if (B.im) { if (!R0.im) R0.im = new Float64Array(R0.re.length); R0.im[k] = B.im[nb === 1 ? 0 : t]; } else if (R0.im) R0.im[k] = 0;
  }
  if (args.length === 1) {
    var n = A.r * A.c, L = idxList(args[0], n, ctx), mx = L.length ? Math.max.apply(null, L) + 1 : 0;
    if (nb !== 1 && nb !== L.length) throw new MErr('No casan los elementos: a la izquierda hay ' + L.length + ' y a la derecha ' + nb + '.', 0, 'asgn', 'Unable to perform assignment because the left and right sides have a different number of elements.');
    R = A.k === 'y' ? Y(A.r, A.c, A.d.slice()) : copy(A); R.ch = A.ch && B.ch;
    if (mx > n) { if (A.r <= 1) R = grow(R, A.r === 0 && A.c === 0 ? 1 : A.r, mx); else if (A.c === 1) R = grow(R, mx, 1); else throw new MErr('No se puede hacer crecer una matriz con un solo índice; usa A(i, j).', 0, 'grow'); }
    L.forEach(function (k, t) { put(R, k, t); });
    return isY ? R : cleanIm(R);
  }
  I = idxList(args[0], A.r, ctx); J = idxList(args[1], A.c, ctx);
  if (nb !== 1 && nb !== I.length * J.length) throw new MErr('No casan las dimensiones: a la izquierda ' + I.length + '×' + J.length + ' y a la derecha ' + B.r + '×' + B.c + '.', 0, 'asgn', 'Unable to perform assignment because the size of the left side is ' + I.length + '-by-' + J.length + ' and the size of the right side is ' + B.r + '-by-' + B.c + '.');
  var mr = I.length ? Math.max.apply(null, I) + 1 : 0, mc = J.length ? Math.max.apply(null, J) + 1 : 0;
  R = A.k === 'y' ? Y(A.r, A.c, A.d.slice()) : copy(A); R = grow(R, mr, mc);
  var t = 0; J.forEach(function (j) { I.forEach(function (i) { put(R, j * R.r + i, t++); }); });
  return isY ? R : cleanIm(R);
}
function deleteIdx(A, args, ctx) {
  if (args.length === 1) {
    var n = A.r * A.c, L = idxList(args[0], n, ctx), keep = [];
    for (var k = 0; k < n; k++) if (L.indexOf(k) < 0) keep.push(k);
    var row = A.r === 1 || (A.r !== 1 && A.c !== 1);
    var src = A; return indexGet(src, [fromList(keep, row)], ctx);
  }
  var colAll = args[0].k === 'colon', rowAll = args[1].k === 'colon';
  if (colAll) { var J = idxList(args[1], A.c, ctx), kj = []; for (var j = 0; j < A.c; j++) if (J.indexOf(j) < 0) kj.push(j); return indexGet(A, [{ k: 'colon' }, fromList(kj, true)], ctx); }
  if (rowAll) { var I = idxList(args[0], A.r, ctx), ki = []; for (var i = 0; i < A.r; i++) if (I.indexOf(i) < 0) ki.push(i); return indexGet(A, [fromList(ki, true), { k: 'colon' }], ctx); }
  throw new MErr('Para borrar con A(i, j) = [], uno de los dos índices tiene que ser «:».', 0, 'del');
}
function fromList(L, row) { var m = row ? M(1, L.length) : M(L.length, 1); L.forEach(function (k, i) { m.re[i] = k + 1; }); return m; }

// ---------- concatenar ----------
function hcat(vals) {
  vals = vals.filter(function (v) { return !(v.k === 'm' && v.r * v.c === 0 && !(v.r > 0 && v.c === 0 && false)); });
  if (!vals.length) return M(0, 0);
  var anyY = vals.some(function (v) { return v.k === 'y'; }), anyCh = vals.every(function (v) { return v.k === 'm' && v.ch; }) || vals.some(function (v) { return v.k === 'm' && v.ch; });
  if (vals.some(function (v) { return v.k !== 'm' && v.k !== 'y'; })) { if (vals.length === 1) return vals[0]; throw new MErr('No se pueden juntar estos valores en una matriz.', 0, 'cat'); }
  var r = vals[0].r; vals.forEach(function (v) { if (v.r !== r) throw new MErr('Las dimensiones no casan al juntar en horizontal: todas las piezas tienen que tener el mismo número de filas (' + vals.map(function (x) { return x.r; }).join(' y ') + ').', 0, 'horzcat'); });
  var c = vals.reduce(function (s, v) { return s + v.c; }, 0);
  if (anyY) { var Ry = Y(r, c), o = 0; vals.forEach(function (v) { var y = toSym(v); y.d.forEach(function (p, k) { Ry.d[o + k] = p; }); o += y.d.length; }); return Ry; }
  var R = M(r, c), off = 0, cx = vals.some(function (v) { return v.im; }); if (cx) R.im = new Float64Array(r * c);
  vals.forEach(function (v) { R.re.set(v.re, off); if (cx && v.im) R.im.set(v.im, off); off += v.re.length; });
  R.ch = anyCh; R.lg = vals.every(function (v) { return v.lg; });
  return R;
}
function vcat(vals) {
  vals = vals.filter(function (v) { return !(v.k === 'm' && v.r * v.c === 0); });
  if (!vals.length) return M(0, 0);
  if (vals.length === 1) return vals[0];
  var c = vals[0].c; vals.forEach(function (v) { if (v.c !== c) throw new MErr('Las dimensiones no casan al juntar en vertical: todas las filas tienen que tener el mismo número de columnas (' + vals.map(function (x) { return x.c; }).join(' y ') + ').', 0, 'vertcat'); });
  var T = vals.map(function (v) { return v.k === 'y' ? ytr(v) : transpose(v, false); });
  var H = hcat(T); return H.k === 'y' ? ytr(H) : transpose(H, false);
}

// ---------- operadores (con lo simbólico) ----------
function anyY(a, b) { return a.k === 'y' || b.k === 'y'; }
function binop(o, a, b, ctx) {
  if (a.k === 'yr') a = a.num; if (b.k === 'yr') b = b.num;
  if (a.k === 'e' || b.k === 'e') throw new MErr('No se puede operar con una ecuación (A == B); guárdala y úsala en solve.', 0, 'eq');
  if ((a.k !== 'm' && a.k !== 'y') || (b.k !== 'm' && b.k !== 'y')) throw new MErr('Operador «' + o + '» no definido para estos valores.', 0, 'op');
  if (anyY(a, b)) {
    var A = toSym(a), B = toSym(b);
    switch (o) {
      case '+': return yew(A, B, padd, '+');
      case '-': return yew(A, B, psub, '-');
      case '.*': return yew(A, B, pmul, '.*');
      case '*': return ymtimes(A, B);
      case './': return yew(A, B, ydivConst, './');
      case '/': if (B.r * B.c === 1) return yew(A, B, ydivConst, '/'); throw new MErr('b/A simbólico con matrices no está disponible; usa inv(A).', 0, 'sym');
      case '\\': if (A.r * A.c === 1) return yew(B, A, ydivConst, '\\'); return ysolveMat(A, B);
      case '.^': case '^':
        if (B.r * B.c !== 1 || !pisConst(B.d[0])) throw new MErr('Solo se pueden elevar expresiones simbólicas a un número entero.', 0, 'sympow');
        var e = pconstVal(B.d[0]); if (e.d !== 1n || e.n < 0n) throw new MErr('Solo se pueden elevar expresiones simbólicas a un entero no negativo en este entorno.', 0, 'sympow');
        var ei = Number(e.n);
        if (o === '^' && A.r * A.c > 1) { if (A.r !== A.c) throw new MErr('La matriz tiene que ser cuadrada para A^n.', 0, 'square'); var R = toSym(eye(A.r, A.r)); for (var i = 0; i < ei; i++) R = ymtimes(R, A); return R; }
        return yew(A, Y(1, 1, [pconst(Q1)]), function (p) { return ppow(p, ei); }, '.^');
      case '==': return { k: 'e', l: A, r: B };
      case '~=': throw new MErr('«~=» con expresiones simbólicas no está disponible.', 0, 'sym');
      default: throw new MErr('El operador «' + o + '» no está disponible con expresiones simbólicas.', 0, 'sym');
    }
  }
  if (a.ch && o !== '==' && o !== '~=') a = Object.assign(copy(a), { ch: false });
  if (b.ch && o !== '==' && o !== '~=') b = Object.assign(copy(b), { ch: false });
  switch (o) {
    case '*': return mtimes(a, b);
    case '/': return mrdivide(a, b, ctx);
    case '\\': return mldivide(a, b, ctx);
    case '^': return mpower(a, b, ctx);
    case '&&': case '||': throw new MErr('&& y || van con condiciones de un solo valor.', 0, 'and');
  }
  var f = OPS[o]; if (!f) throw new MErr('Operador «' + o + '» no válido.', 0, 'op');
  if (o === '+' || o === '-' || o === '.*' || o === './' || o === '.^' || o === '.\\') { a = unlg(a); b = unlg(b); }
  return f(a, b);
}
function unlg(v) { if (v.lg || v.ch) { var c = copy(v); c.lg = false; c.ch = false; return c; } return v; }
function ysolveMat(A, B) { // A\B exacto con A numérica
  if (!yIsNum(A)) throw new MErr('A\\b simbólico necesita una A con números.', 0, 'sym');
  if (A.r !== A.c) throw new MErr('A\\b simbólico necesita una A cuadrada en este entorno.', 0, 'sym');
  var n = A.r, a = yqrows(A), m = B.c, rows = [];
  for (var i = 0; i < n; i++) { var row = a[i].map(function (q) { return pconst(q); }); for (var j = 0; j < m; j++) row.push(B.d[j * n + i]); rows.push(row); }
  // Gauss-Jordan con polinomios a la derecha
  for (var c = 0; c < n; c++) {
    var p = -1; for (i = c; i < n; i++) if (!qz(pconstVal(rows[i][c]))) { p = i; break; }
    if (p < 0) throw new MErr('La matriz es singular: el sistema no tiene solución única.', 0, 'sing');
    var t = rows[p]; rows[p] = rows[c]; rows[c] = t; var pv = pconstVal(rows[c][c]);
    rows[c] = rows[c].map(function (x) { return pscale(x, qdiv(Q1, pv)); });
    for (i = 0; i < n; i++) if (i !== c) { var f = pconstVal(rows[i][c]); if (!qz(f)) rows[i] = rows[i].map(function (x, k) { return psub(x, pscale(rows[c][k], f)); }); }
  }
  var R = Y(n, m); for (i = 0; i < n; i++) for (j = 0; j < m; j++) R.d[j * n + i] = rows[i][n + j]; return R;
}

// ---------- evaluación ----------
function evalE(e, ctx, nout) {
  switch (e.k) {
    case 'num': return e.im ? sc(0, e.v) : sc(e.v);
    case 'str': return chr(e.v);
    case 'paren': return evalE(e.a, ctx);
    case 'colon': return { k: 'colon' };
    case 'end': {
      var E = ctx.endStack[ctx.endStack.length - 1]; if (!E) throw new MErr('«end» solo se puede usar dentro de un índice, como A(end).', 0, 'end');
      var v = E.v, sh = shapeOf(v); return sc(E.n === 1 ? sh[0] * sh[1] : E.k === 0 ? sh[0] : E.k === 1 ? sh[1] : 1);
    }
    case 'id': return callOrVar(e.v, null, ctx, nout, e);
    case 'idx': {
      if (e.a.k === 'id' && !ctx.vars.has(e.a.v)) { var argsF = e.args.map(function (x) { return evalE(x, ctx); }); return callOrVar(e.a.v, argsF, ctx, nout, e.a); }
      var base = evalE(e.a, ctx); if (base.k === 'yr') base = base.num;
      if (base.k === 'f') return callFn(base, e.args.map(function (x) { return evalE(x, ctx); }), ctx, nout);
      var args = evalArgs(e.args, base, ctx);
      if (base.k === 'c') { var cg = indexGet(cellAsM(base), args, ctx); return cellFrom(base, cg); }
      if (base.k === 's') { if (args.every(function (a) { return a.k === 'm' && numel(a) === 1 && a.re[0] === 1; })) return base; throw new MErr('Índice no válido para un struct.', 0, 'idx'); }
      return indexGet(base, args, ctx);
    }
    case 'cidx': {
      var cb = evalE(e.a, ctx); if (cb.k !== 'c') throw new MErr('Las llaves {} solo indexan arrays de celdas.', 0, 'cell');
      var ca = evalArgs(e.args, cb, ctx), sel = indexGet(cellAsM(cb), ca, ctx); if (numel(sel) !== 1) throw new MErr('Pide un solo elemento de la celda.', 0, 'cell');
      return cb.d[sel.re[0]];
    }
    case 'fld': {
      var s = evalE(e.a, ctx); if (s.k !== 's') throw new MErr('Solo los struct tienen campos (con «.' + e.f + '»).', 0, 'fld');
      if (!s.f.has(e.f)) throw new MErr('El struct no tiene el campo «' + e.f + '». Tiene: ' + Array.from(s.f.keys()).join(', ') + '.', 0, 'fld', 'Unrecognized field name "' + e.f + '".');
      return s.f.get(e.f);
    }
    case 'neg': { var a = evalE(e.a, ctx); if (a.k === 'y') return yew(a, Y(1, 1, [pconst(Q0)]), pneg, '-'); if (a.k !== 'm') throw new MErr('No se puede cambiar de signo este valor.', 0, 'neg'); return neg(unlg(a)); }
    case 'not': return not(evalE(e.a, ctx));
    case 'ctr': case 'tr': { var t = evalE(e.a, ctx); if (t.k === 'y') return ytr(t); if (t.k !== 'm') throw new MErr('No se puede trasponer este valor.', 0, 'tr'); return transpose(t, e.k === 'ctr'); }
    case 'bin': {
      if (e.o === '&&' || e.o === '||') {
        var l = evalE(e.a, ctx); if (l.k === 'm' && numel(l) !== 1) throw new MErr('Los operandos de ' + e.o + ' tienen que dar un solo valor lógico.', 0, 'andand');
        var lv = truthy(l); if (e.o === '&&' && !lv) return lg(sc(0)); if (e.o === '||' && lv) return lg(sc(1));
        var rv = evalE(e.b, ctx); if (rv.k === 'm' && numel(rv) !== 1) throw new MErr('Los operandos de ' + e.o + ' tienen que dar un solo valor lógico.', 0, 'andand');
        return lg(sc(truthy(rv) ? 1 : 0));
      }
      return binop(e.o, evalE(e.a, ctx), evalE(e.b, ctx), ctx);
    }
    case 'range': {
      var A0 = num(evalE(e.a, ctx), 'El inicio del rango'), st = e.s ? num(evalE(e.s, ctx), 'El paso del rango') : 1, B0 = num(evalE(e.b, ctx), 'El final del rango');
      if (st === 0 || (st > 0 && A0 > B0) || (st < 0 && A0 < B0)) return M(1, 0);
      var nn = Math.floor((B0 - A0) / st * (1 + 1e-12) + 1e-10) + 1; if (nn > 1e7) throw new MErr('El rango es demasiado grande.', 0, 'range');
      var R = M(1, nn); for (var i = 0; i < nn; i++) R.re[i] = A0 + i * st;
      if (nn > 1 && Math.abs(R.re[nn - 1] - B0) < 1e-10 * Math.max(1, Math.abs(B0))) R.re[nn - 1] = B0;
      return R;
    }
    case 'mat': {
      var rows = e.rows.map(function (row) { return hcat(row.map(function (x) { return single(evalE(x, ctx)); })); });
      return vcat(rows);
    }
    case 'cell': {
      var cr = e.rows.map(function (row) { return row.map(function (x) { return evalE(x, ctx); }); });
      var r = cr.length, c = r ? cr[0].length : 0; cr.forEach(function (row) { if (row.length !== c) throw new MErr('Todas las filas de la celda tienen que tener los mismos elementos.', 0, 'cell'); });
      var C = { k: 'c', r: r, c: c, d: [] }; for (var j = 0; j < c; j++) for (i = 0; i < r; i++) C.d.push(cr[i][j]); return C;
    }
    case 'lambda': {
      var snap = new Map(ctx.vars); return { k: 'f', ps: e.ps, body: e.body, env: snap, src: '@(' + e.ps.join(',') + ')' + srcOf(e.body) };
    }
    case 'fh': return { k: 'f', builtin: e.name, src: '@' + e.name };
  }
  throw new MErr('Expresión no válida.', 0, 'expr');
}
function single(v) { if (v.k === 'e') throw new MErr('Las ecuaciones (==) simbólicas no se pueden meter en [ ] en este entorno: pásalas a solve separadas por comas.', 0, 'eqcat'); return v; }
function cellAsM(c) { var m = M(c.r, c.c); for (var i = 0; i < m.re.length; i++) m.re[i] = i; return m; }
function cellFrom(c, sel) { var o = { k: 'c', r: sel.r, c: sel.c, d: [] }; for (var i = 0; i < sel.re.length; i++) o.d.push(c.d[sel.re[i]]); return o; }
function evalArgs(args, base, ctx) {
  return args.map(function (a, k) {
    if (a.k === 'colon') return a;
    ctx.endStack.push({ v: base, k: k, n: args.length });
    try { return evalE(a, ctx); } finally { ctx.endStack.pop(); }
  });
}
function callFn(f, args, ctx, nout) {
  if (f.builtin) return callOrVar(f.builtin, args, ctx, nout);
  if (args.length > f.ps.length) throw new MErr('Demasiados argumentos para la función anónima (espera ' + f.ps.length + ').', 0, 'nargs');
  var save = ctx.vars; ctx.vars = new Map(f.env);
  f.ps.forEach(function (p, i) { if (i < args.length) ctx.vars.set(p, args[i]); });
  try { return evalE(f.body, ctx, nout); } finally { ctx.vars = save; }
}
function callOrVar(name, args, ctx, nout, node) {
  if (ctx.vars.has(name)) { var v = ctx.vars.get(name); if (args) { if (v.k === 'f') return callFn(v, args, ctx, nout); return indexGet(v, args, ctx); } return v; }
  var B = BUILTIN[name];
  if (!B) {
    var sug = suggest(name, ctx);
    throw new MErr('Variable o función no definida: «' + name + '».' + (sug ? ' ¿Querías decir «' + sug + '»?' : ''), node && node.line, 'undef', args && args.length ? 'Undefined function \'' + name + '\' for input arguments of type \'double\'.' : 'Unrecognized function or variable \'' + name + '\'.');
  }
  return B(args || [], ctx, nout || 1, name);
}
function suggest(name, ctx) {
  var cands = Array.from(ctx.vars.keys()).concat(Object.keys(BUILTIN)), best = null, bd = 3;
  cands.forEach(function (c) { var d = lev(name.toLowerCase(), c.toLowerCase()); if (d < bd || (d === bd && false)) { bd = d; best = c; } });
  return bd <= (name.length > 3 ? 2 : 1) ? best : null;
}
function lev(a, b) { var d = []; for (var i = 0; i <= a.length; i++) { d.push([i]); } for (var j = 1; j <= b.length; j++) d[0][j] = j; for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; }
function srcOf(e) {
  switch (e.k) {
    case 'num': return (Number.isInteger(e.v) ? String(e.v) : String(e.v)) + (e.im ? 'i' : '');
    case 'str': return "'" + e.v + "'";
    case 'id': return e.v; case 'end': return 'end'; case 'colon': return ':';
    case 'paren': return '(' + srcOf(e.a) + ')';
    case 'neg': return '-' + srcOf(e.a); case 'not': return '~' + srcOf(e.a);
    case 'ctr': return srcOf(e.a) + "'"; case 'tr': return srcOf(e.a) + ".'";
    case 'bin': return srcOf(e.a) + e.o + srcOf(e.b);
    case 'range': return srcOf(e.a) + ':' + (e.s ? srcOf(e.s) + ':' : '') + srcOf(e.b);
    case 'idx': return srcOf(e.a) + '(' + e.args.map(srcOf).join(',') + ')';
    case 'cidx': return srcOf(e.a) + '{' + e.args.map(srcOf).join(',') + '}';
    case 'fld': return srcOf(e.a) + '.' + e.f;
    case 'mat': return '[' + e.rows.map(function (r) { return r.map(srcOf).join(' '); }).join(';') + ']';
    case 'lambda': return '@(' + e.ps.join(',') + ')' + srcOf(e.body);
    case 'fh': return '@' + e.name;
  }
  return '?';
}

// ---------- sentencias ----------
function BreakSig() {} function ContSig() {} function RetSig() {}
function execBlock(stmts, ctx) { for (var i = 0; i < stmts.length; i++) execS(stmts[i], ctx); }
function show(name, v, ctx) {
  if (v.k === 'y' || v.k === 'yr' || v.k === 'e') { var body = display(name, v, ctx.F).replace(/^[^\n]*\n \n/, '').replace(/[\n ]*$/, ''); ctx.print(' \n' + name + ' =\n \n' + body + '\n \n'); return; }   // los simbólicos, entre líneas con un espacio, como MATLAB
  ctx.print('\n' + display(name, v, ctx.F).replace(/\n*$/, '') + '\n\n');
}
function assignTo(lhs, val, ctx) {
  if (lhs.k === 'id') { if (val.k === 'colon') throw new MErr('«:» solo vale dentro de un índice.', 0, 'colon'); ctx.vars.set(lhs.v, val); return lhs.v; }
  // cadena de índices/campos: reconstruir de dentro afuera
  function setPath(node, v) {
    if (node.k === 'id') { ctx.vars.set(node.v, v); return node.v; }
    var parent = node.a, cur = null;
    try { cur = evalE(parent, ctx); } catch (er) { if (!(er.isM && er.id === 'undef')) throw er; cur = null; }
    var nv;
    if (node.k === 'fld') { var s = cur && cur.k === 's' ? { k: 's', f: new Map(cur.f) } : { k: 's', f: new Map() }; if (cur && cur.k !== 's' && !(cur.k === 'm' && !numel(cur))) throw new MErr('«' + srcOf(parent) + '» no es un struct: no tiene campos.', 0, 'fld'); s.f.set(node.f, v); nv = s; }
    else if (node.k === 'idx') { var args = evalArgs(node.args, cur || M(0, 0), ctx); nv = indexSet(cur, args, v, ctx); }
    else if (node.k === 'cidx') {
      var c = cur && cur.k === 'c' ? cur : { k: 'c', r: 0, c: 0, d: [] }, ca = evalArgs(node.args, c, ctx);
      var tmp = indexSet(cellAsM(c), ca, sc(-1), ctx), d2 = [];
      for (var i = 0; i < tmp.re.length; i++) d2.push(tmp.re[i] === -1 ? v : (tmp.re[i] >= 0 && i < tmp.re.length && c.d[tmp.re[i]] !== undefined && (tmp.re[i] !== 0 || c.d.length) ? c.d[tmp.re[i]] : M(0, 0)));
      nv = { k: 'c', r: tmp.r, c: tmp.c, d: d2 };
    }
    else throw new MErr('No se puede asignar aquí.', 0, 'asgn');
    return setPath(parent, nv);
  }
  return setPath(lhs, val);
}
function rootName(n) { while (n.k !== 'id') n = n.a; return n.v; }
function execS(s, ctx) {
  ctx.lastLine = s.line;
  if (++ctx.steps > ctx.maxSteps) throw new MErr('El programa lleva demasiados pasos: ¿hay un bucle que no termina?', s.line, 'loop');
  if (ctx.onStep) ctx.onStep(s);
  try {
    switch (s.k) {
      case 'expr': {
        var e = s.e, v;
        if (e.k === 'id' && !ctx.vars.has(e.v) && BUILTIN[e.v] && NOANS[e.v]) { BUILTIN[e.v]([], ctx, 0, e.v); return; }
        if ((e.k === 'idx') && e.a.k === 'id' && !ctx.vars.has(e.a.v) && NOANS[e.a.v]) { var a0 = e.args.map(function (x) { return evalE(x, ctx); }); BUILTIN[e.a.v](a0, ctx, 0, e.a.v); return; }
        v = evalE(e, ctx, 1);
        if (v === undefined || v === null) return;
        if (v.k === 'colon') throw new MErr('«:» solo vale dentro de un índice.', s.line, 'colon');
        var nm = (e.k === 'id' && ctx.vars.has(e.v)) ? e.v : 'ans';
        if (nm === 'ans') ctx.vars.set('ans', v);
        if (!s.quiet) show(nm, v, ctx);
        return;
      }
      case 'assign': {
        var val = evalE(s.e, ctx, 1); if (val === undefined || val === null) throw new MErr('Esta función no devuelve ningún valor para guardar.', s.line, 'novalue');
        var name = assignTo(s.lhs, val, ctx);
        if (!s.quiet) show(name, ctx.vars.get(name), ctx);
        return;
      }
      case 'massign': {
        var outs = evalE(s.e, ctx, s.lhs.length);
        if (!outs || !outs.multi) { if (s.lhs.length === 1) outs = { multi: [outs] }; else throw new MErr('Esta expresión no devuelve ' + s.lhs.length + ' resultados.', s.line, 'nout'); }
        if (outs.multi.length < s.lhs.length) throw new MErr('Demasiadas salidas: la función devuelve ' + outs.multi.length + '.', s.line, 'nout');
        s.lhs.forEach(function (l, i) { if (!l) return; var n2 = assignTo(l, outs.multi[i], ctx); if (!s.quiet) show(n2, ctx.vars.get(n2), ctx); });
        return;
      }
      case 'cmd': return runCmd(s, ctx);
      case 'if': {
        for (var i = 0; i < s.cl.length; i++) if (truthy(evalE(s.cl[i][0], ctx))) { execBlock(s.cl[i][1], ctx); return; }
        if (s.els) execBlock(s.els, ctx); return;
      }
      case 'for': {
        var rg = evalE(s.rg, ctx), ncol = rg.k === 'm' || rg.k === 'y' ? rg.c : 1;
        if (rg.r === 0) ncol = 0;
        for (var c = 0; c < ncol; c++) {
          var col = rg.r === 1 ? indexGet(rg, [sc(c + 1)], ctx) : indexGet(rg, [{ k: 'colon' }, sc(c + 1)], ctx);
          ctx.vars.set(s.v, col);
          try { execBlock(s.body, ctx); } catch (sig) { if (sig instanceof BreakSig) break; if (sig instanceof ContSig) continue; throw sig; }
        }
        return;
      }
      case 'while': {
        while (truthy(evalE(s.c, ctx))) { try { execBlock(s.body, ctx); } catch (sig2) { if (sig2 instanceof BreakSig) break; if (sig2 instanceof ContSig) continue; throw sig2; } if (++ctx.steps > ctx.maxSteps) throw new MErr('El bucle while no termina.', s.line, 'loop'); }
        return;
      }
      case 'switch': {
        var sv = evalE(s.e, ctx);
        for (var k = 0; k < s.cases.length; k++) {
          var cv = evalE(s.cases[k][0], ctx), hit;
          if (cv.k === 'c') hit = cv.d.some(function (x) { return eqVal(sv, x); }); else hit = eqVal(sv, cv);
          if (hit) { execBlock(s.cases[k][1], ctx); return; }
        }
        if (s.oth) execBlock(s.oth, ctx); return;
      }
      case 'try': try { execBlock(s.b, ctx); } catch (er) { if (!er.isM) throw er; if (s.cv) { var st = { k: 's', f: new Map([['message', chr(er.en || er.message)], ['identifier', chr('')]]) }; ctx.vars.set(s.cv, st); } execBlock(s.cb, ctx); } return;
      case 'break': throw new BreakSig();
      case 'continue': throw new ContSig();
      case 'return': throw new RetSig();
    }
  } catch (er) { if (er && er.isM && !er.line) er.line = s.line; throw er; }
}
function eqVal(a, b) {
  if (a.k === 'm' && b.k === 'm') { if (a.ch || b.ch) return a.ch && b.ch && str(a) === str(b); return numel(a) === 1 && numel(b) === 1 && a.re[0] === b.re[0]; }
  return false;
}
function runCmd(s, ctx) {
  var a = s.args;
  switch (s.name) {
    case 'format': return BUILTIN.format(a.map(chr), ctx);
    case 'syms': return BUILTIN.syms(a.map(chr), ctx);
    case 'clear': case 'clearvars': return BUILTIN.clear(a.map(chr), ctx);
    case 'clc': return BUILTIN.clc([], ctx);
    case 'close': case 'clf': case 'hold': case 'more': case 'figure': case 'grid': case 'axis': case 'warning': return;
    case 'help': case 'doc': return BUILTIN.help(a.map(chr), ctx);
    case 'who': case 'whos': return BUILTIN.who([], ctx, 0, s.name);
  }
}
function run(src, ctx) {
  var prog = parse(src);
  try { execBlock(prog, ctx); }
  catch (e) { if (e instanceof RetSig) return; if (e instanceof BreakSig || e instanceof ContSig) throw new MErr('break o continue fuera de un bucle.', ctx.lastLine, 'break'); throw e; }
}
