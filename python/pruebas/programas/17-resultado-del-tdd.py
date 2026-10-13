# Clase completa — resultado del TDD
# Del artículo «Pruebas en Python — caja negra, caja blanca y TDD con programas reales»
# https://sergiolearns.com/pruebas-en-python-practica/

# temperatura.py
class Temperatura:
    ESCALAS_VALIDAS = {'C', 'F', 'K'}
    CERO_ABSOLUTO_C = -273.15

    def __init__(self, valor, escala):
        if escala not in self.ESCALAS_VALIDAS:
            raise ValueError(f"Escala '{escala}' no válida. Usa C, F o K.")
        if self.__a_celsius(valor, escala) < self.CERO_ABSOLUTO_C:
            raise ValueError("Temperatura por debajo del cero absoluto.")
        self.valor = valor
        self.escala = escala

    @staticmethod
    def __a_celsius(valor, escala):
        if escala == 'C': return valor
        if escala == 'F': return (valor - 32) * 5 / 9
        if escala == 'K': return valor - 273.15

    def a_celsius(self):
        return Temperatura(self.__a_celsius(self.valor, self.escala), 'C')

    def a_fahrenheit(self):
        return Temperatura(self.a_celsius().valor * 9 / 5 + 32, 'F')

    def a_kelvin(self):
        return Temperatura(self.a_celsius().valor + 273.15, 'K')

    def __eq__(self, otra):
        if not isinstance(otra, Temperatura): return NotImplemented
        return abs(self.a_celsius().valor - otra.a_celsius().valor) < 1e-9

    def __str__(self):
        return f'{self.valor}°{self.escala}'

    def __repr__(self):
        return f"Temperatura({self.valor}, '{self.escala}')"
