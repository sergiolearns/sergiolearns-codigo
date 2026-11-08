# Las soluciones de los tres niveles de los ejercicios
# Del artículo «Repertorio de instrucciones de MIPS — ejercicios para codificar, decodificar y salvar un salto que no cabe (y el j al que no le quité los dos ceros)»
# https://sergiolearns.com/repertorio-de-instrucciones-ejercicios/

# Las soluciones de los tres niveles de los ejercicios (codificar, decodificar y el salto lejano)
R_ = ['$zero', '$at', '$v0', '$v1', '$a0', '$a1', '$a2', '$a3'] + [f'$t{i}' for i in range(8)] \
     + [f'$s{i}' for i in range(8)] + ['$t8', '$t9', '$k0', '$k1', '$gp', '$sp', '$fp', '$ra']
N = {r: i for i, r in enumerate(R_)}

def r(rs, rt, rd, sh, fn): return (N[rs] << 21) | (N[rt] << 16) | (N[rd] << 11) | (sh << 6) | fn
def i(op, rs, rt, inm): return (op << 26) | (N[rs] << 21) | (N[rt] << 16) | (inm & 0xFFFF)
def j(op, destino): return (op << 26) | ((destino >> 2) & 0x3FFFFFF)

print('Nivel 1')
for texto, w in (('or   $t7, $s0, $a2', r('$s0', '$a2', '$t7', 0, 0x25)), ('sra  $t3, $t3, 1', r('$zero', '$t3', '$t3', 1, 0x03)),
                 ('addi $a0, $a0, -1', i(0x08, '$a0', '$a0', -1)), ('lb   $t9, 7($t1)', i(0x20, '$t1', '$t9', 7))):
    print(f'  {texto:20} 0x{w:08X}')
print('Nivel 2')
for pc, w in ((0x00400000, 0x3C011001), (0x00400004, 0x0085182A), (0x00400048, 0x1060FFFD), (0x00400010, 0x0C100020)):
    op, inm = w >> 26, (w & 0xFFFF) - (0x10000 if w & 0x8000 else 0)
    if op in (4, 5):
        print(f'  0x{w:08X}: salto condicional, desp. {inm} -> 0x{pc + 4 + 4 * inm:08X}')
    elif op in (2, 3):
        print(f'  0x{w:08X}: formato J -> 0x{((pc + 4) & 0xF0000000) | ((w & 0x3FFFFFF) << 2):08X}')
    elif op == 0:
        print(f'  0x{w:08X}: R  rs = {R_[(w >> 21) & 31]}, rt = {R_[(w >> 16) & 31]}, rd = {R_[(w >> 11) & 31]}, '
              f'shamt = {(w >> 6) & 31}, funct = 0x{w & 63:02X}')
    else:
        print(f'  0x{w:08X}: I  op = 0x{op:02X}, rs = {R_[(w >> 21) & 31]}, rt = {R_[(w >> 16) & 31]}, inmediato = 0x{w & 0xFFFF:04X}')
print('Nivel 3')
desp = (0x00440000 - (0x0040003C + 4)) // 4
print(f'  beq en 0x0040003C hacia 0x00440000: desp. = {desp} palabras (maximo 32767) -> no cabe')
for pc, texto, w in ((0x00400030, 'addi $a0, $zero, 7', i(0x08, '$zero', '$a0', 7)), (0x00400034, 'jal  DOBLE', j(0x03, 0x00400060)),
                     (0x00400038, 'sw   $v0, 0($gp)', i(0x2B, '$gp', '$v0', 0)),
                     (0x0040003C, 'bne  $v0, $zero, SIGUE', i(0x05, '$v0', '$zero', (0x00400044 - 0x00400040) // 4)),
                     (0x00400040, 'j    0x00440000', j(0x02, 0x00440000)),
                     (0x00400060, 'sll  $v0, $a0, 1', r('$zero', '$a0', '$v0', 1, 0x00)), (0x00400064, 'jr   $ra', r('$ra', '$zero', '$zero', 0, 0x08))):
    print(f'  0x{pc:08X}  {texto:24} 0x{w:08X}')
