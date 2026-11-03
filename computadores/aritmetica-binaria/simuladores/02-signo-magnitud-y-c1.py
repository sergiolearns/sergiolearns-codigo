# Compruébalo con Python · Signo-magnitud y complemento a 1 con el panel del ascensor
# Del artículo «Aritmética binaria — teoría con un ascensor: sumas con acarreo, restas con préstamo, signo-magnitud y complemento a 1 (y el sótano 8 de un edificio con tres)»
# https://sergiolearns.com/aritmetica-binaria/

# Signo-magnitud y complemento a 1: el panel del ascensor (plantas -3 a 12)
def sm(x, n=8):                                 # bit de signo + magnitud en n-1 bits
    return ('1' if x < 0 else '0') + format(abs(x), f'0{n - 1}b')

def c1(x, n=8):                                 # negativos: se invierten todos los bits del positivo
    p = format(abs(x), f'0{n}b')
    return p if x >= 0 else ''.join('1' if b == '0' else '0' for b in p)

def valor_c1(s):                                # el signo pesa -2^(n-1) y a los negativos se les suma 1
    v = -int(s[0]) * 2 ** (len(s) - 1) + int(s[1:], 2)
    return v + 1 if s[0] == '1' else v

def suma_c1(a, b):
    """Suma en C1: si sale acarreo final, se vuelve a sumar al resultado (vuelta)."""
    n = len(a); t = int(a, 2) + int(b, 2)
    vuelta = t >> n                             # el bit que no cabe
    r = format((t & (2 ** n - 1)) + vuelta, f'0{n}b')
    desb = a[0] == b[0] and r[0] != a[0]        # mismo signo de entrada y otro de salida
    return r, vuelta, desb

for planta in (12, 5, 0, -3):
    print(f'planta {planta:3}: SM {sm(planta)}  C1 {c1(planta)}')
print('el cero negativo: SM 10000000  C1', c1(0).replace('0', '1'))
mal = format(int(sm(-3), 2) + int(sm(5), 2), '08b')        # sumar SM bit a bit (MAL)
print('SM bit a bit: -3 + 5 ->', mal, '= planta', -int(mal[1:], 2) if mal[0] == '1' else int(mal, 2))
print('SM con su regla: signos distintos -> 5 - 3 = 2 con el signo del 5 ->', sm(2))
for a, b in ((-3, 5), (5, -12)):                            # subir 5 desde el -3; bajar 12 desde la 5
    r, v, d = suma_c1(c1(a), c1(b))
    print(f'C1: {c1(a)} + {c1(b)} -> {r} (vuelta {v}) = {valor_c1(r)}  desbordamiento: {d}')
print('panel viejo de 4 bits: rango de', -(2 ** 3 - 1), 'a', 2 ** 3 - 1)
r, v, d = suma_c1(c1(6, 4), c1(3, 4))                      # planta 6, sube 3: ¿planta 9?
print(f'C1 4 bits: 0110 + 0011 -> {r} = {valor_c1(r)}  desbordamiento: {d}')
