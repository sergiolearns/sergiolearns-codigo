# Simuladores de AP y MT con las máquinas de los ejercicios
# Del artículo «Autómatas de pila y máquinas de Turing — ejercicios tipo examen con trazas de pila, una MT que cambia letras, el palíndromo con marca, clasificar problemas y un test de 18 preguntas (y la caja que se quedó en la moto)»
# https://sergiolearns.com/automatas-de-pila-y-maquinas-de-turing-ejercicios/

def ap(f, w, q='q0'):                      # AP determinista, aceptación por vaciado de pila
    i, pila, di = 0, 'Z', [(q, w, 'Z')]
    while pila:
        c = pila[0]
        if i < len(w) and (q, w[i], c) in f:
            q, s = f[(q, w[i], c)]; i += 1
        elif (q, '', c) in f:
            q, s = f[(q, '', c)]
        else:
            break
        pila = s + pila[1:]
        di.append((q, w[i:] or 'λ', pila or 'λ'))
    return i == len(w) and pila == '', di[-1]

def mt(f, w, q='q0'):                      # MT de una cinta: cinta final, pasos (CT) y celdas (CE)
    t, h, pasos, usadas = list('△' + w + '△'), 1, 0, {1}
    while (q, t[h]) in f:
        q, t[h], m = f[(q, t[h])]; pasos += 1
        if m == 'P':
            break
        h += 1 if m == 'D' else -1; usadas.add(h)
    return ''.join(t).strip('△'), pasos, len(usadas)

cajas = {('q0', 'p', 'Z'): ('q0', 'CZ'), ('q0', 'p', 'C'): ('q0', 'CC'), ('q0', 'e', 'C'): ('q1', ''),
         ('q1', 'e', 'C'): ('q1', ''), ('q1', '', 'Z'): ('q1', '')}
for w in ['pppeee', 'ppeee', 'pepe']:
    print('ej1', w, ap(cajas, w))

cambia = {('q0', 'a'): ('q0', 'b', 'D'), ('q0', 'b'): ('q0', 'a', 'D'), ('q0', '△'): ('qf', '△', 'P')}
print('ej2', mt(cambia, 'abba'))

pal = {}
for X in 'ABZ':
    pal[('q0', 'a', X)] = ('q0', 'A' + X)
    pal[('q0', 'b', X)] = ('q0', 'B' + X)
    pal[('q0', 'c', X)] = ('q1', X)
pal.update({('q1', 'a', 'A'): ('q1', ''), ('q1', 'b', 'B'): ('q1', ''), ('q1', '', 'Z'): ('q1', '')})
for w in ['abcba', 'abcab', 'c']:
    print('ej3', w, ap(pal, w))
