# Excepciones en Python práctica — Programa 2: Calculadora que no se rompe
# Del artículo «Excepciones en Python — 4 programas reales que no se rompen»
# https://sergiolearns.com/excepciones-en-python-practica/

def obtener_numero(mensaje):
    while True:
        try:
            return float(input(mensaje))
        except ValueError:
            print('Error: introduce un número válido')

def calcular(a, operacion, b):
    try:
        if operacion == '+':
            return a + b
        elif operacion == '-':
            return a - b
        elif operacion == '*':
            return a * b
        elif operacion == '/':
            if b == 0:
                raise ZeroDivisionError('No se puede dividir entre cero')
            return a / b
        elif operacion == '//':
            if b == 0:
                raise ZeroDivisionError('No se puede dividir entre cero')
            return a // b
        elif operacion == '%':
            if b == 0:
                raise ZeroDivisionError('No se puede usar módulo con cero')
            return a % b
        elif operacion == '**':
            return a ** b
        else:
            raise ValueError(f'Operación desconocida: {operacion}')
    except ZeroDivisionError as err:
        print(f'Error matemático: {err}')
        return None
    except ValueError as err:
        print(f'Error de operación: {err}')
        return None

def mostrar_menu():
    print('\n=== CALCULADORA ===')
    print('Operaciones: + - * / // % **')
    print('Escribe "salir" para terminar')

operaciones_validas = {'+', '-', '*', '/', '//', '%', '**'}

mostrar_menu()
while True:
    entrada = input('\nOperación (ej: 10 + 3): ').strip()

    if entrada.lower() == 'salir':
        print('Hasta luego')
        break

    try:
        partes = entrada.split()
        if len(partes) != 3:
            raise ValueError('Formato incorrecto — usa: número operación número')

        a = float(partes[0])
        operacion = partes[1]
        b = float(partes[2])

        if operacion not in operaciones_validas:
            raise ValueError(f'Operación no válida: {operacion}')

        resultado = calcular(a, operacion, b)
        if resultado is not None:
            print(f'Resultado: {a} {operacion} {b} = {resultado}')

    except ValueError as err:
        print(f'Error: {err}')
