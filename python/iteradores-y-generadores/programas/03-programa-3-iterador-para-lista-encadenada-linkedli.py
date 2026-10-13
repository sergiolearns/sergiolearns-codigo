# Iteradores y generadores en Python práctica — Programa 3: Iterador para lista encadenada (LinkedList)
# Del artículo «Iteradores y generadores en Python — 3 programas reales que los hacen tangibles»
# https://sergiolearns.com/iteradores-y-generadores-en-python-practica/

class LinkedList:
    """Lista encadenada simple con iterador integrado."""

    class Nodo:
        """Nodo interno de la lista."""
        def __init__(self, valor, siguiente=None):
            self.valor = valor
            self.siguiente = siguiente

    def __init__(self):
        self.__primero = None
        self.__longitud = 0

    def insertar_delante(self, valor):
        """Inserta un elemento al principio."""
        self.__primero = self.Nodo(valor, self.__primero)
        self.__longitud += 1

    def insertar_detras(self, valor):
        """Inserta un elemento al final."""
        nuevo = self.Nodo(valor)
        if self.__primero is None:
            self.__primero = nuevo
        else:
            actual = self.__primero
            while actual.siguiente is not None:
                actual = actual.siguiente
            actual.siguiente = nuevo
        self.__longitud += 1

    def __len__(self):
        return self.__longitud

    def __iter__(self):
        """Hace la LinkedList iterable usando un generador."""
        actual = self.__primero
        while actual is not None:
            valor = actual.valor
            actual = actual.siguiente
            yield valor    # pausa aquí y devuelve el valor

    def __str__(self):
        return ' → '.join(str(v) for v in self) + ' → None'

    def __repr__(self):
        return f'LinkedList({list(self)})'
