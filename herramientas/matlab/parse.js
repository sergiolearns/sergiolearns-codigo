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
