# Solución Ejercicio 2:
# Del artículo «Condicionales en Python — ejercicios con solución y chuletario completo»
# https://sergiolearns.com/condicionales-en-python-ejercicios/

# Calculadora de impuestos IRPF
salario = float(input("Salario bruto anual (€): "))

if salario <= 12450:
    tramo = 19
elif salario <= 20200:
    tramo = 24
elif salario <= 35200:
    tramo = 30
elif salario <= 60000:
    tramo = 37
else:
    tramo = 45

impuesto = round(salario * tramo / 100, 2)
neto = round(salario - impuesto, 2)
mensual = round(neto / 12, 2)

print(f"\n--- Cálculo de IRPF ---")
print(f"Salario bruto:        {salario} €")
print(f"Tramo:                {tramo}%")
print(f"Impuesto:             {impuesto} €")
print(f"Salario neto:         {neto} €")
print(f"Salario mensual neto: {mensual} €")
