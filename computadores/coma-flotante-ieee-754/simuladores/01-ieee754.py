# Compruébalo con Python · Un tiempo del cronómetro en IEEE 754 de simple precisión, a la ida y a la vuelta
# Del artículo «Coma flotante IEEE 754 — teoría con un cronómetro de carrera, el 1 implícito y el exceso 127 (y el cronómetro que no paraba nunca)»
# https://sergiolearns.com/coma-flotante-ieee-754/

# El cronómetro de la carrera guarda cada tiempo en IEEE 754 de simple precisión
import struct

def campos(x):
    """Devuelve el hexadecimal, el signo, el exponente y la mantisa de x en 32 bits."""
    w = struct.unpack('>I', struct.pack('>f', x))[0]   # los 32 bits como entero
    b = format(w, '032b')
    return f'{w:08X}', b[0], b[1:9], b[9:]             # 1 + 8 + 23 bits

def leer(h):
    """De un hexadecimal de 8 cifras al número, a mano: (-1)^s * 1,mantisa * 2^(e-127)."""
    b = format(int(h, 16), '032b')
    s, e, m = int(b[0]), int(b[1:9], 2), b[9:]
    frac = sum(int(c) * 2 ** -(i + 1) for i, c in enumerate(m))   # 0,mantisa
    return (-1) ** s * (1 + frac) * 2 ** (e - 127), e - 127

for t in (83.375, -0.15625):                           # una vuelta y una diferencia con el récord
    h, s, e, m = campos(t)
    print(f'{t:>9}: {s} | {e} | {m} = {h}')
    print(f'{"":>9}  exponente {int(e, 2)} - 127 = {int(e, 2) - 127}')

valor, exp = leer('42A6C000')                          # y de vuelta, sin struct
print('42A6C000 ->', valor, ' (exponente real', exp, ')')
