# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Problema 6: clases de equivalencia y un diagrama de Hasse
# https://sergiolearns.com/conjuntos-y-relaciones-practica/

A = range(1, 10)
clases = {}
for x in A:
    clases.setdefault(x % 3, []).append(x)     # mismo resto, misma clase
print("clases:", list(clases.values()))

B = [1, 2, 3, 5, 6, 10, 15, 30]
divide = lambda a, b: b % a == 0
cubre = [(a, b) for a in B for b in B
         if a != b and divide(a, b)
         and not any(m not in (a, b) and divide(a, m) and divide(m, b) for m in B)]
print("líneas del Hasse:", cubre)
print("minimales:", [x for x in B if not any(y != x and divide(y, x) for y in B)])
print("maximales:", [x for x in B if not any(y != x and divide(x, y) for y in B)])
