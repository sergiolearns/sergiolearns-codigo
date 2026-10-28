# Simulacro práctico de FP1 · versión C · Temperaturas de la semana (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
def imprimir_resumen(resumen):
    """Imprime el resumen como una tabla (ya hecha: no la toques)."""
    print(f"{'Día':<10}{'Mín':>6}{'Máx':>6}{'Media':>7}")
    for dia, minima, maxima, media in resumen:
        if minima is None:
            print(f"{dia:<10}{'sin datos':>19}")
        else:
            print(f"{dia:<10}{minima:>6}{maxima:>6}{media:>7}")
