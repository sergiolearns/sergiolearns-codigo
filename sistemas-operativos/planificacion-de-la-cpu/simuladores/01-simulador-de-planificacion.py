# Compruébalo con Python · Simulador de planificación: FCFS, SJF, SRTF y Round Robin con los cuatro procesos de la noche antes de entregar
# Del artículo «Planificación de la CPU — teoría con FCFS, SJF, SRTF y Round Robin dibujados en diagramas de Gantt (y el parcial en que olvidé restar la llegada)»
# https://sergiolearns.com/planificacion-de-la-cpu/

# La noche antes de entregar: cuatro procesos piden la CPU (tiempos en ms)
PROCESOS = [('onedrive', 0, 8), ('gcc', 1, 4), ('campus', 2, 9), ('spotify', 3, 2)]
Q = 3   # cuanto de Round Robin
def planifica(alg):
    llega = {n: l for n, l, r in PROCESOS}
    resto = {n: r for n, l, r in PROCESOS}         # lo que le QUEDA a cada uno
    cola, gantt, actual, usado, t = [], [], None, 0, 0
    while any(resto.values()):
        cola += [n for n, l, r in PROCESOS if l == t]       # los que llegan, al final
        if alg == 'RR' and actual and usado == Q:          # agotó el cuanto: detrás
            cola.append(actual); actual = None             # de los recién llegados
        if alg == 'SRTF' and actual and cola and min(resto[n] for n in cola) < resto[actual]:
            cola.append(actual); actual = None             # llega uno más corto: expulsión
        if actual is None:                                 # CPU libre: ¿a quién le toca?
            if alg in ('SJF', 'SRTF'):                     # el más corto (empate: el que llegó antes)
                actual = min(cola, key=lambda n: (resto[n], llega[n]))
            else:                                          # FCFS y RR: el primero de la cola
                actual = cola[0]
            cola.remove(actual); usado = 0
        if gantt and gantt[-1][0] == actual:
            gantt[-1][2] = t + 1                           # sigue el mismo: se alarga el bloque
        else:
            gantt.append([actual, t, t + 1])               # cambio de contexto: bloque nuevo
        resto[actual] -= 1; usado += 1; t += 1
        if resto[actual] == 0:
            actual = None                                  # termina y libera la CPU
    return gantt

print('proceso   llegada  ráfaga  fin    retorno  espera  respuesta')
for alg in ('FCFS', 'SJF', 'SRTF', 'RR'):
    gantt = planifica(alg)
    print(f'== {alg}' + (f' (Q = {Q})' if alg == 'RR' else '') + ': ' + ' '.join(f'{n}[{a}-{b}]' for n, a, b in gantt))
    medias = [0, 0, 0]
    for n, l, r in PROCESOS:
        fin = max(b for m, a, b in gantt if m == n)        # último instante en CPU
        primera = min(a for m, a, b in gantt if m == n)    # primera vez que entra
        retorno, espera, respuesta = fin - l, fin - l - r, primera - l
        medias = [x + y / len(PROCESOS) for x, y in zip(medias, (retorno, espera, respuesta))]
        print(f'{n:<9}{l:>8}{r:>8}{fin:>5}{retorno:>11}{espera:>8}{respuesta:>11}')
    print(f'{"media":<9}{"":>21}{medias[0]:>11.2f}{medias[1]:>8.2f}{medias[2]:>11.2f}')
