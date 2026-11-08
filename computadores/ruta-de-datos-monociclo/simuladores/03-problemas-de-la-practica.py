# Compruébalo con Python · Las cuentas de los seis problemas guiados
# Del artículo «Ruta de datos monociclo de MIPS — práctica guiada con los trenes de la estación, cables, señales y tiempo de ciclo (y el reloj que puse con la instrucción equivocada)»
# https://sergiolearns.com/ruta-de-datos-monociclo-practica/

# Las cuentas de los seis problemas de la practica: cables, siguiente PC, senales y tiempo de ciclo
M = 0xFFFFFFFF
def campos(w):
    return w >> 26, (w >> 21) & 31, (w >> 16) & 31, (w >> 11) & 31, w & 63, w & 0xFFFF, w & 0x3FFFFFF
def ext(i16):                                           # extension de signo de 16 a 32 bits
    return (i16 - 0x10000 if i16 & 0x8000 else i16) & M

print('Problema 1: add $s2, $t3, $t4 en 0x00400020')
op, rs, rt, rd, fn, i16, d26 = campos(0x016C9020)
reg = {11: 35, 12: 42, 29: 0x7FFFEFF8}                 # $t3, $t4 y $sp
print(f'  op={op} rs={rs} rt={rt} rd={rd} funct=0x{fn:02X}')
print(f'  Dato leido 1 = {reg[rs]}, Dato leido 2 = {reg[rt]}, resultado ALU = {reg[rs] + reg[rt]}, registro a escribir = {rd}')
print('Problema 1: lw $t5, -8($sp) en 0x00400024')
op, rs, rt, rd, fn, i16, d26 = campos(0x8FADFFF8)
dir_ = (reg[rs] + ext(i16)) & M
print(f'  inmediato = 0x{i16:04X} -> extension de signo = 0x{ext(i16):08X}')
print(f'  direccion = 0x{reg[rs]:08X} + 0x{ext(i16):08X} = 0x{dir_:08X}, registro a escribir = {rt} (rt)')

print('Problema 2: beq en 0x00400040 (palabra 0x112AFFFA)')
op, rs, rt, rd, fn, i16, d26 = campos(0x112AFFFA)
destino = (0x00400040 + 4 + (ext(i16) << 2)) & M
print(f'  desplazamiento = {i16 - 0x10000} palabras -> destino = 0x{destino:08X}')
for t1, t2 in ((7, 7), (7, 9)):
    zero = int(t1 - t2 == 0)
    print(f'  $t1 = {t1}, $t2 = {t2}: Zero = {zero}, PCSrc = {zero} -> PC = 0x{destino if zero else 0x00400044:08X}')
for pc, w in ((0x0040005C, 0x0810000C), (0x0FFFFFFC, 0x08000010)):
    d = ((pc + 4) & 0xF0000000) | ((w & 0x3FFFFFF) << 2)
    print(f'Problema 2: j en 0x{pc:08X} (palabra 0x{w:08X}) -> PC + 4 = 0x{pc + 4:08X}, destino = 0x{d:08X}')

print('Problema 3: las senales de las cinco instrucciones')
COL = ['R', 'lw', 'sw', 'beq', 'j']
SEN = {'RegDst': '1 0 X X X', 'ALUSrc': '0 1 1 0 X', 'MemtoReg': '0 1 X X X', 'RegWrite': '1 1 0 0 0',
       'MemRead': '0 1 0 0 0', 'MemWrite': '0 0 1 0 0', 'Branch': '0 0 0 1 X', 'ALUOp': '10 00 00 01 XX', 'Jump': '0 0 0 0 1'}
print('  ' + ' ' * 9 + ''.join(f'{c:>5}' for c in COL))
for s, v in SEN.items():
    print(f'  {s:9s}' + ''.join(f'{x:>5}' for x in v.split()))

print('Problema 4: tiempo de ciclo')
RET = {'MI': 300, 'Reg': 120, 'ALU': 180, 'MD': 280, 'Esc': 100}   # picosegundos
CAMINO = {'tipo R': 'MI Reg ALU Esc', 'lw': 'MI Reg ALU MD Esc', 'sw': 'MI Reg ALU MD', 'beq': 'MI Reg ALU', 'j': 'MI'}
t = {i: sum(RET[b] for b in c.split()) for i, c in CAMINO.items()}
for i, ps in t.items():
    print(f'  {i:7s} {ps} ps')
ciclo = max(t.values())
print(f'  ciclo = {ciclo} ps -> {1e12 / ciclo / 1e9:.3f} GHz; una tipo R espera {ciclo - t["tipo R"]} ps sin hacer nada')

print('Problemas 5 y 6: siguiente PC con bne y lo que escribe jal')
for zero in (0, 1):
    print(f'  bne con Zero = {zero}: PCSrc = Branch AND Zero OR BranchNE AND NOT Zero = {int(not zero)}')
pc = 0x00400070
print(f'  jal en 0x{pc:08X}: escribe PC + 4 = 0x{pc + 4:08X} en el registro 31 ($ra)')
print(f'  slti $t0, $s5, 10 con $s5 = -3: slt(-3, 10) = {int(-3 < 10)}')
print('Problema 6: la RD con slti y jal (senal nueva Link)')
COL = ['jal', 'slti', 'beq', 'lw', 'sw', 'sub', 'j']
SEN = {'ALUOp': 'XX 11 01 00 00 10 XX', 'ALUSrc': 'X 1 0 1 1 0 X', 'RegDst': 'X 0 X 0 X 1 X',
       'RegWrite': '1 1 0 1 0 1 0', 'MemRead': '0 0 0 1 0 0 0', 'MemtoReg': 'X 0 X 1 X 0 X',
       'MemWrite': '0 0 0 0 1 0 0', 'Branch': 'X 0 1 0 0 0 X', 'Jump': '1 0 0 0 0 0 1', 'Link': '1 0 X 0 X 0 X'}
print('  ' + ' ' * 9 + ''.join(f'{c:>5}' for c in COL))
for s, v in SEN.items():
    print(f'  {s:9s}' + ''.join(f'{x:>5}' for x in v.split()))
print('Pruebalo tu: la RD con bne (senal BranchNE) y jal (senal Link)')
COL = ['bne', 'jal', 'slt', 'sw', 'lw', 'beq', 'j']
SEN = {'ALUOp': '01 XX 10 00 00 01 XX', 'ALUSrc': '0 X 0 1 1 0 X', 'RegDst': 'X X 1 X 0 X X',
       'RegWrite': '0 1 1 0 1 0 0', 'MemRead': '0 0 0 0 1 0 0', 'MemtoReg': 'X X 0 X 1 X X',
       'MemWrite': '0 0 0 1 0 0 0', 'Branch': '0 X 0 0 0 1 X', 'BranchNE': '1 X 0 0 0 0 X',
       'Jump': '0 1 0 0 0 0 1', 'Link': 'X 1 0 X 0 X X'}
print('  ' + ' ' * 9 + ''.join(f'{c:>5}' for c in COL))
for s, v in SEN.items():
    print(f'  {s:9s}' + ''.join(f'{x:>5}' for x in v.split()))
