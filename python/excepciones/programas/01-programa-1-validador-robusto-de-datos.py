# Excepciones en Python práctica — Programa 1: Validador robusto de datos
# Del artículo «Excepciones en Python — 4 programas reales que no se rompen»
# https://sergiolearns.com/excepciones-en-python-practica/

def pedir_entero(mensaje, minimo=None, maximo=None):
    while True:
        try:
            valor = int(input(mensaje))
            if minimo is not None and valor < minimo:
                raise ValueError(f'El valor debe ser >= {minimo}')
            if maximo is not None and valor > maximo:
                raise ValueError(f'El valor debe ser <= {maximo}')
            return valor
        except ValueError as err:
            print(f'Error: {err}')

def pedir_flotante(mensaje, minimo=None, maximo=None):
    while True:
        try:
            valor = float(input(mensaje))
            if minimo is not None and valor < minimo:
                raise ValueError(f'El valor debe ser >= {minimo}')
            if maximo is not None and valor > maximo:
                raise ValueError(f'El valor debe ser <= {maximo}')
            return valor
        except ValueError as err:
            print(f'Error: {err}')

def pedir_opcion(mensaje, opciones_validas):
    while True:
        try:
            opcion = input(mensaje).strip().lower()
            if opcion not in opciones_validas:
                raise ValueError(f'Opciones válidas: {opciones_validas}')
            return opcion
        except ValueError as err:
            print(f'Error: {err}')

# Programa principal
print('=== FICHA DE ESTUDIANTE ===\n')

nombre = input('Nombre: ').strip()
if not nombre:
    nombre = 'Sin nombre'

edad = pedir_entero('Edad (16-99): ', minimo=16, maximo=99)
nota = pedir_flotante('Nota media (0-10): ', minimo=0.0, maximo=10.0)
modalidad = pedir_opcion('Modalidad (presencial/online): ',
                         ['presencial', 'online'])

print(f'\n--- Ficha guardada ---')
print(f'Nombre:    {nombre}')
print(f'Edad:      {edad} años')
print(f'Nota:      {nota:.2f}')
print(f'Modalidad: {modalidad}')
