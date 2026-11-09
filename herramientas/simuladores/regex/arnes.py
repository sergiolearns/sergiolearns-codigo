# SergioLearns — probador de expresiones regulares: arnés de Python (se ejecuta en Pyodide; también en CPython para las pruebas)
# Entrada: dict {re, flags: ["I","M","S","X","A"], rep, text, retos: [textos]}; salida: dict serializable a JSON.
import re, json

_FL = {"I": re.IGNORECASE, "M": re.MULTILINE, "S": re.DOTALL, "X": re.VERBOSE, "A": re.ASCII}
LIM = 200  # coincidencias como mucho


def _m(m):
    if m is None:
        return None
    g = []
    for i in range(1, (m.re.groups or 0) + 1):
        s, e = m.span(i)
        g.append(None if s < 0 else [s, e, m.group(i)])
    return {"s": m.start(), "e": m.end(), "t": m.group(0), "g": g}


def sl_regex(q):
    out = {"ok": True}
    fl = 0
    for f in q.get("flags", []):
        fl |= _FL.get(f, 0)
    try:
        p = re.compile(q["re"], fl)
    except re.error as e:
        return {"ok": False, "msg": e.msg, "pos": e.pos, "full": "re.error: " + str(e)}
    except (OverflowError, RecursionError, ValueError) as e:
        return {"ok": False, "msg": str(e), "pos": None, "full": type(e).__name__ + ": " + str(e)}
    t = q.get("text", "")
    out["ng"] = p.groups
    out["names"] = {k: v for k, v in p.groupindex.items()}
    out["match"] = _m(p.match(t))
    out["search"] = _m(p.search(t))
    out["fullmatch"] = _m(p.fullmatch(t))
    it, n = [], 0
    for m in p.finditer(t):
        n += 1
        if n > LIM:
            out["mas"] = True
            break
        it.append(_m(m))
    out["finditer"] = it
    out["findall"] = repr(p.findall(t)) if not out.get("mas") else None
    rep = q.get("rep")
    if rep is not None:
        try:
            r, k = p.subn(rep, t)
            out["sub"] = {"t": r, "n": k}
        except (re.error, IndexError) as e:
            out["sub"] = {"err": type(e).__name__ + ": " + str(e)}
    out["split"] = p.split(t)
    out["retos"] = [p.fullmatch(x) is not None for x in q.get("retos", [])]
    return out


def sl_regex_json(s):
    return json.dumps(sl_regex(json.loads(s)), ensure_ascii=False)
