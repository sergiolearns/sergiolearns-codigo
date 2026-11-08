# Compruébalo con Python · Lo que el cronómetro no puede guardar exacto: 0,1, los huecos y los casos especiales
# Del artículo «Coma flotante IEEE 754 — teoría con un cronómetro de carrera, el 1 implícito y el exceso 127 (y el cronómetro que no paraba nunca)»
# https://sergiolearns.com/coma-flotante-ieee-754/

# Lo que el cronómetro no puede guardar exacto: 0,1, los huecos y los casos especiales
import struct

def f32(x):
    """Redondea x al float de 32 bits más cercano (lo que guardaría el cronómetro)."""
    return struct.unpack('>f', struct.pack('>f', x))[0]

def hexa(x):
    return struct.pack('>f', x).hex().upper()

print('0,1 ->', hexa(0.1), '=', f'{f32(0.1):.12f}')     # el más cercano, no el 0,1 de verdad

t = 0.0
for decima in range(36000):                           # una hora sumando una décima cada vez
    t = f32(t + f32(0.1))                             # cada suma se vuelve a redondear a 32 bits
print('una hora de décimas:', t, 's')

for x in (1.0, 100.0, 3600.0, 1e6):                   # hueco hasta el siguiente float
    sig = struct.unpack('>f', struct.pack('>I', int(hexa(x), 16) + 1))[0]
    print(f'después de {x:>9.0f} s el siguiente es +{sig - x:.10f}')

for h in ('00000000', '80000000', '7F800000', 'FF800000', '7FC00000', '00000001', '7F7FFFFF'):
    print(h, '->', struct.unpack('>f', bytes.fromhex(h))[0])
