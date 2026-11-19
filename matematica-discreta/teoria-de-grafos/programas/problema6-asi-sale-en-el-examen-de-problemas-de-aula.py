# SergioLearns · Matemática discreta (MD) · Teoría de grafos
# Problema 6: así sale en el examen de problemas de aula
# https://sergiolearns.com/teoria-de-grafos-practica/

def dijkstra_tabla(aristas, origen, pasos=10):
    vecinos = {}
    for u, v, w in aristas:
        vecinos.setdefault(u, {})[v] = w
        vecinos.setdefault(v, {})[u] = w
    V = sorted(vecinos)
    coste, previo = {v: None for v in V}, {origen: origen}
    coste[origen] = 0
    cerrados, columnas = [], []
    while len(cerrados) < len(V):
        u = min((v for v in V if v not in cerrados and coste[v] is not None), key=lambda v: (coste[v], v))
        for v, w in vecinos[u].items():
            if v not in cerrados and (coste[v] is None or coste[u] + w < coste[v]):   # solo si MEJORA
                coste[v], previo[v] = coste[u] + w, u
        columnas.append({v: "*" if v in cerrados else "-" if coste[v] is None else f"{coste[v]},{previo[v]}" for v in V})
        cerrados.append(u)
    print("    " + " ".join(f"P{i + 1:<5}" for i in range(pasos)))
    for v in V:
        celdas = [c[v] for c in columnas] + [""] * (pasos - len(columnas))     # los pasos que sobran, en blanco
        print(f"{v:<4}" + " ".join(f"{x:<6}" for x in celdas))
    return coste, previo

aristas = [("a", "b", 2), ("b", "c", 6), ("c", "d", 2), ("e", "f", 4), ("f", "g", 2), ("g", "h", 2),
           ("a", "e", 4), ("b", "f", 3), ("c", "g", 1), ("d", "h", 7), ("a", "f", 9), ("f", "c", 4)]
coste, previo = dijkstra_tabla(aristas, "a")
camino = ["h"]
while camino[-1] != "a":
    camino.append(previo[camino[-1]])
print("Camino:", " – ".join(reversed(camino)), "· coste", coste["h"])
