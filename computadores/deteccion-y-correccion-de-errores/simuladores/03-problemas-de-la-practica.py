# Compruébalo con Python · Las cuentas de los seis problemas guiados
# Del artículo «Detección y corrección de errores — práctica con seis problemas guiados: distancias, paridad, codificar y corregir con Hamming (7,4) y una cuestión tipo examen (y el bit que corregí contando desde la izquierda)»
# https://sergiolearns.com/deteccion-y-correccion-de-errores-practica/

# Problemas de la práctica de detección y corrección de errores: todas las cuentas, una vez
def distancia(a, b):
    return sum(x != y for x, y in zip(a, b))

def paridad(dato, tipo='par'):          # bit de paridad que se pone delante
    u = dato.count('1')
    return str(u % 2 if tipo == 'par' else 1 - u % 2)

def codifica(dato, tipo='par'):         # Hamming de cualquier tamaño; dato = d_k ... d1
    n = 1
    while sum(1 for i in range(1, n + 1) if i & (i - 1)) < len(dato):
        n += 1                          # el menor n con sitio para todos los datos
    b = [0] * (n + 1)
    for pos, c in zip([i for i in range(1, n + 1) if i & (i - 1)], reversed(dato)):
        b[pos] = int(c)
    p = 1
    while p <= n:
        u = sum(b[i] for i in range(1, n + 1) if i & p and i != p)
        b[p] = u % 2 if tipo == 'par' else 1 - u % 2
        p *= 2
    return ''.join(str(b[i]) for i in range(n, 0, -1))

def comprueba(w, tipo='par'):           # devuelve (bit erróneo, palabra corregida, datos)
    n = len(w); b = [0] + [int(c) for c in reversed(w)]; malo = 0; p = 1; txt = []
    while p <= n:
        u = sum(b[i] for i in range(1, n + 1) if i & p)
        falla = u % 2 != (0 if tipo == 'par' else 1)
        txt.append(f'g{p}:{u}{"X" if falla else "ok"}'); malo += p if falla else 0; p *= 2
    if malo:
        b[malo] ^= 1
    c = ''.join(str(b[i]) for i in range(n, 0, -1))
    d = ''.join(str(b[i]) for i in range(n, 0, -1) if i & (i - 1))
    return malo, c, d, ' '.join(txt)

print('== Problema 1: distancias del mando de cuatro botones')
cod = ['00000', '01011', '10101', '11110']
for i, a in enumerate(cod):
    for b in cod[i + 1:]:
        print(f'  d({a}, {b}) = {distancia(a, b)}')
print('  distancia mínima:', min(distancia(a, b) for i, a in enumerate(cod) for b in cod[i + 1:]))

print('== Problema 2: BCD con bit de paridad delante')
for c in '379':
    bcd = format(int(c), '04b')
    print(f'  {c} = {bcd} -> par {paridad(bcd)}{bcd}  impar {paridad(bcd, "impar")}{bcd}')
for w in ['10110', '00110', '01100', '00101']:
    u = w.count('1'); bcd = int(w[1:], 2)
    print(f'  llega {w}: {u} unos ->', 'paridad bien' if u % 2 == 0 else 'paridad MAL',
          '| BCD', bcd if bcd <= 9 else f'{w[1:]} no es una cifra')

print('== Problema 3: codificar vol+ (1010) y silencio (1110)')
for d in ['1010', '1110']:
    print(f'  {d}: par {codifica(d)}  impar {codifica(d, "impar")}')

print('== Problema 4: comprobar con paridad par')
for w in ['0011110', '1011111', '0101000']:
    print('  ', w, '->', comprueba(w))

print('== Problema 5: el canal 215 en tres palabras (paridad par)')
llega = '001110100001111101101'
for k in range(0, 21, 7):
    w = llega[k:k + 7]; m, c, d, t = comprueba(w)
    print(f'  {w}: {t} -> bit {m}, corregida {c}, datos {d} = {int(d, 2)}')

print('== Problema 6: cuestión tipo examen (paridad impar)')
for w in ['0110101', '0001101']:
    print('  ', w, '->', comprueba(w, 'impar'))
