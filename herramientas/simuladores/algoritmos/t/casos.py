# genera t/casos.json: programas (ES y EN) con datos al azar y lo que deben dar
import json, random, re, sys, os
sys.path.insert(0, os.path.dirname(__file__)); from ref import *
random.seed(7)
EX = json.load(open(os.path.join(os.path.dirname(__file__), '..', 'src', 'ejemplos.json')))
by = {e['k']: e for e in EX}
def setp(code, name, val): return re.sub(r'^' + name + r'\s*=.*$', name + ' = ' + val, code, count=1, flags=re.M)
out = []
for it in range(60):
    for k, e in by.items():
        li = it % 2; code = e['py'][li]; P = {p[0]: p[li] for p in e['p']}
        exp = {}
        if any(p[2] == 'list' for p in e['p']):
            n = random.randint(1, 16)
            l = sorted(random.sample(range(1, 100), n)) if e['s'] else [random.randint(-5, 30) for _ in range(n)]
            code = setp(code, P[[p[0] for p in e['p'] if p[2] == 'list'][0]], str(l))
            if 'buscado' in P:
                x = random.choice(l) if random.random() < .7 else random.randint(0, 100); code = setp(code, P['buscado'], str(x))
            fn = {'busqueda-lineal': lambda: c_lineal(l, x), 'busqueda-binaria': lambda: c_binaria(l, x), 'binaria-recursiva': lambda: c_binaria(l, x),
                  'burbuja': lambda: c_burbuja(l), 'seleccion': lambda: c_seleccion(l), 'insercion': lambda: c_insercion(l),
                  'mezcla': lambda: c_mezcla(l)[1], 'rapida': lambda: c_rapida(l)}[k]
            exp['cmp'] = fn()
        else:
            if k == 'fibonacci': n = random.randint(0, 9); code = setp(code, 'n', str(n)); exp['calls'] = fib_calls(n)
            elif k == 'factorial': n = random.randint(0, 12); code = setp(code, 'n', str(n)); exp['calls'] = n + 1
            elif k == 'hanoi': n = random.randint(0, 5); code = setp(code, 'n', str(n)); exp['calls'] = 2 ** (n + 1) - 1
            elif k == 'potencia-doble': ex_ = random.randint(0, 20); code = setp(code, 'exp', str(ex_)); exp['calls'] = pot_calls(ex_)
            elif k == 'potencia-rapida': ex_ = random.randint(0, 20); code = setp(code, 'exp', str(ex_)); exp['calls'] = (ex_.bit_length() + 1)
        # la salida, con CPython sin trazar
        import io, contextlib
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf): exec(compile(code, 'x', 'exec'), {'__name__': '__main__'})
        exp['out'] = buf.getvalue()
        out.append({'k': k, 'li': li, 'code': code, 'exp': exp})
json.dump(out, open(os.path.join(os.path.dirname(__file__), 'casos.json'), 'w'), ensure_ascii=False)
print(len(out), 'casos')
