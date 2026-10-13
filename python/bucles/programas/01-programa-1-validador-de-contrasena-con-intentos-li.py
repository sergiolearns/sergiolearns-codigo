# Bucles en Python práctica — Programa 1: Validador de contraseña con intentos limitados
# Del artículo «Bucles en Python — 3 programas que por fin tienen sentido»
# https://sergiolearns.com/bucles-en-python-practica/

# Validador de contraseña — versión simple
CONTRASENA_CORRECTA = "Python2024"
MAX_INTENTOS = 3
intentos = 0

while intentos < MAX_INTENTOS:
    contrasena = input("Introduce la contraseña: ")
    intentos += 1

    if contrasena == CONTRASENA_CORRECTA:
        print("✓ Acceso concedido")
        break
    else:
        restantes = MAX_INTENTOS - intentos
        if restantes > 0:
            print(f"✗ Contraseña incorrecta — {restantes} intento/s restante/s")
        else:
            print("✗ Cuenta bloqueada — demasiados intentos fallidos")
