# Programa 2 · Calculadora que no se rompe
# Del artículo «Excepciones en Python — práctica con cuatro programas que no se rompen: una ficha de matrícula, una calculadora, un lector de notas y fracciones (y el «12,5» que no quería ser número)»
# https://sergiolearns.com/excepciones-en-python-practica/

# Lo que teclearía la persona (en tu ordenador, cambia leer() por input()):
TECLEO = iter(['10 / 0', 'diez + 3', '10 ^ 3', '8 //', '2 ** 10000', '7 % 0', '2 ** 10', 'salir'])


def leer(mensaje):
    texto = next(TECLEO)     # el siguiente dato «tecleado»
    print(mensaje + texto)   # lo enseñamos como se vería en la terminal
    return texto


OPERACIONES = {                          # símbolo -> función que hace la cuenta
    '+': lambda a, b: a + b,
    '-': lambda a, b: a - b,
    '*': lambda a, b: a * b,
    '/': lambda a, b: a / b,
    '//': lambda a, b: a // b,
    '%': lambda a, b: a % b,
    '**': lambda a, b: a ** b,
}


def calcular(linea):
    partes = linea.split()
    if len(partes) != 3:                 # «8 //» solo tiene dos trozos
        raise ValueError('formato: número operación número')
    a, op, b = partes
    if op not in OPERACIONES:
        raise ValueError(f'operación desconocida: {op}')
    return OPERACIONES[op](float(a), float(b))   # float() también puede fallar


print('=== CALCULADORA (escribe «salir» para terminar) ===')
while True:
    linea = leer('> ')
    if linea == 'salir':
        print('Hasta luego')
        break
    try:
        print('  =', calcular(linea))
    except ZeroDivisionError as err:     # la lanza Python, no nosotros
        print('  Error matemático:', err)
    except OverflowError as err:         # resultado demasiado grande para un float
        print('  Demasiado grande:', err)
    except ValueError as err:            # nuestros raise y los de float()
        print('  Error:', err)
