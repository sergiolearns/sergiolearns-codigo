# Programa 3 · El precio de tu matrícula
# Del artículo «Variables y tipos de datos en Python — práctica con tu nota media, el IMC y el precio de la matrícula (y unos céntimos que salen de la nada)»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-practica/

# Programa 3 · El precio de tu matrícula
asignaturas = 5                  # int: las asignaturas se cuentan, no se miden
creditos_txt = "6"               # créditos de cada asignatura, como llegan de input()
precio_txt = "18.32"             # euros por crédito (precio de ejemplo)
plazos = 3                       # pagas en 3 plazos

# Convertir cada dato al tipo que le toca
creditos_asignatura = int(creditos_txt)    # "6" -> 6: los créditos son enteros
precio_credito = float(precio_txt)         # "18.32" -> 18.32: el dinero lleva decimales

creditos = asignaturas * creditos_asignatura    # int * int = int
total = creditos * precio_credito               # int * float = float
plazo = total / plazos                          # / siempre devuelve float

print("Créditos:", creditos, type(creditos))
print("Total:", total, type(total))
print("Cada plazo (sin redondear):", plazo)

# Para enseñar dinero: 2 decimales con round() o con el formato :.2f
print("Cada plazo (round):", round(plazo, 2))
print(f"Cada plazo (:.2f): {plazo:.2f} €")
print(f"Resumen: {creditos} créditos x {precio_credito} € = {total:.2f} €")
