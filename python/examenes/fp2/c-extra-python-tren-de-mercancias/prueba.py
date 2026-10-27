# Simulacro práctico de FP2 · versión C · Tren de mercancías (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase Train (este fichero no se evalúa)
from train import Train, Wagon

t = Train()
t.attach(Wagon("cereal", 20))
t.attach(Wagon("gas", 35))
t.attach(Wagon("cereal", 22))
t.attach_front(Wagon("coal", 40))
print(t)                              # ➡[coal 40t]->[cereal 20t]->[gas 35t]->[cereal 22t]⬅->None
print(len(t), t.total_tons)           # 4 117
print([str(w) for w in t.wagons_of("cereal")])   # ['cereal 20t', 'cereal 22t']
tail = t.split(2)
print(t)                              # ➡[coal 40t]->[cereal 20t]⬅->None
print(tail)                           # ➡[gas 35t]->[cereal 22t]⬅->None
print(tail.detach_last(), tail)       # cereal 22t ➡[gas 35t]⬅->None
