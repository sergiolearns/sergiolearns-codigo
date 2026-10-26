# Programa 1 · Calculadora de nota media
# Del artículo «Variables y tipos de datos en Python — práctica con tu nota media, el IMC y el precio de la matrícula (y unos céntimos que salen de la nada)»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-practica/

# Programa 1 · Calculadora de nota media
# Las notas llegan como TEXTO, igual que si las hubieras leído con input()
nota1_txt = "7"
nota2_txt = "8.5"
nota3_txt = "6"

# 1) Convertir: float y no int, porque una nota puede llevar decimales ("8.5")
nota1 = float(nota1_txt)
nota2 = float(nota2_txt)
nota3 = float(nota3_txt)

# 2) Calcular: el paréntesis hace que se sume TODO antes de dividir
media = (nota1 + nota2 + nota3) / 3
print("Media sin redondear:", media)

# 3) Redondear a 2 decimales solo al final, para enseñar el resultado
media_redondeada = round(media, 2)

# 4) Un bool guarda la respuesta a "¿he aprobado?"
aprobado = media_redondeada >= 5.0

print(f"Tu nota media es: {media_redondeada}")
print(f"¿Aprobado?: {aprobado}")
print(type(nota1_txt), type(nota1), type(aprobado))
