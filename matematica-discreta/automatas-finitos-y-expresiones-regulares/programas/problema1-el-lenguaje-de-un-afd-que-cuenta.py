# SergioLearns · Matemática discreta (MD) · Autómatas finitos y expresiones regulares
# Compruébalo con Python
# https://sergiolearns.com/automatas-finitos-y-expresiones-regulares-practica/

import re

f = {("c0","0"): "c0", ("c0","1"): "c1", ("c1","0"): "c1",
     ("c1","1"): "c2", ("c2","0"): "c2", ("c2","1"): "c0"}

def traza(w):
    q, camino = "c0", ["c0"]
    for a in w:
        q = f[(q, a)]
        camino.append(q)
    return camino

er = re.compile(r"0*(10*10*10*)*")
for w in ["0110", "111", "1011011", ""]:
    c = traza(w)
    print(repr(w), " → ".join(c), "| AFD:", c[-1] == "c0", "| ER:", bool(er.fullmatch(w)))
