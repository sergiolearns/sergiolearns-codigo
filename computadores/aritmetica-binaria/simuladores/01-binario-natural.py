# Compruébalo con Python · Binario natural: sumar, restar, multiplicar y dividir con el ascensor
# Del artículo «Aritmética binaria — teoría con un ascensor: sumas con acarreo, restas con préstamo, signo-magnitud y complemento a 1 (y el sótano 8 de un edificio con tres)»
# https://sergiolearns.com/aritmetica-binaria/

# Aritmética binaria sin signo, como en papel: el ascensor del centro comercial
def suma(a, b, n):
    """Suma columna a columna: devuelve el resultado de n bits, la fila de acarreos y el acarreo final."""
    acarreo, res, fila = 0, '', ''
    for i in range(n):                         # de derecha a izquierda, como a mano
        s = (a >> i & 1) + (b >> i & 1) + acarreo   # hasta tres bits: los dos y el acarreo
        fila = ('1' if acarreo else '.') + fila     # el acarreo que ENTRA en esta columna
        res, acarreo = str(s % 2) + res, s // 2
    return res, fila, acarreo

def resta(a, b, n):
    """Resta columna a columna con préstamos (el «acarreo negativo» de los apuntes)."""
    prestamo, res, fila = 0, '', ''
    for i in range(n):
        d = (a >> i & 1) - (b >> i & 1) - prestamo
        fila = ('1' if prestamo else '.') + fila
        prestamo = 1 if d < 0 else 0           # 0 - 1: pido 1 a la columna siguiente
        res = str(d + 2 * prestamo) + res
    return res, fila

r, f, c = suma(75, 68, 8)                      # dos personas en el ascensor: 75 kg y 68 kg
print(f'acarreos {f}\n  75 + 68 = {r} = {int(r, 2)}  (acarreo final {c})')
r, f, c = suma(51, 22, 7)                      # 1100,11 + 101,1 con dos cifras tras la coma (x4)
print(f'acarreos {f}\n  1100,11 + 101,1 = {r[:5]},{r[5:]} = {int(r, 2) / 4}')
r, f = resta(12, 5, 4)                         # de la planta 12 a la 5: ¿cuántas plantas baja?
print(f'préstamos {f}\n  1100 - 0101 = {r} = {int(r, 2)}')
peso = 0                                       # la báscula del ascensor guarda 8 bits
for p in (75, 68, 82, 59):
    r, f, c = suma(peso, p, 8)
    print(f'  {peso:3} + {p:2} -> {r} = {int(r, 2):3}  acarreo final {c}')
    peso = int(r, 2)
print(f'  la báscula marca {peso} kg; el peso real es {75 + 68 + 82 + 59} kg')
parciales = [12 << i if 5 >> i & 1 else 0 for i in range(3)]   # 1100 x 101
print('  parciales:', [format(p, 'b') for p in parciales], '->', format(sum(parciales), 'b'), '=', sum(parciales))
resto, cociente = 0, ''                        # 11011 / 110 bit a bit (división larga)
for bit in '11011':
    resto = resto * 2 + int(bit)               # se baja el bit siguiente
    if resto >= 6:
        resto, cociente = resto - 6, cociente + '1'   # cabe: se resta y el cociente lleva 1
    else:
        cociente += '0'
print(f'  11011 / 110 -> cociente {cociente} = {int(cociente, 2)}, resto {resto:b} = {resto}')
