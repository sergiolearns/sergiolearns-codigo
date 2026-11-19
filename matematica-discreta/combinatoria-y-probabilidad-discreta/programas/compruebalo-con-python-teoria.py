# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Compruébalo con Python
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta/

# --- Compruébalo con Python
from math import comb, perm, factorial
from itertools import product, combinations

print("Orden de tirada de los 6:", factorial(6))
print("Podio del Uno:", perm(6, 3))
print("Grupos del mus:", comb(6, 4), "=", comb(6, 2))
print("Bolsas de patatas:", comb(3 + 8 - 1, 8))
print("Manos de póker:", comb(52, 5))

# Cadenas de 10 bits: fórmula frente a contarlas todas
cadenas = list(product("01", repeat=10))
print("Total:", len(cadenas))
print("Exactamente 4 unos:", comb(10, 4), sum(1 for c in cadenas if c.count("1") == 4))
print("Como mucho 2 unos:", sum(comb(10, k) for k in range(3)), sum(1 for c in cadenas if c.count("1") <= 2))

# --- Compruébalo con Python
from fractions import Fraction
from math import comb
from itertools import product

# Al menos un seis en cuatro tiradas: contando las 1296 secuencias
tiradas = list(product(range(1, 7), repeat=4))
con_seis = sum(1 for t in tiradas if 6 in t)
print(con_seis, "de", len(tiradas), "=", round(con_seis / len(tiradas), 4))
print("Con el complementario:", round(1 - (5/6)**4, 4))
print("Mi suma de la noche:", Fraction(1, 6) * 4)

# Una mano con al menos un as
sin_ases = Fraction(comb(48, 5), comb(52, 5))
print("Al menos un as:", round(float(1 - sin_ases), 4))

# Exactamente dos seises en cinco tiradas (Bernoulli)
p = comb(5, 2) * Fraction(1, 6)**2 * Fraction(5, 6)**3
print("Dos seises en cinco tiradas:", p, "=", round(float(p), 4))
