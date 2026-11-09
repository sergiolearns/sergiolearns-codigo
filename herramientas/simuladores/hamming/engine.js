/* SergioLearns — Hamming en vivo (IC1, tema de papel 7). Port de kit-papel/svg_p7.py (enc, chk, flip, datos) para cualquier número
 * de bits de datos: la palabra se escribe de la posición n a la 1; los bits de paridad van en las potencias de 2 y cada uno cubre las
 * posiciones que tienen ese 1 en binario; d1 va en la posición 3, d2 en la 5… (el dato se escribe d_k … d1). Paridad par o impar.
 * Comprobado con las funciones del kit (hamming/test.py). */
(function (G) {
  function isP(i) { return (i & (i - 1)) === 0; }
  function nFor(k) { var n = 1; while (cnt(n) < k) n++; return n; }
  function cnt(n) { var c = 0; for (var i = 1; i <= n; i++) if (!isP(i)) c++; return c; }
  function dataPos(n) { var a = []; for (var i = 1; i <= n; i++) if (!isP(i)) a.push(i); return a; }
  function parPos(n) { var a = []; for (var p = 1; p <= n; p *= 2) a.push(p); return a; }
  function group(p, n) { var a = []; for (var i = 1; i <= n; i++) if (i & p) a.push(i); return a; }
  function name(i, n) { if (isP(i)) return 'p' + (Math.log2(i) + 1); return 'd' + (dataPos(n).indexOf(i) + 1); }
  /* d = 'd_k … d1' → {n, b (b[1..n]), w (palabra de n a 1), groups: [{p, pos, ones, bit}]} */
  function enc(d, par) {
    var k = d.length, n = nFor(k), b = []; for (var i = 0; i <= n; i++) b.push(0);
    var dp = dataPos(n), rev = d.split('').reverse();
    dp.forEach(function (pos, j) { b[pos] = +rev[j]; });
    var groups = parPos(n).map(function (p) {
      var pos = group(p, n).filter(function (i) { return i !== p; }), ones = pos.reduce(function (a, i) { return a + b[i]; }, 0);
      b[p] = par ? ones % 2 : 1 - ones % 2;
      return { p: p, pos: pos, ones: ones, bit: b[p] };
    });
    return { n: n, k: k, b: b, w: word(b, n), groups: groups };
  }
  function word(b, n) { var s = ''; for (var i = n; i >= 1; i--) s += b[i]; return s; }
  /* w de n a 1 → {s (síndrome), groups: [{p, pos, ones, bad}], fixed, data} */
  function chk(w, par) {
    var n = w.length, b = [0].concat(w.split('').reverse().map(Number)), s = 0;
    var groups = parPos(n).map(function (p) {
      var pos = group(p, n), ones = pos.reduce(function (a, i) { return a + b[i]; }, 0), bad = ones % 2 !== (par ? 0 : 1);
      if (bad) s += p;
      return { p: p, pos: pos, ones: ones, bad: bad };
    });
    var fb = b.slice(); if (s && s <= n) fb[s] ^= 1;
    return { n: n, s: s, out: s > n, groups: groups, fixed: word(fb, n), data: datos(word(fb, n)), raw: datos(w) };
  }
  function flip(w, pos) { var i = w.length - pos; return w.slice(0, i) + (w[i] === '0' ? '1' : '0') + w.slice(i + 1); }
  function datos(w) { var n = w.length, s = ''; for (var i = n; i >= 1; i--) if (!isP(i)) s += w[n - i]; return s; }
  var SLHam = { isP: isP, nFor: nFor, dataPos: dataPos, parPos: parPos, group: group, name: name, enc: enc, chk: chk, flip: flip, datos: datos };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLHam; else G.SLHam = SLHam;
})(typeof window !== 'undefined' ? window : this);
