# Compruébalo con Python · Comparador de tiempos de CPU: el cierre de caja con dos compiladores
# Del artículo «Rendimiento del computador — teoría con la caja del supermercado, el CPI medio y la ley de Amdahl (y el portátil de 3 GHz que no iba el doble)»
# https://sergiolearns.com/rendimiento/

# Comparador de tiempos de CPU: el cierre de caja del súper compilado con dos compiladores.
# Tiempo = ciclos / F, y los ciclos salen de sumar (instrucciones de cada clase x su CPI).
F = 2e9                                               # 2 GHz: 2·10^9 ciclos por segundo
CPI = {"aritméticas": 1, "memoria": 2, "saltos": 3}   # ciclos que gasta cada clase
compiladores = {                                      # instrucciones de cada clase, en miles de millones
    "actual": {"aritméticas": 2.0, "memoria": 1.2, "saltos": 0.8},
    "nuevo":  {"aritméticas": 1.0, "memoria": 1.2, "saltos": 0.6},
}

def es(x, d=2):                                       # número con coma decimal, como en clase
    return f"{x:.{d}f}".replace(".", ",")

tiempos = {}
for nombre, cuenta in compiladores.items():
    N = sum(cuenta.values()) * 1e9                    # instrucciones ejecutadas en total
    ciclos = sum(cuenta[c] * 1e9 * CPI[c] for c in CPI)   # cada clase, con su propio CPI
    cpi = ciclos / N                                  # CPI medio: ciclos / instrucciones
    t = ciclos / F                                    # tiempo de CPU en segundos
    mips = N / (t * 1e6)                              # millones de instrucciones por segundo
    tiempos[nombre] = t
    print(f"{nombre:7}: N = {es(N / 1e9, 1)}·10^9  ciclos = {es(ciclos / 1e9, 1)}·10^9  "
          f"CPI = {es(cpi)}  T = {es(t)} s  MIPS = {mips:.0f}")
    for c in CPI:                                     # de dónde salen los ciclos
        parte = cuenta[c] * CPI[c] / (ciclos / 1e9)   # fracción de los ciclos de esa clase
        print(f"         {c:12} {es(cuenta[c], 1)}·10^9 x {CPI[c]} = {es(cuenta[c] * CPI[c], 1)}·10^9 ciclos ({parte:.0%})")

rapido = min(tiempos, key=tiempos.get)                # el que tarda menos es el más rápido
lento = max(tiempos, key=tiempos.get)
print(f"\nMás rápido: {rapido}, {es(tiempos[lento] / tiempos[rapido])} veces "
      f"({es(tiempos[lento])} s / {es(tiempos[rapido])} s)")
