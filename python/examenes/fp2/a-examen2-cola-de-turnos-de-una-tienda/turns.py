# Simulacro práctico de FP2 · versión A · Cola de turnos de una tienda (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from containerbase import ContainerBase


class Ticket:
    """Un turno (ya hecha: no la toques)."""

    def __init__(self, number, name, priority=False):
        self.number = number
        self.name = name
        self.priority = priority

    def __str__(self):
        return f"#{self.number} {self.name}" + ("*" if self.priority else "")


class TurnQueue(ContainerBase):
    class Node:
        def __init__(self, value, next=None):
            self.value = value        # el Ticket
            self.next = next          # el siguiente nodo

    def __init__(self):
        self.first = None
        self.last = None
        self.__count = 0              # nodos en la lista (así len() no recorre)
        self.__next_number = 1        # el número que dará el próximo take()
        self.__served = 0

    def __append(self, ticket):
        # añadir al final: O(1) gracias a last
        node = TurnQueue.Node(ticket)
        if self.first is None:
            self.first = node
        else:
            self.last.next = node
        self.last = node
        self.__count += 1

    def take(self, name, priority=False):
        ticket = Ticket(self.__next_number, name, priority)
        self.__next_number += 1       # nunca se reutiliza, aunque se cancele
        self.__append(ticket)
        return ticket.number

    def serve(self):
        if self.first is None:
            return None
        ticket = self.first.value
        self.first = self.first.next
        if self.first is None:        # se ha vaciado: last también a None
            self.last = None
        self.__count -= 1
        self.__served += 1
        return ticket

    @property
    def served(self):
        return self.__served

    def __len__(self):
        return self.__count

    def cancel(self, number):
        prev, node = None, self.first
        while node is not None and node.value.number != number:
            prev, node = node, node.next
        if node is None:
            return False
        if prev is None:              # era el primero
            self.first = node.next
        else:
            prev.next = node.next
        if node is self.last:         # era el último: last pasa al anterior
            self.last = prev
        self.__count -= 1
        return True

    def split_priority(self):
        vip = TurnQueue()
        vip.__next_number = self.__next_number
        prev, node = None, self.first
        while node is not None:
            nxt = node.next
            if node.value.priority:
                # desenganchar el nodo de esta cola…
                if prev is None:
                    self.first = nxt
                else:
                    prev.next = nxt
                if node is self.last:
                    self.last = prev
                self.__count -= 1
                vip.__append(node.value)   # …y añadir su turno al final de la nueva
            else:
                prev = node
            node = nxt
        return vip
