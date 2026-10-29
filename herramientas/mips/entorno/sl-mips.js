/* sl-mips.js v1.0 — SergioLearns (29 oct 2026). Incluye el envoltorio de SPIM; el simulador SPIM S20 es de James R. Larus (licencia BSD). */
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
/* SergioLearns — entorno MIPS sl-mips v1.0 (29 oct 2026)
   Editor al estilo de Notepad++ (colores y autocompletado) + simulador al estilo de QtSpim (registros, segmentos de
   texto y datos, consola, Ejecutar, Paso, Pausa, Parar, puntos de ruptura), con ayudas que se pueden apagar.
   El simulador es SPIM S20 (James R. Larus, licencia BSD) compilado a WebAssembly: mismas direcciones, mismas
   pseudoinstrucciones y mismos mensajes que QtSpim.
   Uso:  <div class="sl-mips" data-mips='{"libre": true, "files": [{"name": "suma.s", "code": "…"}], "entrada": "", "alto": 560}'></div>
   Config: libre (guardar en el navegador, subir, descargar, compartir), files (un .s), entrada (texto para las syscalls de
   lectura), alto (px), ayudas (true|false: fija el selector), id.
   API: SLMIPS.mount(el, cfg) → {assemble, run, step, stop, code, setCode, state, output, regs, setHelp} */
(function () {
  'use strict';
  if (window.SLMIPS) return;
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var B = window.SL_MIPS_BASE || {};
  var CM_URL = B.cm || (window.SL_IDE_BASE && window.SL_IDE_BASE.cm) ||
    'https://cdn.jsdelivr.net/gh/sergiolearns/sergiolearns-codigo@a7cc496f11a874134ff10b1d7cdcc0d9f66c55d6/herramientas/entorno/sl-cm-6.0.2-v1.2.min.js';
  var WASM_URL = B.wasm || 'https://cdn.jsdelivr.net/gh/sergiolearns/sergiolearns-codigo@main/herramientas/mips/entorno/sl-spim.wasm';
  var CHUNK = 20000, LIMIT = 10000000;
  function T(es, en) { return EN ? en : es; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } return null; }
  function hex(n, w) { var s = (n >>> 0).toString(16); while (w && s.length < w) s = '0' + s; return s; }
  function report(e) { try { console.error('[sl-mips]', e); } catch (x) {} }

  /* ---------- iconos SVG (sin emoticonos) ---------- */
  var P = {
    asm: '<path d="M4 4h10l4 4v12H4z"/><path d="M14 4v4h4"/><path d="M8 13l2 2 4-4"/>',
    play: '<path d="M7 5l12 7-12 7z"/>', step: '<path d="M6 5l9 7-9 7z"/><path d="M18 5v14"/>',
    pause: '<path d="M8 5v14M16 5v14"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
    help: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    up: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    undo: '<path d="M9 7H5V3"/><path d="M5 7a8 8 0 1 1-1 6"/>', code: '<path d="M9 8l-4 4 4 4M15 8l4 4-4 4"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
    dot: '<circle cx="12" cy="12" r="5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'
  };
  function ico(n) { var s = el('span', 'slm-ico'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + P[n] + '</svg>'; return s; }
  function btn(n, label, title, cls) { var b = el('button', 'slm-btn ' + (cls || '')); b.type = 'button'; b.appendChild(ico(n));
    if (label) b.appendChild(el('span', 'slm-bl', label)); b.title = title || label; b.setAttribute('aria-label', title || label); return b; }

  /* ---------- tablas ---------- */
  function parseTab(a) { var o = {}; a.forEach(function (r) { var p = r.split('|'); o[p[0]] = { ops: p[1], d: EN ? p[3] : p[2] }; }); return o; }
  var INS = parseTab(SLM_INS), DIR = parseTab(SLM_DIR);
  var PSEUDO = {}; SLM_INS.forEach(function (r) { if (/\|pseudo/.test(r)) PSEUDO[r.split('|')[0]] = 1; });
  var REGSET = {}; SLM_REGS.forEach(function (r, i) { REGSET['$' + r] = 1; REGSET['$' + i] = 1; }); REGSET.$s8 = 1;
  for (var fi = 0; fi < 32; fi++) REGSET['$f' + fi] = 1;
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
      if (k === 'w') { var w = m[0].toLowerCase(); if (first && INS[w]) k = PSEUDO[w] ? 'pse' : 'ins'; else if (first && /^[a-z]+(\.[sd])?$/.test(w) && w !== m[0]) k = 'w'; else k = 'w'; first = false; }
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
  /* líneas marcadas: error y línea del PC */
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
  /* autocompletado */
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
        var opPos = /^\s*([A-Za-z_.][\w.]*:\s*)?[\w.]*$/.test(before);
        if (opPos) {
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
    // [0x00400024]\t0x3c081001  lui $8, 4097 [minutos]   ; 8: la   $t0, minutos  →  formato de QtSpim 9.1
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
    // misma lógica que format_mem de SPIM: 4 o más palabras a cero seguidas se resumen en una línea
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
    var mod = null, C = null, cm = null, marks = null, help$ = null, colorsC = null, autoC = null, textarea = null;
    var out = '', inputs = [], waitMode = null;

    root.textContent = ''; root.classList.add('slm'); if (cfg.alto) root.style.setProperty('--slm-h', cfg.alto + 'px');
    /* barra */
    var bar = el('div', 'slm-bar'), tabs = el('div', 'slm-tabs'), acts = el('div', 'slm-acts'), tools = el('div', 'slm-tools');
    var tEd = el('button', 'slm-tab is-on'), tSim = el('button', 'slm-tab');
    tEd.type = tSim.type = 'button'; tEd.appendChild(ico('code')); tEd.appendChild(el('span', '', T('Editor', 'Editor')));
    tSim.appendChild(ico('chip')); tSim.appendChild(el('span', '', T('Simulador', 'Simulator')));
    tEd.setAttribute('aria-label', T('Editor', 'Editor')); tSim.setAttribute('aria-label', T('Simulador', 'Simulator')); tEd.setAttribute('aria-pressed', 'true'); tSim.setAttribute('aria-pressed', 'false'); tabs.append(tEd, tSim);
    var bAsm = btn('asm', T('Cargar', 'Load'), T('Ensamblar y cargar (como «Reinitialize and Load File» de QtSpim)', 'Assemble and load (like QtSpim\'s «Reinitialize and Load File»)'), 'slm-btn--soft');
    var bRun = btn('play', T('Ejecutar', 'Run'), T('Ejecutar (F5)', 'Run (F5)'), 'slm-btn--go');
    var bStep = btn('step', T('Paso', 'Step'), T('Una instrucción (F10)', 'One instruction (F10)'));
    var bPause = btn('pause', '', T('Pausa', 'Pause')), bStop = btn('stop', '', T('Parar (vuelve al principio)', 'Stop (back to the start)'));
    acts.append(bAsm, bRun, bStep, bPause, bStop);
    var radix = el('select', 'slm-sel'); radix.title = T('Ver registros y memoria en hexadecimal o en decimal', 'Show registers and memory in hex or decimal');
    radix.innerHTML = '<option value="h">Hex</option><option value="d">Dec</option>';
    var bHelp = btn('help', T('Ayudas', 'Hints'), T('Ayudas del entorno', 'Environment hints'));
    var bFull = btn('full', '', T('Pantalla completa', 'Full screen'));
    var dark = store('sl_mips_tema') !== 'claro';
    var bTheme = btn('sun', '', '');
    function setTheme(d) { dark = d; root.classList.toggle('is-dark', d); bTheme.textContent = ''; bTheme.appendChild(ico(d ? 'sun' : 'moon'));
      var t = d ? T('Aspecto claro (como Notepad++ y QtSpim)', 'Light look (like Notepad++ and QtSpim)') : T('Aspecto oscuro (tinta)', 'Dark look (ink)'); bTheme.title = t; bTheme.setAttribute('aria-label', t); }
    setTheme(dark);
    bTheme.onclick = function () { setTheme(!dark); store('sl_mips_tema', dark ? 'oscuro' : 'claro'); };
    tools.append(radix, bHelp, bTheme);
    if (libre) { var bMore = btn('down', '', T('Descargar, subir, compartir', 'Download, upload, share')); tools.append(bMore); }
    tools.append(bFull);
    bar.append(tabs, acts, tools); root.appendChild(bar);
    /* menú de ayudas */
    var hm = el('div', 'slm-pop'); hm.hidden = true;
    var HL = { colores: T('Colores del código', 'Code colours'), auto: T('Autocompletado y plantillas', 'Autocomplete and templates'),
      explica: T('Explicación de cada paso', 'Explanation of each step'), error: T('Errores y línea actual en el editor', 'Errors and current line in the editor') };
    hm.appendChild(el('p', 'slm-pop__t', T('Ayudas', 'Hints')));
    HELPKEYS.forEach(function (k) { var l = el('label', 'slm-pop__i'), c = el('input'); c.type = 'checkbox'; c.checked = !!help[k]; c.dataset.k = k;
      if (cfg.ayudas != null) c.disabled = true; l.append(c, el('span', '', HL[k])); hm.appendChild(l); });
    hm.appendChild(el('p', 'slm-pop__n', libre ? T('En el examen se escriben sin ayudas: practica también así.', 'The exam has no hints: practise that way too.') : T('Como en el examen: empiezan apagadas.', 'Like the exam: they start off.')));
    root.appendChild(hm);
    var mm = null;
    if (libre) {
      mm = el('div', 'slm-pop slm-pop--more'); mm.hidden = true;
      var mDown = btn('down', T('Descargar .s', 'Download .s')), mUp = btn('up', T('Subir .s', 'Upload .s')), mShare = btn('link', T('Copiar enlace para compartir', 'Copy share link')), mReset = btn('undo', T('Volver al ejemplo', 'Back to the example'));
      var fileIn = el('input'); fileIn.type = 'file'; fileIn.accept = '.s,.asm,.txt'; fileIn.hidden = true;
      mm.append(mDown, mUp, mShare, mReset, fileIn); root.appendChild(mm);
    }
    /* cuerpo */
    var body = el('div', 'slm-body'), ed = el('div', 'slm-ed'), sim = el('div', 'slm-sim'); sim.hidden = true;
    var edHead = el('div', 'slm-edhead'), fn = el('span', 'slm-fname', file.name); edHead.append(ico('code'), fn, el('span', 'slm-edhint', T('Escribe aquí como en Notepad++ y pulsa Cargar', 'Write here as in Notepad++ and press Load')));
    var edBox = el('div', 'slm-edbox'); ed.append(edHead, edBox);
    var regs = el('div', 'slm-regs'), segs = el('div', 'slm-segs');
    var rTabs = el('div', 'slm-ptabs'), rInt = el('button', 'is-on', 'Int Regs'), rFp = el('button', '', 'FP Regs'); rInt.type = rFp.type = 'button'; rTabs.append(rInt, rFp);
    var rBox = el('div', 'slm-pane slm-regbox'); regs.append(rTabs, rBox);
    var sTabs = el('div', 'slm-ptabs'), sTxt = el('button', 'is-on', 'Text'), sDat = el('button', '', 'Data'); sTxt.type = sDat.type = 'button';
    var kChk = el('label', 'slm-kchk'), kIn = el('input'); kIn.type = 'checkbox'; kChk.append(kIn, el('span', '', T('Núcleo', 'Kernel'))); kChk.title = T('Mostrar también el segmento del núcleo', 'Also show the kernel segment');
    sTabs.append(sTxt, sDat, kChk);
    var sBox = el('div', 'slm-pane slm-segbox'); segs.append(sTabs, sBox);
    sim.append(regs, segs); body.append(ed, sim); root.appendChild(body);
    /* consola y mensajes */
    var low = el('div', 'slm-low'), lTabs = el('div', 'slm-ptabs'), lCon = el('button', 'is-on', T('Consola', 'Console')), lMsg = el('button', '', T('Mensajes', 'Messages')); lCon.type = lMsg.type = 'button';
    var lClear = el('button', 'slm-lclear', T('Limpiar', 'Clear')); lClear.type = 'button'; lTabs.append(lCon, lMsg, lClear);
    var con = el('pre', 'slm-con'), msg = el('pre', 'slm-msg'); msg.hidden = true; con.setAttribute('aria-live', 'polite');
    var inRow = el('form', 'slm-inrow'), inBox = el('input', 'slm-in'); inBox.type = 'text'; inBox.autocomplete = 'off'; inBox.spellcheck = false;
    inBox.setAttribute('aria-label', T('Entrada del programa', 'Program input')); var inOk = el('button', 'slm-btn slm-btn--go', T('Enviar', 'Send')); inOk.type = 'submit';
    inRow.append(el('span', 'slm-inlab', T('Entrada:', 'Input:')), inBox, inOk); inRow.hidden = true;
    low.append(lTabs, con, inRow, msg); root.appendChild(low);
    var status = el('div', 'slm-status'), stL = el('span', 'slm-stl'), stR = el('span', 'slm-str'); status.append(stL, stR); root.appendChild(status);

    /* ---------- utilidades de la interfaz ---------- */
    function setView(v) {
      view = v; ed.hidden = v !== 'ed'; sim.hidden = v !== 'sim';
      tEd.classList.toggle('is-on', v === 'ed'); tSim.classList.toggle('is-on', v === 'sim');
      tEd.setAttribute('aria-pressed', v === 'ed'); tSim.setAttribute('aria-pressed', v === 'sim');
      if (v === 'sim') render(); else if (cm) cm.requestMeasure();
    }
    function say(t, cls) { stL.textContent = t; status.className = 'slm-status' + (cls ? ' is-' + cls : ''); }
    function msgAdd(t, err) { if (!t) return; var s = el('span', err ? 'is-err' : '', t); msg.appendChild(s); msg.scrollTop = msg.scrollHeight; if (err) showLow('msg'); }
    function conAdd(t, cls) { if (!t) return; out += t; if (out.length > 200000) { out = out.slice(-150000); con.textContent = out; } else { var s = document.createTextNode(t); if (cls) { var sp = el('span', cls); sp.appendChild(s); con.appendChild(sp); } else con.appendChild(s); } con.scrollTop = con.scrollHeight; }
    function showLow(w) { con.hidden = w !== 'con'; msg.hidden = w !== 'msg'; lCon.classList.toggle('is-on', w === 'con'); lMsg.classList.toggle('is-on', w === 'msg'); }
    function code() { return cm ? cm.state.doc.toString() : textarea ? textarea.value : file.code; }
    function setCode(c) { if (cm) cm.dispatch({ changes: { from: 0, to: cm.state.doc.length, insert: c } }); else if (textarea) textarea.value = c; file.code = c; changed(); }
    function save() { if (libre) store(key, { name: file.name, code: code() }); }
    var saveT = null;
    function changed() { dirty = true; if (marks && cm) marks.mark(cm, []); clearTimeout(saveT); saveT = setTimeout(save, 400); }
    function busy(on) { running = on; root.classList.toggle('is-running', on); bAsm.disabled = on; bStep.disabled = on; bPause.disabled = !on; }
    function srcLine(addr) { var t = textRows.filter(function (r) { return r.addr === addr; })[0]; if (!t) return 0; if (t.line) return t.line; var i = textRows.indexOf(t); while (i > 0 && !textRows[i].line) i--; return textRows[i].line || 0; }

    /* ---------- ensamblar y cargar ---------- */
    var textRows = [], kRows = [];
    function assemble(quiet) {
      if (!mod) { say(T('Cargando el simulador…', 'Loading the simulator…')); return false; }
      if (!spim) spim = new window.SLMipsSpim(mod);
      var src = code(), r = spim.load(src, 0);
      loaded = true; dirty = false; executed = 0; lastRegs = null; waitMode = null; inRow.hidden = true;
      msg.textContent = ''; msgAdd('SPIM ' + spim.version() + '\nCopyright 1990-2017 by James Larus. All Rights Reserved.\nSPIM is distributed under a BSD license.\n' +
        T('Cargado: ', 'Loaded: ') + file.name + '\n');
      textRows = fmtText(spim.text(0)); kRows = fmtText(spim.text(1));
      Object.keys(bps).forEach(function (a) { if (textRows.some(function (t) { return t.addr === +a; })) spim.bp(+a, true); else delete bps[a]; });
      if (cfg.entrada) spim.input(String(cfg.entrada).replace(/\r/g, '') + (/\n$/.test(cfg.entrada) ? '' : '\n'));
      inputs = [];
      if (!r.ok) {
        msgAdd(r.msg.replace(/@prog/g, file.name), true);
        var em = /on line (\d+) of file/.exec(r.msg), ln = em ? +em[1] : 0;
        var lt = /\n\t(.*)\n/.exec(r.msg); if (lt) { var lines = src.split('\n'), want = lt[1].trim(); for (var k = Math.max(1, ln - 2); k <= Math.min(lines.length, ln + 1); k++) if (lines[k - 1].trim() === want) { ln = k; break; } }
        if (help.error && marks && ln) { marks.mark(cm, [{ line: ln, kind: 'err' }]); cm.dispatch({ selection: { anchor: cm.state.doc.line(Math.min(ln, cm.state.doc.lines)).from }, scrollIntoView: true }); }
        say(T('Error al ensamblar en la línea ', 'Assembly error on line ') + (ln || '?') + T(': mira «Mensajes».', ': see «Messages».'), 'err');
        loaded = false; render(); return false;
      }
      if (r.msg) msgAdd(r.msg.replace(/@prog/g, file.name));
      if (marks) marks.mark(cm, []);
      if (!quiet) say(T('Programa cargado. Pulsa Ejecutar o ve paso a paso.', 'Program loaded. Press Run or go step by step.'), 'ok');
      lastRegs = spim.regs().concat([spim.spec().HI, spim.spec().LO]);
      render(); return true;
    }

    /* ---------- ejecutar ---------- */
    function flush() { var o = spim.takeOut(), m = spim.takeMsg(); spim.clearIO(); if (o) conAdd(o); if (m) msgAdd(m.replace(/@prog/g, file.name), /Exception|Attempt|error|undefined/i.test(m)); return m; }
    function finishStatus(st, m) {
      var pc = spim.spec().PC;
      if (st === 'fin') { say(T('Programa terminado', 'Program finished') + ' · ' + executed.toLocaleString(EN ? 'en' : 'es') + T(' instrucciones', ' instructions'), 'ok'); conAdd('', ''); loaded = false; }
      else if (st === 'error') { say(T('La ejecución se ha parado por un error: mira «Mensajes».', 'Execution stopped by an error: see «Messages».'), 'err'); loaded = false; }
      else if (st === 'parada') say(T('Punto de ruptura en ', 'Breakpoint at ') + hex(pc, 8) + T('. Ejecutar sigue; Paso va de una en una.', '. Run continues; Step goes one by one.'), 'warn');
      else if (st === 'entrada') { say(T('El programa espera que escribas algo en la consola.', 'The program is waiting for you to type in the console.'), 'warn'); inRow.hidden = false; showLow('con'); setTimeout(function () { try { inBox.focus({ preventScroll: true }); } catch (e) {} }, 0); }
      else if (st === 'pausa') say(T('En pausa en ', 'Paused at ') + hex(pc, 8) + T('. Ejecutar sigue.', '. Run continues.'), 'warn');
      if (m && /Exception occurred at PC=0x([0-9a-f]+)/.test(m) && help.error && marks) { var l = srcLine(parseInt(RegExp.$1, 16)); if (l) marks.mark(cm, [{ line: l, kind: 'err' }]); }
      render();
    }
    function ensure() { if (!loaded || dirty) { conAdd(out && !/\n$/.test(out) ? '\n' : ''); if (!assemble(true)) return false; } return true; }
    function run() {
      if (running) return; if (waitMode) { inBox.focus(); return; }
      if (!ensure()) return;
      busy(true); pauseReq = false; say(T('Ejecutando…', 'Running…'));
      var t0 = Date.now(), cont = 1, base0 = spim.count();
      (function chunk() {
        var st, before = executed;
        try { st = spim.run(CHUNK, cont); } catch (e) { report(e); st = 'error'; msgAdd(String(e), true); }
        cont = 1; executed = spim.count();
        var m = flush();
        if (st === 'sigue') {
          if (pauseReq) { busy(false); return finishStatus('pausa', m); }
          if (executed - base0 >= LIMIT) { busy(false); say(T('Llevas 10 millones de instrucciones: ¿un bucle infinito? Ejecutar sigue; Parar vuelve al principio.', '10 million instructions so far: an infinite loop? Run continues; Stop goes back to the start.'), 'warn'); render(); return; }
          return setTimeout(chunk, Date.now() - t0 > 40 ? 0 : 0);
        }
        busy(false); if (st === 'entrada') waitMode = 'run';
        finishStatus(st, m);
      })();
    }
    function step() {
      if (running) return; if (waitMode) { inBox.focus(); return; }
      if (!ensure()) return;
      var pc = spim.spec().PC, st;
      try { st = spim.run(1, 1); } catch (e) { report(e); st = 'error'; }
      executed = spim.count();
      var m = flush();
      if (st === 'entrada') waitMode = 'step';
      if (st === 'sigue' || st === 'parada') { say(explain(pc), 'ok'); render(); if (m && /Exception/.test(m)) finishStatus('sigue', m); return; }
      finishStatus(st, m);
    }
    function stop() { pauseReq = true; if (running) { setTimeout(stop, 30); return; } waitMode = null; inRow.hidden = true; if (out && !/\n$/.test(out)) conAdd('\n'); assemble(true); say(T('Parado: el programa vuelve al principio.', 'Stopped: the program is back at the start.')); }
    function explain(pc) {
      var row = textRows.concat(kRows).filter(function (r) { return r.addr === pc; })[0]; if (!row) return T('Paso hecho.', 'Step done.');
      var src = row.src.replace(/^\d+:\s*/, ''), mn = (src.split(/\s+/)[0] || row.ins.split(/\s+/)[0]).toLowerCase();
      var base = T('Ejecutada: ', 'Executed: ') + (src || row.ins);
      if (help.explica && INS[mn]) base += '  →  ' + INS[mn].d;
      return base;
    }
    inRow.onsubmit = function (e) {
      e.preventDefault(); if (!spim) return;
      var v = inBox.value; inBox.value = ''; spim.input(v + '\n'); conAdd(v + '\n', 'slm-echo'); inputs.push(v);
      inRow.hidden = true; var m = waitMode; waitMode = null;
      if (m === 'step') step(); else run();
    };

    /* ---------- dibujar registros y segmentos ---------- */
    var regTab = 'int', segTab = 'text', changedRegs = {};
    function flashRegs() { /* los registros cambiados se marcan en render() */ }
    function render() {
      if (sim.hidden && view !== 'sim') { stR.textContent = spim && loaded ? 'PC = ' + hex(spim.spec().PC, 8) : ''; return; }
      renderRegs(); renderSeg(); stR.textContent = spim && loaded ? 'PC = ' + hex(spim.spec().PC, 8) : '';
    }
    function renderRegs() {
      rBox.textContent = '';
      if (!spim || !spim.x) { rBox.appendChild(el('p', 'slm-empty', T('Pulsa Cargar para ensamblar el programa.', 'Press Load to assemble the program.'))); return; }
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
      var top = sBox.scrollTop; sBox.textContent = '';
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
      sBox.appendChild(frag); sBox.scrollTop = top;
      if (curEl) { var b = sBox.getBoundingClientRect(), r = curEl.getBoundingClientRect(); if (r.top < b.top + 24 || r.bottom > b.bottom - 8) sBox.scrollTop += r.top - b.top - b.height / 3; }
      if (help.error && marks && cm && loaded && segTab) { var l = srcLine(pc); if (l) marks.mark(cm, [{ line: l, kind: 'pc' }]); }
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
    radix.onchange = function () { dec = radix.value === 'd'; render(); };
    kIn.onchange = function () { kernel = kIn.checked; renderSeg(); };
    rInt.onclick = function () { regTab = 'int'; rInt.classList.add('is-on'); rFp.classList.remove('is-on'); renderRegs(); };
    rFp.onclick = function () { regTab = 'fp'; rFp.classList.add('is-on'); rInt.classList.remove('is-on'); renderRegs(); };
    sTxt.onclick = function () { segTab = 'text'; sTxt.classList.add('is-on'); sDat.classList.remove('is-on'); renderSeg(); };
    sDat.onclick = function () { segTab = 'data'; sDat.classList.add('is-on'); sTxt.classList.remove('is-on'); renderSeg(); };
    lCon.onclick = function () { showLow('con'); }; lMsg.onclick = function () { showLow('msg'); };
    lClear.onclick = function () { out = ''; con.textContent = ''; };
    function pop(p, b) { var open = p.hidden; [hm, mm].forEach(function (x) { if (x) x.hidden = true; }); p.hidden = !open; if (open) { var rb = b.getBoundingClientRect(), rr = root.getBoundingClientRect(); p.style.top = (rb.bottom - rr.top + 6) + 'px'; p.style.right = Math.max(8, rr.right - rb.right) + 'px'; } }
    bHelp.onclick = function (e) { e.stopPropagation(); pop(hm, bHelp); };
    hm.addEventListener('change', function (e) { var k = e.target.dataset.k; if (!k) return; help[k] = e.target.checked; store(libre ? 'sl_mips_help' : 'sl_mips_help_exam', help); applyHelp(); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target) || (!hm.contains(e.target) && !(mm && mm.contains(e.target)))) { if (e.target.closest && (e.target.closest('.slm-btn') === bHelp || (bMore && e.target.closest('.slm-btn') === bMore))) return; hm.hidden = true; if (mm) mm.hidden = true; } });
    if (libre) {
      bMore.onclick = function (e) { e.stopPropagation(); pop(mm, bMore); };
      mDown.onclick = function () { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([code()], { type: 'text/plain' })); a.download = file.name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); mm.hidden = true; };
      mUp.onclick = function () { fileIn.click(); };
      fileIn.onchange = function () { var f = fileIn.files[0]; if (!f) return; if (f.size > 200000) { say(T('El fichero es demasiado grande (máximo 200 KB).', 'File too large (200 KB max).'), 'err'); return; }
        f.text().then(function (t) { file.name = f.name.replace(/[^\w.\-]/g, '_'); fn.textContent = file.name; setCode(t); setView('ed'); say(T('Fichero subido: ', 'File uploaded: ') + file.name, 'ok'); }); mm.hidden = true; fileIn.value = ''; };
      mShare.onclick = function () { packShare(code()).then(function (h) { var u = location.href.split('#')[0] + '#mips=' + h; try { navigator.clipboard.writeText(u); say(T('Enlace copiado: el código va dentro del enlace, no se guarda en ningún servidor.', 'Link copied: the code travels inside the link, no server stores it.'), 'ok'); } catch (e) { prompt(T('Copia el enlace:', 'Copy the link:'), u); } }); mm.hidden = true; };
      mReset.onclick = function () { store(key + '_prev', { name: file.name, code: code() }); file.name = fname; fn.textContent = fname; setCode(sample); setView('ed'); say(T('Has vuelto al ejemplo (tu código anterior queda guardado en este navegador).', 'Back to the example (your previous code is kept in this browser).')); mm.hidden = true; };
    }
    bFull.onclick = function () {
      var on = !root.classList.contains('is-full');
      if (on) { root.classList.add('is-full'); document.documentElement.classList.add('slm-noscroll'); try { root.requestFullscreen && root.requestFullscreen().catch(function () {}); } catch (e) {} }
      else { root.classList.remove('is-full'); document.documentElement.classList.remove('slm-noscroll'); try { document.fullscreenElement && document.exitFullscreen(); } catch (e) {} }
      if (cm) cm.requestMeasure();
    };
    document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && root.classList.contains('is-full')) { root.classList.remove('is-full'); document.documentElement.classList.remove('slm-noscroll'); } });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'F5' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); bRun.onclick(); }
      else if (e.key === 'F10') { e.preventDefault(); bStep.onclick(); }
      else if (e.key === 'Escape' && root.classList.contains('is-full') && !document.fullscreenElement) bFull.onclick();
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
      root.classList.toggle('slm-nocolor', !help.colores);
      if (cm && C) cm.dispatch({ effects: [colorsC.reconfigure(help.colores ? highlighter(C) : []), autoC.reconfigure(help.auto ? [C.autocompletion({ override: [completer(C, code)], activateOnTyping: true, icons: false }), C.closeBrackets()] : [])] });
      if (!help.error && marks && cm) marks.mark(cm, []);
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
    function makeTextarea() { edBox.textContent = ''; textarea = el('textarea', 'slm-ta-fallback'); textarea.value = file.code; textarea.spellcheck = false; textarea.oninput = changed; edBox.appendChild(textarea); }

    /* ---------- arranque ---------- */
    busy(false); bPause.disabled = true; say(T('Cargando el editor y el simulador…', 'Loading the editor and the simulator…'));
    root.classList.toggle('slm-nocolor', !help.colores);
    var shareP = shared ? unpackShare(shared).then(function (o) { if (o && typeof o.c === 'string') { if (libre) store(key + '_prev', { name: file.name, code: file.code }); file = { name: (o.n || 'programa.s').replace(/[^\w.\-]/g, '_'), code: o.c }; fn.textContent = file.name; try { history.replaceState(null, '', location.href.split('#')[0]); } catch (e) {} } }).catch(function () {}) : Promise.resolve();
    renderRegs(); renderSeg();
    shareP.then(function () {
      return loadCM().then(function (c) { C = c; makeEditor(); }, function (e) { report(e); makeTextarea(); });
    }).then(function () {
      return loadWasm().then(function (m) { mod = m; say(T('Listo. Escribe tu programa y pulsa Cargar (o Ejecutar).', 'Ready. Write your program and press Load (or Run).'), 'ok'); },
        function (e) { report(e); say(T('No se ha podido cargar el simulador. Revisa la conexión y recarga la página.', 'The simulator could not be loaded. Check your connection and reload the page.'), 'err'); });
    });
    window.addEventListener('pagehide', save);
    var api = {
      assemble: assemble, run: run, step: step, stop: stop, code: code, setCode: setCode, setView: setView,
      state: function () { return { loaded: loaded, running: running, waiting: !!waitMode, executed: executed, pc: spim && spim.x ? spim.spec().PC : 0 }; },
      output: function () { return out; }, messages: function () { return msg.textContent; },
      regs: function () { return spim && spim.x ? spim.regs() : null; }, spim: function () { return spim; },
      setHelp: function (k, v) { help[k] = !!v; applyHelp(); }, ready: function () { return !!mod && (!!cm || !!textarea); }
    };
    root.slmips = api; return api;
  }

  function boot() {
    document.querySelectorAll('.sl-mips[data-mips]:not(.slm)').forEach(function (e) {
      var cfg = {}; try { cfg = JSON.parse(e.getAttribute('data-mips') || '{}'); } catch (x) { report(x); }
      try { mount(e, cfg); } catch (x) { report(x); }
    });
  }
  window.SLMIPS = { mount: mount, boot: boot, version: '1.0' };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
