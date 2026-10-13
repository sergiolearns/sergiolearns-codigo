# Estrategia 1 — Crear lista nueva (fácil de entender)
# Del artículo «LinkedList en Python — 3 programas reales que consolidan la estructura»
# https://sergiolearns.com/linkedlist-en-python-practica/

def invertir_nueva(self):
    """Devuelve una nueva LinkedList con los elementos en orden inverso."""
    resultado = LinkedList()
    for valor in self:                    # recorre de izquierda a derecha
        resultado.insertar_delante(valor) # inserta al principio cada vez
    return resultado
