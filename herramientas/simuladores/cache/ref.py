"""Referencia: sim() de kit-papel/svg_p13.py y simv() de kit-papel/svg_p14.py, copiadas tal cual."""
def sim(seq, lines, words, ops=None, policy='directa'):
    cache, dirty, seen, rec, out = [None] * lines, [0] * lines, set(), [], []
    for k, d in enumerate(seq):
        op = ops[k] if ops else 'L'
        blk = d // (4 * words); li = blk % lines; tag = blk // lines
        if cache[li] == tag:
            t = 'acierto'
        else:
            t = 'obligatorio' if blk not in seen else 'capacidad' if blk not in rec[-lines:] else 'conflicto'
        load = not (op == 'E' and policy == 'directa')
        wb = False
        if t != 'acierto' and load:
            wb = bool(dirty[li]); cache[li], dirty[li] = tag, 0
        if op == 'E' and policy != 'directa':
            dirty[li] = 1
        if load:
            seen.add(blk)
            if blk in rec:
                rec.remove(blk)
            rec.append(blk)
        out.append(dict(d=d, blk=blk, li=li, tag=tag, w=(d // 4) % words, t=t, state=list(cache), dirty=list(dirty), op=op, wb=wb, load=load))
    return out

def simv(seq, lines, words, ways, policy='lru'):
    sets = lines // ways
    slots = [[None] * ways for _ in range(sets)]; order = [[] for _ in range(sets)]
    seen, rec, out = set(), [], []
    for d in seq:
        blk = d // (4 * words); st = blk % sets; ev = None
        sl, od = slots[st], order[st]
        if blk in sl:
            t = 'acierto'; way = sl.index(blk)
            if policy == 'lru':
                od.remove(blk); od.append(blk)
        else:
            t = 'obligatorio' if blk not in seen else ('capacidad' if blk not in rec[-lines:] else 'conflicto')
            if None in sl:
                way = sl.index(None)
            else:
                ev = od.pop(0); way = sl.index(ev)
            sl[way] = blk; od.append(blk)
        seen.add(blk)
        if blk in rec:
            rec.remove(blk)
        rec.append(blk)
        out.append(dict(d=d, blk=blk, set=st, tag=blk // sets, t=t, ev=ev, way=way, state=[list(x) for x in slots]))
    return out
