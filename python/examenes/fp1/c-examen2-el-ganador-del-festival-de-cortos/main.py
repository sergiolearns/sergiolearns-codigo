# Simulacro práctico de FP1 · versión C · El ganador del festival de cortos (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
from ejemplo import ejemplo



def ganador_categoria(datos, categoria):
    cortos, votantes = datos
    de_la_cat = {cod for cod, (titulo, direccion, cat) in cortos.items() if cat == categoria}
    if not de_la_cat:
        return "NO CAT"
    # Reunir los votos de cada corto de la categoría: código -> [puntos, puntos…]
    votos = {}
    for dni, (nombre, puntos) in votantes.items():
        for cod, p in puntos.items():
            if cod in de_la_cat:
                votos.setdefault(cod, []).append(p)
    if not votos:
        return "NO VOT"
    mejor = None
    for cod, lista in votos.items():
        media = sum(lista) / len(lista)          # se compara la media exacta, sin redondear
        clave = (-media, -len(lista), cortos[cod][0])   # más media, más votos, título antes
        if mejor is None or clave < mejor[0]:
            mejor = (clave, cod, media, len(lista))
    clave, cod, media, n = mejor
    return (cortos[cod][0], round(media, 2), n)


if __name__ == "__main__":
    print(ganador_categoria(ejemplo, "ficción"))
    print(ganador_categoria(ejemplo, "documental"))
    print(ganador_categoria(ejemplo, "terror"))
    print(ganador_categoria(ejemplo, "musical"))
