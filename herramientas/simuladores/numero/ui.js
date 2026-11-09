/* SergioLearns — interfaz de «un número, todas sus formas» (.sl-sim[data-sim="numero"]). Necesita kit.js y numero/engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, N$ = window.SLNum;
  var KINDS = ['nat', 'sm', 'c1', 'c2'];
  var EX = {
    es: [
      { k: 'c2', n: '−58 en 8 bits (C2, tema 4)', mo: 'one', n_: 8, a: '-58' },
      { k: 'col', n: 'El color #F4A261: 244 en base 2, 8 y 16 (tema 2)', mo: 'one', n_: 8, a: '244' },
      { k: 'fr', n: '25,75 y 0,4 en binario (tema 2)', mo: 'one', n_: 8, a: '25,75' },
      { k: 'asc', n: 'El ascensor: −3 + 5 en C1 (tema 3)', mo: 'add', n_: 8, r: 'c1', a: '-3', b: '5' },
      { k: 'ovf', n: '100 + 50 en C2: desborda (tema 4)', mo: 'add', n_: 8, r: 'c2', a: '100', b: '50' },
      { k: 'res', n: '30 − 75 = 30 + C2(75) (tema 4)', mo: 'sub', n_: 8, r: 'c2', a: '30', b: '75' },
      { k: 'nat', n: 'La báscula: 75 + 68 sin signo (tema 3)', mo: 'add', n_: 8, r: 'nat', a: '75', b: '68' }
    ],
    en: [
      { k: 'c2', n: '−58 in 8 bits (two’s complement, topic 4)', mo: 'one', n_: 8, a: '-58' },
      { k: 'col', n: 'The colour #F4A261: 244 in base 2, 8 and 16 (topic 2)', mo: 'one', n_: 8, a: '244' },
      { k: 'fr', n: '25.75 and 0.4 in binary (topic 2)', mo: 'one', n_: 8, a: '25.75' },
      { k: 'asc', n: 'The lift: −3 + 5 in ones’ complement (topic 3)', mo: 'add', n_: 8, r: 'c1', a: '-3', b: '5' },
      { k: 'ovf', n: '100 + 50 in two’s complement: overflow (topic 4)', mo: 'add', n_: 8, r: 'c2', a: '100', b: '50' },
      { k: 'res', n: '30 − 75 = 30 + C2(75) (topic 4)', mo: 'sub', n_: 8, r: 'c2', a: '30', b: '75' },
      { k: 'nat', n: 'The scales: 75 + 68 unsigned (topic 3)', mo: 'add', n_: 8, r: 'nat', a: '75', b: '68' }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'numero', oB: '--bits',
      moL: 'Qué hacer', mo: { one: 'Un número', add: 'Suma', sub: 'Resta' }, bitsL: 'Bits', rL: 'En', r: { nat: 'Sin signo', sm: 'SM', c1: 'C1', c2: 'C2' },
      rN: { nat: 'binario natural (sin signo)', sm: 'signo-magnitud', c1: 'complemento a 1', c2: 'complemento a 2', exc: 'exceso {b}' },
      ex: 'Ejemplo', share: 'Compartir', a: 'Número', a2: 'A', b: 'B', inH: 'En decimal (−58, 25,75) o con prefijo: 0b1011, 0o17, 0x2A. Las sumas y restas, con enteros.', bad: 'No es un número válido.', intOnly: 'Para sumar y restar, enteros.',
      steps: 'paso a paso', forms: 'todas sus formas', col: 'en columna', start: 'Pulsa Paso para verlo paso a paso, como en el papel.',
      th: { f: 'forma', v: 'con {n} bits', r: 'rango con {n} bits' }, decimal: 'decimal', base: { 2: 'binario', 8: 'octal', 16: 'hexadecimal' },
      noFit: 'no cabe', onlyInt: 'solo enteros', minus: 'con el signo delante: en la máquina, SM, C1 o C2', per: 'periódico: se repite {p}', cut: '… (se corta en {k} cifras)', exact: 'exacto',
      st: {
        div: '{n} ÷ {b} = {q}, resto {r}{d}.', divEnd: 'El cociente {q} ya es menor que {b}: es la última cifra. Se leen de abajo arriba: {res}.', mul: '0,{f} × {b} = {x} → cifra {d}.', mulEnd: 'La parte fraccionaria es {res}.',
        grp: 'Octal y hexadecimal sin dividir otra vez: se agrupan los bits de 3 en 3 ({o}) y de 4 en 4 ({h}) desde la coma.',
        sm: 'Signo-magnitud: un bit de signo ({s}) y la magnitud {m} en {k} bits → {r}.', c1p: 'Complemento a 1: como es positivo, es el binario de siempre → {r}.', c1n: 'Complemento a 1: se escribe {m} en {n} bits ({p}) y se invierten todos los bits → {r}.',
        c2p: 'Complemento a 2: positivo, igual que en binario → {r}.', c2n: 'Complemento a 2: C1 + 1 = {c1} + 1 = {r}. Atajo: se copia por la derecha hasta el primer 1 y se invierte el resto.', c2min: 'Complemento a 2: {x} es el más negativo de {n} bits y no tiene opuesto: es {r} (solo el bit que pesa −{p}).',
        exc: 'Exceso {b}: se suma {b} al número ({x} + {b} = {s}) y se pasa a binario → {r}.',
        chk: 'Comprobación de C2 con pesos: el bit de la izquierda pesa −{p}: {w} = {x}.', noFit: '{x} no cabe en {n} bits con {k}: el rango es de {lo} a {hi}.',
        cplC2: 'Restar es sumar el opuesto: A − B = A + C2(B). C2({b}) = C1 + 1 = {r}.', cplC1: 'Restar es sumar el opuesto: A − B = A + C1(B). C1({b}) = {r} (se invierten los bits).',
        smRule: 'Signo-magnitud no se suma bit a bit: se mira el signo. {why}', smSame: 'Los dos son {sg}: se suman las magnitudes ({ma} + {mb}) y el resultado lleva ese signo.', smDiff: 'Signos distintos: a la magnitud mayor ({M}) se le resta la menor ({m}) y el resultado lleva el signo de la mayor ({sg}).',
        colA: 'Columna {i} (peso 2^{i}): {a} + {b} + acarreo {c} = {s} → escribo {o}{me}.', colS: 'Columna {i} (peso 2^{i}): {a} − {b} − préstamo {c}{pd} → escribo {o}{me}.', me: ', me llevo 1', pid: ', pido 1 a la columna siguiente', pd0: '', pd1: ' (no llega: 2 + {a} − {b} − {c})',
        vuelta: 'Ha salido acarreo final: en C1 se vuelve a sumar al resultado (la vuelta): {r} + 1 = {v}.',
        fin: { nat: 'Resultado: {r} = {v}.', c2: 'Resultado: {r} = {v} (el acarreo final{cf} se descarta).', c1: 'Resultado: {r} = {v}.', sm: 'Resultado: {r} = {v}.' },
        ovfY: { nat: 'Desbordamiento: sale un acarreo final de la columna {n1}, así que el resultado real ({real}) no cabe en {n} bits.', natS: 'El resultado sería negativo ({real}): sin signo no se puede representar (queda un préstamo final).', c2: 'Desbordamiento: los dos sumandos tienen el mismo signo ({s}) y el resultado sale con el otro. El real, {real}, no cabe en {n} bits.', c1: 'Desbordamiento: mismo signo de entrada ({s}) y otro de salida. El real, {real}, no cabe en {n} bits.', sm: 'Desbordamiento: sale un acarreo de la magnitud, así que {real} no cabe en {n} bits.', min: 'Desbordamiento: {b} no tiene opuesto en {n} bits (C2 de {b} es él mismo), así que {real} no cabe.' },
        ovfN: 'Sin desbordamiento: {real} cabe en {n} bits.', ovfN2: 'Sin desbordamiento: el acarreo final no indica desbordamiento en C2; lo que importa es el signo.', neg0: ' Ojo: en C1 sale 11…1, el cero negativo.'
      },
      rules: 'Signo-magnitud y C1 tienen dos ceros y van de −(2^(n−1) − 1) a 2^(n−1) − 1; C2 y el exceso 2^(n−1) van de −2^(n−1) a 2^(n−1) − 1; sin signo, de 0 a 2^n − 1. En la resta de C1 y C2 se suma el complemento del sustraendo, como en los apuntes. Las cuentas salen de los mismos simuladores de los temas 2, 3 y 4 (comprobado con 20 000 operaciones).',
      reto: 'Reto: hazlo tú en papel', retoLead: 'Como las cuestiones del examen: pasa el número, léelo o haz la suma, y comprueba.',
      rTo: 'Escribe {x} en {k} de {n} bits:', rFrom: '¿Qué número decimal es {b} en {k}?', rHex: 'Pasa {x} a hexadecimal:', rOp: 'Suma en {k} de {n} bits: {a} + {b}. Escribe los {n} bits del resultado y di si hay desbordamiento:',
      ansB: 'bits', ansD: 'decimal', ansH: 'hexadecimal', ovfQ: '¿Desbordamiento?', yes: 'Sí', no: 'No',
      allOk: 'Bien.', bad2: 'No es eso. Pulsa «Ver la solución» para verlo paso a paso.'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'number', oB: '--bits',
      moL: 'What to do', mo: { one: 'One number', add: 'Add', sub: 'Subtract' }, bitsL: 'Bits', rL: 'In', r: { nat: 'Unsigned', sm: 'SM', c1: 'C1', c2: 'C2' },
      rN: { nat: 'unsigned binary', sm: 'sign-magnitude', c1: 'ones’ complement', c2: 'two’s complement', exc: 'excess {b}' },
      ex: 'Example', share: 'Share', a: 'Number', a2: 'A', b: 'B', inH: 'In decimal (−58, 25.75) or with a prefix: 0b1011, 0o17, 0x2A. Sums and subtractions, with integers.', bad: 'Not a valid number.', intOnly: 'To add and subtract, integers.',
      steps: 'step by step', forms: 'every form', col: 'in columns', start: 'Press Step to see it step by step, as on paper.',
      th: { f: 'form', v: 'with {n} bits', r: 'range with {n} bits' }, decimal: 'decimal', base: { 2: 'binary', 8: 'octal', 16: 'hexadecimal' },
      noFit: 'does not fit', onlyInt: 'integers only', minus: 'with the sign in front: in the machine, SM, C1 or C2', per: 'repeating: {p} repeats', cut: '… (cut at {k} digits)', exact: 'exact',
      st: {
        div: '{n} ÷ {b} = {q}, remainder {r}{d}.', divEnd: 'The quotient {q} is already smaller than {b}: it is the last digit. Read from bottom to top: {res}.', mul: '0.{f} × {b} = {x} → digit {d}.', mulEnd: 'The fractional part is {res}.',
        grp: 'Octal and hexadecimal without dividing again: group the bits in 3s ({o}) and in 4s ({h}) from the point.',
        sm: 'Sign-magnitude: a sign bit ({s}) and the magnitude {m} in {k} bits → {r}.', c1p: 'Ones’ complement: positive, so it is the usual binary → {r}.', c1n: 'Ones’ complement: write {m} in {n} bits ({p}) and invert every bit → {r}.',
        c2p: 'Two’s complement: positive, same as binary → {r}.', c2n: 'Two’s complement: C1 + 1 = {c1} + 1 = {r}. Shortcut: copy from the right up to the first 1 and invert the rest.', c2min: 'Two’s complement: {x} is the most negative number of {n} bits and has no opposite: it is {r} (only the bit worth −{p}).',
        exc: 'Excess {b}: add {b} to the number ({x} + {b} = {s}) and write it in binary → {r}.',
        chk: 'Checking C2 with weights: the leftmost bit is worth −{p}: {w} = {x}.', noFit: '{x} does not fit in {n} bits with {k}: the range is {lo} to {hi}.',
        cplC2: 'Subtracting is adding the opposite: A − B = A + C2(B). C2({b}) = C1 + 1 = {r}.', cplC1: 'Subtracting is adding the opposite: A − B = A + C1(B). C1({b}) = {r} (bits inverted).',
        smRule: 'Sign-magnitude is not added bit by bit: look at the signs. {why}', smSame: 'Both are {sg}: add the magnitudes ({ma} + {mb}) and the result keeps that sign.', smDiff: 'Different signs: subtract the smaller magnitude ({m}) from the larger ({M}) and the result takes the sign of the larger ({sg}).',
        colA: 'Column {i} (weight 2^{i}): {a} + {b} + carry {c} = {s} → write {o}{me}.', colS: 'Column {i} (weight 2^{i}): {a} − {b} − borrow {c}{pd} → write {o}{me}.', me: ', carry 1', pid: ', borrow 1 from the next column', pd0: '', pd1: ' (not enough: 2 + {a} − {b} − {c})',
        vuelta: 'There is an end carry: in C1 it is added back to the result (end-around carry): {r} + 1 = {v}.',
        fin: { nat: 'Result: {r} = {v}.', c2: 'Result: {r} = {v} (the end carry{cf} is discarded).', c1: 'Result: {r} = {v}.', sm: 'Result: {r} = {v}.' },
        ovfY: { nat: 'Overflow: an end carry comes out of column {n1}, so the real result ({real}) does not fit in {n} bits.', natS: 'The result would be negative ({real}): unsigned cannot represent it (a final borrow is left).', c2: 'Overflow: both addends have the same sign ({s}) and the result comes out with the other one. The real {real} does not fit in {n} bits.', c1: 'Overflow: same sign in ({s}) and a different one out. The real {real} does not fit in {n} bits.', sm: 'Overflow: a carry comes out of the magnitude, so {real} does not fit in {n} bits.', min: 'Overflow: {b} has no opposite in {n} bits (the C2 of {b} is itself), so {real} does not fit.' },
        ovfN: 'No overflow: {real} fits in {n} bits.', ovfN2: 'No overflow: in C2 the end carry does not mean overflow; what matters is the sign.', neg0: ' Note: in C1 this gives 11…1, negative zero.'
      },
      rules: 'Sign-magnitude and C1 have two zeros and go from −(2^(n−1) − 1) to 2^(n−1) − 1; C2 and excess 2^(n−1) go from −2^(n−1) to 2^(n−1) − 1; unsigned, from 0 to 2^n − 1. In C1 and C2 subtraction the complement of the subtrahend is added, as in the course notes. The arithmetic comes from the same simulators as topics 2, 3 and 4 (checked with 20,000 operations).',
      reto: 'Challenge: do it yourself on paper', retoLead: 'Like the exam questions: convert the number, read it or do the sum, and check.',
      rTo: 'Write {x} in {k} with {n} bits:', rFrom: 'What decimal number is {b} in {k}?', rHex: 'Convert {x} to hexadecimal:', rOp: 'Add in {k} with {n} bits: {a} + {b}. Type the {n} bits of the result and say whether it overflows:',
      ansB: 'bits', ansD: 'decimal', ansH: 'hexadecimal', ovfQ: 'Overflow?', yes: 'Yes', no: 'No',
      allOk: 'Correct.', bad2: 'Not quite. Press «See the solution» to follow it step by step.'
    }
  };
  function g4(b) { return b.replace(/\B(?=(\d{4})+(?!\d))/g, ' '); }
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, exs = EX[L], T = t.st;
    K.title = t.title;
    var dec = function (x) { return L === 'es' ? String(x).replace('.', ',') : String(x); };
    var minus = function (x) { return x < 0 ? '−' + (-x) : String(x); };
    var S = { mo: 'one', n: 8, r: 'c2', a: '-58', b: '27', ex: 'c2' }, ST = [], cur = -1;
    var KEY = 'sl_sim_numero_' + (document.documentElement.lang || '').slice(0, 2);
    (function () {
      var s = K6.hashState() || K6.store(KEY); if (!s) return;
      try { var o = JSON.parse(s); S.mo = ['one', 'add', 'sub'].indexOf(o.mo) >= 0 ? o.mo : 'one'; S.n = [4, 8, 16, 32].indexOf(+o.n) >= 0 ? +o.n : 8; S.r = KINDS.indexOf(o.r) >= 0 ? o.r : 'c2'; S.a = String(o.a || '').slice(0, 40); S.b = String(o.b || '').slice(0, 40); S.ex = o.ex || ''; } catch (e) {}
    })();
    var enc = function () { return JSON.stringify({ mo: S.mo, n: S.n, r: S.r, a: S.a, b: S.b, ex: S.ex }); };
    var seg = function (attr, lab, items, cls) { return '<div class="sl6-seg' + (cls || '') + '" role="group" aria-label="' + esc(lab) + '"><span class="sl6-seg__l">' + esc(lab) + '</span>' + items.map(function (x) { return '<button type="button" data-' + attr + '="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; };
    var ctl = '<div class="sl6-ctl">' + seg('mo', t.moL, [['one', t.mo.one], ['add', t.mo.add], ['sub', t.mo.sub]]) + seg('n', t.bitsL, [[4, '4'], [8, '8'], [16, '16'], [32, '32']]) + seg('r', t.rL, KINDS.map(function (k) { return [k, t.r[k]]; }), ' sl6-nu-rs')
      + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('') + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── stdin</h3><div class="sl6-nu-in"><label><span class="sl6-lbl sl6-nu-la">' + esc(t.a) + '</span><input type="text" class="sl6-nu-a sl6-wide" spellcheck="false" autocomplete="off"></label><label class="sl6-nu-bw"><span class="sl6-lbl">' + esc(t.b) + '</span><input type="text" class="sl6-nu-b sl6-wide" spellcheck="false" autocomplete="off"></label></div><p class="sl6-help sl6-nu-h">' + esc(t.inH) + '</p>'
      + '<div class="sl6-nu-vis"></div></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-nu-card"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h sl6-nu-fh">── ' + esc(t.forms) + '</h3><div class="sl6-res sl6-nu-forms"></div></section>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var aIn = q('.sl6-nu-a'), bIn = q('.sl6-nu-b');
    aIn.value = S.a; bIn.value = S.b;
    function kname(k) { return fill(t.rN[k], { b: Math.pow(2, S.n - 1) }); }
    function bitsH(b, hi, cls) { return '<span class="sl6-nu-bits' + (cls ? ' ' + cls : '') + '">' + b.split('').map(function (c, i) { return '<i' + (hi && hi(i) ? ' class="is-hi"' : '') + '>' + c + '</i>'; }).join('') + '</span>'; }
    /* pasos de «un número» */
    function stepsOne(p, n) {
      var out = [], x = N$.value(p), isInt = !p.frac, xi = p.neg ? -p.ip : p.ip, ad = p.ip;
      var e2 = N$.entera(ad, 2), esc2 = [];
      e2.steps.forEach(function (s, i) {
        esc2.push(s);
        out.push({ h: fill(T.div, { n: s.n, b: 2, q: s.q, r: s.r, d: '' }), v: { k: 'esc', rows: esc2.slice(), done: false, bits: e2.dig } });
      });
      out.push({ h: fill(T.divEnd, { q: e2.last, b: 2, res: '<b>' + e2.dig + '</b>' }), v: { k: 'esc', rows: e2.steps.slice(), done: true, last: e2.last, bits: e2.dig } });
      var fr = null;
      if (p.frac) {
        fr = N$.fraccion(p.fn, p.fd, 2, 12);
        fr.steps.forEach(function (s, i) {
          var f = Number(s.fn) / Number(s.fd), xv = Number(s.xn) / Number(s.fd);
          out.push({ h: fill(T.mul, { f: fmtF(f), b: 2, x: dec(+xv.toFixed(6)), d: s.d }), v: { k: 'mul', upto: i, fr: fr } });
        });
        out.push({ h: fill(T.mulEnd, { res: '<b>0,' .replace(',', L === 'es' ? ',' : '.') + fr.dig + '</b>' + (fr.exact ? ' (' + t.exact + ')' : ' ' + esc(fill(t.per, { p: fr.dig.slice(fr.per, fr.per + fr.perLen) || fr.dig })) ) }), v: { k: 'mul', upto: fr.steps.length - 1, fr: fr } });
      }
      var b8 = N$.entera(ad, 8).dig, b16 = N$.entera(ad, 16).dig, f8 = fr ? N$.fraccion(p.fn, p.fd, 8, 6).dig : '', f16 = fr ? N$.fraccion(p.fn, p.fd, 16, 5).dig : '';
      out.push({ h: fill(T.grp, { o: '<b>' + b8 + (f8 ? sep() + f8 : '') + '₈</b>', h: '<b>' + b16 + (f16 ? sep() + f16 : '') + '₁₆</b>' }), v: { k: 'grp', bits: e2.dig, fb: fr ? fr.dig : '' } });
      if (isInt) {
        var r = N$.rng('sm', n);
        if (N$.fits('sm', xi, n)) { var smb = N$.ENC.sm(xi, n); out.push({ h: fill(T.sm, { s: smb[0], m: Math.abs(xi), k: n - 1, r: '<b>' + g4(smb) + '</b>' }), v: { k: 'bits', b: smb, hi: [0] } }); }
        else out.push({ h: fill(T.noFit, { x: minus(xi), n: n, k: kname('sm'), lo: minus(r[0]), hi: r[1] }), v: null });
        if (N$.fits('c1', xi, n)) {
          var c1b = N$.ENC.c1(xi, n), pb = N$.pad(Math.abs(xi).toString(2), n);
          out.push({ h: xi < 0 ? fill(T.c1n, { m: -xi, n: n, p: g4(pb), r: '<b>' + g4(c1b) + '</b>' }) : fill(T.c1p, { r: '<b>' + g4(c1b) + '</b>' }), v: { k: 'two', a: pb, b: c1b, neg: xi < 0 } });
        } else out.push({ h: fill(T.noFit, { x: minus(xi), n: n, k: kname('c1'), lo: minus(N$.rng('c1', n)[0]), hi: N$.rng('c1', n)[1] }), v: null });
        if (N$.fits('c2', xi, n)) {
          var c2b = N$.ENC.c2(xi, n);
          if (xi === -Math.pow(2, n - 1)) out.push({ h: fill(T.c2min, { x: minus(xi), n: n, r: '<b>' + g4(c2b) + '</b>', p: Math.pow(2, n - 1) }), v: { k: 'bits', b: c2b, hi: [0] } });
          else if (xi < 0) { var c1x = N$.inv(N$.pad((-xi).toString(2), n)), ad1 = N$.addBits(c1x, N$.pad('1', n)); out.push({ h: fill(T.c2n, { c1: g4(c1x), r: '<b>' + g4(c2b) + '</b>' }), v: { k: 'sum', s: ad1, a: c1x, b: N$.pad('1', n) } }); }
          else out.push({ h: fill(T.c2p, { r: '<b>' + g4(c2b) + '</b>' }), v: { k: 'bits', b: c2b } });
          var wv = c2b.split('').map(function (c, i) { return c === '1' ? (i === 0 ? '−' + Math.pow(2, n - 1) : '+' + Math.pow(2, n - 1 - i)) : ''; }).filter(Boolean).join(' ').replace(/^\+/, '') || '0';
          if (n <= 16) out.push({ h: fill(T.chk, { p: Math.pow(2, n - 1), w: wv, x: minus(xi) }), v: { k: 'w', b: c2b } });
        } else out.push({ h: fill(T.noFit, { x: minus(xi), n: n, k: kname('c2'), lo: minus(N$.rng('c2', n)[0]), hi: N$.rng('c2', n)[1] }), v: null });
        if (N$.fits('exc', xi, n)) { var eb = N$.ENC.exc(xi, n), bb = Math.pow(2, n - 1); out.push({ h: fill(T.exc, { b: bb, x: minus(xi), s: xi + bb, r: '<b>' + g4(eb) + '</b>' }), v: { k: 'bits', b: eb } }); }
      }
      return out;
    }
    function sep() { return L === 'es' ? ',' : '.'; }
    function fmtF(f) { return String(+f.toFixed(6)).replace(/^0\./, ''); }
    /* pasos de la suma o la resta */
    function stepsOp(o) {
      var out = [], n = o.n, k = o.kind, cols = o.main.cols, m = cols.length, isSub = k === 'nat' && o.sub || k === 'sm' && o.how === 'sub';
      if (k === 'c2' && o.sub) out.push({ h: fill(T.cplC2, { b: g4(o.B), r: '<b>' + g4(o.Bop) + '</b>' }), v: { k: 'col', o: o, upto: -1 } });
      if (k === 'c1' && o.sub) out.push({ h: fill(T.cplC1, { b: g4(o.B), r: '<b>' + g4(o.Bop) + '</b>' }), v: { k: 'col', o: o, upto: -1 } });
      if (k === 'sm') out.push({ h: fill(T.smRule, { why: o.sa === o.sb ? fill(T.smSame, { sg: o.sa ? '−' : '+', ma: o.ma, mb: o.mb }) : fill(T.smDiff, { M: Math.max(o.ma, o.mb), m: Math.min(o.ma, o.mb), sg: o.sign ? '−' : '+' }) }), v: { k: 'col', o: o, upto: -1 } });
      for (var j = 0; j < m; j++) {
        var c = cols[m - 1 - j];
        if (isSub) out.push({ h: fill(T.colS, { i: j, a: c.a, b: c.b, c: c.cin, pd: c.a - c.b - c.cin < 0 ? fill(T.pd1, { a: c.a, b: c.b, c: c.cin }) : '', o: c.s, me: c.cout ? T.pid : '' }), v: { k: 'col', o: o, upto: j } });
        else out.push({ h: fill(T.colA, { i: j, a: c.a, b: c.b, c: c.cin, s: c.a + c.b + c.cin, o: c.s, me: c.cout ? T.me : '' }), v: { k: 'col', o: o, upto: j } });
      }
      if (o.vuelta) out.push({ h: fill(T.vuelta, { r: g4(o.main.r), v: '<b>' + g4(o.r) + '</b>' }), v: { k: 'col', o: o, upto: m, vu: true } });
      var real = minus(o.real), fin = fill(T.fin[k], { r: '<b>' + g4(o.r) + '</b>', v: '<b>' + minus(o.val) + '</b>', cf: o.cout ? ' (1)' : ' (0)' });
      var ov;
      if (o.ovf) {
        if (k === 'nat') ov = o.sub ? fill(T.ovfY.natS, { real: real }) : fill(T.ovfY.nat, { n1: n - 1, real: real, n: n });
        else if (k === 'c2' && o.minB) ov = fill(T.ovfY.min, { b: minus(o.y), n: n, real: real });
        else ov = fill(T.ovfY[k], { s: o.A[0], real: real, n: n });
      } else ov = (k === 'c2' && o.cout ? T.ovfN2 : fill(T.ovfN, { real: real, n: n })) + (k === 'c1' && /^1+$/.test(o.r) ? T.neg0 : '');
      out.push({ h: fin + ' ' + ov, v: { k: 'col', o: o, upto: m + 1, vu: !!o.vuelta, end: true }, bad: o.ovf });
      return out;
    }
    function colTable(v) {
      var o = v.o, cols = o.main.cols, m = cols.length, up = v.upto, isSub = o.kind === 'nat' && o.sub || o.kind === 'sm' && o.how === 'sub';
      var on = function (j) { return up >= j; }, cl = function (i) { var j = m - 1 - i; return (j === up ? ' class="is-cur"' : (on(j) ? '' : ' class="is-fut"')); };
      var A = o.kind === 'sm' ? (o.swap ? N$.pad(o.mb.toString(2), m) : N$.pad(o.ma.toString(2), m)) : o.A, B = o.kind === 'sm' ? (o.swap ? N$.pad(o.ma.toString(2), m) : N$.pad(o.mb.toString(2), m)) : o.Bop;
      var row = function (lab, co, f, cls, coCls) { var h = '<tr' + (cls ? ' class="' + cls + '"' : '') + '><th>' + esc(lab) + '</th><td class="sl6-nu-co' + (coCls || '') + '">' + co + '</td>'; for (var i = 0; i < m; i++) h += '<td' + cl(i) + '>' + f(i) + '</td>'; return h + '</tr>'; };
      var h = '<table class="sl6-nu-col"><tbody>', fin = on(m - 1) && cols[0].cout;
      h += row(isSub ? (L === 'es' ? 'préstamos' : 'borrows') : (L === 'es' ? 'acarreos' : 'carries'), fin ? '1' : '', function (i) { return on(m - 1 - i) && cols[i].cin ? '1' : ''; }, 'sl6-nu-cr', fin ? ' is-on' : '');
      h += row(o.kind === 'sm' ? (L === 'es' ? '|mayor|' : '|larger|') : 'A', '', function (i) { return A[i]; });
      h += row(o.kind === 'sm' ? (L === 'es' ? '|menor|' : '|smaller|') : (o.sub && (o.kind === 'c1' || o.kind === 'c2') ? (o.kind === 'c2' ? 'C2(B)' : 'C1(B)') : 'B'), isSub ? '−' : '+', function (i) { return B[i]; }, 'sl6-nu-op');
      h += row('=', '', function (i) { return on(m - 1 - i) ? cols[i].s : ''; }, 'sl6-nu-res');
      if (v.vu) { h += row(L === 'es' ? 'vuelta' : 'end-around', '+', function (i) { return i === m - 1 ? '1' : ''; }, 'sl6-nu-op'); h += row('=', '', function (i) { return o.r[i]; }, 'sl6-nu-res'); }
      h += '</tbody></table>';
      if (o.kind === 'sm') h += '<p class="sl6-help">' + esc(L === 'es' ? 'Signo del resultado: ' : 'Sign of the result: ') + '<b>' + o.sign + '</b> → ' + (v.end ? '<b>' + g4(o.r) + '</b>' : '…') + '</p>';
      return h;
    }
    function vis(v) {
      if (!v) return '';
      if (v.k === 'esc') {
        var h = '<table class="sl6-nu-esc"><tbody>' + v.rows.map(function (s, i) { return '<tr><td>' + s.n + '</td><td>÷ 2 =</td><td>' + s.q + '</td><td class="sl6-nu-r">' + s.r + '</td></tr>'; }).join('') + (v.done ? '<tr class="is-last"><td colspan="2"></td><td class="sl6-nu-r">' + v.last + '</td><td></td></tr>' : '') + '</tbody></table>';
        return h + (v.done ? '<p class="sl6-nu-read">↑ ' + bitsH(v.bits) + '</p>' : '');
      }
      if (v.k === 'mul') return '<table class="sl6-nu-esc"><tbody>' + v.fr.steps.slice(0, v.upto + 1).map(function (s) { return '<tr><td>0,' .replace(',', sep()) + fmtF(Number(s.fn) / Number(s.fd)) + '</td><td>× 2 =</td><td>' + dec(+(Number(s.xn) / Number(s.fd)).toFixed(6)) + '</td><td class="sl6-nu-r">' + s.d + '</td></tr>'; }).join('') + '</tbody></table><p class="sl6-nu-read">↓ 0' + sep() + v.fr.dig.slice(0, v.upto + 1) + '</p>';
      if (v.k === 'grp') {
        var b = v.bits, pad3 = N$.pad(b, Math.ceil(b.length / 3) * 3), pad4 = N$.pad(b, Math.ceil(b.length / 4) * 4);
        var f3 = v.fb ? v.fb + '00'.slice(0, (3 - v.fb.length % 3) % 3) : '', f4 = v.fb ? v.fb + '000'.slice(0, (4 - v.fb.length % 4) % 4) : '';
        var grp = function (s, k, base) { return s.match(new RegExp('.{' + k + '}', 'g')).map(function (x) { return '<span class="sl6-nu-g"><code>' + x + '</code><b>' + N$.DIG[parseInt(x, 2)] + '</b></span>'; }).join(''); };
        return '<div class="sl6-nu-grp"><p class="sl6-lbl">' + esc(t.base[8]) + '</p><div>' + grp(pad3, 3) + (f3 ? '<span class="sl6-nu-dot">' + sep() + '</span>' + grp(f3, 3) : '') + '</div><p class="sl6-lbl">' + esc(t.base[16]) + '</p><div>' + grp(pad4, 4) + (f4 ? '<span class="sl6-nu-dot">' + sep() + '</span>' + grp(f4, 4) : '') + '</div></div>';
      }
      if (v.k === 'bits') return '<p class="sl6-nu-read">' + bitsH(v.b, function (i) { return v.hi && v.hi.indexOf(i) >= 0; }) + '</p>';
      if (v.k === 'two') return '<p class="sl6-nu-read">' + bitsH(v.a, null, 'is-dim') + '</p>' + (v.neg ? '<p class="sl6-nu-read">↓ ' + (L === 'es' ? 'se invierten' : 'inverted') + '</p><p class="sl6-nu-read">' + bitsH(v.b, function () { return true; }) + '</p>' : '');
      if (v.k === 'sum') return colTable({ o: { kind: 'c2', A: v.a, Bop: v.b, main: v.s, sub: false }, upto: v.a.length + 1, end: true });
      if (v.k === 'w') { var nn = v.b.length; return '<div class="sl6-nu-wt">' + v.b.split('').map(function (c, i) { return '<span class="' + (c === '1' ? 'is-on' : '') + '"><em>' + (i === 0 ? '−' : '') + Math.pow(2, nn - 1 - i) + '</em><b>' + c + '</b></span>'; }).join('') + '</div>'; }
      if (v.k === 'col') return colTable(v);
      return '';
    }
    function formsH(p) {
      var n = S.n, x = N$.value(p), xi = p.neg ? -p.ip : p.ip, h = '<table class="sl6-nu-ft"><thead><tr><th>' + esc(t.th.f) + '</th><th>' + esc(fill(t.th.v, { n: n })) + '</th><th>' + esc(fill(t.th.r, { n: n })) + '</th></tr></thead><tbody>';
      var fr2 = p.frac ? N$.fraccion(p.fn, p.fd, 2, 16) : null;
      var fr = function (b, base, k) { if (!p.frac) return ''; var f = N$.fraccion(p.fn, p.fd, base, k); return sep() + f.dig + (f.exact ? '' : '…'); };
      var sg = p.neg ? '−' : '';
      h += '<tr><th>' + esc(t.decimal) + '</th><td><b>' + esc(sg + p.ip + (p.frac ? sep() + decFrac(p) : '')) + '</b></td><td></td></tr>';
      [[2, 16], [8, 6], [16, 5]].forEach(function (z) {
        var d = N$.entera(p.ip, z[0]).dig, s = (z[0] === 2 ? g4(d) : d) + fr(d, z[0], z[1]);
        h += '<tr><th>' + esc(t.base[z[0]]) + '</th><td><b>' + esc(sg + s) + '</b><sub>' + z[0] + '</sub>' + (p.neg ? '<small>' + esc(t.minus) + '</small>' : '') + (z[0] === 2 && fr2 && !fr2.exact ? '<small>' + esc(fill(t.per, { p: fr2.dig.slice(fr2.per, fr2.per + fr2.perLen) })) + '</small>' : '') + '</td><td>' + (z[0] === 2 ? '0 … ' + (Math.pow(2, n) - 1) : '') + '</td></tr>';
      });
      ['sm', 'c1', 'c2', 'exc'].forEach(function (k) {
        var r = N$.rng(k, n), b = p.frac ? null : N$.ENC[k](xi, n);
        h += '<tr' + (b ? '' : ' class="is-x"') + '><th>' + esc(kname(k)) + '</th><td>' + (p.frac ? '<em>' + esc(t.onlyInt) + '</em>' : b ? '<b>' + g4(b) + '</b>' + (k !== 'exc' || n <= 16 ? ' <span class="sl6-nu-hx">0x' + parseInt(b, 2).toString(16).toUpperCase().padStart(n / 4, '0') + '</span>' : '') : '<em>' + esc(t.noFit) + '</em>') + '</td><td>' + minus(r[0]) + ' … ' + r[1] + '</td></tr>';
      });
      return h + '</tbody></table>';
    }
    function decFrac(p) { var s = '', fn = p.fn, k = 0; while (fn > 0n && k < 12) { fn *= 10n; s += (fn / p.fd).toString(); fn %= p.fd; k++; } return s + (fn > 0n ? '…' : ''); }
    function opForms(o) {
      var n = o.n, rows = [['A', o.x, o.A], ['B', o.y, o.B]];
      if (o.Bop !== o.B) rows.push([o.kind === 'c2' ? 'C2(B)' : 'C1(B)', -o.y, o.Bop]);
      rows.push([L === 'es' ? 'resultado' : 'result', o.ovf ? null : o.val, o.r]);
      return '<table class="sl6-nu-ft"><thead><tr><th></th><th>' + esc(kname(o.kind)) + '</th><th>decimal</th></tr></thead><tbody>' + rows.map(function (r, i) { return '<tr' + (i === rows.length - 1 && o.ovf ? ' class="is-x"' : '') + '><th>' + esc(r[0]) + '</th><td><b>' + g4(r[2]) + '</b></td><td>' + (r[1] === null ? '<em>' + esc(L === 'es' ? 'desborda' : 'overflow') + ' (' + minus(o.val) + ' ≠ ' + minus(o.real) + ')</em>' : minus(r[1])) + '</td></tr>'; }).join('') + '</tbody></table>';
    }
    function card(k) {
      var c = q('.sl6-nu-card'), vv = q('.sl6-nu-vis');
      if (!ST.length) { c.innerHTML = '<p class="sl6-co-0">' + esc(t.start) + '</p>'; vv.innerHTML = ''; return; }
      if (k < 0) { c.innerHTML = '<p class="sl6-co-0">' + esc(t.start) + '</p>'; vv.innerHTML = vis(ST[ST.length - 1].v.k === 'col' ? { k: 'col', o: ST[ST.length - 1].v.o, upto: -1 } : null); return; }
      c.innerHTML = '<ol class="sl6-co-ex" start="' + (k + 1) + '"><li' + (ST[k].bad ? ' class="is-bad"' : '') + '>' + ST[k].h + '</li></ol>' + (k > 0 ? '<details class="sl6-in"><summary>' + esc(L === 'es' ? 'Pasos anteriores' : 'Previous steps') + '</summary><ol class="sl6-co-ex">' + ST.slice(0, k).map(function (s) { return '<li>' + s.h + '</li>'; }).join('') + '</ol></details>' : '');
      vv.innerHTML = vis(ST[k].v);
    }
    K.N = function () { return ST.length; };
    K.draw = function (k, going) { cur = going ? k : -1; card(cur); };
    var PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('[data-mo]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mo') === S.mo)); });
      [].forEach.call(K.qa('[data-n]'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-n') === S.n)); });
      [].forEach.call(K.qa('[data-r]'), function (b) { if (b.closest('.sl6-reto')) return; b.setAttribute('aria-pressed', String(b.getAttribute('data-r') === S.r)); });
      q('.sl6-nu-rs').classList.toggle('is-off', S.mo === 'one'); q('.sl6-nu-bw').hidden = S.mo === 'one'; q('.sl6-nu-la').textContent = S.mo === 'one' ? t.a : t.a2;
      q('.sl6-nu-fh').textContent = '── ' + (S.mo === 'one' ? t.forms : t.col);
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">' + esc(t.oB) + '</span> <b>' + S.n + '</b>' + (S.mo === 'one' ? ' ' + esc(S.a) : ' <span class="o">--' + S.r + '</span> ' + esc(S.a + (S.mo === 'add' ? ' + ' : ' - ') + S.b));
    }
    function update() {
      S.a = aIn.value.trim(); S.b = bIn.value.trim(); sync();
      var pa = N$.parse(S.a), pb = S.mo === 'one' ? null : N$.parse(S.b), h = q('.sl6-nu-h');
      aIn.classList.toggle('is-bad', !pa); bIn.classList.toggle('is-bad', S.mo !== 'one' && !pb);
      ST = [];
      if (!pa || (S.mo !== 'one' && !pb)) { h.textContent = t.bad; h.classList.add('is-bad'); q('.sl6-nu-forms').innerHTML = ''; }
      else if (S.mo !== 'one' && (pa.frac || pb.frac)) { h.textContent = t.intOnly; h.classList.add('is-bad'); q('.sl6-nu-forms').innerHTML = ''; }
      else {
        h.textContent = t.inH; h.classList.remove('is-bad');
        if (S.mo === 'one') { ST = stepsOne(pa, S.n); q('.sl6-nu-forms').innerHTML = formsH(pa); }
        else {
          var x = pa.neg ? -pa.ip : pa.ip, y = pb.neg ? -pb.ip : pb.ip, o = N$.op(x, y, S.mo === 'sub', S.r, S.n);
          if (o.err) { var r = N$.rng(S.r, S.n); h.textContent = fill(T.noFit, { x: minus(o.err === 'A' ? x : y), n: S.n, k: kname(S.r), lo: minus(r[0]), hi: r[1] }); h.classList.add('is-bad'); q('.sl6-nu-forms').innerHTML = ''; }
          else { ST = stepsOp(o); q('.sl6-nu-forms').innerHTML = opForms(o); }
        }
      }
      PL.reset(); K6.store(KEY, enc()); K6.keepHash(enc());
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-mo],[data-n],[data-r],[data-a]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-mo')) S.mo = b.getAttribute('data-mo');
      else if (b.hasAttribute('data-n')) S.n = +b.getAttribute('data-n');
      else if (b.hasAttribute('data-r')) S.r = b.getAttribute('data-r');
      else { var a = b.getAttribute('data-a'); if (a === 'share') K6.share(K, b, enc()); else if (a === 'theme') K6.toggleTheme(K); return; }
      S.ex = ''; q('.sl6-sel').value = ''; update();
    });
    [aIn, bIn].forEach(function (x) { x.addEventListener('input', function () { S.ex = ''; q('.sl6-sel').value = ''; update(); }); });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.mo = x.mo; S.n = x.n_; if (x.r) S.r = x.r; aIn.value = x.a; bIn.value = x.b || ''; update();
    });
    q('.sl6-sel').value = S.ex;
    // reto
    var RT = null;
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function retoNew() {
      var n = 8, k = Math.random(), box = q('.sl6-reto'), h = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p>';
      if (k < .3) { var kk = ['sm', 'c1', 'c2', 'c2'][rnd(0, 3)], x = rnd(-127, 127); RT = { m: 'to', k: kk, x: x, n: n, want: N$.ENC[kk](x, n) }; h += '<p class="sl6-rd-q">' + esc(fill(t.rTo, { x: minus(x), k: kname(kk), n: n })) + '</p>' + ans(t.ansB); }
      else if (k < .55) { var k2 = ['sm', 'c1', 'c2', 'c2'][rnd(0, 3)], x2 = rnd(-127, 127), b2 = N$.ENC[k2](x2, n); RT = { m: 'from', k: k2, b: b2, x: N$.VAL[k2](b2), n: n }; h += '<p class="sl6-rd-q">' + esc(fill(t.rFrom, { b: g4(b2), k: kname(k2) })) + '</p>' + ans(t.ansD); }
      else if (k < .7) { var x3 = rnd(20, 4095); RT = { m: 'hex', x: x3, want: x3.toString(16).toUpperCase() }; h += '<p class="sl6-rd-q">' + esc(fill(t.rHex, { x: x3 })) + '</p>' + ans(t.ansH); }
      else { var k4 = Math.random() < .7 ? 'c2' : 'c1', a = rnd(-100, 120), bb = rnd(-100, 120), o = N$.op(a, bb, false, k4, n); RT = { m: 'op', k: k4, a: a, b: bb, o: o, n: n }; h += '<p class="sl6-rd-q">' + esc(fill(t.rOp, { k: kname(k4), n: n, a: minus(a), b: minus(bb) })) + '</p><div class="sl6-pp-rq"><label><span>' + esc(t.ansB) + '</span><input type="text" data-rq="a" spellcheck="false" autocomplete="off" style="max-width:220px"></label><label><span>' + esc(t.ovfQ) + '</span><select class="sl6-rd-rs" data-rq="o" style="max-width:120px"><option value="">·</option><option value="1">' + esc(t.yes) + '</option><option value="0">' + esc(t.no) + '</option></select></label></div>'; }
      h += '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-rr="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-rr="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      box.innerHTML = h;
    }
    function ans(l) { return '<div class="sl6-pp-rq"><label><span>' + esc(l) + '</span><input type="text" data-rq="a" spellcheck="false" autocomplete="off" style="max-width:220px"></label></div>'; }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rr]'); if (!b) return; var a = b.getAttribute('data-rr');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var i = q('[data-rq="a"]'), v = i.value.replace(/\s+/g, ''), ok;
        if (RT.m === 'to') ok = v === RT.want;
        else if (RT.m === 'from') ok = v.replace('−', '-') === String(RT.x);
        else if (RT.m === 'hex') ok = v.replace(/^0x/i, '').replace(/^0+(?=.)/, '').toUpperCase() === RT.want;
        else { var o = q('[data-rq="o"]'), okb = v === RT.o.r, oko = o.value === (RT.o.ovf ? '1' : '0'); o.classList.toggle('is-ok', oko); o.classList.toggle('is-bad', !oko); ok = okb && oko; i.classList.toggle('is-ok', okb); i.classList.toggle('is-bad', !okb); }
        if (RT.m !== 'op') { i.classList.toggle('is-ok', ok); i.classList.toggle('is-bad', !ok); }
        q('.sl6-reto__msg').innerHTML = ok ? '<b>' + esc(t.allOk) + '</b>' : esc(t.bad2);
      } else if (a === 'sol') {
        S.ex = ''; q('.sl6-sel').value = '';
        if (RT.m === 'op') { S.mo = 'add'; S.n = RT.n; S.r = RT.k; aIn.value = String(RT.a); bIn.value = String(RT.b); }
        else { S.mo = 'one'; S.n = RT.n || 8; aIn.value = String(RT.x); }
        update(); PL.stop(); K.el.classList.add('is-going'); PL.going = true; PL.k = ST.length - 1; PL.draw();
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    update(); retoNew();
  }
  K6.boot('.sl-sim[data-sim="numero"]', init);
})();
