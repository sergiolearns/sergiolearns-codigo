# Simulacro práctico de FP2 · versión C · Tren de mercancías (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from containerbase import ContainerBase


class Wagon:
    """Un vagón (ya hecha: no la toques)."""

    def __init__(self, kind, tons):
        self.kind = kind
        self.tons = tons

    def __str__(self):
        return f"{self.kind} {self.tons}t"


class Train(ContainerBase):
    class Node:
        def __init__(self, value, next=None):
            self.value = value        # el Wagon
            self.next = next

    def __init__(self):
        self.first = None
        self.last = None
        self.__count = 0

    def attach(self, wagon):
        node = Train.Node(wagon)
        if self.first is None:
            self.first = node
        else:
            self.last.next = node
        self.last = node
        self.__count += 1

    def attach_front(self, wagon):
        self.first = Train.Node(wagon, self.first)
        if self.last is None:          # el tren estaba vacío
            self.last = self.first
        self.__count += 1

    def detach_last(self):
        if self.first is None:
            return None
        wagon = self.last.value
        if self.first is self.last:    # solo había uno
            self.first = self.last = None
        else:
            node = self.first
            while node.next is not self.last:   # lista simple: hay que buscar el penúltimo
                node = node.next
            node.next = None
            self.last = node
        self.__count -= 1
        return wagon

    def __len__(self):
        return self.__count

    @property
    def total_tons(self):
        total, node = 0, self.first
        while node is not None:
            total += node.value.tons
            node = node.next
        return total

    def wagons_of(self, kind):
        node = self.first
        while node is not None:
            if node.value.kind == kind:
                yield node.value
            node = node.next

    def split(self, pos):
        tail = Train()
        if not (0 <= pos < self.__count):
            return tail                # posición no válida: nada cambia
        if pos == 0:
            tail.first, tail.last = self.first, self.last
            self.first = self.last = None
        else:
            node = self.first
            for _ in range(pos - 1):   # el vagón que se queda el último
                node = node.next
            tail.first, tail.last = node.next, self.last
            node.next = None
            self.last = node
        tail.__count = self.__count - pos
        self.__count = pos
        return tail
