# SergioLearns · Matemática discreta (MD) · Árboles
# Compruébalo con Python
# https://sergiolearns.com/arboles-matematica-discreta/

from collections import deque

def es_arbol(vertices, aristas):
    # Árbol = conexo y con n - 1 aristas (las dos juntas implican que no hay ciclos)
    if len(aristas) != len(vertices) - 1:
        return False
    return len(distancias(vertices, aristas, vertices[0])) == len(vertices)

def distancias(vertices, aristas, origen):
    vecinos = {v: [] for v in vertices}
    for a, b in aristas:            # no dirigido: la arista va en los dos sentidos
        vecinos[a].append(b)
        vecinos[b].append(a)
    dist, cola = {origen: 0}, deque([origen])
    while cola:                     # anchura: primero los que están a 1, luego a 2…
        x = cola.popleft()
        for y in vecinos[x]:
            if y not in dist:
                dist[y] = dist[x] + 1
                cola.append(y)
    return dist

V = list("pqrstuv")
E = [("p","q"), ("q","r"), ("r","s"), ("r","t"), ("t","u"), ("u","v")]
print("¿Es árbol?", es_arbol(V, E))
exc = {v: max(distancias(V, E, v).values()) for v in V}
print("Excentricidades:", exc)
print("Centro:", [v for v in V if exc[v] == min(exc.values())])

import heapq

def insertar(arbol, x):
    # Un vértice es [dato, izquierdo, derecho]; None es un hueco
    if arbol is None:
        return [x, None, None]
    if x < arbol[0]:
        arbol[1] = insertar(arbol[1], x)
    else:
        arbol[2] = insertar(arbol[2], x)
    return arbol

def inorden(a):
    return [] if a is None else inorden(a[1]) + [a[0]] + inorden(a[2])

abb = None
for nombre in ["Nacho", "Gara", "Unai", "Bea", "Lola", "Tere", "Yeray", "Ana"]:
    abb = insertar(abb, nombre)
print("Inorden:", inorden(abb))

def huffman(frec):
    # Montículo de (peso, desempate, árbol); un árbol es un símbolo o un par (izq, der)
    m = [(p, i, s) for i, (s, p) in enumerate(frec.items())]
    heapq.heapify(m)
    n = len(m)
    while len(m) > 1:
        p1, _, t1 = heapq.heappop(m)   # el menor
        p2, _, t2 = heapq.heappop(m)   # el segundo menor
        heapq.heappush(m, (round(p1 + p2, 2), n, (t2, t1)))   # el mayor a la izquierda (0)
        n += 1
    codigos = {}
    def baja(t, c):
        if isinstance(t, str):
            codigos[t] = c
        else:
            baja(t[0], c + "0")
            baja(t[1], c + "1")
    baja(m[0][2], "")
    return codigos

frec = {"G": 0.32, "P": 0.21, "F": 0.14, "C": 0.13, "T": 0.12, "X": 0.08}
cod = huffman(frec)
print("Códigos:", cod)
print("Longitud media:", round(sum(frec[s] * len(cod[s]) for s in frec), 2))
