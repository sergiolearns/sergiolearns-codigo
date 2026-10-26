# Solución del ejercicio 3 · Mini banco con funciones
# Del artículo «Funciones en Python — ejercicios con notas, un mini banco y dados con estadísticas (y el return que se rindió en la primera tirada)»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# Nivel intermedio · Ejercicio 3: mini banco con funciones
def consultar_saldo(saldo):
    print(f"Saldo actual: {saldo} €")


def depositar(saldo, cantidad):
    """Devuelve el saldo NUEVO. Si la cantidad no vale, devuelve el mismo saldo."""
    if cantidad <= 0:
        print("Error: la cantidad debe ser positiva")
        return saldo
    print(f"✓ Depósito realizado: +{cantidad} €")
    return round(saldo + cantidad, 2)      # el return clave: sin él, el saldo nunca cambia


def retirar(saldo, cantidad):
    """Devuelve el saldo nuevo, o el mismo si no hay dinero suficiente."""
    if cantidad <= 0:
        print("Error: la cantidad debe ser positiva")
        return saldo
    if cantidad > saldo:
        print(f"Error: saldo insuficiente (tienes {saldo} €)")
        return saldo
    print(f"✓ Retirada realizada: -{cantidad} €")
    return round(saldo - cantidad, 2)


def anotar(historial, texto, saldo_antes, saldo_despues):
    """Apunta el movimiento solo si el saldo ha cambiado (si hubo error, no cambia)."""
    if saldo_despues != saldo_antes:
        historial.append(texto)


def mostrar_historial(historial, saldo):
    print("--- Historial de movimientos ---")
    for movimiento in historial:
        print(movimiento)
    print("─" * 30)
    consultar_saldo(saldo)


print("=== BANCO SERGIO LEARNS ===")
saldo = 1000.0
historial = [f"Saldo inicial: +{saldo} €"]
consultar_saldo(saldo)

antes = saldo
saldo = depositar(saldo, 500)               # se guarda lo que DEVUELVE la función
anotar(historial, "Depósito: +500 €", antes, saldo)

antes = saldo
saldo = retirar(saldo, 200)
anotar(historial, "Retirada: -200 €", antes, saldo)

antes = saldo
saldo = retirar(saldo, 2000)                # no hay tanto: el saldo no cambia
anotar(historial, "Retirada: -2000 €", antes, saldo)

antes = saldo
saldo = depositar(saldo, -50)               # cantidad no válida
anotar(historial, "Depósito: -50 €", antes, saldo)

mostrar_historial(historial, saldo)
