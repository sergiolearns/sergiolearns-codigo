# Solución del Nivel 3
# Del artículo «Mutabilidad, copias y matrices en Python — ejercicios con una lista de la compra, un ticket y un stock de almacenes (y el producto que zip se comió)»
# https://sergiolearns.com/mutabilidad-copias-y-matrices-en-python-ejercicios/

STOCK = [
    [12, 5, 0, 8],     # almacén 0
    [3, 9, 14, 0],     # almacén 1
    [7, 0, 6, 10],     # almacén 2
]


def totales_por_almacen(stock):
    return [sum(fila) for fila in stock]


def totales_por_producto(stock):
    return [sum([fila[j] for fila in stock]) for j in range(len(stock[0]))]


def transponer(stock):
    return [[fila[j] for fila in stock] for j in range(len(stock[0]))]


def reponer(stock, almacen, cantidad):
    """Devuelve un stock NUEVO con 'cantidad' unidades más de cada producto en ese almacén."""
    nuevo = [fila[:] for fila in stock]
    nuevo[almacen] = [unidades + cantidad for unidades in nuevo[almacen]]
    return nuevo


print("Por almacén:", totales_por_almacen(STOCK))
print("Por producto:", totales_por_producto(STOCK))
print("Transpuesta:", transponer(STOCK))
repuesto = reponer(STOCK, 1, 5)
print("Almacén 1 repuesto:", repuesto[1])
print("Original:", STOCK[1])
