# Iteradores y generadores en Python práctica — Programa 2: Generador de números primos
# Del artículo «Iteradores y generadores en Python — 3 programas reales que los hacen tangibles»
# https://sergiolearns.com/iteradores-y-generadores-en-python-practica/

def es_primo(n):
    """Comprueba si n es primo. Función auxiliar."""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    # solo comprueba divisores hasta la raíz cuadrada — optimización clave
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2    # solo impares
    return True


def primos():
    """Generador infinito de números primos."""
    yield 2        # el único par primo — caso especial
    candidato = 3
    while True:
        if es_primo(candidato):
            yield candidato
        candidato += 2    # solo comprobamos impares


def primos_hasta(limite):
    """Generador de primos hasta un límite dado."""
    for p in primos():
        if p > limite:
            return    # return en un generador → StopIteration
        yield p


def n_primos(n):
    """Generador de los primeros n primos."""
    contador = 0
    for p in primos():
        if contador >= n:
            return
        yield p
        contador += 1


# Los primeros 15 primos
print("Primeros 15 primos:")
for p in n_primos(15):
    print(p, end=' ')
print()
# → 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47

# Primos hasta 50
print("\nPrimos hasta 50:")
for p in primos_hasta(50):
    print(p, end=' ')
print()
# → 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47

# ¿Cuántos primos hay hasta 100?
total = sum(1 for _ in primos_hasta(100))
print(f"\nPrimos hasta 100: {total}")
# → 25

# El primo número 50
gen = primos()
for _ in range(49):
    next(gen)
print(f"El primo número 50: {next(gen)}")
# → 229

# Primos entre 100 y 150
print("\nPrimos entre 100 y 150:")
for p in primos():
    if p > 150:
        break
    if p >= 100:
        print(p, end=' ')
print()
# → 101 103 107 109 113 127 131 137 139 149
