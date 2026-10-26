# Programa 2 · Calculadora de descuentos con el bono de cafés
# Del artículo «Operadores en Python — práctica con un conversor de unidades, el bono de cafés con IGIC en céntimos y una calculadora con negativos (y el céntimo que se me perdía)»
# https://sergiolearns.com/operadores-en-python-practica/

# Bono de 10 cafés: descuento de estudiante e IGIC, todo en céntimos
producto = "Bono de 10 cafés"
precio_cent = 1200       # 12,00 € en céntimos: los enteros son exactos
descuento_pct = 15       # descuento de estudiante (%)
IGIC_PCT = 7             # IGIC general de Canarias (en la península, IVA)

# 1. Descuento: primero multiplicar, después dividir (// para quedarnos en enteros)
descuento_cent = precio_cent * descuento_pct // 100
con_descuento = precio_cent - descuento_cent

# 2. Impuesto sobre el precio YA rebajado; round() al céntimo más cercano
igic_cent = round(con_descuento * IGIC_PCT / 100)
total_cent = con_descuento + igic_cent

# 3. Mostrar euros: // da los euros y % los céntimos (:02d pone el cero: 05)
print("---", producto, "---")
print(f"Precio: {precio_cent // 100},{precio_cent % 100:02d} €")
print(f"Descuento ({descuento_pct} %): -{descuento_cent // 100},{descuento_cent % 100:02d} €")
print(f"Con descuento: {con_descuento // 100},{con_descuento % 100:02d} €")
print(f"IGIC ({IGIC_PCT} %): +{igic_cent // 100},{igic_cent % 100:02d} €")
print(f"Total: {total_cent // 100},{total_cent % 100:02d} €")

# 4. ¿Cuánto sale cada café? 1091 no se reparte exacto entre 10
por_cafe = total_cent // 10
sobra = total_cent % 10
print("Cada café:", por_cafe, "céntimos y sobra", sobra)
print("¿Cuadra?", por_cafe * 10 + sobra == total_cent)

# 5. La misma cuenta con floats, para comparar
con_floats = 12.00 * (1 - 0.15) * (1 + 0.07)
print("Con floats:", con_floats)
print("¿Igual que en céntimos?", con_floats == total_cent / 100)
