# Compruébalo con Python · Las cuentas de los seis problemas guiados de rendimiento de la caché, asociatividad y multinivel
# Del artículo «Rendimiento de la caché, asociatividad y multinivel — práctica guiada con el CPI con fallos, direcciones partidas en conjuntos, LRU y dos niveles paso a paso (y los fallos de datos que conté en todas las instrucciones)»
# https://sergiolearns.com/cache-asociativa-y-multinivel-practica/

# Los seis problemas de la práctica de rendimiento de la caché, asociatividad y multinivel, comprobados de una vez.
from math import log2


def n(x, d=2):                                     # número con coma decimal
    return f"{x:.{d}f}".replace(".", ",")


def simula(direcciones, lineas, palabras, vias, ver=True):
    conjuntos = lineas // vias
    via = [[None] * vias for _ in range(conjuntos)]   # lo que hay en cada vía de cada conjunto
    uso = [[] for _ in range(conjuntos)]          # orden de uso: el primero es el menos reciente (LRU)
    vistos, recientes, fallos = set(), [], 0
    for d in direcciones:
        bloque = d // (4 * palabras); c = bloque % conjuntos; sale = ""
        if bloque in via[c]:
            tipo = "acierto"; uso[c].remove(bloque)
        else:
            fallos += 1
            tipo = ("obligatorio" if bloque not in vistos else
                    "capacidad" if bloque not in recientes[-lineas:] else "conflicto")
            v = via[c].index(None) if None in via[c] else via[c].index(uso[c].pop(0))
            if via[c][v] is not None:
                sale = f"  sale {via[c][v]}"      # el bloque menos usado deja su vía
            via[c][v] = bloque
        uso[c].append(bloque); vistos.add(bloque)
        if bloque in recientes:
            recientes.remove(bloque)
        recientes.append(bloque)
        if ver:
            print(f"  {d:3d}  bloque {bloque:2d}  conjunto {c}  etiqueta {bloque // conjuntos:2d}  {tipo}{sale}")
    return fallos, via


print("Problema 1: CPI con fallos de instrucciones y de datos")
ciclo = 1 / 2.5                                    # 2,5 GHz = 0,4 ns por ciclo
penal = round(40 / ciclo)                          # memoria de 40 ns
cpi = 1 + 0.02 * penal + 0.25 * 0.08 * penal
print(f"  penalización {penal} ciclos; CPI {n(cpi)}; ideal {n(cpi)} veces más rápida; parado {n(100 * (cpi - 1) / cpi, 0)} %")
print(f"  10^9 instrucciones: {n(1e9 * cpi * ciclo * 1e-9)} s frente a {n(1e9 * 1 * ciclo * 1e-9)} s")

print("Problema 2: tiempo medio de acceso y dos niveles (2 GHz)")
l2, mem, l1, glob = round(5 / 0.5), round(100 / 0.5), 0.04, 0.005
sin_l2 = 1 + l1 * mem; con_l2 = 1 + l1 * l2 + glob * mem
print(f"  L2 = {l2} ciclos, memoria = {mem}; tasa local de L2 {n(100 * glob / l1, 1)} %")
print(f"  TMAM sin L2 {n(sin_l2)} ciclos ({n(sin_l2 * 0.5)} ns), con L2 {n(con_l2)} ({n(con_l2 * 0.5)} ns): {n(sin_l2 / con_l2)} veces")
acc = 1.25                                         # accesos por instrucción: 1 instrucción + 25 % de datos
c1, c2 = 1 + acc * (sin_l2 - 1), 1 + acc * (con_l2 - 1)
print(f"  CPI sin L2 {n(c1)}, con L2 {n(c2)}: {n(c1 / c2)} veces")

print("Problema 3: 16 KiB de datos, bloques de 16 bytes, direcciones de 32 bits")
bloques = 16 * 1024 // 16
for vias, nombre in [(1, "directa"), (2, "2 vías"), (4, "4 vías"), (bloques, "totalmente")]:
    indice = int(log2(bloques // vias)); etiqueta = 32 - indice - 4
    print(f"  {nombre:>10}: conjunto {indice:2d} bits, etiqueta {etiqueta} bits, comparadores {vias},"
          f" etiquetas {etiqueta * bloques // 1024} Kbits, total {bloques * (1 + etiqueta + 128) // 1024} Kbits")
for d in [0x1001A2C4, 0x1002A2C8]:
    print(f"  0x{d:08X}  4 vías: etiqueta 0x{d >> 12:05X}  conjunto {(d >> 4) % 256}  palabra {(d >> 2) % 4}  byte {d % 4}"
          f" | directa: línea {(d >> 4) % 1024}")

print("Problema 4: 8 bloques de 1 palabra, 2 vías, LRU")
seq = [100, 4, 100, 44, 68, 100, 4, 100, 68, 44, 100, 44]
f, via = simula(seq, 8, 1, 2)
print(f"  fallos {f}/{len(seq)} | estado final: { {c: v for c, v in enumerate(via) if v != [None, None]} } | directa: {simula(seq, 8, 1, 1, False)[0]}/{len(seq)}")

print("Problema 5: memoria de una palabra frente a entrelazada (bloques de 4 palabras)")
una, bancos = 1 + 4 * 20 + 4 * 1, 1 + 20 + 4 * 1
print(f"  penalización {una} frente a {bancos} ciclos; {n(16 / una)} frente a {n(16 / bancos)} bytes/ciclo")
print(f"  CPI con 2 fallos cada 100 instrucciones: {n(1 + 0.02 * una)} frente a {n(1 + 0.02 * bancos)}")

print("Problema 6: la cuestión tipo examen (8 bloques de 2 palabras, 2 vías, LRU)")
for seq in ([172, 236, 172, 104, 188, 132, 128, 184, 168, 232], [0, 68, 44, 100, 96, 68, 4, 64, 0, 40]):
    f, via = simula(seq, 8, 2, 2)
    tasa = f / len(seq)
    print(f"  fallos {f}/{len(seq)} = {n(100 * tasa, 0)} %  estado { {c: v for c, v in enumerate(via) if v != [None, None]} }  TMAM {n(1 + tasa * 20, 1)} ciclos")
print(f"  tamaño: 8 × (1 + {32 - 2 - 3} + 64) = {8 * (1 + 27 + 64)} bits")
