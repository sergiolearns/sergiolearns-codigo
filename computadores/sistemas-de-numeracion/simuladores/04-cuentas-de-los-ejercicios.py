# Comprobación · Las cuentas de los ejercicios, de «¿Qué falla aquí?» y del cuestionario
# Del artículo «Sistemas de numeración — ejercicios resueltos con los canales de un color, opacidades en binario, un color de 12 bits y un cuestionario para practicar (y el 256 que no cabía en 8 bits)»
# https://sergiolearns.com/sistemas-de-numeracion-ejercicios/

# Cuentas de los ejercicios (niveles, fragmentos y cuestionario)
from fractions import Fraction as F
def frac(x, n):
    x = F(x); s = ""
    for _ in range(n):
        x *= 2; s += str(int(x)); x -= int(x)
    return s
for hx in ("C8", "4B", "1F"):
    n = int(hx, 16); print("N1", hx, n, f"{n:08b}", f"{n:o}")
for v in ("0.8125", "0.6", "13.6"):
    e = int(F(v)); s = frac(F(v) - e, 5); r = e + sum(F(int(b), 2**(i+1)) for i, b in enumerate(s))
    print("N2", v, f"{e:b},{s}", float(r), float(F(v) - r))
c = "F4A261"; c12 = c[0] + c[2] + c[4]; full = "".join(ch * 2 for ch in c12)
print("N3", 2**12, c12, full, [int(full[i:i+2], 16) - int(c[i:i+2], 16) for i in (0, 2, 4)], oct(int(c12, 16)), f"{int(c12,16):012b}")
print("F1", f"{162:b}", "leído al revés", f"{162:b}"[::-1])
print("F2", hex(0b1011101), "mal B5 =", 0xB5, "bien", 0b1011101)
print("F3", 16**3 - 1, (256).bit_length(), 2**8 - 1)
print("Q", int("1100100", 2), oct(100), hex(100), hex(int("110101011", 2)), oct(0xAF), int("777", 8), (300).bit_length(), int("0.101".replace("0.", ""), 2) / 8)
