# Simulacro práctico de FP2 · versión B · Deshacer y rehacer en un editor (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from containerbase import ContainerBase


class UndoHistory(ContainerBase):
    class Node:
        def __init__(self, value, prev=None, next=None):
            self.value = value        # la acción (str)
            self.prev = prev
            self.next = next

    def __init__(self):
        self.first = None
        self.current = None           # nodo de la última acción hecha (None = estado inicial)

    def do(self, action):
        node = UndoHistory.Node(action, self.current)
        if self.current is None:
            # estado inicial: lo que hubiera se pierde y la acción es la primera
            self.first = node
        else:
            # cortar lo que había detrás de current y enganchar la nueva
            self.current.next = node
        self.current = node

    def undo(self):
        if self.current is None:
            return None
        action = self.current.value
        self.current = self.current.prev     # puede quedar en None: estado inicial
        return action

    def redo(self):
        following = self.first if self.current is None else self.current.next
        if following is None:
            return None
        self.current = following
        return following.value

    @property
    def current_action(self):
        return None if self.current is None else self.current.value

    def __len__(self):
        n, node = 0, self.first
        while node is not None:
            n, node = n + 1, node.next
        return n

    def count(self, action):
        n, node = 0, self.first
        while node is not None:
            if node.value == action:
                n += 1
            node = node.next
        return n
