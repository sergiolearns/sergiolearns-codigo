# Solución del ejercicio 1 · Factura del gimnasio
# Del artículo «Operadores en Python — ejercicios con la cuota del gimnasio, segundos a horas y el cambio de la caja moneda a moneda (y un or que siempre decía que sí)»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Nivel 1 · Factura del gimnasio (todo en céntimos)
CUOTA_CENT = 2999            # 29,99 € al mes
DESCUENTO_PCT = 10           # a partir del mes 13
MESES_SIN_DESCUENTO = 12
meses = 15                   # meses que lleva el socio (antes: input)

# Tramos: los 12 primeros a precio completo y el resto con descuento
meses_con_descuento = max(0, meses - MESES_SIN_DESCUENTO)   # max evita negativos
meses_sin = meses - meses_con_descuento

descuento_cent = round(CUOTA_CENT * DESCUENTO_PCT / 100)    # 299.9 → 300
cuota_rebajada = CUOTA_CENT - descuento_cent

# True vale 1 y False vale 0: si no hay descuento, se resta 0
tiene_descuento = meses > MESES_SIN_DESCUENTO
cuota_mes = CUOTA_CENT - descuento_cent * tiene_descuento

total = meses_sin * CUOTA_CENT + meses_con_descuento * cuota_rebajada
ahorro = meses_con_descuento * descuento_cent

print("--- Factura del gimnasio ---")
print("Meses como socio:", meses)
print(f"Cuota base: {CUOTA_CENT // 100},{CUOTA_CENT % 100:02d} €")
print(f"Cuota este mes: {cuota_mes // 100},{cuota_mes % 100:02d} €")
print(f"Total pagado: {total // 100},{total % 100:02d} €")
print(f"Ahorro acumulado: {ahorro // 100},{ahorro % 100:02d} €")
