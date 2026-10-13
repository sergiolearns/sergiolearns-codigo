# Iteradores y generadores en Python práctica — Programa 1: Generador de Fibonacci infinito
# Del artículo «Iteradores y generadores en Python — 3 programas reales que los hacen tangibles»
# https://sergiolearns.com/iteradores-y-generadores-en-python-practica/

def fibonacci():
    """Generador infinito de la sucesión de Fibonacci."""
    anterior = 0
    actual = 1

    while True:
        yield anterior           # devuelve el valor actual y pausa
        anterior, actual = actual, anterior + actual    # avanza

# Los primeros 10 números de Fibonacci
print("Primeros 10 números de Fibonacci:")
gen = fibonacci()
for i in range(10):
    print(next(gen), end=' ')
print()
# → 0 1 1 2 3 5 8 13 21 34

# Fibonacci hasta un límite
print("\nFibonacci hasta 100:")
for n in fibonacci():
    if n > 100:
        break
    print(n, end=' ')
print()
# → 0 1 1 2 3 5 8 13 21 34 55 89

# El décimo número de Fibonacci
gen = fibonacci()
for _ in range(9):
    next(gen)
print(f"\nDécimo número de Fibonacci: {next(gen)}")
# → 34

# Fibonacci pares hasta 500
print("\nFibonacci pares hasta 500:")
for n in fibonacci():
    if n > 500:
        break
    if n % 2 == 0:
        print(n, end=' ')
print()
# → 0 2 8 34 144 376 — no todos, solo los pares
