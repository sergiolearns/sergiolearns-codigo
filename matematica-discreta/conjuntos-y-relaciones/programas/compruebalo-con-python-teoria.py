# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Compruébalo con Python
# https://sergiolearns.com/conjuntos-y-relaciones/

S = {"Brisa", "Faro", "Lava", "Nube"}
L = {"Faro", "Nube", "Ola", "Pico"}
D = {"Lava", "Nube", "Pico", "Roca"}

print("S ∩ L =", sorted(S & L))
print("S ⊕ L =", sorted(S ^ L))
print("|S ∪ L ∪ D| =", len(S | L | D))
# inclusión-exclusión: tiene que dar lo mismo que len(S | L | D)
ie = (len(S) + len(L) + len(D) - len(S & L) - len(S & D) - len(L & D)
      + len(S & L & D))
print("inclusión-exclusión:", ie)

A = {1, 2, 3, 4}
R = {(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3), (4, 4)}
reflexiva = all((a, a) in R for a in A)
simetrica = all((b, a) in R for (a, b) in R)
antisimetrica = all(not ((b, a) in R and a != b) for (a, b) in R)
transitiva = all((a, d) in R for (a, b) in R for (c, d) in R if b == c)
print("reflexiva:", reflexiva, "| simétrica:", simetrica,
      "| antisimétrica:", antisimetrica, "| transitiva:", transitiva)
