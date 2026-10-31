import subprocess
def mini(args,inp):
    return subprocess.run(['npx','esbuild','--minify',*args],input=inp,capture_output=True,text=True,check=True).stdout.strip()
css=mini(['--loader=css'],open('sim.css').read()+open('page.css').read())
js=mini(['--loader=js','--target=es2017'],open('engine.js').read()+'\n'+open('ui.js').read())
assert 'SL6CSS' not in css and 'SL6JS' not in js
t=open('simuladores.tpl.php').read().replace('__SL6_CSS__',css).replace('__SL6_JS__',js)
open('sergiolearns-simuladores.php','w').write(t)
print(len(css),len(js),len(t))
