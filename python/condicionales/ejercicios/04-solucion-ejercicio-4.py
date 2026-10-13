# Solución Ejercicio 4:
# Del artículo «Condicionales en Python — ejercicios con solución y chuletario completo»
# https://sergiolearns.com/condicionales-en-python-ejercicios/

# Juego de adivinar el número
import random

numero_secreto = random.randint(1, 100)
intentos = 0
adivinado = False

print("=== ADIVINA EL NÚMERO ===")
print("Estoy pensando en un número entre 1 y 100...\n")

while not adivinado:
    intentos += 1
    intento = int(input(f"Intento {intentos} — Tu número: "))

    if intento < numero_secreto:
        print("→ Demasiado bajo\n")
    elif intento > numero_secreto:
        print("→ Demasiado alto\n")
    else:
        print("→ ¡Correcto! 🎉")
        adivinado = True

print(f"\n--- Resultado ---")
print(f"Adivinaste en {intentos} intentos")

if intentos <= 3:
    print("Valoración: Increíble 🏆")
elif intentos <= 6:
    print("Valoración: Muy bien 👏")
elif intentos <= 10:
    print("Valoración: Bien ✓")
else:
    print("Valoración: Sigue practicando 💪")
