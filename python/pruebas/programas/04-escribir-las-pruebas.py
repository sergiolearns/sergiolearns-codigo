# Paso 4 — Escribir las pruebas
# Del artículo «Pruebas en Python — caja negra, caja blanca y TDD con programas reales»
# https://sergiolearns.com/pruebas-en-python-practica/

import unittest
from descuentos import descuento_cliente

class TestDescuentoCliente(unittest.TestCase):

    def test_p1_sin_compra_minima_sin_premium(self):
        """P1 — compra < 50 y no premium → 0% descuento."""
        resultado = descuento_cliente(30, 50, False)
        self.assertEqual(resultado, 0)

    def test_p2_sin_compra_minima_con_premium(self):
        """P2 — compra < 50 y premium → solo 5% de premium."""
        resultado = descuento_cliente(30, 50, True)
        self.assertEqual(resultado, 5)

    def test_p3_compra_minima_sin_puntos_sin_premium(self):
        """P3 — compra >= 50, puntos < 100, no premium → 5%."""
        resultado = descuento_cliente(60, 50, False)
        self.assertEqual(resultado, 5)

    def test_p4_compra_y_puntos_y_premium(self):
        """P4 — compra >= 50, puntos >= 100, premium → 15%."""
        resultado = descuento_cliente(60, 150, True)
        self.assertEqual(resultado, 15)

    # ── Valores límite adicionales ───────────────────────────────────────

    def test_limite_compra_exactamente_50(self):
        """Límite exacto de compra mínima."""
        resultado = descuento_cliente(50, 0, False)
        self.assertEqual(resultado, 5)

    def test_limite_compra_justo_por_debajo_50(self):
        """Justo por debajo del límite."""
        resultado = descuento_cliente(49.99, 0, False)
        self.assertEqual(resultado, 0)

    def test_limite_puntos_exactamente_100(self):
        """Límite exacto de puntos."""
        resultado = descuento_cliente(60, 100, False)
        self.assertEqual(resultado, 10)

    def test_limite_puntos_justo_por_debajo_100(self):
        """Justo por debajo del límite de puntos."""
        resultado = descuento_cliente(60, 99, False)
        self.assertEqual(resultado, 5)

    def test_combinacion_compra_y_puntos_sin_premium(self):
        """Compra >= 50 y puntos >= 100 pero sin premium → 10%."""
        resultado = descuento_cliente(60, 150, False)
        self.assertEqual(resultado, 10)


if __name__ == "__main__":
    unittest.main(verbosity=2)
