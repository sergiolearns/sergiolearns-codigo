# Simulacro práctico de FP2 · versión A · Registro de temperaturas (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from containerbase import ContainerBase


class TempLog(ContainerBase):
    class Node:
        def __init__(self, value, next=None):
            self.value = value
            self.next = next

    def __init__(self):
        self.first = None
        self.__size = 0

    def add_first(self, value):
        self.first = TempLog.Node(value, self.first)
        self.__size += 1

    def add_last(self, value):
        if self.first is None:
            self.add_first(value)
            return
        node = self.first
        while node.next is not None:          # sin last: hay que llegar al final
            node = node.next
        node.next = TempLog.Node(value)
        self.__size += 1

    def add_at(self, value, pos):
        if pos <= 0:
            self.add_first(value)
        elif pos >= self.__size:
            self.add_last(value)
        else:
            node = self.first
            for _ in range(pos - 1):          # parar en el nodo ANTERIOR a pos
                node = node.next
            node.next = TempLog.Node(value, node.next)
            self.__size += 1

    @property
    def size(self):
        return self.__size

    @size.setter
    def size(self, new):
        if not (0 <= new < self.__size):
            return                            # fuera de rango: no hace nada
        if new == 0:
            self.first = None
        else:
            node = self.first
            for _ in range(new - 1):
                node = node.next
            node.next = None                  # corta lo que viene detrás
        self.__size = new

    def __iter__(self):
        node = self.first
        while node is not None:
            yield node.value
            node = node.next

    def ends_with(self, values):
        if len(values) > self.__size:
            return False
        node = self.first
        for _ in range(self.__size - len(values)):   # saltar hasta donde empieza la cola
            node = node.next
        for v in values:
            if node.value != v:
                return False
            node = node.next
        return True
