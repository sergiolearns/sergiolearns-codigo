# Clases en Python práctica — Programa 1: Clase CuentaBancaria
# Del artículo «Clases en Python — 3 programas reales con encapsulamiento y @property»
# https://sergiolearns.com/clases-en-python-practica/

class CuentaBancaria:
    def __init__(self, titular, saldo_inicial=0):
        self.titular = titular
        self.saldo = saldo_inicial

    def depositar(self, cantidad):
        self.saldo += cantidad

    def retirar(self, cantidad):
        self.saldo -= cantidad    # permite saldo negativo — problema

    def __str__(self):
        return f'Cuenta de {self.titular}: {self.saldo:.2f}€'

cuenta = CuentaBancaria('Sergio', 1000)
cuenta.saldo = -999999    # cualquiera puede manipular el saldo directamente
cuenta.retirar(5000)      # permite quedarse en negativo
print(cuenta)
