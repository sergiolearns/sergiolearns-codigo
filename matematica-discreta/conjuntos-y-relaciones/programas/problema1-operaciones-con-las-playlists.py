# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Problema 1: operaciones con las playlists
# https://sergiolearns.com/conjuntos-y-relaciones-practica/

U = {"Brisa", "Faro", "Lava", "Nube", "Ola", "Pico", "Roca", "Sal"}
S = {"Brisa", "Faro", "Lava", "Nube"}
L = {"Faro", "Nube", "Ola", "Pico"}
D = {"Lava", "Nube", "Pico", "Roca"}

print("a)", sorted((S | L) - D))
print("b)", sorted(S & (L | D)))
print("c)", sorted(U - (S & L)))        # complementario = U menos el conjunto
print("d)", sorted(S ^ D))
print("De Morgan:", U - (S & L) == (U - S) | (U - L))
print("identidad:", (S & L) | (S & (U - L)) == S)
