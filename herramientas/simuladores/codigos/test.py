"""Pruebas de los códigos (codigos/engine.js) contra los simuladores del tema 6 (suma_bcd, resta_bcd, a_gray, de_gray) y contra
str.encode('utf-8') / 'utf-16-be' de Python: los casos del artículo (58 + 67 = 125; 742 − 385; 385 − 742; 7 y 8 en Gray; LISTO;
A, ñ, €, 好 y 🍲) y miles al azar."""
import json, random, subprocess, os
def suma_bcd(a, b, n):
    acarreo, cifras = 0, []
    for x, y in zip(reversed(str(a).zfill(n)), reversed(str(b).zfill(n))):
        s = int(x) + int(y) + acarreo
        r = s + 6 if s > 9 else s
        acarreo, cifras = r >> 4, [r & 15] + cifras
    return acarreo, ''.join(str(c) for c in cifras)
def resta_bcd(a, b, n):
    acarreo, cifras = suma_bcd(a, 10 ** n - b, n)
    return (0 + 1 + acarreo) % 2, cifras
def a_gray(b): return b[0] + ''.join(str(int(x) ^ int(y)) for x, y in zip(b, b[1:]))
def de_gray(g):
    b = g[0]
    for x in g[1:]: b += str(int(x) ^ int(b[-1]))
    return b
assert suma_bcd(58, 67, 2) == (1, '25') and a_gray('0111') == '0100' and de_gray('0101') == '0110'
random.seed(6); S = []; R = []; GR = []
for _ in range(5000):
    n = random.randint(1, 6); a, b = random.randint(0, 10 ** n - 1), random.randint(0, 10 ** n - 1)
    S.append([a, b, n])
    if b: R.append([a, b, n])
for _ in range(3000):
    k = random.randint(1, 16); GR.append(''.join(random.choice('01') for _ in range(k)))
R += [[742, 385, 3], [385, 742, 3]]
txt = 'Está listo LISTO Añ€好🍲 ' + ''.join(chr(random.choice([random.randint(32, 126), random.randint(160, 0x7FF), random.randint(0x800, 0xD7FF), random.randint(0x10000, 0x10FFFF)])) for _ in range(3000))
here = os.path.dirname(os.path.abspath(__file__))
js = '''const C=require("%s/engine.js");const X=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify({s:X.S.map(c=>{const o=C.suma(c[0],c[1],c[2]);return [o.cout,o.dig]}),r:X.R.map(c=>{const o=C.resta(c[0],c[1],c[2]);return [o.sign,o.s.dig]}),
g:X.GR.map(b=>[C.aGray(b),C.deGray(b)]),u:C.chars(X.T).map(c=>{const u=C.utf8(c.codePointAt(0));return [u.bytes,u.u16]})}))''' % here
o = subprocess.run(['node', '-e', js], input=json.dumps({'S': S, 'R': R, 'GR': GR, 'T': txt}), capture_output=True, text=True)
if o.stderr: print(o.stderr[:2000])
out = json.loads(o.stdout); bad = 0
for c, x in zip(S, out['s']):
    if list(suma_bcd(*c)) != x: bad += 1; print('SUMA', c, x) if bad < 6 else None
for c, x in zip(R, out['r']):
    if list(resta_bcd(*c)) != x: bad += 1; print('RESTA', c, x) if bad < 6 else None
for b, x in zip(GR, out['g']):
    if [a_gray(b), de_gray(b)] != x: bad += 1
for ch, x in zip(txt, out['u']):
    if [list(ch.encode('utf-8')), len(ch.encode('utf-16-be'))] != x: bad += 1; print('UTF', repr(ch), x) if bad < 6 else None
print('sumas:', len(S), 'restas:', len(R), 'Gray:', len(GR), 'caracteres:', len(txt), 'distintos:', bad)
