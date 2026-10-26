# Solución del ejercicio 2 · Calculadora de interés compuesto
# Del artículo «Bucles en Python — ejercicios con FizzBuzz, una inversión que crece, primos y un plan de ahorro (y el break que solo salía de la bandeja)»
# https://sergiolearns.com/bucles-en-python-ejercicios/

# Nivel básico · Ejercicio 2: interés compuesto año a año
capital_inicial = 1000.0
interes = 5.0                     # % anual
años = 5

capital = capital_inicial         # el capital que va creciendo (el inicial no se toca)
print("--- Evolución de la inversión ---")
for año in range(1, años + 1):    # sabemos cuántos años: for
    anterior = capital            # se guarda ANTES de actualizar, para la ganancia del año
    capital = round(capital * (1 + interes / 100), 2)
    ganancia = round(capital - anterior, 2)
    print(f"Año {año}: {capital:.2f} € (+{ganancia:.2f} €)")

total = round(capital - capital_inicial, 2)
print(f"Capital final: {capital:.2f} €")
print(f"Total ganado: {total:.2f} €")
print(f"Rentabilidad: {total / capital_inicial * 100:.2f} %")
