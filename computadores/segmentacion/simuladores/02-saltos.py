# Compruébalo con Python · El coste de los saltos en el bucle de los bocadillos
# Del artículo «Segmentación del MIPS — teoría con una barra de bocadillos, cinco etapas a la vez y burbujas que nadie pidió (y el «5 veces más rápido» que me tacharon)»
# https://sergiolearns.com/segmentacion/

# Riesgos de control: cuántos ciclos cuesta el bucle que suma los bocadillos de N pedidos
# si el MIPS segmentado para en cada salto o si predice «no saltar».
bucle = ["lw   $t0, 0($s0)",         # bocadillos de este pedido
         "addi $s0, $s0, 4",         # siguiente pedido
         "addi $s1, $s1, -1",        # pedidos que quedan
         "add  $t1, $t1, $t0",       # total de bocadillos
         "bne  $s1, $zero, bucle"]   # ¿quedan pedidos? (se decide en ID)
fin = ["sw   $t1, 0($s2)"]           # apunta el total

def ciclos(N, estrategia):
    traza = bucle * N + fin          # lo que se ejecuta de verdad, en orden
    IF, perdidos = 1, 0
    for k, ins in enumerate(traza):
        ultimo_IF = IF
        IF += 1                      # sin riesgos, una instrucción nueva por ciclo
        if ins.startswith("bne"):
            salta = k < len(traza) - 2   # salta en todas las vueltas menos la última
            if estrategia == "parar" or salta:
                IF += 1              # un ciclo perdido: burbuja o instrucción tirada
                perdidos += 1
    return ultimo_IF + 4, len(traza), perdidos   # el último sale de WB 4 ciclos después de su IF

for N in (4, 10):
    for e in ("parar", "no saltar"):
        total, n, p = ciclos(N, e)
        print(f"N = {N:2}  {e:9}: {n} instrucciones, {p:2} ciclos perdidos -> {total} ciclos")

# Un programa típico: 1 000 000 de instrucciones, el 20 % son saltos y de ellos salta el 60 %
n, saltos, saltan = 1_000_000, 0.20, 0.60
es = lambda x, d=0: f"{x:,.{d}f}".replace(",", " ").replace(".", ",")   # 1 200 000 y 1,20
print(f"\nparar siempre : {es(n + n * saltos)} ciclos  (CPI {es(1 + saltos, 2)})")
print(f"predecir no   : {es(n + n * saltos * saltan)} ciclos  (CPI {es(1 + saltos * saltan, 2)})")
