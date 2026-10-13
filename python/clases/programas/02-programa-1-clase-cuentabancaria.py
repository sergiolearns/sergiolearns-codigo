# Clases en Python práctica — Programa 1: Clase CuentaBancaria
# Del artículo «Clases en Python — 3 programas reales con encapsulamiento y @property»
# https://sergiolearns.com/clases-en-python-practica/

class CuentaBancaria:
    _total_cuentas = 0

    def __init__(self, titular, saldo_inicial=0):
        if not titular or not isinstance(titular, str):
            raise ValueError('El titular debe ser una cadena no vacía')
        self.__titular = titular
        self.__saldo = 0
        self.__movimientos = []
        self.saldo = saldo_inicial    # usa el setter
        CuentaBancaria._total_cuentas += 1

    @property
    def titular(self):
        return self.__titular

    @property
    def saldo(self):
        return self.__saldo

    @saldo.setter
    def saldo(self, valor):
        if not isinstance(valor, (int, float)):
            raise TypeError('El saldo debe ser numérico')
        if valor < 0:
            raise ValueError('El saldo inicial no puede ser negativo')
        self.__saldo = valor

    @property
    def movimientos(self):
        return list(self.__movimientos)    # copia — no el original

    def depositar(self, cantidad):
        if cantidad <= 0:
            raise ValueError('La cantidad a depositar debe ser positiva')
        self.__saldo += cantidad
        self.__movimientos.append(f'+{cantidad:.2f}€')

    def retirar(self, cantidad):
        if cantidad <= 0:
            raise ValueError('La cantidad a retirar debe ser positiva')
        if cantidad > self.__saldo:
            raise ValueError(f'Saldo insuficiente: tienes {self.__saldo:.2f}€')
        self.__saldo -= cantidad
        self.__movimientos.append(f'-{cantidad:.2f}€')

    @classmethod
    def total_cuentas(cls):
        return cls._total_cuentas

    def __str__(self):
        return f'Cuenta de {self.__titular}: {self.__saldo:.2f}€'

    def __repr__(self):
        return f'CuentaBancaria("{self.__titular}", {self.__saldo})'

# Uso
c1 = CuentaBancaria('Sergio', 1000)
c2 = CuentaBancaria('María', 500)

c1.depositar(250)
c1.retirar(100)

print(c1)                              # → Cuenta de Sergio: 1150.00€
print(c1.movimientos)                  # → ['+250.00€', '-100.00€']
print(CuentaBancaria.total_cuentas())  # → 2

try:
    c1.retirar(5000)
except ValueError as err:
    print(err)    # → Saldo insuficiente: tienes 1150.00€

try:
    c1.saldo = -100    # intento de manipulación directa
except ValueError as err:
    print(err)    # → El saldo inicial no puede ser negativo
