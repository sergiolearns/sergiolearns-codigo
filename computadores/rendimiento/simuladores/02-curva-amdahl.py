# Compruébalo con Python · La ley de Amdahl: el carro en la caja, la curva y varios procesadores
# Del artículo «Rendimiento del computador — teoría con la caja del supermercado, el CPI medio y la ley de Amdahl (y el portátil de 3 GHz que no iba el doble)»
# https://sergiolearns.com/rendimiento/

# Ley de Amdahl: cuánto gana el total si una parte F del tiempo va S veces más deprisa.
# G = 1 / ((1 - F) + F / S). Con S infinito, el límite es 1 / (1 - F).

def ganancia(F, S):
    return 1 / ((1 - F) + F / S)                      # lo que no mejora + lo que mejora, encogido

def es(x, d=2):
    return f"{x:.{d}f}".replace(".", ",")

# 1) El carro en la caja: 120 s, de los que 60 son pasar artículos por el escáner (F = 0,5)
total, escaner = 120, 60
F = escaner / total
print(f"Carro: {total} s, escáner {escaner} s -> F = {es(F)}")
for S in (1, 2, 4, 10, 100):                          # escáneres cada vez más rápidos
    nuevo = (total - escaner) + escaner / S           # Amdahl con segundos, sin fórmula
    print(f"  escáner x{S:<3}: {es(nuevo, 1):>5} s  G = {es(ganancia(F, S))}")
print(f"  límite (escáner instantáneo): G = {es(1 / (1 - F))}")

# 2) La curva para tres fracciones distintas: lo que importa es F, no S
print("\n   S  " + "".join(f"  F={es(f)}" for f in (0.5, 0.8, 0.95)))
for S in (2, 4, 8, 16, 64):
    print(f"{S:4}  " + "".join(f"  {es(ganancia(f, S)):>6}" for f in (0.5, 0.8, 0.95)))
print("lím. " + "".join(f"  {es(1 / (1 - f)):>6}" for f in (0.5, 0.8, 0.95)))

# 3) Varios procesadores: el 80 % del cierre de caja se reparte, el 20 % no
print("\nProcesadores con F = 0,8 (una # por cada 0,25 de ganancia)")
for P in (1, 2, 4, 16, 64, 1000):
    g = ganancia(0.8, P)
    print(f"{P:5} {es(g):>5} " + "#" * round(g / 0.25))
