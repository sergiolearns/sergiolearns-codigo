# Programa 2: generador de números primos
# Del artículo «Iteradores y generadores en Python — práctica con Fibonacci sin fin, una tubería de primos y la cola de reservas de la biblioteca (y el portátil que se quedó pensando)»
# https://sergiolearns.com/iteradores-y-generadores-en-python-practica/

def es_primo(n):
    """True si n es primo. Solo prueba divisores impares hasta la raíz cuadrada."""
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2             # el 2 es el único par primo
    i = 3
    while i * i <= n:             # si n tiene un divisor, uno de ellos es <= raíz de n
        if n % i == 0:
            return False
        i += 2
    return True


def primos():
    """Generador infinito de primos."""
    yield 2
    candidato = 3
    while True:
        if es_primo(candidato):
            yield candidato
        candidato += 2            # los pares (salvo el 2) no hace falta mirarlos


def primos_hasta(limite):
    for p in primos():            # consume el generador infinito de uno en uno
        if p > limite:
            return
        yield p


def n_primos(n):
    contador = 0
    for p in primos():
        if contador == n:
            return
        yield p
        contador += 1


def gemelos(gen):
    """Parejas de primos que se diferencian en 2, a partir de un generador de primos."""
    anterior = next(gen)
    for p in gen:                 # el for sigue por donde lo dejó el next()
        if p - anterior == 2:
            yield (anterior, p)
        anterior = p


print('Primeros 15:', list(n_primos(15)))
print('Hasta 100 hay', sum(1 for _ in primos_hasta(100)), 'primos')

g = primos()
for _ in range(49):
    next(g)
print('El primo número 50:', next(g))

print('Entre 100 y 150:', [p for p in primos_hasta(150) if p >= 100])

pares = gemelos(primos())
print('Primeras 5 parejas de gemelos:', [next(pares) for _ in range(5)])
