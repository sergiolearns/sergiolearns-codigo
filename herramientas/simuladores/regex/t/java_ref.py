# Ejecuta el arnés de Java con el JDK (referencia) para cada caso; imprime una línea JSON por caso
import base64, subprocess, os, sys, json
sys.path.insert(0, os.path.dirname(__file__)); from casos import CASOS
D='/tmp/arnes_jdk'; os.makedirs(D, exist_ok=True)
src=open(os.path.join(os.path.dirname(__file__),'..','Arnes.java')).read()
open(D+'/Main.java','w').write('import java.util.regex.*;\n'+src)
subprocess.run(['javac','Main.java'],cwd=D,check=True,stderr=subprocess.DEVNULL)
b=lambda s: base64.b64encode(s.encode()).decode()
def entrada(re_,fl,rep,txt,retos): return '\n'.join([b(re_),b(str(fl)),'-' if rep is None else b(rep),b(txt)]+[b(x) for x in retos])+'\n'
if __name__=='__main__':
    for c in CASOS:
        r=subprocess.run(['java','-Dstdout.encoding=UTF-8','-cp',D,'Main'],input=entrada(*c),capture_output=True,text=True,encoding='utf-8')
        print(r.stdout.strip())
