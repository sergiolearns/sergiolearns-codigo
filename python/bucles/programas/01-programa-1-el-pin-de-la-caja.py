# Programa 1 · El PIN de la caja (validador con intentos limitados)
# Del artículo «Bucles en Python — práctica con el PIN de la caja, las formas de ordenar la cola y el horno de croissants (y el intento que se contaba demasiado tarde)»
# https://sergiolearns.com/bucles-en-python-practica/

# Programa 1 · El PIN de la caja: 3 intentos y se bloquea
PIN_CORRECTO = "2024"
MAX_INTENTOS = 3
tecleados = ["1234", "2024"]      # lo que teclea la persona, en orden (sin input())

intentos = 0
desbloqueada = False

while intentos < MAX_INTENTOS and not desbloqueada:   # para con CUALQUIERA de las dos
    pin = tecleados[intentos]     # el intento número intentos + 1
    intentos += 1                 # se cuenta ANTES de comprobar: fallar también gasta intento
    if pin == PIN_CORRECTO:
        desbloqueada = True       # esto hace falsa la condición del while
        print(f"Intento {intentos}: {pin} -> correcto")
    else:
        restantes = MAX_INTENTOS - intentos
        if restantes > 0:
            print(f"Intento {intentos}: {pin} -> incorrecto, te quedan {restantes}")
        else:
            print(f"Intento {intentos}: {pin} -> incorrecto, sin intentos")

if desbloqueada:
    print(f"Caja abierta en {intentos} intento(s)")
else:
    print("Caja bloqueada: avisa a la encargada")
