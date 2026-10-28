# Simulacro práctico de FP1 · versión B · Guaguas entre dos paradas (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
from ejemplo import ejemplo



def lineas_entre(datos, origen, destino, dia):
    lineas, paradas = datos
    if origen not in paradas:
        return "NO ORI"
    if destino not in paradas:
        return "NO DES"
    # Solo pueden servir las líneas que paran en las dos: intersección de conjuntos
    comunes = paradas[origen][1] & paradas[destino][1]
    viajes = []
    for linea in comunes:
        nombre, recorrido, dias = lineas[linea]
        if dia in dias:
            i = recorrido.index(origen)
            j = recorrido.index(destino)
            if i < j:                                  # la guagua va en ese sentido
                viajes.append((linea, j - i))
    if not viajes:
        return "NO HAY"
    # Menos paradas primero; si empatan, por número de línea (int: "3" va antes que "12")
    return sorted(viajes, key=lambda v: (v[1], int(v[0])))


if __name__ == "__main__":
    print(lineas_entre(ejemplo, "P01", "P03", "S"))
    print(lineas_entre(ejemplo, "P01", "P03", "D"))
    print(lineas_entre(ejemplo, "P05", "P03", "L"))
    print(lineas_entre(ejemplo, "P07", "P05", "L"))
    print(lineas_entre(ejemplo, "P99", "P01", "L"))
