# LinkedList en Python práctica — Programa 1: Buscar y contar elementos con condiciones
# Del artículo «LinkedList en Python — 3 programas reales que consolidan la estructura»
# https://sergiolearns.com/linkedlist-en-python-practica/

# Construimos la lista con estos valores
lista = LinkedListBusqueda()
for v in [15, 8, 42, 3, 27, 19, 8, 11, 35, 8]:
    lista.insertar_detras(v)

print("Lista inicial:")
print(lista)
# → 15 → 8 → 42 → 3 → 27 → 19 → 8 → 11 → 35 → 8 → None

print(f"\nLongitud: {len(lista)}")         # → 10
print(f"Suma:     {lista.suma()}")         # → 176
print(f"Media:    {lista.media():.2f}")    # → 17.60
print(f"Máximo:   {lista.maximo()}")       # → 42
print(f"Mínimo:   {lista.minimo()}")       # → 3

# Contar con condiciones
print(f"\nMayores que 15:  {lista.contar(lambda x: x > 15)}")   # → 4
print(f"Pares:           {lista.contar(lambda x: x % 2 == 0)}") # → 4
print(f"Cuántos valen 8: {lista.contar(lambda x: x == 8)}")     # → 3
print(f"Total elementos: {lista.contar()}")                       # → 10

# Filtrar — devuelve nueva lista
mayores = lista.filtrar(lambda x: x > 15)
print(f"\nMayores que 15:")
print(mayores)
# → 42 → 27 → 19 → 35 → None

pares = lista.filtrar(lambda x: x % 2 == 0)
print(f"\nSolo pares:")
print(pares)
# → 8 → 42 → 8 → 8 → None

# La lista original no se modifica
print(f"\nLista original intacta:")
print(lista)
# → 15 → 8 → 42 → 3 → 27 → 19 → 8 → 11 → 35 → 8 → None
