# Programa 1 · Validador robusto de datos (ficha de matrícula)
# Del artículo «Excepciones en Python — práctica con cuatro programas que no se rompen: una ficha de matrícula, una calculadora, un lector de notas y fracciones (y el «12,5» que no quería ser número)»
# https://sergiolearns.com/excepciones-en-python-practica/

# Lo que teclearía la persona (en tu ordenador, cambia leer() por input()):
TECLEO = iter(['Laura Pérez', 'doce', '12', '22', '15', '12,5', '12.5', 'virtual', 'Presencial'])


def leer(mensaje):
    texto = next(TECLEO)     # el siguiente dato «tecleado»
    print(mensaje + texto)   # lo enseñamos como se vería en la terminal
    return texto


def pedir_entero(mensaje, minimo, maximo):
    while True:                                  # insiste hasta que el dato valga
        try:
            valor = int(leer(mensaje))           # ValueError si no es un entero
            if not minimo <= valor <= maximo:
                raise ValueError(f'tiene que estar entre {minimo} y {maximo}')
            return valor                         # dato bueno: salimos del bucle
        except ValueError as err:                # los dos casos acaban aquí
            print(f'  Error: {err}')


def pedir_decimal(mensaje, minimo, maximo):
    while True:
        try:
            valor = float(leer(mensaje))
            if not minimo <= valor <= maximo:
                raise ValueError(f'tiene que estar entre {minimo} y {maximo}')
            return valor
        except ValueError as err:
            print(f'  Error: {err}')


def pedir_opcion(mensaje, opciones):
    while True:
        try:
            opcion = leer(mensaje).strip().lower()   # ' Presencial' -> 'presencial'
            if opcion not in opciones:
                raise ValueError(f'elige una de estas: {", ".join(opciones)}')
            return opcion
        except ValueError as err:
            print(f'  Error: {err}')


print('=== FICHA DE MATRÍCULA ===')
nombre = leer('Nombre: ').strip() or 'Sin nombre'
edad = pedir_entero('Edad (16-99): ', 16, 99)
nota = pedir_decimal('Nota de acceso (5-14): ', 5.0, 14.0)
modalidad = pedir_opcion('Modalidad (presencial/online): ', ['presencial', 'online'])
print('--- Ficha guardada ---')
print(f'Nombre:    {nombre}')
print(f'Edad:      {edad} años')
print(f'Nota:      {nota:.2f}')
print(f'Modalidad: {modalidad}')
