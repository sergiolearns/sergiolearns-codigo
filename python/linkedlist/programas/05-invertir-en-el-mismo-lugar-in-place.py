# Estrategia 2 — Invertir en el mismo lugar (in-place)
# Del artículo «LinkedList en Python — 3 programas reales que consolidan la estructura»
# https://sergiolearns.com/linkedlist-en-python-practica/

lista = LinkedList()
for v in [10, 20, 30, 40, 50]:
    lista.insertar_detras(v)

print("Lista original:")
print(lista)
# → 10 → 20 → 30 → 40 → 50 → None

# Estrategia 1 — nueva lista
invertida = lista.invertir_nueva()
print("\nInvertida (nueva lista):")
print(invertida)
# → 50 → 40 → 30 → 20 → 10 → None

print("\nOriginal intacta:")
print(lista)
# → 10 → 20 → 30 → 40 → 50 → None

# Estrategia 2 — in-place
lista.invertir_inplace()
print("\nLista después de invertir_inplace:")
print(lista)
# → 50 → 40 → 30 → 20 → 10 → None

# Casos especiales
lista_vacia = LinkedList()
lista_vacia.invertir_inplace()
print("\nLista vacía invertida:")
print(lista_vacia)
# → None

lista_un_elemento = LinkedList()
lista_un_elemento.insertar_delante(42)
lista_un_elemento.invertir_inplace()
print("\nLista de un elemento invertida:")
print(lista_un_elemento)
# → 42 → None
