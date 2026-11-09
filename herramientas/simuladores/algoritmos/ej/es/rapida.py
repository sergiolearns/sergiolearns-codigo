def ordenacion_rapida(lista, inf, sup):
    if inf < sup:
        p = particion(lista, inf, sup)
        ordenacion_rapida(lista, inf, p - 1)
        ordenacion_rapida(lista, p + 1, sup)


def particion(lista, inf, sup):
    pivote = lista[sup]
    i = inf
    for j in range(inf, sup):
        if lista[j] <= pivote:
            lista[i], lista[j] = lista[j], lista[i]
            i = i + 1
    lista[i], lista[sup] = lista[sup], lista[i]
    return i


notas = [7, 3, 9, 5, 10, 4, 8, 6]
ordenacion_rapida(notas, 0, len(notas) - 1)
print(notas)
