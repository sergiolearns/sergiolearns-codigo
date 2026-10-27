# Simulacro práctico de FP2 · versión A · Cola de turnos de una tienda (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase TurnQueue (este fichero no se evalúa)
from turns import TurnQueue

q = TurnQueue()
print(q)                      # ➡None
q.take("Ana")
q.take("Luis", True)
q.take("Eva")
q.take("Iker", True)
print(q)                      # ➡[#1 Ana]->[#2 Luis*]->[#3 Eva]->[#4 Iker*]⬅->None
print(q.serve())              # #1 Ana
print(q.served, len(q))       # 1 3
print(q.cancel(4))            # True
print(q)                      # ➡[#2 Luis*]->[#3 Eva]⬅->None
print(q.take("Noa"))          # 5
vip = q.split_priority()
print(q)                      # ➡[#3 Eva]->[#5 Noa]⬅->None
print(vip)                    # ➡[#2 Luis*]⬅->None
print(vip.served, q.served)   # 0 1
