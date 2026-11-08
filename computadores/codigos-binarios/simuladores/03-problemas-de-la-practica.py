# Compruébalo con Python · Las cuentas de los seis problemas guiados
# Del artículo «Códigos binarios — práctica con seis problemas guiados: BCD desde otras bases, sumas con +6, restas en C10, Gray y UTF-8 (y el 9 + 9 que me dio 12)»
# https://sergiolearns.com/codigos-binarios-practica/

# Problemas de la práctica de códigos: todas las cuentas, una vez
def bcd(n, cifras=1):
    return ' '.join(format(int(c), '04b') for c in str(n).zfill(cifras))

def suma_bcd(a, b, n):
    """Cifra a cifra, de derecha a izquierda: si pasa de 9, +6 y una a la siguiente."""
    acarreo, cifras = 0, []
    for x, y in zip(reversed(str(a).zfill(n)), reversed(str(b).zfill(n))):
        s = int(x) + int(y) + acarreo
        r = s + 6 if s > 9 else s
        print(f'  {x}+{y}+{acarreo}: {s >> 4} {s & 15:04b}' + (f' + 0110 = {r >> 4} {r & 15:04b}' if s > 9 else ''))
        acarreo, cifras = r >> 4, [r & 15] + cifras
    return acarreo, ' '.join(format(c, '04b') for c in cifras)

def a_gray(b):
    return b[0] + ''.join(str(int(x) ^ int(y)) for x, y in zip(b, b[1:]))

def de_gray(g):
    b = g[0]
    for x in g[1:]:
        b += str(int(x) ^ int(b[-1]))
    return b

print('== Problema 1')
for txt, base in (('2F7', 16), ('1563', 8), ('1101011011', 2)):
    n = int(txt, base)                              # primero a decimal, después cifra a cifra
    print(f'  {txt} (base {base}) = {n} -> {bcd(n)}')
print('  0110 1001 0100 ->', ''.join(str(int(g, 2)) for g in '0110 1001 0100'.split()))
print('  ¿0011 1100 0101 es BCD?', all(int(g, 2) <= 9 for g in '0011 1100 0101'.split()))

print('== Problema 2: 698 + 457')
a, c = suma_bcd(698, 457, 3); print('  =', bcd(a), c, '=', 698 + 457)
print('  395 + 605:'); a, c = suma_bcd(395, 605, 3); print('  =', bcd(a), c)

print('== Problema 3')
for x, y in ((812, 279), (279, 812)):
    print(f'  {x} - {y}: C10({y}) = {1000 - y} -> 1 {bcd(1000 - y, 3)}')
    a, c = suma_bcd(x, 1000 - y, 3)
    signo = (0 + 1 + a) % 2
    leido = int(''.join(str(int(g, 2)) for g in c.split()))   # las cifras tal cual
    print(f'  = {signo} {c}', '(positivo)' if signo == 0 else f'(negativo: {leido} es el C10 de {1000 - leido})')

print('== Problema 4')
print('  110100111010 -> Gray', a_gray('110100111010'))
print('  Gray 101110001101 -> binario', de_gray('101110001101'), '=', int(de_gray('101110001101'), 2))

print('== Problema 5')
print('  Listo:', ' '.join(f'{ord(c):02X}={ord(c):07b}' for c in 'Listo'))
for c in 'é€':
    print(f'  {c} U+{ord(c):04X} = {ord(c):b} -> UTF-8', ' '.join(f'{x:08b}' for x in c.encode()), '=', c.encode().hex(' ').upper())
t = 'Té 2 €'
print(f'  "{t}": UTF-8 {len(t.encode())} B, UTF-16 {len(t.encode("utf-16-be"))} B, UTF-32 {len(t.encode("utf-32-be"))} B')
print('  leído en Windows-1252:', t.encode().decode('cp1252'))   # la variante de Latin-1 de Windows

print('== Problema 6: 86 + 59')
print('  86 ->', bcd(86), ' 59 ->', bcd(59))
a, c = suma_bcd(86, 59, 2); print('  =', bcd(a), c, '=', 86 + 59)
print('== Pruébalo tú: 97 + 38')
a, c = suma_bcd(97, 38, 2); print('  =', bcd(a), c, '=', 97 + 38)
