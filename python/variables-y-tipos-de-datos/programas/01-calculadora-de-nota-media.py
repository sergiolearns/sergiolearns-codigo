# Programa 1 — Calculadora de nota media
# Del artículo «Variables y tipos de datos en Python — práctica real con VS Code»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-practica/

# Calculadora de nota media
# Pedimos las tres notas
nota1 = float(input("Introduce la nota 1: "))
nota2 = float(input("Introduce la nota 2: "))
nota3 = float(input("Introduce la nota 3: "))

# Calculamos la media
media = (nota1 + nota2 + nota3) / 3

# Mostramos el resultado
print("Tu nota media es:", media)
