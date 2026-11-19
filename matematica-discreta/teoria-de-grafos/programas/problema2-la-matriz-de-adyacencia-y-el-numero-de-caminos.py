# SergioLearns · Matemática discreta (MD) · Teoría de grafos
# Problema 2: la matriz de adyacencia y el número de caminos
# https://sergiolearns.com/teoria-de-grafos-practica/

from itertools import product

V = ["a", "b", "c", "d"]
E = [("a", "b"), ("a", "c"), ("a", "d"), ("b", "c"), ("c", "d")]
A = [[1 if (x, y) in E or (y, x) in E else 0 for y in V] for x in V]

def mult(X, Y):
    return [[sum(X[i][k] * Y[k][j] for k in range(4)) for j in range(4)] for i in range(4)]

A2 = mult(A, A)
A3 = mult(A2, A)
print("A² =", A2)
print("A³ =", A3)

# Los caminos de longitud 3 de b a d, uno a uno
def vecinos(x):
    return [y for y in V if A[V.index(x)][V.index(y)]]
caminos = [("b", p, q, "d") for p in vecinos("b") for q in vecinos(p) if "d" in vecinos(q)]
print("De b a d con 3 aristas:", caminos)
