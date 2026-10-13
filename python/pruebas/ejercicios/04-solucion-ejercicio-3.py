# Solución Ejercicio 3:
# Del artículo «Pruebas en Python — ejercicios para dominar unittest, caja negra y TDD»
# https://sergiolearns.com/pruebas-en-python-ejercicios/

# test_cuenta_bancaria.py
import unittest
from cuenta_bancaria import CuentaBancaria

class TestCuentaBancaria(unittest.TestCase):

    def setUp(self):
        """Cuentas reutilizables para varios tests."""
        self.cuenta = CuentaBancaria("Sergio", 1000)
        self.cuenta2 = CuentaBancaria("María", 500)

    # ── Constructor ──────────────────────────────────────────────────────

    def test_constructor_titular_y_saldo(self):
        self.assertEqual(self.cuenta.titular, "Sergio")
        self.assertEqual(self.cuenta.saldo, 1000)

    def test_constructor_saldo_por_defecto(self):
        cuenta = CuentaBancaria("Ana")
        self.assertEqual(cuenta.saldo, 0)

    # ── Validación titular ───────────────────────────────────────────────

    def test_titular_minimo_dos_caracteres(self):
        with self.assertRaises(ValueError):
            CuentaBancaria("A", 0)

    def test_titular_exactamente_dos_caracteres(self):
        cuenta = CuentaBancaria("Jo", 0)
        self.assertEqual(cuenta.titular, "Jo")

    # ── Validación saldo inicial ─────────────────────────────────────────

    def test_saldo_inicial_negativo(self):
        with self.assertRaises(ValueError):
            CuentaBancaria("Sergio", -100)

    # ── Ingresar ─────────────────────────────────────────────────────────

    def test_ingresar_cantidad_valida(self):
        self.cuenta.ingresar(500)
        self.assertEqual(self.cuenta.saldo, 1500)

    def test_ingresar_actualiza_saldo(self):
        saldo_antes = self.cuenta.saldo
        self.cuenta.ingresar(200)
        self.assertEqual(self.cuenta.saldo, saldo_antes + 200)

    def test_ingresar_cantidad_cero(self):
        with self.assertRaises(ValueError):
            self.cuenta.ingresar(0)

    def test_ingresar_cantidad_negativa(self):
        with self.assertRaises(ValueError):
            self.cuenta.ingresar(-100)

    def test_ingresar_supera_limite(self):
        with self.assertRaises(ValueError):
            self.cuenta.ingresar(99_001)    # 1000 + 99001 > 100000

    def test_ingresar_exactamente_limite(self):
        cuenta = CuentaBancaria("Test", 0)
        cuenta.ingresar(100_000)
        self.assertEqual(cuenta.saldo, 100_000)

    # ── Retirar ──────────────────────────────────────────────────────────

    def test_retirar_cantidad_valida(self):
        self.cuenta.retirar(300)
        self.assertEqual(self.cuenta.saldo, 700)

    def test_retirar_actualiza_saldo(self):
        saldo_antes = self.cuenta.saldo
        self.cuenta.retirar(200)
        self.assertEqual(self.cuenta.saldo, saldo_antes - 200)

    def test_retirar_cantidad_cero(self):
        with self.assertRaises(ValueError):
            self.cuenta.retirar(0)

    def test_retirar_cantidad_negativa(self):
        with self.assertRaises(ValueError):
            self.cuenta.retirar(-50)

    def test_retirar_saldo_insuficiente(self):
        with self.assertRaises(ValueError):
            self.cuenta.retirar(5000)

    # ── Representación ───────────────────────────────────────────────────

    def test_str(self):
        self.assertEqual(str(self.cuenta), "Cuenta de Sergio: 1000.0€")

    def test_repr(self):
        self.assertEqual(repr(self.cuenta), "CuentaBancaria('Sergio', 1000.0)")

    # ── Transferir ───────────────────────────────────────────────────────

    def test_transferir_caso_normal(self):
        self.cuenta.transferir(300, self.cuenta2)
        self.assertEqual(self.cuenta.saldo, 700)

    def test_transferir_actualiza_ambos_saldos(self):
        self.cuenta.transferir(300, self.cuenta2)
        self.assertEqual(self.cuenta2.saldo, 800)    # 500 + 300

    def test_transferir_saldo_insuficiente(self):
        with self.assertRaises(ValueError):
            self.cuenta.transferir(5000, self.cuenta2)

    def test_transferir_cantidad_invalida(self):
        with self.assertRaises(ValueError):
            self.cuenta.transferir(0, self.cuenta2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
