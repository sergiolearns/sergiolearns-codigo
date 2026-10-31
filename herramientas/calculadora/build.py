import subprocess, hashlib, sys
def es(args, inp):
    return subprocess.run(['npx','esbuild',*args,'--minify'],input=inp,capture_output=True,text=True,check=True).stdout.strip()
js=es(['--loader=js','--target=es2017'],open('engine.js').read()+'\n'+open('ui.js').read())
css=es(['--loader=css'],open('calc.css').read())
p=open('calculadora.tpl.php').read().replace('@@CSS@@',css).replace('@@JS@@',js)
open('sergiolearns-calculadora.php','w').write(p)
cj=es(['--loader=js','--target=es2017'],open('contacto.js').read()); cc=es(['--loader=css'],open('contacto.css').read())
q=open('contacto.tpl.php').read().replace('@@CSS@@',cc.replace("'","\\'")).replace('@@JS@@',cj.replace("\\","\\\\").replace("'","\\'"))
open('sergiolearns-contacto.php','w').write(q)
for f in ['sergiolearns-calculadora.php',]:
    s=open(f).read(); code=s.split('\n',1)[1] if s.startswith('<?php') else s
    open(f.replace('.php','.txt'),'w').write(code)
    print(f,len(s),hashlib.sha256(code.encode()).hexdigest()[:12])
