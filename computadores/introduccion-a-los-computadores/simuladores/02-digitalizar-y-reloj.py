# Compruébalo con Python · Digitalizar una fila de la foto y enviarla con un reloj
# Del artículo «Introducción a los computadores — teoría con una foto de la pizarra, la arquitectura de Von Neumann, el ciclo de instrucción y un hola mundo que baja 7 pisos (y los «cero» computadores que llevaba encima)»
# https://sergiolearns.com/introduccion-a-los-computadores/

import math

# La luz real a lo largo de una fila de la foto de la pizarra es continua: pizarra oscura y dos trazos de tiza
def luz(x):            # x en milímetros de pizarra; devuelve un brillo entre 0 y 255
    return 40 + 175 * math.exp(-((x - 5.0) / 1.2) ** 2) + 160 * math.exp(-((x - 9.5) / 0.8) ** 2)

N, PASO, UMBRAL = 12, 1.0, 128          # 12 muestras, una por milímetro; umbral del modo «documento»
T_BIT = 1e-6                            # cada bit dura 1 microsegundo al enviarlo

muestras = [luz(i * PASO) for i in range(N)]          # 1) muestreo: valores sueltos de algo continuo
niveles = [round(m) for m in muestras]                # 2) cuantificación: cada muestra, a un entero 0-255
bits = "".join("1" if v > UMBRAL else "0" for v in niveles)   # 3) codificación con 1 bit (tiza = 1)

print("muestra :", " ".join(f"{i:>3}" for i in range(N)))
print("brillo  :", " ".join(f"{v:>3}" for v in niveles))
print("bit     :", " ".join(f"{b:>3}" for b in bits))
print("\nSeñal codificada:", bits)

# Cronograma: un bit por periodo de reloj (lógica positiva: 1 = nivel alto)
print("reloj :", "|‾|_" * N)
print("S     :", "".join("‾‾‾‾" if b == "1" else "____" for b in bits))

f = 1 / T_BIT
print(f"\nPeriodo de bit = periodo de reloj = {T_BIT * 1e6:.0f} µs")
print(f"Frecuencia de reloj = 1 / T = {f:.0f} Hz = {f / 1e6:.0f} MHz")
print(f"Tiempo para enviar los {N} bits = {N} x {T_BIT * 1e6:.0f} µs = {N * T_BIT * 1e6:.0f} µs")
print("Flancos de subida de S:", sum(1 for a, b in zip("0" + bits, bits) if a == "0" and b == "1"))
print("Bits a 1 (tiza):", bits.count("1"), "de", N)
