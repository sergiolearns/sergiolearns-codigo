# Solución del ejercicio 4 · Extractor de dígitos
# Del artículo «Operadores en Python — ejercicios con la cuota del gimnasio, segundos a horas y el cambio de la caja moneda a moneda (y un or que siempre decía que sí)»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Nivel 2 · Extractor de dígitos de un número de 4 cifras, sin pasarlo a texto
n = 2847

unidades = n % 10              # la última cifra
decenas = n // 10 % 10         # quitar la última y quedarse con la nueva última
centenas = n // 100 % 10
millares = n // 1000           # con 4 cifras, lo que queda delante

suma = millares + centenas + decenas + unidades
al_reves = unidades * 1000 + decenas * 100 + centenas * 10 + millares

print("--- Dígitos de", n, "---")
print("Millares:", millares, "| Centenas:", centenas, "| Decenas:", decenas, "| Unidades:", unidades)
print("Suma de dígitos:", suma)
print("¿Divisible entre 3?", suma % 3 == 0, "| comprobación:", n % 3 == 0)
print("¿Es par?", unidades % 2 == 0)
print("Al revés:", al_reves)
print("¿Tiene 4 cifras?", 1000 <= n <= 9999)
