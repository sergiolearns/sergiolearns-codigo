# SergioLearns · Matemática discreta (MD) · Árboles
# Compruébalo con Python
# https://sergiolearns.com/arboles-matematica-discreta-ejercicios/

import heapq

# Ejercicio 1: fórmulas de los m-arios completos
def m_ario(m, l):
    i = (l - 1) / (m - 1)
    return i, m * i + 1
print("Pádel:", m_ario(2, 24), "· 5-ario:", m_ario(5, 41), "· ternario con 20:", (20 - 1) / 3)

# Ejercicio 2: ABB, recorridos y borrados
def ins(a, x):
    if a is None:
        return [x, None, None]
    k = 1 if x < a[0] else 2
    a[k] = ins(a[k], x)
    return a
def borra(a, x):
    if a is None:
        return None
    if x != a[0]:
        k = 1 if x < a[0] else 2
        a[k] = borra(a[k], x)
        return a
    if a[1] is None or a[2] is None:
        return a[1] if a[2] is None else a[2]
    s = a[2]
    while s[1]:
        s = s[1]
    a[0] = s[0]
    a[2] = borra(a[2], s[0])
    return a
pre = lambda a: [] if a is None else [a[0]] + pre(a[1]) + pre(a[2])
post = lambda a: [] if a is None else post(a[1]) + post(a[2]) + [a[0]]
t = None
for d in [50, 30, 70, 20, 40, 60, 80, 35, 45, 65]:
    t = ins(t, d)
print("Pre:", pre(t))
print("Post:", post(t))
t = borra(borra(t, 30), 60)
print("Pre final:", pre(t))

# Ejercicio 3a: Huffman (el mayor a la izquierda)
f = {"A": 0.35, "B": 0.23, "C": 0.22, "D": 0.12, "E": 0.08}
h = [(p, i, s) for i, (s, p) in enumerate(f.items())]
heapq.heapify(h)
n = len(h)
while len(h) > 1:
    p1, _, t1 = heapq.heappop(h)
    p2, _, t2 = heapq.heappop(h)
    heapq.heappush(h, (p1 + p2, n, (t2, t1)))
    n += 1
cod = {}
def baja(x, c):
    if isinstance(x, str):
        cod[x] = c
    else:
        baja(x[0], c + "0")
        baja(x[1], c + "1")
baja(h[0][2], "")
print(cod, "media:", round(sum(f[s] * len(cod[s]) for s in f), 2))

# Ejercicio 3c: Kruskal con un «quién es tu jefe» para detectar ciclos
aristas = [("A","B",3), ("A","C",1), ("A","D",4), ("B","C",2), ("B","E",6), ("C","D",5), ("C","E",7), ("D","E",8)]
jefe = {v: v for v in "ABCDE"}
def raiz(v):
    while jefe[v] != v:
        v = jefe[v]
    return v
arbol = []
for a, b, w in sorted(aristas, key=lambda e: e[2]):
    if raiz(a) != raiz(b):          # en componentes distintas: no cierra ciclo
        jefe[raiz(a)] = raiz(b)
        arbol.append(a + b)
print("Kruskal:", arbol, "· total:", sum(w for a, b, w in aristas if a + b in arbol))
