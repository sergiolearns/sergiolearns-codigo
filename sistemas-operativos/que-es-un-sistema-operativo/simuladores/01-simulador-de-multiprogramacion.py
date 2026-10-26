# Compruébalo con Python · Simulador de multiprogramación: ¿cuánto trabaja la CPU de tu portátil?
# Del artículo «Qué es un sistema operativo — teoría con tu portátil en una tarde de estudio, una llamada a write() y la CPU que nunca descansa (y los tres programas que no se ejecutaban a la vez)»
# https://sergiolearns.com/que-es-un-sistema-operativo/

# Simulador de multiprogramación: ¿cuánto trabaja la CPU de tu portátil?
# Cada programa alterna ráfagas de CPU y de E/S (en ms). Datos fijos, sin input().
PROGRAMAS = {                     # nombre: [CPU, E/S, CPU, E/S, CPU]
    'C': [40, 20, 40],            # C = el compilador de VS Code (casi todo CPU)
    'D': [10, 60, 10, 60, 10],    # D = la descarga del PDF (espera a la red)
    'M': [10, 40, 10, 40, 10],    # M = Spotify (espera al disco y a la tarjeta de sonido)
}
PASO = 10                         # cada letra de la línea de la CPU son 10 ms


def simula(multi):
    queda = {p: list(r) for p, r in PROGRAMAS.items()}  # ráfagas pendientes
    listos, en_es, cpu, linea, fin = list(PROGRAMAS), [], None, '', {}
    while any(queda.values()):
        # sin multiprogramación nadie entra en la CPU mientras otro espera su E/S
        if cpu is None and listos and (multi or not en_es):
            cpu = listos.pop(0)
        linea += cpu or '.'                  # '.' = CPU parada
        for p in ([cpu] if cpu else []) + en_es:
            queda[p][0] -= PASO              # avanza la CPU y cada E/S (cada una en su dispositivo)
        for p in [p for p in en_es if queda[p][0] == 0]:
            queda[p].pop(0); en_es.remove(p)  # termina su E/S: vuelve a la cola de listos
            listos.insert(len(listos) if multi else 0, p)
        if cpu and queda[cpu][0] == 0:
            queda[cpu].pop(0)
            if queda[cpu]:
                en_es.append(cpu)            # se bloquea esperando la E/S y suelta la CPU
            else:
                fin[cpu] = len(linea) * PASO  # ha terminado del todo
            cpu = None
    return linea, fin


for multi in (False, True):
    linea, fin = simula(multi)
    ocupada, total = PASO * sum(c != '.' for c in linea), PASO * len(linea)
    print('Multiprogramada:' if multi else 'Uno detrás de otro:')
    print(f'  CPU |{linea}|')
    print('  terminan: ' + ', '.join(f'{p} a los {t} ms' for p, t in fin.items()))
    print(f'  total {total} ms, CPU ocupada {ocupada} ms, uso {100 * ocupada / total:.0f} %')
