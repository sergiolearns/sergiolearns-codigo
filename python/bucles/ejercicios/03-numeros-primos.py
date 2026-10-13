# Solución Ejercicio 3 — Números primos:
# Del artículo «Bucles en Python — ponlos a prueba con estos ejercicios»
# https://sergiolearns.com/bucles-en-python-ejercicios/

# Generador de números primos
import math

n = int(input("Hasta qué número buscar primos: "))
primos = []

for numero in range(2, n + 1):
    es_primo = True

    for divisor in range(2, int(math.sqrt(numero)) + 1):
        if numero % divisor == 0:
            es_primo = False
            break    # encontrado divisor, no hace falta seguir

    if es_primo:
        primos.append(numero)

print(f"\nNúmeros primos hasta {n}:")
print(", ".join(str(p) for p in primos))
print(f"\nTotal de primos encontrados: {len(primos)}")
