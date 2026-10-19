# Solución del Nivel 3
# Del artículo «Recursividad en Python — ejercicios con la cola del comedor, una salida al revés y una cola encadenada (y la persona de más que nunca existió)»
# https://sergiolearns.com/recursividad-en-python-ejercicios/

def desde_lista(lista):
    """Convierte una lista de Python en una cola encadenada (nombre, resto)."""
    if lista == []:
        return ()
    return (lista[0], desde_lista(lista[1:]))


def longitud(cola):
    if cola == ():
        return 0
    nombre, resto = cola
    return 1 + longitud(resto)


def a_texto(cola):
    """Devuelve la cola como 'Ana -> Luis -> Marta'."""
    if cola == ():
        return "(vacía)"
    nombre, resto = cola
    if resto == ():
        return nombre
    return nombre + " -> " + a_texto(resto)


def colarse(cola, nombre, delante_de):
    """Devuelve una cola nueva con nombre justo delante de delante_de.
    Si delante_de no está, nombre se pone al final."""
    if cola == ():
        return (nombre, ())
    primero, resto = cola
    if primero == delante_de:
        return (nombre, cola)
    return (primero, colarse(resto, nombre, delante_de))


cola = desde_lista(["Ana", "Luis", "Marta"])
print(cola)
print(longitud(cola), "personas:", a_texto(cola))
nueva = colarse(cola, "Pablo", "Marta")
print(a_texto(nueva))
print(a_texto(colarse(cola, "Sara", "Lucía")))
print(a_texto(cola))
print(a_texto(()))
