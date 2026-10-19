# Solución del Nivel 2
# Del artículo «Recursividad en Python — ejercicios con la cola del comedor, una salida al revés y una cola encadenada (y la persona de más que nunca existió)»
# https://sergiolearns.com/recursividad-en-python-ejercicios/

def invertir(cola):
    """Devuelve la cola en orden inverso, sin modificar la original."""
    if cola == []:
        return []
    return invertir(cola[1:]) + [cola[0]]


def quitar(cola, nombre):
    """Devuelve una cola nueva sin ninguna aparición de nombre."""
    if cola == []:
        return []
    if cola[0] == nombre:
        return quitar(cola[1:], nombre)
    return [cola[0]] + quitar(cola[1:], nombre)


cola = ["Ana", "Luis", "Marta", "Luis", "Pablo"]
print(invertir(cola))
print(quitar(cola, "Luis"))
print(quitar(cola, "Lucía"))
print(cola)
