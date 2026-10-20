# Programa 3 · La biblioteca: usuarios, playlists y canciones
# Del artículo «Contenedores asociativos en Python — práctica con un contador de reproducciones, gustos que se cruzan y una biblioteca de playlists (y el bucle que se quejó de que el diccionario cambiaba)»
# https://sergiolearns.com/contenedores-asociativos-en-python-practica/

CANCIONES = {
    "c01": {"titulo": "Luz de neón", "artista": "Marea Alta", "segundos": 215},
    "c02": {"titulo": "Café a las 3", "artista": "Los Turnos", "segundos": 187},
    "c03": {"titulo": "Domingo lento", "artista": "Noa Vela", "segundos": 242},
    "c04": {"titulo": "Kilómetro 0", "artista": "Marea Alta", "segundos": 201},
    "c05": {"titulo": "Pixel", "artista": "Bit Bang", "segundos": 176},
}

USUARIOS = {
    "ana": {
        "nombre": "Ana",
        "playlists": {"Estudiar": ["c03", "c02"], "Gym": ["c01", "c05", "c04"]},
    },
    "luis": {
        "nombre": "Luis",
        "playlists": {"Coche": ["c04", "c01"]},
    },
}


def mm_ss(segundos):
    """Convierte 592 segundos en '9:52'."""
    return f"{segundos // 60}:{segundos % 60:02d}"


def duracion_playlist(usuario, nombre_playlist):
    """Duración total de una playlist de un usuario (0 si no existe)."""
    playlists = USUARIOS[usuario]["playlists"]      # bajamos dos niveles
    codigos = playlists.get(nombre_playlist, [])    # tercer nivel, con valor por defecto
    total = 0
    for codigo in codigos:
        total += CANCIONES[codigo]["segundos"]      # del código, a su duración
    return total


def artistas_de(usuario):
    """Conjunto de artistas que aparecen en las playlists del usuario."""
    artistas = set()                                # set(), no {}
    for codigos in USUARIOS[usuario]["playlists"].values():   # cada lista de códigos
        for codigo in codigos:
            artistas.add(CANCIONES[codigo]["artista"])        # el set no repite
    return artistas


def quien_tiene(codigo):
    """Nombres de los usuarios con esa canción en alguna playlist."""
    nombres = []
    for datos in USUARIOS.values():                 # no tenemos clave: hay que recorrer
        for codigos in datos["playlists"].values():
            if codigo in codigos:
                nombres.append(datos["nombre"])
                break                               # con una playlist basta
    return nombres


print(USUARIOS["ana"]["playlists"]["Gym"])
print("Gym de Ana:", mm_ss(duracion_playlist("ana", "Gym")))
print("Fiesta de Ana:", mm_ss(duracion_playlist("ana", "Fiesta")))
print("Artistas de Ana:", sorted(artistas_de("ana")))
print("Quién tiene c04:", quien_tiene("c04"))
print("Quién tiene c03:", quien_tiene("c03"))
