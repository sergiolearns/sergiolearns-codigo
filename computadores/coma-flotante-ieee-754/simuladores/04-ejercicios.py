# Compruébalo con Python · Las soluciones de los ejercicios y del cuestionario
# Del artículo «Ejercicios de coma flotante IEEE 754 — vueltas, diferencias con el récord y un cronómetro antiguo de 16 bits (y el 3,25 que se me convirtió en 2,0000012)»
# https://sergiolearns.com/coma-flotante-ieee-754-ejercicios/

# Ejercicios de coma flotante: las soluciones y el cuestionario, comprobados una vez
import struct

def hexa(x, f='>f'):
    return struct.pack(f, x).hex().upper()

def valor(h, f='>f'):
    return struct.unpack(f, bytes.fromhex(h))[0]

print('== Nivel 1')
for x in (12.5, 0.75):
    print(f'  {x} -> {hexa(x)}')
print('  C0300000 ->', valor('C0300000'))
print('== Nivel 2')
print('  -27,5625 ->', hexa(-27.5625))
print('  3E200000 ->', valor('3E200000'))
for x in (0.2, 0.625):
    exacto = valor(hexa(x)) == x                      # ¿vuelve igual tras guardarlo en 32 bits?
    print(f'  {x}: {hexa(x)} exacto: {exacto}')
print('== Nivel 3 (cronómetro antiguo: s | exponente 5 bits exceso 16 | magnitud 10 bits)')
from fractions import Fraction as F
def viejo(x, implicito):
    """Mantisa fraccionaria normalizada 0,1xxx; con bit implícito no se guarda ese primer 1."""
    m, e = F(abs(x)), 0
    while m >= 1: m /= 2; e += 1                     # coma a la izquierda del primer 1
    while m < F(1, 2): m *= 2; e -= 1
    bits = ''
    for _ in range(11):                               # 0,1 seguido de 10 bits más
        m *= 2; bits += str(int(m)); m -= int(m)
    mag = bits[1:11] if implicito else bits[:10]      # con implícito se salta el 1 de 0,1
    pal = ('1' if x < 0 else '0') + format(e + 16, '05b') + mag
    return e, pal, f'{int(pal, 2):04X}'
for x in (83.375, -0.15625):
    for imp in (False, True):
        print(f'  {x} implícito={imp}:', viejo(x, imp))
print('  máximo sin implícito:', (1 - F(1, 2 ** 10)) * 2 ** 15, ' con implícito:', (1 - F(1, 2 ** 11)) * 2 ** 15)
print('  mínimo positivo (los dos): 0,1 x 2^-16 =', F(1, 2) * F(1, 2 ** 16))
print('== ¿Qué falla aquí?')
def de_bits(s, e, m):
    """Junta los tres campos (la mantisa se rellena con ceros a la DERECHA) y da hex y valor."""
    h = f'{int(s + e + m.ljust(23, "0"), 2):08X}'
    return h, valor(h)
print('  21,25 sin sumar 127:', de_bits('0', '00000100', '010101'), ' bien:', hexa(21.25))
print('  10,625 con el 1 dentro:', de_bits('0', '10000010', '1010101'), ' bien:', hexa(10.625))
mal = '0' * 20 + '101'                                # la mantisa pegada a la derecha
print('  3,25 ceros a la izquierda:', de_bits('0', '10000000', mal), ' bien:', hexa(3.25))
print('== Cuestionario')
for x in (-6.5, 1.0, 0.5, 100.0, 2.0 ** -126):
    print(f'  {x} -> {hexa(x)}')
print('  entre 8 y 9 hay', int(hexa(9.0), 16) - int(hexa(8.0), 16) - 1, 'floats')
print('  17,25 en doble:', hexa(17.25, '>d'), ' en simple:', hexa(17.25))
print('  41100000 ->', valor('41100000'), ' C1A00000 ->', valor('C1A00000'))
