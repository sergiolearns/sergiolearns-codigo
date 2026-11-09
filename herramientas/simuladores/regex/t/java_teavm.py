# Ejecuta el arnés de Java con TeaVM + SlRegex en Chromium (mismo paquete que la web) y lo compara con el JDK
import asyncio, sys, json, subprocess, time, os
sys.path.insert(0, os.path.dirname(__file__)); from casos import CASOS; from java_ref import entrada
from playwright.async_api import async_playwright
SL=open(sys.argv[1]).read(); A=open(os.path.join(os.path.dirname(__file__),'..','Arnes.java')).read()
imp=[l for l in (SL+'\n'+A).split('\n') if l.startswith('import ')]
src='\n'.join(dict.fromkeys(imp))+'\n'+'\n'.join(l for l in SL.split('\n') if not l.startswith('import '))+'\n'+'\n'.join(l for l in A.split('\n') if not l.startswith('import '))
ref=[json.loads(l) for l in open(sys.argv[2])]
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server','8779','-d',sys.argv[3]],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
            pg=await b.new_page(); await pg.goto('http://localhost:8779/batch.html')
            res=await pg.evaluate('([s,i])=>batch(s,i)',[src,[entrada(*c) for c in CASOS]])
            bad=0
            for c,r,f in zip(CASOS,res,ref):
                try: got=json.loads(r['o'])
                except Exception: got={'raw':r['o'],'err':r['e']}
                if got!=f: bad+=1; print('DISTINTO',c[0],'\n  web',json.dumps(got,ensure_ascii=False)[:300],'\n  jdk',json.dumps(f,ensure_ascii=False)[:300])
            print(f'{len(CASOS)-bad}/{len(CASOS)} iguales al JDK; ms:',[r['ms'] for r in res])
            await b.close()
    finally: srv.kill()
asyncio.run(main())
