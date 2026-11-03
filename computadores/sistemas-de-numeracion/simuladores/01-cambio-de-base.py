# Compruébalo con Python · Divisiones y multiplicaciones sucesivas con el color del atardecer
# Del artículo «Sistemas de numeración — teoría con los colores de una foto: binario, octal, hexadecimal y cambios de base paso a paso (y el atardecer que me salió azul marino)»
# https://sergiolearns.com/sistemas-de-numeracion/

# Cambio de base a mano, como en el papel: divisiones sucesivas para la parte entera
# y multiplicaciones sucesivas para la fraccionaria. Datos del color del atardecer.
from fractions import Fraction        # fracciones exactas: 0,4 no se redondea por el camino

DIG = "0123456789ABCDEF"              # el dígito 10 es la A, el 11 la B... hasta la F (15)

def entera(n, base):
    restos = []
    print(f"  {n} en base {base}:")
    while n >= base:                  # se divide mientras el cociente aún admita otra división
        c, r = divmod(n, base)
        print(f"    {n:>4} / {base} = {c:>3}  resto {r:>2} ({DIG[r]})")
        restos.append(DIG[r]); n = c
    print(f"    último cociente: {n} ({DIG[n]})")
    return DIG[n] + "".join(reversed(restos))   # último cociente + restos al revés

def fraccion(f, base, cifras):
    f = Fraction(f); out = ""
    print(f"  0,{str(float(f))[2:]} en base {base} con {cifras} cifras:")
    for _ in range(cifras):
        x = f * base; d = int(x)      # la parte entera es la cifra; se sigue con lo que sobra
        print(f"    {float(f):.4f} x {base} = {float(x):.4f} -> cifra {DIG[d]}")
        out += DIG[d]; f = x - d
        if f == 0: break              # exacto: no hace falta seguir
    return out, f

print("Canal verde, 162:", entera(162, 2))
print("Canal rojo, 244, en base 8:", entera(244, 8))
print("Canal rojo, 244, en base 16:", entera(244, 16))
for op, n in (("0.75", 4), ("0.4", 4)):
    bits, resto = fraccion(op, 2, n)
    real = sum(Fraction(int(b), 2 ** (i + 1)) for i, b in enumerate(bits))
    print(f"  -> 0,{bits} (vale {float(real)}; error {float(Fraction(op) - real)})")
