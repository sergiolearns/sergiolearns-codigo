# Simulacro práctico de FP1 · versión B · Correos por dominio (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
import re


def buscar_correos(texto):
    """Devuelve una lista con los correos que hay en el texto, tal y como aparecen (con repetidos).
    Si la usas en lugar de tu propio patrón, la nota máxima es un 8 (ya hecha: no la toques)."""
    return re.findall(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", texto)
