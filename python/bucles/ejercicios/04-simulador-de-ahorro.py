# Solución Ejercicio 4 — Simulador de ahorro:
# Del artículo «Bucles en Python — ponlos a prueba con estos ejercicios»
# https://sergiolearns.com/bucles-en-python-ejercicios/

# Simulador de ahorro mensual
objetivo = float(input("Objetivo de ahorro (€): "))
ahorro_mensual = float(input("Ahorro mensual (€): "))
interes_anual = float(input("Interés anual (%): "))

if ahorro_mensual <= 0:
    print("Error: el ahorro mensual debe ser mayor que 0")
else:
    interes_mensual = interes_anual / 12 / 100
    balance = 0
    mes = 0
    total_aportado = 0
    historial = []

    print(f"\n--- Simulación de ahorro ---")

    while balance < objetivo:
        mes += 1
        balance += ahorro_mensual
        balance = round(balance * (1 + interes_mensual), 2)
        total_aportado += ahorro_mensual
        historial.append((mes, balance))

    # Mostrar solo últimos 5 meses si hay muchos
    meses_a_mostrar = historial if len(historial) <= 12 else historial[-5:]
    if len(historial) > 12:
        print(f"... (mostrando últimos 5 meses)")

    for m, b in meses_a_mostrar:
        marca = " ← objetivo alcanzado" if m == mes else ""
        print(f"Mes {m}:  {b} €{marca}")

    años = mes // 12
    meses_resto = mes % 12
    intereses = round(balance - total_aportado, 2)

    print(f"\n¡Objetivo alcanzado en {mes} meses ", end="")
    if años > 0:
        print(f"({años} año/s y {meses_resto} mes/es)!")
    else:
        print(f"({meses_resto} mes/es)!")

    print(f"Capital ahorrado:   {balance} €")
    print(f"Total aportado:     {total_aportado} €")
    print(f"Intereses ganados:  {intereses} €")
