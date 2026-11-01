# Solución del ejercicio 1 · Sistema de animales
# Del artículo «Herencia en Python ejercicios — animales, cuentas bancarias y los préstamos de la biblioteca, con soluciones, test y chuletario (y la s de más que tumbó un simulacro)»
# https://sergiolearns.com/herencia-en-python-ejercicios/

from abc import ABC, abstractmethod


class Animal(ABC):
    def __init__(self, nombre, edad):
        self.__nombre = nombre          # privados: las hijas usan las propiedades
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

    def extra(self):                    # gancho: cada hija dice su dato propio
        return ''

    def describir(self):                # plantilla: usa los abstractos
        return (f'{self}\n'
                f'  Sonido: {self.sonido()}\n'
                f'  Movimiento: {self.moverse()}')

    def __str__(self):
        años = 'año' if self.__edad == 1 else 'años'
        return f'{self.__nombre} ({self.extra()}, {self.__edad} {años})'

    def __repr__(self):
        return f'{type(self).__name__}({self.__nombre!r}, {self.__edad})'


class Perro(Animal):
    def __init__(self, nombre, edad, raza):
        super().__init__(nombre, edad)
        self.raza = raza

    def sonido(self):
        return '¡Guau guau!'

    def moverse(self):
        return 'corre moviendo la cola'

    def extra(self):
        return self.raza


class Gato(Animal):
    def __init__(self, nombre, edad, interior):
        super().__init__(nombre, edad)
        self.interior = interior

    def sonido(self):
        return '¡Miau!'

    def moverse(self):
        return 'camina sigilosamente'

    def extra(self):
        return 'de interior' if self.interior else 'de exterior'


class Pajaro(Animal):
    def __init__(self, nombre, edad, puede_volar):
        super().__init__(nombre, edad)
        self.puede_volar = puede_volar

    def sonido(self):
        return '¡Pío pío!'

    def moverse(self):
        return 'vuela' if self.puede_volar else 'camina dando saltitos'

    def extra(self):
        return 'vuela' if self.puede_volar else 'no vuela'


animales = [Perro('Rex', 3, 'Labrador'), Gato('Mia', 5, True),
            Pajaro('Kiwi', 1, False), Pajaro('Piolín', 2, True)]
for a in animales:
    print(a.describir())
print(animales)
try:
    Animal('Nadie', 0)
except TypeError as err:
    print('TypeError:', err)
