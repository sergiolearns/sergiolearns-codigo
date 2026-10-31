/* SergioLearns — interfaz del simulador de reemplazo de páginas (.sl-sim[data-sim="paginas"]). Necesita kit.js y engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill;
  var ALG = ['fifo', 'lru', 'opt'], FR = [5, 9, 2, 7, 0, 4, 8], GCC = [1, 2, 1, 3, 5, 1, 2, 4, 7, 1, 4, 7, 3, 7, 4], BEL = [3, 1, 4, 2, 3, 1, 5, 3, 1, 4, 2, 5];
  var COL = { fifo: '#5B4BDB', lru: '#2F5FD0', opt: '#16794B' };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'pagina', alg: '--algoritmo', mf: '--marcos', file: 'cadena.txt', fileReto: 'reto.txt',
      algN: { fifo: 'FIFO', lru: 'LRU', opt: 'Óptimo' }, algL: 'Algoritmo', mL: 'Marcos', ex: 'Ejemplo', bel: 'Belady', rnd: 'Aleatorio',
      algT: { fifo: 'FIFO: echa la página que lleva más tiempo en memoria (la que entró antes).', lru: 'LRU: echa la página que hace más tiempo que no se usa (mira el pasado).', opt: 'Óptimo (OPT o MIN): echa la página que más tarde se volverá a pedir (mira el futuro; imposible en un SO real, sirve de vara de medir).' },
      chain: 'cadena.txt', chainL: 'Cadena de referencias', chainHelp: 'Páginas del 0 al 9 separadas por espacios o comas (hasta 30).', chainBad: 'Escribe al menos una página: números del 0 al 9.',
      steps: 'paso a paso', trace: 'traza', ref: 'ref', frame: 'marco', fault: 'fallo', out: 'fuera',
      legIn: 'entra (fallo)', legHit: 'ya estaba (acierto)', legOut: 'víctima',
      inMem: 'en memoria', aux: { fifo: 'cola de llegada →', lru: 'último uso →', opt: 'próximo uso →' }, never: 'nunca', empty: 'vacío',
      start: 'Pulsa Paso para avanzar referencia a referencia, o Ejecutar para verlo entero.',
      e: {
        hit: 'pide la {p}: está en el {fr} → <em class="ok">acierto</em>.',
        hitL: ' Su último uso pasa a t = {t}.',
        miss: 'pide la {p}: no está → <em class="ko">fallo</em>{c}.',
        comp: ' (obligatorio: es la primera vez que se pide)',
        free: ' Queda un marco libre: entra en el {fr}.',
        fifo: ' Marcos llenos: FIFO echa la {v}, que entró en t = {x}, la más antigua{others}.',
        lru: ' Marcos llenos: LRU echa la {v}, usada por última vez en t = {x}, la que más tiempo lleva sin usarse{others}.',
        opt: ' Marcos llenos: el óptimo mira hacia delante y echa la {v}, que {when}{others}.',
        optNever: 'no se vuelve a pedir', optAt: 'no se vuelve a pedir hasta t = {x}',
        tie: '; empate (ninguna vuelve): sale la primera según el orden de los marcos',
        oFifo: '{p} entró en t = {x}', oLru: '{p} en t = {x}', oOptN: 'la {p} no vuelve', oOptA: 'la {p} vuelve en t = {x}',
        end: 'Fin: {F} fallos de {n} referencias (tasa de fallos {r} %), {c} de ellos obligatorios.'
      },
      results: 'resultados', refs: 'referencias', faults: 'fallos de página', hits: 'aciertos', comp: 'fallos obligatorios', rate: 'tasa de fallos', hrate: 'tasa de aciertos',
      formula: 'tasa de fallos = fallos ÷ referencias · tasa de aciertos = aciertos ÷ referencias · los obligatorios (uno por página distinta) no los evita ningún algoritmo',
      compare: 'compara (la misma cadena)', sweep: 'fallos según el número de marcos', belady: 'Anomalía de Belady: con FIFO, {a} marcos dan {fa} fallos y {b} marcos dan {fb}. Más marcos, más fallos.', noBel: 'Con esta cadena, más marcos nunca dan más fallos.',
      rules: 'Criterios: los marcos se llenan de arriba abajo y la página nueva ocupa el marco de su víctima. En el óptimo, si varias páginas no vuelven (o vuelven a la vez), sale la primera según el orden de los marcos. Los números de marco (5, 9, 2…) son los de la teoría: da igual cuáles sean, lo que cuenta es cuántos hay.',
      gDesc: 'Traza de {a} con {m} marcos: {F} fallos de {n} referencias.',
      reto: 'Reto: marca tú los fallos', retoLead: 'Te doy una cadena, unos marcos y un algoritmo. Haz la traza en papel, pulsa las referencias que dan fallo y escribe el total y la tasa.',
      tapF: 'Pulsa las referencias que dan fallo', totF: 'fallos', totR: 'tasa de fallos (%)', allOk: 'Todo bien. Así se hace en el examen.', someBad: 'Revisa lo marcado en rojo: el error más común es olvidar que la página pedida puede estar ya en memoria.',
      retoCols: '{a} de {n} referencias bien marcadas'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'paging', alg: '--algorithm', mf: '--frames', file: 'refs.txt', fileReto: 'challenge.txt',
      algN: { fifo: 'FIFO', lru: 'LRU', opt: 'Optimal' }, algL: 'Algorithm', mL: 'Frames', ex: 'Example', bel: 'Belady', rnd: 'Random',
      algT: { fifo: 'FIFO: evicts the page that has been in memory the longest (the one that came in first).', lru: 'LRU: evicts the page that has gone unused the longest (looks at the past).', opt: 'Optimal (OPT or MIN): evicts the page that will be needed again the latest (looks at the future; impossible in a real OS, used as a yardstick).' },
      chain: 'refs.txt', chainL: 'Reference string', chainHelp: 'Pages 0 to 9 separated by spaces or commas (up to 30).', chainBad: 'Type at least one page: numbers from 0 to 9.',
      steps: 'step by step', trace: 'trace', ref: 'ref', frame: 'frame', fault: 'fault', out: 'out',
      legIn: 'loaded (fault)', legHit: 'already there (hit)', legOut: 'victim',
      inMem: 'in memory', aux: { fifo: 'arrival queue →', lru: 'last use →', opt: 'next use →' }, never: 'never', empty: 'empty',
      start: 'Press Step to move reference by reference, or Run to watch it all.',
      e: {
        hit: 'asks for {p}: it is in {fr} → <em class="ok">hit</em>.',
        hitL: ' Its last use is now t = {t}.',
        miss: 'asks for {p}: not in memory → <em class="ko">page fault</em>{c}.',
        comp: ' (compulsory: first time it is requested)',
        free: ' There is a free frame: it goes into {fr}.',
        fifo: ' Frames full: FIFO evicts {v}, which came in at t = {x}, the oldest{others}.',
        lru: ' Frames full: LRU evicts {v}, last used at t = {x}, the one unused the longest{others}.',
        opt: ' Frames full: the optimal algorithm looks ahead and evicts {v}, which {when}{others}.',
        optNever: 'is never requested again', optAt: 'is not requested again until t = {x}',
        tie: '; tie (none comes back): the first one in frame order goes',
        oFifo: '{p} came in at t = {x}', oLru: '{p} at t = {x}', oOptN: '{p} never comes back', oOptA: '{p} comes back at t = {x}',
        end: 'Done: {F} page faults out of {n} references (fault rate {r} %), {c} of them compulsory.'
      },
      results: 'results', refs: 'references', faults: 'page faults', hits: 'hits', comp: 'compulsory faults', rate: 'fault rate', hrate: 'hit rate',
      formula: 'fault rate = faults ÷ references · hit rate = hits ÷ references · no algorithm can avoid the compulsory ones (one per distinct page)',
      compare: 'compare (same string)', sweep: 'faults by number of frames', belady: 'Belady’s anomaly: with FIFO, {a} frames give {fa} faults and {b} frames give {fb}. More frames, more faults.', noBel: 'With this string, more frames never give more faults.',
      rules: 'Rules: frames fill from top to bottom and the new page takes its victim’s frame. In the optimal algorithm, if several pages never come back (or come back at the same time), the first one in frame order goes. Frame numbers (5, 9, 2…) are the ones from the theory article: which ones they are does not matter, only how many.',
      gDesc: '{a} trace with {m} frames: {F} faults out of {n} references.',
      reto: 'Challenge: mark the faults yourself', retoLead: 'Here are a reference string, some frames and an algorithm. Work out the trace on paper, tap the references that cause a fault and type the total and the rate.',
      tapF: 'Tap the references that cause a fault', totF: 'faults', totR: 'fault rate (%)', allOk: 'All correct. That is exactly how the exam goes.', someBad: 'Check what is marked in red: the most common mistake is forgetting that the requested page may already be in memory.',
      retoCols: '{a} of {n} references marked correctly'
    }
  };
  function init(el) {
    var K = K6.mount(el, '');
    var t = TX[K.lang], L = K.lang;
    K.title = t.title;
    var S = { alg: 'fifo', m: 3, r: GCC.slice() }, R = null;
    var clampR = function (a) { return a.filter(function (x) { return x >= 0 && x <= 9; }).slice(0, 30); };
    (function () { // estado compartido o guardado
      var s = K6.hashState() || K6.store('sl_sim_paginas'); if (!s) return;
      try { var o = {}; s.split(';').forEach(function (p) { var i = p.indexOf('='); o[p.slice(0, i)] = p.slice(i + 1); });
        var r = clampR((o.r || '').split('.').map(Number).filter(function (x) { return !isNaN(x); }));
        if (r.length && ALG.indexOf(o.a) >= 0) { S.alg = o.a; S.m = Math.max(1, Math.min(7, +o.m || 3)); S.r = r; } } catch (e) {}
    })();
    var enc = function () { return 'a=' + S.alg + ';m=' + S.m + ';r=' + S.r.join('.'); };
    var pct = function (x) { return K6.num(x * 100, L, 1); };
    var ctl = '<div class="sl6-ctl"><div class="sl6-seg" role="group" aria-label="' + esc(t.algL) + '">' + ALG.map(function (a) { return '<button type="button" data-alg="' + a + '" title="' + esc(t.algT[a]) + '">' + esc(t.algN[a]) + '</button>'; }).join('') + '</div>'
      + '<div class="sl6-q"><span>' + esc(t.mL) + '</span><button type="button" data-a="m-" aria-label="−1">−</button><input type="number" min="1" max="7" inputmode="numeric" aria-label="' + esc(t.mL) + '"><button type="button" data-a="m+" aria-label="+1">+</button></div>'
      + '<div class="sl6-ctl__r"><button type="button" class="sl6-btn sl6-btn--g" data-a="ex">' + ico('file', 16) + esc(t.ex) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="bel">' + ico('wave', 16) + esc(t.bel) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="rnd">' + ico('dice', 16) + esc(t.rnd) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share || K.t.share) + '</span></button></div></div>';
    var body = ctl + '<p class="sl6-desc"></p>'
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.chain) + '</h3><label class="sl6-lbl" for="' + K.id + '-r">' + esc(t.chainL) + '</label><input type="text" id="' + K.id + '-r" class="sl6-chain" inputmode="numeric" spellcheck="false" autocomplete="off"><p class="sl6-help">' + esc(t.chainHelp) + '</p><div class="sl6-pg-refs" aria-hidden="true"></div></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-state"><p class="sl6-row"><span class="sl6-k">' + esc(t.inMem) + '</span><span class="sl6-pg-mem"></span></p><p class="sl6-row"><span class="sl6-k sl6-pg-auxk"></span><span class="sl6-pg-aux"></span></p></div><ol class="sl6-log" aria-live="polite"></ol></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.trace) + '</h3><div class="sl6-gw sl6-pg-w"></div><p class="sl6-leg"><span><i class="sl6-sw sl6-sw--in"></i>' + esc(t.legIn) + '</span><span><i class="sl6-sw sl6-sw--hit"></i>' + esc(t.legHit) + '</span><span><i class="sl6-sw sl6-sw--out"></i>' + esc(t.legOut) + '</span></p></section>'
      + '<div class="sl6-bot"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.results) + '</h3><div class="sl6-res"></div><p class="sl6-note">' + esc(t.formula) + '</p></section><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.compare) + '</h3><div class="sl6-cmp sl6-pg-cmp"></div><p class="sl6-h sl6-h--2">── ' + esc(t.sweep) + '</p><div class="sl6-pg-sw"></div><p class="sl6-note sl6-pg-bel"></p></section></div>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var q = K.q, mIn = q('.sl6-q input'), chain = q('.sl6-chain'), log = q('.sl6-log');
    function pg(p) { return '<b class="sl6-pg-p">' + p + '</b>'; }
    function frn(i) { return t.frame + ' ' + FR[i]; }
    function explain(s, k) {
      var e = t.e, h;
      if (s.hit) return fill(e.hit, { p: pg(s.p), fr: frn(s.f) }) + (S.alg === 'lru' ? fill(e.hitL, { t: s.t }) : '');
      h = fill(e.miss, { p: pg(s.p), c: s.comp ? e.comp : '' });
      if (s.why.k === 'free') return h + fill(e.free, { fr: frn(s.f) });
      var w = s.why, others = [], v = w.v;
      w.pages.forEach(function (p, i) {
        if (i === v) return;
        if (S.alg === 'fifo') others.push(fill(e.oFifo, { p: pg(p), x: w.info[i] }));
        else if (S.alg === 'lru') others.push(fill(e.oLru, { p: pg(p), x: w.info[i] }));
        else others.push(w.info[i] === Infinity ? fill(e.oOptN, { p: pg(p) }) : fill(e.oOptA, { p: pg(p), x: w.info[i] }));
      });
      var o = others.length ? ' (' + others.join(', ') + ')' : '';
      if (S.alg === 'opt') {
        var tie = w.info.filter(function (x) { return x === w.info[v]; }).length > 1 && w.info[v] === Infinity;
        return h + fill(e.opt, { v: pg(s.out), when: w.info[v] === Infinity ? e.optNever : fill(e.optAt, { x: w.info[v] }), others: o + (tie ? e.tie : '') });
      }
      return h + fill(e[S.alg], { v: pg(s.out), x: w.info[v], others: o });
    }
    function trace() {
      var w = Math.max(280, q('.sl6-pg-w').clientWidth || 640), n = R.n, narrow = w < 560;
      var lw = narrow ? 66 : 84, cw = Math.max(narrow ? 26 : 30, Math.min(46, Math.floor((w - lw - 6) / Math.max(1, n)))), rh = narrow ? 26 : 30;
      var rows = 2 + S.m + 2, H = 16 + rows * rh + 6, W = lw + cw * n + 6, id = K.id;
      var y = function (r) { return 16 + r * rh; };
      var g = '<svg class="sl6-g sl6-pg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="' + id + '-gt"><title id="' + id + '-gt">' + esc(fill(t.gDesc, { a: t.algN[S.alg], m: S.m, F: R.faults, n: n })) + '</title>';
      g += '<rect class="sl6-pg-now" x="' + lw + '" y="2" width="' + cw + '" height="' + (H - 4) + '" rx="6"/>';
      var lab = function (r, s, c) { return '<text class="sl6-gl' + (c ? ' ' + c : '') + '" x="' + (lw - 10) + '" y="' + (y(r) + rh / 2 + 4) + '" text-anchor="end">' + esc(s) + '</text>'; };
      g += lab(0, 't', 'sl6-gl--p') + lab(1, t.ref);
      for (var i = 0; i < S.m; i++) g += lab(2 + i, frn(i), 'sl6-gl--p');
      g += lab(2 + S.m, t.fault, 'sl6-gl--p') + lab(3 + S.m, t.out, 'sl6-gl--p');
      g += '<line class="sl6-pg-sep" x1="' + lw + '" x2="' + (W - 4) + '" y1="' + y(2) + '" y2="' + y(2) + '"/><line class="sl6-pg-sep" x1="' + lw + '" x2="' + (W - 4) + '" y1="' + y(2 + S.m) + '" y2="' + y(2 + S.m) + '"/>';
      R.steps.forEach(function (s, j) {
        var x = lw + j * cw, cx = x + cw / 2;
        g += '<g class="sl6-pg-c" data-c="' + j + '"><text class="sl6-pg-t" x="' + cx + '" y="' + (y(0) + rh / 2 + 4) + '" text-anchor="middle">' + j + '</text>';
        g += '<rect class="sl6-pg-rh" x="' + (x + 2) + '" y="' + (y(1) + 3) + '" width="' + (cw - 4) + '" height="' + (rh - 6) + '" rx="5"/><text class="sl6-pg-rv" x="' + cx + '" y="' + (y(1) + rh / 2 + 4.5) + '" text-anchor="middle">' + s.p + '</text>';
        s.frames.forEach(function (v, i) {
          var yy = y(2 + i), cls = i === s.f ? (s.hit ? 'is-hit' : 'is-in') : '';
          if (cls) g += '<rect class="sl6-pg-cell ' + cls + '" x="' + (x + 2) + '" y="' + (yy + 3) + '" width="' + (cw - 4) + '" height="' + (rh - 6) + '" rx="5"/>';
          if (v !== null) g += '<text class="sl6-pg-v ' + cls + '" x="' + cx + '" y="' + (yy + rh / 2 + 4.5) + '" text-anchor="middle">' + v + '</text>';
        });
        if (!s.hit) g += '<text class="sl6-pg-f" x="' + cx + '" y="' + (y(2 + S.m) + rh / 2 + 4.5) + '" text-anchor="middle">F</text>';
        else g += '<text class="sl6-pg-dot" x="' + cx + '" y="' + (y(2 + S.m) + rh / 2 + 4.5) + '" text-anchor="middle">·</text>';
        if (s.out !== null) g += '<text class="sl6-pg-o" x="' + cx + '" y="' + (y(3 + S.m) + rh / 2 + 4.5) + '" text-anchor="middle">' + s.out + '</text>';
        g += '</g>';
      });
      g += '</svg>';
      var box = q('.sl6-pg-w'); box.innerHTML = g; box.classList.toggle('is-wide', W > box.clientWidth + 2);
      K.cw = cw; K.lw = lw;
    }
    function logHTML() {
      var h = '';
      R.steps.forEach(function (s, j) { h += '<li data-k="' + j + '" hidden><span class="sl6-log__t">t = ' + j + '</span><span class="sl6-log__x">' + explain(s, j) + (j === R.n - 1 ? '<br>' + fill(t.e.end, { F: R.faults, n: R.n, r: pct(R.rate), c: R.comp }) : '') + '</span></li>'; });
      log.innerHTML = h + '<li class="sl6-log__0">' + esc(t.start) + '</li>';
    }
    function res(going, k) {
      var done = !going || k >= R.n - 1, s = going ? R.steps.slice(0, k + 1) : R.steps, F = s.filter(function (x) { return !x.hit; }).length, c = s.filter(function (x) { return x.comp; }).length, n = s.length;
      var row = function (a, b) { return '<tr><th scope="row">' + esc(a) + '</th><td>' + b + '</td></tr>'; };
      q('.sl6-res').innerHTML = '<table class="sl6-tbl2"><tbody>' + row(t.refs, n + (done ? '' : ' / ' + R.n)) + row(t.faults, F) + row(t.hits, n - F) + row(t.comp, c) + '</tbody><tfoot>' + row(t.rate, (n ? pct(F / n) : '0') + ' %') + row(t.hrate, (n ? pct((n - F) / n) : '0') + ' %') + '</tfoot></table>';
    }
    function cmp() {
      var all = ALG.map(function (a) { return { a: a, f: SLPaginas(S.r, S.m, a).faults }; }), mx = Math.max.apply(null, all.map(function (x) { return x.f; })) || 1;
      q('.sl6-pg-cmp').innerHTML = all.map(function (x) { return '<button type="button" class="sl6-cmp__r sl6-cmp__r--1' + (x.a === S.alg ? ' is-on' : '') + '" data-alg="' + x.a + '" aria-pressed="' + (x.a === S.alg) + '"><b>' + esc(t.algN[x.a]) + '</b><span class="sl6-cmp__b"><i style="width:' + Math.max(3, x.f / mx * 100) + '%;--c:' + COL[x.a] + '"></i><em>' + x.f + ' ' + esc(t.e && L === 'es' ? 'fallos' : 'faults') + '</em></span></button>'; }).join('');
      // barrido de 1 a 7 marcos
      var sw = ALG.map(function (a) { var v = []; for (var m = 1; m <= 7; m++) v.push(SLPaginas(S.r, m, a).faults); return { a: a, v: v }; });
      var W = 300, H = 150, l = 30, b = 24, top = 10, mxF = Math.max.apply(null, sw[0].v.concat([1])), X = function (m) { return l + (m - 1) * (W - l - 12) / 6; }, Y = function (f) { return top + (H - top - b) * (1 - f / mxF); };
      var g = '<svg class="sl6-g sl6-pg-swg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t.sweep) + '">';
      [0, Math.round(mxF / 2), mxF].forEach(function (f) { g += '<line class="sl6-pg-gl" x1="' + l + '" x2="' + (W - 8) + '" y1="' + Y(f) + '" y2="' + Y(f) + '"/><text class="sl6-pg-ax" x="' + (l - 6) + '" y="' + (Y(f) + 4) + '" text-anchor="end">' + f + '</text>'; });
      for (var m = 1; m <= 7; m++) g += '<text class="sl6-pg-ax" x="' + X(m) + '" y="' + (H - 6) + '" text-anchor="middle">' + m + '</text>';
      g += '<line class="sl6-pg-mnow" x1="' + X(S.m) + '" x2="' + X(S.m) + '" y1="' + top + '" y2="' + (H - b) + '"/>';
      var bel = null;
      for (m = 1; m < 7; m++) if (sw[0].v[m] > sw[0].v[m - 1] && !bel) bel = m;
      sw.forEach(function (x) {
        g += '<polyline class="sl6-pg-line" style="--c:' + COL[x.a] + '" points="' + x.v.map(function (f, i) { return X(i + 1) + ',' + Y(f); }).join(' ') + '"/>';
        x.v.forEach(function (f, i) { g += '<circle class="sl6-pg-pt" style="--c:' + COL[x.a] + '" cx="' + X(i + 1) + '" cy="' + Y(f) + '" r="' + (x.a === S.alg ? 3.6 : 2.6) + '"/>'; });
      });
      if (bel) g += '<circle class="sl6-pg-ring" cx="' + X(bel + 1) + '" cy="' + Y(sw[0].v[bel]) + '" r="8"/>';
      g += '</svg><p class="sl6-pg-key">' + ALG.map(function (a) { return '<span><i style="background:' + COL[a] + '"></i>' + esc(t.algN[a]) + '</span>'; }).join('') + '</p>';
      q('.sl6-pg-sw').innerHTML = g;
      q('.sl6-pg-bel').textContent = bel ? fill(t.belady, { a: bel, fa: sw[0].v[bel - 1], b: bel + 1, fb: sw[0].v[bel] }) : t.noBel;
    }
    function draw(k, going) {
      [].forEach.call(K.qa('.sl6-pg-c'), function (c) { var j = +c.getAttribute('data-c'); c.classList.toggle('is-fut', going && j > k); });
      var now = q('.sl6-pg-now'); if (now) { now.style.display = going ? '' : 'none'; now.setAttribute('transform', 'translate(' + (Math.max(0, k) * K.cw) + ',0)'); }
      var box = q('.sl6-pg-w'); if (!going) box.scrollLeft = 0; if (going && box.scrollWidth > box.clientWidth) { var x = K.lw + k * K.cw - box.clientWidth / 2; if (Math.abs(box.scrollLeft - x) > 40) box.scrollLeft = Math.max(0, x); }
      [].forEach.call(log.children, function (li) { var d = li.getAttribute('data-k'); if (d == null) { li.hidden = going; return; } d = +d; li.hidden = !going || d > k; li.classList.toggle('is-cur', going && d === k); });
      var cur = log.querySelector('.is-cur'); if (cur) log.scrollTop = cur.offsetTop - log.clientHeight + cur.offsetHeight + 8;
      var s = going ? R.steps[k] : null;
      q('.sl6-pg-mem').innerHTML = s ? s.frames.map(function (v, i) { return '<span class="sl6-q__c' + (i === s.f ? (s.hit ? ' is-hit' : ' is-in') : '') + '"><em>' + FR[i] + '</em><b>' + (v === null ? '·' : v) + '</b></span>'; }).join('') : '<span class="sl6-q__e">—</span>';
      q('.sl6-pg-auxk').textContent = t.aux[S.alg];
      var aux = '<span class="sl6-q__e">—</span>';
      if (s) {
        var it = []; s.frames.forEach(function (v, i) { if (v !== null) it.push({ p: v, e: s.ent[i], l: s.last[i], n: s.next[i] }); });
        if (S.alg === 'fifo') it.sort(function (a, b) { return a.e - b.e; }); else if (S.alg === 'lru') it.sort(function (a, b) { return a.l - b.l; }); else it.sort(function (a, b) { return b.n - a.n; });
        aux = it.map(function (x) { var v = S.alg === 'fifo' ? 't' + x.e : S.alg === 'lru' ? 't' + x.l : x.n === Infinity ? t.never : 't' + x.n; return '<span class="sl6-q__c"><b class="sl6-pg-chip">' + x.p + '</b><em>' + v + '</em></span>'; }).join('') || '<span class="sl6-q__e">' + esc(t.empty) + '</span>';
      }
      q('.sl6-pg-aux').innerHTML = aux;
      res(going, k);
    }
    K.N = function () { return R.n; };
    K.draw = draw;
    var P = K6.player(K);
    function refsChips() { q('.sl6-pg-refs').innerHTML = S.r.map(function (p) { return '<span>' + p + '</span>'; }).join(''); }
    function update(keepInput) {
      P.stop && P.stop();
      R = SLPaginas(S.r, S.m, S.alg);
      [].forEach.call(K.qa('.sl6-seg button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-alg') === S.alg ? 'true' : 'false'); });
      mIn.value = S.m;
      if (!keepInput) chain.value = S.r.join(' ');
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">' + t.alg + '</span> <b>' + S.alg + '</b> <span class="o">' + t.mf + '</span> <b>' + S.m + '</b> ' + esc(t.file);
      q('.sl6-desc').textContent = t.algT[S.alg];
      var st = enc(); K6.store('sl_sim_paginas', st); K6.keepHash(st);
      refsChips(); trace(); logHTML(); cmp(); P.reset();
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      var a = b.getAttribute('data-a'), al = b.getAttribute('data-alg');
      if (al) { S.alg = al; update(); return; }
      if (a === 'theme') K6.toggleTheme(K);
      else if (a === 'm-' || a === 'm+') { S.m = Math.max(1, Math.min(7, S.m + (a === 'm+' ? 1 : -1))); update(); }
      else if (a === 'ex') { S.r = GCC.slice(); S.m = 3; update(); }
      else if (a === 'bel') { S.r = BEL.slice(); S.alg = 'fifo'; S.m = 3; update(); }
      else if (a === 'rnd') { S.r = rnd(12 + Math.floor(Math.random() * 7), 7); update(); }
      else if (a === 'share') K6.share(K, b, enc());
    });
    mIn.addEventListener('change', function () { S.m = Math.max(1, Math.min(7, Math.round(+mIn.value) || 3)); update(); });
    chain.addEventListener('input', function () {
      var r = clampR((chain.value.match(/\d+/g) || []).map(Number));
      chain.classList.toggle('is-bad', !r.length);
      chain.setAttribute('aria-invalid', r.length ? 'false' : 'true');
      q('.sl6-help').textContent = r.length ? t.chainHelp : t.chainBad;
      if (r.length) { S.r = r; update(true); }
    });
    chain.addEventListener('blur', function () { chain.value = S.r.join(' '); chain.classList.remove('is-bad'); q('.sl6-help').textContent = t.chainHelp; });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { trace(); P.draw(); }, 150); });
    function rnd(n, P0) { var a = [], i; for (i = 0; i < n; i++) { var p = Math.floor(Math.random() * P0); if (i > 1 && Math.random() < .2) p = a[i - 1 - Math.floor(Math.random() * 2)]; a.push(p); } return a; }
    // ---------------------------------------------------------------- reto
    var box = q('.sl6-reto'), RT = null;
    function reto() {
      var a = ALG[Math.floor(Math.random() * 3)], m = 3 + Math.floor(Math.random() * 2), r = rnd(12, 6);
      RT = { a: a, m: m, r: r, R: SLPaginas(r, m, a) };
      var h = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-cmd sl6-cmd--s"><span class="sl6-ps">$</span> <code>' + esc(t.cmd) + ' <span class="o">' + t.alg + '</span> <b>' + a + '</b> <span class="o">' + t.mf + '</span> <b>' + m + '</b> ' + esc(t.fileReto) + '</code></p>';
      h += '<p class="sl6-help">' + esc(t.tapF) + '</p><div class="sl6-pg-tap" role="group" aria-label="' + esc(t.tapF) + '">' + r.map(function (p, j) { return '<button type="button" class="sl6-pg-tb" data-j="' + j + '" aria-pressed="false" aria-label="t' + j + ': ' + p + '"><small>t' + j + '</small><b>' + p + '</b><i>·</i></button>'; }).join('') + '</div>';
      h += '<div class="sl6-pg-tot"><label>' + esc(t.totF) + ' <input type="text" inputmode="numeric" data-k="f"></label><label>' + esc(t.totR) + ' <input type="text" inputmode="decimal" data-k="r"></label></div>';
      h += '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-r="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-r="sol">' + esc(K.t.sol) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-r="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      box.innerHTML = h;
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('sl6-pg-tb')) { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.querySelector('i').textContent = on ? 'F' : '·'; b.classList.remove('is-ok', 'is-bad'); return; }
      var a = b.getAttribute('data-r');
      if (a === 'new') reto();
      else if (a === 'check') {
        var good = 0;
        [].forEach.call(box.querySelectorAll('.sl6-pg-tb'), function (x) { var j = +x.getAttribute('data-j'), ok = (x.getAttribute('aria-pressed') === 'true') === !RT.R.steps[j].hit; x.classList.toggle('is-ok', ok); x.classList.toggle('is-bad', !ok); if (ok) good++; });
        var fi = box.querySelector('[data-k="f"]'), ri = box.querySelector('[data-k="r"]');
        var fv = fi.value.trim(), rv = parseFloat(ri.value.replace(',', '.').replace('%', ''));
        var fok = /^\d+$/.test(fv) && +fv === RT.R.faults, rok = !isNaN(rv) && Math.abs(rv - RT.R.rate * 100) <= 0.5 + 1e-9;
        fi.classList.toggle('is-ok', fok); fi.classList.toggle('is-bad', !fok); ri.classList.toggle('is-ok', rok); ri.classList.toggle('is-bad', !rok);
        var all = good === RT.r.length && fok && rok;
        box.querySelector('.sl6-reto__msg').innerHTML = '<b>' + esc(fill(t.retoCols, { a: good, n: RT.r.length })) + '.</b> ' + esc(all ? t.allOk : t.someBad);
      } else if (a === 'sol') { S.alg = RT.a; S.m = RT.m; S.r = RT.r.slice(); update(); q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' }); setTimeout(P.run, K6.reduced ? 0 : 500); }
    });
    update(); reto();
  }
  K6.boot('.sl-sim[data-sim="paginas"]', init);
})();
