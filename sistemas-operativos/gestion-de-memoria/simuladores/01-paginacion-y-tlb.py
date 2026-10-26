# Compruébalo con Python · Simulador 1: traducción de direcciones con paginación y una TLB de 2 entradas (las páginas de gcc en tu portátil)
# Del artículo «Gestión de memoria — teoría con tu portátil repartiendo la RAM entre gcc, spotify, el campus y onedrive (y los 4 KiB que yo creía que eran 4000 bytes)»
# https://sergiolearns.com/gestion-de-memoria/

# Traducción de direcciones con paginación y una TLB de 2 entradas (datos fijos)
PAGINA = 4096                       # páginas de 4 KiB = 2**12 → 12 bits de desplazamiento
TABLA = {0: 5, 1: 9, 2: 2, 3: 12}   # tabla de páginas de gcc: página → marco
T_TLB, T_RAM = 5, 60                # ns: mirar la TLB y un acceso a la RAM
accesos = [0x0004, 0x0FF0, 0x1A2C, 0x1004, 0x0100, 0x3000, 0x3FFC, 0x0200, 0x5008, 0x3010, 0x0008]
tlb = []                            # pares (página, marco); el primero es el menos usado
aciertos = validos = total_ns = 0
print(f'{"lógica":<8}  {"pág":>4}  {"desp":>6}   {"TLB":<9}  {"marco":>5}  {"física":>8}  {"ns":>4}')
for dl in accesos:
    p, d = divmod(dl, PAGINA)       # p = 4 bits altos, d = 12 bits bajos
    marco = next((m for (q, m) in tlb if q == p), None)
    if marco is not None:           # acierto: la TLB ya sabía el marco
        tlb.remove((p, marco)); tlb.append((p, marco))
        estado, ns = 'acierto', T_TLB + T_RAM            # TLB + el dato
        aciertos += 1
    elif p in TABLA:                # fallo: hay que leer la tabla de páginas en la RAM
        marco = TABLA[p]
        estado, ns = 'fallo', T_TLB + T_RAM + T_RAM      # TLB + tabla + el dato
        if len(tlb) == 2:
            tlb.pop(0)              # TLB llena: sale la menos usada (LRU)
        tlb.append((p, marco))
    else:                           # la página no está en la tabla: acceso ilegal
        print(f'0x{dl:04X}    {p:>4}  {d:>6}   {"excepción":<9}  {"-":>5}  {"-":>8}  {"-":>4}')
        continue
    df = marco * PAGINA + d         # el desplazamiento se copia tal cual
    validos += 1; total_ns += ns
    print(f'0x{dl:04X}    {p:>4}  {d:>6}   {estado:<9}  {marco:>5}  {"0x%04X" % df:>8}  {ns:>4}')
h = aciertos / validos
print(f'aciertos de TLB: {aciertos}/{validos} = {h:.0%}')
print(f'tiempo medio medido: {total_ns / validos:.1f} ns')
print(f'fórmula: {h:.2f}·({T_TLB}+{T_RAM}) + {1 - h:.2f}·({T_TLB}+{T_RAM}+{T_RAM}) = {h * 65 + (1 - h) * 125:.1f} ns')
