# Compruébalo con Python · Las excepciones del caudalímetro: EPC, Causa y la rutina
# Del artículo «Unidad de control del MIPS — teoría con un túnel de lavado, la tabla de verdad de la ALU y un retrovisor que lo para todo (y el lw que me salió haciendo AND)»
# https://sergiolearns.com/unidad-de-control/

# Excepciones en el MIPS monociclo: qué hace el hardware cuando add se desborda o el código de operación no existe
M = 0xFFFFFFFF
def con_signo(x): return x - (1 << 32) if x & 0x80000000 else x
OPS = {0: 'tipo R', 2: 'j', 4: 'beq', 0x23: 'lw', 0x2B: 'sw'}        # lo que la UC sabe decodificar

def excepcion(pc, causa, cpu, vectorizadas):
    cpu['EPC'], cpu['Causa'] = pc, causa                             # 1) dónde y 2) por qué
    if vectorizadas: return 0x80000000 if causa == 0 else 0x80000180   # una rutina por causa
    return 0x80000180                                                # 3) siempre la misma rutina

def ciclo(pc, w, reg, cpu, vectorizadas=False):
    op, rs, rt, rd = w >> 26, (w >> 21) & 31, (w >> 16) & 31, (w >> 11) & 31
    if op not in OPS:                                                # la UC no reconoce op
        return excepcion(pc, 0, cpu, vectorizadas), 'código de operación no definido'
    if op == 0 and w & 0x3F == 0x20:                                 # add (con signo)
        r = con_signo(reg[rs]) + con_signo(reg[rt])
        if not -2**31 <= r < 2**31:                                  # desbordamiento: NO se escribe rd
            return excepcion(pc, 1, cpu, vectorizadas), 'desbordamiento en add'
        reg[rd] = r & M
    return (pc + 4) & M, 'sin excepción'

for vect in (False, True):
    print('Rutina en una dirección fija' if not vect else 'Interrupciones vectorizadas')
    for pc, w, txt, t3 in [(0x00400044, 0x016C5820, 'add $t3, $t3, $t4', 35880),         # un día normal
                           (0x00400044, 0x016C5820, 'add $t3, $t3, $t4', 2147483600),    # sensor estropeado
                           (0x00400048, 0xFC000000, '(palabra 0xFC000000)', 35880)]:
        reg = [0] * 32; reg[11], reg[12] = t3, 120                     # $t3 = litros del día, $t4 = este lavado
        cpu = {'EPC': None, 'Causa': None}
        sig, que = ciclo(pc, w, reg, cpu, vect)
        print(f'  {pc:08X}  {txt:21s} -> {que}')
        epc = '--------' if cpu['EPC'] is None else f"{cpu['EPC']:08X}"
        causa = '-' if cpu['Causa'] is None else cpu['Causa']
        print(f'      EPC = {epc}   Causa = {causa}   siguiente PC = {sig:08X}   $t3 = {reg[11]}')
