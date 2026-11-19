# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Compruébalo con Python
# https://sergiolearns.com/conjuntos-y-relaciones-ejercicios/

A = [1, 2, 3, 4]
R = {(1, 1), (1, 3), (2, 2), (2, 4), (3, 1), (3, 3), (4, 4)}   # ejercicio 7

refl = all((a, a) in R for a in A)
sim = all((b, a) in R for (a, b) in R)
anti = all(not ((b, a) in R and a != b) for (a, b) in R)
falta = sorted({(a, d) for (a, b) in R for (c, d) in R if b == c} - R)
trans = not falta

for nombre, v in [("reflexiva", refl), ("simétrica", sim),
                  ("antisimétrica", anti), ("transitiva", trans)]:
    print(f"{nombre:14} {'V' if v else 'F'}")
if falta:
    print("le faltan para ser transitiva:", falta)
if refl and sim and trans:
    clases = {frozenset(b for b in A if (a, b) in R) for a in A}
    print("clases:", sorted(sorted(c) for c in clases))

# fragmento 2: la transitiva sin bucle
R2 = {(1, 2), (2, 1), (1, 1)}
print("fragmento 2, le faltan:", sorted({(a, d) for (a, b) in R2 for (c, d) in R2 if b == c} - R2))
