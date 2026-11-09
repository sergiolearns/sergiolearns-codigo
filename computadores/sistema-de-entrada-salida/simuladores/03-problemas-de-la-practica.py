# Las cuentas de los seis problemas de la práctica guiada de entrada/salida
# Del artículo «Entrada/salida — práctica guiada con el coste de consultar, interrupciones, DMA, el ancho de banda de un bus y el bucle de consulta en MIPS paso a paso (y el disco duro que clasifiqué como entrada)»
# https://sergiolearns.com/sistema-de-entrada-salida-practica/
# Las cuentas de los problemas de la práctica guiada (procesador de 2 GHz).
RELOJ = 2_000_000_000                 # ciclos por segundo
CONSULTA, INTERRUPCION = 200, 250     # ciclos de una consulta y de una interrupción

def n(x):                             # porcentaje con coma decimal y sin ceros de más
    return f"{x:.5f}".rstrip("0").rstrip(".").replace(".", ",")

def m(x):                             # entero con espacios cada tres cifras
    return f"{x:_}".replace("_", " ")

def pct(ciclos):
    return n(100 * ciclos / RELOJ)

# Problema 1: consultar un mando a 500 Hz y un disco duro de 40 MB/s que entrega 16 bytes cada vez.
mando = 500 * CONSULTA
disco = 40 * 10**6 // 16 * CONSULTA
print(f"P1 mando {m(mando)} ciclos/s = {pct(mando)} % · disco {m(disco)} ciclos/s = {pct(disco)} %")
print(f"   prueba: mando a 1000 Hz {pct(1000 * CONSULTA)} % · disco de 80 MB/s {pct(80 * 10**6 // 16 * CONSULTA)} %")

# Problema 2: el mismo disco por interrupciones, si solo está transfiriendo una parte del tiempo.
for activo in (0.10, 0.50, 1.00):
    inter = 40 * 10**6 // 16 * activo * INTERRUPCION
    print(f"P2 activo {n(100 * activo)} %: consulta {pct(disco)} % · interrupciones {pct(inter)} %")
print(f"   empate: activo al {n(100 * CONSULTA / INTERRUPCION)} % del tiempo")

# Problema 3: el mismo disco con DMA, bloques de 8 KB; 1000 ciclos para prepararlo y 500 para la interrupción final.
bloques = 40 * 10**6 // 8000
dma = bloques * (1000 + 500)
print(f"P3 {m(bloques)} bloques/s · {m(dma)} ciclos/s = {pct(dma)} % · al 10 %: {pct(dma * 0.10)} %")
print(f"   un bloque tarda {m(8000 * RELOJ // (40 * 10**6))} ciclos y la CPU solo pone 1500")
print(f"   prueba: bloques de 16 KB {pct(40 * 10**6 // 16000 * 1500)} % · al 10 %: {pct(40 * 10**6 // 16000 * 1500 * 0.10)} %")

# Problema 4: bus síncrono de 64 bits a 200 MHz y bus asíncrono con 4 pasos de handshake de 10 ns.
B, F = 8, 200                         # bytes por transferencia y millones de ciclos por segundo
print(f"P4 líneas separadas {B * F} MB/s · multiplexadas {B * F // 2} MB/s · ráfaga de 4 {4 * B * F // 5} MB/s"
      f" · asíncrono {B * 1000 // (4 * 10)} MB/s")
print(f"   prueba: 32 bits a 100 MHz, multiplexado con ráfaga de 4: {4 * 4 * 100 // 5} MB/s · 64 bits con ráfaga de 8: {8 * B * F // 9} MB/s")

# Problema 5: la espera activa en el bucle de consulta de MIPS (5 ciclos por vuelta, 4 teclas por segundo).
print(f"P5 {m(RELOJ // 4 // 5)} vueltas por tecla · prueba a 3 GHz, 6 teclas/s y 4 ciclos: {m(3 * 10**9 // 6 // 4)} vueltas")
