# Ejercicio 1 — Diseñar pruebas de caja negra para validar un ingreso
# Del artículo «Pruebas en Python — ejercicios para dominar unittest, caja negra y TDD»
# https://sergiolearns.com/pruebas-en-python-ejercicios/

# MAL — solo prueba el caso normal
def test_ingreso(self):
    self.assertTrue(validar_ingreso(100, 500))

# BIEN — prueba todos los casos que pueden fallar
def test_cantidad_cero_devuelve_false(self):
    self.assertFalse(validar_ingreso(0, 500))

def test_cantidad_negativa_lanza_error(self):
    with self.assertRaises(ValueError):
        validar_ingreso(-50, 500)

def test_saldo_supera_limite(self):
    with self.assertRaises(ValueError):
        validar_ingreso(1, 100000)    # 100000 + 1 > 100000
