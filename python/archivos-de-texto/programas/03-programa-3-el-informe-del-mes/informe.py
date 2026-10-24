# Programa 3 · El informe del mes en un archivo nuevo
# Del artículo «Archivos de texto en Python — práctica con el resumen del diario, sesiones que se apuntan sin borrar nada y un informe del mes (y la sesión que se pegó a la del día anterior)»
# https://sergiolearns.com/archivos-de-texto-en-python-practica/

# Programa 3 · El informe del mes en un archivo nuevo
import os


def leer_validas(nombre):
    """Lista de (deporte, minutos) de las líneas correctas; las demás se saltan."""
    validas = []
    with open(nombre, 'r', encoding='utf-8') as f:
        for linea in f:
            partes = [p.strip() for p in linea.split(';')]
            if len(partes) == 3 and partes[2].isdigit():   # comentarios y vacías no tienen 3 campos
                validas.append((partes[1], int(partes[2])))
    return validas


def resumen(validas):
    """Diccionario deporte -> [sesiones, minutos]."""
    datos = {}
    for deporte, minutos in validas:
        if deporte not in datos:
            datos[deporte] = [0, 0]
        datos[deporte][0] += 1
        datos[deporte][1] += minutos
    return datos


def escribir_informe(datos, ruta):
    with open(ruta, 'w', encoding='utf-8') as f:    # 'w' a propósito: el informe se rehace entero
        print('INFORME DE ENTRENAMIENTOS · OCTUBRE', file=f)
        print('=' * 28, file=f)
        print(f'{"Deporte":<10}{"Sesiones":>9}{"Minutos":>9}', file=f)
        total_s = total_m = 0
        for deporte in sorted(datos):
            s, m = datos[deporte]
            print(f'{deporte:<10}{s:>9}{m:>9}', file=f)   # mismos anchos que la cabecera
            total_s += s
            total_m += m
        print('-' * 28, file=f)
        print(f'{"Total":<10}{total_s:>9}{total_m:>9}', file=f)
        f.write(f'Media por sesión: {total_m / total_s:.1f} min\n')   # write: el '\n' lo pongo yo


validas = leer_validas('entrenos.txt')
os.makedirs('informes', exist_ok=True)
ruta = os.path.join('informes', 'octubre.txt')
escribir_informe(resumen(validas), ruta)
print('Escrito:', ruta, '¿existe?', os.path.exists(ruta))
with open(ruta, 'r', encoding='utf-8') as f:   # lo leo para comprobar lo que ha quedado
    print(f.read(), end='')
