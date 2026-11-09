/* SergioLearns — interfaz de Hamming en vivo (.sl-sim[data-sim="hamming"]). Necesita kit.js y hamming/engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, H$ = window.SLHam;
  var EX = {
    es: [
      { k: 'mando', n: 'El mando de la tele: el 5 = 0101 y el sol en el bit 5 (tema 7)', m: 'e', par: 1, v: '0101', f: [5] },
      { k: 'exa', n: '0110101 con paridad impar (cuestión tipo examen)', m: 'c', par: 0, v: '0110101' },
      { k: 'bien', n: 'Llega bien: 0101101', m: 'c', par: 1, v: '0101101' },
      { k: 'dos', n: 'Dos bits cambiados: Hamming corrige mal', m: 'e', par: 1, v: '0101', f: [2, 6] },
      { k: 'h15', n: 'Hamming (15,11) (ejercicios, nivel 3)', m: 'e', par: 1, v: '10110011101', f: [9] }
    ],
    en: [
      { k: 'mando', n: 'The TV remote: 5 = 0101 and the sun on bit 5 (topic 7)', m: 'e', par: 1, v: '0101', f: [5] },
      { k: 'exa', n: '0110101 with odd parity (exam-style question)', m: 'c', par: 0, v: '0110101' },
      { k: 'bien', n: 'It arrives fine: 0101101', m: 'c', par: 1, v: '0101101' },
      { k: 'dos', n: 'Two bits flipped: Hamming miscorrects', m: 'e', par: 1, v: '0101', f: [2, 6] },
      { k: 'h15', n: 'Hamming (15,11) (exercises, level 3)', m: 'e', par: 1, v: '10110011101', f: [9] }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'hamming',
      mL: 'Qué hacer', m: { e: 'Codificar y enviar', c: 'Comprobar lo que llega' }, pL: 'Paridad', p: { 1: 'Par', 0: 'Impar' },
      ex: 'Ejemplo', share: 'Compartir', inE: 'Bits de información (d_k … d1)', inC: 'Palabra recibida (de la posición n a la 1)', inH: 'Solo ceros y unos, hasta 26 bits de información. El bit de la derecha es d1 (o la posición 1).', bad: 'Solo ceros y unos, de 1 a 26 bits.', badC: 'Solo ceros y unos, de 3 a 31 bits.',
      sent: 'lo que se envía', got: 'lo que llega', tapHint: 'Toca un bit de lo que llega para cambiarlo, como el sol en la ventana. Con un error, Hamming lo corrige; con dos, se equivoca.', none: 'Llega igual que se envió.',
      steps: 'paso a paso', groups: 'los grupos', start: 'Pulsa Paso para hacerlo como en el papel.',
      th: { g: 'grupo', pos: 'posiciones', bits: 'bits', ones: 'unos', r: 'resultado' }, ok: 'bien', bad2: 'falla', set: '{p} = {v}',
      st: {
        np: 'Con {k} bits de información hacen falta {p} de paridad: es el menor p con 2^p ≥ {k} + p + 1 ({x} ≥ {y}). En total, n = {n} bits.',
        place: 'Los bits de paridad van en las posiciones que son potencia de 2 ({pp}); la información, en las demás: {list}.',
        grp: '{pn} (posición {p}) vigila las posiciones que tienen ese 1 en binario: {pos}. Sus bits de información tienen {u} unos → {pn} = {v} para que el grupo quede con un número {pt} de unos.', par: 'par', impar: 'impar',
        send: 'Se envía: {w}.', recv: 'Llega: {w}{f}.', flip: ' (cambiado el bit {list})',
        chk: 'Grupo de {pn} ({pos}): {u} unos → {r}.', chkOk: 'número {pt}: bien', chkBad: 'tendría que ser {pt}: falla',
        syn: 'Se suman las posiciones de los grupos que fallan: {sum} = {s}.', syn0: 'Ningún grupo falla: la palabra llega bien (o con un error que no se ve).',
        fix: 'El bit erróneo es el de la posición {s} ({nm}): se cambia → {w}.', out: 'La suma ({s}) no es ninguna posición: hay más de un error y no se puede corregir.',
        data: 'Información (las posiciones que no son potencia de 2): {d}.', two: 'Ojo: se cambiaron {k} bits. Hamming solo corrige uno: el síndrome apunta al bit {s}, que estaba bien, y la información sale mal ({d} en lugar de {ok}).', twoOk: 'Ojo: se cambiaron {k} bits; aquí la información sale bien de casualidad, pero Hamming solo garantiza corregir uno.'
      },
      rules: 'Hamming de los apuntes: la palabra se escribe de la posición n a la 1, los bits de paridad (coral) van en las potencias de 2 y cada uno vigila las posiciones con ese 1 en binario; la información (violeta) va en las demás, con d1 en la posición 3. Detecta y corrige un error (distancia 3). Comprobado con las funciones del tema 7 en 20 000 palabras.',
      reto: 'Reto: Hamming en papel', retoLead: 'Como la cuestión del examen: codifica la información o comprueba una palabra recibida.',
      rE: 'Codifica {d} con Hamming ({n},{k}) y paridad {pt} (los {n} bits, de la posición {n} a la 1):', rC: 'Llega {w} con Hamming (7,4) y paridad {pt}. ¿Qué bit está mal (0 si ninguno) y cuál es la información?',
      ansW: 'palabra', ansS: 'bit erróneo', ansD: 'información',
      allOk: 'Bien. Así se hace en el examen.', bad3: 'No es eso. Lo típico: contar las posiciones desde la izquierda, olvidar el bit de paridad dentro de su grupo al comprobar o leer par donde pone impar.'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'hamming',
      mL: 'What to do', m: { e: 'Encode and send', c: 'Check what arrives' }, pL: 'Parity', p: { 1: 'Even', 0: 'Odd' },
      ex: 'Example', share: 'Share', inE: 'Information bits (d_k … d1)', inC: 'Received word (from position n to 1)', inH: 'Only zeros and ones, up to 26 information bits. The rightmost bit is d1 (or position 1).', bad: 'Only zeros and ones, 1 to 26 bits.', badC: 'Only zeros and ones, 3 to 31 bits.',
      sent: 'what is sent', got: 'what arrives', tapHint: 'Tap a bit of what arrives to flip it, like the sun through the window. With one error, Hamming corrects it; with two, it gets it wrong.', none: 'It arrives exactly as it was sent.',
      steps: 'step by step', groups: 'the groups', start: 'Press Step to do it as on paper.',
      th: { g: 'group', pos: 'positions', bits: 'bits', ones: 'ones', r: 'result' }, ok: 'fine', bad2: 'fails', set: '{p} = {v}',
      st: {
        np: 'With {k} information bits, {p} parity bits are needed: the smallest p with 2^p ≥ {k} + p + 1 ({x} ≥ {y}). In total, n = {n} bits.',
        place: 'The parity bits go in the positions that are powers of 2 ({pp}); the information, in the rest: {list}.',
        grp: '{pn} (position {p}) watches the positions with that 1 in binary: {pos}. Its information bits have {u} ones → {pn} = {v} so the group ends with an {pt} number of ones.', par: 'even', impar: 'odd',
        send: 'Sent: {w}.', recv: 'Received: {w}{f}.', flip: ' (bit {list} flipped)',
        chk: 'Group of {pn} ({pos}): {u} ones → {r}.', chkOk: '{pt} number: fine', chkBad: 'it should be {pt}: fails',
        syn: 'Add the positions of the groups that fail: {sum} = {s}.', syn0: 'No group fails: the word arrived fine (or with an error that cannot be seen).',
        fix: 'The wrong bit is at position {s} ({nm}): flip it → {w}.', out: 'The sum ({s}) is not a position: there is more than one error and it cannot be corrected.',
        data: 'Information (the positions that are not powers of 2): {d}.', two: 'Note: {k} bits were flipped. Hamming only corrects one: the syndrome points to bit {s}, which was fine, and the information comes out wrong ({d} instead of {ok}).', twoOk: 'Note: {k} bits were flipped; here the information happens to come out right, but Hamming only guarantees correcting one.'
      },
      rules: 'Hamming as in the course notes: the word is written from position n to 1, the parity bits (coral) go in the powers of 2 and each one watches the positions with that 1 in binary; the information (violet) goes in the rest, with d1 at position 3. It detects and corrects one error (distance 3). Checked against the topic 7 functions on 20,000 words.',
      reto: 'Challenge: Hamming on paper', retoLead: 'Like the exam question: encode the information or check a received word.',
      rE: 'Encode {d} with Hamming ({n},{k}) and {pt} parity (the {n} bits, from position {n} to 1):', rC: '{w} arrives with Hamming (7,4) and {pt} parity. Which bit is wrong (0 if none) and what is the information?',
      ansW: 'word', ansS: 'wrong bit', ansD: 'information',
      allOk: 'Correct. That is how it is done in the exam.', bad3: 'Not quite. The usual slips: counting positions from the left, forgetting the parity bit inside its group when checking, or reading even where it says odd.'
    }
  };
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, exs = EX[L], T = t.st;
    K.title = t.title;
    var S = { m: 'e', par: 1, v: '0101', f: [5], ex: 'mando' }, ST = [], E = null, C = null, cur = -1;
    var KEY = 'sl_sim_hamming_' + (document.documentElement.lang || '').slice(0, 2);
    (function () {
      var s = K6.hashState() || K6.store(KEY); if (!s) return;
      try { var o = JSON.parse(s); S.m = o.m === 'c' ? 'c' : 'e'; S.par = o.par === 0 ? 0 : 1; S.v = String(o.v || '').slice(0, 31); S.f = (o.f || []).filter(function (x) { return x > 0 && x < 32; }).slice(0, 4); S.ex = o.ex || ''; } catch (e) {}
    })();
    var enc = function () { return JSON.stringify({ m: S.m, par: S.par, v: S.v, f: S.f, ex: S.ex }); };
    var seg = function (attr, lab, items) { return '<div class="sl6-seg" role="group" aria-label="' + esc(lab) + '"><span class="sl6-seg__l">' + esc(lab) + '</span>' + items.map(function (x) { return '<button type="button" data-' + attr + '="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; };
    var ctl = '<div class="sl6-ctl">' + seg('m', t.mL, [['e', t.m.e], ['c', t.m.c]]) + seg('par', t.pL, [[1, t.p[1]], [0, t.p[0]]])
      + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('') + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── stdin</h3><label class="sl6-lbl sl6-hm-la" for="' + K.id + '-v"></label><input type="text" id="' + K.id + '-v" class="sl6-hm-v sl6-wide" spellcheck="false" autocomplete="off" inputmode="numeric"><p class="sl6-help sl6-hm-h">' + esc(t.inH) + '</p>'
      + '<div class="sl6-hm-sent"></div><div class="sl6-hm-got"></div></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-hm-card"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.groups) + '</h3><div class="sl6-res sl6-hm-g"></div></section>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var vIn = q('.sl6-hm-v'); vIn.value = S.v;
    function pt() { return S.par ? T.par : T.impar; }
    /* una palabra de n a 1: posiciones (y su binario) encima y nombres debajo */
    function wordH(w, o) {
      o = o || {}; var n = w.length, nb = n.toString(2).length;
      return '<div class="sl6-hm-w' + (o.click ? ' is-click' : '') + '">' + w.split('').map(function (c, j) {
        var i = n - j, cls = H$.isP(i) ? 'is-p' : 'is-d';
        if (o.err && o.err.indexOf(i) >= 0) cls += ' is-err'; if (o.hl && o.hl.indexOf(i) >= 0) cls += ' is-hl'; if (o.dim && o.hl && o.hl.indexOf(i) < 0) cls += ' is-dim'; if (o.fix === i) cls += ' is-fix';
        var tag = o.click ? 'button type="button" data-flip="' + i + '"' : 'span';
        return '<' + tag + ' class="sl6-hm-c ' + cls + '"><small>' + i + '<em>' + i.toString(2).padStart(nb, '0') + '</em></small><b>' + c + '</b><i>' + H$.name(i, n) + '</i></' + (o.click ? 'button' : 'span') + '>';
      }).join('') + '</div>';
    }
    function build() {
      var out = [];
      if (S.m === 'e') {
        var k = S.v.length, n = E.n, p = n - k;
        out.push({ h: fill(T.np, { k: k, p: p, x: Math.pow(2, p), y: k + p + 1, n: n }), v: { w: wordFill(E.w, []), hl: [] } });
        var dp = H$.dataPos(n);
        out.push({ h: fill(T.place, { pp: H$.parPos(n).join(', '), list: dp.map(function (i, j) { return 'd' + (j + 1) + ' → ' + i; }).join(', ') }), v: { w: wordFill(E.w, dp), hl: dp } });
        var known = dp.slice();
        E.groups.forEach(function (g) {
          known.push(g.p);
          out.push({ h: fill(T.grp, { pn: H$.name(g.p, n), p: g.p, pos: g.pos.join(', '), u: g.ones, v: '<b>' + g.bit + '</b>', pt: pt() }), v: { w: wordFill(E.w, known), hl: g.pos.concat([g.p]), dim: true }, g: g.p });
        });
        out.push({ h: fill(T.send, { w: '<b>' + E.w + '</b>' }), v: { w: E.w } });
        if (S.f.length) {
          var r = recv();
          out.push({ h: fill(T.recv, { w: '<b>' + r + '</b>', f: fill(T.flip, { list: S.f.slice().sort(function (a, b) { return a - b; }).join(', ') }) }), v: { w: r, err: S.f } });
          chkSteps(r, out);
        }
      } else chkSteps(S.v, out);
      return out;
    }
    function wordFill(w, known) { var n = w.length; return w.split('').map(function (c, j) { return known.indexOf(n - j) >= 0 ? c : '·'; }).join(''); }
    function recv() { var r = E.w; S.f.forEach(function (f) { if (f <= r.length) r = H$.flip(r, f); }); return r; }
    function chkSteps(w, out) {
      C = H$.chk(w, !!S.par); var n = w.length;
      C.groups.forEach(function (g) {
        out.push({ h: fill(T.chk, { pn: H$.name(g.p, n), pos: g.pos.join(', '), u: g.ones, r: g.bad ? '<b class="is-bad">' + fill(T.chkBad, { pt: pt() }) + '</b>' : fill(T.chkOk, { pt: pt() }) }), v: { w: w, hl: g.pos, dim: true, err: S.m === 'e' ? S.f : null }, cg: g.p, bad: g.bad });
      });
      var fails = C.groups.filter(function (g) { return g.bad; }).map(function (g) { return g.p; });
      if (!C.s) out.push({ h: T.syn0, v: { w: w } });
      else {
        out.push({ h: fill(T.syn, { sum: fails.join(' + '), s: '<b>' + C.s + '</b>' }), v: { w: w, hl: fails, err: S.m === 'e' ? S.f : null } });
        if (C.out) out.push({ h: T.out.replace('{s}', C.s), v: { w: w }, bad: true });
        else out.push({ h: fill(T.fix, { s: C.s, nm: H$.name(C.s, n), w: '<b>' + C.fixed + '</b>' }), v: { w: C.fixed, fix: C.s } });
      }
      out.push({ h: fill(T.data, { d: '<b>' + C.data + '</b>' }), v: { w: C.fixed, hl: H$.dataPos(n) } });
      if (S.m === 'e' && S.f.length > 1) out.push({ h: C.data === S.v ? fill(T.twoOk, { k: S.f.length }) : fill(T.two, { k: S.f.length, s: C.s, d: C.data, ok: S.v }), v: { w: C.fixed, err: S.f }, bad: C.data !== S.v });
    }
    function card(k) {
      var c = q('.sl6-hm-card');
      if (!ST.length) { c.innerHTML = '<p class="sl6-co-0">' + esc(t.start) + '</p>'; return; }
      var n = k < 0 ? 0 : k + 1;
      c.innerHTML = (k < 0 ? '<p class="sl6-co-0">' + esc(t.start) + '</p>' : '<div class="sl6-hm-now">' + wordH(ST[k].v.w, ST[k].v) + '</div>') + '<ol class="sl6-co-ex">' + ST.map(function (s, i) { return '<li class="' + (i < n ? (i === k ? 'is-cur' : '') : 'is-fut') + (s.bad && i < n ? ' is-bad' : '') + '">' + s.h.replace(/(^|[^0-9])1 unos/g, '$11 uno').replace(/(^|[^0-9])1 ones/g, '$11 one') + '</li>'; }).join('') + '</ol>';
      var cl = k >= 0 ? (ST[k].g || ST[k].cg || 0) : 0;
      [].forEach.call(K.qa('.sl6-hm-gr'), function (r) { r.classList.toggle('is-on', +r.getAttribute('data-g') === cl); });
    }
    function groupsH() {
      var h = '', n;
      if (S.m === 'e') {
        n = E.n;
        h += '<table class="sl6-hm-gt"><thead><tr><th>' + esc(t.th.g) + '</th><th>' + esc(t.th.pos) + '</th><th>' + esc(t.th.bits) + '</th><th>' + esc(t.th.ones) + '</th><th>' + esc(t.th.r) + '</th></tr></thead><tbody>' + E.groups.map(function (g) {
          return '<tr class="sl6-hm-gr" data-g="' + g.p + '"><th>' + H$.name(g.p, n) + '</th><td>' + g.pos.join(', ') + '</td><td>' + g.pos.map(function (i) { return E.b[i]; }).join(' ') + '</td><td>' + g.ones + '</td><td><b>' + esc(fill(t.set, { p: H$.name(g.p, n), v: g.bit })) + '</b></td></tr>';
        }).join('') + '</tbody></table>';
      }
      if (C) {
        n = C.n; var w = S.m === 'e' ? recv() : S.v, b = [0].concat(w.split('').reverse().map(Number));
        h += (h ? '<p class="sl6-h sl6-h--2">── ' + esc(t.got) + '</p>' : '') + '<table class="sl6-hm-gt"><thead><tr><th>' + esc(t.th.g) + '</th><th>' + esc(t.th.pos) + '</th><th>' + esc(t.th.bits) + '</th><th>' + esc(t.th.ones) + '</th><th>' + esc(t.th.r) + '</th></tr></thead><tbody>' + C.groups.map(function (g) {
          return '<tr class="sl6-hm-gr' + (g.bad ? ' is-bad' : '') + '" data-g="' + g.p + '"><th>' + H$.name(g.p, n) + '</th><td>' + g.pos.join(', ') + '</td><td>' + g.pos.map(function (i) { return b[i]; }).join(' ') + '</td><td>' + g.ones + '</td><td><b>' + esc(g.bad ? t.bad2 : t.ok) + '</b>' + (g.bad ? ' (+' + g.p + ')' : '') + '</td></tr>';
        }).join('') + '</tbody></table>';
      }
      return h;
    }
    K.N = function () { return ST.length; };
    K.draw = function (k, going) { cur = going ? k : -1; card(cur); };
    var PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('[data-m]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === S.m)); });
      [].forEach.call(K.qa('[data-par]'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-par') === S.par)); });
      q('.sl6-hm-la').textContent = S.m === 'e' ? t.inE : t.inC;
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">--' + (S.par ? (L === 'es' ? 'par' : 'even') : (L === 'es' ? 'impar' : 'odd')) + '</span>' + (S.m === 'c' ? ' <span class="o">--' + (L === 'es' ? 'comprueba' : 'check') + '</span>' : '') + ' <b>' + esc(S.v) + '</b>' + (S.m === 'e' && S.f.length ? ' <span class="o">--' + (L === 'es' ? 'cambia' : 'flip') + '</span> ' + S.f.join(',') : '');
    }
    function update() {
      S.v = vIn.value.replace(/\s+/g, ''); E = null; C = null; ST = [];
      var ok = S.m === 'e' ? /^[01]{1,26}$/.test(S.v) : /^[01]{3,31}$/.test(S.v), h = q('.sl6-hm-h');
      vIn.classList.toggle('is-bad', !ok); sync();
      if (!ok) { h.textContent = S.m === 'e' ? t.bad : t.badC; h.classList.add('is-bad'); q('.sl6-hm-sent').innerHTML = q('.sl6-hm-got').innerHTML = q('.sl6-hm-g').innerHTML = ''; PL.reset(); return; }
      h.textContent = t.inH; h.classList.remove('is-bad');
      if (S.m === 'e') {
        E = H$.enc(S.v, !!S.par); S.f = S.f.filter(function (f) { return f <= E.n; });
        var r = recv();
        q('.sl6-hm-sent').innerHTML = '<p class="sl6-h sl6-h--2">── ' + esc(t.sent) + ' · Hamming (' + E.n + ',' + E.k + ')</p>' + wordH(E.w);
        q('.sl6-hm-got').innerHTML = '<p class="sl6-h sl6-h--2">── ' + esc(t.got) + '</p>' + wordH(r, { click: true, err: S.f }) + '<p class="sl6-help">' + esc(S.f.length ? t.tapHint : t.none + ' ' + t.tapHint) + '</p>';
      } else { q('.sl6-hm-sent').innerHTML = ''; q('.sl6-hm-got').innerHTML = '<p class="sl6-h sl6-h--2">── ' + esc(t.got) + '</p>' + wordH(S.v); }
      ST = build(); q('.sl6-hm-g').innerHTML = groupsH();
      PL.reset(); K6.store(KEY, enc()); K6.keepHash(enc());
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-m],[data-par],[data-a],[data-flip]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-flip')) { var f = +b.getAttribute('data-flip'), i = S.f.indexOf(f); if (i >= 0) S.f.splice(i, 1); else S.f.push(f); S.ex = ''; q('.sl6-sel').value = ''; update(); var nb = q('[data-flip="' + f + '"]'); if (nb) nb.focus(); return; }
      if (b.hasAttribute('data-m')) { var nm = b.getAttribute('data-m'); if (nm !== S.m) { if (nm === 'c' && E) vIn.value = recv(); else if (nm === 'e') { vIn.value = C ? C.data : '0101'; S.f = []; } } S.m = nm; }
      else if (b.hasAttribute('data-par')) S.par = +b.getAttribute('data-par');
      else { var a = b.getAttribute('data-a'); if (a === 'share') K6.share(K, b, enc()); else if (a === 'theme') K6.toggleTheme(K); return; }
      S.ex = ''; q('.sl6-sel').value = ''; update();
    });
    vIn.addEventListener('input', function () { S.ex = ''; q('.sl6-sel').value = ''; update(); });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.m = x.m; S.par = x.par; S.f = (x.f || []).slice(); vIn.value = x.v; update();
    });
    q('.sl6-sel').value = S.ex;
    // reto
    var RT = null;
    function rb(k) { var s = ''; for (var i = 0; i < k; i++) s += Math.random() < .5 ? '0' : '1'; return s; }
    function retoNew() {
      var par = Math.random() < .5, box = q('.sl6-reto'), h = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p>', ptx = par ? T.par : T.impar;
      if (Math.random() < .45) {
        var k = Math.random() < .8 ? 4 : 5, d = rb(k), e = H$.enc(d, par); RT = { m: 'e', d: d, par: par, w: e.w };
        h += '<p class="sl6-rd-q">' + esc(fill(t.rE, { d: d, n: e.n, k: k, pt: ptx })) + '</p><div class="sl6-pp-rq"><label><span>' + esc(t.ansW) + '</span><input type="text" data-rq="w" spellcheck="false" autocomplete="off" inputmode="numeric" style="max-width:220px"></label></div>';
      } else {
        var d2 = rb(4), w = H$.enc(d2, par).w, f = Math.floor(Math.random() * 8); if (f) w = H$.flip(w, f);
        RT = { m: 'c', d: d2, par: par, w: w, s: f };
        h += '<p class="sl6-rd-q">' + esc(fill(t.rC, { w: w, pt: ptx })) + '</p><div class="sl6-pp-rq"><label><span>' + esc(t.ansS) + '</span><input type="text" data-rq="s" inputmode="numeric" autocomplete="off" style="max-width:100px"></label><label><span>' + esc(t.ansD) + '</span><input type="text" data-rq="d" inputmode="numeric" autocomplete="off" style="max-width:140px"></label></div>';
      }
      h += '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-rr="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-rr="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      box.innerHTML = h;
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rr]'); if (!b) return; var a = b.getAttribute('data-rr');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var ok = true, mark = function (sel, good) { var i = q(sel); i.classList.toggle('is-ok', good); i.classList.toggle('is-bad', !good); if (!good) ok = false; };
        if (RT.m === 'e') mark('[data-rq="w"]', q('[data-rq="w"]').value.replace(/\s+/g, '') === RT.w);
        else { mark('[data-rq="s"]', q('[data-rq="s"]').value.trim() === String(RT.s)); mark('[data-rq="d"]', q('[data-rq="d"]').value.replace(/\s+/g, '') === RT.d); }
        q('.sl6-reto__msg').innerHTML = ok ? '<b>' + esc(t.allOk) + '</b>' : esc(t.bad3);
      } else if (a === 'sol') {
        S.ex = ''; q('.sl6-sel').value = ''; S.par = RT.par ? 1 : 0;
        if (RT.m === 'e') { S.m = 'e'; S.f = []; vIn.value = RT.d; } else { S.m = 'c'; vIn.value = RT.w; }
        update(); PL.stop(); K.el.classList.add('is-going'); PL.going = true; PL.k = ST.length - 1; PL.draw();
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    update(); retoNew();
  }
  K6.boot('.sl-sim[data-sim="hamming"]', init);
})();
