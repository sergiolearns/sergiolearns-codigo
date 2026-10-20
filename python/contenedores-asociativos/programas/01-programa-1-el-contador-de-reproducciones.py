# Programa 1 · El contador de reproducciones
# Del artículo «Contenedores asociativos en Python — práctica con un contador de reproducciones, gustos que se cruzan y una biblioteca de playlists (y el bucle que se quejó de que el diccionario cambiaba)»
# https://sergiolearns.com/contenedores-asociativos-en-python-practica/

HISTORIAL = [
    ("Luz de neón", "Marea Alta"),
    ("Café a las 3", "Los Turnos"),
    ("Luz de neón", "Marea Alta"),
    ("Kilómetro 0", "Marea Alta"),
    ("Domingo lento", "Noa Vela"),
    ("Luz de neón", "Marea Alta"),
    ("Café a las 3", "Los Turnos"),
]


def contar(historial):
    """Devuelve un diccionario canción -> veces que se ha escuchado."""
    cuentas = {}                                   # empieza vacío
    for cancion, artista in historial:             # cada tupla se desempaqueta en dos
        # get(cancion, 0): las veces que lleva, o 0 si es la primera vez que sale
        cuentas[cancion] = cuentas.get(cancion, 0) + 1
    return cuentas


def mas_escuchada(cuentas):
    """Devuelve la pareja (canción, veces) con más reproducciones."""
    mejor = None                                   # todavía no hemos visto ninguna
    for cancion, veces in cuentas.items():
        # mejor[1] son las veces de la mejor hasta ahora
        if mejor is None or veces > mejor[1]:
            mejor = (cancion, veces)
    return mejor


def por_artista(historial):
    """Devuelve un diccionario artista -> lista de sus canciones, sin repetir."""
    resultado = {}
    for cancion, artista in historial:
        if artista not in resultado:               # primera vez que aparece el artista:
            resultado[artista] = []                # le creamos su lista vacía
        if cancion not in resultado[artista]:      # así la canción no se repite
            resultado[artista].append(cancion)
    return resultado


cuentas = contar(HISTORIAL)
print(cuentas)
print("La más escuchada:", mas_escuchada(cuentas))
for artista, canciones in por_artista(HISTORIAL).items():
    print(f"{artista}: {', '.join(canciones)}")
