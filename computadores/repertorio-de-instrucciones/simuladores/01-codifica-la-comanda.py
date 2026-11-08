# Compruébalo con Python · Codificar la cuenta de la mesa en formatos R, I y J
# Del artículo «Repertorio de instrucciones de MIPS — teoría con la comanda de un restaurante, formatos R, I y J en hexadecimal (y el add que escribí al revés)»
# https://sergiolearns.com/repertorio-de-instrucciones/

# Codifica la cuenta de la mesa 3 (formatos R, I y J de MIPS) y la pasa a hexadecimal
REG = {'$zero': 0, '$t0': 8, '$t1': 9, '$t2': 10, '$s0': 16}
FUNCT = {'add': 0x20, 'srl': 0x02}                  # formato R: op = 0 y la operacion va en funct
OP = {'lui': 0x0F, 'lw': 0x23, 'beq': 0x04, 'addi': 0x08, 'j': 0x02}

def tipo_r(rs, rt, rd, shamt, funct):           # 6 | 5 | 5 | 5 | 5 | 6 bits
    return (0 << 26) | (rs << 21) | (rt << 16) | (rd << 11) | (shamt << 6) | funct

def tipo_i(op, rs, rt, inm):                    # 6 | 5 | 5 | 16 bits
    return (op << 26) | (rs << 21) | (rt << 16) | (inm & 0xFFFF)   # & 0xFFFF: el C2 de 16 bits

def tipo_j(op, destino):                        # 6 | 26 bits
    return (op << 26) | ((destino >> 2) & 0x3FFFFFF)   # quita los 2 bits bajos y los 4 altos

main, bucle, fin = 0x00400024, 0x0040002C, 0x00400040
cuenta = [
    (main,       'lui  $s0, 0x1001',     tipo_i(OP['lui'], 0, REG['$s0'], 0x1001)),
    (0x00400028, 'add  $t1, $zero, $zero', tipo_r(REG['$zero'], REG['$zero'], REG['$t1'], 0, FUNCT['add'])),
    (bucle,      'lw   $t0, 0($s0)',     tipo_i(OP['lw'], REG['$s0'], REG['$t0'], 0)),
    (0x00400030, 'beq  $t0, $zero, fin', tipo_i(OP['beq'], REG['$t0'], REG['$zero'], (fin - (0x00400030 + 4)) // 4)),
    (0x00400034, 'add  $t1, $t1, $t0',   tipo_r(REG['$t1'], REG['$t0'], REG['$t1'], 0, FUNCT['add'])),
    (0x00400038, 'addi $s0, $s0, 4',     tipo_i(OP['addi'], REG['$s0'], REG['$s0'], 4)),
    (0x0040003C, 'j    bucle',           tipo_j(OP['j'], bucle)),
    (fin,        'srl  $t2, $t1, 3',     tipo_r(0, REG['$t1'], REG['$t2'], 3, FUNCT['srl'])),
]
print('direccion   instruccion             binario (grupos de 4)                     hex')
for dir_, texto, w in cuenta:
    b = format(w, '032b')
    grupos = ' '.join(b[k:k + 4] for k in range(0, 32, 4))
    print(f'0x{dir_:08X}  {texto:22}  {grupos}  0x{w:08X}')
desp = (fin - (0x00400030 + 4)) // 4
print(f'\nbeq: destino 0x{fin:08X}, PC + 4 = 0x{0x00400030 + 4:08X}, desplazamiento = {desp} palabras')
print(f'j: 0x{bucle:08X} >> 2 = 0x{bucle >> 2:07X} -> 26 bits')
