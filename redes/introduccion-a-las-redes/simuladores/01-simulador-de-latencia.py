# Compruébalo con Python · Simulador de latencia: el viaje de un dataset
# Del artículo «Introducción a las redes — teoría con un dataset que cruza el océano, cinco aparatos que no hacen lo mismo y paquetes que eligen su camino (y por qué la fibra no te quita los 9 ms)»
# https://sergiolearns.com/introduccion-a-las-redes/

# Compruébalo con Python: el viaje de un dataset desde la nube hasta tu portátil.
# Latencia de un paquete = tiempo de transmisión + tiempo de propagación + tiempo en los equipos.

PAQUETE = 1500 * 8           # bits de un paquete: 1500 bytes, el tamaño típico en Ethernet
DATASET = 40 * 10**6 * 8     # bits del dataset: 40 MB (el CSV de notas de toda la facultad)
EQUIPO = 0.00002             # segundos que tarda cada equipo intermedio en reenviar (0,02 ms)
V_CABLE, V_AIRE = 2e8, 3e8   # m/s: en cobre y fibra la señal va a unos 2/3 de la luz

# Tramos en el orden en que viaja la descarga: (tramo, medio, bit/s, metros)
RUTA = [
    ("servidor → NAP → PoP", "fibra óptica", 100e9, 1_800_000),   # la nube está en Madrid
    ("PoP → módem", "fibra óptica", 1e9, 9_000),                  # tu tarifa: 1 Gbit/s
    ("módem → router", "par trenzado", 1000e6, 2),
    ("router → switch", "par trenzado", 1000e6, 30),
    ("switch → AP", "par trenzado", 1000e6, 25),
    ("AP → portátil", "Wi-Fi", 300e6, 8),                         # el único tramo sin cable
]

total = 0
print(f"{'tramo':<22}{'medio':<14}{'transmisión':>12}{'propagación':>13}")
for tramo, medio, bps, metros in RUTA:
    t_tx = PAQUETE / bps                          # cuánto se tarda en "soltar" todos los bits del paquete
    v = V_AIRE if medio == "Wi-Fi" else V_CABLE   # el aire frena la onda menos que el cobre o el vidrio
    t_prop = metros / v                           # distancia / velocidad: no depende del tamaño del paquete
    total += t_tx + t_prop
    print(f"{tramo:<22}{medio:<14}{t_tx * 1000:>9.4f} ms{t_prop * 1000:>10.4f} ms")

equipos = len(RUTA) - 1                           # los equipos están ENTRE tramos: 6 tramos, 5 equipos
total += equipos * EQUIPO
print(f"\nEquipos intermedios: {equipos} × {EQUIPO * 1000:.2f} ms")
print(f"Latencia de un paquete: {total * 1000:.3f} ms")

cuello = min(RUTA, key=lambda t: t[2])            # el tramo más lento marca la velocidad de la descarga
t_desc = DATASET / cuello[2] + total              # los paquetes van en fila: manda el tramo más estrecho
print(f"Cuello de botella: {cuello[0]} ({cuello[2] / 1e6:.0f} Mbit/s)")
print(f"Descargar los 40 MB: unos {t_desc:.2f} s")
