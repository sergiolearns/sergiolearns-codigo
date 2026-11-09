# Comprobación · Las soluciones de los tres niveles de ejercicios
# Del artículo «Rendimiento del computador — ejercicios con frecuencias, CPI medio, Amdahl y un ordenador que mejorar (y el compilador que defendí por sus MIPS)»
# https://sergiolearns.com/rendimiento-ejercicios/

# Comprueba las soluciones de los ejercicios de rendimiento (niveles 1, 2 y 3).

def es(x, d=2):
    return f"{x:.{d}f}".replace(".", ",")

# Nivel 1: unidades, tiempo de CPU y «cuántas veces»
print("N1 a) 2,5 GHz ->", es(1 / 2.5e9 * 1e12, 0), "ps | 250 ps ->", es(1 / 250e-12 / 1e9, 1), "GHz | 1,25 ns ->", es(1 / 1.25e-9 / 1e6, 0), "MHz")
print("   b) T = 6·10^9 x 1,5 / 3 GHz =", es(6e9 * 1.5 / 3e9, 1), "s")
print("   c) 15 / 12 =", es(15 / 12), "veces; A tarda un", f"{1 - 12 / 15:.0%}", "menos; B tarda un", f"{15 / 12 - 1:.0%}", "más")
print("   d) ciclos de 2 s a 4 GHz =", es(2 * 4e9 / 1e9, 0), "·10^9")

# Nivel 2: dos ordenadores para la caja, mismo programa (5·10^9 instrucciones), mezcla 40 / 40 / 20 %
mezcla = (0.4, 0.4, 0.2)                              # aritméticas, memoria, saltos
def maquina(nombre, F, cpis):
    cpi = sum(f * c for f, c in zip(mezcla, cpis))    # CPI medio ponderado con las frecuencias
    t = 5e9 * cpi / F
    print(f"N2 {nombre}: CPI = {es(cpi)}  T = {es(t)} s  MIPS = {5e9 / (t * 1e6):.0f}")
    return t
tX = maquina("X (2 GHz)", 2e9, (1, 2, 2))
tY = maquina("Y (3 GHz)", 3e9, (1, 3, 4))
tY2 = maquina("Y nueva  ", 3e9, (1, 2, 4))
print("   X frente a Y nueva:", es(tX / tY2), "veces")

# Nivel 3: el cierre de caja tarda 200 s: CPU 120, disco 50, red 30; equipo de 800 €
def nuevo(cpu=1, disco=1):
    return 120 / cpu + 50 / disco + 30               # la red no mejora con ninguna opción
for nombre, t, precio in (("CPU x4 (+400 €)", nuevo(cpu=4), 1200), ("disco x5 (+100 €)", nuevo(disco=5), 900),
                          ("las dos (+500 €)", nuevo(4, 5), 1300)):
    G = 200 / t
    print(f"N3 {nombre:18}: {es(t, 0):>3} s  G = {es(G)}  rendimiento por euro = {es(G * 800 / precio)}")
print("   CPU sola para G = 2: 100 s -> la CPU debe tardar", es(100 - 80, 0), "s -> S =", es(120 / 20, 0))
print("   límite con la CPU sola:", es(200 / 80))
