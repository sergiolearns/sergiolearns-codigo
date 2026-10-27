# Simulacro práctico de FP2 · versión A · Cola de turnos de una tienda (clase dada)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
class ContainerBase:
    """Muestra la lista enlazada: ➡ es first, ⬅ marca el nodo last y -> es next (ya hecha: no la toques)."""

    def __str__(self):
        text, node, steps = "➡", self.first, 0
        while node is not None and steps < 1000:      # tope por si la lista tiene un ciclo
            text += "[" + str(node.value) + "]"
            if node is getattr(self, "last", None):
                text += "⬅"
            text += "->"
            node, steps = node.next, steps + 1
        return text + ("..." if node is not None else "None")
