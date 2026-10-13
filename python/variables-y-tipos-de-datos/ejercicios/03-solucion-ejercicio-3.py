# Solución Ejercicio 3
# Del artículo «Variables y tipos de datos en Python — ejercicios con solución y chuletario»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# Calculador de propinas
cuenta = float(input("Importe de la cuenta: "))
propina_pct = float(input("Porcentaje de propina (%): "))
personas = int(input("Número de personas: "))

propina = round(cuenta * propina_pct / 100, 2)
total = round(cuenta + propina, 2)
por_persona = round(total / personas, 2)

print(f"\n--- División de cuenta ---")
print(f"Subtotal: {cuenta} €")
print(f"Propina ({int(propina_pct)}%): {propina} €")
print(f"Total con propina: {total} €")
print(f"Cada persona paga: {por_persona} €")
