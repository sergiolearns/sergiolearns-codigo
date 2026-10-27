# Simulacro práctico de FP2 · versión B · Rutas de senderismo (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase Ruta (este fichero no se evalúa)
from ruta import Ruta

r = Ruta("Cumbre", "Luis")
print(r)                          # Ruta Cumbre (guía Luis): 0 tramos, 0.0 km, +0 m - Oculta
r.agregar("S01")
try:
    r.visible = True
except ValueError as e:
    print("Error esperado:", e)   # Error esperado: una ruta visible necesita al menos 2 tramos
r.agregar("S02")
r.visible = True
print(r)                          # Ruta Cumbre (guía Luis): 2 tramos, 6.0 km, +410 m - Visible
print(r.tramos())                 # ['Ayacata - Roque Nublo', 'Roque Nublo - La Goleta']
print(len(r), r.duracion())       # 2 131
print(Ruta.rutas_visibles())      # 1
r.visible = False
print(Ruta.rutas_visibles())      # 0
