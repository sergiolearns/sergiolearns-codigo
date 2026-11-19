# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Problema 7: así sale en el examen de problemas de aula
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta-practica/

from itertools import combinations
from math import comb

valores = "A23456789TJQK"
escaleras = [set(valores[i:i + 5]) for i in range(9)] + [set("TJQKA")]
colores = 0
for palo in "♥♦♣♠":
    for cinco in combinations(valores, 5):       # cinco valores distintos de un palo
        if set(cinco) not in escaleras:
            colores += 1
print("Colores:", colores)
print("Probabilidad: {:.6f} %".format(colores / comb(52, 5) * 100))
