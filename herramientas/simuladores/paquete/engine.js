/* SergioLearns — el viaje de un paquete: SLPaquete({datos, mss, proto, ttl}).
 * Encapsulado TCP/IP sobre Ethernet (MTU 1500): cabecera TCP 20 B o UDP 8 B, IP 20 B, Ethernet 14 B + FCS 4 B,
 * relleno hasta 46 B de carga útil. TCP trocea por el MSS; UDP manda un datagrama y, si no cabe, IP lo fragmenta
 * (fragmentos de 1480 B, desplazamiento en unidades de 8 B). Sin preámbulo. La suma de comprobación IP es la real. */
(function (G) {
  var NET = {
    pc: { ip: '10.110.7.24', mac: '3c:52:82:1a:7e:04', port: 51234 },
    fac: { a: '00:1b:21:aa:10:01', b: '00:1b:21:aa:10:02', ip: '10.110.7.1' },
    cpd: { a: '00:1b:21:c0:20:01', b: '00:1b:21:c0:20:02', ip: '10.200.1.1' },
    srv: { ip: '10.200.1.80', mac: '52:54:00:5e:01:50' }
  };
  function ip2n(s) { return s.split('.').map(Number); }
  function ipSum(len, id, ff, ttl, proto) { // suma de comprobación de la cabecera IPv4 (complemento a uno de 16 bits)
    var a = ip2n(NET.pc.ip), b = ip2n(NET.srv.ip);
    var w = [0x4500, len, id, ff, (ttl << 8) | proto, 0, (a[0] << 8) | a[1], (a[2] << 8) | a[3], (b[0] << 8) | b[1], (b[2] << 8) | b[3]];
    var s = 0; w.forEach(function (x) { s += x; });
    while (s >> 16) s = (s & 0xFFFF) + (s >> 16);
    return (~s) & 0xFFFF;
  }
  function SLPaquete(o) {
    var datos = Math.max(1, o.datos | 0), mss = Math.max(1, o.mss | 0), tcp = o.proto !== 'udp', ttl = o.ttl || 64;
    var L4 = tcp ? 20 : 8, IPH = 20, ETH = 14, FCS = 4, MTU = 1500, id0 = 0x2a10;
    var rows = [], total = 0;
    function frame(r) {
      r.pad = Math.max(0, 46 - r.dgram);
      r.frame = ETH + r.dgram + r.pad + FCS; r.bits = r.frame * 8; total += r.frame;
      r.ttls = [ttl, ttl - 1, ttl - 2];
      r.sums = r.ttls.map(function (t) { return ipSum(r.dgram, r.id, r.ff, t, tcp ? 6 : 17); });
      rows.push(r);
    }
    if (tcp) {
      var sec = 1, rest = datos, k = 0;
      while (rest > 0) {
        var d = Math.min(mss, rest);
        frame({ n: ++k, sec: sec, data: d, l4: L4, seg: d + L4, dgram: d + L4 + IPH, id: id0 + k - 1, ff: 0x4000, df: 1, mf: 0, off: 0, hasL4: true, last: rest === d });
        sec += d; rest -= d;
      }
    } else {
      var udp = datos + L4, per = Math.floor((MTU - IPH) / 8) * 8, off = 0, k2 = 0;
      while (off < udp) {
        var p = Math.min(per, udp - off), mf = off + p < udp ? 1 : 0;
        frame({ n: ++k2, sec: null, data: off === 0 ? p - L4 : p, l4: off === 0 ? L4 : 0, seg: p, dgram: p + IPH, id: id0, ff: (mf << 13) | (off / 8), df: 0, mf: mf, off: off / 8, hasL4: off === 0, last: !mf });
        off += p;
      }
    }
    var head = total - datos;
    return { tcp: tcp, datos: datos, mss: mss, L4: L4, rows: rows, total: total, head: head, pct: 100 * head / total, frag: !tcp && rows.length > 1,
      net: NET, dport: tcp ? 443 : 53, sport: NET.pc.port, ttl: ttl, maxUdp: 65507 };
  }
  SLPaquete.ipSum = ipSum; SLPaquete.NET = NET;
  if (typeof module !== 'undefined' && module.exports) module.exports = SLPaquete; else G.SLPaquete = SLPaquete;
})(this);
