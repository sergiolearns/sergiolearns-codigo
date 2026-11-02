# Bloque 1: pruebas de caja negra de clasificar_nota
# Del artículo «Pruebas en Python con unittest — práctica con las notas de FP2, el descuento de la tienda y un TDD de la piscina (y el panel que marcaba 82 grados)»
# https://sergiolearns.com/pruebas-en-python-practica/

import unittest


def clasificar_nota(nota):
    """Calificación de una nota de 0 a 10 (ambos incluidos):
    menos de 5 Suspenso, de 5 a menos de 7 Aprobado, de 7 a menos de 9 Notable, de 9 a 10 Sobresaliente.
    TypeError si la nota no es un número; ValueError si está fuera de 0-10."""
    if isinstance(nota, bool) or not isinstance(nota, (int, float)):
        raise TypeError('la nota debe ser un número')
    if nota < 0 or nota > 10:
        raise ValueError('la nota debe estar entre 0 y 10')
    if nota < 5:
        return 'Suspenso'
    if nota < 7:
        return 'Aprobado'
    if nota < 9:
        return 'Notable'
    return 'Sobresaliente'


class TestClasificarNota(unittest.TestCase):
    # Clases válidas: un representativo de cada una
    def test_ce1_suspenso(self):
        self.assertEqual(clasificar_nota(3.2), 'Suspenso')

    def test_ce2_aprobado(self):
        self.assertEqual(clasificar_nota(6), 'Aprobado')

    def test_ce3_notable(self):
        self.assertEqual(clasificar_nota(7.8), 'Notable')

    def test_ce4_sobresaliente(self):
        self.assertEqual(clasificar_nota(9.5), 'Sobresaliente')

    # Clases no válidas
    def test_ce5_negativa(self):
        with self.assertRaises(ValueError):
            clasificar_nota(-2)

    def test_ce6_mayor_de_10(self):
        with self.assertRaises(ValueError):
            clasificar_nota(11)

    def test_ce7_texto(self):
        with self.assertRaises(TypeError):
            clasificar_nota('ocho')

    # Valores límite de cada frontera
    def test_lim_invalidos(self):
        for nota in (-0.01, 10.01):
            with self.subTest(nota=nota):
                with self.assertRaises(ValueError):
                    clasificar_nota(nota)

    def test_lim_validos(self):
        casos = [(0, 'Suspenso'), (4.99, 'Suspenso'), (5, 'Aprobado'), (6.99, 'Aprobado'),
                 (7, 'Notable'), (8.99, 'Notable'), (9, 'Sobresaliente'), (10, 'Sobresaliente')]
        for nota, esperada in casos:
            with self.subTest(nota=nota):
                self.assertEqual(clasificar_nota(nota), esperada)


unittest.main(verbosity=2)
