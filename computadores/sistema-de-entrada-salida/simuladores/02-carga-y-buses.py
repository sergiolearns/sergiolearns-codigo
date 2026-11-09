# Simulador: la carga de un nivel cuando solo mejora la CPU y el ancho de banda de los buses
# Del artículo «Entrada/salida — teoría con una tarde de videojuegos, un ratón al que el PC pregunta mil veces por segundo y un SSD que solo cabe por DMA (y el disco que se comía la CPU entera)»
# https://sergiolearns.com/sistema-de-entrada-salida/
# La carga del nivel cuando solo mejora la CPU, y el ancho de banda de los buses del PC.
def n(x, d=2):                        # número con coma decimal
    return f"{x:.{d}f}".replace(".", ",")

# 1) El nivel tarda 40 s en cargar: 32 s de CPU (descomprimir, montar el mapa) y 8 s de E/S (leer del disco).
cpu, es = 32.0, 8.0
print("gen  CPU    E/S  total  % E/S")
for gen in range(4):                  # cada generación la CPU va el doble de rápido; el disco, igual
    total = cpu + es
    print(f"{gen:>3}  {n(cpu, 0):>3} s  {n(es, 0):>2} s  {n(total, 0):>3} s  {n(100 * es / total, 0):>4} %")
    cpu /= 2
print(f"la CPU mejora {n(32 / 4, 0)} veces; la carga, solo {n(40 / 12)} veces")

# 2) Ancho de banda = bytes por transferencia × transferencias por segundo.
PCIE = {"1.0": 250, "3.0": 985, "4.0": 1969}          # MB/s por línea y sentido (apuntes)
for gen, mb in PCIE.items():
    print(f"PCIe {gen}: x1 {mb:>5} MB/s · x4 {4 * mb:>5} MB/s · x16 {16 * mb:>6} MB/s")

# 3) Un bus síncrono de 32 bits a 100 MHz frente a uno asíncrono con 4 pasos de handshake de 10 ns.
palabra = 4                                           # bytes por transferencia (32 bits)
sincrono = palabra * 100_000_000 / 10**6              # una palabra por ciclo
multiplexado = sincrono / 2                           # dirección y dato por las mismas líneas: 2 ciclos por palabra
asincrono = palabra / (4 * 10e-9) / 10**6             # 4 pasos de 10 ns por palabra
print(f"síncrono {n(sincrono, 0)} MB/s · multiplexado {n(multiplexado, 0)} MB/s · asíncrono {n(asincrono, 0)} MB/s")
