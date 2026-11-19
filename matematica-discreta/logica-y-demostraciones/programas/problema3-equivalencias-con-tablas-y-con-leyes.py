# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Problema 3: equivalencias, con tablas y con leyes
# https://sergiolearns.com/logica-y-demostraciones-practica/

from itertools import product

def implica(a, b):
    return (not a) or b

def equivalentes(f, g, n):
    """True si f y g dan lo mismo en las 2^n filas."""
    return all(f(*v) == g(*v) for v in product([True, False], repeat=n))

print("a)", equivalentes(lambda p, q: not (p == q), lambda p, q: p != q, 2))
print("b)", equivalentes(lambda p, q, r: implica(p, q) and implica(p, r),
                         lambda p, q, r: implica(p, q and r), 3))
print("c)", equivalentes(lambda p, q: not (p or (not p and q)),
                         lambda p, q: (not p) and (not q), 2))
