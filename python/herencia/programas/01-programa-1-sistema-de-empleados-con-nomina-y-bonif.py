# Herencia en Python práctica — Programa 1: Sistema de empleados con nómina y bonificaciones
# Del artículo «Herencia en Python — 3 jerarquías de clases reales con polimorfismo»
# https://sergiolearns.com/herencia-en-python-practica/

from abc import ABC, abstractmethod

class Empleado(ABC):
    _total_empleados = 0

    def __init__(self, nombre, salario_base):
        if not nombre or not isinstance(nombre, str):
            raise ValueError('Nombre no válido')
        if not isinstance(salario_base, (int, float)) or salario_base < 0:
            raise ValueError('Salario base no válido')
        self.__nombre = nombre
        self.__salario_base = salario_base
        Empleado._total_empleados += 1

    @property
    def nombre(self):
        return self.__nombre

    @property
    def salario_base(self):
        return self.__salario_base

    @abstractmethod
    def bonus(self):
        pass

    @abstractmethod
    def categoria(self):
        pass

    def salario_total(self):
        return self.__salario_base + self.bonus()

    def nomina(self):
        return (f'--- Nómina de {self.__nombre} ---\n'
                f'Categoría:     {self.categoria()}\n'
                f'Salario base:  {self.__salario_base:.2f}€\n'
                f'Bonus:         {self.bonus():.2f}€\n'
                f'TOTAL:         {self.salario_total():.2f}€')

    @classmethod
    def total_empleados(cls):
        return cls._total_empleados

    def __str__(self):
        return f'{self.__nombre} ({self.categoria()}) — {self.salario_total():.2f}€/mes'

    def __repr__(self):
        return f'{self.__class__.__name__}("{self.__nombre}", {self.__salario_base})'


class Programador(Empleado):
    BONUS_POR_LENGUAJE = {
        'Python': 300, 'Java': 250, 'C': 200, 'JavaScript': 220
    }

    def __init__(self, nombre, salario_base, lenguaje, anios_experiencia):
        super().__init__(nombre, salario_base)
        if lenguaje not in self.BONUS_POR_LENGUAJE:
            raise ValueError(f'Lenguaje no reconocido: {lenguaje}')
        self.__lenguaje = lenguaje
        self.__experiencia = max(0, anios_experiencia)

    def bonus(self):
        bonus_lenguaje = self.BONUS_POR_LENGUAJE[self.__lenguaje]
        bonus_experiencia = self.__experiencia * 50
        return bonus_lenguaje + bonus_experiencia

    def categoria(self):
        if self.__experiencia >= 5:
            return f'Programador Senior ({self.__lenguaje})'
        elif self.__experiencia >= 2:
            return f'Programador Mid ({self.__lenguaje})'
        else:
            return f'Programador Junior ({self.__lenguaje})'

    def __str__(self):
        base = super().__str__()
        return f'{base} | {self.__experiencia} años exp.'


class Disenador(Empleado):
    def __init__(self, nombre, salario_base, herramienta, proyectos_mes):
        super().__init__(nombre, salario_base)
        self.__herramienta = herramienta
        self.__proyectos = max(0, proyectos_mes)

    def bonus(self):
        return self.__proyectos * 150

    def categoria(self):
        return f'Diseñador ({self.__herramienta})'


class Manager(Empleado):
    def __init__(self, nombre, salario_base, equipo):
        super().__init__(nombre, salario_base)
        self.__equipo = list(equipo)

    def bonus(self):
        return self.salario_base * 0.30 + len(self.__equipo) * 100

    def categoria(self):
        tamanio = len(self.__equipo)
        if tamanio >= 5:
            return 'Manager Senior'
        return 'Manager'

    def añadir_miembro(self, nombre):
        self.__equipo.append(nombre)

    @property
    def equipo(self):
        return list(self.__equipo)


# Uso
p1 = Programador('Sergio', 2000, 'Python', 3)
p2 = Programador('Ana', 1800, 'Java', 1)
d1 = Disenador('María', 1900, 'Figma', 4)
m1 = Manager('Juan', 3000, ['Sergio', 'Ana', 'María'])

print(p1.nomina())
print()
print(p2.nomina())
print()
print(d1.nomina())
print()
print(m1.nomina())
print()
print(f'Total empleados: {Empleado.total_empleados()}')
