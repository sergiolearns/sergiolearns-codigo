/* SergioLearns — simulador de la caché (IC1, temas de papel 13 y 14). SLCache.sim(accesos, cfg) con el mismo modelo que
 * kit-papel/svg_p13.py (sim: mapeo directo con escrituras) y svg_p14.py (simv: asociativa por conjuntos con LRU o FIFO):
 * - cfg: {lines: líneas (bloques) de la caché, words: palabras por bloque, ways: vías (1 = directa, lines = totalmente
 *   asociativa), policy: 'lru'|'fifo', write: 'directa' (escritura directa sin ubicar) | 'post' (postescritura ubicando)}.
 * - Direcciones en bytes, palabras de 4 bytes: bloque = dir ÷ (4 · words); conjunto = bloque mod (lines ÷ ways);
 *   etiqueta = bloque ÷ conjuntos. Dentro del conjunto, el bloque nuevo ocupa la primera vía libre y, si no hay, la de su víctima.
 * - Tipo de fallo (las 3 C): obligatorio si el bloque nunca había entrado; capacidad si no está entre los últimos «lines» bloques
 *   distintos usados (también fallaría en una totalmente asociativa del mismo tamaño); conflicto en otro caso.
 * - Escritura directa: un fallo de escritura no trae el bloque (no ubica); postescritura: lo trae y lo marca modificado, y al echar
 *   un bloque modificado se escribe en memoria (wb). */
(function (G) {
  function log2(n) { var k = 0; while ((1 << k) < n) k++; return k; }
  function bits(cfg) {
    var sets = cfg.lines / cfg.ways, off = log2(4 * cfg.words), idx = log2(sets), tag = 32 - off - idx;
    var per = 1 + tag + 32 * cfg.words + (cfg.write === 'post' ? 1 : 0);
    return { byte: 2, word: log2(cfg.words), idx: idx, tag: tag, off: off, per: per, total: per * cfg.lines, data: 32 * cfg.words * cfg.lines };
  }
  function sim(acc, cfg) {
    cfg = { lines: cfg.lines | 0 || 8, words: cfg.words | 0 || 1, ways: cfg.ways | 0 || 1, policy: cfg.policy === 'fifo' ? 'fifo' : 'lru', write: cfg.write === 'post' ? 'post' : 'directa' };
    var sets = cfg.lines / cfg.ways, slots = [], dirty = [], order = [], seen = {}, rec = [], out = [];
    for (var s = 0; s < sets; s++) { slots.push(new Array(cfg.ways).fill(null)); dirty.push(new Array(cfg.ways).fill(0)); order.push([]); }
    var cnt = { acierto: 0, obligatorio: 0, capacidad: 0, conflicto: 0, wb: 0, mem: 0 };
    acc.forEach(function (x) {
      var a = typeof x === 'number' ? x : x.a, op = (typeof x === 'number' ? 'L' : x.op) || 'L';
      var blk = Math.floor(a / (4 * cfg.words)), st = blk % sets, sl = slots[st], od = order[st], ev = null, wb = false, t, way;
      var hit = sl.indexOf(blk);
      if (hit >= 0) {
        t = 'acierto'; way = hit;
        if (cfg.policy === 'lru') { od.splice(od.indexOf(blk), 1); od.push(blk); }
      } else {
        t = !seen[blk] ? 'obligatorio' : (rec.slice(-cfg.lines).indexOf(blk) < 0 ? 'capacidad' : 'conflicto');
      }
      var load = !(op === 'E' && cfg.write === 'directa');
      if (t !== 'acierto' && load) {
        var free = sl.indexOf(null);
        if (free >= 0) way = free;
        else { ev = od.shift(); way = sl.indexOf(ev); wb = !!dirty[st][way]; }
        sl[way] = blk; dirty[st][way] = 0; od.push(blk);
      }
      if (t !== 'acierto' && !load) way = -1;
      if (op === 'E' && cfg.write === 'post') dirty[st][way] = 1;
      if (load) { seen[blk] = 1; var i = rec.indexOf(blk); if (i >= 0) rec.splice(i, 1); rec.push(blk); }
      cnt[t]++; if (wb) cnt.wb++;
      out.push({ a: a, op: op, blk: blk, set: st, tag: Math.floor(blk / sets), word: Math.floor(a / 4) % cfg.words, byte: a % 4, t: t, way: way, ev: ev, wb: wb, load: load,
        state: sl.slice ? slots.map(function (r) { return r.slice(); }) : null, dirty: dirty.map(function (r) { return r.slice(); }), order: order.map(function (r) { return r.slice(); }) });
    });
    var n = acc.length, miss = n - cnt.acierto;
    return { steps: out, cfg: cfg, sets: sets, n: n, hits: cnt.acierto, misses: miss, comp: cnt.obligatorio, cap: cnt.capacidad, conf: cnt.conflicto, wb: cnt.wb, rate: n ? miss / n : 0, bits: bits(cfg) };
  }
  /* Parte una dirección: {tag, idx, word, byte} con sus bits en texto. */
  function split(a, cfg) {
    var b = bits(cfg), s = (a >>> 0).toString(2).padStart(32, '0');
    return { tag: s.slice(0, b.tag), idx: s.slice(b.tag, b.tag + b.idx), word: s.slice(b.tag + b.idx, 30), byte: s.slice(30), b: b };
  }
  var SLCache = { sim: sim, bits: bits, split: split, log2: log2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLCache; else G.SLCache = SLCache;
})(this);
