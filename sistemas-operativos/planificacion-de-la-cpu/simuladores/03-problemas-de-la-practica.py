# Práctica guiada · Planificador de papel: FCFS, SJF, SRTF y Round Robin con los procesos de los problemas
# Del artículo «Planificación de la CPU — práctica con problemas guiados paso a paso: FCFS frente a SJF, una expulsión en SRTF, la cola de Round Robin y un ejercicio con el formato del examen (y el cuanto que le regalé a quien no tocaba)»
# https://sergiolearns.com/planificacion-de-la-cpu-practica/

# Planificador de la CPU de papel: FCFS, SJF, SRTF y Round Robin con los procesos de la práctica.
# Criterios (los de la teoría): empates por llegada y, si no, por orden de la tabla; SRTF solo expulsa
# si el nuevo es ESTRICTAMENTE más corto; en Round Robin el recién llegado entra en la cola antes
# que el proceso que acaba de agotar su cuanto.
def planifica(procs, alg, q=None):
    rest = {p: r for p, _, r in procs}; lleg = {p: l for p, l, _ in procs}
    orden = [p for p, _, _ in procs]; t, gantt, fin, cola, vistos = 0, [], {}, [], set()
    def llegan(hasta):   # mete en la cola, en orden, los que han llegado hasta ese instante
        for p in orden:
            if p not in vistos and lleg[p] <= hasta: cola.append(p); vistos.add(p)
    llegan(0)
    while len(fin) < len(procs):
        if not cola: t = min(lleg[p] for p in orden if p not in vistos); llegan(t); continue
        if alg in ("SJF", "SRTF"):
            p = min(cola, key=lambda x: (rest[x], lleg[x], orden.index(x)))
        else:
            p = cola[0]                      # FCFS y RR: el primero de la cola
        cola.remove(p)
        if alg == "RR": dur = min(q, rest[p])
        elif alg == "SRTF":                  # corre hasta acabar o hasta que llegue alguien más corto
            dur = rest[p]
            for o in orden:
                if o not in vistos and t < lleg[o] < t + dur and rest[o] < rest[p] - (lleg[o] - t):
                    dur = lleg[o] - t; break
        else: dur = rest[p]
        gantt.append((p, t, t + dur)); t += dur; rest[p] -= dur
        llegan(t)                            # primero los recién llegados...
        if rest[p]: cola.append(p)           # ...y después el que no ha terminado
        else: fin[p] = t
    return gantt, fin

def informe(nombre, procs, alg, q=None):
    g, fin = planifica(procs, alg, q)
    junta = []                               # une tramos seguidos del mismo proceso
    for p, a, b in g:
        if junta and junta[-1][0] == p and junta[-1][2] == a: junta[-1] = (p, junta[-1][1], b)
        else: junta.append((p, a, b))
    print(f"== {nombre}: {alg}" + (f" q={q}" if q else ""))
    print("   Gantt:", " | ".join(f"{p} {a}-{b}" for p, a, b in junta))
    tot = {"ret": 0, "esp": 0, "resp": 0}
    for p, l, r in procs:
        ret = fin[p] - l; esp = ret - r; resp = min(a for x, a, _ in g if x == p) - l
        tot["ret"] += ret; tot["esp"] += esp; tot["resp"] += resp
        print(f"   {p:<9} llega {l:>2}  ráfaga {r:>2}  fin {fin[p]:>2}  retorno {ret:>2}  espera {esp:>2}  respuesta {resp:>2}")
    n = len(procs)
    print(f"   medias: retorno {tot['ret']}/{n} = {tot['ret']/n:.2f}  espera {tot['esp']}/{n} = {tot['esp']/n:.2f}  respuesta {tot['resp']}/{n} = {tot['resp']/n:.2f}")

A = [("zoom", 0, 7), ("git", 2, 3), ("gcc", 3, 5), ("latex", 5, 1)]
B = [("descarga", 0, 6), ("gcc", 1, 3), ("antivirus", 2, 7), ("spotify", 4, 1)]
C = [("zoom", 0, 5), ("gcc", 1, 3), ("spotify", 2, 1), ("latex", 3, 4)]
D = [("P1", 0, 6), ("P2", 1, 4), ("P3", 2, 2), ("P4", 4, 5), ("P5", 6, 1)]
informe("Problema 1", A, "FCFS"); informe("Problema 1", A, "SJF")
informe("Problema 2", B, "SRTF")
informe("Problema 3", C, "RR", 2)
informe("Problema 4", D, "SJF"); informe("Problema 4", D, "RR", 3)
