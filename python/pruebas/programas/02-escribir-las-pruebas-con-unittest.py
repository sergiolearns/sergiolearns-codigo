# Paso 4 — Escribir las pruebas con unittest
# Del artículo «Pruebas en Python — caja negra, caja blanca y TDD con programas reales»
# https://sergiolearns.com/pruebas-en-python-practica/

import unittest
from notas import clasificar_nota

class TestClasificarNota(unittest.TestCase):

    # ── Clases de equivalencia válidas ──────────────────────────────────

    def test_ce1_matricula_valor_central(self):
        """CE1 — valor central de matrícula."""
        self.assertEqual(clasificar_nota(9.5), 'Matrícula')

    def test_ce2_sobresaliente_valor_central(self):
        """CE2 — valor central de sobresaliente."""
        self.assertEqual(clasificar_nota(8.0), 'Sobresaliente')

    def test_ce3_notable_valor_central(self):
        """CE3 — valor central de notable."""
        self.assertEqual(clasificar_nota(7.0), 'Notable')

    def test_ce4_bien_valor_central(self):
        """CE4 — valor central de bien."""
        self.assertEqual(clasificar_nota(5.5), 'Bien')

    def test_ce5_suficiente_valor_central(self):
        """CE5 — valor central de suficiente."""
        self.assertEqual(clasificar_nota(4.7), 'Suficiente')

    def test_ce6_suspenso_valor_central(self):
        """CE6 — valor central de suspenso."""
        self.assertEqual(clasificar_nota(2.0), 'Suspenso')

    # ── Valores límite ───────────────────────────────────────────────────

    def test_limite_matricula_minimo(self):
        """Límite inferior de matrícula — exactamente 9."""
        self.assertEqual(clasificar_nota(9.0), 'Matrícula')

    def test_limite_matricula_maximo(self):
        """Límite superior — exactamente 10."""
        self.assertEqual(clasificar_nota(10.0), 'Matrícula')

    def test_limite_frontera_matricula_sobresaliente(self):
        """Frontera crítica — justo por debajo de 9."""
        self.assertEqual(clasificar_nota(8.99), 'Sobresaliente')

    def test_limite_sobresaliente_minimo(self):
        """Límite inferior de sobresaliente — exactamente 7.5."""
        self.assertEqual(clasificar_nota(7.5), 'Sobresaliente')

    def test_limite_frontera_sobresaliente_notable(self):
        """Frontera crítica — justo por debajo de 7.5."""
        self.assertEqual(clasificar_nota(7.49), 'Notable')

    def test_limite_bien_minimo(self):
        """Límite inferior de bien — exactamente 5."""
        self.assertEqual(clasificar_nota(5.0), 'Bien')

    def test_limite_suficiente_minimo(self):
        """Límite inferior de suficiente — exactamente 4.5."""
        self.assertEqual(clasificar_nota(4.5), 'Suficiente')

    def test_limite_suspenso_maximo(self):
        """Máximo de suspenso — justo por debajo de 4.5."""
        self.assertEqual(clasificar_nota(4.49), 'Suspenso')

    def test_limite_suspenso_minimo(self):
        """Mínimo absoluto — exactamente 0."""
        self.assertEqual(clasificar_nota(0.0), 'Suspenso')

    # ── Clases no válidas ────────────────────────────────────────────────

    def test_ce7_nota_negativa(self):
        """CE7 — nota por debajo de 0."""
        with self.assertRaises(ValueError):
            clasificar_nota(-1)

    def test_ce8_nota_superior_diez(self):
        """CE8 — nota por encima de 10."""
        with self.assertRaises(ValueError):
            clasificar_nota(11)

    def test_ce9_nota_no_numerica_string(self):
        """CE9 — nota como cadena de texto."""
        with self.assertRaises(TypeError):
            clasificar_nota("ocho")

    def test_ce9_nota_no_numerica_none(self):
        """CE9 — nota como None."""
        with self.assertRaises(TypeError):
            clasificar_nota(None)


if __name__ == "__main__":
    unittest.main(verbosity=2)
