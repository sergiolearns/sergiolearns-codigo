# SergioLearns · Matemática discreta (MD) · Teoría de grafos
# Compruébalo con Python
# https://sergiolearns.com/teoria-de-grafos-ejercicios/

from math import comb

# Ejercicio 1
print("1a)", 2 * 12 // 3, "vértices")
print("1b)", comb(8, 2), 4 * 5, 6 + 6)
print("1c)", 6 + (30 - 6 * 3) // 2, "vértices")

# Ejercicio 2: la matriz, sus grados y A²
A = [[0, 1, 0, 1, 0], [1, 0, 1, 0, 1], [0, 1, 0, 1, 0], [1, 0, 1, 0, 1], [0, 1, 0, 1, 0]]
print("2a) grados:", [sum(fila) for fila in A])
A2_13 = sum(A[0][k] * A[k][2] for k in range(5))
print("2c) (A²)13 =", A2_13)

# Ejercicio 4: Dijkstra con la tabla del examen
def dijkstra(aristas, origen):
    vec = {}
    for u, v, w in aristas:
        vec.setdefault(u, {})[v] = w
        vec.setdefault(v, {})[u] = w
    V = sorted(vec)
    coste, previo, cerrados, cols = {v: None for v in V}, {origen: origen}, [], []
    coste[origen] = 0
    while len(cerrados) < len(V):
        u = min((v for v in V if v not in cerrados and coste[v] is not None), key=lambda v: (coste[v], v))
        for v, w in vec[u].items():
            if v not in cerrados and (coste[v] is None or coste[u] + w < coste[v]):
                coste[v], previo[v] = coste[u] + w, u
        cols.append({v: "*" if v in cerrados else "-" if coste[v] is None else f"{coste[v]},{previo[v]}" for v in V})
        cerrados.append(u)
    for v in V:
        print(v, " ".join(f"{c[v]:<5}" for c in cols))
    return coste, previo

e4 = [("a", "b", 3), ("a", "c", 7), ("b", "c", 2), ("b", "d", 6), ("c", "d", 3), ("c", "e", 8),
      ("d", "e", 2), ("d", "f", 5), ("e", "f", 1), ("e", "g", 6), ("f", "g", 4)]
coste, previo = dijkstra(e4, "a")
c = ["g"]
while c[-1] != "a":
    c.append(previo[c[-1]])
print("4) camino:", "-".join(reversed(c)), "· coste", coste["g"])
