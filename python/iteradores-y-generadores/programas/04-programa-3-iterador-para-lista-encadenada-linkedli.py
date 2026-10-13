# Iteradores y generadores en Python práctica — Programa 3: Iterador para lista encadenada (LinkedList)
# Del artículo «Iteradores y generadores en Python — 3 programas reales que los hacen tangibles»
# https://sergiolearns.com/iteradores-y-generadores-en-python-practica/

# Construir la lista
lista = LinkedList()
lista.insertar_detras(10)
lista.insertar_detras(20)
lista.insertar_detras(30)
lista.insertar_detras(40)
lista.insertar_detras(50)

print(f"Lista: {lista}")
# → 10 → 20 → 30 → 40 → 50 → None

print(f"Longitud: {len(lista)}")
# → 5

# Recorrer con for — usa __iter__ automáticamente
print("\nRecorrido con for:")
for valor in lista:
    print(valor, end=' ')
print()
# → 10 20 30 40 50

# Recorrer con iter() y next() explícito
print("\nRecorrido con iter() y next():")
it = iter(lista)
print(next(it))    # → 10
print(next(it))    # → 20
print(next(it))    # → 30

# Usar en comprensiones y funciones built-in
print(f"\nSuma: {sum(lista)}")
print(f"Máximo: {max(lista)}")
print(f"Mínimo: {min(lista)}")
print(f"Como lista: {list(lista)}")
# → Suma: 150
# → Máximo: 50
# → Mínimo: 10
# → Como lista: [10, 20, 30, 40, 50]

# Varios recorridos independientes — cada for crea un iterador nuevo
print("\nVarios recorridos independientes:")
for v in lista:
    print(f"  Externo: {v}")
    # un segundo for sobre la misma lista funciona correctamente
    # porque __iter__ crea un nuevo generador cada vez

# Recorrido múltiple — funciona porque __iter__ se llama de nuevo
print("\nLista recorrida dos veces:")
print("Primera vez:", list(lista))
print("Segunda vez:", list(lista))
# → ambas dan [10, 20, 30, 40, 50] — no se agota
