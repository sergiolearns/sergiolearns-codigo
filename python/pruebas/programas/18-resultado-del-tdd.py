# Clase completa — resultado del TDD
# Del artículo «Pruebas en Python — caja negra, caja blanca y TDD con programas reales»
# https://sergiolearns.com/pruebas-en-python-practica/

# test_temperatura.py — conjunto completo de pruebas
import unittest
from temperatura import Temperatura

class TestTemperatura(unittest.TestCase):

    # ── Creación válida ──────────────────────────────────────────────────

    def test_crear_celsius(self):
        t = Temperatura(25, 'C')
        self.assertEqual(t.valor, 25)
        self.assertEqual(t.escala, 'C')

    def test_crear_fahrenheit(self):
        t = Temperatura(98.6, 'F')
        self.assertAlmostEqual(t.valor, 98.6)

    def test_crear_kelvin(self):
        t = Temperatura(300, 'K')
        self.assertEqual(t.escala, 'K')

    # ── Validación de escala ─────────────────────────────────────────────

    def test_escala_invalida(self):
        with self.assertRaises(ValueError):
            Temperatura(25, 'X')

    def test_escala_minuscula(self):
        with self.assertRaises(ValueError):
            Temperatura(25, 'c')

    # ── Cero absoluto ────────────────────────────────────────────────────

    def test_cero_absoluto_celsius(self):
        with self.assertRaises(ValueError):
            Temperatura(-274, 'C')

    def test_exactamente_cero_absoluto_es_valido(self):
        t = Temperatura(-273.15, 'C')
        self.assertAlmostEqual(t.valor, -273.15)

    def test_cero_absoluto_kelvin(self):
        with self.assertRaises(ValueError):
            Temperatura(-1, 'K')

    def test_cero_kelvin_es_valido(self):
        t = Temperatura(0, 'K')
        self.assertEqual(t.valor, 0)

    # ── Conversiones ─────────────────────────────────────────────────────

    def test_celsius_a_fahrenheit(self):
        self.assertAlmostEqual(Temperatura(100, 'C').a_fahrenheit().valor, 212.0)

    def test_fahrenheit_a_celsius(self):
        self.assertAlmostEqual(Temperatura(212, 'F').a_celsius().valor, 100.0)

    def test_celsius_a_kelvin(self):
        self.assertAlmostEqual(Temperatura(0, 'C').a_kelvin().valor, 273.15)

    def test_kelvin_a_celsius(self):
        self.assertAlmostEqual(Temperatura(0, 'K').a_celsius().valor, -273.15)

    def test_conversion_mantiene_escala_destino(self):
        self.assertEqual(Temperatura(25, 'C').a_fahrenheit().escala, 'F')

    # ── Igualdad ─────────────────────────────────────────────────────────

    def test_igualdad_misma_escala(self):
        self.assertEqual(Temperatura(25, 'C'), Temperatura(25, 'C'))

    def test_igualdad_distinta_escala(self):
        self.assertEqual(Temperatura(100, 'C'), Temperatura(212, 'F'))

    def test_desigualdad(self):
        self.assertNotEqual(Temperatura(25, 'C'), Temperatura(30, 'C'))

    # ── Representación ───────────────────────────────────────────────────

    def test_str(self):
        self.assertEqual(str(Temperatura(25, 'C')), '25°C')

    def test_repr(self):
        self.assertEqual(repr(Temperatura(25, 'C')), "Temperatura(25, 'C')")


if __name__ == "__main__":
    unittest.main(verbosity=2)
