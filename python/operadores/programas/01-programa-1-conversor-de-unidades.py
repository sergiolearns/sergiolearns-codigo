# Operadores en Python práctica — Programa 1: Conversor de unidades
# Del artículo «Operadores en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/operadores-en-python-practica/

# Conversor de unidades
print("=== CONVERSOR DE UNIDADES ===\n")

# Entrada
valor = float(input("Introduce el valor a convertir: "))

print("\n--- Distancia ---")
km_a_millas = round(valor * 0.621371, 4)
millas_a_km  = round(valor * 1.60934, 4)
print(f"{valor} km → {km_a_millas} millas")
print(f"{valor} millas → {millas_a_km} km")

print("\n--- Peso ---")
kg_a_libras = round(valor * 2.20462, 4)
libras_a_kg = round(valor * 0.453592, 4)
print(f"{valor} kg → {kg_a_libras} libras")
print(f"{valor} libras → {libras_a_kg} kg")

print("\n--- Temperatura ---")
celsius_a_fahrenheit = round((valor * 9/5) + 32, 2)
fahrenheit_a_celsius = round((valor - 32) * 5/9, 2)
print(f"{valor} °C → {celsius_a_fahrenheit} °F")
print(f"{valor} °F → {fahrenheit_a_celsius} °C")
