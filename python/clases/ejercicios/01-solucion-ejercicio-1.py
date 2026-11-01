# Solución del ejercicio 1 · Clase Estudiante con notas
# Del artículo «Clases en Python — ejercicios con un estudiante y sus notas, un vehículo que pierde valor y una pila con sus propias excepciones (y el boletín de Laura con el suspenso de Pablo)»
# https://sergiolearns.com/clases-en-python-ejercicios/

class Estudiante:
    def __init__(self, nombre, edad):
        self.nombre = nombre           # setters
        self.edad = edad
        self.__notas = []

    @property
    def nombre(self):
        return self.__nombre

    @nombre.setter
    def nombre(self, valor):
        if not isinstance(valor, str) or not valor.strip():
            raise ValueError('el nombre debe ser un texto no vacío')
        self.__nombre = valor.strip()

    @property
    def edad(self):
        return self.__edad

    @edad.setter
    def edad(self, valor):
        if not isinstance(valor, int) or not 16 <= valor <= 99:
            raise ValueError(f'edad no válida: {valor}')
        self.__edad = valor

    @property
    def notas(self):
        return list(self.__notas)      # copia

    def añadir_nota(self, nota):
        if not isinstance(nota, (int, float)) or not 0 <= nota <= 10:
            raise ValueError(f'nota no válida: {nota}')
        self.__notas.append(nota)

    def media(self):
        if not self.__notas:
            return 0.0                 # sin notas, media 0 (decisión del enunciado)
        return sum(self.__notas) / len(self.__notas)

    def aprobado(self):
        return self.media() >= 5

    def __str__(self):
        return f'Estudiante: {self.__nombre} ({self.__edad} años)'

    def __repr__(self):
        return f'Estudiante({self.__nombre!r}, {self.__edad})'


e = Estudiante('Laura', 20)
for n in [7.5, 8.0, 6.5, 9.0, 11]:
    try:
        e.añadir_nota(n)
    except ValueError as err:
        print('Error:', err)
print(e)
print('Notas:', e.notas)
print(f'Media: {e.media():.2f}')
print('Máxima:', max(e.notas), '| Mínima:', min(e.notas))
print('Estado:', 'Aprobado' if e.aprobado() else 'Suspenso')
print('repr:', repr(e))
e.notas.append(-5)                     # se añade a una copia...
print('Notas tras el intento:', e.notas)
