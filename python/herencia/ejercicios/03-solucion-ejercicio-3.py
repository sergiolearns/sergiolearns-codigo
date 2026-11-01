# Solución del ejercicio 3 · Préstamos y multas de la biblioteca
# Del artículo «Herencia en Python ejercicios — animales, cuentas bancarias y los préstamos de la biblioteca, con soluciones, test y chuletario (y la s de más que tumbó un simulacro)»
# https://sergiolearns.com/herencia-en-python-ejercicios/

from abc import ABC, abstractmethod


class PrestamoError(Exception):
    pass


class Socio(ABC):
    def __init__(self, nombre):
        self.nombre = nombre
        self.prestados = {}                   # título -> día en que se lo llevó

    @abstractmethod
    def limite(self):
        pass

    @abstractmethod
    def dias_prestamo(self):
        pass

    def multa_dia(self):                      # gancho: 0,20 €/día salvo que se sustituya
        return 0.20

    def puede_llevar(self, material):         # gancho: por defecto, todo
        return True

    def multa(self, dias_fuera):
        return max(0, dias_fuera - self.dias_prestamo()) * self.multa_dia()

    def __str__(self):
        return f'{self.nombre} ({type(self).__name__}, {len(self.prestados)}/{self.limite()})'


class Estudiante(Socio):
    def limite(self):
        return 3

    def dias_prestamo(self):
        return 15


class SocioPDI(Socio):
    def limite(self):
        return 10

    def dias_prestamo(self):
        return 60

    def multa_dia(self):
        return 0.0


class Visitante(Socio):
    def limite(self):
        return 1

    def dias_prestamo(self):
        return 7

    def multa_dia(self):
        return 0.50

    def puede_llevar(self, material):         # las revistas, solo en sala
        return material.tipo != 'revista'


class Material:
    def __init__(self, titulo, tipo='libro'):
        self.titulo = titulo
        self.tipo = tipo
        self.prestado_a = None


class Biblioteca:
    def __init__(self):
        self.recaudado = 0.0

    def prestar(self, socio, material, dia):
        if material.prestado_a is not None:
            raise PrestamoError(f'«{material.titulo}» ya lo tiene {material.prestado_a.nombre}')
        if len(socio.prestados) >= socio.limite():
            raise PrestamoError(f'{socio.nombre} ya tiene {len(socio.prestados)} de {socio.limite()} préstamos permitidos')
        if not socio.puede_llevar(material):
            raise PrestamoError(f'{socio.nombre} no puede llevarse una {material.tipo}')
        material.prestado_a = socio
        socio.prestados[material.titulo] = dia

    def devolver(self, socio, material, dia):
        dias_fuera = dia - socio.prestados.pop(material.titulo)
        material.prestado_a = None
        multa = socio.multa(dias_fuera)       # polimorfismo: cada socio la suya
        self.recaudado += multa
        return f'{socio.nombre} devuelve «{material.titulo}»: {dias_fuera} días, multa {multa:.2f} €'


bib = Biblioteca()
calculo = Material('Cálculo')
python = Material('Python para todos')
redes = Material('Redes de computadores')
datos = Material('Estructuras de datos en C')
revista = Material('Investigación y Ciencia', 'revista')
laura, ramos, pablo = Estudiante('Laura'), SocioPDI('Dra. Ramos'), Visitante('Pablo')

operaciones = [
    (bib.prestar, laura, calculo, 1), (bib.prestar, ramos, python, 1),
    (bib.prestar, pablo, revista, 2), (bib.prestar, pablo, redes, 2),
    (bib.prestar, laura, python, 3), (bib.prestar, pablo, datos, 4),
    (bib.devolver, pablo, redes, 13), (bib.devolver, laura, calculo, 22),
    (bib.devolver, ramos, python, 75),
]
for accion, socio, material, dia in operaciones:
    try:
        resultado = accion(socio, material, dia)
        print(f'Día {dia:>2}: {resultado or "préstamo de «" + material.titulo + "» a " + socio.nombre}')
    except PrestamoError as err:
        print(f'Día {dia:>2}: Rechazado: {err}')
print('Socios:', ', '.join(str(s) for s in [laura, ramos, pablo]))
print(f'Recaudado en multas: {bib.recaudado:.2f} €')
