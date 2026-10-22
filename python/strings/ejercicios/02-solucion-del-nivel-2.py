# Solución del Nivel 2 · Firmas y códigos de alumno
# Del artículo «Strings en Python — ejercicios con correos de la universidad, firmas con iniciales y un parte de asistencia (y los dos espacios que rompieron mis iniciales)»
# https://sergiolearns.com/strings-en-python-ejercicios/

ALUMNOS = [
    "ana garcía pérez",
    "LUIS ROMERO SANTANA",
    "maría josé núñez torre",
    "  marta   gil  sosa ",
]
VOCALES = "aeiouáéíóúü"


def firma(nombre_completo):
    """'maría josé núñez torre' -> 'M. J. Núñez Torre' (las dos últimas palabras son los apellidos)."""
    palabras = nombre_completo.title().split()
    nombres, apellidos = palabras[:-2], palabras[-2:]   # slices de la LISTA de palabras
    iniciales = " ".join(p[0] + "." for p in nombres)
    return iniciales + " " + " ".join(apellidos)


def codigo(nombre_completo, n):
    """Tres primeras letras de cada apellido, en mayúsculas, y el número con dos cifras."""
    ap1, ap2 = nombre_completo.upper().split()[-2:]
    return ap1[:3] + "-" + ap2[:3] + "-" + str(n).zfill(2)


def contar_vocales(texto):
    cuenta = 0
    for letra in texto.lower():       # lower: así 'A' y 'a' cuentan igual
        if letra in VOCALES:          # in sobre un string: ¿es uno de sus caracteres?
            cuenta += 1
    return cuenta


print(f"{'Firma':<22}{'Código':<14}Vocales")
for n, alumno in enumerate(ALUMNOS, start=1):
    print(f"{firma(alumno):<22}{codigo(alumno, n):<14}{contar_vocales(alumno):>7}")
