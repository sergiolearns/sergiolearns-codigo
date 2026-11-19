# SergioLearns · Matemática discreta (MD) · Árboles
# Compruébalo con Python
# https://sergiolearns.com/arboles-matematica-discreta-practica/

# Un árbol de expresión como tuplas (operador, izquierdo, derecho); las hojas son cadenas
arbol = ("-", ("*", ("^", ("-", "x", "4"), "2"), ("+", "5", ("/", "y", "3"))), ("*", "2", "z"))

def codigos(t, camino="", out=None):
    out = {} if out is None else out
    if isinstance(t, str):
        out[t] = camino               # una hoja: su código es el camino
    else:
        codigos(t[1], camino + "0", out)
        codigos(t[2], camino + "1", out)
    return out

c = codigos(arbol)
print({h: c[h] for h in "xyz"})
