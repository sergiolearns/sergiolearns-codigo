# SergioLearns · Matemática discreta (MD) · Combinatoria y probabilidad discreta
# Problema 3: en fila para la foto y las letras de TABLERO
# https://sergiolearns.com/combinatoria-y-probabilidad-discreta-practica/

from itertools import permutations

amigos = ["Marta", "Dani", "Iván", "Noe", "Ayoze", "Sergio"]
filas = list(permutations(amigos))
juntos = sum(1 for f in filas if abs(f.index("Marta") - f.index("Dani")) == 1)
print("Filas:", len(filas), "· juntos:", juntos, "· separados:", len(filas) - juntos)

palabras = ["".join(p) for p in permutations("TABLERO")]
print("Con BLE:", sum("BLE" in p for p in palabras))
print("Con BLE y RO:", sum("BLE" in p and "RO" in p for p in palabras))

print("PARCHISA:", len(set(permutations("PARCHISA"))))
