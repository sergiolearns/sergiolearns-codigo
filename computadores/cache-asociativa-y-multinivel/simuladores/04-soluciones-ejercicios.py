# Compruébalo con Python · Las soluciones de los ejercicios de rendimiento de la caché, asociatividad y multinivel
# Del artículo «Rendimiento de la caché, asociatividad y multinivel — ejercicios con el CPI real, una 2 vías con LRU y un reloj el doble de rápido (y el bloque que saqué por llegar primero)»
# https://sergiolearns.com/cache-asociativa-y-multinivel-ejercicios/

# Las soluciones de los ejercicios de rendimiento de la caché, asociatividad y multinivel, comprobadas de una vez.
from math import log2


def n(x, d=2):                                     # número con coma decimal
    return f"{x:.{d}f}".replace(".", ",")


def simula(direcciones, lineas, palabras, vias, politica="LRU"):
    conjuntos = lineas // vias
    cache, marcas = [[] for _ in range(conjuntos)], ""   # cada conjunto, del que toca sacar al último
    for d in direcciones:
        bloque = d // (4 * palabras); c = bloque % conjuntos
        if bloque in cache[c]:
            marcas += "A"
            if politica == "LRU":                 # con LRU, usarlo lo pone al final; con FIFO no
                cache[c].remove(bloque); cache[c].append(bloque)
        else:
            marcas += "F"
            if len(cache[c]) == vias:
                cache[c].pop(0)                   # LRU: el menos usado; FIFO: el que entró antes
            cache[c].append(bloque)
    return marcas, cache


print("Nivel 1: CPI y una caché de 32 KiB de 4 vías con bloques de 32 bytes")
penal = round(30 / 0.5)                            # 30 ns a 2 GHz
cpi = 1.2 + 0.01 * penal + 0.25 * 0.04 * penal
print(f"  penalización {penal} ciclos; CPI {n(cpi)}; ideal {n(cpi / 1.2)} veces; parado {n(100 * (cpi - 1.2) / cpi, 0)} %")
conj = 32 * 1024 // 32 // 4; desp = int(log2(32)); indice = int(log2(conj)); etiq = 32 - indice - desp
print(f"  {conj} conjuntos: desplazamiento {desp}, conjunto {indice}, etiqueta {etiq} bits; etiquetas {etiq * conj * 4 // 1024} Kbits")
for d in [0x10010A64, 0x00400F3C]:
    print(f"  0x{d:08X}: etiqueta 0x{d >> 13:05X}  conjunto {(d >> 5) % conj}  palabra {(d >> 2) % 8}  byte {d % 4}")

print("Nivel 2: 8 bloques de 4 palabras, 2 vías")
seq = [304, 436, 304, 316, 308, 432, 60, 444, 312, 440]
for pol in ["LRU", "FIFO"]:
    m, c = simula(seq, 8, 4, 2, pol)
    print(f"  {pol:4}: {m}  fallos {m.count('F')}/10  estado {c}")
m, c = simula(seq, 8, 4, 1)
print(f"  directa: {m}  fallos {m.count('F')}/10 | bloques {[d // 16 for d in seq]}")
print(f"  tamaño: 8 × (1 + {32 - 2 - 4} + 128) = {8 * (1 + 26 + 128)} bits")

print("Nivel 3: el reloj al doble con y sin L2 (memoria 40 ns, L2 4 ns, 1,25 accesos por instrucción)")
ns = {}                                            # nanosegundos por instrucción, sin y con L2
for ghz in [2, 4]:
    ciclo = 1 / ghz; mem, l2 = round(40 / ciclo), round(4 / ciclo)
    sin = 1 + 1.25 * 0.05 * mem; con = 1 + 1.25 * (0.05 * l2 + 0.005 * mem)
    print(f"  {ghz} GHz: memoria {mem}, L2 {l2} ciclos; CPI sin L2 {n(sin)} ({n(sin * ciclo)} ns), con L2 {n(con)} ({n(con * ciclo)} ns)")
    ns[ghz] = (sin * ciclo, con * ciclo)
print(f"  ganancia del reloj: sin L2 {n(ns[2][0] / ns[4][0])}, con L2 {n(ns[2][1] / ns[4][1])}; tasa local de L2 {n(100 * 0.005 / 0.05, 0)} %")
