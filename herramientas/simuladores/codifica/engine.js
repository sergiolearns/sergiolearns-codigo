/* SergioLearns — codificador de instrucciones MIPS (IC1, tema de papel 8). SLIsa.assemble(líneas, base, conv) y SLIsa.decode(palabra,
 * pc, conv), con la convención de los apuntes (kit-papel/isa.py: el desplazamiento de beq/bne cuenta desde PC + 4) o la de
 * QtSpim sin saltos retardados (cuenta desde el propio salto: una unidad más). j y jal: los 26 bits bajos de destino ÷ 4; los 4 de
 * arriba los pone PC + 4. Comprobado con isa.py y con el ensamblador de SPIM (el núcleo del entorno MIPS). */
(function (G) {
  var REG = ['$zero', '$at', '$v0', '$v1', '$a0', '$a1', '$a2', '$a3', '$t0', '$t1', '$t2', '$t3', '$t4', '$t5', '$t6', '$t7',
    '$s0', '$s1', '$s2', '$s3', '$s4', '$s5', '$s6', '$s7', '$t8', '$t9', '$k0', '$k1', '$gp', '$sp', '$fp', '$ra'];
  // R: [funct, forma] · forma: 'dst' rd, rs, rt · 'sh' rd, rt, shamt · 'shv' rd, rt, rs · 'rs' rs · 'st' rs, rt · 'd' rd · '' nada
  var R = { add: [0x20, 'dst'], addu: [0x21, 'dst'], sub: [0x22, 'dst'], subu: [0x23, 'dst'], and: [0x24, 'dst'], or: [0x25, 'dst'], xor: [0x26, 'dst'],
    nor: [0x27, 'dst'], slt: [0x2A, 'dst'], sltu: [0x2B, 'dst'], sll: [0, 'sh'], srl: [2, 'sh'], sra: [3, 'sh'], sllv: [4, 'shv'], srlv: [6, 'shv'],
    srav: [7, 'shv'], jr: [8, 'rs'], jalr: [9, 'jalr'], syscall: [0xC, ''], mfhi: [0x10, 'd'], mflo: [0x12, 'd'], mult: [0x18, 'st'], multu: [0x19, 'st'],
    div: [0x1A, 'st'], divu: [0x1B, 'st'] };
  // I: [op, forma, con signo] · 'ari' rt, rs, inm · 'mem' rt, inm(rs) · 'br' rs, rt, etiqueta · 'br1' rs, etiqueta · 'lui' rt, inm
  var I = { addi: [8, 'ari', 1], addiu: [9, 'ari', 1], slti: [0xA, 'ari', 1], sltiu: [0xB, 'ari', 1], andi: [0xC, 'ari', 0], ori: [0xD, 'ari', 0],
    xori: [0xE, 'ari', 0], lui: [0xF, 'lui', 0], lb: [0x20, 'mem', 1], lh: [0x21, 'mem', 1], lw: [0x23, 'mem', 1], lbu: [0x24, 'mem', 1], lhu: [0x25, 'mem', 1],
    sb: [0x28, 'mem', 1], sh: [0x29, 'mem', 1], sw: [0x2B, 'mem', 1], beq: [4, 'br', 1], bne: [5, 'br', 1], blez: [6, 'br1', 1], bgtz: [7, 'br1', 1],
    bltz: [1, 'br1', 1, 0], bgez: [1, 'br1', 1, 1] };
  var J = { j: 2, jal: 3 };
  var RN = {}; REG.forEach(function (r, i) { RN[r] = i; RN['$' + i] = i; }); RN.$s8 = 30;
  function E(code, x) { var e = new Error(code); e.code = code; e.x = x; return e; }
  function reg(s) { if (!(s in RN)) throw E('reg', s); return RN[s]; }
  function num(s) {
    if (!/^[-+]?(0x[0-9a-f]+|\d+)$/i.test(s)) throw E('num', s);
    var neg = s[0] === '-', v = parseInt(s.replace(/^[-+]/, ''), /0x/i.test(s) ? 16 : 10);
    return neg ? -v : v;
  }
  function imm16(s, signed) {
    var v = num(s);
    if (signed ? (v < -32768 || v > 65535 || (v > 32767 && !/0x/i.test(s))) : (v < 0 || v > 65535)) throw E(signed ? 'imms' : 'immu', s);
    return v & 0xFFFF;
  }
  function sx(x) { return x & 0x8000 ? x - 0x10000 : x; }
  function hex(w, n) { return '0x' + (w >>> 0).toString(16).toUpperCase().padStart(n || 8, '0'); }
  function word(f) {
    if (f.fmt === 'R') return ((f.op << 26) | (f.rs << 21) | (f.rt << 16) | (f.rd << 11) | (f.sh << 6) | f.fn) >>> 0;
    if (f.fmt === 'I') return ((f.op << 26) | (f.rs << 21) | (f.rt << 16) | (f.im & 0xFFFF)) >>> 0;
    return ((f.op << 26) | (f.dst & 0x3FFFFFF)) >>> 0;
  }
  /* Una instrucción en pc. lab: {etiqueta: dirección}. Devuelve {fmt, op, rs, rt, rd, sh, fn, im, dst, m, calc}. */
  function enc(src, pc, lab, conv) {
    lab = lab || {};
    var t = src.replace(/#.*/, '').trim(), m = (t.split(/\s+/)[0] || '').toLowerCase(), a = t.slice(m.length).split(',').map(function (x) { return x.trim(); }).filter(function (x) { return x !== ''; });
    var f = { fmt: 'R', op: 0, rs: 0, rt: 0, rd: 0, sh: 0, fn: 0, im: 0, dst: 0, m: m, calc: null };
    var need = function (n) { if (a.length !== n) throw E('args', n); };
    var target = function (s) { if (s in lab) return lab[s]; if (/^[A-Za-z_.]\w*$/.test(s)) throw E('lab', s); return num(s) >>> 0; };
    if (m === 'nop') return f;
    if (R[m]) {
      var r = R[m]; f.fn = r[0];
      if (r[1] === 'dst') { need(3); f.rd = reg(a[0]); f.rs = reg(a[1]); f.rt = reg(a[2]); }
      else if (r[1] === 'sh') { need(3); f.rd = reg(a[0]); f.rt = reg(a[1]); f.sh = num(a[2]); if (f.sh < 0 || f.sh > 31) throw E('sh', a[2]); }
      else if (r[1] === 'shv') { need(3); f.rd = reg(a[0]); f.rt = reg(a[1]); f.rs = reg(a[2]); }
      else if (r[1] === 'rs') { need(1); f.rs = reg(a[0]); }
      else if (r[1] === 'jalr') { if (a.length === 1) { f.rd = 31; f.rs = reg(a[0]); } else { need(2); f.rd = reg(a[0]); f.rs = reg(a[1]); } }
      else if (r[1] === 'st') { need(2); f.rs = reg(a[0]); f.rt = reg(a[1]); }
      else if (r[1] === 'd') { need(1); f.rd = reg(a[0]); }
      else need(0);
      return f;
    }
    if (I[m]) {
      var x = I[m]; f.fmt = 'I'; f.op = x[0];
      if (x[1] === 'ari') { need(3); f.rt = reg(a[0]); f.rs = reg(a[1]); f.im = imm16(a[2], x[2]); }
      else if (x[1] === 'lui') { need(2); f.rt = reg(a[0]); f.im = imm16(a[1], 0); }
      else if (x[1] === 'mem') {
        need(2); f.rt = reg(a[0]);
        var mm = /^(.*)\((\$\w+)\)$/.exec(a[1]); if (!mm) throw E('mem', a[1]);
        f.rs = reg(mm[2]); f.im = imm16(mm[1].trim() || '0', 1);
      } else {
        var two = x[1] === 'br'; need(two ? 3 : 2);
        f.rs = reg(a[0]); f.rt = two ? reg(a[1]) : (x[3] != null ? x[3] : 0);
        var tg = target(a[two ? 2 : 1]), from = conv === 'qtspim' ? pc : (pc + 4) >>> 0, d = tg - from;
        if (d % 4) throw E('align', a[two ? 2 : 1]);
        var off = d / 4; if (off < -32768 || off > 32767) throw E('far', a[two ? 2 : 1]);
        f.im = off & 0xFFFF; f.calc = { k: 'br', tg: tg, from: from, off: off, lab: a[two ? 2 : 1] };
      }
      return f;
    }
    if (m in J) {
      need(1); f.fmt = 'J'; f.op = J[m];
      var tj = target(a[0]);
      if (tj % 4) throw E('align', a[0]);
      if (((tj ^ (pc + 4)) & 0xF0000000) >>> 0) throw E('region', a[0]);
      f.dst = (tj >>> 2) & 0x3FFFFFF; f.calc = { k: 'j', tg: tj, lab: a[0] };
      return f;
    }
    throw E('op', m);
  }
  function fields(w) {
    w = w >>> 0;
    var f = { op: w >>> 26, rs: (w >>> 21) & 31, rt: (w >>> 16) & 31, rd: (w >>> 11) & 31, sh: (w >>> 6) & 31, fn: w & 63, im: w & 0xFFFF, dst: w & 0x3FFFFFF };
    f.fmt = f.op === 0 ? 'R' : (f.op === 2 || f.op === 3 ? 'J' : 'I');
    return f;
  }
  var RF = {}, IO = {}; Object.keys(R).forEach(function (k) { RF[R[k][0]] = k; }); Object.keys(I).forEach(function (k) { if (I[k][0] !== 1) IO[I[k][0]] = k; });
  /* Palabra → texto (los saltos, con su dirección de destino). Devuelve {txt, f, m, tg} o {err}. */
  function decode(w, pc, conv) {
    var f = fields(w), m, txt, tg = null, rg = function (i) { return REG[i]; };
    if (w >>> 0 === 0) return { txt: 'nop', f: f, m: 'nop' };
    if (f.fmt === 'R') {
      m = RF[f.fn]; if (!m) return { err: 'fn', f: f };
      var k = R[m][1];
      txt = k === 'dst' ? m + ' ' + rg(f.rd) + ', ' + rg(f.rs) + ', ' + rg(f.rt) : k === 'sh' ? m + ' ' + rg(f.rd) + ', ' + rg(f.rt) + ', ' + f.sh : k === 'shv' ? m + ' ' + rg(f.rd) + ', ' + rg(f.rt) + ', ' + rg(f.rs)
        : k === 'rs' ? m + ' ' + rg(f.rs) : k === 'jalr' ? m + ' ' + (f.rd === 31 ? '' : rg(f.rd) + ', ') + rg(f.rs) : k === 'st' ? m + ' ' + rg(f.rs) + ', ' + rg(f.rt) : k === 'd' ? m + ' ' + rg(f.rd) : m;
    } else if (f.fmt === 'J') {
      m = f.op === 2 ? 'j' : 'jal'; tg = ((((pc + 4) >>> 0) & 0xF0000000) | (f.dst << 2)) >>> 0; txt = m + ' ' + hex(tg);
    } else {
      m = f.op === 1 ? (f.rt === 1 ? 'bgez' : f.rt === 0 ? 'bltz' : null) : IO[f.op];
      if (!m) return { err: 'op', f: f };
      var x = I[m];
      if (x[1] === 'br' || x[1] === 'br1') { tg = ((conv === 'qtspim' ? pc : pc + 4) + 4 * sx(f.im)) >>> 0; txt = m + ' ' + rg(f.rs) + ', ' + (x[1] === 'br' ? rg(f.rt) + ', ' : '') + hex(tg); }
      else if (x[1] === 'mem') txt = m + ' ' + rg(f.rt) + ', ' + sx(f.im) + '(' + rg(f.rs) + ')';
      else if (x[1] === 'lui') txt = 'lui ' + rg(f.rt) + ', ' + hex(f.im, 4);
      else txt = m + ' ' + rg(f.rt) + ', ' + rg(f.rs) + ', ' + (x[2] ? sx(f.im) : hex(f.im, 4));
    }
    return { txt: txt, f: f, m: m, tg: tg };
  }
  /* Programa: etiquetas y una instrucción por línea, desde base. Devuelve {rows: [{pc, src, label, f, w, err}], lab}. */
  function assemble(lines, base, conv) {
    var lab = {}, pc = base >>> 0, ins = [];
    lines.forEach(function (l, i) {
      var s = l.replace(/#.*/, ''), lb = null, mm = /^\s*([A-Za-z_.][\w.]*)\s*:(.*)$/.exec(s);
      if (mm) { lb = mm[1]; s = mm[2]; lab[lb] = pc; }
      s = s.trim();
      if (s) { ins.push({ pc: pc, src: s, label: lb, line: i + 1 }); pc = (pc + 4) >>> 0; }
      else if (lb) ins.push({ pc: pc, src: '', label: lb, line: i + 1, only: true });
    });
    var rows = [];
    ins.forEach(function (x) {
      if (x.only) return;
      var lb = x.label || null;
      for (var k in lab) if (lab[k] === x.pc && !lb) lb = k;
      var r = { pc: x.pc, src: x.src, label: lb, line: x.line };
      try { r.f = enc(x.src, x.pc, lab, conv); r.w = word(r.f); } catch (e) { r.err = e.code || 'op'; r.x = e.x; }
      rows.push(r);
    });
    return { rows: rows, lab: lab };
  }
  var SLIsa = { REG: REG, R: R, I: I, J: J, enc: enc, word: word, fields: fields, decode: decode, assemble: assemble, hex: hex, sx: sx };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLIsa; else G.SLIsa = SLIsa;
})(this);
