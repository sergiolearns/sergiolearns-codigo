# Bucles en Python práctica — Programa 2: Calculadora de factorial
# Del artículo «Bucles en Python — 3 programas que por fin tienen sentido»
# https://sergiolearns.com/bucles-en-python-practica/

# Factorial — comparativa for vs while
numero = int(input("Introduce un número entero positivo: "))

if numero < 0:
    print("Error: el factorial no existe para números negativos")
elif numero == 0:
    print("0! = 1  (por definición matemática)")
else:
    # CON FOR — sabemos exactamente cuántas veces repetir
    factorial_for = 1
    for i in range(1, numero + 1):
        factorial_for *= i

    # CON WHILE — misma lógica, diferente estructura
    factorial_while = 1
    i = 1
    while i <= numero:
        factorial_while *= i
        i += 1

    print(f"\n{numero}! calculado con for:   {factorial_for}")
    print(f"{numero}! calculado con while: {factorial_while}")
    print(f"\n¿Son iguales?: {factorial_for == factorial_while}")

    # Mostramos el proceso paso a paso
    print(f"\nProceso: ", end="")
    acumulado = 1
    for i in range(1, numero + 1):
        acumulado *= i
        if i < numero:
            print(f"{i}×", end="")
        else:
            print(f"{i} = {acumulado}")
