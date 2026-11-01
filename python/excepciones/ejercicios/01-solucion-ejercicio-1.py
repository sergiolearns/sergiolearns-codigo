# Solución del ejercicio 1 · Conversor de unidades
# Del artículo «Excepciones en Python — ejercicios con un conversor, contraseñas con su familia de errores y una agenda que siempre se guarda (y el finally que cerró un fichero que no existía)»
# https://sergiolearns.com/excepciones-en-python-ejercicios/

# Lo que teclearía la persona (en tu ordenador, cambia leer() por input()):
TECLEO = iter(['abc', '7', '1', '-5', '1', 'hola', '1', '100', '5', '-40', '0'])


def leer(mensaje):
    texto = next(TECLEO)     # el siguiente dato «tecleado»
    print(mensaje + texto)   # lo enseñamos como se vería en la terminal
    return texto


CONVERSIONES = {   # opción: (origen, destino, fórmula)
    1: ('km', 'millas', lambda x: x * 0.621371),
    2: ('millas', 'km', lambda x: x * 1.60934),
    3: ('kg', 'libras', lambda x: x * 2.20462),
    4: ('libras', 'kg', lambda x: x / 2.20462),
    5: ('Celsius', 'Fahrenheit', lambda x: x * 9 / 5 + 32),
    6: ('Fahrenheit', 'Celsius', lambda x: (x - 32) * 5 / 9),
}
SIN_NEGATIVOS = {1, 2, 3, 4}   # distancias y pesos; las temperaturas sí pueden ser negativas

print('=== CONVERSOR DE UNIDADES ===')
for k, (origen, destino, _) in CONVERSIONES.items():
    print(f'{k}. {origen} -> {destino}')
print('0. Salir')
while True:
    try:                                     # try 1: solo la opción
        opcion = int(leer('Elige conversión: '))
    except ValueError:
        print('Error: introduce un número entero entre 0 y 6')
        continue
    if opcion == 0:
        print('Hasta luego')
        break
    if opcion not in CONVERSIONES:           # un entero, pero no está en el menú
        print('Error: esa opción no existe')
        continue
    try:                                     # try 2: solo el valor
        valor = float(leer('Valor a convertir: '))
    except ValueError:
        print('Error: introduce un número válido')
        continue
    if opcion in SIN_NEGATIVOS and valor < 0:
        print('Error: el valor no puede ser negativo para esta conversión')
        continue
    origen, destino, formula = CONVERSIONES[opcion]
    print(f'{valor} {origen} = {formula(valor):.2f} {destino}')
