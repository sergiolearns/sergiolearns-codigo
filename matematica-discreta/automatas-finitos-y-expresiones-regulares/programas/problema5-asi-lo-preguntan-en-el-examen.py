# SergioLearns · Matemática discreta (MD) · Autómatas finitos y expresiones regulares
# Compruébalo con Python
# https://sergiolearns.com/automatas-finitos-y-expresiones-regulares-practica/

import re
from itertools import product

f = {("A","0"): "B", ("A","1"): "C", ("B","1"): "C", ("C","0"): "B"}   # lo que falta, a la trampa

def afd(w):
    q = "A"
    for a in w:
        q = f.get((q, a))        # None = trampa
        if q is None:
            return False
    return q == "C"

opciones = {"a": r"(1|01)(01)*", "b": r"(01)*1", "c": r"1(01)*|(01)*", "d": r"(0|1)(01)*"}
cadenas = ["".join(p) for n in range(7) for p in product("01", repeat=n)]
for k, er in opciones.items():
    fallos = [w for w in cadenas if bool(re.fullmatch(er, w)) != afd(w)]
    print(k, "coincide en todas" if not fallos else "falla en " + repr(fallos[0]))
