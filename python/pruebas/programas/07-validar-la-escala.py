# Iteración 2 — Validar la escala
# Del artículo «Pruebas en Python — caja negra, caja blanca y TDD con programas reales»
# https://sergiolearns.com/pruebas-en-python-practica/

class Temperatura:
    ESCALAS_VALIDAS = {'C', 'F', 'K'}

    def __init__(self, valor, escala):
        if escala not in self.ESCALAS_VALIDAS:
            raise ValueError(f"Escala '{escala}' no válida. Usa C, F o K.")
        self.valor = valor
        self.escala = escala
# VERDE ✓
