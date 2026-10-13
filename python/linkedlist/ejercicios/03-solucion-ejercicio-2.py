# Solución Ejercicio 2:
# Del artículo «LinkedList en Python — ejercicios para dominar las estructuras encadenadas»
# https://sergiolearns.com/linkedlist-en-python-ejercicios/

def eliminar_duplicados(self):
    """
    Elimina duplicados en el lugar, manteniendo la primera aparición.
    Modifica self — no crea lista nueva.
    """
    if self.__primero is None:    # lista vacía — nada que hacer
        return

    vistos = set()
    vistos.add(self.__primero.valor)

    anterior = self.__primero
    actual = self.__primero.siguiente

    while actual is not None:
        if actual.valor in vistos:
            # Es duplicado — eliminar: anterior no avanza
            anterior.siguiente = actual.siguiente
            actual = actual.siguiente
            self.__longitud -= 1
        else:
            # Primera aparición — guardar y avanzar ambos
            vistos.add(actual.valor)
            anterior = actual
            actual = actual.siguiente


# ── Pruebas ────────────────────────────────────────────────────────────

# Lista con duplicados
lista = LinkedList()
for v in [10, 20, 10, 30, 20, 40, 10]:
    lista.insertar_detras(v)

print(f"Antes:  {lista}")
lista.eliminar_duplicados()
print(f"Después: {lista}")
# → 10 → 20 → 30 → 40 → None
print(f"Longitud: {len(lista)}")    # → 4

# Lista sin duplicados — no debe cambiar
lista2 = LinkedList()
for v in [5, 8, 3]:
    lista2.insertar_detras(v)

print(f"\nAntes:  {lista2}")
lista2.eliminar_duplicados()
print(f"Después: {lista2}")
# → 5 → 8 → 3 → None

# Lista con todos iguales
lista3 = LinkedList()
for v in [7, 7, 7, 7]:
    lista3.insertar_detras(v)

print(f"\nAntes:  {lista3}")
lista3.eliminar_duplicados()
print(f"Después: {lista3}")
# → 7 → None
print(f"Longitud: {len(lista3)}")   # → 1

# Lista vacía — no debe lanzar error
lista4 = LinkedList()
lista4.eliminar_duplicados()
print(f"\nLista vacía después: {lista4}")
# → None

# Lista de un elemento — no debe cambiar
lista5 = LinkedList()
lista5.insertar_delante(42)
lista5.eliminar_duplicados()
print(f"Un elemento después: {lista5}")
# → 42 → None
