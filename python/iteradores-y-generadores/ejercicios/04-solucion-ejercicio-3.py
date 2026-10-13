# Solución Ejercicio 3:
# Del artículo «Iteradores y generadores en Python — ejercicios para dominar yield e iter»
# https://sergiolearns.com/iteradores-y-generadores-en-python-ejercicios/

def divisores_propios(n):
    """Devuelve lista de divisores propios de n."""
    if n < 2:
        return []
    divisores = [1]
    for i in range(2, n // 2 + 1):
        if n % i == 0:
            divisores.append(i)
    return divisores


def es_perfecto(n):
    """Comprueba si n es un número perfecto."""
    if n < 2:
        return False
    return sum(divisores_propios(n)) == n


def perfectos():
    """Generador infinito de números perfectos."""
    candidato = 2
    while True:
        if es_perfecto(candidato):
            yield candidato
        candidato += 1


def perfectos_hasta(limite):
    """Generador de números perfectos hasta limite."""
    for p in perfectos():
        if p > limite:
            return    # StopIteration — señal de fin
        yield p


# Comprobaciones individuales
print(f"¿Es 6 perfecto? {es_perfecto(6)}")
print(f"¿Es 12 perfecto? {es_perfecto(12)}")
print(f"¿Es 28 perfecto? {es_perfecto(28)}")

# Perfectos hasta 10000
print("\nPerfectos hasta 10000:")
for p in perfectos_hasta(10000):
    print(p, end=' ')
print()

# Divisores de cada perfecto hasta 10000
print()
for p in perfectos_hasta(10000):
    divs = divisores_propios(p)
    print(f"Divisores de {p}: {divs} → suma: {sum(divs)}")
