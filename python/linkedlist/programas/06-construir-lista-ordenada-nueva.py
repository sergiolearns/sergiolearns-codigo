# Implementación — construir lista ordenada nueva
# Del artículo «LinkedList en Python — 3 programas reales que consolidan la estructura»
# https://sergiolearns.com/linkedlist-en-python-practica/

def insertar_ordenado(self, valor):
    """
    Inserta el valor en la posición correcta manteniendo el orden ascendente.
    Método auxiliar para la ordenación.
    """
    nuevo = self.Nodo(valor)

    # Caso 1 — lista vacía o valor menor que el primero
    if self.__primero is None or valor <= self.__primero.valor:
        nuevo.siguiente = self.__primero
        self.__primero = nuevo
        self.__longitud += 1
        return

    # Caso 2 — buscar la posición correcta
    actual = self.__primero
    while actual.siguiente is not None and actual.siguiente.valor < valor:
        actual = actual.siguiente

    # Insertar después de actual
    nuevo.siguiente = actual.siguiente
    actual.siguiente = nuevo
    self.__longitud += 1


def ordenar(self):
    """Devuelve una nueva LinkedList con los elementos ordenados."""
    resultado = LinkedList()
    for valor in self:
        resultado.insertar_ordenado(valor)
    return resultado
