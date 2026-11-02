# Programa 1: generador de Fibonacci infinito
# Del artículo «Iteradores y generadores en Python — práctica con Fibonacci sin fin, una tubería de primos y la cola de reservas de la biblioteca (y el portátil que se quedó pensando)»
# https://sergiolearns.com/iteradores-y-generadores-en-python-practica/

def fibonacci():
    """Generador infinito de la sucesión de Fibonacci: 0, 1, 1, 2, 3, 5..."""
    anterior, actual = 0, 1
    while True:
        yield anterior
        anterior, actual = actual, anterior + actual   # la derecha se calcula ANTES de asignar


def hasta(limite, gen):
    """Deja pasar los valores de gen mientras no superen el límite."""
    for x in gen:
        if x > limite:
            return                # return en un generador = se acabó (StopIteration)
        yield x


def primeros(n, gen):
    """Los n primeros valores de cualquier generador (como itertools.islice)."""
    for _ in range(n):
        yield next(gen)


print('Primeros 10:', list(primeros(10, fibonacci())))
print('Hasta 100:  ', list(hasta(100, fibonacci())))
pares = [n for n in hasta(500, fibonacci()) if n % 2 == 0]
print('Pares hasta 500:', pares)

for pos, n in enumerate(fibonacci()):          # enumerate también va pidiendo de uno en uno
    if n >= 1000:
        print(f'Primero >= 1000: {n} (posición {pos})')
        break

g = fibonacci()
next(g)                                        # saltamos el 0 para no dividir entre 0
a = next(g)
for i in range(1, 21):
    b = next(g)
    if i in (5, 10, 20):
        print(f'Cociente tras {i:2} pasos: {b / a:.6f}')
    a = b
