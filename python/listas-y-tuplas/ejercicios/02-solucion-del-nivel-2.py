# Solución del Nivel 2
# Del artículo «Listas y tuplas en Python — ejercicios con recortes, un resumen de clase y aprobados contra suspensos (y la tupla de seis elementos que solo tenía uno)»
# https://sergiolearns.com/listas-y-tuplas-en-python-ejercicios/

APROBADO = 5.0


def resumen(notas):
    """Devuelve (mínima, máxima, media, aprobadas) con un solo recorrido."""
    minima = notas[0]
    maxima = notas[0]
    total = 0
    aprobadas = 0
    for nota in notas:
        if nota < minima:
            minima = nota
        if nota > maxima:
            maxima = nota
        total += nota
        if nota >= APROBADO:
            aprobadas += 1
    return minima, maxima, total / len(notas), aprobadas


notas = [6.5, 8.0, 5.5, 9.5, 7.0, 4.5, 10.0]
minima, maxima, media, aprobadas = resumen(notas)

print(f"Mínima: {minima}")
print(f"Máxima: {maxima}")
print(f"Media: {media:.2f}")
print(f"Aprobadas: {aprobadas} de {len(notas)}")
