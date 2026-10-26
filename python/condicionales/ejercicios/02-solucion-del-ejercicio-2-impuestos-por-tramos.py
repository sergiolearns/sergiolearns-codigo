# Solución del ejercicio 2 · Calculadora de impuestos por tramos
# Del artículo «Condicionales en Python — ejercicios resueltos con películas, tramos de impuestos, contraseñas y el juego de adivinar el número (y el or que dejaba entrar a todo el mundo)»
# https://sergiolearns.com/condicionales-en-python-ejercicios/

# Ejercicio 2 — Impuesto por tramos (versión simplificada)
salario = 28000.0

# Con <= los tramos van de MENOR a MAYOR: el primero que se cumple es el bueno
if salario <= 12450:
    tipo = 19
elif salario <= 20200:            # aquí ya sabemos que salario > 12450
    tipo = 24
elif salario <= 35200:
    tipo = 30
elif salario <= 60000:
    tipo = 37
else:
    tipo = 45

impuesto = salario * tipo / 100
neto = salario - impuesto
mensual = neto / 12

print("--- Cálculo simplificado ---")
print(f"Salario bruto: {salario:.2f} €")
print(f"Tipo aplicado: {tipo} %")
print(f"Impuesto: {impuesto:.2f} €")
print(f"Salario neto: {neto:.2f} €")
print(f"Neto al mes (12 pagas): {mensual:.2f} €")
