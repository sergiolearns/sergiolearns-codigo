# Máquina de Turing que suma en unario (111+11 -> 11111)
# Del artículo «Autómatas de pila y máquinas de Turing — teoría con la pizzería del barrio, la pila de cajas, la cinta que se escribe, el problema de la parada y P frente a NP (y el programa que nadie puede escribir)»
# https://sergiolearns.com/automatas-de-pila-y-maquinas-de-turing/

# Máquina de Turing que suma en unario: 111+11 -> 11111
f = {('q0', '1'): ('q0', '1', 'D'), ('q0', '+'): ('q1', '1', 'D'),
     ('q1', '1'): ('q1', '1', 'D'), ('q1', '△'): ('q2', '△', 'I'),
     ('q2', '1'): ('qf', '△', 'P')}

cinta = list('△111+11△')
q, h, pasos, usadas = 'q0', 1, 0, {1}     # la cabeza empieza en el primer símbolo
while (q, cinta[h]) in f:
    q, cinta[h], mov = f[(q, cinta[h])]   # primero escribe…
    pasos += 1
    if mov == 'P':
        break
    h += 1 if mov == 'D' else -1          # …y después se mueve
    usadas.add(h)
print(''.join(cinta), q, 'CT =', pasos, 'CE =', len(usadas))
