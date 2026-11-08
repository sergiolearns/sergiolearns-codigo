# Compruébalo con Python · BCD 8421, suma con la corrección de +6 y resta con complemento a 10
# Del artículo «Códigos binarios: BCD, Gray y ASCII/Unicode — teoría con un microondas, la suma con +6 y un mando que solo cambia un bit (y el «EstÃ¡ listo» de mi primer script)»
# https://sergiolearns.com/codigos-binarios/

# El microondas guarda cada cifra en BCD 8421 y suma con la corrección de +6
def bcd(n, cifras=1):
    """Cada cifra decimal en 4 bits (8-4-2-1)."""
    return ' '.join(format(int(c), '04b') for c in str(n).zfill(cifras))

def b5(s):                                          # 5 bits: acarreo + 4 bits
    return f'{s >> 4} {s & 15:04b}'

def suma_bcd(a, b, n):
    """Suma cifra a cifra, de derecha a izquierda, corrigiendo con +6."""
    acarreo, cifras = 0, []
    for x, y in zip(reversed(str(a).zfill(n)), reversed(str(b).zfill(n))):
        s = int(x) + int(y) + acarreo               # suma binaria de 4 bits
        if s > 9:                                   # > 9 o acarreo de 4 bits (s >= 16)
            r = s + 6                               # +6 salta las 6 palabras no válidas
            print(f'  {x} + {y} + {acarreo} = {s:2} -> {b5(s)} + 0110 = {b5(r)}')
        else:
            r = s
            print(f'  {x} + {y} + {acarreo} = {s:2} -> {b5(s)} vale tal cual')
        acarreo, cifras = r >> 4, [r & 15] + cifras  # el 1 de la izquierda pasa a la cifra siguiente
    return acarreo, ' '.join(format(c, '04b') for c in cifras)

def resta_bcd(a, b, n=3):
    """a - b = a + C10(b); el signo es 0 + 1 + acarreo y su acarreo se descarta."""
    acarreo, cifras = suma_bcd(a, 10 ** n - b, n)
    signo = (0 + 1 + acarreo) % 2
    return f'{signo} {cifras}'

print('475 g ->', bcd(475))
print('475 en binario natural:', format(475, 'b'), f'({len(format(475, "b"))} bits frente a 12)')
print('58 + 67:')
acarreo, cifras = suma_bcd(58, 67, 2)
print('  =', bcd(acarreo), cifras, '= 125')
print('-385 en C10: 1', bcd(1000 - 385))
for a, b in ((742, 385), (385, 742)):
    print(f'{a} - {b} = {a} + C10({b}):')
    print('  =', resta_bcd(a, b))
