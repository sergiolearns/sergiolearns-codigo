# Compruébalo con Python · Simulador de caché: FIFO frente a LRU y tiempo medio de acceso
# Del artículo «El hardware que sostiene al sistema operativo — teoría con la práctica de IC2 en la impresora, una interrupción que lo para todo y una caché que acierta (y el bucle infinito que no colgó mi portátil)»
# https://sergiolearns.com/interrupciones-y-jerarquia-de-memoria/

# Simulador de caché: el compilador pide bloques de memoria y la caché solo guarda 3
ACCESOS = ['A', 'B', 'C', 'A', 'D', 'A', 'B', 'E', 'A', 'B', 'C', 'A']
HUECOS = 3
T_CACHE = 1         # ns en mirar la caché (se mira siempre)
T_RAM = 50          # ns extra si el bloque no está y hay que ir a la RAM


def simula(politica):
    cache, aciertos, filas = [], 0, []          # cache[0] es la próxima víctima
    for b in ACCESOS:
        if b in cache:
            aciertos += 1
            marca = 'acierto'
            if politica == 'LRU':               # LRU: el bloque usado pasa al final (el más reciente)
                cache.remove(b)
                cache.append(b)
        else:
            marca = 'fallo'
            if len(cache) == HUECOS:            # llena: sale cache[0]
                cache.pop(0)                    # FIFO = el que entró antes; LRU = el que lleva más sin usarse
            cache.append(b)
        filas.append(f"{b}  {' '.join(cache):<6} {marca:<8}")
    return aciertos, filas


fifo, lru = simula('FIFO'), simula('LRU')
print(f'{"FIFO":<20}LRU')
for f, l in zip(fifo[1], lru[1]):
    print(f'{f:<20}{l}'.rstrip())
for nombre, (aciertos, _) in (('FIFO', fifo), ('LRU', lru)):
    tasa = aciertos / len(ACCESOS)
    medio = T_CACHE + (1 - tasa) * T_RAM        # fallo = mirar la caché + ir a la RAM
    print(f'{nombre:<5} aciertos {aciertos}/{len(ACCESOS)} = {tasa * 100:.0f} % · tiempo medio {medio:.1f} ns')
print(f'con un 95 % de aciertos: {T_CACHE + 0.05 * T_RAM:.1f} ns · sin caché: {T_RAM} ns')
