import subprocess, hashlib
import os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'   # herramientas/simuladores/
def mini(args, inp):
    return subprocess.run(['npx', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(R + p).read()
css = mini(['--loader=css'], rd('planifica/sim.css') + rd('planifica/page.css'))
css2 = mini(['--loader=css'], rd('comun/sim2.css'))
J = lambda *ps: mini(['--loader=js', '--target=es2017'], '\n'.join(rd(p) for p in ps))
js = J('planifica/engine.js', 'planifica/ui.js')
kit = J('comun/kit.js'); pg = J('paginas/engine.js', 'paginas/ui.js'); sn = J('subredes/engine.js', 'subredes/ui.js'); pk = J('paquete/engine.js', 'paquete/ui.js')
t = rd('comun/simuladores.tpl.php')
for k, v in [('__SL6_CSS2__', css2), ('__SL6_CSS__', css), ('__SL6_JS__', js), ('__SL6_KIT__', kit), ('__SL6_PG__', pg), ('__SL6_SN__', sn), ('__SL6_PK__', pk)]:
    assert t.count(k) == 1, k
    for bad in ['SL6CSS', 'SL6JS', 'SL6KIT', 'SL6PG', 'SL6SN', 'SL6PK']:
        assert bad not in v, (k, bad)
    t = t.replace(k, v)
open(R + 'comun/sergiolearns-simuladores.php', 'w').write(t)
code = t[t.index('\n') + 1:].strip()
open(R + 'comun/snip22.txt', 'w').write(code)
print(len(css), len(css2), len(js), len(kit), len(pg), len(sn), len(pk), len(t), hashlib.sha256(code.encode()).hexdigest()[:16])
