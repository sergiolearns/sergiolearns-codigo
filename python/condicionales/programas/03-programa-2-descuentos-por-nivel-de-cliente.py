# Programa 2 · Sistema de descuentos por nivel de cliente
# Del artículo «Condicionales en Python — práctica con un validador de registro, descuentos por nivel y un clasificador de notas (y el formulario que solo te enseñaba un error)»
# https://sergiolearns.com/condicionales-en-python-practica/

# Sistema de descuentos por nivel de cliente
nombre = "Laura"
gasto_anual = 2500.0
respuesta_socio = "S"                        # como si viniera de input(): un texto

es_socio = respuesta_socio.lower() == "s"    # "S" → "s" → True (acepta s y S)

# 1. Nivel y descuento base: de mayor a menor, gana el primer umbral que se cumple
if gasto_anual >= 5000:
    nivel = "Platinum"
    descuento = 20
elif gasto_anual >= 2000:                    # aquí ya sabemos que gasto_anual < 5000
    nivel = "Gold"
    descuento = 15
elif gasto_anual >= 500:
    nivel = "Silver"
    descuento = 10
else:
    nivel = "Básico"
    descuento = 5

# 2. Extra por ser socio: if aparte, porque se suma a CUALQUIER nivel
if es_socio:
    descuento_extra = 5
else:
    descuento_extra = 0
descuento_total = descuento + descuento_extra

# 3. Cuentas
ahorro = gasto_anual * descuento_total / 100
pagaria = gasto_anual - ahorro

print(f"--- Ficha de {nombre} ---")
print(f"Gasto anual: {gasto_anual:.2f} €")
print(f"Nivel: {nivel} (descuento base {descuento} %)")
if es_socio:                                 # esta línea solo sale para los socios
    print(f"Descuento socio: +{descuento_extra} %")
print(f"Descuento total: {descuento_total} %")
print(f"Ahorro: {ahorro:.2f} €")
print(f"Pagaría: {pagaria:.2f} €")

# 4. Mensaje según el nivel ya calculado (no se repiten las comparaciones de dinero)
if nivel == "Platinum":
    print("⭐ Platinum: acceso a eventos exclusivos")
elif nivel == "Gold":
    print("🥇 Gold: envío gratuito en todos los pedidos")
elif nivel == "Silver":
    print("🥈 Silver: acceso anticipado a rebajas")
else:
    falta = 500 - gasto_anual
    print(f"ℹ️ Te faltan {falta:.2f} € para subir a Silver")
