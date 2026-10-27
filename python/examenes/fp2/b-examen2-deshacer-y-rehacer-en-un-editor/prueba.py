# Simulacro práctico de FP2 · versión B · Deshacer y rehacer en un editor (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase UndoHistory (este fichero no se evalúa)
from editor import UndoHistory

h = UndoHistory()
print(h, h.current_action)    # ->None None
h.do("línea")
h.do("círculo")
h.do("texto")
print(h)                      # ->[línea]<->[círculo]<->{*texto*}->None
print(h.undo())               # texto
print(h.undo())               # círculo
print(h)                      # ->{*línea*}<->[círculo]<->[texto]->None
print(h.redo(), len(h))       # círculo 3
h.do("borrar")
print(h)                      # ->[línea]<->[círculo]<->{*borrar*}->None
print(h.undo(), h.undo(), h.undo(), h.undo())  # borrar círculo línea None
print(h)                      # ->[línea]<->[círculo]<->[borrar]->None
