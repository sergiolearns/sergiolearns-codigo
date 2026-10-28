# Solución del nivel 3 · Números en binario y texto en bytes
# Del artículo «Informática básica — ejercicios con un pendrive, rutas de carpetas y bytes con tildes (y el notas.txt que «no existía» en el aula)»
# https://sergiolearns.com/informatica-basica-ejercicios/

# Nivel 3: números en binario y texto en bytes
numero = 2026
binario = bin(numero)[2:]              # bin() da '0b11111101010': quitamos el '0b'
print(numero, "en binario:", binario)
print("Bits que hacen falta:", len(binario))
print("De vuelta a decimal:", int(binario, 2))

texto = "Mañana, café en Gáldar"
print("Caracteres:", len(texto))
print("Bytes en UTF-8:", len(texto.encode("utf-8")))
print("La ñ en bytes:", "ñ".encode("utf-8"))
print("La a en bytes:", "a".encode("utf-8"))
