/* SergioLearns — simulador de reemplazo de páginas: SLPaginas(cadena, marcos, algoritmo)
 * algoritmo: "fifo" | "lru" | "opt". Los marcos se llenan de arriba abajo; la víctima se sustituye en su marco.
 * Empates del óptimo (varias páginas que no vuelven, o que vuelven a la vez): la primera según el orden de los marcos. */
(function (G) {
  function SLPaginas(refs, nm, alg) {
    nm = Math.max(1, nm | 0);
    var fr = [], ent = [], last = [], steps = [], faults = 0, seen = {}, comp = 0;
    for (var k = 0; k < nm; k++) { fr.push(null); ent.push(-1); last.push(-1); }
    var nextUse = function (p, t) { for (var j = t + 1; j < refs.length; j++) if (refs[j] === p) return j; return Infinity; };
    refs.forEach(function (p, t) {
      var s = { t: t, p: p, hit: false, f: -1, out: null, why: null, comp: false };
      var at = fr.indexOf(p);
      if (at >= 0) {
        s.hit = true; s.f = at; last[at] = t;
      } else {
        faults++;
        if (!seen[p]) { seen[p] = 1; comp++; s.comp = true; }
        var free = fr.indexOf(null);
        if (free >= 0) { s.f = free; s.why = { k: 'free' }; }
        else {
          var v = 0, info = [];
          if (alg === 'fifo') { for (var i = 1; i < nm; i++) if (ent[i] < ent[v]) v = i; info = fr.map(function (q, i) { return ent[i]; }); }
          else if (alg === 'lru') { for (i = 1; i < nm; i++) if (last[i] < last[v]) v = i; info = fr.map(function (q, i) { return last[i]; }); }
          else { info = fr.map(function (q) { return nextUse(q, t); }); for (i = 1; i < nm; i++) if (info[i] > info[v]) v = i; }
          s.f = v; s.out = fr[v]; s.why = { k: alg, v: v, info: info, pages: fr.slice() };
        }
        fr[s.f] = p; ent[s.f] = t; last[s.f] = t;
      }
      s.frames = fr.slice();
      s.ent = ent.slice(); s.last = last.slice();
      s.next = fr.map(function (q) { return q === null ? null : nextUse(q, t); });
      steps.push(s);
    });
    var n = refs.length;
    return { steps: steps, faults: faults, hits: n - faults, n: n, comp: comp, rate: n ? faults / n : 0, frames: nm };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = SLPaginas; else G.SLPaginas = SLPaginas;
})(this);
