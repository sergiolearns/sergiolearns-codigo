# Referencia independiente en Python (otra forma de programarlo): listas y búsquedas explícitas.
def ref(refs, n, alg):
    marcos = [None]*n; entro = {}; uso = {}; fallos = 0; fotos = []; fuera = []
    for t, p in enumerate(refs):
        if p in marcos:
            uso[p] = t; fuera.append(None)
        else:
            fallos += 1
            if None in marcos:
                i = marcos.index(None); fuera.append(None)
            else:
                if alg == 'fifo': clave = lambda q: entro[q]
                elif alg == 'lru': clave = lambda q: uso[q]
                else:
                    def clave(q):
                        fut = refs[t+1:]
                        return -(fut.index(q) if q in fut else 10**9)
                # mínimo de la clave; empate -> el primero en orden de marcos
                i = min(range(n), key=lambda j: (clave(marcos[j]), j))
                fuera.append(marcos[i])
            marcos[i] = p; entro[p] = t; uso[p] = t
        fotos.append(list(marcos))
    return fallos, fotos, fuera
