/* SergioLearns — rendimiento y E/S (IC1, temas de papel 12 y 15). Port de los simuladores de los artículos:
 *  cpu(clases, programas): ciclos = Σ instrucciones × CPI, CPI medio, tiempo = ciclos / F y MIPS (el comparador de compiladores);
 *  amdahl(partes): tiempo nuevo = Σ tiempo / mejora y G = antes / después, con el límite 1 / (1 − F) de cada parte;
 *  io(cfg): % de CPU de la consulta, las interrupciones y la DMA (ciclos por segundo / F) y el empate consulta = interrupciones.
 * Comprobado con los scripts de los temas 12 y 15 (rendimiento/test.py). */
(function (G) {
  /* clases: [{n, cpi}] · progs: [{n, F (Hz), cuenta: [instrucciones por clase]}] */
  function cpu(clases, progs) {
    var out = progs.map(function (p) {
      var N = 0, cy = 0, parts = clases.map(function (c, i) { var k = +p.cuenta[i] || 0, x = k * (+c.cpi || 0); N += k; cy += x; return { n: c.n, k: k, cpi: +c.cpi || 0, cy: x }; });
      var cpi = N ? cy / N : 0, T = p.F ? cy / p.F : 0, mips = T ? N / (T * 1e6) : 0;
      parts.forEach(function (x) { x.f = cy ? x.cy / cy : 0; });
      return { n: p.n, F: p.F, N: N, cy: cy, cpi: cpi, T: T, mips: mips, parts: parts };
    });
    var ok = out.filter(function (o) { return o.T > 0; });
    if (ok.length > 1) {
      var fast = ok.reduce(function (a, b) { return b.T < a.T ? b : a; }), slow = ok.reduce(function (a, b) { return b.T > a.T ? b : a; });
      var mipsBest = ok.reduce(function (a, b) { return b.mips > a.mips ? b : a; });
      return { r: out, fast: fast, slow: slow, gain: slow.T / fast.T, mipsWrong: mipsBest !== fast };
    }
    return { r: out };
  }
  /* partes: [{n, t (s), s (mejora: 1 = sin mejorar)}] */
  function amdahl(partes) {
    var T0 = 0, T1 = 0;
    var r = partes.map(function (p) { var t = +p.t || 0, s = +p.s || 1; T0 += t; var t1 = t / s; T1 += t1; return { n: p.n, t: t, s: s, t1: t1 }; });
    r.forEach(function (p) {
      p.F = T0 ? p.t / T0 : 0;
      p.alone = T0 ? T0 / (T0 - p.t + p.t / p.s) : 1;   // si solo se mejorase esta parte
      p.lim = p.F < 1 ? 1 / (1 - p.F) : Infinity;
      p.saved = p.t - p.t1;
    });
    return { r: r, T0: T0, T1: T1, G: T1 ? T0 / T1 : 0 };
  }
  function ganancia(F, S) { return 1 / ((1 - F) + F / S); }
  /* cfg: {F (Hz), cons, int, dmaP, dmaF (ciclos), rate (B/s), unit (B por consulta o interrupción), block (B por bloque de DMA), act (0-1), polls (Hz, 0 = al ritmo del dato)} */
  function io(c) {
    var F = +c.F, rate = +c.rate, unit = +c.unit || 1, block = +c.block || 1, act = c.act == null ? 1 : +c.act;
    var trozos = rate / unit, polls = +c.polls > 0 ? +c.polls : trozos;
    var cons = polls * c.cons, inte = trozos * act * c.int, dma = rate * act / block * (+c.dmaP + +c.dmaF);
    var pct = function (x) { return F ? 100 * x / F : 0; };
    return { trozos: trozos, polls: polls, cons: { cy: cons, p: pct(cons) }, int: { cy: inte, p: pct(inte) }, dma: { cy: dma, p: pct(dma), blocks: rate * act / block }, tie: c.int ? c.cons * polls / (trozos * c.int) : 0 };
  }
  var SLRend = { cpu: cpu, amdahl: amdahl, ganancia: ganancia, io: io };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLRend; else G.SLRend = SLRend;
})(typeof window !== 'undefined' ? window : this);
