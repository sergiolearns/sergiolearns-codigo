# Solución del ejercicio 1 · Clase número complejo
# Del artículo «Sobrecarga de operadores en Python ejercicios — números complejos, polinomios que se suman, se multiplican y se derivan, con soluciones, test y chuletario (y la estantería que se convirtió en None)»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-ejercicios/

class Complejo:
    def __init__(self, real, imag=0):
        self.__real = real
        self.__imag = imag

    @property
    def real(self):
        return self.__real

    @property
    def imag(self):
        return self.__imag

    @staticmethod
    def _como_complejo(x):                     # un número real es un complejo con imag 0
        if isinstance(x, Complejo):
            return x
        if isinstance(x, (int, float)):
            return Complejo(x)
        return None

    def __str__(self):
        signo = '+' if self.__imag >= 0 else '-'
        return f'{self.__real}{signo}{abs(self.__imag)}i'

    def __repr__(self):
        return f'Complejo({self.__real}, {self.__imag})'

    def __eq__(self, otro):                    # igualdad sí; orden (<, >) no tiene sentido
        o = Complejo._como_complejo(otro)
        if o is None:
            return NotImplemented
        return self.__real == o.real and self.__imag == o.imag

    def __hash__(self):
        return hash((self.__real, self.__imag))

    def __add__(self, otro):
        o = Complejo._como_complejo(otro)
        if o is None:
            return NotImplemented
        return Complejo(self.__real + o.real, self.__imag + o.imag)

    def __sub__(self, otro):
        o = Complejo._como_complejo(otro)
        if o is None:
            return NotImplemented
        return Complejo(self.__real - o.real, self.__imag - o.imag)

    def __mul__(self, otro):                   # (a+bi)(c+di) = (ac-bd) + (ad+bc)i
        o = Complejo._como_complejo(otro)
        if o is None:
            return NotImplemented
        a, b, c, d = self.__real, self.__imag, o.real, o.imag
        return Complejo(a * c - b * d, a * d + b * c)

    def __radd__(self, otro):
        return self + otro

    def __rmul__(self, otro):
        return self * otro

    def __rsub__(self, otro):                  # otro - self
        o = Complejo._como_complejo(otro)
        return NotImplemented if o is None else o - self

    def __neg__(self):
        return Complejo(-self.__real, -self.__imag)

    def __abs__(self):                         # módulo: raíz de a² + b²
        return (self.__real ** 2 + self.__imag ** 2) ** 0.5

    def conjugado(self):
        return Complejo(self.__real, -self.__imag)


c1, c2 = Complejo(3, 4), Complejo(1, -2)
print('c1 =', c1, ' c2 =', c2, ' repr:', repr(c1))
print('c1 + c2 =', c1 + c2, ' c1 - c2 =', c1 - c2, ' c1 * c2 =', c1 * c2)
print('c1 + 2 =', c1 + 2, ' 2 + c1 =', 2 + c1, ' 3 * c2 =', 3 * c2)
print('c1 - 3 =', c1 - 3, ' 3 - c1 =', 3 - c1)
print('-c1 =', -c1, ' abs(c1) =', abs(c1), ' conjugado:', c1.conjugado())
print('c1 * conjugado =', c1 * c1.conjugado())
print('c1 == Complejo(3, 4):', c1 == Complejo(3, 4), ' Complejo(5) == 5:', Complejo(5) == 5)
print('Comprobación con complex:', complex(3, 4) * complex(1, -2), 3 - complex(3, 4))
try:
    print(c1 < c2)
except TypeError as err:
    print('TypeError:', err)
