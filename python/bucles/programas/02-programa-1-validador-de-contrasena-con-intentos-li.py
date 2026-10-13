# Bucles en Python práctica — Programa 1: Validador de contraseña con intentos limitados
# Del artículo «Bucles en Python — 3 programas que por fin tienen sentido»
# https://sergiolearns.com/bucles-en-python-practica/

# Validador de contraseña — versión mejorada
import time

CONTRASENA_CORRECTA = "Python2024"
MAX_INTENTOS = 3
intentos = 0
bloqueado = False

print("=== SISTEMA DE ACCESO ===\n")

while intentos < MAX_INTENTOS and not bloqueado:
    contrasena = input(f"Contraseña (intento {intentos + 1}/{MAX_INTENTOS}): ")
    intentos += 1

    if contrasena == CONTRASENA_CORRECTA:
        print(f"\n✓ Acceso concedido en el intento {intentos}")
        print("Bienvenido al sistema.")
        break
    else:
        restantes = MAX_INTENTOS - intentos
        if restantes > 0:
            print(f"✗ Incorrecta — {restantes} intento/s restante/s\n")
            time.sleep(1)    # simula tiempo de espera entre intentos
        else:
            bloqueado = True
            print("\n🔒 Cuenta bloqueada por seguridad")
            print("Contacta con el administrador para recuperar el acceso")

if bloqueado:
    print(f"\nRegistro: {intentos} intentos fallidos")
