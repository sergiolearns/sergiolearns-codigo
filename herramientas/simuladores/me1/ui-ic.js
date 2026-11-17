/* SergioLearns — simulador de ME1: intervalos de confianza, cien muestras a la vez (16 nov 2026). */
(function () {
  'use strict';
  var K = window.SLK, S = window.SLST, M = window.SLM1;
  if (!K || !S || !M) return;
  var esc = K.esc, fill = K.fill, num = S.num, ico = K.ico;
  var TX = {
    es: { title: 'sergio@learns: ~/laboratorio/simuladores/intervalos-de-confianza', kind: 'Para qué', kinds: { z: 'μ, σ conocida', t: 'μ, σ desconocida', p: 'proporción p' },
      truth: 'La población (lo que no sabes)', conf: 'Nivel de confianza', n: 'Tamaño de la muestra (n)', add: 'Sacar muestras', one: '1 muestra', reset: 'Empezar de cero', bad: 'Usar z con s (el error típico)',
      cover: '{a} de {k} contienen a {par}', sel: 'El intervalo marcado', xbar: 'x̄', s: 's', ph: 'p̂', q: 'cuantil', se: 'error típico', moe: 'margen', ci: 'intervalo', width: 'anchura media',
      axis: 'cada línea es un intervalo; la vertical, el valor real', ctx: { z: 'Paquetes de café: μ = {mu} g y σ = {sd} g', p: 'Estudiantes que van en guagua: p = {p}' },
      lv: [['El margen de error', 'z · σ / √n con σ conocida. Con 2 decimales.'], ['Un intervalo con t', 'El extremo de un intervalo para μ con σ desconocida. Con 2 decimales.'], ['¿Cuántos datos?', 'El tamaño de muestra para un margen dado: n = (z·σ/E)², redondeando hacia arriba.']],
      lq1: 'Con σ = {sd}, n = {n} y un nivel del {c} %, ¿cuál es el margen de error z·σ/√n?', lq2: 'Una muestra de n = {n} da x̄ = {m} y s = {s}. ¿Cuál es el extremo {w} del intervalo al {c} % para μ?', lo: 'inferior', hi: 'superior',
      lq3: 'Con σ = {sd}, ¿qué n mínima hace que el margen al {c} % no pase de {e}?' },
    en: { title: 'sergio@learns: ~/lab/simulators/confidence-intervals', kind: 'What for', kinds: { z: 'μ, σ known', t: 'μ, σ unknown', p: 'proportion p' },
      truth: 'The population (what you do not know)', conf: 'Confidence level', n: 'Sample size (n)', add: 'Draw samples', one: '1 sample', reset: 'Start over', bad: 'Use z with s (the classic mistake)',
      cover: '{a} of {k} contain {par}', sel: 'The marked interval', xbar: 'x̄', s: 's', ph: 'p̂', q: 'quantile', se: 'standard error', moe: 'margin', ci: 'interval', width: 'mean width',
      axis: 'each line is an interval; the vertical one, the true value', ctx: { z: 'Coffee packs: μ = {mu} g and σ = {sd} g', p: 'Students who take the bus: p = {p}' },
      lv: [['The margin of error', 'z · σ / √n with σ known. With 2 decimals.'], ['An interval with t', 'One end of an interval for μ with σ unknown. With 2 decimals.'], ['How much data?', 'The sample size for a given margin: n = (z·σ/E)², rounding up.']],
      lq1: 'With σ = {sd}, n = {n} and a {c} % level, what is the margin of error z·σ/√n?', lq2: 'A sample of n = {n} gives x̄ = {m} and s = {s}. What is the {w} end of the {c} % interval for μ?', lo: 'lower', hi: 'upper',
      lq3: 'With σ = {sd}, which minimum n keeps the {c} % margin at most {e}?' }
  };
  var LES = [
    { k: 'cafe', g: 'target', n: ['Cien paquetes de café', 'A hundred coffee packs'], d: ['Qué significa el 95 %: el método acierta 95 de cada 100 veces.', 'What 95 % means: the method is right 95 times in 100.'], steps: [
      { m: 'z', n: 25, c: 0.95, k: 1, s: ['Una máquina llena paquetes de café con μ = 250 g y σ = 5 g. Tú no conoces μ: pesas n = 25 paquetes y calculas x̄ ± 1,96 · 5/√25 = x̄ ± 1,96 g. Esa línea es tu intervalo; la vertical, el μ real.', 'A machine fills coffee packs with μ = 250 g and σ = 5 g. You do not know μ: you weigh n = 25 packs and compute x̄ ± 1.96 · 5/√25 = x̄ ± 1.96 g. That line is your interval; the vertical one, the true μ.'] },
      { m: 'z', n: 25, c: 0.95, k: 1, ask: { q: ['Antes de mirar: ¿este intervalo contiene seguro a μ = 250?', 'Before looking: does this interval surely contain μ = 250?'], o: [['Sí, con un 95 % de confianza siempre', 'Yes, with 95 % confidence it always does'], ['No se sabe: depende de la muestra', 'We cannot know: it depends on the sample', 1], ['No, nunca lo contiene', 'No, it never does']] },
        s: ['Un intervalo concreto contiene a μ o no lo contiene; el 95 % no es de él, es del método. Para verlo hay que repetir la experiencia muchas veces.', 'A particular interval either contains μ or it does not; the 95 % is not about it, it is about the method. To see it you have to repeat the experiment many times.'] },
      { m: 'z', n: 25, c: 0.95, k: 20, s: ['Veinte muestras distintas dan veinte intervalos distintos: cada x̄ cae en un sitio, pero todos miden lo mismo (2 · 1,96 = 3,92 g), porque σ es conocida.', 'Twenty different samples give twenty different intervals: each x̄ lands somewhere else, but they all have the same width (2 · 1.96 = 3.92 g), because σ is known.'] },
      { m: 'z', n: 25, c: 0.95, k: 100, s: ['Con 100 muestras, unos 95 intervalos atrapan a μ y unos 5 lo dejan fuera (en coral). Eso es «95 % de confianza»: la proporción de intervalos que aciertan a la larga.', 'With 100 samples, about 95 intervals catch μ and about 5 miss it (in coral). That is «95 % confidence»: the proportion of intervals that are right in the long run.'] }
    ] },
    { k: 'nivel', g: 'grid', n: ['90, 95 o 99 %', '90, 95 or 99 %'], d: ['Más confianza, intervalos más anchos.', 'More confidence, wider intervals.'], steps: [
      { m: 'z', n: 25, c: 0.90, k: 100, s: ['Al 90 % el cuantil es qnorm(0.95) = 1,645: intervalos más estrechos, pero fallan más, unos 10 de cada 100.', 'At 90 % the quantile is qnorm(0.95) = 1.645: narrower intervals, but they miss more, about 10 in 100.'] },
      { m: 'z', n: 25, c: 0.99, k: 100, ask: { q: ['Si subes la confianza al 99 %, los intervalos…', 'If you raise the confidence to 99 %, the intervals…'], o: [['se estrechan', 'get narrower'], ['se ensanchan', 'get wider', 1], ['no cambian de anchura', 'keep the same width']] },
        s: ['Al 99 % el cuantil es qnorm(0.995) = 2,576: para fallar menos hay que abarcar más. Confianza y precisión tiran en sentidos opuestos.', 'At 99 % the quantile is qnorm(0.995) = 2.576: to miss less you have to cover more. Confidence and precision pull in opposite directions.'] }
    ] },
    { k: 'tamano', g: 'flag', n: ['Más datos', 'More data'], d: ['La anchura baja con √n: cuatro veces más datos, la mitad de anchura.', 'The width falls with √n: four times the data, half the width.'], steps: [
      { m: 'z', n: 10, c: 0.95, k: 60, s: ['Con n = 10 el margen es 1,96 · 5/√10 = 3,10 g.', 'With n = 10 the margin is 1.96 · 5/√10 = 3.10 g.'] },
      { m: 'z', n: 40, c: 0.95, k: 60, s: ['Con n = 40, cuatro veces más datos, el margen es 1,96 · 5/√40 = 1,55 g: la mitad. La confianza sigue siendo del 95 %; lo que gana es la precisión.', 'With n = 40, four times the data, the margin is 1.96 · 5/√40 = 1.55 g: half. Confidence is still 95 %; what improves is precision.'] }
    ] },
    { k: 'student', g: 'exam', n: ['σ desconocida: la t', 'Unknown σ: the t'], d: ['Con s en lugar de σ, el cuantil es de la t de Student.', 'With s instead of σ, the quantile comes from Student’s t.'], steps: [
      { m: 't', n: 6, c: 0.95, k: 100, s: ['Casi nunca se conoce σ: se usa s y el cuantil de una t con n − 1 = 5 grados de libertad, qt(0.975, 5) = 2,571. Cada intervalo tiene ahora su propia anchura, porque s cambia de muestra a muestra.', 'σ is almost never known: you use s and the quantile of a t with n − 1 = 5 degrees of freedom, qt(0.975, 5) = 2.571. Each interval now has its own width, because s changes from sample to sample.'] },
      { m: 't', n: 6, c: 0.95, k: 100, bad: 1, s: ['El error típico: usar s pero con 1,96. Con n = 6 los intervalos se quedan cortos y aciertan bastante menos del 95 % que prometen. Con s, siempre la t.', 'The classic mistake: using s but with 1.96. With n = 6 the intervals are too short and are right well below the 95 % they promise. With s, always the t.'] },
      { m: 't', n: 6, c: 0.95, k: 1, s: ['En R, t.test(x, conf.level = 0.95)$conf.int hace la cuenta entera: media, s, la t con n − 1 y el margen.', 'In R, t.test(x, conf.level = 0.95)$conf.int does the whole calculation: mean, s, the t with n − 1 and the margin.'] }
    ] },
    { k: 'prop', g: 'dice', n: ['Una proporción', 'A proportion'], d: ['p̂ ± z·√(p̂(1 − p̂)/n) para la proporción de estudiantes que van en guagua.', 'p̂ ± z·√(p̂(1 − p̂)/n) for the proportion of students who take the bus.'], steps: [
      { m: 'p', n: 80, c: 0.95, k: 100, s: ['El 30 % de los estudiantes va en guagua. Preguntas a n = 80 y calculas p̂ ± 1,96·√(p̂(1 − p̂)/80): con 100 encuestas, unas 95 contienen el 0,30 real.', '30 % of students take the bus. You ask n = 80 and compute p̂ ± 1.96·√(p̂(1 − p̂)/80): with 100 surveys, about 95 contain the real 0.30.'] }
    ] }
  ];

  function mount(el) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], li = lang === 'en' ? 1 : 0, en = lang === 'en';
    var UI = K.mount(el, { sim: 'ic', title: t.title, d: true }), q = UI.q;
    var TRUE = { mu: 250, sd: 5, p: 0.3 };
    var ST = { m: 'z', n: 25, c: 0.95, bad: false, L: [], sel: -1, seed: 1 }, R = S.rng(99), anim = 0;
    var main = '<div class="m1-grid"><div class="m1-left"><div class="m1-plotw"><svg class="m1-plot m1-ci" viewBox="0 0 640 380" role="img"></svg><div class="m1-stats m1-covw"></div></div></div>'
      + '<div class="m1-side"><div class="m1-grp"><p class="m1-h">' + esc(t.kind) + '</p><div class="m1-seg m1-kind" role="group"><button type="button" data-m="z">' + esc(t.kinds.z) + '</button><button type="button" data-m="t">' + esc(t.kinds.t) + '</button><button type="button" data-m="p">' + esc(t.kinds.p) + '</button></div>'
      + '<label class="m1-chk" hidden><input type="checkbox" data-bad> <span>' + esc(t.bad) + '</span></label></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.conf) + '</p><div class="m1-seg m1-conf" role="group"><button type="button" data-c="0.9">90 %</button><button type="button" data-c="0.95">95 %</button><button type="button" data-c="0.99">99 %</button></div></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.n) + '</p><label class="m1-p"><span class="m1-p__l"><code>n</code></span><input type="range" min="2" max="200" step="1" data-t="n" aria-label="n"><input type="number" class="m1-num" min="2" max="200" step="1" data-t="nn" aria-label="n"></label></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.add) + '</p><div class="m1-btns"><button type="button" class="slk-btn slk-btn--p" data-a="1">' + ico('play', 14) + '<span>' + esc(t.one) + '</span></button><button type="button" class="slk-btn" data-a="20">+20</button><button type="button" class="slk-btn" data-a="100">+100</button><button type="button" class="slk-btn slk-btn--g" data-a="0">' + ico('reset', 14) + '<span>' + esc(t.reset) + '</span></button></div></div>'
      + '<div class="m1-res-c"><p class="m1-h">' + esc(t.sel) + '</p><dl class="m1-kv m1-selkv"></dl></div></div></div>';
    var C = M.card(UI, { lessons: LES, main: main,
      onStep: function (les, k, ox) { var s = les.steps[k]; ST.m = s.m; ST.n = s.n; ST.c = s.c; ST.bad = !!s.bad; reseed(les.k.length * 313 + k * 71 + s.n); run(s.k, ox.anim); },
      xp: function () {
        var r = ST.L[ST.sel]; if (!r) return null;
        var al = (1 - ST.c) / 2, v = par(), inn = r.lo <= v && r.hi >= v, parts = [];
        parts.push({ c: ST.m === 'p' ? 'p' : 'mean(x)', d: esc((ST.m === 'p' ? 'p̂ = ' : 'x̄ = ') + num(r.m, 3, en) + (en ? ': the centre of the interval, the estimate from this sample.' : ': el centro del intervalo, la estimación de esta muestra.')) });
        parts.push({ c: r.st === 't' ? 'qt(' + S.rnum(1 - al) + ', df = ' + (ST.n - 1) + ')' : 'qnorm(' + S.rnum(1 - al) + ')', d: esc((r.st === 't' ? 't' : 'z') + ' = ' + num(r.q, 3, en) + (en ? ': leaves ' + num(al * 100, 1, en) + ' % in each tail, so ' + Math.round(ST.c * 100) + ' % stays in the middle.' : ': deja un ' + num(al * 100, 1, en) + ' % en cada cola, y el ' + Math.round(ST.c * 100) + ' % queda en medio.') + (ST.m === 't' && ST.bad ? (en ? ' Wrong here: with s it should be the t.' : ' Aquí está mal: con s toca la t.') : '')) });
        parts.push({ c: ST.m === 'p' ? 'sqrt(p * (1 - p) / n)' : ST.m === 'z' ? '5 / sqrt(' + ST.n + ')' : 'sd(x) / sqrt(' + ST.n + ')', d: esc((en ? 'Standard error = ' : 'Error típico = ') + num(r.se, 4, en) + (ST.m === 't' ? (en ? ', with s = ' : ', con s = ') + num(r.s, 3, en) : '') + (en ? ': how much x̄ moves from sample to sample.' : ': cuánto se mueve la estimación de una muestra a otra.')) });
        parts.push({ c: 'c(-1, 1) * …', d: esc((en ? 'Margin = ' : 'Margen = ') + num(r.q, 3, en) + ' · ' + num(r.se, 4, en) + ' = ' + num(r.q * r.se, 3, en) + (en ? ', subtracted and added: [' : ', que se resta y se suma: [') + num(r.lo, 3, en) + (en ? ', ' : '; ') + num(r.hi, 3, en) + '].') });
        var lead = esc(en ? 'This interval ' + (inn ? 'contains' : 'does NOT contain') + ' the true value ' + (ST.m === 'p' ? 'p = 0.3' : 'μ = 250') + '. In real life you would not know it: what you know is that the method gets it right ' + Math.round(ST.c * 100) + ' % of the time.' : 'Este intervalo ' + (inn ? 'contiene' : 'NO contiene') + ' al valor real, ' + (ST.m === 'p' ? 'p = 0,3' : 'μ = 250') + '. En la vida real no lo sabrías: lo que sabes es que el método acierta el ' + Math.round(ST.c * 100) + ' % de las veces.');
        return { code: q('.pm3-cl').textContent.replace(/ → .*$/, ''), lead: lead, parts: parts, tip: esc(en ? 'Write the interpretation like this: «with 95 % confidence, μ lies between a and b», and remember that the 95 % belongs to the method. With σ known use z; with s, the t with n − 1 degrees of freedom.' : 'Escribe la interpretación así: «con un 95 % de confianza, μ está entre a y b», y recuerda que el 95 % es del método. Con σ conocida, z; con s, la t con n − 1 grados de libertad.') };
      },
      state: function () { return { m: ST.m, n: ST.n, c: ST.c, bad: ST.bad }; },
      restore: function (x) { if (x && /^[ztp]$/.test(x.m)) { ST.m = x.m; ST.n = Math.max(2, Math.min(200, x.n | 0)); ST.c = [0.9, 0.95, 0.99].indexOf(x.c) >= 0 ? x.c : 0.95; ST.bad = !!x.bad; reseed(5); run(100, false); } }
    });
    var svg = q('.m1-ci');
    function reseed(s) { ST.seed = s; R = S.rng(s); ST.L = []; ST.sel = -1; }
    function sampleOne() {
      var n = ST.n, x = [];
      if (ST.m === 'p') { for (var i = 0; i < n; i++) x.push(R() < TRUE.p ? 1 : 0); return Object.assign(S.ci(x, { conf: ST.c, kind: 'p' }), { x: x }); }
      for (var j = 0; j < n; j++) x.push(TRUE.mu + TRUE.sd * R.norm());
      var r = S.ci(x, { conf: ST.c, sigma: ST.m === 'z' ? TRUE.sd : null });
      if (ST.m === 't' && ST.bad) { r.q = S.qnorm(1 - (1 - ST.c) / 2); r.st = 'z'; r.lo = r.m - r.q * r.se; r.hi = r.m + r.q * r.se; }
      r.x = x; return r;
    }
    function run(k, a) {
      cancelAnimationFrame(anim);
      var all = []; for (var i = 0; i < k; i++) all.push(sampleOne());
      var base = ST.L.slice();
      if (!a || K.reduced() || k < 3) { ST.L = base.concat(all); ST.sel = ST.L.length - 1; render(); return; }
      var t0 = performance.now(), dur = 1000;
      (function f(now) { var p = Math.min(1, (now - t0) / dur), c = Math.max(1, Math.round(all.length * p)); ST.L = base.concat(all.slice(0, c)); ST.sel = ST.L.length - 1; render(); if (p < 1) anim = requestAnimationFrame(f); })(t0);
    }
    function par() { return ST.m === 'p' ? TRUE.p : TRUE.mu; }
    function draw() {
      var L = ST.L.slice(-100), x0 = 54, x1 = 624, y0 = 340, y1 = 52, v = par();
      var se0 = ST.m === 'p' ? Math.sqrt(TRUE.p * (1 - TRUE.p) / ST.n) : TRUE.sd / Math.sqrt(ST.n), half = 4.4 * se0;
      var lo = v - half, hi = v + half; L.forEach(function (r) { lo = Math.min(lo, r.lo); hi = Math.max(hi, r.hi); });
      var X = M.scale(lo, hi, x0, x1), rows = Math.max(20, L.length), dy = (y0 - y1) / rows, off = ST.L.length - L.length;
      var out = '<line class="m1-ax" x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '"/>' + M.axisX(X, y0, lo, hi, 8, null, en);
      out += '<line class="m1-mu-l" x1="' + X(v) + '" x2="' + X(v) + '" y1="' + (y1 - 12) + '" y2="' + y0 + '"/><text class="m1-tl m1-mut" x="' + X(v) + '" y="' + (y1 - 18) + '" text-anchor="middle">' + (ST.m === 'p' ? 'p = ' + num(v, 2, en) : 'μ = ' + num(v, 1, en)) + '</text>';
      out += L.map(function (r, i) {
        var y = y0 - 8 - i * dy, miss = r.lo > v || r.hi < v, sel = i + off === ST.sel;
        return '<g class="m1-row" data-i="' + (i + off) + '"><line class="m1-seg' + (miss ? ' is-miss' : '') + (sel ? ' is-sel' : '') + '" x1="' + X(r.lo).toFixed(1) + '" x2="' + X(r.hi).toFixed(1) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '"/><circle class="m1-cen" cx="' + X(r.m).toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (sel ? 3.6 : 2.2) + '"/>'
          + '<rect x="' + x0 + '" y="' + (y - dy / 2).toFixed(1) + '" width="' + (x1 - x0) + '" height="' + Math.max(2, dy).toFixed(1) + '" fill="transparent"/></g>';
      }).join('');
      out += '<text x="' + x0 + '" y="14">' + esc(t.axis) + '</text>';
      svg.innerHTML = out;
    }
    function render() {
      [].forEach.call(q('.m1-kind').children, function (b) { var on = b.getAttribute('data-m') === ST.m; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      [].forEach.call(q('.m1-conf').children, function (b) { var on = +b.getAttribute('data-c') === ST.c; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      var chk = q('.m1-chk'); chk.hidden = ST.m !== 't'; q('[data-bad]').checked = ST.bad;
      var rg = q('[data-t="n"]'), nn = q('[data-t="nn"]'); if (document.activeElement !== rg) rg.value = ST.n; if (document.activeElement !== nn) nn.value = ST.n;
      draw();
      var k = ST.L.length, v = par(), a = ST.L.filter(function (r) { return r.lo <= v && r.hi >= v; }).length, wm = k ? S.mean(ST.L.map(function (r) { return r.hi - r.lo; })) : NaN;
      q('.m1-covw').innerHTML = '<span><b class="m1-cov">' + (k ? Math.round(100 * a / k) + ' %' : '—') + '</b><small>' + esc(fill(t.cover, { a: a, k: k, par: ST.m === 'p' ? 'p' : 'μ' })) + '</small></span><span><i>' + esc(t.width) + '</i><b>' + esc(num(wm, 3, en)) + '</b></span>';
      var r = ST.L[ST.sel], al = (1 - ST.c) / 2, cpc = Math.round(ST.c * 100);
      if (!r) { q('.m1-selkv').innerHTML = ''; C.setStrip('', null); return; }
      q('.m1-selkv').innerHTML = (ST.m === 'p' ? '<dt>' + t.ph + '</dt><dd><b>' + esc(num(r.m, 3, en)) + '</b></dd>' : '<dt>' + t.xbar + '</dt><dd><b>' + esc(num(r.m, 3, en)) + '</b></dd>' + (ST.m === 't' ? '<dt>' + t.s + '</dt><dd><b>' + esc(num(r.s, 3, en)) + '</b></dd>' : ''))
        + '<dt>' + esc(t.q) + '</dt><dd><b>' + (r.st === 't' ? 't<sub>' + (ST.n - 1) + '</sub> = ' : 'z = ') + esc(num(r.q, 3, en)) + '</b></dd><dt>' + esc(t.se) + '</dt><dd><b>' + esc(num(r.se, 4, en)) + '</b></dd>'
        + '<dt>' + esc(t.moe) + '</dt><dd><b>' + esc(num(r.q * r.se, 3, en)) + '</b></dd><dt>' + esc(t.ci) + '</dt><dd><b>[' + esc(num(r.lo, 3, en)) + (en ? ', ' : '; ') + esc(num(r.hi, 3, en)) + ']</b></dd>';
      var code = ST.m === 'p' ? 'p + c(-1, 1) * qnorm(' + S.rnum(1 - al) + ') * sqrt(p * (1 - p) / ' + ST.n + ')' : ST.m === 'z' ? 'mean(x) + c(-1, 1) * qnorm(' + S.rnum(1 - al) + ') * ' + TRUE.sd + ' / sqrt(' + ST.n + ')'
        : ST.bad ? 'mean(x) + c(-1, 1) * qnorm(' + S.rnum(1 - al) + ') * sd(x) / sqrt(' + ST.n + ')   # ' + (en ? 'wrong' : 'mal') : 't.test(x, conf.level = ' + S.rnum(ST.c) + ')$conf.int';
      C.setStrip(code, '[' + num(r.lo, 2, en) + (en ? ', ' : '; ') + num(r.hi, 2, en) + ']');
    }
    el.addEventListener('click', function (e) {
      var row = e.target.closest('.m1-row'); if (row && el.contains(row)) { ST.sel = +row.getAttribute('data-i'); render(); return; }
      var b = e.target.closest('[data-m],[data-c],[data-a]'); if (!b || !el.contains(b) || !b.closest('.m1-side')) return;
      if (b.hasAttribute('data-m')) { ST.m = b.getAttribute('data-m'); ST.bad = false; reseed(ST.seed + 1); run(100, true); }
      else if (b.hasAttribute('data-c')) { ST.c = +b.getAttribute('data-c'); reseed(ST.seed + 1); run(100, true); }
      else { var a = +b.getAttribute('data-a'); if (!a) { reseed(ST.seed + 1); render(); } else run(a, a >= 20); }
    });
    el.addEventListener('change', function (e) { var x = e.target; if (x.hasAttribute && x.hasAttribute('data-bad') && el.contains(x)) { ST.bad = x.checked; reseed(ST.seed + 1); run(100, true); } });
    var NT = null;
    el.addEventListener('input', function (e) {
      var x = e.target, k = x.getAttribute && x.getAttribute('data-t'); if (!el.contains(x) || (k !== 'n' && k !== 'nn')) return;
      ST.n = Math.max(2, Math.min(200, Math.round(+x.value || 2))); clearTimeout(NT); NT = setTimeout(function () { reseed(ST.seed + 1); run(100, false); }, 140);
    });
    // ---- «Ponte a prueba»
    function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
    function zq(c) { return S.qnorm(1 - (1 - c) / 2); }
    var LV = [
      { gen: function () { var sd = pk([2, 4, 5, 8, 10, 12]), n = pk([16, 25, 36, 49, 64, 100]), c = pk([0.9, 0.95, 0.99]), v = zq(c) * sd / Math.sqrt(n);
        return { q: fill(t.lq1, { sd: sd, n: n, c: Math.round(c * 100) }), code: 'qnorm(' + S.rnum(1 - (1 - c) / 2) + ') * ' + sd + ' / sqrt(' + n + ')', ans: num(v, 2, en), norm: M.numNorm(v, 0.011), hint: 'z = qnorm(' + S.rnum(1 - (1 - c) / 2) + ') = ' + num(zq(c), 3, en), mode: 'decimal' }; } },
      { gen: function () { var n = pk([6, 9, 10, 16, 20, 25]), m = pk([12.4, 48.2, 250.6, 6.3, 101.5]), s = pk([1.2, 2.5, 3.1, 4.8, 0.9]), c = pk([0.9, 0.95, 0.99]), up = Math.random() < 0.5;
        var tq = S.DIST.t.q(1 - (1 - c) / 2, { df: n - 1 }), v = m + (up ? 1 : -1) * tq * s / Math.sqrt(n);
        return { q: fill(t.lq2, { n: n, m: num(m, 2, en), s: num(s, 2, en), w: up ? t.hi : t.lo, c: Math.round(c * 100) }), code: S.rnum(m) + (up ? ' + ' : ' - ') + 'qt(' + S.rnum(1 - (1 - c) / 2) + ', df = ' + (n - 1) + ') * ' + S.rnum(s) + ' / sqrt(' + n + ')', ans: num(v, 2, en), norm: M.numNorm(v, 0.011),
          hint: 't = qt(' + S.rnum(1 - (1 - c) / 2) + ', ' + (n - 1) + ') = ' + num(tq, 3, en), mode: 'decimal' }; } },
      { gen: function () { var sd = pk([3, 4, 5, 6, 8, 10]), c = pk([0.9, 0.95, 0.99]), e = pk([0.5, 1, 1.5, 2]), v = Math.ceil(Math.pow(zq(c) * sd / e, 2) - 1e-9);
        return { q: fill(t.lq3, { sd: sd, c: Math.round(c * 100), e: num(e, 1, en) }), code: 'ceiling((qnorm(' + S.rnum(1 - (1 - c) / 2) + ') * ' + sd + ' / ' + S.rnum(e) + ')^2)', ans: String(v), norm: function (x) { return String(parseInt(String(x).replace(/\D/g, ''), 10)); }, hint: 'n ≥ (z · σ / E)²', mode: 'numeric' }; } }
    ];
    LV.forEach(function (l, i) { l.n = [TX.es.lv[i][0], TX.en.lv[i][0]]; l.d = [TX.es.lv[i][1], TX.en.lv[i][1]]; });
    K.levels(UI, { key: 'sl_sim_ic_niveles', need: 3, levels: LV, hl: function (s) { return esc(s); } });
    C.start();
  }
  window.SLIC = { mount: mount, LES: LES };
  K.boot('.sl-sim[data-sim="ic"]', mount);
})();
