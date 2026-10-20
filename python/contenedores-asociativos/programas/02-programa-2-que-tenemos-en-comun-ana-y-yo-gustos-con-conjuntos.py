# Programa 2 · ¿Qué tenemos en común Ana y yo? Gustos con conjuntos
# Del artículo «Contenedores asociativos en Python — práctica con un contador de reproducciones, gustos que se cruzan y una biblioteca de playlists (y el bucle que se quejó de que el diccionario cambiaba)»
# https://sergiolearns.com/contenedores-asociativos-en-python-practica/

ANA = {"Luz de neón", "Café a las 3", "Pixel", "Domingo lento", "Kilómetro 0"}
LUIS = {"Pixel", "Café a las 3", "Volver a casa", "Kilómetro 0", "Bajo cero"}
CATALOGO = ANA | LUIS | {"Marzo", "Sin cobertura"}   # todo lo que hay en la app


def mostrar(titulo, canciones):
    """Muestra un conjunto ordenado (un set no tiene un orden fijo)."""
    print(f"{titulo} ({len(canciones)}): {', '.join(sorted(canciones))}")


mostrar("En común", ANA & LUIS)            # intersección
mostrar("Entre los dos", ANA | LUIS)       # unión
mostrar("Solo Ana", ANA - LUIS)            # diferencia
mostrar("Solo Luis", LUIS - ANA)           # diferencia al revés
mostrar("No comparten", ANA ^ LUIS)        # diferencia simétrica

# Afinidad: qué parte de todo lo que escuchan entre los dos es común (de 0 a 1)
afinidad = len(ANA & LUIS) / len(ANA | LUIS)
print(f"Afinidad: {afinidad:.0%}")

# Lo que hay en la app y no ha guardado ninguno de los dos
mostrar("Sin oyentes", CATALOGO - (ANA | LUIS))

print(ANA <= CATALOGO, (ANA & LUIS) < ANA)   # inclusión
