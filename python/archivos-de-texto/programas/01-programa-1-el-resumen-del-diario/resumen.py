# Programa 1 · El resumen del diario
# Del artículo «Archivos de texto en Python — práctica con el resumen del diario, sesiones que se apuntan sin borrar nada y un informe del mes (y la sesión que se pegó a la del día anterior)»
# https://sergiolearns.com/archivos-de-texto-en-python-practica/

# Programa 1 · El resumen del diario


def leer_sesiones(nombre):
    """Devuelve las sesiones válidas (fecha, deporte, minutos) y los avisos de las líneas raras."""
    sesiones = []
    avisos = []
    with open(nombre, 'r', encoding='utf-8') as f:
        for numero, linea in enumerate(f, start=1):   # el número sirve para decir DÓNDE está el fallo
            linea = linea.strip()                      # fuera '\n' y espacios de los extremos
            if linea == '' or linea.startswith('#'):
                continue                               # vacías y comentarios no son sesiones
            partes = linea.split(';')
            if len(partes) != 3:                       # sin esto, desempaquetar daría ValueError
                avisos.append(f'línea {numero}: faltan campos')
                continue
            fecha, deporte, minutos = [p.strip() for p in partes]   # ' carrera ' -> 'carrera'
            if not minutos.isdigit():                  # int('veinte') daría ValueError
                avisos.append(f'línea {numero}: minutos no válidos ({minutos})')
                continue
            sesiones.append((fecha, deporte, int(minutos)))
    return sesiones, avisos


def minutos_por_deporte(sesiones):
    """Diccionario deporte -> minutos totales."""
    totales = {}
    for fecha, deporte, minutos in sesiones:
        totales[deporte] = totales.get(deporte, 0) + minutos   # get: 0 la primera vez que sale
    return totales


def deporte_estrella(totales):
    """El deporte con más minutos (si empatan, el primero en orden alfabético)."""
    mejor = None
    for deporte in sorted(totales):
        if mejor is None or totales[deporte] > totales[mejor]:   # > y no >=: el empate no cambia el mejor
            mejor = deporte
    return mejor


sesiones, avisos = leer_sesiones('entrenos.txt')
print('Sesiones válidas:', len(sesiones))
for aviso in avisos:
    print('  Aviso,', aviso)
totales = minutos_por_deporte(sesiones)
for deporte in sorted(totales):                 # orden alfabético (el inglés conserva el mismo)
    print(f'{deporte:<10}{totales[deporte]:>4} min')
print('Total:', sum(totales.values()), 'min')
estrella = deporte_estrella(totales)
print('Deporte estrella:', estrella, f'({totales[estrella]} min)')
