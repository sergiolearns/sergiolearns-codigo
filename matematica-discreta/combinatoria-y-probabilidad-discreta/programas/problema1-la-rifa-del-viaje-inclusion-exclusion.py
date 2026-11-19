# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Problema 1: la rifa del viaje (inclusión-exclusión)
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta-practica/

papeletas = range(1, 601)
A = {n for n in papeletas if n % 4 == 0}   # múltiplos de 4
B = {n for n in papeletas if n % 6 == 0}   # múltiplos de 6
print("a) por 4 o por 6:", len(A | B))
print("b) por 4 pero no por 6:", len(A - B))
print("c) ni por 4 ni por 6:", 600 - len(A | B))
print("d) por uno solo:", len(A ^ B))
print("A ∩ B son los múltiplos de 12:", A & B == {n for n in papeletas if n % 12 == 0})
