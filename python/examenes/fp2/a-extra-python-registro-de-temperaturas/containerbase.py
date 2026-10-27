# Simulacro práctico de FP2 · versión A · Registro de temperaturas (clase dada)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
class ContainerBase:
    """Muestra la secuencia desde first; -> es next (ya hecha: no la toques)."""

    def __str__(self):
        text, node, steps = "|->", self.first, 0
        while node is not None and steps < 1000:      # tope por si hay un ciclo
            text += str(node.value) + "->"
            node, steps = node.next, steps + 1
        return text + ("..." if node is not None else "None")
