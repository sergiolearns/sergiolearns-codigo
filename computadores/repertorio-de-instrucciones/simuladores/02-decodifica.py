# Compruébalo con Python · Decodificar palabras de 32 bits
# Del artículo «Repertorio de instrucciones de MIPS — teoría con la comanda de un restaurante, formatos R, I y J en hexadecimal (y el add que escribí al revés)»
# https://sergiolearns.com/repertorio-de-instrucciones/

# Del hexadecimal a la instruccion: el camino de vuelta que hace la unidad de control
NOMBRES = ['$zero', '$at', '$v0', '$v1', '$a0', '$a1', '$a2', '$a3'] + [f'$t{i}' for i in range(8)] \
          + [f'$s{i}' for i in range(8)] + ['$t8', '$t9', '$k0', '$k1', '$gp', '$sp', '$fp', '$ra']
FUNCT = {0x20: 'add', 0x22: 'sub', 0x24: 'and', 0x25: 'or', 0x2A: 'slt', 0x00: 'sll', 0x02: 'srl', 0x03: 'sra', 0x08: 'jr'}
OP_I = {0x08: 'addi', 0x0C: 'andi', 0x0D: 'ori', 0x0F: 'lui', 0x23: 'lw', 0x2B: 'sw', 0x20: 'lb', 0x04: 'beq', 0x05: 'bne'}

def con_signo(x):                     # el inmediato de 16 bits esta en C2
    return x - 0x10000 if x & 0x8000 else x

def decodifica(w, pc):
    op = w >> 26                      # lo primero: los 6 bits de la izquierda
    rs, rt, rd = (w >> 21) & 31, (w >> 16) & 31, (w >> 11) & 31
    shamt, funct, inm = (w >> 6) & 31, w & 63, con_signo(w & 0xFFFF)
    if op == 0:                       # formato R: la operacion esta en funct
        f = FUNCT[funct]
        if f in ('sll', 'srl', 'sra'):
            return 'R', f'{f} {NOMBRES[rd]}, {NOMBRES[rt]}, {shamt}'
        if f == 'jr':
            return 'R', f'jr {NOMBRES[rs]}'
        return 'R', f'{f} {NOMBRES[rd]}, {NOMBRES[rs]}, {NOMBRES[rt]}'
    if op in (2, 3):                  # formato J: 4 bits del PC + 4, 26 bits, 00
        destino = ((pc + 4) & 0xF0000000) | ((w & 0x3FFFFFF) << 2)
        return 'J', f"{'j' if op == 2 else 'jal'} 0x{destino:08X}"
    f = OP_I[op]                      # formato I
    if f in ('beq', 'bne'):
        return 'I', f'{f} {NOMBRES[rs]}, {NOMBRES[rt]}, 0x{pc + 4 + 4 * inm:08X}   (desp. {inm})'
    if f in ('lw', 'sw', 'lb'):
        return 'I', f'{f} {NOMBRES[rt]}, {inm}({NOMBRES[rs]})'
    return 'I', f'{f} {NOMBRES[rt]}, {NOMBRES[rs]}, {inm}'

for pc, w in [(0x0040002C, 0x8E080000), (0x00400034, 0x01284820), (0x0040003C, 0x0810000B),
              (0x00400040, 0x000950C2), (0x0040003C, 0x1500FFFB), (0x00400100, 0x23BDFFF8)]:
    formato, texto = decodifica(w, pc)
    print(f'0x{pc:08X}  0x{w:08X}  op = {w >> 26:2}  formato {formato}  ->  {texto}')
