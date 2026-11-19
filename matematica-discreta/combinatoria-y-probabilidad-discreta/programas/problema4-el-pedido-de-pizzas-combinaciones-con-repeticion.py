# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Problema 4: el pedido de pizzas (combinaciones con repetición)
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta-practica/

from itertools import combinations_with_replacement as cr
from math import comb

tipos = ["margarita", "barbacoa", "cuatro quesos", "vegetal"]
pedidos = list(cr(tipos, 10))
print("a)", len(pedidos), comb(13, 10))
print("b)", sum(1 for p in pedidos if all(t in p for t in tipos)), comb(9, 6))
print("c)", sum(1 for p in pedidos if p.count("vegetal") <= 2), comb(13, 10) - comb(10, 7))
