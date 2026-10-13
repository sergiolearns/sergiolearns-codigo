# Solución Ejercicio 3:
# Del artículo «Pruebas en Python — ejercicios para dominar unittest, caja negra y TDD»
# https://sergiolearns.com/pruebas-en-python-ejercicios/

# cuenta_bancaria.py
class CuentaBancaria:
    LIMITE = 100_000.0

    def __init__(self, titular, saldo_inicial=0):
        if not isinstance(titular, str) or len(titular) < 2:
            raise ValueError("El titular debe tener al menos 2 caracteres.")
        if saldo_inicial < 0:
            raise ValueError("El saldo inicial no puede ser negativo.")
        self.__titular = titular
        self.__saldo = float(saldo_inicial)

    @property
    def titular(self):
        return self.__titular

    @property
    def saldo(self):
        return self.__saldo

    def ingresar(self, cantidad):
        if cantidad <= 0:
            raise ValueError("La cantidad a ingresar debe ser positiva.")
        if self.__saldo + cantidad > self.LIMITE:
            raise ValueError(f"El saldo superaría el límite de {self.LIMITE}€.")
        self.__saldo += cantidad

    def retirar(self, cantidad):
        if cantidad <= 0:
            raise ValueError("La cantidad a retirar debe ser positiva.")
        if cantidad > self.__saldo:
            raise ValueError("Saldo insuficiente.")
        self.__saldo -= cantidad

    def transferir(self, cantidad, cuenta_destino):
        if cantidad <= 0:
            raise ValueError("La cantidad a transferir debe ser positiva.")
        if cantidad > self.__saldo:
            raise ValueError("Saldo insuficiente para la transferencia.")
        if cuenta_destino.saldo + cantidad > self.LIMITE:
            raise ValueError("La transferencia superaría el límite de la cuenta destino.")
        self.__saldo -= cantidad
        cuenta_destino.__saldo += cantidad    # acceso al atributo privado de la misma clase

    def __str__(self):
        return f"Cuenta de {self.__titular}: {self.__saldo}€"

    def __repr__(self):
        return f"CuentaBancaria('{self.__titular}', {self.__saldo})"
