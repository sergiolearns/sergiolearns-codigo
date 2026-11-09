/* SergioLearns — un número, todas sus formas (IC1, temas de papel 2, 3 y 4). Port de los simuladores de los artículos
 * (cambio de base, binario natural, signo-magnitud y C1, complemento a 2): SLNum.parse, entera (divisiones sucesivas),
 * fraccion (multiplicaciones sucesivas, exacta con BigInt), formas (natural, SM, C1, C2 y exceso) y op (suma o resta columna
 * a columna en sin signo, SM, C1 o C2, con acarreos, la vuelta de C1 y el desbordamiento). Comprobado con numero/test.py. */
(function (G) {
  var DIG = '0123456789ABCDEF';
  var P2 = function (n) { return Math.pow(2, n); };
  /* «-58», «25,75», «0b1011», «0x2A», «0o17», «-0x3D», «0b101,11». Devuelve {neg, ip (entero), fn/fd (fracción BigInt), base, src} o null. */
  function parse(s) {
    s = String(s || '').trim().replace(/\s+/g, '').replace(/_/g, '');
    var m = /^([-+−]?)(0[bxo])?([0-9a-f]+)?(?:[.,]([0-9a-f]+))?$/i.exec(s);
    if (!m || (!m[3] && !m[4])) return null;
    var base = m[2] ? { b: 2, x: 16, o: 8 }[m[2][1].toLowerCase()] : 10, ip = m[3] || '0', fp = m[4] || '';
    var ok = new RegExp('^[' + DIG.slice(0, base) + ']*$', 'i');
    if (!ok.test(ip) || !ok.test(fp)) return null;
    var iv = 0; for (var i = 0; i < ip.length; i++) iv = iv * base + DIG.indexOf(ip[i].toUpperCase());
    if (iv > 4294967295) return null;
    var fn = 0n, fd = 1n;
    for (i = 0; i < fp.length; i++) { fn = fn * BigInt(base) + BigInt(DIG.indexOf(fp[i].toUpperCase())); fd *= BigInt(base); }
    var g = gcd(fn, fd); if (fn) { fn /= g; fd /= g; } else fd = 1n;
    var neg = (m[1] === '-' || m[1] === '−') && (iv > 0 || fn > 0n);
    return { neg: neg, ip: iv, fn: fn, fd: fd, base: base, frac: fn > 0n, src: s };
  }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  function value(p) { return (p.neg ? -1 : 1) * (p.ip + Number(p.fn) / Number(p.fd)); }
  /* divisiones sucesivas: [{n, q, r}] y las cifras (último cociente + restos al revés) */
  function entera(n, base) {
    var st = [];
    while (n >= base) { var q = Math.floor(n / base), r = n - q * base; st.push({ n: n, q: q, r: r }); n = q; }
    var dig = DIG[n] + st.map(function (x) { return DIG[x.r]; }).reverse().join('');
    return { steps: st, last: n, dig: dig };
  }
  /* multiplicaciones sucesivas de fn/fd: [{fn, fd, d}], cifras, exacta o periódica (resto que se repite) */
  function fraccion(fn, fd, base, max) {
    var st = [], seen = {}, out = '', B = BigInt(base), per = -1, o = {};
    while (fn > 0n && out.length < max) {
      var key = fn.toString(); if (per < 0 && key in seen) { per = seen[key]; o.perLen = out.length - per; }
      if (!(key in seen)) seen[key] = out.length;
      var x = fn * B, d = x / fd; st.push({ fn: fn, fd: fd, xn: x, d: Number(d) });
      out += DIG[Number(d)]; fn = x - d * fd;
    }
    if (fn > 0n && per < 0) { var k = fn.toString(); if (k in seen) { per = seen[k]; o.perLen = out.length - per; } }
    return { steps: st, dig: out, exact: fn === 0n, per: per, perLen: o.perLen || 0, rest: fn, fd: fd };
  }
  function pad(s, n) { while (s.length < n) s = '0' + s; return s; }
  function inv(b) { return b.replace(/[01]/g, function (c) { return c === '0' ? '1' : '0'; }); }
  function rng(kind, n) {
    if (kind === 'nat') return [0, P2(n) - 1];
    if (kind === 'sm' || kind === 'c1') return [-(P2(n - 1) - 1), P2(n - 1) - 1];
    return [-P2(n - 1), P2(n - 1) - 1];   // c2 y exceso 2^(n-1)
  }
  function fits(kind, x, n) { var r = rng(kind, n); return x >= r[0] && x <= r[1]; }
  function nat(x, n) { return pad(x.toString(2), n); }
  function sm(x, n) { return fits('sm', x, n) ? (x < 0 ? '1' : '0') + pad(Math.abs(x).toString(2), n - 1) : null; }
  function c1(x, n) { if (!fits('c1', x, n)) return null; var p = pad(Math.abs(x).toString(2), n); return x < 0 ? inv(p) : p; }
  function c2(x, n) { if (!fits('c2', x, n)) return null; return pad((((x % P2(n)) + P2(n)) % P2(n)).toString(2), n); }
  function exc(x, n) { if (!fits('exc', x, n)) return null; return pad((x + P2(n - 1)).toString(2), n); }
  function vNat(b) { return parseInt(b, 2); }
  function vSm(b) { var m = parseInt(b.slice(1), 2); return b[0] === '1' ? -m : m; }
  function vC1(b) { var v = -(+b[0]) * P2(b.length - 1) + (parseInt(b.slice(1), 2) || 0); return b[0] === '1' ? v + 1 : v; }
  function vC2(b) { return -(+b[0]) * P2(b.length - 1) + (parseInt(b.slice(1), 2) || 0); }
  function vExc(b) { return parseInt(b, 2) - P2(b.length - 1); }
  var VAL = { nat: vNat, sm: vSm, c1: vC1, c2: vC2, exc: vExc }, ENC = { nat: function (x, n) { return fits('nat', x, n) ? nat(x, n) : null; }, sm: sm, c1: c1, c2: c2, exc: exc };
  /* suma de dos cadenas de n bits columna a columna: {r, carry (el que ENTRA en cada columna), cout, cols} */
  function addBits(a, b) {
    var n = a.length, c = 0, r = '', cin = '', cols = [];
    for (var i = n - 1; i >= 0; i--) {
      var s = +a[i] + +b[i] + c; cols.unshift({ a: +a[i], b: +b[i], cin: c, s: s % 2, cout: s >> 1 });
      cin = String(c) + cin; r = String(s % 2) + r; c = s >> 1;
    }
    return { r: r, cin: cin, cout: c, cols: cols };
  }
  function subBits(a, b) {   // resta con préstamos (sin signo): el préstamo que ENTRA en cada columna
    var n = a.length, p = 0, r = '', cols = [];
    for (var i = n - 1; i >= 0; i--) {
      var d = +a[i] - +b[i] - p, pin = p; p = d < 0 ? 1 : 0; r = String(d + 2 * p) + r;
      cols.unshift({ a: +a[i], b: +b[i], cin: pin, s: d + 2 * p, cout: p });
    }
    return { r: r, cout: p, cols: cols };
  }
  /* A op B en la representación k con n bits. Devuelve {ok, err, kind, sub, A, B, Bop (el que se suma), rows: [...], r, val, ovf, real, cout, vuelta, ...} */
  function op(x, y, sub, k, n) {
    var o = { kind: k, sub: sub, n: n, x: x, y: y, real: sub ? x - y : x + y };
    var A = ENC[k](x, n), B = ENC[k](y, n);
    if (A === null || B === null) { o.err = A === null ? 'A' : 'B'; return o; }
    o.A = A; o.B = B;
    if (k === 'nat') {
      var s = sub ? subBits(A, B) : addBits(A, B);
      o.Bop = B; o.main = s; o.r = s.r; o.cout = s.cout; o.ovf = s.cout === 1; o.val = vNat(s.r);
    } else if (k === 'c2') {
      var Bo = sub ? pad(((vNat(inv(B)) + 1) % P2(n)).toString(2), n) : B, s2 = addBits(A, Bo);
      o.Bop = Bo; o.main = s2; o.r = s2.r; o.cout = s2.cout; o.val = vC2(s2.r);
      o.rule = A[0] === Bo[0] && s2.r[0] !== A[0];
      o.ovf = !fits('c2', o.real, n);
      o.minB = sub && y === -P2(n - 1);
    } else if (k === 'c1') {
      var Bc = sub ? inv(B) : B, s3 = addBits(A, Bc);
      o.Bop = Bc; o.main = s3; o.cout = s3.cout;
      if (s3.cout) { var v = addBits(s3.r, pad('1', n)); o.vuelta = v; o.r = v.r; } else o.r = s3.r;
      o.val = vC1(o.r); o.rule = A[0] === Bc[0] && o.r[0] !== A[0]; o.ovf = !fits('c1', o.real, n);
    } else {   // signo-magnitud: la regla de los signos sobre las magnitudes de n-1 bits
      var sa = x < 0 ? 1 : 0, sb = (sub ? -y : y) < 0 ? 1 : 0, ma = Math.abs(x), mb = Math.abs(y), m = n - 1;
      if (sub && y === 0) sb = sa;
      o.sa = sa; o.sb = sb; o.ma = ma; o.mb = mb;
      if (sa === sb) {
        var s4 = addBits(pad(ma.toString(2), m), pad(mb.toString(2), m));
        o.how = 'add'; o.main = s4; o.cout = s4.cout; o.ovf = s4.cout === 1; o.sign = sa; o.r = String(sa) + s4.r;
      } else {
        var big = ma >= mb, s5 = subBits(pad((big ? ma : mb).toString(2), m), pad((big ? mb : ma).toString(2), m));
        o.how = 'sub'; o.swap = !big; o.main = s5; o.ovf = false; o.sign = ma === mb ? 0 : (big ? sa : sb); o.r = String(o.sign) + s5.r;
      }
      o.Bop = B; o.val = vSm(o.r);
    }
    return o;
  }
  var SLNum = { DIG: DIG, parse: parse, value: value, entera: entera, fraccion: fraccion, rng: rng, fits: fits, ENC: ENC, VAL: VAL, inv: inv, pad: pad, addBits: addBits, subBits: subBits, op: op };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLNum; else G.SLNum = SLNum;
})(typeof window !== 'undefined' ? window : this);
