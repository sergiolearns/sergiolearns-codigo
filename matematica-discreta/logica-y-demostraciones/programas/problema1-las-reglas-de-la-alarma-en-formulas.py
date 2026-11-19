# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Problema 1: las reglas de la alarma, en fórmulas
# https://sergiolearns.com/logica-y-demostraciones-practica/

from itertools import product

def implica(a, b):
    return (not a) or b

# b) (p ∧ r) → s  frente a  r → (p → s): 3 variables, 8 filas
iguales = all(implica(p and r, s) == implica(r, implica(p, s))
              for p, r, s in product([True, False], repeat=3))
print("b) las dos formas son equivalentes:", iguales)

# q → l frente a su recíproca y su contrarrecíproca (2 variables, 4 filas)
for nombre, f in [("recíproca", lambda q, l: implica(l, q)),
                  ("contrarrecíproca", lambda q, l: implica(not l, not q))]:
    eq = all(implica(q, l) == f(q, l) for q, l in product([True, False], repeat=2))
    print(nombre, "equivalente a la original:", eq)
