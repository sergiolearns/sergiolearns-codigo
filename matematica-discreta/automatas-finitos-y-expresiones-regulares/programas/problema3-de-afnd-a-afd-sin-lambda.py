# SergioLearns · Matemática discreta (MD) · Autómatas finitos y expresiones regulares
# Compruébalo con Python
# https://sergiolearns.com/automatas-finitos-y-expresiones-regulares-practica/

n = {("e0","0"): {"e0"}, ("e0","1"): {"e0","e1"},
     ("e1","0"): {"e2"}, ("e1","1"): {"e2"}}

def mueve(S, a):
    return frozenset(set().union(*[n.get((q, a), set()) for q in S]))

estados, tabla = [frozenset({"e0"})], {}
for C in estados:
    for a in "01":
        tabla[(C, a)] = mueve(C, a)
        if tabla[(C, a)] not in estados:
            estados.append(tabla[(C, a)])
nombre = {C: "ABCD"[i] for i, C in enumerate(estados)}
for C in estados:
    print(nombre[C], sorted(C), "0→" + nombre[tabla[(C, "0")]], "1→" + nombre[tabla[(C, "1")]], "final" if "e2" in C else "")

def afd(w):
    C = estados[0]
    for a in w:
        C = tabla[(C, a)]
    return "e2" in C
print([(w, afd(w)) for w in ["0110", "101", "1", "11", "0010"]])
