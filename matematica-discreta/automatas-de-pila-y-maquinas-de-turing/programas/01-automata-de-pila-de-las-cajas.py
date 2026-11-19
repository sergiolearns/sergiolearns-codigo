# Autómata de pila de las cajas (p^n e^n, por vaciado de pila)
# Del artículo «Autómatas de pila y máquinas de Turing — teoría con la pizzería del barrio, la pila de cajas, la cinta que se escribe, el problema de la parada y P frente a NP (y el programa que nadie puede escribir)»
# https://sergiolearns.com/automatas-de-pila-y-maquinas-de-turing/

# Autómata de pila de las cajas: p = pedido (apila C), e = entrega (desapila)
f = {('q0', 'p', 'Z'): ('q0', 'CZ'), ('q0', 'p', 'C'): ('q0', 'CC'),
     ('q0', 'e', 'C'): ('q1', ''), ('q1', 'e', 'C'): ('q1', ''),
     ('q1', '', 'Z'): ('q1', '')}           # '' es lambda: no leer o no apilar

def ap(w):
    q, i, pila = 'q0', 0, 'Z'               # la pila es una cadena: la cima, a la izquierda
    print((q, w[i:] or 'λ', pila))
    while pila:
        cima = pila[0]
        if i < len(w) and (q, w[i], cima) in f:   # transición que lee
            q, poner = f[(q, w[i], cima)]; i += 1
        elif (q, '', cima) in f:                   # transición lambda
            q, poner = f[(q, '', cima)]
        else:
            break                                  # no hay transición: se para
        pila = poner + pila[1:]                    # quita la cima y pone la cadena
        print((q, w[i:] or 'λ', pila or 'λ'))
    return i == len(w) and pila == ''              # aceptación por vaciado de pila

print('ppee ->', ap('ppee'))
print('ppe  ->', ap('ppe'))
