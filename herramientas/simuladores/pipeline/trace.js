/* SergioLearns — traza dinámica para el simulador del pipeline: ejecuta el programa con el núcleo de SPIM del entorno MIPS
 * (SLMipsSpim) instrucción a instrucción, desde main, y apunta cada una con su PC, su línea y si el salto saltó.
 * SLPipeTrace(spim, fuente, {max, input}) -> {ok, msg, trace, n, cut, out, regs, end}. */
(function (G) {
  var P = G.SLPipe || (typeof require !== 'undefined' ? require('./engine.js') : null);
  function SLPipeTrace(spim, src, o) {
    o = o || {};
    var max = o.max || 120, lim = o.limit || 200000, inp = String(o.input || '').split('\n'), r = spim.load(src);
    if (!r.ok) return { ok: false, msg: r.msg || 'error' };
    var main = spim.sym('main');
    if (!main) return { ok: false, msg: 'nomain' };
    var k = 0, jal = 0;
    while (spim.spec().PC !== main && k++ < 64) {    // el código de arranque de SPIM, hasta el jal main
      var pc0 = spim.spec().PC;
      if (/\bjal\b/.test(spim.inst(pc0))) jal = pc0;
      if (spim.run(1, 1) !== 'sigue') break;
    }
    if (spim.spec().PC !== main) return { ok: false, msg: 'nomain' };
    var trace = [], end = 'fin', steps = 0, cut = false;
    for (;;) {
      var pc = spim.spec().PC;
      if (jal && pc > jal && pc <= jal + 12) { end = 'ret'; break; }   // main volvió con jr $ra al código de arranque
      if (pc >= 0x80000000) { end = 'exc'; break; }                 // excepción: SPIM salta a su rutina del núcleo
      var raw = spim.inst(pc);
      if (/<none>/.test(raw)) { end = 'fin'; break; }               // el programa se acabó sin syscall 10
      var m = /;\s*(\d+):/.exec(raw), ins = raw.replace(/^\[0x[0-9a-f]+\]\s+0x[0-9a-f]+\s+/, '').split(';')[0].trim();
      var d = P.decode(ins), v0 = spim.regs()[2];
      if (d.op === 'syscall' && (v0 === 5 || v0 === 9 || v0 === 12)) d.dest = '$v0';
      if (d.op === 'syscall' && v0 === 10) { if (trace.length < max) trace.push({ d: d, txt: d.txt, pc: pc, line: m ? +m[1] : null, taken: false, exit: true }); else cut = true; end = 'fin'; break; }
      var st = spim.run(1, 1);
      if (st === 'entrada') { spim.input((inp.length ? inp.shift() : '') + '\n'); st = spim.run(1, 1); }
      var np = spim.spec().PC;
      if (trace.length < max) trace.push({ d: d, txt: d.txt, pc: pc, line: m ? +m[1] : null, taken: d.branch && np !== ((pc + 4) >>> 0) });
      else cut = true;
      steps++;
      if (st === 'fin') { end = 'fin'; break; }
      if (st === 'error') { end = 'error'; break; }
      if (st === 'parada') continue;
      if (steps > lim) { end = 'lim'; break; }
      if (cut && steps > max + 5000) { end = 'lim'; break; }
    }
    return { ok: true, msg: spim.takeMsg ? spim.takeMsg() : '', trace: trace, n: steps, cut: cut, out: spim.takeOut(), regs: spim.regs(), end: end };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = SLPipeTrace; else G.SLPipeTrace = SLPipeTrace;
})(this);
