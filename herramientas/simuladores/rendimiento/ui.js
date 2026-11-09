/* SergioLearns — interfaz de rendimiento y E/S (.sl-sim[data-sim="rendimiento"]). Necesita kit.js y rendimiento/engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, R$ = window.SLRend;
  var PAL = ['#5B4BDB', '#FF6B4A', '#16794B', '#F5A524', '#2F5FD0', '#C2362B'];
  var DEV = {
    raton: { rate: 1000, unit: 1, polls: 1000, act: 100 }, teclado: { rate: 10, unit: 1, polls: 100, act: 100 },
    ssd: { rate: 2000e6, unit: 16, polls: 0, act: 100 }, disco: { rate: 100e6, unit: 16, polls: 0, act: 100 }, cascos: { rate: 192000, unit: 4, polls: 0, act: 100 }
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'rendimiento',
      tabL: 'Qué calcular', tab: { cpu: 'Tiempo de CPU', amd: 'Ley de Amdahl', io: 'E/S: consulta, interrupciones, DMA' }, share: 'Compartir', ex: 'Ejemplo',
      ex2: { cpu: 'El cierre de caja con dos compiladores (tema 12)', amd: 'El benchmark de 120 s (cuestión tipo examen)', amd2: 'El carro de la compra: el escáner ×4', io: 'El SSD de 2000 MB/s de la tarde de videojuegos (tema 15)', io2: 'El ratón de 1000 Hz por consulta' },
      cpu: { cls: 'clase', cpi: 'CPI', cnt: 'instrucciones (×10⁹)', F: 'reloj (GHz)', add: 'Añadir clase', del: 'Quitar', N: 'instrucciones', cy: 'ciclos', cpim: 'CPI medio', T: 'tiempo', mips: 'MIPS', fast: 'Más rápido: {n}, {g} veces ({ts} / {tf}).', same: 'Tardan lo mismo.', wrong: 'Ojo: por MIPS ganaría {n} ({a} frente a {b}), pero tarda más. Los MIPS no cuentan cuánto trabajo hace cada instrucción.', bars: 'De dónde salen los ciclos' },
      amd: { part: 'parte', t: 'tiempo (s)', s: 'mejora (×)', add: 'Añadir parte', before: 'antes', after: 'después', G: 'Ganancia total: G = {t0} / {t1} = {g}.', alone: 'si solo mejoras esta', lim: 'límite (∞ veces)', saved: 's ahorrados', best: 'La mejora que más gana es la de {n}: ahorra más segundos ({s} s), aunque no sea la que más multiplica.', curve: 'Ganancia según lo que se acelera {n} (F = {f})' },
      io: { F: 'reloj (GHz)', cons: 'ciclos por consulta', int: 'ciclos por interrupción', dmaP: 'DMA: preparar (ciclos)', dmaF: 'DMA: al acabar (ciclos)', dev: 'periférico', rate: 'datos (B/s)', unit: 'B por consulta o interrupción', block: 'B por bloque de DMA', act: 'actividad (%)', polls: 'consultas por segundo (0 = al ritmo del dato)', devs: { raton: 'Ratón de 1000 Hz', teclado: 'Teclado (100 consultas/s)', ssd: 'SSD NVMe de 2000 MB/s', disco: 'Disco duro de 100 MB/s', cascos: 'Cascos: audio de 192 KB/s', '': 'A medida' }, m: { cons: 'consulta', int: 'interrupciones', dma: 'DMA' }, over: 'no da abasto: necesitaría más de una CPU', tie: 'Consulta e interrupciones empatan cuando el periférico está activo el {p} % del tiempo: por debajo, las interrupciones salen más baratas (solo cuestan cuando hay datos).', cyc: '{c} ciclos/s' },
      steps: 'las cuentas', res: 'resultados', start: 'Pulsa Paso para ver las cuentas una a una.',
      st: {
        N: '{n}: N = {sum} = {N} instrucciones.', cy: '{n}: ciclos = {sum} = {cy}.', cpi: '{n}: CPI medio = ciclos / N = {cy} / {N} = {c}.', T: '{n}: T = ciclos / F = {cy} / {F} = {T}.', mips: '{n}: MIPS = N / (T × 10⁶) = {N} / ({T} × 10⁶) = {m}.',
        F: 'Fracción de cada parte sobre {t0} s: {list}.', t1: 'Tiempo nuevo = {sum} = {t1} s (lo que no mejora, igual; lo que mejora, dividido).', G: 'G = antes / después = {t0} / {t1} = {g}. Con la fórmula: 1 / ((1 − F) + F / S).',
        tr: 'El periférico manda {r} B/s en trozos de {u} B: {tr} trozos por segundo.', pc: 'Consulta: {p} consultas/s × {c} ciclos = {cy} ciclos/s → {cy} / {F} = {pc} % de la CPU.', pi: 'Interrupciones: {tr} × {a} (actividad) × {c} ciclos = {cy} ciclos/s → {pc} %.', pd: 'DMA: {b} bloques/s × ({p} + {f}) ciclos = {cy} ciclos/s → {pc} % (el controlador mueve los datos; la CPU solo empieza y acaba).'
      },
      rules: 'Tiempo de CPU = instrucciones × CPI / frecuencia; el CPI medio pondera cada clase por cuántas instrucciones tiene. Amdahl: G = antes / después, y lo que no se mejora pone el límite. E/S: % de CPU = ciclos por segundo que gasta / ciclos por segundo del reloj. Las mismas cuentas que los temas 12 y 15.',
      reto: 'Reto: las cuentas del examen', retoLead: 'Sin calculadora, como en el examen: hazlas en papel y escribe el resultado.',
      rT: 'Un programa ejecuta {N}·10⁹ instrucciones con un CPI medio de {c} en un procesador de {f} GHz. ¿Cuántos segundos tarda?', rG: 'Una parte que es el {F} % del tiempo de un programa se hace {S} veces más rápida. ¿Cuál es la ganancia total?', rP: 'Un periférico manda {r} MB/s; cada consulta mueve {u} B y cuesta {c} ciclos en un procesador de {f} GHz. ¿Qué % de la CPU se lleva la consulta?',
      ans: 'resultado', ok: 'Bien.', bad: 'No es eso. Pulsa «Ver la solución» para verlo con las cuentas.'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'performance',
      tabL: 'What to compute', tab: { cpu: 'CPU time', amd: 'Amdahl’s law', io: 'I/O: polling, interrupts, DMA' }, share: 'Share', ex: 'Example',
      ex2: { cpu: 'The till closing with two compilers (topic 12)', amd: 'The 120 s benchmark (exam-style question)', amd2: 'The shopping trolley: scanner ×4', io: 'The 2000 MB/s SSD from the gaming afternoon (topic 15)', io2: 'The 1000 Hz mouse by polling' },
      cpu: { cls: 'class', cpi: 'CPI', cnt: 'instructions (×10⁹)', F: 'clock (GHz)', add: 'Add class', del: 'Remove', N: 'instructions', cy: 'cycles', cpim: 'average CPI', T: 'time', mips: 'MIPS', fast: 'Faster: {n}, {g} times ({ts} / {tf}).', same: 'They take the same time.', wrong: 'Note: by MIPS {n} would win ({a} versus {b}), but it takes longer. MIPS do not count how much work each instruction does.', bars: 'Where the cycles come from' },
      amd: { part: 'part', t: 'time (s)', s: 'speed-up (×)', add: 'Add part', before: 'before', after: 'after', G: 'Overall speed-up: G = {t0} / {t1} = {g}.', alone: 'if only this one improves', lim: 'limit (∞ times)', saved: 's saved', best: 'The improvement that gains most is {n}: it saves more seconds ({s} s), even if it is not the one that multiplies most.', curve: 'Speed-up as {n} gets faster (F = {f})' },
      io: { F: 'clock (GHz)', cons: 'cycles per poll', int: 'cycles per interrupt', dmaP: 'DMA: set up (cycles)', dmaF: 'DMA: at the end (cycles)', dev: 'device', rate: 'data (B/s)', unit: 'B per poll or interrupt', block: 'B per DMA block', act: 'activity (%)', polls: 'polls per second (0 = at the data rate)', devs: { raton: '1000 Hz mouse', teclado: 'Keyboard (100 polls/s)', ssd: '2000 MB/s NVMe SSD', disco: '100 MB/s hard disk', cascos: 'Headset: 192 KB/s audio', '': 'Custom' }, m: { cons: 'polling', int: 'interrupts', dma: 'DMA' }, over: 'cannot keep up: it would need more than one CPU', tie: 'Polling and interrupts tie when the device is active {p} % of the time: below that, interrupts are cheaper (they only cost when there is data).', cyc: '{c} cycles/s' },
      steps: 'the arithmetic', res: 'results', start: 'Press Step to see the arithmetic one line at a time.',
      st: {
        N: '{n}: N = {sum} = {N} instructions.', cy: '{n}: cycles = {sum} = {cy}.', cpi: '{n}: average CPI = cycles / N = {cy} / {N} = {c}.', T: '{n}: T = cycles / F = {cy} / {F} = {T}.', mips: '{n}: MIPS = N / (T × 10⁶) = {N} / ({T} × 10⁶) = {m}.',
        F: 'Fraction of each part over {t0} s: {list}.', t1: 'New time = {sum} = {t1} s (what does not improve, the same; what improves, divided).', G: 'G = before / after = {t0} / {t1} = {g}. With the formula: 1 / ((1 − F) + F / S).',
        tr: 'The device sends {r} B/s in chunks of {u} B: {tr} chunks per second.', pc: 'Polling: {p} polls/s × {c} cycles = {cy} cycles/s → {cy} / {F} = {pc} % of the CPU.', pi: 'Interrupts: {tr} × {a} (activity) × {c} cycles = {cy} cycles/s → {pc} %.', pd: 'DMA: {b} blocks/s × ({p} + {f}) cycles = {cy} cycles/s → {pc} % (the controller moves the data; the CPU only starts and finishes).'
      },
      rules: 'CPU time = instructions × CPI / frequency; the average CPI weights each class by how many instructions it has. Amdahl: G = before / after, and what is not improved sets the limit. I/O: % of CPU = cycles per second spent / cycles per second of the clock. The same arithmetic as topics 12 and 15.',
      reto: 'Challenge: the exam arithmetic', retoLead: 'Without a calculator, as in the exam: do it on paper and type the result.',
      rT: 'A program executes {N}·10⁹ instructions with an average CPI of {c} on a {f} GHz processor. How many seconds does it take?', rG: 'A part that is {F} % of a program’s time becomes {S} times faster. What is the overall speed-up?', rP: 'A device sends {r} MB/s; each poll moves {u} B and costs {c} cycles on a {f} GHz processor. What % of the CPU does polling take?',
      ans: 'result', ok: 'Correct.', bad: 'Not quite. Press «See the solution» to see it with the arithmetic.'
    }
  };
  var DEF = {
    cpu: { cls: [['aritméticas', 1], ['memoria', 2], ['saltos', 3]], p: [['actual', 2, [2, 1.2, 0.8]], ['nuevo', 2, [1, 1.2, 0.6]]] },
    amd: [['CPU', 30, 5], ['memoria', 40, 1], ['disco', 50, 1]],
    io: { F: 4, cons: 400, int: 500, dmaP: 2000, dmaF: 1200, dev: 'ssd', rate: 2000e6, unit: 16, block: 32000, act: 100, polls: 0 }
  };
  var DEFEN = { cls: ['arithmetic', 'memory', 'branches'], p: ['current', 'new'], amd: ['CPU', 'memory', 'disk'] };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, T = t.st, sep = L === 'es' ? ',' : '.';
    K.title = t.title;
    var S = { tab: 'cpu', cpu: clone(DEF.cpu), amd: clone(DEF.amd), io: clone(DEF.io), ex: 'cpu' }, ST = [];
    if (L === 'en') { S.cpu.cls.forEach(function (c, i) { c[0] = DEFEN.cls[i]; }); S.cpu.p.forEach(function (p, i) { p[0] = DEFEN.p[i]; }); S.amd.forEach(function (a, i) { a[0] = DEFEN.amd[i]; }); }
    var KEY = 'sl_sim_rendimiento_' + (document.documentElement.lang || '').slice(0, 2);
    (function () {
      var s = K6.hashState() || K6.store(KEY); if (!s) return;
      try { var o = JSON.parse(s); if (['cpu', 'amd', 'io'].indexOf(o.tab) >= 0) S.tab = o.tab; if (o.cpu && o.cpu.cls && o.cpu.cls.length <= 6) S.cpu = o.cpu; if (o.amd && o.amd.length <= 6) S.amd = o.amd; if (o.io) S.io = o.io; S.ex = o.ex || ''; } catch (e) {}
    })();
    var enc = function () { return JSON.stringify({ tab: S.tab, cpu: S.cpu, amd: S.amd, io: S.io, ex: S.ex }); };
    function n(x, d) { if (!isFinite(x)) return '∞'; var a = Math.abs(x); if (a >= 1e6 || (a > 0 && a < 1e-3)) { var e = Math.floor(Math.log10(a)), m = x / Math.pow(10, e); return K6.num(m, L, 3) + '·10' + sup(e); } return K6.num(x, L, d == null ? 2 : d); }
    function sup(e) { return String(e).split('').map(function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)] || (c === '-' ? '⁻' : c); }).join(''); }
    function secs(x) { return x >= 1 ? n(x) + ' s' : x >= 1e-3 ? n(x * 1e3) + ' ms' : x >= 1e-6 ? n(x * 1e6) + ' µs' : n(x * 1e9) + ' ns'; }
    var exs = [['cpu', 'cpu'], ['amd', 'amd'], ['amd2', 'amd'], ['io', 'io'], ['io2', 'io']];
    var seg = '<div class="sl6-seg" role="group" aria-label="' + esc(t.tabL) + '"><span class="sl6-seg__l">' + esc(t.tabL) + '</span>' + ['cpu', 'amd', 'io'].map(function (k) { return '<button type="button" data-tab="' + k + '">' + esc(t.tab[k]) + '</button>'; }).join('') + '</div>';
    var ctl = '<div class="sl6-ctl">' + seg + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exs.map(function (x) { return '<option value="' + x[0] + '">' + esc(t.ex2[x[0]]) + '</option>'; }).join('') + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── stdin</h3><div class="sl6-rn-in"></div></section><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-rn-card"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.res) + '</h3><div class="sl6-res sl6-rn-out"></div></section><p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var num = function (v) { var x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : 0; };
    function inp(path, v, w, kind) { return '<input type="text" class="sl6-rn-i" data-k="' + path + '" value="' + esc(String(v)) + '"' + (w ? ' style="max-width:' + w + 'px"' : '') + ' inputmode="' + (kind === 'name' ? 'text' : 'decimal') + '" autocomplete="off" spellcheck="false">'; }
    function form() {
      var h = '';
      if (S.tab === 'cpu') {
        var c = S.cpu;
        h += '<table class="sl6-rn-ft"><thead><tr><th>' + esc(t.cpu.cls) + '</th><th>' + esc(t.cpu.cpi) + '</th>' + c.p.map(function (p, j) { return '<th>' + inp('cpu.p.' + j + '.0', p[0], 110, 'name') + '</th>'; }).join('') + '<th></th></tr></thead><tbody>';
        c.cls.forEach(function (r, i) { h += '<tr><td>' + inp('cpu.cls.' + i + '.0', r[0], 130, 'name') + '</td><td>' + inp('cpu.cls.' + i + '.1', r[1], 60) + '</td>' + c.p.map(function (p, j) { return '<td>' + inp('cpu.p.' + j + '.2.' + i, p[2][i], 90) + '</td>'; }).join('') + '<td>' + (c.cls.length > 1 ? '<button type="button" class="sl6-ib" data-del="' + i + '" aria-label="' + esc(t.cpu.del) + '" title="' + esc(t.cpu.del) + '">×</button>' : '') + '</td></tr>'; });
        h += '<tr class="sl6-rn-f"><td>' + esc(t.cpu.F) + '</td><td></td>' + c.p.map(function (p, j) { return '<td>' + inp('cpu.p.' + j + '.1', p[1], 90) + '</td>'; }).join('') + '<td></td></tr></tbody></table><p class="sl6-help">' + esc(t.cpu.cnt) + '</p>' + (c.cls.length < 6 ? '<button type="button" class="sl6-btn" data-add="1">+ ' + esc(t.cpu.add) + '</button>' : '');
      } else if (S.tab === 'amd') {
        h += '<table class="sl6-rn-ft"><thead><tr><th>' + esc(t.amd.part) + '</th><th>' + esc(t.amd.t) + '</th><th>' + esc(t.amd.s) + '</th><th></th></tr></thead><tbody>' + S.amd.map(function (r, i) { return '<tr><td>' + inp('amd.' + i + '.0', r[0], 140, 'name') + '</td><td>' + inp('amd.' + i + '.1', r[1], 90) + '</td><td>' + inp('amd.' + i + '.2', r[2], 80) + '</td><td>' + (S.amd.length > 1 ? '<button type="button" class="sl6-ib" data-del="' + i + '" aria-label="' + esc(t.cpu.del) + '">×</button>' : '') + '</td></tr>'; }).join('') + '</tbody></table>' + (S.amd.length < 6 ? '<button type="button" class="sl6-btn" data-add="1">+ ' + esc(t.amd.add) + '</button>' : '');
      } else {
        var o = S.io, f = function (k, lab) { return '<label><span>' + esc(lab) + '</span>' + inp('io.' + k, o[k], 160) + '</label>'; };
        h += '<label class="sl6-rn-dev"><span class="sl6-lbl">' + esc(t.io.dev) + '</span><select class="sl6-rd-rs" data-dev="1">' + ['raton', 'teclado', 'ssd', 'disco', 'cascos', ''].map(function (k) { return '<option value="' + k + '"' + (o.dev === k ? ' selected' : '') + '>' + esc(t.io.devs[k]) + '</option>'; }).join('') + '</select></label>'
          + '<div class="sl6-rn-grid">' + f('rate', t.io.rate) + f('unit', t.io.unit) + f('polls', t.io.polls) + f('act', t.io.act) + f('block', t.io.block) + f('F', t.io.F) + f('cons', t.io.cons) + f('int', t.io.int) + f('dmaP', t.io.dmaP) + f('dmaF', t.io.dmaF) + '</div>';
      }
      q('.sl6-rn-in').innerHTML = h;
    }
    function bar(segs, max, lab, val, cls) {
      return '<div class="sl6-rd-bar sl6-rn-bar' + (cls ? ' ' + cls : '') + '"><b>' + esc(lab) + '</b><span class="sl6-rd-bt">' + segs.map(function (s) { return '<i style="width:' + Math.max(0, Math.min(100, 100 * s[0] / max)) + '%;background:' + s[1] + '" title="' + esc(s[2] || '') + '"></i>'; }).join('') + '</span><em>' + val + '</em></div>';
    }
    function compute() {
      ST = []; var out = '';
      if (S.tab === 'cpu') {
        var c = S.cpu, cls = c.cls.map(function (r) { return { n: r[0], cpi: num(r[1]) }; }), pr = c.p.map(function (p) { return { n: p[0], F: num(p[1]) * 1e9, cuenta: p[2].map(function (x) { return num(x) * 1e9; }) }; }), R = R$.cpu(cls, pr);
        R.r.forEach(function (r, j) {
          ST.push(fill(T.N, { n: esc(r.n), sum: r.parts.map(function (x) { return n(x.k); }).join(' + '), N: '<b>' + n(r.N) + '</b>' }));
          ST.push(fill(T.cy, { n: esc(r.n), sum: r.parts.map(function (x) { return n(x.k) + ' × ' + n(x.cpi, 2); }).join(' + '), cy: '<b>' + n(r.cy) + '</b>' }));
          ST.push(fill(T.cpi, { n: esc(r.n), cy: n(r.cy), N: n(r.N), c: '<b>' + n(r.cpi, 3) + '</b>' }));
          ST.push(fill(T.T, { n: esc(r.n), cy: n(r.cy), F: n(r.F) + ' Hz', T: '<b>' + secs(r.T) + '</b>' }));
          ST.push(fill(T.mips, { n: esc(r.n), N: n(r.N), T: n(r.T, 3), m: '<b>' + n(r.mips, 0) + '</b>' }));
        });
        out += '<table class="sl6-rn-rt"><thead><tr><th></th><th>' + esc(t.cpu.N) + '</th><th>' + esc(t.cpu.cy) + '</th><th>' + esc(t.cpu.cpim) + '</th><th>' + esc(t.cpu.T) + '</th><th>' + esc(t.cpu.mips) + '</th></tr></thead><tbody>' + R.r.map(function (r) { return '<tr' + (R.fast === r ? ' class="is-on"' : '') + '><th>' + esc(r.n) + '</th><td>' + n(r.N) + '</td><td>' + n(r.cy) + '</td><td>' + n(r.cpi, 3) + '</td><td><b>' + secs(r.T) + '</b></td><td>' + n(r.mips, 0) + '</td></tr>'; }).join('') + '</tbody></table>';
        var mx = Math.max.apply(null, R.r.map(function (r) { return r.cy; })) || 1;
        out += '<p class="sl6-h sl6-h--2">── ' + esc(t.cpu.bars) + '</p><div class="sl6-rd-bars">' + R.r.map(function (r) { return bar(r.parts.map(function (x, i) { return [x.cy, PAL[i % 6], x.n + ': ' + n(x.cy)]; }), mx, r.n, n(r.cy)); }).join('') + '</div><p class="sl6-rn-leg">' + cls.map(function (x, i) { return '<span><i style="background:' + PAL[i % 6] + '"></i>' + esc(x.n) + ' (CPI ' + n(x.cpi) + ')</span>'; }).join('') + '</p>';
        if (R.fast) {
          var msg = R.gain > 1.0000001 ? fill(t.cpu.fast, { n: R.fast.n, g: n(R.gain, 2), ts: secs(R.slow.T), tf: secs(R.fast.T) }) : t.cpu.same;
          ST.push(msg); out += '<p class="sl6-note"><b>' + esc(msg) + '</b></p>';
          if (R.mipsWrong && R.gain > 1.0000001) { var mb = R.r.reduce(function (a, b) { return b.mips > a.mips ? b : a; }); var w = fill(t.cpu.wrong, { n: mb.n, a: n(mb.mips, 0), b: n(R.fast.mips, 0) }); ST.push('<span class="is-bad">' + esc(w) + '</span>'); out += '<p class="sl6-help is-bad">' + esc(w) + '</p>'; }
        }
      } else if (S.tab === 'amd') {
        var A = R$.amdahl(S.amd.map(function (r) { return { n: r[0], t: num(r[1]), s: Math.max(1e-9, num(r[2]) || 1) }; }));
        ST.push(fill(T.F, { t0: n(A.T0), list: A.r.map(function (p) { return esc(p.n) + ' ' + n(p.F, 3); }).join(', ') }));
        ST.push(fill(T.t1, { sum: A.r.map(function (p) { return p.s === 1 ? n(p.t) : n(p.t) + ' / ' + n(p.s); }).join(' + '), t1: '<b>' + n(A.T1, 3) + '</b>' }));
        ST.push(fill(T.G, { t0: n(A.T0), t1: n(A.T1, 3), g: '<b>' + n(A.G, 3) + '</b>' }));
        var mxx = A.T0 || 1;
        out += '<div class="sl6-rd-bars">' + bar(A.r.map(function (p, i) { return [p.t, PAL[i % 6], p.n]; }), mxx, t.amd.before, n(A.T0) + ' s') + bar(A.r.map(function (p, i) { return [p.t1, PAL[i % 6], p.n]; }), mxx, t.amd.after, n(A.T1, 2) + ' s') + '</div>'
          + '<p class="sl6-rn-leg">' + A.r.map(function (p, i) { return '<span><i style="background:' + PAL[i % 6] + '"></i>' + esc(p.n) + '</span>'; }).join('') + '</p><p class="sl6-note"><b>' + esc(fill(t.amd.G, { t0: n(A.T0), t1: n(A.T1, 3), g: n(A.G, 3) })) + '</b></p>';
        out += '<table class="sl6-rn-rt"><thead><tr><th>' + esc(t.amd.part) + '</th><th>F</th><th>' + esc(t.amd.s) + '</th><th>' + esc(t.amd.saved) + '</th><th>' + esc(t.amd.alone) + '</th><th>' + esc(t.amd.lim) + '</th></tr></thead><tbody>' + A.r.map(function (p) { return '<tr><th>' + esc(p.n) + '</th><td>' + n(p.F, 3) + '</td><td>' + n(p.s) + '</td><td>' + n(p.saved, 2) + '</td><td>' + n(p.alone, 3) + '</td><td>' + n(p.lim, 2) + '</td></tr>'; }).join('') + '</tbody></table>';
        var imp = A.r.filter(function (p) { return p.s > 1; });
        if (imp.length > 1) { var best = imp.reduce(function (a, b) { return b.saved > a.saved ? b : a; }); out += '<p class="sl6-help">' + esc(fill(t.amd.best, { n: best.n, s: n(best.saved, 2) })) + '</p>'; }
        var big = imp.length ? imp.reduce(function (a, b) { return b.saved > a.saved ? b : a; }) : A.r.reduce(function (a, b) { return b.F > a.F ? b : a; }); out += curve(big);
      } else {
        var o = S.io, cfg = { F: num(o.F) * 1e9, cons: num(o.cons), int: num(o.int), dmaP: num(o.dmaP), dmaF: num(o.dmaF), rate: num(o.rate), unit: num(o.unit) || 1, block: num(o.block) || 1, act: num(o.act) / 100, polls: num(o.polls) }, I = R$.io(cfg);
        ST.push(fill(T.tr, { r: n(cfg.rate), u: n(cfg.unit, 0), tr: n(I.trozos) }));
        ST.push(fill(T.pc, { p: n(I.polls), c: n(cfg.cons, 0), cy: n(I.cons.cy), F: n(cfg.F), pc: '<b>' + n(I.cons.p, 4) + '</b>' }));
        ST.push(fill(T.pi, { tr: n(I.trozos), a: n(cfg.act, 2), c: n(cfg.int, 0), cy: n(I.int.cy), pc: '<b>' + n(I.int.p, 4) + '</b>' }));
        ST.push(fill(T.pd, { b: n(I.dma.blocks), p: n(cfg.dmaP, 0), f: n(cfg.dmaF, 0), cy: n(I.dma.cy), pc: '<b>' + n(I.dma.p, 4) + '</b>' }));
        out += '<div class="sl6-rd-bars">' + [['cons', I.cons], ['int', I.int], ['dma', I.dma]].map(function (x, i) { var p = x[1].p; return bar([[Math.min(p, 100), p > 100 ? '#C2362B' : PAL[i]]], 100, t.io.m[x[0]], n(p, 4) + ' %', p > 100 ? 'is-over' : '') + (p > 100 ? '<p class="sl6-help is-bad" style="margin:0 0 4px 70px!important">' + esc(t.io.over) + '</p>' : ''); }).join('') + '</div>';
        if (I.tie > 0 && I.tie < 1 && cfg.polls === 0) out += '<p class="sl6-note">' + esc(fill(t.io.tie, { p: n(I.tie * 100, 1) })) + '</p>';
        else if (I.tie > 0 && I.tie <= 1) out += '<p class="sl6-note">' + esc(fill(t.io.tie, { p: n(I.tie * 100, 3) })) + '</p>';
      }
      q('.sl6-rn-out').innerHTML = out;
    }
    function curve(p) {   // G según S para la parte p, con el límite 1 / (1 − F)
      var W = 520, H = 170, x0 = 46, y0 = 14, w = W - x0 - 14, h = H - y0 - 30, lim = p.lim, gmax = isFinite(lim) ? Math.min(lim * 1.12, 50) : 10, xs = [];
      for (var k = 0; k <= 60; k++) xs.push(Math.pow(2, k / 10));
      var X = function (s) { return x0 + w * Math.log2(s) / 6; }, Y = function (g) { return y0 + h - h * (g - 1) / (gmax - 1 || 1); };
      var d = xs.map(function (s, i) { return (i ? 'L' : 'M') + X(s).toFixed(1) + ',' + Y(R$.ganancia(p.F, s)).toFixed(1); }).join(' ');
      var g = '<svg class="sl6-rn-c" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(fill(t.amd.curve, { n: p.n, f: n(p.F, 2) })) + '">';
      [1, 2, 4, 8, 16, 32, 64].forEach(function (s) { g += '<line x1="' + X(s) + '" y1="' + y0 + '" x2="' + X(s) + '" y2="' + (y0 + h) + '" class="sl6-rn-gl"/><text x="' + X(s) + '" y="' + (y0 + h + 16) + '" text-anchor="middle" class="sl6-rn-tx">×' + s + '</text>'; });
      g += '<line x1="' + x0 + '" y1="' + Y(1) + '" x2="' + (x0 + w) + '" y2="' + Y(1) + '" class="sl6-rn-gl"/><text x="' + (x0 - 6) + '" y="' + (Y(1) + 4) + '" text-anchor="end" class="sl6-rn-tx">1</text>';
      if (isFinite(lim) && lim <= gmax) g += '<line x1="' + x0 + '" y1="' + Y(lim) + '" x2="' + (x0 + w) + '" y2="' + Y(lim) + '" class="sl6-rn-lim"/><text x="' + (x0 - 6) + '" y="' + (Y(lim) + 4) + '" text-anchor="end" class="sl6-rn-tx">' + n(lim, 2) + '</text>';
      g += '<path d="' + d + '" class="sl6-rn-cv"/>';
      if (p.s > 1 && p.s <= 64) g += '<circle cx="' + X(p.s) + '" cy="' + Y(R$.ganancia(p.F, p.s)) + '" r="5" class="sl6-rn-pt"/>';
      return '<p class="sl6-h sl6-h--2">── ' + esc(fill(t.amd.curve, { n: p.n, f: n(p.F, 2) })) + '</p>' + g + '</svg>';
    }
    function card(k) {
      var c = q('.sl6-rn-card'), nn = k < 0 ? 0 : k + 1;
      c.innerHTML = (k < 0 ? '<p class="sl6-co-0">' + esc(t.start) + '</p>' : '') + '<ol class="sl6-co-ex">' + ST.map(function (s, i) { return '<li class="' + (i < nn ? (i === k ? 'is-cur' : '') : 'is-fut') + '">' + s + '</li>'; }).join('') + '</ol>';
    }
    K.N = function () { return ST.length; };
    K.draw = function (k, going) { card(going ? k : -1); };
    var PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('[data-tab]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tab') === S.tab)); });
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">--' + { cpu: L === 'es' ? 'cpu' : 'cpu', amd: 'amdahl', io: L === 'es' ? 'es' : 'io' }[S.tab] + '</span>' + (S.tab === 'io' && S.io.dev ? ' <b>' + esc(S.io.dev) + '</b>' : '');
    }
    function update(rebuild) { sync(); if (rebuild) form(); compute(); PL.reset(); K6.store(KEY, enc()); K6.keepHash(enc()); }
    function setPath(p, v) {
      var a = p.split('.'), o = S; for (var i = 0; i < a.length - 1; i++) o = o[a[i]]; var last = a[a.length - 1];
      var isName = (a[0] === 'cpu' && a[1] === 'cls' && a[3] === '0') || (a[0] === 'cpu' && a[1] === 'p' && a[3] === '0' && a.length === 4) || (a[0] === 'amd' && a[2] === '0');
      o[last] = isName ? String(v).slice(0, 24) : v;
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab],[data-a],[data-add],[data-del]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-tab')) { S.tab = b.getAttribute('data-tab'); update(true); return; }
      if (b.hasAttribute('data-add')) { if (S.tab === 'cpu') { S.cpu.cls.push([L === 'es' ? 'otra' : 'other', 1]); S.cpu.p.forEach(function (p) { p[2].push(0); }); } else S.amd.push([L === 'es' ? 'otra' : 'other', 10, 1]); S.ex = ''; q('.sl6-sel').value = ''; update(true); return; }
      if (b.hasAttribute('data-del')) { var i = +b.getAttribute('data-del'); if (S.tab === 'cpu') { S.cpu.cls.splice(i, 1); S.cpu.p.forEach(function (p) { p[2].splice(i, 1); }); } else S.amd.splice(i, 1); S.ex = ''; q('.sl6-sel').value = ''; update(true); return; }
      var a = b.getAttribute('data-a'); if (a === 'share') K6.share(K, b, enc()); else if (a === 'theme') K6.toggleTheme(K);
    });
    q('.sl6-rn-in').addEventListener('input', function (e) {
      var i = e.target.closest('[data-k]'); if (!i) return; setPath(i.getAttribute('data-k'), i.value);
      if (/^io\.(rate|unit|polls|act)$/.test(i.getAttribute('data-k'))) { S.io.dev = ''; var sd = q('[data-dev]'); if (sd) sd.value = ''; }
      S.ex = ''; q('.sl6-sel').value = ''; update(false);
    });
    q('.sl6-rn-in').addEventListener('change', function (e) {
      var s = e.target.closest('[data-dev]'); if (!s) return; S.io.dev = s.value;
      if (DEV[s.value]) { var d = DEV[s.value]; S.io.rate = d.rate; S.io.unit = d.unit; S.io.polls = d.polls; S.io.act = d.act; }
      S.ex = ''; q('.sl6-sel').value = ''; update(true);
    });
    q('.sl6-sel').addEventListener('change', function (e) {
      var k = e.target.value; if (!k) return; S.ex = k;
      if (k === 'cpu') { S.tab = 'cpu'; S.cpu = clone(DEF.cpu); if (L === 'en') { S.cpu.cls.forEach(function (c, i) { c[0] = DEFEN.cls[i]; }); S.cpu.p.forEach(function (p, i) { p[0] = DEFEN.p[i]; }); } }
      else if (k === 'amd') { S.tab = 'amd'; S.amd = clone(DEF.amd); if (L === 'en') S.amd.forEach(function (a, i) { a[0] = DEFEN.amd[i]; }); }
      else if (k === 'amd2') { S.tab = 'amd'; S.amd = L === 'es' ? [['resto', 60, 1], ['escáner', 60, 4]] : [['rest', 60, 1], ['scanner', 60, 4]]; }
      else if (k === 'io') { S.tab = 'io'; S.io = clone(DEF.io); }
      else { S.tab = 'io'; S.io = clone(DEF.io); S.io.dev = 'raton'; var d = DEV.raton; S.io.rate = d.rate; S.io.unit = d.unit; S.io.polls = d.polls; }
      update(true);
    });
    q('.sl6-sel').value = S.ex;
    // reto
    var RT = null;
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function pick(a) { return a[rnd(0, a.length - 1)]; }
    function retoNew() {
      var r = Math.random(), box = q('.sl6-reto'), pr;
      if (r < .34) { var N = pick([2, 3, 4, 5, 6, 8, 9, 12]), c = pick([1, 1.5, 2, 2.5, 3]), f = pick([1, 2, 2.5, 3, 4]); RT = { m: 't', N: N, c: c, f: f, want: N * c / f }; pr = fill(t.rT, { N: n(N, 0), c: n(c), f: n(f) }); }
      else if (r < .67) { var F = pick([20, 25, 40, 50, 60, 75, 80, 90]), S2 = pick([2, 4, 5, 10]); RT = { m: 'g', F: F, S: S2, want: R$.ganancia(F / 100, S2) }; pr = fill(t.rG, { F: F, S: S2 }); }
      else { var rr = pick([4, 8, 16, 40, 100, 200]), u = pick([4, 8, 16]), cc = pick([100, 200, 400, 500]), ff = pick([1, 2, 4]); RT = { m: 'p', r: rr, u: u, c: cc, f: ff, want: 100 * (rr * 1e6 / u) * cc / (ff * 1e9) }; pr = fill(t.rP, { r: rr, u: u, c: cc, f: ff }); }
      box.innerHTML = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-rd-q">' + esc(pr) + '</p><div class="sl6-pp-rq"><label><span>' + esc(t.ans) + '</span><input type="text" data-rq="a" inputmode="decimal" autocomplete="off" style="max-width:180px"></label></div>'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-rr="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-rr="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rr]'); if (!b) return; var a = b.getAttribute('data-rr');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var i = q('[data-rq="a"]'), v = num(i.value.replace(/[%s\s]/g, '')), ok = i.value.trim() !== '' && Math.abs(v - RT.want) <= Math.max(0.006, Math.abs(RT.want) * 0.005);
        i.classList.toggle('is-ok', ok); i.classList.toggle('is-bad', !ok);
        q('.sl6-reto__msg').innerHTML = ok ? '<b>' + esc(t.ok) + '</b> (' + n(RT.want, 3) + ')' : esc(t.bad);
      } else if (a === 'sol') {
        S.ex = ''; q('.sl6-sel').value = '';
        if (RT.m === 't') { S.tab = 'cpu'; S.cpu = { cls: [[L === 'es' ? 'todas' : 'all', RT.c]], p: [['programa', RT.f, [RT.N]]] }; }
        else if (RT.m === 'g') { S.tab = 'amd'; S.amd = [[L === 'es' ? 'mejora' : 'improved', RT.F, RT.S], [L === 'es' ? 'resto' : 'rest', 100 - RT.F, 1]]; }
        else { S.tab = 'io'; S.io = clone(DEF.io); S.io.dev = ''; S.io.rate = RT.r * 1e6; S.io.unit = RT.u; S.io.cons = RT.c; S.io.F = RT.f; S.io.polls = 0; }
        update(true); PL.stop(); K.el.classList.add('is-going'); PL.going = true; PL.k = ST.length - 1; PL.draw();
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    update(true); retoNew();
  }
  K6.boot('.sl-sim[data-sim="rendimiento"]', init);
})();
