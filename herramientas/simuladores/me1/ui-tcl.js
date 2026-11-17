/* SergioLearns — simulador de ME1: el teorema central del límite con muestras de verdad (16 nov 2026). */
(function () {
  'use strict';
  var K = window.SLK, S = window.SLST, M = window.SLM1;
  if (!K || !S || !M) return;
  var esc = K.esc, fill = K.fill, num = S.num, ico = K.ico;
  var PN = { dado: ['Un dado', 'A die'], unif: ['Uniforme (0, 10)', 'Uniform (0, 10)'], espera: ['La espera de la guagua', 'Waiting for the bus'], moneda: ['Moneda trucada', 'Loaded coin'], bimodal: ['Dos montañas', 'Two hills'] };
  var RC = {   // cómo se saca una muestra de tamaño n en R
    dado: 'sample(1:6, {n}, replace = TRUE)', unif: 'runif({n}, 0, 10)', espera: 'rexp({n}, rate = 1/6)', moneda: 'rbinom({n}, 1, 0.2)',
    bimodal: 'ifelse(runif({n}) < 0.5, rnorm({n}, 2, 0.6), rnorm({n}, 8, 0.6))'
  };
  var TX = {
    es: { title: 'sergio@learns: ~/laboratorio/simuladores/teorema-central-del-limite', pop: 'La población', n: 'Tamaño de cada muestra (n)', stat: 'Lo que se calcula', mean: 'la media', sum: 'la suma',
      add: 'Sacar muestras', one: '1 muestra', reset: 'Empezar de cero', popT: 'población: de dónde salen los datos', histT: 'las {k} medias', histS: 'las {k} sumas',
      kv: { k: 'Muestras', mm: 'Media de las medias', ms: 'Media de las sumas', mu: 'μ de la población', nmu: 'n · μ', sd: 'Desviación de las medias', sds: 'Desviación de las sumas', se: 'σ / √n', ses: 'σ · √n' },
      last: 'Última muestra', normal: 'normal del TCL',
      lv: [['El error de la media', 'Desviación típica de la media muestral: σ/√n. Con 3 decimales.'], ['Probabilidades con el TCL', 'P(X̄ > c) o P(X̄ < c) aproximando con la normal. Con 4 decimales.'], ['La suma', 'Totales: la suma de n datos se aproxima con N(nμ, σ√n). Con 4 decimales.']],
      lq1: 'En una población con μ = {mu} y σ = {sd} tomas muestras de n = {n}. ¿Cuál es la desviación típica de X̄?', lq2: '{ctx} Con n = {n}, ¿cuánto vale aproximadamente P(X̄ {op} {c})?', lq3: '{ctx} ¿Cuánto vale aproximadamente P(S ≤ {c}), con S la suma de los {n}?' },
    en: { title: 'sergio@learns: ~/lab/simulators/central-limit-theorem', pop: 'The population', n: 'Size of each sample (n)', stat: 'What is computed', mean: 'the mean', sum: 'the sum',
      add: 'Draw samples', one: '1 sample', reset: 'Start over', popT: 'population: where the data come from', histT: 'the {k} means', histS: 'the {k} sums',
      kv: { k: 'Samples', mm: 'Mean of the means', ms: 'Mean of the sums', mu: 'Population μ', nmu: 'n · μ', sd: 'SD of the means', sds: 'SD of the sums', se: 'σ / √n', ses: 'σ · √n' },
      last: 'Last sample', normal: 'CLT normal',
      lv: [['The error of the mean', 'Standard deviation of the sample mean: σ/√n. With 3 decimals.'], ['Probabilities with the CLT', 'P(X̄ > c) or P(X̄ < c) approximating with the normal. With 4 decimals.'], ['The sum', 'Totals: the sum of n values is approximated by N(nμ, σ√n). With 4 decimals.']],
      lq1: 'In a population with μ = {mu} and σ = {sd} you take samples of n = {n}. What is the standard deviation of X̄?', lq2: '{ctx} With n = {n}, what is approximately P(X̄ {op} {c})?', lq3: '{ctx} What is approximately P(S ≤ {c}), with S the sum of the {n}?' }
  };
  var LES = [
    { k: 'dado', g: 'dice', n: ['La media de un dado', 'The mean of a die'], d: ['De una población plana a la campana: n = 1, 2, 5 y 30.', 'From a flat population to the bell: n = 1, 2, 5 and 30.'], steps: [
      { p: 'dado', n: 1, st: 'mean', k: 400, s: ['La población es un dado: cada cara sale con probabilidad 1/6, una distribución plana con μ = 3,5 y σ = 1,71. Con n = 1, la «media» de cada muestra es la propia tirada: el histograma copia la población.', 'The population is a die: each face has probability 1/6, a flat distribution with μ = 3.5 and σ = 1.71. With n = 1, the «mean» of each sample is the roll itself: the histogram copies the population.'] },
      { p: 'dado', n: 2, st: 'mean', k: 400, ask: { q: ['Ahora cada muestra son 2 tiradas y se guarda su media. ¿Qué forma tendrá el histograma?', 'Now each sample is 2 rolls and their mean is kept. What shape will the histogram have?'], o: [['Plano, como el dado', 'Flat, like the die'], ['Un triángulo con pico en 3,5', 'A triangle peaking at 3.5', 1], ['Dos picos, en 1 y en 6', 'Two peaks, at 1 and 6']] },
        s: ['Con dos tiradas, sacar media 1 exige 1 y 1, pero media 3,5 sale de seis combinaciones: el centro se llena y los extremos se vacían. Ya no es plano: es un triángulo.', 'With two rolls, a mean of 1 needs 1 and 1, but a mean of 3.5 comes from six combinations: the centre fills up and the ends empty. It is no longer flat: it is a triangle.'] },
      { p: 'dado', n: 5, st: 'mean', k: 600, s: ['Con n = 5 ya se ve la campana. La forma de la población se va olvidando: eso es el teorema central del límite.', 'With n = 5 the bell is already there. The shape of the population is being forgotten: that is the central limit theorem.'] },
      { p: 'dado', n: 30, st: 'mean', k: 1000, s: ['Con n = 30 la campana es estrecha. Las medias siguen aproximadamente una N(μ, σ/√n) = N(3,5; 0,31): mismo centro que el dado y una desviación √30 veces menor.', 'With n = 30 the bell is narrow. The means approximately follow N(μ, σ/√n) = N(3.5, 0.31): the same centre as the die and a standard deviation √30 times smaller.'] }
    ] },
    { k: 'guagua', g: 'flag', n: ['La espera de la guagua', 'Waiting for the bus'], d: ['Una población muy asimétrica: hace falta una n mayor.', 'A very skewed population: it needs a larger n.'], steps: [
      { p: 'espera', n: 1, st: 'mean', k: 500, s: ['La espera de la guagua es exponencial con media 6 minutos: muchas esperas cortas y unas pocas muy largas. Con n = 1, el histograma tiene la misma cola larga.', 'The bus wait is exponential with mean 6 minutes: many short waits and a few very long ones. With n = 1, the histogram has the same long tail.'] },
      { p: 'espera', n: 5, st: 'mean', k: 700, s: ['Con n = 5 la cola se encoge, pero la campana todavía está torcida hacia la derecha: la asimetría de la población tarda más en desaparecer.', 'With n = 5 the tail shrinks, but the bell is still skewed to the right: the skewness of the population takes longer to disappear.'] },
      { p: 'espera', n: 40, st: 'mean', k: 1000, s: ['Con n = 40 ya es casi una N(6; 6/√40) = N(6; 0,95). Por eso en clase se pide n ≥ 30 para aplicar el TCL: con poblaciones muy asimétricas, cuanta más n, mejor.', 'With n = 40 it is almost N(6, 6/√40) = N(6, 0.95). That is why class asks for n ≥ 30 to apply the CLT: with very skewed populations, the larger n, the better.'] }
    ] },
    { k: 'moneda', g: 'target', n: ['Una proporción', 'A proportion'], d: ['La media de ceros y unos es una proporción, y también acaba en campana.', 'The mean of zeros and ones is a proportion, and it also ends up as a bell.'], steps: [
      { p: 'moneda', n: 10, st: 'mean', k: 600, s: ['Una moneda trucada da 1 con probabilidad 0,2 (como un estudiante que usa la guagua): la media de una muestra es la proporción de unos, p̂. Con n = 10, p̂ solo puede valer 0; 0,1; 0,2…', 'A loaded coin gives 1 with probability 0.2 (like a student who takes the bus): the mean of a sample is the proportion of ones, p̂. With n = 10, p̂ can only be 0, 0.1, 0.2…'] },
      { p: 'moneda', n: 100, st: 'mean', k: 1000, s: ['Con n = 100 las proporciones forman una campana alrededor de p = 0,2 con desviación √(p(1 − p)/n) = 0,04: es la base de los intervalos para una proporción.', 'With n = 100 the proportions form a bell around p = 0.2 with standard deviation √(p(1 − p)/n) = 0.04: the basis of intervals for a proportion.'] }
    ] },
    { k: 'suma', g: 'grid', n: ['La suma de 10 dados', 'The sum of 10 dice'], d: ['El TCL también vale para totales: N(nμ, σ√n).', 'The CLT also works for totals: N(nμ, σ√n).'], steps: [
      { p: 'dado', n: 10, st: 'sum', k: 800, s: ['Ahora se guarda la suma de 10 tiradas. Su centro es n·μ = 35 y su desviación σ·√n = 5,40: la suma se aproxima con una N(35; 5,40).', 'Now the sum of 10 rolls is kept. Its centre is n·μ = 35 and its standard deviation σ·√n = 5.40: the sum is approximated by N(35, 5.40).'] },
      { p: 'dado', n: 10, st: 'sum', k: 800, ask: { q: ['¿Cómo calcularías en R la probabilidad aproximada de que la suma no pase de 30?', 'How would you compute in R the approximate probability that the sum does not exceed 30?'], o: [['pnorm(30, 35, 5.4)', 'pnorm(30, 35, 5.4)', 1], ['pnorm(30, 3.5, 1.71)', 'pnorm(30, 3.5, 1.71)'], ['pnorm(30, 35, 1.71)', 'pnorm(30, 35, 1.71)']] },
        s: ['P(S ≤ 30) ≈ pnorm(30, 35, 5.4) = 0,18: con la media y la desviación de la suma, no las de un dado. En el histograma, más o menos 18 de cada 100 sumas quedan a la izquierda de 30.', 'P(S ≤ 30) ≈ pnorm(30, 35, 5.4) = 0.18: with the mean and standard deviation of the sum, not those of one die. In the histogram, about 18 of every 100 sums lie to the left of 30.'] }
    ] }
  ];

  function mount(el) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], li = lang === 'en' ? 1 : 0, en = lang === 'en';
    var UI = K.mount(el, { sim: 'tcl', title: t.title, d: true }), q = UI.q;
    var ST = { p: 'dado', n: 5, st: 'mean', xs: [], last: null, newIdx: -1, seed: 1 }, R = S.rng(12345), anim = 0;
    var main = '<div class="m1-grid"><div class="m1-left"><div class="m1-plotw"><svg class="m1-plot m1-pop" viewBox="0 0 640 150" role="img"></svg><svg class="m1-plot m1-hplot" viewBox="0 0 640 300" role="img"></svg></div></div>'
      + '<div class="m1-side"><div class="m1-grp"><p class="m1-h">' + esc(t.pop) + '</p><div class="m1-pills m1-popp"></div></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.n) + '</p><label class="m1-p"><span class="m1-p__l"><code>n</code></span><input type="range" min="1" max="100" step="1" data-t="n" aria-label="n"><input type="number" class="m1-num" min="1" max="100" step="1" data-t="nn" aria-label="n"></label></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.stat) + '</p><div class="m1-seg m1-stat" role="group"><button type="button" data-st="mean">' + esc(t.mean) + '</button><button type="button" data-st="sum">' + esc(t.sum) + '</button></div></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.add) + '</p><div class="m1-btns"><button type="button" class="slk-btn slk-btn--p" data-a="1">' + ico('play', 14) + '<span>' + esc(t.one) + '</span></button><button type="button" class="slk-btn" data-a="10">+10</button><button type="button" class="slk-btn" data-a="100">+100</button><button type="button" class="slk-btn" data-a="1000">+1000</button><button type="button" class="slk-btn slk-btn--g" data-a="0">' + ico('reset', 14) + '<span>' + esc(t.reset) + '</span></button></div></div>'
      + '<div class="m1-res-c"><dl class="m1-kv"></dl><p class="m1-h" style="margin-top:10px!important">' + esc(t.last) + '</p><p class="m1-sample"></p></div></div></div>';
    var C = M.card(UI, { lessons: LES, main: main,
      onStep: function (les, k, ox) { var s = les.steps[k]; ST.p = s.p; ST.n = s.n; ST.st = s.st; reseed(les.k.length * 997 + k * 131 + s.n); run(s.k, ox.anim); },
      xp: function () {
        var Pp = S.POP[ST.p], mean = ST.st === 'mean', k = ST.xs.length, mu = mean ? Pp.mu : ST.n * Pp.mu, se = mean ? Pp.sd / Math.sqrt(ST.n) : Pp.sd * Math.sqrt(ST.n), sd = k > 1 ? S.sd(ST.xs) : NaN, smp = fill(RC[ST.p], { n: ST.n });
        var nm = mean ? (en ? 'means' : 'medias') : (en ? 'sums' : 'sumas');
        var parts = [
          { c: smp, d: esc(en ? 'One sample: ' + ST.n + ' values drawn from «' + PN[ST.p][1] + '» (μ = ' + num(Pp.mu, 3, en) + ', σ = ' + num(Pp.sd, 3, en) + ').' : 'Una muestra: ' + ST.n + ' datos sacados de «' + PN[ST.p][0] + '» (μ = ' + num(Pp.mu, 3, en) + ', σ = ' + num(Pp.sd, 3, en) + ').') },
          { c: (mean ? 'mean(' : 'sum(') + '…)', d: esc(mean ? (en ? 'Its mean x̄: one number per sample.' : 'Su media x̄: un número por muestra.') : (en ? 'Its sum S: one number per sample.' : 'Su suma S: un número por muestra.')) },
          { c: 'replicate(' + Math.max(1, k) + ', …)', d: esc(en ? 'Repeat it ' + k + ' times: the histogram shows those ' + k + ' ' + nm + '.' : 'Se repite ' + k + ' veces: el histograma enseña esas ' + k + ' ' + nm + '.') },
          { c: mean ? 'σ / sqrt(n)' : 'σ * sqrt(n)', d: esc((mean ? 'σ/√n = ' + num(Pp.sd, 3, en) + ' / √' + ST.n : 'σ·√n = ' + num(Pp.sd, 3, en) + ' · √' + ST.n) + ' = ' + num(se, 3, en) + (en ? ': what the CLT predicts for their spread; it came out ' : ': lo que predice el TCL para su dispersión; ha salido ') + num(sd, 3, en) + '.') }
        ];
        var lead = esc(en ? 'By the central limit theorem, the ' + nm + ' approximately follow N(' + num(mu, 3, en) + ', ' + num(se, 3, en) + '): the same centre as the population' + (mean ? '' : ' times n') + ' and a spread that ' + (mean ? 'shrinks' : 'grows') + ' with √n.' : 'Por el teorema central del límite, las ' + nm + ' siguen aproximadamente una N(' + num(mu, 3, en) + '; ' + num(se, 3, en) + '): el mismo centro que la población' + (mean ? '' : ' por n') + ' y una dispersión que ' + (mean ? 'se encoge' : 'crece') + ' con √n.');
        return { code: C ? q('.pm3-cl').textContent : smp, lead: lead, parts: parts, tip: esc(en ? 'X̄ ≈ N(μ, σ/√n) and S ≈ N(nμ, σ√n) when n is large (n ≥ 30 is the usual rule) or the population is already normal. Use the mean and SD of X̄ or S, never those of a single value.' : 'X̄ ≈ N(μ, σ/√n) y S ≈ N(nμ, σ√n) cuando n es grande (la regla habitual es n ≥ 30) o la población ya es normal. Usa la media y la desviación de X̄ o de S, nunca las de un solo dato.') };
      },
      state: function () { return { p: ST.p, n: ST.n, st: ST.st }; },
      restore: function (x) { if (x && S.POP[x.p]) { ST.p = x.p; ST.n = Math.max(1, Math.min(100, x.n | 0)); ST.st = x.st === 'sum' ? 'sum' : 'mean'; reseed(7); run(300, false); } }
    });
    var popSvg = q('.m1-pop'), hSvg = q('.m1-hplot');
    function reseed(s) { ST.seed = s; R = S.rng(s); ST.xs = []; ST.last = null; ST.newIdx = -1; }
    function one() { var smp = S.sample(ST.p, ST.n, R), m = S.mean(smp); ST.last = smp; return ST.st === 'sum' ? m * ST.n : m; }
    function run(k, a) {   // k muestras; con animación, van entrando poco a poco
      cancelAnimationFrame(anim);
      var all = []; for (var i = 0; i < k; i++) all.push(one());
      if (!a || K.reduced()) { ST.xs = ST.xs.concat(all); render(); return; }
      var t0 = performance.now(), base = ST.xs.slice(), dur = 1100;
      (function f(now) { var p = Math.min(1, (now - t0) / dur), c = Math.round(all.length * (1 - Math.pow(1 - p, 2))); ST.xs = base.concat(all.slice(0, c)); render(); if (p < 1) anim = requestAnimationFrame(f); })(t0);
    }
    function P() { return S.POP[ST.p]; }
    function range() {
      var Pp = P();
      if (ST.st === 'mean') return [Pp.lo, Pp.hi];
      var c = ST.n * Pp.mu, w = 4.4 * Pp.sd * Math.sqrt(ST.n); return [Math.max(ST.n * Pp.lo, c - w), Math.min(ST.n * Pp.hi, c + w)];
    }
    function bins() {
      var r = range(), Pp = P(), w = (r[1] - r[0]) / 46, start = r[0];
      if (Pp.d) {   // poblaciones de valores enteros: que cada valor posible caiga en el centro de su barra
        var st = ST.st === 'mean' ? 1 / ST.n : 1; w = st * Math.max(1, Math.ceil(w / st - 1e-9)); start = Math.floor((r[0]) / w) * w - w / 2 + (ST.st === 'mean' ? 0 : 0);
        if (ST.st === 'mean') start = Math.round(r[0] / st) * st - w / 2;
      }
      var nb = Math.ceil((r[1] - start) / w) + 1, c = new Array(nb).fill(0);
      ST.xs.forEach(function (x) { var i = Math.floor((x - start) / w + 1e-9); if (i >= 0 && i < nb) c[i]++; });
      return { s: start, w: w, c: c, r: r };
    }
    function drawPop() {
      var Pp = P(), x0 = 54, x1 = 624, y0 = 118, y1 = 18, X = M.scale(Pp.lo, Pp.hi, x0, x1), out = '<line class="m1-ax" x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '"/>';
      if (Pp.d) { var ym = Math.max.apply(null, Pp.xs.map(Pp.pdf)) * 1.1, Y = M.scale(0, ym, y0, y1), bw = Math.min(46, (x1 - x0) / Pp.xs.length * 0.5); out += Pp.xs.map(function (v) { return '<rect class="m1-pop" x="' + (X(v) - bw / 2) + '" y="' + Y(Pp.pdf(v)) + '" width="' + bw + '" height="' + (y0 - Y(Pp.pdf(v))) + '" rx="4"/><text class="m1-tl" x="' + X(v) + '" y="' + (y0 + 18) + '" text-anchor="middle">' + v + '</text>'; }).join(''); }
      else {
        var N = 160, ym2 = 0, pts = []; for (var i = 0; i <= N; i++) { var xv = Pp.lo + (Pp.hi - Pp.lo) * i / N, yv = Pp.pdf(xv); pts.push([xv, yv]); ym2 = Math.max(ym2, yv); }
        var Y2 = M.scale(0, ym2 * 1.1, y0, y1);
        out += '<path class="m1-pop" d="M' + X(Pp.lo) + ' ' + y0 + pts.map(function (p) { return 'L' + X(p[0]).toFixed(1) + ' ' + Y2(p[1]).toFixed(1); }).join('') + 'L' + X(Pp.hi) + ' ' + y0 + 'Z"/>';
        out += M.axisX(X, y0, Pp.lo, Pp.hi, 6, null, en);
      }
      if (ST.last) { var lim = ST.last.slice(0, 100); out += lim.map(function (v, i) { var jit = (i * 37 % 11) - 5; return '<circle class="m1-ball" cx="' + X(Math.max(Pp.lo, Math.min(Pp.hi, v))).toFixed(1) + '" cy="' + (y0 - 9 - (i % 4) * 7 + jit * 0.3) + '" r="3.6"/>'; }).join(''); }
      out += '<text x="' + x0 + '" y="12">' + esc(PN[ST.p][li] + ' · ' + t.popT) + '</text>';
      popSvg.innerHTML = out;
    }
    function drawHist() {
      var B = bins(), Pp = P(), x0 = 54, x1 = 624, y0 = 262, y1 = 24, X = M.scale(B.r[0], B.r[1], x0, x1), mx = Math.max(1, Math.max.apply(null, B.c));
      var mu = ST.st === 'mean' ? Pp.mu : ST.n * Pp.mu, se = ST.st === 'mean' ? Pp.sd / Math.sqrt(ST.n) : Pp.sd * Math.sqrt(ST.n);
      var k = ST.xs.length, dens = function (x) { var z = (x - mu) / se; return k * B.w * Math.exp(-0.5 * z * z) / (se * Math.sqrt(2 * Math.PI)); };
      var top = Math.max(mx, k ? dens(mu) : 1) * 1.12, Y = M.scale(0, top, y0, y1);
      var out = '<line class="m1-ax" x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '"/>' + M.gridY(Y, x0, x1, 0, top, 4, en, 0);
      var lastV = ST.xs.length ? ST.xs[ST.xs.length - 1] : null, li2 = lastV == null ? -1 : Math.floor((lastV - B.s) / B.w + 1e-9);
      out += B.c.map(function (c, i) { var a = B.s + i * B.w, b = a + B.w; if (b < B.r[0] || a > B.r[1]) return ''; var xa = X(Math.max(a, B.r[0])), xb = X(Math.min(b, B.r[1])); return c ? '<rect class="m1-hist' + (i === li2 ? ' is-new' : '') + '" x="' + (xa + 0.6) + '" y="' + Y(c) + '" width="' + Math.max(1, xb - xa - 1.2) + '" height="' + (y0 - Y(c)) + '" rx="2"/>' : ''; }).join('');
      var fit = k >= 30 && (ST.n >= 5 || ST.st === 'sum');
      if (fit) { var pts = []; for (var i = 0; i <= 200; i++) { var xv = B.r[0] + (B.r[1] - B.r[0]) * i / 200; pts.push((i ? 'L' : 'M') + X(xv).toFixed(1) + ' ' + Math.max(y1 - 6, Y(dens(xv))).toFixed(1)); } out += '<path class="m1-fit" d="' + pts.join('') + '"/>'; }
      out += '<line class="m1-mu-l" x1="' + X(mu) + '" x2="' + X(mu) + '" y1="' + y0 + '" y2="' + (y1 - 4) + '"/>';
      out += M.axisX(X, y0, B.r[0], B.r[1], 8, null, en);
      out += '<text x="' + x0 + '" y="14">' + esc(fill(ST.st === 'mean' ? t.histT : t.histS, { k: k })) + '</text>' + (fit ? '<text x="' + (x1) + '" y="14" text-anchor="end" style="fill:#ff6b4a">— ' + esc(t.normal) + ' N(' + esc(num(mu, 2, en)) + '; ' + esc(num(se, 2, en)) + ')</text>' : '');
      hSvg.innerHTML = out;
    }
    function render() {
      var Pp = P(), k = ST.xs.length, mean = ST.st === 'mean';
      q('.m1-popp').innerHTML = Object.keys(PN).map(function (p) { return '<button type="button" class="m1-pill' + (p === ST.p ? ' is-on' : '') + '" data-p="' + p + '" aria-pressed="' + (p === ST.p) + '">' + esc(PN[p][li]) + '</button>'; }).join('');
      var rg = q('[data-t="n"]'), nn = q('[data-t="nn"]'); if (document.activeElement !== rg) rg.value = ST.n; if (document.activeElement !== nn) nn.value = ST.n;
      [].forEach.call(q('.m1-stat').children, function (b) { var on = b.getAttribute('data-st') === ST.st; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      var mu = mean ? Pp.mu : ST.n * Pp.mu, se = mean ? Pp.sd / Math.sqrt(ST.n) : Pp.sd * Math.sqrt(ST.n), mm = k ? S.mean(ST.xs) : NaN, sd = k > 1 ? S.sd(ST.xs) : NaN;
      q('.m1-kv').innerHTML = '<dt>' + esc(t.kv.k) + '</dt><dd><b>' + k + '</b></dd><dt>' + esc(mean ? t.kv.mm : t.kv.ms) + '</dt><dd><b>' + esc(num(mm, 3, en)) + '</b></dd><dt>' + esc(mean ? t.kv.mu : t.kv.nmu) + '</dt><dd><b>' + esc(num(mu, 3, en)) + '</b></dd>'
        + '<dt>' + esc(mean ? t.kv.sd : t.kv.sds) + '</dt><dd><b>' + esc(num(sd, 3, en)) + '</b></dd><dt>' + esc(mean ? t.kv.se : t.kv.ses) + '</dt><dd><b>' + esc(num(se, 3, en)) + '</b></dd>';
      q('.m1-sample').textContent = ST.last ? ST.last.slice(0, 40).map(function (v) { return Pp.d ? String(v) : num(v, 1, en); }).join(en ? ', ' : '; ') + (ST.last.length > 40 ? ' …' : '') + '  →  ' + (mean ? 'x̄' : 'S') + ' = ' + num(ST.xs[ST.xs.length - 1], 3, en) : '';
      var nm = mean ? (en ? 'means' : 'medias') : (en ? 'sums' : 'sumas');
      C.setStrip(nm + ' <- replicate(' + Math.max(1, k) + ', ' + (mean ? 'mean(' : 'sum(') + fill(RC[ST.p], { n: ST.n }) + '))', null);
      drawPop(); drawHist();
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-p],[data-st],[data-a]'); if (!b || !el.contains(b) || !b.closest('.m1-side')) return;
      if (b.hasAttribute('data-p')) { ST.p = b.getAttribute('data-p'); reseed(ST.seed + 1); run(200, true); }
      else if (b.hasAttribute('data-st')) { ST.st = b.getAttribute('data-st'); reseed(ST.seed + 1); run(200, true); }
      else { var a = +b.getAttribute('data-a'); if (!a) { reseed(ST.seed + 1); render(); } else run(a, a >= 100); }
    });
    var NT = null;
    el.addEventListener('input', function (e) {
      var x = e.target; if (!el.contains(x) || !x.closest('.m1-side')) return;
      var v = Math.max(1, Math.min(100, Math.round(+x.value || 1)));
      if (x.getAttribute('data-t') === 'n' || x.getAttribute('data-t') === 'nn') { ST.n = v; clearTimeout(NT); NT = setTimeout(function () { reseed(ST.seed + 1); run(300, false); }, 120); }
    });
    // ---- «Ponte a prueba»
    function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
    var CTX = [
      { es: 'La espera de la guagua tiene media 6 min y desviación típica 6 min.', en: 'The bus wait has mean 6 min and standard deviation 6 min.', mu: 6, sd: 6, ns: [36, 40, 49, 64, 100] },
      { es: 'El peso de un paquete de café tiene media 250 g y desviación típica 5 g.', en: 'The weight of a coffee pack has mean 250 g and standard deviation 5 g.', mu: 250, sd: 5, ns: [25, 30, 36, 50, 100] },
      { es: 'Las notas de un examen tienen media 6 y desviación típica 1,5.', en: 'The marks of an exam have mean 6 and standard deviation 1.5.', mu: 6, sd: 1.5, ns: [30, 36, 45, 60, 81] }
    ];
    var LV = [
      { gen: function () { var mu = pk([10, 50, 100, 6, 3.5]), sd = pk([2, 4, 5, 8, 1.5]), n = pk([16, 25, 36, 49, 64, 100, 30, 50]), v = sd / Math.sqrt(n);
        return { q: fill(t.lq1, { mu: num(mu, 2, en), sd: num(sd, 2, en), n: n }), code: 'sd(X̄) = σ / √n', ans: num(v, 3, en), norm: M.numNorm(v, 0.0015), hint: 'σ / √n = ' + num(sd, 2, en) + ' / √' + n, mode: 'decimal', st: { n: n } }; } },
      { gen: function () { var c = pk(CTX), n = pk(c.ns), se = c.sd / Math.sqrt(n), d = pk([-1.5, -1, -0.5, 0.5, 1, 1.5, 2]), cc = +(c.mu + d * se).toFixed(2), op = d > 0 ? '>' : '<';
        var v = op === '>' ? 1 - S.pnorm((cc - c.mu) / se) : S.pnorm((cc - c.mu) / se);
        return { q: fill(t.lq2, { ctx: c[lang], n: n, op: op, c: num(cc, 2, en) }), code: 'pnorm(' + cc + ', mean = ' + c.mu + ', sd = ' + c.sd + ' / sqrt(' + n + ')' + (op === '>' ? ', lower.tail = FALSE' : '') + ')', ans: v.toFixed(4).replace('.', en ? '.' : ','), norm: M.numNorm(v, 0.0006),
          hint: 'X̄ ≈ N(' + num(c.mu, 2, en) + '; ' + num(se, 3, en) + ')', mode: 'decimal' }; } },
      { gen: function () { var n = pk([10, 20, 30, 50]), mu = 3.5, sd = Math.sqrt(35 / 12), m = n * mu, s = sd * Math.sqrt(n), cc = Math.round(m + s * pk([-1.5, -1, -0.5, 0.5, 1])), v = S.pnorm((cc - m) / s);
        var ctx = en ? 'You roll ' + n + ' dice (μ = 3.5, σ = 1.708 each).' : 'Tiras ' + n + ' dados (μ = 3,5 y σ = 1,708 cada uno).';
        return { q: fill(t.lq3, { ctx: ctx, c: cc, n: n }), code: 'pnorm(' + cc + ', mean = ' + n + ' * 3.5, sd = sqrt(35/12) * sqrt(' + n + '))', ans: v.toFixed(4).replace('.', en ? '.' : ','), norm: M.numNorm(v, 0.0006), hint: 'S ≈ N(' + num(m, 2, en) + '; ' + num(s, 3, en) + ')', mode: 'decimal' }; } }
    ];
    LV.forEach(function (l, i) { l.n = [TX.es.lv[i][0], TX.en.lv[i][0]]; l.d = [TX.es.lv[i][1], TX.en.lv[i][1]]; });
    K.levels(UI, { key: 'sl_sim_tcl_niveles', need: 3, levels: LV, hl: function (s) { return esc(s); } });
    C.start();
  }
  window.SLTCL = { mount: mount, LES: LES };
  K.boot('.sl-sim[data-sim="tcl"]', mount);
})();
