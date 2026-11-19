# SergioLearns · Matemática discreta (MD) · Teoría de grafos
# Problema 4: un paseo de Euler por Vegueta
# https://sergiolearns.com/teoria-de-grafos-practica/

def es_circuito_euler(camino, aristas):
    usadas = [frozenset(camino[i:i + 2]) for i in range(len(camino) - 1)]
    return sorted(map(sorted, usadas)) == sorted(map(sorted, map(frozenset, aristas)))

calles = [("p", "q"), ("q", "r"), ("r", "p"), ("r", "s"), ("s", "t"), ("t", "r"), ("t", "u"), ("u", "p"), ("p", "t")]
grado = {}
for u, v in calles:
    grado[u] = grado.get(u, 0) + 1
    grado[v] = grado.get(v, 0) + 1
print("Grados:", dict(sorted(grado.items())))

recorrido = list("pqrstuptrp")
print("a) circuito:", recorrido[0] == recorrido[-1] and es_circuito_euler(recorrido, calles))

con_qs = calles + [("q", "s")]
camino_b = list("qsrqprtupts")
print("b) camino de q a s:", es_circuito_euler(camino_b, con_qs))
