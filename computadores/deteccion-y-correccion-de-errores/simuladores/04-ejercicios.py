# Comprobación · Las cuentas de las soluciones de los ejercicios
# Del artículo «Detección y corrección de errores — ejercicios con distancias, bits de paridad, palabras que corregir y un Hamming de 15 bits (y la palabra perfecta que «corregí» por leer par donde ponía impar)»
# https://sergiolearns.com/deteccion-y-correccion-de-errores-ejercicios/

# Soluciones de los ejercicios de detección y corrección de errores: todas las cuentas, una vez
def distancia(a, b):
    return sum(x != y for x, y in zip(a, b))

def codifica(dato, tipo='par'):         # Hamming de cualquier tamaño; dato = d_k ... d1
    n = 1
    while sum(1 for i in range(1, n + 1) if i & (i - 1)) < len(dato):
        n += 1
    b = [0] * (n + 1)
    for pos, c in zip([i for i in range(1, n + 1) if i & (i - 1)], reversed(dato)):
        b[pos] = int(c)
    p = 1
    while p <= n:
        u = sum(b[i] for i in range(1, n + 1) if i & p and i != p)
        b[p] = u % 2 if tipo == 'par' else 1 - u % 2
        p *= 2
    return ''.join(str(b[i]) for i in range(n, 0, -1))

def comprueba(w, tipo='par'):           # (bit erróneo, datos tras corregir, grupos)
    n = len(w); b = [0] + [int(c) for c in reversed(w)]; malo = 0; p = 1; txt = []
    while p <= n:
        u = sum(b[i] for i in range(1, n + 1) if i & p)
        falla = u % 2 != (0 if tipo == 'par' else 1)
        txt.append(f'g{p}:{u}{"X" if falla else "ok"}'); malo += p if falla else 0; p *= 2
    if 0 < malo <= n:
        b[malo] ^= 1
    return malo, ''.join(str(b[i]) for i in range(n, 0, -1) if i & (i - 1)), ' '.join(txt)

def cambia(w, pos):                     # cambia el bit de la posición pos (contando desde la derecha)
    i = len(w) - pos
    return w[:i] + ('1' if w[i] == '0' else '0') + w[i + 1:]

print('== Nivel 1')
for a, b in [('10110', '10011'), ('1110001', '0110100'), ('0000000', '1111111')]:
    print(f'  d({a}, {b}) = {distancia(a, b)}')
for letra in 'TVQ':
    a = format(ord(letra), '07b'); u = a.count('1')
    print(f'  {letra} = {a}: {u} unos -> par {u % 2}{a}  impar {1 - u % 2}{a}')
for w in ['00111', '11000', '10000', '01011']:
    u = w.count('1'); v = int(w[1:], 2)
    print(f'  {w}: unos = {u} ->', 'paridad impar bien' if u % 2 else 'paridad MAL', '| BCD', v if v <= 9 else 'no válido')

print('== Nivel 2')
print('  0001 par:', codifica('0001'), ' 0010 impar:', codifica('0010', 'impar'))
for w in ['0100001', '1110110', '0101011']:
    print('  ', w, 'impar ->', comprueba(w, 'impar'))

print('== Nivel 3')
w = '101110101101101'
print('  15 bits par:', w, '->', comprueba(w))
for k in (4, 11, 26, 64):
    m = 1
    while 2 ** m - m - 1 < k:
        m += 1
    print(f'  {k} bits de datos -> {m} de paridad, {k + m} en total')
dos = cambia(cambia(codifica('0101'), 5), 6)
print('  dos errores en 0101101 (bits 5 y 6):', dos, '->', comprueba(dos))

print('== ¿Qué falla aquí?')
print('  1010 bien:', codifica('1010'), ' con los datos al revés:', codifica('0101'))
print('  1011001 como impar:', comprueba('1011001', 'impar'), ' como par:', comprueba('1011001'))
w = cambia(codifica('1111'), 5)
print('  ', w, '->', comprueba(w), ' cambiando el bit 4:', comprueba(cambia(w, 4))[1])
