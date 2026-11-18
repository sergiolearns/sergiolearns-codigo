/* sl-matlab v1.0 (16 nov 2026) · SergioLearns. Intérprete propio de la parte de MATLAB que se usa en Álgebra y Geometría (GCID, ULPGC):
   matrices reales y complejas, format short/long/rat, rref, rank, det, inv, A\b, null, eig, lu, qr, norm, dot, cross… y lo simbólico
   justo para syms/solve/subs de sistemas lineales. No es MATLAB ni pretende serlo: es compatible con lo que pide la asignatura. */
(function (root) {
"use strict";
/* sl-matlab · léxico y análisis (16 nov 2026). Un subconjunto de MATLAB: el que se usa en Álgebra y Geometría. */
var KW = { 'if': 1, 'elseif': 1, 'else': 1, 'end': 1, 'for': 1, 'while': 1, 'break': 1, 'continue': 1, 'return': 1,
  'switch': 1, 'case': 1, 'otherwise': 1, 'function': 1, 'try': 1, 'catch': 1 };
var CMDS = { format: 1, syms: 1, clear: 1, clc: 1, close: 1, clf: 1, hold: 1, more: 1, help: 1, doc: 1, warning: 1, figure: 1, clearvars: 1, who: 1, whos: 1, grid: 1, axis: 1 };

var EN_BY_ID = {
  mtimes: 'Incorrect dimensions for matrix multiplication. Check that the number of columns in the first matrix matches the number of rows in the second matrix. To operate on each element of the matrix individually, use TIMES (.*) for elementwise multiplication.',
  dims: 'Arrays have incompatible sizes for this operation.', idxint: 'Array indices must be positive integers or logical values.',
  square: 'Matrix must be square.', horzcat: 'Dimensions of arrays being concatenated are not consistent.', vertcat: 'Dimensions of arrays being concatenated are not consistent.',
  mpower: 'Incorrect dimensions for raising a matrix to a power. Check that the matrix is square and the power is a scalar. To operate on each element of the matrix individually, use POWER (.^) for elementwise power.',
  mldivide: 'Matrix dimensions must agree.', mrdivide: 'Matrix dimensions must agree.', cross: 'A and B must be of length 3 in the dimension in which the cross product is taken.',
  dot: 'A and B must be same size.', nargs: 'Not enough input arguments.', str: 'Character vector is not terminated properly.',
  parse: 'Invalid expression. Check for missing multiplication operator, missing or unbalanced delimiters, or other syntax error. To construct matrices, use brackets instead of parentheses.',
  incomplete: 'This statement is incomplete.', noend: 'At least one END is missing. The statement beginning here does not have a matching end.',
  eqop: "Unsupported use of the '=' operator. To compare values for equality, use '=='. To specify name-value arguments, check that name is a valid identifier with no surrounding quotes.",
  loop: 'Execution stopped: too many steps (is there a loop that never ends?).', sym0: 'Division by zero.', plot: 'Plots are not available in this playground.'
};
function MErr(msg, line, id, en) { this.message = msg; this.line = line || 0; this.id = id || ''; this.en = en || EN_BY_ID[id] || msg; this.isM = true; }
MErr.prototype = Object.create(Error.prototype);

function lex(src) {
  src = String(src).replace(/[\u223C\uFF5E]/g, '~').replace(/[\u02C6\uFF3E]/g, '^').replace(/[\u2018\u2019\u2032]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2212\u2013]/g, '-').replace(/\u00D7/g, '*').replace(/\u00A0/g, ' ');
  var t = [], i = 0, n = src.length, line = 1, stack = [], lineStart = true;
  function inMat() { return stack.length && (stack[stack.length - 1] === '[' || stack[stack.length - 1] === '{'); }
  function prevEndsValue() {
    var p = t[t.length - 1]; if (!p) return false;
    if (p.t === 'num' || p.t === 'str' || p.t === 'id') return true;
    if (p.t === 'kw') return p.v === 'end';
    if (p.t === 'op') return p.v === ')' || p.v === ']' || p.v === '}' || p.v === "'" || p.v === ".'";
    return false;
  }
  function push(o) { o.line = line; t.push(o); lineStart = false; }
  while (i < n) {
    var ch = src[i];
    // comentarios de bloque %{ ... %} en su propia línea
    if (lineStart && /^[ \t]*%\{[ \t]*(\r?\n|$)/.test(src.slice(i, i + 200))) {
      var depth = 0, j = i;
      while (j < n) {
        var le = src.indexOf('\n', j); if (le < 0) le = n;
        var L = src.slice(j, le).trim();
        if (L === '%{') depth++; else if (L === '%}') depth--;
        j = le + 1; line++;
        if (depth === 0) break;
      }
      line--; i = j - 1; if (i < n && src[i] === '\n') { line++; i++; }
      push({ t: 'nl', v: '\n' }); lineStart = true; continue;
    }
    if (ch === '%' ) { while (i < n && src[i] !== '\n') i++; continue; }
    if (ch === '.' && src.substr(i, 3) === '...') { while (i < n && src[i] !== '\n') i++; i++; line++; continue; }
    if (ch === '\r') { i++; continue; }
    if (ch === '\n') {
      if (inMat()) { var pp = t[t.length - 1]; if (pp && !(pp.t === 'op' && (pp.v === ';' || pp.v === '[' || pp.v === '{'))) push({ t: 'op', v: ';' }); }
      else if (stack.length) { /* dentro de ( ): MATLAB da error; seguimos */ }
      else push({ t: 'nl', v: '\n' });
      i++; line++; lineStart = true; continue;
    }
    if (ch === ' ' || ch === '\t') {
      var j2 = i; while (j2 < n && (src[j2] === ' ' || src[j2] === '\t')) j2++;
      var nx = src[j2] || '';
      if (inMat() && prevEndsValue()) {
        var starts = /[0-9A-Za-z_(\[{"@]/.test(nx) || (nx === '.' && /[0-9]/.test(src[j2 + 1] || '')) || (nx === "'") ||
          ((nx === '+' || nx === '-') && src[j2 + 1] && !/[ \t]/.test(src[j2 + 1]) && src[j2 + 1] !== '=') ||
          (nx === '~' && src[j2 + 1] !== '=');
        if (starts && nx !== '%' && src.substr(j2, 3) !== '...') push({ t: 'op', v: ',', ws: 1 });
      }
      i = j2;
      if (t.length) t[t.length - 1].sp = 1;
      continue;
    }
    // comando: format rat, syms x y real, clear all...
    if (lineStart && /[A-Za-z]/.test(ch)) {
      var m = /^([A-Za-z]\w*)([ \t]+)([^\n;,=(%][^\n;,%]*)?/.exec(src.slice(i, i + 400));
      if (m && CMDS[m[1]] && m[3] && !/^[=(]/.test(m[3]) && !/^[-+*\/\\^<>&|~.]=?[ \t]/.test(m[3])) {
        var args = m[3].trim().split(/[ \t]+/).filter(Boolean);
        push({ t: 'cmd', v: m[1], args: args }); i += m[0].length; continue;
      }
    }
    lineStart = false;
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      var mm = /^(\d+\.?\d*|\.\d+)([eEdD][+-]?\d+)?/.exec(src.slice(i));
      var s = mm[0].replace(/[dD]/, 'e'), v = parseFloat(s); i += mm[0].length;
      var im = false; if ((src[i] === 'i' || src[i] === 'j') && !/[\w]/.test(src[i + 1] || '')) { im = true; i++; }
      push({ t: 'num', v: v, im: im }); continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      var m3 = /^[A-Za-z]\w*/.exec(src.slice(i)); i += m3[0].length;
      if (KW[m3[0]]) {
        // «end» dentro de un índice es la última posición
        if (m3[0] === 'end' && stack.length && stack[stack.length - 1] !== 'blk') push({ t: 'id', v: 'end', endIdx: 1 });
        else push({ t: 'kw', v: m3[0] });
      } else push({ t: 'id', v: m3[0] });
      continue;
    }
    if (ch === '"') {
      var j3 = i + 1, s3 = '';
      while (j3 < n) { if (src[j3] === '"') { if (src[j3 + 1] === '"') { s3 += '"'; j3 += 2; continue; } break; } if (src[j3] === '\n') throw new MErr('Falta la comilla de cierre de la cadena.', line, 'str'); s3 += src[j3++]; }
      if (j3 >= n) throw new MErr('Falta la comilla de cierre de la cadena.', line, 'str');
      i = j3 + 1; push({ t: 'str', v: s3, dq: 1 }); continue;
    }
    if (ch === "'") {
      var isT = prevEndsValue() && !(inMat() && t.length && t[t.length - 1].sp);
      if (isT) { i++; push({ t: 'op', v: "'" }); continue; }
      var j4 = i + 1, s4 = '';
      while (j4 < n) { if (src[j4] === "'") { if (src[j4 + 1] === "'") { s4 += "'"; j4 += 2; continue; } break; } if (src[j4] === '\n') throw new MErr('Falta la comilla de cierre de la cadena.', line, 'str'); s4 += src[j4++]; }
      if (j4 >= n) throw new MErr('Falta la comilla de cierre de la cadena.', line, 'str');
      i = j4 + 1; push({ t: 'str', v: s4 }); continue;
    }
    var three = src.substr(i, 2);
    var ops2 = ['.*', './', '.\\', '.^', ".'", '==', '~=', '!=', '<=', '>=', '&&', '||'];
    if (ops2.indexOf(three) >= 0) { i += 2; push({ t: 'op', v: three === '!=' ? '~=' : three }); continue; }
    if ('+-*/\\^<>&|~!=(),;:[]{}.@'.indexOf(ch) >= 0) {
      if (ch === '(' ) stack.push('(');
      else if (ch === '[' || ch === '{') stack.push(ch);
      else if (ch === ')' || ch === ']' || ch === '}') stack.pop();
      i++;
      if ((ch === ']' || ch === '}') && t.length && t[t.length - 1].t === 'op' && (t[t.length - 1].v === ';' || t[t.length - 1].v === ',') && t[t.length - 1].ws) t.pop();
      push({ t: 'op', v: ch === '!' ? '~' : ch });
      if ((ch === ';' || ch === ',') && !stack.length) lineStart = true;
      continue;
    }
    throw new MErr('Carácter no válido: «' + ch + '».', line, 'char');
  }
  push({ t: 'nl', v: '\n' }); push({ t: 'eof' });
  return t;
}

function parse(src) {
  var T = lex(src), p = 0;
  function pk(o) { return T[p + (o || 0)]; }
  function isOp(v, o) { var k = pk(o); return k && k.t === 'op' && k.v === v; }
  function isKw(v) { var k = pk(); return k && k.t === 'kw' && k.v === v; }
  function eat(v) { if (!isOp(v) && (pk().t === 'eof' || pk().t === 'nl')) throw new MErr('La instrucción está incompleta: falta cerrar un «' + v + '».', pk().line, 'incomplete'); if (!isOp(v)) err('Se esperaba «' + v + '»' + (pk().t === 'eof' ? ' y el código se acaba.' : ' y hay «' + (pk().v || '') + '».')); return T[p++]; }
  function err(m) { throw new MErr(m, pk() ? pk().line : 0, 'parse'); }
  function skipNl() { while (pk().t === 'nl' || isOp(';') || isOp(',')) p++; }

  function block(ends) {
    var body = [];
    for (;;) {
      skipNl();
      var k = pk();
      if (k.t === 'eof') { if (ends) throw new MErr('Falta un «end» que cierre el bloque (if, for, while…).', pk().line, 'noend'); return body; }
      if (k.t === 'kw' && ends && ends.indexOf(k.v) >= 0) return body;
      body.push(stmt());
    }
  }
  function endStmt(s) {
    var k = pk();
    if (k.t === 'op' && k.v === ';') { p++; s.quiet = true; }
    else if (k.t === 'op' && k.v === ',') p++;
    else if (k.t === 'nl') p++;
    else if (k.t === 'eof' || (k.t === 'kw' && /^(end|else|elseif|case|otherwise|catch)$/.test(k.v))) { /* fin */ }
    else err('Expresión no válida: sobra «' + (k.v || k.t) + '» (¿falta un operador o una coma?).');
    return s;
  }
  function stmt() {
    var k = pk(), line = k.line;
    if (k.t === 'cmd') { p++; return endStmt({ k: 'cmd', name: k.v, args: k.args, line: line }); }
    if (k.t === 'kw') {
      if (k.v === 'if') {
        p++; var cl = [], c = expr(); var b = block(['elseif', 'else', 'end']); cl.push([c, b]); var els = null;
        for (;;) {
          if (isKw('elseif')) { p++; var c2 = expr(); cl.push([c2, block(['elseif', 'else', 'end'])]); }
          else if (isKw('else')) { p++; els = block(['end']); }
          else if (isKw('end')) { p++; break; }
          else err('Falta el «end» del if.');
        }
        return endStmt({ k: 'if', cl: cl, els: els, line: line });
      }
      if (k.v === 'for') {
        p++; var paren = isOp('('); if (paren) p++;
        var v = pk(); if (v.t !== 'id') err('Después de «for» va el nombre de una variable.'); p++; eat('=');
        var rg = expr(); if (paren) eat(')');
        var fb = block(['end']); p++;
        return endStmt({ k: 'for', v: v.v, rg: rg, body: fb, line: line });
      }
      if (k.v === 'while') { p++; var wc = expr(); var wb = block(['end']); p++; return endStmt({ k: 'while', c: wc, body: wb, line: line }); }
      if (k.v === 'break' || k.v === 'continue' || k.v === 'return') { p++; return endStmt({ k: k.v, line: line }); }
      if (k.v === 'switch') {
        p++; var se = expr(), cases = [], oth = null; skipNl();
        while (isKw('case')) { p++; var ce = expr(); cases.push([ce, block(['case', 'otherwise', 'end'])]); }
        if (isKw('otherwise')) { p++; oth = block(['end']); }
        if (!isKw('end')) err('Falta el «end» del switch.'); p++;
        return endStmt({ k: 'switch', e: se, cases: cases, oth: oth, line: line });
      }
      if (k.v === 'try') { p++; var tb = block(['catch', 'end']), cv = null, cb = [];
        if (isKw('catch')) { p++; if (pk().t === 'id' && (pk(1).t === 'nl' || (pk(1).t === 'op' && (pk(1).v === ',' || pk(1).v === ';')))) { cv = pk().v; p++; } cb = block(['end']); }
        p++; return endStmt({ k: 'try', b: tb, cv: cv, cb: cb, line: line }); }
      if (k.v === 'function') err('En este entorno no se pueden definir funciones con «function»; usa funciones anónimas: f = @(x) x.^2;');
      err('«' + k.v + '» fuera de lugar.');
    }
    // [a, b] = ...
    if (isOp('[')) {
      var q = p + 1, d = 1;
      while (q < T.length && d) { var tk = T[q]; if (tk.t === 'op' && (tk.v === '[' || tk.v === '(' || tk.v === '{')) d++; else if (tk.t === 'op' && (tk.v === ']' || tk.v === ')' || tk.v === '}')) d--; else if (tk.t === 'nl' || tk.t === 'eof') break; q++; }
      if (!d && T[q] && T[q].t === 'op' && T[q].v === '=') {
        p++; var lhs = [];
        while (!isOp(']')) { if (isOp(',')) { p++; continue; } if (isOp('~')) { p++; lhs.push(null); continue; } lhs.push(postfix(primary(), true)); }
        p++; eat('=');
        var rhs = expr();
        return endStmt({ k: 'massign', lhs: lhs, e: rhs, line: line });
      }
    }
    var e = expr();
    if (isOp('=')) {
      if (!(e.k === 'id' || e.k === 'idx' || e.k === 'fld' || e.k === 'cidx')) throw new MErr('No se puede asignar a esta expresión: a la izquierda del «=» va una variable. Para comparar, usa «==».', pk().line, 'eqop');
      p++; var r = expr();
      return endStmt({ k: 'assign', lhs: e, e: r, line: line });
    }
    return endStmt({ k: 'expr', e: e, line: line });
  }
  // precedencia de MATLAB
  function expr() { return oror(); }
  function bin(next, ops) { return function () { var a = next(); while (pk().t === 'op' && ops.indexOf(pk().v) >= 0) { var o = T[p++].v; a = { k: 'bin', o: o, a: a, b: next() }; } return a; }; }
  var cmp, add, mul;
  function range() {
    var a = add();
    if (isOp(':') && !(pk(1).t === 'op' && (pk(1).v === ')' || pk(1).v === ','))) {
      p++; var b = add();
      if (isOp(':')) { p++; var c = add(); return { k: 'range', a: a, s: b, b: c }; }
      return { k: 'range', a: a, b: b };
    }
    return a;
  }
  function unary() {
    if (isOp('-') || isOp('+')) { var o = T[p++].v; var u = unary(); return o === '-' ? { k: 'neg', a: u } : u; }
    if (isOp('~')) { p++; return { k: 'not', a: unary() }; }
    return power();
  }
  function power() {
    var a = postfix(primary());
    while (isOp('^') || isOp('.^')) {
      var o = T[p++].v, b;
      if (isOp('-') || isOp('+') || isOp('~')) { var o2 = T[p++].v; var pb = postfix(primary()); b = o2 === '-' ? { k: 'neg', a: pb } : o2 === '~' ? { k: 'not', a: pb } : pb; }
      else b = postfix(primary());
      a = { k: 'bin', o: o, a: a, b: b };
    }
    return a;
  }
  mul = bin(unary, ['*', '/', '\\', '.*', './', '.\\']);
  add = bin(mul, ['+', '-']);
  cmp = bin(range, ['<', '<=', '>', '>=', '==', '~=']);
  var and1 = bin(cmp, ['&']), or1 = bin(and1, ['|']), andand = bin(or1, ['&&']), oror = bin(andand, ['||']);

  function args(close) {
    var a = [];
    if (isOp(close)) { p++; return a; }
    for (;;) {
      if (isOp(':') && (pk(1).t === 'op' && (pk(1).v === close || pk(1).v === ','))) { p++; a.push({ k: 'colon' }); }
      else a.push(expr());
      if (isOp(',')) { p++; continue; }
      if (isOp(close)) { p++; return a; }
      if (isOp('=')) throw new MErr('Hay un «=» dentro de los paréntesis: para comparar se usa «==» (y quizá falta cerrar el paréntesis antes).', pk().line, 'eqop');
      if (pk().t === 'eof' || pk().t === 'nl') throw new MErr('La instrucción está incompleta: falta cerrar un «' + close + '».', pk().line, 'incomplete');
      err('Se esperaba «,» o «' + close + '».');
    }
  }
  function postfix(a, lval) {
    for (;;) {
      var k = pk();
      if (k.t !== 'op') return a;
      if (k.v === '(' && !k.ws && !(T[p - 1] && T[p - 1].sp && inMatCtx())) { if (a.k === 'mat' || a.k === 'num' || a.k === 'paren' || a.k === 'idx' || a.k === 'str') throw new MErr('No se puede poner un índice directamente detrás de ' + (a.k === 'idx' ? 'otro índice' : 'unos corchetes o un paréntesis') + ': guarda antes el resultado en una variable y usa el índice sobre ella.', k.line, 'idxexpr', 'Invalid expression. When calling a function or indexing a variable, use parentheses. Otherwise, check for mismatched delimiters.'); p++; a = { k: 'idx', a: a, args: args(')') }; continue; }
      if (k.v === '{' && !(T[p - 1] && T[p - 1].sp && inMatCtx())) { p++; a = { k: 'cidx', a: a, args: args('}') }; continue; }
      if (k.v === '.' && pk(1).t === 'id') { p += 2; a = { k: 'fld', a: a, f: T[p - 1].v }; continue; }
      if (!lval && (k.v === "'" || k.v === ".'")) { p++; a = { k: k.v === "'" ? 'ctr' : 'tr', a: a }; continue; }
      return a;
    }
  }
  var matDepth = 0;
  function inMatCtx() { return matDepth > 0; }
  function primary() {
    var k = pk();
    if (k.t === 'num') { p++; return { k: 'num', v: k.v, im: k.im }; }
    if (k.t === 'str') { p++; return { k: 'str', v: k.v, dq: k.dq }; }
    if (k.t === 'id') { p++; return k.endIdx ? { k: 'end' } : { k: 'id', v: k.v, line: k.line }; }
    if (k.t === 'op' && k.v === '(') { p++; var save = matDepth; matDepth = 0; var e = expr(); matDepth = save; eat(')'); return { k: 'paren', a: e }; }
    if (k.t === 'op' && (k.v === '[' || k.v === '{')) {
      var close = k.v === '[' ? ']' : '}'; p++; matDepth++;
      var rows = [], row = [];
      for (;;) {
        if (isOp(close)) { p++; break; }
        if (isOp(';')) { p++; rows.push(row); row = []; continue; }
        if (isOp(',')) { p++; continue; }
        if (pk().t === 'eof') err('Falta el «' + close + '» de cierre.');
        row.push(expr());
      }
      rows.push(row); matDepth--;
      rows = rows.filter(function (r) { return r.length; });
      return { k: close === ']' ? 'mat' : 'cell', rows: rows };
    }
    if (k.t === 'op' && k.v === '@') {
      p++;
      if (pk().t === 'id') { p++; return { k: 'fh', name: T[p - 1].v }; }
      eat('('); var ps = [];
      while (!isOp(')')) { if (isOp(',')) { p++; continue; } if (pk().t !== 'id') err('Los parámetros de @(...) son nombres.'); ps.push(T[p++].v); }
      p++; var save2 = matDepth; matDepth = 0; var body = expr(); matDepth = save2;
      return { k: 'lambda', ps: ps, body: body };
    }
    if (k.t === 'op' && k.v === ':') { p++; return { k: 'colon' }; }
    if (k.t === 'eof' || k.t === 'nl') throw new MErr('La instrucción está incompleta: falta algo al final (un valor, un paréntesis o un corchete).', k.line, 'incomplete');
    err('Expresión no válida cerca de «' + (k.v || k.t) + '».');
  }
  var prog = block(null);
  return prog;
}

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

/* sl-matlab · funciones. Las que no devuelven nada (disp, fprintf, format…) están en NOANS. */
var NOANS = { eval: 1, disp: 1, fprintf: 1, format: 1, clc: 1, clear: 1, syms: 1, help: 1, who: 1, whos: 1, close: 1, figure: 1, hold: 1, grid: 1, warning: 1, display: 1, error: 1, clearvars: 1 };
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
  i: function () { return sc(0, 1); }, j: function () { return sc(0, 1); }, true: function () { return lg(sc(1)); }, false: function () { return lg(sc(0)); },
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
  error: function (a) { var f = argN(a, 0, 'error'); throw new MErr(sprintfC(str(f), a.slice(1)), 0, 'user'); },
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
  plot: noPlot, compass: noPlot, polarplot: noPlot, fplot: noPlot, ezplot: noPlot, quiver: noPlot, surf: noPlot, mesh: noPlot, plot3: noPlot, scatter: noPlot, fimplicit: noPlot, line: noPlot, fill: noPlot, xlabel: function () {}, ylabel: function () {}, title: function () {}, legend: function () {}, axis: function () {}, grid: function () {}, hold: function () {}, figure: function () {}, close: function () {},
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

var API = { version: '1.0', Ctx: Ctx, run: run, parse: parse, lex: lex, MErr: MErr, display: display, BUILTIN: BUILTIN, HELP: HELP, srcOf: srcOf,
  valueSummary: function (v, F) { return inlineVal(v, F || { mode: 'short' }); }, sizeOf: function (v) { return [v.r, v.c]; } };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.SLMatlab = API;
})(this);
