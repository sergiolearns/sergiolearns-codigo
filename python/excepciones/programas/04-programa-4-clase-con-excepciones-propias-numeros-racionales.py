# Programa 4 · Clase con excepciones propias: números racionales
# Del artículo «Excepciones en Python — práctica con cuatro programas que no se rompen: una ficha de matrícula, una calculadora, un lector de notas y fracciones (y el «12,5» que no quería ser número)»
# https://sergiolearns.com/excepciones-en-python-practica/

# Lo que teclearía la persona (en tu ordenador, cambia leer() por input()):
TECLEO = iter(['3', '0', 'tres', '3', '4', '1', '2'])


def leer(mensaje):
    texto = next(TECLEO)     # el siguiente dato «tecleado»
    print(mensaje + texto)   # lo enseñamos como se vería en la terminal
    return texto

from math import gcd


class ErrorRacional(Exception):
    """Base de los errores de los números racionales."""


class ErrorDenominadorCero(ErrorRacional):
    """El denominador vale 0."""


class ErrorTipoIncorrecto(ErrorRacional):
    """Numerador o denominador no son enteros."""


class Racional:
    def __init__(self, num, den):
        if not (isinstance(num, int) and isinstance(den, int)):
            raise ErrorTipoIncorrecto('numerador y denominador deben ser enteros')
        if den == 0:
            raise ErrorDenominadorCero('el denominador no puede ser cero')
        m = gcd(num, den)                # simplificamos: 10/8 -> 5/4
        self.num, self.den = num // m, den // m

    def __str__(self):
        return f'{self.num}/{self.den}'

    def __add__(self, otro):             # r1 + r2 llama a r1.__add__(r2)
        if not isinstance(otro, Racional):
            raise ErrorTipoIncorrecto('solo se suman racionales')
        return Racional(self.num * otro.den + otro.num * self.den, self.den * otro.den)


def pedir_racional(n):
    num = int(leer(f'Numerador {n}: '))          # ValueError si no es un entero
    den = int(leer(f'Denominador {n}: '))
    return Racional(num, den)                    # ErrorRacional si no vale


print('=== SUMA DE RACIONALES ===')
while True:
    try:
        r1 = pedir_racional(1)
        r2 = pedir_racional(2)
        break
    except ErrorDenominadorCero as err:
        print('  Error de racional:', err)
    except ValueError:
        print('  Error: escribe números enteros')
print(f'{r1} + {r2} = {r1 + r2}')
try:
    print(r1 + 0.5)
except ErrorRacional as err:             # la base captura a cualquier hija
    print(f'  {type(err).__name__}: {err}')
