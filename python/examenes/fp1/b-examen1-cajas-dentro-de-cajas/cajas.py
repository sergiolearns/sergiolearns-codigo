# Simulacro práctico de FP1 · versión B · Cajas dentro de cajas (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
def resumen_caja(caja):
    # Devuelve (objetos, peso total, niveles). Cada caja de dentro es el mismo problema, más pequeño: recursividad.
    objetos, peso, hondo = 0, 0, 0      # hondo: niveles de la caja más honda de dentro
    for cosa in caja:
        if isinstance(cosa, list):                     # otra caja: que la resuelva la llamada recursiva
            o, p, h = resumen_caja(cosa)
            objetos += o
            peso += p
            hondo = max(hondo, h)
        else:                                            # un objeto: suma 1 y su peso
            objetos += 1
            peso += cosa
    return (objetos, peso, hondo + 1)       # + 1: esta caja también es un nivel


if __name__ == "__main__":
    caja = [2, [1, 1, [5]], [], 3, [[4], 1]]
    print(resumen_caja(caja))
    print(resumen_caja([]))
    print(resumen_caja([[[]]]))
