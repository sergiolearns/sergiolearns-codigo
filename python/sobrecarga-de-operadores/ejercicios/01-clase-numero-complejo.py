# Ejercicio 1 — Clase Número Complejo
# Del artículo «Sobrecarga de operadores en Python — ejercicios para dominar los métodos mágicos»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-ejercicios/

# MAL — tratas la resta como si fuera conmutativa
def __rsub__(self, other):
    return self.__sub__(other)    # calcula self - other
                                  # pero debería ser other - self

# Comprobación:
c = Complejo(3, 4)
print(3 - c)    # debería ser 0-4i (3-3 + 0-4i)
                # con el error da -0-4i (3-3 + 0-(-4)i) → MAL

# BIEN — inviertes el orden
def __rsub__(self, other):
    if isinstance(other, (int, float)):
        return Complejo(other - self.real, -self.imaginario)
    return NotImplemented
