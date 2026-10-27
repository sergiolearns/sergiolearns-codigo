# Simulacro práctico de FP2 · versión A · Reserva de pistas del polideportivo (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase Reserva (este fichero no se evalúa: cámbialo como quieras)
from reserva import Reserva

r = Reserva("R-7", "Ana")
print(r)                          # Reserva R-7 de Ana: 0 pistas, 0 h - Pendiente - Total 0.00€
r.agregar("PADEL-1", 2)
r.agregar("TENIS-1")
r.agregar("PADEL-1")
print(r)                          # Reserva R-7 de Ana: 2 pistas, 4 h - Pendiente - Total 45.50€
print(r.lineas())                 # [('PADEL-1', 3), ('TENIS-1', 1)]
print(r.quitar("TENIS-1"))        # 1
try:
    r.agregar("PADEL-2", 0)
except ValueError as e:
    print("Error esperado:", e)   # Error esperado: horas no válidas
r.confirmar()
print(r)                          # Reserva R-7 de Ana: 1 pistas, 3 h - Confirmada - Total 36.00€
try:
    r.confirmar()
except ValueError as e:
    print("Error esperado:", e)   # Error esperado: la reserva ya está confirmada
print(Reserva.total_confirmadas())  # 1
