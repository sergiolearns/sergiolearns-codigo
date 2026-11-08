# Las soluciones de los ejercicios y el cuestionario, comprobadas una vez
# Del artículo «Códigos binarios — ejercicios con descongelados en BCD, restas en C10, un mando en Gray y bytes de UTF-8 (y el mando que marcaba 14 estando en el 13)»
# https://sergiolearns.com/codigos-binarios-ejercicios/

# Ejercicios de códigos: las soluciones y el cuestionario, comprobados una vez
def bcd(n, cifras=1):
    return ' '.join(format(int(c), '04b') for c in str(n).zfill(cifras))

def leer_bcd(t):
    return int(''.join(str(int(g, 2)) for g in t.split()))

def suma_bcd(a, b, n, ver=True):
    acarreo, cifras = 0, []
    for x, y in zip(reversed(str(a).zfill(n)), reversed(str(b).zfill(n))):
        s = int(x) + int(y) + acarreo
        r = s + 6 if s > 9 else s
        if ver:
            print(f'  {x}+{y}+{acarreo}: {s >> 4} {s & 15:04b}' + (f' + 0110 = {r >> 4} {r & 15:04b}' if s > 9 else ''))
        acarreo, cifras = r >> 4, [r & 15] + cifras
    return acarreo, ' '.join(format(c, '04b') for c in cifras)

def total(a, c):
    return (bcd(a) + ' ' if a else '') + c          # el acarreo final, solo si hay

def resta_bcd(a, b, n):
    c10 = 10 ** n - b
    print(f'  C10({b}) = {c10} -> 1 {bcd(c10, n)}')
    acarreo, c = suma_bcd(a, c10, n)
    signo = (1 + acarreo) % 2                       # 0 + 1 + acarreo; el acarreo del signo se descarta
    v = leer_bcd(c)
    print(f'  = {signo} {c} ->', v if signo == 0 else -(10 ** n - v))

def a_gray(b):
    return b[0] + ''.join(str(int(x) ^ int(y)) for x, y in zip(b, b[1:]))

def de_gray(g):
    b = g[0]
    for x in g[1:]:
        b += str(int(x) ^ int(b[-1]))
    return b

def utf(t):
    return f'UTF-8 {t.encode().hex(" ").upper()} ({len(t.encode())} B), UTF-16 {len(t.encode("utf-16-be"))} B, UTF-32 {len(t.encode("utf-32-be"))} B'

print('== Nivel 1')
print('  307 ->', bcd(307), ' 1250 ->', bcd(1250))
print('  1001 0000 0110 0010 ->', leer_bcd('1001 0000 0110 0010'))
for t in ('0101 1010 0011', '1000 0111 1001', '0110 1111'):
    print(f'  {t}: BCD válido = {all(int(g, 2) <= 9 for g in t.split())}')
for p in (5, 6):
    print(f'  muesca {p}: binario {p:04b} Gray {a_gray(format(p, "04b"))}')
print('  ON:', ' '.join(f'{ord(c):02X}' for c in 'ON'), ' cifras 0-9:', ' '.join(f'{ord(c):02X}' for c in '0123456789'))

print('== Nivel 2')
print('  274 + 389:'); a, c = suma_bcd(274, 389, 3); print('  =', total(a, c), '=', 274 + 389)
print('  905 + 96:'); a, c = suma_bcd(905, 96, 3); print('  =', bcd(a), c, '=', 905 + 96)
print('  520 - 734:'); resta_bcd(520, 734, 3)
print('  Gray 1101 -> binario', de_gray('1101'), '=', int(de_gray('1101'), 2))
print('  Gray 1001101110 -> binario', de_gray('1001101110'), '=', int(de_gray('1001101110'), 2))
print('  Piña:', utf('Piña'))

print('== Nivel 3')
print('  4679 + 5385:'); a, c = suma_bcd(4679, 5385, 4); print('  =', bcd(a), c, '=', 4679 + 5385)
print('  3586 - 7249:'); resta_bcd(3586, 7249, 4)
for c in 'ñ🍲':
    print(f'  U+{ord(c):04X} = {ord(c):b} -> UTF-8', ' '.join(f'{x:08b}' for x in c.encode()), '=', c.encode().hex(' ').upper())
print('  Piña leído en Windows-1252:', 'Piña'.encode().decode('cp1252'))

print('== ¿Qué falla aquí?')
a, c = suma_bcd(9, 8, 1, False); print('  9 + 8 =', bcd(a), c)
print('  Gray 1011 -> binario', de_gray('1011'), ' (pares de Gray:', a_gray('1011'), ')')

print('== Cuestionario')
print('  decodificar:', [leer_bcd(t) for t in ('0101 1000 0001', '0011 0000 0010 1001', '0111 0100 0000')])
print('  2A hex ->', bcd(0x2A))
print('  47 + 38 ->', ' '.join(suma_bcd(47, 38, 2, False)[1:]))
print('  659 + 278:'); a, c = suma_bcd(659, 278, 3); print('  =', c, '=', 659 + 278)
print('  -465 en C10: 1', bcd(1000 - 465))
print('  1 0011 0110 0010 ->', -(1000 - leer_bcd('0011 0110 0010')))
print('  1011 -> Gray', a_gray('1011'), '  Gray 0111 -> binario', de_gray('0111'))
print('  K =', f'{ord("K"):02X}', ' 7 =', f'{ord("7"):02X}', '=', f'{ord("7"):08b}')
print('  bytes UTF-8:', [len(c.encode()) for c in 'Añ€🍲'])
