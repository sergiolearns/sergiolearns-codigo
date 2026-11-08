# Compruébalo con Python · Las soluciones de los ejercicios
# Del artículo «Ruta de datos monociclo de MIPS — ejercicios para seguir cables, rellenar señales y ampliar el procesador (y el sw que escribía donde no debía)»
# https://sergiolearns.com/ruta-de-datos-monociclo-ejercicios/

# Las soluciones de los tres niveles de los ejercicios: caminos, cables y la instruccion nueva lwx
M = 0xFFFFFFFF
def campos(w):
    return w >> 26, (w >> 21) & 31, (w >> 16) & 31, (w >> 11) & 31, w & 63, w & 0xFFFF, w & 0x3FFFFFF
def ext(i16):
    return (i16 - 0x10000 if i16 & 0x8000 else i16) & M

print('Nivel 1: que bloques usa cada instruccion')
USA = {'or $t7, $s1, $s2': 'MI Reg ALU Esc', 'lw $t3, 4($s1)': 'MI Reg Ext ALU MD Esc',
       'sw $t3, 4($s1)': 'MI Reg Ext ALU MD', 'beq $s1, $s2, X': 'MI Reg Ext Desp Sum2 ALU'}
for ins, bloques in USA.items():
    print(f'  {ins:18s} {bloques}')

print('Nivel 2')
reg = {14: 0x10010040, 17: 0x5A, 18: 0x5A}             # $t6, $s1 y $s2
pc = 0x00400080
for w in (0xADD1000C, 0x12320003, 0x08100020):
    op, rs, rt, rd, fn, i16, d26 = campos(w)
    pc4 = pc + 4
    if op == 0x2B:
        dir_ = (reg[rs] + ext(i16)) & M
        print(f'  {pc:08X} sw : 0x{reg[rs]:08X} + 0x{ext(i16):08X} = 0x{dir_:08X}, escribe 0x{reg[rt]:X}; PC -> 0x{pc4:08X}')
        pc = pc4
    elif op == 4:
        zero = int(reg[rs] == reg[rt]); destino = (pc4 + (ext(i16) << 2)) & M
        print(f'  {pc:08X} beq: 0x{reg[rs]:X} - 0x{reg[rt]:X} = 0, Zero = {zero}, destino = 0x{destino:08X}; PC -> 0x{destino if zero else pc4:08X}')
        pc = destino if zero else pc4
    else:
        destino = (pc4 & 0xF0000000) | (d26 << 2)
        print(f'  {pc:08X} j  : 0x{d26:07X} x 4 = 0x{d26 << 2:08X}, con los 4 bits de 0x{pc4:08X}; PC -> 0x{destino:08X}')
        pc = destino

print('Nivel 3: lwx $rd, $rs($rt) -> $rd = Mem[$rs + $rt]')
reg = {9: 0x10010000, 10: 0x14}                          # $t1 = base del tablero, $t2 = 20 bytes (vagon 5)
mem = {0x10010014: 64}
print(f'  direccion = 0x{reg[9]:08X} + 0x{reg[10]:X} = 0x{reg[9] + reg[10]:08X} -> lee {mem[reg[9] + reg[10]]}')
RET = {'MI': 300, 'Reg': 120, 'ALU': 180, 'MD': 280, 'Esc': 100}
for nombre, mi, md in (('memorias de 300 y 280 ps', 300, 280), ('memorias de 200 ps', 200, 200)):
    RET.update(MI=mi, MD=md)
    lw = sum(RET.values()); r = lw - RET['MD']
    print(f'  {nombre}: lw y lwx = {lw} ps, tipo R = {r} ps -> ciclo {lw} ps')
print(f'  ganancia = 980 / 800 = {980 / 800:.3f}')
