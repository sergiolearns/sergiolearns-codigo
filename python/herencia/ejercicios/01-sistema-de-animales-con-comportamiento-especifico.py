# Ejercicio 1 — Sistema de animales con comportamiento específico
# Del artículo «Herencia en Python — ejercicios para dominar jerarquías de clases»
# https://sergiolearns.com/herencia-en-python-ejercicios/

# MAL — atributos de Animal sin inicializar
class Perro(Animal):
    def __init__(self, nombre, edad, raza):
        self.__raza = raza    # Animal.__init__ nunca se llamó
        # self.nombre → AttributeError al intentar usarlo

# BIEN — siempre llamar a super().__init__() primero
class Perro(Animal):
    def __init__(self, nombre, edad, raza):
        super().__init__(nombre, edad)    # inicializa nombre y edad
        self.__raza = raza                # luego los propios
