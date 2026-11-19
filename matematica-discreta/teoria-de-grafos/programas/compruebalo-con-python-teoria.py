# SergioLearns · Matemática discreta (MD) · Teoría de grafos
# Compruébalo con Python
# https://sergiolearns.com/teoria-de-grafos/

# --- Compruébalo con Python
aristas = [("a", "b", 7), ("a", "d", 12), ("a", "e", 6), ("b", "c", 5), ("b", "d", 8), ("b", "e", 10),
           ("c", "d", 9), ("d", "g", 18), ("e", "f", 5), ("e", "g", 22), ("f", "g", 14)]
vecinos = {}
for u, v, w in aristas:
    vecinos.setdefault(u, {})[v] = w
    vecinos.setdefault(v, {})[u] = w

grados = {v: len(vecinos[v]) for v in sorted(vecinos)}
print("Grados:", grados)
print("Suma:", sum(grados.values()), "= 2 ·", len(aristas))
print("Grado impar:", [v for v, g in grados.items() if g % 2 == 1])

# Matriz de adyacencia de a, b, c, d y su cuadrado
V = ["a", "b", "c", "d"]
A = [[1 if y in vecinos[x] else 0 for y in V] for x in V]
A2 = [[sum(A[i][k] * A[k][j] for k in range(4)) for j in range(4)] for i in range(4)]
for fila in A2:
    print(fila)

# --- Compruébalo con Python
def dijkstra_tabla(aristas, origen):
    vecinos = {}
    for u, v, w in aristas:
        vecinos.setdefault(u, {})[v] = w
        vecinos.setdefault(v, {})[u] = w
    V = sorted(vecinos)
    coste = {v: None for v in V}            # None = infinito
    previo = {origen: origen}
    coste[origen] = 0
    cerrados, columnas = [], []
    while len(cerrados) < len(V):
        abiertos = [v for v in V if v not in cerrados and coste[v] is not None]
        u = min(abiertos, key=lambda v: (coste[v], v))     # el más cercano; si empatan, por orden alfabético
        for v, w in vecinos[u].items():
            if v not in cerrados and (coste[v] is None or coste[u] + w < coste[v]):
                coste[v], previo[v] = coste[u] + w, u
        columnas.append({v: "*" if v in cerrados else "-" if coste[v] is None else f"{coste[v]},{previo[v]}" for v in V})
        cerrados.append(u)
    for v in V:
        print(v, " ".join(f"{c[v]:<5}" for c in columnas))
    return coste, previo

aristas = [("a", "b", 7), ("a", "d", 12), ("a", "e", 6), ("b", "c", 5), ("b", "d", 8), ("b", "e", 10),
           ("c", "d", 9), ("d", "g", 18), ("e", "f", 5), ("e", "g", 22), ("f", "g", 14)]
coste, previo = dijkstra_tabla(aristas, "a")
camino = ["g"]
while camino[-1] != "a":
    camino.append(previo[camino[-1]])
print("Camino:", " – ".join(reversed(camino)), "·", coste["g"], "minutos")
