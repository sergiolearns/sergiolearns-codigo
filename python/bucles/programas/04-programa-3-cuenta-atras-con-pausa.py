# Bucles en Python práctica — Programa 3: Cuenta atrás con pausa
# Del artículo «Bucles en Python — 3 programas que por fin tienen sentido»
# https://sergiolearns.com/bucles-en-python-practica/

# Cuenta atrás
import time

print("=== CUENTA ATRÁS ===\n")

segundos = int(input("¿Desde cuántos segundos? "))

if segundos <= 0:
    print("Error: introduce un número mayor que 0")
else:
    print()

    # range con paso negativo — cuenta hacia atrás
    for i in range(segundos, 0, -1):
        print(f"{i}...")
        time.sleep(1)    # espera 1 segundo real

    print("🚀 ¡Despegue!")

    # Bonus — versión con while para comparar
    print("\n--- Misma cuenta atrás con while ---\n")
    i = segundos
    while i > 0:
        print(f"{i}...")
        time.sleep(1)
        i -= 1
    print("🚀 ¡Despegue!")
