# Simulacro práctico de FP2 · versión B · Deshacer y rehacer en un editor (clase dada)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
class ContainerBase:
    """Muestra el historial: {*…*} marca el nodo current y <-> une prev y next (ya hecha: no la toques)."""

    def __str__(self):
        text, node, steps = "", self.first, 0
        while node is not None and steps < 1000:      # tope por si hay un ciclo
            box = "{*" + str(node.value) + "*}" if node is self.current else "[" + str(node.value) + "]"
            text += box if not text else "<->" + box
            node, steps = node.next, steps + 1
        return "->" + (text + "->None" if text else "None")
