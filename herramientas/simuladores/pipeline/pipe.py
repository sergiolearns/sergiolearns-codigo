"""pipe.py: el MIPS segmentado de 5 etapas de los apuntes (T5), para el tema de papel 11 de IC1 (Segmentación).
Reutilizable: los diagramas (svg_p11.py) y los scripts de comprobación sacan de aquí las mismas cuentas.

Modelo (el de los apuntes y el libro de Patterson y Hennessy):
- IF, ID, EX, MEM, WB, una etapa por ciclo. El banco de registros escribe en la 1.ª mitad del ciclo y lee en la 2.ª:
  la instrucción que está en ID puede leer el dato que otra escribe en WB ese mismo ciclo.
- Sin anticipación: quien lee un registro tiene su ID en el ciclo del WB del productor o después.
- Con anticipación (EX/MEM y MEM/WB → entradas de la ALU): el dato de una instrucción de la ALU está listo al final de su
  EX y el de un lw al final de su MEM; el consumidor lo necesita al empezar su EX. lw seguido de su uso: 1 burbuja.
- Los saltos condicionales comparan y calculan el destino en ID (apuntes). Necesitan sus registros en ID: con anticipación,
  1 burbuja si el dato sale de la ALU justo antes y 2 si sale de un lw justo antes; sin anticipación, esperar al WB.
- Saltos: 'parar' (siempre 1 burbuja tras un salto condicional) o 'nosaltar' (predecir que no salta: 1 ciclo perdido solo
  si salta; la instrucción buscada se tira). j se resuelve en ID: siempre 1 ciclo perdido.
- Las burbujas se dibujan como en los apuntes: entre el IF y el ID de la instrucción que espera.
"""
import re

R3 = {'add', 'addu', 'sub', 'subu', 'and', 'or', 'nor', 'slt', 'sltu', 'xor'}
I2 = {'addi', 'addiu', 'andi', 'ori', 'slti', 'xori'}


def parse(s):
    """'lw $t0, 0($s0)' -> dict(op, dest, srcs, load, store, branch, jump, txt)."""
    t = s.split('#')[0].strip()
    lab = None
    if ':' in t:
        lab, t = [x.strip() for x in t.split(':', 1)]
    op = t.split()[0] if t else 'nop'
    regs = re.findall(r'\$\w+', t)
    d = dict(op=op, dest=None, srcs=[], load=False, store=False, branch=False, jump=False, txt=t, label=lab, target=None)
    if op in R3:
        d['dest'], d['srcs'] = regs[0], regs[1:3]
    elif op in I2 or op == 'sll' or op == 'srl':
        d['dest'], d['srcs'] = regs[0], regs[1:2]
    elif op == 'lui':
        d['dest'] = regs[0]
    elif op == 'lw':
        d['dest'], d['srcs'], d['load'] = regs[0], regs[1:2], True
    elif op == 'sw':
        d['srcs'], d['store'] = regs[0:2], True
    elif op in ('beq', 'bne'):
        d['srcs'], d['branch'], d['target'] = regs[0:2], True, t.split(',')[-1].strip()
    elif op in ('j', 'jal'):
        d['jump'], d['target'] = True, t.split()[-1]
    d['srcs'] = [r for r in d['srcs'] if r not in ('$zero', '$0')]
    if d['dest'] in ('$zero', '$0'):
        d['dest'] = None
    return d


def schedule(prog, fwd=True, ctrl='nosaltar', taken=None):
    """prog: lista de instrucciones (texto) en el orden en que SE EJECUTAN (traza dinámica).
    taken: conjunto de índices de los saltos que saltan (para 'nosaltar').
    Devuelve una lista de filas: dict(txt, IF, ID, EX, MEM, WB, stall, why, flushed) con los ciclos (desde 1)."""
    taken = taken or set()
    rows = []
    nextIF = 1
    for i, s in enumerate(prog):
        d = parse(s)
        IF = nextIF
        ID = IF + 1
        why = []; deps = []
        for r in d['srcs']:
            # el productor más reciente de r
            for p in reversed(rows):
                if p.get('flushed'):
                    continue
                if p['dest'] == r:
                    if not fwd:
                        need = p['WB']                        # leer en ID el mismo ciclo del WB (1.ª mitad / 2.ª mitad)
                    else:
                        ready = (p['MEM'] if p['load'] else p['EX']) + 1   # ciclo en que ya está en EX/MEM o MEM/WB
                        need = ready if d['branch'] else ready - 1        # el salto lo quiere en ID; los demás, en EX
                    if need > ID:
                        why.append((r, p['n'], need - ID))
                        ID = need
                    deps.append((r, p['n'], p))
                    break
        row = dict(n=i, txt=d['txt'], op=d['op'], dest=d['dest'], load=d['load'], IF=IF, ID=ID, EX=ID + 1, MEM=ID + 2,
                   WB=ID + 3, stall=ID - IF - 1, why=why, branch=d['branch'], jump=d['jump'], flushed=False)
        # de dónde sale cada operando: 'EX/MEM', 'MEM/WB' (anticipación) o 'banco' (ya escrito)
        use = ID if d['branch'] else ID + 1
        row['src'] = []
        for r, pn, p in deps:
            if not fwd or ID >= p['WB']:
                path = 'banco'
            elif use == p['EX'] + 1:
                path = 'EX/MEM'
            else:
                path = 'MEM/WB'
            row['src'].append((r, pn, path))
        rows.append(row)
        nextIF = ID   # la siguiente se busca cuando esta pasa a ID
        if d['branch'] and ctrl == 'parar':
            row['ctrl'] = 1; nextIF = ID + 1
        elif (d['branch'] and i in taken) or d['jump']:
            # se buscó la siguiente (mal) y se tira: un ciclo perdido
            rows.append(dict(n=None, txt='(buscada y tirada)', op='flush', dest=None, load=False, IF=ID, ID=None, EX=None,
                             MEM=None, WB=None, stall=0, why=[], branch=False, jump=False, flushed=True))
            row['ctrl'] = 1; nextIF = ID + 1
    return rows


def total(rows):
    return max(r['WB'] for r in rows if not r['flushed'])


def stalls(rows):
    return sum(r['stall'] for r in rows if not r['flushed']), sum(r.get('ctrl', 0) for r in rows)


def ascii(rows, w=None, names=('IF', 'ID', 'EX', 'ME', 'WB'), bub='--', flush='xx'):
    """Diagrama de varios ciclos en texto (columnas de 3 caracteres)."""
    n = total(rows)
    w = w or max(len(r['txt']) for r in rows) + 2
    out = [' ' * w + ''.join(f'{c:<3}' for c in range(1, n + 1)).rstrip()]
    for r in rows:
        cells = ['  '] * (n + 1)
        if r['flushed']:
            cells[r['IF']] = 'IF'
            if r['IF'] + 1 <= n:
                cells[r['IF'] + 1] = flush
        else:
            for k, c in zip(('IF', 'ID', 'EX', 'MEM', 'WB'), names):
                cells[r[k]] = c
            for c in range(r['IF'] + 1, r['ID']):
                cells[c] = bub
        out.append(r['txt'].ljust(w) + ''.join(f'{x:<3}' for x in cells[1:]).rstrip())
    return '\n'.join(out)


def snapshot(rows, c):
    """Qué instrucción hay en cada etapa en el ciclo c."""
    st = {}
    for r in rows:
        if r['flushed']:
            continue
        for k in ('IF', 'ID', 'EX', 'MEM', 'WB'):
            if r[k] == c:
                st[k] = r['txt']
        if r['IF'] < c < r['ID']:
            st['ID'] = r['txt'] + ' (espera)'
    return st


def unroll(prog, iters, cond_taken=True):
    """Traza dinámica de un bucle: prog es el cuerpo (el último es el salto hacia atrás) y después lo que sigue.
    Devuelve (traza, índices de los saltos que saltan)."""
    body, after = prog
    tr = []; tk = set()
    for k in range(iters):
        tr += body
        if k < iters - 1:
            tk.add(len(tr) - 1)
    tr += after
    return tr, tk


if __name__ == '__main__':
    # pruebas con los ejemplos de los apuntes
    a = ['add $s0, $t0, $t1', 'sub $t2, $s0, $t3']
    assert schedule(a, fwd=False)[1]['ID'] == 5 and total(schedule(a, fwd=False)) == 8
    assert total(schedule(a)) == 6
    b = ['lw $s0, 20($t1)', 'sub $t2, $s0, $t3']
    assert schedule(b)[1]['stall'] == 1
    orig = ['lw $t1, 0($t0)', 'lw $t2, 4($t0)', 'add $t3, $t1, $t2', 'sw $t3, 12($t0)', 'lw $t4, 8($t0)',
            'add $t5, $t1, $t4', 'sw $t5, 16($t0)']
    reord = ['lw $t1, 0($t0)', 'lw $t2, 4($t0)', 'lw $t4, 8($t0)', 'add $t3, $t1, $t2', 'sw $t3, 12($t0)',
             'add $t5, $t1, $t4', 'sw $t5, 16($t0)']
    assert total(schedule(orig)) == 13 and total(schedule(reord)) == 11, (total(schedule(orig)), total(schedule(reord)))
    loop = ['Loop: lw $t0, 0($t1)', 'add $t2, $t2, $t0', 'addi $t1, $t1, 4', 'addi $s3, $s3, -1', 'bne $s3, $0, Loop', 'sw $t2, 0($t1)']
    r = schedule(loop)
    assert [x['stall'] for x in r] == [0, 1, 0, 0, 1, 0], [x['stall'] for x in r]
    loop2 = ['Loop: lw $t0, 0($t1)', 'addi $s3, $s3, -1', 'add $t2, $t2, $t0', 'addi $t1, $t1, 4', 'bne $s3, $0, Loop', 'sw $t2, 0($t1)']
    assert sum(x['stall'] for x in schedule(loop2)) == 0
    c = ['add $4, $5, $6', 'beq $1, $2, 40', 'or $7, $8, $9']
    assert schedule(c, ctrl='parar')[2]['IF'] == 4
    assert schedule(c, ctrl='nosaltar', taken={1})[3]['IF'] == 4
    assert schedule(c, ctrl='nosaltar')[2]['IF'] == 3
    print(ascii(schedule(orig)))
    print('ok')
