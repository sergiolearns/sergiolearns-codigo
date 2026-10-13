# Condicionales en Python práctica — Programa 3: Clasificador de notas con menú
# Del artículo «Condicionales en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/condicionales-en-python-practica/

# Clasificador de notas con menú
print("=== CLASIFICADOR DE NOTAS ===")
print("1. Clasificar una nota")
print("2. Comparar dos notas")
print("3. Calcular nota mínima necesaria")

opcion = int(input("\nElige una opción (1-3): "))

if opcion == 1:
    nota = float(input("\nIntroduce la nota (0-10): "))

    if nota < 0 or nota > 10:
        print("Error: la nota debe estar entre 0 y 10")
    elif nota >= 9:
        calificacion = "Sobresaliente"
        emoji = "🏆"
    elif nota >= 7:
        calificacion = "Notable"
        emoji = "⭐"
    elif nota >= 5:
        calificacion = "Aprobado"
        emoji = "✓"
    elif nota >= 3:
        calificacion = "Suspenso"
        emoji = "✗"
    else:
        calificacion = "Muy deficiente"
        emoji = "❌"

    if nota >= 0 and nota <= 10:
        print(f"\n{emoji} Nota {nota} — {calificacion}")
        if nota < 5:
            print(f"Necesitas {round(5 - nota, 1)} puntos más para aprobar")
        else:
            print(f"Tienes {round(nota - 5, 1)} puntos sobre el aprobado")

elif opcion == 2:
    nota1 = float(input("\nNota 1: "))
    nota2 = float(input("Nota 2: "))

    if nota1 > nota2:
        print(f"\nLa nota 1 ({nota1}) es mayor por {round(nota1 - nota2, 1)} puntos")
    elif nota2 > nota1:
        print(f"\nLa nota 2 ({nota2}) es mayor por {round(nota2 - nota1, 1)} puntos")
    else:
        print(f"\nAmbas notas son iguales ({nota1})")

    media = round((nota1 + nota2) / 2, 2)
    print(f"Media: {media} — {'Aprobado' if media >= 5 else 'Suspenso'}")

elif opcion == 3:
    notas_actuales = int(input("\n¿Cuántas notas tienes ya?: "))
    suma = 0

    for i in range(notas_actuales):
        nota = float(input(f"Nota {i+1}: "))
        suma += nota

    total_asignaturas = int(input("¿Cuántas asignaturas en total?: "))
    nota_minima = round((5 * total_asignaturas - suma) / (total_asignaturas - notas_actuales), 2)

    if nota_minima <= 0:
        print("\n✓ Ya tienes el aprobado asegurado")
    elif nota_minima <= 10:
        print(f"\nNecesitas sacar al menos {nota_minima} en las asignaturas restantes")
    else:
        print("\n✗ Matemáticamente ya no es posible aprobar con media 5")

else:
    print("Opción no válida — elige entre 1 y 3")
