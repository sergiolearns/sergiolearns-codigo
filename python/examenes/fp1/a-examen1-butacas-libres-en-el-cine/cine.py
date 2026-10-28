# Simulacro práctico de FP1 · versión A · Butacas libres en el cine (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
from pantalla import dibujar_sala



def primer_hueco(fila, n):
    # Columna (desde 0) donde empiezan n asientos libres seguidos, o -1 si no hay.
    seguidos = 0                       # libres seguidos hasta ahora
    for col in range(len(fila)):
        if fila[col] == 0:
            seguidos += 1
            if seguidos == n:          # el hueco acaba aquí: empezó n - 1 columnas antes
                return col - n + 1
        else:
            seguidos = 0               # una ocupada corta la racha
    return -1


def buscar_asientos(sala, n):
    resultado = []
    for i in range(len(sala)):
        col = primer_hueco(sala[i], n)
        if col != -1:
            resultado.append((i + 1, col + 1))   # la taquilla cuenta desde 1
    return resultado


if __name__ == "__main__":
    sala = [
        [1, 1, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 0, 0],
    ]
    print(dibujar_sala(sala))
    print(buscar_asientos(sala, 3))
