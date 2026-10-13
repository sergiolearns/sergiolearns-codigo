# Solución Ejercicio 4:
# Del artículo «Operadores en Python — ejercicios reales con solución y chuletario»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Extractor de dígitos
n = int(input("Número de 4 cifras: "))

unidades = n % 10
decenas  = (n // 10) % 10
centenas = (n // 100) % 10
millares = n // 1000

suma = unidades + decenas + centenas + millares
divisible_3 = suma % 3 == 0

print(f"\n--- Dígitos de {n} ---")
print(f"Millares:  {millares}")
print(f"Centenas:  {centenas}")
print(f"Decenas:   {decenas}")
print(f"Unidades:  {unidades}")
print(f"Suma de dígitos: {suma}")
print(f"¿Es divisible por 3?: {divisible_3}  (porque la suma de dígitos es divisible por 3)")
