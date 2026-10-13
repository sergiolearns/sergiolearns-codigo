# Solución Ejercicio 1:
# Del artículo «LinkedList en Python — ejercicios para dominar las estructuras encadenadas»
# https://sergiolearns.com/linkedlist-en-python-ejercicios/

def obtener(self, posicion):
    """Devuelve el valor en la posición dada (desde 0). Lanza IndexError si no existe."""
    if posicion < 0 or posicion >= self.__longitud:
        raise IndexError(
            f"posición {posicion} fuera de rango (longitud {self.__longitud})"
        )
    actual = self.__primero
    for _ in range(posicion):
        actual = actual.siguiente
    return actual.valor


def obtener_desde_final(self, posicion):
    """
    Devuelve el valor en la posición desde el final (0=último).
    Usa dos punteros — un solo recorrido, sin conocer la longitud.
    """
    if posicion < 0:
        raise IndexError(f"posición {posicion} no puede ser negativa")

    # Adelantar el puntero rápido posicion+1 pasos
    rapido = self.__primero
    for _ in range(posicion + 1):
        if rapido is None:
            raise IndexError(
                f"posición {posicion} desde el final fuera de rango"
            )
        rapido = rapido.siguiente

    # Avanzar los dos juntos hasta que rápido llegue a None
    lento = self.__primero
    while rapido is not None:
        lento = lento.siguiente
        rapido = rapido.siguiente

    # lento apunta al nodo en la posición correcta desde el final
    return lento.valor


# ── Pruebas ────────────────────────────────────────────────────────────

lista = LinkedList()
for v in [10, 20, 30, 40, 50]:
    lista.insertar_detras(v)

print(f"Lista: {lista}")
# → 10 → 20 → 30 → 40 → 50 → None

print(f"\nobtener(0) → {lista.obtener(0)}")    # → 10
print(f"obtener(2) → {lista.obtener(2)}")    # → 30
print(f"obtener(4) → {lista.obtener(4)}")    # → 50

try:
    lista.obtener(5)
except IndexError as e:
    print(f"obtener(5) → IndexError: {e}")
# → IndexError: posición 5 fuera de rango (longitud 5)

try:
    lista.obtener(-1)
except IndexError as e:
    print(f"obtener(-1) → IndexError: {e}")

print(f"\nobtener_desde_final(0) → {lista.obtener_desde_final(0)}")   # → 50
print(f"obtener_desde_final(1) → {lista.obtener_desde_final(1)}")   # → 40
print(f"obtener_desde_final(4) → {lista.obtener_desde_final(4)}")   # → 10

try:
    lista.obtener_desde_final(5)
except IndexError as e:
    print(f"obtener_desde_final(5) → IndexError: {e}")
