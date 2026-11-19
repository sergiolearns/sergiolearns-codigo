# Máquina de Turing que suma 1 en binario (CT y CE)
# Del artículo «Autómatas de pila y máquinas de Turing — práctica guiada con las comandas entre paréntesis, la pizza familiar con dos refrescos, la MT que suma 1 en binario, los turnos de reparto y un problema de examen paso a paso (y el acarreo que se me escapó por la izquierda)»
# https://sergiolearns.com/automatas-de-pila-y-maquinas-de-turing-practica/

# MT que suma 1 en binario: devuelve la cinta, los pasos (CT) y las celdas usadas (CE)
inc = {('q0', '0'): ('q0', '0', 'D'), ('q0', '1'): ('q0', '1', 'D'), ('q0', '△'): ('q1', '△', 'I'),
       ('q1', '1'): ('q1', '0', 'I'), ('q1', '0'): ('qf', '1', 'P'), ('q1', '△'): ('qf', '1', 'P')}

def mt(f, entrada):
    cinta, h, q, pasos = list('△' + entrada + '△'), 1, 'q0', 0
    usadas = {h}
    while (q, cinta[h]) in f:
        q, cinta[h], mov = f[(q, cinta[h])]     # escribe y cambia de estado
        pasos += 1
        if mov == 'P':
            break
        h += 1 if mov == 'D' else -1             # se mueve después de escribir
        usadas.add(h)
    return ''.join(cinta).strip('△'), q, pasos, len(usadas)

for x in ['1011', '111', '1000', '1111111']:
    print(x, '->', mt(inc, x))
