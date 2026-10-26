# Compruébalo con Python · Influencia del cuanto: Round Robin con varios Q, cambios de contexto y CPU útil
# Del artículo «Planificación de la CPU — teoría con FCFS, SJF, SRTF y Round Robin dibujados en diagramas de Gantt (y el parcial en que olvidé restar la llegada)»
# https://sergiolearns.com/planificacion-de-la-cpu/

# ¿Qué cuanto elegir? Round Robin con los mismos cuatro procesos y varios Q
PROCESOS = [('onedrive', 0, 8), ('gcc', 1, 4), ('campus', 2, 9), ('spotify', 3, 2)]
CAMBIO = 0.5   # lo que cuesta cada cambio de contexto (ms): guardar un PCB y cargar otro

def round_robin(Q):
    resto = {n: r for n, l, r in PROCESOS}
    cola, gantt, actual, usado, t = [], [], None, 0, 0
    while any(resto.values()):
        cola += [n for n, l, r in PROCESOS if l == t]       # los que llegan, al final
        if actual and usado == Q:                          # cuanto agotado: al final,
            cola.append(actual); actual = None             # detrás de los recién llegados
        if actual is None:
            actual = cola.pop(0); usado = 0                # FIFO circular
        if gantt and gantt[-1][0] == actual:
            gantt[-1][2] = t + 1
        else:
            gantt.append([actual, t, t + 1])
        resto[actual] -= 1; usado += 1; t += 1
        if resto[actual] == 0:
            actual = None
    return gantt

print('  Q  espera media   retorno medio  respuesta media   cambios    CPU útil')
for Q in (1, 2, 3, 4, 6, 9):
    gantt = round_robin(Q)
    espera = retorno = respuesta = 0
    for n, l, r in PROCESOS:
        fin = max(b for m, a, b in gantt if m == n)
        retorno += (fin - l) / len(PROCESOS)
        espera += (fin - l - r) / len(PROCESOS)
        respuesta += (min(a for m, a, b in gantt if m == n) - l) / len(PROCESOS)
    cambios = len(gantt) - 1                               # cada bloque nuevo = un cambio
    cpu = gantt[-1][2]                                     # ms de trabajo útil (23)
    util = 100 * cpu / (cpu + cambios * CAMBIO)            # % que no se pierde en cambios
    print(f'{Q:>3}{espera:>14.2f}{retorno:>16.2f}{respuesta:>17.2f}{cambios:>10}{util:>10.1f} %')
