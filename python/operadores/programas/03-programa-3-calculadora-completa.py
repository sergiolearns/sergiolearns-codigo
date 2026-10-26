# Programa 3 · Calculadora completa
# Del artículo «Operadores en Python — práctica con un conversor de unidades, el bono de cafés con IGIC en céntimos y una calculadora con negativos (y el céntimo que se me perdía)»
# https://sergiolearns.com/operadores-en-python-practica/

# Calculadora completa: todas las operaciones con el mismo par de números
a = 17
b = 5

print(f"=== CALCULADORA: a = {a}, b = {b} ===")
print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")          # división real
print(f"{a} // {b} = {a // b}")        # cociente entero (hacia abajo)
print(f"{a} % {b} = {a % b}")          # resto, con el signo de b
print(f"{a} ** {b} = {a ** b}")

print("--- Comprobaciones ---")
print("¿a divisible entre b?", a % b == 0)
print("¿a es par?", a % 2 == 0)
print("¿b * (a // b) + a % b == a?", b * (a // b) + a % b == a)   # siempre True
print("¿b distinto de 0 y a / b mayor que 3?", b != 0 and a / b > 3)
