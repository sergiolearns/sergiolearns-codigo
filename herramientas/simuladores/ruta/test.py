"""Pruebas de la ruta de datos (ruta/engine.js) contra kit-papel/monociclo.py: programas al azar con todas las instrucciones
de la RD básica y de las ampliaciones (addi se añade aquí a monociclo con la misma fila que slti salvo ALUOp = 00),
ejecutados ciclo a ciclo; se comparan todos los cables, las señales y los registros y la memoria tras cada flanco.
Y el ejemplo de la taquilla del tema 9 (120 plazas, vende de 4 en 4: 30 vueltas)."""
import json, random, subprocess, os
import isa, monociclo as mc

mc.NOMBRE_OP[8] = 'addi'
mc.TABLA['addi'] = dict(mc.TABLA['slti'], ALUOp='00')
REGS = ['$zero', '$t0', '$t1', '$t2', '$t3', '$s0', '$s1', '$a0', '$a1', '$v0', '$ra', '$sp']

def gen(lab, n):
    k = random.random()
    r = lambda: random.choice(REGS)
    if k < .25: return f"{random.choice(['add', 'sub', 'and', 'or', 'slt', 'nor'])} {r()}, {r()}, {r()}"
    if k < .38: return f"{random.choice(['addi', 'slti'])} {r()}, {r()}, {random.randint(-300, 300)}"
    if k < .55: return f"{random.choice(['lw', 'sw'])} {r()}, {4 * random.randint(-3, 6)}($s1)"
    if k < .8: return f"{random.choice(['beq', 'bne'])} {r()}, {r()}, {random.choice(lab)}"
    if k < .9: return f"jal {random.choice(lab)}"
    return f"j {random.choice(lab)}"

random.seed(9); cases = []
for _ in range(400):
    n = random.randint(4, 14); lab = [f'L{i}' for i in range(n)]
    base = random.choice([0x00400000, 0x00400100, 0x0FFFFF00])
    lines = [f'L{i}: ' + gen(lab, n) for i in range(n)]
    init = {16: random.randint(0, 2**32 - 1), 17: 0x10010000, 8: random.randint(-50, 50) & 0xFFFFFFFF, 4: random.randint(0, 9)}
    mem = {0x10010000 + 4 * j: random.randint(0, 2**32 - 1) if random.random() < .3 else random.randint(-9, 9) & 0xFFFFFFFF for j in range(-3, 7)}
    txt = '\n'.join([f'{isa.REG[k]} = 0x{v:X}' for k, v in init.items()] + [f'M[0x{a:X}] = {v}' for a, v in mem.items()])
    cases.append({'lines': lines, 'base': base, 'init': txt, 'reg': init, 'mem': mem})
cases.append({'lines': ['VENDE: lw $t0, 8($s0)', 'sub $t0, $t0, $a0', 'sw $t0, 8($s0)', 'beq $t0, $zero, LLENO', 'j VENDE', 'LLENO: sll $zero, $zero, 0'],
              'base': 0x00400000, 'init': '$s0 = 0x10010000\n$a0 = 4\nM[0x10010008] = 120', 'reg': {16: 0x10010000, 4: 4}, 'mem': {0x10010008: 120}})
here = os.path.dirname(os.path.abspath(__file__))
js = '''const I=require("%s/../codifica/engine.js"),S=require("%s/engine.js");const X=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(X.map(p=>{const o=S.run(p.lines,p.base,p.init,{addi:1,slti:1,bne:1,jal:1},I,400);
return {stop:o.stop,err:o.rows.filter(r=>r.err).map(r=>r.err+':'+r.src),steps:o.steps.map(s=>({pc:s.pc,c:s.c,s:s.s,reg:s.reg,mem:s.mem}))}})))''' % (here, here)
r = subprocess.run(['node', '-e', js], input=json.dumps(cases), capture_output=True, text=True)
if r.stderr: print(r.stderr[:3000])
out = json.loads(r.stdout)
KEYS = ['PC', 'Instruccion', 'PC+4', 'Dato1', 'Dato2', 'ExtSigno', 'RegEscribir', 'B', 'OperacionALU', 'ResultadoALU', 'Zero', 'DestinoBeq',
        'DireccionJ', 'DatoLeidoMem', 'DatoEscribir', 'PCSrc', 'PCtrasBeq', 'PCsiguiente']
bad = steps = 0; stops = {}
for p, o in zip(cases, out):
    stops[o['stop']] = stops.get(o['stop'], 0) + 1
    if o['err']: print('ERR', o['err']); bad += 1; continue
    prog, labs = isa.prog(p['lines'], p['base']); W = {pc: w for pc, l, w in prog}
    reg = [0] * 32
    for k, v in p['reg'].items(): reg[k] = v
    mem = dict(p['mem']); pc = p['base']
    for st in o['steps']:
        steps += 1
        c, s = mc.paso(pc, W[pc], reg, mem)
        for k in KEYS:
            if c[k] != st['c'][k]:
                bad += 1
                if bad < 8: print('CABLE', hex(pc), k, c[k], st['c'][k], p['lines'])
        for k, v in s.items():
            if st['s'].get(k) != v:
                bad += 1
                if bad < 8: print('SEÑAL', k, v, st['s'].get(k))
        if reg != st['reg'] or {int(k): v for k, v in st['mem'].items()} != mem:
            bad += 1
            if bad < 8: print('ESTADO', hex(pc))
        pc = c['PCsiguiente']
taq = out[-1]
assert taq['stop'] == 'end' and len(taq['steps']) == 30 * 5 - 1 + 1, len(taq['steps'])
print('programas:', len(cases), 'ciclos:', steps, 'distintos:', bad, 'paradas:', stops, 'taquilla:', len(taq['steps']), 'ciclos')
