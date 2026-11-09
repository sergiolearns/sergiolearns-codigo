# Compruébalo con Python · Los ciclos de parada en el CPI, el reloj al doble y la caché L2 (CPI y TMAM)
# Del artículo «Rendimiento de la caché, asociatividad y multinivel — teoría con una cocina, conjuntos de 2 vías y una caché L2 que salva la receta (y el 98 % de aciertos que me parecía perfecto)»
# https://sergiolearns.com/cache-asociativa-y-multinivel/

# Los ciclos de parada en el CPI y el tiempo medio de acceso, con una y con dos cachés.
def n(x, d=2):                                     # número con coma decimal
    return f"{x:.{d}f}".replace(".", ",")


def cpi(base, fallos_i, fallos_d, frec_datos, penal):
    paradas = fallos_i * penal + frec_datos * fallos_d * penal   # instrucciones + datos (solo lw/sw)
    return base + paradas


ciclo = 1 / 2                                      # reloj de 2 GHz: un ciclo dura 0,5 ns
penal = round(50 / ciclo)                          # memoria de 50 ns = 100 ciclos
real = cpi(1, 0.01, 0.05, 0.40, penal)
print(f"CPI real {n(real)}: la caché ideal sería {n(real / 1)} veces más rápida")
print(f"tiempo parado: {n(100 * (real - 1) / real, 0)} %")
peor = cpi(2, 0.01, 0.05, 0.40, penal)           # un procesador más lento, con CPI base 2
print(f"con CPI base 2: CPI {n(peor)}, {n(peor / 2)} veces, parado {n(100 * (peor - 2) / peor, 0)} %")
rapido = cpi(1, 0.01, 0.05, 0.40, round(50 / 0.25))   # el doble de GHz: la memoria son 200 ciclos
print(f"a 4 GHz: CPI {n(rapido)}, {n(rapido * 0.25)} ns por instrucción frente a {n(real * ciclo)} ns")

# Dos niveles (1 acceso por instrucción): L1 falla el 5 %, L2 tarda 5 ns y solo el 1 % llega a memoria
l2, mem = round(5 / ciclo), penal                  # 10 ciclos y 100 ciclos
solo_l1 = 1 + 0.05 * mem
con_l2 = 1 + 0.05 * l2 + 0.01 * mem               # 0,01 = tasa global de L2
print(f"CPI con solo L1 {n(solo_l1)}, con L2 {n(con_l2)}: {n(solo_l1 / con_l2)} veces más rápido")
local = 0.01 / 0.05                                # de cada fallo de L1, qué parte falla también en L2
tmam = 1 + 0.05 * (l2 + local * mem)              # tiempo medio de acceso, en ciclos
print(f"tasa local de L2 {n(100 * local, 0)} %; TMAM {n(1 + 0.05 * mem)} ciclos sin L2 y {n(tmam)} con L2")
