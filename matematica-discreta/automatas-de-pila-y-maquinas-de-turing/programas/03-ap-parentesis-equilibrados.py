# Autómata de pila de paréntesis equilibrados
# Del artículo «Autómatas de pila y máquinas de Turing — práctica guiada con las comandas entre paréntesis, la pizza familiar con dos refrescos, la MT que suma 1 en binario, los turnos de reparto y un problema de examen paso a paso (y el acarreo que se me escapó por la izquierda)»
# https://sergiolearns.com/automatas-de-pila-y-maquinas-de-turing-practica/

# AP de paréntesis equilibrados (X = mesa abierta), aceptación por vaciado de pila
f = {('q0', '(', 'Z'): ('q0', 'XZ'), ('q0', '(', 'X'): ('q0', 'XX'),
     ('q0', ')', 'X'): ('q0', ''), ('q0', '', 'Z'): ('q0', '')}

def ap(w, f, q='q0'):
    i, pila, pasos = 0, 'Z', [(q, w or 'λ', 'Z')]
    while pila:
        c = pila[0]
        if i < len(w) and (q, w[i], c) in f:
            q, poner = f[(q, w[i], c)]; i += 1      # lee un símbolo
        elif (q, '', c) in f:
            q, poner = f[(q, '', c)]                 # transición lambda
        else:
            break                                    # sin transición: se para
        pila = poner + pila[1:]
        pasos.append((q, w[i:] or 'λ', pila or 'λ'))
    return i == len(w) and pila == '', pasos

for w in ['(()())', '())(', '(()']:
    ok, pasos = ap(w, f)
    print(w, ok, pasos[-1], len(pasos) - 1, 'movimientos')
