# Excepciones en Python práctica — Programa 4: Clase con excepciones propias: números racionales
# Del artículo «Excepciones en Python — 4 programas reales que no se rompen»
# https://sergiolearns.com/excepciones-en-python-practica/

# Excepciones propias
class ErrorRacional(Exception):
    """Clase base para errores de números racionales"""
    pass

class ErrorDenominadorCero(ErrorRacional):
    """Se lanza cuando el denominador es cero"""
    pass

class ErrorTipoIncorrecto(ErrorRacional):
    """Se lanza cuando el tipo de dato no es válido"""
    pass

# Clase Racional
class Racional:
    def __init__(self, numerador, denominador):
        if not (isinstance(numerador, int) and isinstance(denominador, int)):
            raise ErrorTipoIncorrecto('Numerador y denominador deben ser enteros')
        if denominador == 0:
            raise ErrorDenominadorCero('El denominador no puede ser cero')
        self.numerador = numerador
        self.denominador = denominador

    def __str__(self):
        return f'{self.numerador}/{self.denominador}'

    def __add__(self, otro):
        if not isinstance(otro, Racional):
            raise ErrorTipoIncorrecto('Solo se pueden sumar racionales')
        nuevo_num = self.numerador * otro.denominador + otro.numerador * self.denominador
        nuevo_den = self.denominador * otro.denominador
        return Racional(nuevo_num, nuevo_den)

    def __eq__(self, otro):
        if not isinstance(otro, Racional):
            return False
        return self.numerador * otro.denominador == otro.numerador * self.denominador

# Programa principal
print('=== CALCULADORA DE RACIONALES ===\n')

while True:
    try:
        num1 = int(input('Numerador 1: '))
        den1 = int(input('Denominador 1: '))
        r1 = Racional(num1, den1)

        num2 = int(input('Numerador 2: '))
        den2 = int(input('Denominador 2: '))
        r2 = Racional(num2, den2)

        suma = r1 + r2
        print(f'\n{r1} + {r2} = {suma}')
        print(f'¿Son iguales? {r1 == r2}')
        break

    except ErrorDenominadorCero as err:
        print(f'Error de racional: {err}')
    except ErrorTipoIncorrecto as err:
        print(f'Error de tipo: {err}')
    except ValueError:
        print('Error: introduce números enteros')
