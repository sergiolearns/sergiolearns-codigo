# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Compruébalo con Python
# https://sergiolearns.com/logica-y-demostraciones-ejercicios/

from itertools import product

def imp(a, b):
    return (not a) or b

def columna(f, n=3):
    return "".join("V" if f(*v) else "F" for v in product([True, False], repeat=n))

print("ej. 1b:", columna(lambda p, q, r: imp(not p, q and not r)))
print("ej. 6 :", columna(lambda p, q, r: (p == (not q)) or imp(q, r)))

# ej. 3b: ¿son iguales (p→q)→r y p→(q→r)?
a = columna(lambda p, q, r: imp(imp(p, q), r))
b = columna(lambda p, q, r: imp(p, imp(q, r)))
print("ej. 3b:", a, "frente a", b, "->", "equivalentes" if a == b else "distintas")

# ej. 5: n^3 + 2n múltiplo de 3, y el contraejemplo de n^2 - n + 11
print("ej. 5a:", all((n**3 + 2*n) % 3 == 0 for n in range(1, 1000)))
es_primo = lambda m: m > 1 and all(m % d for d in range(2, int(m**0.5) + 1))
print("ej. 5b: primer n que falla:", next(n for n in range(1, 100) if not es_primo(n*n - n + 11)))
