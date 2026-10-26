# Compruébalo con Python · Simulador 2: primer, mejor y peor ajuste con gcc, spotify, el campus y onedrive
# Del artículo «Gestión de memoria — teoría con tu portátil repartiendo la RAM entre gcc, spotify, el campus y onedrive (y los 4 KiB que yo creía que eran 4000 bytes)»
# https://sergiolearns.com/gestion-de-memoria/

# Asignación contigua (MVT): primer, mejor y peor ajuste con los mismos huecos (datos fijos)
HUECOS = [(100, 120), (300, 480), (900, 210), (1200, 300), (1600, 560)]   # (inicio, tamaño) en KiB
PETICIONES = [('gcc', 210), ('spotify', 430), ('campus', 110), ('onedrive', 470)]


def elige(huecos, tam, politica):
    validos = [h for h in huecos if h[1] >= tam]             # solo sirven los que caben
    if not validos:
        return None
    if politica == 'primer':
        return validos[0]                                    # el primero de la lista
    if politica == 'mejor':
        return min(validos, key=lambda h: h[1])              # el que deja menos resto
    return max(validos, key=lambda h: h[1])                  # peor: el más grande


for politica in ('primer', 'mejor', 'peor'):
    huecos = list(HUECOS)                                    # copia: cada política empieza igual
    print(f'== {politica} ajuste')
    for nombre, tam in PETICIONES:
        h = elige(huecos, tam, politica)
        if h is None:
            libre = sum(t for _, t in huecos)
            print(f'  {nombre:<8} {tam:>3} KiB → no cabe (libres {libre} KiB, mayor hueco {max(t for _, t in huecos)})')
            continue
        i = huecos.index(h)
        huecos[i] = (h[0] + tam, h[1] - tam)                 # el resto sigue siendo un hueco
        print(f'  {nombre:<8} {tam:>3} KiB → en {h[0]:>4} (hueco de {h[1]}, resto {h[1] - tam})')
    huecos = [h for h in huecos if h[1] > 0]
    print('  huecos:', ' '.join(str(t) for _, t in huecos))
