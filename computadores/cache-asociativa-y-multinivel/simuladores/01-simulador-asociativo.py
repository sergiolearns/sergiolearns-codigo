# Compruébalo con Python · Simulador de una caché asociativa por conjuntos con LRU: la receta de la cocina y los dos vectores del tema 13
# Del artículo «Rendimiento de la caché, asociatividad y multinivel — teoría con una cocina, conjuntos de 2 vías y una caché L2 que salva la receta (y el 98 % de aciertos que me parecía perfecto)»
# https://sergiolearns.com/cache-asociativa-y-multinivel/

# Simulador de una caché asociativa por conjuntos con reemplazo LRU.
# vias = 1 es mapeo directo; vias = lineas, totalmente asociativa.
def simula(direcciones, lineas, palabras, vias):
    conjuntos = lineas // vias
    cache = [[] for _ in range(conjuntos)]        # cada conjunto: sus bloques, del menos al más usado
    fallos, marcas = 0, ""
    for d in direcciones:
        bloque = d // (4 * palabras)              # número de bloque (palabras de 4 bytes)
        c = bloque % conjuntos                    # el conjunto: bloque módulo número de conjuntos
        if bloque in cache[c]:
            cache[c].remove(bloque)               # acierto: pasa a ser el más reciente
            marcas += "A"
        else:
            fallos += 1
            marcas += "F"
            if len(cache[c]) == vias:             # conjunto lleno: sale el menos usado (LRU)
                cache[c].pop(0)
        cache[c].append(bloque)                   # al final de la lista = el más reciente
    return fallos, marcas, cache


# La receta de la cocina: huevos 0, harina 8, azúcar 16, leche 2, mantequilla 10 (bloques de 1 palabra)
receta = [b * 4 for b in [0, 8, 0, 16, 0, 8, 2, 16, 10, 2]]
for vias in [1, 2, 8]:
    f, m, c = simula(receta, 8, 1, vias)
    print(f"receta, {vias} vía(s): {m}  {f} fallos de {len(receta)}")
# Los dos vectores del tema 13: A en 128 y B en 192, el bucle lee A[i] y B[i] dos veces
vectores = [x for _ in range(2) for i in range(4) for x in (128 + 4 * i, 192 + 4 * i)]
for vias in [1, 2, 4, 8]:
    f, m, c = simula(vectores, 8, 2, vias)
    print(f"vectores, {vias} vía(s): {m}  {f} fallos de 16")
f, m, c = simula(vectores, 8, 2, 2)
print("estado final con 2 vías:", {i: b for i, b in enumerate(c) if b})
