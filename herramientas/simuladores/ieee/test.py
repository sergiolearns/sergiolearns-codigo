"""Pruebas del explorador IEEE 754 (ieee/engine.js) contra struct de Python (simple '>f', doble '>d', media '>e', redondeo al par
más cercano) y contra viejo() de los ejercicios del tema 5 (cronómetro antiguo de 16 bits). Ida (decimal → hex) y vuelta
(hex → valor exacto). Casos de los artículos y 30000 al azar."""
import json, random, struct, subprocess, os
from fractions import Fraction as F
def viejo(x, implicito):
    m, e = F(abs(x)), 0
    while m >= 1: m /= 2; e += 1
    while m < F(1, 2): m *= 2; e -= 1
    bits = ''
    for _ in range(11): m *= 2; bits += str(int(m)); m -= int(m)
    mag = bits[1:11] if implicito else bits[:10]
    pal = ('1' if x < 0 else '0') + format(e + 16, '05b') + mag
    return f'{int(pal, 2):04X}'
random.seed(2); cases = []
fixed = ['83,375', '-0,15625', '37,6875', '-9,40625', '0,1', '12,5', '0,75', '-27,5625', '0,2', '0,625', '-6,5', '1', '0,5', '100', '17,25', '21,25', '10,625', '3,25', '65504', '65520', '1e-40', '3,4e38', '3,5e38', '1e-46', '5e-324', '1e-7']
for s in fixed:
    for k in ('simple', 'doble', 'media'): cases.append({'s': s, 'k': k})
for _ in range(30000):
    k = random.choice(['simple', 'doble', 'media'])
    r = random.random()
    if r < .4: s = f"{random.choice(['', '-'])}{random.randint(0, 99999)},{random.randint(0, 99999):05d}"
    elif r < .7: s = f"{random.choice(['', '-'])}{random.randint(1, 9)},{random.randint(0, 999)}e{random.randint(-50 if k != 'doble' else -330, 40 if k != 'doble' else 320)}"
    else: s = str(F(random.randint(-5000, 5000), 2 ** random.randint(0, 14))).replace('/', '?')
    if '?' in s: a, b = s.split('?'); s = repr(int(a) / int(b)).replace('.', ',')
    cases.append({'s': s, 'k': k})
old = [{'s': str(x).replace('.', ','), 'k': 'viejo', 'i': i} for x in [83.375, -0.15625] + [random.choice([1, -1]) * random.randint(1, 30000) / 2 ** random.randint(0, 20) for _ in range(2000)] for i in (True, False)]
here = os.path.dirname(os.path.abspath(__file__))
js = '''const I=require("%s/engine.js");const X=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(X.map(c=>{const o=I.encode(c.s,c.k,c.i);const d=o.back;return [o.hex,o.kind,d.kind==="norm"||d.kind==="den"?(d.s?"-":"")+d.p+"/"+d.q:d.kind]})))''' % here
r = subprocess.run(['node', '-e', js], input=json.dumps(cases + old), capture_output=True, text=True)
if r.stderr: print(r.stderr[:2000])
out = json.loads(r.stdout); bad = 0
FM = {'simple': '>f', 'doble': '>d', 'media': '>e'}
for c, o in zip(cases + old, out):
    if c['k'] == 'viejo':
        x = float(c['s'].replace(',', '.'))
        e = 0; m = abs(x)
        exp = viejo(x, c['i'])
        if not (-16 <= (lambda v: (v.numerator.bit_length() - v.denominator.bit_length() + 1))(F(abs(x))) <= 15): continue
        if o[0] != exp: bad += 1; print('VIEJO', c, exp, o) if bad < 8 else None
        continue
    x = F(c['s'].replace(',', '.'))
    try:
        h = struct.pack(FM[c['k']], float(x) if c['k'] != 'doble' else float(x)).hex().upper()
    except OverflowError:
        h = None
    # struct redondea primero a doble (float(x)): para doble es lo correcto; para simple/media, doble redondeo raro: se compara con Fraction
    if c['k'] != 'doble':
        f = {'simple': (8, 23), 'media': (5, 10)}[c['k']]
        eb, mb = f; bias = 2 ** (eb - 1) - 1
        a = abs(x)
        if a == 0: h = '0' * ((1 + eb + mb) // 4)
        else:
            E = a.numerator.bit_length() - a.denominator.bit_length()
            if a < F(2) ** E: E -= 1
            Eu = max(E, 1 - bias)
            M = a / F(2) ** Eu * 2 ** mb; I = M.numerator // M.denominator; R = M - I
            if R > F(1, 2) or (R == F(1, 2) and I & 1): I += 1
            if E >= 1 - bias and I == 2 ** (mb + 1): I //= 2; Eu += 1
            if Eu < 1 - bias + 0 and I >= 2 ** mb: pass
            if I >= 2 ** mb: ef = Eu + bias; mf = I - 2 ** mb
            else: ef = 0; mf = I
            if ef >= 2 ** eb - 1: ef, mf = 2 ** eb - 1, 0
            w = ((1 if x < 0 else 0) << (eb + mb)) | (ef << mb) | mf
            h = f'{w:0{(1 + eb + mb) // 4}X}'
            # y cuando no hay doble redondeo, también tiene que coincidir con struct
            try:
                hs = struct.pack(FM[c['k']], float(x)).hex().upper()
                if float(x) == x and hs != h: bad += 1; print('STRUCT', c, hs, h)
            except OverflowError: pass
    if h is None: h = ('FFF0000000000000' if x < 0 else '7FF0000000000000')
    if o[0] != h:
        bad += 1
        if bad < 10: print('MAL', c, h, o[0])
    # vuelta: el valor exacto de la palabra
    if o[2] not in ('inf', 'zero', 'nan'):
        v = F(o[2].lstrip('-').split('/')[0]) / F(o[2].split('/')[1]) * (-1 if o[2][0] == '-' else 1)
        ref = F(struct.unpack('>d', struct.pack('>d', struct.unpack(FM[c['k']], bytes.fromhex(h))[0]))[0])
        if v != ref: bad += 1; print('VUELTA', c, v, ref) if bad < 10 else None
print('casos:', len(cases), 'cronómetro antiguo:', len(old), 'distintos:', bad)
