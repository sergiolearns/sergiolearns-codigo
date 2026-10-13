# Solución Ejercicio 2:
# Del artículo «Operadores en Python — ejercicios reales con solución y chuletario»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Conversor de tiempo
segundos = int(input("Segundos: "))

horas = segundos // 3600
minutos_restantes = (segundos % 3600) // 60
segs_restantes = segundos % 60

print(f"\n{segundos} segundos son:")
print(f"→ {horas} hora/s")
print(f"→ {minutos_restantes} minuto/s")
print(f"→ {segs_restantes} segundo/s")
