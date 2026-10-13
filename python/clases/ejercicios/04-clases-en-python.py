# Chuletario — Clases en Python
# Del artículo «Clases en Python — ejercicios para dominar objetos y encapsulamiento»
# https://sergiolearns.com/clases-en-python-ejercicios/

# ============================================
# CHULETARIO — Clases en Python
# Sergio Learns · sergiolearns.com
# ============================================

# DEFINIR UNA CLASE
class MiClase:
    atributo_clase = 0    # compartido por todos los objetos

    def __init__(self, param1, param2):
        self.attr1 = param1    # atributo — usa setter si existe
        self.__privado = param2    # atributo privado

    def metodo(self):
        return self.attr1

# PARÁMETRO vs ATRIBUTO
# param   → variable local de __init__, desaparece al terminar
# self.x  → atributo del objeto, persiste mientras el objeto exista
# self.x = param → crea el atributo con el valor del parámetro

# INSTANCIAR
obj = MiClase(valor1, valor2)
print(obj.attr1)
obj.metodo()

# ENCAPSULAMIENTO
class MiClase:
    def __init__(self, valor):
        self.valor = valor    # llama al setter si existe

    @property
    def valor(self):          # getter
        return self.__valor

    @valor.setter
    def valor(self, nuevo):   # setter — con validación
        if nuevo >= 0:
            self.__valor = nuevo
        else:
            raise ValueError('Valor negativo')

    @property
    def solo_lectura(self):   # sin setter → solo lectura
        return self.__valor * 2

# ATRIBUTOS PRIVADOS
self.__privado      # oculto — name mangling → _Clase__privado
self._convencion    # convención privado — accesible pero no recomendado

# MÉTODOS MÁGICOS
def __str__(self):      # para print() — legible por el usuario
    return f'...'
def __repr__(self):     # para repr() — para el programador
    return f'MiClase({self.__valor})'
def __len__(self):      # para len()
    return len(self.__lista)

# ATRIBUTOS Y MÉTODOS DE CLASE
class MiClase:
    _contador = 0                # atributo de clase

    def __init__(self):
        MiClase._contador += 1   # actualiza el atributo de clase

    @classmethod
    def total(cls):              # método de clase
        return cls._contador

MiClase.total()    # llamada desde la clase
obj.total()        # también funciona desde objeto

# ERROR TÍPICO — modificar privado directamente
obj._MiClase__privado = 999    # técnicamente funciona
                                # pero salta toda la validación
obj.valor = 999                 # BIEN — usa el setter con validación

# EXCEPCIONES EN CLASES
class ErrorMiClase(Exception):
    pass

class MiClase:
    @property
    def valor(self):
        return self.__valor

    @valor.setter
    def valor(self, nuevo):
        if nuevo < 0:
            raise ErrorMiClase('Valor negativo')
        self.__valor = nuevo

# PATRÓN COMPLETO
class ClaseCompleta:
    _contador = 0

    def __init__(self, nombre, valor):
        self.nombre = nombre    # usa setter
        self.valor = valor      # usa setter
        ClaseCompleta._contador += 1

    @property
    def nombre(self):
        return self.__nombre

    @nombre.setter
    def nombre(self, v):
        if not v: raise ValueError('Nombre vacío')
        self.__nombre = v

    @property
    def valor(self):
        return self.__valor

    @valor.setter
    def valor(self, v):
        if v < 0: raise ValueError('Negativo')
        self.__valor = v

    @classmethod
    def total(cls):
        return cls._contador

    def __str__(self):
        return f'{self.__nombre}: {self.__valor}'

    def __repr__(self):
        return f'ClaseCompleta("{self.__nombre}", {self.__valor})'
