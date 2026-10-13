# Solución Ejercicio 2
# Del artículo «Variables y tipos de datos en Python — ejercicios con solución y chuletario»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# Conversor de temperatura
celsius = float(input("Temperatura en Celsius: "))

fahrenheit = (celsius * 9/5) + 32
kelvin = celsius + 273.15

print(f"\n{celsius} °C equivale a:")
print(f"→ {fahrenheit} °F")
print(f"→ {kelvin} K")
