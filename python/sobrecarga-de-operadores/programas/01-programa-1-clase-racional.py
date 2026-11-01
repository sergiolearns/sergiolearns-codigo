# Programa 1 · La clase Racional
# Del artículo «Sobrecarga de operadores en Python práctica — fracciones que se simplifican solas, dinero sin errores de céntimos y la estantería de la biblioteca (y el bote de la cena que no cuadraba por un céntimo)»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-practica/

from functools import total_ordering
from math import gcd


@total_ordering
class Racional:
    def __init__(self, num, den=1):
        if den == 0:
            raise ZeroDivisionError(f'denominador 0 en {num}/{den}')
        if den < 0:                              # el signo, siempre arriba
            num, den = -num, -den
        m = gcd(num, den)                        # simplificar al crear: 6/8 -> 3/4
        self.__num = num // m
        self.__den = den // m

    @property
    def num(self):
        return self.__num

    @property
    def den(self):
        return self.__den

    @staticmethod
    def _como_racional(x):                       # int -> Racional; lo demás, None
        if isinstance(x, Racional):
            return x
        if isinstance(x, int):
            return Racional(x)
        return None

    def __str__(self):
        return str(self.__num) if self.__den == 1 else f'{self.__num}/{self.__den}'

    def __repr__(self):
        return f'Racional({self.__num}, {self.__den})'

    # --- comparación
    def __eq__(self, otro):
        o = Racional._como_racional(otro)
        if o is None:
            return NotImplemented
        return self.__num == o.num and self.__den == o.den   # ya están simplificados

    def __lt__(self, otro):
        o = Racional._como_racional(otro)
        if o is None:
            return NotImplemented
        return self.__num * o.den < o.num * self.__den    # a/b < c/d  <=>  a·d < c·b

    def __hash__(self):                          # iguales (3/4 y 6/8) -> mismo hash
        return hash((self.__num, self.__den))

    # --- aritmética
    def __add__(self, otro):
        o = Racional._como_racional(otro)
        if o is None:
            return NotImplemented
        return Racional(self.__num * o.den + o.num * self.__den, self.__den * o.den)

    def __sub__(self, otro):
        o = Racional._como_racional(otro)
        if o is None:
            return NotImplemented
        return Racional(self.__num * o.den - o.num * self.__den, self.__den * o.den)

    def __mul__(self, otro):
        o = Racional._como_racional(otro)
        if o is None:
            return NotImplemented
        return Racional(self.__num * o.num, self.__den * o.den)

    def __truediv__(self, otro):
        o = Racional._como_racional(otro)
        if o is None:
            return NotImplemented
        return Racional(self.__num * o.den, self.__den * o.num)   # 0 arriba -> error

    # --- reflejados: el número está a la IZQUIERDA
    def __radd__(self, otro):                    # suma y producto son conmutativos
        return self + otro

    def __rmul__(self, otro):
        return self * otro

    def __rsub__(self, otro):                    # otro - self: NO es self - otro
        o = Racional._como_racional(otro)
        return NotImplemented if o is None else o - self

    def __rtruediv__(self, otro):                # otro / self
        o = Racional._como_racional(otro)
        return NotImplemented if o is None else o / self

    # --- unarios y conversiones
    def __neg__(self):
        return Racional(-self.__num, self.__den)

    def __abs__(self):
        return Racional(abs(self.__num), self.__den)

    def __float__(self):
        return self.__num / self.__den


r1, r2, r3 = Racional(3, 4), Racional(1, 2), Racional(6, -8)
print('r1 =', r1, ' r2 =', r2, ' r3 =', r3, ' ', repr(r3))
print('r1 + r2 =', r1 + r2, ' r1 - r2 =', r1 - r2, ' r1 * r2 =', r1 * r2, ' r1 / r2 =', r1 / r2)
print('r1 + 1 =', r1 + 1, ' 1 + r1 =', 1 + r1, ' 2 * r1 =', 2 * r1)
print('1 - r1 =', 1 - r1, ' r1 - 1 =', r1 - 1, ' 3 / r1 =', 3 / r1)
print('-r1 =', -r1, ' abs(r3) =', abs(r3), ' float(r1) =', float(r1))
print('r1 == Racional(6, 8):', r1 == Racional(6, 8), ' r2 == 0.5:', r2 == 0.5)
print('r2 < r1:', r2 < r1, ' r1 >= r2:', r1 >= r2, ' r3 < 0:', r3 < 0)
receta = [Racional(1, 2), Racional(1, 3), Racional(1, 6)]
print('sum(receta) =', sum(receta), ' sorted:', sorted(receta))
print('conjunto:', {Racional(1, 2), Racional(2, 4), Racional(3, 6)})
for orden in ['Racional(1, 0)', 'r1 / Racional(0, 5)', 'r1 + 0.5']:
    try:
        eval(orden)
    except (ZeroDivisionError, TypeError) as err:
        print(f'{orden:<20} -> {type(err).__name__}: {err}')
