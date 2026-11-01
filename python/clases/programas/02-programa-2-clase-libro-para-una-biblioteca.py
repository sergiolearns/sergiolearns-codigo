# Programa 2 · Clase Libro para una biblioteca
# Del artículo «Clases en Python — práctica con tres programas: una cuenta que no se deja manipular, la biblioteca de la facultad y una copistería con IVA para todos (y el saldo de −4000 € que nadie frenó)»
# https://sergiolearns.com/clases-en-python-practica/

AÑO_ACTUAL = 2026


class Libro:
    _total_libros = 0

    def __init__(self, titulo, autor, anio, isbn):
        self.titulo = titulo           # setters: validan desde el principio
        self.autor = autor
        self.anio = anio
        self.__isbn = isbn             # sin setter: el ISBN no cambia
        self.__disponible = True
        Libro._total_libros += 1

    @property
    def titulo(self):
        return self.__titulo

    @titulo.setter
    def titulo(self, valor):
        if not isinstance(valor, str) or not valor.strip():
            raise ValueError('el título debe ser un texto no vacío')
        self.__titulo = valor.strip()

    @property
    def autor(self):
        return self.__autor

    @autor.setter
    def autor(self, valor):
        if not isinstance(valor, str) or not valor.strip():
            raise ValueError('el autor debe ser un texto no vacío')
        self.__autor = valor.strip()

    @property
    def anio(self):
        return self.__anio

    @anio.setter
    def anio(self, valor):
        if not isinstance(valor, int) or not 1450 <= valor <= AÑO_ACTUAL:
            raise ValueError(f'año no válido: {valor}')
        self.__anio = valor

    @property
    def isbn(self):
        return self.__isbn

    @property
    def disponible(self):
        return self.__disponible

    def prestar(self):
        if not self.__disponible:
            raise ValueError(f'«{self.__titulo}» ya está prestado')
        self.__disponible = False

    def devolver(self):
        if self.__disponible:
            raise ValueError(f'«{self.__titulo}» no estaba prestado')
        self.__disponible = True

    @classmethod
    def total_libros(cls):
        return cls._total_libros

    def __str__(self):
        estado = 'disponible' if self.__disponible else 'prestado'
        return f'«{self.__titulo}», {self.__autor} ({self.__anio}): {estado}'

    def __repr__(self):
        return f'Libro({self.__titulo!r}, {self.__autor!r}, {self.__anio}, {self.__isbn!r})'


class Biblioteca:
    def __init__(self, nombre):
        self.__nombre = nombre
        self.__libros = []             # guarda REFERENCIAS a objetos Libro

    def añadir(self, libro):
        if not isinstance(libro, Libro):
            raise TypeError('solo se pueden añadir objetos Libro')
        self.__libros.append(libro)

    def buscar(self, texto):
        return [l for l in self.__libros if texto.lower() in l.titulo.lower()]

    def disponibles(self):
        return [l for l in self.__libros if l.disponible]

    def __str__(self):
        return f'Biblioteca {self.__nombre}: {len(self.__libros)} libros'


bib = Biblioteca('de la EII')
l1 = Libro('Python para todos', 'Severance', 2016, '978-1-5303-3762-6')
l2 = Libro('Estructuras de datos en C', 'Joyanes', 2005, '978-84-481-4227-6')
l3 = Libro('Cálculo', 'Stewart', 2018, '978-607-526-549-8')
for l in [l1, l2, l3]:
    bib.añadir(l)
print(bib)
l1.prestar()
print(l1)
for accion in [l1.prestar, l3.devolver]:
    try:
        accion()
    except ValueError as err:
        print('Error:', err)
print('Buscar «c»:', bib.buscar('c'))
print('Disponibles:', [l.titulo for l in bib.disponibles()])
for mal in [("''", 'Nadie', 2020), ('Futuro', 'Alguien', 2030)]:
    try:
        Libro(eval(mal[0]) if mal[0] == "''" else mal[0], mal[1], mal[2], '000')
    except ValueError as err:
        print('No se crea:', err)
print('Libros creados:', Libro.total_libros())
