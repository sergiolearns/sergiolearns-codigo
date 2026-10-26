# Programa 2 · Calculador del IMC
# Del artículo «Variables y tipos de datos en Python — práctica con tu nota media, el IMC y el precio de la matrícula (y unos céntimos que salen de la nada)»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-practica/

# Programa 2 · Calculador del IMC
nombre = "Sergio"        # str: ya es texto, no hay que convertirlo
peso_txt = "70"          # kilos, tal como llegaría de input()
altura_txt = "1.78"      # metros, con PUNTO decimal

peso = float(peso_txt)
altura = float(altura_txt)

# IMC = peso / altura². ** es la potencia y se calcula antes que la división
imc = peso / altura ** 2
imc_redondeado = round(imc, 1)

print(f"\nResultados para {nombre}:")
print(f"Altura al cuadrado: {altura ** 2}")
print(f"IMC sin redondear: {imc}")
print(f"Tu IMC es: {imc_redondeado}")
