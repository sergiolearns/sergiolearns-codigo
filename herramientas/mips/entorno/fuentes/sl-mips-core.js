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
