# Simulador: consulta, interrupciones y DMA en un segundo de la tarde de videojuegos
# Del artículo «Entrada/salida — teoría con una tarde de videojuegos, un ratón al que el PC pregunta mil veces por segundo y un SSD que solo cabe por DMA (y el disco que se comía la CPU entera)»
# https://sergiolearns.com/sistema-de-entrada-salida/
# Un segundo de la tarde de videojuegos: cuánto tiempo de CPU se lleva cada forma de hacer la E/S.
RELOJ = 4_000_000_000                 # procesador de 4 GHz: 4 000 millones de ciclos por segundo
CONSULTA = 400                        # ciclos de una consulta: llamar a la rutina, leer el estado, mover el dato y volver
INTERRUPCION = 500                    # ciclos de una interrupción: guardar PC y registros, rutina de servicio y rfe
DMA_PREPARA, DMA_FIN = 2000, 1200     # programar el controlador de DMA y atender su interrupción al acabar el bloque

def n(x):                             # número con coma decimal y sin ceros de más
    return f"{x:.4f}".rstrip("0").rstrip(".").replace(".", ",")

def fila(quien, metodo, ciclos):         # una línea de la tabla: ciclos por segundo y su parte de la CPU
    print(f"{quien:<8}{metodo:<15}{ciclos:>15_} ciclos/s  {n(100 * ciclos / RELOJ):>8} % de la CPU".replace("_", " "))

# El ratón de 1000 Hz: el PC le pregunta 1000 veces por segundo, lo muevas o no.
fila("ratón", "consulta", 1000 * CONSULTA)

# El SSD lee 2000 MB/s. Por programa, la CPU mueve cada vez 16 bytes (4 palabras).
SSD = 2000 * 10**6                    # bytes por segundo (MB de fabricante: 10^6 bytes)
trozos = SSD // 16                    # veces por segundo que hay que mover 16 bytes
fila("SSD", "consulta", trozos * CONSULTA)
fila("SSD", "interrupción", trozos * INTERRUPCION)
bloques = SSD // 32_000               # con DMA, el controlador mueve bloques de 32 KB y la CPU solo empieza y acaba
fila("SSD", "DMA", bloques * (DMA_PREPARA + DMA_FIN))

# Espera activa: la CPU no hace nada más que preguntar al teclado si hay tecla.
TECLAS = 5                            # teclas por segundo (escribiendo deprisa en el chat del juego)
VUELTA = 4                            # ciclos de una vuelta del bucle (lw del estado, andi, beq)
print(f"esperando una tecla: {RELOJ // TECLAS // VUELTA:_} vueltas del bucle por tecla".replace("_", " "))
