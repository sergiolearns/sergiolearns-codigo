# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Compruébalo con Python
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta-ejercicios/

from math import comb, perm, factorial
from itertools import product, permutations
from fractions import Fraction

# Ejercicio 1
print("1a)", 26**3 * perm(10, 4))
print("1b)", sum(1 for n in range(100, 1000) if len(set(str(n))) == 3))
# Ejercicio 2
print("2a)", comb(12, 4) - comb(7, 4), comb(7, 2) * comb(5, 2))
print("2b)", comb(5 + 10 - 1, 10))
print("2c)", len(set(permutations("CANARIAS"))))
# Ejercicio 3
print("3c)", sum(1 for c in product("01", repeat=8) if c.count("1") == 3 and "11" not in "".join(c)))
# Ejercicio 4
dados = list(product(range(1, 7), repeat=3))
A = [d for d in dados if len(set(d)) == 3]
AB = [d for d in A if 6 in d]
print("4c)", Fraction(len(AB), len(A)))
print("4e)", round(comb(8, 3) * 0.3**3 * 0.7**5, 4))
# Ejercicio 5
doble = comb(13, 2) * comb(4, 2)**2 * 44
print("5)", doble, "{:.6f} %".format(doble / comb(52, 5) * 100))
