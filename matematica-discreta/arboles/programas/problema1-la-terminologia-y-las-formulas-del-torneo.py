# SergioLearns · Matemática discreta (MD) · Árboles
# Compruébalo con Python
# https://sergiolearns.com/arboles-matematica-discreta-practica/

hijos = {"a": "bc", "b": "def", "c": "g", "e": "hi", "g": "jkl", "k": "m"}
padre = {h: p for p, hs in hijos.items() for h in hs}

def nivel(v):
    # Subir de padre en padre hasta la raíz, contando aristas
    n = 0
    while v in padre:
        v, n = padre[v], n + 1
    return n

vertices = set(hijos) | set(padre)
hojas = sorted(v for v in vertices if v not in hijos)
print("Hojas:", hojas)
print("Nivel de m:", nivel("m"), "· Altura:", max(nivel(v) for v in vertices))
print("Grado:", max(len(h) for h in hijos.values()))
print("¿Ternario completo?", all(len(h) == 3 for h in hijos.values()))

m, l = 4, 64
i = (l - 1) / (m - 1)
print("Catan con 64: partidas", i, "· vértices", m * i + 1)
print("Catan con 48: partidas", (48 - 1) / (m - 1))
