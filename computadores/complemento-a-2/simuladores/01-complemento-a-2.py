# Compruébalo con Python · El complemento a 2 con el cuentakilómetros de 8 bits
# Del artículo «Complemento a 2 — teoría con un cuentakilómetros que da la vuelta: invertir y sumar 1, el bit que pesa −128 y el desbordamiento que se ve en el signo (y el −128 que no quería cambiar de signo)»
# https://sergiolearns.com/complemento-a-2/

# Complemento a 2 con el cuentakilómetros de 8 bits
def c1(b):                                      # complemento a 1: se invierten todos los bits
    return ''.join('1' if x == '0' else '0' for x in b)

def mas1(b):                                    # suma 1; el bit que no cabe se pierde
    return format(int(b, 2) + 1, f'0{len(b)}b')[-len(b):]

def c2(b):                                      # complemento a 2 = complemento a 1 + 1
    return mas1(c1(b))

def atajo(b):                                   # copia hasta el primer 1 por la derecha e invierte el resto
    i = b.rfind('1')
    return b if i < 0 else c1(b[:i]) + b[i:]

def valor(b):                                   # el bit de signo pesa -2^(n-1); los demás, lo de siempre
    return -int(b[0]) * 2 ** (len(b) - 1) + int(b[1:], 2)

print('marcha atrás desde el km 2:')
for km in (2, 1, 0, -1, -2):                    # % 256: la rueda de 8 bits da la vuelta
    print(f'  km {km:2} -> {km % 256:08b}')
pos = format(45, '08b')
print('+45          ', pos)
print('C1           ', c1(pos))
print('C1 + 1 = C2  ', c2(pos), '=', valor(c2(pos)))
print('atajo        ', atajo(pos))
print('atajo de +88 ', format(88, '08b'), '->', atajo(format(88, '08b')), '=', valor(atajo(format(88, '08b'))))
print('C2 otra vez  ', c2(c2(pos)), '=', valor(c2(c2(pos))))
pesos = [-128, 64, 32, 16, 8, 4, 2, 1]
print('11010011 =', ' + '.join(str(p) for p, x in zip(pesos, '11010011') if x == '1'), '=', valor('11010011'))
for n in (4, 8, 16):
    print(f'{n:2} bits: de {-2 ** (n - 1)} a {2 ** (n - 1) - 1}')
print('C2 de 10000000:', c2('10000000'), '=', valor(c2('10000000')))
print('-6 en 4 bits:', c2('0110'), '-> en 8 bits:', c2('00000110'))
