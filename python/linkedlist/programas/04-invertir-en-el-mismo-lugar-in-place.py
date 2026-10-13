# Estrategia 2 — Invertir en el mismo lugar (in-place)
# Del artículo «LinkedList en Python — 3 programas reales que consolidan la estructura»
# https://sergiolearns.com/linkedlist-en-python-practica/

def invertir_inplace(self):
    """Invierte la lista en el mismo lugar, sin crear una nueva."""
    anterior = None
    actual = self._LinkedList__primero    # acceso al atributo privado

    while actual is not None:
        siguiente = actual.siguiente      # guardamos el siguiente ANTES de modificar
        actual.siguiente = anterior       # invertimos el puntero
        anterior = actual                 # avanzamos anterior
        actual = siguiente                # avanzamos actual

    self._LinkedList__primero = anterior  # el nuevo primero es el último original
