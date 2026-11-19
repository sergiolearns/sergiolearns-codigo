# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Problema 4: funciones
# https://sergiolearns.com/conjuntos-y-relaciones-practica/

import math

f = lambda x: x + 3
g = lambda x: x ** 2
h = lambda x: 3 * x - 4
h_inv = lambda y: (y + 4) / 3

rango = range(-20, 21)
print("g repite imágenes:", [(x, -x) for x in rango if x > 0 and g(x) == g(-x)][:3])
print("¿a g le llega el -1?:", any(g(x) == -1 for x in rango))
print("h(h_inv(y)) == y:", all(h(h_inv(y)) == y for y in rango))
print("f∘g(2) =", f(g(2)), "| g∘f(2) =", g(f(2)), "| h∘f(2) =", h(f(2)))
print(math.floor(-3.5), math.ceil(-3.5), math.floor(7 / 2), math.ceil(7 / 2))
