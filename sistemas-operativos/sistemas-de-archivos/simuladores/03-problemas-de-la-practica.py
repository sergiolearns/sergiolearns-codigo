# Práctica guiada · Bloques, lecturas según la asignación, i-nodo y espacio libre de los problemas
# Del artículo «Sistemas de archivos — práctica con problemas guiados paso a paso: bloques y fragmentación interna, lecturas según la asignación, el i-nodo y un ejercicio con el formato del examen (y el bloque que conté desde 1)»
# https://sergiolearns.com/sistemas-de-archivos-practica/

# Sistemas de archivos de papel: bloques, lecturas según la asignación, i-nodo y espacio libre.
import math
KiB, MiB, GiB = 1024, 1024 ** 2, 1024 ** 3
B = 2 * KiB                                    # tamaño de bloque
for nombre, tam in (("foto.jpg", 5000), ("tfg.docx", 20 * KiB), ("video.mp4", 3 * MiB + 100)):
    n = math.ceil(tam / B); print(f"{nombre}: {n} bloques, se pierden {n * B - tam} B dentro del último")

k = 6                                          # leer el bloque lógico 6 (contando desde 0)
print("lecturas para el bloque 6: contigua 1, enlazada", k + 1, "| FAT en RAM 1 | indexada", 1 + 1)

N = B // 4                                     # punteros de 4 B por bloque de índices
directos = 12
niv = [directos, N, N ** 2, N ** 3]
acum = 0
for nom, n in zip(("directos", "simple", "doble", "triple"), niv):
    acum += n; print(f"{nom}: {n} bloques, acumulado {acum} bloques = {acum * B / GiB:.4f} GiB")
print(f"máximo: {acum * B} B = {acum * B / GiB:.2f} GiB")
for byte in (20000, 600000, 2 * 10 ** 9):
    b = byte // B
    nivel = "directo" if b < 12 else "simple" if b < 12 + N else "doble" if b < 12 + N + N ** 2 else "triple"
    print(f"byte {byte}: bloque lógico {b}, puntero {nivel}")

disco = 256 * GiB; bloques = disco // (4 * KiB)
print(f"disco 256 GiB, bloques de 4 KiB: {bloques} bloques; mapa de bits {bloques // 8 // MiB} MiB; FAT de 4 B {bloques * 4 // MiB} MiB")
