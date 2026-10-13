# Condicionales en Python práctica Programa 2: Sistema de descuentos por nivel de cliente
# Del artículo «Condicionales en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/condicionales-en-python-practica/

# Sistema de descuentos por nivel de cliente
print("=== SISTEMA DE FIDELIZACIÓN ===\n")

nombre = input("Nombre del cliente: ")
gasto_anual = float(input("Gasto anual (€): "))
es_socio = input("¿Es socio? (s/n): ").lower() == "s"

# Determinar nivel y descuento base
if gasto_anual >= 5000:
    nivel = "Platinum"
    descuento = 20
elif gasto_anual >= 2000:
    nivel = "Gold"
    descuento = 15
elif gasto_anual >= 500:
    nivel = "Silver"
    descuento = 10
else:
    nivel = "Básico"
    descuento = 5

# Descuento extra por ser socio
if es_socio:
    descuento_extra = 5
    descuento_total = descuento + descuento_extra
else:
    descuento_extra = 0
    descuento_total = descuento

# Calcular ahorro
ahorro_anual = round(gasto_anual * descuento_total / 100, 2)
gasto_con_descuento = round(gasto_anual - ahorro_anual, 2)

# Resultado
print(f"\n--- Ficha de {nombre} ---")
print(f"Gasto anual:         {gasto_anual} €")
print(f"Nivel:               {nivel}")
print(f"Descuento base:      {descuento}%")

if es_socio:
    print(f"Descuento socio:     +{descuento_extra}%")

print(f"Descuento total:     {descuento_total}%")
print(f"Ahorro:              {ahorro_anual} €")
print(f"Pagaría:             {gasto_con_descuento} €")

# Mensaje personalizado según nivel
if nivel == "Platinum":
    print("\n⭐ Cliente Platinum — acceso a eventos exclusivos")
elif nivel == "Gold":
    print("\n🥇 Cliente Gold — envío gratuito en todos los pedidos")
elif nivel == "Silver":
    print("\n🥈 Cliente Silver — acceso anticipado a rebajas")
else:
    print("\nℹ️ Gasta más de 500€ al año para subir a nivel Silver")
