# Ejercicios · Las cuentas de las soluciones
# Del artículo «Ejercicios de la unidad de control del MIPS — de la tabla de la ALU a una ALUOp de 3 bits, con excepciones y el túnel de lavado (y la rutina que volvía al mismo error para siempre)»
# https://sergiolearns.com/unidad-de-control-ejercicios/

# Soluciones de los ejercicios: UC de la ALU, UC principal con excepciones y una ALUOp de 3 bits
from itertools import product
def bit(x, i): return (x >> i) & 1
OPER = {'add': '0010', 'sub': '0110', 'and': '0000', 'or': '0001', 'nor': '1100', 'slt': '0111'}
FUNCT = {0b100000: 'add', 0b100010: 'sub', 0b100100: 'and', 0b100101: 'or', 0b100111: 'nor', 0b101010: 'slt'}
ALUOP = {0: '10', 0x23: '00', 0x2B: '00', 4: '01', 2: 'XX'}
def uc_alu(aluop, funct):
    return {'00': 'add', '01': 'sub', 'XX': '(no importa)'}.get(aluop) or FUNCT[funct]

print('Nivel 1')
for w, txt in ((0x8D2A002C, 'lw   $t2, 44($t1)'), (0x02328022, 'sub  $s0, $s1, $s2'), (0x01095024, 'and  $t2, $t0, $t1'),
               (0x0109502A, 'slt  $t2, $t0, $t1'), (0x1109FFFC, 'beq  $t0, $t1, -4'), (0x02119827, 'nor  $s3, $s0, $s1')):
    op, funct = w >> 26, w & 0x3F; aluop = ALUOP[op]; o = uc_alu(aluop, funct)
    print(f'  {w:08X}  {txt:20s} op = {op:06b}  ALUOp = {aluop}  bits 5-0 = {funct:06b}  -> {o} {OPER.get(o, "")}')

print('Nivel 2')
OPS = {0: 'R', 0x23: 'lw', 0x2B: 'sw', 4: 'beq', 2: 'j'}
TABLA = {'R': '1 0 0 1 0 0 0 10 0', 'lw': '0 1 1 1 1 0 0 00 0', 'sw': 'X 1 X 0 0 1 0 00 0',
         'beq': 'X 0 X 0 0 0 1 01 0', 'j': 'X X X 0 0 0 X XX 1'}
reg = {9: 200000000, 10: 2000000000}                   # $t1 y $t2 antes de empezar
for pc, w, txt in ((0x00400100, 0xAD0A0008, 'sw   $t2, 8($t0)'), (0x00400104, 0x01495020, 'add  $t2, $t2, $t1'),
                   (0x00400108, 0xFC031820, '(palabra 0xFC031820)'), (0x0040010C, 0x08100040, 'j    0x00400100')):
    op = w >> 26
    if op not in OPS:
        print(f'  {pc:08X} {txt:21s} op = {op:06b}: ninguna AND -> excepción: EPC = {pc:08X}, Causa = 0, '
              f'PC = 80000180 (fija) u 80000000 (vectorizadas)'); continue
    print(f'  {pc:08X} {txt:21s} op = {op:06b}: AND de {OPS[op]:3s} -> RegDst ALUSrc MemtoReg RegWrite MemRead MemWrite Branch ALUOp Jump = {TABLA[OPS[op]]}')
    if op == 0:
        suma = reg[10] + reg[9]
        print(f'      {reg[10]} + {reg[9]} = {suma} > {2**31 - 1}: desbordamiento -> EPC = {pc:08X}, Causa = 1, PC = 80000180, $t2 sigue en {reg[10]}')
    if op == 2: print(f'      destino = {((pc + 4) & 0xF0000000) | ((w & 0x3FFFFFF) << 2):08X}')

print('Nivel 3: ALUOp de 3 bits')
CODIGO = {'000': 'add', '001': 'sub', '010': 'funct', '011': 'slt', '100': 'and', '101': 'or'}
UC = {'lw': '000', 'sw': '000', 'addi': '000', 'beq': '001', 'R': '010', 'slti': '011', 'andi': '100', 'ori': '101', 'j': 'XXX'}
print('  UC principal, columna ALUOp:', ', '.join(f'{k} {v}' for k, v in UC.items()))
def tabla(a, f):
    c = CODIGO.get(a)
    if c is None: return None                           # 110 y 111 no se usan
    return OPER[FUNCT[f]] if c == 'funct' else OPER[c]
def op0(a2, a1, a0, f):                                 # Operation0: 1 en or y slt
    F = [bit(f, i) for i in range(6)]
    return (a0 & (a1 ^ a2)) | ((1 - a2) & a1 & (1 - a0) & (F[3] | (F[0] & (1 - F[1]))))
bien = total = 0
for a in CODIGO:
    for f in (FUNCT if CODIGO[a] == 'funct' else range(64)):
        total += 1; bien += op0(*map(int, a), f) == int(tabla(a, f)[3])
print(f'  Operation0 = A0·(A1 xor A2) + (no A2)·A1·(no A0)·(F3 + F0·(no F1)): {bien}/{total} combinaciones bien')

print('¿Qué falla aquí?')
print(f'  addi $t0, $t0, 37 con ALUOp = 10: bits 5-0 = {37:06b} -> {FUNCT[37]}; con $t0 = 12: 12 or 37 = {12 | 37}, 12 + 37 = {12 + 37}')
sw = 0b101011
print(f'  lw = op5·op1·op0 con sw (op = {sw:06b}): {bit(sw, 5) & bit(sw, 1) & bit(sw, 0)} -> la AND de lw también se enciende')
