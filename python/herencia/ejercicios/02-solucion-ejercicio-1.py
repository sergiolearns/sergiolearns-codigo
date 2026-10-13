# Solución Ejercicio 1:
# Del artículo «Herencia en Python — ejercicios para dominar jerarquías de clases»
# https://sergiolearns.com/herencia-en-python-ejercicios/

from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, nombre, edad):
        if not nombre or not isinstance(nombre, str):
            raise ValueError('Nombre no válido')
        if not isinstance(edad, int) or edad < 0:
            raise ValueError('Edad no válida')
        self.__nombre = nombre
        self.__edad = edad

    @property
    def nombre(self):
        return self.__nombre

    @property
    def edad(self):
        return self.__edad

    @abstractmethod
    def sonido(self):
        pass

    @abstractmethod
    def moverse(self):
        pass

    def describir(self):
        verbo = self.sonido().split()[0].lower()
        return f'{self.__nombre} {verbo} y {self.moverse()}'

    def __str__(self):
        return (f'{self.__nombre} ({self._info()}, {self.__edad} años)\n'
                f'  Sonido: {self.sonido()}\n'
                f'  Movimiento: {self.moverse()}\n'
                f'  Descripción: {self.describir()}')

    @abstractmethod
    def _info(self):
        pass

    def __repr__(self):
        return f'{self.__class__.__name__}("{self.__nombre}", {self.__edad})'


class Perro(Animal):
    def __init__(self, nombre, edad, raza):
        super().__init__(nombre, edad)    # SIEMPRE primero
        self.__raza = raza

    def sonido(self):
        return '¡Guau guau!'

    def moverse(self):
        return 'corre moviendo la cola'

    def _info(self):
        return self.__raza


class Gato(Animal):
    def __init__(self, nombre, edad, indoor=True):
        super().__init__(nombre, edad)
        self.__indoor = indoor

    def sonido(self):
        return 'Miau...'

    def moverse(self):
        return 'camina sigilosamente'

    def _info(self):
        return 'Gato indoor' if self.__indoor else 'Gato outdoor'


class Pajaro(Animal):
    def __init__(self, nombre, edad, puede_volar, especie='Pájaro'):
        super().__init__(nombre, edad)
        self.__puede_volar = puede_volar
        self.__especie = especie

    def sonido(self):
        return '♪ Pío pío ♪'

    def moverse(self):
        return 'vuela libremente' if self.__puede_volar else 'camina torpemente'

    def _info(self):
        return self.__especie


# Uso
animales = [
    Perro('Rex', 3, 'Labrador'),
    Gato('Luna', 5, indoor=True),
    Pajaro('Pío', 2, True, 'Canario'),
    Pajaro('Kiwi', 4, False, 'Pingüino')
]

for animal in animales:
    print(animal)
    print()

# No se puede instanciar Animal directamente
try:
    a = Animal('Test', 1)
except TypeError as err:
    print(f'Error esperado: {err}')
