# Las soluciones de los ejercicios y del cuestionario, comprobadas una vez
# Del artículo «Complemento a 2 — ejercicios resueltos con un cuentakilómetros de 8 bits, sumas que desbordan, un panel de 6 bits y un cuestionario para practicar (y el 9C que leí como 156)»
# https://sergiolearns.com/complemento-a-2-ejercicios/

# Ejercicios de complemento a 2: las soluciones y el cuestionario, comprobados una vez
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

def ver(x, y, n=8):
    r, fila, ac, d = suma(c2(x, n), c2(y, n))
    print(f'  {x} + ({y}): acarreos {fila}  {c2(x, n)} + {c2(y, n)} = {r} = {valor(r)}  acarreo {ac}  desb. {d}')
    return r

print('== Nivel 1')
print(' ', [(x, c2(x)) for x in (-13, -64, 90, -1)])
print(' ', [(b, valor(b)) for b in ('11101001', '01011010', '10000001', '11111110')])
print('  9C(16 =', format(0x9C, '08b'), '=', valor(format(0x9C, '08b')), '(sin signo sería', 0x9C, ')')
print('  5 bits:', -16, '..', 15, ' 12 bits:', -2 ** 11, '..', 2 ** 11 - 1)
print('== Nivel 2')
for x, y in ((54, 73), (54, 74), (-64, -64), (-64, -65), (25, -90)):
    ver(x, y)
print('== Nivel 3 (6 bits)')
print('  -27 =', c2(-27, 6), ' +19 =', c2(19, 6), ' -9 =', c2(-9, 6))
r = ver(-27, 19, 6)
print('  extendido a 8 bits:', r[0] * 2 + r, '=', valor(r[0] * 2 + r))
ver(-27, -9, 6)
print('== ¿Qué falla aquí?')
print('  -40: C1 sin +1 = 11010111 =', valor('11010111'), ' bien:', c2(-40))
ver(-20, -30)
print('  atajo desde la izquierda: 01100111 =', valor('01100111'), ' bien:', c2(-88), '=', valor(c2(-88)))
print('== Cuestionario')
for x in (-19, -100, -128, -33):
    print(f'  {x} -> {c2(x)}')
for b in ('11001000', '10111111', '01111111', format(0xF3, '08b'), format(0xA0, '08b')):
    print(f'  {b} = {valor(b)}')
for x, y in ((100, 27), (100, 28), (-1, -1), (-70, 70), (-127, -2), (60, -61)):
    ver(x, y)
ver(-3, -6, 4); ver(7, 1, 4); ver(-8, 1, 4)
