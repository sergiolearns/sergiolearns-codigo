# Solución del Nivel 3
# Del artículo «Contenedores asociativos en Python — ejercicios con duraciones, géneros musicales y un recomendador de canciones (y las llaves vacías que no eran un conjunto)»
# https://sergiolearns.com/contenedores-asociativos-en-python-ejercicios/

GUARDADAS = {
    "ana": {"Luz de neón", "Café a las 3", "Pixel", "Domingo lento"},
    "luis": {"Pixel", "Café a las 3", "Volver a casa"},
    "sara": {"Domingo lento", "Luz de neón", "Café a las 3", "Bajo cero"},
    "pablo": {"Marzo"},
}


def afinidad(a, b):
    """Parte común de dos conjuntos, de 0 a 1 (0 si los dos están vacíos)."""
    union = a | b
    if not union:                        # un conjunto vacío es "falso"
        return 0
    return len(a & b) / len(union)


def mas_parecido(usuario, guardadas):
    """Otro usuario con más afinidad, o None si nadie comparte nada."""
    mejor, mejor_afinidad = None, 0
    for otro, canciones in guardadas.items():
        if otro == usuario:              # no se compara consigo mismo
            continue
        valor = afinidad(guardadas[usuario], canciones)
        if valor > mejor_afinidad:       # con > estricto, afinidad 0 nunca gana
            mejor, mejor_afinidad = otro, valor
    return mejor


def recomendar(usuario, guardadas):
    """(usuario más parecido, canciones suyas que este no tiene, ordenadas)."""
    otro = mas_parecido(usuario, guardadas)
    if otro is None:
        return None, []
    return otro, sorted(guardadas[otro] - guardadas[usuario])


for usuario in GUARDADAS:
    otro, lista = recomendar(usuario, GUARDADAS)
    if otro is None:
        print(f"{usuario}: sin recomendaciones")
    else:
        print(f"{usuario}: se parece a {otro} -> {lista}")
print(f"Afinidad ana-sara: {afinidad(GUARDADAS['ana'], GUARDADAS['sara']):.0%}")
