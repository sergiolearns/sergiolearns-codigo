# Solución del ejercicio 1 · El recibo de la compra
# Del artículo «Variables y tipos de datos en Python — ejercicios con un recibo, temperaturas, propinas y tu ficha de estudiante (y un True que vale 1)»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# Solución del ejercicio 1 · El recibo de la compra
# Los precios llegan como texto, como si los hubieras leído con input()
p1_nombre = "Leche"
p1_precio = float("1.20")        # float: el dinero lleva decimales
p2_nombre = "Pan"
p2_precio = float("0.90")
p3_nombre = "Café"
p3_precio = float("3.50")

subtotal = p1_precio + p2_precio + p3_precio
iva = round(subtotal * 0.21, 2)      # 21 % del subtotal, redondeado a céntimos
total = round(subtotal + iva, 2)

print("--- Recibo ---")
print(f"{p1_nombre}: {p1_precio} €")
print(f"{p2_nombre}: {p2_precio} €")
print(f"{p3_nombre}: {p3_precio} €")
print(f"Subtotal: {round(subtotal, 2)} €")
print(f"IVA (21%): {iva} €")
print(f"Total: {total} €")
