# Solución del ejercicio 2 · Generador de informe de notas
# Del artículo «Funciones en Python — ejercicios con notas, un mini banco y dados con estadísticas (y el return que se rindió en la primera tirada)»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# Nivel básico · Ejercicio 2: informe de notas (reutiliza dos funciones del ejercicio 1)
def espanola_a_americana(nota):
    return round(nota * 10, 1)


def espanola_a_letra(nota):
    if nota >= 9:
        return "A"
    elif nota >= 7:
        return "B"
    elif nota >= 5:
        return "C"
    elif nota >= 3:
        return "D"
    return "F"


def fila_informe(nombre, nota):
    """DEVUELVE la línea de una asignatura (no la imprime: así se puede reutilizar)."""
    return f"{nombre} → {nota} | {espanola_a_americana(nota)} | {espanola_a_letra(nota)}"


def generar_informe(asignaturas):
    print("--- Informe completo ---")
    suma = 0
    cuantas = 0
    nota_max, nombre_max = -1, ""     # empezamos por debajo de cualquier nota posible...
    nota_min, nombre_min = 11, ""     # ...y por encima, para que la primera ya gane
    for nombre, nota in asignaturas:
        print(fila_informe(nombre, nota))
        suma += nota
        cuantas += 1
        if nota > nota_max:           # > y no >=: con un empate se queda la primera
            nota_max, nombre_max = nota, nombre
        if nota < nota_min:
            nota_min, nombre_min = nota, nombre
    media = round(suma / cuantas, 2)
    print("Media:", media, "→", espanola_a_letra(media))
    print(f"Más alta: {nota_max} ({nombre_max})")
    print(f"Más baja: {nota_min} ({nombre_min})")


print("=== INFORME DE NOTAS ===")
generar_informe([("FP1", 8.5), ("Estadística", 7.0), ("Matemáticas", 6.5), ("Bases de datos", 9.0)])
