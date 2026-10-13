# Solución Ejercicio 2:
# Del artículo «Funciones en Python — ejercicios para afianzar lo que sabes»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# Informe de notas — reutiliza funciones del ejercicio 1
def pedir_asignatura(numero):
    nombre = input(f"Asignatura {numero}: ")
    nota = float(input(f"Nota (0-10): "))
    while nota < 0 or nota > 10:
        print("Error: entre 0 y 10")
        nota = float(input(f"Nota (0-10): "))
    return nombre, nota

def generar_informe(asignaturas):
    print("\n--- Informe completo ---")
    notas = []

    for nombre, nota in asignaturas:
        americana = española_a_americana(nota)
        letra = española_a_letra(nota)
        print(f"{nombre:<20} {nota} | {americana} | {letra}")
        notas.append(nota)

    media = round(sum(notas) / len(notas), 2)
    nota_max = max(notas)
    nota_min = min(notas)
    nombre_max = asignaturas[notas.index(nota_max)][0]
    nombre_min = asignaturas[notas.index(nota_min)][0]

    print(f"\nMedia:         {media} → {española_a_letra(media)}")
    print(f"Más alta:      {nota_max} ({nombre_max})")
    print(f"Más baja:      {nota_min} ({nombre_min})")

print("=== INFORME DE NOTAS ===\n")
asignaturas = []
for i in range(1, 5):
    nombre, nota = pedir_asignatura(i)
    asignaturas.append((nombre, nota))
    print()

generar_informe(asignaturas)
