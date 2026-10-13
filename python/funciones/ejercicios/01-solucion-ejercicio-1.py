# Solución Ejercicio 1:
# Del artículo «Funciones en Python — ejercicios para afianzar lo que sabes»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# Conversor de notas entre sistemas
def española_a_americana(nota):
    return round(nota * 10, 1)

def americana_a_española(nota):
    return round(nota / 10, 1)

def española_a_letra(nota):
    if nota >= 9:
        return "A"
    elif nota >= 7:
        return "B"
    elif nota >= 5:
        return "C"
    elif nota >= 3:
        return "D"
    else:
        return "F"

def letra_a_española(letra):
    equivalencias = {"A": 9.5, "B": 7.5, "C": 5.5, "D": 3.5, "F": 1.5}
    return equivalencias.get(letra.upper(), None)

def mostrar_conversiones(nota_española):
    americana = española_a_americana(nota_española)
    letra = española_a_letra(nota_española)
    print(f"\n--- Conversiones ---")
    print(f"Sistema español:    {nota_española}")
    print(f"Sistema americano:  {americana}")
    print(f"Sistema de letras:  {letra}")

print("=== CONVERSOR DE NOTAS ===")
nota = float(input("Nota española (0-10): "))

if nota < 0 or nota > 10:
    print("Error: la nota debe estar entre 0 y 10")
else:
    mostrar_conversiones(nota)
