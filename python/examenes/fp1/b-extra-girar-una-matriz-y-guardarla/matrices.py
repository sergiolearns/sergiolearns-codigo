# Simulacro práctico de FP1 · versión B · Girar una matriz y guardarla (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
def girar(matriz):
    # Gira 90° a la derecha: la columna c (leída de abajo arriba) pasa a ser la fila c. No toca la original.
    if not matriz:
        return []
    filas, columnas = len(matriz), len(matriz[0])
    nueva = []
    for c in range(columnas):
        nueva.append([matriz[f][c] for f in range(filas - 1, -1, -1)])   # f va de la última fila a la primera
    return nueva


def guardar(matriz, nombre):
    with open(nombre, "w", encoding="utf-8") as fich:
        for fila in matriz:
            fich.write("".join(f"{x:>4}" for x in fila) + "\n")      # cada número en un campo de 4
        columnas = len(matriz[0]) if matriz else 0
        fich.write(f"Filas: {len(matriz)}, columnas: {columnas}\n")


if __name__ == "__main__":
    m = [[1, 2, 3], [4, 5, 6]]
    g = girar(m)
    print(g)
    print(m)
    guardar(g, "girada.txt")
    print(open("girada.txt", encoding="utf-8").read(), end="")
