# Solución del ejercicio 3: CuentaBancaria con TDD
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
    def setUp(self):                                     # cuentas nuevas en cada test
        self.cuenta = CuentaBancaria('Sergio', 1000)
        self.otra = CuentaBancaria('María', 500)

    # Iteraciones 1-3: constructor y validaciones
    def test_i1_constructor(self):
        self.assertEqual((self.cuenta.titular, self.cuenta.saldo), ('Sergio', 1000))

    def test_i1_saldo_por_defecto(self):
        self.assertEqual(CuentaBancaria('Ana').saldo, 0)

    def test_i2_titular_de_dos_letras_vale(self):
        self.assertEqual(CuentaBancaria('Al').titular, 'Al')

    def test_i2_titular_de_una_letra(self):
        with self.assertRaises(ValueError):
            CuentaBancaria('A')

    def test_i3_saldo_inicial_negativo(self):
        with self.assertRaises(ValueError):
            CuentaBancaria('Ana', -1)

    # Iteraciones 4-5: ingresar
    def test_i4_ingresar(self):
        self.cuenta.ingresar(250)
        self.assertEqual(self.cuenta.saldo, 1250)

    def test_i5_ingresar_cero(self):
        with self.assertRaises(ValueError):
            self.cuenta.ingresar(0)

    def test_i5_ingresar_hasta_el_limite(self):
        self.cuenta.ingresar(99_000)
        self.assertEqual(self.cuenta.saldo, 100_000)

    def test_i5_ingresar_pasado_el_limite(self):
        with self.assertRaises(ValueError):
            self.cuenta.ingresar(99_001)

    # Iteraciones 6-7: retirar
    def test_i6_retirar(self):
        self.cuenta.retirar(400)
        self.assertEqual(self.cuenta.saldo, 600)

    def test_i7_retirar_todo(self):
        self.cuenta.retirar(1000)
        self.assertEqual(self.cuenta.saldo, 0)

    def test_i7_retirar_de_mas(self):
        with self.assertRaises(ValueError):
            self.cuenta.retirar(1001)

    def test_i7_retirar_negativo(self):
        with self.assertRaises(ValueError):
            self.cuenta.retirar(-5)

    # Iteración 8: texto
    def test_i8_repr(self):
        self.assertEqual(repr(self.otra), "CuentaBancaria('María', 500)")

    def test_i8_str(self):
        self.assertEqual(str(self.otra), 'Cuenta de María: 500€')

    # Iteración 9: transferir
    def test_i9_transferir(self):
        self.cuenta.transferir(300, self.otra)
        self.assertEqual((self.cuenta.saldo, self.otra.saldo), (700, 800))

    def test_i9_transferir_sin_saldo_no_toca_nada(self):
        with self.assertRaises(ValueError):
            self.otra.transferir(600, self.cuenta)
        self.assertEqual((self.cuenta.saldo, self.otra.saldo), (1000, 500))


unittest.main(verbosity=2)
