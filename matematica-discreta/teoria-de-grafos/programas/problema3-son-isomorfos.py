# SergioLearns · Matemática discreta (MD) · Teoría de grafos
# Problema 3: ¿son isomorfos?
# https://sergiolearns.com/teoria-de-grafos-practica/

from itertools import permutations

def isomorfos(V1, E1, V2, E2):
    A1 = {frozenset(e) for e in E1}
    A2 = {frozenset(e) for e in E2}
    if len(V1) != len(V2) or len(A1) != len(A2):
        return None
    for img in permutations(V2):                      # todas las biyecciones posibles
        f = dict(zip(V1, img))
        if all(frozenset((f[x], f[y])) in A2 for x, y in A1):
            return f
    return None

G1 = ["u1", "u2", "u3", "u4", "u5", "u6"]
E1 = [("u1", "u2"), ("u2", "u3"), ("u3", "u4"), ("u4", "u5"), ("u5", "u6"), ("u6", "u1"), ("u1", "u4")]
G2 = ["v1", "v2", "v3", "v4", "v5", "v6"]
E2 = [("v1", "v2"), ("v2", "v3"), ("v4", "v5"), ("v5", "v6"), ("v1", "v4"), ("v2", "v5"), ("v3", "v6")]
print("a)", isomorfos(G1, E1, G2, E2))

H = [1, 2, 3, 4, 5, 6]
prisma = [(1, 2), (2, 3), (3, 1), (4, 5), (5, 6), (6, 4), (1, 4), (2, 5), (3, 6)]
k33 = [(x, y) for x in (1, 2, 3) for y in (4, 5, 6)]
print("b)", isomorfos(H, prisma, H, k33))
