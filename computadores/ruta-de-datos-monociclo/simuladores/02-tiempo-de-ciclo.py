# Compruébalo con Python · Tiempo de cada instrucción y del ciclo
# Del artículo «Ruta de datos monociclo de MIPS — teoría con un tren y sus agujas, el camino de cada instrucción y sus señales (y la memoria que quise compartir)»
# https://sergiolearns.com/ruta-de-datos-monociclo/

# Cuánto dura el ciclo de la ruta de datos monociclo: la instrucción más lenta manda
RET = {'memoria de instrucciones': 250, 'leer registros': 100, 'ALU': 200,
       'memoria de datos': 250, 'escribir registro': 100}         # retardos en picosegundos
CAMINO = {   # bloques que recorre cada instrucción, uno detrás de otro
    'tipo R': ['memoria de instrucciones', 'leer registros', 'ALU', 'escribir registro'],
    'lw':     ['memoria de instrucciones', 'leer registros', 'ALU', 'memoria de datos', 'escribir registro'],
    'sw':     ['memoria de instrucciones', 'leer registros', 'ALU', 'memoria de datos'],
    'beq':    ['memoria de instrucciones', 'leer registros', 'ALU'],
    'j':      ['memoria de instrucciones'],
}
t = {ins: sum(RET[b] for b in bloques) for ins, bloques in CAMINO.items()}
for ins, ps in t.items():
    print(f'{ins:7s} {ps:4d} ps  ' + '#' * (ps // 50))
ciclo = max(t.values())                                 # el reloj tiene que esperar a la más lenta
print(f'\nciclo = {ciclo} ps  ->  frecuencia = {1e12 / ciclo / 1e9:.2f} GHz')
# La taquilla del tren: lw, sub, sw, beq y j, una de cada
taquilla = ['lw', 'tipo R', 'sw', 'beq', 'j']
monociclo = ciclo * len(taquilla)
a_medida = sum(t[i] for i in taquilla)                  # si cada una durara solo lo suyo
print(f'taquilla en monociclo: {monociclo} ps; si cada una durara lo suyo: {a_medida} ps')
print(f'tiempo de espera sin hacer nada: {monociclo - a_medida} ps ({(monociclo - a_medida) / monociclo:.0%})')
