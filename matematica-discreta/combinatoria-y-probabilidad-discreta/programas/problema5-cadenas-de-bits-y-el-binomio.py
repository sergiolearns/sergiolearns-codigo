# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Problema 5: cadenas de bits y el binomio
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta-practica/

from itertools import product
from math import comb

cadenas = ["".join(c) for c in product("01", repeat=11)]
print("Total:", len(cadenas))
print("Exactamente 4 unos:", sum(c.count("1") == 4 for c in cadenas))
print("Como mucho 3 unos:", sum(c.count("1") <= 3 for c in cadenas))
print("Al menos 3 unos:", sum(c.count("1") >= 3 for c in cadenas))
print("1…1 con 4 unos:", sum(c[0] == c[-1] == "1" and c.count("1") == 4 for c in cadenas))

# Coeficiente de x^5 en (2x - 1)^8: multiplicando el polinomio 8 veces
poli = [1]                                   # poli[k] = coeficiente de x^k
for _ in range(8):
    nuevo = [0] * (len(poli) + 1)
    for k, c in enumerate(poli):
        nuevo[k] += c * (-1)                 # se elige el -1 del paréntesis
        nuevo[k + 1] += c * 2                # se elige el 2x
    poli = nuevo
print("Coeficiente de x^5:", poli[5], "=", comb(8, 5) * 2**5 * (-1)**3)
