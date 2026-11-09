# Compruébalo con Python · Las cuentas de los seis problemas guiados de la caché de mapeo directo
# Del artículo «Memoria caché de mapeo directo — práctica guiada con direcciones partidas, secuencias de accesos, el tamaño total y las escrituras paso a paso (y el primer acceso que marqué como conflicto)»
# https://sergiolearns.com/memoria-cache-practica/

# Los seis problemas de la práctica de la caché de mapeo directo, comprobados de una vez.
from math import log2


def campos(d, lineas, palabras):                  # partir una dirección de 32 bits
    o_pal, o_lin = int(log2(palabras)), int(log2(lineas))
    return d >> (2 + o_pal + o_lin), (d >> (2 + o_pal)) % lineas, (d >> 2) % palabras, d % 4


def simula(direcciones, lineas, palabras, ops=None, politica="directa", ver=True):
    cache, sucio = [None] * lineas, [0] * lineas  # etiqueta y bit de modificación de cada línea
    vistos, recientes, fallos, esc_mem = set(), [], 0, 0
    for k, d in enumerate(direcciones):
        op = ops[k] if ops else "L"               # L = lectura, E = escritura
        bloque = d // (4 * palabras); linea = bloque % lineas; etiq = bloque // lineas
        if cache[linea] == etiq:
            tipo = "acierto"
        else:
            fallos += 1
            tipo = ("obligatorio" if bloque not in vistos else
                    "capacidad" if bloque not in recientes[-lineas:] else "conflicto")
        carga = not (op == "E" and politica == "directa")   # directa: no ubica en escritura
        if tipo != "acierto" and carga:
            if sucio[linea]:
                esc_mem += 1                      # postescritura: el bloque sucio vuelve a memoria
            cache[linea], sucio[linea] = etiq, 0
        if op == "E":
            if politica == "directa":
                esc_mem += 1                      # cada escritura llega a memoria
            else:
                sucio[linea] = 1                  # solo se marca; irá a memoria al salir
        if carga:
            vistos.add(bloque)
            if bloque in recientes:
                recientes.remove(bloque)
            recientes.append(bloque)
        if ver:
            print(f"  {op} {d:3d}  bloque {bloque:2d}  línea {linea}  palabra {(d // 4) % palabras}  {tipo}")
    return fallos, cache, sucio, esc_mem


def tasa(f, n):
    return f"{f}/{n} = {100 * f / n:.0f} %"


print("Problema 1: 128 líneas, bloques de 8 palabras (etiqueta 20, índice 7, palabra 3, byte 2)")
for d in [0x10010064, 0x10011064, 0x0040003C]:
    e, i, p, b = campos(d, 128, 8)
    print(f"  0x{d:08X}: etiqueta 0x{e:05X}  línea {i:3d}  palabra {p}  byte {b}")

print("Problema 2: 8 líneas de 1 palabra")
seq = [24, 88, 12, 24, 12, 60, 24, 60, 88, 12]
f, c, _, _ = simula(seq, 8, 1)
print("  fallos", tasa(f, len(seq)), "| estado:", {i: (e, (e * 8 + i) * 4) for i, e in enumerate(c) if e is not None})

print("Problema 3: 16 KiB de datos, bloques de 16 bytes")
lineas = 16 * 1024 // 16; etiq = 32 - int(log2(lineas)) - 4
total = lineas * (1 + etiq + 128)
print(f"  {lineas} líneas, etiqueta {etiq} bits, total {total} bits = {total // 1024} Kbits,"
      f" {100 * (total / (16 * 1024 * 8) - 1):.1f} % más que los datos".replace(".", ","))
print(f"  con bit de modificación: {lineas * (2 + etiq + 128) // 1024} Kbits")

print("Problema 4: conflicto, capacidad y tamaño de bloque (16 bytes de datos)")
f, *_ = simula([0, 16, 0, 16, 0, 16], 4, 1)
f, *_ = simula([0, 4, 8, 12, 16, 20] * 2, 4, 1)
for lin, pal in [(4, 1), (2, 2), (1, 4)]:
    a = simula(list(range(0, 32, 4)) * 2, lin, pal, ver=False)[0]
    b = simula([0, 40, 4, 44] * 2, lin, pal, ver=False)[0]
    print(f"  {lin} líneas × {pal} palabras: vector seguido {a:2d}/16 fallos, dos datos lejos {b}/8")

print("Problema 5: escrituras (4 líneas de 2 palabras)")
seq, ops = [0, 48, 4, 48, 8, 48, 12, 48], ["L", "E"] * 4
for pol in ["directa", "post"]:
    f, c, s, m = simula(seq, 4, 2, ops, pol)
    print(f"  {pol}: fallos {f}/8, escrituras en memoria {m}, bits de modificación {s}")

print("Problema 6: la cuestión tipo examen (8 líneas, bloques de 2 palabras)")
for seq in ([36, 100, 16, 32, 20, 176, 104, 96, 180, 108], [140, 56, 12, 136, 60, 84, 80, 140, 12, 84]):
    f, c, _, _ = simula(seq, 8, 2)
    print("  fallos", tasa(f, len(seq)), "| tamaño", 8 * (1 + 26 + 64), "bits")
    for i, e in enumerate(c):
        if e is not None:
            print(f"  línea {i:03b}: V=1  etiqueta 00…{e:02b}  {(e * 8 + i) * 8} {(e * 8 + i) * 8 + 4}")
