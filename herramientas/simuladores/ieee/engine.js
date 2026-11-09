/* SergioLearns — explorador IEEE 754 (IC1, tema de papel 5). Con aritmética exacta (BigInt), sin pasar por el float del navegador:
 * SLIeee.encode(texto, formato) da los pasos del papel (binario, normalizar, exponente con exceso, mantisa redondeada al par más
 * cercano) y la palabra; SLIeee.decode(palabra, formato) da el valor exacto, con ceros, desnormalizados, infinitos y NaN.
 * Formatos: simple (1+8+23), doble (1+11+52), media (1+5+10) y el «cronómetro antiguo» de los ejercicios (s | exponente de 5 bits
 * en exceso 16 | 10 bits de mantisa fraccionaria 0,1xxx, con o sin bit implícito, truncando). Comprobado con struct de Python. */
(function (G) {
  var FMT = {
    simple: { e: 8, m: 23, ieee: true }, doble: { e: 11, m: 52, ieee: true }, media: { e: 5, m: 10, ieee: true },
    viejo: { e: 5, m: 10, ieee: false, bias: 16 }
  };
  function fmt(k) { var f = FMT[k]; f.n = 1 + f.e + f.m; if (f.ieee) f.bias = Math.pow(2, f.e - 1) - 1; return f; }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  function B2(n) { return 1n << BigInt(n); }
  /* «37,6875», «-9.40625», «1e-3», «0,1». Devuelve {neg, p, q} (BigInt, irreducible) o null. */
  function parse(s) {
    s = String(s || '').trim().replace(/\s+/g, '').replace(',', '.').replace('−', '-');
    var m = /^([-+]?)(\d*)(?:\.(\d*))?(?:e([-+]?\d+))?$/i.exec(s);
    if (!m || (!m[2] && !m[3])) return null;
    var ip = m[2] || '0', fp = m[3] || '', ex = m[4] ? parseInt(m[4], 10) : 0;
    if (Math.abs(ex) > 400) return null;
    var p = BigInt(ip + fp), q = 10n ** BigInt(fp.length);
    if (ex > 0) p *= 10n ** BigInt(ex); else if (ex < 0) q *= 10n ** BigInt(-ex);
    var g = gcd(p, q); if (p) { p /= g; q /= g; } else q = 1n;
    return { neg: m[1] === '-', p: p, q: q, src: s };
  }
  /* binario de p/q: parte entera y hasta k cifras fraccionarias (con las multiplicaciones) */
  function bin(p, q, k) {
    var ip = p / q, r = p % q, fb = '', mul = [];
    for (var i = 0; i < k && r > 0n; i++) { var x = r * 2n, d = x / q; mul.push({ r: r, d: Number(d) }); fb += d.toString(); r = x - d * q; }
    return { ib: ip.toString(2), fb: fb, exact: r === 0n, mul: mul };
  }
  /* exponente E con 1 <= p/q / 2^E < 2 */
  function log2(p, q) {
    var E = p.toString(2).length - q.toString(2).length;
    if (E >= 0 ? p < q * B2(E) : p * B2(-E) < q) E--;
    return E;
  }
  function encode(src, k, impl) {
    var f = fmt(k), x = typeof src === 'string' ? parse(src) : src;
    if (!x) return null;
    var o = { f: f, k: k, neg: x.neg, p: x.p, q: x.q, impl: impl !== false, steps: [] }, s = x.neg ? 1 : 0;
    o.s = s;
    if (x.p === 0n) { o.kind = 'zero'; o.E = null; o.ef = 0; o.mf = 0n; return finish(o); }
    var E = log2(x.p, x.q); o.E = E;
    o.bin = bin(x.p, x.q, Math.max(f.m + 4, 40));
    if (!f.ieee) {   // cronómetro antiguo: 0,1xxx × 2^e, exceso 16, 10 bits truncados; con implícito no se guarda el primer 1
      var e = E + 1, take = impl === false ? f.m : f.m + 1, num = x.p * B2(take), den = x.q;
      if (e >= 0) den *= B2(e); else num *= B2(-e);
      var I = num / den; o.lost = num % den !== 0n;
      var mag = I.toString(2).padStart(take, '0'); if (impl !== false) mag = mag.slice(1);
      o.e0 = e; o.ef = e + f.bias; o.mf = BigInt('0b' + mag); o.kind = 'norm';
      if (o.ef < 0) { o.kind = 'under'; o.ef = 0; o.mf = 0n; } else if (o.ef >= Math.pow(2, f.e)) { o.kind = 'over'; o.ef = Math.pow(2, f.e) - 1; o.mf = B2(f.m) - 1n; }
      return finish(o);
    }
    var Emin = 1 - f.bias, den2 = x.q, num2 = x.p, Euse = E, kind = 'norm';
    if (E < Emin) { kind = 'den'; Euse = Emin; }
    // mantisa · 2^m = x / 2^Euse · 2^m (con el 1 implícito incluido si es normal)
    var sh = f.m - Euse;
    if (sh >= 0) num2 = num2 * B2(sh); else den2 = den2 * B2(-sh);
    var M = num2 / den2, R = num2 % den2, half = R * 2n;
    o.round = { R: R, den: den2, M0: M };
    if (half > den2 || (half === den2 && (M & 1n))) M += 1n;
    o.round.up = M !== o.round.M0; o.inexact = R !== 0n;
    if (kind === 'norm' && M === B2(f.m + 1)) { M = B2(f.m); Euse++; o.carry = true; }
    if (kind === 'den' && M === B2(f.m)) { kind = 'norm'; o.carry = true; }
    o.kind = kind;
    if (kind === 'norm') { o.ef = Euse + f.bias; o.mf = M - B2(f.m); o.Eu = Euse; }
    else { o.ef = 0; o.mf = M; o.Eu = Emin; }
    if (o.ef >= Math.pow(2, f.e) - 1) { o.kind = 'inf'; o.ef = Math.pow(2, f.e) - 1; o.mf = 0n; }
    if (kind === 'den' && M === 0n) { o.kind = 'zero'; o.under = true; }
    return finish(o);
  }
  function finish(o) {
    var f = o.f;
    o.w = (BigInt(o.s) << BigInt(f.e + f.m)) | (BigInt(o.ef) << BigInt(f.m)) | o.mf;
    o.bits = o.w.toString(2).padStart(f.n, '0');
    o.hex = o.w.toString(16).toUpperCase().padStart(f.n / 4, '0');
    o.back = decode(o.w, o.k, o.impl);
    return o;
  }
  /* palabra (BigInt o hex) → {s, ef, mf, kind, p, q (valor exacto), E} */
  function decode(w, k, impl) {
    var f = fmt(k); if (typeof w === 'string') w = BigInt('0x' + w);
    var s = Number(w >> BigInt(f.e + f.m)) & 1, ef = Number((w >> BigInt(f.m)) & (B2(f.e) - 1n)), mf = w & (B2(f.m) - 1n), o = { s: s, ef: ef, mf: mf, f: f, k: k };
    var top = Math.pow(2, f.e) - 1, p, q, E;
    if (!f.ieee) {   // 0,(1)mmm × 2^(ef − 16)
      if (impl === false && mf === 0n) { o.kind = 'zero'; o.p = 0n; o.q = 1n; return o; }
      var bits = (impl === false ? '' : '1') + mf.toString(2).padStart(f.m, '0'); p = BigInt('0b' + bits); q = B2(bits.length); E = ef - f.bias;
      if (E >= 0) p *= B2(E); else q *= B2(-E);
      o.kind = 'norm'; o.E = E;
    } else if (ef === top) { o.kind = mf === 0n ? 'inf' : 'nan'; return o; }
    else if (ef === 0) { if (mf === 0n) { o.kind = 'zero'; o.p = 0n; o.q = 1n; return o; } o.kind = 'den'; E = 1 - f.bias; p = mf; q = B2(f.m); }
    else { o.kind = 'norm'; E = ef - f.bias; p = B2(f.m) + mf; q = B2(f.m); }
    if (f.ieee) { o.E = E; if (E >= 0) p *= B2(E); else q *= B2(-E); }
    var g = gcd(p, q); o.p = p / g; o.q = q / g;
    return o;
  }
  /* decimal exacto de p/q (q potencia de 2), con como mucho d cifras significativas tras la coma */
  function dec(p, q, maxd) {
    var ip = p / q, r = p % q, s = ip.toString(), fr = '', n = 0, sig = ip > 0n;
    while (r > 0n && n < (maxd || 60)) { r *= 10n; var d = r / q; fr += d.toString(); r %= q; if (sig || d > 0n) sig = true; if (sig) n++; }
    return { s: s, fr: fr, cut: r > 0n };
  }
  function limits(k, impl) {
    var f = fmt(k);
    if (!f.ieee) {   // el máximo: todo a 1 salvo el signo; el mínimo positivo (los dos): 0,1 × 2^-16
      var all = ((B2(f.e) - 1n) << BigInt(f.m)) | (B2(f.m) - 1n);
      return { max: decode(all, k, impl), minN: decode(impl === false ? B2(f.m - 1) : 0n, k, impl) };
    }
    return { max: decode(((B2(f.e) - 2n) << BigInt(f.m)) | (B2(f.m) - 1n), k), minN: decode(1n << BigInt(f.m), k), minD: decode(1n, k) };
  }
  var SLIeee = { FMT: FMT, fmt: fmt, parse: parse, bin: bin, log2: log2, encode: encode, decode: decode, dec: dec, limits: limits };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLIeee; else G.SLIeee = SLIeee;
})(typeof window !== 'undefined' ? window : this);
