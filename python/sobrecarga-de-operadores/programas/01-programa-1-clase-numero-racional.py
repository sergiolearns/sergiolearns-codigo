# Sobrecarga de operadores en Python práctica — Programa 1: Clase Número Racional
# Del artículo «Sobrecarga de operadores en Python — 2 clases reales con todos los operadores»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-practica/

from functools import total_ordering
from math import gcd

@total_ordering
class Racional:
    def __init__(self, numerador, denominador=1):
        if not isinstance(numerador, int):
            raise TypeError('El numerador debe ser un entero')
        if not isinstance(denominador, int):
            raise TypeError('El denominador debe ser un entero')
        if denominador == 0:
            raise ZeroDivisionError('El denominador no puede ser cero')
        # Normalizar signo — el signo siempre en el numerador
        if denominador < 0:
            numerador = -numerador
            denominador = -denominador
        # Simplificar usando el máximo común divisor
        comun = gcd(abs(numerador), denominador)
        self.__num = numerador // comun
        self.__den = denominador // comun

    @property
    def numerador(self):
        return self.__num

    @property
    def denominador(self):
        return self.__den

    # Métodos de clase alternativos para crear racionales
    @classmethod
    def desde_float(cls, valor, precision=6):
        """Crea un racional aproximado desde un float"""
        denominador = 10 ** precision
        numerador = round(valor * denominador)
        return cls(numerador, denominador)

    # Comparación
    def __eq__(self, other):
        if isinstance(other, Racional):
            return self.__num == other.numerador and self.__den == other.denominador
        elif isinstance(other, int):
            return self.__num == other and self.__den == 1
        return False

    def __lt__(self, other):
        if isinstance(other, Racional):
            return self.__num * other.denominador < other.numerador * self.__den
        elif isinstance(other, int):
            return self.__num < other * self.__den
        return NotImplemented

    # Aritmética
    def __add__(self, other):
        if isinstance(other, Racional):
            nuevo_num = self.__num * other.denominador + other.numerador * self.__den
            nuevo_den = self.__den * other.denominador
            return Racional(nuevo_num, nuevo_den)
        elif isinstance(other, int):
            return self + Racional(other)
        return NotImplemented

    def __radd__(self, other):
        return self.__add__(other)

    def __sub__(self, other):
        if isinstance(other, Racional):
            nuevo_num = self.__num * other.denominador - other.numerador * self.__den
            nuevo_den = self.__den * other.denominador
            return Racional(nuevo_num, nuevo_den)
        elif isinstance(other, int):
            return self - Racional(other)
        return NotImplemented

    def __rsub__(self, other):
        if isinstance(other, int):
            return Racional(other) - self
        return NotImplemented

    def __mul__(self, other):
        if isinstance(other, Racional):
            return Racional(self.__num * other.numerador,
                          self.__den * other.denominador)
        elif isinstance(other, int):
            return Racional(self.__num * other, self.__den)
        return NotImplemented

    def __rmul__(self, other):
        return self.__mul__(other)

    def __truediv__(self, other):
        if isinstance(other, Racional):
            if other.numerador == 0:
                raise ZeroDivisionError('No se puede dividir por cero')
            return Racional(self.__num * other.denominador,
                          self.__den * other.numerador)
        elif isinstance(other, int):
            if other == 0:
                raise ZeroDivisionError('No se puede dividir por cero')
            return Racional(self.__num, self.__den * other)
        return NotImplemented

    def __rtruediv__(self, other):
        if isinstance(other, int):
            return Racional(other) / self
        return NotImplemented

    # Unarios
    def __neg__(self):
        return Racional(-self.__num, self.__den)

    def __pos__(self):
        return Racional(self.__num, self.__den)

    def __abs__(self):
        return Racional(abs(self.__num), self.__den)

    # Conversión
    def __float__(self):
        return self.__num / self.__den

    def __int__(self):
        return self.__num // self.__den

    def __round__(self, n=0):
        return round(float(self), n)

    # Representación
    def __str__(self):
        if self.__den == 1:
            return str(self.__num)
        return f'{self.__num}/{self.__den}'

    def __repr__(self):
        return f'Racional({self.__num}, {self.__den})'

# Uso completo
r1 = Racional(3, 4)
r2 = Racional(1, 2)
r3 = Racional(6, 8)    # se simplifica a 3/4

print(f'r1 = {r1}')           # → 3/4
print(f'r2 = {r2}')           # → 1/2
print(f'r3 = {r3}')           # → 3/4 (simplificado)

print(f'\n--- Aritmética ---')
print(f'r1 + r2 = {r1 + r2}')    # → 5/4
print(f'r1 - r2 = {r1 - r2}')    # → 1/4
print(f'r1 * r2 = {r1 * r2}')    # → 3/8
print(f'r1 / r2 = {r1 / r2}')    # → 3/2
print(f'r1 + 1 = {r1 + 1}')      # → 7/4
print(f'2 * r1 = {2 * r1}')      # → 3/2 (reflejado)
print(f'1 - r1 = {1 - r1}')      # → 1/4 (__rsub__)

print(f'\n--- Comparación ---')
print(f'r1 == r3: {r1 == r3}')    # → True (3/4 == 3/4)
print(f'r1 > r2: {r1 > r2}')      # → True
print(f'r2 < r1: {r2 < r1}')      # → True

print(f'\n--- Unarios ---')
print(f'-r1 = {-r1}')             # → -3/4
print(f'abs(-r1) = {abs(-r1)}')   # → 3/4

print(f'\n--- Conversión ---')
print(f'float(r1) = {float(r1)}') # → 0.75
print(f'int(r1) = {int(r1)}')     # → 0
print(f'round(r1, 2) = {round(r1, 2)}')  # → 0.75

print(f'\n--- Desde float ---')
r4 = Racional.desde_float(0.75)
print(f'0.75 = {r4}')    # → 3/4

print(f'\n--- Ordenación ---')
racionales = [Racional(3,4), Racional(1,2), Racional(1,3), Racional(2,3)]
print(sorted(racionales))    # → [1/3, 1/2, 2/3, 3/4]
