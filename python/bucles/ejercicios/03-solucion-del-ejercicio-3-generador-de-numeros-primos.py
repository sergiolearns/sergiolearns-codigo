# Solución del ejercicio 3 · Generador de números primos
# Del artículo «Bucles en Python — ejercicios con FizzBuzz, una inversión que crece, primos y un plan de ahorro (y el break que solo salía de la bandeja)»
# https://sergiolearns.com/bucles-en-python-ejercicios/

# Nivel intermedio · Ejercicio 3: números primos hasta n
n = 30
primos = []
comprobaciones = 0                # cuántas divisiones hace en total

for numero in range(2, n + 1):    # bucle exterior: cada candidato
    es_primo = True               # inocente hasta que se demuestre lo contrario
    for divisor in range(2, int(numero ** 0.5) + 1):   # basta con llegar a la raíz
        comprobaciones += 1
        if numero % divisor == 0:
            es_primo = False
            break                 # ya hay un divisor: no hace falta seguir con ESTE número
    if es_primo:
        primos.append(numero)

texto = ""
for p in primos:
    texto += str(p) + " "
print(f"Primos hasta {n}: {texto}")
print(f"Total: {len(primos)} primos")
print(f"Divisiones hechas: {comprobaciones}")
