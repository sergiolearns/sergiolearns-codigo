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
