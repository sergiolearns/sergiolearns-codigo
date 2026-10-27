# Simulacro práctico de FP2 · versión C · Secuencia de enteros ordenada (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase SortedInts (este fichero no se evalúa)
from sortedints import SortedInts

s = SortedInts()
for n in (7, 2, 9, 2, -4, 7):
    s.add(n)
print(s)                          # |->-4->2->2->7->7->9->None
print(s.size, 9 in s, 3 in s)     # 6 True False
print(s.remove_all(7))            # 2
print(s)                          # |->-4->2->2->9->None
print(s.count_between(0, 9))      # 3
t = SortedInts()
t.add(5); t.add(-10)
print(s.merge(t))                 # |->-10->-4->2->2->5->9->None
print([n * 10 for n in s])        # [-40, 20, 20, 90]
