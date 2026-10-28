# Simulacro práctico de FP1 · versión A · Las horas de un horario (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
import re


def buscar_horas(texto):
    """Devuelve una lista con las horas (H:MM, HH:MM o HHhMM) que hay en el texto, tal y como aparecen, también las que no son válidas.
    Si la usas en lugar de tu propio patrón, la nota máxima es un 8 (ya hecha: no la toques)."""
    return [m.group(0) for m in re.finditer(r"\b\d{1,2}[:h]\d{2}\b", texto)]
