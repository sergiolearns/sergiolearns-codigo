# Bloque 2: pruebas de caja blanca de descuento_cliente
# Del artículo «Pruebas en Python con unittest — práctica con las notas de FP2, el descuento de la tienda y un TDD de la piscina (y el panel que marcaba 82 grados)»
# https://sergiolearns.com/pruebas-en-python-practica/

import unittest


def descuento_cliente(compra, puntos, es_premium):
    """Porcentaje de descuento en la tienda del polideportivo (0, 5, 10 o 15)."""
    descuento = 0                     # nodo 1
    if compra >= 50:                  # nodo 2 (predicado)
        descuento = 5                 # nodo 3
        if puntos >= 100:             # nodo 4 (predicado)
            descuento = 10            # nodo 5
    if es_premium:                    # nodo 6 (predicado)
        descuento += 5                # nodo 7
    return descuento                  # nodo 8


class TestDescuentoCliente(unittest.TestCase):
    # Caja blanca: un test por camino básico, V(G) = 3 + 1 = 4
    def test_camino1_compra_pequena(self):
        self.assertEqual(descuento_cliente(30, 50, False), 0)

    def test_camino2_solo_premium(self):
        self.assertEqual(descuento_cliente(30, 50, True), 5)

    def test_camino3_compra_sin_puntos(self):
        self.assertEqual(descuento_cliente(60, 50, False), 5)

    def test_camino4_todo(self):
        self.assertEqual(descuento_cliente(60, 150, True), 15)

    # Caja negra encima: las fronteras de cada if
    def test_valor_limite_compra_50(self):
        self.assertEqual(descuento_cliente(49.99, 0, False), 0)
        self.assertEqual(descuento_cliente(50, 0, False), 5)

    def test_valor_limite_puntos_100(self):
        self.assertEqual(descuento_cliente(50, 99, False), 5)
        self.assertEqual(descuento_cliente(50, 100, False), 10)


unittest.main(verbosity=2)
