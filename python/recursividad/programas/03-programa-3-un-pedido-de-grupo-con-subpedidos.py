# Programa 3 · Un pedido de grupo con subpedidos
# Del artículo «Recursividad en Python — práctica con la cola del comedor, una búsqueda de turnos con traza y un pedido de grupo (y el turno que estaba en la posición equivocada)»
# https://sergiolearns.com/recursividad-en-python-practica/

PEDIDO = [
    5.50,                       # Ana: menú
    [5.00, 2.25],               # Luis: menú y postre
    [                           # mesa del grupo de prácticas
        5.50,
        [5.00, 1.50],           # Pablo: menú y café
        5.50,
    ],
    2.25,                       # Sara: postre
]


def total(pedido):
    """Suma todos los precios, estén al nivel que estén."""
    if pedido == []:
        return 0
    primero = pedido[0]
    if isinstance(primero, list):           # el primero es un subpedido
        return total(primero) + total(pedido[1:])
    return primero + total(pedido[1:])


def contar_platos(pedido):
    """Cuenta los precios sueltos (los platos)."""
    if pedido == []:
        return 0
    primero = pedido[0]
    if isinstance(primero, list):
        return contar_platos(primero) + contar_platos(pedido[1:])
    return 1 + contar_platos(pedido[1:])


def aplanar(pedido):
    """Devuelve una lista con todos los precios, sin anidar."""
    if pedido == []:
        return []
    primero = pedido[0]
    if isinstance(primero, list):
        return aplanar(primero) + aplanar(pedido[1:])
    return [primero] + aplanar(pedido[1:])


def niveles(pedido):
    """Cuántos niveles de listas hay, contando el de fuera."""
    maximo = 1
    for elemento in pedido:
        if isinstance(elemento, list):
            maximo = max(maximo, 1 + niveles(elemento))
    return maximo


print(f"Total: {total(PEDIDO):.2f} €")
print("Platos:", contar_platos(PEDIDO))
print("Lista plana:", aplanar(PEDIDO))
print("Niveles:", niveles(PEDIDO))
