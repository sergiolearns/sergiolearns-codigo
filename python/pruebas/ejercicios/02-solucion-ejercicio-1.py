# Solución Ejercicio 1:
# Del artículo «Pruebas en Python — ejercicios para dominar unittest, caja negra y TDD»
# https://sergiolearns.com/pruebas-en-python-ejercicios/

import unittest

# Tabla de clases de equivalencia
# ─────────────────────────────────────────────────────────────
# CE válidas:
#   CV1: cantidad > 0 y saldo + cantidad <= 100000 → True
#   CV2: cantidad == 0                              → False
#
# CE inválidas:
#   CI1: cantidad < 0            → ValueError
#   CI2: saldo_actual < 0        → ValueError
#   CI3: saldo + cantidad > 100000 → ValueError
#   CI4: cantidad no numérico    → TypeError
#   CI5: saldo no numérico       → TypeError
#
# Valores límite:
#   cantidad = 0       → False (frontera CV1/CV2)
#   cantidad = 0.01    → True  (mínimo válido)
#   saldo + cantidad = 100000    → True  (límite exacto)
#   saldo + cantidad = 100000.01 → ValueError (justo por encima)
# ─────────────────────────────────────────────────────────────

class TestValidarIngreso(unittest.TestCase):

    # ── Clases de equivalencia válidas ──────────────────────────────────

    def test_ce_cantidad_valida(self):
        """CV1 — cantidad positiva con margen de saldo."""
        self.assertTrue(validar_ingreso(100, 500))

    def test_ce_cantidad_cero(self):
        """CV2 — cantidad cero devuelve False."""
        self.assertFalse(validar_ingreso(0, 500))

    def test_ce_saldo_resultante_en_limite(self):
        """CV1 — saldo resultante justo en el límite."""
        self.assertTrue(validar_ingreso(500, 99500))

    # ── Clases de equivalencia inválidas ────────────────────────────────

    def test_ce_valor_negativo_cantidad(self):
        """CI1 — cantidad negativa lanza ValueError."""
        with self.assertRaises(ValueError):
            validar_ingreso(-50, 500)

    def test_ce_valor_negativo_saldo(self):
        """CI2 — saldo_actual negativo lanza ValueError."""
        with self.assertRaises(ValueError):
            validar_ingreso(100, -500)

    def test_ce_saldo_supera_limite(self):
        """CI3 — saldo resultante supera 100.000€."""
        with self.assertRaises(ValueError):
            validar_ingreso(200, 99900)    # 99900 + 200 = 100100 > 100000

    def test_ce_tipo_incorrecto_cantidad(self):
        """CI4 — cantidad como cadena lanza TypeError."""
        with self.assertRaises(TypeError):
            validar_ingreso("cien", 500)

    def test_ce_tipo_incorrecto_saldo(self):
        """CI5 — saldo como None lanza TypeError."""
        with self.assertRaises(TypeError):
            validar_ingreso(100, None)

    # ── Valores límite ───────────────────────────────────────────────────

    def test_limite_cantidad_minima(self):
        """Mínimo positivo — 0.01€ es válido."""
        self.assertTrue(validar_ingreso(0.01, 0))

    def test_limite_saldo_exactamente_cero(self):
        """Saldo inicial exactamente 0 es válido."""
        self.assertTrue(validar_ingreso(100, 0))

    def test_limite_saldo_resultado_exactamente_100000(self):
        """Saldo resultante exactamente 100.000€ — válido."""
        self.assertTrue(validar_ingreso(100, 99900))

    def test_limite_saldo_resultado_supera_100000(self):
        """Saldo resultante 100.000,01€ — inválido."""
        with self.assertRaises(ValueError):
            validar_ingreso(0.01, 100000)


if __name__ == "__main__":
    unittest.main(verbosity=2)
