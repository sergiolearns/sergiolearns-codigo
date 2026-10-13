# Programa 2 · Un carrito que cambia
# Del artículo «Mutabilidad, copias y matrices en Python — práctica con un ticket de compra, un carrito que cambia y una tabla de precios (y la lista ordenada que era None)»
# https://sergiolearns.com/mutabilidad-copias-y-matrices-en-python-practica/

def anadir(carrito, producto, precio):
    """Añade un producto al final del carrito (modifica el carrito)."""
    carrito.append((producto, precio))


def quitar(carrito, producto):
    """Quita el primer producto con ese nombre. Devuelve True si lo quitó."""
    for pos, (nombre, precio) in enumerate(carrito):
        if nombre == producto:
            carrito.pop(pos)
            return True
    return False


def con_descuento(carrito, porcentaje):
    """Devuelve un carrito NUEVO con los precios rebajados (no toca el original)."""
    return [(nombre, round(precio * (1 - porcentaje), 2)) for nombre, precio in carrito]


def total(carrito):
    """Suma de los precios del carrito."""
    return sum([precio for nombre, precio in carrito])


carrito = [("Pan", 1.20), ("Leche", 0.95)]
anadir(carrito, "Arroz", 1.75)
anadir(carrito, "Aceite", 6.90)
print(carrito)
print("Quitar Leche:", quitar(carrito, "Leche"))
print("Quitar Café:", quitar(carrito, "Café"))
print(carrito)

rebajado = con_descuento(carrito, 0.20)
print(rebajado)
print(carrito)
print(f"Total: {total(carrito):.2f} € -> {total(rebajado):.2f} €")

precios = [precio for nombre, precio in carrito]
ordenados = sorted(precios, reverse=True)
print("Precios de mayor a menor:", ordenados)
print("Lista original:", precios)
