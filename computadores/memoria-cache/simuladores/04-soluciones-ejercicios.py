# Compruébalo con Python · Las soluciones de los ejercicios de la caché de mapeo directo
# Del artículo «Memoria caché de mapeo directo — ejercicios con direcciones de 32 bits, una secuencia con su estado final y dos vectores que se pisan (y los 512 bits que en realidad eran 728)»
# https://sergiolearns.com/memoria-cache-ejercicios/

# Las soluciones de los ejercicios de la caché de mapeo directo, comprobadas de una vez.
from math import log2


def simula(direcciones, lineas, palabras):
    cache, vistos, recientes, marcas = [None] * lineas, set(), [], ""
    for d in direcciones:
        bloque = d // (4 * palabras); linea = bloque % lineas; etiq = bloque // lineas
        if cache[linea] == etiq:
            marcas += "A"                          # acierto
        else:
            marcas += ("O" if bloque not in vistos else
                       "P" if bloque not in recientes[-lineas:] else "C")   # obligatorio, caPacidad, conflicto
            cache[linea] = etiq
        vistos.add(bloque)
        if bloque in recientes:
            recientes.remove(bloque)
        recientes.append(bloque)
    return marcas, cache


print("Nivel 1: 256 líneas, bloques de 2 palabras, 32 bits")
for d in [0x0040002C, 0x10010A2C, 0x7FFFEFFC]:
    print(f"  0x{d:08X}: etiqueta 0x{d >> 11:06X}  línea {(d >> 3) % 256:3d}  palabra {(d >> 2) % 2}  byte {d % 4}")
etiqueta = 32 - int(log2(256)) - 1 - 2                # lo que sobra: 21 bits
print(f"  tamaño: 256 × (1 + {etiqueta} + 64) = {256 * (1 + etiqueta + 64)} bits = {256 * (1 + etiqueta + 64) / 1024} Kbits".replace(".", ","))

print("Nivel 2: 4 líneas de 2 palabras")
seq = [8, 36, 12, 40, 32, 8, 16, 12, 20, 36]
m, c = simula(seq, 4, 2)
print(" ", list(zip(seq, m)), "fallos", len(m) - m.count("A"), "de", len(m))
print("  estado:", {i: (e, (e * 4 + i) * 8) for i, e in enumerate(c) if e is not None})

print("Nivel 3: A en 128 y B en 192, 200 o 208; el bucle lee A[i] y B[i] y se repite dos veces")
for b in [192, 200, 208]:
    seq = [x for _ in range(2) for i in range(4) for x in (128 + 4 * i, b + 4 * i)]
    m, c = simula(seq, 8, 2)
    print(f"  B en {b}: {m}  fallos {len(m) - m.count('A')}/16")
print(f"  con postescritura: 8 × (1 + 1 + 26 + 64) = {8 * 92} bits")
