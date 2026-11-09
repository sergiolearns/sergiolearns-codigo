/* SergioLearns — códigos binarios (IC1, tema de papel 6). Port de los simuladores del artículo: BCD 8421 con la suma cifra a cifra
 * y la corrección de +6 y la resta con complemento a 10 (signo = 0 + 1 + acarreo, que se descarta); Gray (a_gray, de_gray con XOR);
 * texto en ASCII, UTF-8 (las cuatro plantillas), UTF-16 y el mojibake de leer UTF-8 como Latin-1. Comprobado con codigos/test.py. */
(function (G) {
  function b4(d) { return ('000' + d.toString(2)).slice(-4); }
  function bcd(s) { return String(s).split('').map(function (c) { return b4(+c); }).join(' '); }
  /* suma cifra a cifra de dos cadenas decimales de n cifras: [{x, y, cin, s, fix, r, cout}], acarreo final y cifras */
  function suma(a, b, n) {
    a = String(a).padStart(n, '0'); b = String(b).padStart(n, '0');
    var c = 0, cols = [];
    for (var i = n - 1; i >= 0; i--) {
      var x = +a[i], y = +b[i], s = x + y + c, fix = s > 9, r = fix ? s + 6 : s;
      cols.unshift({ x: x, y: y, cin: c, s: s, fix: fix, r: r, d: r & 15, cout: r >> 4 }); c = r >> 4;
    }
    return { cols: cols, cout: c, dig: cols.map(function (k) { return k.d; }).join(''), a: a, b: b };
  }
  /* a − b con n cifras: a + C10(b); el signo es (0 + 1 + acarreo) mod 2 y su acarreo se descarta */
  function resta(a, b, n) {
    var c10 = String(Math.pow(10, n) - (+b)).padStart(n, '0').slice(-n), s = suma(a, c10, n), sg = (0 + 1 + s.cout) % 2;
    var v = sg ? -(Math.pow(10, n) - (+s.dig)) : +s.dig;
    if (sg && +s.dig === 0) v = 0;
    return { c10: c10, s: s, sign: sg, val: v };
  }
  function aGray(b) { var g = b[0]; for (var i = 1; i < b.length; i++) g += String(+b[i] ^ +b[i - 1]); return g; }
  function deGray(g) { var b = g[0]; for (var i = 1; i < g.length; i++) b += String(+g[i] ^ +b[i - 1]); return b; }
  function cambios(u, v) { var n = 0; for (var i = 0; i < u.length; i++) if (u[i] !== v[i]) n++; return n; }
  /* un carácter (punto de código) → {cp, n (bytes), tpl, bits, bytes: [..], u16} */
  function utf8(cp) {
    var n = cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4, nb = [7, 11, 16, 21][n - 1], bits = cp.toString(2).padStart(nb, '0');
    var tpl = ['0xxxxxxx', '110xxxxx 10xxxxxx', '1110xxxx 10xxxxxx 10xxxxxx', '11110xxx 10xxxxxx 10xxxxxx 10xxxxxx'][n - 1], k = 0, out = '';
    for (var i = 0; i < tpl.length; i++) out += tpl[i] === 'x' ? bits[k++] : tpl[i];
    var bytes = out.split(' ').map(function (x) { return parseInt(x, 2); });
    return { cp: cp, n: n, tpl: tpl, bits: bits, word: out, bytes: bytes, u16: cp >= 0x10000 ? 4 : 2 };
  }
  function chars(s) { var a = []; for (var c of String(s)) a.push(c); return a; }
  var L1 = {};   // Latin-1 / Windows-1252 de los bytes 0x80-0x9F que se ven en el mojibake típico
  [[0x80, '€'], [0x82, '‚'], [0x83, 'ƒ'], [0x84, '„'], [0x85, '…'], [0x86, '†'], [0x87, '‡'], [0x88, 'ˆ'], [0x89, '‰'], [0x8A, 'Š'], [0x8B, '‹'], [0x8C, 'Œ'], [0x8E, 'Ž'], [0x91, '‘'], [0x92, '’'], [0x93, '“'], [0x94, '”'], [0x95, '•'], [0x96, '–'], [0x97, '—'], [0x98, '˜'], [0x99, '™'], [0x9A, 'š'], [0x9B, '›'], [0x9C, 'œ'], [0x9E, 'ž'], [0x9F, 'Ÿ']].forEach(function (x) { L1[x[0]] = x[1]; });
  function moji(bytes) { return bytes.map(function (b) { return b < 0x80 ? String.fromCharCode(b) : (b < 0xA0 ? (L1[b] || '·') : String.fromCharCode(b)); }).join(''); }
  function latin1(bytes) { return bytes.map(function (b) { return b === 0xA0 ? ' ' : (b >= 0x80 && b < 0xA0 ? '·' : String.fromCharCode(b)); }).join(''); }
  var SLCod = { b4: b4, bcd: bcd, suma: suma, resta: resta, aGray: aGray, deGray: deGray, cambios: cambios, utf8: utf8, chars: chars, moji: moji, latin1: latin1 };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLCod; else G.SLCod = SLCod;
})(typeof window !== 'undefined' ? window : this);
