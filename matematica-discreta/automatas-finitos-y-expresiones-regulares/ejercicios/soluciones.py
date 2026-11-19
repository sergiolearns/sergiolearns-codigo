# SergioLearns · Matemática discreta (MD) · Autómatas finitos y expresiones regulares
# Compruébalo con Python
# https://sergiolearns.com/automatas-finitos-y-expresiones-regulares-ejercicios/

from itertools import product

def cierre(n, S):
    S, pila = set(S), list(S)
    while pila:
        for r in n.get((pila.pop(), "λ"), set()):
            if r not in S:
                S.add(r)
                pila.append(r)
    return frozenset(S)

def subconjuntos(n, q0):
    ini = cierre(n, {q0})
    est, tab = [ini], {}
    for C in est:
        for a in "01":
            D = cierre(n, set().union(*[n.get((q, a), set()) for q in C]))
            tab[(C, a)] = D
            if D not in est:
                est.append(D)
    return est, tab

def acepta(tab, ini, final, w):
    C = ini
    for a in w:
        C = tab[(C, a)]
    return final in C

# Ejercicio 1: AFD de cinco estados (u4 es inaccesible)
f = {("u0","0"):"u1", ("u0","1"):"u0", ("u1","0"):"u1", ("u1","1"):"u2", ("u2","0"):"u1",
     ("u2","1"):"u3", ("u3","0"):"u3", ("u3","1"):"u3", ("u4","0"):"u2", ("u4","1"):"u4"}
def afd(w):
    q = "u0"
    for a in w:
        q = f[(q, a)]
    return q == "u2"
alcanzables, pila = {"u0"}, ["u0"]
while pila:
    q = pila.pop()
    for a in "01":
        if f[(q, a)] not in alcanzables:
            alcanzables.add(f[(q, a)])
            pila.append(f[(q, a)])
print("Ej. 1:", [(w, afd(w)) for w in ["1101", "0010", "01011"]], "· accesibles:", sorted(alcanzables))

# Ejercicio 2: AFND con λ
n2 = {("k0","0"): {"k0","k1"}, ("k0","λ"): {"k2"}, ("k1","1"): {"k3"}, ("k2","1"): {"k2"}, ("k2","0"): {"k3"}}
e2, t2 = subconjuntos(n2, "k0")
print("Ej. 2:", [sorted(C) for C in e2])
print("       ", [(w, acepta(t2, e2[0], "k3", w)) for w in ["1", "00", "0011"]])

# Ejercicio 3: termina en 011
n3 = {("z0","0"): {"z0","z1"}, ("z0","1"): {"z0"}, ("z1","1"): {"z2"}, ("z2","1"): {"z3"}}
e3, t3 = subconjuntos(n3, "z0")
print("Ej. 3:", [sorted(C) for C in e3])
todas = ["".join(p) for k in range(8) for p in product("01", repeat=k)]
print("        ¿igual que «termina en 011»?", all(acepta(t3, e3[0], "z3", w) == w.endswith("011") for w in todas))
