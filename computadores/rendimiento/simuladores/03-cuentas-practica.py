# Compruébalo con Python · Las cuentas de los seis problemas guiados
# Del artículo «Rendimiento del computador — práctica guiada con frecuencias, CPI medio, MIPS y la ley de Amdahl paso a paso (y la ganancia de 5 que no era)»
# https://sergiolearns.com/rendimiento-practica/

# Comprueba las cuentas de los seis problemas guiados de la práctica de rendimiento:
# frecuencia, comparar procesadores, CPI medio y MIPS, Amdahl en los dos sentidos, procesadores y la cuestión.

def es(x, d=2):
    return f"{x:.{d}f}".replace(".", ",")

def amdahl(total, parte, S):                          # tiempo nuevo = lo que no mejora + lo que mejora / S
    return (total - parte) + parte / S

# Problema 1: el cierre de caja tarda 15 s a 2 GHz; el diseño nuevo gasta un 25 % más de ciclos y debe tardar 7,5 s
ciclos_A = 15 * 2e9                                   # ciclos = tiempo x frecuencia
ciclos_B = 1.25 * ciclos_A
print("P1 ciclos A =", es(ciclos_A / 1e9, 1), "·10^9; B =", es(ciclos_B / 1e9, 1), "·10^9; F_B =", es(ciclos_B / 7.5 / 1e9, 1), "GHz;",
      "a 4 GHz tardaría", es(ciclos_B / 4e9, 3), "s")

# Problema 2: mismo ISA. A: 2 GHz y CPI 1,5. B: 4 GHz y CPI 2,4. Programa de 10^9 instrucciones
N = 1e9
tA = N * 1.5 / 2e9; tB = N * 2.4 / 4e9                # T = N · CPI / F
print("P2 tA =", es(tA), "s; tB =", es(tB), "s; B es", es(tA / tB), "veces más rápido; B tarda un",
      f"{1 - tB / tA:.0%}", "menos; A tarda un", f"{tA / tB - 1:.0%}", "más")

# Problema 3: 4 GHz, clases A, B y C con CPI 1, 2 y 4; dos compiladores (instrucciones en miles de millones)
CPI = (1, 2, 4)
for nombre, cuenta in (("compilador 1", (4, 2, 2)), ("compilador 2", (12, 2, 1))):
    n = sum(cuenta); c = sum(k * x for k, x in zip(CPI, cuenta))
    t = c * 1e9 / 4e9
    print("P3", nombre, ": N =", n, "·10^9; ciclos =", c, "·10^9; CPI =", es(c / n), "; T =", es(t), "s; MIPS =", round(n * 1e9 / (t * 1e6)))

# Problema 4: el inventario tarda 60 s y 40 s son el cálculo de los precios
print("P4 a) mejorar el cálculo x4:", es(amdahl(60, 40, 4), 1), "s, G =", es(60 / amdahl(60, 40, 4)))
objetivo = 60 / 2.5                                   # 2,5 veces más rápido -> 24 s
print("   b) para G = 2,5 hacen falta", es(objetivo, 1), "s: el cálculo debe bajar a", es(objetivo - 20, 1), "s -> S =", es(40 / (objetivo - 20), 1))
print("   c) límite con el cálculo instantáneo: G =", es(60 / 20), "(G = 3 no se alcanza nunca)")

# Problema 5: el cierre de toda la cadena, el 80 % se reparte entre P procesadores
for P in (4, 16, 64):
    print(f"P5 P = {P:2}: G = {es(1 / (0.2 + 0.8 / P))}")
print("   límite:", es(1 / 0.2), "; con P = 16 y la parte serie x2:", es(1 / (0.1 + 0.8 / 16)),
      "; con P = 16 y el 90 % repartible:", es(1 / (0.1 + 0.9 / 16)))

# Problema 6 (cuestión tipo examen): benchmark de 120 s: CPU 30, memoria 40, disco 50
print("P6 a) CPU x5:", es(amdahl(120, 30, 5), 1), "s, G =", es(120 / amdahl(120, 30, 5)),
      "| memoria x2:", es(amdahl(120, 40, 2), 1), "s, G =", es(120 / amdahl(120, 40, 2)))
print("   ahorro: CPU", es(30 - 30 / 5, 1), "s; memoria", es(40 - 40 / 2, 1), "s; las dos:", es(120 / (6 + 20 + 50)))
# Pruébalo tú: 100 s: CPU 25, memoria 30, disco 40, otros 5
print("   pruébalo: CPU x5:", es(100 / amdahl(100, 25, 5)), "| disco x2,5:", es(100 / amdahl(100, 40, 2.5)))
