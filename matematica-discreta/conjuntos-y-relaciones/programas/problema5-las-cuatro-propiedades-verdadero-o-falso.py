# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Problema 5: las cuatro propiedades, verdadero o falso
# https://sergiolearns.com/conjuntos-y-relaciones-practica/

A = [1, 2, 3, 4]

def propiedades(R):
    refl = all((a, a) in R for a in A)
    sim = all((b, a) in R for (a, b) in R)
    anti = all(not ((b, a) in R and a != b) for (a, b) in R)
    trans = all((a, d) in R for (a, b) in R for (c, d) in R if b == c)
    return ["V" if x else "F" for x in (refl, sim, anti, trans)]

relaciones = {
    "R1": {(1, 1), (1, 2), (2, 1), (2, 2), (3, 4)},
    "R2": set(),
    "R3": {(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)},
    "R4": {(1, 1), (2, 2), (3, 3), (4, 4), (1, 3), (3, 1)},
}
print("     refl sim anti trans")
for nombre, R in relaciones.items():
    print(nombre, "  ", "    ".join(propiedades(R)))

# la matriz de R1, como en el examen (fila = primer elemento)
for i in A:
    print(i, [1 if (i, j) in relaciones["R1"] else 0 for j in A])
