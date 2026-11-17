/* SergioLearns — motor de los simuladores de ME1 (16 nov 2026): distribuciones con la misma convención que R
 * (d/p/q de binom, pois, geom, hyper, unif, exp, gamma, norm, chisq, t y f), muestreo con semilla, el teorema central
 * del límite y los intervalos de confianza. Sin dependencias; también como módulo de Node para las pruebas (test.py). */
(function (G) {
  'use strict';
  var LN_SQRT_2PI = 0.9189385332046728, EPS = 1e-15, FPMIN = 1e-300;
  // ---- funciones especiales
  var LC = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function lgamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1; var a = LC[0], t = x + 7.5;
    for (var i = 1; i < 9; i++) a += LC[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function lchoose(n, k) { return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1); }
  function lbeta(a, b) { return lgamma(a) + lgamma(b) - lgamma(a + b); }
  // P(a, x) regularizada (Numerical Recipes: serie o fracción continua)
  function gammaP(a, x) {
    if (x <= 0) return 0;
    if (!isFinite(x)) return 1;
    var gln = lgamma(a);
    if (x < a + 1) {
      var ap = a, sum = 1 / a, del = sum;
      for (var n = 0; n < 10000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * EPS) break; }
      return Math.min(1, sum * Math.exp(-x + a * Math.log(x) - gln));
    }
    return 1 - gammaQcf(a, x, gln);
  }
  function gammaQ(a, x) {
    if (x <= 0) return 1;
    if (!isFinite(x)) return 0;
    var gln = lgamma(a);
    if (x < a + 1) return 1 - gammaP(a, x);
    return gammaQcf(a, x, gln);
  }
  function gammaQcf(a, x, gln) {
    var b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
    for (var i = 1; i < 10000; i++) {
      var an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN; c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; var del = d * c; h *= del; if (Math.abs(del - 1) < EPS) break;
    }
    return Math.exp(-x + a * Math.log(x) - gln) * h;
  }
  // I_x(a, b) regularizada
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; var h = d;
    for (var m = 1; m <= 10000; m++) {
      var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
      var del = d * c; h *= del; if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }
  function betaI(a, b, x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    var bt = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lbeta(a, b));
    if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
    return 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function betaIc(a, b, x) {   // 1 − I_x(a, b) sin cancelación
    if (x <= 0) return 1; if (x >= 1) return 0;
    var bt = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lbeta(a, b));
    if (x < (a + 1) / (a + b + 2)) return 1 - bt * betacf(a, b, x) / a;
    return bt * betacf(b, a, 1 - x) / b;
  }
  // normal: Φ con erfc (W. J. Cody) y Φ⁻¹ con AS241 (la de R)
  function erfc(x) {
    var z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }
  function pnormStd(z) {   // con la serie de gammaP para tener precisión de doble
    if (z === 0) return 0.5;
    var h = 0.5 * gammaQ(0.5, z * z / 2);
    return z > 0 ? 1 - h : h;
  }
  function pnormUpper(z) { var h = 0.5 * gammaQ(0.5, z * z / 2); return z > 0 ? h : 1 - h; }
  function qnormStd(p) {
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    var q = p - 0.5, r, val;
    if (Math.abs(q) <= 0.425) {
      r = 0.180625 - q * q;
      val = q * (((((((r * 2509.0809287301226727 + 33430.575583588128105) * r + 67265.770927008700853) * r + 45921.953931549871457) * r + 13731.693765509461125) * r + 1971.5909503065514427) * r + 133.14166789178437745) * r + 3.387132872796366608)
        / (((((((r * 5226.495278852545925 + 28729.085735721942674) * r + 39307.89580009271061) * r + 21213.794301586595867) * r + 5394.1960214247511077) * r + 687.1870074920579083) * r + 42.313330701600911252) * r + 1);
      return val;
    }
    r = q < 0 ? p : 1 - p; r = Math.sqrt(-Math.log(r));
    if (r <= 5) {
      r -= 1.6;
      val = (((((((r * 7.7454501427834140764e-4 + 0.0227238449892691845833) * r + 0.24178072517745061177) * r + 1.27045825245236838258) * r + 3.64784832476320460504) * r + 5.7694972214606914055) * r + 4.6303378461565452959) * r + 1.42343711074968357734)
        / (((((((r * 1.05075007164441684324e-9 + 5.475938084995344946e-4) * r + 0.0151986665636164571966) * r + 0.14810397642748007459) * r + 0.68976733498510000455) * r + 1.6763848301838038494) * r + 2.05319162663775882187) * r + 1);
    } else {
      r -= 5;
      val = (((((((r * 2.01033439929228813265e-7 + 2.71155556874348757815e-5) * r + 0.0012426609473880784386) * r + 0.026532189526576123093) * r + 0.29656057182850489123) * r + 1.7848265399172913358) * r + 5.4637849111641143699) * r + 6.6579046435011037772)
        / (((((((r * 2.04426310338993978564e-15 + 1.4215117583164458887e-7) * r + 1.8463183175100546818e-5) * r + 7.868691311456132591e-4) * r + 0.0148753612908506148525) * r + 0.13692988092273580531) * r + 0.59983220655588793769) * r + 1);
    }
    return q < 0 ? -val : val;
  }
  // inversa genérica de una cdf continua y creciente en [lo, hi]
  function invert(cdf, p, lo, hi) {
    if (!isFinite(hi)) { hi = Math.max(1, lo + 1); while (cdf(hi) < p) hi *= 2; }
    if (!isFinite(lo)) { lo = Math.min(-1, hi - 1); while (cdf(lo) > p) lo *= 2; }
    for (var i = 0; i < 200; i++) { var m = (lo + hi) / 2; if (cdf(m) < p) lo = m; else hi = m; if (hi - lo <= 1e-13 * Math.max(1, Math.abs(m))) break; }
    return (lo + hi) / 2;
  }
  // ---- distribuciones (parámetros en el orden de R)
  function rnd(x, k) { var f = Math.pow(10, k); return Math.round(x * f) / f; }
  var DIST = {
    binom: { kind: 'd', r: 'binom', ps: [['size', 'n', 1, 60, 1, 10, 1], ['prob', 'p', 0.01, 0.99, 0.01, 0.3]],
      pmf: function (x, P) { var n = P.size, p = P.prob; if (x < 0 || x > n || x !== Math.floor(x)) return 0; if (p === 0) return x === 0 ? 1 : 0; if (p === 1) return x === n ? 1 : 0; return Math.exp(lchoose(n, x) + x * Math.log(p) + (n - x) * Math.log(1 - p)); },
      cdf: function (x, P) { x = Math.floor(x); if (x < 0) return 0; if (x >= P.size) return 1; return betaIc(x + 1, P.size - x, P.prob); },
      sup: function (P) { return [0, P.size]; }, mean: function (P) { return P.size * P.prob; }, var: function (P) { return P.size * P.prob * (1 - P.prob); } },
    pois: { kind: 'd', r: 'pois', ps: [['lambda', 'λ', 0.1, 30, 0.1, 4]],
      pmf: function (x, P) { if (x < 0 || x !== Math.floor(x)) return 0; return Math.exp(-P.lambda + x * Math.log(P.lambda) - lgamma(x + 1)); },
      cdf: function (x, P) { x = Math.floor(x); if (x < 0) return 0; return gammaQ(x + 1, P.lambda); },
      sup: function (P) { return [0, Math.max(6, Math.ceil(P.lambda + 4.5 * Math.sqrt(P.lambda) + 2))]; }, mean: function (P) { return P.lambda; }, var: function (P) { return P.lambda; } },
    geom: { kind: 'd', r: 'geom', ps: [['prob', 'p', 0.02, 0.98, 0.01, 0.2]],
      pmf: function (x, P) { if (x < 0 || x !== Math.floor(x)) return 0; return P.prob * Math.pow(1 - P.prob, x); },
      cdf: function (x, P) { x = Math.floor(x); if (x < 0) return 0; return 1 - Math.pow(1 - P.prob, x + 1); },
      sup: function (P) { return [0, Math.max(6, Math.ceil(Math.log(0.005) / Math.log(1 - P.prob)))]; }, mean: function (P) { return (1 - P.prob) / P.prob; }, var: function (P) { return (1 - P.prob) / (P.prob * P.prob); } },
    hyper: { kind: 'd', r: 'hyper', ps: [['m', 'm', 1, 60, 1, 7, 1], ['n', 'n', 1, 60, 1, 13, 1], ['k', 'k', 1, 60, 1, 5, 1]],
      fix: function (P) { if (P.k > P.m + P.n) P.k = P.m + P.n; return P; },
      pmf: function (x, P) { var lo = Math.max(0, P.k - P.n), hi = Math.min(P.k, P.m); if (x < lo || x > hi || x !== Math.floor(x)) return 0; return Math.exp(lchoose(P.m, x) + lchoose(P.n, P.k - x) - lchoose(P.m + P.n, P.k)); },
      cdf: function (x, P) { x = Math.floor(x); var s = 0, lo = Math.max(0, P.k - P.n); for (var i = lo; i <= x; i++) s += this.pmf(i, P); return Math.min(1, s); },
      sup: function (P) { return [Math.max(0, P.k - P.n), Math.min(P.k, P.m)]; }, mean: function (P) { return P.k * P.m / (P.m + P.n); },
      var: function (P) { var N = P.m + P.n; return P.k * (P.m / N) * (P.n / N) * (N - P.k) / (N - 1 || 1); } },
    unif: { kind: 'c', r: 'unif', ps: [['min', 'a', -20, 50, 0.5, 0], ['max', 'b', -20, 60, 0.5, 10]],
      fix: function (P) { if (P.max <= P.min) P.max = P.min + 1; return P; },
      pdf: function (x, P) { return x < P.min || x > P.max ? 0 : 1 / (P.max - P.min); },
      cdf: function (x, P) { return x <= P.min ? 0 : x >= P.max ? 1 : (x - P.min) / (P.max - P.min); },
      q: function (p, P) { return P.min + p * (P.max - P.min); },
      sup: function (P) { var w = P.max - P.min; return [P.min - 0.15 * w, P.max + 0.15 * w]; }, mean: function (P) { return (P.min + P.max) / 2; }, var: function (P) { return Math.pow(P.max - P.min, 2) / 12; } },
    exp: { kind: 'c', r: 'exp', ps: [['rate', 'λ', 0.02, 5, 0.01, 0.5]],
      pdf: function (x, P) { return x < 0 ? 0 : P.rate * Math.exp(-P.rate * x); },
      cdf: function (x, P) { return x <= 0 ? 0 : 1 - Math.exp(-P.rate * x); },
      up: function (x, P) { return x <= 0 ? 1 : Math.exp(-P.rate * x); },
      q: function (p, P) { return -Math.log(1 - p) / P.rate; },
      sup: function (P) { return [0, -Math.log(0.004) / P.rate]; }, mean: function (P) { return 1 / P.rate; }, var: function (P) { return 1 / (P.rate * P.rate); } },
    gamma: { kind: 'c', r: 'gamma', ps: [['shape', 'α', 0.2, 30, 0.1, 2], ['rate', 'β', 0.05, 5, 0.01, 0.5]],
      pdf: function (x, P) { if (x < 0) return 0; if (x === 0) return P.shape === 1 ? P.rate : P.shape < 1 ? Infinity : 0; return Math.exp(P.shape * Math.log(P.rate) + (P.shape - 1) * Math.log(x) - P.rate * x - lgamma(P.shape)); },
      cdf: function (x, P) { return x <= 0 ? 0 : gammaP(P.shape, P.rate * x); },
      up: function (x, P) { return x <= 0 ? 1 : gammaQ(P.shape, P.rate * x); },
      sup: function (P) { return [0, this.q(0.997, P)]; }, mean: function (P) { return P.shape / P.rate; }, var: function (P) { return P.shape / (P.rate * P.rate); } },
    norm: { kind: 'c', r: 'norm', ps: [['mean', 'μ', -50, 100, 0.1, 0], ['sd', 'σ', 0.1, 30, 0.1, 1]],
      pdf: function (x, P) { var z = (x - P.mean) / P.sd; return Math.exp(-0.5 * z * z - LN_SQRT_2PI) / P.sd; },
      cdf: function (x, P) { return pnormStd((x - P.mean) / P.sd); },
      up: function (x, P) { return pnormUpper((x - P.mean) / P.sd); },
      q: function (p, P) { return P.mean + P.sd * qnormStd(p); },
      sup: function (P) { return [P.mean - 3.8 * P.sd, P.mean + 3.8 * P.sd]; }, mean: function (P) { return P.mean; }, var: function (P) { return P.sd * P.sd; } },
    chisq: { kind: 'c', r: 'chisq', ps: [['df', 'gl', 1, 60, 1, 5, 1]],
      pdf: function (x, P) { return DIST.gamma.pdf(x, { shape: P.df / 2, rate: 0.5 }); },
      cdf: function (x, P) { return x <= 0 ? 0 : gammaP(P.df / 2, x / 2); },
      up: function (x, P) { return x <= 0 ? 1 : gammaQ(P.df / 2, x / 2); },
      sup: function (P) { return [0, this.q(0.997, P)]; }, mean: function (P) { return P.df; }, var: function (P) { return 2 * P.df; } },
    t: { kind: 'c', r: 't', ps: [['df', 'gl', 1, 120, 1, 5, 1]],
      pdf: function (x, P) { var v = P.df; return Math.exp(lgamma((v + 1) / 2) - lgamma(v / 2) - 0.5 * Math.log(v * Math.PI) - (v + 1) / 2 * Math.log(1 + x * x / v)); },
      cdf: function (x, P) { var v = P.df, h = 0.5 * betaI(v / 2, 0.5, v / (v + x * x)); return x > 0 ? 1 - h : h; },
      up: function (x, P) { var v = P.df, h = 0.5 * betaI(v / 2, 0.5, v / (v + x * x)); return x > 0 ? h : 1 - h; },
      sup: function (P) { var a = Math.min(8, Math.max(4.2, this.q(0.995, P))); return [-a, a]; }, mean: function (P) { return P.df > 1 ? 0 : NaN; }, var: function (P) { return P.df > 2 ? P.df / (P.df - 2) : NaN; } },
    f: { kind: 'c', r: 'f', ps: [['df1', 'gl₁', 1, 60, 1, 5, 1], ['df2', 'gl₂', 1, 120, 1, 10, 1]],
      pdf: function (x, P) { if (x <= 0) return 0; var a = P.df1, b = P.df2; return Math.exp(0.5 * a * Math.log(a) + 0.5 * b * Math.log(b) + (a / 2 - 1) * Math.log(x) - (a + b) / 2 * Math.log(b + a * x) - lbeta(a / 2, b / 2)); },
      cdf: function (x, P) { if (x <= 0) return 0; var a = P.df1, b = P.df2; return betaI(a / 2, b / 2, a * x / (a * x + b)); },
      up: function (x, P) { if (x <= 0) return 1; var a = P.df1, b = P.df2; return betaIc(a / 2, b / 2, a * x / (a * x + b)); },
      sup: function (P) { return [0, Math.min(12, this.q(0.99, P))]; }, mean: function (P) { return P.df2 > 2 ? P.df2 / (P.df2 - 2) : NaN; },
      var: function (P) { var a = P.df1, b = P.df2; return b > 4 ? 2 * b * b * (a + b - 2) / (a * (b - 2) * (b - 2) * (b - 4)) : NaN; } }
  };
  Object.keys(DIST).forEach(function (k) {
    var D = DIST[k]; D.k = k;
    if (D.kind === 'c' && !D.q) D.q = function (p, P) { var self = this; if (p <= 0) return k === 't' ? -Infinity : 0; if (p >= 1) return Infinity; if (k === 't') { if (p === 0.5) return 0; if (p < 0.5) return -this.q(1 - p, P); } return invert(function (x) { return self.cdf(x, P); }, p, 0, Infinity); };
    if (!D.up) D.up = function (x, P) { return 1 - this.cdf(x, P); };
    if (D.kind === 'd') {
      D.pdf = D.pmf;
      D.q = function (p, P) {   // el menor x con F(x) ≥ p (como R, con un margen de 1e-12)
        var s = this.sup(P), x = s[0];
        if (p <= 0) return x;
        var lim = k === 'pois' || k === 'geom' ? 1e7 : s[1];
        for (; x < lim; x++) if (this.cdf(x, P) >= p * (1 - 1e-12)) return x;
        return lim;
      };
    }
  });
  function params(k, P) {   // completa y acota los parámetros
    var D = DIST[k], o = {};
    D.ps.forEach(function (s) { var v = P && P[s[0]] != null ? +P[s[0]] : s[5]; if (!isFinite(v)) v = s[5]; v = Math.max(s[2], Math.min(s[3], v)); if (s[6]) v = Math.round(v); o[s[0]] = v; });
    return D.fix ? D.fix(o) : o;
  }
  // ---- formato y llamadas de R
  function num(x, k, en) {   // número para leer (coma decimal en español)
    if (x == null || isNaN(x)) return '—';
    if (!isFinite(x)) return x > 0 ? '∞' : '−∞';
    var s = (Math.abs(x) < 1e-4 && x !== 0) ? x.toExponential(2).replace('e', ' · 10^') : String(+x.toFixed(k == null ? 4 : k));
    s = s.replace('-', '−');
    return en ? s : s.replace('.', ',');
  }
  function rnum(x) {   // número como lo escribe R en el código
    if (Math.abs(x - Math.round(x)) < 1e-12) return String(Math.round(x));
    return String(+x.toFixed(6));
  }
  function rargs(k, P) { return DIST[k].ps.map(function (s) { return s[0] + ' = ' + rnum(P[s[0]]); }).join(', '); }
  // pregunta → { v, calls: ['pbinom(3, ...)'], lo, hi, kind } (lo/hi: lo que se sombrea)
  function ask(k, P, Q) {
    var D = DIST[k], a = +Q.a, b = +Q.b, p = +Q.p, A = rargs(k, P), r = D.r, dis = D.kind === 'd', o = { kind: Q.t };
    if (dis) { a = Math.round(a); b = Math.round(b); }
    switch (Q.t) {
      case 'le': o.v = D.cdf(a, P); o.calls = ['p' + r + '(' + rnum(a) + ', ' + A + ')']; o.lo = -Infinity; o.hi = a; break;
      case 'gt': o.v = dis ? D.up(a, P) : D.up(a, P); o.calls = ['p' + r + '(' + rnum(a) + ', ' + A + ', lower.tail = FALSE)', '1 - p' + r + '(' + rnum(a) + ', ' + A + ')']; o.lo = dis ? a + 1 : a; o.hi = Infinity; break;
      case 'ge':   // solo discretas: P(X ≥ a) = 1 − F(a − 1)
        o.v = 1 - D.cdf(a - 1, P); o.calls = ['1 - p' + r + '(' + rnum(a - 1) + ', ' + A + ')', 'p' + r + '(' + rnum(a - 1) + ', ' + A + ', lower.tail = FALSE)']; o.lo = a; o.hi = Infinity; break;
      case 'eq': o.v = D.pdf(a, P); o.calls = ['d' + r + '(' + rnum(a) + ', ' + A + ')']; o.lo = a; o.hi = a; break;
      case 'ab':
        if (b < a) { var t = a; a = b; b = t; }
        if (dis) { o.v = D.cdf(b, P) - D.cdf(a - 1, P); o.calls = ['p' + r + '(' + rnum(b) + ', ' + A + ') - p' + r + '(' + rnum(a - 1) + ', ' + A + ')', 'sum(d' + r + '(' + rnum(a) + ':' + rnum(b) + ', ' + A + '))']; }
        else { o.v = D.cdf(b, P) - D.cdf(a, P); o.calls = ['p' + r + '(' + rnum(b) + ', ' + A + ') - p' + r + '(' + rnum(a) + ', ' + A + ')']; }
        o.lo = a; o.hi = b; break;
      case 'q':
        p = Math.max(0.0001, Math.min(0.9999, p)); o.v = D.q(p, P); o.calls = ['q' + r + '(' + rnum(p) + ', ' + A + ')']; o.lo = -Infinity; o.hi = o.v; o.p = p; break;
    }
    o.a = a; o.b = b;
    return o;
  }
  // ---- aleatoriedad con semilla (mulberry32) y poblaciones del TCL
  function rng(seed) {
    var s = (seed >>> 0) || 1;
    var f = function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    f.norm = function () { var u = 0, v = 0; while (u === 0) u = f(); while (v === 0) v = f(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    return f;
  }
  // poblaciones: valores posibles para dibujarlas y cómo sacar uno
  var POP = {
    dado: { mu: 3.5, sd: Math.sqrt(35 / 12), d: true, lo: 0.5, hi: 6.5, draw: function (R) { return 1 + Math.floor(R() * 6); }, pdf: function (x) { return x >= 1 && x <= 6 && x === Math.floor(x) ? 1 / 6 : 0; }, xs: [1, 2, 3, 4, 5, 6] },
    unif: { mu: 5, sd: 10 / Math.sqrt(12), d: false, lo: 0, hi: 10, draw: function (R) { return 10 * R(); }, pdf: function (x) { return x >= 0 && x <= 10 ? 0.1 : 0; } },
    espera: { mu: 6, sd: 6, d: false, lo: 0, hi: 30, draw: function (R) { return -6 * Math.log(1 - R()); }, pdf: function (x) { return x < 0 ? 0 : Math.exp(-x / 6) / 6; } },
    moneda: { mu: 0.2, sd: Math.sqrt(0.16), d: true, lo: -0.5, hi: 1.5, draw: function (R) { return R() < 0.2 ? 1 : 0; }, pdf: function (x) { return x === 1 ? 0.2 : x === 0 ? 0.8 : 0; }, xs: [0, 1] },
    bimodal: { mu: 5, sd: Math.sqrt(0.6 * 0.6 + 9), d: false, lo: 0, hi: 10, draw: function (R) { return (R() < 0.5 ? 2 : 8) + 0.6 * R.norm(); }, pdf: function (x) { var z1 = (x - 2) / 0.6, z2 = (x - 8) / 0.6; return 0.5 * (Math.exp(-0.5 * z1 * z1) + Math.exp(-0.5 * z2 * z2)) / (0.6 * Math.sqrt(2 * Math.PI)); } }
  };
  function sample(pop, n, R) { var P = POP[pop], s = []; for (var i = 0; i < n; i++) s.push(P.draw(R)); return s; }
  function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
  function sdv(a) { var m = mean(a), s = 0; for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / (a.length - 1)); }
  // ---- intervalos de confianza para μ (σ conocida → z; desconocida → t con n − 1) y para p
  function ci(x, o) {   // x: muestra; o: { conf, sigma (o null), kind: 'mu' | 'p' }
    var n = x.length, al = 1 - o.conf, m = mean(x), r = { n: n, m: m };
    if (o.kind === 'p') { var ph = m, se = Math.sqrt(ph * (1 - ph) / n), z = qnormStd(1 - al / 2); r.q = z; r.se = se; r.lo = ph - z * se; r.hi = ph + z * se; r.st = 'z'; return r; }
    if (o.sigma) { r.q = qnormStd(1 - al / 2); r.se = o.sigma / Math.sqrt(n); r.st = 'z'; }
    else { r.s = sdv(x); r.q = DIST.t.q(1 - al / 2, { df: n - 1 }); r.se = r.s / Math.sqrt(n); r.st = 't'; }
    r.lo = m - r.q * r.se; r.hi = m + r.q * r.se;
    return r;
  }
  var API = { DIST: DIST, params: params, ask: ask, num: num, rnum: rnum, rargs: rargs, rng: rng, POP: POP, sample: sample, mean: mean, sd: sdv, ci: ci,
    lgamma: lgamma, gammaP: gammaP, gammaQ: gammaQ, betaI: betaI, pnorm: pnormStd, qnorm: qnormStd, rnd: rnd };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else G.SLST = API;
})(typeof window !== 'undefined' ? window : this);
