# Solución Ejercicio 3:
# Del artículo «LinkedList en Python — ejercicios para dominar las estructuras encadenadas»
# https://sergiolearns.com/linkedlist-en-python-ejercicios/

def tiene_ciclo(self):
    """
    Detecta si la lista tiene un ciclo usando el algoritmo de Floyd.
    O(n) tiempo, O(1) espacio — no usa memoria extra.
    """
    # Caso especial — lista vacía o un solo nodo sin ciclo
    if self.__primero is None:
        return False
    if self.__primero.siguiente is None:
        return False

    tortuga = self.__primero           # avanza 1 nodo por iteración
    liebre = self.__primero.siguiente  # avanza 2 nodos por iteración

    while liebre is not None and liebre.siguiente is not None:
        if tortuga is liebre:          # se encontraron → hay ciclo
            return True
        tortuga = tortuga.siguiente
        liebre = liebre.siguiente.siguiente

    return False    # liebre llegó a None → no hay ciclo


# ── Pruebas ────────────────────────────────────────────────────────────

# Lista normal sin ciclo
lista_normal = LinkedList()
for v in [10, 20, 30, 40]:
    lista_normal.insertar_detras(v)

print(f"Lista normal: {lista_normal}")
print(f"tiene_ciclo() → {lista_normal.tiene_ciclo()}")    # → False

# Lista vacía
lista_vacia = LinkedList()
print(f"\nLista vacía:")
print(f"tiene_ciclo() → {lista_vacia.tiene_ciclo()}")     # → False

# Lista de un elemento sin ciclo
lista_uno = LinkedList()
lista_uno.insertar_delante(42)
print(f"\nUn elemento sin ciclo:")
print(f"tiene_ciclo() → {lista_uno.tiene_ciclo()}")       # → False

# Lista de un elemento con ciclo (apunta a sí mismo)
lista_ciclo_uno = LinkedList()
lista_ciclo_uno.insertar_delante(42)
nodo = lista_ciclo_uno._LinkedList__primero
nodo.siguiente = nodo    # apunta a sí mismo
print(f"\nUn elemento con ciclo:")
print(f"tiene_ciclo() → {lista_ciclo_uno.tiene_ciclo()}")  # → True

# Lista con ciclo (el último apunta al segundo)
lista_ciclo = LinkedList()
for v in [10, 20, 30, 40]:
    lista_ciclo.insertar_detras(v)

# Crear el ciclo manualmente: [40] → [20]
nodo_actual = lista_ciclo._LinkedList__primero
nodo_segundo = nodo_actual.siguiente
while nodo_actual.siguiente is not None:
    nodo_actual = nodo_actual.siguiente
nodo_actual.siguiente = nodo_segundo    # [40] → [20]

print(f"\nLista con ciclo (40 → 20):")
print(f"tiene_ciclo() → {lista_ciclo.tiene_ciclo()}")     # → True
