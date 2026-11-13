/* SergioLearns — entorno MIPS sl-mips v2.0 (13 nov 2026): la carcasa D de los entornos.
   Tarjeta blanca con la sombra de su color, Editor | Simulador arriba, un solo botón principal (Ejecutar) con «Paso a paso»
   al lado, «Ajustar» para lo secundario (tema, Hex/Dec, núcleo, ayudas, ficheros), claro por defecto y oscuro, la barra
   pegada abajo en el móvil, pastillas de ejemplos en el modo libre y, en cada paso, la instrucción explicada con sus valores
   («Explícamelo con calma»: tipo, campos del código máquina y lo que cambia). Lo de dentro sigue siendo QtSpim: registros,
   segmentos de texto y datos, consola, puntos de ruptura. El simulador es SPIM S20 (James R. Larus, licencia BSD).
   Uso:  <div class="sl-mips" data-mips='{"libre": true, "files": [{"name": "suma.s", "code": "…"}], "entrada": "", "alto": 560}'></div>
   Config: libre, files (un .s), entrada, alto (px), ayudas (true|false: fija el selector), id, ejemplos ([{t, n, c}] o false).
   API (la misma de la v1, la usa el motor de cuestionarios): SLMIPS.mount(el, cfg) → {assemble, run, step, stop, code, setCode,
   setView, state, output, messages, regs, spim, setHelp, ready} */
(function () {
  'use strict';
  if (window.SLMIPS) return;
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var B = window.SL_MIPS_BASE || {};
  var CM_URL = B.cm || (window.SL_IDE_BASE && window.SL_IDE_BASE.cm) ||
    'https://cdn.jsdelivr.net/gh/sergiolearns/sergiolearns-codigo@a7cc496f11a874134ff10b1d7cdcc0d9f66c55d6/herramientas/entorno/sl-cm-6.0.2-v1.2.min.js';
  var WASM_URL = B.wasm || 'https://cdn.jsdelivr.net/gh/sergiolearns/sergiolearns-codigo@main/herramientas/mips/entorno/sl-spim.wasm';
  var CHUNK = 20000, LIMIT = 10000000;
  var DOCK = typeof Set === 'function' ? new Set() : null; // entornos con la barra pegada abajo (móvil): Leo sube
  function T(es, en) { return EN ? en : es; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } return null; }
  function hex(n, w) { var s = (n >>> 0).toString(16); while (w && s.length < w) s = '0' + s; return s; }
  function report(e) { try { console.error('[sl-mips]', e); } catch (x) {} }

  /* ---------- iconos SVG (sin emoticonos) ---------- */
  var P = {
    asm: '<path d="M4 4h10l4 4v12H4z"/><path d="M14 4v4h4"/><path d="M8 13l2 2 4-4"/>',
    play: '<path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none"/>', step: '<path d="M4 6h10M4 12h7M4 18h12"/><path d="M17 9l3 3-3 3"/>',
    pause: '<path d="M8 5v14M16 5v14"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>',
    full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', exitfull: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
    down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', up: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    undo: '<path d="M9 7H5V3"/><path d="M5 7a8 8 0 1 1-1 6"/>', code: '<path d="M9 8l-4 4 4 4M15 8l4 4-4 4"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
    dot: '<circle cx="12" cy="12" r="5"/>', chev: '<path d="M6 9l6 6 6-6"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
    adj: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"/>'
  };
  function ico(n, sz) { var s = el('span', 'slm-ico'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<svg viewBox="0 0 24 24" width="' + (sz || 16) + '" height="' + (sz || 16) + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + P[n] + '</svg>'; return s; }
  function btn(n, label, title, cls) { var b = el('button', 'sle-b ' + (cls || '')); b.type = 'button'; if (n) b.appendChild(ico(n)); if (label) b.appendChild(el('span', 'sle-bl', label));
    b.title = title || label || ''; if (!label || title) b.setAttribute('aria-label', title || label); return b; }

  /* ---------- tablas ---------- */
  function parseTab(a) { var o = {}; a.forEach(function (r) { var p = r.split('|'); o[p[0]] = { ops: p[1], d: EN ? p[3] : p[2] }; }); return o; }
  var INS = parseTab(SLM_INS), DIR = parseTab(SLM_DIR);
  var DESC = {}; Object.keys(INS).forEach(function (k) { DESC[k] = INS[k].d.replace(/^pseudo:\s*/, ''); });
  var PSEUDO = {}; SLM_INS.forEach(function (r) { if (/\|pseudo/.test(r)) PSEUDO[r.split('|')[0]] = 1; });
  function regInfo(r) { var k = r.replace('$', ''), v = SLM_REGINFO[k] || SLM_REGINFO[k.charAt(0)] || ''; return v ? v.split('|')[EN ? 1 : 0] : ''; }
  var QREG = ['r0', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3', 't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7',
    's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 't8', 't9', 'k0', 'k1', 'gp', 'sp', 's8', 'ra'];

  /* ---------- carga del editor y del simulador (compartidos por toda la página) ---------- */
  var cmP = null, wasmP = null;
  function loadCM() {
    if (window.SLCM) return Promise.resolve(window.SLCM);
    if (!cmP) cmP = new Promise(function (ok, ko) {
      var s = document.createElement('script'); s.src = CM_URL; s.async = true; s.crossOrigin = 'anonymous';
      var t = setTimeout(function () { cmP = null; ko(new Error('editor: tiempo')); }, 30000);
      s.onload = function () { clearTimeout(t); window.SLCM ? ok(window.SLCM) : ko(new Error('editor')); };
      s.onerror = function () { clearTimeout(t); cmP = null; ko(new Error('editor')); }; document.head.appendChild(s);
    });
    return cmP;
  }
  function loadWasm() {
    if (!wasmP) wasmP = (function () {
      if (window.SL_MIPS_WASM_B64) { var bin = atob(window.SL_MIPS_WASM_B64), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return WebAssembly.compile(u); }
      return fetch(WASM_URL, { mode: 'cors' }).then(function (r) { if (!r.ok) throw new Error('wasm ' + r.status); return r.arrayBuffer(); }).then(function (b) { return WebAssembly.compile(b); });
    })().catch(function (e) { wasmP = null; throw e; });
    return wasmP;
  }

  /* ---------- colores al estilo del Notepad++ de las guías ---------- */
  var RX = /(#.*$)|("(?:[^"\\]|\\.)*"?)|('(?:[^'\\]|\\.)')|(^\s*[A-Za-z_.][\w.]*:)|(\.[A-Za-z]\w*)|(\$[A-Za-z0-9]+)|(-?\b(?:0[xX][0-9a-fA-F]+|\d+)\b)|([A-Za-z_][\w.]*)/g;
  function tokens(line) {
    var out = [], m, first = true; RX.lastIndex = 0;
    while ((m = RX.exec(line))) {
      var k = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'str' : m[4] ? 'lab' : m[5] ? 'dir' : m[6] ? 'reg' : m[7] ? 'num' : 'w';
      var from = m.index, to = m.index + m[0].length;
      if (k === 'lab') { from = m.index + m[0].search(/\S/); }
      if (k === 'w') { var w = m[0].toLowerCase(); if (first && INS[w]) k = PSEUDO[w] ? 'pse' : 'ins'; else k = 'w'; first = false; }
      else if (k === 'dir' || k === 'reg' || k === 'num' || k === 'str') first = false;
      if (k !== 'w') out.push([from, to, k]);
      if (k === 'lab') first = true;
    }
    return out;
  }
  function highlighter(C) {
    var mk = {}; ['ins', 'pse', 'reg', 'dir', 'num', 'str', 'com', 'lab'].forEach(function (k) { mk[k] = C.Decoration.mark({ class: 'cm-slm-' + k }); });
    function build(view) {
      var b = new C.RangeSetBuilder();
      view.visibleRanges.forEach(function (r) {
        var pos = r.from;
        while (pos <= r.to) {
          var line = view.state.doc.lineAt(pos);
          tokens(line.text).forEach(function (t) { if (t[1] > t[0]) b.add(line.from + t[0], line.from + t[1], mk[t[2]]); });
          pos = line.to + 1;
        }
      });
      return b.finish();
    }
    function Pl(view) { this.decorations = build(view); }
    Pl.prototype.update = function (u) { if (u.docChanged || u.viewportChanged) this.decorations = build(u.view); };
    return C.ViewPlugin.fromClass(Pl, { decorations: function (v) { return v.decorations; } });
  }
  function lineMarks(C) {
    var set = C.StateEffect.define();
    var dec = { err: C.Decoration.line({ class: 'cm-slm-errline' }), pc: C.Decoration.line({ class: 'cm-slm-pcline' }) };
    var field = C.StateField.define({
      create: function () { return C.Decoration.none; },
      update: function (v, tr) { v = v.map(tr.changes); tr.effects.forEach(function (e) { if (e.is(set)) v = e.value; }); return v; },
      provide: function (f) { return C.EditorView.decorations.from(f); }
    });
    function mark(view, list) {
      var doc = view.state.doc, b = new C.RangeSetBuilder();
      list.filter(function (x) { return x.line >= 1 && x.line <= doc.lines; }).sort(function (a, c) { return a.line - c.line; })
        .forEach(function (x) { b.add(doc.line(x.line).from, doc.line(x.line).from, dec[x.kind]); });
      view.dispatch({ effects: set.of(b.finish()) });
    }
    return { ext: field, mark: mark };
  }
  function completer(C, getCode) {
    var SN = [
      ['print_string', 'li $v0, 4\nla $a0, ${msg}\nsyscall', T('imprime una cadena (syscall 4)', 'prints a string (syscall 4)')],
      ['print_int', 'li $v0, 1\nmove $a0, ${$t0}\nsyscall', T('imprime un entero (syscall 1)', 'prints an integer (syscall 1)')],
      ['read_int', 'li $v0, 5\nsyscall\nmove ${$t0}, $v0', T('lee un entero en $v0 (syscall 5)', 'reads an integer into $v0 (syscall 5)')],
      ['read_string', 'li $v0, 8\nla $a0, ${buffer}\nli $a1, ${64}\nsyscall', T('lee una cadena (syscall 8)', 'reads a string (syscall 8)')],
      ['print_char', 'li $v0, 11\nli $a0, ${\'\\n\'}\nsyscall', T('imprime un carácter (syscall 11)', 'prints a character (syscall 11)')],
      ['exit', 'li $v0, 10\nsyscall', T('termina el programa (syscall 10)', 'ends the program (syscall 10)')],
      ['main', '.text\n.globl main\nmain:\n\t${}\n\tli $v0, 10\n\tsyscall', T('esqueleto de un programa', 'program skeleton')]
    ];
    return function (ctx) {
      var w = ctx.matchBefore(/[.$]?[\w.]*$/);
      if (!w || (w.from === w.to && !ctx.explicit)) return null;
      var txt = w.text, opts = [];
      if (txt.charAt(0) === '$') {
        SLM_REGS.forEach(function (r) { opts.push({ label: '$' + r, type: 'variable', info: regInfo(r) }); });
      } else if (txt.charAt(0) === '.') {
        Object.keys(DIR).forEach(function (k) { opts.push({ label: k, type: 'keyword', detail: DIR[k].ops, info: DIR[k].d }); });
      } else {
        var line = ctx.state.doc.lineAt(ctx.pos), before = line.text.slice(0, ctx.pos - line.from);
        if (/^\s*([A-Za-z_.][\w.]*:\s*)?[\w.]*$/.test(before)) {
          Object.keys(INS).forEach(function (k) { opts.push({ label: k, type: PSEUDO[k] ? 'function' : 'keyword', detail: INS[k].ops, info: INS[k].d, boost: PSEUDO[k] ? 0 : 1 }); });
          SN.forEach(function (s) { opts.push(C.snippetCompletion(s[1], { label: s[0], type: 'text', detail: T('plantilla', 'template'), info: s[2], boost: -1 })); });
        }
        var seen = {}; (getCode().match(/^\s*[A-Za-z_][\w.]*(?=:)/gm) || []).forEach(function (l) { l = l.trim(); if (!seen[l]) { seen[l] = 1; opts.push({ label: l, type: 'constant', detail: T('etiqueta', 'label'), boost: 2 }); } });
      }
      return { from: w.from, options: opts, validFor: /^[.$]?[\w.]*$/ };
    };
  }

  /* ---------- formatos al estilo de QtSpim ---------- */
  function fmtText(raw) {
    return raw.split('\n').filter(Boolean).map(function (l) {
      var m = /^\[0x([0-9a-f]{8})\]\s+0x([0-9a-f]{8})\s+(.*)$/.exec(l); if (!m) return null;
      var rest = m[3], sc = rest.indexOf(';'), ins = sc >= 0 ? rest.slice(0, sc).replace(/\s+$/, '') : rest.replace(/\s+$/, ''), src = '', ln = 0;
      if (sc >= 0) { src = rest.slice(sc + 1).trim().replace(/\s+/g, ' '); var mm = /^(\d+):/.exec(src); if (mm) ln = +mm[1]; }
      return { addr: parseInt(m[1], 16), enc: m[2], ins: ins, src: src, line: ln };
    }).filter(Boolean);
  }
  function fmtWord(v, dec) { return dec ? ('0000000000' + (v >>> 0)).slice(-10) : hex(v, 8); }
  function asciiOf(words) { var s = []; words.forEach(function (w) { for (var k = 0; k < 4; k++) { var c = (w >>> (8 * k)) & 255; s.push(c >= 32 && c < 127 ? String.fromCharCode(c) : '.'); } }); return s.join(' '); }
  function fmtMem(seg, from, to, dec) {
    var w = seg.w, base = seg.from, rows = [], i = from;
    function word(a) { var k = (a - base) >>> 2; return k < w.length ? w[k] : 0; }
    function partial(a) { if (a % 16) { var ws = []; for (var b = a; b % 16; b += 4) ws.push(word(b)); rows.push({ a: a, ws: ws }); return a + ws.length * 4; } return a; }
    i = partial(i);
    while (i < to) {
      var j = 0; while (i + j * 4 < to && word(i + j * 4) === 0) j++;
      if (j >= 4) { rows.push({ a: i, z: i + j * 4 - 1 }); i += j * 4; i = partial(i); }
      else { var ws = []; do { ws.push(word(i)); i += 4; } while (i % 16); rows.push({ a: i - 16, ws: ws }); }
    }
    return rows.map(function (r) {
      if (r.z != null) return '[' + hex(r.a, 8) + ']..[' + hex(r.z, 8) + ']  00000000';
      return '[' + hex(r.a, 8) + ']    ' + r.ws.map(function (v) { return fmtWord(v, dec); }).join('  ') + (r.ws.length < 4 ? new Array(4 - r.ws.length + 1).join(dec ? '            ' : '          ') : '') + '    ' + asciiOf(r.ws);
    });
  }

  /* ---------- el tema (claro por defecto; la misma elección para todos los entornos) ---------- */
  function themeDark() { try { var t = localStorage.getItem('sl_entorno_tema'); return t === 'oscuro' || t === '"oscuro"'; } catch (e) { return false; } }

  /* ---------- el entorno ---------- */
  var HELPKEYS = ['colores', 'auto', 'explica', 'error'];
  function helpDefault(libre) { var o = {}; HELPKEYS.forEach(function (k) { o[k] = libre ? true : k === 'colores'; }); return o; }
  var N = 0;
  function mount(root, cfg) {
    cfg = cfg || {}; N++;
    var libre = !!cfg.libre, id = cfg.id || ('m' + N);
    var key = 'sl_mips_' + location.pathname + '_' + id;
    var file = (cfg.files && cfg.files[0]) || { name: 'programa.s', code: '.text\n.globl main\nmain:\n\tli $v0, 10\n\tsyscall\n' };
    var sample = file.code, fname = file.name;
    var saved = libre ? store(key) : null; if (saved && saved.code != null) { file = { name: saved.name || fname, code: saved.code }; }
    var shared = libre && /#mips=/.test(location.hash) ? location.hash.slice(location.hash.indexOf('#mips=') + 6) : null;
    var help = (libre ? store('sl_mips_help') : store('sl_mips_help_exam')) || helpDefault(libre);
    if (cfg.ayudas === false) help = helpDefault(false); if (cfg.ayudas === true) help = helpDefault(true);
    var dec = false, kernel = false, view = 'ed';
    var spim = null, loaded = false, dirty = true, running = false, pauseReq = false, executed = 0, lastRegs = null, bps = {};
    var mod = null, C = null, cm = null, marks = null, colorsC = null, autoC = null, textarea = null;
    var out = '', inputs = [], waitMode = null, pend = null, mainAddr = 0;

    /* las pastillas de ejemplos (modo libre): la primera es el ejemplo de la página */
    var EJ = null;
    // solo en la página de Entornos (o si se piden): en los artículos, el ejemplo del artículo y nada más
    var wantEj = cfg.ejemplos === true || Array.isArray(cfg.ejemplos) || (cfg.ejemplos == null && !!(root.closest && root.closest('.sl-envp')));
    if (libre && wantEj && window.SLM_EJ) {
      EJ = [{ t: cfg.titulo || T('El ejemplo', 'The example'), n: fname, c: sample }].concat(Array.isArray(cfg.ejemplos) ? cfg.ejemplos : (SLM_EJ[EN ? 'en' : 'es'] || []));
    }
    root.textContent = '';
    var card = root;
    if (EJ && EJ.length > 1) {
      root.classList.add('sle-wrap'); card = el('div');
      var pills = el('div', 'sle-pills'); pills.appendChild(el('span', 'sle-pills__l', T('Empieza con', 'Start with')));
      EJ.forEach(function (e, i) { var b = el('button', 'sle-pill', e.t); b.type = 'button'; b.dataset.i = i; pills.appendChild(b); });
      root.append(pills, card);
    }
    root.classList.add('slm-on'); card.classList.add('slm', 'sle'); if (!libre) card.classList.add('sle-exam');
    if (cfg.alto) card.style.setProperty('--slm-h', cfg.alto + 'px');

    /* barra de arriba: Editor | Simulador, el fichero, el estado y la pantalla completa */
    var top = el('div', 'sle-top'), seg = el('div', 'sle-seg'); seg.setAttribute('role', 'tablist'); seg.setAttribute('aria-label', T('Vista', 'View'));
    var tEd = el('button', 'is-on'), tSim = el('button');
    [[tEd, 'code', T('Editor', 'Editor')], [tSim, 'chip', T('Simulador', 'Simulator')]].forEach(function (x) { x[0].type = 'button'; x[0].setAttribute('role', 'tab'); x[0].append(ico(x[1], 15), el('span', '', x[2])); });
    tEd.setAttribute('aria-selected', 'true'); tSim.setAttribute('aria-selected', 'false'); seg.append(tEd, tSim);
    var fn = el('span', 'sle-fname', file.name);
    var stp = el('span', 'sle-state'), stDot = el('span', 'sle-state__d'), stTx = el('span', '', ''); stp.append(stDot, stTx);
    var lang = el('span', 'sle-lang', 'MIPS · SPIM');
    var bFull = btn('full', '', T('Pantalla completa', 'Full screen'), 'sle-b--icon');
    top.append(seg, fn, stp, lang, bFull); card.appendChild(top);

    /* la tira: la instrucción que se acaba de ejecutar */
    var tira = el('div', 'sle-tira'), tK = el('span', 'sle-tira__k'), tC = el('span', 'sle-tira__c'), tN = el('span', 'sle-tira__n'); tira.append(tK, tC, tN); tira.hidden = true;
    card.appendChild(tira);

    /* cuerpo */
    var body = el('div', 'slm-body'), ed = el('div', 'slm-ed'), sim = el('div', 'slm-sim'); sim.hidden = true;
    var edBox = el('div', 'slm-edbox'); ed.append(edBox);
    var regs = el('div', 'slm-regs'), segs = el('div', 'slm-segs');
    var rTabs = el('div', 'slm-ptabs'), rInt = el('button', 'is-on', 'Int Regs'), rFp = el('button', '', 'FP Regs'); rInt.type = rFp.type = 'button'; rTabs.append(rInt, rFp);
    var rBox = el('div', 'slm-pane slm-regbox'); regs.append(rTabs, rBox);
    var sTabs = el('div', 'slm-ptabs'), sTxt = el('button', 'is-on', 'Text'), sDat = el('button', '', 'Data'); sTxt.type = sDat.type = 'button'; sTabs.append(sTxt, sDat);
    var sBox = el('div', 'slm-pane slm-segbox'); segs.append(sTabs, sBox);
    sim.append(regs, segs); body.append(ed, sim); card.appendChild(body);

    /* la frase del paso y «Explícamelo con calma» */
    var sayBox = el('div', 'sle-say'), sayT = el('p', 'sle-say__t'), calmB = el('button', 'sle-calm'), calm = el('div', 'sle-say__calm');
    calmB.type = 'button'; calmB.append(ico('bulb'), el('span', '', T('Explícamelo con calma', 'Explain it slowly'))); calmB.setAttribute('aria-expanded', 'false');
    calm.hidden = true; sayBox.append(sayT, calmB, calm); sayBox.hidden = true; card.appendChild(sayBox);

    /* la tarjeta de error: qué ha pasado, en qué línea y cómo se arregla (con «Pregúntale a Leo») */
    var errBox = el('div', 'sle-err'); errBox.hidden = true; errBox.setAttribute('role', 'alert'); card.appendChild(errBox);
    var firstErr = null, excN = 0;

    /* consola y mensajes */
    var split = el('div', 'slm-split'); split.setAttribute('role', 'separator'); split.setAttribute('aria-orientation', 'horizontal');
    split.title = T('Arrastra para cambiar el alto de la consola (doble clic: recogerla o desplegarla)', 'Drag to resize the console (double click: collapse or expand it)');
    var low = el('div', 'slm-low'), lTabs = el('div', 'slm-ptabs'), lCon = el('button', 'is-on', T('Consola', 'Console')), lMsg = el('button', '', T('Mensajes', 'Messages')); lCon.type = lMsg.type = 'button';
    var lClear = el('button', 'slm-lclear', T('Limpiar', 'Clear')); lClear.type = 'button';
    var lMin = el('button', 'slm-lmin'); lMin.type = 'button'; lMin.appendChild(ico('chev')); lTabs.append(lCon, lMsg, lClear, lMin);
    var con = el('pre', 'slm-con'), msg = el('pre', 'slm-msg'); msg.hidden = true; con.setAttribute('aria-live', 'polite');
    var inRow = el('form', 'slm-inrow'), inBox = el('input', 'slm-in'); inBox.type = 'text'; inBox.autocomplete = 'off'; inBox.spellcheck = false;
    inBox.setAttribute('aria-label', T('Tu respuesta al programa', 'Your answer to the program')); var inOk = el('button', 'sle-b sle-b--vio', T('Enviar', 'Send')); inOk.type = 'submit';
    var inChip = el('span', 'sle-wait', T('Tu programa espera tu respuesta', 'Your program is waiting for your answer'));
    inRow.append(inBox, inOk, inChip); inRow.hidden = true;
    low.append(lTabs, con, msg); card.appendChild(split); card.appendChild(low);

    /* barra de abajo: Ejecutar, Paso a paso, Cargar, Pausa, Parar, el estado y Ajustar (pegada abajo en el móvil) */
    var bot = el('div', 'sle-bot');
    var bRun = btn('play', T('Ejecutar', 'Run'), T('Ejecutar (F5)', 'Run (F5)'), 'sle-b--go');
    var bStep = btn('step', T('Paso a paso', 'Step'), T('Siguiente instrucción (F10)', 'Next instruction (F10)'), 'sle-b--out');
    var bAsm = btn('asm', T('Cargar', 'Load'), T('Ensamblar y cargar (como «Reinitialize and Load File» de QtSpim)', 'Assemble and load (like QtSpim\'s «Reinitialize and Load File»)'), 'sle-b--ghost');
    var bPause = btn('pause', '', T('Pausa', 'Pause'), 'sle-b--icon sle-b--pause'), bStop = btn('stop', '', T('Parar (vuelve al principio)', 'Stop (back to the start)'), 'sle-b--icon sle-b--stop');
    var stL = el('span', 'sle-msg'), stR = el('span', 'sle-pc');
    var bAdj = btn('adj', T('Ajustar', 'Settings'), '', 'sle-b--out sle-b--adj'); bAdj.setAttribute('aria-haspopup', 'true'); bAdj.setAttribute('aria-expanded', 'false');
    bot.append(bRun, bStep, bAsm, bPause, bStop, stL, bAdj); card.appendChild(bot);

    /* menú «Ajustar» */
    var adj = el('div', 'sle-pop'); adj.hidden = true; adj.setAttribute('role', 'dialog'); adj.setAttribute('aria-label', T('Ajustar', 'Settings'));
    function segRow(label, opts, cur, on) {
      var r = el('div', 'sle-pop__r'); r.appendChild(el('span', '', label)); var g = el('span', 'sle-mini');
      opts.forEach(function (o) { var b = el('button', o[0] === cur ? 'is-on' : '', o[1]); b.type = 'button'; b.dataset.v = o[0]; b.setAttribute('aria-pressed', o[0] === cur); b.onclick = function () { Array.prototype.forEach.call(g.children, function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); }); on(o[0]); }; g.appendChild(b); });
      r.appendChild(g); return r;
    }
    var dark = themeDark();
    adj.appendChild(segRow(T('Tema', 'Theme'), [['c', T('Claro', 'Light')], ['o', T('Oscuro', 'Dark')]], dark ? 'o' : 'c', function (v) { setTheme(v === 'o'); try { localStorage.setItem('sl_entorno_tema', v === 'o' ? 'oscuro' : 'claro'); } catch (e) {} }));
    adj.appendChild(segRow(T('Números', 'Numbers'), [['h', 'Hex'], ['d', 'Dec']], 'h', function (v) { dec = v === 'd'; render(); }));
    var kRow = el('label', 'sle-pop__r'), kIn = el('input'); kIn.type = 'checkbox'; kRow.append(el('span', '', T('Segmento del núcleo', 'Kernel segment')), kIn); adj.appendChild(kRow);
    adj.appendChild(el('p', 'sle-pop__h', T('Ayudas', 'Hints')));
    var HL = { colores: T('Colores del código', 'Code colours'), auto: T('Autocompletado y plantillas', 'Autocomplete and templates'),
      explica: T('Explicación de cada paso', 'Explanation of each step'), error: T('Errores y línea actual en el editor', 'Errors and current line in the editor') };
    HELPKEYS.forEach(function (k) { var l = el('label', 'sle-pop__r'), c = el('input'); c.type = 'checkbox'; c.checked = !!help[k]; c.dataset.k = k;
      if (cfg.ayudas != null) c.disabled = true; l.append(el('span', '', HL[k]), c); adj.appendChild(l); });
    adj.appendChild(el('p', 'sle-pop__n', libre ? T('En el examen se escribe sin ayudas: practica también así.', 'The exam has no hints: practise that way too.') : T('Como en el examen: empiezan apagadas.', 'Like the exam: they start off.')));
    var mDown, mUp, mShare, mReset, fileIn;
    if (libre) {
      adj.appendChild(el('div', 'sle-pop__sep'));
      mDown = btn('down', T('Descargar el .s', 'Download the .s'), '', 'sle-pop__a'); mUp = btn('up', T('Subir un .s', 'Upload a .s'), '', 'sle-pop__a');
      mShare = btn('link', T('Copiar enlace para compartir', 'Copy share link'), '', 'sle-pop__a'); mReset = btn('undo', T('Volver al ejemplo', 'Back to the example'), '', 'sle-pop__a');
      fileIn = el('input'); fileIn.type = 'file'; fileIn.accept = '.s,.asm,.txt'; fileIn.hidden = true;
      adj.append(mDown, mUp, mShare, mReset, fileIn);
    }
    adj.appendChild(el('p', 'sle-pop__n', T('F5 ejecuta · F10 va instrucción a instrucción', 'F5 runs · F10 goes one instruction at a time')));
    card.appendChild(adj);

    /* ---------- utilidades de la interfaz ---------- */
    function setTheme(d) { dark = d; card.classList.toggle('is-dark', d); }
    setTheme(dark);
    var LOWK = 'sl_mips_low', LOWMK = 'sl_mips_lowmin';
    function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
    function lowMin(on, keep) {
      card.classList.toggle('is-lowmin', !!on);
      lMin.title = on ? T('Desplegar la consola', 'Expand the console') : T('Recoger la consola', 'Collapse the console');
      lMin.setAttribute('aria-label', lMin.title); lMin.setAttribute('aria-expanded', on ? 'false' : 'true');
      if (!keep) lsSet(LOWMK, on ? '1' : null);
      if (cm) cm.requestMeasure();
    }
    var lowSaved = parseInt(lsGet(LOWK), 10); if (lowSaved >= 60 && lowSaved <= 900) card.style.setProperty('--slm-low', lowSaved + 'px');
    lowMin(lsGet(LOWMK) === '1', true);
    lMin.addEventListener('click', function () { lowMin(!card.classList.contains('is-lowmin')); });
    split.addEventListener('dblclick', function () { lowMin(!card.classList.contains('is-lowmin')); });
    split.addEventListener('pointerdown', function (e) {
      if (e.button) return; e.preventDefault(); try { split.setPointerCapture(e.pointerId); } catch (x) {}
      var y0 = e.clientY, h0 = card.classList.contains('is-lowmin') ? 60 : low.getBoundingClientRect().height, h = h0;
      lowMin(false); card.classList.add('is-drag');
      var max = function () { return Math.max(120, Math.min(window.innerHeight * 0.75, card.getBoundingClientRect().height - 180)); };
      var mv = function (ev) { h = Math.round(Math.min(max(), Math.max(60, h0 + (y0 - ev.clientY)))); card.style.setProperty('--slm-low', h + 'px'); };
      var up = function () { split.removeEventListener('pointermove', mv); split.removeEventListener('pointerup', up); split.removeEventListener('pointercancel', up); card.classList.remove('is-drag'); lsSet(LOWK, String(h)); if (cm) cm.requestMeasure(); };
      split.addEventListener('pointermove', mv); split.addEventListener('pointerup', up); split.addEventListener('pointercancel', up);
    });
    split.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return; e.preventDefault(); lowMin(false);
      var h = Math.min(900, Math.max(60, low.getBoundingClientRect().height + (e.key === 'ArrowUp' ? 20 : -20))); card.style.setProperty('--slm-low', h + 'px'); lsSet(LOWK, String(h));
    });
    split.tabIndex = 0;
    function setView(v) {
      view = v; ed.hidden = v !== 'ed'; sim.hidden = v !== 'sim';
      tEd.classList.toggle('is-on', v === 'ed'); tSim.classList.toggle('is-on', v === 'sim');
      tEd.setAttribute('aria-selected', v === 'ed'); tSim.setAttribute('aria-selected', v === 'sim');
      card.classList.toggle('is-sim', v === 'sim');
      render(); if (v === 'ed' && cm) cm.requestMeasure();
    }
    var STATES = { ok: T('listo', 'ready'), run: T('ejecutando', 'running'), wait: T('espera tu respuesta', 'waiting for you'), end: T('terminado', 'finished'), err: T('error', 'error'), pause: T('en pausa', 'paused'), load: T('cargando', 'loading') };
    var STATES_S = { wait: T('te espera', 'waiting'), run: T('ejecuta', 'running') }; // en el móvil, más corto
    function state(k) { stp.className = 'sle-state is-' + k; stTx.textContent = STATES[k] || ''; stTx.setAttribute('data-s', STATES_S[k] || STATES[k] || ''); }
    function say(t, cls) { stL.textContent = t; stL.className = 'sle-msg' + (cls ? ' is-' + cls : ''); stL.title = t; }
    function msgAdd(t, err) { if (!t) return; var s = el('span', err ? 'is-err' : '', t); msg.appendChild(s); msg.scrollTop = msg.scrollHeight; if (err) showLow('msg'); }
    function conAdd(t, cls) { if (!t) return; out += t; if (out.length > 200000) { out = out.slice(-150000); con.textContent = out; } else { var s = document.createTextNode(t); if (cls) { var sp = el('span', cls); sp.appendChild(s); con.appendChild(sp); } else con.appendChild(s); } con.scrollTop = con.scrollHeight; }
    function showLow(w) { lowMin(false, true); con.hidden = w !== 'con'; msg.hidden = w !== 'msg'; lCon.classList.toggle('is-on', w === 'con'); lMsg.classList.toggle('is-on', w === 'msg'); }
    function code() { return cm ? cm.state.doc.toString() : textarea ? textarea.value : file.code; }
    function setCode(c) { if (cm) cm.dispatch({ changes: { from: 0, to: cm.state.doc.length, insert: c } }); else if (textarea) textarea.value = c; file.code = c; changed(); }
    function save() { if (libre) store(key, { name: file.name, code: code() }); }
    var saveT = null;
    function changed() { dirty = true; if (!errBox.hidden) errBox.classList.add('is-old'); if (marks && cm) marks.mark(cm, []); clearTimeout(saveT); saveT = setTimeout(save, 400); }
    function busy(on) { if (on) lowMin(false, true); running = on; card.classList.toggle('is-running', on); bAsm.disabled = on; bStep.disabled = on; bPause.disabled = !on; if (on) state('run'); }
    function srcLine(addr) { var t = textRows.filter(function (r) { return r.addr === addr; })[0]; if (!t) return 0; if (t.line) return t.line; var i = textRows.indexOf(t); while (i > 0 && !textRows[i].line) i--; return textRows[i].line || 0; }
    function hideStep() { tira.hidden = true; delete tira.dataset.on; sayBox.hidden = true; calm.hidden = true; calmB.setAttribute('aria-expanded', 'false'); }

    /* ---------- ensamblar y cargar ---------- */
    var textRows = [], kRows = [];
    var LEO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="7" fill="#FF6B4A"/><circle cx="9.5" cy="11.5" r="1.6" fill="#1E1B2E"/><circle cx="14.5" cy="11.5" r="1.6" fill="#1E1B2E"/></svg>';
    function cardOn() { return libre && help.error && !!window.SLMErr; }
    function hideErr() { errBox.hidden = true; errBox.textContent = ''; firstErr = null; excN = 0; }
    function codeTxt(par, s) { String(s || '').split('`').forEach(function (part, j) { if (part) par.appendChild(j % 2 ? el('code', '', part) : document.createTextNode(part)); }); }
    function parserLine(m, src) { // SPIM a veces cuenta una línea de más: se busca el texto que cita
      var em = /on line (\d+) of file/.exec(m), ln = em ? +em[1] : 0;
      var lt = /\n\t(.*)\n/.exec(m); if (lt && ln) { var lines = src.split('\n'), want = lt[1].trim(); for (var k = Math.max(1, ln - 2); k <= Math.min(lines.length, ln + 1); k++) if (lines[k - 1].trim() === want) { ln = k; break; } }
      return ln;
    }
    function errCtx(raw, line) {
      var src = code().split('\n'), pm = /at PC=0x([0-9a-f]+)/.exec(raw), a = pm ? parseInt(pm[1], 16) : (spim && spim.x ? spim.spec().PC : 0);
      var pl = a ? srcLine(a) : 0, row = a ? rowAt(a) : null, L = line || pl;
      return { en: EN, line: L, text: L ? src[L - 1] || '' : '', labels: window.SLMErr.labels(code()),
        ins: pl ? String(src[pl - 1] || '').replace(/^\s*[A-Za-z_.][\w.]*\s*:/, '').trim() : '', mach: row ? row.ins : '' };
    }
    function noteErr(m) { // apunta el primer error de la ejecución; true = hay que parar ya
      if (!m || !window.SLMErr) return false;
      excN += (m.match(/Exception occurred at PC/g) || []).length;
      if (!firstErr) { var x = null; try { x = window.SLMErr(m, errCtx(m, 0)); } catch (e) { report(e); } if (x && !x.warn) firstErr = x; }
      return !!(firstErr && firstErr.stop) || excN > 20;
    }
    function goLine(n) {
      if (!cm || !n) return; if (!card.classList.contains('is-wide')) setView('ed');
      var ln = cm.state.doc.line(Math.min(n, cm.state.doc.lines)); cm.dispatch({ selection: { anchor: ln.from }, scrollIntoView: true });
      if (marks) marks.mark(cm, [{ line: n, kind: 'err' }]); try { cm.focus(); } catch (e) {}
    }
    function askLeo(x) {
      var q = T('No sé arreglar este error de mi programa MIPS: «', 'I cannot fix this error in my MIPS program: "') + x.t + T('»', '"') + (x.line ? T(' (línea ', ' (line ') + x.line + ')' : '') +
        T('. SPIM dice: ', '. SPIM says: ') + x.raw.replace(/@prog/g, file.name).split('\n').slice(0, 3).join(' ').replace(/\s+/g, ' ').slice(0, 220);
      if (card.classList.contains('is-full')) setFull(false); // el panel de Leo queda fuera de la pantalla completa
      try { window.SLBOT.ask(q); } catch (e) { report(e); }
    }
    function showErr(x) {
      if (!x || !cardOn()) return;
      errBox.textContent = ''; errBox.className = 'sle-err' + (x.warn ? ' is-warn' : '');
      var c = el('div', 'sle-err__c'), h = el('div', 'sle-err__h'), cl = el('button', 'sle-err__x');
      cl.type = 'button'; cl.title = T('Cerrar', 'Close'); cl.setAttribute('aria-label', cl.title); cl.appendChild(ico('x')); cl.onclick = function () { errBox.hidden = true; };
      h.append(el('span', 'sle-err__k', x.k || 'error'), el('span', 'sle-err__w', file.name + (x.line ? T(', línea ', ', line ') + x.line : '')), cl);
      var t = el('p', 'sle-err__t', x.t), p = el('p', 'sle-err__p'); codeTxt(p, x.p);
      var bs = el('div', 'sle-err__b');
      if (x.line && cm) { var go = btn('', T('Ir a la línea ', 'Go to line ') + x.line, '', 'sle-b--ink'); go.onclick = function () { goLine(x.line); }; bs.appendChild(go); }
      if (window.SLBOT && typeof window.SLBOT.ask === 'function') {
        var lb = el('button', 'sle-b sle-b--leo'); lb.type = 'button'; lb.innerHTML = LEO; lb.appendChild(el('span', 'sle-bl', T('Pregúntale a Leo', 'Ask Leo')));
        lb.title = T('Abre a Leo con tu código y este error ya puestos', 'Opens Leo with your code and this error'); lb.onclick = function () { askLeo(x); }; bs.appendChild(lb);
      }
      var d = el('details', 'sle-err__d'); d.append(el('summary', '', T('El mensaje original de SPIM', 'The original SPIM message')), el('pre', '', x.raw.replace(/@prog/g, file.name)));
      c.append(h, t, p); if (bs.childNodes.length) c.appendChild(bs); c.appendChild(d);
      errBox.appendChild(c); errBox.hidden = false;
    }
    function assemble(quiet) {
      if (!mod) { say(T('Cargando el simulador…', 'Loading the simulator…')); return false; }
      if (!spim) spim = new window.SLMipsSpim(mod);
      var src = code(), r = spim.load(src, 0); spim.clearIO(); hideErr();
      loaded = true; dirty = false; executed = 0; lastRegs = null; waitMode = null; pend = null; inRow.hidden = true; if (inRow.parentNode) inRow.parentNode.removeChild(inRow); hideStep();
      msg.textContent = ''; msgAdd('SPIM ' + spim.version() + '\nCopyright 1990-2017 by James Larus. All Rights Reserved.\nSPIM is distributed under a BSD license.\n' +
        T('Cargado: ', 'Loaded: ') + file.name + '\n');
      textRows = fmtText(spim.text(0)); kRows = fmtText(spim.text(1));
      try { mainAddr = spim.sym('main'); } catch (e) { mainAddr = 0; }
      Object.keys(bps).forEach(function (a) { if (textRows.some(function (t) { return t.addr === +a; })) spim.bp(+a, true); else delete bps[a]; });
      if (cfg.entrada) spim.input(String(cfg.entrada).replace(/\r/g, '') + (/\n$/.test(cfg.entrada) ? '' : '\n'));
      inputs = [];
      if (!r.ok) {
        msgAdd(r.msg.replace(/@prog/g, file.name), true);
        var ln = parserLine(r.msg, src), xe = null;
        if (view !== 'ed' && !card.classList.contains('is-wide')) setView('ed'); // el fallo está en el código: se enseña el editor
        if (help.error && marks && ln) { marks.mark(cm, [{ line: ln, kind: 'err' }]); cm.dispatch({ selection: { anchor: cm.state.doc.line(Math.min(ln, cm.state.doc.lines)).from }, scrollIntoView: true }); }
        if (cardOn()) { try { xe = window.SLMErr(r.msg, errCtx(r.msg, ln)); } catch (e) { report(e); } }
        if (xe) { showErr(xe); say(T('Error al ensamblar en la línea ', 'Assembly error on line ') + (ln || '?') + ': ' + xe.t + '.', 'err'); }
        else say(T('Error al ensamblar en la línea ', 'Assembly error on line ') + (ln || '?') + T(': mira «Mensajes».', ': see «Messages».'), 'err');
        state('err');
        loaded = false; render(); return false;
      }
      if (r.msg) msgAdd(r.msg.replace(/@prog/g, file.name));
      if (marks) marks.mark(cm, []);
      var xw = null, lw = 0;
      if (r.msg && /\(parser\)/.test(r.msg) && cardOn()) { lw = parserLine(r.msg, src); try { xw = window.SLMErr(r.msg, errCtx(r.msg, lw)); } catch (e) { report(e); } }
      if (xw) { showErr(xw); if (marks && lw && help.error) marks.mark(cm, [{ line: lw, kind: 'err' }]); say(T('Programa cargado con un aviso en la línea ', 'Program loaded with a warning on line ') + lw + ': ' + xw.t + '.', 'warn'); }
      else if (!quiet) say(T('Programa cargado. Pulsa Ejecutar o ve paso a paso.', 'Program loaded. Press Run or go step by step.'), 'ok');
      state('ok');
      lastRegs = spim.regs().concat([spim.spec().HI, spim.spec().LO]);
      render(); return true;
    }

    /* ---------- ejecutar ---------- */
    function flush() { var o = spim.takeOut(), m = spim.takeMsg(); spim.clearIO(); if (o) conAdd(o); if (m) msgAdd(m.replace(/@prog/g, file.name), /Exception|Attempt|error|undefined/i.test(m)); return { o: o, m: m }; }
    function finishStatus(st, m) {
      var pc = spim.spec().PC;
      var xs = firstErr && !firstErr.shown ? firstErr : null; if (xs) { xs.shown = true; showErr(xs); }
      if (st === 'fin') {
        if (excN) say(T('Terminado, pero con ', 'Finished, but with ') + excN + T(excN === 1 ? ' excepción' : ' excepciones', excN === 1 ? ' exception' : ' exceptions') + (cardOn() ? '' : T(': mira «Mensajes».', ': see «Messages».')), 'err');
        else say(T('Programa terminado', 'Program finished') + ' · ' + executed.toLocaleString(EN ? 'en' : 'es') + T(' instrucciones', ' instructions'), 'ok');
        state('end'); loaded = false;
      }
      else if (st === 'error') { say(firstErr ? T('Se ha parado: ', 'Stopped: ') + firstErr.t + (cardOn() ? '.' : T('. Mira «Mensajes».', '. See «Messages».')) : T('La ejecución se ha parado por un error: mira «Mensajes».', 'Execution stopped by an error: see «Messages».'), 'err'); state('err'); loaded = false; }
      else if (st === 'parada') { say(T('Punto de ruptura en ', 'Breakpoint at ') + hex(pc, 8) + T('. Ejecutar sigue; Paso a paso va de una en una.', '. Run continues; Step goes one by one.'), 'warn'); state('pause'); }
      else if (st === 'entrada') { say(T('El programa espera que escribas algo en la consola.', 'The program is waiting for you to type in the console.'), 'warn'); state('wait'); con.appendChild(inRow); inRow.hidden = false; showLow('con'); con.scrollTop = con.scrollHeight; setTimeout(function () { try { inBox.focus({ preventScroll: true }); } catch (e) {} }, 0); }
      else if (st === 'pausa') { say(T('En pausa en ', 'Paused at ') + hex(pc, 8) + T('. Ejecutar sigue.', '. Run continues.'), 'warn'); state('pause'); }
      else { state('ok'); if (xs) say(T('Excepción: ', 'Exception: ') + xs.t + '.', 'err'); }
      if (m && /Exception occurred at PC=0x([0-9a-f]+)/.test(m) && help.error && marks) { var l = srcLine(parseInt(RegExp.$1, 16)); if (l) marks.mark(cm, [{ line: l, kind: 'err' }]); }
      render();
    }
    function ensure() { if (!loaded || dirty) { conAdd(out && !/\n$/.test(out) ? '\n' : ''); if (!assemble(true)) return false; } return true; }
    function run() {
      if (running) return; if (waitMode) { inBox.focus(); return; }
      if (!ensure()) return;
      hideStep(); busy(true); pauseReq = false; say(T('Ejecutando…', 'Running…'));
      var t0 = Date.now(), cont = 1, base0 = spim.count();
      (function chunk() {
        var st;
        try { st = spim.run(CHUNK, cont); } catch (e) { report(e); st = 'error'; msgAdd(String(e), true); }
        cont = 1; executed = spim.count();
        var f = flush();
        if (noteErr(f.m) && st !== 'fin' && st !== 'error') { busy(false); return finishStatus('error', f.m); }
        if (st === 'sigue') {
          if (pauseReq) { busy(false); return finishStatus('pausa', f.m); }
          if (executed - base0 >= LIMIT) { busy(false); say(T('Llevas 10 millones de instrucciones: ¿un bucle infinito? Ejecutar sigue; Parar vuelve al principio.', '10 million instructions so far: an infinite loop? Run continues; Stop goes back to the start.'), 'warn'); state('pause'); render(); return; }
          return setTimeout(chunk, 0);
        }
        busy(false); if (st === 'entrada') waitMode = 'run';
        finishStatus(st, f.m);
      })();
      void t0;
    }
    function regsNow() { var s = spim.spec(); return spim.regs().concat([s.HI, s.LO]); }
    function rowAt(pc) { return textRows.concat(kRows).filter(function (r) { return r.addr === pc; })[0] || { addr: pc, enc: '', ins: spim.inst(pc).replace(/^\[0x[0-9a-f]+\]\s+0x[0-9a-f]+\s+/, '').replace(/\s*;.*$/, ''), src: '' }; }
    function step() {
      if (running) return; if (waitMode) { inBox.focus(); return; }
      if (!ensure()) return;
      var b = pend || { pc: spim.spec().PC, R: regsNow() }; pend = null;
      b.row = rowAt(b.pc);
      var st;
      try { st = spim.run(1, 1); } catch (e) { report(e); st = 'error'; }
      executed = spim.count();
      var f = flush(), must = noteErr(f.m);
      if (must && (st === 'sigue' || st === 'parada')) st = 'error';
      if (st === 'entrada') { waitMode = 'step'; pend = b; showStep(b, { pc: spim.spec().PC, R: regsNow() }, '', true); finishStatus(st, f.m); return; }
      showStep(b, { pc: spim.spec().PC, R: regsNow() }, f.o, false);
      if (st === 'sigue' || st === 'parada') { if (st === 'parada') state('pause'); else state('ok'); say(T('Instrucción ', 'Instruction ') + executed + T(' ejecutada', ' executed'), 'ok'); render(); if (f.m && /Exception/.test(f.m)) finishStatus('sigue', f.m); return; }
      finishStatus(st, f.m);
    }
    function showStep(b, a, o, waiting) {
      var x; try { x = window.SLMExplica(b, a, { en: EN, rows: textRows, mainAddr: mainAddr, out: o, waiting: waiting, desc: DESC }); } catch (e) { report(e); return; }
      tK.textContent = (EN ? 'step ' : 'paso ') + (executed + (waiting ? 1 : 0)) + ' · 0x' + hex(b.pc, 8);
      tC.textContent = x.startup ? b.row.ins.replace(/\s*\[.*$/, '') : (x.src || b.row.ins);
      tN.textContent = x.short || '';
      tira.dataset.on = '1'; tira.hidden = !help.explica;
      if (help.explica) {
        sayT.textContent = x.say; calm.textContent = '';
        x.calm.forEach(function (c) { calm.appendChild(el('p', '', c)); });
        sayBox.hidden = false;
      }
    }
    function stop() { pauseReq = true; if (running) { setTimeout(stop, 30); return; } waitMode = null; pend = null; inRow.hidden = true; if (inRow.parentNode) inRow.parentNode.removeChild(inRow); if (out && !/\n$/.test(out)) conAdd('\n'); assemble(true); say(T('Parado: el programa vuelve al principio.', 'Stopped: the program is back at the start.')); }
    inRow.onsubmit = function (e) {
      e.preventDefault(); if (!spim) return;
      var v = inBox.value; inBox.value = ''; inRow.hidden = true; if (inRow.parentNode) inRow.parentNode.removeChild(inRow);
      spim.input(v + '\n'); conAdd(v + '\n', 'slm-echo'); inputs.push(v);
      var m = waitMode; waitMode = null;
      if (m === 'step') step(); else run();
    };
    calmB.onclick = function () { var on = calm.hidden; calm.hidden = !on; calmB.setAttribute('aria-expanded', on); calmB.classList.toggle('is-on', on); };

    /* ---------- dibujar registros y segmentos ---------- */
    var regTab = 'int', segTab = 'text';
    function render() {
      stR.textContent = spim && spim.x && loaded ? 'PC ' + hex(spim.spec().PC, 8) : '';
      if (help.error && marks && cm && spim && spim.x && loaded && view !== 'sim') { var l0 = srcLine(spim.spec().PC); marks.mark(cm, l0 ? [{ line: l0, kind: 'pc' }] : []); }
      if (view !== 'sim') return;
      renderRegs(); renderSeg();
    }
    function renderRegs() {
      rBox.textContent = '';
      if (!spim || !spim.x) { rBox.appendChild(el('p', 'slm-empty', T('Pulsa Cargar, Ejecutar o Paso a paso para ensamblar el programa.', 'Press Load, Run or Step to assemble the program.'))); return; }
      var s = spim.spec(), R = spim.regs(), cur = R.concat([s.HI, s.LO]), ch = {};
      if (lastRegs) cur.forEach(function (v, i) { if (v !== lastRegs[i]) ch[i] = 1; });
      lastRegs = cur;
      var f = function (v) { return dec ? String(v | 0) : hex(v); };
      var lines = [];
      if (regTab === 'int') {
        lines.push(['PC', 'PC      = ' + hex(s.PC)], ['EPC', 'EPC     = ' + hex(s.EPC)], ['Cause', 'Cause   = ' + hex(s.Cause)], ['BadVAddr', 'BadVAddr = ' + hex(s.BadVAddr)], ['Status', 'Status  = ' + hex(s.Status)], ['', ''],
          ['HI', 'HI      = ' + f(s.HI), ch[32]], ['LO', 'LO      = ' + f(s.LO), ch[33]], ['', '']);
        R.forEach(function (v, i) { var n = ('R' + i + '   ').slice(0, 4); lines.push(['$' + (i ? SLM_REGS[i] : 'zero'), n + '[' + QREG[i] + '] = ' + f(v), ch[i]]); });
      } else {
        var Fs = spim.fregs(), Ds = spim.dregs();
        lines.push(['FIR', 'FIR    = ' + hex(s.FIR)], ['FCSR', 'FCSR   = ' + hex(s.FCSR)], ['FCCR', 'FCCR   = ' + hex(s.FCCR)], ['FEXR', 'FEXR   = ' + hex(s.FEXR)], ['', ''], ['', T('Simple precisión', 'Single precision')]);
        Fs.forEach(function (v, i) { lines.push(['', ('FG' + i + '   ').slice(0, 5) + '= ' + (+v.toPrecision(7))]); });
        lines.push(['', ''], ['', T('Doble precisión', 'Double precision')]);
        Ds.forEach(function (v, i) { lines.push(['', ('FP' + (i * 2) + '   ').slice(0, 5) + '= ' + (+v.toPrecision(15))]); });
      }
      var frag = document.createDocumentFragment();
      lines.forEach(function (l) { var d = el('div', 'slm-ln' + (l[2] ? ' is-ch' : ''), l[1] || '\u00a0'); if (l[0] && l[0].charAt(0) === '$') d.title = l[0] + ' · ' + regInfo(l[0]); frag.appendChild(d); });
      rBox.appendChild(frag);
    }
    function renderSeg() {
      var topS = sBox.scrollTop; sBox.textContent = '';
      if (!spim || !spim.x) { sBox.appendChild(el('p', 'slm-empty', T('Aquí verás el segmento de texto (las instrucciones con su dirección y su código máquina) y el de datos.', 'Here you will see the text segment (instructions with their address and machine code) and the data segment.'))); return; }
      var s = spim.spec(), pc = s.PC, frag = document.createDocumentFragment(), curEl = null;
      function head(t) { frag.appendChild(el('div', 'slm-sh', t)); }
      if (segTab === 'text') {
        var rowsOf = function (rows) {
          rows.forEach(function (r) {
            var d = el('div', 'slm-ln slm-tl' + (r.addr === pc && loaded ? ' is-pc' : '') + (bps[r.addr] ? ' is-bp' : ''));
            var g = el('span', 'slm-bpg'); g.title = T('Punto de ruptura (clic para poner o quitar)', 'Breakpoint (click to set or clear)'); g.appendChild(ico('dot'));
            var a = el('span', 'slm-ta', '[' + hex(r.addr, 8) + '] ' + r.enc + '  ');
            var ins = el('span', 'slm-ti', (r.ins + '                              ').slice(0, Math.max(30, r.ins.length + 1)));
            d.append(g, a, ins); if (r.src) d.appendChild(el('span', 'slm-tc', '; ' + r.src));
            d.dataset.addr = r.addr; if (r.addr === pc && loaded) curEl = d; frag.appendChild(d);
          });
        };
        head('User Text Segment [00400000]..[00440000]'); rowsOf(textRows);
        if (kernel) { head('Kernel Text Segment [80000000]..[80010000]'); rowsOf(kRows); }
      } else {
        var D = spim.words('data');
        head('User data segment [10000000]..[10040000]'); fmtMem(D, 0x10000000, Math.max(0x10040000, D.from + D.w.length * 4), dec).forEach(function (l) { frag.appendChild(el('div', 'slm-ln', l)); });
        var S = spim.words('stack'), sp = spim.regs()[29] >>> 0, st = Math.floor(Math.min(sp, 0x7ffffffc) / 4) * 4;
        head('User Stack [' + hex(st, 8) + ']..[80000000]'); fmtMem(S, st, 0x80000000, dec).forEach(function (l) { frag.appendChild(el('div', 'slm-ln', l)); });
        if (kernel) { var K = spim.words('kdata'); head('Kernel data segment [90000000]..[90010000]'); fmtMem(K, 0x90000000, 0x90010000, dec).forEach(function (l) { frag.appendChild(el('div', 'slm-ln', l)); }); }
      }
      sBox.appendChild(frag); sBox.scrollTop = topS;
      if (curEl) { var b = sBox.getBoundingClientRect(), r = curEl.getBoundingClientRect(); if (r.top < b.top + 24 || r.bottom > b.bottom - 8) sBox.scrollTop += r.top - b.top - b.height / 3; }
      if (help.error && marks && cm && loaded) { var l = srcLine(pc); if (l) marks.mark(cm, [{ line: l, kind: 'pc' }]); }
    }
    sBox.addEventListener('click', function (e) {
      var d = e.target.closest && e.target.closest('.slm-tl'); if (!d || !spim || !spim.x || !e.target.closest('.slm-bpg')) return;
      var a = +d.dataset.addr; if (bps[a]) { delete bps[a]; spim.bp(a, false); } else { bps[a] = 1; spim.bp(a, true); } renderSeg();
    });

    /* ---------- eventos ---------- */
    tEd.onclick = function () { setView('ed'); }; tSim.onclick = function () { setView('sim'); };
    bAsm.onclick = function () { if (out && !/\n$/.test(out)) conAdd('\n'); if (assemble()) setView('sim'); };
    bRun.onclick = function () { run(); };
    bStep.onclick = function () { step(); if (view === 'ed') setView('sim'); };
    bPause.onclick = function () { pauseReq = true; }; bStop.onclick = stop;
    kIn.onchange = function () { kernel = kIn.checked; renderSeg(); };
    rInt.onclick = function () { regTab = 'int'; rInt.classList.add('is-on'); rFp.classList.remove('is-on'); renderRegs(); };
    rFp.onclick = function () { regTab = 'fp'; rFp.classList.add('is-on'); rInt.classList.remove('is-on'); renderRegs(); };
    sTxt.onclick = function () { segTab = 'text'; sTxt.classList.add('is-on'); sDat.classList.remove('is-on'); renderSeg(); };
    sDat.onclick = function () { segTab = 'data'; sDat.classList.add('is-on'); sTxt.classList.remove('is-on'); renderSeg(); };
    lCon.onclick = function () { showLow('con'); }; lMsg.onclick = function () { showLow('msg'); };
    lClear.onclick = function () { out = ''; con.textContent = ''; if (waitMode) con.appendChild(inRow); };
    function closeAdj() { adj.hidden = true; bAdj.setAttribute('aria-expanded', 'false'); bAdj.classList.remove('is-on'); }
    bAdj.onclick = function (e) {
      e.stopPropagation(); if (!adj.hidden) return closeAdj();
      adj.hidden = false; bAdj.setAttribute('aria-expanded', 'true'); bAdj.classList.add('is-on');
      var rb = bAdj.getBoundingClientRect(), rr = card.getBoundingClientRect(), h = adj.offsetHeight;
      adj.style.right = Math.max(8, rr.right - rb.right) + 'px';
      adj.style.top = (rb.top - rr.top - h - 8 > 0 ? rb.top - rr.top - h - 8 : rb.bottom - rr.top + 8) + 'px';
    };
    adj.addEventListener('change', function (e) { var k = e.target.dataset && e.target.dataset.k; if (!k) return; help[k] = e.target.checked; store(libre ? 'sl_mips_help' : 'sl_mips_help_exam', help); applyHelp(); });
    document.addEventListener('click', function (e) { if (!adj.hidden && !adj.contains(e.target) && e.target !== bAdj && !bAdj.contains(e.target)) closeAdj(); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !adj.hidden) { closeAdj(); bAdj.focus(); } });
    if (libre) {
      mDown.onclick = function () { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([code()], { type: 'text/plain' })); a.download = file.name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); closeAdj(); };
      mUp.onclick = function () { fileIn.click(); };
      fileIn.onchange = function () { var f = fileIn.files[0]; if (!f) return; if (f.size > 200000) { say(T('El fichero es demasiado grande (máximo 200 KB).', 'File too large (200 KB max).'), 'err'); return; }
        f.text().then(function (t) { file.name = f.name.replace(/[^\w.\-]/g, '_'); fn.textContent = file.name; setCode(t); fresh(); setView('ed'); state('ok'); say(T('Fichero subido: ', 'File uploaded: ') + file.name, 'ok'); }); closeAdj(); fileIn.value = ''; };
      mShare.onclick = function () { packShare(code()).then(function (h) { var u = location.href.split('#')[0] + '#mips=' + h; try { navigator.clipboard.writeText(u); say(T('Enlace copiado: el código va dentro del enlace, no se guarda en ningún servidor.', 'Link copied: the code travels inside the link, no server stores it.'), 'ok'); } catch (e) { say(u); } }); closeAdj(); };
      mReset.onclick = function () { loadFile({ n: fname, c: sample }); closeAdj(); };
    }
    function fresh() { if (running) pauseReq = true; waitMode = null; pend = null; inRow.hidden = true; if (inRow.parentNode) inRow.parentNode.removeChild(inRow); loaded = false; hideStep(); hideErr(); }
    function loadFile(e) {
      store(key + '_prev', { name: file.name, code: code() });
      file.name = e.n; fn.textContent = e.n; setCode(e.c); fresh(); setView('ed'); state('ok');
      say(T('Ejemplo cargado: ', 'Example loaded: ') + e.n + T('. Tu código anterior queda guardado en este navegador.', '. Your previous code is kept in this browser.'), 'ok');
      if (pills) Array.prototype.forEach.call(pills.querySelectorAll('.sle-pill'), function (x) { x.classList.toggle('is-on', EJ[+x.dataset.i].c === e.c); });
    }
    var pills = root.querySelector('.sle-pills');
    if (pills) {
      pills.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.sle-pill'); if (!b) return; var x = EJ[+b.dataset.i]; if (x.c === code()) return; loadFile(x); });
      Array.prototype.forEach.call(pills.querySelectorAll('.sle-pill'), function (x) { x.classList.toggle('is-on', EJ[+x.dataset.i].c === file.code); });
    }
    // en pantalla completa y con sitio, el editor y el simulador se ven a la vez (como un VS Code)
    function wide() { var w = card.classList.contains('is-full') && window.innerWidth >= 1200; card.classList.toggle('is-wide', w); if (w && view !== 'sim') setView('sim'); if (cm) cm.requestMeasure(); }
    window.addEventListener('resize', function () { if (card.classList.contains('is-full')) wide(); });
    function setFull(on) {
      card.classList.toggle('is-full', on); document.documentElement.classList.toggle('slm-noscroll', on); wide();
      bFull.textContent = ''; bFull.appendChild(ico(on ? 'exitfull' : 'full'));
      var t = on ? T('Salir de la pantalla completa (Esc)', 'Exit full screen (Esc)') : T('Pantalla completa', 'Full screen'); bFull.title = t; bFull.setAttribute('aria-label', t);
      try { if (on) { card.requestFullscreen && card.requestFullscreen().catch(function () {}); } else if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
      if (cm) cm.requestMeasure(); dockSoon();
    }
    bFull.onclick = function () { setFull(!card.classList.contains('is-full')); };
    // móvil: mientras la barra de abajo va pegada, el botón de Leo sube para no tapar «Ajustar»
    var docked = false, dockRaf = 0;
    function dock() {
      dockRaf = 0; if (!DOCK) return; var on = false, H = window.innerHeight;
      if (window.innerWidth <= 760 && !card.classList.contains('is-full')) { var r = card.getBoundingClientRect(); on = r.top < H - 160 && r.bottom > H + 1; }
      if (on !== docked) { docked = on; if (on) DOCK.add(card); else DOCK.delete(card); }
      var de = document.documentElement; if (on) de.style.setProperty('--sle-dock-h', bot.offsetHeight + 'px'); de.classList.toggle('sle-dock', DOCK.size > 0);
    }
    function dockSoon() { if (!dockRaf) dockRaf = requestAnimationFrame(dock); }
    window.addEventListener('scroll', dockSoon, { passive: true }); window.addEventListener('resize', dockSoon); dockSoon();
    document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && card.classList.contains('is-full')) setFull(false); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'F5' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); bRun.onclick(); }
      else if (e.key === 'F10') { e.preventDefault(); bStep.onclick(); }
      else if (e.key === 'Escape' && card.classList.contains('is-full') && !document.fullscreenElement && adj.hidden) setFull(false);
    });
    function packShare(t) {
      try { var cs = new CompressionStream('deflate-raw'), w = cs.writable.getWriter(); w.write(new TextEncoder().encode(JSON.stringify({ n: file.name, c: t }))); w.close();
        return new Response(cs.readable).arrayBuffer().then(function (b) { var s = '', u = new Uint8Array(b); for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); });
      } catch (e) { return Promise.resolve(btoa(unescape(encodeURIComponent(t)))); }
    }
    function unpackShare(h) {
      try { var b = atob(h.replace(/-/g, '+').replace(/_/g, '/')), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
        var ds = new DecompressionStream('deflate-raw'), w = ds.writable.getWriter(); w.write(u); w.close();
        return new Response(ds.readable).text().then(function (t) { return JSON.parse(t); });
      } catch (e) { return Promise.reject(e); }
    }

    /* ---------- editor ---------- */
    function applyHelp() {
      card.classList.toggle('slm-nocolor', !help.colores);
      if (cm && C) cm.dispatch({ effects: [colorsC.reconfigure(help.colores ? highlighter(C) : []), autoC.reconfigure(help.auto ? [C.autocompletion({ override: [completer(C, code)], activateOnTyping: true, icons: false }), C.closeBrackets()] : [])] });
      if (!help.error && marks && cm) marks.mark(cm, []);
      if (!help.explica) { tira.hidden = true; sayBox.hidden = true; }
      render();
    }
    function makeEditor() {
      edBox.textContent = '';
      colorsC = new C.Compartment(); autoC = new C.Compartment(); marks = lineMarks(C);
      var keys = [{ key: 'F5', run: function () { bRun.onclick(); return true; } }, { key: 'F10', run: function () { bStep.onclick(); return true; } }, { key: 'Mod-Enter', run: function () { bRun.onclick(); return true; } }];
      cm = new C.EditorView({
        parent: edBox,
        state: C.EditorState.create({ doc: file.code, extensions: [
          C.lineNumbers(), C.highlightActiveLineGutter(), C.highlightActiveLine(), C.history(), C.drawSelection(), C.highlightSpecialChars(),
          C.highlightSelectionMatches ? C.highlightSelectionMatches() : [], C.search ? C.search({ top: true }) : [],
          C.EditorState.tabSize.of(4), colorsC.of(help.colores ? highlighter(C) : []),
          autoC.of(help.auto ? [C.autocompletion({ override: [completer(C, code)], activateOnTyping: true, icons: false }), C.closeBrackets()] : []),
          marks.ext, C.keymap.of(keys.concat(C.closeBracketsKeymap || [], C.completionKeymap || [], C.searchKeymap || [], C.historyKeymap, C.defaultKeymap, [C.indentWithTab])),
          C.EditorView.updateListener.of(function (u) { if (u.docChanged) changed(); }),
          C.EditorView.contentAttributes.of({ 'aria-label': T('Código MIPS', 'MIPS code'), spellcheck: 'false', autocorrect: 'off', autocapitalize: 'off' })
        ] })
      });
    }
    function remeasure() { if (cm) cm.requestMeasure(); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(remeasure, 50); });
    function makeTextarea() { edBox.textContent = ''; textarea = el('textarea', 'slm-ta-fallback'); textarea.value = file.code; textarea.spellcheck = false; textarea.oninput = changed; edBox.appendChild(textarea); }

    /* ---------- arranque ---------- */
    busy(false); bPause.disabled = true; state('load'); say(T('Cargando el editor y el simulador…', 'Loading the editor and the simulator…'));
    card.classList.toggle('slm-nocolor', !help.colores);
    var shareP = shared ? unpackShare(shared).then(function (o) { if (o && typeof o.c === 'string') { if (libre) store(key + '_prev', { name: file.name, code: file.code }); file = { name: (o.n || 'programa.s').replace(/[^\w.\-]/g, '_'), code: o.c }; fn.textContent = file.name; try { history.replaceState(null, '', location.href.split('#')[0]); } catch (e) {} } }, report) : Promise.resolve();
    renderRegs(); renderSeg();
    shareP.then(function () {
      return loadCM().then(function (c) { C = c; makeEditor(); }, function (e) { report(e); makeTextarea(); });
    }).then(function () {
      return loadWasm().then(function (m) { mod = m; state('ok'); say(T('Listo. Escribe tu programa y pulsa Ejecutar o Paso a paso.', 'Ready. Write your program and press Run or Step.'), 'ok'); },
        function (e) { report(e); state('err'); say(T('No se ha podido cargar el simulador. Revisa la conexión y recarga la página.', 'The simulator could not be loaded. Check your connection and reload the page.'), 'err'); });
    });
    window.addEventListener('pagehide', save);
    var api = {
      assemble: assemble, run: run, step: step, stop: stop, code: code, setCode: setCode, setView: setView,
      state: function () { return { loaded: loaded, running: running, waiting: !!waitMode, executed: executed, pc: spim && spim.x ? spim.spec().PC : 0 }; },
      output: function () { return out; }, messages: function () { return msg.textContent; },
      regs: function () { return spim && spim.x ? spim.regs() : null; }, spim: function () { return spim; },
      setHelp: function (k, v) { help[k] = !!v; applyHelp(); }, ready: function () { return !!mod && (!!cm || !!textarea); }
    };
    root.slmips = api; if (card !== root) card.slmips = api; return api;
  }

  function boot() {
    document.querySelectorAll('.sl-mips[data-mips]:not(.slm-on)').forEach(function (e) {
      var cfg = {}; try { cfg = JSON.parse(e.getAttribute('data-mips') || '{}'); } catch (x) { report(x); }
      try { mount(e, cfg); } catch (x) { report(x); }
    });
  }
  window.SLMIPS = { mount: mount, boot: boot, version: '2.0' };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
