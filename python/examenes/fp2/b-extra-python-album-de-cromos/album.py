# Simulacro práctico de FP2 · versión B · Álbum de cromos (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from containerbase import ContainerBase


class StickerAlbum(ContainerBase):
    class Node:
        def __init__(self, value, next=None):
            self.value = value
            self.next = next

    def __init__(self):
        self.first = None
        self.__count = 0

    def add(self, name):
        if self.first is None or name < self.first.value:
            self.first = StickerAlbum.Node(name, self.first)
        elif name == self.first.value:
            return False
        else:
            node = self.first
            while node.next is not None and node.next.value < name:
                node = node.next
            if node.next is not None and node.next.value == name:
                return False                  # ya estaba: no se repite
            node.next = StickerAlbum.Node(name, node.next)
        self.__count += 1
        return True

    def remove(self, name):
        prev, node = None, self.first
        while node is not None and node.value < name:
            prev, node = node, node.next
        if node is None or node.value != name:
            return False
        if prev is None:
            self.first = node.next
        else:
            prev.next = node.next
        self.__count -= 1
        return True

    def __contains__(self, name):
        node = self.first
        while node is not None and node.value <= name:
            if node.value == name:
                return True
            node = node.next
        return False

    def __len__(self):
        return self.__count

    def __iter__(self):
        node = self.first
        while node is not None:
            yield node.value
            node = node.next

    def missing_from(self, other):
        result = StickerAlbum()
        for name in other:
            if name not in self:
                result.add(name)
        return result
