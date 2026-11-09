# Las cuentas de los ejercicios de entrada/salida
# Del artículo «Entrada/salida — ejercicios con un disco de tres maneras, una carga que no baja y periféricos para clasificar (y el bus que me salió más rápido que un SSD)»
# https://sergiolearns.com/sistema-de-entrada-salida-ejercicios/
# Las cuentas de los ejercicios (procesador de 3 GHz).
RELOJ = 3_000_000_000

def n(x, d=4):                        # número con coma decimal y sin ceros de más
    s = f"{x:.{d}f}"
    return (s.rstrip("0").rstrip(".") if "." in s else s).replace(".", ",")

def m(x):                             # entero con espacios cada tres cifras
    return f"{x:_}".replace("_", " ")

def pct(ciclos):
    return n(100 * ciclos / RELOJ)

# Nivel 1: consultar un mando a 250 Hz con 300 ciclos por consulta.
print(f"N1 mando: {m(250 * 300)} ciclos/s = {pct(250 * 300)} %")

# Nivel 2: un disco de 60 MB/s que entrega 16 bytes cada vez, de tres formas.
trozos = 60 * 10**6 // 16
consulta = trozos * 300                        # siempre, esté o no transfiriendo
inter = trozos * 0.20 * 400                    # solo el 20 % del tiempo hay datos
bloques = 60 * 10**6 // 12_000                 # DMA con bloques de 12 KB
dma = bloques * (1500 + 900)                   # preparar + interrupción final
print(f"N2 {m(trozos)} trozos/s · consulta {pct(consulta)} % · interrupciones {pct(inter)} % · "
      f"DMA {pct(dma)} % (al 20 %: {pct(dma * 0.20)} %) · empate {n(100 * 300 / 400)} %")

# Nivel 3: la carga de 30 s (24 de CPU y 6 de disco) cuando la CPU va el doble cada generación, y luego un NVMe.
cpu, es = 24.0, 6.0
for gen in range(3):
    print(f"N3 gen {gen}: {n(cpu, 1)} + {n(es, 1)} = {n(cpu + es, 1)} s · E/S {n(100 * es / (cpu + es), 0)} %")
    cpu /= 2
print(f"N3 gen 3 (solo CPU): {n(cpu, 1)} + {n(es, 1)} = {n(cpu + es, 1)} s")
cpu *= 2                                       # nos quedamos en la generación 2
nvme = es * 600 / 2400                         # de SATA (600 MB/s) a un NVMe de 2400 MB/s
print(f"N3 con NVMe: {n(cpu, 1)} + {n(nvme, 1)} = {n(cpu + nvme, 1)} s · ganancia {n(30 / (cpu + nvme), 2)} frente a {n(30 / (cpu + es), 2)}")
for nombre, mbs in (("SATA", 600), ("PCIe 3.0 x1", 985), ("PCIe 3.0 x4", 4 * 985)):
    print(f"   {nombre}: {mbs} MB/s, {'le basta' if mbs >= 2400 else 'se queda corto'} para 2400 MB/s")

# ¿Qué falla aquí?: el bus de 32 bits a 100 MHz y la DMA con una interrupción por cada 16 bytes.
print(f"F1 bien: {4 * 100} MB/s · mal: {32 * 100} MB/s")
print(f"F2 mal: {pct(trozos * 900)} % · bien: {pct(dma)} %")
