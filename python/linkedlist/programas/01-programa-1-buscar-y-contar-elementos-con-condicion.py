# LinkedList en Python práctica — Programa 1: Buscar y contar elementos con condiciones
# Del artículo «LinkedList en Python — 3 programas reales que consolidan la estructura»
# https://sergiolearns.com/linkedlist-en-python-practica/

from linked_list import LinkedList

class LinkedListBusqueda(LinkedList):
    """LinkedList extendida con operaciones de búsqueda."""

    def contar(self, condicion=None):
        """
        Cuenta los elementos que cumplen la condición.
        Si no se pasa condición cuenta todos.
        """
        contador = 0
        for valor in self:
            if condicion is None or condicion(valor):
                contador += 1
        return contador

    def maximo(self):
        """Devuelve el valor máximo. Lanza ValueError si la lista está vacía."""
        if self.es_vacia():
            raise ValueError("La lista está vacía")
        maximo = None
        for valor in self:
            if maximo is None or valor > maximo:
                maximo = valor
        return maximo

    def minimo(self):
        """Devuelve el valor mínimo. Lanza ValueError si la lista está vacía."""
        if self.es_vacia():
            raise ValueError("La lista está vacía")
        minimo = None
        for valor in self:
            if minimo is None or valor < minimo:
                minimo = valor
        return minimo

    def filtrar(self, condicion):
        """Devuelve una nueva LinkedList con los elementos que cumplen la condición."""
        resultado = LinkedListBusqueda()
        for valor in self:
            if condicion(valor):
                resultado.insertar_detras(valor)
        return resultado

    def suma(self):
        """Devuelve la suma de todos los elementos."""
        return sum(self)

    def media(self):
        """Devuelve la media. Lanza ValueError si la lista está vacía."""
        if self.es_vacia():
            raise ValueError("La lista está vacía")
        return self.suma() / len(self)
