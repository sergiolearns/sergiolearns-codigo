# Solución del ejercicio 3 · Calculador de propinas
# Del artículo «Variables y tipos de datos en Python — ejercicios con un recibo, temperaturas, propinas y tu ficha de estudiante (y un True que vale 1)»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# Solución del ejercicio 3 · Calculador de propinas
cuenta = float("85.50")          # euros: float
propina_pct = float("10")        # porcentaje: float, por si alguien deja un 12.5 %
personas = int("4")              # personas: int, no existe media persona

propina = round(cuenta * propina_pct / 100, 2)
total = round(cuenta + propina, 2)
por_persona = round(total / personas, 2)   # redondear SOLO al final

print("--- División de cuenta ---")
print(f"Subtotal: {cuenta} €")
print(f"Propina ({int(propina_pct)}%): {propina} €")
print(f"Total con propina: {total} €")
print(f"Cada persona paga: {por_persona} €")
