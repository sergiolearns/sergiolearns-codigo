/* SergioLearns — calculadora de notas, interfaz. Monta cada .sl8-app (data-sl8 = {asig, en}).
   Aspecto tinta/claro con localStorage('sl_entorno_tema'), como los entornos y los simuladores. Sin emoticonos. */
(function () {
  'use strict';
  var N = window.SLNotas;
  if (!N) return;
  var store = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ICO = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>'
  };
  var ico = function (n, s) { return '<svg class="sl8-i" width="' + (s || 16) + '" height="' + (s || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[n] + '</svg>'; };

  var T = {
    es: {
      cmd: 'cuanto-necesito', conv: '--convocatoria', obj: '--objetivo',
      convs: { ord: 'ordinaria', ext: 'extraordinaria', esp: 'especial' },
      lConv: 'Convocatoria', lObj: 'Quiero sacar', lNt: 'Teoría', ntModo: { nt: 'Nota de teoría', parciales: 'Por parciales' },
      th: ['Parte', 'Peso', 'Mín.', 'Tu nota'], pend: 'pendiente', ph: 'pendiente', bad: 'Escribe una nota de 0 a 10 (vale 6,5 o 6.5).',
      light: 'Claro', dark: 'Oscuro', borrar: 'Vaciar', blank: 'Deja en blanco lo que aún no tienes.',
      completo: 'nota final', aprobado: 'APROBADO', suspenso: 'SUSPENSO',
      necesitas: function (x, ps) { return 'Necesitas un <b>' + x + '</b> en ' + ps; },
      todas: function (n) { return n > 1 ? ' (la misma nota en las ' + n + ')' : ''; },
      conEso: function (f) { return 'Con eso, tu nota final sería un ' + f + '.'; },
      esMin: function (p, m) { return 'Ojo: ' + p + ' tiene un mínimo de ' + m + '; por debajo, da igual el resto.'; },
      asegurado: function (o, f) { return 'Ya tienes el ' + o + ': aunque saques un 0 en lo que falta, tu nota sería un ' + f + '.'; },
      imposible: function (o, f) { return 'Ni con un 10 en lo que falta llegas al ' + o + ': como mucho, un ' + f + '.'; },
      formula: 'fórmula', reglas: 'reglas aplicadas', y: ' y ',
      notas: {
        min_ok: function () { return 'Se cumplen los mínimos: cuenta la fórmula entera.'; },
        min_no: function (p, m) { return p + ' no llega a ' + m + ': no se cumple su mínimo.'; },
        fp1_sin_l: function (s) { return 'Sin los mínimos, el laboratorio no suma y la nota se queda en 4 como mucho (0,10·FE01a + 0,65·FE01b = ' + s + ').'; },
        max4: function () { return 'Sin los mínimos, la nota se queda en 4 como mucho.'; },
        fp2_l0: function () { return 'El laboratorio no llega a 5: en la ordinaria cuenta como 0.'; },
        fp2_rescate: function (f) { return 'FE01 = (0,20·FE01a + 0,55·FE01b) / 0,75 = ' + f + ', más de 6,5: la nota es como mínimo un 5.'; },
        ic1_guarda: function () { return 'Tienes la teoría aprobada: se guarda para la extraordinaria de este curso.'; },
        ic2_nt: function (v) { return 'NT = 0,4·primer parcial + 0,6·segundo = ' + v + '.'; },
        ic2_una: function (p, v) { return p + ' no llega a 5: la nota final es esa, un ' + v + '.'; },
        ic2_dos: function (v) { return 'NT y NP no llegan a 5: la nota final es la menor, un ' + v + '.'; }
      }
    },
    en: {
      cmd: 'how-much', conv: '--sitting', obj: '--target',
      convs: { ord: 'regular', ext: 'resit', esp: 'special' },
      lConv: 'Sitting', lObj: 'I want', lNt: 'Theory', ntModo: { nt: 'Theory mark', parciales: 'By midterms' },
      th: ['Part', 'Weight', 'Min.', 'Your mark'], pend: 'pending', ph: 'pending', bad: 'Type a mark from 0 to 10 (6.5 or 6,5 both work).',
      light: 'Light', dark: 'Dark', borrar: 'Clear', blank: 'Leave blank what you don\'t have yet.',
      completo: 'final mark', aprobado: 'PASS', suspenso: 'FAIL',
      necesitas: function (x, ps) { return 'You need a <b>' + x + '</b> in ' + ps; },
      todas: function (n) { return n > 1 ? ' (the same mark in all ' + n + ')' : ''; },
      conEso: function (f) { return 'With that, your final mark would be ' + f + '.'; },
      esMin: function (p, m) { return 'Careful: ' + p + ' has a minimum of ' + m + '; below it, the rest doesn\'t matter.'; },
      asegurado: function (o, f) { return 'You already have your ' + o + ': even with a 0 in what\'s left, your mark would be ' + f + '.'; },
      imposible: function (o, f) { return 'Not even a 10 in what\'s left gets you to ' + o + ': ' + f + ' at most.'; },
      formula: 'formula', reglas: 'rules applied', y: ' and ',
      notas: {
        min_ok: function () { return 'The minimums are met: the whole formula counts.'; },
        min_no: function (p, m) { return p + ' is below ' + m + ': its minimum is not met.'; },
        fp1_sin_l: function (s) { return 'Without the minimums, the lab does not count and the mark is capped at 4 (0.10·FE01a + 0.65·FE01b = ' + s + ').'; },
        max4: function () { return 'Without the minimums, the mark is capped at 4.'; },
        fp2_l0: function () { return 'The lab is below 5: in the regular sitting it counts as 0.'; },
        fp2_rescate: function (f) { return 'FE01 = (0.20·FE01a + 0.55·FE01b) / 0.75 = ' + f + ', over 6.5: the mark is at least a 5.'; },
        ic1_guarda: function () { return 'You passed the theory: it is kept for this year\'s resit.'; },
        ic2_nt: function (v) { return 'NT = 0.4·first midterm + 0.6·second = ' + v + '.'; },
        ic2_una: function (p, v) { return p + ' is below 5: that is the final mark, ' + v + '.'; },
        ic2_dos: function (v) { return 'NT and NP are both below 5: the final mark is the lower one, ' + v + '.'; }
      }
    }
  };

  // Nombres de las partes y notas de cada convocatoria (notas.yaml)
  var P = {
    fp1: { a: ['Cuestionarios (FE01a)', 'Quizzes (FE01a)'], b: ['Ejercicios de examen (FE01b)', 'Exam exercises (FE01b)'], l: ['Trabajos de laboratorio (FE02)', 'Lab work (FE02)'] },
    fp2: { a: ['Cuestionarios (FE01a)', 'Quizzes (FE01a)'], b: ['Ejercicios de examen (FE01b)', 'Exam exercises (FE01b)'], l: ['Trabajos de laboratorio (FE02)', 'Lab work (FE02)'] },
    ic1: { t: ['Examen de teoría', 'Theory exam'], p: ['Exámenes de prácticas', 'Lab exams'], c: ['Cuestionarios y participación', 'Quizzes and participation'] },
    ic2: { nt: ['Teoría (NT)', 'Theory (NT)'], p1: ['Primer parcial de teoría', 'First theory midterm'], p2: ['Segundo parcial de teoría', 'Second theory midterm'], np: ['Práctica (NP)', 'Practical (NP)'], ntp: ['Trabajos prácticos (NTP)', 'Practical work (NTP)'], ntpa: ['Participación activa (NTPA)', 'Active participation (NTPA)'] }
  };
  var SUB = {
    fp1: { a: ['media de los cuestionarios', 'average of the quizzes'], b: ['media ponderada de los exámenes', 'weighted average of the exams'], l: ['solo suma con los mínimos', 'only counts with the minimums'] },
    fp2: { a: ['los tres cuestionarios', 'the three quizzes'], b: ['los ejercicios semanales', 'the weekly exercises'] },
    ic1: { p: ['media ponderada', 'weighted average'], c: ['solo en el periodo de clases', 'only during the term'] },
    ic2: { p1: ['40 % de NT', '40% of NT'], p2: ['60 % de NT', '60% of NT'], np: ['examen o parcial de prácticas', 'lab exam or midterm'] }
  };
  var CN = {
    fp1: { ext: ['FE01 sale solo de lo que hagas el día del examen; FE02 sigue siendo el del periodo de clases.', 'FE01 comes only from what you do on exam day; FE02 is still the one from the term.'], esp: ['FE01 sale solo de lo que hagas el día del examen; FE02 sigue siendo el del periodo de clases.', 'FE01 comes only from what you do on exam day; FE02 is still the one from the term.'] },
    fp2: { ord: ['En la ordinaria, el laboratorio por debajo de 5 cuenta como 0.', 'In the regular sitting, a lab mark below 5 counts as 0.'], ext: ['En la extraordinaria, el laboratorio no necesita el 5.', 'In the resit, the lab does not need a 5.'], esp: ['En la especial, el laboratorio no necesita el 5.', 'In the special sitting, the lab does not need a 5.'] },
    ic1: { ext: ['Los cuestionarios son los del periodo de clases.', 'The quizzes are the ones from the term.'], esp: ['En la especial no cuentan los cuestionarios: 60 % teoría y 40 % prácticas.', 'In the special sitting the quizzes do not count: 60% theory and 40% lab.'] },
    ic2: { ord: ['Los parciales de teoría se guardan solo hasta la ordinaria.', 'Theory midterms are only kept until the regular sitting.'], ext: ['Si aprobaste la práctica (NP ≥ 5), se puede guardar para esta convocatoria.', 'If you passed the practical (NP ≥ 5), it can be kept for this sitting.'] }
  };
  var COL = ['#5B4BDB', '#FF6B4A', '#16794B', '#2F5FD0', '#F5A524'];
  var COLD = ['#A99EF5', '#FF9B80', '#5FBF8F', '#9CC3FF', '#F5C06B'];

  function fmt(x, en) { var s = (Math.round(x * 100) / 100).toFixed(2).replace(/\.?0+$/, ''); return en ? s : s.replace('.', ','); }
  function fmt2(x, en) { var s = x.toFixed(2); return en ? s : s.replace('.', ','); }
  var EN = false;
  function pct(p) { return Math.round(p * 1000) / 10 + (EN ? '%' : ' %'); }
  function parse(s) {
    s = String(s || '').trim().replace(',', '.');
    if (s === '') return null;
    if (!/^\d{1,2}(\.\d{0,3})?$/.test(s)) return NaN;
    var v = parseFloat(s);
    return (v >= 0 && v <= 10) ? v : NaN;
  }

  function mount(el) {
    if (el.__sl8) return; el.__sl8 = 1;
    var cfg = {}; try { cfg = JSON.parse(el.getAttribute('data-sl8') || '{}'); } catch (e) { return; }
    var asig = cfg.asig, S = N.asignaturas[asig]; if (!S) return;
    var en = !!cfg.en, t = T[en ? 'en' : 'es'], L = en ? 1 : 0; EN = en;
    var key = 'sl_notas_' + asig, st = { conv: 'ord', obj: 5, modo: 'nt', v: {} };
    try { var sv = JSON.parse(store(key) || 'null'); if (sv && sv.v) st = Object.assign(st, sv); } catch (e) {}
    if (S.conv.indexOf(st.conv) < 0) st.conv = 'ord';
    if ([5, 7, 9].indexOf(+st.obj) < 0) st.obj = 5;
    var save = function () { store(key, JSON.stringify(st)); };

    var root = document.createElement('div');
    root.className = 'sl8-win-wrap';
    el.innerHTML = '';
    el.appendChild(root);
    if (store('sl_entorno_tema') === 'claro') el.classList.add('is-light');
    var name = function (id) { return P[asig][id][L]; };

    function render() {
      var cs = S.campos(st.conv, st.modo);
      var cn = (CN[asig][st.conv] || [])[L];
      var segC = S.conv.map(function (c) { return '<button type="button" data-c="' + c + '" aria-pressed="' + (c === st.conv) + '">' + esc(t.convs[c]) + '</button>'; }).join('');
      var segO = [5, 7, 9].map(function (o) { return '<button type="button" data-o="' + o + '" aria-pressed="' + (o === +st.obj) + '">' + o + '</button>'; }).join('');
      var segN = (asig === 'ic2' && st.conv === 'ord') ? '<div class="sl8-ctl__g"><span class="sl8-lab">' + esc(t.lNt) + '</span><div class="sl8-seg" role="group" aria-label="' + esc(t.lNt) + '">' + ['nt', 'parciales'].map(function (m) { return '<button type="button" data-m="' + m + '" aria-pressed="' + (m === st.modo) + '">' + esc(t.ntModo[m]) + '</button>'; }).join('') + '</div></div>' : '';
      var rows = cs.map(function (c, i) {
        var v = st.v[c.id], sub = SUB[asig][c.id] ? SUB[asig][c.id][L] : '';
        var min = c.min !== undefined && !(c.minOrd && st.conv !== 'ord') ? c.min : '—';
        return '<div class="sl8-row" data-id="' + c.id + '"><span class="sl8-sw" style="--c:' + COL[i % 5] + ';--cd:' + COLD[i % 5] + '"></span>' +
          '<label class="sl8-row__n" for="sl8-' + asig + '-' + c.id + '">' + esc(name(c.id)) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '<small class="sl8-row__pm">' + pct(c.peso) + (min === '—' ? '' : ' · ' + (en ? 'min. ' : 'mín. ') + min) + '</small></label>' +
          '<span class="sl8-row__p" title="' + esc(t.th[1]) + '">' + pct(c.peso) + '</span><span class="sl8-row__m" title="' + esc(t.th[2]) + '">' + (min === '—' ? '—' : '≥ ' + min) + '</span>' +
          '<input class="sl8-row__in" id="sl8-' + asig + '-' + c.id + '" type="text" inputmode="decimal" autocomplete="off" maxlength="5" placeholder="' + esc(t.ph) + '" value="' + esc(v === undefined || v === null ? '' : v) + '"></div>';
      }).join('');
      root.innerHTML =
        '<div class="sl8-win"><div class="sl8-bar"><span class="sl8-dot" aria-hidden="true"></span><span class="sl8-bar__t">sergio@learns: ~/' + esc(asig) + '</span><button type="button" class="sl8-theme"></button></div>' +
        '<div class="sl8-body"><p class="sl8-cmd"><span class="sl8-ps">$</span> <code>' + esc(t.cmd) + ' ' + esc(asig) + ' <span class="sl8-nw"><span class="o">' + t.conv + '</span> <b>' + esc(t.convs[st.conv]) + '</b></span> <span class="sl8-nw"><span class="o">' + t.obj + '</span> <b>' + st.obj + '</b></span></code><i class="sl8-cur" aria-hidden="true">_</i></p>' +
        '<div class="sl8-grid"><div class="sl8-in">' +
        '<div class="sl8-ctl"><div class="sl8-ctl__g"><span class="sl8-lab">' + esc(t.lConv) + '</span><div class="sl8-seg" role="group" aria-label="' + esc(t.lConv) + '">' + segC + '</div></div>' +
        '<div class="sl8-ctl__g"><span class="sl8-lab">' + esc(t.lObj) + '</span><div class="sl8-seg sl8-seg--n" role="group" aria-label="' + esc(t.lObj) + '">' + segO + '</div></div>' + segN + '</div>' +
        (cn ? '<p class="sl8-cn">' + esc(cn) + '</p>' : '') +
        '<div class="sl8-th" aria-hidden="true"><span></span><span>' + t.th[0] + '</span><span>' + t.th[1] + '</span><span>' + t.th[2] + '</span><span>' + t.th[3] + '</span></div>' +
        '<div class="sl8-rows">' + rows + '</div>' +
        '<p class="sl8-foot"><span>' + esc(t.blank) + '</span><button type="button" class="sl8-clear">' + ico('reset', 14) + esc(t.borrar) + '</button></p>' +
        '</div><div class="sl8-out" aria-live="polite"></div></div></div></div>';
      themeBtn();
      calc();
    }

    function themeBtn() {
      var b = root.querySelector('.sl8-theme'), light = el.classList.contains('is-light');
      b.innerHTML = ico(light ? 'moon' : 'sun', 15) + '<span>' + esc(light ? t.dark : t.light) + '</span>';
      b.setAttribute('aria-label', light ? t.dark : t.light);
    }

    function bar(cs, vals, pend, x, res, dark) {
      var W = 600, sc = W / 10, xx = 0, segs = '', pal = dark ? COLD : COL;
      cs.forEach(function (c, i) {
        var v = pend.indexOf(c.id) >= 0 ? x : vals[c.id];
        if (v === null || v === undefined || isNaN(v)) return;
        var w = c.peso * v * sc;
        if (w <= 0) return;
        var hat = pend.indexOf(c.id) >= 0;
        segs += '<rect x="' + xx.toFixed(1) + '" y="14" width="' + w.toFixed(1) + '" height="22" fill="' + (hat ? 'url(#sl8h' + i + ')' : pal[i % 5]) + '"' + (hat ? ' stroke="' + pal[i % 5] + '" stroke-width="1.5"' : '') + '/>';
        xx += w;
      });
      var defs = cs.map(function (c, i) { return '<pattern id="sl8h' + i + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="' + pal[i % 5] + '" opacity=".25"/><rect width="2.5" height="6" fill="' + pal[i % 5] + '" opacity=".8"/></pattern>'; }).join('');
      var o = st.obj * sc, f = res ? res.final * sc : -1;
      var ticks = '';
      for (var k = 0; k <= 10; k++) ticks += '<text x="' + (k * sc).toFixed(1) + '" y="58" text-anchor="' + (k === 0 ? 'start' : k === 10 ? 'end' : 'middle') + '">' + k + '</text>';
      return '<svg class="sl8-svg" viewBox="-2 0 604 64" role="img" aria-label="' + esc((en ? 'Contribution of each part, target ' : 'Lo que aporta cada parte, objetivo ') + st.obj) + '"><defs>' + defs + '</defs>' +
        '<rect class="sl8-svg__bg" x="0" y="14" width="600" height="22" rx="4"/>' + segs +
        '<line class="sl8-svg__o" x1="' + o + '" x2="' + o + '" y1="6" y2="44"/>' +
        (f >= 0 ? '<path class="sl8-svg__f" d="M' + f.toFixed(1) + ' 10l-5-7h10z"/>' : '') + ticks + '</svg>';
    }

    function calc() {
      var cs = S.campos(st.conv, st.modo), vals = {}, bad = false;
      cs.forEach(function (c) {
        var inp = root.querySelector('.sl8-row[data-id="' + c.id + '"] input');
        var v = parse(inp.value);
        inp.classList.toggle('is-bad', v !== null && isNaN(v));
        inp.setAttribute('aria-invalid', v !== null && isNaN(v) ? 'true' : 'false');
        if (v !== null && isNaN(v)) bad = true;
        vals[c.id] = (v === null || isNaN(v)) ? null : v;
      });
      var out = root.querySelector('.sl8-out'), dark = !el.classList.contains('is-light');
      var r = N.necesita(asig, st.conv, st.modo, vals, +st.obj), h = '';
      var res = r.res, x = r.x !== undefined ? r.x : 10;
      var pend = r.pend || [];
      var lista = function (ids) { return ids.map(function (id) { return '<b class="sl8-pn">' + esc(name(id)) + '</b>'; }).reduce(function (a, b, i, arr) { return a + (i === 0 ? '' : i === arr.length - 1 ? t.y : ', ') + b; }, ''); };
      if (bad) h += '<p class="sl8-bad">' + esc(t.bad) + '</p>';
      if (r.estado === 'completo') {
        var ok = res.exacta >= 5 - 1e-9;
        h += '<p class="sl8-big"><span class="sl8-k">' + esc(t.completo) + '</span><strong>' + fmt2(res.final, en) + '</strong><em class="sl8-tag ' + (ok ? 'is-ok' : 'is-no') + '">' + (ok ? t.aprobado : t.suspenso) + '</em></p>';
      } else if (r.estado === 'necesitas') {
        h += '<p class="sl8-big sl8-big--need"><span class="sl8-k">' + esc(en ? 'you need' : 'te hace falta') + '</span><strong>' + fmt2(x, en) + '</strong></p>';
        h += '<p class="sl8-msg">' + t.necesitas(fmt2(x, en), lista(pend)) + esc(t.todas(pend.length)) + '. ' + esc(t.conEso(fmt2(res.final, en))) + '</p>';
        cs.forEach(function (c) { if (pend.indexOf(c.id) >= 0 && c.min !== undefined && !(c.minOrd && st.conv !== 'ord') && Math.abs(c.min - x) < 1e-9) h += '<p class="sl8-msg sl8-msg--dim">' + esc(t.esMin(name(c.id), fmt(c.min, en))) + '</p>'; });
      } else if (r.estado === 'asegurado') {
        h += '<p class="sl8-big"><span class="sl8-k">' + esc(en ? 'already there' : 'ya lo tienes') + '</span><strong>' + fmt2(res.final, en) + '</strong><em class="sl8-tag is-ok">' + (st.obj === 5 ? t.aprobado : '≥ ' + st.obj) + '</em></p>';
        h += '<p class="sl8-msg">' + esc(t.asegurado(st.obj, fmt2(res.final, en))) + '</p>';
      } else {
        h += '<p class="sl8-big sl8-big--no"><span class="sl8-k">' + esc(en ? 'out of reach' : 'no llega') + '</span><strong>' + fmt2(res.final, en) + '</strong><em class="sl8-tag is-no">max</em></p>';
        h += '<p class="sl8-msg">' + esc(t.imposible(st.obj, fmt2(res.final, en))) + '</p>';
      }
      h += bar(cs, vals, pend, r.estado === 'completo' ? 0 : x, res, dark);
      // fórmula con los números
      var terms = cs.map(function (c) {
        var v = pend.indexOf(c.id) >= 0 ? x : vals[c.id];
        return '<span>' + fmt(c.peso, en).replace(/^0([.,])/, '0$1') + '·' + (pend.indexOf(c.id) >= 0 ? '<b>' + fmt(v, en) + '</b>' : fmt(v, en)) + '</span>';
      }).join(' + ');
      h += '<p class="sl8-ln"><span class="sl8-k">' + esc(t.formula) + '</span><code>' + terms + ' = ' + fmt2(res.raw, en) + '</code></p>';
      h += '<p class="sl8-ln"><span class="sl8-k">' + esc(t.reglas) + '</span></p><ul class="sl8-rules">' + res.notas.map(function (n) {
        var f = t.notas[n[0]], a = n.slice(1).map(function (p) { return typeof p === 'number' ? (n[0] === 'min_no' ? fmt(p, en) : fmt2(p, en)) : (P[asig][p] ? name(p) : p); });
        return f ? '<li>' + esc(f.apply(null, a)) + '</li>' : '';
      }).join('') + '</ul>';
      out.innerHTML = h;
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('sl8-theme')) { el.classList.toggle('is-light'); store('sl_entorno_tema', el.classList.contains('is-light') ? 'claro' : 'oscuro'); themeBtn(); calc(); return; }
      if (b.classList.contains('sl8-clear')) { st.v = {}; save(); render(); return; }
      if (b.dataset.c) { st.conv = b.dataset.c; save(); render(); return; }
      if (b.dataset.o) { st.obj = +b.dataset.o; save(); render(); return; }
      if (b.dataset.m) { st.modo = b.dataset.m; save(); render(); return; }
    });
    root.addEventListener('input', function (e) {
      var row = e.target.closest('.sl8-row'); if (!row) return;
      st.v[row.dataset.id] = e.target.value.trim(); save(); calc();
    });
    render();
  }
  var go = function () { [].forEach.call(document.querySelectorAll('.sl8-app'), mount); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  go();
})();
