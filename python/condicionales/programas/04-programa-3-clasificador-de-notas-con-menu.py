# Programa 3 · Clasificador de notas con menú
# Del artículo «Condicionales en Python — práctica con un validador de registro, descuentos por nivel y un clasificador de notas (y el formulario que solo te enseñaba un error)»
# https://sergiolearns.com/condicionales-en-python-practica/

# Clasificador de notas con menú
opcion = "1"                 # lo que se elegiría en el menú (input() devuelve texto)
nota = 6.5                   # dato de la opción 1
nota1 = 6.5                  # datos de la opción 2
nota2 = 8.0
nota_practicas = 5.5         # dato de la opción 3

print("=== CLASIFICADOR DE NOTAS ===")
print("1. Clasificar una nota")
print("2. Comparar dos notas")
print("3. ¿Qué necesito en el examen?")
print(f"Opción elegida: {opcion}")

if opcion == "1":
    # Primero se descarta lo imposible: la cadena de abajo solo ve notas válidas
    if not 0 <= nota <= 10:
        print("Error: la nota debe estar entre 0 y 10")
    else:
        if nota >= 9:
            calificacion = "Sobresaliente"
        elif nota >= 7:
            calificacion = "Notable"
        elif nota >= 5:
            calificacion = "Aprobado"
        else:
            calificacion = "Suspenso"
        print(f"Nota {nota}: {calificacion}")
        if nota < 5:
            print(f"Te faltan {5 - nota:.1f} puntos para aprobar")
        else:
            print(f"Tienes {nota - 5:.1f} puntos sobre el aprobado")

elif opcion == "2":
    if nota1 > nota2:
        print(f"La nota 1 ({nota1}) gana por {nota1 - nota2:.1f} puntos")
    elif nota2 > nota1:
        print(f"La nota 2 ({nota2}) gana por {nota2 - nota1:.1f} puntos")
    else:                    # ni mayor ni menor: iguales
        print(f"Empate: las dos son {nota1}")
    media = (nota1 + nota2) / 2
    print(f"Media: {media:.2f} ({'Aprobado' if media >= 5 else 'Suspenso'})")

elif opcion == "3":
    # Regla del ejemplo: final = 40 % prácticas + 60 % examen, y el examen pide un 4
    necesaria = (5 - 0.4 * nota_practicas) / 0.6
    if necesaria > 10:
        print("Ni con un 10 en el examen llegas al 5: toca recuperar prácticas")
    elif necesaria <= 4:
        print("Con el 4 mínimo del examen ya apruebas")
    else:
        print(f"Necesitas al menos un {necesaria:.2f} en el examen")

else:                        # cualquier otro texto
    print("Opción no válida: elige 1, 2 o 3")
