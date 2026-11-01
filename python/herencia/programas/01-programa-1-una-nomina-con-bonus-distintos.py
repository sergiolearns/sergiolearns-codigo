# Programa 1 · Una nómina con bonus distintos
# Del artículo «Herencia en Python práctica — una nómina, una flota con un híbrido y una tienda con IGIC (y la fórmula que el híbrido copió en vez de heredar)»
# https://sergiolearns.com/herencia-en-python-practica/

from abc import ABC, abstractmethod


class Empleado(ABC):
    """Lo común a toda la plantilla. No se instancia: es el contrato."""

    def __init__(self, nombre, salario_base):
        if salario_base <= 0:
            raise ValueError(f'salario no válido para {nombre}: {salario_base}')
        self.nombre = nombre
        self._salario_base = salario_base     # _ : las hijas lo pueden leer

    @property
    def salario_base(self):
        return self._salario_base

    @abstractmethod
    def bonus(self):                         # cada puesto lo calcula a su manera
        pass

    @abstractmethod
    def categoria(self):
        pass

    def salario_total(self):                 # método plantilla: usa los abstractos
        return self._salario_base + self.bonus()

    def nomina(self):
        return (f'--- Nómina de {self.nombre} ---\n'
                f'Categoría:    {self.categoria()}\n'
                f'Salario base: {self._salario_base:8.2f} €\n'
                f'Bonus:        {self.bonus():8.2f} €\n'
                f'Total:        {self.salario_total():8.2f} €')

    def __repr__(self):                      # el nombre de la clase REAL del objeto
        return f'{type(self).__name__}({self.nombre!r}, {self._salario_base})'


class Programador(Empleado):
    NIVELES = {'junior': 0.05, 'mid': 0.10, 'senior': 0.15}

    def __init__(self, nombre, salario_base, lenguaje, nivel):
        if nivel not in self.NIVELES:        # validamos ANTES de crear nada
            raise ValueError(f'nivel desconocido: {nivel!r}')
        super().__init__(nombre, salario_base)
        self.lenguaje = lenguaje
        self.nivel = nivel

    def bonus(self):
        return self._salario_base * self.NIVELES[self.nivel]

    def categoria(self):
        return f'Programador {self.nivel} ({self.lenguaje})'


class Disenador(Empleado):
    def __init__(self, nombre, salario_base, proyectos):
        super().__init__(nombre, salario_base)
        self.proyectos = proyectos

    def bonus(self):
        return 120 * self.proyectos           # 120 € por proyecto entregado

    def categoria(self):
        return f'Diseñador ({self.proyectos} proyectos)'


class Manager(Empleado):
    def __init__(self, nombre, salario_base, equipo):
        super().__init__(nombre, salario_base)
        self.equipo = list(equipo)            # copia: no comparte la lista de fuera

    def bonus(self):                          # 5 % del salario base de su equipo
        return 0.05 * sum(e.salario_base for e in self.equipo)

    def categoria(self):
        return f'Manager (equipo de {len(self.equipo)})'

    def nomina(self):                         # AMPLÍA la nómina de la madre
        lineas = [super().nomina(), 'Equipo:']
        lineas += [f'  - {e.nombre} ({type(e).__name__})' for e in self.equipo]
        return '\n'.join(lineas)


laura = Programador('Laura', 2100, 'Python', 'mid')
pablo = Programador('Pablo', 1800, 'Java', 'junior')
ana = Disenador('Ana', 1900, 4)
elena = Manager('Elena', 2600, [laura, pablo, ana])
plantilla = [laura, pablo, ana, elena]

for e in plantilla:
    print(e.nomina())
    print()

print('Plantilla:', plantilla)
print('Mayor sueldo:', max(plantilla, key=lambda e: e.salario_total()).nombre)
print(f'Coste mensual: {sum(e.salario_total() for e in plantilla):.2f} €')

for datos in [('Iván', 1700, 'C', 'experto'), ('Noa', -50, 'Python', 'mid')]:
    try:
        Programador(*datos)
    except ValueError as err:
        print('No se contrata:', err)
try:
    Empleado('Nadie', 1000)
except TypeError as err:
    print('TypeError:', err)
