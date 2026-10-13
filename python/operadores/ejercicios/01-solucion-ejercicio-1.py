# Solución Ejercicio 1:
# Del artículo «Operadores en Python — ejercicios reales con solución y chuletario»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Factura del gimnasio
CUOTA_BASE = 29.99
DESCUENTO = 0.10
MESES_MINIMOS = 12

meses = int(input("Meses como socio: "))

if meses > MESES_MINIMOS:
    descuento_euros = round(CUOTA_BASE * DESCUENTO, 2)
    cuota_mes = round(CUOTA_BASE - descuento_euros, 2)
    meses_con_descuento = meses - MESES_MINIMOS
    total = round(CUOTA_BASE * MESES_MINIMOS + cuota_mes * meses_con_descuento, 2)
    ahorro = round(descuento_euros * meses_con_descuento, 2)
else:
    descuento_euros = 0
    cuota_mes = CUOTA_BASE
    total = round(CUOTA_BASE * meses, 2)
    ahorro = 0

print(f"\n--- Factura del gimnasio ---")
print(f"Cuota base:          {CUOTA_BASE} €")
print(f"Descuento (10%):     -{descuento_euros} €")
print(f"Cuota este mes:      {cuota_mes} €")
print(f"Total pagado:        {total} €")
print(f"Ahorro acumulado:    {ahorro} €")
