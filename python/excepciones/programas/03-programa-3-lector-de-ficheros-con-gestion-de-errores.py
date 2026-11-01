# Programa 3 · Lector de ficheros con gestión de errores
# Del artículo «Excepciones en Python — práctica con cuatro programas que no se rompen: una ficha de matrícula, una calculadora, un lector de notas y fracciones (y el «12,5» que no quería ser número)»
# https://sergiolearns.com/excepciones-en-python-practica/

# Preparamos el fichero de ejemplo (en la secretaría ya existiría)
with open('notas.txt', 'w', encoding='utf-8') as f:
    f.write('8.5\nocho\n11\n6\n\n9.5\n4\n7\n')


def leer_notas(nombre_fichero):
    fichero = None                       # así existe aunque open() falle
    try:
        fichero = open(nombre_fichero, encoding='utf-8')
        notas = []
        for num, linea in enumerate(fichero, start=1):
            linea = linea.strip()
            if not linea:
                continue                 # línea vacía: ni error ni nota
            try:                         # try DENTRO del bucle: una línea mala no para la lectura
                nota = float(linea)
            except ValueError:
                print(f'  Línea {num} ignorada: {linea!r} no es un número')
                continue
            if not 0 <= nota <= 10:
                print(f'  Línea {num} ignorada: {nota} está fuera de rango')
                continue
            notas.append(nota)
        return notas
    except FileNotFoundError:
        print(f'  Error: no existe el fichero {nombre_fichero!r}')
        return []
    except PermissionError:
        print(f'  Error: sin permiso para leer {nombre_fichero!r}')
        return []
    finally:                             # se ejecuta con return, con error y sin error
        if fichero is not None:
            fichero.close()
            print('  (fichero cerrado)')


def informe(notas):
    if not notas:
        print('  No hay notas que analizar')
        return
    aprobados = sum(1 for n in notas if n >= 5)
    print(f'  {len(notas)} notas | media {sum(notas) / len(notas):.2f} | '
          f'máx {max(notas)} | mín {min(notas)} | aprobados {aprobados}/{len(notas)}')


for nombre in ['notas.txt', 'notas_2027.txt']:
    print('Leyendo', nombre)
    informe(leer_notas(nombre))
