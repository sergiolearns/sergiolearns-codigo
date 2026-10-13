# Solución Ejercicio 3:
# Del artículo «Operadores en Python — ejercicios reales con solución y chuletario»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Análisis de nota
nota = float(input("Nota (0-100): "))

nota_sobre_10 = round(nota / 10, 1)
porcentaje = nota
aprobado = nota >= 50

if nota < 70:
    siguiente = "Notable"
    faltan = round(70 - nota, 1)
elif nota < 90:
    siguiente = "Sobresaliente"
    faltan = round(90 - nota, 1)
else:
    siguiente = "Ya tienes sobresaliente"
    faltan = 0

puntos_sobre_aprobado = round(nota - 50, 1) if nota >= 50 else 0

print(f"\n--- Análisis de nota ---")
print(f"Nota sobre 10:       {nota_sobre_10}")
print(f"Porcentaje:          {porcentaje}%")
print(f"¿Aprobado?:          {aprobado}")
if faltan > 0:
    print(f"Siguiente nivel:     {siguiente} (faltan {faltan} puntos)")
else:
    print(f"Nivel:               {siguiente}")
print(f"Puntos sobre el aprobado: {puntos_sobre_aprobado}")
