# Compruébalo con Python · Las cuentas de los cuatro problemas guiados
# Del artículo «Complemento a 2 — práctica con problemas guiados paso a paso: obtener y deshacer el C2, rangos con n bits, restas en 4 y 8 bits y una suma encadenada con el formato del examen (y el acarreo que sumé por costumbre)»
# https://sergiolearns.com/complemento-a-2-practica/

# Problemas de la práctica de complemento a 2: todas las cuentas, una vez
def c1(b):                                      # se invierten todos los bits
    return ''.join('1' if x == '0' else '0' for x in b)

def c2(x, n=8):                                 # x en C2 de n bits
    return format(x % 2 ** n, f'0{n}b')

def valor(b):                                   # el bit de signo pesa -2^(n-1)
    return -int(b[0]) * 2 ** (len(b) - 1) + int(b[1:], 2)

def suma(a, b):                                 # resultado, fila de acarreos, acarreo final, desbordamiento
    acarreo, r, fila = 0, '', ''
    for i in range(len(a) - 1, -1, -1):
        fila = str(acarreo) + fila
        s = int(a[i]) + int(b[i]) + acarreo
        r, acarreo = str(s % 2) + r, s // 2
    return r, fila, acarreo, a[0] == b[0] and r[0] != a[0]

def ver(x, y, n=8):                             # imprime una suma con todo lo que pide un examen
    r, fila, ac, d = suma(c2(x, n), c2(y, n))
    print(f'  {x} + ({y}): acarreos {fila}  {c2(x, n)} + {c2(y, n)} = {r} = {valor(r)}  acarreo {ac}  desb. {d}')
    return r

print('== Problema 1')
for x in (53, 77):
    p = format(x, '08b')
    print(f'  +{x} = {p}  C1 {c1(p)}  C2 {c2(-x)} = {valor(c2(-x))}')
for b in ('10110110', '01110110', '11111000', format(0xE5, '08b')):
    print(f'  {b} = {valor(b)}  (C2: {c2(-valor(b))})')
print('== Problema 2')
for n in (6, 10, 12):
    print(f'  {n} bits: {-2 ** (n - 1)} .. {2 ** (n - 1) - 1}')
b = '101101'
print(f'  {b}: sin signo {int(b, 2)}, SM {-int(b[1:], 2)}, C1 {valor(b) + 1}, C2 {valor(b)}')
for x in (-70, 70, -64, 64):
    n = next(n for n in range(2, 12) if -2 ** (n - 1) <= x <= 2 ** (n - 1) - 1)
    print(f'  {x}: {n} bits ({c2(x, n)})')
print('== Problema 3')
for x, y in ((3, -6), (5, 4), (-2, -5)):
    ver(x, y, 4)
for x, y in ((75, -30), (-90, -50)):
    ver(x, y)
print('== Problema 4: ((-58(10 + (-3D(16)) + 27(8)')
print(f'  -58 -> {c2(-58)}, 3D(16 = {0x3D} -> {c2(-0x3D)}, 27(8 = {0o27} -> {c2(0o27)}')
r = ver(-58, -0x3D)
ver(valor(r), 0o27)
print('== Pruébalo tú: ((-90(10 + (-5A(16)) + 17(8)')
r = ver(-90, -0x5A)
ver(valor(r), 0o17)
