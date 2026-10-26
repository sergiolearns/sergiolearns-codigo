# Compruébalo con Python · Simulador 2: la anomalía de Belady con FIFO y el conjunto de trabajo de gcc con Δ = 4
# Del artículo «Memoria virtual y reemplazo de páginas — teoría con gcc en tres marcos, FIFO, LRU y el óptimo cara a cara (y el portátil que se arrastraba con 40 pestañas)»
# https://sergiolearns.com/memoria-virtual/

# La anomalía de Belady con FIFO y el conjunto de trabajo de gcc con una ventana Δ
from collections import deque

def fifo(n_marcos, cadena):
    marcos, cola, marcas = set(), deque(), ''   # cola: orden de llegada a memoria
    for p in cadena:
        if p in marcos:
            marcas += '.'                        # acierto
            continue
        marcas += 'F'                            # fallo de página
        if len(marcos) == n_marcos:              # sin marco libre: sale la más antigua
            marcos.discard(cola.popleft())
        marcos.add(p)
        cola.append(p)
    return marcas

BELADY = [3, 1, 4, 2, 3, 1, 5, 3, 1, 4, 2, 5]
for n in (3, 4):
    m = fifo(n, BELADY)
    print(f'FIFO, {n} marcos: {" ".join(m)}  -> {m.count("F")} fallos')

CADENA = [1, 2, 1, 3, 5, 1, 2, 4, 7, 1, 4, 7, 3, 7, 4]   # la de gcc del primer simulador
DELTA = 4                                               # ventana: las últimas 4 referencias
print(f"\n{'t':>2}  {'ref':>3}  {'WS(t, Δ=4)':<12}  |WS|")
tam = []
for t, p in enumerate(CADENA):
    ventana = CADENA[max(0, t - DELTA + 1):t + 1]   # referencias t-Δ+1 … t
    ws = sorted(set(ventana))                       # páginas distintas = conjunto de trabajo
    tam.append(len(ws))
    print(f'{t:>2}  {p:>3}  {str(ws):<12}  {len(ws):>4}')

OTROS = {'spotify': 3, 'campus': 4, 'onedrive': 2}  # |WS| de los demás procesos
LIBRES = 10                                         # marcos que quedan para los cuatro
for t in (3, 9):
    D = tam[t] + sum(OTROS.values())
    print(f't = {t}: D = {tam[t]} + 3 + 4 + 2 = {D} marcos -> ' + ('caben' if D <= LIBRES else 'NO caben: hiperpaginación'))
