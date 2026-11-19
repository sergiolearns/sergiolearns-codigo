# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Problema 6: tres demostraciones
# https://sergiolearns.com/logica-y-demostraciones-practica/

# a) para n par, 3n + 2 es par (comprobación en un rango)
print("a)", all((3*n + 2) % 2 == 0 for n in range(-100, 101, 2)))

# b) suma de los n primeros impares frente a n^2
for n in [1, 2, 5, 10, 100]:
    suma = sum(2*i - 1 for i in range(1, n + 1))
    print(f"b) n = {n:3}: suma = {suma:5}, n^2 = {n**2:5}")

# c) buscar contraejemplos de 2^n > n^2
print("c) contraejemplos:", [n for n in range(1, 20) if not 2**n > n**2])
