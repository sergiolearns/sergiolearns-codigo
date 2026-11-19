# SergioLearns · Matemática discreta (MD) · Autómatas finitos y expresiones regulares
# Compruébalo con Python
# https://sergiolearns.com/automatas-finitos-y-expresiones-regulares/

# AFD de la cerradura: abre si las tres últimas teclas son 1 0 1
f = {("q0","0"): "q0", ("q0","1"): "q1", ("q1","0"): "q2", ("q1","1"): "q1",
     ("q2","0"): "q0", ("q2","1"): "q3", ("q3","0"): "q2", ("q3","1"): "q1"}

def afd_acepta(f, q0, finales, w):
    q = q0
    for a in w:              # un solo camino: un estado por símbolo
        q = f[(q, a)]
    return q in finales

for w in ["1101", "1010", "101101", ""]:
    print(repr(w), afd_acepta(f, "q0", {"q3"}, w))

# AFND con λ: el código (10 y unos) o la llave maestra (uno o más unos)
g = {("r0","λ"): {"a1","b1"}, ("a1","1"): {"a2"}, ("a2","0"): {"a3"},
     ("a3","1"): {"a3"}, ("b1","1"): {"b2"}, ("b2","1"): {"b2"}}

def cierre(g, S):
    S, pila = set(S), list(S)
    while pila:              # añadir lo alcanzable con λ hasta que no salga nada nuevo
        q = pila.pop()
        for r in g.get((q, "λ"), set()):
            if r not in S:
                S.add(r)
                pila.append(r)
    return S

def afnd_acepta(g, q0, finales, w):
    S = cierre(g, {q0})
    for a in w:              # mover todos los activos y volver a cerrar con λ
        S = cierre(g, set().union(*[g.get((q, a), set()) for q in S]))
    return bool(S & finales)

print("λ-cierre(r0):", sorted(cierre(g, {"r0"})))
for w in ["10", "1011", "111", "0", "100"]:
    print(repr(w), afnd_acepta(g, "r0", {"a3","b2"}, w))

import re

n = {("p0","0"): {"p0"}, ("p0","1"): {"p0","p1"}, ("p1","0"): {"p2"}, ("p2","1"): {"p3"}}

def subconjuntos(n, q0, sigma):
    inicio = frozenset({q0})        # sin λ, el cierre de q0 es {q0}
    estados, tabla = [inicio], {}
    for C in estados:               # la lista crece mientras se recorre
        for a in sigma:
            D = frozenset(set().union(*[n.get((q, a), set()) for q in C]))
            tabla[(C, a)] = D
            if D not in estados:
                estados.append(D)
    return estados, tabla

E, t = subconjuntos(n, "p0", "01")
for C in E:
    print(sorted(C), "-> 0:", sorted(t[(C, "0")]), "· 1:", sorted(t[(C, "1")]), "· final" if "p3" in C else "")

er = re.compile(r"[01]*101")        # (0 + 1)*101 con la sintaxis de Python
print([w for w in ["101", "1101", "1010", "0101", "11"] if er.fullmatch(w)])
