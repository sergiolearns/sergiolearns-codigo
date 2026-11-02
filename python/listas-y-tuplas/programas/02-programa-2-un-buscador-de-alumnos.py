# Programa 2 · Un buscador de alumnos
# Del artículo «Listas y tuplas en Python — práctica con las estadísticas de la clase, un buscador de alumnos y medias móviles (y la nota mínima que era un cero que nadie había sacado)»
# https://sergiolearns.com/listas-y-tuplas-en-python-practica/

NOMBRES = ["Lucía", "Marcos", "Aitana", "Iván", "Carla", "Dani"]
NOTAS = [7.5, 4.0, 9.0, 3.5, 6.0, 8.5]      # listas paralelas: la nota de NOMBRES[i] es NOTAS[i]


def posicion(secuencia, buscado):
    """Posición de la primera aparición de buscado, o -1 si no está."""
    for pos, item in enumerate(secuencia):
        if item == buscado:
            return pos                      # lo encontré: no hace falta seguir
    return -1                               # FUERA del bucle: ya lo he mirado todo


def nota_de(nombre):
    """Nota del alumno, o None si no está en la lista."""
    pos = posicion(NOMBRES, nombre)
    if pos == -1:                           # comprobar ANTES de usar la posición
        return None
    return NOTAS[pos]


for nombre in ("Carla", "Pablo", "Lucía", "lucía"):
    nota = nota_de(nombre)
    if nota is None:
        print(f"{nombre}: no está en la lista")
    else:
        print(f"{nombre}: posición {posicion(NOMBRES, nombre)}, nota {nota}")

print("Primeros tres:", NOMBRES[:3])
print("Últimos dos:", NOMBRES[-2:])
print("Orden inverso:", NOMBRES[::-1])
print("¿Está Dani?", "Dani" in NOMBRES)
print("NOTAS[-1] sin comprobar:", NOTAS[posicion(NOMBRES, "Pablo")])
