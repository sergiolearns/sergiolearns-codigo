# Las cuentas de los seis problemas guiados
# Del artículo «Repertorio de instrucciones de MIPS — práctica guiada con las comandas de la cocina, de ensamblador a hexadecimal y vuelta (y los saltos que «corregí» con QtSpim)»
# https://sergiolearns.com/repertorio-de-instrucciones-practica/

# Las cuentas de los seis problemas de la practica: codificar (R, I, J y saltos) y decodificar
R_ = ['$zero', '$at', '$v0', '$v1', '$a0', '$a1', '$a2', '$a3'] + [f'$t{i}' for i in range(8)] \
     + [f'$s{i}' for i in range(8)] + ['$t8', '$t9', '$k0', '$k1', '$gp', '$sp', '$fp', '$ra']
N = {r: i for i, r in enumerate(R_)}
FUNCT = {'add': 0x20, 'sub': 0x22, 'slt': 0x2A, 'sll': 0x00, 'jr': 0x08}
OP = {'lw': 0x23, 'sw': 0x2B, 'lh': 0x21, 'sb': 0x28, 'addi': 0x08, 'andi': 0x0C, 'beq': 0x04, 'bne': 0x05, 'j': 0x02, 'jal': 0x03}

def codifica(texto, pc=0, etiquetas={}):
    m, *a = texto.replace(',', ' ').replace('(', ' ').replace(')', ' ').split()
    if m == 'sll':                                   # sll rd, rt, shamt  (rs = 0)
        return (N[a[1]] << 16) | (N[a[0]] << 11) | (int(a[2]) << 6) | FUNCT[m]
    if m == 'jr':
        return (N[a[0]] << 21) | FUNCT[m]
    if m in FUNCT:                                   # op rd, rs, rt
        return (N[a[1]] << 21) | (N[a[2]] << 16) | (N[a[0]] << 11) | FUNCT[m]
    if m in ('j', 'jal'):
        destino = etiquetas[a[0]] if a[0] in etiquetas else int(a[0], 0)
        return (OP[m] << 26) | ((destino >> 2) & 0x3FFFFFF)
    if m in ('beq', 'bne'):                          # desplazamiento desde PC + 4, en palabras
        desp = (etiquetas[a[2]] - (pc + 4)) // 4
        return (OP[m] << 26) | (N[a[0]] << 21) | (N[a[1]] << 16) | (desp & 0xFFFF)
    if m in ('lw', 'sw', 'lh', 'sb'):                # op rt, desp(rs)
        return (OP[m] << 26) | (N[a[2]] << 21) | (N[a[0]] << 16) | (int(a[1], 0) & 0xFFFF)
    return (OP[m] << 26) | (N[a[1]] << 21) | (N[a[0]] << 16) | (int(a[2], 0) & 0xFFFF)   # addi, andi

def rutina(lineas, base):                        # dos pasadas: primero las etiquetas, luego codificar
    etiq, pc, ins = {}, base, []
    for l in lineas:
        if ':' in l:
            e, l = l.split(':'); etiq[e.strip()] = pc
        ins.append((pc, l.strip())); pc += 4
    for pc, l in ins:
        print(f'  0x{pc:08X}  {l:22} 0x{codifica(l, pc, etiq):08X}')

print('Problema 1'); [print(f'  {s:22} 0x{codifica(s):08X}') for s in ('sub $s1, $t2, $s3', 'sll $t6, $s1, 2')]
print('Problema 2'); [print(f'  {s:22} 0x{codifica(s):08X}') for s in ('addi $t5, $t5, -12', 'sw $t5, 20($s4)')]
print('Problema 3'); rutina(['OTRA: lw $t0, 0($a0)', 'beq $t0, $s7, LISTA', 'add $v1, $v1, $t0', 'addi $v0, $v0, 1',
                             'addi $a0, $a0, 4', 'bne $v0, $a1, OTRA', 'LISTA: jr $ra'], 0x00400060)
print('Problema 4'); print(f"  jal 0x004000C8 en 0x00400080 -> 0x{codifica('jal 0x004000C8'):08X}")
w = 0x0810001A; pc = 0x00400090
print(f'  0x{w:08X} en 0x{pc:08X} -> destino 0x{((pc + 4) & 0xF0000000) | ((w & 0x3FFFFFF) << 2):08X}')
print('Problema 5')
for pc, w in ((0, 0x8C8A0010), (0, 0x02A84022), (0x00400050, 0x1620FFFC), (0x00400200, 0x0810004E)):
    op, rs, rt, rd, sh, fn = w >> 26, (w >> 21) & 31, (w >> 16) & 31, (w >> 11) & 31, (w >> 6) & 31, w & 63
    inm = (w & 0xFFFF) - 0x10000 if w & 0x8000 else w & 0xFFFF       # C2 de 16 bits
    if op == 0:
        print(f'  0x{w:08X}: R  rs = {R_[rs]}, rt = {R_[rt]}, rd = {R_[rd]}, shamt = {sh}, funct = 0x{fn:02X}')
    elif op in (2, 3):
        print(f'  0x{w:08X}: J  op = {op}, destino = 0x{((pc + 4) & 0xF0000000) | ((w & 0x3FFFFFF) << 2):08X}')
    else:
        extra = f', destino = 0x{pc + 4 + 4 * inm:08X}' if op in (4, 5) else ''
        print(f'  0x{w:08X}: I  op = 0x{op:02X}, rs = {R_[rs]}, rt = {R_[rt]}, inmediato = {inm}{extra}')
print('Problema 6 (la cuestion)'); rutina(['PLATO: lw $t0, 4($s1)', 'slt $t2, $t0, $s2', 'beq $t2, $zero, CARO', 'addi $t3, $t3, 1',
                                         'j SIGUE', 'CARO: sw $t0, 0($s3)', 'SIGUE: addi $s1, $s1, 8', 'bne $s1, $s4, PLATO'], 0x00400100)
print('Pruebalo tu'); rutina(['MESA: lh $t1, 2($a0)', 'andi $t1, $t1, 0x00FF', 'bne $t1, $a1, OTRA', 'sb $t1, 0($a2)',
                              'OTRA: addi $a0, $a0, 4', 'beq $a0, $a3, FIN', 'j MESA', 'FIN: jr $ra'], 0x00400200)
