/* SergioLearns — interfaz del simulador de la caché (.sl-sim[data-sim="cache"]). Necesita kit.js y engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, C = window.SLCache;
  var KC = { acierto: '#16794B', obligatorio: '#5B4BDB', capacidad: '#D9651C', conflicto: '#C2362B' };
  var EX = [
    { k: 't13', ln: 8, w: 2, v: 1, p: 'lru', wr: 'directa', a: '36 100 16 32 20 176 104 96 180 108', n: ['Cuestión tipo examen (directa)', 'Exam-style question (direct-mapped)'] },
    { k: 't14', ln: 8, w: 2, v: 2, p: 'lru', wr: 'directa', a: '172 236 172 104 188 132 128 184 168 232', n: ['Cuestión tipo examen (2 vías, LRU)', 'Exam-style question (2-way, LRU)'] },
    { k: 'vec', ln: 8, w: 1, v: 1, p: 'lru', wr: 'directa', a: '0 128 4 132 8 136 12 140 0 128 4 132 8 136 12 140', n: ['Dos vectores que chocan', 'Two clashing arrays'] },
    { k: 'loc', ln: 4, w: 4, v: 1, p: 'lru', wr: 'directa', a: '0 4 8 12 16 20 24 28 32 36 40 44', n: ['Localidad espacial: un vector', 'Spatial locality: an array'] },
    { k: 'wr', ln: 4, w: 2, v: 1, p: 'lru', wr: 'post', a: '0 E4 64 0 E68 4 E128 64', n: ['Lecturas y escrituras', 'Reads and writes'] }
  ];
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'cache', oL: '--lineas', oW: '--palabras', oV: '--vias', file: 'accesos.txt',
      orgL: 'Organización', org: ['Directa', '2 vías', '4 vías', 'Total'], lnL: 'Líneas', wL: 'Palabras', polL: 'Reemplazo', wrL: 'Escritura', wr: { directa: 'Directa', post: 'Postescritura' },
      orgT: ['Mapeo directo: cada bloque tiene una sola línea posible, la de bloque mod líneas.', 'Asociativa de 2 vías: cada bloque va a un conjunto (bloque mod conjuntos) y dentro puede ocupar cualquiera de sus 2 vías.', 'Asociativa de 4 vías: conjuntos de 4 líneas.', 'Totalmente asociativa: un solo conjunto; el bloque puede ir a cualquier línea.'],
      polT: { lru: 'LRU: sale el bloque del conjunto que hace más tiempo que no se usa.', fifo: 'FIFO: sale el bloque que entró antes en el conjunto.' },
      wrT: { directa: 'Escritura directa sin ubicar: cada escritura va a memoria; un fallo de escritura no trae el bloque.', post: 'Postescritura ubicando: la escritura se queda en la caché (bit de modificación) y el bloque se escribe en memoria cuando sale.' },
      ex: 'Ejemplo', rnd: 'Aleatorio', share: 'Compartir', accL: 'Direcciones (en bytes)', accHelp: 'Decimal o 0x…, separadas por espacios o comas; una E delante para una escritura (E32). Hasta 40 accesos.', accBad: 'Escribe al menos una dirección: números de 0 a 4294967295, con E delante si es una escritura.',
      split: 'dirección partida', steps: 'paso a paso', grid: 'evolución acceso a acceso', res: 'resultados', cmp: 'compara (los mismos accesos)', start: 'Pulsa Paso para avanzar acceso a acceso, o Ejecutar para verlo entero.',
      f: { tag: 'etiqueta', idx: 'línea', set: 'conjunto', word: 'palabra', byte: 'byte' }, bitsN: '{n} bits',
      calc: 'bloque = {a} ÷ {b} = {blk} · {lin} = {blk} mod {n} = {i} · etiqueta = {blk} ÷ {n} = {tag}', calcTot: 'bloque = {a} ÷ {b} = {blk} · etiqueta = bloque = {blk} (un solo conjunto: sin índice)',
      th: { set: 'conj.', line: 'línea', way: 'vía', v: 'V', tag: 'etiqueta', blk: 'bloque', d: 'D', age: 'orden' }, ageL: { lru: 'último uso', fifo: 'entrada' },
      mem: 'M[{a}–{b}]', acc: 'acceso', type: 'tipo', out: 'sale', short: { acierto: 'acierto', obligatorio: 'oblig.', capacidad: 'capac.', conflicto: 'confl.' },
      long: { acierto: 'acierto', obligatorio: 'fallo obligatorio', capacidad: 'fallo de capacidad', conflicto: 'fallo de conflicto' },
      e: {
        intro: '{op} {a}: bloque {blk}, {where} {i}, etiqueta {tag}.', rd: 'Lee', wrt: 'Escribe', line: 'línea', set: 'conjunto',
        hit: ' La etiqueta {tag} está en {pos} y su bit de validez es 1 → <em class="ok">acierto</em>.',
        miss: ' {why} → <em class="ko">{k}</em>.', whyEmpty: 'La línea está vacía (V = 0)', whyOther: 'En {pos} está el bloque {o}, no el {blk}', whyFull: 'El conjunto no tiene el bloque {blk}',
        comp: ' Es la primera vez que se pide este bloque: ninguna caché lo evitaría.', cap: ' Ni una caché totalmente asociativa del mismo tamaño lo tendría: desde su último uso se han usado {n} bloques distintos o más.', conf: ' Una totalmente asociativa del mismo tamaño lo tendría: lo echó otro bloque que caía en el mismo sitio.',
        inFree: ' Entra en {pos}.', inEv: ' Sale el {o} ({why}) y entra en {pos}.', evLru: 'el que hace más tiempo que no se usa', evFifo: 'el que entró antes', evDir: 'el único que podía estar ahí',
        wb: ' El {o} estaba modificado (D = 1): antes se escribe en memoria.', noAlloc: ' Escritura directa sin ubicar: el dato va a memoria y el bloque no entra en la caché.', dirty: ' Postescritura: se marca D = 1; la memoria no se toca todavía.', wthru: ' Escritura directa: el dato también va a memoria.',
        end: 'Fin: {h} aciertos y {m} fallos de {n} accesos (tasa de fallos {r} %).'
      },
      rows: { n: 'accesos', h: 'aciertos', m: 'fallos', comp: '· obligatorios', cap: '· de capacidad', conf: '· de conflicto', rate: 'tasa de fallos', wbm: 'bloques escritos en memoria', wtm: 'escrituras en memoria' },
      size: 'tamaño de la caché', sizeF: '{l} líneas × ({v} V + {t} etiqueta{d} + {w} × 32 datos) = {l} × {per} = {tot} bits ({kb} de datos)', dbit: ' + 1 D',
      tmamL: 'TMAM', tH: 'tiempo de acierto', tP: 'penalización por fallo', tmamF: 'TMAM = {h} + {r} × {p} = {x} ciclos', cyc: 'ciclos',
      leg: { in: 'entra (fallo)', hit: 'ya estaba (acierto)' },
      gDesc: 'Evolución de la caché: {m} fallos de {n} accesos.',
      rules: 'Criterios de los apuntes: direcciones en bytes y palabras de 4 bytes; bloque = dirección ÷ (4 · palabras por bloque), conjunto = bloque mod conjuntos, etiqueta = bloque ÷ conjuntos. En un conjunto, el bloque nuevo ocupa la primera vía libre o la de su víctima. Tipos de fallo (las 3 C): obligatorio si el bloque nunca había entrado; de capacidad si también fallaría una caché totalmente asociativa del mismo tamaño (no está entre los últimos «líneas» bloques distintos usados); de conflicto, en otro caso. El tamaño cuenta el bit de validez, la etiqueta, los datos y, con postescritura, el bit de modificación (no los bits de LRU).',
      reto: 'Reto: clasifica tú los accesos', retoLead: 'Como en la cuestión del examen: con esta caché, haz la tabla en papel y pulsa cada acceso hasta que diga lo que es (acierto o el tipo de fallo). Después, la tasa de fallos y el tamaño total.',
      tapA: 'Pulsa cada acceso para cambiar su tipo', rR: 'tasa de fallos (%)', rB: 'tamaño total (bits)', allOk: 'Todo bien. Así se hace en el examen.', someBad: 'Revisa lo marcado en rojo: lo más común es tomar por conflicto un fallo de capacidad (cuenta los bloques distintos usados desde la última vez) o equivocarse al partir la dirección.',
      retoCols: '{a} de {n} accesos bien clasificados', unk: '?'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'cache', oL: '--lines', oW: '--words', oV: '--ways', file: 'accesses.txt',
      orgL: 'Organisation', org: ['Direct', '2-way', '4-way', 'Fully'], lnL: 'Lines', wL: 'Words', polL: 'Replacement', wrL: 'Writes', wr: { directa: 'Write-through', post: 'Write-back' },
      orgT: ['Direct-mapped: each block has a single possible line, block mod lines.', '2-way set associative: each block goes to a set (block mod sets) and can take either of its 2 ways.', '4-way set associative: sets of 4 lines.', 'Fully associative: a single set; the block can go into any line.'],
      polT: { lru: 'LRU: the block in the set unused the longest leaves.', fifo: 'FIFO: the block that came into the set first leaves.' },
      wrT: { directa: 'Write-through, no write-allocate: every write goes to memory; a write miss does not bring the block in.', post: 'Write-back with write-allocate: the write stays in the cache (dirty bit) and the block is written to memory when it leaves.' },
      ex: 'Example', rnd: 'Random', share: 'Share', accL: 'Addresses (in bytes)', accHelp: 'Decimal or 0x…, separated by spaces or commas; a W in front for a write (W32). Up to 40 accesses.', accBad: 'Type at least one address: numbers from 0 to 4294967295, with W in front for a write.',
      split: 'address split', steps: 'step by step', grid: 'access by access', res: 'results', cmp: 'compare (same accesses)', start: 'Press Step to move access by access, or Run to watch it all.',
      f: { tag: 'tag', idx: 'line', set: 'set', word: 'word', byte: 'byte' }, bitsN: '{n} bits',
      calc: 'block = {a} ÷ {b} = {blk} · {lin} = {blk} mod {n} = {i} · tag = {blk} ÷ {n} = {tag}', calcTot: 'block = {a} ÷ {b} = {blk} · tag = block = {blk} (a single set: no index)',
      th: { set: 'set', line: 'line', way: 'way', v: 'V', tag: 'tag', blk: 'block', d: 'D', age: 'order' }, ageL: { lru: 'last use', fifo: 'arrival' },
      mem: 'M[{a}–{b}]', acc: 'access', type: 'type', out: 'out', short: { acierto: 'hit', obligatorio: 'compul.', capacidad: 'capac.', conflicto: 'confl.' },
      long: { acierto: 'hit', obligatorio: 'compulsory miss', capacidad: 'capacity miss', conflicto: 'conflict miss' },
      e: {
        intro: '{op} {a}: block {blk}, {where} {i}, tag {tag}.', rd: 'Read', wrt: 'Write', line: 'line', set: 'set',
        hit: ' Tag {tag} is in {pos} and its valid bit is 1 → <em class="ok">hit</em>.',
        miss: ' {why} → <em class="ko">{k}</em>.', whyEmpty: 'The line is empty (V = 0)', whyOther: '{pos} holds block {o}, not {blk}', whyFull: 'The set does not hold block {blk}',
        comp: ' It is the first time this block is requested: no cache could avoid it.', cap: ' Not even a fully associative cache of the same size would hold it: {n} or more distinct blocks have been used since its last use.', conf: ' A fully associative cache of the same size would hold it: another block that maps to the same place evicted it.',
        inFree: ' It goes into {pos}.', inEv: ' {o} leaves ({why}) and it goes into {pos}.', evLru: 'unused the longest', evFifo: 'the first to arrive', evDir: 'the only one that could be there',
        wb: ' {o} was dirty (D = 1): it is first written to memory.', noAlloc: ' Write-through, no allocate: the data goes to memory and the block does not enter the cache.', dirty: ' Write-back: D = 1 is set; memory is not touched yet.', wthru: ' Write-through: the data also goes to memory.',
        end: 'Done: {h} hits and {m} misses out of {n} accesses (miss rate {r} %).'
      },
      rows: { n: 'accesses', h: 'hits', m: 'misses', comp: '· compulsory', cap: '· capacity', conf: '· conflict', rate: 'miss rate', wbm: 'blocks written to memory', wtm: 'writes to memory' },
      size: 'cache size', sizeF: '{l} lines × ({v} V + {t} tag{d} + {w} × 32 data) = {l} × {per} = {tot} bits ({kb} of data)', dbit: ' + 1 D',
      tmamL: 'AMAT', tH: 'hit time', tP: 'miss penalty', tmamF: 'AMAT = {h} + {r} × {p} = {x} cycles', cyc: 'cycles',
      leg: { in: 'loaded (miss)', hit: 'already there (hit)' },
      gDesc: 'Cache evolution: {m} misses out of {n} accesses.',
      rules: 'Rules from the course notes: byte addresses and 4-byte words; block = address ÷ (4 · words per block), set = block mod sets, tag = block ÷ sets. Within a set, the new block takes the first free way or its victim’s. Miss types (the 3 Cs): compulsory if the block had never been in; capacity if a fully associative cache of the same size would also miss (it is not among the last «lines» distinct blocks used); conflict otherwise. The size counts the valid bit, the tag, the data and, with write-back, the dirty bit (not the LRU bits).',
      reto: 'Challenge: classify the accesses yourself', retoLead: 'Like the exam question: with this cache, do the table on paper and tap each access until it shows what it is (a hit or the miss type). Then the miss rate and the total size.',
      tapA: 'Tap each access to change its type', rR: 'miss rate (%)', rB: 'total size (bits)', allOk: 'All correct. That is exactly how the exam goes.', someBad: 'Check what is marked in red: the most common slip is taking a capacity miss for a conflict one (count the distinct blocks used since the last time) or splitting the address wrongly.',
      retoCols: '{a} of {n} accesses classified correctly', unk: '?'
    }
  };
  var WAYS = [1, 2, 4, 0];
  function parse(s, en) {
    var out = [], bad = false;
    String(s).split(/[\s,;]+/).forEach(function (x) {
      if (!x) return;
      var m = /^([LlEeWwRr]?)(0x[0-9a-fA-F]+|\d+)$/.exec(x);
      if (!m) { bad = true; return; }
      var v = Number(m[2]); if (!(v >= 0 && v <= 0xFFFFFFFF)) { bad = true; return; }
      out.push({ a: v, op: /[EeWw]/.test(m[1]) ? 'E' : 'L' });
    });
    return { acc: out.slice(0, 40), bad: bad || !out.length };
  }
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, WCH = L === 'es' ? 'E' : 'W';
    K.title = t.title;
    var S = { ln: 8, w: 2, v: 1, p: 'lru', wr: 'directa', a: EX[0].a, ex: 't13', th: 1, tp: 20 }, R = null, ACC = [];
    (function () {
      var s = K6.hashState() || K6.store('sl_sim_cache'); if (!s) return;
      try { var o = JSON.parse(s); if ([2, 4, 8, 16, 32].indexOf(o.ln) >= 0 && [1, 2, 4, 8].indexOf(o.w) >= 0 && typeof o.a === 'string') { S.ln = o.ln; S.w = o.w; S.v = WAYS.indexOf(o.v) >= 0 ? o.v : 1; S.p = o.p === 'fifo' ? 'fifo' : 'lru'; S.wr = o.wr === 'post' ? 'post' : 'directa'; S.a = o.a.slice(0, 600); S.ex = o.ex || ''; } } catch (e) {}
    })();
    var enc = function () { return JSON.stringify({ ln: S.ln, w: S.w, v: S.v, p: S.p, wr: S.wr, a: S.a, ex: S.ex }); };
    var ways = function () { return S.v === 0 ? S.ln : Math.min(S.v, S.ln); };
    var cfg = function (v) { return { lines: S.ln, words: S.w, ways: v == null ? ways() : v, policy: S.p, write: S.wr }; };
    var pct = function (x) { return K6.num(x * 100, L, 1); };
    var exOpts = EX.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n[L === 'es' ? 0 : 1]) + '</option>'; }).join('');
    var showA = function (s) { return s.replace(/\bE(?=\d|0x)/g, WCH); };
    var ctl = '<div class="sl6-ctl"><div class="sl6-seg" role="group" aria-label="' + esc(t.orgL) + '"><span class="sl6-seg__l">' + esc(t.orgL) + '</span>' + WAYS.map(function (v, i) { return '<button type="button" data-v="' + v + '" title="' + esc(t.orgT[i]) + '">' + esc(t.org[i]) + '</button>'; }).join('') + '</div>'
      + '<div class="sl6-q"><span>' + esc(t.lnL) + '</span><button type="button" data-a="l-" aria-label="÷2">−</button><b class="sl6-ca-n" data-n="ln"></b><button type="button" data-a="l+" aria-label="×2">+</button></div>'
      + '<div class="sl6-q"><span>' + esc(t.wL) + '</span><button type="button" data-a="w-" aria-label="÷2">−</button><b class="sl6-ca-n" data-n="w"></b><button type="button" data-a="w+" aria-label="×2">+</button></div>'
      + '<div class="sl6-seg sl6-ca-pol" role="group" aria-label="' + esc(t.polL) + '"><span class="sl6-seg__l">' + esc(t.polL) + '</span><button type="button" data-p2="lru" title="' + esc(t.polT.lru) + '">LRU</button><button type="button" data-p2="fifo" title="' + esc(t.polT.fifo) + '">FIFO</button></div>'
      + '<div class="sl6-seg" role="group" aria-label="' + esc(t.wrL) + '"><span class="sl6-seg__l">' + esc(t.wrL) + '</span><button type="button" data-wr="directa" title="' + esc(t.wrT.directa) + '">' + esc(t.wr.directa) + '</button><button type="button" data-wr="post" title="' + esc(t.wrT.post) + '">' + esc(t.wr.post) + '</button></div>'
      + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exOpts + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="rnd">' + ico('dice', 16) + esc(t.rnd) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl + '<p class="sl6-desc"></p>'
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.file) + '</h3><label class="sl6-lbl" for="' + K.id + '-a">' + esc(t.accL) + '</label><input type="text" id="' + K.id + '-a" class="sl6-chain" spellcheck="false" autocomplete="off"><p class="sl6-help sl6-ca-help">' + esc(t.accHelp) + '</p>'
      + '<p class="sl6-h sl6-h--2">── ' + esc(t.split) + '</p><div class="sl6-ca-split"></div><p class="sl6-note sl6-ca-calc"></p></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-ca-tw"></div><ol class="sl6-log" aria-live="polite"></ol></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.grid) + '</h3><div class="sl6-gw sl6-ca-w"></div><p class="sl6-leg"><span><i class="sl6-sw sl6-sw--in"></i>' + esc(t.leg.in) + '</span><span><i class="sl6-sw sl6-sw--hit"></i>' + esc(t.leg.hit) + '</span>' + ['obligatorio', 'capacidad', 'conflicto'].map(function (k) { return '<span><i class="sl6-sw" style="background:' + KC[k] + '"></i>' + esc(t.long[k]) + '</span>'; }).join('') + '</p></section>'
      + '<div class="sl6-bot"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.res) + '</h3><div class="sl6-res"></div><p class="sl6-h sl6-h--2">── ' + esc(t.size) + '</p><p class="sl6-note sl6-ca-size"></p>'
      + '<p class="sl6-h sl6-h--2">── ' + esc(t.tmamL) + '</p><div class="sl6-pp-rq sl6-ca-tm"><label><span>' + esc(t.tH) + ' (' + esc(t.cyc) + ')</span><input type="number" min="0" step="0.1" data-tm="th"></label><label><span>' + esc(t.tP) + ' (' + esc(t.cyc) + ')</span><input type="number" min="0" step="1" data-tm="tp"></label></div><p class="sl6-note sl6-ca-tmam"></p></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.cmp) + '</h3><div class="sl6-cmp sl6-ca-cmp"></div></section></div>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var aIn = q('.sl6-chain'), log = q('.sl6-log');
    aIn.value = showA(S.a);
    q('[data-tm="th"]').value = S.th; q('[data-tm="tp"]').value = S.tp;
    function where() { return ways() === 1 ? t.e.line : t.e.set; }
    function pos(st, way) { return ways() === 1 ? t.e.line + ' ' + st : (S.v === 0 ? t.e.line + ' ' + way : t.e.set + ' ' + st + ', ' + (L === 'es' ? 'vía ' : 'way ') + way); }
    function aTxt(s) { return (s.op === 'E' ? WCH : '') + s.a; }
    function explain(s, k) {
      var E = t.e, prev = k > 0 ? R.steps[k - 1] : null, sl = prev ? prev.state[s.set] : new Array(ways()).fill(null);
      var h = fill(E.intro, { op: s.op === 'E' ? E.wrt : E.rd, a: '<b class="sl6-pg-p">' + s.a + '</b>', blk: s.blk, where: where(), i: S.v === 0 ? '0' : s.set, tag: s.tag });
      if (s.t === 'acierto') { h += fill(E.hit, { tag: s.tag, pos: pos(s.set, s.way) }); if (s.op === 'E') h += S.wr === 'post' ? E.dirty : E.wthru; return h; }
      var why = ways() === 1 ? (sl[0] === null ? E.whyEmpty : fill(E.whyOther, { pos: pos(s.set, 0), o: sl[0], blk: s.blk })) : fill(E.whyFull, { blk: s.blk });
      h += fill(E.miss, { why: why, k: t.long[s.t] });
      h += s.t === 'obligatorio' ? E.comp : (s.t === 'capacidad' ? fill(E.cap, { n: S.ln }) : E.conf);
      if (!s.load) return h + E.noAlloc;
      if (s.wb) h += fill(E.wb, { o: s.ev });
      h += s.ev == null ? fill(E.inFree, { pos: pos(s.set, s.way) }) : fill(E.inEv, { o: s.ev, why: ways() === 1 ? E.evDir : (S.p === 'lru' ? E.evLru : E.evFifo), pos: pos(s.set, s.way) });
      if (s.op === 'E') h += S.wr === 'post' ? E.dirty : E.wthru;
      return h;
    }
    function split(k) {
      var a = k >= 0 ? R.steps[k].a : (ACC[0] ? ACC[0].a : 0), sp = C.split(a, cfg()), b = sp.b, s = k >= 0 ? R.steps[k] : C.sim([{ a: a }], cfg()).steps[0];
      var F = [['tag', sp.tag, '#FF6B4A', s.tag], [S.v === 0 ? null : (ways() === 1 ? 'idx' : 'set'), sp.idx, '#5B4BDB', s.set], ['word', sp.word, '#2F5FD0', s.word], ['byte', sp.byte, '#16794B', s.byte]];
      q('.sl6-ca-split').innerHTML = '<div class="sl6-ca-ad">' + F.filter(function (f) { return f[0] && f[1].length; }).map(function (f) {
        return '<div class="sl6-ca-fd" style="--c:' + f[2] + ';flex:' + (f[0] === 'tag' ? '3 1 0' : '1 0 74px') + '"><span class="sl6-ca-fn">' + esc(t.f[f[0]]) + ' · ' + esc(fill(t.bitsN, { n: f[1].length })) + '</span><code>' + f[1] + '</code><b>' + f[3] + '</b></div>';
      }).join('') + '</div>';
      var bb = 4 * S.w, sets = S.ln / ways();
      q('.sl6-ca-calc').textContent = S.v === 0 ? fill(t.calcTot, { a: a, b: bb, blk: s.blk }) : fill(t.calc, { a: a, b: bb, blk: s.blk, lin: ways() === 1 ? t.f.idx : t.f.set, n: sets, i: s.set, tag: s.tag });
    }
    function table(k) {
      var s = k >= 0 ? R.steps[k] : null, sets = S.ln / ways(), W = ways(), post = S.wr === 'post', th = t.th;
      var st = s ? s.state : null, dt = s ? s.dirty : null, od = s ? s.order : null;
      var h = '<table class="sl6-ca-t"><thead><tr><th>' + esc(W === 1 ? th.line : th.set) + '</th>' + (W > 1 ? '<th>' + esc(th.way) + '</th>' : '') + '<th>' + th.v + '</th><th>' + esc(th.tag) + '</th><th>' + esc(th.blk) + '</th>' + (post ? '<th>' + th.d + '</th>' : '') + (W > 1 ? '<th>' + esc(t.ageL[S.p]) + '</th>' : '') + '</tr></thead><tbody>';
      var showSets = []; for (var i = 0; i < sets; i++) showSets.push(i);
      if (S.ln > 16 && R) { var used = {}; R.steps.forEach(function (x) { used[x.set] = 1; }); showSets = showSets.filter(function (i) { return used[i]; }); }
      showSets.forEach(function (i) {
        for (var w = 0; w < W; w++) {
          var b = st ? st[i][w] : null, cur = s && s.set === i && s.way === w, cls = cur ? (s.t === 'acierto' ? ' is-hit' : ' is-in') : (s && s.set === i ? ' is-set' : '');
          var rank = b != null && od ? od[i].indexOf(b) : -1;
          h += '<tr class="sl6-ca-r' + cls + '"><th>' + (w === 0 ? i : '') + '</th>' + (W > 1 ? '<td>' + w + '</td>' : '') + '<td>' + (b == null ? 0 : 1) + '</td><td>' + (b == null ? '—' : Math.floor(b / sets)) + '</td><td>' + (b == null ? '—' : b + ' <span class="sl6-ca-m">' + fill(t.mem, { a: b * 4 * S.w, b: b * 4 * S.w + 4 * S.w - 1 }) + '</span>') + '</td>' + (post ? '<td>' + (b == null ? '—' : dt[i][w]) + '</td>' : '') + (W > 1 ? '<td>' + (rank < 0 ? '—' : (rank === 0 && od[i].length === W ? '<em class="ko">' + (rank + 1) + '</em>' : rank + 1)) + '</td>' : '') + '</tr>';
        }
      });
      q('.sl6-ca-tw').innerHTML = '<div class="sl6-res">' + h + '</tbody></table></div>';
    }
    function grid() {
      var w = q('.sl6-ca-w'), n = R.n, narrow = (w.clientWidth || 700) < 560, sets = S.ln / ways(), W = ways();
      var rowsK = []; for (var i = 0; i < sets; i++) for (var v = 0; v < W; v++) rowsK.push([i, v]);
      if (rowsK.length > 16) { var used = {}; R.steps.forEach(function (x) { used[x.set + ':' + x.way] = 1; }); rowsK = rowsK.filter(function (r) { return used[r[0] + ':' + r[1]]; }); }
      var lw = narrow ? 62 : 84, cw = Math.max(narrow ? 40 : 44, Math.min(58, Math.floor(((w.clientWidth || 700) - lw - 8) / Math.max(1, n)))), rh = 26, top = 30;
      var H = top + (rowsK.length + 2) * rh + 10, Wd = lw + cw * n + 8, id = K.id;
      var g = '<svg class="sl6-g sl6-ca" width="' + Wd + '" height="' + H + '" viewBox="0 0 ' + Wd + ' ' + H + '" role="img" aria-labelledby="' + id + '-ct"><title id="' + id + '-ct">' + esc(fill(t.gDesc, { m: R.misses, n: n })) + '</title>';
      g += '<rect class="sl6-pg-now" x="' + lw + '" y="2" width="' + cw + '" height="' + (H - 4) + '" rx="6"/>';
      var lab = function (r, s) { return '<text class="sl6-gl sl6-gl--p" x="' + (lw - 8) + '" y="' + (top + r * rh + rh / 2 + 4) + '" text-anchor="end">' + esc(s) + '</text>'; };
      rowsK.forEach(function (rk, r) { g += lab(r, W === 1 ? t.th.line + ' ' + rk[0] : (S.v === 0 ? t.th.line + ' ' + rk[1] : rk[0] + '·' + rk[1])); if (rk[1] === 0 && r > 0) g += '<line class="sl6-pg-sep" x1="' + lw + '" x2="' + (Wd - 4) + '" y1="' + (top + r * rh) + '" y2="' + (top + r * rh) + '"/>'; });
      g += '<line class="sl6-pg-sep" x1="' + lw + '" x2="' + (Wd - 4) + '" y1="' + (top + rowsK.length * rh + 2) + '" y2="' + (top + rowsK.length * rh + 2) + '"/>';
      g += lab(rowsK.length, t.type) + lab(rowsK.length + 1, t.out);
      R.steps.forEach(function (s, j) {
        var x = lw + j * cw, cx = x + cw / 2;
        g += '<g class="sl6-pg-c" data-c="' + j + '"><text class="sl6-pg-rv" x="' + cx + '" y="18" text-anchor="middle">' + esc(aTxt(s)) + '</text>';
        rowsK.forEach(function (rk, r) {
          var b = s.state[rk[0]][rk[1]], yy = top + r * rh, curC = s.set === rk[0] && s.way === rk[1];
          if (curC) g += '<rect class="sl6-pg-cell ' + (s.t === 'acierto' ? 'is-hit' : 'is-in') + '" x="' + (x + 2) + '" y="' + (yy + 3) + '" width="' + (cw - 4) + '" height="' + (rh - 6) + '" rx="5"/>';
          if (b != null) g += '<text class="sl6-pg-v' + (curC ? (s.t === 'acierto' ? ' is-hit' : ' is-in') : '') + '" x="' + cx + '" y="' + (yy + rh / 2 + 4.5) + '" text-anchor="middle">' + b + (S.wr === 'post' && s.dirty[rk[0]][rk[1]] ? '*' : '') + '</text>';
        });
        var yt = top + rowsK.length * rh + 4;
        g += '<rect x="' + (x + 3) + '" y="' + (yt + 3) + '" width="' + (cw - 6) + '" height="' + (rh - 8) + '" rx="5" fill="' + KC[s.t] + '"/><text class="sl6-ca-k" x="' + cx + '" y="' + (yt + rh / 2 + 3.5) + '" text-anchor="middle">' + esc(t.short[s.t]) + '</text>';
        if (s.ev != null) g += '<text class="sl6-pg-v sl6-ca-ev" x="' + cx + '" y="' + (yt + rh + rh / 2 + 4) + '" text-anchor="middle">' + s.ev + (s.wb ? '*' : '') + '</text>';
        g += '</g>';
      });
      w.innerHTML = g + '</svg>';
      w.classList.toggle('is-wide', Wd > w.clientWidth + 4);
    }
    function results() {
      var r = t.rows, wr = R.steps.filter(function (s) { return s.op === 'E'; }).length;
      (q('.sl6-bot .sl6-res').innerHTML = '<table><tbody><tr><th>' + esc(r.n) + '</th><td>' + R.n + '</td></tr><tr><th>' + esc(r.h) + '</th><td>' + R.hits + '</td></tr><tr><th>' + esc(r.m) + '</th><td>' + R.misses + '</td></tr><tr><th class="sl6-ca-sub">' + esc(r.comp) + '</th><td>' + R.comp + '</td></tr><tr><th class="sl6-ca-sub">' + esc(r.cap) + '</th><td>' + R.cap + '</td></tr><tr><th class="sl6-ca-sub">' + esc(r.conf) + '</th><td>' + R.conf + '</td></tr>'
        + (wr ? '<tr><th>' + esc(S.wr === 'post' ? r.wbm : r.wtm) + '</th><td>' + (S.wr === 'post' ? R.wb : wr) + '</td></tr>' : '') + '</tbody><tfoot><tr><th>' + esc(r.rate) + '</th><td>' + pct(R.rate) + ' %</td></tr></tfoot></table>');
      var b = R.bits, kb = b.data / 8;
      q('.sl6-ca-size').textContent = fill(t.sizeF, { l: S.ln, v: 1, t: b.tag, d: S.wr === 'post' ? t.dbit : '', w: S.w, per: b.per, tot: b.total, kb: kb >= 1024 ? K6.num(kb / 1024, L, 2) + ' KiB' : kb + ' B' });
      tmam();
      var opts = [1, 2, 4, 0].filter(function (v) { return v === 0 || v <= S.ln; }), vals = opts.map(function (v) { return C.sim(ACC, cfg(v === 0 ? S.ln : v)).rate; }), mx = Math.max.apply(null, vals.concat([0.01]));
      q('.sl6-ca-cmp').innerHTML = opts.map(function (v, i) {
        return '<button type="button" class="sl6-cmp__r sl6-pp-cr' + (v === S.v ? ' is-on' : '') + '" data-v="' + v + '"><b>' + esc(t.org[WAYS.indexOf(v)]) + '</b><span class="sl6-cmp__b"><i style="width:' + (100 * vals[i] / mx) + '%"></i><em>' + pct(vals[i]) + ' %</em></span></button>';
      }).join('');
    }
    function tmam() {
      var h = parseFloat(q('[data-tm="th"]').value), p = parseFloat(q('[data-tm="tp"]').value);
      if (isNaN(h) || isNaN(p)) { q('.sl6-ca-tmam').textContent = ''; return; }
      S.th = h; S.tp = p;
      q('.sl6-ca-tmam').textContent = fill(t.tmamF, { h: K6.num(h, L, 2), r: K6.num(R.rate, L, 3), p: K6.num(p, L, 2), x: K6.num(h + R.rate * p, L, 2) });
    }
    K.N = function () { return R ? R.n : 0; };
    function draw(k, going) {
      if (!R) return;
      if (!log.__built) {
        var h = '<li class="sl6-log__0">' + esc(t.start) + '</li>';
        R.steps.forEach(function (s, i) { h += '<li data-k="' + i + '" hidden><span class="sl6-log__t">' + (i + 1) + ' · ' + esc(aTxt(s)) + '</span><span>' + explain(s, i) + (i === R.n - 1 ? ' ' + fill(t.e.end, { h: R.hits, m: R.misses, n: R.n, r: pct(R.rate) }) : '') + '</span></li>'; });
        log.innerHTML = h; log.__built = true;
      }
      [].forEach.call(log.querySelectorAll('li[data-k]'), function (li) { var j = +li.getAttribute('data-k'); li.hidden = !going || j > k; li.classList.toggle('is-cur', going && j === k); });
      log.querySelector('.sl6-log__0').style.display = going ? 'none' : '';
      var c = log.querySelector('.is-cur'); if (c) log.scrollTop = c.offsetTop - log.offsetTop - 8;
      var kk = going ? k : -1;
      table(kk); split(going ? k : -1);
      var sv = q('.sl6-ca'); if (sv) {
        [].forEach.call(sv.querySelectorAll('.sl6-pg-c'), function (g) { var j = +g.getAttribute('data-c'); g.classList.toggle('is-fut', going && j > k); });
        var nw = sv.querySelector('.sl6-pg-now'), lw0 = nw.__x0 == null ? (nw.__x0 = +nw.getAttribute('x')) : nw.__x0, cw = +nw.getAttribute('width');
        nw.setAttribute('x', lw0 + Math.max(0, k) * cw); nw.style.opacity = going ? 1 : 0;
      }
    }
    K.draw = draw;
    var PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('.sl6-ctl [data-v]'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-v') === S.v)); b.disabled = +b.getAttribute('data-v') > S.ln; });
      [].forEach.call(K.qa('[data-p2]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-p2') === S.p)); });
      [].forEach.call(K.qa('[data-wr]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-wr') === S.wr)); });
      q('.sl6-ca-pol').classList.toggle('is-off', ways() === 1);
      q('[data-n="ln"]').textContent = S.ln; q('[data-n="w"]').textContent = S.w;
      q('.sl6-desc').textContent = t.orgT[WAYS.indexOf(S.v)] + (ways() > 1 ? ' ' + t.polT[S.p] : '') + ' ' + t.wrT[S.wr];
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">' + esc(t.oL) + '</span> <b>' + S.ln + '</b> <span class="o">' + esc(t.oW) + '</span> <b>' + S.w + '</b> <span class="o">' + esc(t.oV) + '</span> <b>' + ways() + '</b>' + (ways() > 1 ? ' <span class="o">--' + S.p + '</span>' : '') + (S.wr === 'post' ? ' <span class="o">' + (L === 'es' ? '--postescritura' : '--write-back') + '</span>' : '') + ' ' + esc(t.file);
    }
    function update() {
      if (S.v > S.ln) S.v = 0;
      var p = parse(aIn.value);
      aIn.classList.toggle('is-bad', p.bad); q('.sl6-ca-help').textContent = p.bad ? t.accBad : t.accHelp; q('.sl6-ca-help').classList.toggle('is-bad', p.bad);
      if (p.bad) return;
      ACC = p.acc; S.a = aIn.value.replace(/\b[Ww](?=\d|0x)/g, 'E');
      R = C.sim(ACC, cfg()); log.__built = false;
      sync(); grid(); results(); PL.reset();
      K6.store('sl_sim_cache', enc()); K6.keepHash(enc());
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v],[data-p2],[data-wr],[data-a]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-v')) { S.v = +b.getAttribute('data-v'); S.ex = ''; }
      else if (b.hasAttribute('data-p2')) S.p = b.getAttribute('data-p2');
      else if (b.hasAttribute('data-wr')) S.wr = b.getAttribute('data-wr');
      else {
        var a = b.getAttribute('data-a');
        if (a === 'share') { K6.share(K, b, enc()); return; }
        if (a === 'theme') { K6.toggleTheme(K); return; }
        if (a === 'l-') S.ln = Math.max(2, S.ln / 2); else if (a === 'l+') S.ln = Math.min(32, S.ln * 2);
        else if (a === 'w-') S.w = Math.max(1, S.w / 2); else if (a === 'w+') S.w = Math.min(8, S.w * 2);
        else if (a === 'rnd') { var n = 8 + Math.floor(Math.random() * 7), base = 4 * Math.floor(Math.random() * 16), x = []; for (var i = 0; i < n; i++) x.push(Math.random() < .35 && x.length ? x[Math.floor(Math.random() * x.length)] : base + 4 * Math.floor(Math.random() * 64)); aIn.value = x.join(' '); }
        else return;
      }
      if (b.closest('.sl6-ctl') || b.closest('.sl6-cmp')) { S.ex = ''; q('.sl6-sel').value = ''; }
      update();
    });
    aIn.addEventListener('input', function () { S.ex = ''; q('.sl6-sel').value = ''; update(); });
    [].forEach.call(K.qa('[data-tm]'), function (i) { i.addEventListener('input', function () { if (R) tmam(); }); });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = EX.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.ln = x.ln; S.w = x.w; S.v = x.v; S.p = x.p; S.wr = x.wr; aIn.value = showA(x.a); update();
    });
    q('.sl6-sel').value = S.ex;
    var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { if (R) { grid(); PL.draw(); } }, 150); });
    // reto: clasificar los accesos, tasa y tamaño
    var RT = null, ORD = ['acierto', 'obligatorio', 'capacidad', 'conflicto'];
    function retoNew() {
      var ln = [4, 8][Math.floor(Math.random() * 2)], w = [1, 2, 4][Math.floor(Math.random() * 3)], v = [1, 1, 2][Math.floor(Math.random() * 3)], n = 10, base = 4 * w * Math.floor(Math.random() * 8), acc = [];
      for (var i = 0; i < n; i++) acc.push(Math.random() < .3 && acc.length ? acc[Math.floor(Math.random() * acc.length)] + 4 * Math.floor(Math.random() * w) % (4 * w) : base + 4 * Math.floor(Math.random() * (ln * w * 3)));
      var c = { lines: ln, words: w, ways: v, policy: 'lru', write: 'directa' }, r = C.sim(acc, c);
      RT = { acc: acc, c: c, r: r, ans: acc.map(function () { return -1; }) };
      var cmd = t.cmd + ' ' + t.oL + ' ' + ln + ' ' + t.oW + ' ' + w + ' ' + t.oV + ' ' + v + (v > 1 ? ' --lru' : '');
      var box = q('.sl6-reto');
      box.innerHTML = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-cmd sl6-cmd--s"><span class="sl6-ps">$</span> <code>' + esc(cmd) + '</code></p>'
        + '<p class="sl6-lbl">' + esc(t.tapA) + '</p><div class="sl6-ca-tap">' + acc.map(function (a, i) { return '<button type="button" class="sl6-ca-tb" data-t="' + i + '"><b>' + a + '</b><span>' + esc(t.unk) + '</span></button>'; }).join('') + '</div>'
        + '<div class="sl6-pp-rq"><label><span>' + esc(t.rR) + '</span><input type="number" min="0" max="100" step="any" data-rq="rate"></label><label><span>' + esc(t.rB) + '</span><input type="number" min="0" inputmode="numeric" data-rq="bits"></label></div>'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-r="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-r="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-r="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var tb = e.target.closest('[data-t]');
      if (tb) { var i = +tb.getAttribute('data-t'); RT.ans[i] = (RT.ans[i] + 1) % 4; var k = ORD[RT.ans[i]]; tb.querySelector('span').textContent = t.short[k]; tb.style.setProperty('--c', KC[k]); tb.classList.add('is-set'); tb.classList.remove('is-ok', 'is-bad'); return; }
      var b = e.target.closest('[data-r]'); if (!b) return; var a = b.getAttribute('data-r');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var good = 0;
        [].forEach.call(K.qa('[data-t]'), function (x) { var i = +x.getAttribute('data-t'), ok = RT.ans[i] >= 0 && ORD[RT.ans[i]] === RT.r.steps[i].t; x.classList.toggle('is-ok', ok); x.classList.toggle('is-bad', !ok); good += ok; });
        var ri = q('[data-rq="rate"]'), bi = q('[data-rq="bits"]'), okR = ri.value !== '' && Math.abs(parseFloat(ri.value.replace(',', '.')) - RT.r.rate * 100) < 0.051, okB = bi.value !== '' && +bi.value === RT.r.bits.total;
        ri.classList.toggle('is-ok', okR); ri.classList.toggle('is-bad', !okR); bi.classList.toggle('is-ok', okB); bi.classList.toggle('is-bad', !okB);
        q('.sl6-reto__msg').innerHTML = (good === RT.acc.length && okR && okB ? '<b>' + esc(t.allOk) + '</b>' : esc(fill(t.retoCols, { a: good, n: RT.acc.length })) + '. ' + esc(t.someBad));
      } else if (a === 'sol') {
        S.ln = RT.c.lines; S.w = RT.c.words; S.v = RT.c.ways; S.p = 'lru'; S.wr = 'directa'; S.ex = ''; q('.sl6-sel').value = ''; aIn.value = RT.acc.join(' '); update();
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    update(); retoNew();
  }
  K6.boot('.sl-sim[data-sim="cache"]', init);
})();
