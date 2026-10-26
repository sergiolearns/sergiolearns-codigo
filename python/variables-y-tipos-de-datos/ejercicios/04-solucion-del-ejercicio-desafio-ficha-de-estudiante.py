# Solución del ejercicio desafío · Ficha de estudiante completa
# Del artículo «Variables y tipos de datos en Python — ejercicios con un recibo, temperaturas, propinas y tu ficha de estudiante (y un True que vale 1)»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# Solución del ejercicio desafío · Ficha de estudiante completa
nombre = "Sergio Medina"
edad = int("20")                 # la edad es un entero
carrera = "GCID"
universidad = "ULPGC"

a1_nombre = "FP1"
a1_nota = float("7.5")
a2_nombre = "Estadística"
a2_nota = float("8")             # float("8") da 8.0
a3_nombre = "Matemáticas"
a3_nota = float("6.5")
a4_nombre = "Bases de datos"
a4_nota = float("4")

media = round((a1_nota + a2_nota + a3_nota + a4_nota) / 4, 2)
nota_max = max(a1_nota, a2_nota, a3_nota, a4_nota)
nota_min = min(a1_nota, a2_nota, a3_nota, a4_nota)
aprobado = media >= 5.0
# Cada comparación da True (1) o False (0): sumarlas cuenta las aprobadas
aprobadas = (a1_nota >= 5) + (a2_nota >= 5) + (a3_nota >= 5) + (a4_nota >= 5)
creditos = aprobadas * 6

print("=" * 29)
print("     FICHA DE ESTUDIANTE")
print("=" * 29)
print(f"Nombre: {nombre}")
print(f"Edad: {edad} años")
print(f"Carrera: {carrera}")
print(f"Universidad: {universidad}")
print("-" * 29)
print(f"Asignatura 1 — {a1_nombre}: {a1_nota}")
print(f"Asignatura 2 — {a2_nombre}: {a2_nota}")
print(f"Asignatura 3 — {a3_nombre}: {a3_nota}")
print(f"Asignatura 4 — {a4_nombre}: {a4_nota}")
print("-" * 29)
print(f"Nota media: {media}")
print(f"Nota más alta: {nota_max}")
print(f"Nota más baja: {nota_min}")
print(f"¿Aprobado?: {aprobado}")
print(f"Créditos estimados: {creditos}")
print("=" * 29)
