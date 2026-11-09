"""Pruebas de rendimiento y E/S (rendimiento/engine.js) contra los scripts de los temas 12 y 15: el cierre de caja (CPI 1,70,
3,40 s frente a 2,60 s y los MIPS que eligen al lento), Amdahl (el carro de 120 s y el benchmark de 120 s: CPU ×5 → 1,25,
memoria ×2 → 1,20) y la tarde de videojuegos (ratón de 1000 Hz, SSD de 2000 MB/s: consulta 1250 %, interrupciones 1562,5 %
y DMA 5 %); más 5000 casos al azar con las fórmulas de los artículos."""
import json, random, subprocess, os
here = os.path.dirname(os.path.abspath(__file__))
def js(code, data):
    r = subprocess.run(['node', '-e', 'const R=require("%s/engine.js");const X=JSON.parse(require("fs").readFileSync(0));console.log(JSON.stringify(%s))' % (here, code)], input=json.dumps(data), capture_output=True, text=True)
    if r.stderr: print(r.stderr[:1500])
    return json.loads(r.stdout)
cl = [{'n': 'aritméticas', 'cpi': 1}, {'n': 'memoria', 'cpi': 2}, {'n': 'saltos', 'cpi': 3}]
o = js('R.cpu(X.cl,X.p)', {'cl': cl, 'p': [{'n': 'actual', 'F': 2e9, 'cuenta': [2e9, 1.2e9, 0.8e9]}, {'n': 'nuevo', 'F': 2e9, 'cuenta': [1e9, 1.2e9, 0.6e9]}]})
a, b = o['r']
assert abs(a['cpi'] - 1.7) < 1e-12 and abs(a['T'] - 3.4) < 1e-12 and abs(b['T'] - 2.6) < 1e-12 and o['mipsWrong'] and o['fast']['n'] == 'nuevo', o
assert round(a['mips']) == 1176 and round(b['mips']) == 1077
A = js('[R.amdahl(X.a),R.amdahl(X.b),R.amdahl(X.c)]', {'a': [{'n': 'resto', 't': 60, 's': 1}, {'n': 'escáner', 't': 60, 's': 4}],
        'b': [{'n': 'CPU', 't': 30, 's': 5}, {'n': 'memoria', 't': 40, 's': 1}, {'n': 'disco', 't': 50, 's': 1}],
        'c': [{'n': 'CPU', 't': 30, 's': 1}, {'n': 'memoria', 't': 40, 's': 2}, {'n': 'disco', 't': 50, 's': 1}]})
assert abs(A[0]['G'] - 1 / (0.5 + 0.5 / 4)) < 1e-12 and abs(A[1]['G'] - 1.25) < 1e-12 and abs(A[2]['G'] - 1.2) < 1e-12
assert abs(A[1]['r'][0]['alone'] - 1.25) < 1e-12 and abs(A[0]['r'][1]['lim'] - 2) < 1e-12
I = js('[R.io(X.ssd),R.io(X.raton)]', {'ssd': {'F': 4e9, 'cons': 400, 'int': 500, 'dmaP': 2000, 'dmaF': 1200, 'rate': 2000e6, 'unit': 16, 'block': 32000, 'act': 1, 'polls': 0},
                                         'raton': {'F': 4e9, 'cons': 400, 'int': 500, 'dmaP': 2000, 'dmaF': 1200, 'rate': 1000, 'unit': 1, 'block': 32000, 'act': 1, 'polls': 1000}})
assert abs(I[0]['cons']['p'] - 1250) < 1e-9 and abs(I[0]['int']['p'] - 1562.5) < 1e-9 and abs(I[0]['dma']['p'] - 5) < 1e-9, I[0]
assert abs(I[1]['cons']['p'] - 0.01) < 1e-12 and abs(I[0]['tie'] - 0.8) < 1e-12
random.seed(8); C = []
for _ in range(5000):
    n = random.randint(1, 5); cls = [{'n': str(i), 'cpi': random.randint(1, 8)} for i in range(n)]
    ps = [{'n': 'p%d' % j, 'F': random.choice([1e9, 2e9, 2.5e9, 3e9, 4e9]), 'cuenta': [random.randint(0, 10 ** 9) for _ in range(n)]} for j in range(2)]
    parts = [{'n': str(i), 't': random.randint(1, 100), 's': random.choice([1, 1, 2, 4, 5, 10])} for i in range(random.randint(1, 5))]
    C.append({'c': cls, 'p': ps, 'a': parts})
out = js('X.map(c=>[R.cpu(c.c,c.p).r.map(r=>[r.cpi,r.T,r.mips]),R.amdahl(c.a).G])', C); bad = 0
for c, (cp, g) in zip(C, out):
    for p, (cpi, T, mips) in zip(c['p'], cp):
        cy = sum(k * x['cpi'] for k, x in zip(p['cuenta'], c['c'])); N = sum(p['cuenta'])
        ref = (cy / N if N else 0, cy / p['F'], N / (cy / p['F'] * 1e6) if cy else 0)
        if any(abs(u - v) > 1e-9 * max(1, abs(u)) for u, v in zip(ref, (cpi, T, mips))): bad += 1
    t0 = sum(x['t'] for x in c['a']); t1 = sum(x['t'] / x['s'] for x in c['a'])
    if abs(t0 / t1 - g) > 1e-12: bad += 1
print('artículos: bien · casos al azar:', len(C), 'distintos:', bad)
