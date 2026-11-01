# Comprobación de las cuentas del problema 2 de la práctica y de los niveles 1 y 3 de los ejercicios
# Del artículo «Introducción a los computadores — ejercicios resueltos con cronogramas, una traza con salto, una fila de la foto en 2 bits y un cuestionario para practicar (y los 2,5 GHz que convertí en 2,5 ns)»
# https://sergiolearns.com/introduccion-a-los-computadores-ejercicios/

# Comprobación de las cuentas de la práctica (problema 2) y de los ejercicios (niveles 1 y 3)
from fractions import Fraction as F

def onda(bits):  # cronograma en texto, 4 caracteres por bit
    return "".join("‾‾‾‾" if b == "1" else "____" for b in bits)

print("== Práctica, problema 2")
T = F(250, 10**9)                       # 250 ns
print("f =", 1 / T, "Hz")
print("8 bits:", 8 * T * 10**6, "µs")
bits_foto = 3 * 10**6 * 8               # 3 MB (megabytes decimales) = 24 000 000 bits
print("foto de 3 MB:", bits_foto, "bits ->", float(bits_foto * T), "s")
print("CPU 2,4 GHz -> T =", float(1 / F(24, 10) ), "ns")
A, B = "10110010", "01100110"
print("A     :", onda(A)); print("B     :", onda(B))
print("ciclos con A = B = 1:", [i for i in range(8) if A[i] == B[i] == "1"])
print("flancos de subida A:", sum(a == "0" and b == "1" for a, b in zip("0" + A, A)), " B:", sum(a == "0" and b == "1" for a, b in zip("0" + B, B)))

print("\n== Ejercicios, nivel 1")
T = F(2, 10**7)                         # 0,2 µs
C, D = "011010", "100110"
print("f =", 1 / T, "Hz;  6 bits:", 6 * T * 10**6, "µs")
print("C     :", onda(C)); print("D     :", onda(D))
print("ciclos en que C y D valen lo mismo:", [i for i in range(6) if C[i] == D[i]])

print("\n== Ejercicios, nivel 3")
m = [30, 70, 140, 210, 250, 180, 90, 20]
cod = ["{:02b}".format(v // 64) for v in m]     # 4 niveles de 64 en 64
print("códigos:", " ".join(cod), "->", "".join(cod), len("".join(cod)), "bits")
T = F(5, 10**7)                         # 0,5 µs
print("f =", 1 / T, "Hz;  16 bits:", 16 * T * 10**6, "µs")
for v in [0.3, 2.7, 1.4, 3.1, 0.8, 2.0]:
    print(v, "V ->", "0" if v <= 0.8 else ("1" if v >= 2.0 else "inaceptable"))
