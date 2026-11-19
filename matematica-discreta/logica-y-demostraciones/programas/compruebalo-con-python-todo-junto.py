# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Compruébalo con Python: todo junto
# https://sergiolearns.com/logica-y-demostraciones-practica/

from itertools import product

def tabla(variables, formula):
    """formula: texto de Python con and, or, not; para → usa imp(a, b)."""
    imp = lambda a, b: (not a) or b
    col = []
    for vals in product([True, False], repeat=len(variables)):
        entorno = dict(zip(variables, vals), imp=imp)
        v = eval(formula, {}, entorno)
        col.append("V" if v else "F")
        print(" ".join("V" if x else "F" for x in vals), "|", col[-1])
    tipo = ("tautología" if "F" not in col else
            "contradicción" if "V" not in col else "contingencia")
    print("".join(col), "->", tipo)

tabla(["p", "q", "r"], "imp((not p) or q, r == p)")
