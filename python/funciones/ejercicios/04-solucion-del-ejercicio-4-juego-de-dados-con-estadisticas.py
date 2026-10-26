# Solución del ejercicio 4 · Juego de dados con estadísticas
# Del artículo «Funciones en Python — ejercicios con notas, un mini banco y dados con estadísticas (y el return que se rindió en la primera tirada)»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# Desafío · Ejercicio 4: juego de dados con estadísticas
import random

random.seed(37)    # semilla fija para que la salida sea siempre la misma (quítala para jugar)


def lanzar_dado():
    return random.randint(1, 6)                # return: devuelve el número, no lo imprime


def lanzar_dos_dados():
    return lanzar_dado(), lanzar_dado()        # dos valores a la vez (una tupla)


def es_doble(dado1, dado2):
    return dado1 == dado2


def maximo_y_posicion(sumas):
    """Devuelve el valor más alto y en qué lanzamiento salió (el primero si se repite)."""
    mejor, posicion, i = 0, 0, 0
    for s in sumas:
        i += 1
        if s > mejor:
            mejor, posicion = s, i
    return mejor, posicion


def minimo_y_posicion(sumas):
    peor, posicion, i = 13, 0, 0               # 13: más que la suma máxima posible (6 + 6)
    for s in sumas:
        i += 1
        if s < peor:
            peor, posicion = s, i
    return peor, posicion


def veces(n):
    """«1 vez» o «2 veces»: el plural también es una decisión."""
    if n == 1:
        return "1 vez"
    return f"{n} veces"


def mostrar_distribucion(sumas):
    print("Distribución de resultados:")
    for valor in range(2, 13):                 # todas las sumas posibles, ya en orden
        n = sumas.count(valor)                 # cuántas veces salió ese valor
        if n > 0:
            print(f"  {valor:2d}: {'█' * n} ({veces(n)})")


def jugar(lanzamientos):
    print("=== JUEGO DE DADOS ===")
    sumas = []
    dobles = 0
    for i in range(1, lanzamientos + 1):
        d1, d2 = lanzar_dos_dados()            # desempaquetamos la tupla
        suma = d1 + d2
        aviso = ""
        if es_doble(d1, d2):
            aviso = " ← ¡Doble!"
            dobles += 1
        print(f"Lanzamiento {i}: 🎲 {d1} + 🎲 {d2} = {suma}{aviso}")
        sumas.append(suma)
    maximo, lanz_max = maximo_y_posicion(sumas)
    minimo, lanz_min = minimo_y_posicion(sumas)
    print("--- Estadísticas ---")
    print("Total lanzamientos:", lanzamientos)
    print("Suma total:", sum(sumas))
    print("Media por lanzamiento:", round(sum(sumas) / lanzamientos, 2))
    print(f"Máximo obtenido: {maximo} (lanzamiento {lanz_max})")
    print(f"Mínimo obtenido: {minimo} (lanzamiento {lanz_min})")
    print(f"Dobles conseguidos: {dobles} ({round(dobles / lanzamientos * 100, 1)} %)")
    mostrar_distribucion(sumas)


jugar(6)
