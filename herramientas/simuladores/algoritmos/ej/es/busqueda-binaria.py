def busqueda_binaria(lista, buscado):
    inf = 0
    sup = len(lista) - 1
    while inf <= sup:
        medio = (inf + sup) // 2
        if lista[medio] == buscado:
            return medio
        elif lista[medio] < buscado:
            inf = medio + 1
        else:
            sup = medio - 1
    return -1


turnos = [3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85, 90]
buscado = 58
print("Turno en la posición", busqueda_binaria(turnos, buscado))
