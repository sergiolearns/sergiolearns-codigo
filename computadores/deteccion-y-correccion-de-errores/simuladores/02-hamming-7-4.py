# Compruébalo con Python · Hamming (7,4): codificar, estropear un bit y corregirlo
# Del artículo «Detección y corrección de errores: paridad y Hamming — teoría con un mando de la tele, bits que vigilan a otros bits y el Hamming (7,4) (y la final en que la tele se fue sola al canal 7)»
# https://sergiolearns.com/deteccion-y-correccion-de-errores/

# El mando de la tele con Hamming (7,4): codificar, estropear un bit y corregirlo
DATOS = [3, 5, 6, 7]                   # posiciones de d1, d2, d3 y d4 (las que no son potencia de 2)

def codifica(dato, paridad='par'):
    """dato = 'd4d3d2d1'; devuelve los 7 bits escritos de la posición 7 a la 1."""
    b = [0] * 8                        # b[1]..b[7]; b[0] no se usa
    for pos, c in zip(DATOS, reversed(dato)):
        b[pos] = int(c)                # d1 a la 3, d2 a la 5, d3 a la 6, d4 a la 7
    for p in (1, 2, 4):                # cada bit de paridad cubre las posiciones con ese 1 en binario
        unos = sum(b[i] for i in range(1, 8) if i & p and i != p)
        b[p] = unos % 2 if paridad == 'par' else 1 - unos % 2
    return ''.join(str(b[i]) for i in range(7, 0, -1))

def corrige(palabra, paridad='par'):
    b = [0] + [int(c) for c in reversed(palabra)]
    malo = 0
    for p in (1, 2, 4):
        grupo = [i for i in range(1, 8) if i & p]
        unos = sum(b[i] for i in grupo)          # el grupo entero, con su bit de paridad
        falla = unos % 2 != (0 if paridad == 'par' else 1)
        print(f'  grupo del bit {p} {grupo}: {unos} unos ->', 'falla' if falla else 'bien')
        malo += p if falla else 0                # se suman las posiciones de los grupos que fallan
    if malo:
        b[malo] ^= 1                             # se cambia el bit de esa posición
    dato = ''.join(str(b[i]) for i in (7, 6, 5, 3))
    return malo, dato

enviada = codifica('0101')                       # botón 5
print('botón 5 = 0101 -> se envía', enviada, '(impar:', codifica('0101', 'impar') + ')')
recibida = enviada[:2] + '1' + enviada[3:]       # el sol cambia el bit de la posición 5
print('llega', recibida)
malo, dato = corrige(recibida)
print('bit erróneo:', malo, '-> dato corregido', dato, '= botón', int(dato, 2))
print('llega', enviada)
print('bit erróneo:', corrige(enviada)[0], '(0 = ningún grupo falla)')
