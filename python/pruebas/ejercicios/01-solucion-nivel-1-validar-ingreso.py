# Solución del ejercicio 1: caja negra de validar_ingreso
# Del artículo «Pruebas en Python con unittest — ejercicios con caja negra, pruebas mal diseñadas y TDD de una cuenta bancaria (y el test que siempre pasaba)»
# https://sergiolearns.com/pruebas-en-python-ejercicios/

import unittest


def validar_ingreso(cantidad, saldo_actual):
    """True si el ingreso es válido, False si la cantidad es 0.
    TypeError si algún dato no es numérico; ValueError si la cantidad o el saldo son negativos
    o si el saldo resultante superaría 100 000 €."""
    for dato in (cantidad, saldo_actual):
        if isinstance(dato, bool) or not isinstance(dato, (int, float)):
            raise TypeError('los importes deben ser números')
    if cantidad < 0:
        raise ValueError('la cantidad no puede ser negativa')
    if saldo_actual < 0:
        raise ValueError('el saldo no puede ser negativo')
    if saldo_actual + cantidad > 100_000:
        raise ValueError('se superaría el límite de 100 000 €')
    return cantidad > 0           # 0 no es error, pero tampoco un ingreso


class TestValidarIngreso(unittest.TestCase):
    # Clases de equivalencia válidas
    def test_ce1_cantidad_valida(self):
        self.assertTrue(validar_ingreso(250, 1000))

    def test_ce2_cantidad_cero(self):
        self.assertFalse(validar_ingreso(0, 1000))

    # Clases no válidas: una prueba por cada motivo de error
    def test_ce3_cantidad_negativa(self):
        with self.assertRaises(ValueError):
            validar_ingreso(-50, 1000)

    def test_ce4_saldo_negativo(self):
        with self.assertRaises(ValueError):
            validar_ingreso(50, -10)

    def test_ce5_supera_limite(self):
        with self.assertRaises(ValueError):
            validar_ingreso(5000, 99000)

    def test_ce6_cantidad_no_numerica(self):
        with self.assertRaises(TypeError):
            validar_ingreso('100', 1000)

    def test_ce7_saldo_no_numerico(self):
        with self.assertRaises(TypeError):
            validar_ingreso(100, None)

    # Valores límite
    def test_lim_cantidad_minima(self):
        self.assertTrue(validar_ingreso(0.01, 0))

    def test_lim_saldo_cero(self):
        self.assertTrue(validar_ingreso(100, 0))

    def test_lim_total_100000(self):
        self.assertTrue(validar_ingreso(1, 99_999))

    def test_lim_total_supera(self):
        with self.assertRaises(ValueError):
            validar_ingreso(2, 99_999)


unittest.main(verbosity=2)
