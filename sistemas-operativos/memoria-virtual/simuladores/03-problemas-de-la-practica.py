# Práctica guiada · FIFO, LRU y óptimo con su traza de marcos y el tiempo efectivo de acceso
# Del artículo «Memoria virtual — práctica con problemas guiados paso a paso: FIFO con su cola, LRU frente al óptimo, lo que cuesta un fallo y un ejercicio con el formato del examen (y la víctima de LRU que elegí mirando el futuro)»
# https://sergiolearns.com/memoria-virtual-practica/

# Memoria virtual de papel: FIFO, LRU y óptimo con traza de marcos, y tiempo efectivo de acceso.
def reemplazo(cad, nmarcos, alg):
    marcos, fallos, filas = [], 0, []
    for i, p in enumerate(cad):
        if p in marcos:
            filas.append((p, list(marcos), "acierto", "")); 
            if alg == "LRU": marcos.remove(p); marcos.append(p)      # LRU: pasa a ser el más reciente
            continue
        fallos += 1; vict = ""
        if len(marcos) == nmarcos:
            if alg == "OPT":                  # el que se va a usar más tarde (o nunca)
                fut = cad[i + 1:]
                vict = max(marcos, key=lambda m: fut.index(m) if m in fut else len(fut) + 1)
            else: vict = marcos[0]            # FIFO: el más antiguo; LRU: el menos reciente
            marcos.remove(vict)
        marcos.append(p); filas.append((p, list(marcos), "fallo", vict))
    return fallos, filas

cad = [1, 4, 5, 3, 1, 4, 2, 1, 4, 5, 1, 4]
for alg in ("FIFO", "LRU", "OPT"):
    f, filas = reemplazo(cad, 3, alg)
    print(f"{alg}: {f} fallos, {len(cad) - f} aciertos; víctimas:", " ".join(str(v) for _, _, e, v in filas if v != ""))
    if alg in ("FIFO", "LRU"):
        for p, m, e, v in filas: print(f"   pide {p}: marcos {m}  {e}{' (sale ' + str(v) + ')' if v != '' else ''}")
ex = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3]
for alg in ("FIFO", "LRU"):
    f, _ = reemplazo(ex, 3, alg); print(f"examen {alg}: {f} fallos, tasa {f}/{len(ex)} = {f / len(ex):.2%}")
for m in (3, 4):
    print(f"FIFO con {m} marcos:", reemplazo(cad, m, "FIFO")[0], "fallos")
acc, serv = 100, 8_000_000                     # ns: acceso a memoria y servicio del fallo (8 ms)
for p in (0.001, 0.00001):
    print(f"TEA p={p}: {(1 - p) * acc + p * serv:.1f} ns")
print("p máxima para no pasar de 110 ns:", (110 - acc) / (serv - acc))
