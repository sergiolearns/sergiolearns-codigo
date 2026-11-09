/* SergioLearns — interfaz del codificador de instrucciones MIPS (.sl-sim[data-sim="codifica"]). Necesita kit.js y engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, S$ = window.SLIsa, hex = S$.hex;
  var FC = { op: '#5B4BDB', rs: '#2F5FD0', rt: '#16794B', rd: '#FF6B4A', sh: '#8E8AA3', fn: '#F5A524', im: '#D9651C', dst: '#C2362B' };
  var LAY = { R: [['op', 6], ['rs', 5], ['rt', 5], ['rd', 5], ['sh', 5], ['fn', 6]], I: [['op', 6], ['rs', 5], ['rt', 5], ['im', 16]], J: [['op', 6], ['dst', 26]] };
  var EX = {
    es: [
      { k: 'taq', n: 'La taquilla del tren (tema 9)', b: '0x00400000', s: 'vende:  lw   $t0, 8($s0)\n        sub  $t0, $t0, $a0\n        sw   $t0, 8($s0)\n        beq  $t0, $zero, lleno\n        j    vende\nlleno:  sll  $zero, $zero, 0' },
      { k: 'com', n: 'La cuenta de la mesa 3 (tema 8)', b: '0x00400024', s: 'cuenta: lw   $t1, 0($a0)\n        addi $a0, $a0, 4\n        add  $v0, $v0, $t1\n        addi $a1, $a1, -1\n        bne  $a1, $zero, cuenta\n        jr   $ra' },
      { k: 'ex', n: 'Rutina con saltos adelante y atrás', b: '0x00400100', s: 'inicio: addi $t0, $zero, 10\notra:   lw   $t1, 0($s0)\n        slt  $t2, $t1, $t0\n        beq  $t2, $zero, salta\n        sw   $t1, 4($s0)\nsalta:  addi $s0, $s0, 8\n        addi $t0, $t0, -1\n        bne  $t0, $zero, otra\n        j    inicio' }
    ],
    en: [
      { k: 'taq', n: 'The train ticket office (topic 9)', b: '0x00400000', s: 'sell:   lw   $t0, 8($s0)\n        sub  $t0, $t0, $a0\n        sw   $t0, 8($s0)\n        beq  $t0, $zero, full\n        j    sell\nfull:   sll  $zero, $zero, 0' },
      { k: 'com', n: 'The bill for table 3 (topic 8)', b: '0x00400024', s: 'bill:   lw   $t1, 0($a0)\n        addi $a0, $a0, 4\n        add  $v0, $v0, $t1\n        addi $a1, $a1, -1\n        bne  $a1, $zero, bill\n        jr   $ra' },
      { k: 'ex', n: 'Routine with forward and backward branches', b: '0x00400100', s: 'start:  addi $t0, $zero, 10\nagain:  lw   $t1, 0($s0)\n        slt  $t2, $t1, $t0\n        beq  $t2, $zero, skip\n        sw   $t1, 4($s0)\nskip:   addi $s0, $s0, 8\n        addi $t0, $t0, -1\n        bne  $t0, $zero, again\n        j    start' }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'codifica', cmdD: 'decodifica', oB: '--desde', file: 'rutina.s', fileD: 'palabras.hex',
      modeL: 'Modo', mode: ['Ensamblador → hex', 'Hex → ensamblador'], convL: 'Saltos', conv: { apuntes: 'Apuntes (PC + 4)', qtspim: 'QtSpim (PC)' },
      convT: { apuntes: 'Convención de los apuntes y del examen: el desplazamiento de beq y bne cuenta desde PC + 4.', qtspim: 'Como QtSpim sin saltos retardados: el desplazamiento cuenta desde el propio salto, una unidad más que con los apuntes.' },
      ex: 'Ejemplo', share: 'Compartir', base: 'Dirección de la primera instrucción', prog: 'Instrucciones (con sus etiquetas)', words: 'Palabras en hexadecimal (una por línea)', baseBad: 'Escribe una dirección en hexadecimal, múltiplo de 4 (por ejemplo 0x00400000).',
      steps: 'instrucción a instrucción', tbl: 'la rutina en hexadecimal', tblD: 'las palabras traducidas', start: 'Pulsa Paso para codificar la rutina instrucción a instrucción, o pulsa una fila de la tabla.',
      th: { pc: 'dirección', lab: 'etiqueta', ins: 'instrucción', f: 'formato', w: 'hexadecimal' }, fmt: 'formato {f}',
      fn: { op: 'op', rs: 'rs', rt: 'rt', rd: 'rd', sh: 'shamt', fn: 'funct', im: 'inmediato', dst: 'dirección' },
      err: { reg: 'registro desconocido: {x}', num: 'número no válido: {x}', imms: 'el inmediato {x} no cabe en 16 bits con signo (−32768 a 32767)', immu: 'el inmediato {x} no cabe en 16 bits sin signo (0 a 65535)', sh: 'shamt va de 0 a 31: {x}', args: 'número de operandos incorrecto (espera {x})', lab: 'la etiqueta {x} no existe', align: 'la dirección {x} no es múltiplo de 4', far: 'el salto a {x} no cabe en 16 bits', region: '{x} está fuera de los 256 MB de PC + 4: j no llega', mem: 'se esperaba desplazamiento($registro): {x}', op: 'instrucción desconocida o pseudoinstrucción: {x}', fnD: 'funct desconocido', opD: 'código de operación desconocido', hex: 'no es una palabra de 32 bits en hexadecimal' },
      e: {
        R: 'Formato R: op = 0 y la operación la dice funct = {fn} ({m}).', I: 'Formato I: op = {op} ({m}).', J: 'Formato J: op = {op} ({m}).',
        regs: 'Registros: {list}.', dest: 'destino', src: 'fuente', base: 'base',
        sh: 'shamt = {sh}: los bits que desplaza.', shz: 'shamt = 0 (solo lo usan los desplazamientos).',
        imm: 'Inmediato = {v} → en 16 bits{c} = {h}.', c2: ' (complemento a 2)', mem: 'Desplazamiento = {v} → {h}: la dirección será {rs} + {v}.',
        br: 'El inmediato cuenta instrucciones: (destino − {from}) ÷ 4 = ({tg} − {fv}) ÷ 4 = {d} ÷ 4 = {off} → en 16 bits = {h}.', brQ: ' QtSpim cuenta desde el propio salto: una unidad más que los apuntes.', brA: ' {fromN} porque, cuando el salto se ejecuta, el PC ya apunta a la siguiente.',
        j: 'Destino {lab} = {tg}. Se quitan los 2 bits de abajo (siempre 00) y los 4 de arriba (los pone PC + 4): {tg} ÷ 4 = {q} → 26 bits = {h}.',
        join: 'Se juntan los campos: {bits}', nib: 'Por grupos de 4: {nib} = {w}.',
        dR: 'op = 0 → formato R; funct = {fn} → {m}.', dI: 'op = {op} → {m}, formato I.', dJ: 'op = {op} → {m}, formato J.', dbr: 'Inmediato {h} = {v} instrucciones → destino = {from} + {v} × 4 = {tg}.', dj: 'Destino = 4 bits de arriba de PC + 4 ({hi}) + dirección × 4 = {tg}.', dres: 'Resultado: {txt}.'
      },
      rules: 'Codifica las instrucciones reales de MIPS32 que salen en IC1 (no las pseudoinstrucciones como li, la o move). Registros por nombre ($t0) o número ($8). Inmediatos en decimal o en hexadecimal (0x…). Saltos condicionales relativos al PC y j/jal pseudodirectos, como en los apuntes. Comprobado con el ensamblador de SPIM, el núcleo de QtSpim.',
      reto: 'Reto: codifica y decodifica tú', retoLead: 'Como la cuestión del examen: pasa la instrucción a hexadecimal (o la palabra a instrucción) en papel y escribe el resultado.', retoE: 'Pasa a hexadecimal la instrucción de la dirección {pc}:', retoD: 'Escribe la instrucción que hay en la dirección {pc} (si es un salto, con la dirección de destino en hexadecimal):', retoLabs: 'Etiquetas: {l}.', ansE: 'hexadecimal', ansD: 'instrucción',
      allOk: 'Bien. Así se hace en el examen.', bad: 'No es eso. Lo más común: el orden rs, rt de la instrucción frente al de los campos, o el desplazamiento de un salto contado desde el propio salto en lugar de desde PC + 4.'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'encode', cmdD: 'decode', oB: '--from', file: 'routine.s', fileD: 'words.hex',
      modeL: 'Mode', mode: ['Assembly → hex', 'Hex → assembly'], convL: 'Branches', conv: { apuntes: 'Notes (PC + 4)', qtspim: 'QtSpim (PC)' },
      convT: { apuntes: 'Convention of the course notes and the exam: the offset of beq and bne counts from PC + 4.', qtspim: 'Like QtSpim without delayed branches: the offset counts from the branch itself, one more than with the notes.' },
      ex: 'Example', share: 'Share', base: 'Address of the first instruction', prog: 'Instructions (with their labels)', words: 'Words in hexadecimal (one per line)', baseBad: 'Type an address in hexadecimal, a multiple of 4 (for example 0x00400000).',
      steps: 'instruction by instruction', tbl: 'the routine in hexadecimal', tblD: 'the words translated', start: 'Press Step to encode the routine instruction by instruction, or tap a row of the table.',
      th: { pc: 'address', lab: 'label', ins: 'instruction', f: 'format', w: 'hexadecimal' }, fmt: '{f} format',
      fn: { op: 'op', rs: 'rs', rt: 'rt', rd: 'rd', sh: 'shamt', fn: 'funct', im: 'immediate', dst: 'address' },
      err: { reg: 'unknown register: {x}', num: 'invalid number: {x}', imms: 'immediate {x} does not fit in 16 signed bits (−32768 to 32767)', immu: 'immediate {x} does not fit in 16 unsigned bits (0 to 65535)', sh: 'shamt goes from 0 to 31: {x}', args: 'wrong number of operands (expects {x})', lab: 'label {x} does not exist', align: 'address {x} is not a multiple of 4', far: 'the branch to {x} does not fit in 16 bits', region: '{x} is outside the 256 MB of PC + 4: j cannot reach it', mem: 'offset($register) expected: {x}', op: 'unknown instruction or pseudo-instruction: {x}', fnD: 'unknown funct', opD: 'unknown opcode', hex: 'not a 32-bit word in hexadecimal' },
      e: {
        R: 'R format: op = 0 and funct = {fn} says the operation ({m}).', I: 'I format: op = {op} ({m}).', J: 'J format: op = {op} ({m}).',
        regs: 'Registers: {list}.', dest: 'destination', src: 'source', base: 'base',
        sh: 'shamt = {sh}: the number of bits shifted.', shz: 'shamt = 0 (only shifts use it).',
        imm: 'Immediate = {v} → in 16 bits{c} = {h}.', c2: ' (two’s complement)', mem: 'Offset = {v} → {h}: the address will be {rs} + {v}.',
        br: 'The immediate counts instructions: (target − {from}) ÷ 4 = ({tg} − {fv}) ÷ 4 = {d} ÷ 4 = {off} → in 16 bits = {h}.', brQ: ' QtSpim counts from the branch itself: one more than the notes.', brA: ' {fromN} because, when the branch executes, the PC already points to the next one.',
        j: 'Target {lab} = {tg}. The 2 low bits (always 00) and the 4 high bits (PC + 4 provides them) are dropped: {tg} ÷ 4 = {q} → 26 bits = {h}.',
        join: 'The fields are joined: {bits}', nib: 'In groups of 4: {nib} = {w}.',
        dR: 'op = 0 → R format; funct = {fn} → {m}.', dI: 'op = {op} → {m}, I format.', dJ: 'op = {op} → {m}, J format.', dbr: 'Immediate {h} = {v} instructions → target = {from} + {v} × 4 = {tg}.', dj: 'Target = top 4 bits of PC + 4 ({hi}) + address × 4 = {tg}.', dres: 'Result: {txt}.'
      },
      rules: 'Encodes the real MIPS32 instructions used in IC1 (not pseudo-instructions such as li, la or move). Registers by name ($t0) or number ($8). Immediates in decimal or hexadecimal (0x…). PC-relative conditional branches and pseudo-direct j/jal, as in the course notes. Checked against the SPIM assembler, the core of QtSpim.',
      reto: 'Challenge: encode and decode yourself', retoLead: 'Like the exam question: turn the instruction into hexadecimal (or the word into an instruction) on paper and type the result.', retoE: 'Turn the instruction at address {pc} into hexadecimal:', retoD: 'Write the instruction at address {pc} (if it is a branch, with the target address in hexadecimal):', retoLabs: 'Labels: {l}.', ansE: 'hexadecimal', ansD: 'instruction',
      allOk: 'Correct. That is how it is done in the exam.', bad: 'Not quite. The most common slips: the rs, rt order of the instruction versus the order of the fields, or a branch offset counted from the branch itself instead of from PC + 4.'
    }
  };
  function bin(v, n) { return ((v >>> 0) & (n === 32 ? 0xFFFFFFFF : (1 << n) - 1)).toString(2).padStart(n, '0'); }
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, exs = EX[L];
    K.title = t.title;
    var S = { m: 'e', c: 'apuntes', b: exs[0].b, s: exs[0].s, h: '', ex: 'taq' }, A = null, sel = -1;
    (function () {
      var s = K6.hashState() || K6.store('sl_sim_codifica_' + (document.documentElement.lang || '').slice(0, 2)); if (!s) return;
      try { var o = JSON.parse(s); if (typeof o.s === 'string' && o.s.length < 4000) { S.m = o.m === 'd' ? 'd' : 'e'; S.c = o.c === 'q' ? 'qtspim' : 'apuntes'; S.b = String(o.b || '0x00400000').slice(0, 12); S.s = o.s; S.h = String(o.h || '').slice(0, 2000); S.ex = o.ex || ''; } } catch (e) {}
    })();
    var enc = function () { return JSON.stringify({ m: S.m, c: S.c === 'qtspim' ? 'q' : 'a', b: S.b, s: S.s, h: S.h, ex: S.ex }); };
    var exOpts = exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('');
    var ctl = '<div class="sl6-ctl"><div class="sl6-seg" role="group" aria-label="' + esc(t.modeL) + '"><button type="button" data-m="e">' + esc(t.mode[0]) + '</button><button type="button" data-m="d">' + esc(t.mode[1]) + '</button></div>'
      + '<div class="sl6-seg" role="group" aria-label="' + esc(t.convL) + '"><span class="sl6-seg__l">' + esc(t.convL) + '</span><button type="button" data-c="apuntes" title="' + esc(t.convT.apuntes) + '">' + esc(t.conv.apuntes) + '</button><button type="button" data-c="qtspim" title="' + esc(t.convT.qtspim) + '">' + esc(t.conv.qtspim) + '</button></div>'
      + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exOpts + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl + '<p class="sl6-desc"></p>'
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h sl6-co-fn">── ' + esc(t.file) + '</h3><label class="sl6-lbl" for="' + K.id + '-b">' + esc(t.base) + '</label><input type="text" id="' + K.id + '-b" class="sl6-co-b" spellcheck="false" autocomplete="off"><p class="sl6-help sl6-co-bh" hidden>' + esc(t.baseBad) + '</p>'
      + '<label class="sl6-lbl sl6-co-pl" for="' + K.id + '-ed" style="margin-top:12px">' + esc(t.prog) + '</label><textarea id="' + K.id + '-ed" class="sl6-ed" rows="10" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off"></textarea></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-co-card"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h sl6-co-th">── ' + esc(t.tbl) + '</h3><div class="sl6-res sl6-co-t"></div></section>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var ed = q('.sl6-ed'), bIn = q('.sl6-co-b');
    bIn.value = S.b; ed.value = S.m === 'd' ? S.h : S.s;
    function rn(i) { return S$.REG[i] + ' = ' + i; }
    function fieldVal(f, k) { return f[k]; }
    function boxes(f, w) {
      return '<div class="sl6-co-fs">' + LAY[f.fmt].map(function (x) {
        var k = x[0], v = fieldVal(f, k), lab = k === 'rs' || k === 'rt' || k === 'rd' ? S$.REG[v] : (k === 'im' ? (f.calc || /^(addi|addiu|slti|sltiu|lw|lb|lh|lbu|lhu|sw|sb|sh)$/.test(f.m) ? String(S$.sx(v)) : hex(v, 4)) : (k === 'dst' ? hex(v, 7) : (k === 'fn' || k === 'op' ? hex(v, 2) : String(v))));
        return '<div class="sl6-co-f" style="--c:' + FC[k] + ';flex:' + x[1] + ' 1 0"><span class="sl6-co-fl">' + esc(t.fn[k]) + ' · ' + x[1] + '</span><code>' + bin(v, x[1]) + '</code><b>' + esc(lab) + '</b></div>';
      }).join('') + '</div><p class="sl6-co-hex">' + bin(w, 32).replace(/(.{4})(?!$)/g, '$1 ') + ' <span>=</span> <b>' + hex(w) + '</b></p>';
    }
    function explainE(r) {
      var f = r.f, E = t.e, out = [], m = f.m;
      if (m === 'nop') { out.push(fill(E.R, { fn: '0x00', m: 'sll' })); }
      else if (f.fmt === 'R') out.push(fill(E.R, { fn: hex(f.fn, 2), m: m }));
      else out.push(fill(f.fmt === 'I' ? E.I : E.J, { op: f.op + ' = ' + hex(f.op, 2), m: m }));
      var regs = [], role = S$.R[m] ? S$.R[m][1] : (S$.I[m] ? S$.I[m][1] : '');
      if (f.fmt === 'R' && m !== 'nop' && m !== 'syscall') {
        if (role === 'dst' || role === 'sh' || role === 'shv' || role === 'd' || role === 'jalr') regs.push('rd = ' + rn(f.rd) + ' (' + E.dest + ')');
        if (role === 'dst' || role === 'shv' || role === 'rs' || role === 'st' || role === 'jalr') regs.push('rs = ' + rn(f.rs));
        if (role === 'dst' || role === 'sh' || role === 'shv' || role === 'st') regs.push('rt = ' + rn(f.rt));
      } else if (f.fmt === 'I') {
        if (role === 'ari' || role === 'lui' || (role === 'mem' && /^l/.test(m))) regs.push('rt = ' + rn(f.rt) + ' (' + E.dest + ')');
        if (role === 'mem' && /^s/.test(m)) regs.push('rt = ' + rn(f.rt) + ' (' + E.src + ')');
        if (role === 'ari') regs.push('rs = ' + rn(f.rs));
        if (role === 'mem') regs.push('rs = ' + rn(f.rs) + ' (' + E.base + ')');
        if (role === 'br' || role === 'br1') { regs.push('rs = ' + rn(f.rs)); if (role === 'br') regs.push('rt = ' + rn(f.rt)); else regs.push('rt = ' + f.rt); }
      }
      if (regs.length) out.push(fill(E.regs, { list: regs.join(', ') }));
      if (f.fmt === 'R' && m !== 'nop') out.push(f.sh ? fill(E.sh, { sh: f.sh }) : E.shz);
      if (f.fmt === 'I') {
        var v = S$.sx(f.im);
        if (f.calc && f.calc.k === 'br') {
          var c = f.calc, d = c.tg - c.from;
          out.push(fill(E.br, { from: S.c === 'qtspim' ? 'PC' : 'PC + 4', tg: hex(c.tg), fv: hex(c.from), d: d, off: c.off, h: hex(f.im, 4) }) + (S.c === 'qtspim' ? E.brQ : fill(E.brA, { fromN: 'PC + 4' })));
        } else if (role === 'mem') out.push(fill(E.mem, { v: v, h: hex(f.im, 4), rs: S$.REG[f.rs] }));
        else out.push(fill(E.imm, { v: role === 'ari' && S$.I[m][2] ? v : f.im, c: v < 0 && S$.I[m][2] ? E.c2 : '', h: hex(f.im, 4) }));
      }
      if (f.fmt === 'J') out.push(fill(E.j, { lab: f.calc.lab, tg: hex(f.calc.tg), q: hex(f.calc.tg >>> 2, 7), h: hex(f.dst, 7) }));
      var bits = LAY[f.fmt].map(function (x) { return '<span style="color:' + FC[x[0]] + '">' + bin(f[x[0]], x[1]) + '</span>'; }).join(' ');
      out.push(fill(E.join, { bits: '<code class="sl6-co-bits">' + bits + '</code>' }));
      out.push(fill(E.nib, { nib: '<code class="sl6-co-bits">' + bin(r.w, 32).replace(/(.{4})(?!$)/g, '$1 ') + '</code>', w: '<b>' + hex(r.w) + '</b>' }));
      return out;
    }
    function explainD(r) {
      var d = r.d, f = d.f, E = t.e, out = [];
      if (f.fmt === 'R') out.push(fill(E.dR, { fn: hex(f.fn, 2), m: d.m }));
      else out.push(fill(f.fmt === 'I' ? E.dI : E.dJ, { op: hex(f.op, 2), m: d.m }));
      if (d.tg != null && f.fmt === 'I') out.push(fill(E.dbr, { h: hex(f.im, 4), v: S$.sx(f.im), from: S.c === 'qtspim' ? hex(r.pc) : hex(r.pc + 4), tg: hex(d.tg) }));
      if (f.fmt === 'J') out.push(fill(E.dj, { hi: hex(((r.pc + 4) & 0xF0000000) >>> 0).slice(0, 3), tg: hex(d.tg) }));
      out.push(fill(E.dres, { txt: '<b class="sl6-pp-i">' + esc(d.txt) + '</b>' }));
      return out;
    }
    function errTxt(r) { return fill(t.err[r.err] || t.err.op, { x: r.x == null ? '' : r.x }); }
    function card(k) {
      var c = q('.sl6-co-card');
      if (!A || k < 0 || !A.rows[k]) { c.innerHTML = '<p class="sl6-co-0">' + esc(t.start) + '</p>'; return; }
      var r = A.rows[k];
      if (r.err) { c.innerHTML = '<p class="sl6-co-ins"><span>' + hex(r.pc) + '</span> <b>' + esc(S.m === 'd' ? r.src : r.src) + '</b></p><p class="sl6-help is-bad">' + esc(errTxt(r)) + '</p>'; return; }
      var f = S.m === 'd' ? r.d.f : r.f, list = S.m === 'd' ? explainD(r) : explainE(r);
      c.innerHTML = '<p class="sl6-co-ins"><span>' + hex(r.pc) + '</span> <b>' + esc(S.m === 'd' ? r.d.txt : r.src) + '</b> <em>' + esc(fill(t.fmt, { f: f.fmt })) + '</em></p>' + boxes(f, r.w)
        + '<ol class="sl6-co-ex">' + list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
    }
    function tableH() {
      var th = t.th, h = '<table class="sl6-co-tt"><thead><tr><th>' + esc(th.pc) + '</th>' + (S.m === 'e' ? '<th>' + esc(th.lab) + '</th>' : '') + '<th>' + esc(th.ins) + '</th><th>' + esc(th.f) + '</th><th>' + esc(th.w) + '</th></tr></thead><tbody>';
      A.rows.forEach(function (r, i) {
        var ins = S.m === 'd' ? (r.err ? '—' : r.d.txt) : r.src, f = r.err ? '' : (S.m === 'd' ? r.d.f.fmt : r.f.fmt);
        h += '<tr class="sl6-co-r' + (i === sel ? ' is-on' : '') + (r.err ? ' is-err' : '') + '" data-row="' + i + '" tabindex="0"><td>' + hex(r.pc) + '</td>' + (S.m === 'e' ? '<td>' + esc(r.label || '') + '</td>' : '') + '<td class="sl6-co-l">' + esc(ins) + (r.err ? '<br><small>' + esc(errTxt(r)) + '</small>' : '') + '</td><td>' + f + '</td><td><b>' + (r.err ? (S.m === 'd' ? esc(r.src) : '—') : hex(r.w)) + '</b></td></tr>';
      });
      q('.sl6-co-t').innerHTML = h + '</tbody></table>';
    }
    K.N = function () { return A ? A.rows.length : 0; };
    K.draw = function (k, going) { sel = going ? k : -1; card(sel); [].forEach.call(K.qa('.sl6-co-r'), function (r) { r.classList.toggle('is-on', +r.getAttribute('data-row') === sel); }); };
    var PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('[data-m]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === S.m)); });
      [].forEach.call(K.qa('[data-c]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === S.c)); });
      q('.sl6-desc').textContent = t.convT[S.c];
      q('.sl6-co-fn').textContent = '── ' + (S.m === 'd' ? t.fileD : t.file);
      q('.sl6-co-pl').textContent = S.m === 'd' ? t.words : t.prog;
      q('.sl6-co-th').textContent = '── ' + (S.m === 'd' ? t.tblD : t.tbl);
      q('.sl6-cmdl').innerHTML = esc(S.m === 'd' ? t.cmdD : t.cmd) + ' <span class="o">' + esc(t.oB) + '</span> <b>' + esc(S.b) + '</b>' + (S.c === 'qtspim' ? ' <span class="o">--qtspim</span>' : '') + ' ' + esc(S.m === 'd' ? t.fileD : t.file);
    }
    function update() {
      var bv = /^\s*0x([0-9a-f]{1,8})\s*$/i.exec(bIn.value), base = bv ? parseInt(bv[1], 16) : NaN, okB = bv && base % 4 === 0;
      q('.sl6-co-bh').hidden = !!okB; bIn.classList.toggle('is-bad', !okB);
      if (!okB) return;
      S.b = bIn.value.trim();
      if (S.m === 'e') { S.s = ed.value; A = S$.assemble(ed.value.split('\n'), base, S.c); }
      else {
        S.h = ed.value; var pc = base >>> 0, rows = [];
        ed.value.split('\n').forEach(function (l) {
          var s = l.replace(/#.*/, '').trim(); if (!s) return;
          var m = /^(0x)?([0-9a-f]{8})$/i.exec(s.replace(/\s+/g, '')), r = { pc: pc, src: s };
          if (!m) { r.err = 'hex'; } else { r.w = parseInt(m[2], 16) >>> 0; r.d = S$.decode(r.w, pc, S.c); if (r.d.err) { r.err = r.d.err === 'fn' ? 'fnD' : 'opD'; } }
          rows.push(r); pc = (pc + 4) >>> 0;
        });
        A = { rows: rows.slice(0, 40), lab: {} };
      }
      sync(); tableH(); PL.reset(); card(-1);
      K6.store('sl_sim_codifica_' + (document.documentElement.lang || '').slice(0, 2), enc()); K6.keepHash(enc());
    }
    function setMode(m) {
      if (m === S.m) return;
      if (m === 'd' && A && S.m === 'e') { var ws = A.rows.filter(function (r) { return !r.err; }).map(function (r) { return hex(r.w); }); if (ws.length) S.h = ws.join('\n'); S.s = ed.value; }
      S.m = m; ed.value = m === 'd' ? S.h : S.s; update();
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-m],[data-c],[data-a],[data-row]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-m')) setMode(b.getAttribute('data-m'));
      else if (b.hasAttribute('data-c')) { S.c = b.getAttribute('data-c'); update(); }
      else if (b.hasAttribute('data-row')) { var i = +b.getAttribute('data-row'); PL.stop(); K.el.classList.add('is-going'); PL.k = i; PL.going = true; PL.draw(); }
      else { var a = b.getAttribute('data-a'); if (a === 'share') K6.share(K, b, enc()); else if (a === 'theme') K6.toggleTheme(K); }
    });
    el.addEventListener('keydown', function (e) { var r = e.target.closest && e.target.closest('[data-row]'); if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); r.click(); } });
    ed.addEventListener('input', function () { S.ex = ''; q('.sl6-sel').value = ''; update(); });
    bIn.addEventListener('input', update);
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.s = x.s; bIn.value = x.b; if (S.m === 'd') S.m = 'e'; ed.value = x.s; update();
    });
    q('.sl6-sel').value = S.ex;
    // reto
    var RT = null;
    function rr() { var R = ['$t0', '$t1', '$t2', '$t3', '$s0', '$s1', '$s2', '$a0', '$v0', '$zero', '$ra', '$sp']; return R[Math.floor(Math.random() * R.length)]; }
    function retoNew() {
      var pc = 0x00400000 + 4 * Math.floor(Math.random() * 64), k = Math.random(), ins, labs = {}, lt = '';
      var n = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
      if (k < .25) ins = ['add', 'sub', 'and', 'or', 'slt', 'nor'][n(0, 5)] + ' ' + rr() + ', ' + rr() + ', ' + rr();
      else if (k < .45) ins = ['addi', 'slti'][n(0, 1)] + ' ' + rr() + ', ' + rr() + ', ' + n(-40, 100);
      else if (k < .65) ins = ['lw', 'sw'][n(0, 1)] + ' ' + rr() + ', ' + 4 * n(-4, 12) + '(' + rr() + ')';
      else if (k < .85) { var tg = (pc + 4 * n(-8, 8)) >>> 0; labs[L === 'es' ? 'destino' : 'target'] = tg; ins = ['beq', 'bne'][n(0, 1)] + ' ' + rr() + ', ' + rr() + ', ' + (L === 'es' ? 'destino' : 'target'); lt = fill(t.retoLabs, { l: (L === 'es' ? 'destino' : 'target') + ' = ' + hex(tg) }); }
      else { var tj = (0x00400000 + 4 * n(0, 200)) >>> 0; labs.main = tj; ins = ['j', 'jal'][n(0, 1)] + ' main'; lt = fill(t.retoLabs, { l: 'main = ' + hex(tj) }); }
      var f = S$.enc(ins, pc, labs, 'apuntes'), w = S$.word(f), dec = Math.random() < .35 && !f.calc;
      RT = { pc: pc, ins: ins, w: w, dec: dec, labs: labs };
      var box = q('.sl6-reto');
      box.innerHTML = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-lbl">' + esc(fill(dec ? t.retoD : t.retoE, { pc: hex(pc) })) + '</p><pre class="sl6-pp-code">' + esc(dec ? hex(w) : ins) + '</pre>' + (lt ? '<p class="sl6-help" style="margin-top:-6px">' + esc(lt) + '</p>' : '')
        + '<div class="sl6-pp-rq"><label><span>' + esc(dec ? t.ansD : t.ansE) + '</span><input type="text" data-rq="a" spellcheck="false" autocomplete="off" style="max-width:320px"></label></div>'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-r="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-r="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-r="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-r]'); if (!b) return; var a = b.getAttribute('data-r');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var i = q('[data-rq="a"]'), v = i.value.trim(), ok = false;
        if (RT.dec) { try { ok = S$.word(S$.enc(v.replace(/\s+/g, ' '), RT.pc, {}, 'apuntes')) === RT.w; } catch (x) { ok = false; } }
        else { var m = /^(0x)?([0-9a-f]{8})$/i.exec(v.replace(/\s+/g, '')); ok = !!m && (parseInt(m[2], 16) >>> 0) === RT.w; }
        i.classList.toggle('is-ok', ok); i.classList.toggle('is-bad', !ok);
        q('.sl6-reto__msg').innerHTML = ok ? '<b>' + esc(t.allOk) + '</b>' : esc(t.bad);
      } else if (a === 'sol') {
        S.c = 'apuntes'; S.ex = ''; q('.sl6-sel').value = ''; bIn.value = hex(RT.pc);
        if (RT.dec) { S.m = 'd'; S.h = hex(RT.w); ed.value = S.h; }
        else { S.m = 'e'; var k0 = Object.keys(RT.labs)[0]; S.s = k0 ? RT.ins.replace(new RegExp('\\b' + k0 + '$'), hex(RT.labs[k0])) : RT.ins; ed.value = S.s; }
        update(); var idx = A.rows.findIndex(function (r) { return r.pc === RT.pc; }); if (idx >= 0) { K.el.classList.add('is-going'); PL.k = idx; PL.going = true; PL.draw(); }
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    update(); retoNew();
  }
  K6.boot('.sl-sim[data-sim="codifica"]', init);
})();
