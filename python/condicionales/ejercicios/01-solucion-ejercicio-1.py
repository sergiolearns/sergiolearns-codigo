# Solución Ejercicio 1:
# Del artículo «Condicionales en Python — ejercicios con solución y chuletario completo»
# https://sergiolearns.com/condicionales-en-python-ejercicios/

# Sistema de calificación de películas
edad = int(input("Edad: "))
clasificacion = input("Clasificación de la película: ").upper()

restricciones = {
    "G": (0, "todos los públicos"),
    "PG": (10, "recomendado acompañamiento menores de 10"),
    "PG-13": (13, "no recomendado menores de 13"),
    "R": (17, "no recomendado menores de 17"),
    "NC-17": (18, "solo mayores de 18")
}

print(f"\n--- Resultado ---")

if clasificacion not in restricciones:
    print("Clasificación no reconocida")
else:
    edad_minima, descripcion = restricciones[clasificacion]
    print(f"Clasificación {clasificacion}: {descripcion}")
    print(f"Tu edad: {edad} años")

    if edad >= edad_minima:
        print("Acceso: ✓ Puedes ver esta película")
    else:
        print("Acceso: ✗ No puedes ver esta película sin acompañante adulto")
