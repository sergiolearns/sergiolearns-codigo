# Ejercicios · Las cuentas de las soluciones
# Del artículo «Segmentación del MIPS — ejercicios con tiempos de etapa, burbujas, anticipación y un bucle que reordenar (y el bne que esperaba sin que yo supiera por qué)»
# https://sergiolearns.com/segmentacion-ejercicios/

# Comprueba las soluciones de los ejercicios de segmentación (niveles 1, 2 y 3), los errores de
# «¿Qué falla aquí?» y las cuentas del cuestionario para practicar.
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

print("== Nivel 1: tiempos y ganancia")
etapas, n = (150, 100, 200, 250, 100), 5
mono, seg = sum(etapas), max(etapas)
print(f"ciclo monociclo {mono} ps, segmentado {seg} ps")
print(f"{n} instrucciones: {n * mono} ps frente a {(5 + n - 1) * seg} ps -> ganancia {es(n * mono / ((5 + n - 1) * seg))}")
print(f"muchas instrucciones -> {es(mono / seg)}\n")
n1 = ["add  $t0, $s0, $s1", "lw   $t1, 0($s2)", "sub  $t2, $s3, $s4", "sw   $s5, 4($s2)", "or   $t3, $s6, $s7"]
dibuja(planifica(n1))

print("== Nivel 2: dependencias y anticipación")
n2 = ["lw   $t0, 4($s0)", "lw   $t1, 8($s0)", "sub  $t2, $t1, $t0", "sw   $t2, 12($s0)",
      "add  $t3, $t2, $t1", "and  $t4, $t3, $s3"]
print("sin anticipación:"); dibuja(planifica(n2, anticipar=False))
print("con anticipación:"); dibuja(planifica(n2))

print("== Nivel 3: el bucle de los pedidos pequeños")
cuerpo = ["lw   $t0, 0($s0)", "slt  $t2, $t0, $s3", "add  $t1, $t1, $t2", "addi $s0, $s0, 4",
          "addi $s1, $s1, -1", "bne  $s1, $zero, bucle"]
nuevo = ["lw   $t0, 0($s0)", "addi $s1, $s1, -1", "addi $s0, $s0, 4", "slt  $t2, $t0, $s3",
         "add  $t1, $t1, $t2", "bne  $s1, $zero, bucle"]
for nombre, c in (("original", cuerpo), ("reordenado", nuevo)):
    N = 10
    traza = c * N + ["sw   $t1, 0($s2)"]
    saltan = {6 * k + 5 for k in range(N - 1)}
    for s in ("parar", "no saltar"):
        f = planifica(traza, saltos=s, saltan=saltan)
        t = max(x["WB"] for x in f)
        b = sum(x["ID"] - x["IF"] - 1 for x in f if not x["tirada"])
        print(f"{nombre:10} {s:9}: {len(traza)} instrucciones, burbujas de datos {b}, ciclos {t}")
    if nombre == "original":
        print("una vuelta (con anticipación):"); dibuja(planifica(c))
t_mono = 61 * 800
print(f"monociclo: 61 x 800 = {t_mono} ps; original 94 x 200 = {94 * 200} ps -> {es(t_mono / (94 * 200))};"
      f" reordenado 74 x 200 = {74 * 200} ps -> {es(t_mono / (74 * 200))}\n")

print("== ¿Qué falla aquí?")
etapas = (250, 150, 250, 200, 150)
mono, media, seg = sum(etapas), sum(etapas) / 5, max(etapas)
print(f"1) monociclo {mono} ps; ciclo con la media {media:.0f} ps (mal) o con la más lenta {seg} ps (bien)")
print(f"   6 instrucciones: {6 * mono} ps frente a {(5 + 6 - 1) * media:.0f} ps -> {es(6 * mono / ((5 + 6 - 1) * media))} (mal)"
      f" o {(5 + 6 - 1) * seg} ps -> {es(6 * mono / ((5 + 6 - 1) * seg))} (bien)")
f2 = ["lw   $t2, 12($s0)", "add  $t3, $t2, $s4", "sw   $t3, 16($s0)", "or   $t5, $s5, $s6"]
print("2) con anticipación:"); dibuja(planifica(f2))
f3 = ["lw   $t0, 0($s0)", "lw   $t1, 4($s0)", "addi $s0, $s0, 12", "add  $t2, $t0, $t1", "sw   $t2, -4($s0)"]
print("3) con addi subido y sw corregido:"); dibuja(planifica(f3))
s0 = 0x10010000
print(f"3) $s0 = 0x{s0:08X}: sw $t2, 8($s0) tras sumar 12 escribe en 0x{s0 + 12 + 8:08X}; debía ir a 0x{s0 + 8:08X}"
      f" -> desplazamiento 8 - 12 = {8 - 12}\n")

print("== Cuestionario")
print("2)", sum((200, 100, 200, 200, 100)), "ps y", max((200, 100, 200, 200, 100)), "ps;  3)", 5 + 8 - 1, "ciclos")
for p in (["add  $s0, $t0, $t1", "sub  $t2, $s0, $t3"], ["lw   $s0, 0($t1)", "add  $t2, $s0, $t3"],
          ["lw   $t0, 0($s0)", "add  $t1, $t0, $t0", "sw   $t1, 4($s0)"]):
    a, b = planifica(p, anticipar=False), planifica(p)
    print(" / ".join(x.split()[0] for x in p), f"-> sin: {max(x['WB'] for x in a)} ciclos"
          f" (burbujas: {sum(x['ID'] - x['IF'] - 1 for x in a)}); con: {max(x['WB'] for x in b)} ciclos"
          f" (burbujas: {sum(x['ID'] - x['IF'] - 1 for x in b)})")
saltos, saltan = 0.25, 0.40
print(f"17) CPI parar {es(1 + saltos)}, no saltar {es(1 + saltos * saltan)}")
