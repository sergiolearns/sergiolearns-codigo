# Compruébalo con Python · Simulador 1: FIFO, LRU y óptimo con la misma cadena de referencias de gcc y 3 marcos
# Del artículo «Memoria virtual y reemplazo de páginas — teoría con gcc en tres marcos, FIFO, LRU y el óptimo cara a cara (y el portátil que se arrastraba con 40 pestañas)»
# https://sergiolearns.com/memoria-virtual/

# FIFO, LRU y óptimo con la misma cadena de referencias de gcc y 3 marcos
CADENA = [1, 2, 1, 3, 5, 1, 2, 4, 7, 1, 4, 7, 3, 7, 4]   # páginas que pide gcc, en orden
N_MARCOS = 3                                            # marcos que el SO le deja a gcc

def victima(alg, marcos, t, cadena, llegada, uso):
    if alg == 'FIFO':          # la que lleva más tiempo en memoria (entró antes)
        return min(marcos, key=lambda p: llegada[p])
    if alg == 'LRU':           # la que hace más tiempo que nadie la usa
        return min(marcos, key=lambda p: uso[p])
    futuro = cadena[t + 1:]    # óptimo: la que más tarde se vuelve a pedir (o nunca)
    return max(marcos, key=lambda p: futuro.index(p) if p in futuro else len(futuro))

def simula(alg, n_marcos, cadena, traza=True):
    marcos = [None] * n_marcos    # cada posición es un marco físico fijo
    llegada, uso, fallos = {}, {}, 0
    for t, p in enumerate(cadena):
        fuera, acierto = None, p in marcos
        if acierto:               # acierto: solo se apunta el último uso (para LRU)
            uso[p] = t
        else:
            fallos += 1
            if None in marcos:    # aún hay un marco libre: no hace falta víctima
                i = marcos.index(None)
            else:
                fuera = victima(alg, marcos, t, cadena, llegada, uso)
                i = marcos.index(fuera)   # la nueva ocupa el marco de la víctima
            marcos[i] = p
            llegada[p] = uso[p] = t
        if traza:
            fila = ' '.join('-' if m is None else str(m) for m in marcos)
            res = 'acierto' if acierto else 'FALLO  '
            fin = f'fuera: {fuera}' if fuera is not None else ''
            print(f'{t:>2}  {p:>3}  [{fila}]  {res}  {fin}'.rstrip())
    return fallos

for alg in ('FIFO', 'LRU', 'OPT'):
    print(f'== {alg} con {N_MARCOS} marcos ==')
    print(f"{'t':>2}  {'ref':>3}  {'marcos':<7}  {'acceso':<7}  víctima")
    f = simula(alg, N_MARCOS, CADENA)
    print(f'{alg}: {f} fallos de página en {len(CADENA)} referencias\n')
