# Programa 3 · Una tabla de precios por tienda
# Del artículo «Mutabilidad, copias y matrices en Python — práctica con un ticket de compra, un carrito que cambia y una tabla de precios (y la lista ordenada que era None)»
# https://sergiolearns.com/mutabilidad-copias-y-matrices-en-python-practica/

TIENDAS = ["Mercado", "Súper", "Online"]
PRODUCTOS = ["Pan", "Leche", "Aceite"]
PRECIOS = [
    [1.20, 0.85, 6.90],     # Mercado
    [1.10, 0.95, 7.20],     # Súper
    [1.35, 0.80, 6.50],     # Online
]

# Una unidad de cada producto, por tienda (la suma de cada fila)
for tienda, fila in zip(TIENDAS, PRECIOS):
    print(tienda, round(sum(fila), 2))

# Producto a producto: la tienda más barata (recorrido por columnas)
for j, producto in enumerate(PRODUCTOS):
    columna = [fila[j] for fila in PRECIOS]
    barata = columna.index(min(columna))
    print(producto, "->", TIENDAS[barata], min(columna))

# Una tabla nueva con un 10 % de descuento (comprehension dentro de otra)
rebajados = [[round(precio * 0.90, 2) for precio in fila] for fila in PRECIOS]
print(rebajados[0])
print(PRECIOS[0])

# Copiar una matriz: hay que copiar cada fila
copia = [fila[:] for fila in PRECIOS]
copia[1][0] = 0.99
print(PRECIOS[1], copia[1])
