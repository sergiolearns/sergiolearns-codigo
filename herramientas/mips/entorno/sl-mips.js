/* sl-mips.js v2.0 — SergioLearns (13 nov 2026). Incluye el envoltorio de SPIM; el simulador SPIM S20 es de James R. Larus (licencia BSD). */
/* sl-mips-core.js - SPIM (MIPS32) en WebAssembly para SergioLearns.
   Núcleo SPIM S20 de James R. Larus (licencia BSD). Envoltorio JS: SergioLearns, 2026. */
(function (G) {
  'use strict';
  const td = new TextDecoder('utf-8'), te = new TextEncoder();
  function wasi(get) {
    const E = { ENOSYS: 52, EBADF: 8 };
    return {
      environ_get: () => 0, environ_sizes_get: (c, s) => { const v = new DataView(get().buffer); v.setUint32(c, 0, true); v.setUint32(s, 0, true); return 0; },
      fd_close: () => 0, fd_fdstat_get: () => 0, fd_prestat_get: () => E.EBADF, fd_prestat_dir_name: () => E.EBADF,
      fd_read: () => E.ENOSYS, fd_seek: () => E.ENOSYS, path_open: () => 44,
      fd_write: (fd, iov, n, wr) => { const v = new DataView(get().buffer); let t = 0; for (let i = 0; i < n; i++) t += v.getUint32(iov + 8 * i + 4, true); v.setUint32(wr, t, true); return 0; },
      proc_exit: c => { throw new Error('proc_exit ' + c); }
    };
  }
  class Spim {
    constructor(module) { this.module = module; this.x = null; }
    _str(p, n) { const m = new Uint8Array(this.x.memory.buffer); if (n == null) { n = 0; while (m[p + n]) n++; } return td.decode(m.subarray(p, p + n)); }
    _put(s) { const b = te.encode(s); const p = this.x.sl_alloc(b.length); new Uint8Array(this.x.memory.buffer).set(b, p); return [p, b.length]; }
    /* load(src, opts): nueva instancia (como «Reinitialize and Load File» de QtSpim). */
    load(src, opts = 0) {
      let mem = null;
      const inst = new WebAssembly.Instance(this.module, { wasi_snapshot_preview1: wasi(() => mem) });
      this.x = inst.exports; mem = this.x.memory; this.x._initialize();
      // el fichero va en UTF-8: las tildes de los comentarios se ven bien en el segmento de texto
      const [p, n] = this._put(src.replace(/\r\n?/g, '\n') + (src.endsWith('\n') ? '' : '\n'));
      const ok = !!this.x.sl_load(p, n, opts); this.x.sl_free(p);
      return { ok, msg: this.takeMsg() };
    }
    run(steps = 1 << 30, contBp = 1) { return ['fin', 'sigue', 'parada', 'entrada', 'error'][this.x.sl_run(steps, contBp)]; }
    input(s) { const [p, n] = this._put(s); this.x.sl_input(p, n); this.x.sl_free(p); }
    takeOut() { const s = this._str(this.x.sl_out(), this.x.sl_out_len()); return s; }
    takeMsg() { const s = this._str(this.x.sl_msg(), this.x.sl_msg_len()); return s; }
    clearIO() { this.x.sl_clear_io(); }
    count() { return this.x.sl_icount() >>> 0; }
    regs() { return Array.from(new Int32Array(this.x.memory.buffer, this.x.sl_regs(), 32)); }
    fregs() { return Array.from(new Float32Array(this.x.memory.buffer, this.x.sl_fpr(), 32)); }
    dregs() { return Array.from(new Float64Array(this.x.memory.buffer, this.x.sl_fpr(), 16)); }
    spec() { const a = new Uint32Array(this.x.memory.buffer, this.x.sl_spec(), 16);
      return { PC: a[0], EPC: a[1], Cause: a[2], BadVAddr: a[3], Status: a[4], HI: a[5], LO: a[6], FIR: a[7], FCSR: a[8], FCCR: a[9], FEXR: a[10], FENR: a[11], dataTop: a[12], textTop: a[13], kTextTop: a[14], stackBot: a[15] }; }
    text(kernel = 0) { return this._str(this.x.sl_text(kernel ? 1 : 0)); }
    inst(addr) { return this._str(this.x.sl_inst(addr >>> 0)); }
    /* Palabras de memoria sin efectos secundarios: data 0x10000000.., pila stackBot..0x80000000, kernel 0x90000000.. */
    words(seg) {
      const s = this.spec(), B = this.x.memory.buffer;
      if (seg === 'data') return { from: 0x10000000, w: new Uint32Array(B, this.x.sl_data_seg(), (s.dataTop - 0x10000000) >>> 2) };
      if (seg === 'stack') return { from: s.stackBot, w: new Uint32Array(B, this.x.sl_stack_seg(), (0x80000000 - s.stackBot) >>> 2) };
      return { from: 0x90000000, w: new Uint32Array(B, this.x.sl_kdata_seg(), (this.x.sl_kdata_top() - 0x90000000) >>> 2) };
    }
    bp(addr, on) { on ? this.x.sl_bp_add(addr >>> 0) : this.x.sl_bp_del(addr >>> 0); }
    setReg(r, v) { this.x.sl_set_reg(r, v | 0); }
    sym(name) { const [p] = this._put(name + '\0'); const a = this.x.sl_sym(p); this.x.sl_free(p); return a >>> 0; }
    version() { return this._str(this.x.sl_version()); }
  }
  G.SLMipsSpim = Spim;
  if (typeof module !== 'undefined') module.exports = Spim;
})(typeof self !== 'undefined' ? self : globalThis);
/* Tabla de instrucciones, pseudoinstrucciones, directivas y llamadas al sistema para el autocompletado
   y las explicaciones del entorno MIPS de SergioLearns. Formato: nombre|operandos|español|inglés */
var SLM_INS = [
  'add|$rd, $rs, $rt|$rd = $rs + $rt (con aviso de desbordamiento)|$rd = $rs + $rt (traps on overflow)',
  'addu|$rd, $rs, $rt|$rd = $rs + $rt (sin aviso de desbordamiento)|$rd = $rs + $rt (no overflow trap)',
  'addi|$rt, $rs, inm|$rt = $rs + inm (inmediato de 16 bits con signo)|$rt = $rs + imm (16-bit signed immediate)',
  'addiu|$rt, $rs, inm|$rt = $rs + inm (sin aviso de desbordamiento)|$rt = $rs + imm (no overflow trap)',
  'sub|$rd, $rs, $rt|$rd = $rs - $rt|$rd = $rs - $rt',
  'subu|$rd, $rs, $rt|$rd = $rs - $rt (sin aviso de desbordamiento)|$rd = $rs - $rt (no overflow trap)',
  'mult|$rs, $rt|HI:LO = $rs × $rt (64 bits)|HI:LO = $rs × $rt (64 bits)',
  'multu|$rs, $rt|HI:LO = $rs × $rt sin signo|HI:LO = $rs × $rt unsigned',
  'mul|$rd, $rs, $rt|$rd = $rs × $rt (los 32 bits bajos)|$rd = $rs × $rt (low 32 bits)',
  'div|$rs, $rt|LO = cociente, HI = resto de $rs / $rt|LO = quotient, HI = remainder of $rs / $rt',
  'divu|$rs, $rt|LO = cociente, HI = resto, sin signo|LO = quotient, HI = remainder, unsigned',
  'mfhi|$rd|$rd = HI (el resto tras div)|$rd = HI (the remainder after div)',
  'mflo|$rd|$rd = LO (el cociente tras div)|$rd = LO (the quotient after div)',
  'mthi|$rs|HI = $rs|HI = $rs',
  'mtlo|$rs|LO = $rs|LO = $rs',
  'and|$rd, $rs, $rt|$rd = $rs AND $rt, bit a bit|$rd = $rs AND $rt, bitwise',
  'andi|$rt, $rs, inm|$rt = $rs AND inm (andi $t0, $t1, 1: ¿impar?)|$rt = $rs AND imm (andi $t0, $t1, 1: odd?)',
  'or|$rd, $rs, $rt|$rd = $rs OR $rt, bit a bit|$rd = $rs OR $rt, bitwise',
  'ori|$rt, $rs, inm|$rt = $rs OR inm|$rt = $rs OR imm',
  'xor|$rd, $rs, $rt|$rd = $rs XOR $rt|$rd = $rs XOR $rt',
  'xori|$rt, $rs, inm|$rt = $rs XOR inm|$rt = $rs XOR imm',
  'nor|$rd, $rs, $rt|$rd = NOT ($rs OR $rt)|$rd = NOT ($rs OR $rt)',
  'sll|$rd, $rt, n|$rd = $rt desplazado n bits a la izquierda (× 2^n)|$rd = $rt shifted left n bits (× 2^n)',
  'srl|$rd, $rt, n|$rd = $rt desplazado n bits a la derecha, entra 0|$rd = $rt shifted right n bits, zeros in',
  'sra|$rd, $rt, n|$rd = $rt desplazado n bits a la derecha, se copia el signo|$rd = $rt shifted right n bits, sign copied',
  'sllv|$rd, $rt, $rs|$rd = $rt << $rs|$rd = $rt << $rs',
  'srlv|$rd, $rt, $rs|$rd = $rt >> $rs (lógico)|$rd = $rt >> $rs (logical)',
  'srav|$rd, $rt, $rs|$rd = $rt >> $rs (aritmético)|$rd = $rt >> $rs (arithmetic)',
  'slt|$rd, $rs, $rt|$rd = 1 si $rs < $rt; si no, 0|$rd = 1 if $rs < $rt, else 0',
  'sltu|$rd, $rs, $rt|$rd = 1 si $rs < $rt sin signo|$rd = 1 if $rs < $rt unsigned',
  'slti|$rt, $rs, inm|$rt = 1 si $rs < inm|$rt = 1 if $rs < imm',
  'sltiu|$rt, $rs, inm|$rt = 1 si $rs < inm sin signo|$rt = 1 if $rs < imm unsigned',
  'lui|$rt, inm|$rt = inm << 16 (los 16 bits altos)|$rt = imm << 16 (upper 16 bits)',
  'lw|$rt, despl($rs)|$rt = palabra (4 bytes) de la dirección $rs + despl|$rt = word (4 bytes) at address $rs + offset',
  'lh|$rt, despl($rs)|$rt = media palabra (2 bytes) con signo|$rt = halfword (2 bytes), sign-extended',
  'lhu|$rt, despl($rs)|$rt = media palabra sin signo|$rt = halfword, zero-extended',
  'lb|$rt, despl($rs)|$rt = byte con signo de $rs + despl|$rt = byte at $rs + offset, sign-extended',
  'lbu|$rt, despl($rs)|$rt = byte sin signo de $rs + despl|$rt = byte at $rs + offset, zero-extended',
  'sw|$rt, despl($rs)|guarda la palabra de $rt en $rs + despl|stores the word in $rt at $rs + offset',
  'sh|$rt, despl($rs)|guarda los 2 bytes bajos de $rt|stores the low 2 bytes of $rt',
  'sb|$rt, despl($rs)|guarda el byte bajo de $rt en $rs + despl|stores the low byte of $rt at $rs + offset',
  'beq|$rs, $rt, etiqueta|salta a la etiqueta si $rs == $rt|branches to the label if $rs == $rt',
  'bne|$rs, $rt, etiqueta|salta a la etiqueta si $rs != $rt|branches to the label if $rs != $rt',
  'bgez|$rs, etiqueta|salta si $rs >= 0|branches if $rs >= 0',
  'bgtz|$rs, etiqueta|salta si $rs > 0|branches if $rs > 0',
  'blez|$rs, etiqueta|salta si $rs <= 0|branches if $rs <= 0',
  'bltz|$rs, etiqueta|salta si $rs < 0|branches if $rs < 0',
  'j|etiqueta|salta siempre a la etiqueta|always jumps to the label',
  'jal|etiqueta|llama a la subrutina: $ra = vuelta y salta|calls the subroutine: $ra = return address, then jumps',
  'jr|$rs|salta a la dirección de $rs (jr $ra: volver)|jumps to the address in $rs (jr $ra: return)',
  'jalr|$rs|llama a la subrutina de la dirección $rs|calls the subroutine at the address in $rs',
  'syscall||llamada al sistema: el servicio va en $v0|system call: the service number goes in $v0',
  'nop||no hace nada|does nothing',
  'break|n|provoca una excepción de punto de ruptura|raises a breakpoint exception',
  'li|$rt, inm|pseudo: $rt = inm (valor literal)|pseudo: $rt = imm (literal value)',
  'la|$rt, etiqueta|pseudo: $rt = dirección de la etiqueta (el mapa, no el tesoro)|pseudo: $rt = address of the label',
  'move|$rd, $rs|pseudo: $rd = $rs|pseudo: $rd = $rs',
  'neg|$rd, $rs|pseudo: $rd = -$rs|pseudo: $rd = -$rs',
  'not|$rd, $rs|pseudo: $rd = NOT $rs|pseudo: $rd = NOT $rs',
  'abs|$rd, $rs|pseudo: $rd = valor absoluto de $rs|pseudo: $rd = absolute value of $rs',
  'b|etiqueta|pseudo: salta siempre a la etiqueta|pseudo: always branches to the label',
  'beqz|$rs, etiqueta|pseudo: salta si $rs == 0|pseudo: branches if $rs == 0',
  'bnez|$rs, etiqueta|pseudo: salta si $rs != 0|pseudo: branches if $rs != 0',
  'bge|$rs, $rt, etiqueta|pseudo: salta si $rs >= $rt|pseudo: branches if $rs >= $rt',
  'bgt|$rs, $rt, etiqueta|pseudo: salta si $rs > $rt|pseudo: branches if $rs > $rt',
  'ble|$rs, $rt, etiqueta|pseudo: salta si $rs <= $rt|pseudo: branches if $rs <= $rt',
  'blt|$rs, $rt, etiqueta|pseudo: salta si $rs < $rt|pseudo: branches if $rs < $rt',
  'bgeu|$rs, $rt, etiqueta|pseudo: salta si $rs >= $rt sin signo|pseudo: branches if $rs >= $rt unsigned',
  'bltu|$rs, $rt, etiqueta|pseudo: salta si $rs < $rt sin signo|pseudo: branches if $rs < $rt unsigned',
  'seq|$rd, $rs, $rt|pseudo: $rd = 1 si $rs == $rt|pseudo: $rd = 1 if $rs == $rt',
  'sne|$rd, $rs, $rt|pseudo: $rd = 1 si $rs != $rt|pseudo: $rd = 1 if $rs != $rt',
  'sge|$rd, $rs, $rt|pseudo: $rd = 1 si $rs >= $rt|pseudo: $rd = 1 if $rs >= $rt',
  'sgt|$rd, $rs, $rt|pseudo: $rd = 1 si $rs > $rt|pseudo: $rd = 1 if $rs > $rt',
  'sle|$rd, $rs, $rt|pseudo: $rd = 1 si $rs <= $rt|pseudo: $rd = 1 if $rs <= $rt',
  'rem|$rd, $rs, $rt|pseudo: $rd = resto de $rs / $rt|pseudo: $rd = remainder of $rs / $rt',
  'mulo|$rd, $rs, $rt|pseudo: $rd = $rs × $rt con aviso de desbordamiento|pseudo: $rd = $rs × $rt, traps on overflow',
  'rol|$rd, $rs, $rt|pseudo: rota $rs a la izquierda $rt bits|pseudo: rotates $rs left $rt bits',
  'ror|$rd, $rs, $rt|pseudo: rota $rs a la derecha $rt bits|pseudo: rotates $rs right $rt bits'
];
var SLM_DIR = [
  '.data|[dirección]|empieza el segmento de datos (por defecto 0x10010000)|starts the data segment (0x10010000 by default)',
  '.text|[dirección]|empieza el segmento de código (por defecto 0x00400000)|starts the code segment (0x00400000 by default)',
  '.globl|main|hace visible la etiqueta desde otros ficheros|makes the label visible from other files',
  '.word|w1, w2, …|palabras de 32 bits (4 bytes)|32-bit words (4 bytes)',
  '.half|h1, h2, …|medias palabras de 16 bits|16-bit halfwords',
  '.byte|b1, b2, …|bytes (8 bits)|bytes (8 bits)',
  '.asciiz|"texto"|cadena terminada en un byte 0|string ending in a 0 byte',
  '.ascii|"texto"|cadena sin el 0 final|string without the final 0',
  '.space|n|reserva n bytes a cero|reserves n zero bytes',
  '.align|n|el siguiente dato empieza en un múltiplo de 2^n|the next datum starts at a multiple of 2^n',
  '.float|f1, f2, …|reales de simple precisión|single-precision floats',
  '.double|d1, d2, …|reales de doble precisión|double-precision floats',
  '.kdata|[dirección]|segmento de datos del núcleo|kernel data segment',
  '.ktext|[dirección]|segmento de código del núcleo|kernel code segment'
];
var SLM_SYS = [
  '1|print_int|$a0 = entero|$a0 = integer|imprime el entero de $a0|prints the integer in $a0',
  '2|print_float|$f12 = real|$f12 = float|imprime el real de $f12|prints the float in $f12',
  '3|print_double|$f12 = doble|$f12 = double|imprime el doble de $f12|prints the double in $f12',
  '4|print_string|$a0 = dirección de la cadena|$a0 = address of the string|imprime la cadena .asciiz de $a0|prints the .asciiz string at $a0',
  '5|read_int||| lee un entero: queda en $v0|reads an integer into $v0',
  '6|read_float||| lee un real: queda en $f0|reads a float into $f0',
  '7|read_double||| lee un doble: queda en $f0|reads a double into $f0',
  '8|read_string|$a0 = búfer, $a1 = tamaño|$a0 = buffer, $a1 = size|lee una línea en el búfer (con el \\n)|reads a line into the buffer (with the \\n)',
  '9|sbrk|$a0 = bytes|$a0 = bytes|reserva memoria: la dirección queda en $v0|allocates memory: address in $v0',
  '10|exit||| termina el programa|ends the program',
  '11|print_char|$a0 = carácter|$a0 = character|imprime el carácter de $a0|prints the character in $a0',
  '12|read_char||| lee un carácter: queda en $v0|reads a character into $v0',
  '17|exit2|$a0 = código|$a0 = code|termina con un código|ends with an exit code'
];
var SLM_REGS = ['zero', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3', 't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7',
  's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 't8', 't9', 'k0', 'k1', 'gp', 'sp', 'fp', 'ra'];
var SLM_REGINFO = {
  zero: 'siempre vale 0|always 0', at: 'reservado para el ensamblador|reserved for the assembler',
  v0: 'servicio de syscall y resultado|syscall service and result', v1: 'segundo resultado|second result',
  a0: 'primer argumento|first argument', a1: 'segundo argumento|second argument', a2: 'tercer argumento|third argument', a3: 'cuarto argumento|fourth argument',
  t: 'temporal (se puede perder en una llamada)|temporary (may be lost across a call)',
  s: 'se conserva entre llamadas|preserved across calls', k0: 'núcleo|kernel', k1: 'núcleo|kernel',
  gp: 'puntero global|global pointer', sp: 'puntero de pila|stack pointer', fp: 'puntero de marco|frame pointer', ra: 'dirección de vuelta|return address'
};
/* Ejemplos del modo libre (pastillas «Empieza con»), originales de SergioLearns (13 nov 2026). El primero es el de la página. */
var SLM_EJ = {
  es: [
    { t: 'Leer dos números', n: 'mayor.s', c: '# mayor.s: lee dos números y escribe el mayor\n        .data\npide1:  .asciiz "Primer número: "\npide2:  .asciiz "Segundo número: "\nres:    .asciiz "El mayor es "\n        .text\n        .globl main\nmain:   li   $v0, 4\n        la   $a0, pide1\n        syscall\n        li   $v0, 5          # read_int: el número queda en $v0\n        syscall\n        move $t0, $v0\n        li   $v0, 4\n        la   $a0, pide2\n        syscall\n        li   $v0, 5\n        syscall\n        move $t1, $v0\n        move $t2, $t0        # de momento, el mayor es el primero\n        bge  $t0, $t1, listo\n        move $t2, $t1\nlisto:  li   $v0, 4\n        la   $a0, res\n        syscall\n        li   $v0, 1\n        move $a0, $t2\n        syscall\n        li   $v0, 10\n        syscall\n' },
    { t: 'Una función', n: 'doble.s', c: '# doble.s: una función que devuelve el doble de su argumento\n        .text\n        .globl main\nmain:   addi $sp, $sp, -4    # hueco en la pila para guardar $ra\n        sw   $ra, 0($sp)\n        li   $a0, 21         # el argumento va en $a0\n        jal  doble           # $ra = la vuelta; salta a doble\n        move $a0, $v0\n        li   $v0, 1          # print_int\n        syscall\n        lw   $ra, 0($sp)\n        addi $sp, $sp, 4\n        li   $v0, 10\n        syscall\ndoble:  add  $v0, $a0, $a0   # el resultado va en $v0\n        jr   $ra             # vuelve a quien llamó\n' },
    { t: 'Contar letras', n: 'letras.s', c: '# letras.s: cuenta los caracteres de una cadena hasta el 0 del final\n        .data\ntexto:  .asciiz "SergioLearns"\nmsg:    .asciiz "Caracteres: "\n        .text\n        .globl main\nmain:   la   $t0, texto\n        li   $t1, 0          # contador\nbucle:  lb   $t2, 0($t0)     # un byte: un carácter\n        beq  $t2, $zero, fin # el 0 marca el final\n        addi $t1, $t1, 1\n        addi $t0, $t0, 1     # siguiente byte\n        j    bucle\nfin:    li   $v0, 4\n        la   $a0, msg\n        syscall\n        li   $v0, 1\n        move $a0, $t1\n        syscall\n        li   $v0, 10\n        syscall\n' }
  ],
  en: [
    { t: 'Read two numbers', n: 'larger.s', c: '# larger.s: reads two numbers and prints the larger one\n        .data\nask1:   .asciiz "First number: "\nask2:   .asciiz "Second number: "\nres:    .asciiz "The larger is "\n        .text\n        .globl main\nmain:   li   $v0, 4\n        la   $a0, ask1\n        syscall\n        li   $v0, 5          # read_int: the number ends up in $v0\n        syscall\n        move $t0, $v0\n        li   $v0, 4\n        la   $a0, ask2\n        syscall\n        li   $v0, 5\n        syscall\n        move $t1, $v0\n        move $t2, $t0        # for now, the larger is the first one\n        bge  $t0, $t1, done\n        move $t2, $t1\ndone:   li   $v0, 4\n        la   $a0, res\n        syscall\n        li   $v0, 1\n        move $a0, $t2\n        syscall\n        li   $v0, 10\n        syscall\n' },
    { t: 'A function', n: 'double.s', c: '# double.s: a function that returns twice its argument\n        .text\n        .globl main\nmain:   addi $sp, $sp, -4    # room on the stack to save $ra\n        sw   $ra, 0($sp)\n        li   $a0, 21         # the argument goes in $a0\n        jal  double          # $ra = return address; jump to double\n        move $a0, $v0\n        li   $v0, 1          # print_int\n        syscall\n        lw   $ra, 0($sp)\n        addi $sp, $sp, 4\n        li   $v0, 10\n        syscall\ndouble: add  $v0, $a0, $a0   # the result goes in $v0\n        jr   $ra             # back to the caller\n' },
    { t: 'Count letters', n: 'letters.s', c: '# letters.s: counts the characters of a string up to the final 0\n        .data\ntext:   .asciiz "SergioLearns"\nmsg:    .asciiz "Characters: "\n        .text\n        .globl main\nmain:   la   $t0, text\n        li   $t1, 0          # counter\nloop:   lb   $t2, 0($t0)     # one byte: one character\n        beq  $t2, $zero, end # the 0 marks the end\n        addi $t1, $t1, 1\n        addi $t0, $t0, 1     # next byte\n        j    loop\nend:    li   $v0, 4\n        la   $a0, msg\n        syscall\n        li   $v0, 1\n        move $a0, $t1\n        syscall\n        li   $v0, 10\n        syscall\n' }
  ]
};
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
/* sl-mips-errores.js — SergioLearns (13 nov 2026)
   Traduce los mensajes de SPIM a una tarjeta en español o inglés: qué ha pasado, con los valores
   del programa, en qué línea y cómo se arregla. Textos y ejemplos originales.
   G.SLMErr(raw, ctx) → { k: etiqueta corta, t: título, p: frase (con `código` entre acentos graves),
                          line: línea del fuente o 0, warn: aviso que no para el programa,
                          stop: hay que parar ya (el programa no se recupera), raw: el mensaje de SPIM }
   ctx: { en, line (línea del fichero ya corregida), text (esa línea del fuente), labels (etiquetas
          del fuente), ins (instrucción del fuente en el PC), pcLine (su línea), mainAddr } */
(function (G) {
  'use strict';
  var REGN = { zero: 1, at: 1, v0: 1, v1: 1, a0: 1, a1: 1, a2: 1, a3: 1, k0: 1, k1: 1, gp: 1, sp: 1, fp: 1, ra: 1, s8: 1 };
  var i; for (i = 0; i <= 9; i++) REGN['t' + i] = 1; for (i = 0; i <= 7; i++) REGN['s' + i] = 1;
  function regOk(r) { // r sin el $
    if (/^\d+$/.test(r)) return +r <= 31;
    if (/^f\d+$/.test(r)) return +r.slice(1) <= 31;
    return !!REGN[r];
  }
  /* formato de cada instrucción: r registro, n número, l etiqueta, m memoria (desp($base) o etiqueta);
     «?» = opcional; «a|b» = cualquiera de los dos */
  var F = {}, k;
  function put(list, f) { list.split(' ').forEach(function (m) { F[m] = f; }); }
  put('add addu sub subu and or xor nor slt sltu sllv srlv srav mul mulo mulou rem remu seq sne sge sgt sle sgeu sgtu sleu movn movz', 'r r r');
  put('addi addiu andi ori xori slti sltiu', 'r r n');
  put('sll srl sra', 'r r n'); put('rol ror', 'r r r|n');
  put('lui li', 'r n'); put('la', 'r m');
  put('move not neg negu abs clo clz', 'r r');
  put('mult multu madd maddu msub msubu', 'r r'); put('div divu', 'r r r?');
  put('mfhi mflo mthi mtlo', 'r');
  put('lw lh lhu lb lbu sw sh sb lwl lwr swl swr ulw ulh ulhu usw ush ld sd lwc1 swc1 ldc1 sdc1 l.s s.s l.d s.d', 'r m');
  put('beq bne blt bgt ble bge bltu bgtu bleu bgeu', 'r r|n l');
  put('beqz bnez blez bgtz bltz bgez bltzal bgezal', 'r l');
  put('b bal j jal', 'l'); put('jr', 'r'); put('jalr', 'r r?');
  put('syscall nop eret', ''); put('break', 'n?');
  var OTROS = 'mfc0 mtc0 mfc1 mtc1 bc1t bc1f teq tne tge tlt teqi tnei add.s sub.s mul.s div.s add.d sub.d mul.d div.d mov.s mov.d cvt.s.w cvt.w.s cvt.d.w cvt.w.d cvt.s.d cvt.d.s c.eq.s c.lt.s c.le.s c.eq.d c.lt.d c.le.d abs.s abs.d neg.s neg.d sqrt.s sqrt.d li.s li.d'.split(' ');
  function known(m) { return m in F || OTROS.indexOf(m) >= 0; }
  var DIRS = '.align .ascii .asciiz .byte .data .double .extern .float .globl .half .kdata .ktext .space .text .word .set .rdata .sdata .comm .lcomm .ent .end .frame .mask .fmask .loc .file .err'.split(' ');
  var SUG = { mov: 'move', movi: 'li', ldi: 'li', mvi: 'li', ld: 'lw', load: 'lw', store: 'sw', st: 'sw', jmp: 'j', goto: 'j', call: 'jal', ret: 'jr $ra', jz: 'beqz', jnz: 'bnez', je: 'beq', jne: 'bne', inc: 'addi', dec: 'addi', cmp: 'slt', mul_: 'mul', mod: 'rem', shl: 'sll', shr: 'srl', sal: 'sll', sar: 'sra', '.global': '.globl', '.asciz': '.asciiz', '.string': '.asciiz', '.int': '.word', '.long': '.word', '.short': '.half', '.zero': '.space', '.section': '.data' };
  function lev(a, b) { // distancia de edición (para «¿querías decir…?»)
    var d = [], x, y; for (x = 0; x <= a.length; x++) d[x] = [x];
    for (y = 1; y <= b.length; y++) d[0][y] = y;
    for (x = 1; x <= a.length; x++) for (y = 1; y <= b.length; y++) d[x][y] = Math.min(d[x - 1][y] + 1, d[x][y - 1] + 1, d[x - 1][y - 1] + (a[x - 1] === b[y - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function near(w, list, fit) { // la más parecida; si empatan, la que encaja con los operandos que hay
    var best = null, bd = 9, bf = false;
    list.forEach(function (c) { var dd = lev(w, c), ff = fit ? fit(c) : false; if (dd < bd || (dd === bd && ff && !bf)) { bd = dd; best = c; bf = ff; } });
    return bd <= (w.length > 4 ? 2 : 1) ? best : null;
  }
  function fits(m, o) { // ¿los operandos o encajan con el formato de m?
    var f = F[m]; if (f == null) return false; var sl = f ? f.split(' ') : [];
    if (o.length < nMin(f) || o.length > sl.length) return false;
    return o.every(function (v, x) { var t = sl[x].replace('?', '').split('|');
      return (t.indexOf('r') >= 0 && /^\$/.test(v)) || (t.indexOf('n') >= 0 && isNum(v)) || (t.indexOf('l') >= 0 && isLabel(v)) || (t.indexOf('m') >= 0 && /\(|^[A-Za-z_]/.test(v)); });
  }
  function isNum(s) { return /^[-+]?(0x[0-9a-f]+|\d+)$/i.test(s) || /^'(\\.|[^'])'$/.test(s); }
  function isLabel(s) { return /^[A-Za-z_.][\w.]*$/.test(s); }
  function nOps(f) { return f ? f.split(' ').length : 0; }
  function nMin(f) { return f ? f.split(' ').filter(function (x) { return !/\?$/.test(x); }).length : 0; }
  /* ejemplo con operandos fijos: el que mejor enseña cómo se escribe */
  function ejemplo(m, en) {
    var f = F[m]; if (f == null) return m; var r = 0, out = [];
    var R = ['$t0', '$t1', '$t2'], N = /^s(ll|rl|ra)$/.test(m) ? '2' : m === 'lui' ? '0x1001' : m === 'li' ? '25' : '5';
    var L = m === 'jal' || m === 'bal' ? (en ? 'function' : 'funcion') : m === 'j' || m === 'b' ? (en ? 'loop' : 'bucle') : (en ? 'end' : 'fin');
    if (f === '') return m;
    if (m === 'la') return 'la $a0, ' + (en ? 'text' : 'texto');
    if (m === 'jr' || m === 'jalr') return m === 'jr' ? 'jr $ra' : 'jalr $t9';
    if (/^(mfhi|mflo|mthi|mtlo)$/.test(m)) return m + ' $t0';
    if (m === 'break') return 'break';
    f.split(' ').forEach(function (s) {
      if (/\?$/.test(s)) return;
      var t = s.split('|')[0];
      out.push(t === 'r' ? R[r++] : t === 'n' ? N : t === 'l' ? L : t === 'm' ? (/^s[whbd]/.test(m) ? '0($sp)' : '4($sp)') : '?');
    });
    return m + ' ' + out.join(', ');
  }
  function ops(rest) { // separa los operandos: comas o espacios; «4($t1)» y "texto" van juntos
    var t = rest.match(/"(?:\\.|[^"])*"?|'(?:\\.|[^'])*'?|[^\s,()]*\([^)]*\)?\S*|[^\s,]+/g) || [];
    return t.filter(function (x) { return x !== ''; });
  }
  function clean(line) { // quita el comentario y la etiqueta
    var s = '', q = false;
    for (var j = 0; j < line.length; j++) { var c = line[j]; if (c === '"' && line[j - 1] !== '\\') q = !q; if (c === '#' && !q) break; s += c; }
    var lab = /^\s*([A-Za-z_.][\w.]*)\s*:/.exec(s), label = '';
    if (lab) { label = lab[1]; s = s.slice(lab[0].length); }
    return { s: s.trim(), label: label };
  }
  function regFam(r, en) {
    var c = r.replace(/\d+$/, '');
    var ES = { t: 'Los temporales van de `$t0` a `$t9`.', s: 'Los guardados van de `$s0` a `$s7`.', a: 'Los de argumentos van de `$a0` a `$a3`.', v: 'Los de resultado son `$v0` y `$v1`.', k: 'Los del núcleo son `$k0` y `$k1`.', '': 'Por número van de `$0` a `$31`.', f: 'Los de coma flotante van de `$f0` a `$f31`.' };
    var EN = { t: 'Temporaries go from `$t0` to `$t9`.', s: 'Saved registers go from `$s0` to `$s7`.', a: 'Argument registers go from `$a0` to `$a3`.', v: 'Result registers are `$v0` and `$v1`.', k: 'Kernel registers are `$k0` and `$k1`.', '': 'By number they go from `$0` to `$31`.', f: 'Floating-point registers go from `$f0` to `$f31`.' };
    var x = (en ? EN : ES)[c];
    return x || (en ? 'Valid names: `$zero`, `$at`, `$v0`–`$v1`, `$a0`–`$a3`, `$t0`–`$t9`, `$s0`–`$s7`, `$k0`–`$k1`, `$gp`, `$sp`, `$fp`, `$ra` (or `$0`–`$31`).'
      : 'Los nombres válidos son `$zero`, `$at`, `$v0`–`$v1`, `$a0`–`$a3`, `$t0`–`$t9`, `$s0`–`$s7`, `$k0`–`$k1`, `$gp`, `$sp`, `$fp`, `$ra` (o `$0`–`$31`).');
  }
  var ORD = { es: ['primer', 'segundo', 'tercer', 'cuarto'], en: ['first', 'second', 'third', 'fourth'] };

  /* ---- una línea que SPIM no entiende ---- */
  function sintaxis(text, en) {
    var T = function (a, b) { return en ? b : a; };
    var c = clean(text || ''), s = c.s;
    var ex = function (m) { return T(' Se escribe así: `', ' It is written like this: `') + ejemplo(m, en) + '`.'; };
    if (c.label && known(c.label)) return { t: c.label + T(' no puede ser una etiqueta', ' cannot be a label'), p: T('`', '`') + c.label + T('` es el nombre de una instrucción de MIPS. Usa otro nombre para la etiqueta, por ejemplo `', '` is the name of a MIPS instruction. Use another name for the label, for example `') + (en ? 'loop' : 'bucle') + T('` (y cambia los saltos que vayan a ella).', '` (and change the jumps that go to it).') };
    if (!s) return null;
    var m0 = s.split(/\s+/)[0], m = m0, rest = s.slice(m0.length).trim(), o = ops(rest);
    if (m[0] === '.') {
      if (SUG[m]) return { t: T('En SPIM se escribe ', 'In SPIM it is written ') + SUG[m], p: T('SPIM no conoce `', 'SPIM does not know `') + m + T('`: usa `', '`: use `') + SUG[m] + '`' + (m === '.global' ? T(' (sin la a): `.globl main`.', ' (no a): `.globl main`.') : '.') };
      if (DIRS.indexOf(m) < 0) return { t: m + T(' no es una directiva de SPIM', ' is not a SPIM directive'), p: T('Las de siempre son `.data`, `.text`, `.globl`, `.word`, `.half`, `.byte`, `.asciiz`, `.ascii`, `.space` y `.align`.', 'The usual ones are `.data`, `.text`, `.globl`, `.word`, `.half`, `.byte`, `.asciiz`, `.ascii`, `.space` and `.align`.') };
      if (/^\.asciiz?$/.test(m) && !/^"/.test(rest)) return { t: m + T(' necesita el texto entre comillas', ' needs the text in double quotes'), p: T('Se escribe así: `', 'It is written like this: `') + m + ' "' + T('Hola', 'Hello') + '"`.' };
      if (/^"/.test(rest) && !/"\s*$/.test(rest)) return { t: T('Falta cerrar las comillas', 'The closing quote is missing'), p: T('El texto de `', 'The text of `') + m + T('` empieza con " y tiene que acabar con otra ".', '` starts with " and has to end with another ".') };
      return null;
    }
    if (!known(m)) {
      var lo = m.toLowerCase();
      if (lo !== m && known(lo)) return { t: T('Las instrucciones van en minúsculas', 'Instructions are written in lower case'), p: T('SPIM no reconoce `', 'SPIM does not recognise `') + m + T('`: escríbela como `', '`: write it as `') + lo + '`.' };
      if (/^(push|pop)$/i.test(m)) return { t: T('MIPS no tiene ', 'MIPS has no ') + lo, p: T('La pila se maneja a mano. Para guardar: `addi $sp, $sp, -4` y `sw $t0, 0($sp)`. Para sacar: `lw $t0, 0($sp)` y `addi $sp, $sp, 4`.', 'You handle the stack by hand. To push: `addi $sp, $sp, -4` and `sw $t0, 0($sp)`. To pop: `lw $t0, 0($sp)` and `addi $sp, $sp, 4`.') };
      var cerca = SUG[lo] || near(lo, Object.keys(F), function (c) { return fits(c, o); });
      if (cerca && lev(lo, cerca.split(' ')[0]) <= 1) return { t: m + T(' no es una instrucción de MIPS', ' is not a MIPS instruction'), p: T('SPIM no la conoce. ¿Querías decir `', 'SPIM does not know it. Did you mean `') + cerca + '`?' + (F[cerca] != null ? ex(cerca) : '') };
      if (!o.length && isLabel(m)) return { t: T('¿Una etiqueta sin los dos puntos?', 'A label without its colon?'), p: T('`', '`') + m + T('` no es una instrucción. Si es una etiqueta, se escribe con dos puntos: `', '` is not an instruction. If it is a label, it is written with a colon: `') + m + ':`.' };
      var sg = cerca;
      return { t: m + T(' no es una instrucción de MIPS', ' is not a MIPS instruction'),
        p: sg ? T('SPIM no la conoce. ¿Querías decir `', 'SPIM does not know it. Did you mean `') + sg + '`?' + (F[sg] != null ? ex(sg) : '')
          : T('SPIM no la conoce. Mira que esté bien escrita: las de siempre son `add`, `addi`, `lw`, `sw`, `beq`, `j`, `jal`, `li`, `la` y `move`.', 'SPIM does not know it. Check the spelling: the usual ones are `add`, `addi`, `lw`, `sw`, `beq`, `j`, `jal`, `li`, `la` and `move`.') };
    }
    var f = F[m];
    // registros que no existen o sin $
    for (var j = 0; j < o.length; j++) {
      var regs = o[j].match(/\$[\w.]*/g) || [];
      for (var q = 0; q < regs.length; q++) { var r = regs[q].slice(1); if (!r || !regOk(r)) return { t: regs[q] + T(' no es un registro', ' is not a register'), p: regFam(r, en) }; }
      var bare = o[j].replace(/^-?\d*\(/, '').replace(/\)$/, '');
      if (REGN[bare] && o[j].indexOf('$') < 0) return { t: T('A ', 'The register ') + bare + T(' le falta el $', ' is missing its $'), p: T('Los registros se escriben con `$` delante: `$', 'Registers are written with a `$` in front: `$') + bare + '`.' };
    }
    if (f == null) return null;
    var want = nOps(f), need = nMin(f), have = o.length, slots = f ? f.split(' ') : [];
    if (have < need) { var miss = need - have; return { t: T('A ', '') + m + T(miss > 1 ? ' le faltan ' + miss + ' operandos' : ' le falta un operando', miss > 1 ? ' is missing ' + miss + ' operands' : ' is missing an operand'), p: '`' + m + T('` lleva ', '` takes ') + need + T(' operando' + (need > 1 ? 's' : '') + ' y aquí ' + (have === 1 ? 'hay 1' : 'hay ' + have) + '.', ' operand' + (need > 1 ? 's' : '') + ' and here there ' + (have === 1 ? 'is 1' : 'are ' + have) + '.') + ex(m) }; }
    if (have > want) return { t: T('A ', '') + m + T(' le sobra un operando', ' has one operand too many'), p: '`' + m + T('` lleva ', '` takes ') + want + T(' operando' + (want > 1 ? 's' : '') + ' y aquí hay ' + have + '.', ' operand' + (want > 1 ? 's' : '') + ' and here there are ' + have + '.') + ex(m) };
    for (var x = 0; x < o.length && x < slots.length; x++) {
      var sl = slots[x].replace('?', '').split('|'), v = o[x], ord = ORD[en ? 'en' : 'es'][x] || '';
      var okR = sl.indexOf('r') >= 0 && /^\$/.test(v), okN = sl.indexOf('n') >= 0 && isNum(v), okL = sl.indexOf('l') >= 0 && isLabel(v), okM = sl.indexOf('m') >= 0 && (/^[-+]?(0x[0-9a-f]+|\d+)?\(\$[\w]+\)$/i.test(v) || isLabel(v) || isNum(v) || /^[A-Za-z_.][\w.]*[+-]\d+(\(\$\w+\))?$/.test(v) || /^[A-Za-z_.][\w.]*\(\$\w+\)$/.test(v));
      if (okR || okN || okL || okM) continue;
      if (sl[0] === 'm' && /\(/.test(v) && !/\)/.test(v)) return { t: T('Falta cerrar el paréntesis', 'The closing parenthesis is missing'), p: T('El registro base va entre paréntesis: `', 'The base register goes in parentheses: `') + v + ')`.' };
      if (sl[0] === 'm' && /\)./.test(v)) return { t: T('Sobra algo después del paréntesis', 'There is something extra after the parenthesis'), p: T('La dirección termina en el paréntesis: `', 'The address ends at the parenthesis: `') + v.replace(/\).*$/, ')') + '`.' };
      if (m === 'move' && isNum(v)) return { t: T('move copia un registro, no un número', 'move copies a register, not a number'), p: T('Para poner un número en un registro, usa `li`: `li ', 'To put a number in a register, use `li`: `li ') + o[0] + ', ' + v + '`.' };
      if (/^s(ll|rl|ra)$/.test(m) && x === 2 && /^\$/.test(v)) return { t: m + T(' desplaza un número fijo de posiciones', ' shifts by a fixed number of positions'), p: T('Para desplazar lo que diga un registro, usa `', 'To shift by what a register says, use `') + m + 'v ' + o[0] + ', ' + o[1] + ', ' + v + '`.' };
      if (m === 'jr' && isLabel(v)) return { t: T('jr salta a lo que hay en un registro', 'jr jumps to the address in a register'), p: T('Para saltar a una etiqueta, usa `j ', 'To jump to a label, use `j ') + v + '`' + T('; `jr` va con un registro, casi siempre `jr $ra`.', '; `jr` takes a register, almost always `jr $ra`.') };
      if (sl[0] === 'n' && isLabel(v)) return { t: m + T(' espera un número, no ', ' expects a number, not ') + v, p: T('El ' + ord + ' operando de `', 'The ' + ord + ' operand of `') + m + T('` es un número (el inmediato). Si `', '` is a number (the immediate). If `') + v + T('` es una etiqueta y quieres su dirección, cárgala antes con `la`.', '` is a label and you want its address, load it first with `la`.') };
      if (sl[0] === 'r' && isNum(v)) return { t: m + T(' espera un registro en el ' + ord + ' operando', ' expects a register as its ' + ord + ' operand'), p: '`' + v + T('` es un número.', '` is a number.') + ex(m) };
      if (sl[0] === 'l' && /^\$/.test(v)) return { t: m + T(' espera una etiqueta', ' expects a label'), p: '`' + v + T('` es un registro.', '` is a register.') + (m === 'j' ? T(' Para saltar a la dirección de un registro, usa `jr ', ' To jump to the address in a register, use `jr ') + v + '`.' : ex(m)) };
    }
    return null;
  }

  /* ---- el mensaje de SPIM → la tarjeta ---- */
  function SLMErr(raw, ctx) {
    ctx = ctx || {}; var en = !!ctx.en, T = function (a, b) { return en ? b : a; };
    raw = String(raw || ''); var R = { raw: raw.trim(), line: ctx.line || 0, warn: false, stop: false }, mm;
    function out(o) { for (var z in o) R[z] = o[z]; return R; }
    var insm = String(ctx.ins || '').trim().split(/\s+/)[0] || '';
    var ins = String(ctx.ins || '').replace(/\s*#.*$/, '').trim();
    /* --- al ensamblar --- */
    if ((mm = /Label is defined for the second time/.exec(raw))) {
      var lb = (/^\s*([A-Za-z_.][\w.]*)\s*:/.exec(ctx.text || '') || [])[1] || '';
      return out({ k: T('etiqueta', 'label'), t: lb ? T('La etiqueta ' + lb + ' está dos veces', 'The label ' + lb + ' appears twice') : T('Hay una etiqueta repetida', 'A label appears twice'),
        p: T('Cada etiqueta marca un solo sitio del programa. Cambia el nombre de una de las dos (por ejemplo, `' + (lb || 'bucle') + '2`) y los saltos que vayan a ella.', 'Each label marks one single place in the program. Rename one of the two (for example `' + (lb || 'loop') + '2`) and the jumps that go to it.') });
    }
    if ((mm = /immediate value \((-?\d+)\) out of range \((-?\d+) \.\. (-?\d+)\)/.exec(raw))) {
      var m1 = clean(ctx.text || '').s.split(/\s+/)[0] || T('la instrucción', 'the instruction'), sin = m1.replace(/iu$/, 'u').replace(/i$/, '');
      return out({ warn: true, k: T('aviso', 'warning'), t: T(mm[1] + ' no cabe en ' + m1, mm[1] + ' does not fit in ' + m1),
        p: T('El inmediato de `' + m1 + '` va de ' + mm[2] + ' a ' + mm[3] + ' (16 bits). SPIM lo recorta y el resultado no será el que esperas: carga antes el número en un registro con `li` y usa `' + sin + '`.',
          'The immediate of `' + m1 + '` goes from ' + mm[2] + ' to ' + mm[3] + ' (16 bits). SPIM cuts it and the result will not be what you expect: load the number into a register with `li` first and use `' + sin + '`.') });
    }
    if (/Shift distance can only be in the range 0\.\.31/.test(raw)) {
      var c2 = clean(ctx.text || ''), o2 = ops(c2.s.slice((c2.s.split(/\s+/)[0] || '').length)), d2 = o2[o2.length - 1] || '?', m2 = c2.s.split(/\s+/)[0] || 'sll';
      return out({ warn: true, k: T('aviso', 'warning'), t: T(m2 + ' solo desplaza de 0 a 31', m2 + ' only shifts from 0 to 31'),
        p: T('El campo de desplazamiento tiene 5 bits, así que `' + d2 + '` no cabe. SPIM lo recorta y el resultado no será el que esperas.', 'The shift field has 5 bits, so `' + d2 + '` does not fit. SPIM cuts it and the result will not be what you expect.') });
    }
    if (/\(parser\)/.test(raw)) {
      var sx = sintaxis(ctx.text, en);
      if (sx) return out({ k: T('sintaxis', 'syntax'), t: sx.t, p: sx.p });
      var mx = clean(ctx.text || '').s.split(/\s+/)[0];
      return out({ k: T('sintaxis', 'syntax'), t: T('SPIM no entiende la línea ', 'SPIM cannot read line ') + (R.line || '?'),
        p: T('Revisa la instrucción y sus operandos.', 'Check the instruction and its operands.') + (mx && F[mx] != null ? T(' Se escribe así: `', ' It is written like this: `') + ejemplo(mx, en) + '`.' : '') });
    }
    /* --- al ejecutar --- */
    if ((mm = /Instruction references undefined symbol at 0x[0-9a-f]+[^\n]*\n[^\n]*\[([^\]\s]+)\][^\n]*?(?:;\s*(\d+):)?/.exec(raw))) {
      var sym = mm[1];
      if (sym === 'main') return out({ stop: true, line: 0, k: T('símbolo', 'symbol'), t: T('SPIM no encuentra main', 'SPIM cannot find main'),
        p: (ctx.labels || []).indexOf('main') >= 0 ? T('Tu programa tiene `main:`, pero le falta `.globl main` (debajo de `.text`): sin ella, SPIM no la ve desde fuera.', 'Your program has `main:`, but it is missing `.globl main` (under `.text`): without it, SPIM cannot see it from outside.')
          : T('El programa empieza en la etiqueta `main`. Pon `main:` delante de la primera instrucción y `.globl main` debajo de `.text`.', 'The program starts at the label `main`. Put `main:` before the first instruction and `.globl main` under `.text`.') });
      var cand = near(sym, ctx.labels || []) || (ctx.labels || []).filter(function (l) { return l.toLowerCase() === sym.toLowerCase(); })[0];
      return out({ stop: true, line: mm[2] ? +mm[2] : R.line, k: T('símbolo', 'symbol'), t: T('La etiqueta ' + sym + ' no existe', 'The label ' + sym + ' does not exist'),
        p: T('Usas `' + sym + '`, pero no está definida en ningún sitio.', 'You use `' + sym + '`, but it is not defined anywhere.') + (cand ? T(' ¿Querías decir `' + cand + '`?', ' Did you mean `' + cand + '`?') : T(' Las etiquetas distinguen mayúsculas y minúsculas, y se definen con dos puntos: `' + sym + ':`.', ' Labels are case-sensitive and are defined with a colon: `' + sym + ':`.')) });
    }
    if ((mm = /Exception occurred at PC=0x([0-9a-f]+)\s*\n?\s*([^\n]*)/.exec(raw))) {
      var det = mm[2] || '', a, ignora = T(' SPIM sigue con la instrucción siguiente, pero lo que salga después ya no es de fiar.', ' SPIM goes on with the next instruction, but what comes out afterwards cannot be trusted.');
      if ((a = /Unaligned address in store: 0x([0-9a-f]+)/.exec(det))) { var n4 = /^sh/.test(insm) ? 2 : 4;
        return out({ k: T('excepción', 'exception'), t: T('Dirección desalineada al guardar', 'Misaligned address on a store'),
          p: '`' + (ins || 'sw') + T('` necesita una dirección múltiplo de ' + n4 + ', y `0x' + a[1] + '` no lo es. Revisa el desplazamiento y el registro base: la palabra i de un vector está en base + 4·i.', '` needs an address that is a multiple of ' + n4 + ', and `0x' + a[1] + '` is not. Check the offset and the base register: word i of an array is at base + 4·i.') + ignora }); }
      if ((a = /Unaligned address in inst\/data fetch: 0x([0-9a-f]+)/.exec(det))) {
        if (parseInt(a[1], 16) === parseInt(mm[1], 16)) return out({ stop: true, k: T('excepción', 'exception'), t: T('Saltas a una dirección desalineada', 'You jump to a misaligned address'), p: T('Las instrucciones están en direcciones múltiplo de 4 y el programa ha ido a `0x' + a[1] + '`. Mira el registro del `jr`.', 'Instructions are at addresses that are multiples of 4 and the program went to `0x' + a[1] + '`. Check the register of the `jr`.') });
        var n2 = /^lh/.test(insm) ? 2 : 4;
        return out({ k: T('excepción', 'exception'), t: T('Dirección desalineada al leer', 'Misaligned address on a load'),
          p: '`' + (ins || 'lw') + T('` necesita una dirección múltiplo de ' + n2 + ', y `0x' + a[1] + '` no lo es. Revisa el desplazamiento y el registro base: la palabra i de un vector está en base + 4·i.', '` needs an address that is a multiple of ' + n2 + ', and `0x' + a[1] + '` is not. Check the offset and the base register: word i of an array is at base + 4·i.') + ignora }); }
      if ((a = /Bad address in data\/stack read: 0x([0-9a-f]+)/.exec(det))) { var w = /^s[bhwd]/.test(insm), ad = parseInt(a[1], 16);
        return out({ k: T('excepción', 'exception'), t: w ? T('Escribes en una dirección que no existe', 'You write to an address that does not exist') : T('Lees de una dirección que no existe', 'You read from an address that does not exist'),
          p: '`' + (ins || (w ? 'sw' : 'lw')) + T('` usa la dirección `0x' + a[1] + '`, que no está ni en los datos (desde `0x10010000`) ni en la pila.', '` uses the address `0x' + a[1] + '`, which is neither in the data (from `0x10010000`) nor in the stack.') + (ad < 0x400000 ? T(' El registro base vale casi 0: ¿falta un `la` con la dirección del dato?', ' The base register is almost 0: is a `la` with the address of the data missing?') : '') + ignora }); }
      if ((a = /Bad address in text read: 0x([0-9a-f]+)/.exec(det))) return out({ stop: true, line: 0, k: T('excepción', 'exception'), t: T('Saltas a una dirección sin código', 'You jump to an address with no code'),
        p: T('El programa ha ido a `0x' + a[1] + '`, donde no hay instrucciones, y se ha parado. Suele pasar con un `jr $ra` cuando `$ra` se ha perdido: si una función llama a otra con `jal`, tiene que guardar `$ra` en la pila y recuperarlo antes de volver.', 'The program went to `0x' + a[1] + '`, where there are no instructions, and it has been stopped. It usually happens with a `jr $ra` when `$ra` got lost: if a function calls another one with `jal`, it has to save `$ra` on the stack and restore it before returning.') });
      if (/Arithmetic overflow/.test(det)) return out({ k: T('excepción', 'exception'), t: T('El resultado no cabe en 32 bits', 'The result does not fit in 32 bits'),
        p: '`' + (ins || 'add') + T('` da un resultado fuera del rango con signo (de −2 147 483 648 a 2 147 483 647). `add`, `addi` y `sub` avisan; `addu`, `addiu` y `subu` no.', '` gives a result outside the signed range (from −2,147,483,648 to 2,147,483,647). `add`, `addi` and `sub` warn you; `addu`, `addiu` and `subu` do not.') + ignora });
      if (!det.trim() && (/^break/.test(insm) || /^break/.test(String(ctx.mach || '')) || /^divu?$/.test(insm))) return out({ k: T('excepción', 'exception'), t: T('División entre cero', 'Division by zero'),
        p: T('`div` comprueba el divisor antes de dividir y, si vale 0, lanza `break`. Comprueba antes que el divisor no sea 0 (por ejemplo, con `beq $t1, $zero, …`).', '`div` checks the divisor before dividing and, if it is 0, raises `break`. Check first that the divisor is not 0 (for example, with `beq $t1, $zero, …`).') + ignora });
      return out({ k: T('excepción', 'exception'), t: T('Excepción en ', 'Exception at ') + '0x' + mm[1], p: (det ? '`' + det.trim() + '`. ' : '') + T('SPIM sigue con la instrucción siguiente, pero lo que salga después ya no es de fiar.', 'SPIM goes on with the next instruction, but what comes out afterwards cannot be trusted.') });
    }
    if ((mm = /Attempt to execute non-instruction at 0x([0-9a-f]+)/.exec(raw))) return out({ stop: true, line: 0, k: T('fin del código', 'end of code'), t: T('El programa se sale del código', 'The program runs off the end of the code'),
      p: T('Después de la última instrucción no hay nada más (`0x' + mm[1] + '`). Para terminar, acaba `main` con `li $v0, 10` y `syscall`.', 'After the last instruction there is nothing else (`0x' + mm[1] + '`). To finish, end `main` with `li $v0, 10` and `syscall`.') });
    if ((mm = /Unknown system call: (-?\d+)/.exec(raw))) return out({ stop: true, k: 'syscall', t: T('$v0 vale ' + mm[1] + ': no es ningún servicio', '$v0 is ' + mm[1] + ': that is not a service'),
      p: T('Antes de `syscall`, `$v0` dice qué quieres hacer: 1 imprimir un entero, 4 una cadena, 5 leer un entero, 8 leer una cadena, 10 terminar, 11 imprimir un carácter y 12 leer un carácter.', 'Before `syscall`, `$v0` says what you want to do: 1 print an integer, 4 a string, 5 read an integer, 8 read a string, 10 exit, 11 print a character and 12 read a character.') });
    if ((mm = /(Write to|Read from) unused memory-mapped IO address \(0x([0-9a-f]+)\)/.exec(raw))) return out({ stop: true, k: T('memoria', 'memory'), t: (mm[1] === 'Write to' ? T('Escribes en ', 'You write to ') : T('Lees de ', 'You read from ')) + '0x' + mm[2],
      p: T('Esa zona es de entrada y salida, no de datos. ¿Está bien el registro base? Si es `$sp`, no lo cambies a mano: empieza en `0x7fffeffc` y se mueve con `addi $sp, $sp, -4` o `4`.', 'That area is for input and output, not data. Is the base register right? If it is `$sp`, do not change it by hand: it starts at `0x7fffeffc` and moves with `addi $sp, $sp, -4` or `4`.') });
    if (/Can't expand stack segment/.test(raw)) return out({ stop: true, line: 0, k: T('pila', 'stack'), t: T('La pila se ha llenado', 'The stack is full'),
      p: T('Cada llamada reserva sitio en la pila y no lo devuelve. Suele ser una recursión que nunca llega al caso base, o un `addi $sp` que resta y no vuelve a sumar.', 'Every call takes space on the stack and never gives it back. It is usually a recursion that never reaches its base case, or an `addi $sp` that subtracts and never adds back.') });
    return null;
  }
  SLMErr.sintaxis = sintaxis; SLMErr.ejemplo = ejemplo; SLMErr.labels = function (src) {
    var out = []; String(src || '').split('\n').forEach(function (l) { var c = clean(l); if (c.label) out.push(c.label); }); return out;
  };
  G.SLMErr = SLMErr;
})(typeof window !== 'undefined' ? window : globalThis);
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
