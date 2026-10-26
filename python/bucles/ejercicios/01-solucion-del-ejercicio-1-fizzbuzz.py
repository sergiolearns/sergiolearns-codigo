# Solución del ejercicio 1 · FizzBuzz
# Del artículo «Bucles en Python — ejercicios con FizzBuzz, una inversión que crece, primos y un plan de ahorro (y el break que solo salía de la bandeja)»
# https://sergiolearns.com/bucles-en-python-ejercicios/

# Nivel básico · Ejercicio 1: FizzBuzz del 1 al 100, diez por línea
for i in range(1, 101):           # 101 para que el 100 entre
    if i % 3 == 0 and i % 5 == 0: # PRIMERO el caso doble: si no, el 15 se quedaría en "Fizz"
        texto = "FizzBuzz"
    elif i % 3 == 0:
        texto = "Fizz"
    elif i % 5 == 0:
        texto = "Buzz"
    else:
        texto = str(i)            # el número tal cual, como texto
    print(texto, end=" ")         # todo en la misma línea...
    if i % 10 == 0:
        print()                   # ...hasta llegar a un múltiplo de 10
