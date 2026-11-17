"""Pinta un simulador de ME1 en Chromium con la CSS de la web y saca capturas. Uso: python3 t/shot.py <sim> <lang> <tema> <ancho> <salida> [js antes de la captura]"""
import sys, os
from playwright.sync_api import sync_playwright
H=os.path.dirname(os.path.abspath(__file__))+'/..'; F='/home/claude/w/f'; FO='/home/claude/w/04-herramientas/pack-ic2/fonts'
sim,lang,tema,w,out=sys.argv[1:6]; pre=sys.argv[6] if len(sys.argv)>6 else ''
ui={'distrib':'ui-dist.js','tcl':'ui-tcl.js','ic':'ui-ic.js'}[sim]
fonts=''.join("@font-face{font-family:'%s';src:url(file://%s/%s);font-weight:%s}"%(n,FO,f,wt) for n,f,wt in [('Inter','inter-latin-400-normal.woff2',400),('Inter','inter-latin-500-normal.woff2',500),('Inter','inter-latin-600-normal.woff2',600),('Inter','inter-latin-600-normal.woff2',700),('Space Grotesk','space-grotesk-latin-500-normal.woff2',500),('Space Grotesk','space-grotesk-latin-600-normal.woff2',600),('Space Grotesk','space-grotesk-latin-600-normal.woff2',700),('JetBrains Mono','jetbrains-mono-latin-400-normal.woff2',400),('JetBrains Mono','jetbrains-mono-latin-500-normal.woff2',500),('JetBrains Mono','jetbrains-mono-latin-500-normal.woff2',600),('JetBrains Mono','jetbrains-mono-latin-500-normal.woff2',700)])
css=open(F+'/sl6css.css').read()+open(F+'/sl6css7.css').read()+open(H+'/me1.css').read()
js=''.join(open(H+'/'+p).read()+'\n' for p in ['../comun/kit2.js','engine.js','comun.js',ui])
html=f"""<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><style>{fonts}body{{margin:0;background:#FAFAF7;font-family:Inter,sans-serif;color:#1E1B2E}}.wrap{{max-width:1180px;margin:0 auto;padding:24px 20px}}{css}</style>
<script>try{{localStorage.setItem('sl_entorno_tema','{tema}')}}catch(e){{}}</script></head><body><div class=wrap><h1 style="font:700 34px Space Grotesk">Simulador</h1>
<div class="sl-sim" data-sim="{sim}" data-lang="{lang}" data-links='[{{"u":"#","t":"Tema 5. La normal","d":"La teoría","i":"book"}}]'></div></div><script>{js}</script></body></html>"""
open('/tmp/m1.html','w').write(html)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':int(w),'height':900},device_scale_factor=1)
    errs=[]; pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file:///tmp/m1.html'); pg.wait_for_timeout(900)
    if pre: pg.evaluate(pre); pg.wait_for_timeout(1300)
    pg.screenshot(path=out,full_page=True)
    print('errores:',errs)
    b.close()
