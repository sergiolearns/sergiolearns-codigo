# Las cuentas de los ejercicios y de «¿Qué falla aquí?»
# Del artículo «Aritmética binaria — ejercicios resueltos con la báscula del ascensor, viajes en binario, un panel de 6 bits y un cuestionario para practicar (y el desbordamiento que no vi por mirar el acarreo)»
# https://sergiolearns.com/aritmetica-binaria-ejercicios/

# Ejercicios de aritmética binaria: soluciones y fallos de «¿Qué falla aquí?»
def suma(a, b, n):
    c, r, f = 0, '', ''
    for i in range(n):
        s = (a >> i & 1) + (b >> i & 1) + c
        f, r, c = ('1' if c else '.') + f, str(s % 2) + r, s // 2
    return r, f, c

def resta(a, b, n):
    p, r, f = 0, '', ''
    for i in range(n):
        d = (a >> i & 1) - (b >> i & 1) - p
        f = ('1' if p else '.') + f
        p = 1 if d < 0 else 0
        r = str(d + 2 * p) + r
    return r, f

def c1(x, n=8):
    s = format(abs(x), f'0{n}b')
    return s if x >= 0 else ''.join('10'[int(b)] for b in s)

def val_c1(s):
    return int(s, 2) if s[0] == '0' else -int(''.join('10'[int(b)] for b in s), 2)   # negativo: se invierte

def suma_c1(a, b):
    n = len(a); t = int(a, 2) + int(b, 2); v = t >> n
    r = format((t & (2 ** n - 1)) + v, f'0{n}b')
    return r, v, a[0] == b[0] and r[0] != a[0]

print('== Nivel 1')
r, f, c = suma(90, 55, 8); print(f'a) acarreos {f}  {r} = {int(r, 2)}')
r, f = resta(145, 55, 8); print(f'b) préstamos {f}  {r} = {int(r, 2)}')
r, f, c = suma(145, 120, 8); print(f'c) acarreos {f}  {r} = {int(r, 2)}, acarreo final {c}: real {145 + 120}')
print('== Nivel 2')
par = [0b11011 << i if 0b1010 >> i & 1 else 0 for i in range(4)]
print('a) parciales', [format(p, 'b') for p in par], '->', format(sum(par), 'b'), '=', sum(par))
resto, coc = 0, ''
for bit in format(270, 'b'):
    resto = resto * 2 + int(bit); coc += '1' if resto >= 12 else '0'; resto -= 12 if resto >= 12 else 0
print(f'b) {270:b} / 1100 -> cociente {coc} = {int(coc, 2)}, resto {resto:b} = {resto}')
print('== Nivel 3 (6 bits)')
print(f'a) SM y C1: de {-(2 ** 5 - 1)} a {2 ** 5 - 1}')
sm = lambda x, n=6: ('1' if x < 0 else '0') + format(abs(x), f'0{n - 1}b')
for x in (-3, 12, -17):
    print(f'b) {x:3}: SM {sm(x)}  C1 {c1(x, 6)}')
r, v, d = suma_c1(c1(12, 6), c1(-17, 6)); print(f'c) {c1(12, 6)} + {c1(-17, 6)} -> {r} (vuelta {v}) = {val_c1(r)}  desb {d}')
r, v, d = suma_c1(c1(-17, 6), c1(-20, 6)); print(f'd) {c1(-17, 6)} + {c1(-20, 6)} -> {r} (vuelta {v}) = {val_c1(r)}  desb {d}; real {-37}')
print('== ¿Qué falla aquí?')
r, f = resta(0b10100, 0b01011, 5)
print(f'F1) sin préstamos: {0b10100 ^ 0b01011:05b} = {0b10100 ^ 0b01011};  bien: préstamos {f}  {r} = {int(r, 2)}')
t = int(c1(9), 2) + int(c1(-4), 2)
print(f'F2) {c1(9)} + {c1(-4)} = {t:09b}; sin la vuelta {t & 255:08b} = {t & 255}; con la vuelta {suma_c1(c1(9), c1(-4))[0]} = {val_c1(suma_c1(c1(9), c1(-4))[0])}')
r, v, d = suma_c1(c1(100), c1(50))
print(f'F3) {c1(100)} + {c1(50)} -> {r} (vuelta {v}) = {val_c1(r)}  desbordamiento {d}')
r, v, d = suma_c1(c1(-20), c1(-30))
print(f'F3b) {c1(-20)} + {c1(-30)} -> {r} (vuelta {v}) = {val_c1(r)}  desbordamiento {d}')
