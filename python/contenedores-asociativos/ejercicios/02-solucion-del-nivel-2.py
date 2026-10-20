# Solución del Nivel 2
# Del artículo «Contenedores asociativos en Python — ejercicios con duraciones, géneros musicales y un recomendador de canciones (y las llaves vacías que no eran un conjunto)»
# https://sergiolearns.com/contenedores-asociativos-en-python-ejercicios/

CANCIONES = [
    ("Luz de neón", "Marea Alta", "pop"),
    ("Café a las 3", "Los Turnos", "indie"),
    ("Domingo lento", "Noa Vela", "indie"),
    ("Kilómetro 0", "Marea Alta", "pop"),
    ("Pixel", "Bit Bang", "electrónica"),
    ("Volver a casa", "Lía Sur", "indie"),
    ("Bajo cero", "Bit Bang", "pop"),
]


def contar_generos(canciones):
    """Diccionario género -> número de canciones."""
    cuentas = {}
    for titulo, artista, genero in canciones:
        cuentas[genero] = cuentas.get(genero, 0) + 1      # el contador de siempre
    return cuentas


def artistas_por_genero(canciones):
    """Diccionario género -> conjunto de artistas (sin repetir)."""
    resultado = {}
    for titulo, artista, genero in canciones:
        if genero not in resultado:            # primera vez que sale el género
            resultado[genero] = set()          # su conjunto vacío
        resultado[genero].add(artista)         # el set ya se encarga de no repetir
    return resultado


def mas_variado(artistas):
    """Género con más artistas distintos."""
    mejor = None
    for genero, conjunto in artistas.items():
        if mejor is None or len(conjunto) > len(artistas[mejor]):
            mejor = genero
    return mejor


print(contar_generos(CANCIONES))
artistas = artistas_por_genero(CANCIONES)
for genero in sorted(artistas):
    print(f"{genero}: {sorted(artistas[genero])}")
print("Género con más artistas:", mas_variado(artistas))
print("En pop y en electrónica:", sorted(artistas["pop"] & artistas["electrónica"]))
