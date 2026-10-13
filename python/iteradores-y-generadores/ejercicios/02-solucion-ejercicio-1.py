# Solución Ejercicio 1:
# Del artículo «Iteradores y generadores en Python — ejercicios para dominar yield e iter»
# https://sergiolearns.com/iteradores-y-generadores-en-python-ejercicios/

def multiplos_infinitos(base):
    """Generador infinito de múltiplos de base."""
    multiplo = base
    while True:
        yield multiplo
        multiplo += base


def multiplos_hasta(base, limite):
    """Generador de múltiplos de base hasta limite."""
    multiplo = base
    while multiplo <= limite:
        yield multiplo
        multiplo += base


def primeros_n_multiplos(base, n):
    """Generador de los primeros n múltiplos de base."""
    contador = 0
    for m in multiplos_infinitos(base):
        if contador >= n:
            return
        yield m
        contador += 1


# Múltiplos de 3 hasta 30
print("Múltiplos de 3 hasta 30:")
for m in multiplos_hasta(3, 30):
    print(m, end=' ')
print()

# Primeros 8 múltiplos de 7
print("\nPrimeros 8 múltiplos de 7:")
for m in primeros_n_multiplos(7, 8):
    print(m, end=' ')
print()

# Múltiplos de 5 entre 20 y 50
print("\nMúltiplos de 5 entre 20 y 50:")
for m in multiplos_hasta(5, 50):
    if m >= 20:
        print(m, end=' ')
print()

# Múltiplos comunes de 3 y 5 hasta 100
print("\nMúltiplos comunes de 3 y 5 hasta 100:")
for m in multiplos_hasta(3, 100):
    if m % 5 == 0:
        print(m, end=' ')
print()
