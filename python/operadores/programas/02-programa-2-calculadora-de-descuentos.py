# Operadores en Python práctica — Programa 2: Calculadora de descuentos
# Del artículo «Operadores en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/operadores-en-python-practica/

# Calculadora de descuentos y precios
print("=== CALCULADORA DE DESCUENTOS ===\n")

producto = input("Nombre del producto: ")
precio_original = float(input("Precio original (€): "))
descuento_pct = float(input("Descuento (%): "))

# Cálculos
descuento_euros = round(precio_original * descuento_pct / 100, 2)
precio_final = round(precio_original - descuento_euros, 2)
iva = round(precio_final * 0.21, 2)
precio_con_iva = round(precio_final + iva, 2)
ahorro_real = round(precio_original - precio_final, 2)

# Resultado detallado
print(f"\n--- Desglose de {producto} ---")
print(f"Precio original:     {precio_original} €")
print(f"Descuento ({int(descuento_pct)}%):      -{descuento_euros} €")
print(f"Precio con descuento: {precio_final} €")
print(f"IVA (21%):           +{iva} €")
print(f"Precio final con IVA: {precio_con_iva} €")
print(f"\nAhorro total:        {ahorro_real} €")
