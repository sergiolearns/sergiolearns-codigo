# Solución Ejercicio 2 — Interés compuesto:
# Del artículo «Bucles en Python — ponlos a prueba con estos ejercicios»
# https://sergiolearns.com/bucles-en-python-ejercicios/

# Calculadora de interés compuesto
capital_inicial = float(input("Capital inicial (€): "))
interes = float(input("Interés anual (%): "))
años = int(input("Número de años: "))

capital = capital_inicial
print(f"\n--- Evolución de la inversión ---")

for año in range(1, años + 1):
    capital_anterior = capital
    capital = round(capital * (1 + interes / 100), 2)
    ganancia_año = round(capital - capital_anterior, 2)
    print(f"Año {año}:  {capital} €  (+{ganancia_año} €)")

total_ganado = round(capital - capital_inicial, 2)
rentabilidad = round((total_ganado / capital_inicial) * 100, 2)

print(f"\nCapital final:   {capital} €")
print(f"Total ganado:    {total_ganado} €")
print(f"Rentabilidad:    {rentabilidad}%")
