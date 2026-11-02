# Programa 1 · El ticket de la compra
# Del artículo «Mutabilidad, copias y matrices en Python — práctica con un ticket con IGIC, un carrito que cambia y una tabla de precios (y la lista ordenada que era None)»
# https://sergiolearns.com/mutabilidad-copias-y-matrices-en-python-practica/

PRODUCTOS = ["Pan", "Leche", "Huevos", "Arroz", "Aceite"]
PRECIOS = [1.20, 0.95, 2.40, 1.75, 6.90]
CANTIDADES = [2, 3, 1, 2, 1]
IGIC = 0.07                                     # el impuesto de Canarias, en tanto por uno


def importes(precios, cantidades):
    """Importe de cada línea: precio por cantidad (lista NUEVA)."""
    return [precio * cantidad for precio, cantidad in zip(precios, cantidades)]


assert len(PRODUCTOS) == len(PRECIOS) == len(CANTIDADES), "las listas no van en paralelo"
lineas = importes(PRECIOS, CANTIDADES)

for num, (producto, cantidad, importe) in enumerate(zip(PRODUCTOS, CANTIDADES, lineas), 1):
    print(f"{num}. {producto} x{cantidad} -> {importe:.2f} €")

subtotal = sum(lineas)
impuesto = round(subtotal * IGIC, 2)            # se redondea ANTES de sumar, como en un ticket
print(f"Subtotal: {subtotal:.2f} €")
print(f"IGIC ({IGIC:.0%}): {impuesto:.2f} €")
print(f"Total: {subtotal + impuesto:.2f} €")

caras = [producto for producto, importe in zip(PRODUCTOS, lineas) if importe > 5]
print("Líneas de más de 5 €:", caras)
