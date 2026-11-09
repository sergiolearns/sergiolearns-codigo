/* SergioLearns — interfaz del explorador IEEE 754 (.sl-sim[data-sim="ieee"]). Necesita kit.js e ieee/engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, F$ = window.SLIeee;
  var FMTS = ['simple', 'doble', 'media', 'viejo'];
  var EX = {
    es: [
      { k: 'vuelta', n: 'La vuelta de 83,375 s (tema 5)', f: 'simple', d: 'e', v: '83,375' },
      { k: 'examen', n: '37,6875 → 4216C000 (cuestión tipo examen)', f: 'simple', d: 'e', v: '37,6875' },
      { k: 'neg', n: 'La diferencia −0,15625 con el récord', f: 'simple', d: 'e', v: '-0,15625' },
      { k: 'p1', n: '0,1 no se puede guardar exacto', f: 'simple', d: 'e', v: '0,1' },
      { k: 'hex', n: 'De vuelta: 42A6C000', f: 'simple', d: 'd', v: '42A6C000' },
      { k: 'den', n: 'Un desnormalizado: 00000001', f: 'simple', d: 'd', v: '00000001' },
      { k: 'inf', n: 'Infinito: 7F800000', f: 'simple', d: 'd', v: '7F800000' },
      { k: 'dob', n: '17,25 en doble precisión', f: 'doble', d: 'e', v: '17,25' },
      { k: 'old', n: 'El cronómetro antiguo de 16 bits (ejercicios, nivel 3)', f: 'viejo', d: 'e', v: '83,375', i: true }
    ],
    en: [
      { k: 'vuelta', n: 'The 83.375 s lap (topic 5)', f: 'simple', d: 'e', v: '83.375' },
      { k: 'examen', n: '37.6875 → 4216C000 (exam-style question)', f: 'simple', d: 'e', v: '37.6875' },
      { k: 'neg', n: 'The −0.15625 gap to the record', f: 'simple', d: 'e', v: '-0.15625' },
      { k: 'p1', n: '0.1 cannot be stored exactly', f: 'simple', d: 'e', v: '0.1' },
      { k: 'hex', n: 'Back again: 42A6C000', f: 'simple', d: 'd', v: '42A6C000' },
      { k: 'den', n: 'A denormal: 00000001', f: 'simple', d: 'd', v: '00000001' },
      { k: 'inf', n: 'Infinity: 7F800000', f: 'simple', d: 'd', v: '7F800000' },
      { k: 'dob', n: '17.25 in double precision', f: 'doble', d: 'e', v: '17.25' },
      { k: 'old', n: 'The old 16-bit stopwatch (exercises, level 3)', f: 'viejo', d: 'e', v: '83.375', i: true }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'ieee754',
      fL: 'Formato', f: { simple: 'Simple (32)', doble: 'Doble (64)', media: 'Media (16)', viejo: 'Antiguo (16)' }, dL: 'Sentido', d: { e: 'Decimal → IEEE', d: 'Hex → decimal' }, iL: 'Bit implícito', i: { 1: 'Con', 0: 'Sin' },
      fN: { simple: 'simple precisión: 1 + 8 + 23 bits, exceso 127', doble: 'doble precisión: 1 + 11 + 52 bits, exceso 1023', media: 'media precisión: 1 + 5 + 10 bits, exceso 15', viejo: 'el cronómetro antiguo de los ejercicios: signo, exponente de 5 bits en exceso 16 y 10 bits de mantisa fraccionaria 0,1xxx (se trunca)' },
      ex: 'Ejemplo', share: 'Compartir', inE: 'Número decimal', inD: 'Palabra en hexadecimal', inH: 'Decimal con coma o punto (37,6875, -0,15625, 1e-40). Toca los bits de la palabra para cambiarlos uno a uno.', bad: 'No es un número válido.', badH: 'Escribe {k} cifras hexadecimales.',
      steps: 'paso a paso', word: 'la palabra', stored: 'lo que se guarda de verdad', start: 'Pulsa Paso para hacerlo como en el papel.',
      fld: { s: 'signo', e: 'exponente', m: 'mantisa' },
      kind: { norm: 'normalizado', den: 'desnormalizado (exponente 000…0: 0,mantisa × 2^{e})', zero: 'cero', inf: 'infinito', nan: 'NaN (no es un número)', over: 'demasiado grande: no cabe', under: 'demasiado pequeño: no cabe' },
      st: {
        s: 'Signo: {x} es {pn} → s = {s}.', pos: 'positivo', neg: 'negativo',
        int: 'Parte entera: {i} en binario es {b} (divisiones sucesivas entre 2).', fr: 'Parte fraccionaria por multiplicaciones sucesivas por 2: {list}{more}.', frNo: 'No hay parte fraccionaria.', frEx: ' (exacta)', frPer: ' (no acaba nunca: hay que redondear)',
        join: 'El número en binario: {b}.',
        norm: 'Normalizar: la coma se mueve {k} posiciones a la {lr} hasta dejar un solo 1 delante: {n} × 2^{e}.', normV: 'Normalizar como 0,1xxx: la coma se mueve hasta justo antes del primer 1: {n} × 2^{e}.', lr: { l: 'izquierda', r: 'derecha' },
        exp: 'Exponente con exceso {b}: {e} + {b} = {v} → {bits} ({nb} bits).', expD: 'Es tan pequeño que no llega al mínimo (2^{min}): se guarda desnormalizado, con el exponente a 0 y la mantisa 0,xxx × 2^{min}.',
        man: 'Mantisa: los {m} bits que van tras la coma (el 1 de delante no se guarda: es implícito): {bits}.', manV: 'Mantisa: {k} bits de 0,{all}{imp}: {bits} (lo que no cabe se trunca).', manVi: ' sin el primer 1 (implícito)', manVn: ' con el primer 1',
        rnd: 'No cabe entero: lo que sobra empieza por {g}… → se redondea al más cercano{up}.', up: ' (sube 1 la última cifra)', stay: ' (se queda igual)', tie: ', y en el empate, al par', carry: ' Al subir, la mantisa se llena y el exponente sube 1.',
        all: 'Se juntan los campos s | e | m: {bits} y por grupos de 4 → {hex}.',
        zero: 'Es el cero: todo a 0 (salvo, si es −0, el signo).', inf: 'Es tan grande que pasa del máximo: se guarda como infinito (exponente todo a 1 y mantisa 0).', underZ: 'Es tan pequeño que ni desnormalizado llega: se redondea a 0.',
        dS: 'Se separan los campos: s = {s} | e = {e} | m = {m}.', dE: 'Exponente: {e} = {v} → quitando el exceso, {v} − {b} = {E}.', dM: 'Mantisa con el 1 implícito: {m}.', dMd: 'Exponente 0: desnormalizado; mantisa 0,{m} y exponente {E}.', dMv: 'Mantisa fraccionaria: {m}.',
        dV: 'Valor: {sg}{m} × 2^{E} = {v}.', dSp: 'Caso especial: {k}.'
      },
      exact: 'Exactamente: ', err: 'Error al guardar {x}: {d} (relativo {r}).', noErr: 'Se guarda sin error.', next: 'El siguiente número representable: {n}. Entre los dos hay un hueco de {g}.', rng: 'Rango: máximo {max}; mínimo normalizado {min}{den}.', rngD: '; mínimo desnormalizado {d}',
      rules: 'Con aritmética exacta: el número se pasa a binario, se normaliza y la mantisa se redondea al más cercano (y en el empate, al par), como hace el procesador. Exponente 0: cero o desnormalizado; exponente todo a 1: infinito o NaN. Comprobado con Python (struct) en 30 000 números.',
      reto: 'Reto: la cuestión del examen', retoLead: 'Como en el examen: pasa el número a IEEE 754 de simple precisión en hexadecimal, o al revés. En papel, y escribe el resultado.',
      rE: 'Pasa {x} a IEEE 754 de simple precisión (8 cifras hexadecimales):', rD: '¿Qué número decimal es {h} en IEEE 754 de simple precisión?', rX: '¿Qué vale el campo de exponente (en decimal, con el exceso 127) de {x}?',
      ansH: 'hexadecimal', ansD: 'decimal', ansE: 'exponente',
      ok: 'Bien. Así se hace en el examen.', bad2: 'No es eso. Lo más común: olvidar sumar 127, meter el 1 implícito en la mantisa o rellenar la mantisa con ceros a la izquierda en vez de a la derecha.'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'ieee754',
      fL: 'Format', f: { simple: 'Single (32)', doble: 'Double (64)', media: 'Half (16)', viejo: 'Old (16)' }, dL: 'Direction', d: { e: 'Decimal → IEEE', d: 'Hex → decimal' }, iL: 'Hidden bit', i: { 1: 'With', 0: 'Without' },
      fN: { simple: 'single precision: 1 + 8 + 23 bits, excess 127', doble: 'double precision: 1 + 11 + 52 bits, excess 1023', media: 'half precision: 1 + 5 + 10 bits, excess 15', viejo: 'the old stopwatch from the exercises: sign, 5-bit exponent in excess 16 and a 10-bit fractional mantissa 0.1xxx (truncated)' },
      ex: 'Example', share: 'Share', inE: 'Decimal number', inD: 'Word in hexadecimal', inH: 'Decimal with a point or comma (37.6875, -0.15625, 1e-40). Tap the bits of the word to flip them one by one.', bad: 'Not a valid number.', badH: 'Type {k} hexadecimal digits.',
      steps: 'step by step', word: 'the word', stored: 'what is really stored', start: 'Press Step to do it as on paper.',
      fld: { s: 'sign', e: 'exponent', m: 'mantissa' },
      kind: { norm: 'normalised', den: 'denormal (exponent 000…0: 0.mantissa × 2^{e})', zero: 'zero', inf: 'infinity', nan: 'NaN (not a number)', over: 'too large: it does not fit', under: 'too small: it does not fit' },
      st: {
        s: 'Sign: {x} is {pn} → s = {s}.', pos: 'positive', neg: 'negative',
        int: 'Integer part: {i} in binary is {b} (successive division by 2).', fr: 'Fractional part by successive multiplication by 2: {list}{more}.', frNo: 'There is no fractional part.', frEx: ' (exact)', frPer: ' (it never ends: it has to be rounded)',
        join: 'The number in binary: {b}.',
        norm: 'Normalise: the point moves {k} places to the {lr} until a single 1 is left in front: {n} × 2^{e}.', normV: 'Normalise as 0.1xxx: the point moves to just before the first 1: {n} × 2^{e}.', lr: { l: 'left', r: 'right' },
        exp: 'Exponent with excess {b}: {e} + {b} = {v} → {bits} ({nb} bits).', expD: 'It is so small that it does not reach the minimum (2^{min}): it is stored as a denormal, with the exponent at 0 and the mantissa 0.xxx × 2^{min}.',
        man: 'Mantissa: the {m} bits after the point (the leading 1 is not stored: it is hidden): {bits}.', manV: 'Mantissa: {k} bits of 0.{all}{imp}: {bits} (what does not fit is truncated).', manVi: ' without the first 1 (hidden)', manVn: ' with the first 1',
        rnd: 'It does not fit: what is left starts with {g}… → rounded to the nearest{up}.', up: ' (the last digit goes up by 1)', stay: ' (it stays)', tie: ', and on a tie, to even', carry: ' Rounding up fills the mantissa and the exponent goes up by 1.',
        all: 'The fields s | e | m are joined: {bits} and in groups of 4 → {hex}.',
        zero: 'It is zero: everything at 0 (except, for −0, the sign).', inf: 'It is so large that it goes past the maximum: it is stored as infinity (exponent all 1s and mantissa 0).', underZ: 'It is so small that not even a denormal reaches it: it rounds to 0.',
        dS: 'The fields are split: s = {s} | e = {e} | m = {m}.', dE: 'Exponent: {e} = {v} → removing the excess, {v} − {b} = {E}.', dM: 'Mantissa with the hidden 1: {m}.', dMd: 'Exponent 0: denormal; mantissa 0.{m} and exponent {E}.', dMv: 'Fractional mantissa: {m}.',
        dV: 'Value: {sg}{m} × 2^{E} = {v}.', dSp: 'Special case: {k}.'
      },
      exact: 'Exactly: ', err: 'Error when storing {x}: {d} (relative {r}).', noErr: 'It is stored with no error.', next: 'The next representable number: {n}. The gap between them is {g}.', rng: 'Range: maximum {max}; smallest normalised {min}{den}.', rngD: '; smallest denormal {d}',
      rules: 'With exact arithmetic: the number is written in binary, normalised and the mantissa rounded to the nearest (and on a tie, to even), as the processor does. Exponent 0: zero or denormal; exponent all 1s: infinity or NaN. Checked against Python (struct) on 30,000 numbers.',
      reto: 'Challenge: the exam question', retoLead: 'As in the exam: convert the number to IEEE 754 single precision in hexadecimal, or the other way round. On paper, and type the result.',
      rE: 'Convert {x} to IEEE 754 single precision (8 hexadecimal digits):', rD: 'What decimal number is {h} in IEEE 754 single precision?', rX: 'What is the exponent field (in decimal, with excess 127) of {x}?',
      ansH: 'hexadecimal', ansD: 'decimal', ansE: 'exponent',
      ok: 'Correct. That is how it is done in the exam.', bad2: 'Not quite. The usual slips: forgetting to add 127, putting the hidden 1 into the mantissa or padding the mantissa with zeros on the left instead of the right.'
    }
  };
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, exs = EX[L], T = t.st, sep = L === 'es' ? ',' : '.';
    K.title = t.title;
    var S = { f: 'simple', d: 'e', v: L === 'es' ? '37,6875' : '37.6875', i: 1, ex: 'examen' }, ST = [], O = null, D = null;
    var KEY = 'sl_sim_ieee_' + (document.documentElement.lang || '').slice(0, 2);
    (function () {
      var s = K6.hashState() || K6.store(KEY); if (!s) return;
      try { var o = JSON.parse(s); S.f = FMTS.indexOf(o.f) >= 0 ? o.f : 'simple'; S.d = o.d === 'd' ? 'd' : 'e'; S.v = String(o.v || '').slice(0, 60); S.i = o.i === 0 ? 0 : 1; S.ex = o.ex || ''; } catch (e) {}
    })();
    var enc = function () { return JSON.stringify({ f: S.f, d: S.d, v: S.v, i: S.i, ex: S.ex }); };
    var seg = function (attr, lab, items, cls) { return '<div class="sl6-seg' + (cls || '') + '" role="group" aria-label="' + esc(lab) + '"><span class="sl6-seg__l">' + esc(lab) + '</span>' + items.map(function (x) { return '<button type="button" data-' + attr + '="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; };
    var ctl = '<div class="sl6-ctl">' + seg('f', t.fL, FMTS.map(function (k) { return [k, t.f[k]]; })) + seg('d', t.dL, [['e', t.d.e], ['d', t.d.d]]) + seg('i', t.iL, [[1, t.i[1]], [0, t.i[0]]], ' sl6-ie-is')
      + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('') + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl + '<p class="sl6-desc sl6-ie-fd"></p>'
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── stdin</h3><label class="sl6-lbl sl6-ie-la" for="' + K.id + '-v"></label><input type="text" id="' + K.id + '-v" class="sl6-ie-v sl6-wide" spellcheck="false" autocomplete="off"><p class="sl6-help sl6-ie-h">' + esc(t.inH) + '</p>'
      + '<h3 class="sl6-h sl6-h--2">── ' + esc(t.word) + '</h3><div class="sl6-ie-w"></div></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-ie-card"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.stored) + '</h3><div class="sl6-ie-val"></div></section>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var vIn = q('.sl6-ie-v'); vIn.value = S.v;
    var impl = function () { return S.f !== 'viejo' || S.i === 1; };
    function dstr(p, q2, neg, maxd) {
      if (p === 0n) return (neg ? '−' : '') + '0';
      var d = F$.dec(p, q2, maxd || 40), s = d.s + (d.fr ? sep + d.fr : '') + (d.cut ? '…' : '');
      if (s.length > 48) {   // en científica: 1,234…×10^k
        var digits = (d.s === '0' ? d.fr.replace(/^0+/, '') : d.s + d.fr), e10 = d.s === '0' ? -(d.fr.length - d.fr.replace(/^0+/, '').length) - 1 : d.s.length - 1;
        s = digits[0] + sep + digits.slice(1, 18) + (d.cut || digits.length > 18 ? '…' : '') + ' × 10^' + e10;
      }
      return (neg ? '−' : '') + s;
    }
    function binS(b, k) { return b.ib + (b.fb ? sep + b.fb.slice(0, k || 40) + (b.fb.length > (k || 40) || !b.exact ? '…' : '') : ''); }
    function wordH(bits, f, hiM) {
      var h = '<div class="sl6-ie-bits" role="group">';
      bits.split('').forEach(function (c, i) {
        var fld = i === 0 ? 's' : (i <= f.e ? 'e' : 'm');
        h += '<button type="button" class="sl6-ie-b is-' + fld + (i && i % 4 === 0 ? ' is-g' : '') + '" data-bit="' + i + '" aria-label="' + esc(t.fld[fld]) + ' ' + c + '">' + c + '</button>';
      });
      return h + '</div>';
    }
    function fieldsH(f, d) {
      var b = d.bits, s = b[0], e = b.slice(1, 1 + f.e), m = b.slice(1 + f.e);
      var ev = parseInt(e, 2), eTxt = f.ieee ? (ev === 0 ? '0 → ' + (d.kind === 'zero' ? t.kind.zero : '2^' + (1 - f.bias)) : ev === Math.pow(2, f.e) - 1 ? ev + ' → ' + (d.kind === 'nan' ? 'NaN' : '∞') : ev + ' − ' + f.bias + ' = ' + (ev - f.bias)) : ev + ' − ' + f.bias + ' = ' + (ev - f.bias);
      var mTxt = f.ieee ? (ev === 0 ? '0' + sep + m.replace(/0+$/, '') : '1' + sep + (m.replace(/0+$/, '') || '0')) : '0' + sep + (impl() ? '1' : '') + m.replace(/0+$/, '');
      return '<div class="sl6-ie-fs"><span class="is-s"><i>' + esc(t.fld.s) + '</i><b>' + s + '</b><em>' + (s === '1' ? '−' : '+') + '</em></span><span class="is-e"><i>' + esc(t.fld.e) + ' · ' + f.e + '</i><b>' + e + '</b><em>' + esc(eTxt) + '</em></span><span class="is-m"><i>' + esc(t.fld.m) + ' · ' + f.m + '</i><b>' + m + '</b><em>' + esc(mTxt.length > 30 ? mTxt.slice(0, 30) + '…' : mTxt) + '</em></span></div>';
    }
    function hexG(h) { return h.replace(/(.{4})(?!$)/g, '$1 '); }
    function stepsE(o) {
      var f = o.f, out = [], xs = (o.neg ? '−' : '') + dstr(o.p, o.q, false, 30);
      out.push(T.s.replace('{x}', xs).replace('{pn}', o.neg ? T.neg : T.pos).replace('{s}', o.s));
      if (o.kind === 'zero' && !o.under) { out.push(T.zero); out.push(fill(T.all, { bits: groupBits(o), hex: '<b>' + hexG(o.hex) + '</b>' })); return out; }
      var b = o.bin, ip = (o.p / o.q).toString();
      out.push(fill(T.int, { i: ip, b: '<b>' + b.ib + '</b>' }));
      if (b.mul.length) {
        var lst = b.mul.slice(0, 8).map(function (m) { return '0' + sep + dstr(m.r, o.q, false, 6).replace(/^0[.,]/, '') + ' × 2 → ' + m.d; }).join('; ');
        out.push(fill(T.fr, { list: lst, more: b.mul.length > 8 ? '; …' : '' }) + (b.exact ? T.frEx : T.frPer));
      } else out.push(T.frNo);
      out.push(fill(T.join, { b: '<b>' + binS(b, 30) + '</b>' }));
      var E = o.E, all = (b.ib + b.fb), lead = all.indexOf('1'), after = all.slice(lead + 1);
      if (!f.ieee) {
        out.push(fill(T.normV, { n: '<b>0' + sep + all.slice(lead, lead + 14) + (after.length > 13 ? '…' : '') + '</b>', e: o.e0 }));
        out.push(fill(T.exp, { e: o.e0, b: f.bias, v: o.ef, bits: '<b>' + o.ef.toString(2).padStart(f.e, '0') + '</b>', nb: f.e }));
        out.push(fill(T.manV, { k: f.m, all: all.slice(lead, lead + 12), imp: impl() ? T.manVi : T.manVn, bits: '<b>' + o.mf.toString(2).padStart(f.m, '0') + '</b>' }));
      } else {
        var k = Math.abs(E), lr = E >= 0 ? 'l' : 'r';
        if (o.kind !== 'den' && !(o.kind === 'zero')) out.push(fill(T.norm, { k: k, lr: T.lr[lr], n: '<b>1' + sep + (after.slice(0, 26) || '0') + (after.length > 26 ? '…' : '') + '</b>', e: E }));
        if (o.kind === 'inf') { out.push(T.inf); }
        else if (o.kind === 'den' || o.kind === 'zero') { out.push(fill(T.expD, { min: 1 - f.bias })); if (o.kind === 'zero') out.push(T.underZ); }
        else out.push(fill(T.exp, { e: o.Eu, b: f.bias, v: o.ef, bits: '<b>' + o.ef.toString(2).padStart(f.e, '0') + '</b>', nb: f.e }));
        if (o.kind === 'norm' || o.kind === 'den') {
          var mb = o.mf.toString(2).padStart(f.m, '0');
          out.push(fill(T.man, { m: f.m, bits: '<b>' + mb + '</b>' }));
          if (o.inexact) {
            var R = o.round, g = (R.R * 2n) / R.den, tie = R.R * 2n === R.den;
            out.push(fill(T.rnd, { g: g.toString(), up: (o.round.up ? T.up : T.stay) + (tie ? T.tie : '') }) + (o.carry ? T.carry : ''));
          }
        }
      }
      out.push(fill(T.all, { bits: groupBits(o), hex: '<b>' + hexG(o.hex) + '</b>' }));
      return out;
    }
    function groupBits(o) { var f = o.f, b = o.bits; return '<code class="sl6-ie-code"><span class="is-s">' + b[0] + '</span> <span class="is-e">' + b.slice(1, 1 + f.e) + '</span> <span class="is-m">' + b.slice(1 + f.e) + '</span></code>'; }
    function stepsD(d) {
      var f = d.f, b = d.bits, e = b.slice(1, 1 + f.e), m = b.slice(1 + f.e), ev = parseInt(e, 2), out = [];
      out.push(fill(T.dS, { s: b[0], e: '<span class="is-e">' + e + '</span>', m: '<span class="is-m">' + m + '</span>' }));
      if (d.kind === 'inf' || d.kind === 'nan' || (d.kind === 'zero')) { out.push(fill(T.dSp, { k: t.kind[d.kind] + (d.kind === 'zero' && b[0] === '1' ? ' (−0)' : '') })); return out; }
      var mm = m.replace(/0+$/, '') || '0';
      if (d.kind === 'den') { out.push(fill(T.dMd, { m: mm, E: 1 - f.bias })); }
      else { out.push(fill(T.dE, { e: e, v: ev, b: f.bias, E: ev - f.bias })); out.push(f.ieee ? fill(T.dM, { m: '1' + sep + mm }) : fill(T.dMv, { m: '0' + sep + (impl() ? '1' : '') + m.replace(/0+$/, '') })); }
      var mt = d.kind === 'den' ? '0' + sep + mm : (f.ieee ? '1' + sep + mm : '0' + sep + (impl() ? '1' : '') + m.replace(/0+$/, ''));
      out.push(fill(T.dV, { sg: b[0] === '1' ? '−' : '', m: mt, E: d.kind === 'den' ? 1 - f.bias : ev - f.bias, v: '<b>' + dstr(d.p, d.q, b[0] === '1') + '</b>' }));
      return out;
    }
    function valH() {
      var f = F$.fmt(S.f), d = D, h = '';
      if (d.kind === 'inf' || d.kind === 'nan') h += '<p class="sl6-ie-big">' + (d.kind === 'inf' ? (d.s ? '−∞' : '+∞') : 'NaN') + ' <span>' + esc(t.kind[d.kind]) + '</span></p>';
      else {
        h += '<p class="sl6-ie-big">' + esc(dstr(d.p, d.q, d.s === 1, 30)) + ' <span>' + esc(fill(t.kind[d.kind] || '', { e: 1 - f.bias })) + '</span></p>';
        h += '<p class="sl6-ie-ex">' + esc(t.exact) + '<code>' + esc(dstr(d.p, d.q, d.s === 1, 120)) + '</code></p>';
        if (O && S.d === 'e') {
          var ep = O.p * d.q, eq = O.q * d.p, sg = O.neg ? -1n : 1n, dn = (d.s ? -1n : 1n) * d.p * O.q - sg * O.p * d.q, dd = d.q * O.q;
          if (dn === 0n || O.kind === 'inf') h += '<p class="sl6-help">' + esc(O.kind === 'inf' ? '' : t.noErr) + '</p>';
          else { var ad = dn < 0n ? -dn : dn, rel = Number(ad * 10n ** 18n / (O.p * d.q)) / 1e18; h += '<p class="sl6-help">' + esc(fill(t.err, { x: (O.neg ? '−' : '') + dstr(O.p, O.q, false, 20), d: (dn < 0n ? '−' : '+') + sci(Number(ad) / Number(dd)), r: sci(rel) })) + '</p>'; }
        }
        if (d.kind !== 'zero' || true) {
          var nx = F$.decode(((d.w !== undefined ? d.w : BigInt('0x' + (O ? O.hex : vIn.value))) + 1n) & ((1n << BigInt(f.n)) - 1n), S.f, impl());
          if (nx.p !== undefined && nx.s === d.s && (nx.kind === 'norm' || nx.kind === 'den')) { var gp = nx.p * d.q - d.p * nx.q, gq = nx.q * d.q; h += '<p class="sl6-help">' + esc(fill(t.next, { n: dstr(nx.p, nx.q, nx.s === 1, 30), g: sci(Number(gp < 0n ? -gp : gp) / Number(gq)) })) + '</p>'; }
        }
      }
      var lim = F$.limits(S.f, impl());
      h += '<p class="sl6-note">' + esc(fill(t.rng, { max: sci(Number(lim.max.p) / Number(lim.max.q)), min: sci(Number(lim.minN.p) / Number(lim.minN.q)), den: lim.minD ? fill(t.rngD, { d: sci(Number(lim.minD.p) / Number(lim.minD.q)) }) : '' })) + '</p>';
      return h;
    }
    function sci(x) { if (!isFinite(x)) return '∞'; if (x === 0) return '0'; var a = Math.abs(x); if (a >= 1e-4 && a < 1e7) return String(+x.toPrecision(8)).replace('.', sep); var e = Math.floor(Math.log10(a)), m = x / Math.pow(10, e); if (Math.abs(m) >= 9.9999995) { m /= 10; e++; } return String(+m.toPrecision(5)).replace('.', sep) + ' × 10^' + e; }
    function card(k) {
      var c = q('.sl6-ie-card');
      if (!ST.length) { c.innerHTML = '<p class="sl6-co-0">' + esc(t.start) + '</p>'; return; }
      var n = k < 0 ? 0 : k + 1;
      c.innerHTML = (k < 0 ? '<p class="sl6-co-0">' + esc(t.start) + '</p>' : '') + '<ol class="sl6-co-ex">' + ST.map(function (s, i) { return '<li class="' + (i < n ? (i === k ? 'is-cur' : '') : 'is-fut') + '">' + s + '</li>'; }).join('') + '</ol>';
    }
    K.N = function () { return ST.length; };
    K.draw = function (k, going) { card(going ? k : -1); };
    var PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('[data-f]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === S.f)); });
      [].forEach.call(K.qa('[data-d]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-d') === S.d)); });
      [].forEach.call(K.qa('[data-i]'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-i') === S.i)); });
      q('.sl6-ie-is').classList.toggle('is-off', S.f !== 'viejo');
      q('.sl6-ie-fd').textContent = t.fN[S.f];
      q('.sl6-ie-la').textContent = S.d === 'e' ? t.inE : t.inD;
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">--' + esc(S.f) + '</span>' + (S.f === 'viejo' && !S.i ? ' <span class="o">--sin-implicito</span>' : '') + (S.d === 'd' ? ' <span class="o">--hex</span>' : '') + ' <b>' + esc(S.v) + '</b>';
    }
    function update() {
      S.v = vIn.value.trim(); sync();
      var f = F$.fmt(S.f), h = q('.sl6-ie-h'); ST = []; O = null; D = null;
      if (S.d === 'e') {
        O = F$.encode(S.v, S.f, impl());
        if (!O) { h.textContent = t.bad; h.classList.add('is-bad'); vIn.classList.add('is-bad'); q('.sl6-ie-w').innerHTML = ''; q('.sl6-ie-val').innerHTML = ''; PL.reset(); return; }
        D = O.back; D.bits = O.bits; D.w = O.w; ST = stepsE(O);
      } else {
        var hx = S.v.replace(/^0x/i, '').replace(/\s+/g, '');
        if (!new RegExp('^[0-9a-f]{' + f.n / 4 + '}$', 'i').test(hx)) { h.textContent = fill(t.badH, { k: f.n / 4 }); h.classList.add('is-bad'); vIn.classList.add('is-bad'); q('.sl6-ie-w').innerHTML = ''; q('.sl6-ie-val').innerHTML = ''; PL.reset(); return; }
        D = F$.decode(hx, S.f, impl()); D.w = BigInt('0x' + hx); D.bits = D.w.toString(2).padStart(f.n, '0'); ST = stepsD(D);
      }
      h.textContent = t.inH; h.classList.remove('is-bad'); vIn.classList.remove('is-bad');
      q('.sl6-ie-w').innerHTML = wordH(D.bits, f) + fieldsH(f, D) + '<p class="sl6-ie-hex">0x<b>' + hexG(D.w.toString(16).toUpperCase().padStart(f.n / 4, '0')) + '</b></p>';
      q('.sl6-ie-val').innerHTML = valH();
      PL.reset(); K6.store(KEY, enc()); K6.keepHash(enc());
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-f],[data-d],[data-i],[data-a],[data-bit]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-bit')) {   // cambiar un bit: se pasa a hex → decimal con la palabra nueva
        var i = +b.getAttribute('data-bit'), f = F$.fmt(S.f), bits = D.bits.split(''); bits[i] = bits[i] === '1' ? '0' : '1';
        S.d = 'd'; vIn.value = BigInt('0b' + bits.join('')).toString(16).toUpperCase().padStart(f.n / 4, '0'); S.ex = ''; q('.sl6-sel').value = ''; update();
        var nb = q('[data-bit="' + i + '"]'); if (nb) nb.focus(); return;
      }
      if (b.hasAttribute('data-f')) { var nf = b.getAttribute('data-f'); if (S.d === 'd' && nf !== S.f) { S.d = 'e'; vIn.value = D && D.p !== undefined && D.kind !== 'inf' ? dstr(D.p, D.q, D.s === 1, 30).replace('…', '') : vIn.value; } S.f = nf; }
      else if (b.hasAttribute('data-d')) { var nd = b.getAttribute('data-d'); if (nd !== S.d && D) { vIn.value = nd === 'd' ? D.w.toString(16).toUpperCase().padStart(F$.fmt(S.f).n / 4, '0') : (D.p !== undefined ? dstr(D.p, D.q, D.s === 1, 30).replace('…', '') : vIn.value); } S.d = nd; }
      else if (b.hasAttribute('data-i')) S.i = +b.getAttribute('data-i');
      else { var a = b.getAttribute('data-a'); if (a === 'share') K6.share(K, b, enc()); else if (a === 'theme') K6.toggleTheme(K); return; }
      S.ex = ''; q('.sl6-sel').value = ''; update();
    });
    vIn.addEventListener('input', function () { S.ex = ''; q('.sl6-sel').value = ''; update(); });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.f = x.f; S.d = x.d; S.i = x.i === false ? 0 : 1; vIn.value = x.v; update();
    });
    q('.sl6-sel').value = S.ex;
    // reto
    var RT = null;
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function nice() { var j = rnd(0, 6), k = rnd(1, 255 * Math.pow(2, Math.min(j, 3))); var v = k / Math.pow(2, j); return (Math.random() < .4 ? -1 : 1) * v; }
    function retoNew() {
      var r = Math.random(), x = nice(), xs = String(x).replace('.', sep).replace('-', '−'), o = F$.encode(String(x), 'simple', true), box = q('.sl6-reto');
      if (r < .45) RT = { m: 'e', x: x, o: o }; else if (r < .8) RT = { m: 'd', x: x, o: o }; else RT = { m: 'x', x: x, o: o };
      var h = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-rd-q">' + esc(RT.m === 'e' ? fill(t.rE, { x: xs }) : RT.m === 'd' ? fill(t.rD, { h: hexG(o.hex) }) : fill(t.rX, { x: xs })) + '</p>'
        + '<div class="sl6-pp-rq"><label><span>' + esc(RT.m === 'e' ? t.ansH : RT.m === 'd' ? t.ansD : t.ansE) + '</span><input type="text" data-rq="a" spellcheck="false" autocomplete="off" style="max-width:220px"></label></div>'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-rr="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-rr="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      box.innerHTML = h;
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rr]'); if (!b) return; var a = b.getAttribute('data-rr');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var i = q('[data-rq="a"]'), v = i.value.replace(/\s+/g, ''), ok;
        if (RT.m === 'e') ok = v.replace(/^0x/i, '').toUpperCase() === RT.o.hex;
        else if (RT.m === 'd') { var p = F$.parse(v); ok = !!p && p.p * BigInt(Math.pow(2, 10)) === BigInt(Math.round(Math.abs(RT.x) * Math.pow(2, 10))) * p.q && p.neg === (RT.x < 0); }
        else ok = v === String(RT.o.ef);
        i.classList.toggle('is-ok', ok); i.classList.toggle('is-bad', !ok);
        q('.sl6-reto__msg').innerHTML = ok ? '<b>' + esc(t.ok) + '</b>' : esc(t.bad2);
      } else if (a === 'sol') {
        S.ex = ''; q('.sl6-sel').value = ''; S.f = 'simple';
        if (RT.m === 'd') { S.d = 'd'; vIn.value = RT.o.hex; } else { S.d = 'e'; vIn.value = String(RT.x).replace('.', sep); }
        update(); PL.stop(); K.el.classList.add('is-going'); PL.going = true; PL.k = ST.length - 1; PL.draw();
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    update(); retoNew();
  }
  K6.boot('.sl-sim[data-sim="ieee"]', init);
})();
