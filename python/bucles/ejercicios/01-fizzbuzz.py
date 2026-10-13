# Solución Ejercicio 1 — FizzBuzz:
# Del artículo «Bucles en Python — ponlos a prueba con estos ejercicios»
# https://sergiolearns.com/bucles-en-python-ejercicios/

# FizzBuzz
for i in range(1, 101):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
