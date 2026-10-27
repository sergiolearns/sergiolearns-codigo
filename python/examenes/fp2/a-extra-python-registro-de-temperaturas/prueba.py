# Simulacro práctico de FP2 · versión A · Registro de temperaturas (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase TempLog (este fichero no se evalúa)
from temps import TempLog

t = TempLog()
t.add_last(21)
t.add_last(19)
t.add_first(23)
print(t)                      # |->23->21->19->None
t.add_at(25, 1)
t.add_at(17, 100)
t.add_at(26, -5)
print(t, t.size)              # |->26->23->25->21->19->17->None 6
print(t.ends_with([19, 17]), t.ends_with([21, 17]))   # True False
t.size = 3
print(t, t.size)              # |->26->23->25->None 3
print(max(t), sum(t))         # 26 74
