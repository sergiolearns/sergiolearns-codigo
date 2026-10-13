# Solución Ejercicio 3:
# Del artículo «Clases en Python — ejercicios para dominar objetos y encapsulamiento»
# https://sergiolearns.com/clases-en-python-ejercicios/

class PilaVaciaError(Exception):
    pass

class PilaLlenaError(Exception):
    pass

class Pila:
    def __init__(self, capacidad=10):
        if not isinstance(capacidad, int) or capacidad <= 0:
            raise ValueError('La capacidad debe ser un entero positivo')
        self.__capacidad = capacidad
        self.__elementos = []

    @property
    def capacidad(self):
        return self.__capacidad

    def push(self, elemento):
        if self.llena():
            raise PilaLlenaError(
                f'pila llena — capacidad máxima {self.__capacidad}')
        self.__elementos.append(elemento)

    def pop(self):
        if self.vacía():
            raise PilaVaciaError('pila vacía — no hay elementos')
        return self.__elementos.pop()

    def peek(self):
        if self.vacía():
            raise PilaVaciaError('pila vacía — no hay elementos')
        return self.__elementos[-1]

    def vacía(self):
        return len(self.__elementos) == 0

    def llena(self):
        return len(self.__elementos) >= self.__capacidad

    def __len__(self):
        return len(self.__elementos)

    def __str__(self):
        if self.vacía():
            return 'Pila vacía'
        return (f'Pila: {self.__elementos} '
                f'(tope: {self.__elementos[-1]})')

    def __repr__(self):
        return (f'Pila(capacidad={self.__capacidad}, '
                f'elementos={self.__elementos})')

# Uso
p = Pila(capacidad=3)
print(f'Pila vacía: {p.vacía()}')

p.push(10)
p.push(20)
p.push(30)
print(p)
print(f'Peek: {p.peek()}')

valor = p.pop()
print(f'Pop: {valor}')
print(p)
print(f'Tamaño: {len(p)}/{p.capacidad}\n')

print('Intentando push en pila llena...')
p.push(40)
try:
    p.push(50)
except PilaLlenaError as err:
    print(f'Error: {err}\n')

p.pop()
p.pop()
p.pop()
print('Intentando pop en pila vacía...')
try:
    p.pop()
except PilaVaciaError as err:
    print(f'Error: {err}\n')

p.push(10)
p.push(20)
print(repr(p))
