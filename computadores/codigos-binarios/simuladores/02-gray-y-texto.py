# Compruébalo con Python · El mando del microondas en Gray y sus mensajes en ASCII y UTF-8
# Del artículo «Códigos binarios: BCD, Gray y ASCII/Unicode — teoría con un microondas, la suma con +6 y un mando que solo cambia un bit (y el «EstÃ¡ listo» de mi primer script)»
# https://sergiolearns.com/codigos-binarios/

# El mando del microondas en Gray y sus mensajes en ASCII y UTF-8
def a_gray(b):
    """El primer bit igual; después, cada par de bits vecinos sumados sin acarreo (XOR)."""
    return b[0] + ''.join(str(int(x) ^ int(y)) for x, y in zip(b, b[1:]))

def de_gray(g):
    """Cada bit binario = bit Gray XOR el bit BINARIO anterior."""
    b = g[0]
    for x in g[1:]:
        b += str(int(x) ^ int(b[-1]))
    return b

for pos in (7, 8):                                  # dos muescas seguidas del mando
    b = format(pos, '04b')
    print(f'muesca {pos:2}: binario {b}  Gray {a_gray(b)}')
cambios = lambda u, v: sum(x != y for x, y in zip(u, v))
print('bits que cambian de 7 a 8: binario', cambios('0111', '1000'), ' Gray', cambios(a_gray('0111'), a_gray('1000')))
print('Gray 0101 -> binario', de_gray('0101'))

print('LISTO en ASCII:', ' '.join(f'{ord(c):02X}' for c in 'LISTO'))
for c in 'Añ€好🍲':                                 # 1, 2, 3, 3 y 4 bytes en UTF-8
    print(f'{c} U+{ord(c):04X}  UTF-8 {c.encode("utf-8").hex(" ").upper():12}',
          f'UTF-16 {len(c.encode("utf-16-be"))} B  UTF-32 4 B')
msg = 'Está listo'.encode('utf-8')                  # la app lo manda en UTF-8...
print(msg.decode('latin-1'))                        # ...y alguien lo lee en Latin-1
