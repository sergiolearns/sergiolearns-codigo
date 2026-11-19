# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Problema 2: inclusión-exclusión con una encuesta
# https://sergiolearns.com/conjuntos-y-relaciones-practica/

P, R, G = 28, 22, 15            # pop, rock, reguetón
PR, PG, RG, PRG = 9, 7, 5, 3    # intersecciones
total = 50

union = P + R + G - PR - PG - RG + PRG
print("al menos una:", union, "| ninguna:", total - union)

solo_pop = P - (PR - PRG) - (PG - PRG) - PRG
exactamente_dos = (PR - PRG) + (PG - PRG) + (RG - PRG)
print("solo pop:", solo_pop, "| exactamente dos:", exactamente_dos)
