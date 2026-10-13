# Programa 2 — Calculador del IMC
# Del artículo «Variables y tipos de datos en Python — práctica real con VS Code»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-practica/

# Calculador del IMC
nombre = input("¿Cómo te llamas? ")
peso = float(input("¿Cuánto pesas en kg? "))
altura = float(input("¿Cuánto mides en metros? "))

# Calculamos el IMC
imc = peso / (altura ** 2)
imc_redondeado = round(imc, 1)

print(f"\nResultados para {nombre}:")    
print(f"Tu IMC es: {imc_redondeado}")
