# SergioLearns — visualizador de algoritmos: arnés de Python (se ejecuta con Pyodide, CPython de verdad).
# sl_traza(json) -> json. Ejecuta el programa del lector con sys.settrace y devuelve los pasos:
#   línea que va a ejecutarse, pila de llamadas con sus variables, listas (con la identidad de cada elemento),
#   comparaciones hechas desde el paso anterior (las registra el propio elemento: SLInt/SLFloat/SLStr),
#   llamadas y valores devueltos (para el árbol) y lo que lleva escrito print().
# Los números de las listas literales del programa ([5, 2, 9]) se envuelven en SLInt/SLFloat/SLStr con ast:
# siguen siendo int/float/str de verdad (isinstance, aritmética, print, sort), pero cada uno sabe quién es.
import ast, io, json, sys

FN = '<sl>'
MAXL = 48        # elementos que se enseñan de una lista
MAXR = 70        # caracteres del repr de un valor


class _Rec:
    def __init__(self):
        self.cmp = []
        self.on = False


R = _Rec()


def _k(x):
    return getattr(x, '_sl', None)


def _mk(base, op, sym):
    f = getattr(base, op)

    def m(self, o):
        r = f(self, o)
        if R.on and r is not NotImplemented:
            R.cmp.append([_k(self), _k(o), sym, _pv(self), _pv(o), bool(r)])
        return r
    return m


def _cls(base, name):
    d = {'__hash__': base.__hash__}
    for op, sym in (('__lt__', '<'), ('__le__', '<='), ('__gt__', '>'), ('__ge__', '>='), ('__eq__', '=='), ('__ne__', '!=')):
        d[op] = _mk(base, op, sym)
    d['__repr__'] = lambda self: base.__repr__(self)
    d['__str__'] = lambda self: base.__str__(self)
    d['__format__'] = lambda self, spec: base.__format__(base(self), spec)
    d['__reduce__'] = lambda self: (base, (base(self),))
    return type(name, (base,), d)


SLInt = _cls(int, 'int')
SLFloat = _cls(float, 'float')
SLStr = _cls(str, 'str')
_seq = [0]


def _wrap(v):
    if isinstance(v, bool) or _k(v) is not None:
        return v
    if isinstance(v, int):
        t = SLInt
    elif isinstance(v, float):
        t = SLFloat
    elif isinstance(v, str):
        t = SLStr
    else:
        return v
    o = t(v)
    _seq[0] += 1
    o._sl = _seq[0]
    return o


def __sl_l(xs):
    return [_wrap(x) for x in xs]


class _Tr(ast.NodeTransformer):
    # [5, 2, -3, 7.5, 'Ana'] -> __sl_l([...]) (solo listas literales de constantes)
    def visit_List(self, node):
        self.generic_visit(node)
        if not node.elts or not isinstance(node.ctx, ast.Load):
            return node
        for e in node.elts:
            if isinstance(e, ast.Constant) and isinstance(e.value, (int, float, str)) and not isinstance(e.value, bool):
                continue
            if isinstance(e, ast.UnaryOp) and isinstance(e.op, ast.USub) and isinstance(e.operand, ast.Constant) and isinstance(e.operand.value, (int, float)):
                continue
            return node
        return ast.copy_location(ast.Call(func=ast.Name('__sl_l', ast.Load()), args=[node], keywords=[]), node)


def _pv(v):
    if isinstance(v, bool) or v is None:
        return repr(v)
    if isinstance(v, (int, float)):
        return repr(type(v).__mro__[-2](v)) if _k(v) is not None else repr(v)
    if isinstance(v, str):
        return repr(str(v))
    return None


class Stop(Exception):
    pass


class SinEntrada(Exception):
    pass


def _short(v):
    try:
        if isinstance(v, (list, tuple)):
            b = '[]' if isinstance(v, list) else '()'
            parts = []
            for x in v[:8]:
                p = _pv(x)
                parts.append(p if p is not None else _short(x))
            s = b[0] + ', '.join(parts) + (', …' if len(v) > 8 else '') + (',' if isinstance(v, tuple) and len(v) == 1 else '') + b[1]
        else:
            p = _pv(v)
            s = p if p is not None else repr(v)
    except Exception:
        s = '?'
    return s if len(s) <= MAXR else s[:MAXR - 1] + '…'


def sl_traza(q):
    q = json.loads(q)
    code = q['code']
    maxs = int(q.get('max', 4000))
    _seq[0] = 0
    R.cmp = []
    R.on = False
    out = io.StringIO()
    res = {'steps': [], 'calls': [], 'out': '', 'err': None, 'cut': False}
    try:
        tree = ast.parse(code, FN)
    except SyntaxError as e:
        res['err'] = {'t': 'SyntaxError', 'm': e.msg, 'l': e.lineno or 0, 'c': e.offset or 0}
        return json.dumps(res)
    tree = ast.fix_missing_locations(_Tr().visit(tree))
    try:
        cobj = compile(tree, FN, 'exec')
    except SyntaxError as e:
        res['err'] = {'t': 'SyntaxError', 'm': e.msg, 'l': e.lineno or 0, 'c': e.offset or 0}
        return json.dumps(res)

    def _sin_entrada(*a):
        raise SinEntrada('input()')
    g = {'__name__': '__main__', '__builtins__': __builtins__, '__sl_l': __sl_l, 'input': _sin_entrada}
    lids = {}       # id(lista) -> número
    keep = []       # mantiene vivas las listas vistas (que no se reutilice su id)
    lastc = {}      # número -> contenido enviado la última vez
    fid = {}        # id(frame) -> nodo del árbol
    nodes = res['calls']
    steps = res['steps']
    st = {'n': 0}

    def lref(v):
        i = lids.get(id(v))
        if i is None:
            i = len(lids) + 1
            lids[id(v)] = i
            keep.append(v)
        return i

    def val(v):
        if isinstance(v, list) and all(isinstance(x, (int, float, str)) and not isinstance(x, bool) for x in v[:MAXL]):
            return {'L': lref(v)}
        return _short(v)

    def frames(f):
        fs = []
        while f is not None:
            if f.f_code.co_filename == FN:
                fs.append(f)
            f = f.f_back
        fs.reverse()
        return fs

    def snap(f, ev, extra=None, fs=None):
        if f is not None:
            if st['n'] >= maxs:
                res['cut'] = True
                raise Stop()
            fs = frames(f)
        st['n'] += 1
        stack = []
        seen = set()
        for fr in fs:
            if fr.f_code.co_name == '<module>':
                loc = {k: v for k, v in fr.f_locals.items() if not k.startswith('__') and not callable(v) and not isinstance(v, type(sys))}
                name = None
            else:
                loc = dict(fr.f_locals)
                name = fr.f_code.co_name
            vs = []
            for k, v in loc.items():
                vs.append([k, val(v)])
                if isinstance(v, list):
                    seen.add(id(v))
            stack.append({'f': name, 'v': vs, 'n': fid.get(id(fr))})
        # contenido de las listas que han cambiado
        ch = {}
        for i, lst in enumerate(keep):
            n = lids[id(lst)]
            c = [[_k(x), _pv(x) if _pv(x) is not None else _short(x)] for x in lst[:MAXL]]
            if len(lst) > MAXL:
                c.append([None, '…'])
            if lastc.get(n) != c:
                lastc[n] = c
                ch[n] = c
        s = {'l': f.f_lineno if f is not None else (extra or {}).get('l', 0), 'e': ev, 's': stack, 'o': len(out.getvalue())}
        if ch:
            s['c'] = ch
        if R.cmp:
            s['k'] = R.cmp
            R.cmp = []
        if extra:
            s.update(extra)
        steps.append(s)

    def tracer(f, ev, arg):
        if f.f_code.co_filename != FN:
            return None
        R.on = False
        try:
            if ev == 'call':
                if not f.f_code.co_name.startswith('<'):
                    par = None
                    b = f.f_back
                    while b is not None and b.f_code.co_filename != FN:
                        b = b.f_back
                    if b is not None:
                        par = fid.get(id(b))
                    a = [[k, _short(f.f_locals[k])] for k in f.f_code.co_varnames[:f.f_code.co_argcount] if k in f.f_locals]
                    nid = len(nodes)
                    nodes.append({'f': f.f_code.co_name, 'a': a, 'p': par, 's': st['n'], 'r': None, 'e': None})
                    fid[id(f)] = nid
                    snap(f, 'call', {'n': nid})
            elif ev == 'line':
                snap(f, 'line')
            elif ev == 'return':
                nid = fid.get(id(f))
                if nid is not None:
                    nodes[nid]['r'] = _short(arg)
                    snap(f, 'ret', {'n': nid, 'r': _short(arg)})
                    nodes[nid]['e'] = st['n'] - 1
        finally:
            R.on = True
        return tracer

    old = sys.stdout
    sys.stdout = out
    lim = sys.getrecursionlimit()
    sys.setrecursionlimit(150)
    try:
        sys.settrace(tracer)
        R.on = True
        exec(cobj, g)
    except Stop:
        pass
    except BaseException as e:
        tb = sys.exc_info()[2]
        res['err'] = {'t': type(e).__name__, 'm': 'maximum recursion depth exceeded' if isinstance(e, RecursionError) else str(e), 'l': _errline(tb), 'c': 0}
        tbs = []
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == FN:
                tbs.append(tb.tb_frame)
            tb = tb.tb_next
        res['_fs'] = tbs[:60] + tbs[-20:] if len(tbs) > 80 else tbs
    finally:
        sys.settrace(None)
        R.on = False
        sys.stdout = old
        sys.setrecursionlimit(lim)
    # paso final: cómo queda todo al terminar (o en el error)
    if not res['cut']:
        try:
            if res['err']:
                fs = res.pop('_fs', None) or []
                snap(None, 'err', {'l': res['err']['l']}, fs)
            else:
                class _M:
                    pass
                m = _M()
                m.f_locals = g
                m.f_code = type('C', (), {'co_name': '<module>'})()
                snap(None, 'end', {'l': 0}, [m])
        except Exception:
            pass
    res.pop('_fs', None)
    res['out'] = out.getvalue()[:20000]
    return json.dumps(res, ensure_ascii=False)


def _errline(tb):
    # la línea más profunda del programa (si es la del def, la de la llamada: pasa con RecursionError)
    ls = []
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == FN:
            ls.append((tb.tb_lineno, tb.tb_frame.f_code.co_firstlineno, tb.tb_frame.f_code.co_name))
        tb = tb.tb_next
    for ln, first, name in reversed(ls):
        if not (ln == first and name != '<module>'):
            return ln
    return ls[-1][0] if ls else 0
