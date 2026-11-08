# Compruébalo con Python · La taquilla del tren por la ruta de datos: cables y señales
# Del artículo «Ruta de datos monociclo de MIPS — teoría con un tren y sus agujas, el camino de cada instrucción y sus señales (y la memoria que quise compartir)»
# https://sergiolearns.com/ruta-de-datos-monociclo/

# Ejecuta la taquilla del tren por la ruta de datos monociclo: el valor de cada cable y de cada señal
M = 0xFFFFFFFF
reg = [0] * 32; reg[16] = 0x10010000; reg[4] = 4       # $s0 = tablero de plazas, $a0 = billetes del pedido
mem = {0x10010008: 120}                                # plazas libres del tren
prog = {0x00400000: 0x8E080008, 0x00400004: 0x01044022, 0x00400008: 0xAE080008,
        0x0040000C: 0x11000001, 0x00400010: 0x08100000}
#            RegDst ALUSrc MemtoReg RegWrite MemRead MemWrite Branch ALUOp Jump
SEN = {0x00: '1 0 0 1 0 0 0 10 0', 0x23: '0 1 1 1 1 0 0 00 0', 0x2B: 'X 1 X 0 0 1 0 00 0',
       0x04: 'X 0 X 0 0 0 1 01 0', 0x02: 'X X X 0 0 0 X XX 1'}
NOM = {0x00: 'tipo R', 0x23: 'lw', 0x2B: 'sw', 0x04: 'beq', 0x02: 'j'}
pc = 0x00400000
for _ in range(5):
    w = prog[pc]                                        # la memoria de instrucciones siempre lee
    op, rs, rt, rd, fn = w >> 26, (w >> 21) & 31, (w >> 16) & 31, (w >> 11) & 31, w & 63
    ext = (w & 0xFFFF) - (0x10000 if w & 0x8000 else 0) # extension de signo de los 16 bits
    RegDst, ALUSrc, MemtoReg, RegWrite, MemRead, MemWrite, Branch, ALUOp, Jump = SEN[op].split()
    print(f'PC {pc:08X}  instruccion {w:08X}  ({NOM[op]})')
    print(f'   RegDst={RegDst} ALUSrc={ALUSrc} MemtoReg={MemtoReg} RegWrite={RegWrite} MemRead={MemRead}'
          f' MemWrite={MemWrite} Branch={Branch} ALUOp={ALUOp} Jump={Jump}')
    a = reg[rs]
    b = (ext & M) if ALUSrc == '1' else reg[rt]         # multiplexor ALUSrc
    resta = ALUOp == '01' or (ALUOp == '10' and fn == 0x22)   # beq resta; en tipo R lo decide funct
    res = (a - b) & M if resta else (a + b) & M
    zero = int(res == 0)
    if Jump == '0':
        print(f'   ALU: {a:08X} {"-" if resta else "+"} {b:08X} = {res:08X}   Zero = {zero}')
    if MemRead == '1':
        dato = mem[res]; print(f'   memoria de datos: lee Mem[{res:08X}] = {dato}')
    if MemWrite == '1':
        mem[res] = reg[rt]; print(f'   memoria de datos: escribe {reg[rt]} en Mem[{res:08X}]')
    if RegWrite == '1':
        r = rd if RegDst == '1' else rt                  # multiplexor RegDst
        reg[r] = dato if MemtoReg == '1' else res       # multiplexor MemtoReg
        print(f'   banco de registros: escribe {reg[r]} en el registro {r}')
    pc4 = pc + 4
    destino_beq = (pc4 + (ext << 2)) & M                # PC + 4 + desplazamiento x 4
    destino_j = (pc4 & 0xF0000000) | ((w & 0x3FFFFFF) << 2)   # 4 bits de PC + 4, 26 bits, 00
    pcsrc = int(Branch == '1' and zero == 1)            # puerta AND de Branch y Zero
    pc = destino_j if Jump == '1' else (destino_beq if pcsrc else pc4)
    print(f'   siguiente PC = {pc:08X}')
