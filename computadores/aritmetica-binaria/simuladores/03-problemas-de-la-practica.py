# Las cuentas de los cuatro problemas guiados
# Del artículo «Aritmética binaria — práctica con problemas guiados paso a paso: sumas y restas, multiplicar y dividir, signo-magnitud, C1 y una cuestión con el formato del examen (y los 3 viajes para 109 personas)»
# https://sergiolearns.com/aritmetica-binaria-practica/

# Problemas de la práctica de aritmética binaria: todas las cuentas, una vez
def suma(a, b, n):                              # resultado de n bits, fila de acarreos y acarreo final
    c, r, f = 0, '', ''
    for i in range(n):
        s = (a >> i & 1) + (b >> i & 1) + c
        f, r, c = ('1' if c else '.') + f, str(s % 2) + r, s // 2
    return r, f, c

def resta(a, b, n):                             # resultado de n bits y fila de préstamos
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

print('== Problema 1')
r, f, c = suma(0b1011101, 0b110110, 8)          # 1011,101 + 110,11 alineados a 3 cifras: x8
print(f'a) acarreos {f}  {r} -> {int(r, 2) // 8 :b},{r[-3:]} = {int(r, 2) / 8}  ({0b1011101 / 8} + {0b110110 / 8})')
r, f = resta(197, 110, 8)
print(f'b) préstamos {f}  11000101 - 01101110 = {r} = {int(r, 2)}')
r1, f1, c = suma(85, 63, 8); r2, f2 = resta(int(r1, 2), 54, 8)
print(f'c) acarreos {f1}  85 + 63 = {r1} = {int(r1, 2)};  préstamos {f2}  - 54 = {r2} = {int(r2, 2)}')
print('== Problema 2')
par = [0b10111 << i if 0b1101 >> i & 1 else 0 for i in range(4)]
print('a) parciales', [format(p, 'b') for p in par], '->', format(sum(par), 'b'), '=', sum(par), '=', 23 * 13)
resto, coc, pasos = 0, '', []
for bit in '1101101':
    resto = resto * 2 + int(bit)
    coc += '1' if resto >= 11 else '0'
    pasos.append(f'{resto:b}{"-1011" if resto >= 11 else ""}')
    resto -= 11 if resto >= 11 else 0
print(f'b) pasos {pasos}  cociente {coc} = {int(coc, 2)}, resto {resto:b} = {resto}  ({109 // 11}, {109 % 11})')
print('== Problema 3')
sm = lambda x, n=8: ('1' if x < 0 else '0') + format(abs(x), f'0{n - 1}b')
print(f'a) +45 SM {sm(45)} C1 {c1(45)};  -45 SM {sm(-45)} C1 {c1(-45)}')
s = '10101100'
print(f'b) {s}: SM = {-int(s[1:], 2)}, C1 = {val_c1(s)}, sin signo = {int(s, 2)}')
print(f'c) 8 bits: SM y C1 de {-(2 ** 7 - 1)} a {2 ** 7 - 1}; sin signo de 0 a {2 ** 8 - 1}')
print(f'd) -45 + 20 -> 45 - 20 = 25, signo del 45 -> {sm(-25)} = -25;  -45 + -20 -> 65 con signo - -> {sm(-65)} = -65')
print('== Problema 4: ((-37(10 + (-2A(16)) + 15(8)')
a, b, c = -37, -int('2A', 16), int('15', 8)
print(f'datos: 37 = {c1(37)}, 2A(16 = {int("2A", 16)} = {c1(42)}, 15(8 = {c} = {c1(c)}')
r1, v1, d1 = suma_c1(c1(a), c1(b)); r2, v2, d2 = suma_c1(r1, c1(c))
print(f'1) {c1(a)} + {c1(b)} -> {r1} (vuelta {v1}) = {val_c1(r1)}  desbordamiento {d1}')
print(f'2) {r1} + {c1(c)} -> {r2} (vuelta {v2}) = {val_c1(r2)}  desbordamiento {d2}')
print(f'comprobación decimal: {a} + {b} + {c} = {a + b + c}')
x, y, z = -70, -int('3C', 16), int('12', 8)                # el «Pruébalo tú»
r1, v1, d1 = suma_c1(c1(x), c1(y)); r2, v2, d2 = suma_c1(r1, c1(z))
print(f'pruébalo: {c1(x)} + {c1(y)} -> {r1} (vuelta {v1}) desbordamiento {d1}; + {c1(z)} -> {r2} = {val_c1(r2)}; real {x + y + z}')
