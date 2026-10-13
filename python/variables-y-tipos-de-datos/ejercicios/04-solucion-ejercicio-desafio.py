# Solución Ejercicio Desafío
# Del artículo «Variables y tipos de datos en Python — ejercicios con solución y chuletario»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# Ficha de estudiante completa
nombre = input("Nombre completo: ")
edad = int(input("Edad: "))
carrera = input("Carrera: ")
universidad = input("Universidad: ")

a1_nombre = input("Nombre asignatura 1: ")
a1_nota = float(input(f"Nota de {a1_nombre}: "))
a2_nombre = input("Nombre asignatura 2: ")
a2_nota = float(input(f"Nota de {a2_nombre}: "))
a3_nombre = input("Nombre asignatura 3: ")
a3_nota = float(input(f"Nota de {a3_nombre}: "))
a4_nombre = input("Nombre asignatura 4: ")
a4_nota = float(input(f"Nota de {a4_nombre}: "))

media = round((a1_nota + a2_nota + a3_nota + a4_nota) / 4, 2)
nota_max = max(a1_nota, a2_nota, a3_nota, a4_nota)
nota_min = min(a1_nota, a2_nota, a3_nota, a4_nota)
aprobado = media >= 5.0
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
print(f"{a1_nombre}: {a1_nota}")
print(f"{a2_nombre}: {a2_nota}")
print(f"{a3_nombre}: {a3_nota}")
print(f"{a4_nombre}: {a4_nota}")
print("-" * 29)
print(f"Nota media: {media}")
print(f"Nota más alta: {nota_max}")
print(f"Nota más baja: {nota_min}")
print(f"¿Aprobado?: {aprobado}")
print(f"Créditos estimados: {creditos}")
print("=" * 29)
