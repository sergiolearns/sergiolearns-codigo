# Compruébalo con Python · Distancia de Hamming, bit de paridad y código de repetición
# Del artículo «Detección y corrección de errores: paridad y Hamming — teoría con un mando de la tele, bits que vigilan a otros bits y el Hamming (7,4) (y la final en que la tele se fue sola al canal 7)»
# https://sergiolearns.com/deteccion-y-correccion-de-errores/

# El mando de la tele: distancia de Hamming y bit de paridad
def distancia(a, b):
    """Número de posiciones en que dos palabras del mismo tamaño son distintas."""
    return sum(x != y for x, y in zip(a, b))

def distancia_minima(codigo):
    """La menor distancia entre dos palabras distintas del código."""
    return min(distancia(a, b) for i, a in enumerate(codigo) for b in codigo[i + 1:])

def con_paridad(dato, paridad='par'):
    """Pone delante el bit que deja el número de unos par (o impar)."""
    unos = dato.count('1')
    p = unos % 2 if paridad == 'par' else 1 - unos % 2
    return str(p) + dato

# 1) Los 16 botones del mando en 4 bits: todas las combinaciones son palabras del código
botones = [format(i, '04b') for i in range(16)]
print('4 bits, distancia mínima:', distancia_minima(botones))
print('el 5 y el 7:', '0101', '0111', '-> distancia', distancia('0101', '0111'))

# 2) Los mismos botones con un bit de paridad par delante
con_p = [con_paridad(b) for b in botones]
print('5 bits con paridad par, distancia mínima:', distancia_minima(con_p))
print('el 5 con paridad par:', con_paridad('0101'), '  impar:', con_paridad('0101', 'impar'))

# 3) Llega una palabra: ¿cumple la paridad par?
for recibida in ['00101', '00111', '01111']:
    ok = recibida.count('1') % 2 == 0
    print(recibida, '->', recibida.count('1'), 'unos:', 'bien' if ok else 'ERROR, que lo repita')

# 4) El código de repetición: 0 -> 000 y 1 -> 111
print('000 y 111, distancia mínima:', distancia_minima(['000', '111']))
for recibida in ['000', '010', '110', '111']:
    print(recibida, '-> se corrige a', '1' if recibida.count('1') >= 2 else '0')
