# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Problema 2: una tabla de ocho filas que siempre da V
# https://sergiolearns.com/logica-y-demostraciones-practica/

from itertools import product

def implica(a, b):
    return (not a) or b

def vf(x):
    return "V" if x else "F"

final = []
for p, q, r in product([True, False], repeat=3):
    hip = implica(p, q) and implica(q, r)      # (p→q) ∧ (q→r)
    f = implica(hip, implica(p, r))            # [...] → (p→r)
    final.append(vf(f))
print("columna final:", " ".join(final))
print("tautología" if final.count("V") == 8 else "no es tautología")
