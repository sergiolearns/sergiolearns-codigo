# Práctica guiada · Las cuentas de los seis problemas
# Del artículo «Unidad de control del MIPS — práctica guiada con la caja del túnel de lavado, puertas AND y OR y un caudalímetro que se desborda (y el resultado que juré que se guardaba)»
# https://sergiolearns.com/unidad-de-control-practica/

# Las cuentas de los seis problemas guiados: unidad de control de la ALU, unidad de control principal y excepciones
from itertools import product
def bit(x, i): return (x >> i) & 1
FUNCT = {'add': 0b100000, 'sub': 0b100010, 'and': 0b100100, 'or': 0b100101, 'nor': 0b100111, 'slt': 0b101010}
OPER = {'add': '0010', 'sub': '0110', 'and': '0000', 'or': '0001', 'nor': '1100', 'slt': '0111'}

def tabla_alu(aluop, funct):                         # la especificación de los apuntes (con sus X)
    if aluop == '00': return OPER['add']             # lw y sw: dirección = rs + desplazamiento
    if aluop == '01': return OPER['sub']             # beq: rs - rt
    if aluop == '11': return OPER['slt']             # (solo en la UC ampliada del problema 4)
    for nombre, f in FUNCT.items():
        if f & 0b1111 == funct & 0b1111: return OPER[nombre]   # F5 y F4 son X
    return None

def puertas_alu(a1, a0, funct):                      # problema 2: las ecuaciones sin ALUOp = 11
    f = [bit(funct, i) for i in range(6)]
    return f'{a1 & f[2] & f[1] & f[0]}{a0 | (a1 & f[1])}{(1 - a1) | (1 - f[2])}{a1 & (f[3] | (f[0] & (1 - f[1])))}'

def puertas_alu_11(a1, a0, funct):                   # problema 4: las mismas, retocadas para ALUOp = 11 (slti)
    f = [bit(funct, i) for i in range(6)]
    op3 = a1 & (1 - a0) & f[2] & f[1] & f[0]
    op2 = a0 | (a1 & f[1])
    op1 = (1 - a1) | a0 | (1 - f[2])
    op0 = a1 & (a0 | f[3] | (f[0] & (1 - f[1])))
    return f'{op3}{op2}{op1}{op0}'

# Problema 1: la UC de la ALU para el programa del túnel (ALUOp lo pone la UC principal según op)
ALUOP = {0: '10', 0x23: '00', 0x2B: '00', 4: '01'}
P1 = [(0x8E080024, 'lw   $t0, 36($s0)'), (0x016C6822, 'sub  $t5, $t3, $t4'), (0x01AA7025, 'or   $t6, $t5, $t2'),
      (0x01C07827, 'nor  $t7, $t6, $zero'), (0x0131502A, 'slt  $t2, $t1, $s1'), (0x11400001, 'beq  $t2, $zero, FIN'),
      (0xAE090000, 'sw   $t1, 0($s0)')]
print('Problema 1: ALUOp + funct -> operación de la ALU')
for w, txt in P1:
    aluop, funct = ALUOP[w >> 26], w & 0x3F
    print(f'  {txt:21s} ALUOp = {aluop}  bits 5-0 = {funct:06b}  tabla: {tabla_alu(aluop, funct)}  puertas: {puertas_alu(int(aluop[0]), int(aluop[1]), funct)}')

# Problemas 3 y 4: la UC principal como decodificador (una AND por op) + una OR por señal
def uc_principal(op, ampliada=False):
    es = {n: int(op == c) for n, c in (('R', 0), ('lw', 0x23), ('sw', 0x2B), ('beq', 4), ('j', 2), ('addi', 8), ('slti', 0xA))}
    if not ampliada: es['addi'] = es['slti'] = 0
    return es, dict(RegDst=es['R'], ALUSrc=es['lw'] | es['sw'] | es['addi'] | es['slti'], MemtoReg=es['lw'],
                    RegWrite=es['R'] | es['lw'] | es['addi'] | es['slti'], MemRead=es['lw'], MemWrite=es['sw'],
                    Branch=es['beq'], ALUOp=f"{es['R'] | es['slti']}{es['beq'] | es['slti']}", Jump=es['j'])
print('Problemas 3 y 4: qué AND se enciende y qué señales salen')
for w, txt, amp in ((0xAE090000, 'sw   $t1, 0($s0)', False), (0x0131502A, 'slt  $t2, $t1, $s1', False),
                    (0x2129FFFF, 'addi $t1, $t1, -1', True), (0x292A0064, 'slti $t2, $t1, 100', True), (0x2129FFFF, 'addi $t1, $t1, -1', False)):
    es, s = uc_principal(w >> 26, amp)
    on = [n for n, v in es.items() if v] or ['ninguna']
    print(f'  {txt:21s} op = {w >> 26:06b}  AND encendida: {on[0]:7s} ' + ' '.join(f'{k}={v}' for k, v in s.items()) + ('' if amp else '  (UC sin ampliar)'))

print('Problema 2: ecuaciones frente a la tabla de verdad')
for nombre, ecs, aluops in (('sin 11', puertas_alu, ('00', '01', '10')), ('con 11', puertas_alu_11, ('00', '01', '10', '11'))):
    ok = fallos = 0
    for aluop in aluops:
        filas = range(64) if aluop != '10' else FUNCT.values()      # con 00, 01 y 11 funct puede valer cualquier cosa
        for funct in filas:
            if ecs(int(aluop[0]), int(aluop[1]), funct) == tabla_alu(aluop, funct): ok += 1
            else: fallos += 1
    print(f'  ecuaciones {nombre}: {ok} combinaciones bien, {fallos} mal')
imm = 100 & 0x3F                                     # slti $t2, $t1, 100: los 6 bits bajos del inmediato
print(f'  slti con las ecuaciones viejas: funct = {imm:06b} -> {puertas_alu(1, 1, imm)} (debería ser 0111)')
print(f'  slti con las ecuaciones nuevas: funct = {imm:06b} -> {puertas_alu_11(1, 1, imm)}')

print('Problema 5: 2 147 483 600 + 120 =', 2147483600 + 120, '> 2^31 - 1 =', 2**31 - 1)

# Problema 6: la RD con la unidad de extensión de tres modos (ExtOp) y ALUOp = 11 -> OR
M = 0xFFFFFFFF
def ext(imm, extop): return {'00': (imm - 0x10000 if imm & 0x8000 else imm) & M, '01': imm, '10': imm << 16, '11': 0}[extop]
def alu(a, b, ctl): return {'0010': (a + b) & M, '0110': (a - b) & M, '0000': a & b, '0001': a | b, '0111': int(a < b)}.get(ctl)   # None: funct no es de ninguna operación
def ejecuta(ins, s, aluop11='0001'):                 # un ciclo: devuelve (registro escrito, valor, memoria escrita, PC)
    op, rs, rt, rd, imm, funct, pc = ins
    reg = {0: 0, 8: 0x10010010, 9: 0x00000FF0, 10: 7}; mem = {0x10010008: 1234}
    a, d2 = reg.get(rs, 0), reg.get(rt, 0)
    b = ext(imm, s['ExtOp']) if s['ALUSrc'] == '1' else d2
    ctl = aluop11 if s['ALUOp'] == '11' else tabla_alu(s['ALUOp'], funct)
    res = alu(a, b, ctl)
    if res is None: return 'la ALU no sabe qué hacer'
    zero = res == 0
    leido = mem.get(res, 0) if s['MemRead'] == '1' else None
    w = (rd if s['RegDst'] == '1' else rt, leido if s['MemtoReg'] == '1' else res) if s['RegWrite'] == '1' else None
    m = (res, d2) if s['MemWrite'] == '1' else None
    pcb = pc + 4 + (ext(imm, s['ExtOp']) << 2) if s['Branch'] == '1' and zero else pc + 4
    return w, m, (((pc + 4) & 0xF0000000) | (imm << 2)) if s['Jump'] == '1' else pcb & M
SEN = ['RegDst', 'ALUSrc', 'MemtoReg', 'RegWrite', 'MemRead', 'MemWrite', 'Branch', 'Jump', 'ALUOp', 'ExtOp']
EXAMEN = {  # instrucción de prueba (op, rs, rt, rd, imm, funct, pc), resultado que debe dar y las señales de la respuesta
 'lw':  ((35, 8, 11, 0, 0xFFF8, 0x38, 0x400000), ((11, 1234), None, 0x400004), '0 1 1 1 1 0 0 0 00 00'),
 'sw':  ((43, 8, 9, 0, 0xFFF8, 0x38, 0x400000), (None, (0x10010008, 0xFF0), 0x400004), 'X 1 X 0 0 1 0 0 00 00'),
 'beq': ((4, 0, 0, 0, 0xFFFE, 0x3E, 0x400008), (None, None, 0x400004), 'X 0 X 0 0 0 1 0 01 00'),
 'j':   ((2, 0, 0, 0, 0x100000, 0, 0x400000), (None, None, 0x400000), 'X X X 0 0 0 X 1 XX XX'),
 'add': ((0, 9, 10, 12, 0x6020, 0x20, 0x400000), ((12, 0xFF7), None, 0x400004), '1 0 0 1 0 0 0 0 10 XX'),
 'ori': ((13, 9, 13, 0, 0x800F, 0x0F, 0x400000), ((13, 0x8FFF), None, 0x400004), '0 1 0 1 0 0 0 0 11 01'),
 'lui': ((15, 0, 14, 0, 0x1001, 0x01, 0x400000), ((14, 0x10010000), None, 0x400004), '0 1 0 1 0 0 0 0 00 10'),
}
print('Problema 6: cada columna, probada con todas las formas de rellenar sus X')
for nom, (ins, esperado, col) in EXAMEN.items():
    vals = dict(zip(SEN, col.split())); xs = [k for k in SEN if 'X' in vals[k]]
    casos = [dict(vals, **{k: c for k, c in zip(xs, comb)}) for comb in product(*[['0', '1'] if len(vals[k]) == 1 else ['00', '01', '10', '11'] for k in xs])]
    buenos = sum(ejecuta(ins, s) == esperado for s in casos)
    print(f'  {nom:4s} {col:22s} X = {len(xs)}  rellenos que funcionan: {buenos}/{len(casos)}')
for nom in ('lw', 'sw', 'beq', 'ori', 'lui'):        # ¿hay otro ExtOp que también sirva?
    ins, esp, col = EXAMEN[nom]
    otros = [e for e in ('00', '01', '10') if ejecuta(ins, dict(zip(SEN, col.split()), ExtOp=e)) == esp]
    print(f'  {nom:4s} ExtOp que funcionan: {", ".join(otros)}')
for aluop in ('00', '01', '10', '11'):                # lui: ¿qué ALUOp sirven?
    s = dict(zip(SEN, EXAMEN['lui'][2].split()), ALUOp=aluop)
    print(f'  lui con ALUOp = {aluop}: {"bien" if ejecuta(EXAMEN["lui"][0], s) == EXAMEN["lui"][1] else "mal"}')
print('Pruébalo tú: ALUOp = 11 hace AND (0000)')
for nom, ins, esp, col in (('andi', (12, 9, 13, 0, 0x00F0, 0x30, 0x400000), ((13, 0xF0), None, 0x400004), '0 1 0 1 0 0 0 0 11 01'),
                           ('lui', EXAMEN['lui'][0], EXAMEN['lui'][1], '0 1 0 1 0 0 0 0 00 10'),
                           ('lui', EXAMEN['lui'][0], EXAMEN['lui'][1], '0 1 0 1 0 0 0 0 11 10')):
    print(f'  {nom:4s} {col:22s} {"bien" if ejecuta(ins, dict(zip(SEN, col.split())), "0000") == esp else "mal"}')
