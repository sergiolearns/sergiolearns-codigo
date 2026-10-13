# Operadores en Python práctica — Programa 3: Calculadora completa con menú
# Del artículo «Operadores en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/operadores-en-python-practica/

# Calculadora completa con menú
print("=== CALCULADORA PYTHON ===")
print("1. Suma")
print("2. Resta")
print("3. Multiplicación")
print("4. División")
print("5. División entera")
print("6. Módulo (resto)")
print("7. Potencia")

opcion = int(input("\nElige una opción (1-7): "))
a = float(input("Primer número: "))
b = float(input("Segundo número: "))

print("\n--- Resultado ---")

if opcion == 1:
    resultado = a + b
    print(f"{a} + {b} = {resultado}")

elif opcion == 2:
    resultado = a - b
    print(f"{a} - {b} = {resultado}")

elif opcion == 3:
    resultado = a * b
    print(f"{a} × {b} = {resultado}")

elif opcion == 4:
    if b != 0:
        resultado = round(a / b, 4)
        print(f"{a} / {b} = {resultado}")
    else:
        print("Error: no se puede dividir entre cero")

elif opcion == 5:
    if b != 0:
        resultado = int(a // b)
        resto = int(a % b)
        print(f"{int(a)} // {int(b)} = {resultado} (resto: {resto})")
    else:
        print("Error: no se puede dividir entre cero")

elif opcion == 6:
    if b != 0:
        resultado = int(a % b)
        print(f"{int(a)} % {int(b)} = {resultado}")
        if resultado == 0:
            print(f"→ {int(a)} es divisible por {int(b)}")
        else:
            print(f"→ {int(a)} NO es divisible por {int(b)}")
    else:
        print("Error: no se puede dividir entre cero")

elif opcion == 7:
    resultado = a ** b
    print(f"{a} ^ {b} = {resultado}")

else:
    print("Opción no válida")
