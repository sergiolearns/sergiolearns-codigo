# Programa 2 · Mini calculadora modular
# Del artículo «Funciones en Python — práctica con un conversor de temperaturas, una calculadora modular y piedra, papel o tijera (y el menú que dejó de pedir datos)»
# https://sergiolearns.com/funciones-en-python-practica/

# Programa 2 · Mini calculadora modular
# --- Funciones de cálculo: solo calculan y devuelven; nunca hacen print ---
def sumar(a, b):
    return a + b


def restar(a, b):
    return a - b


def multiplicar(a, b):
    return a * b


def dividir(a, b):
    if b == 0:
        return None          # None = "no hay resultado": quien llame decide qué decir
    return round(a / b, 4)


def potencia(a, b):
    return a ** b


def modulo(a, b):
    if b == 0:
        return None
    return a % b


# --- Funciones de interfaz: solo se ocupan de lo que se ve ---
def mostrar_menu():
    print("=== CALCULADORA MODULAR ===")
    print("1. Suma  2. Resta  3. Multiplicar  4. Dividir  5. Potencia  6. Módulo")


def simbolo(opcion):
    if opcion == 1:
        return "+"
    if opcion == 2:
        return "-"
    if opcion == 3:
        return "×"
    if opcion == 4:
        return "/"
    if opcion == 5:
        return "^"
    return "%"


def mostrar_resultado(a, signo, b, resultado):
    if resultado is None:
        print(f"{a} {signo} {b} → error: no se puede dividir entre cero")
    else:
        print(f"{a} {signo} {b} = {resultado}")


# --- Funciones que coordinan ---
def calcular(opcion, a, b):
    """Elige la función de cálculo según la opción y DEVUELVE su resultado."""
    if opcion == 1:
        return sumar(a, b)
    if opcion == 2:
        return restar(a, b)
    if opcion == 3:
        return multiplicar(a, b)
    if opcion == 4:
        return dividir(a, b)
    if opcion == 5:
        return potencia(a, b)
    return modulo(a, b)


def ejecutar(opcion, a, b):
    """Una operación completa: comprueba, calcula con una función y muestra con otra."""
    if opcion < 1 or opcion > 6:
        print(f"Opción {opcion} no válida")
        return                                   # return sin valor: sale ya de la función
    resultado = calcular(opcion, a, b)
    mostrar_resultado(a, simbolo(opcion), b, resultado)


# --- Programa principal: las operaciones que antes se elegían en el menú ---
mostrar_menu()
ejecutar(1, 7, 2)
ejecutar(4, 7, 2)
ejecutar(4, 7, 0)
ejecutar(5, 2, 10)
ejecutar(6, 17, 5)
ejecutar(8, 1, 1)
