/* SergioLearns — calculadora de subredes IPv4: SLSubred("10.110.7.24/24") o SLSubred("10.110.7.24 255.255.255.0").
 * Devuelve { ok, err, ip, mask, n, net, bc, first, last, hosts, cls, priv, bytes:[...] } con enteros sin signo de 32 bits. */
(function (G) {
  var U = function (x) { return x >>> 0; };
  function parseIP(s) {
    var m = String(s).trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (!m) return null;
    var v = 0;
    for (var i = 1; i <= 4; i++) { var b = +m[i]; if (b > 255 || (m[i].length > 1 && m[i][0] === '0')) return null; v = v * 256 + b; }
    return v;
  }
  function str(v) { return [v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join('.'); }
  function maskOf(n) { return n === 0 ? 0 : U(0xFFFFFFFF << (32 - n)); }
  function prefixOf(mk) { // null si la máscara no es contigua
    var n = 0; while (n < 32 && (mk & U(1 << (31 - n)))) n++;
    return U(maskOf(n)) === U(mk) ? n : null;
  }
  function cls(ip) {
    var a = ip >>> 24;
    return a < 128 ? 'A' : a < 192 ? 'B' : a < 224 ? 'C' : a < 240 ? 'D' : 'E';
  }
  function priv(ip) {
    var a = ip >>> 24, b = (ip >>> 16) & 255;
    if (a === 10) return '10.0.0.0/8';
    if (a === 172 && b >= 16 && b < 32) return '172.16.0.0/12';
    if (a === 192 && b === 168) return '192.168.0.0/16';
    if (a === 127) return 'loop';
    return null;
  }
  function SLSubred(input, ip2) {
    var s = String(input || '').trim().replace(/\s+/g, ' '), ipS, n, mk, m;
    if ((m = s.match(/^([\d.]+)\s*\/\s*(\d{1,2})$/))) { ipS = m[1]; n = +m[2]; if (n > 32) return { ok: false, err: 'prefix' }; mk = maskOf(n); }
    else if ((m = s.match(/^([\d.]+) ([\d.]+)$/))) { ipS = m[1]; mk = parseIP(m[2]); if (mk === null) return { ok: false, err: 'mask' }; n = prefixOf(mk); if (n === null) return { ok: false, err: 'contig', mask: mk }; }
    else if ((m = s.match(/^([\d.]+)$/))) { return { ok: false, err: 'nomask' }; }
    else return { ok: false, err: 'format' };
    var ip = parseIP(ipS);
    if (ip === null) return { ok: false, err: 'ip' };
    var net = U(ip & mk), bc = U(net | U(~mk)), h = 32 - n;
    var hosts = h >= 2 ? Math.pow(2, h) - 2 : h === 1 ? 2 : 1;
    var first = h >= 2 ? net + 1 : net, last = h >= 2 ? bc - 1 : bc;
    var bytes = [];
    for (var i = 0; i < 4; i++) {
      var sh = 24 - 8 * i, a = (ip >>> sh) & 255, k = (mk >>> sh) & 255;
      bytes.push({ i: i, ip: a, mk: k, net: a & k, bc: (a & k) | (~k & 255), mixed: k !== 0 && k !== 255 });
    }
    var r = { ok: true, ip: ip, mask: mk, n: n, h: h, net: net, bc: bc, first: U(first), last: U(last), hosts: hosts, total: Math.pow(2, h),
      cls: cls(ip), priv: priv(ip), isNet: ip === net && h >= 2, isBc: ip === bc && h >= 2, bytes: bytes, str: str };
    if (ip2 != null && String(ip2).trim() !== '') {
      var b = parseIP(ip2);
      r.cmp = b === null ? { ok: false } : { ok: true, ip: b, net: U(b & mk), same: U(b & mk) === net };
    }
    return r;
  }
  SLSubred.str = str; SLSubred.parseIP = parseIP; SLSubred.maskOf = maskOf;
  if (typeof module !== 'undefined' && module.exports) module.exports = SLSubred; else G.SLSubred = SLSubred;
})(this);
