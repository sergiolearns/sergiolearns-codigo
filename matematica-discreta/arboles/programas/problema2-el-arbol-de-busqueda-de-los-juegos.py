# SergioLearns · Matemática discreta (MD) · Árboles
# Compruébalo con Python
# https://sergiolearns.com/arboles-matematica-discreta-practica/

def insertar(a, x):
    if a is None:
        return [x, None, None]          # [dato, izquierdo, derecho]
    lado = 1 if x < a[0] else 2         # 1 = izquierdo, 2 = derecho
    a[lado] = insertar(a[lado], x)
    return a

def borrar(a, x):
    if a is None:
        return None
    if x < a[0]:
        a[1] = borrar(a[1], x)
    elif x > a[0]:
        a[2] = borrar(a[2], x)
    elif a[1] is None or a[2] is None:  # 0 o 1 hijo: sube el que haya
        return a[1] if a[2] is None else a[2]
    else:                               # dos hijos: el sucesor
        s = a[2]
        while s[1] is not None:         # un paso a la derecha y todo a la izquierda
            s = s[1]
        a[0] = s[0]
        a[2] = borrar(a[2], s[0])
    return a

def altura(a):
    return -1 if a is None else 1 + max(altura(a[1]), altura(a[2]))

def inorden(a):
    return [] if a is None else inorden(a[1]) + [a[0]] + inorden(a[2])

abb = None
for j in ["Mus", "Fifa", "Tetris", "Catan", "Rummikub", "Ajedrez", "Parchís", "Uno"]:
    abb = insertar(abb, j)
print("Altura:", altura(abb))
abb = borrar(abb, "Tetris")
abb = borrar(abb, "Fifa")
print("Raíz:", abb[0], "· hijos:", abb[1][0], "y", abb[2][0])
print("Inorden:", inorden(abb))
