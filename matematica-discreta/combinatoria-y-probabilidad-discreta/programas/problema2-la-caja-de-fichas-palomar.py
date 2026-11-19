# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Problema 2: la caja de fichas (palomar)
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta-practica/

from itertools import product

rojas, azules, verdes = 7, 10, 12

def peor_caso(cumple):
    # El mayor número de fichas que se pueden sacar SIN cumplir la condición
    return max(r + a + v
               for r, a, v in product(range(rojas + 1), range(azules + 1), range(verdes + 1))
               if not cumple(r, a, v))

print("a) dos del mismo color:", peor_caso(lambda r, a, v: max(r, a, v) >= 2) + 1)
print("b) tres del mismo color:", peor_caso(lambda r, a, v: max(r, a, v) >= 3) + 1)
print("c) dos azules:", peor_caso(lambda r, a, v: a >= 2) + 1)
print("d) una de cada color:", peor_caso(lambda r, a, v: min(r, a, v) >= 1) + 1)
