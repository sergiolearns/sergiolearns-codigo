# Programa 1 · El ticket de la compra
# Del artículo «Mutabilidad, copias y matrices en Python — práctica con un ticket de compra, un carrito que cambia y una tabla de precios (y la lista ordenada que era None)»
# https://sergiolearns.com/mutabilidad-copias-y-matrices-en-python-practica/

PRODUCTOS = ["Pan", "Leche", "Huevos", "Arroz", "Aceite"]
PRECIOS = [1.20, 0.95, 2.40, 1.75, 6.90]
CANTIDADES = [2, 3, 1, 2, 1]
IVA = 0.10


def importes(precios, cantidades):
    """Importe de cada línea: precio por cantidad."""
    return [precio * cantidad for precio, cantidad in zip(precios, cantidades)]


lineas = importes(PRECIOS, CANTIDADES)

for num, (producto, cantidad, importe) in enumerate(zip(PRODUCTOS, CANTIDADES, lineas), 1):
    print(f"{num}. {producto} x{cantidad} -> {importe:.2f} €")

subtotal = sum(lineas)
print(f"Subtotal: {subtotal:.2f} €")
print(f"IVA ({IVA:.0%}): {subtotal * IVA:.2f} €")
print(f"Total: {subtotal * (1 + IVA):.2f} €")

caras = [producto for producto, importe in zip(PRODUCTOS, lineas) if importe > 5]
print("Líneas de más de 5 €:", caras)
