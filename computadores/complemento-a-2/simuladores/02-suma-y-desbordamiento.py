# Compruébalo con Python · Sumar en complemento a 2: acarreo final y desbordamiento
# Del artículo «Complemento a 2 — teoría con un cuentakilómetros que da la vuelta: invertir y sumar 1, el bit que pesa −128 y el desbordamiento que se ve en el signo (y el −128 que no quería cambiar de signo)»
# https://sergiolearns.com/complemento-a-2/

# Sumar en complemento a 2: acarreo final y desbordamiento
def c2(x, n=8):                                 # x en C2 de n bits (el % hace de cuentakilómetros)
    return format(x % 2 ** n, f'0{n}b')

def valor(b):                                   # el bit de signo pesa -2^(n-1)
    return -int(b[0]) * 2 ** (len(b) - 1) + int(b[1:], 2)

def suma(a, b):
    """Suma columna a columna: resultado, fila de acarreos, acarreo final y desbordamiento."""
    acarreo, r, fila = 0, '', ''
    for i in range(len(a) - 1, -1, -1):        # de derecha a izquierda, como a mano
        fila = str(acarreo) + fila              # el acarreo que ENTRA en esta columna
        s = int(a[i]) + int(b[i]) + acarreo
        r, acarreo = str(s % 2) + r, s // 2
    desb = a[0] == b[0] and r[0] != a[0]        # mismo signo de entrada y otro de salida
    return r, fila, acarreo, desb

for x, y in ((45, 20), (45, -20), (120, 30), (-100, -60)):
    r, fila, ac, d = suma(c2(x), c2(y))
    print(f'{x:4} + {y:4}: acarreos {fila}')
    print(f'  {c2(x)} + {c2(y)} = {r} = {valor(r):4}  acarreo final {ac}  desbordamiento: {d}')
    print(f'  entra al signo {fila[0]}, sale {ac} -> {"distintos" if fila[0] != str(ac) else "iguales"}')
print('restar 30 - 75 = 30 + C2(75):', c2(-75))
r, fila, ac, d = suma(c2(30), c2(-75))
print(f'  {c2(30)} + {c2(-75)} = {r} = {valor(r)}  acarreo final {ac}  desbordamiento: {d}')
