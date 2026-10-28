# Simulacro práctico de FP1 · versión A · Las horas de un horario (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
def leer_texto(nombre):
    """Devuelve todo el contenido de un fichero de texto (ya hecha: no la toques)."""
    with open(nombre, encoding="utf-8") as f:
        return f.read()
