# Programa 2 · Buscar un turno, llamada a llamada
# Del artículo «Recursividad en Python — práctica con la cola del comedor, una búsqueda de turnos con traza y un pedido de grupo (y el turno que estaba en la posición equivocada)»
# https://sergiolearns.com/recursividad-en-python-practica/

TURNOS = [3, 8, 12, 15, 21, 27, 30, 34, 41, 47, 52, 58, 63, 70, 76, 81]


def buscar(turnos, turno, inf, sup, llamada=1):
    """Busca turno entre las posiciones inf y sup - 1."""
    if inf >= sup:
        print(f"  Llamada {llamada}: zona vacía, no está")
        return -1
    medio = (inf + sup) // 2
    print(f"  Llamada {llamada}: miro de {inf} a {sup - 1}, en el medio hay {turnos[medio]}")
    if turnos[medio] == turno:
        return medio
    if turnos[medio] > turno:
        return buscar(turnos, turno, inf, medio, llamada + 1)
    return buscar(turnos, turno, medio + 1, sup, llamada + 1)


def buscar_turno(turnos, turno):
    return buscar(turnos, turno, 0, len(turnos))


for turno in [58, 3, 50]:
    print(f"Busco el turno {turno}")
    print("  Posición:", buscar_turno(TURNOS, turno))
