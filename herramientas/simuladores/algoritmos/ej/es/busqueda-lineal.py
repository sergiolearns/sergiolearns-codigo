def buscar(lista, buscado):
    for i in range(len(lista)):
        if lista[i] == buscado:
            return i
    return -1


notas = [7, 3, 9, 5, 10, 4, 8, 6]
buscado = 10
print("Está en la posición", buscar(notas, buscado))
