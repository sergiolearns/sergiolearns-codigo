# Programa 3 · Piedra, papel o tijera con funciones
# Del artículo «Funciones en Python — práctica con un conversor de temperaturas, una calculadora modular y piedra, papel o tijera (y el menú que dejó de pedir datos)»
# https://sergiolearns.com/funciones-en-python-practica/

# Programa 3 · Piedra, papel o tijera con funciones
import random

random.seed(7)    # semilla fija: la máquina juega siempre lo mismo (quítala para jugar de verdad)

OPCIONES = ("piedra", "papel", "tijera")
GANA_A = {"piedra": "tijera", "papel": "piedra", "tijera": "papel"}    # cada jugada → a cuál le gana
EMOJI = {"piedra": "🪨", "papel": "📄", "tijera": "✂️"}


def jugada_maquina():
    return random.choice(OPCIONES)


def limpiar_jugada(texto):
    """Pasa a minúsculas y quita espacios. Devuelve la jugada, o None si no es válida."""
    jugada = texto.lower().strip()
    if jugada in OPCIONES:
        return jugada
    return None


def determinar_ganador(jugador, maquina):
    """Devuelve "empate", "jugador" o "maquina". No imprime nada."""
    if jugador == maquina:
        return "empate"
    if GANA_A[jugador] == maquina:
        return "jugador"
    return "maquina"


def mostrar_ronda(numero, jugador, maquina, ganador):
    print(f"Ronda {numero}: tú {EMOJI[jugador]} {jugador} · máquina {EMOJI[maquina]} {maquina}")
    if ganador == "empate":
        print("  → Empate")
    elif ganador == "jugador":
        print("  → ¡Ganas tú!")
    else:
        print("  → Gana la máquina")


def mostrar_final(victorias, derrotas, empates):
    print(f"Marcador: tú {victorias} · máquina {derrotas} · empates {empates}")
    if victorias > derrotas:
        print("¡Ganaste la partida! 🏆")
    elif derrotas > victorias:
        print("La máquina gana la partida 🤖")
    else:
        print("Empate perfecto 🤝")


def jugar(entradas):
    """Una ronda por cada entrada válida; lleva el marcador y lo enseña al final."""
    victorias = derrotas = empates = 0
    ronda = 0
    for texto in entradas:
        jugador = limpiar_jugada(texto)
        if jugador is None:
            print(f"«{texto}» no es una jugada válida: no cuenta")
            continue
        ronda += 1
        maquina = jugada_maquina()
        ganador = determinar_ganador(jugador, maquina)
        mostrar_ronda(ronda, jugador, maquina, ganador)
        if ganador == "jugador":
            victorias += 1
        elif ganador == "maquina":
            derrotas += 1
        else:
            empates += 1
    mostrar_final(victorias, derrotas, empates)


# Lo que "teclea" el jugador: con mayúsculas, espacios y una errata, como en la vida real
print("=== PIEDRA, PAPEL O TIJERA ===")
jugar(["Piedra", "tijeras", "papel", " TIJERA ", "tijera"])
