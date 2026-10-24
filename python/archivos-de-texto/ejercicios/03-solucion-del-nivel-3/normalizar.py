# Solución del Nivel 3
# Del artículo «Archivos de texto en Python — ejercicios con contadores de líneas, filtros de carreras y un diario que hay que normalizar (y la línea vacía que paró el bucle a la mitad)»
# https://sergiolearns.com/archivos-de-texto-en-python-ejercicios/

# Nivel 3 · Normalizar un diario escrito "a mano"
import re

# fecha, separador (; , o |) con espacios opcionales, deporte, separador, minutos y 'min' opcional
PATRON = re.compile(r'(\d{4}-\d{2}-\d{2})\s*[;,|]\s*(\w+)\s*[;,|]\s*(\d+)\s*(?:min)?')


def normalizar(origen, destino):
    cambiadas = total = 0
    with open(origen, 'r', encoding='utf-8') as fin, open(destino, 'w', encoding='utf-8') as fout:
        for linea in fin:
            original = linea.strip()
            m = PATRON.fullmatch(original)        # fullmatch: la línea ENTERA tiene que encajar
            if m is None:                         # vacías y frases sueltas no son sesiones
                continue
            limpia = ';'.join(m.groups())         # fecha;deporte;minutos
            total += 1
            if limpia != original:
                cambiadas += 1
            fout.write(f'{limpia} <- {original}\n')
        fout.write('>' * 10 + '\n')
        fout.write(f'Normalizadas:{cambiadas:3d}, Total:{total:3d}\n')   # campos de 3 caracteres
    return cambiadas, total


print(normalizar('sucio.txt', 'limpio.txt'))
with open('limpio.txt', 'r', encoding='utf-8') as f:
    print(f.read(), end='')
