# Turnos de reparto: comprobar frente a encontrar (colorear con 3 colores)
# Del artículo «Autómatas de pila y máquinas de Turing — práctica guiada con las comandas entre paréntesis, la pizza familiar con dos refrescos, la MT que suma 1 en binario, los turnos de reparto y un problema de examen paso a paso (y el acarreo que se me escapó por la izquierda)»
# https://sergiolearns.com/automatas-de-pila-y-maquinas-de-turing-practica/

from itertools import product

zonas = ['Centro', 'Puerto', 'Playa', 'Alto', 'Feria']
vecinas = [('Centro', 'Puerto'), ('Centro', 'Playa'), ('Centro', 'Alto'),
           ('Centro', 'Feria'), ('Puerto', 'Playa'), ('Alto', 'Feria')]

def valido(turno):                       # comprobar: una pasada por las aristas
    return all(turno[a] != turno[b] for a, b in vecinas)

print(valido({'Centro': 'A', 'Puerto': 'B', 'Playa': 'C', 'Alto': 'B', 'Feria': 'C'}))

for k in (2, 3):                         # encontrar: fuerza bruta, k**5 repartos
    todos = [dict(zip(zonas, t)) for t in product('ABC'[:k], repeat=len(zonas))]
    print(k, 'turnos:', len(todos), 'repartos probados,', sum(map(valido, todos)), 'válidos')
