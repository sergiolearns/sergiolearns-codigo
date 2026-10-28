# Simulacro práctico de FP1 · versión C · Temperaturas de la semana (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
from tabla import imprimir_resumen



def resumen_dia(lecturas):
    # (mínima, máxima, media con 1 decimal) de un día, o (None, None, None) si no hay lecturas.
    if not lecturas:                   # sin esto, sum([]) / len([]) sería una división entre cero
        return (None, None, None)
    return (min(lecturas), max(lecturas), round(sum(lecturas) / len(lecturas), 1))


def resumen_semana(dias, temperaturas):
    resumen = []
    for i in range(len(dias)):           # la fila i de la matriz es el día i de la tupla
        minima, maxima, media = resumen_dia(temperaturas[i])
        resumen.append((dias[i], minima, maxima, media))
    return resumen


if __name__ == "__main__":
    dias = ("Lunes", "Martes", "Miércoles")
    temperaturas = [[18, 21.5, 24, 22], [], [17, 19, 23.5, 25, 20]]
    resumen = resumen_semana(dias, temperaturas)
    print(resumen)
    imprimir_resumen(resumen)
