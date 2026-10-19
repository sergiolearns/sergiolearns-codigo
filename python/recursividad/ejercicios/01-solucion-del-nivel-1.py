# Solución del Nivel 1
# Del artículo «Recursividad en Python — ejercicios con la cola del comedor, una salida al revés y una cola encadenada (y la persona de más que nunca existió)»
# https://sergiolearns.com/recursividad-en-python-ejercicios/

def cuenta_atras(delante):
    """Anuncia cuántos quedan delante hasta que te toca."""
    if delante == 0:
        print("¡Me toca!")
    else:
        print(f"Quedan {delante} delante")
        cuenta_atras(delante - 1)


def total(precios):
    """Suma los precios de una lista de bandejas."""
    if precios == []:
        return 0
    return precios[0] + total(precios[1:])


def contar_caros(precios, limite):
    """Cuenta los precios mayores que limite."""
    if precios == []:
        return 0
    if precios[0] > limite:
        return 1 + contar_caros(precios[1:], limite)
    return contar_caros(precios[1:], limite)


cuenta_atras(3)
precios = [5.50, 2.25, 5.00, 1.50, 5.50]
print(f"Total: {total(precios):.2f} €")
print("Bandejas de más de 5 €:", contar_caros(precios, 5))
