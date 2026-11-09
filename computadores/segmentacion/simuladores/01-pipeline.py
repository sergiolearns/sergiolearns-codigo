# Compruébalo con Python · El pipeline de la caja de la cafetería, con y sin anticipación
# Del artículo «Segmentación del MIPS — teoría con una barra de bocadillos, cinco etapas a la vez y burbujas que nadie pidió (y el «5 veces más rápido» que me tacharon)»
# https://sergiolearns.com/segmentacion/

# Simulador del MIPS segmentado: dibuja el diagrama de varios ciclos y cuenta los ciclos
# de la caja de la cafetería sin anticipación y con anticipación (forwarding).
import re

caja = ["lw  $t0, 0($s0)",      # precio del bocadillo (sale de la memoria)
        "lw  $t1, 4($s0)",      # precio de la bebida
        "add $t2, $t0, $t1",    # total del menú: usa $t1 justo después del lw
        "sub $t3, $t2, $s1",    # menos el descuento: usa $t2 recién calculado
        "sw  $t3, 8($s0)",      # apunta el ticket: usa $t3 recién calculado
        "addi $s2, $s2, 1"]     # un ticket más en el día (no depende de nadie)
# la misma caja con addi subida entre el segundo lw y el add: rellena el hueco del lw
reordenada = caja[:2] + [caja[5]] + caja[2:5]

def regs(ins):                  # (registro que escribe, registros que lee)
    op, r = ins.split()[0], re.findall(r"\$\w+", ins)
    if op == "sw":
        return None, r          # sw no escribe registros: lee el dato y la base
    return r[0], r[1:]          # lw, add, sub: el primero es el destino

def planifica(prog, anticipar):
    filas, IF = [], 1
    for ins in prog:
        ID = IF + 1             # sin riesgos, ID justo después de IF
        dest, lee = regs(ins)
        for r in lee:           # busca la última instrucción anterior que escribe r
            for p in reversed(filas):
                if p["dest"] == r:
                    if not anticipar:   # leer en ID el mismo ciclo del WB (1.ª y 2.ª mitad)
                        ID = max(ID, p["WB"])
                    else:               # el dato está al final de EX (ALU) o de MEM (lw)
                        listo = (p["ID"] + 2 if p["lw"] else p["ID"] + 1) + 1
                        ID = max(ID, listo - 1)   # lo necesito al empezar mi EX
                    break
        filas.append(dict(ins=ins, dest=dest, lw=ins.startswith("lw"), IF=IF, ID=ID, WB=ID + 3))
        IF = ID                 # la siguiente entra en IF cuando esta pasa a ID
    return filas

for titulo, prog, anticipar in (("Sin anticipación", caja, False), ("Con anticipación", caja, True),
                                ("Reordenada, con anticipación", reordenada, True)):
    filas = planifica(prog, anticipar)
    n = filas[-1]["WB"]         # el último WB marca el final
    print(titulo, f"-> {n} ciclos")
    print((" " * 19 + "".join(f"{c:<3}" for c in range(1, n + 1))).rstrip())
    for f in filas:
        celdas = ["  "] * (n + 1)
        celdas[f["IF"]] = "IF"
        for c in range(f["IF"] + 1, f["ID"]):
            celdas[c] = "--"    # burbuja: espera entre IF e ID
        for k, et in enumerate(("ID", "EX", "ME", "WB")):
            celdas[f["ID"] + k] = et
        print(f["ins"].ljust(19) + "".join(f"{x:<3}" for x in celdas[1:]).rstrip())
    print(f"burbujas: {sum(f['ID'] - f['IF'] - 1 for f in filas)}"
          f"  |  ideal: 5 + {len(prog)} - 1 = {4 + len(prog)} ciclos\n")
