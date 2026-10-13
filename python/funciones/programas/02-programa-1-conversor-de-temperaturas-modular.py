# Funciones en Python práctica — Programa 1: Conversor de temperaturas modular
# Del artículo «Funciones en Python — 3 programas que demuestran su poder real»
# https://sergiolearns.com/funciones-en-python-practica/

# CON FUNCIONES — modular y reutilizable
def celsius_a_fahrenheit(celsius):
    return round((celsius * 9/5) + 32, 2)

def celsius_a_kelvin(celsius):
    return round(celsius + 273.15, 2)

def fahrenheit_a_celsius(fahrenheit):
    return round((fahrenheit - 32) * 5/9, 2)

def kelvin_a_celsius(kelvin):
    return round(kelvin - 273.15, 2)

def mostrar_menu():
    print("=== CONVERSOR DE TEMPERATURAS ===\n")
    print("1. Celsius → Fahrenheit")
    print("2. Celsius → Kelvin")
    print("3. Fahrenheit → Celsius")
    print("4. Kelvin → Celsius")
    print("5. Conversión completa desde Celsius")

def conversion_completa(celsius):
    print(f"\n{celsius}°C equivale a:")
    print(f"  → {celsius_a_fahrenheit(celsius)}°F")
    print(f"  → {celsius_a_kelvin(celsius)}K")
    print(f"  → {celsius_a_celsius_via_fahrenheit(celsius)}°C (via °F, debe ser igual)")

def celsius_a_celsius_via_fahrenheit(celsius):
    return fahrenheit_a_celsius(celsius_a_fahrenheit(celsius))

# Programa principal
mostrar_menu()
opcion = int(input("\nElige opción (1-5): "))
temp = float(input("Temperatura: "))

if opcion == 1:
    print(f"\n{temp}°C = {celsius_a_fahrenheit(temp)}°F")
elif opcion == 2:
    print(f"\n{temp}°C = {celsius_a_kelvin(temp)}K")
elif opcion == 3:
    print(f"\n{temp}°F = {fahrenheit_a_celsius(temp)}°C")
elif opcion == 4:
    print(f"\n{temp}K = {kelvin_a_celsius(temp)}°C")
elif opcion == 5:
    conversion_completa(temp)
else:
    print("Opción no válida")
