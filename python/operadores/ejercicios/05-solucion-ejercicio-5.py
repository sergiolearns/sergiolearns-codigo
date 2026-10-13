# Solución Ejercicio 5:
# Del artículo «Operadores en Python — ejercicios reales con solución y chuletario»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Caja registradora
importe = float(input("Importe de la compra (€): "))
entregado = float(input("Dinero entregado (€): "))

cambio = round(entregado - importe, 2)
cambio_centimos = int(round(cambio * 100))

denominaciones = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1]
nombres = ["50 €", "20 €", "10 €", "5 €", "2 €", "1 €",
           "0.50 €", "0.20 €", "0.10 €", "0.05 €", "0.02 €", "0.01 €"]

print(f"\n--- Caja registradora ---")
print(f"Importe:     {importe} €")
print(f"Entregado:   {entregado} €")
print(f"Cambio:      {cambio} €")
print(f"\n--- Desglose del cambio ---")

for i in range(len(denominaciones)):
    cantidad = cambio_centimos // denominaciones[i]
    cambio_centimos = cambio_centimos % denominaciones[i]
    if cantidad > 0:
        print(f"{cantidad} {'billete' if denominaciones[i] >= 500 else 'moneda'} de {nombres[i]}")
