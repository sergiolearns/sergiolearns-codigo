/* SergioLearns — interfaz de la ruta de datos monociclo (.sl-sim[data-sim="ruta"]). Necesita kit.js, codifica/engine.js (SLIsa),
 * ruta/engine.js (SLRuta) y ruta/draw.js (SLRutaDraw). */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, I$ = window.SLIsa, R$ = window.SLRuta, D$ = window.SLRutaDraw, hex = I$.hex;
  var MODS = ['addi', 'slti', 'bne', 'jal'];
  var EX = {
    es: [
      { k: 'cinco', n: 'Una de cada: lw, add, sw, beq y j', m: '', b: '0x00400000', i: '$s0 = 0x10010000\nM[0x10010000] = 25\nM[0x10010004] = 17', s: 'inicio: lw   $t0, 0($s0)\n        lw   $t1, 4($s0)\n        add  $t2, $t0, $t1\n        sw   $t2, 8($s0)\n        beq  $t2, $zero, inicio\n        j    fin\nfin:    sub  $t3, $t2, $t0' },
      { k: 'taq', n: 'La taquilla del tren (tema 9)', m: '', b: '0x00400000', i: '$s0 = 0x10010000\n$a0 = 4\nM[0x10010008] = 12      # plazas libres', s: 'vende:  lw   $t0, 8($s0)\n        sub  $t0, $t0, $a0\n        sw   $t0, 8($s0)\n        beq  $t0, $zero, lleno\n        j    vende\nlleno:  sll  $zero, $zero, 0' },
      { k: 'apr', n: 'Contar aprobados (addi, slti y bne)', m: 'addi,slti,bne', b: '0x00400000', i: '$s0 = 0x10010000\nM[0x10010000] = 7\nM[0x10010004] = 3\nM[0x10010008] = 9\nM[0x1001000C] = 5', s: '        addi $t0, $zero, 4      # notas que quedan\n        addi $v0, $zero, 0      # aprobados\notra:   lw   $t1, 0($s0)\n        slti $t2, $t1, 5\n        bne  $t2, $zero, sigue\n        addi $v0, $v0, 1\nsigue:  addi $s0, $s0, 4\n        addi $t0, $t0, -1\n        bne  $t0, $zero, otra' },
      { k: 'jal', n: 'Una subrutina con jal (Link)', m: 'addi,jal', b: '0x00400000', i: '$s0 = 0x10010000', s: 'main:   addi $a0, $zero, 6\n        jal  doble\nvuelta: sw   $v0, 0($s0)\n        j    fin\ndoble:  add  $v0, $a0, $a0\n        j    vuelta     # sería jr $ra: esta RD no tiene jr\nfin:    sll  $zero, $zero, 0' }
    ],
    en: [
      { k: 'cinco', n: 'One of each: lw, add, sw, beq and j', m: '', b: '0x00400000', i: '$s0 = 0x10010000\nM[0x10010000] = 25\nM[0x10010004] = 17', s: 'start:  lw   $t0, 0($s0)\n        lw   $t1, 4($s0)\n        add  $t2, $t0, $t1\n        sw   $t2, 8($s0)\n        beq  $t2, $zero, start\n        j    end\nend:    sub  $t3, $t2, $t0' },
      { k: 'taq', n: 'The train ticket office (topic 9)', m: '', b: '0x00400000', i: '$s0 = 0x10010000\n$a0 = 4\nM[0x10010008] = 12      # free seats', s: 'sell:   lw   $t0, 8($s0)\n        sub  $t0, $t0, $a0\n        sw   $t0, 8($s0)\n        beq  $t0, $zero, full\n        j    sell\nfull:   sll  $zero, $zero, 0' },
      { k: 'apr', n: 'Counting passes (addi, slti and bne)', m: 'addi,slti,bne', b: '0x00400000', i: '$s0 = 0x10010000\nM[0x10010000] = 7\nM[0x10010004] = 3\nM[0x10010008] = 9\nM[0x1001000C] = 5', s: '        addi $t0, $zero, 4      # marks left\n        addi $v0, $zero, 0      # passes\nagain:  lw   $t1, 0($s0)\n        slti $t2, $t1, 5\n        bne  $t2, $zero, ahead\n        addi $v0, $v0, 1\nahead:  addi $s0, $s0, 4\n        addi $t0, $t0, -1\n        bne  $t0, $zero, again' },
      { k: 'jal', n: 'A subroutine with jal (Link)', m: 'addi,jal', b: '0x00400000', i: '$s0 = 0x10010000', s: 'main:   addi $a0, $zero, 6\n        jal  twice\nback:   sw   $v0, 0($s0)\n        j    end\ntwice:  add  $v0, $a0, $a0\n        j    back       # would be jr $ra: this datapath has no jr\nend:    sll  $zero, $zero, 0' }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'ruta', oA: '--amplia', file: 'programa.s',
      modsL: 'Ampliaciones', modsT: { addi: 'addi: solo una fila más en la unidad de control (como lw, pero sin memoria)', slti: 'slti: ALUOp = 11 para que la ALU haga slt con el inmediato', bne: 'bne: señal BranchNE, una AND con Zero negado y una OR antes de PCSrc', jal: 'jal: señal Link y dos multiplexores: escribe PC + 4 en $ra (registro 31)' },
      ex: 'Ejemplo', share: 'Compartir', base: 'Dirección de la primera instrucción', prog: 'Programa (con sus etiquetas)', ini: 'Estado inicial: registros y memoria', iniH: 'Una línea por valor: $s0 = 0x10010000 · M[0x10010008] = 120. Lo demás empieza a 0.',
      baseBad: 'Escribe una dirección en hexadecimal, múltiplo de 4 (por ejemplo 0x00400000).',
      steps: 'ciclo a ciclo', diag: 'la ruta de datos', vals: 'valor de cada cable (los números del dibujo)', regs: 'registros y memoria al acabar el ciclo', time: 'tiempo de ciclo',
      start: 'Pulsa Paso para ejecutar la primera instrucción: cada paso es un ciclo de reloj. O pulsa una pieza del dibujo para ver qué hace.',
      cyc: 'ciclo {n}', tipo: { R: 'tipo R', lw: 'lw', sw: 'sw', beq: 'beq', j: 'j', bne: 'bne', jal: 'jal', slti: 'slti', addi: 'addi' },
      sigs: 'Señales de control', noch: 'Nada cambia: no se escribe ningún registro ni la memoria.', chR: '{r} ← {v}', chM: 'M[{a}] ← {v}',
      tap: 'Toca una pieza del dibujo para ver qué hace y qué valores tiene en este ciclo.', swipe: 'Desliza el dibujo a los lados para verlo entero.', now: 'En este ciclo: ',
      err: { reg: 'registro desconocido: {x}', num: 'número no válido: {x}', imms: 'el inmediato {x} no cabe en 16 bits con signo', immu: 'el inmediato {x} no cabe en 16 bits sin signo', sh: 'shamt va de 0 a 31: {x}', args: 'número de operandos incorrecto (espera {x})', lab: 'la etiqueta {x} no existe', align: 'la dirección {x} no es múltiplo de 4', far: 'el salto a {x} no cabe en 16 bits', region: '{x} está fuera de los 256 MB de PC + 4: j no llega', mem: 'se esperaba desplazamiento($registro): {x}', op: 'instrucción desconocida o pseudoinstrucción: {x}', rdno: '{x}: esta ruta de datos no la tiene (add, sub, and, or, nor, slt, lw, sw, beq y j; con ampliaciones, addi, slti, bne y jal)', rdext: '{x} necesita su ampliación: actívala arriba', line: 'no se entiende la línea: {x}' },
      errIni: 'Estado inicial, línea {n}: {e}',
      stop: { end: 'Fin: el siguiente PC ({pc}) ya no es una instrucción del programa.', limit: 'Se para a los 400 ciclos: ¿un bucle que no termina?', align: 'Se para: lw o sw con la dirección {x}, que no es múltiplo de 4 (en QtSpim saltaría una excepción).', empty: 'Escribe un programa.' },
      e: {
        f: 'Búsqueda: el PC vale {pc}; la memoria de instrucciones da {w} y el sumador calcula PC + 4 = {pc4}.',
        d: 'La unidad de control ve op = {op} ({t}) y pone las señales de su fila; el banco de registros lee rs = {rs} y rt = {rt}.',
        R: 'ALUSrc = 0: la ALU recibe {rsn} = {a} y {rtn} = {b}. ALUOp = 10 y funct = {fn} → {opn}: el resultado es {res}.',
        lw: 'La extensión de signo pasa el inmediato {im} a {ext}. ALUSrc = 1: la ALU suma la base {rsn} = {a} y {sim} → dirección {res}. MemRead = 1: la memoria de datos da {dl}.',
        sw: 'La extensión de signo pasa el inmediato {im} a {ext}. ALUSrc = 1: la ALU suma la base {rsn} = {a} y {sim} → dirección {res}. Lo que se guarda es {rtn} = {b}, que va por Dato leído 2 a la memoria.',
        addi: 'La extensión de signo pasa el inmediato {im} a {ext}. ALUSrc = 1 y ALUOp = 00: la ALU suma {rsn} = {a} y {sim} = {res}.',
        slti: 'La extensión de signo pasa el inmediato {im} a {ext}. ALUSrc = 1 y ALUOp = 11: la ALU hace slt, ¿{sa} < {sim}? → {res}.',
        beq: 'ALUOp = 01: la ALU resta {rsn} − {rtn} = {a} − {b} = {res}, así que Zero = {z}. A la vez, el inmediato {im} extendido y desplazado 2 a la izquierda ({sh}) se suma a PC + 4: destino {tg}.',
        jj: 'Los 26 bits de dirección ({dst}) se desplazan 2 a la izquierda y se les ponen delante los 4 bits altos de PC + 4: {tg}.',
        jal: ' Link = 1: el registro a escribir es el 31 ($ra) y el dato, PC + 4 = {pc4}, la dirección de vuelta.',
        brY: 'Branch = 1 y Zero = 1 → PCSrc = 1: salta.', brN: 'Branch = 1 pero Zero = 0 → PCSrc = 0: no salta, sigue en PC + 4.',
        bnY: 'BranchNE = 1 y Zero = 0 → PCSrc = 1: salta (son distintos).', bnN: 'BranchNE = 1 pero Zero = 1 → PCSrc = 0: no salta (son iguales).',
        wbR: 'Flanco de reloj: {mt} y RegWrite = 1: {r} ← {v}.', wbZ: 'Flanco de reloj: RegWrite = 1, pero el destino es $zero, que siempre vale 0: no cambia.', wbM: 'Flanco de reloj: MemWrite = 1: M[{a}] ← {v}.', wbN: 'Flanco de reloj: no se escribe ningún registro ni la memoria.',
        pc: 'Y el PC pasa a {n}.'
      },
      opn: { add: 'suma', sub: 'resta', and: 'AND', or: 'OR', nor: 'NOR', slt: 'slt (¿menor que?)' },
      cab: { pc_add: 'PC', inst: 'Instrucción', pc4: 'PC + 4', f2521: 'rs', f2016: 'rt', f1511: 'rd', regdst_out: 'Registro a escribir', link_reg: 'Registro a escribir', rd1: 'Dato leído 1', rd2_mem: 'Dato leído 2 → memoria', f150: 'Inmediato [15-0]', ext: 'Extendido a 32 bits', alusrc_out: 'Entrada B de la ALU', alures: 'Resultado de la ALU', alures_mem: 'Dirección (ALU)', zero: 'Zero', memrd: 'Dato leído de memoria', wb: 'Dato a escribir', wb2: 'Dato a escribir', sh2b_out: 'Inmediato × 4', add2_out: 'Destino del salto', f250: 'Campo [25-0]', jaddr: 'Dirección de salto', pcsrc_out: 'Salida de PCSrc', loop: 'PC siguiente' },
      bk: {
        pc: ['PC', 'Registro con la dirección de la instrucción que se ejecuta. Se escribe en cada flanco con el siguiente PC.'],
        im: ['Memoria de instrucciones', 'Solo se lee: con la dirección del PC da la instrucción de 32 bits.'],
        add1: ['Sumador PC + 4', 'Suma 4 al PC: la dirección de la siguiente instrucción si no hay salto.'],
        rf: ['Banco de registros', 'Lee dos registros a la vez (rs y rt) y escribe uno en el flanco si RegWrite = 1.'],
        regdst: ['Multiplexor RegDst', 'Elige el registro destino: rt (0, formato I) o rd (1, formato R).'],
        se: ['Extensión de signo', 'Pasa los 16 bits del inmediato a 32 copiando el bit de signo.'],
        alusrc: ['Multiplexor ALUSrc', 'Elige la segunda entrada de la ALU: Dato leído 2 (0) o el inmediato extendido (1).'],
        alu: ['ALU', 'Hace la operación que le pide su control. Zero = 1 si el resultado es 0.'],
        aluc: ['Control de la ALU', 'Con ALUOp decide la operación: 00 sumar, 01 restar, 10 la que diga funct (11, slt con la ampliación de slti).'],
        dm: ['Memoria de datos', 'Con MemRead = 1 lee la palabra de la dirección que calcula la ALU; con MemWrite = 1 la escribe en el flanco.'],
        mtr: ['Multiplexor MemtoReg', 'Elige el dato que se escribe en el registro: el resultado de la ALU (0) o el dato leído de memoria (1).'],
        sh2b: ['Desplazar 2 a la izquierda', 'Multiplica por 4 el inmediato extendido: el salto cuenta instrucciones y la memoria, bytes.'],
        add2: ['Sumador del salto', 'PC + 4 + inmediato × 4: la dirección a la que saltaría beq.'],
        and: ['Puerta AND', 'Branch · Zero: solo salta si es beq (Branch = 1) y los registros son iguales (Zero = 1).'],
        pcsrc: ['Multiplexor PCSrc', 'Elige entre PC + 4 (0) y el destino del salto condicional (1).'],
        sh2j: ['Desplazar 2 a la izquierda (j)', 'Los 26 bits del campo de dirección × 4 = 28 bits; los 4 de arriba los pone PC + 4.'],
        jmux: ['Multiplexor Jump', 'Elige entre lo que sale de PCSrc (0) y la dirección de j (1).'],
        uc: ['Unidad de control', 'Con los 6 bits de op pone todas las señales (en violeta) según la tabla de la UC.'],
        link1: ['Multiplexor Link (registro)', 'Con Link = 1, el registro a escribir es el 31 ($ra).'],
        c31: ['Multiplexor Link (registro)', 'Con Link = 1, el registro a escribir es el 31 ($ra).'],
        link2: ['Multiplexor Link (dato)', 'Con Link = 1, el dato a escribir es PC + 4: la dirección de vuelta.'],
        and2: ['Puerta AND de bne', 'BranchNE · no Zero: salta si es bne y los registros son distintos (Zero = 0).'],
        or: ['Puerta OR', 'PCSrc = 1 si salta beq o si salta bne.']
      },
      nw: {
        pc: 'PC = {pc}; en el flanco pasa a {n}.', im: '{pc} → {w}.', add1: '{pc} + 4 = {pc4}.', rf: 'lee {rsn} = {a} y {rtn} = {b}; {wr}.', wrY: 'escribe {r} ← {v}', wrN: 'no escribe (RegWrite = {rw})',
        regdst: 'RegDst = {v} → {r}.', se: '{im} → {ext} ({d}).', alusrc: 'ALUSrc = {v} → B = {b}.', alu: '{op}: {a} y {b} → {res}; Zero = {z}.', aluc: 'ALUOp = {v}{fn} → {op}.',
        dm: '{x}', dmR: 'lee M[{a}] = {v}', dmW: 'escribe M[{a}] ← {v} en el flanco', dmN: 'ni lee ni escribe', mtr: 'MemtoReg = {v} → {d}.', sh2b: '{ext} × 4 = {sh}.', add2: '{pc4} + {sh} = {tg}.',
        and: 'Branch = {b}, Zero = {z} → {o}.', pcsrc: 'PCSrc = {v} → {o}.', sh2j: '{dst} × 4 = {x}.', jmux: 'Jump = {v} → {o}.', uc: 'op = {op} → {t}.', link: 'Link = {v}.', and2: 'BranchNE = {b}, Zero = {z} → {o}.', or: 'PCSrc = {o}.', X: 'X (no importa en esta instrucción)'
      },
      tm: { lead: 'Retardo de cada bloque (ps). En monociclo, el ciclo dura lo que la instrucción más lenta.', MI: 'Mem. instr.', Reg: 'Leer regs.', ALU: 'ALU', MD: 'Mem. datos', Esc: 'Escribir', R: 'tipo R', T: 'Ciclo = {t} ps ({f} GHz): lo marca {who}.', prog: 'Este programa: {n} ciclos × {t} ps = {ns} ns.', note: 'addi y slti recorren lo mismo que una tipo R; bne, lo mismo que beq.' },
      rules: 'La ruta de datos monociclo de los apuntes (T5) y del examen: una instrucción por ciclo, saltos condicionales desde PC + 4 y la tabla de la unidad de control de los apuntes (X = no importa). La RD básica hace add, sub, and, or, nor, slt, lw, sw, beq y j; las ampliaciones añaden addi, slti, bne y jal como en los problemas de los temas 9 y 10. Los valores salen del mismo modelo que los artículos (monociclo.py), comprobado ciclo a ciclo.',
      reto: 'Reto: la ruta de datos en papel', retoLead: 'Como la cuestión del examen: rellena las señales de control de una instrucción (con X donde no importa) o calcula el valor de un cable.',
      rS: 'Señales de control de {i}. Pon X donde no importe:', rP: 'Con {st}, ¿cuál es el siguiente PC de {i} en la dirección {pc}? (en hexadecimal)', rA: 'Con {st}, ¿qué valor sale de la ALU con {i}? (en decimal o en hexadecimal)',
      okS: 'Bien: así va la fila de {t} en la tabla de la UC.', okX: ' Donde pusiste 0 o 1 en vez de X también funcionaría, pero en el examen se espera X.', badS: 'Revisa las casillas en rojo. Lo típico: RegDst o MemtoReg con valor en sw y beq (no escriben: X), ALUSrc = 1 en beq (compara dos registros) o ALUOp de lw en beq (resta: 01).',
      okV: 'Bien.', badV: 'No es eso. Repasa: {h}', hP: 'beq y bne saltan a PC + 4 + inmediato × 4; j y jal ponen los 4 bits altos de PC + 4 delante del campo × 4.', hA: 'la ALU suma la base y el inmediato extendido en lw, sw y addi; resta en beq y bne; slt da 1 si el primero es menor (con signo).'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'datapath', oA: '--extend', file: 'program.s',
      modsL: 'Extensions', modsT: { addi: 'addi: just one more row in the control unit (like lw, without memory)', slti: 'slti: ALUOp = 11 so the ALU does slt with the immediate', bne: 'bne: BranchNE signal, an AND with Zero inverted and an OR before PCSrc', jal: 'jal: Link signal and two multiplexers: writes PC + 4 into $ra (register 31)' },
      ex: 'Example', share: 'Share', base: 'Address of the first instruction', prog: 'Program (with its labels)', ini: 'Initial state: registers and memory', iniH: 'One value per line: $s0 = 0x10010000 · M[0x10010008] = 120. Everything else starts at 0.',
      baseBad: 'Type an address in hexadecimal, a multiple of 4 (for example 0x00400000).',
      steps: 'cycle by cycle', diag: 'the datapath', vals: 'value of each wire (the numbers in the drawing)', regs: 'registers and memory at the end of the cycle', time: 'clock cycle',
      start: 'Press Step to execute the first instruction: each step is one clock cycle. Or tap a piece of the drawing to see what it does.',
      cyc: 'cycle {n}', tipo: { R: 'R-type', lw: 'lw', sw: 'sw', beq: 'beq', j: 'j', bne: 'bne', jal: 'jal', slti: 'slti', addi: 'addi' },
      sigs: 'Control signals', noch: 'Nothing changes: no register or memory is written.', chR: '{r} ← {v}', chM: 'M[{a}] ← {v}',
      tap: 'Tap a piece of the drawing to see what it does and its values in this cycle.', swipe: 'Swipe the drawing sideways to see all of it.', now: 'In this cycle: ',
      err: { reg: 'unknown register: {x}', num: 'invalid number: {x}', imms: 'immediate {x} does not fit in 16 signed bits', immu: 'immediate {x} does not fit in 16 unsigned bits', sh: 'shamt goes from 0 to 31: {x}', args: 'wrong number of operands (expects {x})', lab: 'label {x} does not exist', align: 'address {x} is not a multiple of 4', far: 'the branch to {x} does not fit in 16 bits', region: '{x} is outside the 256 MB of PC + 4: j cannot reach it', mem: 'offset($register) expected: {x}', op: 'unknown instruction or pseudo-instruction: {x}', rdno: '{x}: this datapath does not have it (add, sub, and, or, nor, slt, lw, sw, beq and j; with extensions, addi, slti, bne and jal)', rdext: '{x} needs its extension: switch it on above', line: 'cannot understand the line: {x}' },
      errIni: 'Initial state, line {n}: {e}',
      stop: { end: 'End: the next PC ({pc}) is no longer an instruction of the program.', limit: 'Stopped after 400 cycles: a loop that never ends?', align: 'Stopped: lw or sw with address {x}, which is not a multiple of 4 (QtSpim would raise an exception).', empty: 'Type a program.' },
      e: {
        f: 'Fetch: the PC is {pc}; the instruction memory gives {w} and the adder computes PC + 4 = {pc4}.',
        d: 'The control unit sees op = {op} ({t}) and sets the signals of its row; the register file reads rs = {rs} and rt = {rt}.',
        R: 'ALUSrc = 0: the ALU gets {rsn} = {a} and {rtn} = {b}. ALUOp = 10 and funct = {fn} → {opn}: the result is {res}.',
        lw: 'Sign extension turns the immediate {im} into {ext}. ALUSrc = 1: the ALU adds the base {rsn} = {a} and {sim} → address {res}. MemRead = 1: the data memory gives {dl}.',
        sw: 'Sign extension turns the immediate {im} into {ext}. ALUSrc = 1: the ALU adds the base {rsn} = {a} and {sim} → address {res}. What is stored is {rtn} = {b}, which goes through Read data 2 to the memory.',
        addi: 'Sign extension turns the immediate {im} into {ext}. ALUSrc = 1 and ALUOp = 00: the ALU adds {rsn} = {a} and {sim} = {res}.',
        slti: 'Sign extension turns the immediate {im} into {ext}. ALUSrc = 1 and ALUOp = 11: the ALU does slt, {sa} < {sim}? → {res}.',
        beq: 'ALUOp = 01: the ALU subtracts {rsn} − {rtn} = {a} − {b} = {res}, so Zero = {z}. At the same time, the immediate {im}, extended and shifted left by 2 ({sh}), is added to PC + 4: target {tg}.',
        jj: 'The 26 address bits ({dst}) are shifted left by 2 and the top 4 bits of PC + 4 are put in front: {tg}.',
        jal: ' Link = 1: the register written is 31 ($ra) and the data, PC + 4 = {pc4}, the return address.',
        brY: 'Branch = 1 and Zero = 1 → PCSrc = 1: it branches.', brN: 'Branch = 1 but Zero = 0 → PCSrc = 0: no branch, it goes on to PC + 4.',
        bnY: 'BranchNE = 1 and Zero = 0 → PCSrc = 1: it branches (they differ).', bnN: 'BranchNE = 1 but Zero = 1 → PCSrc = 0: no branch (they are equal).',
        wbR: 'Clock edge: {mt} and RegWrite = 1: {r} ← {v}.', wbZ: 'Clock edge: RegWrite = 1, but the destination is $zero, which is always 0: no change.', wbM: 'Clock edge: MemWrite = 1: M[{a}] ← {v}.', wbN: 'Clock edge: no register or memory is written.',
        pc: 'And the PC becomes {n}.'
      },
      opn: { add: 'add', sub: 'subtract', and: 'AND', or: 'OR', nor: 'NOR', slt: 'slt (less than?)' },
      cab: { pc_add: 'PC', inst: 'Instruction', pc4: 'PC + 4', f2521: 'rs', f2016: 'rt', f1511: 'rd', regdst_out: 'Write register', link_reg: 'Write register', rd1: 'Read data 1', rd2_mem: 'Read data 2 → memory', f150: 'Immediate [15-0]', ext: 'Extended to 32 bits', alusrc_out: 'ALU input B', alures: 'ALU result', alures_mem: 'Address (ALU)', zero: 'Zero', memrd: 'Data read from memory', wb: 'Write data', wb2: 'Write data', sh2b_out: 'Immediate × 4', add2_out: 'Branch target', f250: 'Field [25-0]', jaddr: 'Jump address', pcsrc_out: 'PCSrc output', loop: 'Next PC' },
      bk: {
        pc: ['PC', 'Register with the address of the instruction being executed. It is written on every clock edge with the next PC.'],
        im: ['Instruction memory', 'Only read: with the address in the PC it gives the 32-bit instruction.'],
        add1: ['PC + 4 adder', 'Adds 4 to the PC: the address of the next instruction if there is no branch.'],
        rf: ['Register file', 'Reads two registers at once (rs and rt) and writes one on the clock edge if RegWrite = 1.'],
        regdst: ['RegDst multiplexer', 'Picks the destination register: rt (0, I format) or rd (1, R format).'],
        se: ['Sign extension', 'Turns the 16 bits of the immediate into 32 by copying the sign bit.'],
        alusrc: ['ALUSrc multiplexer', 'Picks the second ALU input: Read data 2 (0) or the extended immediate (1).'],
        alu: ['ALU', 'Does the operation its control asks for. Zero = 1 if the result is 0.'],
        aluc: ['ALU control', 'With ALUOp it picks the operation: 00 add, 01 subtract, 10 the one funct says (11, slt with the slti extension).'],
        dm: ['Data memory', 'With MemRead = 1 it reads the word at the address the ALU computes; with MemWrite = 1 it writes it on the clock edge.'],
        mtr: ['MemtoReg multiplexer', 'Picks the data written to the register: the ALU result (0) or the data read from memory (1).'],
        sh2b: ['Shift left 2', 'Multiplies the extended immediate by 4: the branch counts instructions and memory counts bytes.'],
        add2: ['Branch adder', 'PC + 4 + immediate × 4: the address beq would branch to.'],
        and: ['AND gate', 'Branch · Zero: it only branches if it is beq (Branch = 1) and the registers are equal (Zero = 1).'],
        pcsrc: ['PCSrc multiplexer', 'Picks between PC + 4 (0) and the conditional branch target (1).'],
        sh2j: ['Shift left 2 (j)', 'The 26 bits of the address field × 4 = 28 bits; the top 4 come from PC + 4.'],
        jmux: ['Jump multiplexer', 'Picks between the PCSrc output (0) and the j address (1).'],
        uc: ['Control unit', 'With the 6 bits of op it sets every signal (in violet) according to the control table.'],
        link1: ['Link multiplexer (register)', 'With Link = 1, the register written is 31 ($ra).'],
        c31: ['Link multiplexer (register)', 'With Link = 1, the register written is 31 ($ra).'],
        link2: ['Link multiplexer (data)', 'With Link = 1, the data written is PC + 4: the return address.'],
        and2: ['bne AND gate', 'BranchNE · not Zero: it branches if it is bne and the registers differ (Zero = 0).'],
        or: ['OR gate', 'PCSrc = 1 if beq branches or if bne branches.']
      },
      nw: {
        pc: 'PC = {pc}; on the clock edge it becomes {n}.', im: '{pc} → {w}.', add1: '{pc} + 4 = {pc4}.', rf: 'reads {rsn} = {a} and {rtn} = {b}; {wr}.', wrY: 'writes {r} ← {v}', wrN: 'does not write (RegWrite = {rw})',
        regdst: 'RegDst = {v} → {r}.', se: '{im} → {ext} ({d}).', alusrc: 'ALUSrc = {v} → B = {b}.', alu: '{op}: {a} and {b} → {res}; Zero = {z}.', aluc: 'ALUOp = {v}{fn} → {op}.',
        dm: '{x}', dmR: 'reads M[{a}] = {v}', dmW: 'writes M[{a}] ← {v} on the clock edge', dmN: 'neither reads nor writes', mtr: 'MemtoReg = {v} → {d}.', sh2b: '{ext} × 4 = {sh}.', add2: '{pc4} + {sh} = {tg}.',
        and: 'Branch = {b}, Zero = {z} → {o}.', pcsrc: 'PCSrc = {v} → {o}.', sh2j: '{dst} × 4 = {x}.', jmux: 'Jump = {v} → {o}.', uc: 'op = {op} → {t}.', link: 'Link = {v}.', and2: 'BranchNE = {b}, Zero = {z} → {o}.', or: 'PCSrc = {o}.', X: 'X (does not matter for this instruction)'
      },
      tm: { lead: 'Delay of each block (ps). In a single-cycle design, the cycle lasts as long as the slowest instruction.', MI: 'Instr. mem.', Reg: 'Read regs.', ALU: 'ALU', MD: 'Data mem.', Esc: 'Write', R: 'R-type', T: 'Cycle = {t} ps ({f} GHz): set by {who}.', prog: 'This program: {n} cycles × {t} ps = {ns} ns.', note: 'addi and slti go through the same blocks as an R-type; bne, the same as beq.' },
      rules: 'The single-cycle datapath of the course notes (T5) and the exam: one instruction per cycle, conditional branches from PC + 4 and the control table of the notes (X = does not matter). The basic datapath does add, sub, and, or, nor, slt, lw, sw, beq and j; the extensions add addi, slti, bne and jal, as in the problems of topics 9 and 10. The values come from the same model as the articles (monociclo.py), checked cycle by cycle.',
      reto: 'Challenge: the datapath on paper', retoLead: 'Like the exam question: fill in the control signals of an instruction (with X where it does not matter) or work out the value of a wire.',
      rS: 'Control signals of {i}. Put X where it does not matter:', rP: 'With {st}, what is the next PC of {i} at address {pc}? (in hexadecimal)', rA: 'With {st}, what value comes out of the ALU with {i}? (in decimal or hexadecimal)',
      okS: 'Correct: that is the {t} row of the control table.', okX: ' Where you put 0 or 1 instead of X it would also work, but the exam expects X.', badS: 'Check the boxes in red. The usual slips: RegDst or MemtoReg with a value in sw and beq (they do not write: X), ALUSrc = 1 in beq (it compares two registers) or the ALUOp of lw in beq (it subtracts: 01).',
      okV: 'Correct.', badV: 'Not quite. Remember: {h}', hP: 'beq and bne go to PC + 4 + immediate × 4; j and jal put the top 4 bits of PC + 4 in front of the field × 4.', hA: 'the ALU adds the base and the extended immediate in lw, sw and addi; subtracts in beq and bne; slt gives 1 if the first is smaller (signed).'
    }
  };
  var TMC = { MI: '#5B4BDB', Reg: '#2F5FD0', ALU: '#F5A524', MD: '#16794B', Esc: '#FF6B4A' };
  function s32(v) { return R$.s32(v >>> 0); }
  function hv(v) { v = v >>> 0; var d = s32(v); return hex(v) + (Math.abs(d) < 1e7 ? ' (' + d + ')' : ''); }
  function rn(i) { return I$.REG[i]; }
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, exs = EX[L];
    K.title = t.title;
    var S = { s: exs[0].s, i: exs[0].i, b: exs[0].b, m: {}, ex: exs[0].k, tm: { MI: 250, Reg: 100, ALU: 200, MD: 250, Esc: 100 } }, A = null, cur = -1, selB = null;
    var KEY = 'sl_sim_ruta_' + (document.documentElement.lang || '').slice(0, 2);
    (function () {
      var s = K6.hashState() || K6.store(KEY); if (!s) return;
      try {
        var o = JSON.parse(s); if (typeof o.s !== 'string' || o.s.length > 4000) return;
        S.s = o.s; S.i = String(o.i || '').slice(0, 2000); S.b = String(o.b || '0x00400000').slice(0, 12); S.ex = o.ex || '';
        S.m = {}; String(o.m || '').split(',').forEach(function (k) { if (MODS.indexOf(k) >= 0) S.m[k] = 1; });
        if (o.tm) ['MI', 'Reg', 'ALU', 'MD', 'Esc'].forEach(function (k) { var v = +o.tm[k]; if (v >= 0 && v < 100000) S.tm[k] = v; });
      } catch (e) {}
    })();
    var modStr = function () { return MODS.filter(function (k) { return S.m[k]; }).join(','); };
    var enc = function () { return JSON.stringify({ s: S.s, i: S.i, b: S.b, m: modStr(), ex: S.ex, tm: S.tm }); };
    var exOpts = exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('');
    var ctl = '<div class="sl6-ctl"><div class="sl6-seg" role="group" aria-label="' + esc(t.modsL) + '"><span class="sl6-seg__l">' + esc(t.modsL) + '</span>'
      + MODS.map(function (k) { return '<button type="button" data-mod="' + k + '" title="' + esc(t.modsT[k]) + '">' + k + '</button>'; }).join('') + '</div>'
      + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exOpts + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl + '<p class="sl6-desc sl6-rd-md"></p>'
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.file) + '</h3><label class="sl6-lbl" for="' + K.id + '-b">' + esc(t.base) + '</label><input type="text" id="' + K.id + '-b" class="sl6-co-b" spellcheck="false" autocomplete="off"><p class="sl6-help sl6-co-bh" hidden>' + esc(t.baseBad) + '</p>'
      + '<label class="sl6-lbl" for="' + K.id + '-ed" style="margin-top:12px">' + esc(t.prog) + '</label><textarea id="' + K.id + '-ed" class="sl6-ed" rows="9" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off"></textarea>'
      + '<label class="sl6-lbl" for="' + K.id + '-in" style="margin-top:12px">' + esc(t.ini) + '</label><textarea id="' + K.id + '-in" class="sl6-ed sl6-rd-in" rows="4" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off"></textarea><p class="sl6-help">' + esc(t.iniH) + '</p><div class="sl6-rd-err" aria-live="polite"></div></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-rd-card"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.diag) + '</h3><p class="sl6-help sl6-rd-sw">' + esc(t.swipe) + '</p><div class="sl6-rd-scroll"><div class="sl6-rd-d"></div></div><p class="sl6-rd-info" aria-live="polite"></p>'
      + '<h3 class="sl6-h sl6-h--2">── ' + esc(t.vals) + '</h3><ol class="sl6-rd-vals"></ol></section>'
      + '<div class="sl6-bot"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.regs) + '</h3><div class="sl6-rd-regs"></div></section><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.time) + '</h3><div class="sl6-rd-tm"></div></section></div>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var ed = q('.sl6-ed'), inp = q('.sl6-rd-in'), bIn = q('.sl6-co-b');
    ed.value = S.s; inp.value = S.i; bIn.value = S.b;
    function errTxt(code, x) { return fill(t.err[code] || t.err.op, { x: x == null ? '' : x }); }
    /* números sobre los cables de la instrucción: [cable, valor] en el orden del recorrido */
    function cables(st) {
      var c = st.c, tt = st.t, hl = D$.path(tt, S.m), out = [];
      var add = function (k, v) { if (hl[k] && D$.BADGE[k]) out.push([k, v]); };
      add('pc_add', hex(c.PC)); add('inst', hex(c.Instruccion)); add('pc4', hex(c['PC+4']));
      add('f2521', c.rs + ' = ' + rn(c.rs)); add('f2016', c.rt + ' = ' + rn(c.rt)); if (tt === 'R') add('f1511', c.rd + ' = ' + rn(c.rd));
      if (S.m.jal && hl.link_reg) add('link_reg', c.RegEscribir + ' = ' + rn(c.RegEscribir)); else add('regdst_out', c.RegEscribir + ' = ' + rn(c.RegEscribir));
      add('rd1', hv(c.Dato1)); if (tt === 'sw') add('rd2_mem', hv(c.Dato2));
      add('f150', hex(c.inm16, 4)); if (tt === 'beq' || tt === 'bne') add('ext', hv(c.ExtSigno));
      add('alusrc_out', hv(c.B)); add('alures', hv(c.ResultadoALU)); add('alures_mem', hex(c.ResultadoALU)); add('zero', String(c.Zero));
      if (c.DatoLeidoMem != null) add('memrd', hv(c.DatoLeidoMem));
      add('sh2b_out', hv(c.Desplazado)); add('add2_out', hex(c.DestinoBeq));
      add('f250', hex(c.dest26, 7)); add('jaddr', hex(c.DireccionJ));
      if (tt === 'jal' && S.m.jal) add('wb2', hex(c.DatoEscribir)); else { add('wb', hv(c.DatoEscribir)); add('wb2', hv(c.DatoEscribir)); }
      add('pcsrc_out', hex(c.PCtrasBeq)); add('loop', hex(c.PCsiguiente));
      return out;
    }
    function explain(st) {
      var c = st.c, s = st.s, tt = st.t, E = t.e, o = [], im = sxv(c.inm16);
      o.push(fill(E.f, { pc: hex(c.PC), w: hex(c.Instruccion), pc4: hex(c['PC+4']) }));
      o.push(fill(E.d, { op: c.op, t: t.tipo[tt], rs: c.rs + ' (' + rn(c.rs) + ')', rt: c.rt + ' (' + rn(c.rt) + ')' }));
      var V = { rsn: rn(c.rs), rtn: rn(c.rt), a: hv(c.Dato1), b: hv(c.Dato2), res: hv(c.ResultadoALU), im: hex(c.inm16, 4), ext: hex(c.ExtSigno), sim: im, sa: s32(c.Dato1), z: c.Zero, sh: hex(c.Desplazado), tg: hex(tt === 'j' || tt === 'jal' ? c.DireccionJ : c.DestinoBeq), dl: hv(c.DatoLeidoMem || 0), fn: '0x' + c.funct.toString(16).toUpperCase().padStart(2, '0'), opn: t.opn[c.OperacionALU], dst: hex(c.dest26, 7), pc4: hex(c['PC+4']) };
      if (tt === 'R') o.push(fill(E.R, V));
      else if (tt === 'lw' || tt === 'sw' || tt === 'addi' || tt === 'slti') o.push(fill(E[tt], V));
      else if (tt === 'beq' || tt === 'bne') o.push(fill(E.beq, V) + ' ' + (tt === 'beq' ? (c.PCSrc ? E.brY : E.brN) : (c.PCSrc ? E.bnY : E.bnN)));
      else o.push(fill(E.jj, V) + (tt === 'jal' ? fill(E.jal, V) : ''));
      if (c.escribeReg) o.push(fill(E.wbR, { mt: s.Link === '1' ? 'Link = 1' : 'MemtoReg = ' + s.MemtoReg, r: rn(c.escribeReg[0]), v: hv(c.escribeReg[2]) }));
      else if (s.RegWrite === '1') o.push(E.wbZ);
      else if (c.escribeMem) o.push(fill(E.wbM, { a: hex(c.escribeMem[0]), v: hv(c.escribeMem[2]) }));
      else o.push(E.wbN);
      o.push(fill(E.pc, { n: '<b>' + hex(c.PCsiguiente) + '</b>' }));
      return o;
    }
    function sxv(x) { return I$.sx(x); }
    function card(k) {
      var box = q('.sl6-rd-card');
      if (!A || A.stop === 'err' || A.stop === 'empty') { box.innerHTML = '<p class="sl6-co-0">' + esc(A && A.stop === 'empty' ? t.stop.empty : t.start) + '</p>'; return; }
      if (k < 0) { box.innerHTML = '<p class="sl6-co-0">' + esc(t.start) + '</p>' + stopH(); return; }
      var st = A.steps[k], sigs = R$.senales(S.m);
      var chips = sigs.map(function (n) { var v = st.s[n]; return '<span class="sl6-rd-sig' + (/X/.test(v) ? ' is-x' : (v === '0' || v === '00' ? '' : ' is-on')) + '"><i>' + n + '</i><b>' + v + '</b></span>'; }).join('');
      box.innerHTML = '<p class="sl6-co-ins"><span>' + hex(st.pc) + '</span> <b>' + esc(st.src) + '</b> <em>' + esc(fill(t.cyc, { n: k + 1 })) + ' · ' + esc(t.tipo[st.t]) + '</em></p>'
        + '<p class="sl6-lbl" style="margin-top:4px">' + esc(t.sigs) + '</p><div class="sl6-rd-sigs">' + chips + '</div>'
        + '<ol class="sl6-co-ex">' + explain(st).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' + (k === A.steps.length - 1 ? stopH() : '');
    }
    function stopH() { if (!A || !A.stop || A.stop === 'err') return ''; return '<p class="sl6-help' + (A.stop === 'end' ? '' : ' is-bad') + '">' + esc(fill(t.stop[A.stop], { pc: hex(A.endPc || 0), x: hex(A.stopX || 0) })) + '</p>'; }
    function diagram(k) {
      var st = A && k >= 0 ? A.steps[k] : null, nums = {}, list = st ? cables(st) : [];
      list.forEach(function (x, i) { nums[x[0]] = i + 1; });
      q('.sl6-rd-d').innerHTML = D$.svg({ lang: L === 'en' ? 'en' : 'es', hl: st ? D$.path(st.t, S.m) : null, sig: st ? st.s : null, badges: nums, mods: { jal: S.m.jal, bne: S.m.bne, slti: S.m.slti }, sel: selB, id: K.id + 'd', label: st ? st.src : t.diag });
      q('.sl6-rd-vals').innerHTML = list.map(function (x, i) { return '<li data-v="' + (i + 1) + '"><span>' + esc(t.cab[x[0]]) + '</span><b>' + esc(x[1]) + '</b></li>'; }).join('');
      q('.sl6-rd-vals').hidden = !list.length; q('.sl6-rd-vals').previousElementSibling.hidden = !list.length;
      info();
    }
    function sigV(st, n) { return st.s[n]; }
    function info() {
      var p = q('.sl6-rd-info');
      if (!selB) { p.innerHTML = esc(t.tap); return; }
      var b = t.bk[selB]; if (!b) { p.innerHTML = esc(t.tap); return; }
      var st = A && cur >= 0 ? A.steps[cur] : null, h = '<b>' + esc(b[0]) + '.</b> ' + esc(b[1]);
      if (st) h += ' <span class="sl6-rd-now">' + esc(t.now) + nowTxt(selB, st) + '</span>';
      p.innerHTML = h;
    }
    function nowTxt(k, st) {
      var c = st.c, s = st.s, N = t.nw, X = function (v) { return /X/.test(v); };
      var mx = function (v, a, b) { return X(v) ? N.X : (v === '1' ? b : a); };
      switch (k) {
        case 'pc': return esc(fill(N.pc, { pc: hex(c.PC), n: hex(c.PCsiguiente) }));
        case 'im': return esc(fill(N.im, { pc: hex(c.PC), w: hex(c.Instruccion) }));
        case 'add1': return esc(fill(N.add1, { pc: hex(c.PC), pc4: hex(c['PC+4']) }));
        case 'rf': return esc(fill(N.rf, { rsn: rn(c.rs), rtn: rn(c.rt), a: hv(c.Dato1), b: hv(c.Dato2), wr: c.escribeReg ? fill(N.wrY, { r: rn(c.escribeReg[0]), v: hv(c.escribeReg[2]) }) : fill(N.wrN, { rw: s.RegWrite }) }));
        case 'regdst': return esc(X(s.RegDst) ? N.X : fill(N.regdst, { v: s.RegDst, r: s.RegDst === '1' ? 'rd = ' + rn(c.rd) : 'rt = ' + rn(c.rt) }));
        case 'se': return esc(fill(N.se, { im: hex(c.inm16, 4), ext: hex(c.ExtSigno), d: s32(c.ExtSigno) }));
        case 'alusrc': return esc(X(s.ALUSrc) ? N.X : fill(N.alusrc, { v: s.ALUSrc, b: hv(c.B) }));
        case 'alu': return esc(fill(N.alu, { op: t.opn[c.OperacionALU], a: hv(c.Dato1), b: hv(c.B), res: hv(c.ResultadoALU), z: c.Zero }));
        case 'aluc': return esc(X(s.ALUOp) ? N.X : fill(N.aluc, { v: s.ALUOp, fn: s.ALUOp === '10' ? ', funct = 0x' + c.funct.toString(16).toUpperCase().padStart(2, '0') : '', op: t.opn[c.OperacionALU] }));
        case 'dm': return esc(fill(N.dm, { x: s.MemRead === '1' ? fill(N.dmR, { a: hex(c.ResultadoALU), v: hv(c.DatoLeidoMem) }) : (s.MemWrite === '1' ? fill(N.dmW, { a: hex(c.ResultadoALU), v: hv(c.Dato2) }) : N.dmN) }));
        case 'mtr': return esc(X(s.MemtoReg) ? N.X : fill(N.mtr, { v: s.MemtoReg, d: hv(c.DatoEscribir) }));
        case 'sh2b': return esc(fill(N.sh2b, { ext: hex(c.ExtSigno), sh: hex(c.Desplazado) }));
        case 'add2': return esc(fill(N.add2, { pc4: hex(c['PC+4']), sh: hex(c.Desplazado), tg: hex(c.DestinoBeq) }));
        case 'and': return esc(X(s.Branch) ? N.X : fill(N.and, { b: s.Branch, z: c.Zero, o: s.Branch === '1' && c.Zero ? 1 : 0 }));
        case 'pcsrc': return esc(fill(N.pcsrc, { v: c.PCSrc, o: hex(c.PCtrasBeq) }));
        case 'sh2j': return esc(fill(N.sh2j, { dst: hex(c.dest26, 7), x: hex((c.dest26 << 2) >>> 0) }));
        case 'jmux': return esc(X(s.Jump) ? N.X : fill(N.jmux, { v: s.Jump, o: hex(c.PCsiguiente) }));
        case 'uc': return esc(fill(N.uc, { op: c.op + ' = 0x' + c.op.toString(16).toUpperCase().padStart(2, '0'), t: t.tipo[st.t] }));
        case 'link1': case 'c31': case 'link2': return esc(X(s.Link) ? N.X : fill(N.link, { v: s.Link }));
        case 'and2': return esc(X(s.BranchNE) ? N.X : fill(N.and2, { b: s.BranchNE, z: c.Zero, o: s.BranchNE === '1' && !c.Zero ? 1 : 0 }));
        case 'or': return esc(fill(N.or, { o: c.PCSrc }));
      }
      return '';
    }
    function regsH(k) {
      var box = q('.sl6-rd-regs');
      if (!A || A.stop === 'err' || A.stop === 'empty') { box.innerHTML = ''; return; }
      var reg = k >= 0 ? A.steps[k].reg : A.reg0, mem = k >= 0 ? A.steps[k].mem : A.mem0, c = k >= 0 ? A.steps[k].c : null, ch = [];
      for (var i = 1; i < 32; i++) if (reg[i] || (c && c.escribeReg && c.escribeReg[0] === i)) ch.push('<span class="sl6-q__c' + (c && c.escribeReg && c.escribeReg[0] === i ? ' is-new' : '') + '"><b>' + rn(i) + '</b>' + esc(hv(reg[i])) + '</span>');
      var mm = Object.keys(mem).map(Number).sort(function (a, b) { return a - b; }).map(function (a) { return '<span class="sl6-q__c' + (c && c.escribeMem && c.escribeMem[0] === a ? ' is-new' : '') + '"><b>M[' + hex(a) + ']</b>' + esc(hv(mem[a])) + '</span>'; });
      var chg = c ? (c.escribeReg ? fill(t.chR, { r: rn(c.escribeReg[0]), v: hv(c.escribeReg[1]) + ' → ' + hv(c.escribeReg[2]) }) : c.escribeMem ? fill(t.chM, { a: hex(c.escribeMem[0]), v: hv(c.escribeMem[1]) + ' → ' + hv(c.escribeMem[2]) }) : t.noch) : '';
      box.innerHTML = (chg ? '<p class="sl6-rd-chg">' + esc(chg) + '</p>' : '') + '<div class="sl6-queue">' + ch.join('') + mm.join('') + '</div>';
    }
    function timeH() {
      var box = q('.sl6-rd-tm'), T = S.tm, types = ['R', 'lw', 'sw', 'beq', 'j'], tms = types.map(function (x) { return R$.tiempo(T, x); }), mx = Math.max.apply(null, tms.map(function (x) { return x.ps; })) || 1;
      var who = types.filter(function (x, i) { return tms[i].ps === mx; }).map(function (x) { return x === 'R' ? t.tm.R : x; }).join(', ');
      var inps = ['MI', 'Reg', 'ALU', 'MD', 'Esc'].map(function (k) { return '<label><span><i style="background:' + TMC[k] + '"></i>' + esc(t.tm[k]) + '</span><input type="number" min="0" max="99999" step="10" data-tm="' + k + '" value="' + T[k] + '"></label>'; }).join('');
      var bars = types.map(function (x, i) {
        return '<div class="sl6-rd-bar"><b>' + esc(x === 'R' ? t.tm.R : x) + '</b><span class="sl6-rd-bt">' + tms[i].camino.map(function (k) { return '<i style="width:' + (100 * (+T[k] || 0) / mx) + '%;background:' + TMC[k] + '" title="' + esc(t.tm[k]) + ' ' + T[k] + ' ps"></i>'; }).join('') + '</span><em>' + tms[i].ps + ' ps</em></div>';
      }).join('');
      var n = A && A.steps ? A.steps.length : 0;
      box.innerHTML = '<p class="sl6-help" style="margin-top:0!important">' + esc(t.tm.lead) + '</p><div class="sl6-rd-tin">' + inps + '</div><div class="sl6-rd-bars">' + bars + '</div>'
        + '<p class="sl6-note">' + esc(fill(t.tm.T, { t: mx, f: K6.num(1000 / mx, L, 2), who: who })) + (n ? ' ' + esc(fill(t.tm.prog, { n: n, t: mx, ns: K6.num(n * mx / 1000, L, 2) })) : '') + '</p><p class="sl6-help">' + esc(t.tm.note) + '</p>';
    }
    K.N = function () { return A && A.steps ? A.steps.length : 0; };
    K.draw = function (k, going) { cur = going ? k : -1; card(cur); diagram(cur); regsH(cur); };
    var PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('[data-mod]'), function (b) { b.setAttribute('aria-pressed', String(!!S.m[b.getAttribute('data-mod')])); });
      var on = MODS.filter(function (k) { return S.m[k]; });
      q('.sl6-rd-md').textContent = on.length ? on.map(function (k) { return t.modsT[k]; }).join(' · ') : t.rules.split('. ')[0] + '.';
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + (on.length ? ' <span class="o">' + esc(t.oA) + '</span> <b>' + esc(on.join(',')) + '</b>' : '') + ' ' + esc(t.file);
    }
    function update(keep) {
      var bv = /^\s*0x([0-9a-f]{1,8})\s*$/i.exec(bIn.value), base = bv ? parseInt(bv[1], 16) : NaN, okB = bv && base % 4 === 0;
      q('.sl6-co-bh').hidden = !!okB; bIn.classList.toggle('is-bad', !okB);
      sync();
      if (!okB) return;
      S.b = bIn.value.trim(); S.s = ed.value; S.i = inp.value;
      A = R$.run(ed.value.split('\n'), base >>> 0, inp.value, S.m, I$, 400);
      var errs = A.rows.filter(function (r) { return r.err; }).map(function (r) { return '<li>' + esc((r.line ? 'L' + r.line + ' · ' : '') + (r.src || '')) + ' — ' + esc(errTxt(r.err, r.x)) + '</li>'; })
        .concat(A.errs.map(function (e) { return '<li>' + esc(fill(t.errIni, { n: e.n, e: errTxt(e.e, e.x) })) + '</li>'; }));
      q('.sl6-rd-err').innerHTML = errs.length ? '<ul class="sl6-rd-el">' + errs.join('') + '</ul>' : '';
      if (!keep) { selB = null; }
      PL.reset(); timeH();
      K6.store(KEY, enc()); K6.keepHash(enc());
    }
    function go(k) { PL.stop(); K.el.classList.add('is-going'); PL.going = true; PL.k = k; PL.draw(); }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-mod],[data-a],[data-b]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-mod')) { var k = b.getAttribute('data-mod'); if (S.m[k]) delete S.m[k]; else S.m[k] = 1; S.ex = ''; q('.sl6-sel').value = ''; update(true); }
      else if (b.hasAttribute('data-b')) { var bk = b.getAttribute('data-b'); selB = selB === bk ? null : bk; diagram(cur); }
      else { var a = b.getAttribute('data-a'); if (a === 'share') K6.share(K, b, enc()); else if (a === 'theme') K6.toggleTheme(K); }
    });
    el.addEventListener('keydown', function (e) { var g = e.target.closest && e.target.closest('[data-b]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
    el.addEventListener('mouseover', function (e) { var li = e.target.closest && e.target.closest('.sl6-rd-vals li'); [].forEach.call(K.qa('.rd-bd'), function (g) { g.classList.toggle('is-hi', !!li && g.getAttribute('data-bd') === li.getAttribute('data-v')); }); });
    q('.sl6-rd-tm').addEventListener('input', function (e) { var i = e.target.closest('[data-tm]'); if (!i) return; var v = Math.max(0, Math.min(99999, +i.value || 0)); S.tm[i.getAttribute('data-tm')] = v; var f = document.activeElement === i; timeH(); if (f) { var n = q('[data-tm="' + i.getAttribute('data-tm') + '"]'); n.focus(); try { n.setSelectionRange(99, 99); } catch (x) {} } K6.store(KEY, enc()); K6.keepHash(enc()); });
    [ed, inp].forEach(function (x) { x.addEventListener('input', function () { S.ex = ''; q('.sl6-sel').value = ''; update(true); }); });
    bIn.addEventListener('input', function () { update(true); });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; ed.value = x.s; inp.value = x.i; bIn.value = x.b; S.m = {}; x.m.split(',').forEach(function (k) { if (k) S.m[k] = 1; }); update();
    });
    q('.sl6-sel').value = S.ex;
    // reto
    var RT = null;
    var RR = ['$t0', '$t1', '$t2', '$t3', '$s0', '$s1', '$a0', '$v0'];
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function retoNew() {
      var types = ['R', 'lw', 'sw', 'beq', 'j'].concat(MODS.filter(function (k) { return S.m[k]; })), tt = pick(types), kind = Math.random();
      var pc = (0x00400000 + 4 * rnd(4, 60)) >>> 0, ins, lab = {}, r1 = pick(RR), r2 = pick(RR), r3 = pick(RR);
      if (tt === 'R') ins = pick(['add', 'sub', 'and', 'or', 'slt']) + ' ' + r1 + ', ' + r2 + ', ' + r3;
      else if (tt === 'lw' || tt === 'sw') ins = tt + ' ' + r1 + ', ' + 4 * rnd(-2, 8) + '($s0)';
      else if (tt === 'addi' || tt === 'slti') ins = tt + ' ' + r1 + ', ' + r2 + ', ' + rnd(-20, 40);
      else if (tt === 'beq' || tt === 'bne') { var tg = (pc + 4 * rnd(-6, 8)) >>> 0; ins = tt + ' ' + r1 + ', ' + r2 + ', ' + hex(tg); }
      else { ins = tt + ' ' + hex((0x00400000 + 4 * rnd(0, 120)) >>> 0); }
      var f = I$.enc(ins, pc, lab, 'apuntes'), w = I$.word(f), reg = [], i;
      for (i = 0; i < 32; i++) reg.push(0);
      reg[16] = 0x10010000;
      [r1, r2, r3].forEach(function (r) { var n = I$.REG.indexOf(r); if (n > 0 && n !== 16) reg[n] = rnd(-9, 30) >>> 0; });
      if ((tt === 'beq' || tt === 'bne') && Math.random() < .5) reg[I$.REG.indexOf(r2)] = reg[I$.REG.indexOf(r1)];
      var regs0 = reg.slice(), x = R$.paso(pc, w, reg, {});
      var mode = kind < .55 ? 's' : ((tt === 'beq' || tt === 'bne' || tt === 'j' || tt === 'jal') ? 'p' : 'a');
      var used = [], fl = R$.fields(w);
      if (tt !== 'j' && tt !== 'jal') { used.push(fl.rs); if (tt === 'R' || tt === 'beq' || tt === 'bne' || tt === 'sw') used.push(fl.rt); }
      var stt = used.filter(function (v, k, a) { return a.indexOf(v) === k; }).map(function (n) { return rn(n) + ' = ' + (n ? s32(regs0[n]) : 0) + (n === 16 ? ' (' + hex(regs0[n]) + ')' : ''); }).join(', ') || '—';
      RT = { pc: pc, ins: ins, w: w, t: tt, s: x.s, c: x.c, mode: mode, reg: regs0, mods: (function () { var o = {}; for (var k in S.m) o[k] = 1; return o; })() };
      var box = q('.sl6-reto'), h = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p>';
      if (mode === 's') {
        h += '<p class="sl6-rd-q">' + esc(fill(t.rS, { i: ins })) + '</p><div class="sl6-rd-rq">' + R$.senales(S.m).map(function (n) {
          var opts = n === 'ALUOp' ? ['', '00', '01', '10', '11', 'XX'] : ['', '0', '1', 'X'];
          return '<label><span>' + n + '</span><select class="sl6-rd-rs" data-rs="' + n + '">' + opts.map(function (o) { return '<option value="' + o + '">' + (o || '·') + '</option>'; }).join('') + '</select></label>';
        }).join('') + '</div>';
      } else {
        h += '<p class="sl6-rd-q">' + esc(fill(mode === 'p' ? t.rP : t.rA, { st: stt, i: ins, pc: hex(pc) })) + '</p><div class="sl6-pp-rq"><label><span>' + esc(mode === 'p' ? 'PC' : 'ALU') + '</span><input type="text" data-rq="a" spellcheck="false" autocomplete="off" style="max-width:220px"></label></div>';
      }
      h += '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-r="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-r="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-r="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      box.innerHTML = h;
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-r]'); if (!b) return; var a = b.getAttribute('data-r');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var msg = q('.sl6-reto__msg');
        if (RT.mode === 's') {
          var all = true, xs = false;
          [].forEach.call(K.qa('[data-rs]'), function (sel) {
            var n = sel.getAttribute('data-rs'), want = RT.s[n] || 'X', got = sel.value, ok = got === want || (/X/.test(want) && got !== '' && !/X/.test(got));
            if (ok && got !== want) xs = true;
            sel.classList.toggle('is-ok', ok); sel.classList.toggle('is-bad', !ok); if (!ok) all = false;
          });
          msg.innerHTML = all ? '<b>' + esc(fill(t.okS, { t: t.tipo[RT.t] })) + '</b>' + (xs ? esc(t.okX) : '') : esc(t.badS);
        } else {
          var inn = q('[data-rq="a"]'), v = inn.value.trim().replace(/\s+/g, ''), want2 = RT.mode === 'p' ? RT.c.PCsiguiente : RT.c.ResultadoALU, got2 = R$.parseNum(v || 'x'), ok2 = got2 !== null && got2 === want2 >>> 0;
          inn.classList.toggle('is-ok', ok2); inn.classList.toggle('is-bad', !ok2);
          msg.innerHTML = ok2 ? '<b>' + esc(t.okV) + '</b>' : esc(fill(t.badV, { h: RT.mode === 'p' ? t.hP : t.hA }));
        }
      } else if (a === 'sol') {
        S.ex = ''; q('.sl6-sel').value = ''; S.m = RT.mods; bIn.value = hex(RT.pc); ed.value = RT.ins;
        inp.value = RT.reg.map(function (v, n) { return n && v ? rn(n) + ' = ' + (n === 16 ? hex(v) : s32(v)) : ''; }).filter(Boolean).join('\n');
        update(); go(0); q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    update(); retoNew();
  }
  K6.boot('.sl-sim[data-sim="ruta"]', init);
})();
