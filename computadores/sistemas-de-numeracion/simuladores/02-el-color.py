# Compruébalo con Python · El color del cuentagotas (#F4A261) en las cuatro bases
# Del artículo «Sistemas de numeración — teoría con los colores de una foto: binario, octal, hexadecimal y cambios de base paso a paso (y el atardecer que me salió azul marino)»
# https://sergiolearns.com/sistemas-de-numeracion/

# El color del cuentagotas, #F4A261, en las cuatro bases y por grupos de bits.
color = "F4A261"
canales = {"rojo": color[0:2], "verde": color[2:4], "azul": color[4:6]}
for nombre, hx in canales.items():
    n = int(hx, 16)                               # de hexadecimal a número
    print(f"{nombre:>5}: {hx} hex = {n:>3} dec = {n:08b} bin = {n:03o} oct")

bits = "".join(f"{int(h, 16):04b}" for h in color)   # cada cifra hex son 4 bits
print("24 bits      :", bits)
print("de 4 en 4    :", " ".join(bits[i:i + 4] for i in range(0, 24, 4)))
print("de 3 en 3    :", " ".join(bits[i:i + 3] for i in range(0, 24, 3)))
octal = "".join(str(int(bits[i:i + 3], 2)) for i in range(0, 24, 3))
print("en octal     :", octal)
print("comprobación :", oct(int(color, 16)), "=", int(color, 16), "dec")
print("colores con 24 bits:", 2 ** 24, "(del 0 al", 2 ** 24 - 1, ")")
print("un canal (8 bits) va de 0 a", 2 ** 8 - 1)
