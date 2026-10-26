# Compruébalo con Python · Simulador 2: productor-consumidor con semáforos (el búfer de 3 huecos de spotify)
# Del artículo «Concurrencia y sincronización — teoría con un contador que pierde subidas, demasiada leche en la nevera y el búfer de spotify (y los 30 euros que se comió una hoja compartida)»
# https://sergiolearns.com/concurrencia-y-sincronizacion/

# Productor-consumidor en spotify: el descargador (D) mete trozos de la canción en un búfer
# de 3 huecos y el reproductor (R) los saca. Dos semáforos los coordinan; los turnos son fijos.
N, TURNOS = 3, 'RDDDDRDRRRR'                  # quién pide la CPU en cada turno
NOMBRE = {'D': 'descargador', 'R': 'reproductor'}
sem = {'huecos': N, 'llenos': 0}             # huecos libres y trozos listos para sonar
espera, pase = {}, set()                     # quién duerme en cada semáforo / despertados
bufer, siguiente = [], 1

def wait(s, h):
    if h in pase: pase.discard(h); return True  # lo despertó un signal: ya tiene su unidad
    if sem[s] > 0: sem[s] -= 1; return True    # quedan unidades: coge una y sigue
    espera[s] = h; return False                # vale 0: se bloquea (nunca baja de 0)

def signal(s):
    if s in espera: pase.add(espera.pop(s))    # alguien dormía: lo despierta y no suma
    else: sem[s] += 1                          # nadie esperaba: guarda la unidad

def estado(h):
    return 'bloqueado' if h in espera.values() else 'listo'

print(f'{"turno":>5}  {"quien":<12} {"accion":<11} {"bufer":<8} {"huecos":>6} {"llenos":>6}  {"D":<9} {"R":<9}')
for t, h in enumerate(TURNOS, 1):
    if h == 'D':
        if wait('huecos', 'D'):
            bufer.append(siguiente); accion = f'mete {siguiente}'; siguiente += 1
            signal('llenos')                   # avisa: hay un trozo más para sonar
        else: accion = 'se bloquea'
    else:
        if wait('llenos', 'R'):
            accion = f'saca {bufer.pop(0)}'     # FIFO: suena el trozo más antiguo
            signal('huecos')                   # avisa: queda un hueco libre
        else: accion = 'se bloquea'
    caja = '[' + ' '.join([str(x) for x in bufer] + ['·'] * (N - len(bufer))) + ']'
    print(f'{t:>5}  {NOMBRE[h]:<12} {accion:<11} {caja:<8} {sem["huecos"]:>6} {sem["llenos"]:>6}  {estado("D"):<9} {estado("R"):<9}')
print(f'Al final: {len(bufer)} trozos en el búfer, huecos = {sem["huecos"]}, llenos = {sem["llenos"]}')
