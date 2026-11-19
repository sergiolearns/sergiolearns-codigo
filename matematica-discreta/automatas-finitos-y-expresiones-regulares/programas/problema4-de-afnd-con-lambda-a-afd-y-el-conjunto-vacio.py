# SergioLearns · Matemática discreta (MD) · Autómatas finitos y expresiones regulares
# Compruébalo con Python
# https://sergiolearns.com/automatas-finitos-y-expresiones-regulares-practica/

g = {("t0","0"): {"t0"}, ("t0","λ"): {"t1"}, ("t1","1"): {"t2"},
     ("t2","0"): {"t1"}, ("t2","λ"): {"t3"}, ("t3","1"): {"t3"}}

def cierre(S):
    S, pila = set(S), list(S)
    while pila:
        for r in g.get((pila.pop(), "λ"), set()):
            if r not in S:
                S.add(r)
                pila.append(r)
    return frozenset(S)

for q in ["t0", "t1", "t2", "t3"]:
    print("λ-cierre", q, sorted(cierre({q})))

ini = cierre({"t0"})
estados, tabla = [ini], {}
for C in estados:
    for a in "01":
        D = cierre(set().union(*[g.get((q, a), set()) for q in C]))
        tabla[(C, a)] = D
        if D not in estados:
            estados.append(D)
print(len(estados), "estados:", [sorted(C) for C in estados])

def afd(w):
    C = ini
    for a in w:
        C = tabla[(C, a)]
    return "t3" in C
print([(w, afd(w)) for w in ["001", "1011", "10"]])
