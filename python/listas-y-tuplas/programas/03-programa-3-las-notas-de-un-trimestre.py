# Programa 3 · Las notas de un trimestre
# Del artículo «Listas y tuplas en Python — práctica con estadísticas de clase, un buscador de alumnos y medias móviles (y la nota mínima que era un cero que nadie había sacado)»
# https://sergiolearns.com/listas-y-tuplas-en-python-practica/

NOTAS = [6.2, 7.4, 5.6, 8.1, 9.3, 7.8, 6.6]
VENTANA = 3


def media(tramo):
    """Media de un trozo de la lista."""
    acumulador = 0
    for nota in tramo:
        acumulador += nota
    return acumulador / len(tramo)


def medias_moviles(notas, ventana):
    """Media de cada grupo de 'ventana' notas seguidas."""
    resultado = []
    for inicio in range(len(notas) - ventana + 1):
        tramo = notas[inicio:inicio + ventana]
        resultado = resultado + [round(media(tramo), 2)]
    return resultado


def contar_mejoras(notas):
    """Cuántas veces una nota supera a la anterior."""
    contador = 0
    for pos in range(1, len(notas)):
        if notas[pos] > notas[pos - 1]:
            contador += 1
    return contador


def redondear_en_sitio(notas):
    """Redondea cada nota a un entero, modificando la propia lista."""
    for pos in range(len(notas)):
        notas[pos] = round(notas[pos])


print("Notas:", NOTAS)
print("Medias móviles de 3:", medias_moviles(NOTAS, VENTANA))
print("Veces que mejoró respecto a la anterior:", contar_mejoras(NOTAS))
redondear_en_sitio(NOTAS)
print("Notas redondeadas:", NOTAS)
