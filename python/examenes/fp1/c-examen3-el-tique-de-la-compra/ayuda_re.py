# Simulacro práctico de FP1 · versión C · El tique de la compra (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
import re


def buscar_precio(linea):
    """Si la línea es de un producto, devuelve (nombre, precio) con el precio tal y como aparece ("1,15"); si no, None.
    Si la usas en lugar de tu propio patrón, la nota máxima es un 8 (ya hecha: no la toques)."""
    m = re.match(r"^(.*?)[\s.]*(\d+[,.]\d{2})\s*(?:€|EUR)\s*$", linea)
    return (m.group(1), m.group(2)) if m else None
