# Compruébalo con Python · Simulador 1: la carpeta de la práctica de IC2 con asignación contigua, enlazada, FAT e indexada
# Del artículo «Sistemas de archivos — teoría con la carpeta de tu práctica de IC2, FAT, i-nodos y enlaces (y el pendrive que no quiso el vídeo de la defensa)»
# https://sergiolearns.com/sistemas-de-archivos/

# La carpeta de la práctica de IC2 en un disco de 32 bloques: contigua, enlazada, FAT e indexada
B, P = 4096, 4                        # bloque de 4 KiB y enlace de 4 bytes
libres = [2, 3, 4, 7, 8, 9, 10, 12, 13, 17, 18, 19, 21, 22, 23, 24, 28, 29]   # el resto, ocupado
archivos = {'practica.c': 9300, 'Makefile': 410, 'datos.csv': 12288, 'informe.pdf': 18000}
K = 4                                 # leeremos el bloque 4 (el quinto) de informe.pdf

def bloques_para(tam, util):          # redondeo hacia arriba: medio bloque ocupa un bloque entero
    return -(-tam // util)

def tramos(lista):                    # agrupa los libres en huecos contiguos [inicio, largo]
    h = []
    for b in lista:
        if h and h[-1][0] + h[-1][1] == b:
            h[-1][1] += 1             # b sigue al hueco anterior: lo alarga
        else:
            h.append([b, 1])          # b empieza un hueco nuevo
    return h

print('CONTIGUA (primer hueco que quepa)')
huecos = tramos(libres)
for n, tam in archivos.items():
    k = bloques_para(tam, B)
    x = next((x for x in huecos if x[1] >= k), None)
    if x:                             # cabe: ocupa el principio del hueco
        print(f'  {n:<12} inicio {x[0]:>2}  bloques {k}  sobran {k * B - tam:>4} B')
        x[0] += k; x[1] -= k
    else:                             # hay sitio en total, pero no seguido
        print(f'  {n:<12} NO CABE: pide {k}, mayor hueco {max(x[1] for x in huecos)},'
              f' libres {sum(x[1] for x in huecos)}')
# enlazada: cada bloque guarda el enlace (4 B menos de datos); FAT: los enlaces van en la tabla
for nombre, util, indice, lect in (('ENLAZADA', B - P, 0, K + 1), ('FAT', B, 0, 1), ('INDEXADA', B, 1, 2)):
    lista = list(libres); print(nombre)
    for n, tam in archivos.items():
        k = bloques_para(tam, util) + indice    # la indexada gasta además un bloque de índices
        bs, lista = lista[:k], lista[k:]
        print(f'  {n:<12} ' + (f'índice {bs[0]:>2} | ' if indice else '') + ' -> '.join(map(str, bs[indice:])))
        if n == 'informe.pdf':
            leer = f'  bloque {K} de {n}: disco {bs[indice + K]}, lecturas {lect}'
    print(f'  usados {len(libres) - len(lista)}, libres {len(lista)}'); print(leer)
