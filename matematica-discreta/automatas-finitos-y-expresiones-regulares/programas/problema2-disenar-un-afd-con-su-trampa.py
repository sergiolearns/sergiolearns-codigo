# SergioLearns · Matemática discreta (MD) · Autómatas finitos y expresiones regulares
# Compruébalo con Python
# https://sergiolearns.com/automatas-finitos-y-expresiones-regulares-practica/

f = {("n0","0"): "n0", ("n0","1"): "n1", ("n1","0"): "n0",
     ("n1","1"): "T", ("T","0"): "T", ("T","1"): "T"}

def acepta(w, finales):
    q = "n0"
    for a in w:
        q = f[(q, a)]
    return q in finales

from itertools import product
cadenas = ["".join(p) for n in range(5) for p in product("01", repeat=n)]
# Comprobación exhaustiva hasta longitud 4: el AFD dice lo mismo que «"11" not in w»
print(all(acepta(w, {"n0","n1"}) == ("11" not in w) for w in cadenas), len(cadenas), "cadenas")
print(acepta("10010", {"n0","n1"}), acepta("0110", {"n0","n1"}), acepta("0110", {"T"}))
