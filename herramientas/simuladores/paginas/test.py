import json, subprocess, random
from ref import ref
def js(cases):
    r = subprocess.run(['node','-e','''const f=require("./engine.js");const C=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(C.map(c=>{const o=f(c.r,c.n,c.a);return {f:o.faults,fr:o.steps.map(s=>s.frames),out:o.steps.map(s=>s.out),comp:o.comp}})))'''],
        input=json.dumps(cases), capture_output=True, text=True)
    if r.stderr: print(r.stderr)
    return json.loads(r.stdout)
gcc = [1,2,1,3,5,1,2,4,7,1,4,7,3,7,4]
bel = [3,1,4,2,3,1,5,3,1,4,2,5]
known = [(gcc,3,'fifo',11),(gcc,3,'lru',9),(gcc,3,'opt',7),(bel,3,'fifo',9),(bel,4,'fifo',10),(bel,3,'lru',10),(bel,4,'lru',8),(bel,3,'opt',7),(bel,4,'opt',6)]
o = js([{'r':r,'n':n,'a':a} for r,n,a,_ in known])
for (r,n,a,e),x in zip(known,o):
    print('OK ' if x['f']==e else 'MAL', a, n, x['f'], e)
# trazas del artículo (columnas de marcos tras cada referencia, marco 5/9/2)
art = {'fifo':'1 12 12 123 523 513 512 412 472 471 471 471 371 341 347'.split(),
       'opt':'1 12 12 123 125 125 125 145 147 147 147 147 347 347 347'.split(),
       'lru':'1 12 12 123 153 153 152 142 742 741 741 741 743 743 743'.split()}
for a,cols in art.items():
    x = js([{'r':gcc,'n':3,'a':a}])[0]['fr']
    got = [''.join(str(v) for v in f if v is not None) for f in x]
    print('traza', a, 'OK' if got==cols else 'MAL '+str(got))
random.seed(11); cases=[]
for _ in range(5000):
    L = random.randint(1,30); P = random.randint(1,10)
    cases.append({'r':[random.randrange(P) for _ in range(L)],'n':random.randint(1,7),'a':random.choice(['fifo','lru','opt'])})
o = js(cases); bad = 0
for c,x in zip(cases,o):
    f, fotos, fuera = ref(c['r'], c['n'], c['a'])
    if f != x['f'] or fotos != x['fr'] or fuera != x['out'] or x['comp'] != len(set(c['r'])): bad += 1
print('aleatorios:', len(cases), 'distintos:', bad)
# el óptimo nunca da más fallos que FIFO ni LRU
worse = 0
for c in cases[:2000]:
    fo = ref(c['r'],c['n'],'opt')[0]
    if fo > ref(c['r'],c['n'],'fifo')[0] or fo > ref(c['r'],c['n'],'lru')[0]: worse += 1
print('óptimo peor que otro:', worse)
