# Compruébalo con Python · Simulador 2: tamaño máximo de un archivo con un i-nodo y qué puntero lleva a cada bloque
# Del artículo «Sistemas de archivos — teoría con la carpeta de tu práctica de IC2, FAT, i-nodos y enlaces (y el pendrive que no quiso el vídeo de la defensa)»
# https://sergiolearns.com/sistemas-de-archivos/

# Tamaño máximo de un archivo con un i-nodo: 12 punteros directos + indirecto simple, doble y triple
P, D = 4, 12                          # puntero de 4 bytes y 12 punteros directos

def legible(b):                       # bytes -> la mayor unidad binaria que no se queda corta
    for u, e in (('TiB', 40), ('GiB', 30), ('MiB', 20), ('KiB', 10)):
        if b >= 2 ** e:
            return f'{b / 2 ** e:.2f} {u}'
    return f'{b} B'

def niveles(B):                       # bloques de datos que alcanza cada puntero del i-nodo
    N = B // P                        # punteros que caben en un bloque de índices
    return [('directos', D), ('simple', N), ('doble', N ** 2), ('triple', N ** 3)]

for B in (1024, 4096):
    print(f'Bloque de {B} B -> {B // P} punteros por bloque de índices')
    total = 0
    for nombre, n in niveles(B):
        total += n                    # el máximo es la suma de los cuatro niveles
        print(f'  {nombre:<9}{n:>14} bloques  acumulado {legible(total * B):>11}')

B, N = 4096, 1024
def camino(k):                        # qué puntero lleva al bloque lógico k y cuántas lecturas cuesta
    for lect, (nombre, n) in enumerate(niveles(B), start=1):
        if k < n:
            return nombre, lect       # con el i-nodo en RAM: 1 + un bloque de índices por nivel
        k -= n                        # k no está en este nivel: pasa al siguiente

print('Bloque de 4096 B, i-nodo ya en memoria:')
for k in (5, 500, 50000, 2000000):
    nombre, lect = camino(k)
    print(f'  bloque {k:>7}: puntero {nombre:<9} lecturas {lect}')
datos = -(-300 * 2 ** 20 // B)        # un vídeo de 300 MiB de la defensa de la práctica
resto, indices = datos - D, 0
if resto > 0:
    indices += 1; resto -= N          # el indirecto simple: un bloque de índices
if resto > 0:                         # el doble: el bloque de arriba + los que hagan falta debajo
    indices += 1 + -(-min(resto, N * N) // N); resto -= N * N
print(f'Vídeo de 300 MiB: {datos} bloques de datos + {indices} de índices ({legible(indices * B)})')
