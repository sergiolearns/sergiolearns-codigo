# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Compruébalo con Python
# https://sergiolearns.com/logica-y-demostraciones/

from itertools import product

def implica(a, b):            # p -> q es lo mismo que (no p) o q
    return (not a) or b

def alarma(p, q, r):          # la regla del instalador
    return (p or q) and r

def vf(x):                    # True/False -> V/F, como en papel
    return "V" if x else "F"

print(" p q r | p∨q | (p∨q)∧r")
final = []
for p, q, r in product([True, False], repeat=3):   # 2^3 = 8 filas
    s = alarma(p, q, r)
    final.append(s)
    print(f" {vf(p)} {vf(q)} {vf(r)} |  {vf(p or q)}  |    {vf(s)}")

if all(final):
    print("tautología")
elif not any(final):
    print("contradicción")
else:
    print("contingencia:", final.count(True), "filas V de", len(final))

# ¿no((p∨q)∧r) es equivalente a (¬p∧¬q)∨¬r? Se comparan las 8 filas
eq = all((not alarma(p, q, r)) == ((not p and not q) or not r)
         for p, q, r in product([True, False], repeat=3))
print("De Morgan comprobado:", eq)
