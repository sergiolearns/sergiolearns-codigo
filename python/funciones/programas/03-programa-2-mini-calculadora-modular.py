# Funciones en Python práctica — Programa 2: Mini calculadora modular
# Del artículo «Funciones en Python — 3 programas que demuestran su poder real»
# https://sergiolearns.com/funciones-en-python-practica/

# Funciones de cálculo — solo calculan, no imprimen nada
def sumar(a, b):
    return a + b

def restar(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    if b == 0:
        return None    # None indica error
    return round(a / b, 4)

def potencia(a, b):
    return a ** b

def modulo(a, b):
    if b == 0:
        return None
    return a % b

# Funciones de interfaz — solo gestionan entrada/salida
def mostrar_menu():
    print("\n=== CALCULADORA MODULAR ===")
    print("1. Suma        2. Resta")
    print("3. Multiplicar 4. Dividir")
    print("5. Potencia    6. Módulo")
    print("0. Salir")

def pedir_numeros():
    a = float(input("Primer número: "))
    b = float(input("Segundo número: "))
    return a, b

def mostrar_resultado(operacion, a, b, resultado):
    simbolos = {
        "suma": "+", "resta": "-", "multiplicar": "×",
        "dividir": "/", "potencia": "^", "modulo": "%"
    }
    simbolo = simbolos.get(operacion, "?")
    if resultado is None:
        print("Error: no se puede dividir entre cero")
    else:
        print(f"\n{a} {simbolo} {b} = {resultado}")

# Función principal — coordina todo
def ejecutar_calculadora():
    while True:
        mostrar_menu()
        opcion = input("\nOpción: ")

        if opcion == "0":
            print("Hasta luego")
            break

        a, b = pedir_numeros()

        if opcion == "1":
            mostrar_resultado("suma", a, b, sumar(a, b))
        elif opcion == "2":
            mostrar_resultado("resta", a, b, restar(a, b))
        elif opcion == "3":
            mostrar_resultado("multiplicar", a, b, multiplicar(a, b))
        elif opcion == "4":
            mostrar_resultado("dividir", a, b, dividir(a, b))
        elif opcion == "5":
            mostrar_resultado("potencia", a, b, potencia(a, b))
        elif opcion == "6":
            mostrar_resultado("modulo", a, b, modulo(a, b))
        else:
            print("Opción no válida")

# Punto de entrada del programa
ejecutar_calculadora()
