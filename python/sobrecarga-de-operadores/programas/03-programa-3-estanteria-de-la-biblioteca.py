# Programa 3 · La estantería de la biblioteca
# Del artículo «Sobrecarga de operadores en Python práctica — fracciones que se simplifican solas, dinero sin errores de céntimos y la estantería de la biblioteca (y el bote de la cena que no cuadraba por un céntimo)»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-practica/

class Libro:
    def __init__(self, titulo, isbn):
        self.titulo = titulo
        self.isbn = isbn

    def __repr__(self):
        return f'Libro({self.titulo!r})'

    def __eq__(self, otro):                    # el mismo ISBN es el mismo libro
        if not isinstance(otro, Libro):
            return NotImplemented
        return self.isbn == otro.isbn

    def __hash__(self):
        return hash(self.isbn)

    def __lt__(self, otro):                    # para sorted(): por título
        return self.titulo < otro.titulo


class Estanteria:
    def __init__(self, nombre, libros=()):
        self.nombre = nombre
        self.__libros = list(libros)           # copia propia

    def __len__(self):                         # len(e) y también if e:
        return len(self.__libros)

    def __getitem__(self, i):                  # e[0], e[-1], e[1:3]
        if isinstance(i, slice):
            return Estanteria(f'{self.nombre}[{i.start}:{i.stop}]', self.__libros[i])
        return self.__libros[i]

    def __contains__(self, x):                 # «in» por libro o por título
        if isinstance(x, str):
            return any(l.titulo == x for l in self.__libros)
        return x in self.__libros

    def __iadd__(self, libro):                 # e += libro (cambia ESTA estantería)
        if not isinstance(libro, Libro):
            return NotImplemented
        if libro in self.__libros:
            raise ValueError(f'«{libro.titulo}» ya está en {self.nombre}')
        self.__libros.append(libro)
        return self

    def __add__(self, otra):                   # e1 + e2 -> estantería NUEVA
        if not isinstance(otra, Estanteria):
            return NotImplemented
        juntos = self.__libros + [l for l in otra.__libros if l not in self.__libros]
        return Estanteria(f'{self.nombre}+{otra.nombre}', juntos)

    def __str__(self):
        return f'{self.nombre} ({len(self)}): ' + ', '.join(l.titulo for l in self.__libros)


python = Libro('Python para todos', '978-1530051120')
calculo = Libro('Cálculo', '978-6075265490')
redes = Libro('Redes de computadores', '978-8490355282')
datos = Libro('Estructuras de datos en C', '978-8448142276')

prog = Estanteria('Programación', [python, datos])
mates = Estanteria('Matemáticas')
print(len(mates), 'libros;', 'vacía' if not mates else 'con libros')
mates += calculo
mates += redes
alias = mates
mates += Libro('Cálculo (2.ª impresión)', '978-6075265490'.replace('490', '491'))
print(mates, '| alias es mates:', alias is mates)
print(prog[0], prog[-1], len(prog))
print('¿«Cálculo» en mates?', 'Cálculo' in mates, ' ¿python en mates?', python in mates)
todo = prog + mates
print(todo)
print(todo[1:3])
print('Ordenados:', sorted([todo[i] for i in range(len(todo))]))
for orden in ['mates += calculo', 'prog[10]', "mates += 'Álgebra'"]:
    try:
        exec(orden)
    except (ValueError, IndexError, TypeError) as err:
        print(f'{orden:<18} -> {type(err).__name__}: {err}')
