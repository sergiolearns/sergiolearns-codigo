/* SergioLearns — ruta de datos monociclo de MIPS (IC1, temas de papel 9 y 10). Port de kit-papel/monociclo.py: SLRuta.paso(pc,
 * palabra, reg, mem) ejecuta UNA instrucción por la RD y devuelve el valor de cada cable y cada señal; SLRuta.run(líneas, base,
 * estado, mods) ensambla con SLIsa (convención de los apuntes: saltos desde PC + 4) y ejecuta el programa ciclo a ciclo.
 * Ampliaciones (mods): 'addi' (solo una fila más en la UC), 'slti' (ALUOp = 11), 'bne' (señal BranchNE con Zero negado y una OR)
 * y 'jal' (señal Link: dos multiplexores, $ra y PC + 4). X = no importa. Comprobado con monociclo.py (ruta/test.py). */
(function (G) {
  var FUNCT = { 0x20: 'add', 0x22: 'sub', 0x24: 'and', 0x25: 'or', 0x27: 'nor', 0x2A: 'slt' };
  var NOMBRE_OP = { 0: 'R', 0x23: 'lw', 0x2B: 'sw', 4: 'beq', 2: 'j', 5: 'bne', 3: 'jal', 0xA: 'slti', 8: 'addi' };
  var SEN = ['RegDst', 'ALUSrc', 'MemtoReg', 'RegWrite', 'MemRead', 'MemWrite', 'Branch', 'ALUOp', 'Jump'];
  function row(a) { var o = {}; SEN.forEach(function (k, i) { o[k] = a[i]; }); return o; }
  function ext(b, o) { var r = {}, k; for (k in b) r[k] = b[k]; for (k in o) r[k] = o[k]; return r; }
  var TABLA = {   // apuntes, «Diseño de la UC: implementación» (ALUOp escrito como ALUOp1 ALUOp0)
    R: row(['1', '0', '0', '1', '0', '0', '0', '10', '0']),
    lw: row(['0', '1', '1', '1', '1', '0', '0', '00', '0']),
    sw: row(['X', '1', 'X', '0', '0', '1', '0', '00', '0']),
    beq: row(['X', '0', 'X', '0', '0', '0', '1', '01', '0']),
    j: row(['X', 'X', 'X', '0', '0', '0', 'X', 'XX', '1'])
  };
  TABLA.bne = ext(TABLA.beq, { Branch: '0', BranchNE: '1' });
  TABLA.slti = ext(TABLA.lw, { MemtoReg: '0', MemRead: '0', ALUOp: '11' });
  TABLA.addi = ext(TABLA.lw, { MemtoReg: '0', MemRead: '0' });
  TABLA.jal = ext(TABLA.j, { RegWrite: '1', Link: '1', BranchNE: 'X' });
  ['R', 'lw', 'sw', 'beq', 'j', 'slti', 'addi'].forEach(function (k) { if (!('BranchNE' in TABLA[k])) TABLA[k].BranchNE = k !== 'j' ? '0' : 'X'; });
  Object.keys(TABLA).forEach(function (k) { if (!('Link' in TABLA[k])) TABLA[k].Link = TABLA[k].RegWrite === '1' ? '0' : 'X'; });
  var NEED = { addi: 'addi', slti: 'slti', bne: 'bne', jal: 'jal' };   // ampliación que necesita cada instrucción
  function senales(mods) { var s = SEN.slice(); if (mods && mods.bne) s.splice(7, 0, 'BranchNE'); if (mods && mods.jal) s.push('Link'); return s; }
  function sx(x) { return x & 0x8000 ? x - 0x10000 : x; }
  function s32(x) { return x & 0x80000000 ? x - 0x100000000 : x; }
  function alu(a, b, ctl) {
    if (ctl === 'add') return (a + b) >>> 0;
    if (ctl === 'sub') return (a - b) >>> 0;
    if (ctl === 'and') return (a & b) >>> 0;
    if (ctl === 'or') return (a | b) >>> 0;
    if (ctl === 'nor') return (~(a | b)) >>> 0;
    if (ctl === 'slt') return s32(a) < s32(b) ? 1 : 0;
    return 0;
  }
  function fields(w) { return { op: w >>> 26, rs: (w >>> 21) & 31, rt: (w >>> 16) & 31, rd: (w >>> 11) & 31, sh: (w >>> 6) & 31, fn: w & 63, im: w & 0xFFFF, dst: w & 0x3FFFFFF }; }
  /* Ejecuta la palabra w en la dirección pc. reg: 32 enteros sin signo; mem: {dirección: palabra}. Devuelve {c, s, t} y actualiza
   * reg y mem como lo haría el flanco de reloj (igual que monociclo.paso). */
  function paso(pc, w, reg, mem) {
    w = w >>> 0;
    var f = fields(w), t = NOMBRE_OP[f.op], s = TABLA[t], c = {};
    c.PC = pc >>> 0; c.Instruccion = w; c.op = f.op; c.rs = f.rs; c.rt = f.rt; c.rd = f.rd; c.shamt = f.sh; c.funct = f.fn; c.inm16 = f.im; c.dest26 = f.dst;
    c['PC+4'] = (pc + 4) >>> 0;
    c.Dato1 = reg[f.rs] >>> 0; c.Dato2 = reg[f.rt] >>> 0;
    c.ExtSigno = sx(f.im) >>> 0;
    c.RegEscribir = s.RegDst === '1' ? f.rd : f.rt;
    if (s.Link === '1') c.RegEscribir = 31;
    c.B = s.ALUSrc === '1' ? c.ExtSigno : c.Dato2;
    var ctl = { '00': 'add', '01': 'sub', '11': 'slt' }[s.ALUOp] || FUNCT[f.fn] || 'add';
    c.OperacionALU = ctl;
    c.ResultadoALU = alu(c.Dato1, c.B, ctl); c.Zero = c.ResultadoALU === 0 ? 1 : 0;
    c.Desplazado = (c.ExtSigno << 2) >>> 0;
    c.DestinoBeq = (c['PC+4'] + c.Desplazado) >>> 0;
    c.DireccionJ = ((c['PC+4'] & 0xF0000000) | (f.dst << 2)) >>> 0;
    c.DatoLeidoMem = s.MemRead === '1' ? ((mem[c.ResultadoALU] || 0) >>> 0) : null;
    c.DatoEscribir = s.MemtoReg === '1' ? c.DatoLeidoMem : c.ResultadoALU;
    if (s.Link === '1') c.DatoEscribir = c['PC+4'];
    c.PCSrc = ((s.Branch === '1' && c.Zero === 1) || (s.BranchNE === '1' && c.Zero === 0)) ? 1 : 0;
    c.PCtrasBeq = c.PCSrc ? c.DestinoBeq : c['PC+4'];
    c.PCsiguiente = s.Jump === '1' ? c.DireccionJ : c.PCtrasBeq;
    c.escribeReg = null; c.escribeMem = null;
    if (s.RegWrite === '1' && c.RegEscribir !== 0) { c.escribeReg = [c.RegEscribir, reg[c.RegEscribir] >>> 0, c.DatoEscribir >>> 0]; reg[c.RegEscribir] = c.DatoEscribir >>> 0; }
    if (s.MemWrite === '1') { c.escribeMem = [c.ResultadoALU, (mem[c.ResultadoALU] || 0) >>> 0, c.Dato2]; mem[c.ResultadoALU] = c.Dato2; }
    return { c: c, s: s, t: t };
  }
  /* Bloques que recorre cada instrucción en serie (tema 9; los retardos en ps los pone el lector). */
  var CAMINO = { R: ['MI', 'Reg', 'ALU', 'Esc'], lw: ['MI', 'Reg', 'ALU', 'MD', 'Esc'], sw: ['MI', 'Reg', 'ALU', 'MD'], beq: ['MI', 'Reg', 'ALU'], j: ['MI'] };
  function tiempo(ret, t) { var c = CAMINO[t]; return { ps: c.reduce(function (a, b) { return a + (+ret[b] || 0); }, 0), camino: c }; }
  function parseNum(s) {
    var neg = s[0] === '-', b = s.replace(/^[-+]/, ''), v = /^0x/i.test(b) ? parseInt(b.slice(2), 16) : parseInt(b, 10);
    if (!isFinite(v) || v > 0xFFFFFFFF || (neg && v > 0x80000000)) return null;
    return neg ? (-v) >>> 0 : v >>> 0;
  }
  function RN_(Isa) { var o = {}; Isa.REG.forEach(function (r, i) { o[r] = i; o['$' + i] = i; }); o.$s8 = 30; return o; }
  /* Estado inicial: líneas «$s0 = 0x10010000», «$8 = -3», «M[0x10010008] = 120» (también «[0x…]» o «mem[…]»). */
  function estado(txt, Isa) {
    var RN = RN_(Isa || G.SLIsa), reg = [], mem = {}, errs = [], i;
    for (i = 0; i < 32; i++) reg.push(0);
    String(txt || '').split('\n').forEach(function (l, n) {
      var s = l.replace(/#.*/, '').trim(), m, v; if (!s) return;
      m = /^(\$\w+)\s*=\s*([-+]?(?:0x[0-9a-f]+|\d+))$/i.exec(s);
      if (m) {
        if (!(m[1] in RN) || RN[m[1]] === 0) { errs.push({ n: n + 1, e: 'reg', x: m[1] }); return; }
        v = parseNum(m[2]); if (v === null) { errs.push({ n: n + 1, e: 'num', x: m[2] }); return; }
        reg[RN[m[1]]] = v; return;
      }
      m = /^(?:m|mem)?\s*\[\s*(0x[0-9a-f]+|\d+)\s*\]\s*=\s*([-+]?(?:0x[0-9a-f]+|\d+))$/i.exec(s);
      if (m) {
        var a = parseNum(m[1]); v = parseNum(m[2]);
        if (a === null || a % 4) { errs.push({ n: n + 1, e: 'align', x: m[1] }); return; }
        if (v === null) { errs.push({ n: n + 1, e: 'num', x: m[2] }); return; }
        mem[a] = v; return;
      }
      errs.push({ n: n + 1, e: 'line', x: s });
    });
    return { reg: reg, mem: mem, errs: errs };
  }
  function snap(m) { var o = {}; for (var k in m) o[k] = m[k]; return o; }
  /* Ensambla y ejecuta. mods: {addi, slti, bne, jal}. Devuelve {rows (listado), steps (un ciclo cada uno), errs, stop}. */
  function run(lines, base, init, mods, Isa, limit) {
    Isa = Isa || G.SLIsa; limit = limit || 400; mods = mods || {};
    var A = Isa.assemble(lines, base, 'apuntes'), rows = A.rows, st = estado(init, Isa), steps = [];
    var out = { rows: rows, steps: steps, errs: st.errs, stop: null, reg0: st.reg.slice(), mem0: snap(st.mem) };
    rows.forEach(function (r) {
      if (r.err) return;
      var t = NOMBRE_OP[r.w >>> 26], fn = r.w & 63;
      if (!t || (t === 'R' && !(fn in FUNCT) && r.w !== 0)) { r.err = 'rdno'; r.x = r.src.split(/\s+/)[0]; return; }
      if (NEED[t] && !mods[NEED[t]]) { r.err = 'rdext'; r.x = t; }
    });
    if (st.errs.length || rows.some(function (r) { return r.err; })) { out.stop = 'err'; return out; }
    if (!rows.length) { out.stop = 'empty'; return out; }
    var byPc = {}; rows.forEach(function (r, i) { byPc[r.pc >>> 0] = i; });
    var reg = st.reg.slice(), mem = snap(st.mem), pc = base >>> 0;
    while (steps.length < limit) {
      if (!(pc in byPc)) { out.stop = 'end'; out.endPc = pc; break; }
      var i = byPc[pc], r = rows[i], f = fields(r.w), tt = NOMBRE_OP[f.op], s0 = TABLA[tt];
      if (s0.MemRead === '1' || s0.MemWrite === '1') {   // dirección sin alinear: la ejecución se para aquí (en QtSpim sería una excepción)
        var ad = (reg[f.rs] + sx(f.im)) >>> 0;
        if (ad % 4) { out.stop = 'align'; out.stopX = ad; out.stopI = i; break; }
      }
      var x = paso(pc, r.w, reg, mem);
      steps.push({ i: i, pc: pc, w: r.w, src: r.src, c: x.c, s: x.s, t: x.t, reg: reg.slice(), mem: snap(mem) });
      pc = x.c.PCsiguiente;
    }
    if (!out.stop) out.stop = 'limit';
    return out;
  }
  var SLRuta = { TABLA: TABLA, SEN: SEN, senales: senales, NOMBRE_OP: NOMBRE_OP, FUNCT: FUNCT, NEED: NEED, CAMINO: CAMINO, fields: fields, sx: sx, s32: s32, alu: alu, paso: paso, tiempo: tiempo, estado: estado, run: run, parseNum: parseNum };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLRuta; else G.SLRuta = SLRuta;
})(typeof window !== 'undefined' ? window : this);
