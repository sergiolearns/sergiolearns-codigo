# Solución del ejercicio 2: las pruebas de CuentaBancaria corregidas
# Del artículo «Pruebas en Python con unittest — ejercicios con caja negra, pruebas mal diseñadas y TDD de una cuenta bancaria (y el test que siempre pasaba)»
# https://sergiolearns.com/pruebas-en-python-ejercicios/

import unittest


class CuentaBancaria:
    LIMITE = 100_000

    def __init__(self, titular, saldo_inicial=0):
        if not isinstance(titular, str) or len(titular) < 2:
            raise ValueError('el titular necesita al menos 2 caracteres')
        if saldo_inicial < 0:
            raise ValueError('el saldo inicial no puede ser negativo')
        self.__titular = titular
        self.__saldo = saldo_inicial

    @property
    def titular(self):
        return self.__titular

    @property
    def saldo(self):
        return self.__saldo

    def ingresar(self, cantidad):
        if cantidad <= 0:
            raise ValueError('la cantidad debe ser positiva')
        if self.__saldo + cantidad > self.LIMITE:
            raise ValueError('se superaría el límite de la cuenta')
        self.__saldo += cantidad

    def retirar(self, cantidad):
        if cantidad <= 0:
            raise ValueError('la cantidad debe ser positiva')
        if cantidad > self.__saldo:
            raise ValueError('saldo insuficiente')
        self.__saldo -= cantidad

    def transferir(self, cantidad, destino):
        self.retirar(cantidad)        # si no hay saldo, falla aquí y no se toca el destino
        destino.ingresar(cantidad)

    def __str__(self):
        return f'Cuenta de {self.__titular}: {self.__saldo}€'

    def __repr__(self):
        return f'CuentaBancaria({self.__titular!r}, {self.__saldo})'


class TestCuentaBancaria(unittest.TestCase):
    def test_a_crear_cuenta(self):                       # A: con el prefijo test_
        cuenta = CuentaBancaria('Sergio', 1000)
        self.assertEqual(cuenta.saldo, 1000)

    def test_b_ingresar_suma_al_saldo(self):             # B: una operación, un resultado
        cuenta = CuentaBancaria('Sergio', 500)
        cuenta.ingresar(200)
        self.assertEqual(cuenta.saldo, 700)

    def test_c_retirar_resta_del_saldo(self):            # C: 500 - 200 = 300
        cuenta = CuentaBancaria('Sergio', 500)
        cuenta.retirar(200)
        self.assertEqual(cuenta.saldo, 300)

    def test_d_titular_corto_lanza_error(self):          # D: la excepción se espera, no se sufre
        with self.assertRaises(ValueError):
            CuentaBancaria('A', 0)

    def test_e_retirar_sin_saldo_lanza_error(self):      # E: y el saldo no cambia
        cuenta = CuentaBancaria('Sergio', 100)
        with self.assertRaises(ValueError):
            cuenta.retirar(200)
        self.assertEqual(cuenta.saldo, 100)

    def test_f_saldos_iguales(self):                     # F: el assert que dice lo que comprueba
        self.assertEqual(CuentaBancaria('Sergio', 500).saldo, CuentaBancaria('María', 500).saldo)


unittest.main(verbosity=2)
