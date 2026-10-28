# Simulacro práctico de FP1 · versión A · Butacas libres en el cine (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
def dibujar_sala(sala):
    """Devuelve la sala como texto: · libre y X ocupada (ya hecha: no la toques)."""
    lineas = []
    for num, fila in enumerate(sala, 1):
        lineas.append(f"{num:>2} " + " ".join("X" if asiento else "·" for asiento in fila))
    return "\n".join(lineas)
