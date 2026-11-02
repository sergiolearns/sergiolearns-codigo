# Programa 3: iterador para la cola de reservas (lista encadenada)
# Del artículo «Iteradores y generadores en Python — práctica con Fibonacci sin fin, una tubería de primos y la cola de reservas de la biblioteca (y el portátil que se quedó pensando)»
# https://sergiolearns.com/iteradores-y-generadores-en-python-practica/

class ColaReservas:
    """Lista encadenada con los socios que esperan un libro, en orden de llegada."""

    class _Nodo:
        def __init__(self, socio):
            self.socio = socio
            self.siguiente = None     # el enlace al nodo de detrás

    def __init__(self, titulo):
        self.titulo = titulo
        self._primero = None
        self._ultimo = None           # guardamos el último para añadir sin recorrer
        self._n = 0

    def reservar(self, socio):
        nodo = self._Nodo(socio)
        if self._primero is None:     # cola vacía: el nuevo es primero y último
            self._primero = nodo
        else:
            self._ultimo.siguiente = nodo
        self._ultimo = nodo
        self._n += 1

    def atender(self):
        """El libro ha vuelto: sale el primero de la cola."""
        if self._primero is None:
            raise IndexError('no hay reservas')
        nodo = self._primero
        self._primero = nodo.siguiente
        if self._primero is None:     # se ha vaciado: tampoco hay último
            self._ultimo = None
        self._n -= 1
        return nodo.socio

    def __len__(self):
        return self._n

    def __iter__(self):               # generador: recorre los nodos sin tocarlos
        nodo = self._primero
        while nodo is not None:
            yield nodo.socio
            nodo = nodo.siguiente

    def avisos(self):
        for puesto, socio in enumerate(self, start=1):
            if puesto == 1:
                yield f'{puesto}. {socio}: te toca'
            else:
                yield f'{puesto}. {socio}: tienes {puesto - 1} delante'

    def __str__(self):
        return ' -> '.join(self) + ' -> None'


cola = ColaReservas('Python a fondo')
for socio in ['Laura', 'Pablo', 'Marta', 'Iván']:
    cola.reservar(socio)

print(cola.titulo, '|', len(cola), 'reservas')
print(cola)
for aviso in cola.avisos():
    print(' ', aviso)
print('¿Marta está?', 'Marta' in cola, '| ¿Sara está?', 'Sara' in cola)
print('Dos recorridos:', list(cola), list(cola))
print('Vuelve el libro: se lo lleva', cola.atender())
print(cola)
print('Tipo de iter(cola):', type(iter(cola)).__name__)
