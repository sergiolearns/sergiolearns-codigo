# Solución del Nivel 2
# Del artículo «Archivos de texto en Python — ejercicios con contadores de líneas, filtros de carreras y un diario que hay que normalizar (y la línea vacía que paró el bucle a la mitad)»
# https://sergiolearns.com/archivos-de-texto-en-python-ejercicios/

# Nivel 2 · Un archivo solo con las carreras largas


def filtrar_carreras(origen, destino, minimo):
    """Escribe en destino las sesiones de carrera de al menos 'minimo' minutos. Devuelve cuántas."""
    n = total = 0
    with open(origen, 'r', encoding='utf-8') as fin, open(destino, 'w', encoding='utf-8') as fout:
        for linea in fin:                    # el bucle recorre el ORIGEN; el destino solo recibe
            partes = linea.strip().split(';')
            if len(partes) != 3:             # línea vacía: [''] tiene un solo campo
                continue
            fecha, deporte, minutos = partes
            if deporte == 'carrera' and int(minutos) >= minimo:   # >=: 30 minutos justos también valen
                n += 1
                total += int(minutos)
                fout.write(f'{n}. {fecha} ({minutos} min)\n')
        fout.write(f'Total: {n} sesiones, {total} min\n')
    return n


cuantas = filtrar_carreras('octubre.txt', 'carreras.txt', 30)
print('Carreras copiadas:', cuantas)
f = open('carreras.txt', 'r', encoding='utf-8')
linea = f.readline()
while linea != '':
    print(linea, end='')
    linea = f.readline()
f.close()
