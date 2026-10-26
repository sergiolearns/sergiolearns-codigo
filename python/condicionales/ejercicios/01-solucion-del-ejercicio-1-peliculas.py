# Solución del ejercicio 1 · Sistema de calificación de películas
# Del artículo «Condicionales en Python — ejercicios resueltos con películas, tramos de impuestos, contraseñas y el juego de adivinar el número (y el or que dejaba entrar a todo el mundo)»
# https://sergiolearns.com/condicionales-en-python-ejercicios/

# Ejercicio 1 — ¿Puedo ver esta película?
edad = 15
clasificacion = "r"                       # tal como la escribiría el usuario
va_acompanado = False

clasificacion = clasificacion.upper()     # "r" → "R": así solo comparamos mayúsculas

# 1. Edad mínima y descripción de cada clasificación
if clasificacion == "G":
    edad_minima = 0
    descripcion = "todos los públicos"
elif clasificacion == "PG":
    edad_minima = 10
    descripcion = "menores de 10 con un adulto"
elif clasificacion == "PG-13":
    edad_minima = 13
    descripcion = "no recomendada para menores de 13 años"
elif clasificacion == "R":
    edad_minima = 17
    descripcion = "no recomendada para menores de 17 años"
elif clasificacion == "NC-17":
    edad_minima = 18
    descripcion = "solo mayores de 18 años"
else:
    edad_minima = -1                      # marca de "clasificación desconocida"
    descripcion = ""

print("--- Resultado ---")
if edad_minima == -1:
    print(f"Clasificación {clasificacion} no reconocida")
else:
    print(f"Clasificación {clasificacion}: {descripcion}")
    print(f"Tu edad: {edad} años")
    # 2. Entra si llega a la edad O si va con un adulto (salvo NC-17, sin excepciones)
    if edad >= edad_minima or (va_acompanado and clasificacion != "NC-17"):
        print("Acceso: ✓ Puedes ver esta película")
    else:
        print("Acceso: ✗ No puedes ver esta película sin un adulto")
