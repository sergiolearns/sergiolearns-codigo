# Programa 1 — Calculadora de nota media
# Del artículo «Variables y tipos de datos en Python — práctica real con VS Code»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-practica/

# Calculadora de nota media — versión mejorada
nota1 = float(input("Introduce la nota 1: "))
nota2 = float(input("Introduce la nota 2: "))
nota3 = float(input("Introduce la nota 3: "))

media = (nota1 + nota2 + nota3) / 3

# Redondeamos a 2 decimales
media_redondeada = round(media, 2)

# Determinamos si aprobamos
aprobado = media_redondeada >= 5.0

print(f"Tu nota media es: {media_redondeada}")
print(f"¿Aprobado?: {aprobado}")
