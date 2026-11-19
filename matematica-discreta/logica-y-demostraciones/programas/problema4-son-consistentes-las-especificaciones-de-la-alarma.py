# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Problema 4: ¿son consistentes las especificaciones de la alarma?
# https://sergiolearns.com/logica-y-demostraciones-practica/

from itertools import product

def implica(a, b):
    return (not a) or b

buenas = []
for p, q, r, s in product([True, False], repeat=4):     # 2^4 = 16
    e1 = s == (r and (p or q))
    e2 = implica(p, s)
    e3 = r
    e4 = q or not r
    e5 = not s
    if e1 and e2 and e3 and e4 and e5:
        buenas.append((p, q, r, s))
print("situaciones que cumplen las cinco:", len(buenas))

# ¿y si quitamos E4?
sin_e4 = [(p, q, r, s) for p, q, r, s in product([True, False], repeat=4)
          if s == (r and (p or q)) and implica(p, s) and r and not s]
print("sin E4:", sin_e4)
