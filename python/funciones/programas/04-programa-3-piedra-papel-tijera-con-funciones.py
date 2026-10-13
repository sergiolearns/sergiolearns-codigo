# Funciones en Python práctica — Programa 3: Piedra papel tijera con funciones
# Del artículo «Funciones en Python — 3 programas que demuestran su poder real»
# https://sergiolearns.com/funciones-en-python-practica/

import random

# Función para obtener la jugada de la máquina
def jugada_maquina():
    opciones = ["piedra", "papel", "tijera"]
    return random.choice(opciones)

# Función para determinar el ganador
def determinar_ganador(jugador, maquina):
    if jugador == maquina:
        return "empate"

    gana_jugador = {
        "piedra": "tijera",
        "papel": "piedra",
        "tijera": "papel"
    }

    if gana_jugador[jugador] == maquina:
        return "jugador"
    else:
        return "maquina"

# Función para validar la jugada del usuario
def pedir_jugada():
    opciones_validas = ["piedra", "papel", "tijera"]
    jugada = input("Elige (piedra/papel/tijera): ").lower().strip()

    while jugada not in opciones_validas:
        print(f"Opción no válida. Elige entre: {', '.join(opciones_validas)}")
        jugada = input("Elige (piedra/papel/tijera): ").lower().strip()

    return jugada

# Función para mostrar el resultado de la ronda
def mostrar_resultado_ronda(jugador, maquina, ganador):
    emojis = {"piedra": "🪨", "papel": "📄", "tijera": "✂️"}
    print(f"\nTú: {emojis[jugador]} {jugador}")
    print(f"Máquina: {emojis[maquina]} {maquina}")

    if ganador == "empate":
        print("→ ¡Empate!")
    elif ganador == "jugador":
        print("→ ¡Ganaste esta ronda! 🎉")
    else:
        print("→ La máquina gana esta ronda 🤖")

# Función para mostrar el marcador
def mostrar_marcador(victorias, derrotas, empates):
    total = victorias + derrotas + empates
    print(f"\n--- Marcador ({total} rondas) ---")
    print(f"Tú: {victorias} | Máquina: {derrotas} | Empates: {empates}")

# Función principal del juego
def jugar():
    print("=== PIEDRA PAPEL TIJERA ===\n")
    victorias = derrotas = empates = 0
    rondas = int(input("¿Cuántas rondas quieres jugar? "))

    for ronda in range(1, rondas + 1):
        print(f"\n--- Ronda {ronda}/{rondas} ---")
        jugador = pedir_jugada()
        maquina = jugada_maquina()
        ganador = determinar_ganador(jugador, maquina)
        mostrar_resultado_ronda(jugador, maquina, ganador)

        if ganador == "jugador":
            victorias += 1
        elif ganador == "maquina":
            derrotas += 1
        else:
            empates += 1

        mostrar_marcador(victorias, derrotas, empates)

    # Resultado final
    print("\n=== RESULTADO FINAL ===")
    if victorias > derrotas:
        print(f"¡Ganaste el juego! {victorias}-{derrotas} 🏆")
    elif derrotas > victorias:
        print(f"La máquina gana el juego. {victorias}-{derrotas} 🤖")
    else:
        print(f"¡Empate perfecto! {victorias}-{derrotas} 🤝")

# Punto de entrada
jugar()
