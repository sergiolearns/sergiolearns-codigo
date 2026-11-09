"""Pruebas de «un número, todas sus formas» (numero/engine.js) contra los simuladores de los artículos de los temas 2, 3 y 4:
cambio de base (divisiones y multiplicaciones sucesivas con Fraction), binario natural (suma y resta), signo-magnitud y C1
(suma con la vuelta), C2 (suma y desbordamiento). Casos de los artículos y 20000 al azar."""
import json, random, subprocess, os
from fractions import Fraction
DIG = '0123456789ABCDEF'
def entera(n, b):
    r = []
    while n >= b: n, x = divmod(n, b); r.append(DIG[x])
    return DIG[n] + ''.join(reversed(r))
def fraccion(f, b, k):
    f = Fraction(f); o = ''
    for _ in range(k):
        x = f * b; d = int(x); o += DIG[d]; f = x - d
        if f == 0: break
    return o
def nat_suma(a, b, n):
    c, r = 0, ''
    for i in range(n): s = (a >> i & 1) + (b >> i & 1) + c; r, c = str(s % 2) + r, s // 2
    return r, c
def nat_resta(a, b, n):
    p, r = 0, ''
    for i in range(n): d = (a >> i & 1) - (b >> i & 1) - p; p = 1 if d < 0 else 0; r = str(d + 2 * p) + r
    return r, p
def c2(x, n): return format(x % 2 ** n, f'0{n}b')
def vc2(b): return -int(b[0]) * 2 ** (len(b) - 1) + int(b[1:], 2)
def c2suma(a, b):
    c, r = 0, ''
    for i in range(len(a) - 1, -1, -1): s = int(a[i]) + int(b[i]) + c; r, c = str(s % 2) + r, s // 2
    return r, c, a[0] == b[0] and r[0] != a[0]
def sm(x, n): return ('1' if x < 0 else '0') + format(abs(x), f'0{n - 1}b')
def c1(x, n):
    p = format(abs(x), f'0{n}b'); return p if x >= 0 else ''.join('1' if b == '0' else '0' for b in p)
def vc1(s):
    v = -int(s[0]) * 2 ** (len(s) - 1) + int(s[1:], 2); return v + 1 if s[0] == '1' else v
def c1suma(a, b):
    n = len(a); t = int(a, 2) + int(b, 2); v = t >> n; r = format((t & (2 ** n - 1)) + v, f'0{n}b')
    return r, v, a[0] == b[0] and r[0] != a[0]
random.seed(5); cases = []
for _ in range(20000):
    n = random.choice([4, 8, 16, 32]); k = random.choice(['nat', 'sm', 'c1', 'c2'])
    lim = {'nat': (0, 2 ** n - 1), 'sm': (-(2 ** (n - 1) - 1), 2 ** (n - 1) - 1), 'c1': (-(2 ** (n - 1) - 1), 2 ** (n - 1) - 1), 'c2': (-2 ** (n - 1), 2 ** (n - 1) - 1)}[k]
    x, y = random.randint(*lim), random.randint(*lim)
    if random.random() < .3: x, y = random.choice([lim[0], lim[1], 0]), random.choice([lim[0], lim[1], 0, 1])
    cases.append({'n': n, 'k': k, 'x': x, 'y': y, 'sub': random.random() < .5 and k != 'sm' or (k == 'sm' and random.random() < .5)})
bases = [{'s': str(random.randint(0, 99999)) + random.choice(['', ',' + str(random.randint(0, 9999))]), 'b': random.choice([2, 8, 16])} for _ in range(3000)]
bases += [{'s': '162', 'b': 2}, {'s': '244', 'b': 8}, {'s': '244', 'b': 16}, {'s': '0,75', 'b': 2}, {'s': '0,4', 'b': 2}, {'s': '25,75', 'b': 2}]
here = os.path.dirname(os.path.abspath(__file__))
js = '''const N=require("%s/engine.js");const X=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify({ops:X.ops.map(c=>{const o=N.op(c.x,c.y,c.sub,c.k,c.n);return {r:o.r,cout:o.cout,ovf:o.ovf,rule:o.rule,val:o.val,vu:o.vuelta?1:0,A:o.A,B:o.B,err:o.err}}),
bases:X.bases.map(c=>{const p=N.parse(c.s);const e=N.entera(p.ip,c.b);const f=N.fraccion(p.fn,p.fd,c.b,12);return e.dig+'|'+f.dig})}))''' % here
r = subprocess.run(['node', '-e', js], input=json.dumps({'ops': cases, 'bases': bases}), capture_output=True, text=True)
if r.stderr: print(r.stderr[:2000])
out = json.loads(r.stdout); bad = 0
for c, o in zip(cases, out['ops']):
    n, k, x, y, sb = c['n'], c['k'], c['x'], c['y'], c['sub']
    if k == 'nat':
        rr, cc = (nat_resta if sb else nat_suma)(x, y, n); exp = (rr, cc, cc == 1)
        got = (o['r'], o['cout'], o['ovf'])
    elif k == 'c2':
        b2 = c2(-y, n) if sb else c2(y, n)
        rr, cc, d = c2suma(c2(x, n), b2); real = x - y if sb else x + y
        exp = (rr, cc, d, not (-2 ** (n - 1) <= real < 2 ** (n - 1)))
        got = (o['r'], o['cout'], o['rule'], o['ovf'])
        if sb and y == -2 ** (n - 1): exp = exp[:2] + got[2:3] + exp[3:]   # C2(-2^(n-1)) no existe: la regla no aplica
    elif k == 'c1':
        b1 = ''.join('1' if q == '0' else '0' for q in c1(y, n)) if sb else c1(y, n)   # restar = sumar B con los bits invertidos (C1(0) = 11…1, el cero negativo)
        rr, v, d = c1suma(c1(x, n), b1); exp = (rr, v, d, vc1(rr) if not d else None)
        got = (o['r'], o['vu'], o['rule'], o['val'] if not d else None)
    else:
        real = x - y if sb else x + y; lim = 2 ** (n - 1) - 1
        exp = (abs(real) > lim, sm(real, n) if abs(real) <= lim and real != 0 else None)
        got = (o['ovf'], o['r'] if abs(real) <= lim and real != 0 else None)
    if exp != got:
        bad += 1
        if bad < 8: print('MAL', c, exp, got)
for c, o in zip(bases, out['bases']):
    s = c['s']; ip, _, fp = s.partition(',')
    exp = entera(int(ip), c['b']) + '|' + (fraccion(Fraction('0.' + fp), c['b'], 12) if fp and int(fp) else '')
    if exp != o:
        bad += 1
        if bad < 12: print('BASE', c, exp, o)
print('operaciones:', len(cases), 'cambios de base:', len(bases), 'distintos:', bad)
