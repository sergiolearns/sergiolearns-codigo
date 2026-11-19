# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Problema 6: cartas y dados (probabilidad)
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta-practica/

from itertools import combinations, product
from fractions import Fraction
from math import comb
from collections import Counter

valores = "A23456789TJQK"
baraja = [v + p for v in valores for p in "♥♦♣♠"]
fulls = 0
for mano in combinations(baraja, 5):           # las 2 598 960 manos, una a una
    if sorted(Counter(c[0] for c in mano).values()) == [2, 3]:
        fulls += 1
print("Fulls:", fulls, "→", round(fulls / comb(52, 5) * 100, 4), "%")
print("Dos corazones:", round(comb(13, 2) * comb(39, 3) / comb(52, 5), 4))

suma8 = [d for d in product(range(1, 7), repeat=2) if sum(d) == 8]
print("Suma 8:", suma8, "→", Fraction(sum(6 in d for d in suma8), len(suma8)))

p = 0.4
print("Al menos 2 de 6:", round(1 - comb(6, 0) * (1 - p)**6 - comb(6, 1) * p * (1 - p)**5, 5))
