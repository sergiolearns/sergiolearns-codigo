# Solución del Nivel 3
# Del artículo «Listas y tuplas en Python — ejercicios con recortes, un resumen de clase y aprobados contra suspensos (y la tupla de seis elementos que solo tenía uno)»
# https://sergiolearns.com/listas-y-tuplas-en-python-ejercicios/

ALUMNOS = [
    ("Nora", 7.0),
    ("Pablo", 3.0),
    ("Elena", 9.5),
    ("Hugo", 4.5),
    ("Sara", 6.5),
    ("Tomás", 8.0),
]
CORTE = 5.0


def separar(alumnos, corte):
    """Devuelve dos listas de nombres: aprobados y suspensos."""
    aprobados = []
    suspensos = []
    for nombre, nota in alumnos:
        if nota >= corte:
            aprobados = aprobados + [nombre]
        else:
            suspensos = suspensos + [nombre]
    return aprobados, suspensos


def primer_suspenso(alumnos, corte):
    """Posición del primer suspenso, o -1 si no hay ninguno."""
    for pos, alumno in enumerate(alumnos):
        if alumno[1] < corte:
            return pos
    return -1


aprobados, suspensos = separar(ALUMNOS, CORTE)
print("Aprobados:", aprobados)
print("Suspensos:", suspensos)

pos = primer_suspenso(ALUMNOS, CORTE)
print("Primer suspenso en la posición", pos, "->", ALUMNOS[pos])
print("Los tres últimos:", ALUMNOS[-3:])
