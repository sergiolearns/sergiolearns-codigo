import json, random, subprocess, sys
sys.path.insert(0, '.')
import pipe
def js(cases):
    r = subprocess.run(['node', '-e', '''const P=require("./engine.js");const C=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(C.map(c=>{const rows=P.schedule(c.p.map((t,i)=>({txt:t,taken:c.tk.includes(i)})),{fwd:c.f,ctrl:c.c});
return rows.map(r=>r.flushed?['F',r.IF]:[r.IF,r.ID,r.WB,r.stall,r.ctrl,r.src.map(s=>[s.r,s.p,s.path])])})))'''], input=json.dumps(cases), capture_output=True, text=True)
    if r.stderr: print(r.stderr[:2000])
    return json.loads(r.stdout)
def py(c):
    rows = pipe.schedule(c['p'], fwd=c['f'], ctrl=c['c'], taken=set(c['tk']))
    return [['F', r['IF']] if r['flushed'] else [r['IF'], r['ID'], r['WB'], r['stall'], r.get('ctrl', 0), [list(s) for i,s in enumerate(r['src']) if s not in r['src'][:i]]] for r in rows]
R = ['$t0', '$t1', '$t2', '$t3', '$s0', '$s1', '$zero']
def rnd():
    k = random.random(); a, b, c = (random.choice(R) for _ in range(3))
    if k < .25: return f'{random.choice(["add","sub","and","or","slt"])} {a}, {b}, {c}'
    if k < .45: return f'{random.choice(["addi","andi","ori","slti"])} {a}, {b}, {random.randint(-8,8)}'
    if k < .65: return f'lw {a}, {4*random.randint(0,5)}({b})'
    if k < .8: return f'sw {a}, {4*random.randint(0,5)}({b})'
    if k < .95: return f'{random.choice(["beq","bne"])} {a}, {b}, L'
    return 'j L'
random.seed(7); cases = []
for _ in range(6000):
    p = [rnd() for _ in range(random.randint(1, 12))]
    tk = [i for i, s in enumerate(p) if s.startswith('b') and random.random() < .5]
    cases.append({'p': p, 'tk': tk, 'f': random.random() < .5, 'c': random.choice(['parar', 'nosaltar'])})
o = js(cases); bad = 0
for c, x in zip(cases, o):
    if py(c) != x:
        bad += 1
        if bad < 3: print(c, '\n', py(c), '\n', x)
print('aleatorios:', len(cases), 'distintos:', bad)
