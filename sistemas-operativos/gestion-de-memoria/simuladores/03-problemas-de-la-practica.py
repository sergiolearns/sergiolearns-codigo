# Práctica guiada · Paginación, segmentación, TLB, tamaño de la tabla y ajustes de los problemas
# Del artículo «Gestión de memoria — práctica con problemas guiados paso a paso: traducir con paginación, segmentación con límites, la TLB y un ejercicio con el formato del examen (y la dirección física que di para un segmento que no existía)»
# https://sergiolearns.com/gestion-de-memoria-practica/

# Gestión de memoria de papel: paginación, segmentación, TLB, tamaño de la tabla y ajustes.
KiB = 1024
def pagina(dl, tam, tabla):
    p, d = divmod(dl, tam)                    # página = cociente, desplazamiento = resto
    return p, d, tabla[p] * tam + d
print("paginación 2 KiB, 5000:", pagina(5000, 2 * KiB, {0: 3, 1: 11, 2: 7, 3: 4}))
p, d, f = pagina(0x1A3C, 4 * KiB, {0: 0x2, 1: 0x5})
print(f"paginación 4 KiB, 0x1A3C: página {p}, desplazamiento {d:#05x}, física {f:#06x}")

segs = {0: (1400, 1000), 1: (6300, 400), 2: (4300, 1100)}   # segmento: (base, límite)
for s, d in ((0, 430), (1, 400), (2, 1099)):
    base, lim = segs[s]
    print(f"segmento ⟨{s}, {d}⟩:", base + d if d < lim else "excepción (desplazamiento >= límite)")

T, M = 5, 80                                   # ns de la TLB y de la RAM
for h in (0.9, 0.98):
    print(f"TLB h={h}: {h * (T + M) + (1 - h) * (T + 2 * M):.1f} ns")
print(f"sin TLB: {2 * M} ns; dos niveles, h=0.9: {0.9 * (T + M) + 0.1 * (T + 3 * M):.1f} ns")

bits, pag, ent = 32, 8 * KiB, 4
n = 2 ** (bits - pag.bit_length() + 1)         # entradas = 2^(bits de dirección - bits de desplazamiento)
print(f"tabla: 2^{bits - pag.bit_length() + 1} = {n} entradas x {ent} B = {n * ent // (1024 * 1024)} MiB")

def ajuste(huecos, procs, regla):
    h, out = list(huecos), []
    for nom, t in procs:
        ok = [i for i, x in enumerate(h) if x >= t]
        if not ok: out.append(f"{nom}: espera"); continue
        i = {"primer": ok[0], "mejor": min(ok, key=lambda i: h[i]), "peor": max(ok, key=lambda i: h[i])}[regla]
        out.append(f"{nom}->{huecos[i]}"); h[i] -= t
    return out, h
for regla in ("primer", "mejor", "peor"):
    print(regla, *ajuste([150, 400, 220, 500, 120], [("A", 180), ("B", 350), ("C", 90), ("D", 420)], regla))
