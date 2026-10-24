# Solución del Nivel 1
# Del artículo «Archivos de texto en Python — ejercicios con contadores de líneas, filtros de carreras y un diario que hay que normalizar (y la línea vacía que paró el bucle a la mitad)»
# https://sergiolearns.com/archivos-de-texto-en-python-ejercicios/

# Nivel 1 · Contar lo que hay en el diario


def contar(nombre):
    lineas = vacias = sesiones = minutos = 0
    with open(nombre, 'r', encoding='utf-8') as f:
        for linea in f:
            lineas += 1                      # toda línea cuenta, también las vacías
            limpia = linea.strip()
            if limpia == '':                 # '\n' a secas (o solo espacios)
                vacias += 1
                continue
            sesiones += 1
            minutos += int(limpia.split(';')[2])   # el tercer campo son los minutos
    return lineas, vacias, sesiones, minutos


lineas, vacias, sesiones, minutos = contar('octubre.txt')
print('Líneas:', lineas)
print('Vacías:', vacias)
print('Sesiones:', sesiones)
print('Minutos:', minutos)
