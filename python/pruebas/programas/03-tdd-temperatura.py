# Bloque 3: TDD de la clase Temperatura
# Del artículo «Pruebas en Python con unittest — práctica con las notas de FP2, el descuento de la tienda y un TDD de la piscina (y el panel que marcaba 82 grados)»
# https://sergiolearns.com/pruebas-en-python-practica/

import unittest


class Temperatura:
    ESCALAS = ('C', 'F', 'K')
    CERO_ABSOLUTO_C = -273.15

    def __init__(self, valor, escala):
        if escala not in self.ESCALAS:
            raise ValueError(f'escala {escala!r} no válida: usa C, F o K')
        if self._celsius(valor, escala) < self.CERO_ABSOLUTO_C:
            raise ValueError('por debajo del cero absoluto')
        self.valor = valor
        self.escala = escala

    @staticmethod
    def _celsius(valor, escala):
        """Pasa cualquier escala a Celsius (la usan la validación y las conversiones)."""
        if escala == 'C':
            return valor
        if escala == 'F':
            return (valor - 32) * 5 / 9
        return valor - 273.15

    def a_celsius(self):
        return Temperatura(self._celsius(self.valor, self.escala), 'C')

    def a_fahrenheit(self):
        return Temperatura(self._celsius(self.valor, self.escala) * 9 / 5 + 32, 'F')

    def a_kelvin(self):
        return Temperatura(self._celsius(self.valor, self.escala) + 273.15, 'K')

    def __eq__(self, otra):
        if not isinstance(otra, Temperatura):
            return NotImplemented
        # en Celsius y con margen: 80.6 °F pasados a C dan 26.999999999999996, no 27
        return abs(self.a_celsius().valor - otra.a_celsius().valor) < 1e-9

    def __str__(self):
        return f'{self.valor}°{self.escala}'

    def __repr__(self):
        return f'Temperatura({self.valor!r}, {self.escala!r})'


class TestTemperatura(unittest.TestCase):
    # Iteración 1: crear
    def test_i1_crear_celsius(self):
        t = Temperatura(25, 'C')
        self.assertEqual((t.valor, t.escala), (25, 'C'))

    # Iteración 2: la escala
    def test_i2_escala_invalida(self):
        with self.assertRaises(ValueError):
            Temperatura(25, 'X')

    # Iteración 3: el cero absoluto (con sus valores límite)
    def test_i3_bajo_cero_absoluto(self):
        with self.assertRaises(ValueError):
            Temperatura(-273.16, 'C')

    def test_i3_cero_kelvin_es_valido(self):
        self.assertEqual(Temperatura(0, 'K').valor, 0)

    # Iteración 4: conversiones
    def test_i4_celsius_a_kelvin(self):
        self.assertAlmostEqual(Temperatura(0, 'C').a_kelvin().valor, 273.15)

    def test_i4_fahrenheit_a_celsius(self):
        self.assertAlmostEqual(Temperatura(212, 'F').a_celsius().valor, 100)

    def test_i4_kelvin_a_fahrenheit(self):
        self.assertAlmostEqual(Temperatura(373.15, 'K').a_fahrenheit().valor, 212)

    # Iteración 5: comparar
    def test_i5_iguales_en_distinta_escala(self):
        self.assertEqual(Temperatura(100, 'C'), Temperatura(212, 'F'))

    def test_i5_distintas(self):
        self.assertNotEqual(Temperatura(25, 'C'), Temperatura(30, 'C'))

    # Iteración 6: texto
    def test_i6_repr(self):
        self.assertEqual(repr(Temperatura(28, 'C')), "Temperatura(28, 'C')")

    def test_i6_str(self):
        self.assertEqual(str(Temperatura(28, 'C')), '28°C')


unittest.main(verbosity=2)
