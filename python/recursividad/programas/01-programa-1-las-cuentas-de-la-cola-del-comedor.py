# Programa 1 · Las cuentas de la cola del comedor
# Del artículo «Recursividad en Python — práctica con la cola del comedor, una búsqueda de turnos con traza y un pedido de grupo (y el turno que estaba en la posición equivocada)»
# https://sergiolearns.com/recursividad-en-python-practica/

COLA = [
    ("Ana", "normal", 5.50),
    ("Luis", "vegetariano", 5.00),
    ("Marta", "normal", 5.50),
    ("Pablo", "vegetariano", 5.00),
    ("Sara", "postre", 2.25),
]


def total(cola):
    """Suma lo que paga toda la cola."""
    if cola == []:
        return 0
    nombre, menu, precio = cola[0]
    return precio + total(cola[1:])


def contar_menu(cola, tipo):
    """Cuenta las bandejas de un tipo de menú."""
    if cola == []:
        return 0
    nombre, menu, precio = cola[0]
    if menu == tipo:
        return 1 + contar_menu(cola[1:], tipo)
    return contar_menu(cola[1:], tipo)


def mas_cara(cola):
    """Devuelve la bandeja más cara (la cola no puede estar vacía)."""
    if len(cola) == 1:                    # caso base: una sola bandeja
        return cola[0]
    la_del_resto = mas_cara(cola[1:])
    if cola[0][2] >= la_del_resto[2]:
        return cola[0]
    return la_del_resto


def posicion(cola, nombre, pos=0):
    """Posición de nombre en la cola, o -1 si no está."""
    if pos == len(cola):                  # hemos mirado a todos
        return -1
    if cola[pos][0] == nombre:
        return pos
    return posicion(cola, nombre, pos + 1)


print(f"Total a cobrar: {total(COLA):.2f} €")
print("Menús vegetarianos:", contar_menu(COLA, "vegetariano"))
print("Bandeja más cara:", mas_cara(COLA))
print("Pablo está en la posición", posicion(COLA, "Pablo"))
print("Lucía está en la posición", posicion(COLA, "Lucía"))
