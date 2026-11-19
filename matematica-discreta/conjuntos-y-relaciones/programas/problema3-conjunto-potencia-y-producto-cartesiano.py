# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Problema 3: conjunto potencia y producto cartesiano
# https://sergiolearns.com/conjuntos-y-relaciones-practica/

from itertools import combinations, product

def potencia(c):
    c = list(c)
    return {frozenset(sub) for k in range(len(c) + 1) for sub in combinations(c, k)}

A = {"Faro", "Nube"}
B = {1, 2, 3}
PA = potencia(A)
print("|P(A)| =", len(PA))
print("A × B:", sorted(product(sorted(A), sorted(B))))
print("|P(A × B)| =", len(potencia(set(product(A, B)))))
print("∅ ∈ P(A):", frozenset() in PA, "| {Faro} ∈ P(A):", frozenset({"Faro"}) in PA)
