# Compruébalo con Python · Benchmark de latencias: recorrer un vector de 128 MiB con pasos cada vez mayores
# Del artículo «Memoria caché de mapeo directo — teoría con una mesa de estudio, la dirección partida en etiqueta e índice y los tres tipos de fallo (y la tabla de AEDV que por columnas tardaba seis veces más)»
# https://sergiolearns.com/memoria-cache/

# Benchmark de latencias: recorrer un vector enorme con pasos cada vez mayores
# y medir cuánto tarda cada acceso. Los tiempos dependen del ordenador: en el tuyo saldrán otros.
import time
import numpy as np

N = 1 << 24                         # 16 M enteros de 8 bytes = 128 MiB, más que cualquier caché
v = np.ones(N, dtype=np.int64)
ACCESOS = 1 << 21                   # siempre los mismos 2 M accesos, cambie el paso o no

for paso in [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]:
    indices = (np.arange(ACCESOS, dtype=np.int64) * paso) % N   # 0, paso, 2·paso…
    mejor = float("inf")
    for _ in range(5):              # el mejor de 5 intentos, para quitar ruido
        t0 = time.perf_counter()
        v[indices].sum()            # lee los 2 M elementos y los suma
        mejor = min(mejor, time.perf_counter() - t0)
    ns = mejor / ACCESOS * 1e9      # nanosegundos por acceso
    barra = "#" * round(ns * 3)     # un # por cada tercio de nanosegundo
    print(f"paso {paso:4d} ({paso * 8:4d} B): {ns:5.2f} ns  {barra}".replace(".", ","))
