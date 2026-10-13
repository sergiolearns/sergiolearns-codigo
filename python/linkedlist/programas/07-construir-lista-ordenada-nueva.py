# Implementación — construir lista ordenada nueva
# Del artículo «LinkedList en Python — 3 programas reales que consolidan la estructura»
# https://sergiolearns.com/linkedlist-en-python-practica/

lista = LinkedList()
for v in [15, 3, 42, 8, 27, 1, 19]:
    lista.insertar_detras(v)

print("Lista original:")
print(lista)
# → 15 → 3 → 42 → 8 → 27 → 1 → 19 → None

ordenada = lista.ordenar()
print("\nLista ordenada:")
print(ordenada)
# → 1 → 3 → 8 → 15 → 19 → 27 → 42 → None

print("\nOriginal intacta:")
print(lista)
# → 15 → 3 → 42 → 8 → 27 → 1 → 19 → None

# Casos especiales
lista_vacia = LinkedList()
print(f"\nLista vacía ordenada: {lista_vacia.ordenar()}")
# → None

lista_un_elemento = LinkedList()
lista_un_elemento.insertar_delante(42)
print(f"Lista de un elemento ordenada: {lista_un_elemento.ordenar()}")
# → 42 → None

lista_iguales = LinkedList()
for v in [5, 5, 5, 5]:
    lista_iguales.insertar_detras(v)
print(f"Lista de iguales ordenada: {lista_iguales.ordenar()}")
# → 5 → 5 → 5 → 5 → None

# Demostración completa con insertar_ordenado
print("\nInsertar_ordenado paso a paso:")
resultado = LinkedList()
for v in [15, 3, 42, 8, 27]:
    resultado.insertar_ordenado(v)
    print(f"Después de insertar {v:2d}: {resultado}")
