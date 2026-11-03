# Práctica guiada · Todos los intercalados de dos ventas y la traza de un semáforo con su cola
# Del artículo «Concurrencia y sincronización — práctica con problemas guiados paso a paso: una condición de carrera, un semáforo con su cola, el búfer finito y un ejercicio con el formato del examen (y la venta que juré que no se podía perder)»
# https://sergiolearns.com/concurrencia-y-sincronizacion-practica/

# Concurrencia de papel: todos los intercalados de dos hilos que venden una entrada cada uno,
# y la traza de un semáforo con su cola de bloqueados.
from itertools import combinations

# Cada hilo hace plazas = plazas - 1 en tres pasos: leer en su registro, restar y escribir.
def ejecuta(orden):                       # orden = lista de "A"/"B": quién da el siguiente paso
    plazas, reg, paso = 5, {"A": None, "B": None}, {"A": 0, "B": 0}
    for h in orden:
        if paso[h] == 0: reg[h] = plazas          # leer
        elif paso[h] == 1: reg[h] = reg[h] - 1    # restar (en su registro)
        else: plazas = reg[h]                     # escribir
        paso[h] += 1
    return plazas

finales = {}
for pos in combinations(range(6), 3):     # en qué 3 de los 6 pasos actúa A
    orden = ["A" if i in pos else "B" for i in range(6)]
    finales.setdefault(ejecuta(orden), []).append("".join(orden))
for v, ords in sorted(finales.items()):
    print(f"plazas finales {v}: {len(ords)} intercalados, por ejemplo {ords[0]}")
print("total de intercalados:", sum(len(o) for o in finales.values()))

# Semáforo S = 1 usado como mutex por tres procesos, con la definición de la teoría:
# wait() resta si S > 0 y, si no, bloquea; signal() despierta al primero de la cola y, si no hay nadie, suma.
S, cola, dentro = 1, [], []
pasos = [("P1", "wait"), ("P2", "wait"), ("P3", "wait"), ("P1", "signal"), ("P2", "signal"), ("P3", "signal")]
print("\npaso  operación      S  dentro  bloqueados")
for i, (p, op) in enumerate(pasos, 1):
    if op == "wait":
        if S > 0: S -= 1; dentro.append(p)    # hay permiso: lo coge y entra
        else: cola.append(p)                  # no hay: se bloquea en la cola del semáforo
    else:
        dentro.remove(p)
        if cola: dentro.append(cola.pop(0))   # le pasa el permiso al primero que espera (S no cambia)
        else: S += 1                          # nadie espera: el permiso vuelve al semáforo
    print(f"{i:>4}  {p} {op:<7}  {S:>3}  {', '.join(dentro) or '-':>6}  {', '.join(cola) or '-'}")

# Productor-consumidor con un búfer de 2 huecos: vacios = 2, llenos = 0 (mutex aparte, siempre libre aquí)
vacios, llenos, bufer, bloq = 2, 0, 0, []
ops = ["prod", "prod", "prod", "cons", "cons", "cons", "cons"]
print("\noperación  vacios  llenos  búfer  qué pasa")
for op in ops:
    if op == "prod":
        if vacios > 0: vacios -= 1; bufer += 1; llenos += 1; que = "deja un elemento"
        else: bloq.append("prod"); que = "se bloquea en wait(vacios)"
    else:
        if llenos > 0:
            llenos -= 1; bufer -= 1; que = "coge un elemento"
            if bloq: bloq.pop(0); bufer += 1; llenos += 1; que += " y despierta al productor, que deja el suyo"
            else: vacios += 1
        else: bloq.append("cons"); que = "se bloquea en wait(llenos)"
    print(f"{op:<9}  {vacios:>6}  {llenos:>6}  {bufer:>5}  {que}")
