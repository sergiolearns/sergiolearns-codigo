def ordenar_mezcla(lista):
    if len(lista) <= 1:
        return lista
    medio = len(lista) // 2
    izq = ordenar_mezcla(lista[:medio])
    der = ordenar_mezcla(lista[medio:])
    return mezclar(izq, der)


def mezclar(izq, der):
    resultado = []
    i = 0
    j = 0
    while i < len(izq) and j < len(der):
        if izq[i] <= der[j]:
            resultado.append(izq[i])
            i = i + 1
        else:
            resultado.append(der[j])
            j = j + 1
    resultado.extend(izq[i:])
    resultado.extend(der[j:])
    return resultado


notas = [7, 3, 9, 5, 10, 4, 8, 6]
notas = ordenar_mezcla(notas)
print(notas)
