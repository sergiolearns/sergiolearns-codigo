# Compruébalo con Python · Simulador 1: condición de carrera y cerrojo con dos hilos de onedrive que cuentan archivos subidos
# Del artículo «Concurrencia y sincronización — teoría con un contador que pierde subidas, demasiada leche en la nevera y el búfer de spotify (y los 30 euros que se comió una hoja compartida)»
# https://sergiolearns.com/concurrencia-y-sincronizacion/

# Condición de carrera: dos hilos de onedrive hacen subidos = subidos + 1 a la vez.
# El entrelazado no lo decide el azar: ORDEN dice qué hilo pide la CPU en cada tick.
NOMBRE = {'F': 'fotos', 'A': 'apuntes'}
PASOS = ['leer', 'sumar', 'escribir']           # lo que hace la CPU con "subidos += 1"
PASOS_CERROJO = ['lock()'] + PASOS + ['unlock()']  # la misma suma, protegida con un cerrojo

def ejecutar(titulo, orden, pasos):
    subidos, reg, pc = 7, {'F': '-', 'A': '-'}, {'F': 0, 'A': 0}  # 7 archivos ya subidos
    dueno, dormidos, t = None, set(), 0         # dueño del cerrojo e hilos bloqueados
    print(f'--- {titulo} ---')
    print(f'{"t":>2}  {"hilo":<8} {"paso":<15} {"reg F":>5} {"reg A":>5} {"subidos":>8}')
    while pc['F'] < len(pasos) or pc['A'] < len(pasos):
        h = orden[t % len(orden)]; t += 1
        otro = 'A' if h == 'F' else 'F'
        if pc[h] == len(pasos) or h in dormidos:  # terminado o bloqueado: no puede usar la CPU
            h, otro = otro, h                      # así que el planificador se la da al otro
        paso = pasos[pc[h]]
        if paso == 'lock()' and dueno not in (None, h):
            dormidos.add(h); paso = 'lock() bloquea'  # ocupado: se duerme sin avanzar
        else:
            if paso == 'lock()': dueno = h
            elif paso == 'leer': reg[h] = subidos       # copia el dato compartido a SU registro
            elif paso == 'sumar': reg[h] += 1           # suma en el registro, no en memoria
            elif paso == 'escribir': subidos = reg[h]   # guarda el registro en memoria
            elif paso == 'unlock()':
                dueno = None
                if otro in dormidos:                    # alguien esperaba: le pasa el cerrojo
                    dormidos.discard(otro); dueno = otro; pc[otro] += 1
            pc[h] += 1
        print(f'{t:>2}  {NOMBRE[h]:<8} {paso:<15} {reg["F"]:>5} {reg["A"]:>5} {subidos:>8}')
    fin = 'correcto' if subidos == 9 else 'se ha perdido una subida'
    print(f'Resultado: subidos = {subidos} (esperado 9): {fin}\n')

ejecutar('1) Sin cerrojo, uno detrás de otro', 'FFFAAA', PASOS)
ejecutar('2) Sin cerrojo, Round Robin con Q = 2', 'FFAA', PASOS)
ejecutar('3) Con cerrojo, el mismo Round Robin', 'FFAA', PASOS_CERROJO)
