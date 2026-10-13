# Solución Ejercicio 3:
# Del artículo «Funciones en Python — ejercicios para afianzar lo que sabes»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# Mini banco con funciones
def consultar_saldo(saldo):
    print(f"\nSaldo actual: {saldo} €")

def depositar(saldo, cantidad):
    if cantidad <= 0:
        print("Error: la cantidad debe ser positiva")
        return saldo    # devuelve el saldo sin cambios
    nuevo_saldo = round(saldo + cantidad, 2)
    print(f"✓ Depósito realizado: +{cantidad} €")
    print(f"Saldo actual: {nuevo_saldo} €")
    return nuevo_saldo    # RETURN clave — devuelve el nuevo saldo

def retirar(saldo, cantidad):
    if cantidad <= 0:
        print("Error: la cantidad debe ser positiva")
        return saldo
    if cantidad > saldo:
        print(f"Error: saldo insuficiente. Tienes {saldo} €")
        return saldo
    nuevo_saldo = round(saldo - cantidad, 2)
    print(f"✓ Retirada realizada: -{cantidad} €")
    print(f"Saldo actual: {nuevo_saldo} €")
    return nuevo_saldo

def mostrar_historial(historial, saldo):
    print("\n--- Historial de movimientos ---")
    for movimiento in historial:
        print(movimiento)
    print("─" * 33)
    print(f"Saldo actual:     {saldo} €")

def menu_banco():
    print("=== BANCO SERGIO LEARNS ===\n")
    saldo_inicial = float(input("Saldo inicial: "))
    saldo = saldo_inicial
    historial = [f"Saldo inicial:    +{saldo_inicial} €"]

    while True:
        print("\n1. Consultar saldo")
        print("2. Depositar")
        print("3. Retirar")
        print("4. Ver historial")
        print("0. Salir")

        opcion = input("\nOpción: ")

        if opcion == "0":
            print("Hasta pronto")
            break
        elif opcion == "1":
            consultar_saldo(saldo)
        elif opcion == "2":
            cantidad = float(input("Cantidad a depositar: "))
            saldo_anterior = saldo
            saldo = depositar(saldo, cantidad)
            if saldo != saldo_anterior:
                historial.append(f"Depósito:         +{cantidad} €")
        elif opcion == "3":
            cantidad = float(input("Cantidad a retirar: "))
            saldo_anterior = saldo
            saldo = retirar(saldo, cantidad)
            if saldo != saldo_anterior:
                historial.append(f"Retirada:         -{cantidad} €")
        elif opcion == "4":
            mostrar_historial(historial, saldo)
        else:
            print("Opción no válida")

menu_banco()
