# Programa 1 · Conversor de temperaturas modular
# Del artículo «Funciones en Python — práctica con un conversor de temperaturas, una calculadora modular y piedra, papel o tijera (y el menú que dejó de pedir datos)»
# https://sergiolearns.com/funciones-en-python-practica/

# Programa 1 · Conversor de temperaturas modular
# Sin input(): las pruebas van al final, cada una con su opción y su temperatura.

# --- Funciones de cálculo: reciben un número y DEVUELVEN otro (no imprimen nada) ---
def celsius_a_fahrenheit(celsius):
    return round(celsius * 9 / 5 + 32, 2)


def celsius_a_kelvin(celsius):
    return round(celsius + 273.15, 2)


def fahrenheit_a_celsius(fahrenheit):
    return round((fahrenheit - 32) * 5 / 9, 2)


def kelvin_a_celsius(kelvin):
    return round(kelvin - 273.15, 2)


def fahrenheit_a_kelvin(fahrenheit):
    # composición: no copiamos fórmulas, encadenamos dos funciones que ya funcionan
    return celsius_a_kelvin(fahrenheit_a_celsius(fahrenheit))


# --- Funciones de comprobación: responden una pregunta y devuelven la respuesta ---
def escala_de_origen(opcion):
    """Opciones 1, 2 y 5 parten de °C; la 3 y la 6, de °F; la 4, de K."""
    if opcion == 3 or opcion == 6:
        return "°F"
    if opcion == 4:
        return "K"
    return "°C"


def es_temperatura_valida(valor, escala):
    """Nada puede estar por debajo del cero absoluto (−273,15 °C = −459,67 °F = 0 K)."""
    if escala == "°C":
        return valor >= -273.15
    if escala == "°F":
        return valor >= -459.67
    return valor >= 0


# --- Funciones de presentación: preparan el texto que se verá ---
def conversion_completa(celsius):
    """Las tres escalas de golpe y una comprobación de ida y vuelta (°C → °F → °C)."""
    fahrenheit = celsius_a_fahrenheit(celsius)
    vuelta = fahrenheit_a_celsius(fahrenheit)    # si todo está bien, vuelve al valor de partida
    return f"{celsius} °C = {fahrenheit} °F = {celsius_a_kelvin(celsius)} K · ida y vuelta: {vuelta} °C"


def convertir(opcion, valor):
    """Devuelve el texto de la conversión elegida (1-6) o un aviso si algo no cuadra."""
    if opcion < 1 or opcion > 6:
        return f"Opción {opcion} no válida: elige de 1 a 6"
    escala = escala_de_origen(opcion)
    if not es_temperatura_valida(valor, escala):
        return f"{valor} {escala} está por debajo del cero absoluto"
    if opcion == 1:
        return f"{valor} °C = {celsius_a_fahrenheit(valor)} °F"
    if opcion == 2:
        return f"{valor} °C = {celsius_a_kelvin(valor)} K"
    if opcion == 3:
        return f"{valor} °F = {fahrenheit_a_celsius(valor)} °C"
    if opcion == 4:
        return f"{valor} K = {kelvin_a_celsius(valor)} °C"
    if opcion == 6:
        return f"{valor} °F = {fahrenheit_a_kelvin(valor)} K"
    return conversion_completa(valor)            # solo queda la opción 5


# --- Programa principal: cada línea es lo que antes tecleaba el usuario ---
print("=== CONVERSOR DE TEMPERATURAS ===")
print(convertir(1, 100))
print(convertir(2, -40))
print(convertir(3, 98.6))
print(convertir(4, 0))
print(convertir(5, 37))
print(convertir(6, 212))
print(convertir(1, -300))
print(convertir(9, 20))
