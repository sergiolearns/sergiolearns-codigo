# Programa 1 · Limpiar la lista de clase
# Del artículo «Strings en Python — práctica limpiando una lista de clase, validando DNIs y sacando un acta alineada (y el 7,5 que float() no quiso leer)»
# https://sergiolearns.com/strings-en-python-practica/

# Lista tal como llegó del formulario: "apellidos, nombre", escrita por cada uno a su manera
CRUDA = [
    "  gARCÍA pérez, ana ",
    "ROMERO   SANTANA,luis",
    "núñez de la torre , MARÍA JOSÉ",
    "gil, marta   ",
]

PARTICULAS = ["de", "la", "del", "las", "los", "y"]
TILDES = {"á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ü": "u", "ñ": "n"}


def normalizar_espacios(texto):
    """Quita los espacios de los extremos y deja UN solo espacio entre palabras."""
    return " ".join(texto.split())    # split() sin argumento corta por cualquier hueco


def corregir_particulas(texto):
    """title() escribe 'De La'; las partículas van en minúscula (salvo si son la primera palabra)."""
    palabras = texto.split()
    for i in range(1, len(palabras)):          # desde la 1: la primera palabra no se toca
        if palabras[i].lower() in PARTICULAS:
            palabras[i] = palabras[i].lower()  # en una LISTA sí se puede cambiar un elemento
    return " ".join(palabras)


def nombre_bonito(linea):
    """'gARCÍA pérez, ana' -> ('Ana', 'García Pérez')."""
    apellidos, coma, nombre = linea.partition(",")   # corta por la PRIMERA coma
    nombre = normalizar_espacios(nombre).title()
    apellidos = corregir_particulas(normalizar_espacios(apellidos).title())
    return nombre, apellidos


def sin_tildes(texto):
    """Cambia cada vocal con tilde (y la ñ) por su versión sin tilde."""
    for con, sin in TILDES.items():
        texto = texto.replace(con, sin)   # replace devuelve un string nuevo: hay que guardarlo
    return texto


def usuario(nombre, apellidos):
    """Primera palabra del nombre + '.' + primer apellido, en minúsculas y sin tildes."""
    primero = nombre.split()[0]
    apellido1 = apellidos.split()[0]
    return sin_tildes((primero + "." + apellido1).lower())   # primero lower: TILDES está en minúsculas


for n, linea in enumerate(CRUDA, start=1):
    nombre, apellidos = nombre_bonito(linea)
    print(f"{n}. {nombre} {apellidos}  ->  {usuario(nombre, apellidos)}@alu.ulpgc.es")
