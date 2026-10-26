# Solución del ejercicio 2 · Conversor de temperatura
# Del artículo «Variables y tipos de datos en Python — ejercicios con un recibo, temperaturas, propinas y tu ficha de estudiante (y un True que vale 1)»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# Solución del ejercicio 2 · Conversor de temperatura
celsius_txt = "100"              # lo que llegaría de input()
celsius = float(celsius_txt)     # float: una temperatura puede ser 36.6

fahrenheit = celsius * 9 / 5 + 32
kelvin = celsius + 273.15

print(f"{celsius} °C equivale a:")
print(f"→ {fahrenheit} °F")
print(f"→ {kelvin} K")
