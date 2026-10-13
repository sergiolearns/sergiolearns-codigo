# Iteración 1 — Crear una temperatura válida
# Del artículo «Pruebas en Python — caja negra, caja blanca y TDD con programas reales»
# https://sergiolearns.com/pruebas-en-python-practica/

# ARCHIVO: test_temperatura.py
import unittest
from temperatura import Temperatura    # no existe todavía

class TestTemperatura(unittest.TestCase):

    def test_crear_celsius(self):
        """Crear una temperatura en Celsius."""
        t = Temperatura(25, 'C')
        self.assertEqual(t.valor, 25)
        self.assertEqual(t.escala, 'C')

# ROJO — ImportError: no module named 'temperatura'
