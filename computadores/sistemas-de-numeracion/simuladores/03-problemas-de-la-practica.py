# Compruébalo con Python · Las cuentas de los cuatro problemas guiados
# Del artículo «Sistemas de numeración — práctica con problemas guiados paso a paso: de cualquier base a decimal, binario con coma, grupos de bits y una cuestión con el formato del examen (y la coma que dividí como si fuera un entero)»
# https://sergiolearns.com/sistemas-de-numeracion-practica/

# Las cuentas de los cuatro problemas de la práctica, hechas con Python para comprobar.
from fractions import Fraction as F

def a_decimal(txt, base):                 # suma de pesos: cifra x base^posición
    ent, _, fr = txt.partition(",")
    v = sum(int(c, 16) * base ** i for i, c in enumerate(reversed(ent)))
    v += sum(F(int(c, 16), base ** (i + 1)) for i, c in enumerate(fr))
    return v

print("P1:", [str(float(a_decimal(*x))) for x in (("10110,101", 2), ("257,6", 8), ("3B,4", 16))])

ent, fr, bits = 45, F(3, 10), ""
for _ in range(6):                        # 6 cifras fraccionarias, como pide el problema
    fr *= 2; bits += str(int(fr)); fr -= int(fr)
rep = 45 + sum(F(int(b), 2 ** (i + 1)) for i, b in enumerate(bits))
print("P2:", f"{ent:b},{bits}", "=", float(rep), "error", float(F(453, 10) - rep))

print("P3:", f"{0x1E6F9C:024b}", oct(0x1E6F9C), "|", f"{0o7531:b}", hex(0o7531))
print("P3 con coma:", [str(float(a_decimal(*x))) for x in (("1011,01", 2), ("13,2", 8), ("B,4", 16))])

print("P4:", [f"{x:08b}" for x in (97, 0xB6, 0o147)], "| bits para 1000:", (1000).bit_length(),
      "| mayor con 3 cifras hex:", 16 ** 3 - 1, hex(16 ** 3 - 1))
