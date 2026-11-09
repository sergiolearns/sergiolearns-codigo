# Compruébalo con Python · La unidad de control con puertas y la caja del túnel de lavado
# Del artículo «Unidad de control del MIPS — teoría con un túnel de lavado, la tabla de verdad de la ALU y un retrovisor que lo para todo (y el lw que me salió haciendo AND)»
# https://sergiolearns.com/unidad-de-control/

# La unidad de control del MIPS monociclo hecha con puertas: una AND por instrucción y una OR por señal
def bit(x, i): return (x >> i) & 1

def uc_principal(op):
    o = [bit(op, i) for i in range(6)]; n = [1 - b for b in o]    # o[5] = op5 ... o[0] = op0
    R   = n[5] & n[4] & n[3] & n[2] & n[1] & n[0]                    # 000000  tipo R
    lw  = o[5] & n[4] & n[3] & n[2] & o[1] & o[0]                    # 100011
    sw  = o[5] & n[4] & o[3] & n[2] & o[1] & o[0]                    # 101011
    beq = n[5] & n[4] & n[3] & o[2] & n[1] & n[0]                    # 000100
    j   = n[5] & n[4] & n[3] & n[2] & o[1] & n[0]                    # 000010
    return dict(RegDst=R, ALUSrc=lw | sw, MemtoReg=lw, RegWrite=R | lw, MemRead=lw,
                MemWrite=sw, Branch=beq, ALUOp1=R, ALUOp0=beq, Jump=j)

def uc_alu(a1, a0, funct):                                            # ALUOp (2 bits) + funct -> 4 bits
    f = [bit(funct, i) for i in range(6)]
    op3 = a1 & f[2] & f[1] & f[0]                                    # solo nor (100111)
    op2 = a0 | (a1 & f[1])                                           # restar: beq, sub y slt
    op1 = (1 - a1) | (1 - f[2])                                      # sumador: todo menos and, or y nor
    op0 = a1 & (f[3] | (f[0] & (1 - f[1])))                          # or y slt
    return f'{op3}{op2}{op1}{op0}'

# La caja del túnel de lavado ($s0 = 0x10010000): las seis palabras que ya están en memoria
TUNEL = [(0x00400000, 0x8E080024, 'lw   $t0, 36($s0)'), (0x00400004, 0x01284820, 'add  $t1, $t1, $t0'),
         (0x00400008, 0xAE090000, 'sw   $t1, 0($s0)'), (0x0040000C, 0x0131502A, 'slt  $t2, $t1, $s1'),
         (0x00400010, 0x11400001, 'beq  $t2, $zero, FIN'), (0x00400014, 0x08100000, 'j    LAVA')]
SEN = ['RegDst', 'ALUSrc', 'MemtoReg', 'RegWrite', 'MemRead', 'MemWrite', 'Branch', 'ALUOp', 'Jump', 'ALU']
print('dirección  instrucción           op      funct  ' + ''.join(n.center(len(n) + 2) for n in SEN))
for pc, w, txt in TUNEL:
    op, funct = w >> 26, w & 0x3F                                     # la UC solo ve estos 12 bits
    s = uc_principal(op)
    s['ALUOp'] = f"{s['ALUOp1']}{s['ALUOp0']}"                        # los dos bits juntos, como en la tabla
    s['ALU'] = uc_alu(s['ALUOp1'], s['ALUOp0'], funct)
    print(f'{pc:08X}   {txt:21s} {op:06b}  {funct:06b} ' + ''.join(str(s[n]).center(len(n) + 2) for n in SEN))
