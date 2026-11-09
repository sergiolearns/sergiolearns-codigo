def burbuja(lista):
    n = len(lista)
    for vuelta in range(n - 1):
        hubo_cambio = False
        for j in range(n - 1 - vuelta):
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
                hubo_cambio = True
        if not hubo_cambio:
            break


notas = [7, 3, 9, 5, 10, 4, 8, 6]
burbuja(notas)
print(notas)
