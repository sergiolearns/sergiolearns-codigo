"""Genera sergiolearns-bot.php (fragmento de Code Snippets) con el JS y el CSS minificados y las instrucciones fijas."""
import subprocess, hashlib
def es(args, inp):
    full = [] if '--minify-whitespace' in args else ['--minify']
    return subprocess.run(['npx', '--yes', 'esbuild@0.24.0', *args, *full], input=inp, capture_output=True, text=True, check=True).stdout.strip()
js = es(['--loader=js', '--target=es2017', '--minify-whitespace', '--minify-syntax'], open('bot.js').read())   # sin renombrar variables: los cambios futuros dan parches pequeños
css = es(['--loader=css'], open('bot.css').read())
sysm = open('instrucciones.md').read().strip()
for name, txt in (('SLBJS', js), ('SLBCSS', css), ('SLBSYS', sysm)):
    assert '\n' + name not in txt, name
p = open('bot.tpl.php').read().replace('@@CSS@@', css).replace('@@JS@@', js).replace('@@SISTEMA@@', sysm)
open('sergiolearns-bot.php', 'w').write(p)
code = p.split('\n', 1)[1]
open('sergiolearns-bot.txt', 'w').write(code)
print('sergiolearns-bot.php', len(p), 'JS', len(js), 'CSS', len(css), 'sha', hashlib.sha256(code.encode()).hexdigest()[:12])
