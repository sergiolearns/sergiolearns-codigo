# SergioLearns · Matemática discreta (MD) · Árboles
# Compruébalo con Python
# https://sergiolearns.com/arboles-matematica-discreta-practica/

import heapq

def huffman(frec):
    m = [(p, i, s) for i, (s, p) in enumerate(frec.items())]
    heapq.heapify(m)
    n = len(m)
    while len(m) > 1:
        p1, _, t1 = heapq.heappop(m)
        p2, _, t2 = heapq.heappop(m)
        print("Uno", t2, "y", t1, "->", p1 + p2)
        heapq.heappush(m, (p1 + p2, n, (t2, t1)))   # el mayor a la izquierda
        n += 1
    cod = {}
    def baja(t, c):
        if isinstance(t, str):
            cod[t] = c
        else:
            baja(t[0], c + "0")
            baja(t[1], c + "1")
    baja(m[0][2], "")
    return cod

def es_prefijo(cod):
    # ¿Algún código es el principio de otro distinto?
    cs = list(cod.values())
    return not any(a != b and b.startswith(a) for a in cs for b in cs)

f = {"a": 12, "e": 9, "o": 8, "s": 5, "r": 4, "n": 2}
c = huffman(f)
print(c)
print("Bits:", sum(f[x] * len(c[x]) for x in f), "· media:", sum(f[x] * len(c[x]) for x in f) / 40)
print(es_prefijo({"a": "1", "e": "01", "o": "001", "s": "0001"}), es_prefijo({"a": "0", "e": "01", "o": "11"}))
