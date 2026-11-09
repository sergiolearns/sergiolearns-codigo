"""Ruta de datos monociclo de MIPS (apuntes, T5): ejecuta UNA instrucción ya codificada y devuelve el valor
de cada cable y de cada señal de control. Reutilizable en el tema 10 (unidad de control).
Convenciones: saltos desde PC + 4 (regla de los apuntes); ALUOp 00 sumar, 01 restar, 10 funct, 11 slt (solo
en la RD ampliada con slti); X = no importa. Ampliaciones opcionales: 'bne' (señal BranchNE), 'jal' (señal Link)
y 'slti' (ALUOp = 11)."""
import sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from isa import fields, sx, REG, dec

M32 = 0xFFFFFFFF
FUNCT = {0x20: 'add', 0x22: 'sub', 0x24: 'and', 0x25: 'or', 0x27: 'nor', 0x2A: 'slt'}
NOMBRE_OP = {0: 'R', 0x23: 'lw', 0x2B: 'sw', 4: 'beq', 2: 'j', 5: 'bne', 3: 'jal', 0xA: 'slti'}
SEN = ['RegDst', 'ALUSrc', 'MemtoReg', 'RegWrite', 'MemRead', 'MemWrite', 'Branch', 'ALUOp', 'Jump']
TABLA = {   # apuntes, «Diseño de la UC: implementación» (ALUOp escrito como ALUOp1 ALUOp0)
    'R':   dict(RegDst='1', ALUSrc='0', MemtoReg='0', RegWrite='1', MemRead='0', MemWrite='0', Branch='0', ALUOp='10', Jump='0'),
    'lw':  dict(RegDst='0', ALUSrc='1', MemtoReg='1', RegWrite='1', MemRead='1', MemWrite='0', Branch='0', ALUOp='00', Jump='0'),
    'sw':  dict(RegDst='X', ALUSrc='1', MemtoReg='X', RegWrite='0', MemRead='0', MemWrite='1', Branch='0', ALUOp='00', Jump='0'),
    'beq': dict(RegDst='X', ALUSrc='0', MemtoReg='X', RegWrite='0', MemRead='0', MemWrite='0', Branch='1', ALUOp='01', Jump='0'),
    'j':   dict(RegDst='X', ALUSrc='X', MemtoReg='X', RegWrite='0', MemRead='0', MemWrite='0', Branch='X', ALUOp='XX', Jump='1'),
}
# RD ampliada (práctica, problemas 5 y 6)
TABLA['bne'] = dict(TABLA['beq'], Branch='0', BranchNE='1')
TABLA['slti'] = dict(TABLA['lw'], MemtoReg='0', MemRead='0', ALUOp='11')
TABLA['jal'] = dict(TABLA['j'], RegWrite='1', Link='1', BranchNE='X')
for k in ('R', 'lw', 'sw', 'beq', 'j', 'slti'):
    TABLA[k].setdefault('BranchNE', '0' if k != 'j' else 'X')
for k in TABLA:
    if 'Link' not in TABLA[k]:
        TABLA[k]['Link'] = '0' if TABLA[k]['RegWrite'] == '1' else 'X'

def alu(a, b, ctl):
    if ctl == 'add': return (a + b) & M32
    if ctl == 'sub': return (a - b) & M32
    if ctl == 'and': return a & b
    if ctl == 'or': return a | b
    if ctl == 'nor': return ~(a | b) & M32
    if ctl == 'slt':
        s = lambda x: x - (1 << 32) if x & 0x80000000 else x
        return 1 if s(a) < s(b) else 0

def paso(pc, w, reg, mem):
    """Ejecuta la palabra w en la dirección pc. reg: lista de 32 enteros; mem: dict dirección → palabra.
    Devuelve (cables, señales) y actualiza reg y mem como lo haría el flanco de reloj."""
    f = fields(w); op = f['op']; tipo = NOMBRE_OP[op]; s = TABLA[tipo]
    c = {'PC': pc, 'Instruccion': w, 'op': op, 'rs': f['rs'], 'rt': f['rt'], 'rd': f['rd'], 'shamt': f['sh'],
         'funct': f['fn'], 'inm16': f['im'], 'dest26': f['dst']}
    c['PC+4'] = (pc + 4) & M32
    c['Dato1'] = reg[f['rs']]; c['Dato2'] = reg[f['rt']]
    c['ExtSigno'] = sx(f['im']) & M32
    c['RegEscribir'] = f['rd'] if s['RegDst'] == '1' else f['rt']
    if s.get('Link') == '1': c['RegEscribir'] = 31
    c['B'] = c['ExtSigno'] if s['ALUSrc'] == '1' else c['Dato2']
    ctl = {'00': 'add', '01': 'sub', '11': 'slt'}.get(s['ALUOp']) or FUNCT.get(f['fn'], 'add')
    c['OperacionALU'] = ctl
    c['ResultadoALU'] = alu(c['Dato1'], c['B'], ctl); c['Zero'] = int(c['ResultadoALU'] == 0)
    c['DestinoBeq'] = (c['PC+4'] + (c['ExtSigno'] << 2)) & M32
    c['DireccionJ'] = (c['PC+4'] & 0xF0000000) | (f['dst'] << 2)
    c['DatoLeidoMem'] = mem.get(c['ResultadoALU'], 0) if s['MemRead'] == '1' else None
    c['DatoEscribir'] = c['DatoLeidoMem'] if s['MemtoReg'] == '1' else c['ResultadoALU']
    if s.get('Link') == '1': c['DatoEscribir'] = c['PC+4']
    c['PCSrc'] = int((s['Branch'] == '1' and c['Zero'] == 1) or (s.get('BranchNE') == '1' and c['Zero'] == 0))
    c['PCtrasBeq'] = c['DestinoBeq'] if c['PCSrc'] else c['PC+4']
    c['PCsiguiente'] = c['DireccionJ'] if s['Jump'] == '1' else c['PCtrasBeq']
    # flanco de reloj: se escriben los elementos de estado
    if s['RegWrite'] == '1' and c['RegEscribir'] != 0: reg[c['RegEscribir']] = c['DatoEscribir']
    if s['MemWrite'] == '1': mem[c['ResultadoALU']] = c['Dato2']
    return c, s

# Retardos de la práctica y de los ejercicios (ps): bloques que recorre cada instrucción en serie
def tiempo(ret, tipo):
    camino = {'R': ['MI', 'Reg', 'ALU', 'Esc'], 'lw': ['MI', 'Reg', 'ALU', 'MD', 'Esc'], 'sw': ['MI', 'Reg', 'ALU', 'MD'],
              'beq': ['MI', 'Reg', 'ALU'], 'j': ['MI']}[tipo]
    return sum(ret[b] for b in camino), camino

if __name__ == '__main__':
    from isa import prog
    rutina, lab = prog(['VENDE: lw $t0, 8($s0)', 'sub $t0, $t0, $a0', 'sw $t0, 8($s0)', 'beq $t0, $zero, LLENO', 'j VENDE', 'LLENO: sll $zero, $zero, 0'], 0x00400000)
    reg = [0] * 32; reg[16] = 0x10010000; reg[4] = 4; mem = {0x10010008: 120}
    pc = 0x00400000
    for _ in range(6):
        w = dict((p, x) for p, l, x in rutina)[pc]
        c, s = paso(pc, w, reg, mem)
        print(f'{pc:08X} {w:08X} {dec(w, pc):24s}', {k: (hex(v) if isinstance(v, int) else v) for k, v in c.items() if k in ('Dato1', 'Dato2', 'B', 'ResultadoALU', 'Zero', 'DatoEscribir', 'RegEscribir', 'PCsiguiente')})
        pc = c['PCsiguiente']
