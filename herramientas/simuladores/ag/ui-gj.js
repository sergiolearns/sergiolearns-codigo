/* SergioLearns — simulador de AG: Gauss-Jordan paso a paso (17 nov 2026).
 * Escalona la matriz que quieras con fracciones exactas, operación a operación (con su orden de MATLAB), y termina con
 * el rango y Rouché-Frobenius (sistemas), la inversa por (A | I) o el determinante deshaciendo lo que hizo cada operación.
 * Lecciones de los artículos de AG (el batido, el requesón, la tarde imposible, la clave de cifrado y el 4×4),
 * modo libre con tu propia matriz y «Ponte a prueba» por niveles. Necesita SLK (kit v2), SLAG (comun-ag.js) y SLGJ (engine-gj.js). */
(function () {
  'use strict';
  var K = window.SLK, M = window.SLAG, E = window.SLGJ;
  if (!K || !M || !E) return;
  var esc = K.esc, fill = K.fill, ico = K.ico, str = E.str;
  var TX = {
    es: { title: 'sergio@learns: ~/laboratorio/simuladores/gauss-jordan', what: 'Qué quieres hacer', modes: { sis: 'Sistema', inv: 'Inversa', det: 'Determinante' },
      method: 'Método', gauss: 'Gauss', gj: 'Gauss-Jordan', size: 'Tamaño', rows: 'filas', cols: 'incógnitas', colsQ: 'columnas', yours: 'Tu matriz', showM: 'Tu matriz', hideM: 'Ocultar', go: 'Resolver paso a paso', rnd: 'Otra al azar', clear: 'Vaciar',
      editHint: 'Escribe enteros, decimales o fracciones (3, -2/5, 1,5). La columna tras la raya son los términos independientes.', editHintQ: 'Escribe enteros, decimales o fracciones (3, -2/5, 1,5).', badCell: 'Hay una casilla que no es un número: revisa la marcada.',
      yoursN: 'Tu matriz', yoursD: 'La que has escrito, resuelta paso a paso.', rg: 'rg(A) = {p} · rg(A | B) = {q} · n = {n}', rgQ: 'rg(A) = {p}', detK: 'det(A) = {k} · det(esta)', step0: 'Inicio',
      kinds: { CD: 'Compatible determinado: una solución', CI: 'Compatible indeterminado: infinitas soluciones ({f} {fp})', I: 'Incompatible: no tiene solución' }, par1: 'parámetro', parN: 'parámetros',
      opN: 'Operación', lead: 'Lo que pasa en este paso', parts: 'Pieza a pieza', zero: 'cero', tip: 'Para el examen:', xs: ['x', 'y', 'z', 't'], lam: ['λ', 'μ', 'α', 'β', 'γ'],
      lv: [['El número que hace el cero', 'En fᵢ → fᵢ + c·fⱼ, ¿qué c anula la casilla? Como fracción si hace falta (por ejemplo -3/2).'], ['Clasifica con Rouché', 'Escalona en papel y escribe CD, CI o I.'], ['El determinante', 'Un determinante 3×3 por operaciones elementales. Un número entero.']],
      lq1: 'Con el pivote {p} en la fila 1, ¿qué c hace un cero en la fila 2 con f₂ → f₂ + c·f₁, si debajo del pivote hay un {a}?', lq2: '¿Cómo es este sistema? Responde CD, CI o I.', lq3: '¿Cuánto vale el determinante de esta matriz?',
      h1: 'c = −(número de abajo) / (pivote)', h2: 'Compara rg(A) y rg(A | B) con el número de incógnitas (3).', h3: 'Haz ceros debajo de la diagonal sin multiplicar filas y multiplica la diagonal; cada intercambio cambia el signo.' },
    en: { title: 'sergio@learns: ~/lab/simulators/gauss-jordan', what: 'What do you want to do', modes: { sis: 'System', inv: 'Inverse', det: 'Determinant' },
      method: 'Method', gauss: 'Gauss', gj: 'Gauss-Jordan', size: 'Size', rows: 'rows', cols: 'unknowns', colsQ: 'columns', yours: 'Your matrix', showM: 'Your matrix', hideM: 'Hide', go: 'Solve step by step', rnd: 'Random one', clear: 'Clear',
      editHint: 'Type integers, decimals or fractions (3, -2/5, 1.5). The column after the bar holds the constant terms.', editHintQ: 'Type integers, decimals or fractions (3, -2/5, 1.5).', badCell: 'One cell is not a number: check the marked one.',
      yoursN: 'Your matrix', yoursD: 'The one you typed, solved step by step.', rg: 'rg(A) = {p} · rg(A | B) = {q} · n = {n}', rgQ: 'rg(A) = {p}', detK: 'det(A) = {k} · det(this one)', step0: 'Start',
      kinds: { CD: 'Consistent with a unique solution (CD)', CI: 'Consistent with infinitely many solutions (CI, {f} {fp})', I: 'Inconsistent (I): no solution' }, par1: 'parameter', parN: 'parameters',
      opN: 'Operation', lead: 'What happens in this step', parts: 'Piece by piece', zero: 'zero', tip: 'For the exam:', xs: ['x', 'y', 'z', 't'], lam: ['λ', 'μ', 'α', 'β', 'γ'],
      lv: [['The number that makes the zero', 'In fᵢ → fᵢ + c·fⱼ, which c wipes out the entry? As a fraction if needed (for example -3/2).'], ['Classify with Rouché', 'Row reduce on paper and type CD, CI or I.'], ['The determinant', 'A 3×3 determinant by elementary row operations. A whole number.']],
      lq1: 'With pivot {p} in row 1, which c makes a zero in row 2 with f₂ → f₂ + c·f₁, if the entry under the pivot is {a}?', lq2: 'What kind of system is this? Answer CD, CI or I.', lq3: 'What is the determinant of this matrix?',
      h1: 'c = −(entry below) / (pivot)', h2: 'Compare rg(A) and rg(A | B) with the number of unknowns (3).', h3: 'Make zeros under the diagonal without scaling rows and multiply the diagonal; each swap flips the sign.' }
  };
  /* ------------------------------------------------ lecciones (los ejemplos de los artículos de AG) */
  var LES = [
    { k: 'batido', g: 'target', mode: 'sis', jordan: true, A: [[4, 6, 1, 15], [18, 10, 24, 70], [2, 3, 0, 7]], sep: 3,
      n: ['El batido del gimnasio', 'The post-gym shake'], d: ['Avena, leche y plátano para 15 g de proteína, 70 de hidratos y 7 de grasa: una solución.', 'Oats, milk and banana for 15 g of protein, 70 of carbs and 7 of fat: one solution.'],
      say: { 0: ['Cada fila es un nutriente y cada columna, un ingrediente: x raciones de avena, y vasos de leche, z plátanos. Tras la raya, lo que quiero: 15 g de proteína, 70 de hidratos y 7 de grasa.', 'Each row is a nutrient and each column an ingredient: x servings of oats, y glasses of milk, z bananas. After the bar, what I want: 15 g of protein, 70 of carbs and 7 of fat.'] },
      ask: { at: 'rouche', q: ['Ya está escalonada con tres pivotes. ¿Cuántas soluciones tiene?', 'It is in echelon form with three pivots. How many solutions does it have?'], o: [['Una', 'One', 1], ['Infinitas', 'Infinitely many'], ['Ninguna', 'None']] } },
    { k: 'requeson', g: 'grid', mode: 'sis', jordan: true, A: [[4, 6, 1, 8, 15], [18, 10, 24, 2, 70], [2, 3, 0, 4, 7]], sep: 4,
      n: ['Con requesón', 'With cottage cheese'], d: ['Un cuarto ingrediente y las mismas tres ecuaciones: infinitos batidos.', 'A fourth ingredient and the same three equations: infinitely many shakes.'],
      say: { 0: ['Añado t raciones de requesón (8 g de proteína, 2 de hidratos, 4 de grasa) con los mismos objetivos: 3 ecuaciones y 4 incógnitas. Antes de escalonar ya sé que no puede ser CD.', 'I add t servings of cottage cheese (8 g of protein, 2 of carbs, 4 of fat) with the same targets: 3 equations and 4 unknowns. Before reducing I already know it cannot be CD.'] },
      ask: { at: 'rouche', q: ['rg(A) = rg(A | B) = 3 y hay 4 incógnitas. ¿Qué tipo de sistema es?', 'rg(A) = rg(A | B) = 3 and there are 4 unknowns. What kind of system is it?'], o: [['Compatible determinado', 'Consistent with a unique solution'], ['Compatible indeterminado, con 1 parámetro', 'Consistent with infinitely many, 1 parameter', 1], ['Incompatible', 'Inconsistent']] } },
    { k: 'imposible', g: 'flag', mode: 'sis', jordan: false, A: [[4, 6, 15], [2, 3, 7]], sep: 2,
      n: ['La tarde imposible', 'The impossible afternoon'], d: ['Solo avena y leche para 15 g de proteína y 7 de grasa: la fila 0 = c.', 'Only oats and milk for 15 g of protein and 7 of fat: the row 0 = c.'],
      say: { 0: ['Avena (x) y leche (y) para 15 g de proteína y 7 de grasa. Con estos dos ingredientes la proteína siempre es el doble de la grasa… y 15 no es el doble de 7.', 'Oats (x) and milk (y) for 15 g of protein and 7 of fat. With these two ingredients protein is always twice the fat… and 15 is not twice 7.'] },
      ask: { at: 1, q: ['Tras la operación, ¿qué dice la segunda fila?', 'After the operation, what does the second row say?'], o: [['0 = −1/2: imposible', '0 = −1/2: impossible', 1], ['0 = 0: sobra', '0 = 0: redundant'], ['y = −1/2', 'y = −1/2']] } },
    { k: 'clave', g: 'key', mode: 'inv', A: [[1, 1, 1], [0, 1, 1], [-2, -1, 0]],
      n: ['La inversa de la clave', 'The inverse of the key'], d: ['La clave 3×3 de los mensajes cifrados: (A | I) → (I | A⁻¹).', 'The 3×3 key of the encrypted messages: (A | I) → (I | A⁻¹).'],
      say: { 0: ['La clave 3×3 del tema 1. Para descifrar hace falta su inversa: pongo la identidad al lado y hago las mismas operaciones a las dos mitades, fila entera.', 'The 3×3 key from topic 1. To decrypt you need its inverse: I put the identity next to it and apply the same operations to both halves, whole rows.'] },
      ask: { at: 'end', q: ['A la izquierda ha quedado la identidad. ¿Qué hay a la derecha?', 'The identity is on the left now. What is on the right?'], o: [['La inversa de A', 'The inverse of A', 1], ['A otra vez', 'A again'], ['La traspuesta de A', 'The transpose of A']] } },
    { k: 'det4', g: 'exam', mode: 'det', A: [[2, 0, 1, 3], [1, -1, 0, 2], [0, 3, 1, -1], [1, 2, 0, 1]],
      n: ['Un determinante 4×4', 'A 4×4 determinant'], d: ['Escalonar, multiplicar la diagonal y deshacer cada intercambio: el truco para 4×4.', 'Reduce, multiply the diagonal and undo every swap: the trick for 4×4.'],
      say: { 0: ['La matriz D de la práctica de matrices. Sarrus solo vale para 3×3; aquí escalono sin multiplicar filas y voy apuntando lo que cada operación le hace al determinante.', 'Matrix D from the matrices practice. Sarrus only works for 3×3; here I reduce without scaling rows and keep track of what each operation does to the determinant.'] },
      ask: { at: 1, q: ['Acabo de intercambiar dos filas. ¿Qué le pasa al determinante?', 'I have just swapped two rows. What happens to the determinant?'], o: [['Nada', 'Nothing'], ['Cambia de signo', 'It changes sign', 1], ['Se multiplica por 2', 'It doubles']] } }
  ];
  /* ------------------------------------------------ texto de cada paso */
  function F(x) { return E.parse(x); }
  function frHTML(a) { return E.isInt(a) ? '<span class="gj-n">' + esc(str(a).replace('-', '−')) + '</span>' : '<span class="gj-fr' + (a.n < 0n ? ' is-neg' : '') + '"><i>' + esc(String(a.n < 0n ? -a.n : a.n)) + '</i><i>' + esc(String(a.d)) + '</i></span>'; }
  function ftxt(a) { return str(a).replace('-', '−'); }
  function ftxtP(a) { return a.n < 0n ? '(' + ftxt(a) + ')' : ftxt(a); }
  function fr(i) { return 'f<sub>' + (i + 1) + '</sub>'; }
  function frT(i) { return 'f' + '₁₂₃₄₅₆₇₈₉'.charAt(i); }
  function opHTML(op) {
    if (op.t === 'swap') return fr(op.i) + ' ↔ ' + fr(op.j);
    if (op.t === 'scale') return fr(op.i) + ' → ' + coefHTML(op.c) + fr(op.i);
    var neg = op.c.n < 0n, c = E.abs(op.c);
    return fr(op.i) + ' → ' + fr(op.i) + (neg ? ' − ' : ' + ') + (E.eq(c, E.ONE) ? '' : esc(ftxt(c)) + '·') + fr(op.j);
  }
  function coefHTML(c) { return E.eq(c, E.ONE) ? '' : (c.n < 0n ? '(' + esc(ftxt(c)) + ')' : esc(ftxt(c))) + '·'; }
  function opTxt(op) { return opHTML(op).replace(/<sub>(\d)<\/sub>/g, function (m, d) { return '₀₁₂₃₄₅₆₇₈₉'.charAt(+d); }).replace(/<[^>]+>/g, ''); }
  function mlNum(a) { return str(a); }
  function mlMat(Mx) { return '[' + Mx.map(function (r) { return r.map(mlNum).join(' '); }).join('; ') + ']'; }
  function mlOp(op) {
    var i = op.i + 1, j = op.j + 1;
    if (op.t === 'swap') return 'M([' + i + ' ' + j + '],:) = M([' + j + ' ' + i + '],:)';
    if (op.t === 'scale') { var inv = E.div(E.ONE, op.c); return E.isInt(inv) ? 'M(' + i + ',:) = M(' + i + ',:)/' + (inv.n < 0n ? '(' + str(inv) + ')' : str(inv)) : 'M(' + i + ',:) = ' + (op.c.n < 0n ? '(' + str(op.c) + ')' : str(op.c)) + '*M(' + i + ',:)'; }
    var c = E.abs(op.c);
    return 'M(' + i + ',:) = M(' + i + ',:) ' + (op.c.n < 0n ? '-' : '+') + ' ' + (E.eq(c, E.ONE) ? '' : str(c) + '*') + 'M(' + j + ',:)';
  }
  function names(n, t) { return n <= 4 ? t.xs.slice(0, n) : Array.apply(null, Array(n)).map(function (x, i) { return 'x' + '₁₂₃₄₅₆₇₈₉'.charAt(i); }); }
  /** Construye los pasos de una lección (o de tu matriz). */
  function build(les, lang) {
    var t = TX[lang], li = lang === 'en' ? 1 : 0, en = li === 1;
    var A0 = les.A.map(function (r) { return r.map(F); });
    var mode = les.mode, n0 = A0[0].length, sep = mode === 'sis' ? les.sep : n0;
    var start = mode === 'inv' ? A0.map(function (r, i) { return r.concat(A0.map(function (x, j) { return i === j ? E.ONE : E.ZERO; })); }) : A0;
    var S = E.solve(start, { sep: sep, jordan: mode === 'inv' || (mode === 'sis' && les.jordan) });
    var steps = [], prev = start;
    steps.push({ kind: 'start', M: start, sep: sep, mode: mode, f: E.ONE });
    S.steps.forEach(function (s) { steps.push({ kind: 'op', op: s.op, M: s.M, prev: prev, piv: s.piv, phase: s.phase, f: s.f, sep: sep, mode: mode }); prev = s.M; });
    var fin = S.M;
    if (mode === 'sis') {
      var R = E.rouche(fin, sep);
      steps.push({ kind: 'rouche', M: fin, sep: sep, mode: mode, f: S.f, R: R });
      if (R.kind !== 'I') {
        var RR = les.jordan ? fin : E.solve(fin, { sep: sep, jordan: true }).M;
        steps.push({ kind: 'sol', M: fin, sep: sep, mode: mode, f: S.f, R: R, P: E.param(RR, sep) });
      }
    } else if (mode === 'inv') {
      steps.push({ kind: 'inv', M: fin, sep: sep, mode: mode, f: S.f, ok: S.piv.length === n0 });
    } else {
      var d = E.ONE; for (var i = 0; i < n0; i++) d = E.mul(d, fin[i][i]);
      steps.push({ kind: 'det', M: fin, sep: sep, mode: mode, f: S.f, prod: d, det: E.div(d, S.f) });
    }
    var X = names(sep, t);
    steps.forEach(function (st, k) {
      st.s = [txt(st, 'es', les, X), txt(st, 'en', les, names(sep, TX.en))];
      if (les.say && les.say[k]) st.s = les.say[k];
      st.code = code(st, les, en);
    });
    if (les.ask) {
      var at = les.ask.at, idx = at === 'end' ? steps.length - 1 : at === 'rouche' ? steps.findIndex(function (s) { return s.kind === 'rouche'; }) : at;
      if (steps[idx]) steps[idx].ask = { q: les.ask.q, o: les.ask.o };
    }
    return steps;
  }
  function code(st, les, en) {
    if (st.kind === 'start') return st.mode === 'inv' ? 'M = [A eye(' + les.A.length + ')]' : (st.mode === 'det' ? 'A = ' : 'M = ') + mlMat(st.M);
    if (st.kind === 'op') return mlOp(st.op);
    if (st.kind === 'rouche') return '[rank(M(:,1:' + st.sep + ')) rank(M)]';
    if (st.kind === 'sol') return 'rref(M)';
    if (st.kind === 'inv') return st.ok ? 'inv(A)' : 'rank(A)';
    return 'det(A)';
  }
  function pv(st) { return st.M[st.piv[0]][st.piv[1]]; }
  function txt(st, lang, les, X) {
    var en = lang === 'en', t = TX[lang];
    if (st.kind === 'start') {
      if (st.mode === 'inv') return en ? 'I put the identity next to A and row reduce the whole thing: what turns A into I turns I into A⁻¹.' : 'Pongo la identidad al lado de A y escalono todo junto: lo que convierte A en I convierte I en A⁻¹.';
      if (st.mode === 'det') return en ? 'To get the determinant I reduce without scaling rows, then multiply the diagonal and undo what each operation did.' : 'Para el determinante escalono sin multiplicar filas, multiplico la diagonal y deshago lo que hizo cada operación.';
      return en ? 'The augmented matrix (A | B): each row is an equation, each column an unknown, and after the bar the constant terms.' : 'La ampliada (A | B): cada fila es una ecuación, cada columna una incógnita y, tras la raya, los términos independientes.';
    }
    if (st.kind === 'op') {
      var op = st.op, r = st.piv[0], c = st.piv[1], det = st.mode === 'det';
      if (op.t === 'swap') {
        var was = st.prev[op.i][c], z = E.isZ(was);
        return (en ? 'The pivot of column ' + (c + 1) + (z ? ' cannot be a 0' : ' is nicer as a 1 (no fractions later)') + ', so I swap rows ' + (op.i + 1) + ' and ' + (op.j + 1) + '.'
          : 'El pivote de la columna ' + (c + 1) + (z ? ' no puede ser un 0' : ' es mejor que sea un 1 (así no salen fracciones)') + ': intercambio las filas ' + (op.i + 1) + ' y ' + (op.j + 1) + '.')
          + (det ? (en ? ' Careful: the determinant changes sign.' : ' Ojo: el determinante cambia de signo.') : '');
      }
      if (op.t === 'scale') {
        var p0 = st.prev[op.i][c];
        return (en ? 'I divide row ' + (op.i + 1) + ' by ' + ftxt(p0) + ' so that the pivot becomes a 1' : 'Divido la fila ' + (op.i + 1) + ' entre ' + ftxt(p0) + ' para que el pivote valga 1') + (st.phase === 'jordan' ? (en ? ': in the reduced form every pivot is 1.' : ': en la reducida todos los pivotes valen 1.') : '.');
      }
      var a = st.prev[op.i][c], p = st.prev[op.j][c], up = st.phase === 'jordan';
      var ng = op.c.n < 0n, ca = E.abs(op.c), one = E.eq(ca, E.ONE), times = one ? '' : ftxt(ca) + ' ', cuenta = ftxt(a) + (ng ? ' − ' : ' + ') + (one ? '' : ftxt(ca) + '·') + ftxtP(p) + ' = 0';
      return en ? 'To make a zero ' + (up ? 'above' : 'below') + ' the pivot ' + ftxt(p) + ' (row ' + (op.j + 1) + '), I ' + (ng ? 'subtract ' : 'add ') + (one ? 'row ' + (op.j + 1) : times + 'times row ' + (op.j + 1)) + (ng ? ' from' : ' to') + ' row ' + (op.i + 1) + ': ' + cuenta + '. The whole row changes, including the column after the bar.'
        : 'Para hacer un cero ' + (up ? 'encima' : 'debajo') + ' del pivote ' + ftxt(p) + ' (fila ' + (op.j + 1) + '), a la fila ' + (op.i + 1) + ' le ' + (ng ? 'resto ' : 'sumo ') + (one ? 'la fila ' : times + 'veces la fila ') + (op.j + 1) + ': ' + cuenta + '. Cambia la fila entera, también tras la raya.';
    }
    if (st.kind === 'rouche') {
      var R = st.R;
      var base = (en ? 'Echelon form. Non-zero rows: rg(A) = ' + R.p + ' on the left and rg(A | B) = ' + R.q + ' counting the last column; there are ' + R.n + ' unknowns. ' : 'Escalonada. Filas que no son de ceros: rg(A) = ' + R.p + ' a la izquierda y rg(A | B) = ' + R.q + ' contando la última columna; hay ' + R.n + ' incógnitas. ');
      if (R.kind === 'I') return base + (en ? 'There is a row (0 … 0 | c) with c ≠ 0, the equation 0 = c: inconsistent, no solution.' : 'Hay una fila (0 … 0 | c) con c ≠ 0, la ecuación 0 = c: incompatible, no tiene solución.');
      if (R.kind === 'CD') return base + (en ? 'rg(A) = rg(A | B) = n: consistent with a unique solution.' : 'rg(A) = rg(A | B) = n: compatible determinado, una sola solución.');
      return base + (en ? 'rg(A) = rg(A | B) < n: consistent with infinitely many solutions, with n − rg = ' + R.free + ' free ' + (R.free === 1 ? 'parameter.' : 'parameters.') : 'rg(A) = rg(A | B) < n: compatible indeterminado, con n − rg = ' + R.free + (R.free === 1 ? ' parámetro libre.' : ' parámetros libres.'));
    }
    if (st.kind === 'sol') {
      var sol = solTxt(st.P, X, t);
      return st.P.kind === 'CD' ? (en ? 'The last column of the reduced form is the solution: ' + sol + '. Plug it into the original equations to check it.' : 'La última columna de la reducida es la solución: ' + sol + '. Sustitúyela en las ecuaciones de partida para comprobarla.')
        : (en ? 'Each pivot unknown is solved in terms of the free ones: ' + sol + '. Each value of the parameter is a different solution.' : 'Cada incógnita pivote queda despejada en función de las libres: ' + sol + '. Cada valor del parámetro es una solución distinta.');
    }
    if (st.kind === 'inv') return st.ok ? (en ? 'The left half is the identity, so the right half is A⁻¹. Check it: A · A⁻¹ = I.' : 'La mitad izquierda es la identidad: la derecha es A⁻¹. Compruébalo: A · A⁻¹ = I.')
      : (en ? 'A row of zeros appeared on the left: rg(A) < n, so A has no inverse (its determinant is 0).' : 'Ha salido una fila de ceros a la izquierda: rg(A) < n, así que A no tiene inversa (su determinante es 0).');
    var k = E.div(E.ONE, st.f);
    return en ? 'Triangular: its determinant is the product of the diagonal, ' + ftxt(st.prod) + '. Undoing the operations (each swap changes the sign) gives det(A) = ' + ftxt(k) + ' · ' + ftxt(st.prod) + ' = ' + ftxt(st.det) + '.'
      : 'Triangular: su determinante es el producto de la diagonal, ' + ftxt(st.prod) + '. Deshaciendo las operaciones (cada intercambio cambia el signo): det(A) = ' + ftxt(k) + ' · ' + ftxt(st.prod) + ' = ' + ftxt(st.det) + '.';
  }
  function lin(v, L) {   // constante + coeficientes por parámetro → «2 + λ», «1 − 2λ»
    var out = E.isZ(v.c) ? '' : ftxt(v.c);
    v.t.forEach(function (c, i) {
      if (E.isZ(c)) return;
      var neg = c.n < 0n, a = E.abs(c), s = (E.eq(a, E.ONE) ? '' : ftxt(a)) + L[i];
      out += out ? (neg ? ' − ' : ' + ') + s : (neg ? '−' : '') + s;
    });
    return out || '0';
  }
  function solTxt(P, X, t) {
    if (!P || P.kind === 'I') return '';
    var L = P.params.map(function (x, i) { return t.lam[i] || ('λ' + (i + 1)); });
    return P.vals.map(function (v, i) { return X[i] + ' = ' + lin(v, L); }).join(', ') + (P.params.length ? ' (' + L.join(', ') + ' ∈ ℝ)' : '');
  }

  function mount(el) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], li = lang === 'en' ? 1 : 0, en = li === 1;
    var UI = K.mount(el, { sim: 'gj', title: t.title, d: true }), q = UI.q;
    LES.forEach(function (l) { l.steps = build(l, lang); });
    var ED = { mode: 'sis', jordan: true, m: 3, n: 3, A: [['1', '2', '-1', '3'], ['2', '1', '1', '7'], ['1', '-1', '2', '4']] };
    var main = '<div class="gj-edw" hidden><div class="gj-edl">'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.what) + '</p><div class="m1-seg gj-mode" role="group"><button type="button" data-gm="sis">' + esc(t.modes.sis) + '</button><button type="button" data-gm="inv">' + esc(t.modes.inv) + '</button><button type="button" data-gm="det">' + esc(t.modes.det) + '</button></div></div>'
      + '<div class="m1-grp gj-meth"><p class="m1-h">' + esc(t.method) + '</p><div class="m1-seg gj-mt" role="group"><button type="button" data-gj="0">' + esc(t.gauss) + '</button><button type="button" data-gj="1">' + esc(t.gj) + '</button></div></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.size) + '</p><div class="gj-size"><div class="gj-szr"><span class="gj-szk">' + esc(t.rows) + '</span><div class="m1-seg gj-sz" role="group" aria-label="' + esc(t.rows) + '" data-sz="m"></div></div><div class="gj-szr gj-szn"><span class="gj-szk gj-szl"></span><div class="m1-seg gj-sz" role="group" aria-label="' + esc(t.cols) + '" data-sz="n"></div></div></div></div>'
      + '</div><div class="gj-edr"><div class="m1-grp"><p class="m1-h">' + esc(t.yours) + '</p><div class="gj-ed"></div><p class="gj-edh"></p><div class="m1-btns"><button type="button" class="slk-btn slk-btn--p" data-ga="go">' + ico('play', 14) + '<span>' + esc(t.go) + '</span></button><button type="button" class="slk-btn" data-ga="rnd">' + ico('dice', 14) + '<span>' + esc(t.rnd) + '</span></button><button type="button" class="slk-btn slk-btn--g" data-ga="clr">' + ico('reset', 14) + '<span>' + esc(t.clear) + '</span></button></div></div></div></div>'
      + '<div class="gj-board"><div class="gj-op" aria-live="polite"></div><div class="gj-matw"><div class="gj-mat"></div></div><div class="gj-info"></div></div>';
    var CUR = null;
    var C = M.card(UI, { lessons: LES, main: main,
      onLoad: function (les) { CUR = les; edFrom(les); },
      onStep: function (les, k, ox) { render(les.steps[k], k, ox.anim); },
      xp: function () { return xp(CUR.steps[C.D.pos()]); },
      state: function () { return CUR && CUR.k === 'tuya' ? { ED: ED } : null; },
      restore: function (x) { if (x && x.ED && x.ED.A) { ED = x.ED; edDraw(); } }
    });
    var TOG = document.createElement('button'); TOG.type = 'button'; TOG.className = 'slk-btn pm3-codeb gj-tog'; TOG.setAttribute('data-ga', 'tog'); TOG.setAttribute('aria-expanded', 'false');
    q('.m1-head__r').insertBefore(TOG, q('.m1-head__r').firstChild);
    function tog(open) { var w = q('.gj-edw'); w.hidden = !open; TOG.setAttribute('aria-expanded', open ? 'true' : 'false'); TOG.innerHTML = ico('grid', 16) + '<span>' + esc(open ? t.hideM : t.showM) + '</span>'; if (open) K.anim(w, [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260 }); }
    tog(false);
    /* ---------- tablero */
    function render(st, k, anim) {
      var Mx = st.M, m = Mx.length, n = Mx[0].length, sep = st.sep, op = st.op;
      q('.gj-op').innerHTML = st.kind === 'op' ? '<span class="gj-op__k">' + esc(st.phase === 'jordan' ? 'Jordan' : 'Gauss') + '</span><b>' + opHTML(op) + '</b>' : st.kind === 'start' ? '<span class="gj-op__k">' + esc(t.step0) + '</span>' : '<span class="gj-op__k is-end">' + ico('check', 14) + '</span><b>' + esc(endTitle(st)) + '</b>';
      var h = '<div class="gj-m" style="--gj-c:' + n + '">';
      for (var i = 0; i < m; i++) {
        var rowCls = op ? (op.t === 'swap' ? (i === op.i || i === op.j ? ' is-row' : '') : (i === op.i ? ' is-row' : (op.t === 'add' && i === op.j ? ' is-src' : ''))) : '';
        h += '<span class="gj-rl' + rowCls + '">' + fr(i) + '</span>';
        for (var j = 0; j < n; j++) {
          var cls = 'gj-c' + rowCls + (j === sep ? ' is-bar' : '') + (j >= sep ? ' is-r' : '');
          if (st.piv && st.piv[0] === i && st.piv[1] === j && st.kind === 'op') cls += ' is-piv';
          if (op && op.t === 'add' && i === op.i && j === st.piv[1]) cls += ' is-zero';
          if (st.kind === 'det' && i === j) cls += ' is-diag';
          if (st.kind === 'rouche' && i >= st.R.p && E.isZ(Mx[i][j]) === false && j >= sep) cls += ' is-bad';
          h += '<span class="' + cls + '"' + (anim && rowCls.indexOf('is-row') >= 0 ? ' style="--gj-d:' + (j * 28) + 'ms"' : '') + '>' + frHTML(Mx[i][j]) + '</span>';
        }
      }
      q('.gj-mat').innerHTML = h + '</div>';
      if (anim) q('.gj-mat').classList.remove('is-anim'), void q('.gj-mat').offsetWidth, q('.gj-mat').classList.add('is-anim');
      // información de abajo: rangos o determinante
      var inf = '';
      if (st.mode === 'sis') { var R = E.rouche(st.kind === 'op' || st.kind === 'start' ? E.solve(Mx, { sep: sep }).M : Mx, sep); inf = '<span>' + esc(fill(t.rg, R)) + '</span>' + (st.kind === 'rouche' || st.kind === 'sol' ? '<b class="gj-kind is-' + R.kind + '">' + esc(fill(t.kinds[R.kind], { f: R.free, fp: R.free === 1 ? t.par1 : t.parN })) + '</b>' : ''); }
      else if (st.mode === 'inv') { var Rr = E.ranks(E.solve(Mx.map(function (r) { return r.slice(0, sep); }), {}).M, sep); inf = '<span>' + esc(fill(t.rgQ, Rr)) + '</span>'; }
      else inf = '<span>' + esc(fill(t.detK, { k: ftxt(E.div(E.ONE, st.f)) })) + '</span>' + (st.kind === 'det' ? '<b class="gj-kind is-CD">det(A) = ' + esc(ftxt(st.det)) + '</b>' : '');
      if (st.kind === 'sol') inf += '<span class="gj-sol">' + esc(solTxt(st.P, names(sep, t), t)) + '</span>';
      q('.gj-info').innerHTML = inf;
      C.setStrip(st.code, endRes(st));
    }
    function endTitle(st) {
      if (st.kind === 'rouche') return 'Rouché-Frobenius';
      if (st.kind === 'sol') return en ? 'Solution' : 'Solución';
      if (st.kind === 'inv') return st.ok ? 'A⁻¹' : (en ? 'No inverse' : 'Sin inversa');
      return 'det(A) = ' + ftxt(st.det);
    }
    function endRes(st) {
      if (st.kind === 'rouche') return st.R.p + ' ' + st.R.q;
      if (st.kind === 'det') return ftxt(st.det);
      if (st.kind === 'inv') return st.ok ? null : String(E.ranks(st.M.map(function (r) { return r.slice(0, st.sep); }), st.sep).p);
      return null;
    }
    function xp(st) {
      if (!st) return null;
      var parts = [], lead = esc(st.s[li]), tip;
      if (st.kind === 'op') {
        var op = st.op;
        parts.push({ c: opTxt(op), d: esc(en ? 'How it is written on paper: the row on the left of the arrow is the one that changes.' : 'Cómo se escribe en el papel: la fila a la izquierda de la flecha es la que cambia.') });
        parts.push({ c: mlOp(op), d: esc(en ? 'The same in MATLAB: M(i,:) is row i, all of its columns.' : 'Lo mismo en MATLAB: M(i,:) es la fila i, con todas sus columnas.') });
        if (op.t === 'add') parts.push({ c: 'c = ' + ftxt(op.c), d: esc(en ? 'c = −(entry to cancel) / (pivot). The determinant does not change with this operation.' : 'c = −(número a anular) / (pivote). Esta operación no cambia el determinante.') });
        if (op.t === 'swap') parts.push({ c: 'det → −det', d: esc(en ? 'A swap changes the sign of the determinant; the rank and the solutions stay the same.' : 'Un intercambio cambia el signo del determinante; el rango y las soluciones no cambian.') });
        if (op.t === 'scale') parts.push({ c: 'det → ' + ftxt(op.c) + '·det', d: esc(en ? 'Multiplying a row by c multiplies the determinant by c (c ≠ 0, so the solutions do not change).' : 'Multiplicar una fila por c multiplica el determinante por c (c ≠ 0, así que las soluciones no cambian).') });
        tip = esc(en ? 'Write each operation above the arrow, as in the simulator. Examiners check it, and it is how you find a mistake.' : 'Escribe cada operación encima de la flecha, como en el simulador. Se corrige y es como encuentras un fallo.');
      } else if (st.kind === 'rouche') {
        parts.push({ c: 'rank(A)', d: esc(en ? 'Non-zero rows on the left of the bar.' : 'Filas no nulas a la izquierda de la raya.') });
        parts.push({ c: 'rank(M)', d: esc(en ? 'Non-zero rows counting the last column.' : 'Filas no nulas contando la última columna.') });
        tip = esc(en ? 'Answer with the three numbers: rg(A), rg(A | B) and n, and then the classification.' : 'Responde con los tres números, rg(A), rg(A | B) y n, y después la clasificación.');
      } else tip = esc(en ? 'Check the result in MATLAB with the command in the strip, or by multiplying back.' : 'Comprueba el resultado en MATLAB con la orden de la franja, o multiplicando al revés.');
      return { code: st.code, lead: lead, parts: parts, tip: tip };
    }
    /* ---------- editor (tu matriz) */
    function edFrom(les) {
      if (les.k === 'tuya') return edDraw();
      ED.mode = les.mode; ED.jordan = les.mode === 'sis' ? !!les.jordan : true; ED.m = les.A.length; ED.n = les.mode === 'sis' ? les.sep : les.A[0].length;
      ED.A = les.A.map(function (r) { return r.map(String); }); edDraw();
    }
    function cols() { return ED.n + (ED.mode === 'sis' ? 1 : 0); }
    function edDraw() {
      [].forEach.call(q('.gj-mode').children, function (b) { var on = b.getAttribute('data-gm') === ED.mode; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      [].forEach.call(q('.gj-mt').children, function (b) { var on = (b.getAttribute('data-gj') === '1') === ED.jordan; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      q('.gj-meth').hidden = ED.mode !== 'sis';
      var sq = ED.mode !== 'sis';
      if (sq) ED.n = ED.m;
      ['m', 'n'].forEach(function (k) { q('[data-sz="' + k + '"]').innerHTML = [1, 2, 3, 4, 5].map(function (v) { var on = v === ED[k]; return '<button type="button" data-szv="' + v + '" class="' + (on ? 'is-on' : '') + '" aria-pressed="' + on + '">' + v + '</button>'; }).join(''); });
      q('.gj-szn').hidden = sq; q('.gj-szl').textContent = t.cols;
      var c = cols(), h = '<div class="gj-edm" style="--gj-c:' + c + '">';
      for (var i = 0; i < ED.m; i++) for (var j = 0; j < c; j++) {
        var v = ED.A[i] && ED.A[i][j] != null ? ED.A[i][j] : '0';
        h += '<input type="text" inputmode="decimal" class="gj-in' + (ED.mode === 'sis' && j === ED.n ? ' is-bar' : '') + '" data-i="' + i + '" data-j="' + j + '" value="' + esc(v) + '" aria-label="' + esc(fr(i).replace(/<[^>]+>/g, '') + ', ' + (j + 1)) + '" spellcheck="false" autocomplete="off">';
      }
      q('.gj-ed').innerHTML = h + '</div>';
      q('.gj-edh').textContent = ED.mode === 'sis' ? t.editHint : t.editHintQ;
    }
    function resize() {
      var c = cols(), A = [];
      for (var i = 0; i < ED.m; i++) { A.push([]); for (var j = 0; j < c; j++) A[i].push(ED.A[i] && ED.A[i][j] != null ? ED.A[i][j] : '0'); }
      ED.A = A;
    }
    function go() {
      var bad = null;
      [].forEach.call(q('.gj-ed').querySelectorAll('.gj-in'), function (x) { var ok = E.parse(x.value) !== null; x.classList.toggle('is-bad', !ok); if (!ok && !bad) bad = x; ED.A[+x.getAttribute('data-i')][+x.getAttribute('data-j')] = x.value.trim() || '0'; });
      if (bad) { UI.toast(t.badCell); bad.focus(); return; }
      var les = { k: 'tuya', g: 'pen', mode: ED.mode, jordan: ED.jordan, sep: ED.n, A: ED.A.map(function (r) { return r.map(function (v) { return E.str(E.parse(v)); }); }), n: [TX.es.yoursN, TX.en.yoursN], d: [TX.es.yoursD, TX.en.yoursD] };
      les.steps = build(les, lang);
      var i = LES.findIndex(function (l) { return l.k === 'tuya'; }); if (i >= 0) LES[i] = les; else LES.push(les);
      C.load('tuya');
    }
    function rnd() {
      var r = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
      var m = ED.mode === 'sis' ? r(2, 4) : r(2, 4), n = ED.mode === 'sis' ? r(2, 4) : m;
      ED.m = m; ED.n = n; ED.A = [];
      var sol = []; for (var j = 0; j < n; j++) sol.push(r(-3, 3));
      for (var i = 0; i < m; i++) {
        var row = []; for (var k = 0; k < n; k++) row.push(r(-4, 5));
        if (ED.mode === 'sis') row.push(row.reduce(function (s, x, k) { return s + x * sol[k]; }, 0) + (Math.random() < 0.15 ? r(1, 3) : 0));
        ED.A.push(row.map(String));
      }
      edDraw(); go();
    }
    el.addEventListener('click', function (e) {
      var sz = e.target.closest('[data-szv]');
      if (sz && el.contains(sz)) { ED[sz.parentNode.getAttribute('data-sz')] = +sz.getAttribute('data-szv'); if (ED.mode !== 'sis') ED.n = ED.m; resize(); edDraw(); return; }
      var b = e.target.closest('[data-gm],[data-gj],[data-ga]'); if (!b || !el.contains(b)) return;
      if (b.hasAttribute('data-gm')) { var md = b.getAttribute('data-gm'); if (md !== ED.mode) { var wasSis = ED.mode === 'sis'; ED.mode = md; if (wasSis && md !== 'sis') { ED.n = ED.m; } resize(); edDraw(); } return; }
      if (b.hasAttribute('data-gj')) { ED.jordan = b.getAttribute('data-gj') === '1'; edDraw(); go(); return; }
      var a = b.getAttribute('data-ga');
      if (a === 'tog') { tog(q('.gj-edw').hidden); return; }
      if (a === 'go') { go(); tog(false); } else if (a === 'rnd') { rnd(); tog(false); } else { ED.A = ED.A.map(function (r) { return r.map(function () { return '0'; }); }); edDraw(); var f = q('.gj-in'); if (f) f.focus(); }
    });
    el.addEventListener('input', function (e) { var x = e.target; if (x.classList && x.classList.contains('gj-in') && el.contains(x)) { ED.A[+x.getAttribute('data-i')][+x.getAttribute('data-j')] = x.value; x.classList.remove('is-bad'); } });
    el.addEventListener('keydown', function (e) { var x = e.target; if (e.key === 'Enter' && x.classList && x.classList.contains('gj-in') && el.contains(x)) { e.preventDefault(); go(); } });
    /* ---------- «Ponte a prueba» */
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function nz(a, b) { var v; do v = ri(a, b); while (!v); return v; }
    function frNorm(s) { var x = E.parse(String(s).replace(/\s/g, '')); return x ? str(x) : '?'; }
    function mlM(A) { return mlMat(A.map(function (r) { return r.map(F); })); }
    var LV = [
      { gen: function () {
        var p = nz(-5, 6), a = nz(-9, 9), A = [[p, ri(-4, 5), ri(-4, 5)], [a, ri(-4, 5), ri(-4, 5)]], c = E.neg(E.div(F(a), F(p)));
        return { q: fill(t.lq1, { p: String(p).replace('-', '−'), a: String(a).replace('-', '−') }), code: 'M = ' + mlM(A) + '\nM(2,:) = M(2,:) + c*M(1,:)', ans: ftxt(c), norm: frNorm, hint: t.h1, mode: 'text' };
      } },
      { gen: function () {
        var kind = ['CD', 'CI', 'I'][ri(0, 2)], A, tries = 0, R;
        do {
          var r1 = [nz(-3, 3), ri(-3, 3), ri(-3, 3)], r2 = [ri(-3, 3), nz(-3, 3), ri(-3, 3)], s = [ri(-2, 2), ri(-2, 2), ri(-2, 2)];
          var dot = function (r) { return r[0] * s[0] + r[1] * s[1] + r[2] * s[2]; };
          var r3 = kind === 'CD' ? [ri(-3, 3), ri(-3, 3), nz(-3, 3)] : (function () { var al = nz(-2, 2), be = ri(-2, 2); return [0, 1, 2].map(function (k) { return al * r1[k] + be * r2[k]; }); })();
          A = [r1.concat(dot(r1)), r2.concat(dot(r2)), r3.concat(dot(r3) + (kind === 'I' ? nz(-3, 3) : 0))];
          R = E.rouche(E.solve(A.map(function (r) { return r.map(F); }), { sep: 3 }).M, 3); tries++;
        } while (R.kind !== kind && tries < 40);
        return { q: t.lq2, code: 'M = ' + mlM(A) + '   % (A | B)', ans: R.kind, norm: function (x) { var u = String(x).toUpperCase().replace(/[^A-Z]/g, ''); return u === 'SCD' ? 'CD' : u === 'SCI' ? 'CI' : u === 'SI' ? 'I' : u; }, hint: t.h2, mode: 'text' };
      } },
      { gen: function () {
        var A = [[ri(-3, 3), ri(-3, 3), ri(-3, 3)], [ri(-3, 3), ri(-3, 3), ri(-3, 3)], [ri(-3, 3), ri(-3, 3), ri(-3, 3)]], d = E.det(A.map(function (r) { return r.map(F); }));
        return { q: t.lq3, code: 'A = ' + mlM(A) + '\ndet(A)', ans: ftxt(d).replace('−', '-'), norm: function (x) { var v = E.parse(String(x).replace(/\s/g, '')); return v ? str(v) : '?'; }, hint: t.h3, mode: 'text' };
      } }
    ];
    LV.forEach(function (l, i) { l.n = [TX.es.lv[i][0], TX.en.lv[i][0]]; l.d = [TX.es.lv[i][1], TX.en.lv[i][1]]; });
    K.levels(UI, { key: 'sl_sim_gj_niveles', need: 3, levels: LV, hl: function (s) { return esc(s); } });
    C.start();
  }
  window.SLGJUI = { mount: mount, LES: LES, build: build };
  K.boot('.sl-sim[data-sim="gj"]', mount);
})();
