# Solución del Nivel 2
# Del artículo «Mutabilidad, copias y matrices en Python — ejercicios con una lista de la compra, un ticket y un stock de almacenes (y el producto que zip se comió)»
# https://sergiolearns.com/mutabilidad-copias-y-matrices-en-python-ejercicios/

def ticket(precios, cantidades):
    """Devuelve (importes, total) con un importe por línea."""
    importes = [precio * cantidad for precio, cantidad in zip(precios, cantidades)]
    return importes, sum(importes)


PRODUCTOS = ["Pan", "Leche", "Huevos", "Arroz"]
PRECIOS = [1.20, 0.95, 2.40, 1.75]
CANTIDADES = [2, 3, 1, 4]

importes, total = ticket(PRECIOS, CANTIDADES)
for producto, importe in zip(PRODUCTOS, importes):
    print(producto, f"{importe:.2f}")
print("Total:", f"{total:.2f}")

caros = [producto for producto, importe in zip(PRODUCTOS, importes) if importe > 3]
print("Más de 3 €:", caros)
