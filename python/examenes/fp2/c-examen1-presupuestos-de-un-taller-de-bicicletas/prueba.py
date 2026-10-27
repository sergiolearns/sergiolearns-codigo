# Simulacro práctico de FP2 · versión C · Presupuestos de un taller de bicicletas (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase Presupuesto (este fichero no se evalúa)
from presupuesto import Presupuesto

p = Presupuesto("P-14", "Marta")
p.agregar("CAD-11")
p.agregar("MAPA-GC", 2)
print(p)                          # Presupuesto P-14 para Marta: 2 piezas - Pendiente - Total 52.29€
print(f"{p.base:.2f} {p.iva:.2f}")  # 44.90 7.39
p.agregar("CAM-29", 3)
p.quitar("CAM-29", 2)
print(p.unidades("CAM-29"), len(p))  # 1 3
try:
    p.quitar("CAM-29", 5)
except ValueError as e:
    print("Error esperado:", e)   # Error esperado: no hay tantas unidades
p.aceptar()
print(p)                          # Presupuesto P-14 para Marta: 3 piezas - Aceptado - Total 61.36€
print(Presupuesto.aceptados())    # 1
