# Clases en Python práctica — Programa 2: Clase Libro para una biblioteca
# Del artículo «Clases en Python — 3 programas reales con encapsulamiento y @property»
# https://sergiolearns.com/clases-en-python-practica/

class Libro:
    _total_libros = 0

    def __init__(self, titulo, autor, anio, isbn):
        self.titulo = titulo        # usa setter
        self.autor = autor          # usa setter
        self.anio = anio            # usa setter
        self.__isbn = isbn
        self.__disponible = True
        Libro._total_libros += 1

    @property
    def titulo(self):
        return self.__titulo

    @titulo.setter
    def titulo(self, valor):
        if not valor or not isinstance(valor, str):
            raise ValueError('El título debe ser una cadena no vacía')
        self.__titulo = valor.strip()

    @property
    def autor(self):
        return self.__autor

    @autor.setter
    def autor(self, valor):
        if not valor or not isinstance(valor, str):
            raise ValueError('El autor debe ser una cadena no vacía')
        self.__autor = valor.strip()

    @property
    def anio(self):
        return self.__anio

    @anio.setter
    def anio(self, valor):
        if not isinstance(valor, int) or valor < 1000 or valor > 2025:
            raise ValueError(f'Año no válido: {valor}')
        self.__anio = valor

    @property
    def isbn(self):
        return self.__isbn    # solo lectura — sin setter

    @property
    def disponible(self):
        return self.__disponible

    def prestar(self):
        if not self.__disponible:
            raise ValueError(f'"{self.__titulo}" ya está prestado')
        self.__disponible = False

    def devolver(self):
        if self.__disponible:
            raise ValueError(f'"{self.__titulo}" no está prestado')
        self.__disponible = True

    @classmethod
    def total_libros(cls):
        return cls._total_libros

    def __str__(self):
        estado = 'disponible' if self.__disponible else 'prestado'
        return f'"{self.__titulo}" de {self.__autor} ({self.__anio}) — {estado}'

    def __repr__(self):
        return f'Libro("{self.__titulo}", "{self.__autor}", {self.__anio}, "{self.__isbn}")'

# Biblioteca
class Biblioteca:
    def __init__(self, nombre):
        self.__nombre = nombre
        self.__libros = []

    def añadir_libro(self, libro):
        if not isinstance(libro, Libro):
            raise TypeError('Solo se pueden añadir objetos de tipo Libro')
        self.__libros.append(libro)

    def buscar_titulo(self, titulo):
        resultados = [l for l in self.__libros
                      if titulo.lower() in l.titulo.lower()]
        return resultados

    def libros_disponibles(self):
        return [l for l in self.__libros if l.disponible]

    def __str__(self):
        return f'Biblioteca "{self.__nombre}": {len(self.__libros)} libros'

# Uso
b = Biblioteca('ULPGC')

l1 = Libro('Fundamentos de Python', 'Hernández', 2023, '978-1-1234')
l2 = Libro('Programación en C', 'Santos', 2022, '978-2-5678')
l3 = Libro('Estadística para GCID', 'Rodríguez', 2021, '978-3-9012')

b.añadir_libro(l1)
b.añadir_libro(l2)
b.añadir_libro(l3)

print(b)           # → Biblioteca "ULPGC": 3 libros
print(l1)          # → "Fundamentos de Python" de Hernández (2023) — disponible

l1.prestar()
print(l1)          # → "Fundamentos de Python" de Hernández (2023) — prestado

try:
    l1.prestar()
except ValueError as err:
    print(err)     # → "Fundamentos de Python" ya está prestado

disponibles = b.libros_disponibles()
for libro in disponibles:
    print(libro)

print(Libro.total_libros())    # → 3
