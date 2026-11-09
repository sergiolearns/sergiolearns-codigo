/* SergioLearns — interfaz del simulador del pipeline (.sl-sim[data-sim="pipeline"]). Necesita kit.js, spim-core.js
 * (el núcleo de SPIM del entorno MIPS), engine.js y trace.js. El wasm de SPIM se descarga de jsDelivr (data-wasm). */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, P = window.SLPipe;
  var ST = ['IF', 'ID', 'EX', 'MEM', 'WB'], SC = { IF: '#5B4BDB', ID: '#2F5FD0', EX: '#FF6B4A', MEM: '#F5A524', WB: '#16794B' };
  var MAXR = 80;
  var EX = {
    es: [
      { k: 'caja', f: 'caja.s', n: 'La caja de la cafetería', s: '        .data 0x10008000      # $gp apunta aquí\ntickets: .word 120, 85        # dos tickets\n        .text\nmain:   lw   $t0, 0($gp)      # primer ticket\n        lw   $t1, 4($gp)      # segundo ticket\n        add  $t2, $t0, $t1    # total\n        sub  $t3, $t2, $s1    # menos el descuento\n        sw   $t3, 8($gp)      # guarda el total\n        addi $s2, $s2, 1      # un cliente más\n' },
      { k: 'reord', f: 'caja-reordenada.s', n: 'La caja, reordenada', s: '        .data 0x10008000\ntickets: .word 120, 85\n        .text\nmain:   lw   $t0, 0($gp)\n        lw   $t1, 4($gp)\n        addi $s2, $s2, 1      # subida: llena el hueco del load-use\n        add  $t2, $t0, $t1\n        sub  $t3, $t2, $s1\n        sw   $t3, 8($gp)\n' },
      { k: 'bucle', f: 'suma.s', n: 'Bucle que suma un vector', s: '        .data 0x10008000\nv:      .word 4, 8, 15, 16\n        .text\nmain:   addi $s3, $zero, 4    # 4 elementos\n        add  $t1, $gp, $zero  # puntero al vector\nbucle:  lw   $t0, 0($t1)\n        add  $t2, $t2, $t0    # load-use\n        addi $t1, $t1, 4\n        addi $s3, $s3, -1\n        bne  $s3, $zero, bucle\n        sw   $t2, 16($gp)\n' },
      { k: 'bucle2', f: 'suma-reordenada.s', n: 'El bucle, reordenado', s: '        .data 0x10008000\nv:      .word 4, 8, 15, 16\n        .text\nmain:   addi $s3, $zero, 4\n        add  $t1, $gp, $zero\nbucle:  lw   $t0, 0($t1)\n        addi $s3, $s3, -1     # subida: separa el lw de su uso\n        addi $t1, $t1, 4\n        add  $t2, $t2, $t0\n        bne  $s3, $zero, bucle\n        sw   $t2, 16($gp)\n' },
      { k: 'sub', f: 'doble.s', n: 'Subrutina con jal y jr', s: '        .text\nmain:   addi $a0, $zero, 7\n        jal  doble            # salta y guarda la vuelta en $ra\n        add  $s0, $v0, $zero\n        j    fin\ndoble:  add  $v0, $a0, $a0\n        jr   $ra              # jr lee $ra en ID\nfin:    sw   $s0, 0($gp)\n' }
    ],
    en: [
      { k: 'caja', f: 'till.s', n: 'The cafeteria till', s: '        .data 0x10008000      # $gp points here\ntickets: .word 120, 85        # two receipts\n        .text\nmain:   lw   $t0, 0($gp)      # first receipt\n        lw   $t1, 4($gp)      # second receipt\n        add  $t2, $t0, $t1    # total\n        sub  $t3, $t2, $s1    # minus the discount\n        sw   $t3, 8($gp)      # store the total\n        addi $s2, $s2, 1      # one more customer\n' },
      { k: 'reord', f: 'till-reordered.s', n: 'The till, reordered', s: '        .data 0x10008000\ntickets: .word 120, 85\n        .text\nmain:   lw   $t0, 0($gp)\n        lw   $t1, 4($gp)\n        addi $s2, $s2, 1      # moved up: fills the load-use gap\n        add  $t2, $t0, $t1\n        sub  $t3, $t2, $s1\n        sw   $t3, 8($gp)\n' },
      { k: 'bucle', f: 'sum.s', n: 'Loop adding an array', s: '        .data 0x10008000\nv:      .word 4, 8, 15, 16\n        .text\nmain:   addi $s3, $zero, 4    # 4 elements\n        add  $t1, $gp, $zero  # pointer to the array\nloop:   lw   $t0, 0($t1)\n        add  $t2, $t2, $t0    # load-use\n        addi $t1, $t1, 4\n        addi $s3, $s3, -1\n        bne  $s3, $zero, loop\n        sw   $t2, 16($gp)\n' },
      { k: 'bucle2', f: 'sum-reordered.s', n: 'The loop, reordered', s: '        .data 0x10008000\nv:      .word 4, 8, 15, 16\n        .text\nmain:   addi $s3, $zero, 4\n        add  $t1, $gp, $zero\nloop:   lw   $t0, 0($t1)\n        addi $s3, $s3, -1     # moved up: separates the lw from its use\n        addi $t1, $t1, 4\n        add  $t2, $t2, $t0\n        bne  $s3, $zero, loop\n        sw   $t2, 16($gp)\n' },
      { k: 'sub', f: 'double.s', n: 'Subroutine with jal and jr', s: '        .text\nmain:   addi $a0, $zero, 7\n        jal  double           # jumps and saves the return in $ra\n        add  $s0, $v0, $zero\n        j    done\ndouble: add  $v0, $a0, $a0\n        jr   $ra              # jr reads $ra in ID\ndone:   sw   $s0, 0($gp)\n' }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'pipeline', ofw: '--anticipacion', oct: '--saltos', yes: 'si', no: 'no',
      fwL: 'Anticipación', fwOn: 'Con', fwOff: 'Sin', ctL: 'Saltos', ctN: 'No salta', ctS: 'Parar',
      fwT: 'Con anticipación, el dato viaja de EX/MEM o MEM/WB a la entrada de la ALU sin esperar al WB.', ctT: { nosaltar: 'Predecir «no salta»: se busca la siguiente; si al final salta, se tira (1 ciclo).', parar: 'Parar: tras cada salto condicional se espera un ciclo a saber si salta.' },
      ex: 'Ejemplo', share: 'Compartir', prog: 'programa', run: 'Ejecutar con SPIM', running: 'Ejecutando…', loading: 'Cargando el núcleo de SPIM…', input: 'Entrada (teclado)', inputHelp: 'Una línea por cada lectura del programa (syscall 5, 8 o 12).',
      edHelp: 'MIPS de verdad: SPIM (el núcleo de QtSpim) lo ejecuta desde main y el simulador coloca en el pipeline las instrucciones en el orden en que se ejecutaron. Las pseudoinstrucciones (li, la, move…) se ven como las instrucciones reales en que se traducen.',
      ok: 'SPIM ejecutó {n} instrucciones desde main.', cut: ' Se dibujan las {m} primeras.', endRet: ' main terminó con jr $ra.', endExc: ' Paró en una excepción: {m}', endLim: ' El programa no terminaba: se paró a las {n} instrucciones.',
      errAsm: 'SPIM no pudo ensamblarlo:', noMain: 'Falta la etiqueta main: (el programa empieza ahí).', noWasm: 'No se pudo cargar el núcleo de SPIM. Revisa la conexión y vuelve a intentarlo.', empty: 'El programa no ejecutó ninguna instrucción.',
      cyc: 'ciclo a ciclo', diag: 'diagrama de varios ciclos', res: 'resultados', cmp: 'compara (la misma traza)', start: 'Pulsa Paso para avanzar ciclo a ciclo, o Ejecutar para verlo entero.',
      bubble: 'burbuja', empty2: '—', wait: 'espera', cycle: 'ciclo', flushed: '(buscada y tirada)',
      e: {
        fetch: '{i} entra en IF.', fetchF: 'se busca la siguiente a {i}: si salta, sobra.', fetchJ: 'se busca la siguiente a {i}, que sobra: el salto la tirará.',
        stall: '{i} espera en ID: necesita {r} de {p}, que {when}.', whenWB: 'lo escribe en el banco en el ciclo {c}', whenEX: 'lo calcula al final de su EX (ciclo {c})', whenMEM: 'lo trae de memoria al final de su MEM (ciclo {c})',
        stallB: ' Los saltos comparan en ID: lo necesitan un ciclo antes que la ALU.', ctrl: '{i} es un salto condicional: con «parar», la siguiente espera a saber si salta.',
        flush: '{i} se resuelve en ID y salta: la instrucción que se buscó detrás se tira (1 ciclo perdido).', flushJ: '{i} es un salto incondicional: se resuelve en ID y la que se buscó detrás se tira (1 ciclo perdido).',
        fwd: '{i} recibe {r} por anticipación desde {path} (lo calculó {p}).', bank: '{i} lee {r} del banco en la 2.ª mitad del ciclo, el mismo en que {p} lo escribe en la 1.ª.',
        wb: '{i} escribe {r} en el banco.', mem: '{i} {acc} la memoria de datos.', ld: 'lee', st: 'escribe en', none: 'Nada nuevo: las instrucciones avanzan una etapa.',
        end: 'Fin: {n} instrucciones en {c} ciclos (CPI {cpi}).'
      },
      rows: { n: 'instrucciones', c: 'ciclos', d: 'burbujas por datos', b: 'ciclos perdidos por saltos', cpi: 'CPI (ciclos ÷ instrucciones)', ideal: 'ideal sin riesgos (4 + n)' },
      formula: 'ciclos = 4 (llenar el pipeline) + instrucciones + burbujas por datos + ciclos perdidos por saltos',
      regs: 'registros al terminar (SPIM)', noregs: 'ningún registro cambió', out: 'consola', cmpL: { 'f-n': 'con anticip. · no salta', 'f-p': 'con anticip. · parar', 'n-n': 'sin anticip. · no salta', 'n-p': 'sin anticip. · parar' },
      gain: 'La anticipación ahorra {d} ciclos aquí: el programa va {g} veces más rápido que sin ella.',
      leg: { b: 'burbuja', f: 'anticipación', w: 'escribe y lee en el mismo ciclo', x: 'buscada y tirada' },
      sel: 'Pulsa una instrucción del diagrama para ver por qué espera y de dónde saca sus datos.', selNo: '{i}: no espera ni depende de ninguna anterior.', selSrc: '{r} de {p} ({path})', selWait: 'espera {n} ciclo(s) en ID', selFrom: 'saca ', path: { 'EX/MEM': 'anticipación desde EX/MEM', 'MEM/WB': 'anticipación desde MEM/WB', banco: 'del banco de registros' },
      gDesc: 'Diagrama de varios ciclos: {n} instrucciones en {c} ciclos.',
      rules: 'Modelo de los apuntes: cinco etapas de un ciclo; el banco escribe en la 1.ª mitad y lee en la 2.ª; sin anticipación, quien lee un registro tiene su ID en el WB del productor o después; con anticipación, el dato de la ALU está al final de su EX y el de un load al final de su MEM (lw seguido de su uso: 1 burbuja); los saltos condicionales y jr comparan o leen en ID; j, jal y jr pierden siempre 1 ciclo. Las burbujas se dibujan entre el IF y el ID de la que espera. Sin saltos retardados, como QtSpim por defecto.',
      reto: 'Reto: cuenta tú los ciclos', retoLead: 'Como en la cuestión del examen: dibuja en papel el diagrama de varios ciclos de este fragmento y escribe cuántos ciclos tarda.',
      rq: { s: 'ciclos sin anticipación', f: 'ciclos con anticipación', b: 'burbujas con anticipación' }, allOk: 'Todo bien. Así se cuenta en el examen.', someBad: 'Revisa lo marcado en rojo: lo más común es olvidar que un lw seguido de su uso para un ciclo aunque haya anticipación, o contar el WB del productor un ciclo tarde.',
      file: 'programa.s'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'pipeline', ofw: '--forwarding', oct: '--branches', yes: 'on', no: 'off',
      fwL: 'Forwarding', fwOn: 'On', fwOff: 'Off', ctL: 'Branches', ctN: 'Not taken', ctS: 'Stall',
      fwT: 'With forwarding, the value travels from EX/MEM or MEM/WB to the ALU input without waiting for WB.', ctT: { nosaltar: 'Predict "not taken": the next one is fetched; if the branch is taken after all, it is discarded (1 cycle).', parar: 'Stall: after every conditional branch, wait one cycle to know whether it is taken.' },
      ex: 'Example', share: 'Share', prog: 'program', run: 'Run with SPIM', running: 'Running…', loading: 'Loading the SPIM core…', input: 'Input (keyboard)', inputHelp: 'One line for each read in the program (syscall 5, 8 or 12).',
      edHelp: 'Real MIPS: SPIM (the core of QtSpim) runs it from main and the simulator places the instructions in the pipeline in the order they were executed. Pseudo-instructions (li, la, move…) appear as the real instructions they turn into.',
      ok: 'SPIM executed {n} instructions from main.', cut: ' The first {m} are drawn.', endRet: ' main ended with jr $ra.', endExc: ' It stopped on an exception: {m}', endLim: ' The program did not end: it was stopped after {n} instructions.',
      errAsm: 'SPIM could not assemble it:', noMain: 'The main: label is missing (the program starts there).', noWasm: 'The SPIM core could not be loaded. Check your connection and try again.', empty: 'The program executed no instructions.',
      cyc: 'cycle by cycle', diag: 'multi-cycle diagram', res: 'results', cmp: 'compare (same trace)', start: 'Press Step to move cycle by cycle, or Run to watch it all.',
      bubble: 'bubble', empty2: '—', wait: 'waits', cycle: 'cycle', flushed: '(fetched, discarded)',
      e: {
        fetch: '{i} enters IF.', fetchF: 'the one after {i} is fetched: if the branch is taken, it is not needed.', fetchJ: 'the one after {i} is fetched, but it is not needed: the jump will discard it.',
        stall: '{i} waits in ID: it needs {r} from {p}, which {when}.', whenWB: 'writes it to the register file in cycle {c}', whenEX: 'computes it at the end of its EX (cycle {c})', whenMEM: 'brings it from memory at the end of its MEM (cycle {c})',
        stallB: ' Branches compare in ID: they need it one cycle before the ALU would.', ctrl: '{i} is a conditional branch: with "stall", the next one waits to know whether it is taken.',
        flush: '{i} is resolved in ID and taken: the instruction fetched behind it is discarded (1 cycle lost).', flushJ: '{i} is an unconditional jump: it is resolved in ID and the one fetched behind it is discarded (1 cycle lost).',
        fwd: '{i} gets {r} forwarded from {path} (computed by {p}).', bank: '{i} reads {r} from the register file in the 2nd half of the cycle, the same one in which {p} writes it in the 1st.',
        wb: '{i} writes {r} to the register file.', mem: '{i} {acc} data memory.', ld: 'reads', st: 'writes to', none: 'Nothing new: the instructions move one stage on.',
        end: 'Done: {n} instructions in {c} cycles (CPI {cpi}).'
      },
      rows: { n: 'instructions', c: 'cycles', d: 'data bubbles', b: 'cycles lost to branches', cpi: 'CPI (cycles ÷ instructions)', ideal: 'ideal with no hazards (4 + n)' },
      formula: 'cycles = 4 (filling the pipeline) + instructions + data bubbles + cycles lost to branches',
      regs: 'registers at the end (SPIM)', noregs: 'no register changed', out: 'console', cmpL: { 'f-n': 'forwarding · not taken', 'f-p': 'forwarding · stall', 'n-n': 'no forwarding · not taken', 'n-p': 'no forwarding · stall' },
      gain: 'Forwarding saves {d} cycles here: the program runs {g} times faster than without it.',
      leg: { b: 'bubble', f: 'forwarding', w: 'written and read in the same cycle', x: 'fetched and discarded' },
      sel: 'Tap an instruction in the diagram to see why it waits and where its data comes from.', selNo: '{i}: does not wait and depends on no earlier instruction.', selSrc: '{r} from {p} ({path})', selWait: 'waits {n} cycle(s) in ID', selFrom: 'takes ', path: { 'EX/MEM': 'forwarded from EX/MEM', 'MEM/WB': 'forwarded from MEM/WB', banco: 'from the register file' },
      gDesc: 'Multi-cycle diagram: {n} instructions in {c} cycles.',
      rules: 'Model from the course notes: five one-cycle stages; the register file writes in the 1st half and reads in the 2nd; without forwarding, a reader has its ID in the producer’s WB or later; with forwarding, an ALU result is ready at the end of its EX and a load’s at the end of its MEM (lw followed by its use: 1 bubble); conditional branches and jr compare or read in ID; j, jal and jr always lose 1 cycle. Bubbles are drawn between the IF and the ID of the waiting instruction. No delayed branches, like QtSpim by default.',
      reto: 'Challenge: count the cycles yourself', retoLead: 'Like the exam question: draw the multi-cycle diagram of this fragment on paper and write how many cycles it takes.',
      rq: { s: 'cycles without forwarding', f: 'cycles with forwarding', b: 'bubbles with forwarding' }, allOk: 'All correct. That is how it is counted in the exam.', someBad: 'Check what is marked in red: the most common slip is forgetting that a lw followed by its use stalls one cycle even with forwarding, or counting the producer’s WB one cycle late.',
      file: 'program.s'
    }
  };
  var spimP = null;
  function getSpim(url) {
    if (!spimP) spimP = (WebAssembly.compileStreaming ? WebAssembly.compileStreaming(fetch(url)).catch(function () { return fetch(url).then(function (r) { return r.arrayBuffer(); }).then(WebAssembly.compile); }) : fetch(url).then(function (r) { return r.arrayBuffer(); }).then(WebAssembly.compile))
      .then(function (m) { return new window.SLMipsSpim(m); });
    spimP.catch(function () { spimP = null; });
    return spimP;
  }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function retoProg() {   // un fragmento sin saltos, con dependencias, como el de la cuestión del examen
    var R = ['$t0', '$t1', '$t2', '$t3', '$t4', '$s1', '$s2'], out = [], defs = [];
    var n = 5 + rnd(3);
    for (var i = 0; i < n; i++) {
      var k = rnd(10), src = function () { return defs.length && Math.random() < .75 ? defs[defs.length - 1 - rnd(Math.min(2, defs.length))] : R[5 + rnd(2)]; }, d = R[rnd(5)];
      if (i === 0 || k < 3) { out.push('lw   ' + d + ', ' + 4 * rnd(6) + '($gp)'); defs.push(d); }
      else if (k < 7) { var op = ['add ', 'sub ', 'and ', 'or  ', 'slt '][rnd(5)]; out.push(op + ' ' + d + ', ' + src() + ', ' + src()); defs.push(d); }
      else if (k < 8) { out.push('addi ' + d + ', ' + src() + ', ' + (1 + rnd(9))); defs.push(d); }
      else out.push('sw   ' + src() + ', ' + 4 * rnd(6) + '($gp)');
    }
    return out;
  }
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, q = K.q, exs = EX[L];
    K.title = t.title;
    var wasm = el.getAttribute('data-wasm') || (window.SL_MIPS_BASE && window.SL_MIPS_BASE.wasm) || '';
    var S = { fw: true, ct: 'nosaltar', ex: 'caja', src: exs[0].s, inp: '' }, RUN = null, R = null, sel = -1, cur = -1;
    (function () {
      var s = K6.hashState() || K6.store('sl_sim_pipeline_' + (document.documentElement.lang || '').slice(0, 2)); if (!s) return;
      try { var o = JSON.parse(s); if (typeof o.s === 'string' && o.s.length < 6000) { S.src = o.s; S.ex = o.e || ''; S.fw = o.f !== 0; S.ct = o.c === 'p' ? 'parar' : 'nosaltar'; S.inp = typeof o.i === 'string' ? o.i.slice(0, 400) : ''; } } catch (e) {}
    })();
    var enc = function () { return JSON.stringify({ s: S.src, e: S.ex, f: S.fw ? 1 : 0, c: S.ct === 'parar' ? 'p' : 'n', i: S.inp }); };
    var exOpts = exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('');
    var ctl = '<div class="sl6-ctl"><div class="sl6-seg" role="group" aria-label="' + esc(t.fwL) + '" title="' + esc(t.fwT) + '"><span class="sl6-seg__l">' + esc(t.fwL) + '</span><button type="button" data-fw="1">' + esc(t.fwOn) + '</button><button type="button" data-fw="0">' + esc(t.fwOff) + '</button></div>'
      + '<div class="sl6-seg" role="group" aria-label="' + esc(t.ctL) + '"><span class="sl6-seg__l">' + esc(t.ctL) + '</span><button type="button" data-ct="nosaltar" title="' + esc(t.ctT.nosaltar) + '">' + esc(t.ctN) + '</button><button type="button" data-ct="parar" title="' + esc(t.ctT.parar) + '">' + esc(t.ctS) + '</button></div>'
      + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exOpts + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl + '<p class="sl6-desc"></p>'
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h sl6-pp-fn">── ' + esc(t.file) + '</h3><label class="sl6-lbl" for="' + K.id + '-ed">' + esc(t.prog) + '</label><textarea id="' + K.id + '-ed" class="sl6-ed" rows="13" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off"></textarea>'
      + '<details class="sl6-in"><summary>' + esc(t.input) + '</summary><input type="text" class="sl6-pp-inp" aria-label="' + esc(t.input) + '"><p class="sl6-help">' + esc(t.inputHelp) + '</p></details>'
      + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-a="go">' + ico('play', 14) + '<span>' + esc(t.run) + '</span></button></div><p class="sl6-help sl6-pp-msg" aria-live="polite"></p><p class="sl6-help">' + esc(t.edHelp) + '</p></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.cyc) + '</h3>' + K6.toolsHTML(K) + '<div class="sl6-pp-stages" aria-hidden="true"></div><ol class="sl6-log" aria-live="polite"></ol></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.diag) + '</h3><div class="sl6-gw sl6-pp-w"></div><p class="sl6-leg"><span><i class="sl6-sw sl6-sw--wait"></i>' + esc(t.leg.b) + '</span><span><i class="sl6-pp-lf"></i>' + esc(t.leg.f) + '</span><span><i class="sl6-pp-lw"></i>' + esc(t.leg.w) + '</span><span><i class="sl6-pp-lx">×</i>' + esc(t.leg.x) + '</span></p><p class="sl6-note sl6-pp-sel">' + esc(t.sel) + '</p></section>'
      + '<div class="sl6-bot"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.res) + '</h3><div class="sl6-res"></div><p class="sl6-note">' + esc(t.formula) + '</p><div class="sl6-pp-regs"></div></section><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.cmp) + '</h3><div class="sl6-cmp sl6-pp-cmp"></div><p class="sl6-note sl6-pp-gain"></p></section></div>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var ed = q('.sl6-ed'), inp = q('.sl6-pp-inp'), stE = q('.sl6-pp-msg'), log = q('.sl6-log');
    ed.value = S.src; inp.value = S.inp;
    if (S.inp) q('.sl6-in').open = true;
    ed.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); var a = ed.selectionStart, b = ed.selectionEnd; ed.value = ed.value.slice(0, a) + '\t' + ed.value.slice(b); ed.selectionStart = ed.selectionEnd = a + 1; }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); go(); }
    });
    ed.addEventListener('input', function () { S.src = ed.value; S.ex = ''; q('.sl6-sel').value = ''; fname(); });
    inp.addEventListener('change', function () { S.inp = inp.value; });
    function fname() { var x = exs.filter(function (e) { return e.k === S.ex; })[0]; q('.sl6-pp-fn').textContent = '── ' + (x ? x.f : t.file); return x ? x.f : t.file; }
    function cmdline() {
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">' + esc(t.ofw) + '</span> <b>' + esc(S.fw ? t.yes : t.no) + '</b> <span class="o">' + esc(t.oct) + '</span> <b>' + (S.ct === 'parar' ? (L === 'es' ? 'parar' : 'stall') : (L === 'es' ? 'nosaltar' : 'nottaken')) + '</b> ' + esc(fname());
    }
    var PL = null;
    K.N = function () { return R ? P.total(R) : 0; };
    function iname(r) { return r ? '<b class="sl6-pp-i">' + esc(r.txt) + '</b>' : ''; }
    function rowOf(n) { for (var i = 0; i < R.length; i++) if (R[i].n === n) return R[i]; return null; }
    function events(c) {   // lo que pasa en el ciclo c
      var E = t.e, out = [];
      R.forEach(function (r) {
        if (r.flushed) { var o = rowOf(r.of); if (r.IF === c) out.push(fill(o && o.jump ? E.fetchJ : E.fetchF, { i: iname(o) })); return; }
        if (r.IF === c) out.push(fill(E.fetch, { i: iname(r) }));
        if (r.IF < c && c < r.ID) {
          var w = null;
          r.why.forEach(function (x) { var p = rowOf(x.p); if (p && c < r.ID) w = { x: x, p: p }; });
          if (w && c === r.IF + 1) {
            var p = w.p, when = !S.fw ? fill(E.whenWB, { c: p.WB }) : (p.load ? fill(E.whenMEM, { c: p.MEM }) : fill(E.whenEX, { c: p.EX }));
            out.push(fill(E.stall, { i: iname(r), r: '<code>' + w.x.r + '</code>', p: iname(p), when: when }) + ((r.branch || r.jreg) && S.fw ? E.stallB : ''));
          }
        }
        var useC = (r.branch || r.jreg) ? r.ID : r.EX;
        if (useC === c) r.src.forEach(function (s) {
          var p = rowOf(s.p);
          if (s.path !== 'banco') out.push(fill(E.fwd, { i: iname(r), r: '<code>' + s.r + '</code>', path: s.path, p: iname(p) }));
        });
        if (r.ID === c) r.src.forEach(function (s) { var p = rowOf(s.p); if (s.path === 'banco' && p.WB === c) out.push(fill(E.bank, { i: iname(r), r: '<code>' + s.r + '</code>', p: iname(p) })); });
        if (r.ID === c && (r.jump || (r.branch && r.taken && S.ct !== 'parar'))) out.push(fill(r.jump ? E.flushJ : E.flush, { i: iname(r) }));
        if (r.ID === c && r.branch && S.ct === 'parar') out.push(fill(E.ctrl, { i: iname(r) }));
        if (r.MEM === c && (r.load || r.store)) out.push(fill(E.mem, { i: iname(r), acc: r.load ? E.ld : E.st }));
        if (r.WB === c && r.dest) out.push(fill(E.wb, { i: iname(r), r: '<code>' + r.dest + '</code>' }));
      });
      var seen = {}; out = out.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; });
      if (c === P.total(R)) out.push(fill(E.end, { n: nInst(), c: c, cpi: K6.num(c / nInst(), L, 2) }));
      return out.length ? out : [E.none];
    }
    function nInst() { return R.filter(function (r) { return !r.flushed; }).length; }
    function stages(c) {
      var sn = P.snapshot(R, c), h = '';
      ST.forEach(function (k) {
        var r = sn[k], w = k === 'ID' && !r && sn.IDw;
        var j = ST.indexOf(k), bub = j >= 2 && c > 0 && R.some(function (x) { return !x.flushed && x.IF < c - (j - 1) && c - (j - 1) < x.ID; });
        var txt = r ? (r.flushed ? t.flushed : r.txt) : (w ? sn.IDw.txt : (bub ? t.bubble : t.empty2));
        if (k === 'ID' && sn.IDw) txt = sn.IDw.txt;
        var cls = r && r.flushed ? ' is-x' : (k === 'ID' && sn.IDw ? ' is-wait' : (txt === t.bubble ? ' is-b' : (r ? ' is-on' : '')));
        h += '<div class="sl6-pp-st' + cls + '" style="--c:' + SC[k] + '"><b>' + k + '</b><span>' + esc(txt) + (k === 'ID' && sn.IDw ? ' <em>(' + esc(t.wait) + ')</em>' : '') + '</span></div>';
      });
      q('.sl6-pp-stages').innerHTML = h;
    }
    function diagram() {
      var w = q('.sl6-pp-w'), n = P.total(R), narrow = (w.clientWidth || 700) < 560;
      var lw = narrow ? 150 : 196, cw = narrow ? 30 : 34, rh = 26, top = 24, H = top + R.length * rh + 8, W = lw + cw * n + 8, id = K.id;
      var y = function (i) { return top + i * rh; }, x = function (c) { return lw + (c - 1) * cw; };
      var g = '<svg class="sl6-g sl6-pp" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="' + id + '-pt"><title id="' + id + '-pt">' + esc(fill(t.gDesc, { n: nInst(), c: n })) + '</title>'
        + '<defs><pattern id="' + id + '-hat" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" class="sl6-hat-bg"/><line x1="0" y1="0" x2="0" y2="5" class="sl6-pp-hl" stroke-width="2.2"/></pattern>'
        + '<marker id="' + id + '-af" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#FF6B4A"/></marker><marker id="' + id + '-aw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#A99EF5"/></marker></defs>';
      g += '<rect class="sl6-pp-now" x="' + lw + '" y="2" width="' + cw + '" height="' + (H - 4) + '" rx="6"/>';
      for (var c = 1; c <= n; c++) g += '<text class="sl6-pp-cn" x="' + (x(c) + cw / 2) + '" y="15" text-anchor="middle">' + c + '</text>';
      var idxOf = {}; R.forEach(function (r, i) { if (!r.flushed) idxOf[r.n] = i; });
      R.forEach(function (r, i) {
        var yy = y(i);
        g += '<g class="sl6-pp-row' + (sel === i ? ' is-sel' : '') + '" data-r="' + i + '" tabindex="0" role="button" aria-label="' + esc(r.flushed ? t.flushed : r.txt) + '"><rect class="sl6-pp-rbg" x="0" y="' + yy + '" width="' + W + '" height="' + rh + '"/>';
        g += '<text class="sl6-pp-lab' + (r.flushed ? ' is-x' : '') + '" x="' + (lw - 8) + '" y="' + (yy + rh / 2 + 4) + '" text-anchor="end">' + esc(r.flushed ? t.flushed : (r.txt.length > (narrow ? 18 : 24) ? r.txt.slice(0, narrow ? 17 : 23) + '…' : r.txt)) + '</text>';
        if (r.flushed) {
          g += cell(r.IF, yy, 'IF', ' is-x') + '<text class="sl6-pp-x" data-c="' + (r.IF + 1) + '" x="' + (x(r.IF + 1) + cw / 2) + '" y="' + (yy + rh / 2 + 5) + '" text-anchor="middle">×</text>';
        } else {
          for (var b = r.IF + 1; b < r.ID; b++) g += '<rect class="sl6-pp-c" data-c="' + b + '" x="' + (x(b) + 2) + '" y="' + (yy + 3) + '" width="' + (cw - 4) + '" height="' + (rh - 6) + '" rx="4" fill="url(#' + id + '-hat)"/>';
          ST.forEach(function (k) { g += cell(r[k], yy, k, ''); });
        }
        g += '</g>';
      });
      // flechas: anticipación (coral) y escribir-leer en el mismo ciclo (violeta)
      R.forEach(function (r, i) {
        if (r.flushed) return;
        r.src.forEach(function (s) {
          var pi = idxOf[s.p], p = R[pi];
          if (pi == null) return;
          var early = r.branch || r.jreg, cc = early ? r.ID : r.EX;
          if (s.path !== 'banco') {
            var pc = p.load ? p.MEM : p.EX, x1 = x(pc) + cw / 2, y1 = y(pi) + rh - 4, x2 = x(cc) + 3, y2 = y(i) + rh / 2;
            g += '<path class="sl6-pp-af" data-c="' + cc + '" d="M' + x1 + ',' + y1 + ' C' + x1 + ',' + (y2 - 2) + ' ' + (x2 - 10) + ',' + y2 + ' ' + x2 + ',' + y2 + '" marker-end="url(#' + id + '-af)"/>';
          } else if (p.WB === r.ID) {
            var xx = x(r.ID) + cw / 2;
            g += '<line class="sl6-pp-aw" data-c="' + r.ID + '" x1="' + xx + '" y1="' + (y(pi) + rh - 4) + '" x2="' + xx + '" y2="' + (y(i) + 4) + '" marker-end="url(#' + id + '-aw)"/>';
          }
        });
      });
      g += '</svg>';
      function cell(c, yy, k, extra) {
        var dark = k === 'EX' || k === 'MEM';
        return '<g class="sl6-pp-c' + extra + '" data-c="' + c + '"><rect x="' + (x(c) + 2) + '" y="' + (yy + 3) + '" width="' + (cw - 4) + '" height="' + (rh - 6) + '" rx="4" fill="' + SC[k] + '"/><text x="' + (x(c) + cw / 2) + '" y="' + (yy + rh / 2 + 4) + '" text-anchor="middle" class="sl6-pp-ct' + (dark ? ' is-ink' : '') + '">' + (k === 'MEM' ? (narrow ? 'M' : 'MEM') : k) + '</text></g>';
      }
      w.innerHTML = g;
      w.classList.toggle('is-wide', W > w.clientWidth + 4);
    }
    function paint(c) {   // c = ciclo actual (0 = todo)
      var sv = q('.sl6-pp'); if (!sv) return;
      [].forEach.call(sv.querySelectorAll('[data-c]'), function (e) { var k = +e.getAttribute('data-c'); e.classList.toggle('is-fut', c > 0 && k > c); });
      var nw = sv.querySelector('.sl6-pp-now'), lw = +nw.getAttribute('x') || 0, cw = +nw.getAttribute('width');
      if (!nw.__x0) nw.__x0 = lw;
      nw.setAttribute('x', nw.__x0 + (Math.max(1, c) - 1) * cw);
      nw.style.opacity = c > 0 ? 1 : 0;
      if (c > 0) { var wr = q('.sl6-pp-w'), cx = nw.__x0 + (c - 1) * cw; if (cx > wr.scrollLeft + wr.clientWidth - 60 || cx < wr.scrollLeft + nw.__x0) wr.scrollLeft = Math.max(0, cx - wr.clientWidth / 2); }
    }
    function results() {
      var n = nInst(), c = P.total(R), sc = P.stalls(R), r = t.rows;
      q('.sl6-res').innerHTML = '<table><tbody><tr><th>' + esc(r.n) + '</th><td>' + n + '</td></tr><tr><th>' + esc(r.d) + '</th><td>' + sc[0] + '</td></tr><tr><th>' + esc(r.b) + '</th><td>' + sc[1] + '</td></tr><tr><th>' + esc(r.ideal) + '</th><td>' + (4 + n) + '</td></tr></tbody><tfoot><tr><th>' + esc(r.c) + '</th><td>' + c + '</td></tr><tr><th>' + esc(r.cpi) + '</th><td>' + K6.num(c / n, L, 2) + '</td></tr></tfoot></table>';
      var reg = RUN.regs, ch = [];
      reg.forEach(function (v, i) { if (v !== 0 && [28, 29, 31, 1, 26, 27].indexOf(i) < 0 && RUN.used[P.NAMES[i]]) ch.push('<span class="sl6-q__c"><b style="--c:#5B4BDB">' + P.NAMES[i] + '</b>' + (Math.abs(v) > 65535 ? '0x' + (v >>> 0).toString(16).toUpperCase().padStart(8, '0') : v) + '</span>'); });
      q('.sl6-pp-regs').innerHTML = '<p class="sl6-h sl6-h--2">── ' + esc(t.regs) + '</p><div class="sl6-queue">' + (ch.join('') || '<span class="sl6-q__e">' + esc(t.noregs) + '</span>') + '</div>' + (RUN.out ? '<p class="sl6-h sl6-h--2">── ' + esc(t.out) + '</p><pre class="sl6-pp-out">' + esc(RUN.out) + '</pre>' : '');
      var combos = [['f-n', true, 'nosaltar'], ['f-p', true, 'parar'], ['n-n', false, 'nosaltar'], ['n-p', false, 'parar']], vals = combos.map(function (x) { return P.total(P.schedule(RUN.trace, { fwd: x[1], ctrl: x[2] })); }), mx = Math.max.apply(null, vals);
      q('.sl6-pp-cmp').innerHTML = combos.map(function (x, i) {
        var on = x[1] === S.fw && x[2] === S.ct;
        return '<button type="button" class="sl6-cmp__r sl6-pp-cr' + (on ? ' is-on' : '') + '" data-cmb="' + x[0] + '"><b>' + esc(t.cmpL[x[0]]) + '</b><span class="sl6-cmp__b"><i style="width:' + (100 * vals[i] / mx) + '%"></i><em>' + vals[i] + '</em></span></button>';
      }).join('');
      var cf = P.total(P.schedule(RUN.trace, { fwd: true, ctrl: S.ct })), cn = P.total(P.schedule(RUN.trace, { fwd: false, ctrl: S.ct }));
      q('.sl6-pp-gain').textContent = cn > cf ? fill(t.gain, { d: cn - cf, g: K6.num(cn / cf, L, 2) }) : '';
    }
    function selInfo() {
      var el2 = q('.sl6-pp-sel');
      if (sel < 0 || !R[sel] || R[sel].flushed) { el2.innerHTML = esc(t.sel); return; }
      var r = R[sel], parts = [];
      if (r.stall) parts.push(fill(t.selWait, { n: r.stall }));
      if (r.src.length) parts.push(t.selFrom + r.src.map(function (s) { return fill(t.selSrc, { r: '<code>' + s.r + '</code>', p: iname(rowOf(s.p)), path: t.path[s.path] }); }).join(', '));
      el2.innerHTML = parts.length ? iname(r) + ': ' + parts.join('; ') + '.' : fill(t.selNo, { i: iname(r) });
    }
    function draw(k, going) {
      if (!R) return;
      var n = P.total(R), c = going ? k + 1 : 0;
      if (!log.__built) {
        var h = '<li class="sl6-log__0">' + esc(t.start) + '</li>';
        for (var i = 1; i <= n; i++) h += '<li data-k="' + (i - 1) + '" hidden><span class="sl6-log__t">' + esc(t.cycle) + ' ' + i + '</span><span>' + events(i).join(' ') + '</span></li>';
        log.innerHTML = h; log.__built = true;
      }
      [].forEach.call(log.querySelectorAll('li[data-k]'), function (li) { var j = +li.getAttribute('data-k'); li.hidden = !going || j > k; li.classList.toggle('is-cur', going && j === k); });
      log.querySelector('.sl6-log__0').style.display = going ? 'none' : '';
      var curE = log.querySelector('.is-cur'); if (curE) log.scrollTop = curE.offsetTop - log.offsetTop - 8;
      stages(c); paint(c);
    }
    K.draw = draw;
    PL = K6.player(K);
    function sync() {
      [].forEach.call(K.qa('[data-fw]'), function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-fw') === '1') === S.fw)); });
      [].forEach.call(K.qa('[data-ct]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ct') === S.ct)); });
      q('.sl6-desc').textContent = (S.fw ? t.fwT : '') + (S.fw ? ' ' : '') + t.ctT[S.ct];
      cmdline();
    }
    function resched() {
      if (!RUN) return;
      R = P.schedule(RUN.trace, { fwd: S.fw, ctrl: S.ct }); log.__built = false; sel = -1;
      diagram(); results(); selInfo(); PL.reset();
      K6.store('sl_sim_pipeline_' + (document.documentElement.lang || '').slice(0, 2), enc()); K6.keepHash(enc());
    }
    function status(msg, bad) { stE.innerHTML = msg; stE.classList.toggle('is-bad', !!bad); }
    function go() {
      S.src = ed.value; S.inp = inp.value;
      var b = q('[data-a="go"]'); b.disabled = true; status(esc(t.loading));
      getSpim(wasm).then(function (sp) {
        var r = window.SLPipeTrace(sp, S.src, { max: MAXR, input: S.inp });
        b.disabled = false;
        if (!r.ok) { status(r.msg === 'nomain' ? esc(t.noMain) : esc(t.errAsm) + '<pre class="sl6-pp-out">' + esc(r.msg.replace(/@prog/g, fname())) + '</pre>', true); return; }
        if (!r.trace.length) { status(esc(t.empty), true); return; }
        var used = {}; r.trace.forEach(function (e) { if (e.d.dest) used[e.d.dest] = 1; });
        r.used = used; RUN = r;
        var m = fill(t.ok, { n: r.n + (r.trace.length && r.trace[r.trace.length - 1].exit ? 1 : 0) }) + (r.cut ? fill(t.cut, { m: r.trace.length }) : '') + (r.end === 'ret' ? t.endRet : '') + (r.end === 'exc' ? fill(t.endExc, { m: (r.msg || '').split('\n').slice(0, 2).join(' ') }) : '') + (r.end === 'lim' ? fill(t.endLim, { n: r.n }) : '');
        status(esc(m), r.end === 'exc');
        resched();
      }, function () { b.disabled = false; status(esc(t.noWasm), true); });
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fw],[data-ct],[data-a],[data-cmb],.sl6-pp-row'); if (!b || !el.contains(b)) return;
      if (b.hasAttribute('data-fw')) { S.fw = b.getAttribute('data-fw') === '1'; sync(); resched(); }
      else if (b.hasAttribute('data-ct')) { S.ct = b.getAttribute('data-ct'); sync(); resched(); }
      else if (b.hasAttribute('data-cmb')) { var v = b.getAttribute('data-cmb'); S.fw = v[0] === 'f'; S.ct = v[2] === 'p' ? 'parar' : 'nosaltar'; sync(); resched(); }
      else if (b.classList.contains('sl6-pp-row')) { sel = +b.getAttribute('data-r'); [].forEach.call(K.qa('.sl6-pp-row'), function (g) { g.classList.toggle('is-sel', +g.getAttribute('data-r') === sel); }); selInfo(); }
      else { var a = b.getAttribute('data-a'); if (a === 'go') go(); else if (a === 'share') K6.share(K, b, enc()); else if (a === 'theme') K6.toggleTheme(K); }
    });
    el.addEventListener('keydown', function (e) { var g = e.target.closest && e.target.closest('.sl6-pp-row'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.src = x.s; ed.value = x.s; fname(); cmdline(); go();
    });
    q('.sl6-sel').value = S.ex;
    var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { if (R) { diagram(); PL.draw(); } }, 150); });
    // reto
    var RT = null;
    function retoNew() {
      var prog = retoProg(), tr = prog.map(function (s) { return { txt: s }; });
      RT = { prog: prog, s: P.total(P.schedule(tr, { fwd: false })), f: P.total(P.schedule(tr, { fwd: true })), b: P.stalls(P.schedule(tr, { fwd: true }))[0] };
      var box = q('.sl6-reto'), keys = ['s', 'f', 'b'];
      box.innerHTML = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><pre class="sl6-pp-code">' + esc(prog.join('\n')) + '</pre>'
        + '<div class="sl6-pp-rq">' + keys.map(function (k) { return '<label><span>' + esc(t.rq[k]) + '</span><input type="number" min="0" inputmode="numeric" data-rq="' + k + '"></label>'; }).join('') + '</div>'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-r="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-r="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-r="sol">' + ico('arrow', 16) + esc(K.t.sol) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-r]'); if (!b) return; var a = b.getAttribute('data-r');
      if (a === 'new') retoNew();
      else if (a === 'check') {
        var good = 0;
        [].forEach.call(K.qa('[data-rq]'), function (i) { var ok = i.value !== '' && +i.value === RT[i.getAttribute('data-rq')]; i.classList.toggle('is-ok', ok); i.classList.toggle('is-bad', !ok); good += ok; });
        q('.sl6-reto__msg').innerHTML = good === 3 ? '<b>' + esc(t.allOk) + '</b>' : esc(t.someBad);
      } else if (a === 'sol') {
        S.src = '        .text\nmain:   ' + RT.prog.join('\n        ') + '\n'; S.ex = ''; ed.value = S.src; q('.sl6-sel').value = ''; S.fw = false; sync(); fname(); cmdline(); go();
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
    K.onTheme = function () {};
    sync(); retoNew(); go();
  }
  K6.boot('.sl-sim[data-sim="pipeline"]', init);
})();
