# Programa 3 · El acta de los parciales, con columnas alineadas
# Del artículo «Strings en Python — práctica limpiando una lista de clase, validando DNIs y sacando un acta alineada (y el 7,5 que float() no quiso leer)»
# https://sergiolearns.com/strings-en-python-practica/

# Notas de los tres parciales, tal como se copiaron de la hoja de cálculo (con coma decimal)
NOTAS = {
    "Romero Santana, Luis": "5; 4,25; 6,5",
    "García Pérez, Ana": "7,5; 8,25; 6",
    "Núñez de la Torre, María José": "10; 9,5; 9,75",
    "Gil, Marta": "4,5; 5; 3,75",
}
ANCHO = 75      # 4 + 31 + 6 + 6 + 6 + 7 + 2 = 62 columnas, más 13 de "Sobresaliente"


def convertir(texto):
    """'7,5; 8,25; 6' -> [7.5, 8.25, 6.0]"""
    return [float(t.strip().replace(",", ".")) for t in texto.split(";")]


def calificacion(media):
    if media < 5:
        return "Suspenso"
    if media < 7:
        return "Aprobado"
    if media < 9:
        return "Notable"
    return "Sobresaliente"


print(" ACTA DE FP1 · SUBGRUPO 43 ".center(ANCHO, "="))   # título centrado entre signos =
print(f"{'N.º':<4}{'Alumno':<31}{'P1':>6}{'P2':>6}{'P3':>6}{'Media':>7}  Calificación")
print("-" * ANCHO)

medias = []
for n, alumno in enumerate(sorted(NOTAS), start=1):     # sorted: por apellidos
    p1, p2, p3 = convertir(NOTAS[alumno])
    media = (p1 + p2 + p3) / 3
    medias.append(media)
    # zfill(2) para el número; cada nota a la derecha con 2 decimales
    print(f"{str(n).zfill(2):<4}{alumno:<31}{p1:6.2f}{p2:6.2f}{p3:6.2f}{media:7.2f}  {calificacion(media)}")

print("-" * ANCHO)
aprobados = sum(1 for m in medias if m >= 5)
print(f"{'Media de la clase:':<53}{sum(medias) / len(medias):7.2f}")
print(f"Aprobados: {aprobados} de {len(medias)} ({aprobados / len(medias):.0%})")
