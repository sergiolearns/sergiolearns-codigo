# Solución Ejercicio 1:
# Del artículo «Sobrecarga de operadores en Python — ejercicios para dominar los métodos mágicos»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-ejercicios/

import math
from functools import total_ordering

class Complejo:
    def __init__(self, real, imaginario=0):
        if not isinstance(real, (int, float)):
            raise TypeError('La parte real debe ser numérica')
        if not isinstance(imaginario, (int, float)):
            raise TypeError('La parte imaginaria debe ser numérica')
        self.__real = float(real)
        self.__imaginario = float(imaginario)

    @property
    def real(self):
        return self.__real

    @property
    def imaginario(self):
        return self.__imaginario

    def conjugado(self):
        return Complejo(self.__real, -self.__imaginario)

    def modulo(self):
        return math.sqrt(self.__real**2 + self.__imaginario**2)

    # Comparación — solo igualdad, sin orden
    def __eq__(self, other):
        if isinstance(other, Complejo):
            return (abs(self.__real - other.real) < 1e-9 and
                    abs(self.__imaginario - other.imaginario) < 1e-9)
        elif isinstance(other, (int, float)):
            return self.__real == other and self.__imaginario == 0
        return False

    # Aritmética
    def __add__(self, other):
        if isinstance(other, Complejo):
            return Complejo(self.__real + other.real,
                          self.__imaginario + other.imaginario)
        elif isinstance(other, (int, float)):
            return Complejo(self.__real + other, self.__imaginario)
        return NotImplemented

    def __radd__(self, other):
        return self.__add__(other)    # suma ES conmutativa

    def __sub__(self, other):
        if isinstance(other, Complejo):
            return Complejo(self.__real - other.real,
                          self.__imaginario - other.imaginario)
        elif isinstance(other, (int, float)):
            return Complejo(self.__real - other, self.__imaginario)
        return NotImplemented

    def __rsub__(self, other):
        # other - self ≠ self - other
        if isinstance(other, (int, float)):
            return Complejo(other - self.__real, -self.__imaginario)
        return NotImplemented

    def __mul__(self, other):
        if isinstance(other, Complejo):
            # (a+bi)(c+di) = (ac-bd) + (ad+bc)i
            real = self.__real * other.real - self.__imaginario * other.imaginario
            imag = self.__real * other.imaginario + self.__imaginario * other.real
            return Complejo(real, imag)
        elif isinstance(other, (int, float)):
            return Complejo(self.__real * other, self.__imaginario * other)
        return NotImplemented

    def __rmul__(self, other):
        return self.__mul__(other)    # multiplicación ES conmutativa

    def __neg__(self):
        return Complejo(-self.__real, -self.__imaginario)

    def __abs__(self):
        return self.modulo()

    def __str__(self):
        if self.__imaginario == 0:
            return str(self.__real)
        signo = '+' if self.__imaginario >= 0 else ''
        real_str = f'{self.__real:.6g}'
        imag_str = f'{self.__imaginario:.6g}'
        return f'{real_str}{signo}{imag_str}i'

    def __repr__(self):
        return f'Complejo({self.__real}, {self.__imaginario})'

# Uso
c1 = Complejo(3, 4)
c2 = Complejo(1, -2)

print(f'c1 = {c1}')
print(f'c2 = {c2}')
print(f'repr: {repr(c1)}\n')

print('--- Aritmética ---')
print(f'c1 + c2 = {c1 + c2}')
print(f'c1 - c2 = {c1 - c2}')
print(f'c1 * c2 = {c1 * c2}')
print(f'c1 + 2 = {c1 + 2}')
print(f'2 + c1 = {2 + c1}')
print(f'3 - c1 = {3 - c1}')
print(f'2 * c1 = {2 * c1}\n')

print('--- Unarios y módulo ---')
print(f'-c1 = {-c1}')
print(f'abs(c1) = {abs(c1)}')
print(f'c1.conjugado() = {c1.conjugado()}\n')

print('--- Comparación ---')
print(f'c1 == Complejo(3, 4): {c1 == Complejo(3, 4)}')
print(f'c1 == c2: {c1 == c2}')
