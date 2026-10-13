# Solución Ejercicio 4:
# Del artículo «Funciones en Python — ejercicios para afianzar lo que sabes»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# Juego de dados con estadísticas
import random

def lanzar_dado():
    return random.randint(1, 6)    # RETURN — devuelve el valor

def lanzar_dos_dados():
    return lanzar_dado(), lanzar_dado()    # devuelve tupla

def es_doble(dado1, dado2):
    return dado1 == dado2

def calcular_estadisticas(resultados):
    sumas = [d1 + d2 for d1, d2 in resultados]
    dobles = sum(1 for d1, d2 in resultados if es_doble(d1, d2))
    return {
        "total": len(resultados),
        "suma_total": sum(sumas),
        "media": round(sum(sumas) / len(sumas), 2),
        "maximo": max(sumas),
        "lanz_max": sumas.index(max(sumas)) + 1,
        "minimo": min(sumas),
        "lanz_min": sumas.index(min(sumas)) + 1,
        "dobles": dobles,
        "pct_dobles": round(dobles / len(resultados) * 100, 1),
        "sumas": sumas
    }

def mostrar_distribucion(sumas):
    print("Distribución de resultados:")
    conteo = {}
    for s in sumas:
        conteo[s] = conteo.get(s, 0) + 1
    for valor in sorted(conteo.keys()):
        barra = "█" * conteo[valor]
        print(f"  {valor:2d}: {barra} ({conteo[valor]} vez)")

def jugar():
    print("=== JUEGO DE DADOS ===")
    n = int(input("¿Cuántos lanzamientos? "))
    resultados = []

    print()
    for i in range(1, n + 1):
        d1, d2 = lanzar_dos_dados()
        suma = d1 + d2
        doble = " ← ¡Doble!" if es_doble(d1, d2) else ""
        print(f"Lanzamiento {i}: 🎲 {d1} + 🎲 {d2} = {suma}{doble}")
        resultados.append((d1, d2))

    stats = calcular_estadisticas(resultados)
    print(f"\n--- Estadísticas ---")
    print(f"Total lanzamientos: {stats['total']}")
    print(f"Suma total:         {stats['suma_total']}")
    print(f"Media por lanzamiento: {stats['media']}")
    print(f"Máximo obtenido:    {stats['maximo']} (lanzamiento {stats['lanz_max']})")
    print(f"Mínimo obtenido:    {stats['minimo']} (lanzamiento {stats['lanz_min']})")
    print(f"Dobles conseguidos: {stats['dobles']} ({stats['pct_dobles']}%)")
    mostrar_distribucion(stats['sumas'])

jugar()
