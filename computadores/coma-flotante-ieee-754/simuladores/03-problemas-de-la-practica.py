# Compruébalo con Python · Las cuentas de los cinco problemas guiados
# Del artículo «Coma flotante IEEE 754 — práctica con cinco problemas guiados paso a paso, del decimal al hexadecimal (y el exponente que conté al revés en un simulacro)»
# https://sergiolearns.com/coma-flotante-ieee-754-practica/

# Problemas de la práctica de coma flotante: todas las cuentas, una vez
import struct
from fractions import Fraction

def a_binario(x, maxfrac=30):
    """Parte entera por divisiones y parte fraccionaria por multiplicaciones por 2."""
    ent, frac = int(abs(x)), Fraction(abs(x)) - int(abs(x))
    cifras = ''
    while frac and len(cifras) < maxfrac:             # cada vuelta: x2 y se queda la parte entera
        frac *= 2
        cifras += str(int(frac)); frac -= int(frac)
    return format(ent, 'b') + ',' + (cifras or '0')

def ieee(x):
    w = struct.unpack('>I', struct.pack('>f', x))[0]
    b = format(w, '032b')
    return b[0], b[1:9], b[9:], f'{w:08X}'

def mostrar(x):
    s, e, m = ieee(x)[:3]
    print(f'  {x}: binario {a_binario(x)}  exponente {int(e, 2) - 127} + 127 = {int(e, 2)} = {e}')
    print(f'  {s} | {e} | {m} = {ieee(x)[3]}')

print('== Problema 1'); mostrar(58.40625)
print('== Problema 2'); mostrar(-0.34375)
print('== Problema 3')
for h in ('42BF6000', '80000000', '7F800000', 'FFC00000', '00200000'):
    x = struct.unpack('>f', bytes.fromhex(h))[0]
    b = format(int(h, 16), '032b')
    print(f'  {h}: s={b[0]} e={b[1:9]} m={b[9:12]}... -> {x}')
print('  2^-128 =', 2 ** -128)
print('== Problema 4')
print('  0,1 en binario:', a_binario(0.1, 28) + '...')
print('  simple:', ieee(0.1)[3], '=', f'{struct.unpack(">f", struct.pack(">f", 0.1))[0]:.20f}')
print('  doble :', struct.pack('>d', 0.1).hex().upper(), '=', f'{0.1:.20f}')
print('== Problema 5: 37,6875'); mostrar(37.6875)
print('== Pruébalo tú: -9,40625'); mostrar(-9.40625)
