# Práctica guiada · Las cuentas de los seis problemas
# Del artículo «Segmentación del MIPS — práctica guiada con diagramas de varios ciclos, burbujas, anticipación y saltos (y los 25 ciclos que nunca existieron)»
# https://sergiolearns.com/segmentacion-practica/

# Comprueba las cuentas de los seis problemas guiados de la práctica de segmentación:
# tiempos y ganancia, diagramas, riesgos de datos, reordenar, saltos y excepciones y la cuestión tipo examen.
import re

def regs(ins):                       # (destino, fuentes, es_lw, es_salto)
    op, r = ins.split()[0], [x for x in re.findall(r"\$\w+", ins)]
    if op in ("sw", "beq", "bne"):
        dest, src = None, r[:2]      # no escriben registros
    else:
        dest, src = r[0], r[1:]
    src = [x for x in src if x != "$zero"]
    return dest, src, op == "lw", op in ("beq", "bne")

def planifica(prog, anticipar=True, saltos="no saltar", saltan=()):
    """prog: traza de lo que se ejecuta. saltan: posiciones de los saltos que saltan."""
    filas, IF = [], 1
    for k, ins in enumerate(prog):
        dest, src, lw, salto = regs(ins)
        ID, de = IF + 1, []
        for r in src:
            for p in reversed(filas):
                if p["dest"] == r:
                    if not anticipar:
                        ID = max(ID, p["WB"])                 # leer en ID el ciclo del WB
                    else:
                        listo = (p["ID"] + 2 if p["lw"] else p["ID"] + 1) + 1
                        ID = max(ID, listo if salto else listo - 1)   # el salto compara en ID
                    de.append((r, p))
                    break
        uso = ID if salto else ID + 1                         # ciclo en que necesita el dato
        caminos = []
        for r, p in de:
            if not anticipar or ID >= p["WB"]:
                caminos.append(f"{r} del banco")
            elif uso == p["ID"] + 2:
                caminos.append(f"{r} de EX/MEM")
            else:
                caminos.append(f"{r} de MEM/WB")
        filas.append(dict(ins=ins, dest=dest, lw=lw, IF=IF, ID=ID, WB=ID + 3, caminos=caminos, tirada=False))
        IF = ID
        if salto and (saltos == "parar" or k in saltan):
            IF += 1                                           # un ciclo perdido
            if saltos != "parar":
                filas.append(dict(ins="(buscada y tirada)", dest=None, lw=False, IF=ID, ID=None, WB=0, caminos=[], tirada=True))
    return filas

def dibuja(filas, ancho=24):
    n = max(f["WB"] for f in filas)
    print((" " * ancho + "".join(f"{c:<3}" for c in range(1, n + 1))).rstrip())
    for f in filas:
        c = ["  "] * (n + 1)
        c[f["IF"]] = "IF"
        if f["tirada"]:
            c[f["IF"] + 1] = "xx"
        else:
            for x in range(f["IF"] + 1, f["ID"]):
                c[x] = "--"
            for k, et in enumerate(("ID", "EX", "ME", "WB")):
                c[f["ID"] + k] = et
        extra = ("   <- " + ", ".join(f["caminos"])) if f["caminos"] else ""
        print(f["ins"].ljust(ancho) + "".join(f"{x:<3}" for x in c[1:]).rstrip() + extra)
    burbujas = sum(f["ID"] - f["IF"] - 1 for f in filas if not f["tirada"])
    print(f"-> {n} ciclos (burbujas de datos: {burbujas})\n")
    return n

es = lambda x, d=2: f"{x:.{d}f}".replace(".", ",")

print("== Problema 1: monociclo frente a segmentado")
for etapas, n in (((250, 150, 200, 300, 100), 6), ((200, 100, 250, 250, 100), 10)):
    mono, seg = sum(etapas), max(etapas)                      # lw usa las 5 etapas
    t_mono, t_seg = n * mono, (5 + n - 1) * seg
    print(f"etapas {etapas}: ciclo monociclo {mono} ps, segmentado {seg} ps")
    print(f"  {n} instrucciones: {t_mono} ps frente a {t_seg} ps -> ganancia {es(t_mono / t_seg)}")
    print(f"  muchas instrucciones: ganancia -> {es(mono / seg)}; latencia de una: {5 * seg} ps\n")

print("== Problema 2: qué hay en cada etapa")
p2 = ["lw   $t0, 0($s0)", "addi $t1, $s1, 2", "sub  $t2, $s2, $s3", "sw   $s4, 8($s0)", "or   $t5, $s5, $s6"]
f2 = planifica(p2)
dibuja(f2)
for ciclo in (4, 5):
    etapa = []
    for k, et in enumerate(("IF", "ID", "EX", "MEM", "WB")):
        for f in f2:
            if (f["IF"] if k == 0 else f["ID"] + k - 1) == ciclo:
                etapa.append(f"{et} {f['ins'].split()[0]}")
    print(f"ciclo {ciclo}:", " | ".join(etapa))
print()

print("== Problema 3: riesgos de datos")
p3 = ["lw   $t0, 0($s0)", "sub  $t1, $s1, $s2", "add  $t2, $t0, $t1", "sw   $t2, 4($s0)",
      "lw   $t3, 8($s0)", "or   $t4, $t3, $t2"]
print("sin anticipación:"); dibuja(planifica(p3, anticipar=False))
print("con anticipación:"); dibuja(planifica(p3))

print("== Problema 4: reordenar para quitar paradas")
p4 = ["lw   $t0, 0($s0)", "add  $t0, $t0, $s3", "lw   $t1, 4($s0)", "add  $t2, $t0, $t1",
      "sw   $t2, 8($s0)", "addi $s0, $s0, 12", "addi $s4, $s4, 1"]
p4r = ["lw   $t0, 0($s0)", "lw   $t1, 4($s0)", "addi $s4, $s4, 1", "add  $t0, $t0, $s3",
       "add  $t2, $t0, $t1", "sw   $t2, 8($s0)", "addi $s0, $s0, 12"]
print("original:"); dibuja(planifica(p4))
print("reordenado:"); dibuja(planifica(p4r))

print("== Problema 5: saltos y excepciones")
def bucle(pedidos):                                          # traza del bucle y saltos que saltan
    traza, saltan = [], set()
    for i, b in enumerate(pedidos):
        traza += ["lw   $t0, 0($s0)", "addi $s0, $s0, 4", "addi $s1, $s1, -1", "beq  $t0, $zero, sigue"]
        if b == 0:
            saltan.add(len(traza) - 1)                        # pedido anulado: beq salta
        else:
            traza += ["addi $t1, $t1, 1"]                     # un pedido con bocadillos más
        traza += ["bne  $s1, $zero, bucle"]
        if i < len(pedidos) - 1:
            saltan.add(len(traza) - 1)                        # vuelve al bucle
    return traza + ["sw   $t1, 0($s2)"], saltan

for pedidos in ([3, 0, 2, 1], [0, 0, 4, 2]):
    traza, saltan = bucle(pedidos)
    print(f"pedidos {pedidos}: {len(traza)} instrucciones ejecutadas, {sum(t.startswith('b') for t in traza)} saltos,"
          f" saltan {len(saltan)}; ideal (sin riesgos): {5 + len(traza) - 1} ciclos")
    for s in ("parar", "no saltar"):
        f5 = planifica(traza, saltos=s, saltan=saltan)
        print(f"  {s:9}: {max(f['WB'] for f in f5)} ciclos")
traza, saltan = bucle([3, 0, 2, 1])
print("\nprimeras dos vueltas con «no saltar»:")
f5 = planifica(traza[:12], saltan={x for x in saltan if x < 12})
dibuja(f5)
lw3 = f5[-1]                                                  # el lw de la vuelta 3
mem = lw3["ID"] + 2
print(f"el lw de la vuelta 3 está en MEM en el ciclo {mem}: detrás van addi $s0 (EX), addi $s1 (ID) y beq (IF);"
      f" se tiran y la rutina entra en IF en el ciclo {mem + 1}\n")

caja = ["lw   $t0, 0($s0)", "lw   $t1, 4($s0)", "add  $t2, $t0, $t1", "sub  $t3, $t2, $s1", "sw   $t3, 8($s0)",
        "addi $s2, $s2, 1"]
fc = planifica(caja)
sub = fc[3]
print(f"excepción en el EX de sub (ciclo {sub['ID'] + 1}): se tiran", [f["ins"] for f in fc
      if f["IF"] <= sub["ID"] + 1 and fc.index(f) > 3], f"-> la rutina entra en IF en el ciclo {sub['ID'] + 2};",
      f"EPC = 0x{0x00400000 + 4 * 3:08X}\n")

print("== Problema 6: la cuestión tipo examen")
for nombre, q, qr in (("cuestión", ["lw   $t0, 0($s0)", "lw   $t1, 4($s0)", "add  $t2, $t0, $t1", "addi $s1, $s1, 1",
                                  "sw   $t2, 8($s0)", "slt  $t3, $t2, $s2", "bne  $t3, $zero, aviso"],
                                 ["lw   $t0, 0($s0)", "lw   $t1, 4($s0)", "addi $s1, $s1, 1", "add  $t2, $t0, $t1",
                                  "slt  $t3, $t2, $s2", "sw   $t2, 8($s0)", "bne  $t3, $zero, aviso"]),
                      ("pruébalo tú", ["lw   $t0, 0($s0)", "addi $t1, $t0, 5", "lw   $t2, 4($s0)", "sub  $t3, $t2, $t1",
                                       "sw   $t3, 8($s0)", "beq  $t3, $zero, vacio"],
                                      ["lw   $t0, 0($s0)", "lw   $t2, 4($s0)", "addi $t1, $t0, 5",
                                       "sub  $t3, $t2, $t1", "sw   $t3, 8($s0)", "beq  $t3, $zero, vacio"])):
    print(f"--- {nombre}: a) sin anticipación"); a = dibuja(planifica(q, anticipar=False))
    print(f"--- {nombre}: b) con anticipación"); b = dibuja(planifica(q))
    print(f"--- {nombre}: c) reordenado"); c = dibuja(planifica(qr))
    mono = len(q) * 800
    print(f"d) monociclo {len(q)} x 800 = {mono} ps; segmentado b) {b} x 200 = {b * 200} ps -> {es(mono / (b * 200))};"
          f" c) {c} x 200 = {c * 200} ps -> {es(mono / (c * 200))}\n")
