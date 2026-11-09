def insercion(lista):
    for i in range(1, len(lista)):
        clave = lista[i]
        j = i - 1
        while j >= 0 and lista[j] > clave:
            lista[j + 1] = lista[j]
            j = j - 1
        lista[j + 1] = clave


notas = [7, 3, 9, 5, 10, 4, 8, 6]
insercion(notas)
print(notas)
