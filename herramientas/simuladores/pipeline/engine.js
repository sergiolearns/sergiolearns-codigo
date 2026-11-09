/* SergioLearns — simulador del pipeline (IC1, tema de papel 11). SLPipe.schedule(traza, {fwd, ctrl}) planifica la traza dinámica
 * en el MIPS segmentado de 5 etapas de los apuntes; es el mismo modelo que kit-papel/pipe.py (comprobado caso a caso con él):
 * - IF, ID, EX, MEM, WB; el banco escribe en la 1.ª mitad del ciclo y lee en la 2.ª (ID puede leer lo que WB escribe ese ciclo).
 * - Sin anticipación: el consumidor tiene su ID en el ciclo del WB del productor o después.
 * - Con anticipación (EX/MEM y MEM/WB): el dato de la ALU está al final de su EX, el de un load al final de su MEM; el consumidor
 *   lo quiere al empezar su EX. Los saltos (y jr) comparan en ID y piden sus datos en ID.
 * - ctrl 'parar': 1 burbuja tras cada salto condicional; 'nosaltar': se predice que no salta y, si salta, la buscada se tira.
 *   j, jal y jr se resuelven en ID: siempre 1 ciclo perdido (la buscada se tira).
 * SLPipe.decode(texto) entiende una instrucción del segmento de texto de SPIM («lw $9, 0($29)», «bne $19, $0, -16 [Loop-…]»). */
(function (G) {
  var NAMES = ['$zero', '$at', '$v0', '$v1', '$a0', '$a1', '$a2', '$a3', '$t0', '$t1', '$t2', '$t3', '$t4', '$t5', '$t6', '$t7',
    '$s0', '$s1', '$s2', '$s3', '$s4', '$s5', '$s6', '$s7', '$t8', '$t9', '$k0', '$k1', '$gp', '$sp', '$fp', '$ra'];
  var R3 = { add: 1, addu: 1, sub: 1, subu: 1, and: 1, or: 1, nor: 1, slt: 1, sltu: 1, xor: 1, sllv: 1, srlv: 1, srav: 1, mul: 1, movn: 1, movz: 1 };
  var I2 = { addi: 1, addiu: 1, andi: 1, ori: 1, slti: 1, sltiu: 1, xori: 1, sll: 1, srl: 1, sra: 1 };
  var LD = { lw: 1, lb: 1, lbu: 1, lh: 1, lhu: 1, ll: 1 }, ST = { sw: 1, sb: 1, sh: 1 };
  var BR2 = { beq: 1, bne: 1 }, BR1 = { bgez: 1, bltz: 1, blez: 1, bgtz: 1, bgezal: 1, bltzal: 1 };
  var HL = { mult: 1, multu: 1, div: 1, divu: 1, madd: 1, maddu: 1, msub: 1, msubu: 1 };
  function canon(r) {   // '$9', '$t1', '$0' -> nombre ('$t1')
    var m = /^\$(\d+)$/.exec(r);
    if (m) return NAMES[+m[1]] || r;
    if (r === '$s8') return '$fp';
    return r;
  }
  /* d = {op, dest, srcs, load, store, branch, jump, txt}. txt: la instrucción con los registros por su nombre. */
  function decode(s) {
    var t = String(s).split('#')[0].split(';')[0].trim(), lab = null, c = t.indexOf(':');
    if (c >= 0 && !/^\[/.test(t)) { lab = t.slice(0, c).trim(); t = t.slice(c + 1).trim(); }
    var tgt = /\[([A-Za-z_.$][\w.$]*)(-0x[0-9a-f]+)?\]\s*$/.exec(t);   // «[Loop-0x0040003c]» o «[main]» de SPIM
    t = t.replace(/\s*\[[^\]]*\]\s*$/, '');
    var op = (t.split(/\s+/)[0] || 'nop').toLowerCase();
    var regs = (t.match(/\$\w+/g) || []).map(canon);
    var d = { op: op, dest: null, srcs: [], load: false, store: false, branch: false, jump: false, jreg: false, label: lab, target: null, txt: '' };
    if (R3[op]) { d.dest = regs[0]; d.srcs = regs.slice(1, 3); if (op === 'movn' || op === 'movz') d.srcs.push(regs[0]); }
    else if (I2[op]) { d.dest = regs[0]; d.srcs = regs.slice(1, 2); }
    else if (op === 'lui') d.dest = regs[0];
    else if (LD[op]) { d.dest = regs[0]; d.srcs = regs.slice(1, 2); d.load = true; }
    else if (ST[op]) { d.srcs = regs.slice(0, 2); d.store = true; }
    else if (BR2[op]) { d.srcs = regs.slice(0, 2); d.branch = true; }
    else if (BR1[op]) { d.srcs = regs.slice(0, 1); d.branch = true; if (/al$/.test(op)) d.dest = '$ra'; }
    else if (op === 'j') d.jump = true;
    else if (op === 'jal') { d.jump = true; d.dest = '$ra'; }
    else if (op === 'jr') { d.jump = true; d.jreg = true; d.srcs = regs.slice(0, 1); }
    else if (op === 'jalr') { d.jump = true; d.jreg = true; d.dest = regs.length > 1 ? regs[0] : '$ra'; d.srcs = regs.slice(regs.length > 1 ? 1 : 0, regs.length > 1 ? 2 : 1); }
    else if (HL[op]) { d.dest = 'HI/LO'; d.srcs = regs.slice(0, 2); if (/^m(add|sub)/.test(op)) d.srcs.push('HI/LO'); }
    else if (op === 'mfhi' || op === 'mflo') { d.dest = regs[0]; d.srcs = ['HI/LO']; }
    else if (op === 'mthi' || op === 'mtlo') { d.dest = 'HI/LO'; d.srcs = regs.slice(0, 1); }
    else if (op === 'syscall') { d.srcs = ['$v0', '$a0', '$a1']; }
    if ((d.branch || d.jump) && !d.jreg) {
      var parts = t.split(/[\s,]+/);
      d.target = tgt ? tgt[1] : parts[parts.length - 1];
    }
    d.srcs = d.srcs.filter(function (r, i, a) { return r && r !== '$zero' && a.indexOf(r) === i; });
    if (d.dest === '$zero') d.dest = null;
    if (op === 'sll' && !d.dest) d.op = 'nop';
    // texto: registros por su nombre y el destino del salto por su etiqueta
    var txt = t.replace(/\$\d+\b/g, canon);
    if (d.target && tgt) { var q = txt.split(/,\s*|\s+/); q[q.length - 1] = tgt[1]; txt = d.op + ' ' + q.slice(1).join(', '); }
    if (d.op === 'nop') txt = 'nop';
    d.txt = txt.replace(/\s+/g, ' ').replace(/ ,/g, ',').trim();
    return d;
  }
  /* traza: [{txt o d, taken}] en el orden en que se ejecutan. o: {fwd: true, ctrl: 'nosaltar'|'parar'} */
  function schedule(trace, o) {
    o = o || {};
    var fwd = o.fwd !== false, ctrl = o.ctrl === 'parar' ? 'parar' : 'nosaltar';
    var rows = [], nextIF = 1;
    trace.forEach(function (e, i) {
      var d = e.d || decode(e.txt != null ? e.txt : e);
      if (e.dest !== undefined) d.dest = e.dest;          // p. ej. el $v0 que escribe un syscall de lectura
      var IF = nextIF, ID = IF + 1, why = [], deps = [];
      var early = d.branch || d.jreg;                     // comparan (o leen el registro) en ID
      d.srcs.forEach(function (r) {
        for (var k = rows.length - 1; k >= 0; k--) {
          var p = rows[k];
          if (p.flushed) continue;
          if (p.dest === r) {
            var need;
            if (!fwd) need = p.WB;
            else { var ready = (p.load ? p.MEM : p.EX) + 1; need = early ? ready : ready - 1; }
            if (need > ID) { why.push({ r: r, p: p.n, c: need - ID }); ID = need; }
            deps.push({ r: r, p: p });
            break;
          }
        }
      });
      var row = { n: i, txt: d.txt, op: d.op, dest: d.dest, load: d.load, store: d.store, IF: IF, ID: ID, EX: ID + 1, MEM: ID + 2, WB: ID + 3,
        stall: ID - IF - 1, why: why, branch: d.branch, jump: d.jump, jreg: d.jreg, taken: !!e.taken, flushed: false, ctrl: 0, src: [], pc: e.pc, line: e.line };
      var use = early ? ID : ID + 1;
      deps.forEach(function (x) {
        var p = x.p, path;
        if (!fwd || ID >= p.WB) path = 'banco';
        else if (use === p.EX + 1) path = 'EX/MEM';
        else path = 'MEM/WB';
        row.src.push({ r: x.r, p: p.n, path: path });
      });
      rows.push(row);
      nextIF = ID;
      if (d.branch && ctrl === 'parar') { row.ctrl = 1; nextIF = ID + 1; }
      else if ((d.branch && e.taken) || d.jump) {
        rows.push({ n: null, txt: '', op: 'flush', dest: null, load: false, IF: ID, ID: null, EX: null, MEM: null, WB: null, stall: 0, why: [], branch: false, jump: false, flushed: true, of: i, src: [] });
        row.ctrl = 1; nextIF = ID + 1;
      }
    });
    return rows;
  }
  function total(rows) { var m = 0; rows.forEach(function (r) { if (!r.flushed && r.WB > m) m = r.WB; }); return m; }
  function stalls(rows) { var s = 0, c = 0; rows.forEach(function (r) { if (!r.flushed) s += r.stall; c += r.ctrl || 0; }); return [s, c]; }
  /* Qué hay en cada etapa en el ciclo c: {IF: fila, ID: fila, …}; la que espera en ID lleva wait = true. */
  function snapshot(rows, c) {
    var st = {};
    rows.forEach(function (r) {
      if (r.flushed) { if (r.IF === c) st.IF = r; if (r.IF + 1 === c) st.ID = r; return; }
      ['IF', 'ID', 'EX', 'MEM', 'WB'].forEach(function (k) { if (r[k] === c) st[k] = r; });
      if (r.IF < c && c < r.ID) st.IDw = r;
    });
    return st;
  }
  var SLPipe = { NAMES: NAMES, decode: decode, schedule: schedule, total: total, stalls: stalls, snapshot: snapshot };
  if (typeof module !== 'undefined' && module.exports) module.exports = SLPipe; else G.SLPipe = SLPipe;
})(this);
