# Chuletario — Herencia y polimorfismo en Python
# Del artículo «Herencia en Python — ejercicios para dominar jerarquías de clases»
# https://sergiolearns.com/herencia-en-python-ejercicios/

# ============================================
# CHULETARIO — Herencia y polimorfismo
# Sergio Learns · sergiolearns.com
# ============================================

# HERENCIA BÁSICA
class SubClase(SuperClase):
    def __init__(self, param_propio, *params_super):
        super().__init__(*params_super)    # SIEMPRE primero
        self.propio = param_propio         # luego los propios

# OVERRIDE — redefinir método heredado
class SubClase(SuperClase):
    def metodo(self):                      # sustituye al de SuperClase
        return 'versión SubClase'

# OVERRIDE EXTENDIDO — añadir al heredado
class SubClase(SuperClase):
    def metodo(self):
        base = super().metodo()            # llama al de SuperClase
        return f'{base} + extra'

# CLASES ABSTRACTAS
from abc import ABC, abstractmethod

class MiAbstracta(ABC):
    def __init__(self, param):
        self.__param = param               # puede tener __init__

    @abstractmethod
    def metodo_obligatorio(self):          # subclases DEBEN implementar
        pass

    def metodo_normal(self):              # subclases heredan
        return self.metodo_obligatorio()   # puede llamar a abstractos

# No instanciable directamente → TypeError
# Subclase sin implementar @abstractmethod → también abstracta → TypeError

# isinstance vs type
isinstance(obj, Clase)    # True para Clase Y sus subclases
isinstance(obj, (A, B))   # True si es A o B o subclase de alguna
type(obj) == Clase        # True solo para esa clase exacta
type(obj).__name__        # nombre de la clase como string

# JERARQUÍA EN DOS NIVELES
class A:
    pass
class B(A):
    def __init__(self):
        super().__init__()
class C(B):               # C hereda de B que hereda de A
    def __init__(self):
        super().__init__()    # llama a B.__init__ que llama a A.__init__

# POLIMORFISMO CON LISTAS MIXTAS
objetos = [SubClase1(), SubClase2(), SubClase3()]
for obj in objetos:
    obj.metodo()          # cada uno ejecuta su versión

# ATRIBUTOS PRIVADOS Y HERENCIA
class SuperClase:
    def __init__(self):
        self.__privado = 0     # NO accesible desde subclases
        self._protegido = 0    # accesible pero convención privado

class SubClase(SuperClase):
    def metodo(self):
        self.__privado        # AttributeError
        self._protegido       # OK — convención

# HOOK PATTERN — método vacío que subclases pueden sobreescribir
class Base:
    def operacion(self):
        self._pre_operacion()     # hook
        # lógica principal
        self._post_operacion()    # hook

    def _pre_operacion(self): pass     # subclases sobreescriben si quieren
    def _post_operacion(self): pass

# ERRORES TÍPICOS
# 1. Olvidar super().__init__() → atributos de superclase no inicializados
# 2. Instanciar clase abstracta → TypeError
# 3. Subclase sin implementar @abstractmethod → TypeError al instanciar
# 4. type() en vez de isinstance() → no respeta jerarquía
# 5. Llamar super() fuera de un método → RuntimeError
# 6. Hardcodear nombre de clase en vez de super() → frágil

# PATRÓN COMPLETO
from abc import ABC, abstractmethod

class Base(ABC):
    def __init__(self, param):
        self.__param = param

    @property
    def param(self): return self.__param

    @abstractmethod
    def comportamiento(self): pass      # obligatorio

    def describir(self):                # usa el abstracto
        return f'{self.__param}: {self.comportamiento()}'

    def __str__(self): return self.describir()
    def __repr__(self): return f'{self.__class__.__name__}("{self.__param}")'

class Concreta(Base):
    def __init__(self, param, extra):
        super().__init__(param)         # SIEMPRE primero
        self.__extra = extra

    def comportamiento(self):           # obligatorio — implementado
        return f'comportamiento con {self.__extra}'
