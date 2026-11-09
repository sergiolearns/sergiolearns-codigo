"""Codificador/decodificador MIPS (convención de los apuntes: saltos relativos a PC + 4)."""
REG = ['$zero','$at','$v0','$v1','$a0','$a1','$a2','$a3'] + [f'$t{i}' for i in range(8)] + [f'$s{i}' for i in range(8)] + ['$t8','$t9','$k0','$k1','$gp','$sp','$fp','$ra']
RN = {r: i for i, r in enumerate(REG)}
FUN = {'add': 0x20, 'addu': 0x21, 'sub': 0x22, 'and': 0x24, 'or': 0x25, 'nor': 0x27, 'slt': 0x2A, 'sll': 0, 'srl': 2, 'sra': 3, 'jr': 8}
OPI = {'addi': 8, 'addiu': 9, 'slti': 0xA, 'andi': 0xC, 'ori': 0xD, 'lui': 0xF, 'lb': 0x20, 'lh': 0x21, 'lw': 0x23, 'lbu': 0x24, 'sb': 0x28, 'sh': 0x29, 'sw': 0x2B, 'beq': 4, 'bne': 5}
OPJ = {'j': 2, 'jal': 3}
def r(op_, rs, rt, rd, sh, fn): return (op_ << 26) | (rs << 21) | (rt << 16) | (rd << 11) | (sh << 6) | fn
def i(op_, rs, rt, im): return (op_ << 26) | (rs << 21) | (rt << 16) | (im & 0xFFFF)
def enc(ins, pc=0, lab=None):
    lab = lab or {}
    m, *a = ins.replace(',', ' ').replace('(', ' ').replace(')', ' ').split()
    if m in ('sll', 'srl', 'sra'): return r(0, 0, RN[a[1]], RN[a[0]], int(a[2], 0), FUN[m])
    if m == 'jr': return r(0, RN[a[0]], 0, 0, 0, 8)
    if m in FUN: return r(0, RN[a[1]], RN[a[2]], RN[a[0]], 0, FUN[m])
    if m in ('beq', 'bne'):
        t = lab[a[2]] if a[2] in lab else int(a[2], 0)
        return i(OPI[m], RN[a[0]], RN[a[1]], (t - (pc + 4)) // 4)
    if m == 'lui': return i(15, 0, RN[a[0]], int(a[1], 0))
    if m in ('lb', 'lh', 'lw', 'lbu', 'sb', 'sh', 'sw'): return i(OPI[m], RN[a[2]], RN[a[0]], int(a[1], 0))
    if m in OPI: return i(OPI[m], RN[a[1]], RN[a[0]], int(a[2], 0))
    if m in OPJ:
        t = lab[a[0]] if a[0] in lab else int(a[0], 0)
        return (OPJ[m] << 26) | ((t >> 2) & 0x3FFFFFF)
def fields(w):
    return dict(op=w >> 26, rs=(w >> 21) & 31, rt=(w >> 16) & 31, rd=(w >> 11) & 31, sh=(w >> 6) & 31, fn=w & 63, im=w & 0xFFFF, dst=w & 0x3FFFFFF)
def sx(x): return x - 0x10000 if x & 0x8000 else x
def dec(w, pc=0):
    f = fields(w); o = f['op']
    if o == 0:
        n = {v: k for k, v in FUN.items()}[f['fn']]
        if n in ('sll', 'srl', 'sra'): return f"{n} {REG[f['rd']]}, {REG[f['rt']]}, {f['sh']}"
        if n == 'jr': return f"jr {REG[f['rs']]}"
        return f"{n} {REG[f['rd']]}, {REG[f['rs']]}, {REG[f['rt']]}"
    if o in (2, 3): return f"{'j' if o == 2 else 'jal'} 0x{((pc + 4) & 0xF0000000) | (f['dst'] << 2):08X}"
    n = {v: k for k, v in OPI.items()}[o]
    if n in ('beq', 'bne'): return f"{n} {REG[f['rs']]}, {REG[f['rt']]}, 0x{pc + 4 + 4 * sx(f['im']):08X}"
    if n in ('lb', 'lh', 'lw', 'lbu', 'sb', 'sh', 'sw'): return f"{n} {REG[f['rt']]}, {sx(f['im'])}({REG[f['rs']]})"
    if n == 'lui': return f"lui {REG[f['rt']]}, 0x{f['im']:04X}"
    return f"{n} {REG[f['rt']]}, {REG[f['rs']]}, {sx(f['im'])}"
def prog(lines, base):
    lab = {}; pc = base; ins = []
    for l in lines:
        if ':' in l: k, l = l.split(':'); lab[k.strip()] = pc; l = l.strip()
        if l: ins.append((pc, l)); pc += 4
    return [(pc, l, enc(l, pc, lab)) for pc, l in ins], lab
