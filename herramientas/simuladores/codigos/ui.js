/* SergioLearns — interfaz de los códigos binarios (.sl-sim[data-sim="codigos"]). Necesita kit.js y codigos/engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, C$ = window.SLCod;
  var EX = {
    es: [
      { k: 'micro', n: 'El microondas: 58 + 67 en BCD (tema 6)', tab: 'bcd', op: 'add', a: '58', b: '67' },
      { k: 'exa', n: '86 + 59 en BCD (cuestión tipo examen)', tab: 'bcd', op: 'add', a: '86', b: '59' },
      { k: 'res', n: '742 − 385 con complemento a 10', tab: 'bcd', op: 'sub', a: '742', b: '385' },
      { k: 'resn', n: '385 − 742: sale negativo', tab: 'bcd', op: 'sub', a: '385', b: '742' },
      { k: 'gray', n: 'El mando: de la muesca 7 a la 8 en Gray', tab: 'gray', g: '7', nb: 4 },
      { k: 'txt', n: 'El aviso «Está listo» en UTF-8', tab: 'txt', s: 'Está listo' },
      { k: 'emo', n: 'A, ñ, €, 好 y 🍲: 1, 2, 3, 3 y 4 bytes', tab: 'txt', s: 'Añ€好🍲' }
    ],
    en: [
      { k: 'micro', n: 'The microwave: 58 + 67 in BCD (topic 6)', tab: 'bcd', op: 'add', a: '58', b: '67' },
      { k: 'exa', n: '86 + 59 in BCD (exam-style question)', tab: 'bcd', op: 'add', a: '86', b: '59' },
      { k: 'res', n: '742 − 385 with ten’s complement', tab: 'bcd', op: 'sub', a: '742', b: '385' },
      { k: 'resn', n: '385 − 742: it comes out negative', tab: 'bcd', op: 'sub', a: '385', b: '742' },
      { k: 'gray', n: 'The dial: from notch 7 to 8 in Gray', tab: 'gray', g: '7', nb: 4 },
      { k: 'txt', n: 'The message «Está listo» in UTF-8', tab: 'txt', s: 'Está listo' },
      { k: 'emo', n: 'A, ñ, €, 好 and 🍲: 1, 2, 3, 3 and 4 bytes', tab: 'txt', s: 'Añ€好🍲' }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'codigo',
      tabL: 'Código', tab: { bcd: 'BCD', gray: 'Gray', txt: 'Texto (ASCII y UTF-8)' }, opL: 'Operación', op: { add: 'Suma', sub: 'Resta' }, nbL: 'Bits',
      ex: 'Ejemplo', share: 'Compartir', a: 'A', b: 'B', g: 'Número (decimal o 0b…)', s: 'Texto', hB: 'Enteros sin signo de hasta 8 cifras.', hG: 'De 0 a 2^n − 1.', hS: 'Cualquier texto: letras con tilde, símbolos o emojis.', bad: 'No es válido.',
      steps: 'paso a paso', det: { bcd: 'cifra a cifra', gray: 'la tabla de Gray', txt: 'carácter a carácter' }, start: 'Pulsa Paso para hacerlo como en el papel.',
      th: { carry: 'me llevo', sum: 'suma binaria', fix: 'corrección', dig: 'cifra BCD', ch: 'carácter', cp: 'código', asc: 'ASCII', tpl: 'plantilla UTF-8', u8: 'bytes UTF-8', u16: 'UTF-16', dec: 'decimal', bin: 'binario', gr: 'Gray', ch2: 'bits que cambian' },
      ok: 'vale', tot: 'Bytes: ASCII {a} · UTF-8 {u8} · UTF-16 {u16} · UTF-32 {u32}.', noAscii: '— (no cabe)', moji: 'Si alguien lee estos bytes como Latin-1 (Windows-1252): «{m}».',
      st: {
        c10: 'Restar en BCD es sumar el complemento a 10: C10({b}) = 10^{n} − {b} = {c}.',
        col: 'Cifra {i}: {x} + {y} + {c} = {s} → {b5}. {fx}', fix: '{s} > 9: se suma 0110 (salta las 6 combinaciones que no valen) → {r}; queda la cifra {d} y me llevo {co}.', nofix: 'No pasa de 9: vale tal cual (cifra {d}).',
        endA: 'Resultado: {r} = {v}.', endS: 'El signo es 0 + 1 + acarreo ({c}) = {sg} (el acarreo se descarta): {res}.', pos: 'positivo, el resultado es {v}', neg: 'negativo, el resultado está en C10: {c} → −(10^{n} − {c}) = {v}',
        g0: '{d} en binario de {n} bits: {b}.', g1: 'El primer bit de Gray es el mismo: {x}.', gx: 'Bit {i}: {a} ⊕ {b} (el binario de ese bit y el de su izquierda) = {g}.', gEnd: 'En Gray: {g}. Y de vuelta, cada bit binario es el Gray ⊕ el binario anterior: {b}.', gNext: 'De {d} a {d1}: en binario cambian {kb} bits ({b} → {b1}); en Gray, solo {kg} ({g} → {g1}).',
        t0: '«{c}» es U+{cp} = {d}.', tAsc: ' Cabe en 7 bits: es ASCII ({h}), y en UTF-8 es ese mismo byte.', tU: ' Necesita {nb} bits: va en la plantilla de {n} bytes {tpl}.', tFill: 'Los bits {bits} rellenan las x de la plantilla: {w} → {hx}.'
      },
      rules: 'BCD 8421: cada cifra decimal en 4 bits; al sumar, si una cifra pasa de 9 (o hay acarreo de 4 bits) se suma 0110. La resta suma el complemento a 10. Gray: cada número se diferencia del siguiente en un solo bit. UTF-8: 1 byte para ASCII y 2, 3 o 4 con las plantillas de los apuntes. Comprobado con los simuladores del tema 6 y con Python.',
      reto: 'Reto: los códigos en papel', retoLead: 'Como las cuestiones del examen: suma en BCD, pasa a Gray o escribe un carácter en UTF-8.',
      rB: 'Suma en BCD 8421: {a} + {b} (las cifras de 4 en 4, con el acarreo final si sale):', rG: 'Pasa {b} (binario natural) a Gray:', rGb: 'Pasa {g} (Gray) a binario natural:', rU: '¿Qué bytes guarda UTF-8 para «{c}» (U+{cp})? En hexadecimal, separados por espacios:',
      ans: 'respuesta', allOk: 'Bien.', bad2: 'No es eso. Pulsa «Ver la solución» para verlo paso a paso.'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'code',
      tabL: 'Code', tab: { bcd: 'BCD', gray: 'Gray', txt: 'Text (ASCII and UTF-8)' }, opL: 'Operation', op: { add: 'Add', sub: 'Subtract' }, nbL: 'Bits',
      ex: 'Example', share: 'Share', a: 'A', b: 'B', g: 'Number (decimal or 0b…)', s: 'Text', hB: 'Unsigned integers up to 8 digits.', hG: 'From 0 to 2^n − 1.', hS: 'Any text: accented letters, symbols or emoji.', bad: 'Not valid.',
      steps: 'step by step', det: { bcd: 'digit by digit', gray: 'the Gray table', txt: 'character by character' }, start: 'Press Step to do it as on paper.',
      th: { carry: 'carry', sum: 'binary sum', fix: 'correction', dig: 'BCD digit', ch: 'character', cp: 'code point', asc: 'ASCII', tpl: 'UTF-8 template', u8: 'UTF-8 bytes', u16: 'UTF-16', dec: 'decimal', bin: 'binary', gr: 'Gray', ch2: 'bits that change' },
      ok: 'fine', tot: 'Bytes: ASCII {a} · UTF-8 {u8} · UTF-16 {u16} · UTF-32 {u32}.', noAscii: '— (does not fit)', moji: 'If someone reads these bytes as Latin-1 (Windows-1252): «{m}».',
      st: {
        c10: 'Subtracting in BCD is adding the ten’s complement: C10({b}) = 10^{n} − {b} = {c}.',
        col: 'Digit {i}: {x} + {y} + {c} = {s} → {b5}. {fx}', fix: '{s} > 9: add 0110 (it skips the 6 invalid patterns) → {r}; the digit is {d} and {co} is carried.', nofix: 'Not above 9: it stays as it is (digit {d}).',
        endA: 'Result: {r} = {v}.', endS: 'The sign is 0 + 1 + carry ({c}) = {sg} (the carry is discarded): {res}.', pos: 'positive, the result is {v}', neg: 'negative, the result is in C10: {c} → −(10^{n} − {c}) = {v}',
        g0: '{d} in binary with {n} bits: {b}.', g1: 'The first Gray bit is the same: {x}.', gx: 'Bit {i}: {a} ⊕ {b} (that binary bit and the one on its left) = {g}.', gEnd: 'In Gray: {g}. And back, each binary bit is the Gray bit ⊕ the previous binary bit: {b}.', gNext: 'From {d} to {d1}: in binary {kb} bits change ({b} → {b1}); in Gray, only {kg} ({g} → {g1}).',
        t0: '«{c}» is U+{cp} = {d}.', tAsc: ' It fits in 7 bits: it is ASCII ({h}), and in UTF-8 it is that same byte.', tU: ' It needs {nb} bits: it goes in the {n}-byte template {tpl}.', tFill: 'The bits {bits} fill the x of the template: {w} → {hx}.'
      },
      rules: 'BCD 8421: each decimal digit in 4 bits; when adding, if a digit goes above 9 (or there is a 4-bit carry), 0110 is added. Subtraction adds the ten’s complement. Gray: each number differs from the next in a single bit. UTF-8: 1 byte for ASCII and 2, 3 or 4 with the templates of the course notes. Checked against the topic 6 simulators and Python.',
      reto: 'Challenge: codes on paper', retoLead: 'Like the exam questions: add in BCD, convert to Gray or write a character in UTF-8.',
      rB: 'Add in BCD 8421: {a} + {b} (the digits in groups of 4, with the final carry if there is one):', rG: 'Convert {b} (plain binary) to Gray:', rGb: 'Convert {g} (Gray) to plain binary:', rU: 'Which bytes does UTF-8 store for «{c}» (U+{cp})? In hexadecimal, separated by spaces:',
      ans: 'answer', allOk: 'Correct.', bad2: 'Not quite. Press «See the solution» to follow it step by step.'
    }
  };
  function hx(b) { return b.toString(16).toUpperCase().padStart(2, '0'); }
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, exs = EX[L], T = t.st;
    K.title = t.title;
    var S = { tab: 'bcd', op: 'add', a: '58', b: '67', g: '7', nb: 4, s: 'Está listo', ex: 'micro' }, ST = [];
    var KEY = 'sl_sim_codigos_' + (document.documentElement.lang || '').slice(0, 2);
    (function () {
      var s = K6.hashState() || K6.store(KEY); if (!s) return;
      try { var o = JSON.parse(s); S.tab = ['bcd', 'gray', 'txt'].indexOf(o.tab) >= 0 ? o.tab : 'bcd'; S.op = o.op === 'sub' ? 'sub' : 'add'; S.a = String(o.a || '').slice(0, 8); S.b = String(o.b || '').slice(0, 8); S.g = String(o.g || '').slice(0, 20); S.nb = [3, 4, 5, 8].indexOf(+o.nb) >= 0 ? +o.nb : 4; S.s = String(o.s || '').slice(0, 40); S.ex = o.ex || ''; } catch (e) {}
    })();
    var enc = function () { return JSON.stringify({ tab: S.tab, op: S.op, a: S.a, b: S.b, g: S.g, nb: S.nb, s: S.s, ex: S.ex }); };
    var seg = function (attr, lab, items, cls) { return '<div class="sl6-seg' + (cls || '') + '" role="group" aria-label="' + esc(lab) + '"><span class="sl6-seg__l">' + esc(lab) + '</span>' + items.map(function (x) { return '<button type="button" data-' + attr + '="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; };
    var ctl = '<div class="sl6-ctl">' + seg('tab', t.tabL, [['bcd', t.tab.bcd], ['gray', t.tab.gray], ['txt', t.tab.txt]]) + seg('op', t.opL, [['add', t.op.add], ['sub', t.op.sub]], ' sl6-cd-op') + seg('nb', t.nbL, [[3, '3'], [4, '4'], [5, '5'], [8, '8']], ' sl6-cd-nb')
      + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('') + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── stdin</h3>'
      + '<div class="sl6-nu-in sl6-cd-ib"><label><span class="sl6-lbl">' + esc(t.a) + '</span><input type="text" class="sl6-cd-a sl6-wide" inputmode="numeric" autocomplete="off"></label><label><span class="sl6-lbl">' + esc(t.b) + '</span><input type="text" class="sl6-cd-b sl6-wide" inputmode="numeric" autocomplete="off"></label></div>'
      + '<div class="sl6-cd-ig"><label><span class="sl6-lbl">' + esc(t.g) + '</span><input type="text" class="sl6-cd-g sl6-wide" autocomplete="off"></label></div>'
      + '<div class="sl6-cd-is"><label><span class="sl6-lbl">' + esc(t.s) + '</span><input type="text" class="sl6-cd-s sl6-wide" autocomplete="off" maxlength="40"></label></div>'
      + '<p class="sl6-help sl6-cd-h"></p><div class="sl6-cd-vis"></div></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-cd-card"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h sl6-cd-dh"></h3><div class="sl6-res sl6-cd-det"></div></section>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var aIn = q('.sl6-cd-a'), bIn = q('.sl6-cd-b'), gIn = q('.sl6-cd-g'), sIn = q('.sl6-cd-s');
    aIn.value = S.a; bIn.value = S.b; gIn.value = S.g; sIn.value = S.s;
    /* BCD: tabla de columnas (como colsum() del tema 6), con las columnas hasta upto encendidas */
    function bcdTable(o, upto, sub) {
      var cols = o.cols, n = cols.length, on = function (i) { return n - 1 - i <= upto; }, cur = function (i) { return n - 1 - i === upto; };
      var td = function (i, s) { return '<td class="' + (cur(i) ? 'is-cur' : on(i) ? '' : 'is-fut') + '">' + s + '</td>'; };
      var row = function (lab, first, f, cls) { var h = '<tr' + (cls ? ' class="' + cls + '"' : '') + '><th>' + esc(lab) + '</th><td class="sl6-cd-co">' + first + '</td>'; for (var i = 0; i < n; i++) h += td(i, f(i)); return h + '</tr>'; };
      var fin = upto >= n - 1 ? cols[0].cout : 0;
      var h = '<table class="sl6-cd-t"><tbody>';
      h += row(t.th.carry, fin ? '<b>1</b>' : '', function (i) { return on(i) && cols[i].cin ? '1' : ''; }, 'sl6-cd-cr');
      h += row('A', '', function (i) { return '<code>' + C$.b4(cols[i].x) + '</code><small>' + cols[i].x + '</small>'; });
      h += row(sub ? 'C10(B)' : 'B', '+', function (i) { return '<code>' + C$.b4(cols[i].y) + '</code><small>' + cols[i].y + '</small>'; }, 'sl6-cd-op');
      h += row(t.th.sum, '', function (i) { var c = cols[i]; return on(i) ? '<code>' + (c.s >> 4) + ' ' + C$.b4(c.s & 15) + '</code><small>' + c.s + '</small>' : ''; });
      h += row(t.th.fix, '', function (i) { var c = cols[i]; return on(i) ? (c.fix ? '<code class="is-fix">+0110</code>' : '<em>' + esc(t.ok) + '</em>') : ''; });
      h += row(t.th.dig, fin ? '<code class="is-res">0001</code>' : '', function (i) { var c = cols[i]; return on(i) ? '<code class="is-res">' + C$.b4(c.d) + '</code><small>' + c.d + '</small>' : ''; }, 'sl6-cd-res');
      return h + '</tbody></table>';
    }
    function stepsBcd() {
      var a = S.a, b = S.b, n = Math.max(a.length, b.length), out = [], o, sub = S.op === 'sub', R = null;
      if (sub) { R = C$.resta(a, b, n); o = R.s; out.push({ h: fill(T.c10, { b: b, n: n, c: '<b>' + R.c10 + '</b> = <code>' + C$.bcd(R.c10) + '</code>' }), up: -1 }); }
      else o = C$.suma(a, b, n);
      for (var j = 0; j < n; j++) {
        var c = o.cols[n - 1 - j];
        out.push({ h: fill(T.col, { i: j + 1, x: c.x, y: c.y, c: c.cin, s: c.s, b5: '<code>' + (c.s >> 4) + ' ' + C$.b4(c.s & 15) + '</code>', fx: c.fix ? fill(T.fix, { s: c.s, r: '<code>' + (c.r >> 4) + ' ' + C$.b4(c.r & 15) + '</code>', d: c.d, co: c.cout }) : fill(T.nofix, { d: c.d }) }), up: j });
      }
      if (!sub) out.push({ h: fill(T.endA, { r: '<b>' + (o.cout ? '0001 ' : '') + C$.bcd(o.dig) + '</b>', v: '<b>' + (+(o.cout + o.dig)) + '</b>' }), up: n });
      else out.push({ h: fill(T.endS, { c: o.cout, sg: R.sign, res: R.sign ? fill(T.neg, { c: o.dig, n: n, v: '<b>' + R.val + '</b>' }) : fill(T.pos, { v: '<b>' + R.val + '</b>' }) }), up: n, bad: R.sign === 1 });
      return { st: out, o: o, sub: sub };
    }
    function grayVis(b, g, k) {
      var n = b.length, h = '<div class="sl6-cd-gx">';
      h += '<div class="sl6-cd-gr"><span class="sl6-lbl">' + esc(t.th.bin) + '</span>' + b.split('').map(function (c, i) { return '<i class="' + (k >= i && (i === k || i === k - 1) ? 'is-hl' : '') + '">' + c + '</i>'; }).join('') + '</div>';
      h += '<div class="sl6-cd-gr sl6-cd-xo"><span class="sl6-lbl"></span>' + b.split('').map(function (c, i) { return '<i>' + (i === 0 ? '↓' : '⊕') + '</i>'; }).join('') + '</div>';
      h += '<div class="sl6-cd-gr"><span class="sl6-lbl">' + esc(t.th.gr) + '</span>' + g.split('').map(function (c, i) { return '<i class="is-g' + (i === k ? ' is-cur' : (i > k ? ' is-fut' : '')) + '">' + (i <= k ? c : '·') + '</i>'; }).join('') + '</div>';
      return h + '</div>';
    }
    function stepsGray() {
      var p = /^0b([01]+)$/i.exec(S.g), d = p ? parseInt(p[1], 2) : parseInt(S.g, 10), n = S.nb, b = d.toString(2).padStart(n, '0'), g = C$.aGray(b), out = [];
      out.push({ h: fill(T.g0, { d: d, n: n, b: '<b>' + b + '</b>' }), b: b, g: g, k: -1 });
      out.push({ h: fill(T.g1, { x: b[0] }), b: b, g: g, k: 0 });
      for (var i = 1; i < n; i++) out.push({ h: fill(T.gx, { i: i + 1, a: b[i], b: b[i - 1], g: g[i] }), b: b, g: g, k: i });
      out.push({ h: fill(T.gEnd, { g: '<b>' + g + '</b>', b: '<b>' + C$.deGray(g) + '</b>' }), b: b, g: g, k: n });
      var d1 = (d + 1) % Math.pow(2, n), b1 = d1.toString(2).padStart(n, '0'), g1 = C$.aGray(b1);
      out.push({ h: fill(T.gNext, { d: d, d1: d1, kb: C$.cambios(b, b1), kg: C$.cambios(g, g1), b: b, b1: b1, g: g, g1: g1 }), b: b, g: g, k: n });
      return { st: out, d: d, b: b, g: g };
    }
    function stepsTxt() {
      var out = [], cs = C$.chars(S.s);
      cs.forEach(function (c, i) {
        var u = C$.utf8(c.codePointAt(0)), cp = u.cp.toString(16).toUpperCase().padStart(4, '0');
        out.push({ h: fill(T.t0, { c: c, cp: cp, d: u.cp }) + (u.n === 1 ? fill(T.tAsc, { h: '0x' + hx(u.cp) }) : fill(T.tU, { nb: u.bits.length, n: u.n, tpl: '<code>' + u.tpl + '</code>' })), i: i });
        if (u.n > 1) out.push({ h: fill(T.tFill, { bits: '<code>' + u.bits + '</code>', w: '<code>' + tplH(u) + '</code>', hx: '<b>' + u.bytes.map(hx).join(' ') + '</b>' }), i: i });
      });
      return { st: out, cs: cs };
    }
    function tplH(u) { var k = 0; return u.tpl.split('').map(function (c) { return c === 'x' ? '<span class="is-x">' + u.bits[k++] + '</span>' : c; }).join(''); }
    var R = null, cur = -1;
    function render(k) {
      var vis = q('.sl6-cd-vis'), det = q('.sl6-cd-det'), c = q('.sl6-cd-card');
      if (!R) { vis.innerHTML = det.innerHTML = ''; c.innerHTML = ''; return; }
      var n = k < 0 ? 0 : k + 1;
      c.innerHTML = (k < 0 ? '<p class="sl6-co-0">' + esc(t.start) + '</p>' : '') + '<ol class="sl6-co-ex">' + ST.map(function (s, i) { return '<li class="' + (i < n ? (i === k ? 'is-cur' : '') : 'is-fut') + (s.bad && i < n ? ' is-bad' : '') + '">' + s.h + '</li>'; }).join('') + '</ol>';
      if (S.tab === 'bcd') { vis.innerHTML = bcdTable(R.o, k < 0 ? (ST.length ? ST[ST.length - 1].up : 0) : ST[k].up, R.sub); det.innerHTML = '<p class="sl6-help">A = <code>' + C$.bcd(R.o.a) + '</code> · ' + (R.sub ? 'C10(B)' : 'B') + ' = <code>' + C$.bcd(R.o.b) + '</code></p>'; }
      else if (S.tab === 'gray') {
        var s = k < 0 ? ST[ST.length - 1] : ST[k]; vis.innerHTML = grayVis(s.b, s.g, s.k);
        var nn = S.nb, rows = '', lim = Math.min(Math.pow(2, nn), 32), prevG = null, prevB = null;
        for (var v = 0; v < lim; v++) { var bb = v.toString(2).padStart(nn, '0'), gg = C$.aGray(bb); rows += '<tr' + (v === R.d ? ' class="is-on"' : '') + '><td>' + v + '</td><td><code>' + mark(bb, prevB) + '</code></td><td><code>' + mark(gg, prevG) + '</code></td><td>' + (prevB ? C$.cambios(prevB, bb) + ' / ' + C$.cambios(prevG, gg) : '') + '</td></tr>'; prevB = bb; prevG = gg; }
        det.innerHTML = '<table class="sl6-cd-gt"><thead><tr><th>' + esc(t.th.dec) + '</th><th>' + esc(t.th.bin) + '</th><th>' + esc(t.th.gr) + '</th><th>' + esc(t.th.ch2) + '</th></tr></thead><tbody>' + rows + '</tbody></table>' + (Math.pow(2, nn) > lim ? '<p class="sl6-help">…</p>' : '');
      } else {
        var cs = R.cs, sel = k < 0 ? -1 : ST[k].i, all = [], u8 = 0, u16 = 0, asc = true;
        var rows2 = cs.map(function (ch, i) { var u = C$.utf8(ch.codePointAt(0)); all = all.concat(u.bytes); u8 += u.n; u16 += u.u16; if (u.cp > 127) asc = false; return '<tr' + (i === sel ? ' class="is-on"' : '') + '><td><b class="sl6-cd-ch">' + esc(ch === ' ' ? '␠' : ch) + '</b></td><td>U+' + u.cp.toString(16).toUpperCase().padStart(4, '0') + '</td><td>' + (u.cp < 128 ? '0x' + hx(u.cp) : '<em>—</em>') + '</td><td><code>' + tplH(u) + '</code></td><td><b>' + u.bytes.map(hx).join(' ') + '</b></td><td>' + u.u16 + ' B</td></tr>'; }).join('');
        det.innerHTML = '<table class="sl6-cd-ut"><thead><tr><th>' + esc(t.th.ch) + '</th><th>' + esc(t.th.cp) + '</th><th>' + esc(t.th.asc) + '</th><th>' + esc(t.th.tpl) + '</th><th>' + esc(t.th.u8) + '</th><th>' + esc(t.th.u16) + '</th></tr></thead><tbody>' + rows2 + '</tbody></table>'
          + '<p class="sl6-note">' + esc(fill(t.tot, { a: asc ? cs.length : t.noAscii, u8: u8, u16: u16, u32: 4 * cs.length })) + '</p>' + (asc ? '' : '<p class="sl6-help">' + esc(fill(t.moji, { m: C$.moji(all) })) + '</p>');
        vis.innerHTML = sel >= 0 ? (function () { var u = C$.utf8(cs[sel].codePointAt(0)); return '<p class="sl6-cd-big">' + esc(cs[sel]) + '<span>U+' + u.cp.toString(16).toUpperCase().padStart(4, '0') + '</span></p><p class="sl6-nu-read"><code>' + tplH(u) + '</code></p><p class="sl6-ie-hex">0x<b>' + u.bytes.map(hx).join(' ') + '</b></p>'; })() : '';
      }
    }
    function mark(s, p) { if (!p) return s; return s.split('').map(function (c, i) { return c !== p[i] ? '<span class="is-ch">' + c + '</span>' : c; }).join(''); }
    K.N = function () { return ST.length; };
    K.draw = function (k, going) { cur = going ? k : -1; render(cur); };
    var PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('[data-tab]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tab') === S.tab)); });
      [].forEach.call(K.qa('[data-op]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-op') === S.op)); });
      [].forEach.call(K.qa('[data-nb]'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-nb') === S.nb)); });
      q('.sl6-cd-op').classList.toggle('is-off', S.tab !== 'bcd'); q('.sl6-cd-nb').classList.toggle('is-off', S.tab !== 'gray');
      q('.sl6-cd-ib').hidden = S.tab !== 'bcd'; q('.sl6-cd-ig').hidden = S.tab !== 'gray'; q('.sl6-cd-is').hidden = S.tab !== 'txt';
      q('.sl6-cd-dh').textContent = '── ' + t.det[S.tab];
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">--' + S.tab + '</span> ' + (S.tab === 'bcd' ? esc(S.a + (S.op === 'add' ? ' + ' : ' - ') + S.b) : S.tab === 'gray' ? '<span class="o">--bits</span> <b>' + S.nb + '</b> ' + esc(S.g) : '"' + esc(S.s) + '"');
    }
    function update() {
      S.a = aIn.value.trim(); S.b = bIn.value.trim(); S.g = gIn.value.trim(); S.s = sIn.value; sync();
      var h = q('.sl6-cd-h'), ok; R = null; ST = [];
      if (S.tab === 'bcd') { ok = /^\d{1,8}$/.test(S.a) && /^\d{1,8}$/.test(S.b); aIn.classList.toggle('is-bad', !/^\d{1,8}$/.test(S.a)); bIn.classList.toggle('is-bad', !/^\d{1,8}$/.test(S.b)); h.textContent = ok ? t.hB : t.bad; if (ok) R = stepsBcd(); }
      else if (S.tab === 'gray') { var p = /^0b([01]+)$/i.exec(S.g), d = p ? parseInt(p[1], 2) : (/^\d+$/.test(S.g) ? parseInt(S.g, 10) : -1); ok = d >= 0 && d < Math.pow(2, S.nb); gIn.classList.toggle('is-bad', !ok); h.textContent = ok ? t.hG : t.bad; if (ok) R = stepsGray(); }
      else { ok = S.s.length > 0; h.textContent = t.hS; if (ok) R = stepsTxt(); }
      h.classList.toggle('is-bad', !ok);
      ST = R ? R.st : [];
      PL.reset(); K6.store(KEY, enc()); K6.keepHash(enc());
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab],[data-op],[data-nb],[data-a]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-tab')) S.tab = b.getAttribute('data-tab');
      else if (b.hasAttribute('data-op')) S.op = b.getAttribute('data-op');
      else if (b.hasAttribute('data-nb')) S.nb = +b.getAttribute('data-nb');
      else { var a = b.getAttribute('data-a'); if (a === 'share') K6.share(K, b, enc()); else if (a === 'theme') K6.toggleTheme(K); return; }
      S.ex = ''; q('.sl6-sel').value = ''; update();
    });
    [aIn, bIn, gIn, sIn].forEach(function (x) { x.addEventListener('input', function () { S.ex = ''; q('.sl6-sel').value = ''; update(); }); });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.tab = x.tab; if (x.op) S.op = x.op; if (x.a) { aIn.value = x.a; bIn.value = x.b; } if (x.g) { gIn.value = x.g; S.nb = x.nb; } if (x.s) sIn.value = x.s; update();
    });
    q('.sl6-sel').value = S.ex;
    // reto
    var RT = null;
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function retoNew() {
      var r = Math.random(), box = q('.sl6-reto'), h = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p>', pr;
      if (r < .4) { var a = rnd(15, 99), b = rnd(15, 99), o = C$.suma(String(a), String(b), 2); RT = { m: 'b', a: a, b: b, want: ((o.cout ? '0001' : '') + C$.bcd(o.dig).replace(/ /g, '')) }; pr = fill(t.rB, { a: a, b: b }); }
      else if (r < .65) { var bb = rnd(1, 15).toString(2).padStart(4, '0'); RT = { m: 'g', b: bb, want: C$.aGray(bb) }; pr = fill(t.rG, { b: bb }); }
      else if (r < .8) { var g = rnd(1, 15).toString(2).padStart(4, '0'); RT = { m: 'gb', g: g, want: C$.deGray(g) }; pr = fill(t.rGb, { g: g }); }
      else { var pool = 'ñáéíóúüçÑ€¿¡°ºª§©→♥ΩЖ好€'.split(''), c = pool[rnd(0, pool.length - 1)], u = C$.utf8(c.codePointAt(0)); RT = { m: 'u', c: c, want: u.bytes.map(hx).join('') }; pr = fill(t.rU, { c: c, cp: u.cp.toString(16).toUpperCase().padStart(4, '0') }); }
      h += '<p class="sl6-rd-q">' + esc(pr) + '</p><div class="sl6-pp-rq"><label><span>' + esc(t.ans) + '</span><input type="text" data-rq="a" spellcheck="false" autocomplete="off" style="max-width:260px"></label></div>'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-rr="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-rr="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      box.innerHTML = h;
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rr]'); if (!b) return; var a = b.getAttribute('data-rr');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var i = q('[data-rq="a"]'), v = i.value.replace(/\s+/g, '').replace(/0x/gi, '').toUpperCase(), ok = v === RT.want.toUpperCase() || (RT.m === 'b' && v.replace(/^0+/, '') === RT.want.replace(/^0+/, ''));
        i.classList.toggle('is-ok', ok); i.classList.toggle('is-bad', !ok);
        q('.sl6-reto__msg').innerHTML = ok ? '<b>' + esc(t.allOk) + '</b>' : esc(t.bad2);
      } else if (a === 'sol') {
        S.ex = ''; q('.sl6-sel').value = '';
        if (RT.m === 'b') { S.tab = 'bcd'; S.op = 'add'; aIn.value = String(RT.a); bIn.value = String(RT.b); }
        else if (RT.m === 'g') { S.tab = 'gray'; S.nb = 4; gIn.value = '0b' + RT.b; }
        else if (RT.m === 'gb') { S.tab = 'gray'; S.nb = 4; gIn.value = '0b' + RT.want; }
        else { S.tab = 'txt'; sIn.value = RT.c; }
        update(); PL.stop(); K.el.classList.add('is-going'); PL.going = true; PL.k = ST.length - 1; PL.draw();
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    update(); retoNew();
  }
  K6.boot('.sl-sim[data-sim="codigos"]', init);
})();
