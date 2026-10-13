# Ejercicio 1 — Obtener el elemento en la posición N
# Del artículo «LinkedList en Python — ejercicios para dominar las estructuras encadenadas»
# https://sergiolearns.com/linkedlist-en-python-ejercicios/

# MAL — no valida la posición
def obtener(self, posicion):
    actual = self.__primero
    for i in range(posicion):
        actual = actual.siguiente    # si posicion > longitud → AttributeError en None.siguiente
    return actual.valor              # si lista vacía → AttributeError en None.valor

# BIEN — valida primero
def obtener(self, posicion):
    if posicion < 0 or posicion >= self.__longitud:
        raise IndexError(f"posición {posicion} fuera de rango (longitud {self.__longitud})")
    actual = self.__primero
    for _ in range(posicion):
        actual = actual.siguiente
    return actual.valor
