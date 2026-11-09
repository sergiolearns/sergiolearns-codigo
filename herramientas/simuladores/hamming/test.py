"""Pruebas de Hamming en vivo (hamming/engine.js) contra enc(), chk(), flip() y datos() de kit-papel/svg_p7.py (copiados aquí):
los casos de los artículos (0101 → 0101101; 0110101 con paridad impar → bit 6, información 0011; el (15,11)) y 20000 al azar
con 0, 1 y 2 bits cambiados."""
import json, random, subprocess, os
def ispar(i): return i & (i - 1) == 0
def enc(d, par=True):
    n = 1
    while sum(1 for i in range(1, n + 1) if not ispar(i)) < len(d): n += 1
    b = [0] * (n + 1)
    for p, c in zip([i for i in range(1, n + 1) if not ispar(i)], reversed(d)): b[p] = int(c)
    p = 1
    while p <= n:
        u = sum(b[i] for i in range(1, n + 1) if i & p and i != p); b[p] = u % 2 if par else 1 - u % 2; p *= 2
    return ''.join(str(b[i]) for i in range(n, 0, -1))
def chk(w, par=True):
    n = len(w); b = [0] + [int(c) for c in reversed(w)]; s = 0; p = 1
    while p <= n:
        u = sum(b[i] for i in range(1, n + 1) if i & p); s += p if u % 2 != (0 if par else 1) else 0; p *= 2
    return s
def flip(w, pos): i = len(w) - pos; return w[:i] + ('1' if w[i] == '0' else '0') + w[i + 1:]
def datos(w): n = len(w); return ''.join(w[n - i] for i in range(n, 0, -1) if not ispar(i))
assert enc('0101') == '0101101' and chk('0111101') == 5
assert chk('0110101', False) == 6 and datos(flip('0110101', 6)) == '0011'
random.seed(4); cases = []
for _ in range(20000):
    k = random.choice([1, 2, 3, 4, 4, 4, 5, 8, 11, 11, 16, 26]); d = ''.join(random.choice('01') for _ in range(k)); par = random.random() < .6
    w = enc(d, par); fl = random.sample(range(1, len(w) + 1), random.choice([0, 1, 1, 1, 2]))
    r = w
    for f in fl: r = flip(r, f)
    cases.append({'d': d, 'par': par, 'r': r})
here = os.path.dirname(os.path.abspath(__file__))
js = '''const H=require("%s/engine.js");const X=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(X.map(c=>{const e=H.enc(c.d,c.par),k=H.chk(c.r,c.par);return [e.w,k.s,k.data,H.datos(c.r)]})))''' % here
o = subprocess.run(['node', '-e', js], input=json.dumps(cases), capture_output=True, text=True)
if o.stderr: print(o.stderr[:2000])
out = json.loads(o.stdout); bad = 0
for c, x in zip(cases, out):
    s = chk(c['r'], c['par']); fx = flip(c['r'], s) if 0 < s <= len(c['r']) else c['r']
    exp = [enc(c['d'], c['par']), s, datos(fx), datos(c['r'])]
    if exp != x:
        bad += 1
        if bad < 8: print('MAL', c, exp, x)
print('casos:', len(cases), 'distintos:', bad)
