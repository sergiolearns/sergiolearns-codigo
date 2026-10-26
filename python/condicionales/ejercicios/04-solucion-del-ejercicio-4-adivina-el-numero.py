# Solución del ejercicio 4 · Juego de adivinar el número
# Del artículo «Condicionales en Python — ejercicios resueltos con películas, tramos de impuestos, contraseñas y el juego de adivinar el número (y el or que dejaba entrar a todo el mundo)»
# https://sergiolearns.com/condicionales-en-python-ejercicios/

# Ejercicio 4 — Adivina el número
# En tu versión:  import random  y  numero_secreto = random.randint(1, 100)
numero_secreto = 69                 # fijo aquí para que la salida sea siempre la misma
jugadas = [50, 75, 63, 69]          # lo que teclearía el jugador (en tu versión, input())

intentos = 0
adivinado = False

print("=== ADIVINA EL NÚMERO ===")
print("Estoy pensando en un número entre 1 y 100...")

while not adivinado:                # repite mientras no acierte (bucles: próximo tema)
    intento = jugadas[intentos]     # la jugada que toca
    intentos += 1
    print(f"Intento {intentos}: {intento}")
    if intento < numero_secreto:
        print("→ Demasiado bajo")
    elif intento > numero_secreto:
        print("→ Demasiado alto")
    else:                           # ni menor ni mayor: igual
        print("→ ¡Correcto! 🎉")
        adivinado = True

print("--- Resultado ---")
print(f"Adivinaste en {intentos} intentos")
if intentos <= 3:
    valoracion = "Increíble 🏆"
elif intentos <= 6:                 # 4, 5 o 6: el elif ya sabe que es mayor que 3
    valoracion = "Muy bien 👏"
elif intentos <= 10:
    valoracion = "Bien ✓"
else:
    valoracion = "Sigue practicando 💪"
print(f"Valoración: {valoracion}")
