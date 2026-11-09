def seleccion(lista):
    n = len(lista)
    for i in range(n - 1):
        i_min = i
        for j in range(i + 1, n):
            if lista[j] < lista[i_min]:
                i_min = j
        lista[i], lista[i_min] = lista[i_min], lista[i]


notas = [7, 3, 9, 5, 10, 4, 8, 6]
seleccion(notas)
print(notas)
