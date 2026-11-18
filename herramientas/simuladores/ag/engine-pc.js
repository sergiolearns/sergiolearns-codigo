/* SergioLearns — motor del simulador «Plano complejo» de AG (18 nov 2026).
 * Complejos como pares [re, im], operaciones (suma, producto, cociente, potencia, raíces n-ésimas), módulo y argumento en grados
 * y formato «bonito» para los números de clase: enteros, medios, cuartos, k·√2, k·√3 y k·√2/2, k·√3/2 (como en los apuntes). */
(function (G) {
  'use strict';
  var EPS = 1e-9;
  function C(a, b) { return [a, b || 0]; }
  function add(z, w) { return [z[0] + w[0], z[1] + w[1]]; }
  function sub(z, w) { return [z[0] - w[0], z[1] - w[1]]; }
  function mul(z, w) { return [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]]; }
  function conj(z) { return [z[0], -z[1]]; }
  function neg(z) { return [-z[0], -z[1]]; }
  function abs(z) { return Math.hypot(z[0], z[1]); }
  function div(z, w) { var d = w[0] * w[0] + w[1] * w[1]; return [(z[0] * w[0] + z[1] * w[1]) / d, (z[1] * w[0] - z[0] * w[1]) / d]; }
  function pol(r, deg) { var a = deg * Math.PI / 180; return [clean(r * Math.cos(a)), clean(r * Math.sin(a))]; }
  function clean(x) { var r = Math.round(x); return Math.abs(x - r) < 1e-10 ? r : x; }
  function arg(z) { if (abs(z) < EPS) return 0; var a = Math.atan2(z[1], z[0]) * 180 / Math.PI; a = (a + 360) % 360; return Math.abs(a - Math.round(a)) < 1e-7 ? Math.round(a) % 360 : a; }
  function pow(z, n) { var r = [1, 0]; for (var i = 0; i < n; i++) r = mul(r, z); return [clean(r[0]), clean(r[1])]; }
  function roots(w, n) {
    var R = Math.pow(abs(w), 1 / n), a = arg(w), out = [];
    for (var k = 0; k < n; k++) out.push({ k: k, z: pol(R, (a + 360 * k) / n), r: R, a: (a + 360 * k) / n });
    return out;
  }
  function quad(z) {
    if (abs(z) < EPS) return 0;
    if (Math.abs(z[1]) < EPS) return z[0] > 0 ? 'x+' : 'x-';
    if (Math.abs(z[0]) < EPS) return z[1] > 0 ? 'y+' : 'y-';
    return z[0] > 0 ? (z[1] > 0 ? 1 : 4) : (z[1] > 0 ? 2 : 3);
  }
  /* ---------- formato «de pizarra» */
  var SUP = { 2: '√2', 3: '√3', 6: '√6' };
  function frac(x, lang) {   // x racional sencillo → «3», «1/2», «−3/4»
    for (var d = 1; d <= 8; d++) { var n = Math.round(x * d); if (Math.abs(x * d - n) < 1e-9) return d === 1 ? String(n) : n + '/' + d; }
    return null;
  }
  function nice(x, lang) {   // un real con raíces de 2, 3 o 6
    if (Math.abs(x) < 1e-9) return '0';
    var s = x < 0 ? '−' : '', v = Math.abs(x), f = frac(v);
    if (f) return s + f;
    for (var q in SUP) {
      var k = v / Math.sqrt(+q), fk = frac(k);
      if (fk) { if (fk === '1') return s + SUP[q]; if (fk.indexOf('/') > 0) { var p = fk.split('/'); return s + (p[0] === '1' ? '' : p[0]) + SUP[q] + '/' + p[1]; } return s + fk + SUP[q]; }
    }
    return s + dec(v, lang);
  }
  function dec(v, lang) { var t = (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, ''); return lang === 'en' ? t : t.replace('.', ','); }
  function zs(z, lang) {   // «√3 + i», «−2i», «4», «3 − 2i»
    var a = z[0], b = z[1], A = Math.abs(a) < 1e-9, B = Math.abs(b) < 1e-9;
    if (A && B) return '0';
    var bs = nice(Math.abs(b), lang), bt = bs === '1' ? 'i' : (bs.indexOf('/') > 0 ? '(' + bs + ')i' : bs.indexOf('√') >= 0 ? bs + ' i' : bs + 'i');
    if (B) return nice(a, lang);
    if (A) return (b < 0 ? '−' : '') + bt;
    return nice(a, lang) + (b < 0 ? ' − ' : ' + ') + bt;
  }
  function deg(a, lang) { var r = Math.round(a * 10) / 10; return (Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : (lang === 'en' ? r.toFixed(1) : r.toFixed(1).replace('.', ','))) + '°'; }
  function ps(z, lang) { return nice(abs(z), lang) + '_' + deg(arg(z), lang).replace('°', ''); }   // «2_30» (el «°» lo pone la vista)
  function ml(x) {   // como el format short de MATLAB
    return (x < 0 ? '-' : '') + Math.abs(x).toFixed(4);
  }
  function mlz(z) {
    if (Math.abs(z[1]) < 1e-12) return Math.abs(z[0] - Math.round(z[0])) < 1e-12 ? String(Math.round(z[0])) : ml(z[0]);
    return ml(z[0]) + ' ' + (z[1] < 0 ? '-' : '+') + ' ' + Math.abs(z[1]).toFixed(4) + 'i';
  }
  function mlin(z) {   // un complejo escrito como se teclea en MATLAB
    var s = function (x) {
      var n = nice(Math.abs(x), 'en');
      if (/^\d+(\/\d+)?$/.test(n)) return n;
      var m = n.match(/^(\d*)√(\d)(?:\/(\d))?$/);
      if (m) return (m[1] ? m[1] + '*' : '') + 'sqrt(' + m[2] + ')' + (m[3] ? '/' + m[3] : '');
      return String(Math.round(Math.abs(x) * 10000) / 10000);
    };
    var a = z[0], b = z[1];
    if (Math.abs(b) < 1e-12) return (a < 0 ? '-' : '') + s(a);
    var bb = s(b), bt = bb === '1' ? '1i' : (/^\d+$/.test(bb) ? bb + 'i' : bb + '*1i');
    if (Math.abs(a) < 1e-12) return (b < 0 ? '-' : '') + bt;
    return (a < 0 ? '-' : '') + s(a) + (b < 0 ? ' - ' : ' + ') + bt;
  }
  function parse(s) {   // «√3 + i», «-2i», «3-2i», «2_30» o «2∠30» (polar en grados)
    if (s == null) return null;
    var t = String(s).trim().replace(/\s+/g, '').replace(/−/g, '-').replace(/,/g, '.').replace(/sqrt\((\d+(?:\.\d+)?)\)/g, '√$1').replace(/j/g, 'i');
    var mp = t.match(/^([^_∠]+)[_∠](-?\d+(?:\.\d+)?)°?$/);
    if (mp) { var r = num(mp[1]); return r == null ? null : pol(r, +mp[2]); }
    if (!t) return null;
    var re = 0, im = 0, m, rx = /([+-]?)([^+-]*)/g, ok = true, any = false;
    t = t.replace(/^\+/, '');
    var parts = t.match(/[+-]?[^+-]+/g); if (!parts) return null;
    parts.forEach(function (p) {
      var sg = p[0] === '-' ? -1 : 1, q = p.replace(/^[+-]/, '');
      if (/i$/.test(q)) { var c = q.slice(0, -1).replace(/\*$/, '').replace(/^\((.*)\)$/, '$1'); var v = c === '' ? 1 : num(c); if (v == null) ok = false; else im += sg * v; }
      else { var v2 = num(q.replace(/^\((.*)\)$/, '$1')); if (v2 == null) ok = false; else re += sg * v2; }
      any = true;
    });
    return ok && any ? [re, im] : null;
  }
  function num(s) {   // «3», «1.5», «√3», «2√3», «√3/2», «3/4»
    var m = String(s).match(/^(\d*(?:\.\d+)?)\*?(?:√(\d+(?:\.\d+)?))?(?:\/(\d+(?:\.\d+)?))?$/);
    if (!m || (!m[1] && !m[2])) return null;
    var v = (m[1] ? +m[1] : 1) * (m[2] ? Math.sqrt(+m[2]) : 1) / (m[3] ? +m[3] : 1);
    return isFinite(v) ? v : null;
  }
  G.SLPC = { C: C, add: add, sub: sub, mul: mul, div: div, conj: conj, neg: neg, abs: abs, arg: arg, pol: pol, pow: pow, roots: roots, quad: quad,
    nice: nice, zs: zs, deg: deg, ps: ps, mlz: mlz, mlin: mlin, ml: ml, parse: parse, num: num, clean: clean };
})(typeof window !== 'undefined' ? window : this);
