# Solución del ejercicio 4 · Simulador de ahorro mensual
# Del artículo «Bucles en Python — ejercicios con FizzBuzz, una inversión que crece, primos y un plan de ahorro (y el break que solo salía de la bandeja)»
# https://sergiolearns.com/bucles-en-python-ejercicios/

# Desafío final · Ejercicio 4: ¿cuántos meses hasta llegar al objetivo?
objetivo = 10000.0
ahorro_mensual = 300.0
interes_anual = 4.0               # %

if ahorro_mensual <= 0:           # con 0 € al mes el while no acabaría nunca
    print("Error: el ahorro mensual tiene que ser mayor que 0")
else:
    interes_mensual = interes_anual / 12 / 100
    balance = 0.0
    mes = 0
    aportado = 0.0
    while balance < objetivo:     # no sabemos cuántos meses: while
        mes += 1
        balance += ahorro_mensual                          # 1.º se ingresa el mes
        balance = round(balance * (1 + interes_mensual), 2) # 2.º se aplica el interés
        aportado += ahorro_mensual
        if mes > 24:              # solo enseñamos los últimos meses
            print(f"Mes {mes}: {balance:.2f} €")

    años = mes // 12
    resto = mes % 12
    print(f"Objetivo alcanzado en {mes} meses ({años} años y {resto} meses)")
    print(f"Ahorrado: {balance:.2f} € | aportado: {aportado:.2f} €")
    print(f"Intereses: {balance - aportado:.2f} €")
