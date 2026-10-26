# Solución del ejercicio 1 · Conversor de notas entre sistemas
# Del artículo «Funciones en Python — ejercicios con notas, un mini banco y dados con estadísticas (y el return que se rindió en la primera tirada)»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# Nivel básico · Ejercicio 1: conversor de notas entre sistemas
def espanola_a_americana(nota):
    """0-10 → 0-100."""
    return round(nota * 10, 1)


def americana_a_espanola(nota):
    """0-100 → 0-10."""
    return round(nota / 10, 1)


def espanola_a_letra(nota):
    """9-10 A · 7-8,9 B · 5-6,9 C · 3-4,9 D · menos de 3 F."""
    if nota >= 9:
        return "A"
    elif nota >= 7:
        return "B"
    elif nota >= 5:
        return "C"
    elif nota >= 3:
        return "D"
    return "F"


def letra_a_espanola(letra):
    """Cada letra vale el centro de su tramo; None si la letra no existe."""
    letra = letra.upper()
    if letra == "A":
        return 9.5
    if letra == "B":
        return 7.5
    if letra == "C":
        return 5.5
    if letra == "D":
        return 3.5
    if letra == "F":
        return 1.5
    return None


def mostrar_conversiones(nota):
    """La única que imprime: recibe la nota y enseña las tres versiones."""
    print("--- Conversiones ---")
    print("Sistema español:", nota)
    print("Sistema americano:", espanola_a_americana(nota))
    print("Sistema de letras:", espanola_a_letra(nota))


print("=== CONVERSOR DE NOTAS ===")
nota = 7.5                             # la nota que antes se pedía con input()
if nota < 0 or nota > 10:
    print("Error: la nota debe estar entre 0 y 10")
else:
    mostrar_conversiones(nota)
print("De vuelta: 75 →", americana_a_espanola(75), "· b →", letra_a_espanola("b"))
