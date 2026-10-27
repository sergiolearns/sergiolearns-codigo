# Simulacro práctico de FP2 · versión C · Secuencia de enteros ordenada (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from containerbase import ContainerBase


class SortedInts(ContainerBase):
    class Node:
        def __init__(self, value, next=None):
            self.value = value
            self.next = next

    def __init__(self):
        self.first = None
        self.__size = 0

    def add(self, value):
        # el nuevo va delante del primer nodo MAYOR (con <= los iguales se quedan delante)
        if self.first is None or value < self.first.value:
            self.first = SortedInts.Node(value, self.first)
        else:
            node = self.first
            while node.next is not None and node.next.value <= value:
                node = node.next
            node.next = SortedInts.Node(value, node.next)
        self.__size += 1

    def remove_all(self, value):
        removed = 0
        while self.first is not None and self.first.value == value:   # los del principio
            self.first = self.first.next
            removed += 1
        node = self.first
        while node is not None and node.next is not None:
            if node.next.value == value:
                node.next = node.next.next      # sin avanzar: el siguiente puede ser otro igual
                removed += 1
            elif node.next.value > value:
                break                           # ordenada: ya no habrá más
            else:
                node = node.next
        self.__size -= removed
        return removed

    @property
    def size(self):
        return self.__size

    def __contains__(self, value):
        node = self.first
        while node is not None and node.value <= value:
            if node.value == value:
                return True
            node = node.next
        return False

    def __iter__(self):
        node = self.first
        while node is not None:
            yield node.value
            node = node.next

    def count_between(self, low, high):
        n = 0
        for v in self:
            if v > high:
                break
            if v >= low:
                n += 1
        return n

    def merge(self, other):
        result = SortedInts()
        for v in self:
            result.add(v)
        for v in other:
            result.add(v)
        return result
