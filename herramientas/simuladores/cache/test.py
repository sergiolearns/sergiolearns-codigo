import json, random, subprocess, sys
pass
import ref as A; B = A
def js(cases):
    r = subprocess.run(['node', '-e', '''const C=require("./engine.js");const X=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(X.map(c=>{const o=C.sim(c.acc,c.cfg);return {t:o.steps.map(s=>s.t),st:o.steps.map(s=>s.state),ev:o.steps.map(s=>s.ev),wb:o.steps.map(s=>s.wb),bits:o.bits.total,rate:o.rate}})))'''], input=json.dumps(cases), capture_output=True, text=True)
    if r.stderr: print(r.stderr[:1500])
    return json.loads(r.stdout)
bad = 0; ok = 0
def chk(n, a, b):
    global bad, ok
    if a == b: ok += 1
    else:
        bad += 1
        if bad < 5: print('MAL', n, a, b)
# casos del artículo: tema 13 cuestión tipo examen 70 % y 728 bits; tema 14: 60 %, 736 bits
q13 = [36, 100, 16, 32, 20, 176, 104, 96, 180, 108]
q14 = [172, 236, 172, 104, 188, 132, 128, 184, 168, 232]
o = js([{'acc': q13, 'cfg': {'lines': 8, 'words': 2, 'ways': 1}}, {'acc': q14, 'cfg': {'lines': 8, 'words': 2, 'ways': 2, 'policy': 'lru'}}])
chk('q13 fallos', o[0]['rate'], .7); chk('q13 bits', o[0]['bits'], 728); chk('q14', o[1]['rate'], .6); chk('q14 bits', o[1]['bits'], 736)
random.seed(5); cases = []; refs = []
for _ in range(4000):
    lines = random.choice([2, 4, 8, 16]); words = random.choice([1, 2, 4]); n = random.randint(1, 24)
    seq = [4 * random.randint(0, 80) + random.randint(0, 3) * (random.random() < .2) for _ in range(n)]
    k = random.random()
    if k < .4:   # directa con escrituras (svg_p13.sim)
        ops = [random.choice('LLE') for _ in seq]; pol = random.choice(['directa', 'post'])
        cases.append({'acc': [{'a': a, 'op': p} for a, p in zip(seq, ops)], 'cfg': {'lines': lines, 'words': words, 'ways': 1, 'write': pol}})
        r = A.sim(seq, lines, words, ops, pol)
        refs.append(('d', r, lines))
    else:        # asociativa (svg_p14.simv)
        ways = random.choice([w for w in [1, 2, 4, 8, 16] if w <= lines]); pol = random.choice(['lru', 'fifo'])
        cases.append({'acc': seq, 'cfg': {'lines': lines, 'words': words, 'ways': ways, 'policy': pol}})
        refs.append(('v', B.simv(seq, lines, words, ways, pol), lines))
o = js(cases)
for (k, r, lines), x, c in zip(refs, o, cases):
    chk('tipos', [s['t'] for s in r], x['t'])
    if k == 'v':
        chk('estado', [s['state'] for s in r], x['st']); chk('sale', [s['ev'] for s in r], x['ev'])
    else:
        # sim() guarda la etiqueta por línea; el JS guarda el bloque: etiqueta = bloque // líneas
        chk('estado', [s['state'] for s in r], [[(b // lines if b is not None else None) for [b] in st] for st in x['st']])
        chk('wb', [s['wb'] for s in r], x['wb'])
print('ok', ok, 'mal', bad)
