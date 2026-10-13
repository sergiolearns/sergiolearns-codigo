# Solución Ejercicio 1:
# Del artículo «Excepciones en Python — ejercicios para escribir código que no se rompe»
# https://sergiolearns.com/excepciones-en-python-ejercicios/

CONVERSIONES = {
    1: ('km', 'millas', lambda x: x * 0.621371),
    2: ('millas', 'km', lambda x: x * 1.60934),
    3: ('kg', 'libras', lambda x: x * 2.20462),
    4: ('libras', 'kg', lambda x: x / 2.20462),
    5: ('Celsius', 'Fahrenheit', lambda x: x * 9/5 + 32),
    6: ('Fahrenheit', 'Celsius', lambda x: (x - 32) * 5/9),
}

NO_NEGATIVAS = {1, 2, 3, 4}

print('=== CONVERSOR DE UNIDADES ===')
for k, (origen, destino, _) in CONVERSIONES.items():
    print(f'{k}. {origen} → {destino}')
print('0. Salir\n')

while True:
    try:
        opcion = int(input('Elige conversión: '))
    except ValueError:
        print('Error: introduce un número entero entre 0 y 6\n')
        continue

    if opcion == 0:
        print('Hasta luego')
        break

    if opcion not in CONVERSIONES:
        print('Error: opción no válida\n')
        continue

    try:
        valor = float(input('Valor a convertir: '))
    except ValueError:
        print('Error: introduce un número válido\n')
        continue

    if opcion in NO_NEGATIVAS and valor < 0:
        print('Error: el valor no puede ser negativo para esta conversión\n')
        continue

    origen, destino, formula = CONVERSIONES[opcion]
    resultado = formula(valor)
    print(f'{valor} {origen} = {resultado:.2f} {destino}\n')
