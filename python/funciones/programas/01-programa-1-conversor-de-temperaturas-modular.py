# Funciones en Python práctica — Programa 1: Conversor de temperaturas modular
# Del artículo «Funciones en Python — 3 programas que demuestran su poder real»
# https://sergiolearns.com/funciones-en-python-practica/

# SIN FUNCIONES — código repetitivo y difícil de mantener
print("=== CONVERSOR DE TEMPERATURAS ===\n")
print("1. Celsius a Fahrenheit")
print("2. Celsius a Kelvin")
print("3. Fahrenheit a Celsius")

opcion = int(input("\nElige opción: "))
temp = float(input("Temperatura: "))

if opcion == 1:
    resultado = (temp * 9/5) + 32
    print(f"{temp}°C = {round(resultado, 2)}°F")
elif opcion == 2:
    resultado = temp + 273.15
    print(f"{temp}°C = {round(resultado, 2)}K")
elif opcion == 3:
    resultado = (temp - 32) * 5/9
    print(f"{temp}°F = {round(resultado, 2)}°C")
