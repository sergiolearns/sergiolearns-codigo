# Compruébalo con Python · Simulador de E/S: síncrona con polling frente a asíncrona con interrupciones
# Del artículo «El hardware que sostiene al sistema operativo — teoría con la práctica de IC2 en la impresora, una interrupción que lo para todo y una caché que acierta (y el bucle infinito que no colgó mi portátil)»
# https://sergiolearns.com/interrupciones-y-jerarquia-de-memoria/

# Simulador de E/S: imprimes la práctica de IC2 mientras VS Code compila
# A = trabajo de impresión (3 páginas); B = compilador. 1 carácter = 10 ms de CPU
PAGINAS = 3
CPU_PAGINA = 20     # ms de CPU que A necesita para preparar cada página
IMPRESORA = 60      # ms que tarda la impresora en imprimir una página
COMPILAR = 120      # ms de CPU que necesita B en total
SONDEO = 5          # con polling, la CPU pregunta a la impresora cada 5 ms


def linea_cpu(asincrona):
    cpu = []
    falta_b = COMPILAR // 10                    # trozos de 10 ms que le quedan a B
    for _ in range(PAGINAS):
        cpu += ['A'] * (CPU_PAGINA // 10)       # A prepara la página y se la da al controlador
        for _ in range(IMPRESORA // 10):        # mientras tanto, la impresora trabaja sola
            if asincrona and falta_b:           # asíncrona: el SO le da la CPU a B
                cpu.append('B')
                falta_b -= 1
            elif asincrona:
                cpu.append('.')                 # nadie necesita la CPU: está libre
            else:
                cpu.append('?')                 # síncrona: la CPU pregunta "¿ya has terminado?"
    return ''.join(cpu) + 'B' * falta_b         # lo que le quede a B va al final


for modo in ('síncrona', 'asíncrona'):
    cpu = linea_cpu(modo == 'asíncrona')
    total = len(cpu) * 10                        # ms hasta que A y B han terminado
    util = (cpu.count('A') + cpu.count('B')) * 10
    preguntas = cpu.count('?') * 10 // SONDEO    # cada ? son 10 ms preguntando cada 5 ms
    avisos = PAGINAS if modo == 'asíncrona' else 0   # una interrupción por página impresa
    print(f'{modo:<13} {cpu}')
    print(f'{"":<13} total {total} ms · útil {util} ms · uso {util * 100 // total} %'
          f' · preguntas {preguntas} · interrupciones {avisos}')
