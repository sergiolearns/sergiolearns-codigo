# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Problema 5: cuantificadores en un dominio pequeño
# https://sergiolearns.com/logica-y-demostraciones-practica/

D = [-2, -1, 0, 1, 2]

a = all(x**2 >= x for x in D)
b = any(x**2 == x + 2 for x in D)
c = all(any(x + y == 0 for y in D) for x in D)
d = all(any(x < y for y in D) for x in D)
print("a)", a, " b)", b, " c)", c, " d)", d)

# las negaciones tienen que dar justo lo contrario
print("¬a)", any(x**2 < x for x in D))
print("¬d)", any(all(x >= y for y in D) for x in D))
print("testigos de b):", [x for x in D if x**2 == x + 2])
