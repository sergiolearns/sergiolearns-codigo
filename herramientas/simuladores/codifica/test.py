import json, random, subprocess
import isa
REGS = isa.REG
def rr(): return random.choice(REGS)
def gen(pc, lab):
    k = random.random()
    if k < .3: return f"{random.choice(['add','addu','sub','and','or','nor','slt'])} {rr()}, {rr()}, {rr()}"
    if k < .4: return f"{random.choice(['sll','srl','sra'])} {rr()}, {rr()}, {random.randint(0,31)}"
    if k < .45: return f"jr {rr()}"
    if k < .6: return f"{random.choice(['addi','addiu','slti'])} {rr()}, {rr()}, {random.randint(-32768,32767)}"
    if k < .67: return f"{random.choice(['andi','ori'])} {rr()}, {rr()}, {random.randint(0,65535)}"
    if k < .7: return f"lui {rr()}, {random.randint(0,65535)}"
    if k < .82: return f"{random.choice(['lb','lh','lw','lbu','sb','sh','sw'])} {rr()}, {random.randint(-32768,32767)}({rr()})"
    if k < .94: return f"{random.choice(['beq','bne'])} {rr()}, {rr()}, {random.choice(list(lab))}"
    return f"{random.choice(['j','jal'])} {random.choice(list(lab))}"
random.seed(3); progs = []
for _ in range(300):
    n = random.randint(3, 14); labs = {f'L{i}': i for i in range(n)}
    base = random.choice([0x00400000, 0x00400100, 0x0FFFFFF0 & ~3, 0x00401000])
    names = {}
    lines = []
    for i in range(n):
        lines.append(f"L{i}: " + gen(base + 4*i, labs))
    progs.append({'lines': lines, 'base': base})
r = subprocess.run(['node', '-e', '''const S=require("./engine.js");const X=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(X.map(p=>{const o=S.assemble(p.lines,p.base,"apuntes");return o.rows.map(r=>r.err?("E"+r.err):[r.w,S.decode(r.w,r.pc,"apuntes").txt])})))'''], input=json.dumps(progs), capture_output=True, text=True)
if r.stderr: print(r.stderr[:2000])
out = json.loads(r.stdout); bad = 0; tot = 0; errs = 0
for p, o in zip(progs, out):
    ref, lab = isa.prog(p['lines'], p['base'])
    for (pc, l, w), x in zip(ref, o):
        tot += 1
        if isinstance(x, str):
            # j/jal fuera de la región de 256 MB: isa.py no lo comprueba
            if x == 'Eregion': errs += 1; continue
            bad += 1; print('ERR', l, x); continue
        if x[0] != w:
            bad += 1
            if bad < 6: print('MAL', hex(pc), l, hex(w), hex(x[0]))
        # decodificar y volver a codificar da la misma palabra (comparando con isa.dec)
        d = isa.dec(w, pc)
        if l.split()[0] not in ('beq','bne','j','jal'):
            if d.replace('0x', '0x') != x[1] and not (d.startswith('lui') or d.startswith('andi') or d.startswith('ori')):
                bad += 1
                if bad < 10: print('DEC', d, '|', x[1])
print('instrucciones:', tot, 'distintas:', bad, 'fuera de región:', errs)
