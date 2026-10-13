# Programa 1 · Estadísticas de una clase
# Del artículo «Listas y tuplas en Python — práctica con estadísticas de clase, un buscador de alumnos y medias móviles (y la nota mínima que era un cero que nadie había sacado)»
# https://sergiolearns.com/listas-y-tuplas-en-python-practica/

ALUMNOS = [
    ("Lucía", 7.5),
    ("Marcos", 4.0),
    ("Aitana", 9.0),
    ("Iván", 3.5),
    ("Carla", 6.0),
    ("Dani", 8.5),
]
APROBADO = 5.0


def media(alumnos):
    """Media de las notas de la clase."""
    acumulador = 0
    for nombre, nota in alumnos:
        acumulador += nota
    return acumulador / len(alumnos)


def mejor(alumnos):
    """Alumno con la nota más alta (el primero si hay empate)."""
    candidato = alumnos[0]
    for alumno in alumnos:
        if alumno[1] > candidato[1]:
            candidato = alumno
    return candidato


def peor(alumnos):
    """Alumno con la nota más baja (el primero si hay empate)."""
    candidato = alumnos[0]
    for alumno in alumnos:
        if alumno[1] < candidato[1]:
            candidato = alumno
    return candidato


def contar_aprobados(alumnos):
    """Cuántos alumnos llegan al aprobado."""
    contador = 0
    for nombre, nota in alumnos:
        if nota >= APROBADO:
            contador += 1
    return contador


nombre_mejor, nota_mejor = mejor(ALUMNOS)
nombre_peor, nota_peor = peor(ALUMNOS)

print(f"Alumnos: {len(ALUMNOS)}")
print(f"Media de la clase: {media(ALUMNOS):.2f}")
print(f"Mejor nota: {nombre_mejor} ({nota_mejor})")
print(f"Peor nota: {nombre_peor} ({nota_peor})")
print(f"Aprobados: {contar_aprobados(ALUMNOS)} de {len(ALUMNOS)}")
