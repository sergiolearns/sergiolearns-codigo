# SergioLearns · Matemática discreta (MD) · Teoría de grafos
# Problema 5: ciclos de Hamilton que existen y que no
# https://sergiolearns.com/teoria-de-grafos-practica/

from itertools import permutations

def ciclo_hamilton(V, E):
    A = {frozenset(e) for e in E}
    inicio = V[0]
    for resto in permutations(V[1:]):
        c = [inicio, *resto, inicio]
        if all(frozenset(c[i:i + 2]) in A for i in range(len(c) - 1)):
            return c
    return None

paseo = [("p", "q"), ("q", "r"), ("r", "p"), ("r", "s"), ("s", "t"), ("t", "r"), ("t", "u"), ("u", "p"), ("p", "t")]
pajarita = [("a", "b"), ("b", "c"), ("c", "a"), ("c", "d"), ("d", "e"), ("e", "c")]
k23 = [(x, y) for x in ("x1", "x2") for y in ("y1", "y2", "y3")]
k33 = [(x, y) for x in ("x1", "x2", "x3") for y in ("y1", "y2", "y3")]
print("a)", ciclo_hamilton(list("pqrstu"), paseo))
print("b)", ciclo_hamilton(list("abcde"), pajarita))
print("c)", ciclo_hamilton(["x1", "x2", "y1", "y2", "y3"], k23))
print("d)", ciclo_hamilton(["x1", "x2", "x3", "y1", "y2", "y3"], k33))
