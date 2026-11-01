# Solución del ejercicio 3 · Clase Pila con excepciones propias
# Del artículo «Clases en Python — ejercicios con un estudiante y sus notas, un vehículo que pierde valor y una pila con sus propias excepciones (y el boletín de Laura con el suspenso de Pablo)»
# https://sergiolearns.com/clases-en-python-ejercicios/

class PilaVaciaError(Exception):
    pass


class PilaLlenaError(Exception):
    pass


class Pila:
    """Pila LIFO: el último en entrar es el primero en salir."""

    def __init__(self, capacidad=10):
        if not isinstance(capacidad, int) or capacidad <= 0:
            raise ValueError('la capacidad debe ser un entero positivo')
        self.__capacidad = capacidad
        self.__elementos = []          # el tope es el ÚLTIMO de la lista

    @property
    def capacidad(self):               # solo lectura
        return self.__capacidad

    def vacia(self):
        return len(self.__elementos) == 0

    def llena(self):
        return len(self.__elementos) == self.__capacidad

    def push(self, elemento):
        if self.llena():
            raise PilaLlenaError(f'pila llena, capacidad máxima {self.__capacidad}')
        self.__elementos.append(elemento)

    def pop(self):
        if self.vacia():
            raise PilaVaciaError('pila vacía, no hay elementos')
        return self.__elementos.pop()  # list.pop() quita y devuelve el último

    def peek(self):
        if self.vacia():
            raise PilaVaciaError('pila vacía, no hay elementos')
        return self.__elementos[-1]

    def __len__(self):                 # permite len(pila)
        return len(self.__elementos)

    def __str__(self):
        tope = self.__elementos[-1] if self.__elementos else None
        return f'Pila: {self.__elementos} (tope: {tope})'

    def __repr__(self):
        return f'Pila(capacidad={self.__capacidad}, elementos={self.__elementos})'


p = Pila(3)
print('Pila vacía:', p.vacia())
for x in [10, 20, 30]:
    p.push(x)
print(p)
print('Peek:', p.peek())
print('Pop:', p.pop())
print(p)
print(f'Tamaño: {len(p)}/{p.capacidad}')
p.push(40)
try:
    print('Intentando push en pila llena...')
    p.push(50)
except PilaLlenaError as err:
    print('Error:', err)
while not p.vacia():
    print('Sale', p.pop())
try:
    print('Intentando pop en pila vacía...')
    p.pop()
except PilaVaciaError as err:
    print('Error:', err)
print('repr:', repr(p))
