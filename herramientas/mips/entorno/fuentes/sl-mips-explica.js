/* sl-mips-explica.js — la frase de cada instrucción (sl-mips v2.0, 13 nov 2026).
   SLMExplica(b, a, ctx) → { short, say, calm[] }   (b: antes, a: después)
   b/a: { pc, R: [32 registros, HI, LO] } · b.row: fila del segmento de texto {addr, enc, ins, src} · ctx: { en, rows, mainAddr,
   out (lo escrito en la consola en este paso), waiting (si la syscall espera entrada), read (lo que se ha leído), mem(addr) } */
(function (G) {
  'use strict';
  var REGS = ['zero', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3', 't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7',
    's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 't8', 't9', 'k0', 'k1', 'gp', 'sp', 'fp', 'ra'];
  var IDX = {}; REGS.forEach(function (r, i) { IDX[r] = i; }); IDX.s8 = 30; IDX.r0 = 0;
  function hex(n, w) { var s = (n >>> 0).toString(16); while (s.length < (w || 8)) s = '0' + s; return s; }
  function bin(n, w) { var s = (n >>> 0).toString(2); while (s.length < w) s = '0' + s; return s.slice(-w); }
  function regNum(op) { op = String(op || '').trim(); var m = /^\$(\d+)$/.exec(op); if (m) return +m[1]; m = /^\$([a-z0-9]+)$/i.exec(op); return m && IDX[m[1]] != null ? IDX[m[1]] : -1; }
  function RN(i) { return i >= 0 ? '$' + REGS[i] : '?'; }
  function num(v) { v = v | 0; return (v >= 65536 || v < -65536) ? '0x' + hex(v >>> 0, 8) : String(v); }
  function parseIns(s) {
    s = String(s || '').trim(); var lab = null, m = /\s*\[([^\]]*)\]\s*$/.exec(s);
    if (m) { lab = m[1].replace(/[-+]0x[0-9a-f]+$/i, ''); s = s.slice(0, m.index); }
    var sp = s.search(/\s/), mn = (sp < 0 ? s : s.slice(0, sp)).toLowerCase(), rest = sp < 0 ? '' : s.slice(sp + 1).trim();
    return { mn: mn, ops: rest ? rest.split(/\s*,\s*/) : [], lab: lab };
  }
  function memOp(op) { var m = /^(-?\d+)\((\$\w+)\)$/.exec(String(op || '').trim()); return m ? { off: +m[1], base: regNum(m[2]) } : null; }
  function srcText(row) { return String(row && row.src || '').replace(/^\d+:\s*/, '').replace(/\s*#.*$/, '').replace(/\s+/g, ' ').trim(); }
  function chr(c) { c = c & 255; return c >= 32 && c < 127 ? String.fromCharCode(c) : null; }

  function explain(b, a, ctx) {
    var EN = !!ctx.en, T = function (es, en) { return EN ? en : es; };
    var row = b.row || {}, P = parseIns(row.ins), mn = P.mn, o = P.ops;
    var R0 = b.R, R1 = a.R, taken = (a.pc >>> 0) !== ((b.pc + 4) >>> 0);
    var vb = function (i) { return num(R0[i]); }, va = function (i) { return num(R1[i]); };
    // la pseudoinstrucción a la que pertenece esta fila (y cuántas instrucciones de verdad tiene)
    var rows = ctx.rows || [], k = -1;
    for (var i = 0; i < rows.length; i++) if (rows[i].addr === row.addr) { k = i; break; }
    var head = k, part = 1, total = 1;
    if (k >= 0) { while (head > 0 && !rows[head].src) head--; part = k - head + 1; var j = head + 1; while (j < rows.length && !rows[j].src) j++; total = j - head; }
    var sRow = head >= 0 ? rows[head] : row, src = srcText(sRow), sMn = (src.split(' ')[0] || '').toLowerCase();
    var pseudo = !!src && sMn !== mn && sMn !== '' && !/^(nop)$/.test(mn) || total > 1;
    var startup = ctx.mainAddr && row.addr < ctx.mainAddr && row.addr >= 0x00400000;
    var say = '', short = '';

    var R = function (n) { return RN(regNum(o[n])); }, ri = function (n) { return regNum(o[n]); };
    var OPV = { add: T('suma', 'adds'), addu: T('suma', 'adds'), sub: T('resta', 'subtracts'), subu: T('resta', 'subtracts'), and: 'AND', or: 'OR', xor: 'XOR', nor: 'NOR', mul: T('multiplica', 'multiplies') };
    var SYM = { add: '+', addu: '+', sub: '−', subu: '−', and: 'AND', or: 'OR', xor: 'XOR', nor: 'NOR', mul: '×', sllv: '<<', srlv: '>>', srav: '>>' };
    switch (mn) {
      case 'add': case 'addu': case 'sub': case 'subu': case 'and': case 'or': case 'xor': case 'nor': case 'mul': case 'sllv': case 'srlv': case 'srav':
        if ((mn === 'addu' || mn === 'add' || mn === 'or') && ri(1) === 0) {
          say = T('Copia ' + R(2) + ' (' + vb(ri(2)) + ') en ' + R(0) + ': ahora vale ' + va(ri(0)) + '.', 'Copies ' + R(2) + ' (' + vb(ri(2)) + ') into ' + R(0) + ': it is now ' + va(ri(0)) + '.');
          short = T('copia ' + R(2) + ' en ' + R(0), 'copies ' + R(2) + ' into ' + R(0)); break;
        }
        say = mn + ' ' + (OPV[mn] || T('opera', 'computes')) + ' ' + R(1) + ' (' + vb(ri(1)) + ') ' + SYM[mn] + ' ' + R(2) + ' (' + vb(ri(2)) + ') = ' + va(ri(0)) + T(', y lo guarda en ', ', and stores it in ') + R(0) + '.';
        short = R(0) + ' = ' + va(ri(0)); break;
      case 'slt': case 'sltu':
        say = T(mn + ' compara: ¿' + R(1) + ' (' + vb(ri(1)) + ') es menor que ' + R(2) + ' (' + vb(ri(2)) + ')? ' + (R1[ri(0)] ? 'Sí' : 'No') + ', así que ' + R(0) + ' = ' + va(ri(0)) + '.',
          mn + ' compares: is ' + R(1) + ' (' + vb(ri(1)) + ') less than ' + R(2) + ' (' + vb(ri(2)) + ')? ' + (R1[ri(0)] ? 'Yes' : 'No') + ', so ' + R(0) + ' = ' + va(ri(0)) + '.');
        short = R(0) + ' = ' + va(ri(0)); break;
      case 'addi': case 'addiu': case 'andi': case 'ori': case 'xori':
        var imm = parseInt(o[2], 10);
        if ((mn === 'ori' || mn === 'addiu' || mn === 'addi') && ri(1) === 0) {
          say = T('Carga el número ' + va(ri(0)) + ' en ' + R(0) + '.', 'Loads the number ' + va(ri(0)) + ' into ' + R(0) + '.');
          short = R(0) + ' = ' + va(ri(0)); break;
        }
        if (mn === 'addi' || mn === 'addiu') {
          var verb = imm < 0 ? T(' resta ' + (-imm) + ' a ', ' subtracts ' + (-imm) + ' from ') : T(' suma ' + imm + ' a ', ' adds ' + imm + ' to ');
          say = ri(0) === ri(1) && imm < 0
            ? mn + verb + R(0) + T(': pasa de ' + vb(ri(1)) + ' a ' + va(ri(0)) + '.', ': it goes from ' + vb(ri(1)) + ' to ' + va(ri(0)) + '.')
            : ri(0) === ri(1)
            ? T(mn + ' suma ' + imm + ' a ' + R(0) + ': pasa de ' + vb(ri(1)) + ' a ' + va(ri(0)) + '.', mn + ' adds ' + imm + ' to ' + R(0) + ': it goes from ' + vb(ri(1)) + ' to ' + va(ri(0)) + '.')
            : T(mn + ' suma ' + imm + ' a ' + R(1) + ' (' + vb(ri(1)) + ') y lo guarda en ' + R(0) + ': ' + va(ri(0)) + '.', mn + ' adds ' + imm + ' to ' + R(1) + ' (' + vb(ri(1)) + ') and stores it in ' + R(0) + ': ' + va(ri(0)) + '.');
          short = imm < 0 ? T('resta ' + (-imm) + ' a ' + R(0), 'subtracts ' + (-imm) + ' from ' + R(0)) : T('suma ' + imm + ' a ' + R(0), 'adds ' + imm + ' to ' + R(0)); break;
        }
        say = mn + ' ' + T('hace ', 'does ') + mn.slice(0, -1).toUpperCase() + T(' bit a bit de ', ' bit by bit of ') + R(1) + ' (' + vb(ri(1)) + T(') con ', ') with ') + imm + ': ' + R(0) + ' = ' + va(ri(0)) + '.';
        short = R(0) + ' = ' + va(ri(0)); break;
      case 'slti': case 'sltiu':
        say = T(mn + ' compara: ¿' + R(1) + ' (' + vb(ri(1)) + ') es menor que ' + o[2] + '? ' + (R1[ri(0)] ? 'Sí' : 'No') + ': ' + R(0) + ' = ' + va(ri(0)) + '.', mn + ' compares: is ' + R(1) + ' (' + vb(ri(1)) + ') less than ' + o[2] + '? ' + (R1[ri(0)] ? 'Yes' : 'No') + ': ' + R(0) + ' = ' + va(ri(0)) + '.');
        short = R(0) + ' = ' + va(ri(0)); break;
      case 'lui':
        var u = parseInt(o[1], 10) & 0xffff;
        say = T('lui pone ' + u + ' (0x' + hex(u, 4) + ') en la mitad alta de ' + R(0) + ': queda 0x' + hex(R1[ri(0)]) + '.', 'lui puts ' + u + ' (0x' + hex(u, 4) + ') in the upper half of ' + R(0) + ': it becomes 0x' + hex(R1[ri(0)]) + '.');
        short = T('mitad alta de ' + R(0), 'upper half of ' + R(0)); break;
      case 'sll': case 'srl': case 'sra':
        var sh = parseInt(o[2], 10);
        say = T(mn + ' desplaza ' + R(1) + ' (' + vb(ri(1)) + ') ' + sh + ' bits a la ' + (mn === 'sll' ? 'izquierda (es multiplicar por ' + Math.pow(2, sh) + ')' : 'derecha') + ': ' + R(0) + ' = ' + va(ri(0)) + '.',
          mn + ' shifts ' + R(1) + ' (' + vb(ri(1)) + ') ' + sh + ' bits to the ' + (mn === 'sll' ? 'left (multiplying by ' + Math.pow(2, sh) + ')' : 'right') + ': ' + R(0) + ' = ' + va(ri(0)) + '.');
        short = R(0) + ' = ' + va(ri(0)); break;
      case 'nop':
        say = T('nop no hace nada: rellena el hueco que deja el salto anterior.', 'nop does nothing: it fills the slot after the previous jump.'); short = T('no hace nada', 'does nothing'); break;
      case 'mult': case 'multu':
        say = T(mn + ' multiplica ' + R(0) + ' (' + vb(ri(0)) + ') × ' + R(1) + ' (' + vb(ri(1)) + '): el resultado, de 64 bits, queda en HI = ' + num(R1[32]) + ' y LO = ' + num(R1[33]) + '.',
          mn + ' multiplies ' + R(0) + ' (' + vb(ri(0)) + ') × ' + R(1) + ' (' + vb(ri(1)) + '): the 64-bit result goes to HI = ' + num(R1[32]) + ' and LO = ' + num(R1[33]) + '.');
        short = 'HI:LO = ' + R(0) + ' × ' + R(1); break;
      case 'div': case 'divu':
        say = T(mn + ' divide ' + R(0) + ' (' + vb(ri(0)) + ') entre ' + R(1) + ' (' + vb(ri(1)) + '): el cociente (' + num(R1[33]) + ') queda en LO y el resto (' + num(R1[32]) + ') en HI.',
          mn + ' divides ' + R(0) + ' (' + vb(ri(0)) + ') by ' + R(1) + ' (' + vb(ri(1)) + '): the quotient (' + num(R1[33]) + ') goes to LO and the remainder (' + num(R1[32]) + ') to HI.');
        short = T('cociente en LO, resto en HI', 'quotient in LO, remainder in HI'); break;
      case 'mfhi': case 'mflo':
        say = T(mn + ' copia ' + (mn === 'mfhi' ? 'HI' : 'LO') + ' (' + va(ri(0)) + ') en ' + R(0) + '.', mn + ' copies ' + (mn === 'mfhi' ? 'HI' : 'LO') + ' (' + va(ri(0)) + ') into ' + R(0) + '.');
        short = R(0) + ' = ' + va(ri(0)); break;
      case 'lw': case 'lh': case 'lhu': case 'lb': case 'lbu':
        var m1 = memOp(o[1]); if (!m1) break;
        var ad = (R0[m1.base] + m1.off) >>> 0, what = { lw: T('la palabra', 'the word'), lh: T('media palabra', 'a halfword'), lhu: T('media palabra', 'a halfword'), lb: T('un byte', 'a byte'), lbu: T('un byte', 'a byte') }[mn];
        var c = (mn === 'lb' || mn === 'lbu') ? chr(R1[ri(0)]) : null;
        var mt = m1.off + '(' + RN(m1.base) + ')';
        say = T(mn + ' lee ' + what + ' de la dirección 0x' + hex(ad) + ' (' + mt + ') y la guarda en ' + R(0) + ': ' + va(ri(0)) + (c ? ', la «' + c + '»' : (mn === 'lb' || mn === 'lbu') && !R1[ri(0)] ? ', el 0 del final' : '') + '.',
          mn + ' reads ' + what + ' from address 0x' + hex(ad) + ' (' + mt + ') into ' + R(0) + ': ' + va(ri(0)) + (c ? ", the '" + c + "'" : (mn === 'lb' || mn === 'lbu') && !R1[ri(0)] ? ', the final 0' : '') + '.');
        short = T('lee ', 'reads ') + va(ri(0)) + T(' de memoria', ' from memory'); break;
      case 'sw': case 'sh': case 'sb':
        var m2 = memOp(o[1]); if (!m2) break;
        var ad2 = (R0[m2.base] + m2.off) >>> 0;
        var mt2 = m2.off + '(' + RN(m2.base) + ')';
        say = T(mn + ' guarda ' + R(0) + ' (' + vb(ri(0)) + ') en la dirección 0x' + hex(ad2) + ' (' + mt2 + ')' + (m2.base === 29 ? ', en la pila' : '') + '.',
          mn + ' stores ' + R(0) + ' (' + vb(ri(0)) + ') at address 0x' + hex(ad2) + ' (' + mt2 + ')' + (m2.base === 29 ? ', on the stack' : '') + '.');
        short = T('guarda ', 'stores ') + R(0) + T(' en memoria', ' in memory'); break;
      case 'beq': case 'bne':
        var eq = (R0[ri(0)] | 0) === (R0[ri(1)] | 0), dest = P.lab || ('0x' + hex(a.pc));
        say = T(mn + ' compara ' + R(0) + ' (' + vb(ri(0)) + ') con ' + R(1) + ' (' + vb(ri(1)) + '): ' + (eq ? 'son iguales' : 'no son iguales') + ', así que ' + (taken ? 'salta a ' + dest : 'no salta y sigue con la siguiente') + '.',
          mn + ' compares ' + R(0) + ' (' + vb(ri(0)) + ') with ' + R(1) + ' (' + vb(ri(1)) + '): ' + (eq ? 'they are equal' : 'they are not equal') + ', so ' + (taken ? 'it jumps to ' + dest : 'it does not jump and goes on') + '.');
        short = taken ? T('salta a ', 'jumps to ') + dest : T('no salta', 'no jump'); break;
      case 'blez': case 'bgtz': case 'bltz': case 'bgez': case 'bgezal': case 'bltzal':
        var rel = { blez: '≤ 0', bgtz: '> 0', bltz: '< 0', bgez: '≥ 0', bgezal: '≥ 0', bltzal: '< 0' }[mn], d2 = P.lab || ('0x' + hex(a.pc));
        say = T(mn + ' mira si ' + R(0) + ' (' + vb(ri(0)) + ') es ' + rel + ': ' + (taken ? 'sí, salta a ' + d2 : 'no, sigue con la siguiente') + '.', mn + ' checks whether ' + R(0) + ' (' + vb(ri(0)) + ') is ' + rel + ': ' + (taken ? 'yes, it jumps to ' + d2 : 'no, it goes on') + '.');
        short = taken ? T('salta a ', 'jumps to ') + d2 : T('no salta', 'no jump'); break;
      case 'j':
        say = T('j salta siempre a ' + (P.lab || '0x' + hex(a.pc)) + '.', 'j always jumps to ' + (P.lab || '0x' + hex(a.pc)) + '.'); short = T('salta a ', 'jumps to ') + (P.lab || '0x' + hex(a.pc)); break;
      case 'jal':
        say = T('jal llama a ' + (P.lab || '0x' + hex(a.pc)) + ': guarda en $ra la dirección de vuelta (0x' + hex(R1[31]) + ') y salta.', 'jal calls ' + (P.lab || '0x' + hex(a.pc)) + ': it saves the return address in $ra (0x' + hex(R1[31]) + ') and jumps.');
        short = T('llama a ', 'calls ') + (P.lab || '0x' + hex(a.pc)); break;
      case 'jr':
        say = ri(0) === 31 ? T('jr $ra vuelve a quien llamó: a 0x' + hex(a.pc) + '.', 'jr $ra returns to the caller: to 0x' + hex(a.pc) + '.') : T('jr salta a la dirección que hay en ' + R(0) + ': 0x' + hex(a.pc) + '.', 'jr jumps to the address in ' + R(0) + ': 0x' + hex(a.pc) + '.');
        short = ri(0) === 31 ? T('vuelve', 'returns') : T('salta', 'jumps'); break;
      case 'jalr':
        say = T('jalr llama a la dirección que hay en ' + RN(regNum(o[o.length - 1])) + ' y guarda la vuelta en $ra.', 'jalr calls the address in ' + RN(regNum(o[o.length - 1])) + ' and saves the return address in $ra.'); short = T('llama', 'calls'); break;
      case 'syscall':
        var sv = R0[2] | 0, NM = { 1: 'print_int', 2: 'print_float', 3: 'print_double', 4: 'print_string', 5: 'read_int', 6: 'read_float', 7: 'read_double', 8: 'read_string', 9: 'sbrk', 10: 'exit', 11: 'print_char', 12: 'read_char', 17: 'exit2' };
        var nm = 'syscall ' + sv + (NM[sv] ? ' (' + NM[sv] + ')' : '');
        if (ctx.waiting) { say = T(nm + ': el programa espera que escribas en la consola y pulses Intro.', nm + ': the program waits for you to type in the console and press Enter.'); short = T('espera tu respuesta', 'waits for your answer'); break; }
        if (sv === 1) say = T(nm + ' escribe en la consola el entero de $a0: ' + num(R0[4]) + '.', nm + ' prints the integer in $a0: ' + num(R0[4]) + '.');
        else if (sv === 4) say = T(nm + ' escribe la cadena que empieza en $a0 (0x' + hex(R0[4]) + '): «' + (ctx.out || '').replace(/\n/g, '⏎') + '».', nm + ' prints the string starting at $a0 (0x' + hex(R0[4]) + '): "' + (ctx.out || '').replace(/\n/g, '⏎') + '".');
        else if (sv === 11) say = T(nm + ' escribe el carácter de $a0: «' + (ctx.out || '') + '».', nm + " prints the character in $a0: '" + (ctx.out || '') + "'.");
        else if (sv === 5) say = T(nm + ' ha leído ' + num(R1[2]) + ' de la consola: queda en $v0.', nm + ' has read ' + num(R1[2]) + ' from the console: it is in $v0.');
        else if (sv === 12) say = T(nm + ' ha leído un carácter: queda en $v0 (' + num(R1[2]) + ').', nm + ' has read a character into $v0 (' + num(R1[2]) + ').');
        else if (sv === 8) say = T(nm + ' ha guardado el texto leído en la dirección de $a0 (0x' + hex(R0[4]) + '), como mucho $a1 − 1 = ' + ((R0[5] | 0) - 1) + ' caracteres.', nm + ' has stored the text read at the address in $a0 (0x' + hex(R0[4]) + '), at most $a1 − 1 = ' + ((R0[5] | 0) - 1) + ' characters.');
        else if (sv === 9) say = T(nm + ' reserva ' + num(R0[4]) + ' bytes de memoria dinámica: la dirección queda en $v0 (0x' + hex(R1[2]) + ').', nm + ' reserves ' + num(R0[4]) + ' bytes of dynamic memory: the address is in $v0 (0x' + hex(R1[2]) + ').');
        else if (sv === 10 || sv === 17) say = T(nm + ' termina el programa.', nm + ' ends the program.');
        else say = T(nm + '.', nm + '.');
        short = NM[sv] || 'syscall'; break;
    }
    // las pseudoinstrucciones: se dicen con sus palabras y, si son varias, en qué parte vamos
    if (!startup && pseudo && src) {
      var who = '«' + src + '»';
      if (total === 1) {
        if (sMn === 'li') say = T('li carga el número ' + num(R1[regNum(src.split(/[\s,]+/)[1])]) + ' en ' + src.split(/[\s,]+/)[1] + '.', 'li loads the number ' + num(R1[regNum(src.split(/[\s,]+/)[1])]) + ' into ' + src.split(/[\s,]+/)[1] + '.');
        else if (sMn === 'la') { var lr = src.split(/[\s,]+/); say = T('la carga en ' + lr[1] + ' la dirección de ' + lr[2] + ': 0x' + hex(R1[regNum(lr[1])]) + ' (la dirección, no lo que hay dentro).', 'la loads into ' + lr[1] + ' the address of ' + lr[2] + ': 0x' + hex(R1[regNum(lr[1])]) + ' (the address, not what is inside).'); short = T('dirección de ', 'address of ') + lr[2]; }
        else if (sMn === 'move') { var mr = src.split(/[\s,]+/); say = T('move copia ' + mr[2] + ' en ' + mr[1] + ': ahora vale ' + num(R1[regNum(mr[1])]) + '.', 'move copies ' + mr[2] + ' into ' + mr[1] + ': it is now ' + num(R1[regNum(mr[1])]) + '.'); short = T('copia ', 'copies ') + mr[2]; }
        else say = T(who + ' es una pseudoinstrucción; SPIM la hace con ' + mn + '. ', who + ' is a pseudoinstruction; SPIM runs it as ' + mn + '. ') + say;
      } else {
        if (mn === 'lui') say = T('lui prepara la mitad alta de la dirección (0x' + hex(R1[ri(0)] >>> 16, 4) + ') en ' + R(0) + ', el registro reservado para el ensamblador.', 'lui prepares the upper half of the address (0x' + hex(R1[ri(0)] >>> 16, 4) + ') in ' + R(0) + ', the register reserved for the assembler.');
        else if (sMn === 'la' && mn === 'ori') { var lr2 = src.split(/[\s,]+/); say = T('ori añade la mitad baja (' + parseInt(o[2], 10) + '): ' + R(0) + ' = 0x' + hex(R1[ri(0)]) + ', la dirección de ' + lr2[2] + '.', 'ori adds the lower half (' + parseInt(o[2], 10) + '): ' + R(0) + ' = 0x' + hex(R1[ri(0)]) + ', the address of ' + lr2[2] + '.'); short = T('dirección de ', 'address of ') + lr2[2]; }
        say = T('Parte ' + part + ' de ' + total + ' de ' + who + ' (una pseudoinstrucción): ', 'Part ' + part + ' of ' + total + ' of ' + who + ' (a pseudoinstruction): ') + say;
      }
    }
    if (startup) {
      say = T('Arranque de SPIM (no es tu código): prepara argc y argv y llama a main con jal, como QtSpim.', "SPIM's start-up code (not yours): it sets up argc and argv and calls main with jal, like QtSpim.");
      short = T('arranque de SPIM', 'SPIM start-up');
    }
    if (!say) { say = (ctx.desc && ctx.desc[mn]) ? mn + ': ' + ctx.desc[mn] + '.' : T('Instrucción ejecutada: ', 'Instruction executed: ') + row.ins + '.'; short = mn; }

    // «Explícamelo con calma»: el formato, los campos del código máquina y lo que ha cambiado
    var calm = [], w = parseInt(row.enc || '0', 16) >>> 0, op = w >>> 26, rs = (w >>> 21) & 31, rt = (w >>> 16) & 31, rd = (w >>> 11) & 31, sa = (w >>> 6) & 31, fn = w & 63, im = w & 0xffff;
    var type = (op === 0) ? 'R' : (op === 2 || op === 3) ? 'J' : (op === 0x11 ? 'FR' : 'I');
    if (pseudo && src) calm.push(T(who + ' es una pseudoinstrucción: no existe en el procesador. SPIM la traduce a ' + total + (total > 1 ? ' instrucciones' : ' instrucción') + ' de verdad; esta es ' + row.ins.replace(/\s*\[.*$/, '') + '.', who + ' is a pseudoinstruction: the processor does not have it. SPIM turns it into ' + total + ' real instruction' + (total > 1 ? 's' : '') + '; this one is ' + row.ins.replace(/\s*\[.*$/, '') + '.'));
    if (ctx.desc && ctx.desc[mn]) calm.push(T(mn + ' (tipo ' + type + '): ', mn + ' (type ' + type + '): ') + ctx.desc[mn] + '.');
    if (row.enc && type !== 'FR') {
      var f = type === 'R' ? 'op ' + bin(op, 6) + ' · rs ' + bin(rs, 5) + ' (' + RN(rs) + ') · rt ' + bin(rt, 5) + ' (' + RN(rt) + ') · rd ' + bin(rd, 5) + ' (' + RN(rd) + ') · shamt ' + bin(sa, 5) + ' (' + sa + ') · funct ' + bin(fn, 6) + ' (' + fn + ')'
        : type === 'J' ? 'op ' + bin(op, 6) + ' (' + op + ') · ' + T('dirección ', 'target ') + bin(w & 0x3ffffff, 26) + T(' (×4 → 0x', ' (×4 → 0x') + hex(((w & 0x3ffffff) << 2) >>> 0) + ')'
        : 'op ' + bin(op, 6) + ' (' + op + ') · rs ' + bin(rs, 5) + ' (' + RN(rs) + ') · rt ' + bin(rt, 5) + ' (' + RN(rt) + ') · ' + T('inmediato ', 'immediate ') + bin(im, 16) + ' (' + ((im << 16) >> 16) + ')';
      calm.push(T('Código máquina 0x' + row.enc + ': ', 'Machine code 0x' + row.enc + ': ') + f + '.');
    }
    var ch = [];
    for (var r = 1; r < 32; r++) if ((R0[r] | 0) !== (R1[r] | 0)) ch.push(RN(r) + ' ' + num(R0[r]) + ' → ' + num(R1[r]));
    if ((R0[32] | 0) !== (R1[32] | 0)) ch.push('HI ' + num(R0[32]) + ' → ' + num(R1[32]));
    if ((R0[33] | 0) !== (R1[33] | 0)) ch.push('LO ' + num(R0[33]) + ' → ' + num(R1[33]));
    ch.push('PC 0x' + hex(b.pc) + ' → 0x' + hex(a.pc) + (taken && !/^(syscall)$/.test(mn) ? T(' (salto)', ' (jump)') : ''));
    calm.push(T('Cambia: ', 'Changes: ') + ch.join(' · ') + '.');
    return { mn: mn, short: short, say: say, calm: calm, src: src || row.ins, startup: !!startup };
  }
  G.SLMExplica = explain;
  G.SLMParseIns = parseIns;
  if (typeof module !== 'undefined') module.exports = { explain: explain, parseIns: parseIns };
})(typeof self !== 'undefined' ? self : globalThis);
