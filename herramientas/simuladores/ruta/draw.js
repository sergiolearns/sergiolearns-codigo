/* SergioLearns — la ruta de datos monociclo dibujada en SVG (port de kit-papel/rdsvg.py, la figura de los temas 9 y 10, al estilo
 * de la del examen). Los colores salen de clases (aspecto tinta o claro del simulador). SLRutaDraw.svg(o):
 *   o.lang 'es'|'en' · o.hl: conjunto de cables y bloques de la instrucción (coral; lo demás, apagado) · o.sig: {señal: valor}
 *   o.badges: {cable: número} (números en círculo sobre los cables) · o.mods: {jal, bne, slti} · o.sel: bloque seleccionado · o.id */
(function (G) {
  var SANS = 'Inter, system-ui, sans-serif', MONO = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace", HEAD = "'Space Grotesk', Inter, sans-serif";
  var FS = 13.5;
  var TX = {
    im: ['Memoria de', 'Instruction'], im2: ['instrucciones', 'memory'], rf: ['Banco de registros', 'Registers'],
    dm: ['Memoria', 'Data'], dm2: ['de datos', 'memory'], se: ['Extensión', 'Sign-'], se2: ['de signo', 'extend'],
    sh: ['Desplaz.', 'Shift'], sh2: ['izq. 2', 'left 2'], aluc: ['Control', 'ALU'], aluc2: ['ALU', 'control'],
    r1: ['Registro|lectura 1', 'Read|register 1'], r2: ['Registro|lectura 2', 'Read|register 2'],
    wr: ['Registro|a escribir', 'Write|register'], wd: ['Dato|a escribir', 'Write|data'],
    d1: ['Dato|leído 1', 'Read|data 1'], d2: ['Dato|leído 2', 'Read|data 2'], dir: ['Dirección', 'Address'],
    dl: ['Dato|leído', 'Read|data'], de: ['Dato|a escribir', 'Write|data'], ins: ['Instrucción', 'Instruction'],
    rir: ['Dirección|a leer', 'Read|address'], res: ['Resultado', 'Result'],
    f2521: ['[25-21] rs', '[25-21] rs'], f2016: ['[20-16] rt', '[20-16] rt'], f1511: ['[15-11] rd', '[15-11] rd'],
    f150: ['[15-0]', '[15-0]'], f50: ['[5-0] funct', '[5-0] funct'], f250: ['[25-0]', '[25-0]'],
    jaddr: ['Dirección de salto [31-0]', 'Jump address [31-0]'], pc428: ['PC + 4 [31-28]', 'PC + 4 [31-28]'],
    leg: ['ALUOp', 'ALUOp'], l00: ['00  sumar', '00  add'], l01: ['01  restar', '01  subtract'],
    l10: ['10  según funct', '10  from funct'], l11: ['11  sin usar', '11  unused'], l11s: ['11  slt (slti)', '11  slt (slti)'],
    uc: ['Control', 'Control'], ucop: ['[31-26] op', '[31-26] op']
  };
  var WIRES = {
    loop: [[814, 138], [892, 138], [892, 14], [8, 14], [8, 335], [16, 335]],
    pc: [[56, 335], [80, 335]],
    pc_add: [[68, 335], [68, 112], [110, 112]],
    four: [[100, 168], [110, 168]],
    pc4: [[160, 140], [730, 140]],
    pc4_top: [[470, 140], [470, 46]],
    pc4_add2: [[600, 140], [600, 196], [640, 196]],
    inst: [[200, 355], [224, 355]],
    bus: [[224, 46], [224, 560]],
    f250: [[224, 46], [286, 46]],
    jaddr: [[374, 46], [774, 46], [774, 104], [790, 104]],
    f2521: [[224, 304], [340, 304]],
    f2016: [[224, 344], [340, 344]],
    f2016_dst: [[292, 344], [292, 372], [306, 372]],
    f1511: [[224, 408], [306, 408]],
    regdst_out: [[326, 390], [340, 390]],
    f150: [[224, 510], [372, 510]],
    f50: [[224, 560], [556, 560], [556, 520], [575, 520]],
    rd1: [[510, 328], [590, 328]],
    rd2: [[510, 400], [546, 400]],
    rd2_mem: [[520, 400], [520, 476], [700, 476]],
    ext: [[468, 510], [532, 510], [532, 440]],
    ext_mux: [[532, 440], [546, 440]],
    ext_up: [[532, 440], [532, 236], [540, 236]],
    sh2b_out: [[620, 236], [640, 236]],
    add2_out: [[690, 216], [710, 216], [710, 190], [730, 190]],
    alusrc_out: [[568, 420], [590, 420]],
    aluctl: [[625, 494], [625, 434]],
    alures: [[660, 405], [680, 405]],
    alures_mem: [[680, 405], [700, 405]],
    alures_byp: [[680, 405], [680, 530], [840, 530], [840, 450], [850, 450]],
    zero: [[660, 345], [676, 345], [676, 290], [700, 290]],
    memrd: [[820, 392], [850, 392]],
    wb: [[872, 421], [884, 421], [884, 580], [332, 580], [332, 430], [340, 430]],
    pcsrc_out: [[754, 165], [790, 165]],
    andout: [[728, 282], [742, 282], [742, 210]],
    ucop: [[224, 214], [238, 214]]
  };
  var ARROWLESS = { bus: 1, alures: 1, ext: 1, zero2: 1, and1o: 1, and2o: 1, pc4_top: 1 };
  var JUNCT = { pc_add: [68, 335], pc4_top: [470, 140], pc4_add2: [600, 140], f2521: [224, 304], f2016: [224, 344],
    f2016_dst: [292, 344], f1511: [224, 408], f150: [224, 510], rd2_mem: [520, 400], ext_mux: [532, 440],
    alures_mem: [680, 405], f250: [224, 46], f50: [224, 560], pc4_link: [600, 140], zero2: [676, 328], ucop: [224, 214] };
  var BADGE = { pc_add: [68, 230], pc4: [300, 140], rd1: [550, 328], alusrc_out: [579, 420], ext: [500, 510],
    alures: [680, 470], alures_mem: [689, 392], memrd: [835, 392], rd2_mem: [610, 476], wb: [600, 580], wb2: [600, 580], regdst_out: [333, 390], link_reg: [333, 396],
    zero: [676, 318], add2_out: [700, 216], jaddr: [620, 46], pcsrc_out: [772, 165], loop: [892, 80],
    f150: [300, 510], sh2b_out: [630, 236], f250: [264, 46], inst: [212, 355], f2521: [300, 304], f2016: [300, 344], f1511: [262, 408] };
  var SIGS = {
    RegDst: [232, 452, [[316, 420], [316, 438]], 'start'],
    RegWrite: [425, 280, [[425, 283], [425, 290]], 'middle'],
    ALUSrc: [570, 372, [[557, 376], [557, 384]], 'end'],
    ALUOp: [690, 552, [[668, 536], [686, 546]], 'start'],
    MemWrite: [788, 350, [[790, 353], [790, 360]], 'end'],
    MemRead: [760, 520, [[760, 500], [760, 508]], 'middle'],
    MemtoReg: [898, 366, [[861, 369], [861, 376]], 'end'],
    Branch: [694, 278, [[694, 274], [700, 274]], 'end'],
    Jump: [810, 78, [[802, 79], [802, 86]], 'start']
  };
  var OWNER = { RegDst: 'regdst', RegWrite: 'rf', ALUSrc: 'alusrc', ALUOp: 'aluc', MemWrite: 'dm', MemRead: 'dm', MemtoReg: 'mtr', Branch: 'and', Jump: 'jmux', Link: 'link2', 'Link ': 'link1', BranchNE: 'and2' };
  function set(a) { var o = {}; a.forEach(function (k) { o[k] = 1; }); return o; }
  function uni() { var o = {}; [].forEach.call(arguments, function (s) { for (var k in s) o[k] = 1; }); return o; }
  var P = {};
  P.fetch = set(['pc', 'im', 'pc_add', 'four', 'add1', 'inst', 'pc4', 'pcsrc', 'pcsrc_out', 'jmux', 'loop', 'bus', 'uc', 'ucop']);
  P.R = uni(P.fetch, set(['f2521', 'f2016', 'f1511', 'regdst', 'regdst_out', 'rf', 'rd1', 'rd2', 'alusrc', 'alusrc_out', 'alu', 'aluc', 'aluctl', 'f50', 'alures', 'alures_byp', 'mtr', 'wb']));
  P.lw = uni(P.fetch, set(['f2521', 'f2016', 'f2016_dst', 'regdst', 'regdst_out', 'rf', 'rd1', 'f150', 'se', 'ext', 'ext_mux', 'alusrc', 'alusrc_out', 'alu', 'aluc', 'aluctl', 'alures', 'alures_mem', 'dm', 'memrd', 'mtr', 'wb']));
  P.sw = uni(P.fetch, set(['f2521', 'f2016', 'rf', 'rd1', 'rd2', 'rd2_mem', 'f150', 'se', 'ext', 'ext_mux', 'alusrc', 'alusrc_out', 'alu', 'aluc', 'aluctl', 'alures', 'alures_mem', 'dm']));
  P.beq = uni(P.fetch, set(['f2521', 'f2016', 'rf', 'rd1', 'rd2', 'alusrc', 'alusrc_out', 'alu', 'aluc', 'aluctl', 'zero', 'and', 'andout', 'f150', 'se', 'ext', 'ext_up', 'sh2b', 'sh2b_out', 'add2', 'add2_out', 'pc4_add2']));
  P.j = set(['pc', 'im', 'pc_add', 'four', 'add1', 'inst', 'bus', 'f250', 'sh2j', 'jaddr', 'pc4', 'pc4_top', 'jmux', 'loop', 'uc', 'ucop']);
  P.bne = uni(P.beq, set(['and2', 'or', 'zero2', 'and1o', 'and2o']));
  P.slti = (function () { var o = uni(P.lw, set(['alures_byp'])); delete o.alures_mem; delete o.dm; delete o.memrd; return o; })();
  P.addi = P.slti;
  P.jal = uni(P.j, set(['link1', 'c31', 'link_reg', 'rf', 'link2', 'wb2', 'pc4_link', 'mtrlink']));
  function e(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function T(x, y, s, size, cls, font, w, anc) { return '<text x="' + x + '" y="' + y + '" font-family="' + (font || SANS) + '" font-size="' + size + '" font-weight="' + (w || 400) + '" class="' + cls + '" text-anchor="' + (anc || 'middle') + '">' + e(s) + '</text>'; }
  function R(x, y, w, h, rx) { return '<rect class="rd-s" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 4) + '"/>'; }
  function mux(x, y, w, h, i0, i1, top) {
    top = top || '0';
    return '<rect class="rd-s" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (w / 2) + '"/>'
      + T(x + w / 2, i0 + 4.5, top, 12.5, 'rd-tx', SANS, 700) + T(x + w / 2, i1 + 4.5, top === '0' ? '1' : '0', 12.5, 'rd-tx', SANS, 700);
  }
  function aluS(x, y, w, h) {
    var n = h * 0.115, pts = [[x, y], [x + w, y + h * 0.25], [x + w, y + h * 0.75], [x, y + h], [x, y + h / 2 + n], [x + 14, y + h / 2], [x, y + h / 2 - n]];
    return '<polygon class="rd-s" points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '"/>';
  }
  function ell(cx, cy, rx, ry) { return '<ellipse class="rd-s" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>'; }
  function blocks(L, mods) {
    var t = function (k) { return TX[k][L]; };
    var two = function (x, y, txt, anc, size, w) { var a = txt.split('|'); return T(x, y - 3, a[0], size || FS, 'rd-tx', SANS, w || 400, anc) + T(x, y + 12, a[1], size || FS, 'rd-tx', SANS, w || 400, anc); };
    var B = {
      pc: R(16, 300, 40, 70) + T(36, 340, 'PC', 15, 'rd-tx', HEAD, 700),
      im: R(80, 290, 120, 130) + two(86, 335, t('rir'), 'start') + T(194, 372, t('ins'), FS, 'rd-tx', SANS, 400, 'end') + two(140, 400, t('im') + '|' + t('im2'), 'middle', 14, 700),
      add1: aluS(110, 90, 50, 100) + T(140, 145, 'Add', 14, 'rd-tx', SANS, 700) + T(96, 173, '4', 14, 'rd-tx', MONO, 700, 'end'),
      rf: R(340, 290, 170, 180) + T(425, 462, t('rf'), 14, 'rd-tx', SANS, 700) + two(346, 304, t('r1'), 'start') + two(346, 344, t('r2'), 'start') + two(346, 390, t('wr'), 'start') + two(346, 430, t('wd'), 'start') + two(504, 328, t('d1'), 'end') + two(504, 400, t('d2'), 'end'),
      regdst: mux(306, 360, 20, 60, 372, 408),
      se: ell(420, 510, 48, 28) + T(420, 506, t('se'), 13, 'rd-tx', SANS, 700) + T(420, 521, t('se2'), 13, 'rd-tx', SANS, 700) + T(356, 502, '16', 12.5, 'rd-tx', MONO) + T(490, 502, '32', 12.5, 'rd-tx', MONO),
      alusrc: mux(546, 384, 22, 72, 400, 440),
      alu: aluS(590, 296, 70, 156) + T(624, 381, 'ALU', 16, 'rd-tx', HEAD, 700) + T(655, 350, 'Zero', 12.5, 'rd-tx', SANS, 400, 'end') + T(655, 409, t('res'), 12.5, 'rd-tx', SANS, 400, 'end'),
      aluc: ell(625, 520, 50, 26) + T(625, 516, t('aluc'), 13, 'rd-tx', SANS, 700) + T(625, 531, t('aluc2'), 13, 'rd-tx', SANS, 700),
      dm: R(700, 360, 120, 140) + T(706, 409, t('dir'), FS, 'rd-tx', SANS, 400, 'start') + two(814, 392, t('dl'), 'end') + two(706, 476, t('de'), 'start') + two(760, 447, t('dm') + '|' + t('dm2'), 'middle', 14, 700),
      mtr: mux(850, 376, 22, 90, 392, 450, '1'),
      sh2b: ell(580, 236, 40, 20) + T(580, 233, t('sh'), 12.5, 'rd-tx', SANS, 700) + T(580, 247, t('sh2'), 12.5, 'rd-tx', SANS, 700),
      add2: aluS(640, 176, 50, 80) + T(670, 221, 'Add', 14, 'rd-tx', SANS, 700),
      pcsrc: mux(730, 120, 24, 90, 140, 190),
      and: '<path class="rd-s" d="M700,268 h14 a14,14 0 0 1 0,28 h-14 z"/>',
      sh2j: ell(330, 46, 44, 20) + T(330, 43, t('sh'), 12.5, 'rd-tx', SANS, 700) + T(330, 57, t('sh2'), 12.5, 'rd-tx', SANS, 700) + T(268, 68, '26', 12.5, 'rd-tx', MONO) + T(392, 68, '28', 12.5, 'rd-tx', MONO),
      jmux: mux(790, 86, 24, 104, 104, 165, '1'),
      uc: ell(292, 214, 50, 30) + T(292, 219, t('uc'), 15, 'rd-tx', HEAD, 700)
    };
    if (mods.jal) {
      B.regdst = mux(270, 360, 20, 60, 372, 408);
      B.link1 = mux(306, 366, 20, 60, 380, 412);
      B.c31 = T(296, 466, '31', 13, 'rd-tx', MONO, 700);
      B.link2 = mux(892, 404, 20, 66, 421, 456);
    }
    if (mods.bne) {
      B.and2 = '<path class="rd-s" d="M700,306 h14 a14,14 0 0 1 0,28 h-14 z"/><circle class="rd-s" cx="696.5" cy="328" r="3.5"/>';
      B.or = '<path class="rd-s" d="M742,272 q12,0 26,30 q-14,30 -26,30 q9,-30 0,-60 z"/>';
    }
    return B;
  }
  var MUX = { regdst: 1, alusrc: 1, mtr: 1, pcsrc: 1, jmux: 1, link1: 1, link2: 1 };
  function pts(a) { return a.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); }
  function wires(mods) {
    var W = {}, J = {}, k;
    for (k in WIRES) W[k] = WIRES[k];
    for (k in JUNCT) J[k] = JUNCT[k];
    if (mods.jal) {
      W.f2016_dst = [[256, 344], [256, 372], [270, 372]]; J.f2016_dst = [256, 344];
      W.f1511 = [[224, 408], [270, 408]];
      W.regdst_out = [[290, 390], [298, 390], [298, 380], [306, 380]];
      W.c31 = [[296, 452], [296, 412], [306, 412]];
      W.link_reg = [[326, 396], [333, 396], [333, 390], [340, 390]];
      delete W.wb; W.mtrlink = [[872, 421], [892, 421]];
      W.wb2 = [[912, 438], [922, 438], [922, 580], [332, 580], [332, 430], [340, 430]];
      W.pc4_link = [[600, 140], [600, 70], [878, 70], [878, 456], [892, 456]];
    }
    if (mods.bne) {
      W.zero2 = [[676, 328], [693, 328]];
      W.and1o = [[728, 282], [746, 282]];
      W.and2o = [[728, 320], [746, 320]];
      W.andout = [[768, 302], [780, 302], [780, 226], [742, 226], [742, 210]];
    }
    return { W: W, J: J };
  }
  /* El camino de una instrucción con las ampliaciones puestas: con jal en la RD, las que escriben pasan por los muxes Link. */
  function path(t, mods) {
    var p = uni(P[t]);
    if (mods.jal && (t === 'R' || t === 'lw' || t === 'slti' || t === 'addi')) { delete p.wb; p.link1 = 1; p.link_reg = 1; p.link2 = 1; p.mtrlink = 1; p.wb2 = 1; }
    if (mods.bne && t === 'beq') { p.or = 1; p.and1o = 1; }
    return p;
  }
  function svg(o) {
    var L = o.lang === 'en' ? 1 : 0, mods = o.mods || {}, hl = o.hl || null, id = o.id || 'rd', w = mods.jal ? 952 : 910, h = 600;
    var t = function (k) { return TX[k][L]; }, WJ = wires(mods), W = WJ.W, J = WJ.J, B = blocks(L, mods);
    var st = function (k) { return hl ? (hl[k] ? ' is-on' : ' is-off') : ''; };
    var defs = '<defs>' + ['', ' is-off', ' is-on'].map(function (c, i) { return '<marker id="' + id + '-a' + i + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="rd-m' + c + '" d="M0,0 L10,5 L0,10 z"/></marker>'; }).join('') + '</defs>';
    var body = '', keys = Object.keys(W).sort(function (a, b) { return (hl && hl[a] ? 1 : 0) - (hl && hl[b] ? 1 : 0); });
    keys.forEach(function (k) {
      var on = hl && hl[k], mi = !hl ? 0 : (on ? 2 : 1);
      body += '<polyline class="rd-w' + st(k) + '" data-w="' + k + '" points="' + pts(W[k]) + '"' + (ARROWLESS[k] ? '' : ' marker-end="url(#' + id + '-a' + mi + ')"') + '/>';
      if (J[k]) body += '<circle class="rd-j' + st(k) + '" cx="' + J[k][0] + '" cy="' + J[k][1] + '" r="3.5"/>';
    });
    var ft = function (k) { return 'rd-lab' + st(k); };
    [['f2521', 230, 297], ['f2016', 230, 337], ['f1511', 230, 401], ['f150', 230, 503], ['f50', 230, 553], ['f250', 230, 31]].forEach(function (x) {
      var s = mods.jal && (x[0] === 'f2016' || x[0] === 'f1511') ? t(x[0]).split(' ').pop() : t(x[0]);
      body += T(x[1], x[2], s, 12.5, ft(x[0]), SANS, 600, 'start');
    });
    body += T(600, 36, t('jaddr'), 13, ft('jaddr'), SANS, 400) + T(478, 98, t('pc428'), 13, ft('pc4_top'), SANS, 400, 'start');
    Object.keys(B).forEach(function (k) {
      body += '<g class="rd-k' + (MUX[k] ? ' is-mx' : '') + st(k) + (o.sel === k ? ' is-sel' : '') + '" data-b="' + k + '" tabindex="0" role="button">' + B[k] + '</g>';
    });
    // la unidad de control: op entra desde el bus y las señales (violeta) salen hacia los bloques
    body += T(232, 178, t('ucop'), 12.5, ft('uc'), SANS, 600, 'start');
    for (var q = 0; q < 4; q++) body += '<polyline class="rd-sg" points="342,' + (200 + q * 9) + ' 372,' + (200 + q * 9) + '"/>';
    var sigs = {}, k2; for (k2 in SIGS) sigs[k2] = SIGS[k2];
    if (mods.jal) {
      sigs.RegDst = [232, 452, [[280, 420], [280, 438]], 'start'];
      sigs.Link = [908, 396, [[902, 398], [902, 404]], 'middle'];
      sigs.MemtoReg = [846, 490, [[861, 466], [861, 478]], 'start'];
      sigs['Link '] = [304, 357, [[316, 359], [316, 366]], 'end'];
    }
    if (mods.bne) sigs.BranchNE = [694, 318, [[694, 314], [700, 312]], 'end'];
    var sig = o.sig || null;
    Object.keys(sigs).forEach(function (s) {
      var x = sigs[s], nm = s.trim(), has = sig && nm in sig, txt = has ? nm + ' = ' + sig[nm] : nm;
      var act = has && ['0', '00', 'X', 'XX'].indexOf(sig[nm]) < 0;
      body += '<polyline class="rd-sg" points="' + pts(x[2]) + '"/>' + T(x[0], x[1], txt, 13, 'rd-st' + (act ? ' is-act' : '') + (has && /X/.test(sig[nm]) ? ' is-x' : ''), MONO, 700, x[3]);
    });
    var bd = o.badges || {};
    Object.keys(bd).forEach(function (k) {
      var p = BADGE[k]; if (!p) return;
      body += '<g class="rd-bd" data-bd="' + bd[k] + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="10.5"/>' + T(p[0], p[1] + 4.5, String(bd[k]), 12.5, 'rd-bdt', SANS, 700) + '</g>';
    });
    body += '<rect class="rd-lg" x="16" y="444" width="176" height="106" rx="8"/>' + T(28, 466, t('leg'), 14, 'rd-lgh', MONO, 700, 'start');
    ['l00', 'l01', 'l10', mods.slti ? 'l11s' : 'l11'].forEach(function (k, i) { body += T(28, 486 + i * 17, t(k), 13, 'rd-lgt', MONO, 400, 'start'); });
    return '<svg class="sl6-rd-svg" viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + e(o.label || '') + '" xmlns="http://www.w3.org/2000/svg">' + defs
      + '<rect class="rd-bg" x="0.75" y="0.75" width="' + (w - 1.5) + '" height="' + (h - 1.5) + '" rx="16"/>' + body + '</svg>';
  }
  G.SLRutaDraw = { svg: svg, path: path, PATH: P, BADGE: BADGE, TX: TX };
  if (typeof module !== 'undefined' && module.exports) module.exports = G.SLRutaDraw;
})(typeof window !== 'undefined' ? window : this);
