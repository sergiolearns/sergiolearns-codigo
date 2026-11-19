# SergioLearns · Matemática discreta (MD) · Teoría de grafos
# Problema 1: tipos de grafos y grados
# https://sergiolearns.com/teoria-de-grafos-practica/

from collections import Counter

# a) Pseudografo: una arista por línea (el bucle se escribe ("d", "d"))
lineas = [("a", "b"), ("a", "b"), ("b", "c"), ("c", "d"), ("c", "d"), ("a", "d"), ("d", "d")]
grado = Counter()
for u, v in lineas:
    grado[u] += 1
    grado[v] += 1          # en un bucle, u == v: suma 2 al mismo vértice
print("Grados:", dict(sorted(grado.items())), "· suma:", sum(grado.values()), "= 2 ·", len(lineas))

# c) Torneo de mus: (ganador, perdedor)
partidos = [("A", "B"), ("A", "C"), ("A", "D"), ("B", "C"), ("D", "B"), ("D", "C")]
salida = Counter(g for g, p in partidos)
entrada = Counter(p for g, p in partidos)
for x in "ABCD":
    print(x, "salida:", salida[x], "entrada:", entrada[x])
print("Fuente:", [x for x in "ABCD" if entrada[x] == 0], "· sumidero:", [x for x in "ABCD" if salida[x] == 0])
