# Solución Ejercicio 1
# Del artículo «Variables y tipos de datos en Python — ejercicios con solución y chuletario»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# Recibo de la compra
p1_nombre = input("Producto 1: ")
p1_precio = float(input("Precio: "))
p2_nombre = input("Producto 2: ")
p2_precio = float(input("Precio: "))
p3_nombre = input("Producto 3: ")
p3_precio = float(input("Precio: "))

subtotal = p1_precio + p2_precio + p3_precio
iva = round(subtotal * 0.21, 2)
total = round(subtotal + iva, 2)

print(f"\n--- Recibo ---")
print(f"{p1_nombre}: {p1_precio} €")
print(f"{p2_nombre}: {p2_precio} €")
print(f"{p3_nombre}: {p3_precio} €")
print(f"Subtotal: {round(subtotal, 2)} €")
print(f"IVA (21%): {iva} €")
print(f"Total: {total} €")
