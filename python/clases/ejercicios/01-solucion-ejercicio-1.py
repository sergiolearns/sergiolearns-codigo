# Solución Ejercicio 1:
# Del artículo «Clases en Python — ejercicios para dominar objetos y encapsulamiento»
# https://sergiolearns.com/clases-en-python-ejercicios/

class Estudiante:
    def __init__(self, nombre, edad):
        self.nombre = nombre    # usa setter
        self.edad = edad        # usa setter
        self.__notas = []

    @property
    def nombre(self):
        return self.__nombre

    @nombre.setter
    def nombre(self, valor):
        if not valor or not isinstance(valor, str):
            raise ValueError('El nombre debe ser una cadena no vacía')
        self.__nombre = valor.strip()

    @property
    def edad(self):
        return self.__edad

    @edad.setter
    def edad(self, valor):
        if not isinstance(valor, int) or not (16 <= valor <= 99):
            raise ValueError(f'Edad no válida: {valor}')
        self.__edad = valor

    @property
    def notas(self):
        return list(self.__notas)    # copia — no el original

    def añadir_nota(self, nota):
        if not isinstance(nota, (int, float)) or not (0 <= nota <= 10):
            raise ValueError(f'Nota no válida: {nota}')
        self.__notas.append(float(nota))

    def media(self):
        if not self.__notas:
            return 0.0
        return round(sum(self.__notas) / len(self.__notas), 2)

    def nota_maxima(self):
        if not self.__notas:
            raise ValueError('No hay notas')
        return max(self.__notas)

    def nota_minima(self):
        if not self.__notas:
            raise ValueError('No hay notas')
        return min(self.__notas)

    def aprobado(self):
        return self.media() >= 5.0

    def __str__(self):
        estado = 'Aprobado ✓' if self.aprobado() else 'Suspenso ✗'
        return (f'Estudiante: {self.__nombre} ({self.__edad} años)\n'
                f'Notas: {self.__notas}\n'
                f'Media: {self.media()}\n'
                f'Máxima: {self.nota_maxima()} | Mínima: {self.nota_minima()}\n'
                f'Estado: {estado}')

    def __repr__(self):
        return f'Estudiante("{self.__nombre}", {self.__edad})'

# Uso
e = Estudiante('Sergio', 22)
e.añadir_nota(7.5)
e.añadir_nota(8.0)
e.añadir_nota(6.5)
e.añadir_nota(9.0)
print(e)
print(f'\nrepr: {repr(e)}')
